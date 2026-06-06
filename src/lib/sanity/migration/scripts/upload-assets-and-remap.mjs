import { createReadStream, existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationRoot = path.resolve(__dirname, '..');
const outDir = path.join(migrationRoot, 'migration-output');
const manifestPath = path.join(outDir, 'asset-manifest.json');
const importPath = path.join(outDir, 'sanity-import.ndjson');
const remappedImportPath = path.join(outDir, 'sanity-import.with-assets.ndjson');
const uploadResultsPath = path.join(outDir, 'asset-upload-results.json');

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token =
  process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-06-03';

if (!projectId) throw new Error('Missing SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_PROJECT_ID.');
if (!token) {
  throw new Error(
    'Missing write token. Set SANITY_AUTH_TOKEN, SANITY_API_WRITE_TOKEN, or SANITY_API_TOKEN.',
  );
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion,
  useCdn: false,
});

function readExistingResults() {
  if (!existsSync(uploadResultsPath)) return [];
  return JSON.parse(readFileSync(uploadResultsPath, 'utf8'));
}

function writeResults(results) {
  writeFileSync(uploadResultsPath, JSON.stringify(results, null, 2), 'utf8');
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function uploadWithRetry(asset, attempts = 4) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await client.assets.upload(asset.kind, createReadStream(asset.localPath), {
        filename: path.basename(asset.localPath),
        title: uploadTitle(asset.title, path.basename(asset.localPath)),
      });
    } catch (error) {
      lastError = error;
      const statusCode = error.statusCode || error.response?.statusCode;
      const canRetry = statusCode === 429 || statusCode >= 500;
      if (!canRetry || attempt === attempts) break;
      await wait(1000 * attempt * attempt);
    }
  }
  throw lastError;
}

function isMissingGeneratedAssetRef(value) {
  return typeof value === 'string' && /^(image|file)\./.test(value);
}

function replaceAssetRefs(value, assetIdMap) {
  if (Array.isArray(value)) {
    return value
      .map((item) => replaceAssetRefs(item, assetIdMap))
      .filter((item) => item !== undefined);
  }
  if (!value || typeof value !== 'object') return value;

  if (
    (value._type === 'image' || value._type === 'file') &&
    isMissingGeneratedAssetRef(value.asset?._ref)
  ) {
    return undefined;
  }

  const next = {};
  for (const [key, child] of Object.entries(value)) {
    if (key === '_ref' && typeof child === 'string' && assetIdMap[child]) {
      next[key] = assetIdMap[child];
    } else {
      const replaced = replaceAssetRefs(child, assetIdMap);
      if (replaced !== undefined) next[key] = replaced;
    }
  }
  return next;
}

function uploadTitle(title, fallback) {
  const value = title || fallback;
  return value.length > 300 ? `${value.slice(0, 297)}...` : value;
}

async function main() {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const results = readExistingResults();
  const resultsByAssetId = new Map(results.map((result) => [result.suggestedAssetId, result]));
  const assetIdMap = Object.fromEntries(
    results
      .filter((result) => result.status === 'uploaded' && result.sanityAssetId)
      .map((result) => [result.suggestedAssetId, result.sanityAssetId]),
  );

  for (const asset of manifest) {
    const existing = resultsByAssetId.get(asset.suggestedAssetId);
    if (existing?.status === 'uploaded') {
      continue;
    }

    if (!asset.exists || !existsSync(asset.localPath)) {
      const result = { ...asset, status: 'missing' };
      resultsByAssetId.set(asset.suggestedAssetId, result);
      writeResults([...resultsByAssetId.values()]);
      continue;
    }

    const uploaded = await uploadWithRetry(asset);

    assetIdMap[asset.suggestedAssetId] = uploaded._id;
    const result = {
      ...asset,
      status: 'uploaded',
      sanityAssetId: uploaded._id,
    };
    resultsByAssetId.set(asset.suggestedAssetId, result);
    writeResults([...resultsByAssetId.values()]);
    console.log(`Uploaded ${asset.kind}: ${asset.localPath}`);
  }

  const docs = readFileSync(importPath, 'utf8')
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => replaceAssetRefs(JSON.parse(line), assetIdMap));

  writeFileSync(remappedImportPath, `${docs.map((doc) => JSON.stringify(doc)).join('\n')}\n`, 'utf8');
  writeResults([...resultsByAssetId.values()]);

  const finalResults = [...resultsByAssetId.values()];
  const uploadedCount = finalResults.filter((result) => result.status === 'uploaded').length;
  const missingCount = finalResults.filter((result) => result.status === 'missing').length;
  console.log(`Uploaded ${uploadedCount} assets.`);
  console.log(`Missing ${missingCount} assets.`);
  console.log(`Wrote ${remappedImportPath}`);
}

main();
