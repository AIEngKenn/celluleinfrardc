import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../../../../');
const migrationRoot = path.resolve(__dirname, '..');
const outDir = path.join(migrationRoot, 'migration-output');
const defaultSourcePath = 'C:/Users/Surface/Downloads/actualites.json';
const sourcePath = path.resolve(process.argv.find((arg) => arg.endsWith('.json')) || defaultSourcePath);
const shouldExecute = process.argv.includes('--execute');
const shouldDeleteExisting = process.argv.includes('--delete-existing');
const shouldVerifyOnly = process.argv.includes('--verify-only');
const now = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = path.join(outDir, `news-backup-${now}.json`);
const previewPath = path.join(outDir, `actualites-preview-${now}.json`);
const resultsPath = path.join(outDir, `actualites-migration-results-${now}.json`);
const placeholderImagePath = path.join(repoRoot, 'public/images/placeholders/RDC-Drapeau-CUA.jpg');

loadEnv(path.join(repoRoot, '.env.local'));
mkdirSync(outDir, { recursive: true });

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token =
  process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-06-03';

if (!projectId) throw new Error('Missing SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_PROJECT_ID.');
if (!token) throw new Error('Missing Sanity write token.');
if (!existsSync(sourcePath)) throw new Error(`Source JSON not found: ${sourcePath}`);

const client = createClient({ projectId, dataset, token, apiVersion, useCdn: false });

const NEWS_CATEGORY = {
  _id: 'newsCategory.actualites',
  _type: 'newsCategory',
  nameFr: 'Actualités',
  nameEn: 'News',
  slug: { _type: 'slug', current: 'actualites' },
};

const MONTHS_FR = {
  janvier: '01',
  fevrier: '02',
  février: '02',
  mars: '03',
  avril: '04',
  mai: '05',
  juin: '06',
  juillet: '07',
  aout: '08',
  août: '08',
  septembre: '09',
  octobre: '10',
  novembre: '11',
  decembre: '12',
  décembre: '12',
};

function loadEnv(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (!process.env[key]) process.env[key] = rest.join('=');
  }
}

function normalizeWhitespace(value = '') {
  return decodeHtml(value).replace(/\s+/g, ' ').trim();
}

function decodeHtml(value = '') {
  const named = {
    nbsp: ' ',
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    rsquo: '’',
    lsquo: '‘',
    rdquo: '”',
    ldquo: '“',
    eacute: 'é',
    egrave: 'è',
    ecirc: 'ê',
    agrave: 'à',
    ccedil: 'ç',
    ugrave: 'ù',
    ocirc: 'ô',
    icirc: 'î',
  };

  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, entity) => named[entity.toLowerCase()] ?? match);
}

function slugify(value = '', maxLength = 96) {
  return normalizeWhitespace(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/g, '');
}

function hash(value = '') {
  return createHash('sha1').update(value).digest('hex').slice(0, 10);
}

function stableId(slug) {
  return `news.${slugify(slug, 84) || 'actualite'}-${hash(slug)}`;
}

