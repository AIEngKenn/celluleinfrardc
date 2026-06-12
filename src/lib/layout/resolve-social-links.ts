import type { SiteSettings, SocialLink, SocialPlatform } from "@/lib/sanity/types";

const PLATFORM_LABELS: Record<SocialPlatform, { fr: string; en: string }> = {
  facebook: { fr: "Facebook", en: "Facebook" },
  x: { fr: "X (Twitter)", en: "X (Twitter)" },
  youtube: { fr: "YouTube", en: "YouTube" },
  linkedin: { fr: "LinkedIn", en: "LinkedIn" },
  instagram: { fr: "Instagram", en: "Instagram" },
  tiktok: { fr: "TikTok", en: "TikTok" },
  other: { fr: "Site externe", en: "External site" },
};

const LEGACY_FIELD_MAP: Array<{ field: keyof SiteSettings; platform: SocialPlatform }> = [
  { field: "facebookUrl", platform: "facebook" },
  { field: "xUrl", platform: "x" },
  { field: "youtubeUrl", platform: "youtube" },
  { field: "linkedinUrl", platform: "linkedin" },
];

/** Resolves footer social links from CMS array, with legacy URL field fallback. */
export function resolveSocialLinks(settings?: SiteSettings | null): SocialLink[] {
  const fromArray = (settings?.socialLinks ?? []).filter(
    (link) => typeof link.url === "string" && link.url.trim().length > 0
  );

  if (fromArray.length > 0) {
    return fromArray;
  }

  const legacyLinks: SocialLink[] = [];
  for (const entry of LEGACY_FIELD_MAP) {
    const url = settings?.[entry.field];
    if (typeof url === "string" && url.trim().length > 0) {
      legacyLinks.push({ platform: entry.platform, url: url.trim() });
    }
  }

  return legacyLinks;
}

/** Returns the accessible label for a social link. */
export function getSocialLinkLabel(link: SocialLink, locale: string): string {
  if (link.label?.trim()) {
    return link.label.trim();
  }

  const labels = PLATFORM_LABELS[link.platform];
  return locale === "fr" ? labels.fr : labels.en;
}
