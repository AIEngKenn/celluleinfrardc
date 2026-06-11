import type { AboutMission, AboutPageData } from '@/lib/sanity/types';
import {
  FALLBACK_MISSIONS,
  getFallbackMissionBySlug,
  getFallbackMissionSlug,
  type FallbackMission,
} from '@/lib/about/missions-fallback';

const PLACEHOLDER_IMAGE = '/images/placeholders/RDC-Drapeau-CUA.jpg';

export interface ResolvedAboutMission {
  slug: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  imageUrl: string;
  imageAlt: string;
  highlightsFr: string[];
  highlightsEn: string[];
  contentFr: { _type: string; [key: string]: unknown }[];
  contentEn: { _type: string; [key: string]: unknown }[];
}

function resolveImageUrl(
  primary?: { asset?: { url?: string }; alt?: string },
  fallback?: { url?: string; alt?: string },
  index = 0,
  fallbacks: Array<{ url: string; alt?: string }> = []
) {
  const cmsUrl = primary?.asset?.url;
  if (cmsUrl) {
    return { url: cmsUrl, alt: primary?.alt || '' };
  }
  const indexedFallback = fallbacks[index]?.url || fallback?.url;
  if (indexedFallback) {
    return {
      url: indexedFallback,
      alt: fallbacks[index]?.alt || fallback?.alt || '',
    };
  }
  return { url: PLACEHOLDER_IMAGE, alt: '' };
}

function paragraphsToBlocks(paragraphs: string[]) {
  return paragraphs.map((text) => ({
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', text, marks: [] }],
  }));
}

function mergeMission(
  mission: AboutMission,
  index: number,
  fallback: FallbackMission,
  missionFallbackImages: Array<{ url: string; alt?: string }>,
  heroFallback?: { url: string; alt?: string }
): ResolvedAboutMission {
  const image = resolveImageUrl(mission.image, heroFallback, index, missionFallbackImages);
  const slug = mission.slug || fallback.slug || getFallbackMissionSlug(mission, index);

  const contentFr =
    mission.contentFr && mission.contentFr.length > 0
      ? mission.contentFr
      : paragraphsToBlocks(fallback.contentFr);
  const contentEn =
    mission.contentEn && mission.contentEn.length > 0
      ? mission.contentEn
      : paragraphsToBlocks(fallback.contentEn);

  return {
    slug,
    titleFr: mission.titleFr || fallback.titleFr || '',
    titleEn: mission.titleEn || fallback.titleEn || '',
    descriptionFr: mission.descriptionFr || fallback.descriptionFr || '',
    descriptionEn: mission.descriptionEn || fallback.descriptionEn || '',
    imageUrl: image.url,
    imageAlt: image.alt || mission.titleFr || mission.titleEn || '',
    highlightsFr:
      mission.highlightsFr && mission.highlightsFr.length > 0
        ? mission.highlightsFr
        : fallback.highlightsFr,
    highlightsEn:
      mission.highlightsEn && mission.highlightsEn.length > 0
        ? mission.highlightsEn
        : fallback.highlightsEn,
    contentFr,
    contentEn,
  };
}

export function resolveAboutMissions(data: AboutPageData): ResolvedAboutMission[] {
  const missionFallbackImages = data.missionFallbackImages ?? [];
  const heroFallback = data.heroFallbackImage;

  if (data.about?.missions?.length) {
    return data.about.missions.map((mission, index) =>
      mergeMission(
        mission,
        index,
        FALLBACK_MISSIONS[index] || FALLBACK_MISSIONS[0],
        missionFallbackImages,
        heroFallback
      )
    );
  }

  return FALLBACK_MISSIONS.map((fallback, index) =>
    mergeMission(
      {
        slug: fallback.slug,
        icon: fallback.icon,
        titleFr: fallback.titleFr,
        titleEn: fallback.titleEn,
        descriptionFr: fallback.descriptionFr,
        descriptionEn: fallback.descriptionEn,
      },
      index,
      fallback,
      missionFallbackImages,
      heroFallback
    )
  );
}

export function resolveAboutMissionBySlug(
  data: AboutPageData,
  slug: string
): ResolvedAboutMission | null {
  const missions = resolveAboutMissions(data);
  const fromList = missions.find((mission) => mission.slug === slug);
  if (fromList) return fromList;

  const fallback = getFallbackMissionBySlug(slug);
  if (!fallback) return null;

  const index = FALLBACK_MISSIONS.findIndex((mission) => mission.slug === slug);
  const missionData: AboutMission = {
    slug: fallback.slug,
    titleFr: fallback.titleFr,
    titleEn: fallback.titleEn,
    descriptionFr: fallback.descriptionFr,
    descriptionEn: fallback.descriptionEn,
    icon: fallback.icon,
  };
  return mergeMission(
    missionData,
    index >= 0 ? index : 0,
    fallback,
    data.missionFallbackImages ?? [],
    data.heroFallbackImage
  );
}

export function resolveHeroImage(data: AboutPageData) {
  return resolveImageUrl(
    data.about?.heroImage,
    data.heroFallbackImage,
    0,
    data.missionFallbackImages ?? []
  );
}

export function resolveOrganizationImage(data: AboutPageData) {
  return resolveImageUrl(
    data.about?.organizationImage,
    data.heroFallbackImage,
    1,
    data.missionFallbackImages ?? []
  );
}
