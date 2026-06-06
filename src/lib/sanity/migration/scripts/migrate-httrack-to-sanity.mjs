import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeHTML } from 'entities';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, '..');
const siteRoot = path.resolve(process.argv[2] || path.join(workspaceRoot, 'www.celluleinfra.org'));
const outDir = path.join(workspaceRoot, 'migration-output');

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

const PROCUREMENT_CATEGORIES = [
  ['recrutement', 'recruitment'],
  ['consultant', 'consultancy'],
  ['consultance', 'consultancy'],
  ['travaux', 'works'],
  ['fourniture', 'supplies'],
  ['materiel', 'supplies'],
  ['matériel', 'supplies'],
  ['service', 'services'],
];

const PUBLICATION_TYPES = [
  ['bulletin', 'newsletter'],
  ['magazine', 'newsletter'],
  ['rapport', 'technical-report'],
  ['audit', 'annual-report'],
  ['etude', 'feasibility-study'],
  ['étude', 'feasibility-study'],
  ['environnement', 'environmental-study'],
  ['social', 'environmental-study'],
  ['plan', 'technical-report'],
  ['decret', 'law-decree'],
  ['décret', 'law-decree'],
  ['guide', 'guide'],
  ['prospectus', 'brochure'],
  ['depliant', 'brochure'],
  ['dépliant', 'brochure'],
];

const PROVINCES = [
  ['kinshasa', 'Kinshasa', 'Kinshasa'],
  ['kasai oriental', 'Kasaï-Oriental', 'Kasai Oriental'],
  ['kasaï oriental', 'Kasaï-Oriental', 'Kasai Oriental'],
  ['kasai', 'Kasaï', 'Kasai'],
  ['kasaï', 'Kasaï', 'Kasai'],
  ['lomami', 'Lomami', 'Lomami'],
  ['nord kivu', 'Nord-Kivu', 'North Kivu'],
  ['nord-kivu', 'Nord-Kivu', 'North Kivu'],
  ['sud kivu', 'Sud-Kivu', 'South Kivu'],
  ['sud-kivu', 'Sud-Kivu', 'South Kivu'],
  ['kongo central', 'Kongo Central', 'Kongo Central'],
  ['kwango', 'Kwango', 'Kwango'],
  ['kwilu', 'Kwilu', 'Kwilu'],
  ['tshopo', 'Tshopo', 'Tshopo'],
  ['equateur', 'Équateur', 'Equateur'],
  ['équateur', 'Équateur', 'Equateur'],
];

const NEWS_CATEGORY = {
  _id: 'newsCategory.actualites',
  _type: 'newsCategory',
  nameFr: 'Actualités',
  nameEn: 'News',
  slug: { _type: 'slug', current: 'actualites' },
};

const DEFAULT_PROVINCE = {
  _id: 'province.rdc',
  _type: 'province',
  nameFr: 'République Démocratique du Congo',
  nameEn: 'Democratic Republic of Congo',
  slug: { _type: 'slug', current: 'rdc' },
};

function walk(dir, predicate = () => true, files = []) {
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, predicate, files);
    } else if (predicate(fullPath)) {
      files.push(fullPath);
    }
  }
  return files.sort();
}

function readHtml(filePath) {
  return readFileSync(filePath, 'utf8');
}

function decodeHtml(value = '') {
  return decodeHTML(
    value
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, ''),
  );
}

function textFromHtml(html = '') {
  return normalizeWhitespace(decodeHtml(html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' ')));
}

function normalizeWhitespace(value = '') {
  return value.replace(/\s+/g, ' ').trim();
}

function slugFromPath(filePath) {
  return path.basename(filePath).replace(/\.html?$/i, '');
}

function slugify(value = '', maxLength = 180) {
  return decodeHtml(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength);
}

function stableId(type, slug) {
  const suffix = hashKey(slug).slice(1);
  return `${type}.${slugify(slug, 96) || 'untitled'}-${suffix}`;
}

function pickFirst(patterns, html) {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return textFromHtml(match[1]);
  }
  return '';
}

