'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronRight, Home } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import type { ResolvedAboutMission } from '@/lib/about/resolve-missions';
import { aboutPortableTextComponents } from '@/components/about/portable-text-components';

const ease = [0.22, 1, 0.36, 1] as const;

interface MissionDetailContentProps {
  locale: string;
  mission: ResolvedAboutMission;
  otherMissions: ResolvedAboutMission[];
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

export function MissionDetailContent({ locale, mission, otherMissions }: MissionDetailContentProps) {
  const isFr = locale === 'fr';
  const title = isFr ? mission.titleFr : mission.titleEn;
  const description = isFr ? mission.descriptionFr : mission.descriptionEn;
  const highlights = isFr ? mission.highlightsFr : mission.highlightsEn;
  const content = isFr ? mission.contentFr : mission.contentEn;

  return (
    <div className="min-h-screen bg-white">
      <TricolourStripe />

      {/* Hero */}
      <header className="relative min-h-[55vh] overflow-hidden">
        <motion.img
          src={mission.imageUrl}
          alt={mission.imageAlt || title}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease }}
        />
        <div className="absolute inset-0 bg-[#0a2540]/78" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a2540] via-[#0a2540]/30 to-transparent" />

        <div className="relative mx-auto flex min-h-[55vh] max-w-7xl flex-col justify-end px-4 pb-14 pt-10 sm:px-6 lg:px-8">
          <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-white/70" aria-label={isFr ? "Fil d'Ariane" : 'Breadcrumb'}>
            <Link href={`/${locale}`} className="hover:text-white" aria-label={isFr ? 'Accueil' : 'Home'}>
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4 opacity-50" />
            <Link href={`/${locale}/a-propos`} className="hover:text-white">
              {isFr ? 'À propos' : 'About'}
            </Link>
            <ChevronRight className="h-4 w-4 opacity-50" />
            <span className="text-white">{title}</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-rdc-yellow">
              {isFr ? 'Mission' : 'Mission'}
            </p>
            <h1 className="max-w-4xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/85">{description}</p>
          </motion.div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
          >
            <PortableText value={content} components={aboutPortableTextComponents} />
          </motion.article>

          <motion.aside
            className="lg:sticky lg:top-28 lg:self-start"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.15 }}
          >
            {highlights.length > 0 && (
              <div className="mb-6 border border-gray-200 bg-[#f9fafb] p-6">
                <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-rdc-blue">
                  {isFr ? 'Points clés' : 'Key points'}
                </h2>
                <ul className="space-y-3">
                  {highlights.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-gray-700">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rdc-blue" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link
              href={`/${locale}/a-propos`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-rdc-blue no-underline hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              {isFr ? 'Retour à propos' : 'Back to about'}
            </Link>
          </motion.aside>
        </div>
      </main>

      {/* Other missions */}
      {otherMissions.length > 0 && (
        <section className="border-t border-gray-200 bg-[#f9fafb] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-gray-900">
              {isFr ? 'Autres missions' : 'Other missions'}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {otherMissions.map((other, index) => {
                const otherTitle = isFr ? other.titleFr : other.titleEn;
                return (
                  <motion.div
                    key={other.slug}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease, delay: index * 0.06 }}
                  >
                    <Link
                      href={`/${locale}/a-propos/missions/${other.slug}`}
                      className="group block overflow-hidden border border-gray-200 bg-white no-underline shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-rdc-blue/30 hover:shadow-lg"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={other.imageUrl}
                          alt={other.imageAlt || otherTitle}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a2540]/70 to-transparent" />
                        <p className="absolute bottom-4 left-4 right-4 text-lg font-bold text-white">
                          {otherTitle}
                        </p>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3">
                        <span className="text-sm font-semibold text-rdc-blue">
                          {isFr ? 'Découvrir' : 'Discover'}
                        </span>
                        <ArrowRight className="h-4 w-4 text-rdc-blue transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
