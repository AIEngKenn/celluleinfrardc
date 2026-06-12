import { readFileSync } from "fs";
import { createClient } from "next-sanity";

const envText = readFileSync(".env.local", "utf8");
const env = {};
for (const line of envText.split(/\r?\n/)) {
  if (!line || line.startsWith("#")) {
    continue;
  }
  const index = line.indexOf("=");
  if (index === -1) {
    continue;
  }
  env[line.slice(0, index)] = line.slice(index + 1).trim();
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-06-03",
  useCdn: false,
  token: env.SANITY_API_READ_TOKEN || undefined,
});

const data = await client.fetch(
  `*[_type == "siteSettings"]{ _id, title, socialLinks, facebookUrl, xUrl, youtubeUrl, linkedinUrl }`
);

console.log("published:", JSON.stringify(data, null, 2));

const draftData = await client.fetch(
  `*[_id in path("drafts.**") && _type == "siteSettings"]{ _id, title, socialLinks, facebookUrl, xUrl, youtubeUrl, linkedinUrl }`
);

console.log("drafts:", JSON.stringify(draftData, null, 2));

const allTypes = await client.fetch(`array::unique(*[]._type) | order(@ asc)`);
console.log("types:", allTypes.filter((t) => t.includes("site") || t.includes("Settings") || t.includes("home")));