function parseFrenchDate(value = '') {
  const normalized = normalizeWhitespace(value).toLowerCase();
  const match = normalized.match(
    /(?:(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\s+)?(\d{1,2})(?:er)?\s+([a-zéûôîàèê]+)\s+(\d{4})(?:\s+à\s+(\d{1,2}):(\d{2}))?/i,
  );
  if (!match) return new Date().toISOString();
  const [, day, monthName, year, hour = '00', minute = '00'] = match;
  const month = MONTHS_FR[monthName.normalize('NFC')] || '01';
  return `${year}-${month}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute}:00.000Z`;
}

function extractDescHtml(html = '') {
  const match = html.match(/<div[^>]*class=["'][^"']*\bdesc\b[^"']*["'][^>]*>([\s\S]*?)(?:<\/div>\s*<div[^>]*class=["'][^"']*(?:share|others)|<\/div>\s*<\/div>\s*<\/div>\s*<div[^>]*class=["'][^"']*col-lg-4|$)/i);
  return match?.[1] || html;
}

function stripWordNoise(html = '') {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<xml[\s\S]*?<\/xml>/gi, '')
    .replace(/<o:p>[\s\S]*?<\/o:p>/gi, ' ')
    .replace(/\s(?:class|style|lang|align|width|height)=["'][^"']*["']/gi, '')
    .replace(/\s(?:class|style|lang|align|width|height)=[^\s>]+/gi, '');
}

function textFromHtml(html = '') {
  return normalizeWhitespace(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s*\n\s*/g, '\n'),
  );
}

function inlineTextFromHtml(html = '') {
  return decodeHtml(html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
}

function isDuplicateTitle(text, title) {
  const clean = (value) =>
    normalizeWhitespace(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase();
  return clean(text) === clean(title);
}

function shouldDropText(text = '') {
  return (
    !text ||
    /^(accueil|voir plus|partager cet article|autres actualites|actualités|actualites)$/i.test(text) ||
    /^Cellule Infrastructures\s+-/i.test(text) ||
    /Style Definitions|mso-|Microsoft Word|Normal\s+0\s+\d+/i.test(text)
  );
}

function extractInlineSegments(html = '') {
  const markDefs = [];
  const children = [];
  const activeMarks = [];
  const tokens = html
    .replace(/<br\s*\/?>/gi, '\n')
    .split(/(<\/?(?:strong|b|em|i|a)\b[^>]*>|<\/(?:strong|b|em|i|a)>)/gi)
    .filter(Boolean);

  for (const token of tokens) {
    const lower = token.toLowerCase();
    if (/^<(strong|b)\b/i.test(token)) {
      activeMarks.push('strong');
      continue;
    }
    if (/^<\/(strong|b)>/i.test(token)) {
      removeLast(activeMarks, 'strong');
      continue;
    }
    if (/^<(em|i)\b/i.test(token)) {
      activeMarks.push('em');
      continue;
    }
    if (/^<\/(em|i)>/i.test(token)) {
      removeLast(activeMarks, 'em');
      continue;
    }
    if (/^<a\b/i.test(token)) {
      const href = token.match(/\shref=["']([^"']+)["']/i)?.[1];
      if (href) {
        const key = `link-${hash(href)}`;
        markDefs.push({ _key: key, _type: 'link', href: decodeHtml(href) });
        activeMarks.push(key);
      }
      continue;
    }
    if (lower === '</a>') {
      const linkMark = [...activeMarks].reverse().find((mark) => mark.startsWith('link-'));
      if (linkMark) removeLast(activeMarks, linkMark);
      continue;
    }

    const text = inlineTextFromHtml(token);
    if (!text.trim()) {
      const previous = children.at(-1);
      if (previous && !/\s$/.test(previous.text)) previous.text += ' ';
      continue;
    }
    children.push({
      _type: 'span',
      _key: `span-${hash(`${text}-${children.length}`)}`,
      text,
      marks: [...new Set(activeMarks)],
    });
  }

  if (children[0]) children[0].text = children[0].text.trimStart();
  if (children.at(-1)) children.at(-1).text = children.at(-1).text.trimEnd();

  const uniqueMarkDefs = [...new Map(markDefs.map((def) => [def._key, def])).values()];
  return { children, markDefs: uniqueMarkDefs };
}

function removeLast(values, target) {
  const index = values.lastIndexOf(target);
  if (index >= 0) values.splice(index, 1);
}

function toBlock(innerHtml, style = 'normal', listItem) {
  const { children, markDefs } = extractInlineSegments(innerHtml);
  const text = children.map((child) => child.text).join(' ');
  if (!text) return null;
  return {
    _type: 'block',
    _key: `block-${hash(`${style}-${listItem || ''}-${text}`)}`,
    style,
    markDefs,
    children,
    ...(listItem ? { listItem, level: 1 } : {}),
  };
}

function portableTextFromHtml(html, title) {
  const body = stripWordNoise(extractDescHtml(html));
  const blocks = [];
  const blockPattern = /<(h1|h2|h3|h4|p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;

  while ((match = blockPattern.exec(body))) {
    const [, tag, inner] = match;
    const text = textFromHtml(inner);
    if (shouldDropText(text)) continue;
    if (!blocks.length && isDuplicateTitle(text, title)) continue;
    const style = tag.startsWith('h') ? tag : 'normal';
    const block = toBlock(inner, style, tag === 'li' ? 'bullet' : undefined);
    if (block) blocks.push(block);
  }

  if (blocks.length) return blocks;

  const fallback = textFromHtml(body);
  return fallback && !shouldDropText(fallback) ? [toBlock(fallback, 'normal')].filter(Boolean) : [];
}

function excerptFromBlocks(blocks) {
  const text = blocks
    .map((block) => block.children?.map((child) => child.text).join(''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:!?])/g, '$1')
    .trim();
  return text.length > 197 ? `${text.slice(0, 197).trim()}...` : text;
}

function extractImageUrl(item) {
  const htmlImage = item.contentHtml?.match(/<img\b[^>]*(?:data-src|src)=["']([^"']+)["']/i)?.[1];
  return normalizeImageUrl(htmlImage || item.imageUrl);
}

function normalizeImageUrl(value = '') {
  if (!value) return '';
  return value.replace(/^https?:\/\/celluleinfra\.org\/\//i, 'https://celluleinfra.org/');
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function uploadImageWithRetry(item, attempts = 2) {
  const imageUrl = extractImageUrl(item);
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      if (!imageUrl) throw new Error('Missing source image URL');
      const response = await fetchWithTimeout(imageUrl);
      if (!response.ok) throw new Error(`Image fetch failed ${response.status}: ${imageUrl}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      return await client.assets.upload('image', buffer, {
        filename: `${slugify(item.slug || item.title, 80) || 'actualite'}.webp`,
        title: uploadTitle(item.title),
        contentType: response.headers.get('content-type') || 'image/webp',
      });
    } catch (error) {
      lastError = error;
      if (attempt === attempts) break;
      console.warn(`Image retry ${attempt}/${attempts} for ${item.slug || item.title}: ${error.message}`);
      await wait(1000 * attempt * attempt);
    }
  }

  if (!existsSync(placeholderImagePath)) throw lastError;
  console.warn(`Using local placeholder for ${item.slug || item.title}: ${lastError.message}`);
  const buffer = readFileSync(placeholderImagePath);
  return client.assets.upload('image', buffer, {
    filename: 'RDC-Drapeau-CUA.jpg',
    title: uploadTitle(`Placeholder - ${item.title}`),
    contentType: 'image/jpeg',
  });
}

function uploadTitle(value = '') {
  const title = normalizeWhitespace(value) || 'Actualité';
  return title.length > 180 ? `${title.slice(0, 177)}...` : title;
}

function transformItem(item, assetId) {
  const slug = slugify(item.slug || item.title);
  const contentFr = portableTextFromHtml(item.contentHtml || item.contentText || '', item.title);
  const excerpt = excerptFromBlocks(contentFr) || normalizeWhitespace(item.contentText).slice(0, 197);

  return {
    _id: stableId(slug),
    _type: 'news',
    titleFr: normalizeWhitespace(item.title),
    titleEn: normalizeWhitespace(item.title),
    slug: { _type: 'slug', current: slug },
    excerptFr: excerpt,
    excerptEn: excerpt,
    mainImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: assetId },
      alt: normalizeWhitespace(item.title),
    },
    contentFr,
    contentEn: contentFr,
    category: { _type: 'reference', _ref: NEWS_CATEGORY._id },
    tags: ['migration', 'actualites'],
    author: 'Cellule Infrastructures',
    featured: false,
    publishedAt: parseFrenchDate(item.publishedAt),
    sourceUrl: item.articleUrl,
  };
}

function validateDocs(docs) {
  const seenSlugs = new Set();
  const errors = [];
  for (const doc of docs) {
    if (!doc.titleFr) errors.push(`${doc._id}: missing titleFr`);
    if (!doc.slug?.current) errors.push(`${doc._id}: missing slug`);
    if (seenSlugs.has(doc.slug.current)) errors.push(`${doc._id}: duplicate slug ${doc.slug.current}`);
    seenSlugs.add(doc.slug.current);
    if (!doc.excerptFr || doc.excerptFr.length > 200) errors.push(`${doc._id}: invalid excerpt`);
    if (!doc.contentFr?.length) errors.push(`${doc._id}: missing contentFr`);
    if (!doc.mainImage?.asset?._ref) errors.push(`${doc._id}: missing mainImage`);
  }
  if (errors.length) throw new Error(`Validation failed:\n${errors.join('\n')}`);
}

async function backupExistingNews() {
  const existing = await client.fetch('*[_type == "news"]');
  writeFileSync(backupPath, JSON.stringify(existing, null, 2), 'utf8');
  return existing;
}

async function commitDocs(docs, existingNews) {
  let transaction = client.transaction().createIfNotExists(NEWS_CATEGORY);
  if (shouldDeleteExisting) {
    for (const doc of existingNews) transaction = transaction.delete(doc._id);
  }
  for (const doc of docs) transaction = transaction.createOrReplace(doc);
  await transaction.commit({ visibility: 'sync' });
}

async function main() {
  if (shouldVerifyOnly) {
    const summary = await client.fetch(`{
      "newsCount": count(*[_type == "news"]),
      "withImages": count(*[_type == "news" && defined(mainImage.asset->_id)]),
      "withContent": count(*[_type == "news" && count(contentFr) > 0]),
      "latest": *[_type == "news"] | order(publishedAt desc)[0] {
        titleFr,
        "slug": slug.current,
        publishedAt,
        "imageUrl": mainImage.asset->url,
        "blocks": count(contentFr)
      }
    }`);
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  const source = JSON.parse(readFileSync(sourcePath, 'utf8'));
  if (!Array.isArray(source)) throw new Error('Source JSON must be an array.');

  console.log(`Loaded ${source.length} actualites from ${sourcePath}`);
  console.log(`Mode: ${shouldExecute ? 'EXECUTE' : 'DRY RUN'}${shouldDeleteExisting ? ' + delete existing news' : ''}`);

  const existingNews = await backupExistingNews();
  console.log(`Backed up ${existingNews.length} existing news docs to ${backupPath}`);

  const docs = [];
  const assetResults = [];
  for (const [index, item] of source.entries()) {
    const uploaded = shouldExecute
      ? await uploadImageWithRetry(item)
      : { _id: `dry-run-image-${index + 1}` };
    const doc = transformItem(item, uploaded._id);
    docs.push(doc);
    assetResults.push({
      title: item.title,
      imageUrl: extractImageUrl(item),
      sanityAssetId: uploaded._id,
    });
    console.log(`${index + 1}/${source.length} prepared: ${doc.slug.current}`);
  }

  validateDocs(docs);
  writeFileSync(previewPath, JSON.stringify(docs, null, 2), 'utf8');

  if (shouldExecute) {
    await commitDocs(docs, existingNews);
    console.log(`Committed ${docs.length} news docs to Sanity.`);
  } else {
    console.log('Dry run complete. Re-run with --execute --delete-existing to import.');
  }

  writeFileSync(
    resultsPath,
    JSON.stringify(
      {
        sourcePath,
        backupPath,
        previewPath,
        executed: shouldExecute,
        deletedExistingNews: shouldDeleteExisting,
        importedCount: shouldExecute ? docs.length : 0,
        preparedCount: docs.length,
        assetResults,
      },
      null,
      2,
    ),
    'utf8',
  );
  console.log(`Wrote results to ${resultsPath}`);
}

main().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