function extractTitle(html, fallback) {
  const breadcrumbTitle = pickFirst([/<li[^>]*class="[^"]*breadcrumb-item[^"]*"[^>]*>(?![\s\S]*?<a\b)([\s\S]*?)<\/li>/gi], html);
  const heading = pickFirst([/<h1[^>]*>([\s\S]*?)<\/h1>/i, /<h2[^>]*>([\s\S]*?)<\/h2>/i, /<h3[^>]*>\s*<a[^>]*>([\s\S]*?)<\/a>\s*<\/h3>/i], html);
  const pageTitle = pickFirst([/<title[^>]*>([\s\S]*?)<\/title>/i], html).replace(/^Cellule Infrastructures\s*-\s*/i, '');
  return normalizeWhitespace(heading || breadcrumbTitle || pageTitle || fallback.replace(/[-_]/g, ' '));
}

function extractMainContentHtml(html) {
  const candidates = [
    /<div class="desc[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div class="share-c/i,
    /<div class="desc[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<div class="col-lg-4/i,
    /<div class="col-lg-8 col-md-12">([\s\S]*?)<div class="col-lg-4 col-md-12">/i,
    /<div class="article[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div class="col-lg-4/i,
    /<div class="content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  ];
  for (const pattern of candidates) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1];
  }
  return html;
}

function canonicalText(value = '') {
  return normalizeWhitespace(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
}

function portableTextFromHtml(html, title = '') {
  const content = extractMainContentHtml(html)
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<xml[\s\S]*?<\/xml>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<div[^>]*class="[^"]*share-c[^"]*"[\s\S]*$/i, '')
    .replace(/<div[^>]*class="[^"]*others-article[^"]*"[\s\S]*$/i, '');
  const chunks = [];
  const blockPattern = /<(p|h1|h2|h3|h4|li)[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  const titleKey = canonicalText(title);
  while ((match = blockPattern.exec(content))) {
    const text = textFromHtml(match[2]);
    if (!text || shouldDropText(text)) continue;
    if (!chunks.length && titleKey && canonicalText(text) === titleKey) continue;
    const style = match[1].startsWith('h') ? match[1] : 'normal';
    chunks.push(toBlock(text, style));
  }
  if (chunks.length) return chunks;
  const fallback = textFromHtml(content);
  return fallback && !shouldDropText(fallback) ? [toBlock(fallback.slice(0, 5000))] : [];
}

function shouldDropText(text) {
  return (
    /^(accueil|voir plus|telecharger|télécharger|visualiser le pdf|autres actualites|actualites|partager cet article)$/i.test(
      text,
    ) ||
    /^Cellule Infrastructures\s+-/i.test(text) ||
    /MINISTERE DES INFRASTRUCTURES ET TRAVAUX PUBLICS/i.test(text) ||
    /^Normal\s+0\s+\d+/i.test(text) ||
    /Style Definitions|mso-|ValidateAgainstSchemas|Microsoft Word/i.test(text)
  );
}

function toBlock(text, style = 'normal') {
  return {
    _type: 'block',
    _key: hashKey(text),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: hashKey(`${text}:span`), text, marks: [] }],
  };
}

function hashKey(value) {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) hash = (hash * 33) ^ value.charCodeAt(index);
  return `k${(hash >>> 0).toString(36)}`;
}

function excerptFromBlocks(blocks) {
  return blocks
    .map((block) => block.children?.map((child) => child.text).join(' '))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
}

function parseFrenchDate(raw) {
  const value = decodeHtml(raw || '').toLowerCase().replace(/à.*/, '').trim();
  const match = value.match(/(?:(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\s+)?(\d{1,2})(?:er)?\s+([a-zéûûôîàèê]+)\s+(\d{4})/i);
  if (!match) return null;
  const [, day, monthName, year] = match;
  const month = MONTHS_FR[monthName.normalize('NFC')];
  if (!month) return null;
  return `${year}-${month}-${day.padStart(2, '0')}`;
}

function toDateTime(date) {
  return `${date}T00:00:00.000Z`;
}

function extractDate(label, html) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`${escaped}</span>\\s*:\\s*([^<]+)`, 'i'),
    new RegExp(`${escaped}\\s*:?\\s*([^<|]+)`, 'i'),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    const parsed = parseFrenchDate(match?.[1]);
    if (parsed) return parsed;
  }
  return null;
}

