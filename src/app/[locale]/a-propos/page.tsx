import { setRequestLocale } from 'next-intl/server';
import { createSeoMetadata } from '@/lib/seo';
import { sanityFetch } from '@/lib/sanity/client';
import { aboutPageQuery } from '@/lib/sanity/queries';
import type { AboutMission, AboutPageData } from '@/lib/sanity/types';
import { AboutPageContent } from '@/components/about/about-page-content';

interface Props {
  params: Promise<{ locale: string }>;
}

const PLACEHOLDER_IMAGE = '/images/placeholders/RDC-Drapeau-CUA.jpg';

const fallbackMissions: AboutMission[] = [
  {
    titleFr: "Maîtrise d'ouvrage délégué",
    titleEn: 'Delegated project management',
    descriptionFr:
      "La CI assure la maîtrise d'ouvrage délégué de projets d'infrastructure au nom du Gouvernement de la RDC.",
    descriptionEn:
      'CI acts as delegated project owner for infrastructure projects on behalf of the DRC Government.',
  },
  {
    titleFr: 'Passation des marchés',
    titleEn: 'Procurement',
    descriptionFr: 'Procédures transparentes conformes aux normes nationales et internationales.',
    descriptionEn:
      'Transparent procurement procedures aligned with national and international standards.',
  },
  {
    titleFr: 'Partenariats internationaux',
    titleEn: 'International partnerships',
    descriptionFr: 'Coordination des financements des partenaires techniques et financiers.',
    descriptionEn: 'Coordination of funding from international technical and financial partners.',
  },
  {
    titleFr: 'Renforcement des capacités',
    titleEn: 'Capacity building',
    descriptionFr: 'Formation et transfert de compétences au niveau national.',
    descriptionEn: 'Training and national capacity building programs.',
  },
];

const fallbackFigures = [
  { value: '2004', labelFr: 'Année de création', labelEn: 'Year founded' },
  { value: '26', labelFr: 'Provinces', labelEn: 'Provinces' },
  { value: '250+', labelFr: 'Projets', labelEn: 'Projects' },
  { value: '$5.2B', labelFr: 'Portefeuille', labelEn: 'Portfolio' },
];

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

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  return createSeoMetadata({
    locale,
    path: '/a-propos',
    title: isFr ? 'À propos de la Cellule Infrastructures' : 'About the Infrastructure Unit',
    description: isFr
      ? 'Découvrez la mission, la gouvernance et l’impact de la Cellule Infrastructures de la République Démocratique du Congo.'
      : 'Learn about the mission, governance and impact of the DRC Infrastructure Unit.',
    keywords: [
      'Cellule Infrastructures RDC',
      'infrastructures Congo',
      'gouvernance projets RDC',
    ],
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isFr = locale === 'fr';

  const data = await sanityFetch<AboutPageData>({
    query: aboutPageQuery,
    tags: ['aboutPage', 'project'],
  });

  const about = data.about;
  const missionFallbackImages = data.missionFallbackImages ?? [];
  const heroFallback = data.heroFallbackImage;

  const missionsSource = about?.missions?.length ? about.missions : fallbackMissions;
  const missions = missionsSource.map((mission, index) => {
    const image = resolveImageUrl(mission.image, heroFallback, index, missionFallbackImages);
    return {
      ...mission,
      imageUrl: image.url,
      imageAlt: image.alt || (isFr ? mission.titleFr : mission.titleEn) || '',
    };
  });

  const heroImage = resolveImageUrl(about?.heroImage, heroFallback, 0, missionFallbackImages);
  const organizationImage = resolveImageUrl(
    about?.organizationImage,
    heroFallback,
    1,
    missionFallbackImages
  );

  return (
    <AboutPageContent
      locale={locale}
      pageTitle={
        (isFr ? about?.pageTitleFr : about?.pageTitleEn) ||
        (isFr ? 'À propos de la CI' : 'About CI')
      }
      subtitle={
        (isFr ? about?.subtitleFr : about?.subtitleEn) ||
        (isFr
          ? 'La Cellule Infrastructures au service du développement des infrastructures en RDC.'
          : 'The Infrastructure Unit driving infrastructure development across the DRC.')
      }
      heroImageUrl={heroImage.url}
      heroImageAlt={
        heroImage.alt ||
        (isFr ? 'Infrastructures en République Démocratique du Congo' : 'Infrastructure in the DRC')
      }
      missionEyebrow={
        (isFr ? about?.missionEyebrowFr : about?.missionEyebrowEn) ||
        (isFr ? 'Notre mandat' : 'Our mandate')
      }
      missionTitle={
        (isFr ? about?.missionTitleFr : about?.missionTitleEn) ||
        (isFr ? 'Missions principales' : 'Core missions')
      }
      missions={missions}
      organizationEyebrow={
        (isFr ? about?.organizationEyebrowFr : about?.organizationEyebrowEn) ||
        (isFr ? 'Organisation' : 'Structure')
      }
      organizationTitle={
        (isFr ? about?.organizationTitleFr : about?.organizationTitleEn) ||
        (isFr ? 'Gouvernance' : 'Governance')
      }
      organizationBody={isFr ? about?.organizationBodyFr : about?.organizationBodyEn}
      organizationFallback={
        isFr
          ? 'La CI est placée sous tutelle du Ministère des Infrastructures et Publiques et Œuvres.'
          : 'CI operates under the Ministry of Infrastructure and Public Works.'
      }
      organizationImageUrl={organizationImage.url}
      organizationImageAlt={
        organizationImage.alt ||
        (isFr ? 'Organisation de la Cellule Infrastructures' : 'Infrastructure Unit organization')
      }
      figuresEyebrow={
        (isFr ? about?.figuresEyebrowFr : about?.figuresEyebrowEn) ||
        (isFr ? 'Chiffres clés' : 'Key figures')
      }
      figuresTitle={
        (isFr ? about?.figuresTitleFr : about?.figuresTitleEn) ||
        (isFr ? 'Impact national' : 'National impact')
      }
      figures={about?.figures?.length ? about.figures : fallbackFigures}
    />
  );
}
