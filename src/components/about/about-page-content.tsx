'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Home, ArrowRight } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import CountUp from '@/components/ui/count-up';
import type { AboutFigure } from '@/lib/sanity/types';
import type { ResolvedAboutMission } from '@/lib/about/resolve-missions';
import { aboutPortableTextComponents } from '@/components/about/portable-text-components';

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

interface AboutPageContentProps {
  locale: string;
  pageTitle: string;
  subtitle: string;
  heroImageUrl: string;
  heroImageAlt: string;
  missionEyebrow: string;
  missionTitle: string;
  missions: ResolvedAboutMission[];
  organizationEyebrow: string;
  organizationTitle: string;
  organizationBody?: { _type: string; [key: string]: unknown }[];
  organizationFallback: string;
  organizationImageUrl: string;
  organizationImageAlt: string;
  figuresEyebrow: string;
  figuresTitle: string;
  figures: AboutFigure[];
}

function parseFigureValue(value: string) {
  const match = value.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!match) {
    return { numeric: null as number | null, prefix: '', suffix: '', decimals: 0 };
  }
  const [, prefix, num, suffix] = match;
  return {
    numeric: Number.parseFloat(num),
    prefix,
    suffix,
    decimals: num.includes('.') ? num.split('.')[1].length : 0,
  };
}

function AnimatedFigure({ value }: { value: string }) {
  const parsed = parseFigureValue(value);
  if (parsed.numeric === null || Number.isNaN(parsed.numeric)) {
    return <span>{value}</span>;
  }
  return (
    <span>
      {parsed.prefix}
      <CountUp end={parsed.numeric} duration={1.4} decimals={parsed.decimals} />
      {parsed.suffix}
    </span>
  );
}

function TricolourStripe() {
  return (
    <div className="flex h-[3px] w-full" aria-hidden="true">
      <span className="flex-1 bg-rdc-blue" />
      <span className="flex-1 bg-rdc-yellow" />
      <span className="flex-1 bg-rdc-red" />
    </div>
  );
}

