import type { HomeSettings, SiteSettings, SocialLink, SocialPlatform } from "@/lib/sanity/types";

const PLATFORM_LABELS: Record<SocialPlatform, { fr: string; en: string }> = {
  facebook: { fr: "Facebook", en: "Facebook" },
  x: { fr: "X (Twitter)", en: "X (Twitter)" },
  youtube: { fr: "YouTube", en: "YouTube" },
  linkedin: { fr: "LinkedIn", en: "LinkedIn" },
  instagram: { fr: "Instagram", en: "Instagram" },
  tiktok: { fr: "TikTok", en: "TikTok" },
  other: { fr: "Site externe", en: "External site" },
};

const LEGACY_FIELD_MAP: Array<{ field: keyof SocialSettingsSource; platform: SocialPlatform }> = [
  { field: "facebookUrl", platform: "facebook" },
  { field: "xUrl", platform: "x" },
  { field: "youtubeUrl", platform: "youtube" },
  { field: "linkedinUrl", platform: "linkedin" },
];

type SocialSettingsSource = Pick<
  SiteSettings,
  "socialLinks" | "facebookUrl" | "xUrl" | "youtubeUrl" | "linkedinUrl"
>;

function isSocialPlatform(value: string | undefined): value is SocialPlatform {
  return Boolean(value && value in PLATFORM_LABELS);
}

function normalizeSocialLink(link: Partial<SocialLink>): SocialLink | null {
  if (typeof link.url !== "string" || link.url.trim().length === 0) {
    return null;
  }

  const platform = isSocialPlatform(link.platform) ? link.platform : "other";

  return {
    platform,
    url: link.url.trim(),
    label: link.label?.trim() || undefined,
  };
}

function linksFromSource(source?: SocialSettingsSource | null): SocialLink[] {
  const fromArray = (source?.socialLinks ?? [])
    .map((link) => normalizeSocialLink(link))
    .filter((link): link is SocialLink => link !== null);

  if (fromArray.length > 0) {
    return fromArray;
  }

  const legacyLinks: SocialLink[] = [];
  for (const entry of LEGACY_FIELD_MAP) {
    const url = source?.[entry.field];
    if (typeof url === "string" && url.trim().length > 0) {
      legacyLinks.push({ platform: entry.platform, url: url.trim() });
    }
  }

  return legacyLinks;
}

/** Resolves footer social links from site settings, then home settings fallback. */
export function resolveSocialLinks(
  site?: SocialSettingsSource | null,
  home?: SocialSettingsSource | null
): SocialLink[] {
  const siteLinks = linksFromSource(site);
  if (siteLinks.length > 0) {
    return siteLinks;
  }

  return linksFromSource(home);
}

/** Returns the accessible label for a social link. */
export function getSocialLinkLabel(link: SocialLink, locale: string): string {
  if (link.label?.trim()) {
    return link.label.trim();
  }

  const labels = PLATFORM_LABELS[link.platform];
  return locale === "fr" ? labels.fr : labels.en;
}

export interface GlobalSettingsPayload {
  site: SiteSettings | null;
  home: Pick<
    HomeSettings,
    "socialLinks" | "facebookUrl" | "xUrl" | "youtubeUrl" | "linkedinUrl"
  > | null;
}

/** Merges site + home CMS settings for layout/footer consumption. */
export function resolveSiteSettings(payload: GlobalSettingsPayload): SiteSettings {
  const site = payload.site ?? {};
  const home = payload.home ?? {};

  return {
    title: site.title,
    email: site.email,
    phone: site.phone,
    addressFr: site.addressFr,
    addressEn: site.addressEn,
    footerDescriptionFr: site.footerDescriptionFr,
    footerDescriptionEn: site.footerDescriptionEn,
    socialLinks: site.socialLinks?.length ? site.socialLinks : home.socialLinks,
    facebookUrl: site.facebookUrl ?? home.facebookUrl,
    xUrl: site.xUrl ?? home.xUrl,
    youtubeUrl: site.youtubeUrl ?? home.youtubeUrl,
    linkedinUrl: site.linkedinUrl ?? home.linkedinUrl,
  };
}

/** Builds the final social link list for the footer from merged settings. */
export function resolveFooterSocialLinks(payload: GlobalSettingsPayload): SocialLink[] {
  return resolveSocialLinks(payload.site, payload.home);
}