function extractFirstDate(html) {
  const candidates = [
    ...[...html.matchAll(/<small[^>]*>([\s\S]*?)<\/small>/gi)].map((match) => textFromHtml(match[1])),
    ...[...html.matchAll(/(?:Date de publication|Date de parution)[\s\S]{0,160}?(\d{1,2}(?:er)?\s+[a-zéûôîàèê]+\s+\d{4})/gi)].map(
      (match) => match[1],
    ),
  ];

  for (const candidate of candidates) {
    const parsed = parseFrenchDate(candidate);
    if (parsed) return parsed;
  }
  return null;
}

function fileStatsFor(relativePath) {
  const resolved = path.resolve(siteRoot, relativePath.replace(/^(\.\.\/)+/, ''));
  if (!resolved.startsWith(siteRoot) || !existsSync(resolved)) return null;
  const stat = statSync(resolved);
  return { resolved, size: stat.size };
}

function collectAsset(assetManifest, ownerId, role, rawUrl, title) {
  if (!rawUrl) return null;
  const normalized = rawUrl.replace(/\\/g, '/').replace(/^https?:\/\/celluleinfra\.org\/+/, '');
  const relative = normalized.replace(/^(\.\.\/)+/, '');
  const stats = fileStatsFor(relative);
  const ext = path.extname(relative).slice(1).toLowerCase();
  const kind = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext) ? 'image' : 'file';
  const assetId = `${kind}.${slugify(`${role}-${relative}`)}`;
  assetManifest.push({
    ownerId,
    role,
    kind,
    title,
    sourceUrl: rawUrl,
    localPath: stats?.resolved || path.join(siteRoot, relative),
    exists: Boolean(stats),
    size: stats?.size ?? null,
    suggestedAssetId: assetId,
  });
  return {
    _type: kind,
    asset: { _type: 'reference', _ref: assetId },
    ...(kind === 'image' ? { alt: title } : {}),
  };
}

function extractPdfUrl(html) {
  return html.match(/id="pdfViewerUrl"[^>]*data-url="([^"]+)"/i)?.[1] || '';
}

function extractImages(html) {
  const images = [];
  const pattern = /<img\b([^>]*)>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const attrs = match[1];
    const src =
      attrs.match(/\bdata-src="([^"]+)"/i)?.[1] ||
      attrs.match(/\bdata-original="([^"]+)"/i)?.[1] ||
      attrs.match(/\bsrc="([^"]+)"/i)?.[1];
    if (!src) continue;
    if (/pdf\.jpg|favicon|logo|assets\/images|storage\/settings/i.test(src)) continue;
    images.push(src);
  }
  return [...new Set(images)];
}

function inferProcurementCategory(title) {
  const lower = title.toLowerCase();
  return PROCUREMENT_CATEGORIES.find(([needle]) => lower.includes(needle))?.[1] || 'services';
}

function inferPublicationType(title) {
  const lower = title.toLowerCase();
  return PUBLICATION_TYPES.find(([needle]) => lower.includes(needle))?.[1] || 'other';
}

function inferSector(titleAndBody) {
  const lower = titleAndBody.toLowerCase();
  if (/pont|bridge/.test(lower)) return 'bridges';
  if (/eau|water|inondation|erosion|érosion/.test(lower)) return 'water';
  if (/electric|élect|eclairage|éclairage/.test(lower)) return 'electricity';
  if (/port/.test(lower)) return 'ports';
  if (/rail/.test(lower)) return 'railways';
  if (/numerique|numérique|telecom|télécom/.test(lower)) return 'telecommunications';
  if (/route|routier|rn\d|voirie|avenue/.test(lower)) return 'roads';
  return 'other';
}