export function AboutPageContent({
  locale,
  pageTitle,
  subtitle,
  heroImageUrl,
  heroImageAlt,
  missionEyebrow,
  missionTitle,
  missions,
  organizationEyebrow,
  organizationTitle,
  organizationBody,
  organizationFallback,
  organizationImageUrl,
  organizationImageAlt,
  figuresEyebrow,
  figuresTitle,
  figures,
}: AboutPageContentProps) {
  const isFr = locale === 'fr';

  return (
    <div className="min-h-screen bg-white">
      <TricolourStripe />

      {/* Hero */}
      <section className="relative min-h-[72vh] overflow-hidden">
        <motion.div className="absolute inset-0" initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease }}>
          <img src={heroImageUrl} alt={heroImageAlt} className="h-full w-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-gray-900/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/20 to-transparent" />
        <div className="absolute inset-0 bg-black/25" />

        <div className="relative mx-auto flex min-h-[72vh] w-full max-w-[1360px] flex-col items-start justify-end px-4 pb-16 pt-12 text-left sm:px-6 lg:px-8 lg:pb-20">
          <motion.nav
            className="mb-10 flex items-center gap-1.5 text-sm text-white/70"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <Link href={`/${locale}`} className="hover:text-white" aria-label={isFr ? 'Accueil' : 'Home'}>
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4 opacity-50" />
            <span className="text-white">{isFr ? 'À propos' : 'About'}</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.08 }}
            className="w-full max-w-4xl text-left [&_p]:mx-0 [&_p]:ml-0"
          >
            <p className="mb-4 max-w-none text-left text-xs font-bold uppercase tracking-[0.18em] text-rdc-yellow">
              {isFr ? 'République Démocratique du Congo' : 'Democratic Republic of Congo'}
            </p>
            <h1 className="mx-0 max-w-none text-left text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              {pageTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-left text-lg leading-8 text-white/85">{subtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="border-b border-gray-200 bg-[#f9fafb]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <motion.div
            className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease }}
            variants={fadeUp}
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-rdc-blue">
                {isFr ? 'Notre rôle' : 'Our role'}
              </span>
              <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                {isFr
                  ? 'Une institution au service du développement national'
                  : 'An institution serving national development'}
              </h2>
            </div>
            <p className="text-lg leading-8 text-gray-600">
              {isFr
                ? "Créée pour accélérer la mise en œuvre des infrastructures structurantes, la Cellule Infrastructures coordonne les projets, la passation des marchés et le dialogue avec les partenaires au bénéfice des Congolais."
                : 'Created to accelerate structural infrastructure delivery, the Infrastructure Unit coordinates projects, procurement and partner engagement for the benefit of Congolese citizens.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Missions — stacked editorial sections */}
      <section className="relative">
        <div className="border-b border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-7xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            transition={{ duration: 0.45, ease }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-rdc-blue">
              {missionEyebrow}
            </span>
            <h2 className="mt-2 max-w-2xl text-3xl font-bold text-gray-900 sm:text-4xl">
              {missionTitle}
            </h2>
          </motion.div>
        </div>

        {missions.map((mission, index) => {
          const isEven = index % 2 === 0;
          const title = isFr ? mission.titleFr : mission.titleEn;
          const description = isFr ? mission.descriptionFr : mission.descriptionEn;
          const highlights = isFr ? mission.highlightsFr : mission.highlightsEn;

          return (
            <motion.article
              key={mission.slug}
              id={mission.slug}
              className={cnSection(index)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, ease, delay: 0.05 }}
            >
              <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
                <div className={isEven ? 'order-1' : 'order-1 lg:order-2'}>
                  <div className="relative overflow-hidden shadow-[0_20px_60px_rgba(10,37,64,0.18)]">
                    <TricolourStripe />
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={mission.imageUrl}
                        alt={mission.imageAlt || title}
                        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.04]"
                        loading={index < 2 ? 'eager' : 'lazy'}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a2540]/40 to-transparent" />
                    </div>
                  </div>
                </div>

                <div className={isEven ? 'order-2' : 'order-2 lg:order-1'}>
                  <span className="text-sm font-bold tabular-nums text-rdc-blue">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                    {title}
                  </h3>
                  <p className="mt-5 text-lg leading-8 text-gray-600">{description}</p>

                  {highlights.length > 0 && (
                    <ul className="mt-8 space-y-3 border-l-2 border-rdc-blue/20 pl-5">
                      {highlights.map((item) => (
                        <li key={item} className="text-sm leading-6 text-gray-700">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  <Link
                    href={`/${locale}/a-propos/missions/${mission.slug}`}
                    className="group mt-10 inline-flex items-center gap-2 rounded-full bg-rdc-blue px-6 py-3 text-sm font-semibold text-white no-underline transition-all duration-300 hover:bg-[#0066cc] hover:gap-3"
                  >
                    {isFr ? 'En savoir plus' : 'Learn more'}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </motion.article>
          );
        })}
      </section>

      {/* Organization */}
      <section className="border-t border-gray-200 bg-[#f9fafb]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease }}
            >
              <div className="overflow-hidden shadow-lg">
                <TricolourStripe />
                <img
                  src={organizationImageUrl}
                  alt={organizationImageAlt}
                  className="aspect-[4/5] w-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease }}
            >
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-rdc-blue">
                {organizationEyebrow}
              </span>
              <h2 className="mt-2 mb-8 text-3xl font-bold text-gray-900">{organizationTitle}</h2>
              <div className="border-l-4 border-rdc-blue bg-white p-8 shadow-sm">
                {organizationBody?.length ? (
                  <PortableText value={organizationBody} components={aboutPortableTextComponents} />
                ) : (
                  <p className="leading-8 text-gray-700">{organizationFallback}</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Figures */}
      <section className="bg-[#17418a] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-12 max-w-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.45, ease }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-rdc-yellow">
              {figuresEyebrow}
            </span>
            <h2 className="mt-2 text-3xl font-bold text-white">{figuresTitle}</h2>
          </motion.div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 lg:grid-cols-4">
            {figures.map((stat, index) => {
              const label = (isFr ? stat.labelFr : stat.labelEn) || stat.labelFr || '';
              const value = stat.value || '';

              return (
                <motion.div
                  key={`${value}-${index}`}
                  className="bg-[#17418a] px-6 py-8 sm:px-8 sm:py-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease, delay: index * 0.06 }}
                >
                  <div className="text-3xl font-bold text-white sm:text-4xl">
                    <AnimatedFigure value={value} />
                  </div>
                  <p className="mt-2 text-sm text-blue-100">{label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function cnSection(index: number) {
  return index % 2 === 0 ? 'bg-white' : 'bg-[#f9fafb] border-y border-gray-200';
}
