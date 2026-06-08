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
        "La CI assure la maîtrise d'ouvrage délégué de projets d'infrastructure au nom du Gouvernement de la RDC.",
      descriptionEn:
        'CI acts as delegated project owner for infrastructure projects on behalf of the DRC Government.',
    },
    {
      icon: 'file' as const,
      titleFr: 'Passation des marchés',
      titleEn: 'Procurement',
      descriptionFr: 'Procédures transparentes conformes aux normes nationales et internationales.',
      descriptionEn:
        'Transparent procurement procedures aligned with national and international standards.',
    },
    {
      icon: 'globe' as const,
      titleFr: 'Partenariats internationaux',
      titleEn: 'International partnerships',
      descriptionFr: 'Coordination des financements des partenaires techniques et financiers.',
      descriptionEn: 'Coordination of funding from international technical and financial partners.',
    },
    {
      icon: 'users' as const,
      titleFr: 'Renforcement des capacités',
      titleEn: 'Capacity building',
      descriptionFr: 'Formation et transfert de compétences au niveau national.',
      descriptionEn: 'Training and national capacity building programs.',
    },
  ];

  const missions = about?.missions?.length ? about.missions : fallbackMissions;

  const organizationBody = isFr ? about?.organizationBodyFr : about?.organizationBodyEn;

  const figures = about?.figures?.length
    ? about.figures
    : [
        { value: '2004', labelFr: 'Année de création', labelEn: 'Year founded' },
        { value: '26', labelFr: 'Provinces', labelEn: 'Provinces' },
        { value: '250+', labelFr: 'Projets', labelEn: 'Projects' },
        { value: '$5.2B', labelFr: 'Portefeuille', labelEn: 'Portfolio' },
      ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <PageHeader
        title={
          (isFr ? about?.pageTitleFr : about?.pageTitleEn) ||
          (isFr ? 'À propos de la CI' : 'About CI')
        }
        subtitle={
          (isFr ? about?.subtitleFr : about?.subtitleEn) ||
          (isFr ? 'La Cellule Infrastructures de la RDC' : 'DRC Infrastructure Unit overview')
        }
        breadcrumbs={[{ label: isFr ? 'À propos' : 'About' }]}
        locale={locale}
      />

      <div className="ci-container ci-section space-y-24">
        {/* ===================== MISSIONS (UPGRADED CARDS) ===================== */}
        <section>
          <div className="mb-10">
            <span className="text-sm font-semibold uppercase tracking-widest text-rdc-blue">
              {isFr ? 'Notre mandat' : 'Our mandate'}
            </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {isFr ? 'Missions principales' : 'Core missions'}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {missions.map((m, i) => {
              const Icon = iconMap[m.icon || 'building'] || Building2;
              const title = (isFr ? m.titleFr : m.titleEn) || m.titleFr || '';
              const desc = (isFr ? m.descriptionFr : m.descriptionEn) || m.descriptionFr || '';

              const accent = [
                'from-rdc-blue to-blue-600',
                'from-rdc-red to-red-500',
                'from-slate-700 to-slate-900',
                'from-indigo-600 to-blue-500',
              ][i % 4];

              return (
                <div
                  key={title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* gradient glow */}
                  <div
                    className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${accent} opacity-10 blur-2xl transition-all group-hover:opacity-20`}
                  />

                  <div className="relative">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rdc-blue/10 text-rdc-blue transition-all duration-300 group-hover:scale-110 group-hover:bg-rdc-blue group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <h3 className="mb-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-rdc-blue">
                      {title}
                    </h3>

                    <p className="text-sm leading-6 text-slate-600">{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===================== ORGANIZATION + STATS ===================== */}
        <section className="grid gap-10 lg:grid-cols-2">
          {/* Organization */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <span className="text-sm font-semibold uppercase tracking-widest text-rdc-blue">
              {isFr ? 'Organisation' : 'Structure'}
            </span>

            <h2 className="mb-6 mt-2 text-2xl font-bold text-slate-900">
              {isFr ? 'Gouvernance' : 'Governance'}
            </h2>

            {organizationBody?.length ? (
              <div className="prose max-w-none text-slate-600">
                <PortableText value={organizationBody} />
              </div>
            ) : (
              <p className="leading-7 text-slate-600">
                {isFr
                  ? 'La CI est placée sous tutelle du Ministère des Infrastructures.'
                  : 'CI operates under the Ministry of Infrastructure.'}
              </p>
            )}
          </div>

          {/* Stats (interactive cards) */}
          <div>
            <div className="mb-6">
              <span className="text-sm font-semibold uppercase tracking-widest text-rdc-blue">
                {isFr ? 'Chiffres clés' : 'Key figures'}
              </span>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {isFr ? 'Impact national' : 'National impact'}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {figures.map((stat, i) => (
                <div
                  key={`${stat.value}-${i}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-rdc-blue/30 hover:shadow-xl"
                >
                  <div className="text-2xl font-bold text-rdc-blue transition-transform group-hover:scale-105">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {isFr ? stat.labelFr : stat.labelEn || stat.labelFr}
                  </div>

                  <div className="mt-3 h-1 w-10 rounded-full bg-rdc-blue/20 transition-all group-hover:w-16" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
