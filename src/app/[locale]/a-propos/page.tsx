import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHeader } from '@/components/ui/page-header';
import { Building2, Users, Globe, FileCheck } from 'lucide-react';
import { createSeoMetadata } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

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

  const missions = [
    {
      icon: Building2,
      titleFr: "Maîtrise d'ouvrage délégué",
      titleEn: 'Delegated project management',
      descFr:
        "La CI assure la maîtrise d'ouvrage délégué de projets d'infrastructure au nom du Gouvernement de la RDC, garantissant la bonne exécution technique et financière des marchés.",
      descEn:
        'CI acts as delegated project owner for infrastructure projects on behalf of the DRC Government, ensuring proper technical and financial contract execution.',
    },
    {
      icon: FileCheck,
      titleFr: 'Passation des marchés',
      titleEn: 'Procurement',
      descFr:
        'Toutes les procédures de passation sont conduites dans la transparence, conformément aux règlements nationaux et aux exigences des bailleurs de fonds internationaux.',
      descEn:
        'All procurement procedures are conducted transparently, in compliance with national regulations and international donor requirements.',
    },
    {
      icon: Globe,
      titleFr: 'Partenariats internationaux',
      titleEn: 'International partnerships',
      descFr:
        "La CI coordonne les financements de la Banque mondiale, de la BAD, de l'UE et d'autres partenaires techniques et financiers pour maximiser l'impact des investissements.",
      descEn:
        'CI coordinates financing from the World Bank, AfDB, EU and other technical and financial partners to maximize investment impact.',
    },
    {
      icon: Users,
      titleFr: 'Renforcement des capacités',
      titleEn: 'Capacity building',
      descFr:
        'Formation des équipes locales, transfert de compétences et développement des PME congolaises dans le secteur de la construction.',
      descEn:
        'Training local teams, transferring skills and developing Congolese SMEs in the construction sector.',
    },
  ];

  return (
    <div>
      <PageHeader
        title={isFr ? 'À propos de la CI' : 'About CI'}
        subtitle={
          isFr
            ? "La Cellule Infrastructures est l'agence publique mandatée par le Gouvernement de la RDC pour planifier, coordonner et superviser les grands projets d'infrastructure nationale."
            : 'Cellule Infrastructures is the public agency mandated by the DRC Government to plan, coordinate and supervise major national infrastructure projects.'
        }
        breadcrumbs={[{ label: isFr ? 'À propos' : 'About' }]}
        locale={locale}
      />

      <div className="ci-container ci-section">
        {/* Mission */}
        <section style={{ marginBottom: '5rem' }}>
          <span className="ci-eyebrow">{isFr ? 'Notre mandat' : 'Our mandate'}</span>
          <h2 className="ci-section-title" style={{ marginBottom: '3rem' }}>
            {isFr ? 'Missions principales' : 'Core missions'}
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
              const Icon = m.icon;
              return (
                <div key={m.titleFr} style={{ background: 'white', padding: '2rem' }}>
                  <Icon size={28} style={{ color: 'var(--ci-blue)', marginBottom: '1rem' }} />
                  <h3
                    style={{
                      fontSize: 'var(--ci-step-1)',
                      fontWeight: 700,
                      marginBottom: '0.75rem',
                    }}
                  >
                    {isFr ? m.titleFr : m.titleEn}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--ci-text-secondary)',
                      lineHeight: 1.7,
                    }}
                  >
                    {isFr ? m.descFr : m.descEn}
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
            <span className="ci-eyebrow">{isFr ? 'Organisation' : 'Structure'}</span>
            <h2 className="ci-section-title">
              {isFr ? 'Structure de gouvernance' : 'Governance structure'}
            </h2>
            <p
              style={{ color: 'var(--ci-text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}
            >
              {isFr
                ? 'La Cellule Infrastructures est placée sous la tutelle du Ministère des Infrastructures et Travaux Publics. Elle est dirigée par un Coordonnateur National assisté de coordinateurs techniques spécialisés par secteur.'
                : 'Cellule Infrastructures operates under the authority of the Ministry of Infrastructure and Public Works. It is led by a National Coordinator assisted by technical coordinators specialized by sector.'}
            </p>
            <p style={{ color: 'var(--ci-text-secondary)', lineHeight: 1.8 }}>
              {isFr
                ? 'Ses équipes intègrent des ingénieurs, des économistes, des spécialistes en passation de marchés et en sauvegarde environnementale et sociale, tous formés aux standards internationaux.'
                : 'Its teams include engineers, economists, procurement specialists and environmental and social safeguard experts, all trained to international standards.'}
            </p>
          </div>
          <div>
            <span className="ci-eyebrow">{isFr ? 'Chiffres clés' : 'Key figures'}</span>
            <h2 className="ci-section-title">{isFr ? 'La CI en chiffres' : 'CI in numbers'}</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1px',
                background: 'var(--ci-border)',
                border: '1px solid var(--ci-border)',
              }}
            >
              {[
                { num: '2004', label: isFr ? 'Année de création' : 'Year founded' },
                { num: '26', label: isFr ? "Provinces d'intervention" : 'Provinces of operation' },
                { num: '250+', label: isFr ? 'Projets gérés' : 'Projects managed' },
                { num: '$5.2Mrd', label: isFr ? 'Portefeuille total' : 'Total portfolio' },
              ].map((stat) => (
                <div key={stat.label} style={{ background: 'white', padding: '1.5rem' }}>
                  <div className="ci-stat-number" style={{ fontSize: '1.75rem' }}>
                    {stat.num}
                  </div>
                  <div className="ci-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