function inferProvinceDoc(titleAndBody) {
  const lower = titleAndBody.toLowerCase();
  const found = PROVINCES.find(([needle]) => lower.includes(needle));
  if (!found) return DEFAULT_PROVINCE;
  const [, nameFr, nameEn] = found;
  return {
    _id: `province.${slugify(nameFr)}`,
    _type: 'province',
    nameFr,
    nameEn,
    slug: { _type: 'slug', current: slugify(nameFr) },
  };
}

function inferProcurementStatus(closingDate) {
  if (!closingDate) return 'closed';
  return new Date(closingDate) >= new Date() ? 'open' : 'closed';
}

function extractNews(assetManifest) {
  return walk(path.join(siteRoot, 'articles'), (file) => file.endsWith('.html')).map((file) => {
    const html = readHtml(file);
    const slug = slugFromPath(file);
    const title = extractTitle(html, slug);
    const blocks = portableTextFromHtml(html, title);
    const publishedAt = toDateTime(
      extractFirstDate(html) ||
        extractDate('Date de publication', html) ||
        extractDate('Date de parution', html) ||
        '2022-01-01',
    );
    const id = stableId('news', slug);
    const mainImageUrl = extractImages(html)[0];
    return {
      _id: id,
      _type: 'news',
      slug: { _type: 'slug', current: slug },
      titleFr: title,
      titleEn: title,
      excerptFr: excerptFromBlocks(blocks),
      excerptEn: excerptFromBlocks(blocks),
      contentFr: blocks,
      contentEn: blocks,
      publishedAt,
      category: { _type: 'reference', _ref: NEWS_CATEGORY._id },
      featured: false,
      ...(mainImageUrl ? { mainImage: collectAsset(assetManifest, id, 'mainImage', mainImageUrl, title) } : {}),
    };
  });
}

function extractProjects(assetManifest, provinceDocs) {
  const statusDirs = [
    ['en-preparation', 'preparation'],
    ['en-cours-d-execution', 'ongoing'],
    ['clotures', 'completed'],
  ];
  const projects = [];
  for (const [dirName, status] of statusDirs) {
    const dir = path.join(siteRoot, 'projets', dirName);
    for (const file of walk(dir, (candidate) => candidate.endsWith('.html'))) {
      const html = readHtml(file);
      const slug = slugFromPath(file);
      const title = extractTitle(html, slug);
      const blocks = portableTextFromHtml(html, title);
      const description = excerptFromBlocks(blocks);
      const fullText = `${title} ${description}`;
      const province = inferProvinceDoc(fullText);
      provinceDocs.set(province._id, province);
      const id = stableId('project', slug);
      const images = extractImages(html);
      projects.push({
        _id: id,
        _type: 'project',
        slug: { _type: 'slug', current: slug },
        titleFr: title,
        titleEn: title,
        descriptionFr: description || title,
        descriptionEn: description || title,
        province: { _type: 'reference', _ref: province._id },
        status,
        sector: inferSector(fullText),
        budget: 0,
        progress: status === 'completed' ? 100 : 0,
        featured: false,
        ...(images[0] ? { mainImage: collectAsset(assetManifest, id, 'mainImage', images[0], title) } : {}),
        ...(images.length > 1 ? { gallery: images.slice(1).map((src) => collectAsset(assetManifest, id, 'gallery', src, title)) } : {}),
      });
    }
  }
  return projects;
}

