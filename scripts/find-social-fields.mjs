import { readFileSync } from "fs";
import { createClient } from "next-sanity";

const env = {};
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  if (!line || line.startsWith("#")) continue;
  const i = line.indexOf("=");
  if (i === -1) continue;
  env[line.slice(0, i)] = line.slice(i + 1).trim();
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-06-03",
  useCdn: false,
  token: env.SANITY_API_READ_TOKEN || undefined,
});

const hits = await client.fetch(
  `*[
    defined(facebookUrl) ||
    defined(xUrl) ||
    defined(youtubeUrl) ||
    defined(linkedinUrl) ||
    count(socialLinks) > 0
  ]{ _type, _id, facebookUrl, xUrl, youtubeUrl, linkedinUrl, socialLinks }`
);

console.log(JSON.stringify(hits, null, 2));
