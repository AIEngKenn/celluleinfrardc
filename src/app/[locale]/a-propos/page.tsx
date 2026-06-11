import { setRequestLocale } from 'next-intl/server';
import { createSeoMetadata } from '@/lib/seo';
import { sanityFetch } from '@/lib/sanity/client';
import { aboutPageQuery } from '@/lib/sanity/queries';
import type { AboutFigure, AboutPageData } from '@/lib/sanity/types';
import { AboutPageContent } from '@/components/about/about-page-content';
import {
  resolveAboutMissions,
  resolveHeroImage,
  resolveOrganizationImage,
} from '@/lib/about/resolve-missions';

interface Props {
  params: Promise<{ locale: string }>;
}

const fallbackFigures: AboutFigure[] = [
  { value: '2004', labelFr: 'Année de création', labelEn: 'Year founded' },
  { value: '26', labelFr: 'Provinces', labelEn: 'Provinces' },
  { value: '250+', labelFr: 'Projets', labelEn: 'Projects' },
  { value: '$5.2B', labelFr: 'Portefeuille', labelEn: 'Portfolio' },
];

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  return createSeoMetadata({
    locale,
    path: '/a-propos',
    title: isFr ? 'À propos de la Cellule Infrastructures' : 'About the Infrastructure Unit',
    description: isFr
      ? "Découvrez la mission, la gouvernance et l'impact de la Cellule Infrastructures de la République Démocratique du Congo."
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
  const missions = resolveAboutMissions(data);
  const heroImage = resolveHeroImage(data);
  const organizationImage = resolveOrganizationImage(data);

  return (
    <AboutPageContent
      locale={locale}
      pageTitle={
        (isFr ? about?.pageTitleFr : about?.pageTitleEn) ||
        (isFr ? 'À propos de la Cellule Infrastructures' : 'About the Infrastructure Unit')
      }
      subtitle={
        (isFr ? about?.subtitleFr : about?.subtitleEn) ||
        (isFr
          ? 'Piloter, financer et livrer les infrastructures structurantes au service du développement national.'
          : 'Planning, financing and delivering structural infrastructure for national development.')
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
        (isFr ? 'Ce que nous faisons' : 'What we do')
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
          ? "La Cellule Infrastructures est placée sous la tutelle du Ministère des Infrastructures et Travaux Publics. Elle assure la cohérence entre la planification sectorielle, l'exécution des projets et le contrôle des résultats."
          : 'The Infrastructure Unit operates under the Ministry of Infrastructure and Public Works. It ensures alignment between sector planning, project execution and results monitoring.'
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
