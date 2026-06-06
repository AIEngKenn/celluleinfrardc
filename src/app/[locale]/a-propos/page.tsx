import { setRequestLocale } from 'next-intl/server';
import { PageHeader } from '@/components/ui/page-header';
import { Building2, Users, Globe, FileCheck } from 'lucide-react';
import { createSeoMetadata } from '@/lib/seo';
import { sanityFetch } from '@/lib/sanity/client';
import { aboutPageQuery } from '@/lib/sanity/queries';
import type { AboutPageContent } from '@/lib/sanity/types';
import { PortableText } from '@portabletext/react';

interface Props {
  params: Promise<{ locale: string }>;
}

const iconMap = {
  building: Building2,
  file: FileCheck,
  globe: Globe,
  users: Users,
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return createSeoMetadata({
    locale,
    path: '/a-propos',
    title:
      locale === 'fr'
        ? 'À propos — Cellule Infrastructures RDC'
        : 'About — Cellule Infrastructures DRC',
    description:
      locale === 'fr'
        ? 'Présentation de la Cellule Infrastructures de la République Démocratique du Congo, son mandat, ses missions et ses partenariats.'
        : 'Overview of the DRC Infrastructure Unit, its mandate, missions and partnerships.',
    keywords: ['Cellule Infrastructures', 'mission infrastructures RDC', 'maîtrise ouvrage RDC'],
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isFr = locale === 'fr';
  const about = await sanityFetch<AboutPageContent | null>({
    query: aboutPageQuery,
    tags: ['aboutPage'],
  });

  const fallbackMissions = [
    {
      icon: 'building' as const,
      titleFr: "Maîtrise d'ouvrage délégué",
      titleEn: 'Delegated project management',
      descriptionFr:
        "La CI assure la maîtrise d'ouvrage délégué de projets d'infrastructure au nom du Gouvernement de la RDC, garantissant la bonne exécution technique et financière des marchés.",
      descriptionEn:
        'CI acts as delegated project owner for infrastructure projects on behalf of the DRC Government, ensuring proper technical and financial contract execution.',
    },
    {
      icon: 'file' as const,
      titleFr: 'Passation des marchés',
      titleEn: 'Procurement',
      descriptionFr:
        'Toutes les procédures de passation sont conduites dans la transparence, conformément aux règlements nationaux et aux exigences des bailleurs de fonds internationaux.',
      descriptionEn:
        'All procurement procedures are conducted transparently, in compliance with national regulations and international donor requirements.',
    },
    {
      icon: 'globe' as const,
      titleFr: 'Partenariats internationaux',
      titleEn: 'International partnerships',
      descriptionFr:
        "La CI coordonne les financements de la Banque mondiale, de la BAD, de l'UE et d'autres partenaires techniques et financiers pour maximiser l'impact des investissements.",
      descriptionEn:
        'CI coordinates financing from the World Bank, AfDB, EU and other technical and financial partners to maximize investment impact.',
    },
    {
      icon: 'users' as const,
      titleFr: 'Renforcement des capacités',
      titleEn: 'Capacity building',
      descriptionFr:
        'Formation des équipes locales, transfert de compétences et développement des PME congolaises dans le secteur de la construction.',
      descriptionEn:
        'Training local teams, transferring skills and developing Congolese SMEs in the construction sector.',
    },
  ];
  const missions = about?.missions?.length ? about.missions : fallbackMissions;
  const organizationBody = isFr ? about?.organizationBodyFr : about?.organizationBodyEn;
  const figures = about?.figures?.length
    ? about.figures
    : [
        { value: '2004', labelFr: 'Année de création', labelEn: 'Year founded' },
        { value: '26', labelFr: "Provinces d'intervention", labelEn: 'Provinces of operation' },
        { value: '250+', labelFr: 'Projets gérés', labelEn: 'Projects managed' },
        { value: '$5.2Mrd', labelFr: 'Portefeuille total', labelEn: 'Total portfolio' },
      ];

  return (
    <div>
      <PageHeader
        title={(isFr ? about?.pageTitleFr : about?.pageTitleEn) || (isFr ? 'À propos de la CI' : 'About CI')}
        subtitle={
          (isFr ? about?.subtitleFr : about?.subtitleEn) ||
          (isFr
            ? "La Cellule Infrastructures est l'agence publique mandatée par le Gouvernement de la RDC pour planifier, coordonner et superviser les grands projets d'infrastructure nationale."
            : 'Cellule Infrastructures is the public agency mandated by the DRC Government to plan, coordinate and supervise major national infrastructure projects.')
        }
        breadcrumbs={[{ label: isFr ? 'À propos' : 'About' }]}
        locale={locale}
      />

      <div className="ci-container ci-section">
        {/* Mission */}
        <section style={{ marginBottom: '5rem' }}>
          <span className="ci-eyebrow">
            {(isFr ? about?.missionEyebrowFr : about?.missionEyebrowEn) ||
              (isFr ? 'Notre mandat' : 'Our mandate')}
          </span>
          <h2 className="ci-section-title" style={{ marginBottom: '3rem' }}>
            {(isFr ? about?.missionTitleFr : about?.missionTitleEn) ||
              (isFr ? 'Missions principales' : 'Core missions')}
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2px',
              background: 'var(--ci-border)',
            }}
          >
            {missions.map((m) => {
              const Icon = iconMap[m.icon || 'building'] || Building2;
              const missionTitle = (isFr ? m.titleFr : m.titleEn) || m.titleFr || '';
              const missionDescription =
                (isFr ? m.descriptionFr : m.descriptionEn) || m.descriptionFr || '';
              return (
                <div key={missionTitle} style={{ background: 'white', padding: '2rem' }}>
                  <Icon size={28} style={{ color: 'var(--ci-blue)', marginBottom: '1rem' }} />
                  <h3
                    style={{
                      fontSize: 'var(--ci-step-1)',
                      fontWeight: 700,
                      marginBottom: '0.75rem',
                    }}
                  >
                    {missionTitle}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--ci-text-secondary)',
                      lineHeight: 1.7,
                    }}
                  >
                    {missionDescription}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Organisation */}
        <section
          style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}
          className="lg:grid-cols-2"
        >
          <div>
            <span className="ci-eyebrow">
              {(isFr ? about?.organizationEyebrowFr : about?.organizationEyebrowEn) ||
                (isFr ? 'Organisation' : 'Structure')}
            </span>
            <h2 className="ci-section-title">
              {(isFr ? about?.organizationTitleFr : about?.organizationTitleEn) ||
                (isFr ? 'Structure de gouvernance' : 'Governance structure')}
            </h2>
            {organizationBody?.length ? (
              <div className="ci-article-body">
                <PortableText value={organizationBody} />
              </div>
            ) : (
              <>
                <p style={{ color: 'var(--ci-text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                  {isFr
                    ? 'La Cellule Infrastructures est placée sous la tutelle du Ministère des Infrastructures et Travaux Publics. Elle est dirigée par un Coordonnateur National assisté de coordinateurs techniques spécialisés par secteur.'
                    : 'Cellule Infrastructures operates under the authority of the Ministry of Infrastructure and Public Works. It is led by a National Coordinator assisted by technical coordinators specialized by sector.'}
                </p>
                <p style={{ color: 'var(--ci-text-secondary)', lineHeight: 1.8 }}>
                  {isFr
                    ? 'Ses équipes intègrent des ingénieurs, des économistes, des spécialistes en passation de marchés et en sauvegarde environnementale et sociale, tous formés aux standards internationaux.'
                    : 'Its teams include engineers, economists, procurement specialists and environmental and social safeguard experts, all trained to international standards.'}
                </p>
              </>
            )}
          </div>
          <div>
            <span className="ci-eyebrow">
              {(isFr ? about?.figuresEyebrowFr : about?.figuresEyebrowEn) ||
                (isFr ? 'Chiffres clés' : 'Key figures')}
            </span>
            <h2 className="ci-section-title">
              {(isFr ? about?.figuresTitleFr : about?.figuresTitleEn) ||
                (isFr ? 'La CI en chiffres' : 'CI in numbers')}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1px',
                background: 'var(--ci-border)',
                border: '1px solid var(--ci-border)',
              }}
            >
              {figures.map((stat) => (
                <div key={`${stat.value}-${stat.labelFr}`} style={{ background: 'white', padding: '1.5rem' }}>
                  <div className="ci-stat-number" style={{ fontSize: '1.75rem' }}>
                    {stat.value}
                  </div>
                  <div className="ci-stat-label">{isFr ? stat.labelFr : stat.labelEn || stat.labelFr}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