function extractProcurement(assetManifest) {
  return walk(path.join(siteRoot, 'offres'), (file) => file.endsWith('.html') || !path.extname(file)).map((file) => {
    const html = readHtml(file);
    const slug = slugFromPath(file);
    const title = extractTitle(html, slug);
    const blocks = portableTextFromHtml(html, title);
    const openingDate =
      extractDate('Date de parution', html) || extractDate('Date de publication', html) || extractFirstDate(html) || '2022-01-01';
    const closingDate = extractDate('Date de cloture', html) || openingDate;
    const id = stableId('procurement', slug);
    const pdfUrl = extractPdfUrl(html);
    return {
      _id: id,
      _type: 'procurement',
      slug: { _type: 'slug', current: slug },
      reference: html.match(/offre_id="([^"]+)"/i)?.[1] || slug,
      titleFr: title,
      titleEn: title,
      descriptionFr: excerptFromBlocks(blocks) || title,
      descriptionEn: excerptFromBlocks(blocks) || title,
      category: inferProcurementCategory(title),
      openingDate: toDateTime(openingDate),
      closingDate: toDateTime(closingDate),
      status: inferProcurementStatus(closingDate),
      ...(pdfUrl
        ? {
            attachments: [
              {
                _key: hashKey(pdfUrl),
                titleFr: title,
                titleEn: title,
                file: collectAsset(assetManifest, id, 'attachment', pdfUrl, title),
              },
            ],
          }
        : {}),
    };
  });
}

function extractPublications(assetManifest) {
  return walk(path.join(siteRoot, 'publication'), (file) => file.endsWith('.html')).map((file) => {
    const html = readHtml(file);
    const slug = slugFromPath(file);
    const title = extractTitle(html, slug);
    const blocks = portableTextFromHtml(html, title);
    const publishedAt = extractDate('Date de publication', html) || extractFirstDate(html) || '2022-01-01';
    const id = stableId('publication', slug);
    const pdfUrl = extractPdfUrl(html);
    return {
      _id: id,
      _type: 'publication',
      slug: { _type: 'slug', current: slug },
      titleFr: title,
      titleEn: title,
      descriptionFr: excerptFromBlocks(blocks) || title,
      descriptionEn: excerptFromBlocks(blocks) || title,
      publicationType: inferPublicationType(title),
      publishedAt,
      pdfFile: collectAsset(assetManifest, id, 'pdfFile', pdfUrl, title) || {
        _type: 'file',
        asset: { _type: 'reference', _ref: 'file.missing' },
      },
    };
  });
}

function writeJsonLines(fileName, docs) {
  writeFileSync(path.join(outDir, fileName), `${docs.map((doc) => JSON.stringify(doc)).join('\n')}\n`, 'utf8');
}

function main() {
  if (!existsSync(siteRoot)) {
    throw new Error(`Could not find HTTrack site folder: ${siteRoot}`);
  }
  mkdirSync(outDir, { recursive: true });

  const assetManifest = [];
  const provinceDocs = new Map([[DEFAULT_PROVINCE._id, DEFAULT_PROVINCE]]);
  const docs = [
    NEWS_CATEGORY,
    ...extractNews(assetManifest),
    ...extractProjects(assetManifest, provinceDocs),
    ...extractProcurement(assetManifest),
    ...extractPublications(assetManifest),
  ];
  docs.splice(1, 0, ...provinceDocs.values());

  writeJsonLines('sanity-import.ndjson', docs);
  writeFileSync(path.join(outDir, 'asset-manifest.json'), JSON.stringify(assetManifest, null, 2), 'utf8');
  writeFileSync(
    path.join(outDir, 'migration-summary.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        documents: docs.reduce((acc, doc) => ({ ...acc, [doc._type]: (acc[doc._type] || 0) + 1 }), {}),
        assets: {
          total: assetManifest.length,
          existing: assetManifest.filter((asset) => asset.exists).length,
          missing: assetManifest.filter((asset) => !asset.exists).length,
        },
        notes: [
          'French source content is copied into English fields as a placeholder for translation.',
          'PDFs and images are emitted as deterministic Sanity asset references; upload assets before importing or remap these references after upload.',
          'Budgets, project progress, and geolocation are set to conservative defaults because the old HTML does not expose structured values consistently.',
        ],
      },
      null,
      2,
    ),
    'utf8',
  );

  console.log(`Wrote ${docs.length} documents to ${path.join(outDir, 'sanity-import.ndjson')}`);
  console.log(`Wrote ${assetManifest.length} asset references to ${path.join(outDir, 'asset-manifest.json')}`);
}

main();
