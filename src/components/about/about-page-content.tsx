'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Home, ArrowRight } from 'lucide-react';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import CountUp from '@/components/ui/count-up';
import type { AboutFigure, AboutMission } from '@/lib/sanity/types';

const PLACEHOLDER_IMAGE = '/images/placeholders/RDC-Drapeau-CUA.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const articleComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 leading-7 text-slate-600 last:mb-0">{children}</p>
    ),
    h2: ({ children }) => (
      <h3 className="mb-3 mt-6 text-xl font-bold text-slate-900">{children}</h3>
    ),
    h3: ({ children }) => (
      <h4 className="mb-2 mt-4 text-lg font-semibold text-slate-900">{children}</h4>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 ml-5 list-disc space-y-2 text-slate-600">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 ml-5 list-decimal space-y-2 text-slate-600">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
};

interface ResolvedMission extends AboutMission {
  imageUrl: string;
  imageAlt: string;
}

interface AboutPageContentProps {
  locale: string;
  pageTitle: string;
  subtitle: string;
  heroImageUrl: string;
  heroImageAlt: string;
  missionEyebrow: string;
  missionTitle: string;
  missions: ResolvedMission[];
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
  const numeric = Number.parseFloat(num);
  const decimals = num.includes('.') ? num.split('.')[1].length : 0;
  return { numeric, prefix, suffix, decimals };
}

function AnimatedFigure({ value }: { value: string }) {
  const parsed = parseFigureValue(value);

  if (parsed.numeric === null || Number.isNaN(parsed.numeric)) {
    return <span>{value}</span>;
  }

  return (
    <span>
      {parsed.prefix}
      <CountUp end={parsed.numeric} duration={1.6} decimals={parsed.decimals} />
      {parsed.suffix}
    </span>
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
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.img
            src={heroImageUrl}
            alt={heroImageAlt}
            className="h-full w-full object-cover"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 sm:pb-24 sm:pt-14 lg:px-8 lg:pb-28">
          <motion.nav
            className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-white/75"
            aria-label={isFr ? "Fil d'Ariane" : 'Breadcrumb'}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.45 }}
          >
            <Link href={`/${locale}`} className="inline-flex items-center hover:text-white" aria-label={isFr ? 'Accueil' : 'Home'}>
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4 opacity-60" aria-hidden="true" />
            <span className="font-medium text-white">{isFr ? 'À propos' : 'About'}</span>
          </motion.nav>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.45 }}
              className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-rdc-yellow"
            >
              Cellule Infrastructures · RDC
            </motion.p>
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl"
            >
              {pageTitle}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg"
            >
              {subtitle}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Missions */}
      <section className="relative -mt-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="mb-8 sm:mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            transition={{ duration: 0.45 }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rdc-blue">
              {missionEyebrow}
            </span>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{missionTitle}</h2>
          </motion.div>

          <motion.div
            className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={stagger}
          >
            {missions.map((mission, index) => {
              const title = (isFr ? mission.titleFr : mission.titleEn) || mission.titleFr || '';
              const description =
                (isFr ? mission.descriptionFr : mission.descriptionEn) || mission.descriptionFr || '';

              return (
                <motion.article
                  key={`${title}-${index}`}
                  variants={fadeUp}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative overflow-hidden rounded-3xl bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80 transition-[transform,box-shadow] duration-500 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(15,23,42,0.16)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={mission.imageUrl}
                      alt={mission.imageAlt || title}
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                      loading={index < 2 ? 'eager' : 'lazy'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent transition-opacity duration-500 group-hover:from-slate-950/90" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="mb-2 inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-lg font-bold leading-snug text-white">{title}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm leading-6 text-slate-600">{description}</p>
                    <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-rdc-blue opacity-0 transition-all duration-300 group-hover:opacity-100">
                      {isFr ? 'En savoir plus' : 'Learn more'}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Organization */}
      <section className="ci-container ci-section">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <motion.div
            className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-slate-200/80"
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4]">
              <img
                src={organizationImageUrl}
                alt={organizationImageAlt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
                {organizationEyebrow}
              </p>
              <p className="mt-1 text-2xl font-bold text-white">{organizationTitle}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rdc-blue">
              {organizationEyebrow}
            </span>
            <h2 className="mt-2 mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">
              {organizationTitle}
            </h2>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {organizationBody?.length ? (
                <PortableText value={organizationBody} components={articleComponents} />
              ) : (
                <p className="leading-7 text-slate-600">{organizationFallback}</p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Figures */}
      <section className="bg-slate-900 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-10 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            transition={{ duration: 0.45 }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rdc-yellow">
              {figuresEyebrow}
            </span>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{figuresTitle}</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={stagger}
          >
            {figures.map((stat, index) => {
              const label = (isFr ? stat.labelFr : stat.labelEn) || stat.labelFr || '';
              const value = stat.value || '';

              return (
                <motion.div
                  key={`${value}-${index}`}
                  variants={fadeUp}
                  transition={{ duration: 0.45 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-rdc-yellow/40 hover:bg-white/10"
                >
                  <div className="text-3xl font-bold text-white sm:text-4xl">
                    <AnimatedFigure value={value} />
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{label}</p>
                  <div className="mt-4 h-0.5 w-8 rounded-full bg-rdc-yellow/40 transition-all duration-300 group-hover:w-14 group-hover:bg-rdc-yellow" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
