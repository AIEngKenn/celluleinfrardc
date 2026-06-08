'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import type { Project } from '@/lib/sanity/types';
import { formatCurrency } from '@/lib/sanity/types';
import { truncateText } from '@/lib/content-cleanup';

const PROJECT_PLACEHOLDER_IMAGE = '/images/placeholders/RDC-Drapeau-CUA.jpg';

function statusClass(status: string) {
  if (status === 'ongoing') return 'bg-rdc-blue text-white';
  if (status === 'completed') return 'bg-emerald-600 text-white';
  if (status === 'suspended') return 'bg-amber-500 text-white';
  return 'bg-slate-500 text-white';
}

function statusLabel(status: Project['status'], isFr: boolean) {
  const labels = {
    preparation: isFr ? 'En préparation' : 'In preparation',
    ongoing: isFr ? 'En cours' : 'Ongoing',
    completed: isFr ? 'Terminé' : 'Completed',
    suspended: isFr ? 'Suspendu' : 'Suspended',
  };
  return labels[status] || status;
}

export function FeaturedProjects({ projects }: { projects?: Project[] }) {
  const locale = useLocale();
  const isFr = locale === 'fr';
  if (!projects?.length) return null;

  const [featured, ...rest] = projects;

  const featuredTitle = isFr ? featured.titleFr : featured.titleEn;
  const featuredImage = featured.mainImage?.asset?.url || PROJECT_PLACEHOLDER_IMAGE;

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-10 flex items-end justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rdc-blue">
              {isFr ? 'Projets phares' : 'Featured projects'}
            </span>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
              {isFr ? 'Projets structurants' : 'Structural projects'}
            </h2>
          </div>

          <Link
            href={`/${locale}/projets`}
            className="flex items-center gap-2 text-sm font-semibold text-rdc-blue transition-all hover:gap-3"
          >
            {isFr ? 'Tous les projets' : 'All projects'}
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="grid gap-6 lg:grid-cols-[2fr_1fr]"
        >
          <Link
            href={`/${locale}/projets/${featured.slug}`}
            className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="relative h-full min-h-[420px] overflow-hidden">
              <img
                src={featuredImage}
                alt={featured.mainImage?.alt || featuredTitle}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute left-6 top-6">
                <span
                  className={`rounded-full px-3 py-1 text-[2px] font-semibold md:text-xs ${statusClass(
                    featured.status
                  )}`}
                >
                  {statusLabel(featured.status, isFr)}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="mb-3 flex items-center gap-2 text-sm text-white/80">
                  <MapPin size={14} />
                  <span>{isFr ? featured.province.nameFr : featured.province.nameEn}</span>
                  <span className="opacity-50">•</span>
                  <span>{featured.sector}</span>
                </div>

                <h3 className="mb-4 text-2xl font-bold leading-tight text-white md:text-3xl">
                  {truncateText(featuredTitle, 110)}
                </h3>

                <div className="flex items-center justify-between">
                  {featured.budget ? (
                    <span className="text-lg font-bold text-white">
                      {formatCurrency(featured.budget, locale as 'fr' | 'en')}
                    </span>
                  ) : (
                    <span />
                  )}

                  <div className="flex items-center gap-2 text-sm font-semibold text-white transition-all group-hover:gap-3">
                    {isFr ? 'Voir le projet' : 'View project'}
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <div className="flex flex-col gap-6">
            {rest.map((project) => {
              const projectTitle = isFr ? project.titleFr : project.titleEn;

              const projectImage = project.mainImage?.asset?.url || PROJECT_PLACEHOLDER_IMAGE;

              return (
                <Link
                  key={project._id}
                  href={`/${locale}/projets/${project.slug}`}
                  className="group flex overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative w-40 flex-shrink-0 overflow-hidden bg-slate-100">
                    <img
                      src={projectImage}
                      alt={project.mainImage?.alt || projectTitle}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin size={12} />
                        <span>
                          {isFr
                            ? project.province.nameFr.length > 10
                              ? project.province.nameFr.slice(0, 10) + '...'
                              : project.province.nameFr
                            : project.province.nameEn.length > 10
                              ? project.province.nameEn.slice(0, 10) + '...'
                              : project.province.nameEn}
                        </span>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass(
                          project.status
                        )}`}
                      >
                        {statusLabel(project.status, isFr)}
                      </span>
                    </div>

                    <h3 className="mb-3 line-clamp-2 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-rdc-blue">
                      {truncateText(projectTitle, 80)}
                    </h3>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-rdc-blue">
                        {project.sector}
                      </span>

                      <ArrowRight
                        size={14}
                        className="text-rdc-blue transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
