import { readFileSync } from "fs";
import { createClient } from "next-sanity";

const env = {};
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  if (!line || line.startsWith("#")) continue;
  const index = line.indexOf("=");
  if (index === -1) continue;
  env[line.slice(0, index)] = line.slice(index + 1).trim();
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-06-03",
  useCdn: false,
  token: env.SANITY_API_WRITE_TOKEN || env.SANITY_API_READ_TOKEN,
});

const existing = await client.fetch(`*[_id == "siteSettings"][0]{ _id }`);

if (existing) {
  console.log("siteSettings already exists:", existing._id);
  process.exit(0);
}

const created = await client.createOrReplace({
  _id: "siteSettings",
  _type: "siteSettings",
  title: "Paramètres globaux",
  socialLinks: [],
});

console.log("Created siteSettings document:", created._id);
console.log("Add social links in Sanity Studio → Paramètres du site → Réseaux sociaux");
