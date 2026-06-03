# Content Migration System for Cellule Infrastructures

This directory contains scripts to migrate content from the existing website (https://www.celluleinfra.org) to the new Sanity CMS.

## Overview

The migration system:

- Crawls all public pages
- Downloads all PDFs and images
- Preserves metadata (dates, categories, relationships)
- Generates Sanity-compatible import files
- Automatically imports content

## Prerequisites

```bash
npm install
```

## Migration Process

### 1. Crawl Existing Website

```bash
npm run migrate:crawl
```

This will:

- Scan all pages on celluleinfra.org
- Extract content, metadata, and structure
- Download all media files (images, PDFs)
- Save data to `./migration-data/crawled/`

### 2. Transform Data

```bash
npm run migrate:transform
```

This will:

- Convert crawled data to Sanity schema format
- Map old URLs to new URL structure
- Organize content by type (projects, news, etc.)
- Create relationships between content
- Save transformed data to `./migration-data/transformed/`

### 3. Import to Sanity

```bash
npm run migrate:import
```

This will:

- Upload all media to Sanity
- Create all content documents
- Establish relationships
- Verify import success

### Full Migration (All Steps)

```bash
npm run migrate:full
```

## Configuration

Edit `migration.config.ts` to configure:

```typescript
{
  sourceUrl: 'https://www.celluleinfra.org',
  sanityProjectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  sanityToken: process.env.SANITY_API_WRITE_TOKEN,
  downloadDir: './migration-data',
  preserveUrls: true,
  batchSize: 50,
}
```

## Free Tools Used

- **Puppeteer**: Headless browser for crawling (free, open-source)
- **Cheerio**: HTML parsing (free, open-source)
- **Axios**: HTTP requests (free, open-source)
- **Sanity CLI**: Content import (free)

No paid services required.

## Output Structure

```
migration-data/
├── crawled/
│   ├── pages.json
│   ├── projects.json
│   ├── news.json
│   ├── pdfs/
│   └── images/
├── transformed/
│   ├── projects.ndjson
│   ├── news.ndjson
│   ├── procurement.ndjson
│   └── publications.ndjson
└── logs/
    └── migration-{timestamp}.log
```

## URL Mapping

Old URLs are mapped to new structure:

```
Old: /projets/detail/123
New: /fr/projets/project-slug

Old: /actualites/article/456
New: /fr/actualites/news-slug

Old: /documents/rapport-2023.pdf
New: /fr/publications/rapport-2023
```

Mapping file saved to: `migration-data/url-mapping.json`

## Rerunning Migration

The system is idempotent - you can rerun migrations safely:

```bash
npm run migrate:full -- --force
```

## Troubleshooting

### Issue: Rate limiting from source website

**Solution**: Adjust crawl delay in config:

```typescript
crawlDelay: 2000, // ms between requests
```

### Issue: Large PDF downloads timeout

**Solution**: Increase timeout:

```typescript
downloadTimeout: 60000, // 60 seconds
```

### Issue: Sanity import fails

**Solution**: Check API token permissions:

- Ensure `SANITY_API_WRITE_TOKEN` has write access
- Verify dataset name is correct

## Manual Review

After migration, manually review:

1. Content accuracy
2. Image quality
3. PDF accessibility
4. Relationships between content
5. URL redirects

## Support

For migration issues, check logs in `migration-data/logs/`
