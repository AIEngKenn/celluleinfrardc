import axios from "axios";
import * as cheerio from "cheerio";
import * as fs from "fs/promises";
import * as path from "path";
import { migrationConfig } from "./config";

interface CrawledPage {
  url: string;
  title: string;
  content: string;
  type: "project" | "news" | "procurement" | "publication" | "other";
  metadata: Record<string, any>;
  images: string[];
  pdfs: string[];
  links: string[];
}

export class WebCrawler {
  private visitedUrls: Set<string> = new Set();
  private crawledPages: CrawledPage[] = [];
  private downloadedMedia: Set<string> = new Set();

  constructor(private baseUrl: string) {}

  async crawl(startUrl: string = this.baseUrl): Promise<CrawledPage[]> {
    console.log(`Starting crawl from: ${startUrl}`);
    await this.crawlPage(startUrl);
    await this.saveResults();
    return this.crawledPages;
  }

  private async crawlPage(url: string): Promise<void> {
    if (this.visitedUrls.has(url)) return;

    console.log(`Crawling: ${url}`);
    this.visitedUrls.add(url);

    try {
      // Delay between requests
      await this.delay(migrationConfig.crawlDelay);

      const response = await axios.get(url, {
        headers: {
          "User-Agent": migrationConfig.userAgent,
        },
        timeout: migrationConfig.downloadTimeout,
      });

      const $ = cheerio.load(response.data);

      const page: CrawledPage = {
        url,
        title: $("title").text().trim() || $("h1").first().text().trim(),
        content: this.extractContent($),
        type: this.detectPageType(url, $),
        metadata: this.extractMetadata($),
        images: this.extractImages($),
        pdfs: this.extractPDFs($),
        links: this.extractLinks($),
      };

      this.crawledPages.push(page);

      // Download media
      await this.downloadMedia(page.images, "images");
      await this.downloadMedia(page.pdfs, "pdfs");

      // Crawl internal links
      for (const link of page.links) {
        if (this.isInternalLink(link) && !this.visitedUrls.has(link)) {
          await this.crawlPage(link);
        }
      }
    } catch (error) {
      console.error(`Error crawling ${url}:`, error);
    }
  }

  private extractContent($: cheerio.CheerioAPI): string {
    // Remove script and style tags
    $("script, style, nav, footer, header").remove();

    // Get main content
    const mainContent = $("main, article, .content, .main-content").first();
    return mainContent.length > 0
      ? mainContent.text().trim()
      : $("body").text().trim();
  }

  private detectPageType(
    url: string,
    $: cheerio.CheerioAPI,
  ): CrawledPage["type"] {
    const urlLower = url.toLowerCase();

    if (urlLower.includes("/projet")) return "project";
    if (urlLower.includes("/actualit") || urlLower.includes("/news"))
      return "news";
    if (urlLower.includes("/appel") || urlLower.includes("/offre"))
      return "procurement";
    if (urlLower.includes("/publication") || urlLower.includes("/document"))
      return "publication";

    return "other";
  }

  private extractMetadata($: cheerio.CheerioAPI): Record<string, any> {
    const metadata: Record<string, any> = {};

    // Open Graph metadata
    $('meta[property^="og:"]').each((_, el) => {
      const property = $(el).attr("property")?.replace("og:", "");
      const content = $(el).attr("content");
      if (property && content) {
        metadata[property] = content;
      }
    });

    // Standard meta tags
    $("meta[name]").each((_, el) => {
      const name = $(el).attr("name");
      const content = $(el).attr("content");
      if (name && content) {
        metadata[name] = content;
      }
    });

    // Extract dates
    const dateElements = $("time, .date, .published-date");
    if (dateElements.length > 0) {
      metadata.publishedDate =
        dateElements.first().attr("datetime") ||
        dateElements.first().text().trim();
    }

    return metadata;
  }

  private extractImages($: cheerio.CheerioAPI): string[] {
    const images: string[] = [];

    $("img").each((_, el) => {
      const src = $(el).attr("src");
      if (src) {
        images.push(this.normalizeUrl(src));
      }
    });

    return [...new Set(images)]; // Remove duplicates
  }

  private extractPDFs($: cheerio.CheerioAPI): string[] {
    const pdfs: string[] = [];

    $('a[href$=".pdf"], a[href*=".pdf?"]').each((_, el) => {
      const href = $(el).attr("href");
      if (href) {
        pdfs.push(this.normalizeUrl(href));
      }
    });

    return [...new Set(pdfs)];
  }

  private extractLinks($: cheerio.CheerioAPI): string[] {
    const links: string[] = [];

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (href) {
        links.push(this.normalizeUrl(href));
      }
    });

    return [...new Set(links)];
  }

  private normalizeUrl(url: string): string {
    if (url.startsWith("http")) return url;
    if (url.startsWith("//")) return `https:${url}`;
    if (url.startsWith("/")) return `${this.baseUrl}${url}`;
    return `${this.baseUrl}/${url}`;
  }

  private isInternalLink(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const baseUrlObj = new URL(this.baseUrl);
      return urlObj.hostname === baseUrlObj.hostname;
    } catch {
      return false;
    }
  }

  private async downloadMedia(
    urls: string[],
    type: "images" | "pdfs",
  ): Promise<void> {
    const downloadDir = path.join(migrationConfig.downloadDir, "crawled", type);
    await fs.mkdir(downloadDir, { recursive: true });

    for (const url of urls) {
      if (this.downloadedMedia.has(url)) continue;

      try {
        console.log(`Downloading ${type}: ${url}`);
        const response = await axios.get(url, {
          responseType: "arraybuffer",
          timeout: migrationConfig.downloadTimeout,
        });

        const filename = path.basename(new URL(url).pathname);
        const filepath = path.join(downloadDir, filename);

        await fs.writeFile(filepath, response.data);
        this.downloadedMedia.add(url);

        // Delay between downloads
        await this.delay(500);
      } catch (error) {
        console.error(`Error downloading ${url}:`, error);
      }
    }
  }

  private async saveResults(): Promise<void> {
    const outputDir = path.join(migrationConfig.downloadDir, "crawled");
    await fs.mkdir(outputDir, { recursive: true });

    // Save all pages
    await fs.writeFile(
      path.join(outputDir, "pages.json"),
      JSON.stringify(this.crawledPages, null, 2),
    );

    // Save by type
    const byType: Record<string, CrawledPage[]> = {};
    for (const page of this.crawledPages) {
      if (!byType[page.type]) byType[page.type] = [];
      byType[page.type].push(page);
    }

    for (const [type, pages] of Object.entries(byType)) {
      await fs.writeFile(
        path.join(outputDir, `${type}.json`),
        JSON.stringify(pages, null, 2),
      );
    }

    console.log(`\nCrawl complete!`);
    console.log(`Total pages: ${this.crawledPages.length}`);
    console.log(
      `By type:`,
      Object.entries(byType)
        .map(([k, v]) => `${k}: ${v.length}`)
        .join(", "),
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// CLI execution
if (require.main === module) {
  const crawler = new WebCrawler(migrationConfig.sourceUrl);
  crawler
    .crawl()
    .then(() => {
      console.log("Migration crawl completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration crawl failed:", error);
      process.exit(1);
    });
}
