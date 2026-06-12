import type { HomePartner, PartnerCategory } from "@/lib/sanity/types";

const FALLBACK_PARTNERS: HomePartner[] = [
  {
    _id: "fallback-gov",
    name: "Gouvernement de la RDC",
    category: "national",
  },
  {
    _id: "fallback-wb",
    name: "Banque mondiale",
    url: "https://www.worldbank.org",
    category: "financial",
  },
  {
    _id: "fallback-afdb",
    name: "Banque Africaine de Développement",
    url: "https://www.afdb.org",
    category: "financial",
  },
  {
    _id: "fallback-eu",
    name: "Union européenne",
    url: "https://european-union.europa.eu",
    category: "international",
  },
  {
    _id: "fallback-foner",
    name: "FONER",
    category: "national",
  },
  {
    _id: "fallback-mitp",
    name: "MITP",
    category: "national",
  },
];

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

function sortPartners(partners: HomePartner[]): HomePartner[] {
  return [...partners].sort((left, right) => {
    const leftOrder = left.order ?? 999;
    const rightOrder = right.order ?? 999;
    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }
    return left.name.localeCompare(right.name, "fr");
  });
}

/** Merges CMS partner documents with legacy homeSettings entries. */
export function resolveHomePartners(
  cmsPartners?: HomePartner[] | null,
  legacyPartners?: HomePartner[] | null
): HomePartner[] {
  const merged = new Map<string, HomePartner>();

  for (const partner of cmsPartners ?? []) {
    if (!partner.name?.trim()) {
      continue;
    }
    const key = partner._id ?? normalizeName(partner.name);
    merged.set(key, partner);
  }

  for (const partner of legacyPartners ?? []) {
    if (!partner.name?.trim()) {
      continue;
    }
    const key = normalizeName(partner.name);
    if (!merged.has(key)) {
      merged.set(key, partner);
    }
  }

  const resolved = sortPartners(Array.from(merged.values()));
  return resolved.length > 0 ? resolved : FALLBACK_PARTNERS;
}

/** Returns a display label for a partner category. */
export function getPartnerCategoryLabel(
  category: PartnerCategory | undefined,
  locale: string
): string | null {
  if (!category) {
    return null;
  }

  const isFr = locale === "fr";
  const labels: Record<PartnerCategory, { fr: string; en: string }> = {
    financial: { fr: "Partenaire financier", en: "Financial partner" },
    technical: { fr: "Partenaire technique", en: "Technical partner" },
    international: { fr: "Institution internationale", en: "International institution" },
    national: { fr: "Institution nationale", en: "National institution" },
  };

  const label = labels[category];
  return isFr ? label.fr : label.en;
}

/** Resolves a logo URL from Sanity image data. */
export function getPartnerLogoUrl(partner: HomePartner): string | null {
  return partner.logo?.asset?.url ?? null;
}
