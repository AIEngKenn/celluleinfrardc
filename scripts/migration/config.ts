export interface MigrationConfig {
  sourceUrl: string;
  sanityProjectId: string;
  sanityDataset: string;
  sanityToken: string;
  downloadDir: string;
  preserveUrls: boolean;
  batchSize: number;
  crawlDelay: number;
  downloadTimeout: number;
  userAgent: string;
}

export const migrationConfig: MigrationConfig = {
  sourceUrl: process.env.SOURCE_WEBSITE_URL || "https://www.celluleinfra.org",
  sanityProjectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  sanityToken: process.env.SANITY_API_WRITE_TOKEN!,
  downloadDir: "./migration-data",
  preserveUrls: true,
  batchSize: 50,
  crawlDelay: 1000, // 1 second between requests
  downloadTimeout: 60000, // 60 seconds
  userAgent: "CelluleInfra-Migration-Bot/1.0",
};
