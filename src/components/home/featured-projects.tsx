'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import type { Project } from '@/lib/sanity/types';
import { formatCurrency } from '@/lib/sanity/types';
import { truncateText } from '@/lib/content-cleanup';

const PROJECT_PLACEHOLDER_IMAGE = '/images/placeholders/RDC-Drapeau-CUA.jpg';
const ease = [0.22, 1, 0.36, 1] as const;

function TricolourStripe() {
  return (
    <div className="flex h-[3px] w-full" aria-hidden="true">
      <span className="flex-1 bg-rdc-blue" />
      <span className="flex-1 bg-rdc-yellow" />
      <span className="flex-1 bg-rdc-red" />
    </div>
  );
}

function statusClass(status: string) {
  if (status === 'ongoing') return 'bg-rdc-blue text-white';
  if (status === 'completed') return 'bg-emerald-600 text-white';
  if (status === 'suspended') return 'bg-rdc-yellow text-gray-900';
  return 'bg-gray-600 text-white';
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

  const [featured, ...restAll] = projects;
  const rest = restAll.slice(0, 3);
  const featuredTitle = isFr ? featured.titleFr : featured.titleEn;
  const featuredImage = featured.mainImage?.asset?.url || PROJECT_PLACEHOLDER_IMAGE;

  return (
    <section className="overflow-hidden bg-[#f9fafb] py-16 sm:py-20" aria-labelledby="home-projects-heading">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease }}
        >
          <div className="text-left">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-rdc-blue">
              {isFr ? 'Projets phares' : 'Featured projects'}
            </span>
            <h2 id="home-projects-heading" className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              {isFr ? 'Projets structurants' : 'Structural projects'}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
              {isFr
                ? "Les chantiers prioritaires qui transforment les infrastructures sur l'ensemble du territoire."
                : 'Priority works transforming infrastructure across the country.'}
            </p>
          </div>

          <Link
            href={`/${locale}/projets`}
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-rdc-blue transition-all hover:gap-3"
          >
            {isFr ? 'Tous les projets' : 'All projects'}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Featured */}
          <motion.div
            className="transition-transform duration-500 ease-out hover:-translate-y-1 lg:col-span-7"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease }}
          >
            <Link
              href={`/${locale}/projets/${featured.slug}`}
              className="group block overflow-hidden rounded-3xl bg-white shadow-[0_16px_50px_rgba(10,37,64,0.12)] ring-1 ring-gray-200/80 transition-[box-shadow] duration-500 hover:shadow-[0_24px_60px_rgba(10,37,64,0.18)]"
            >
              <TricolourStripe />
              <div className="relative isolate min-h-[320px] overflow-hidden rounded-b-3xl sm:min-h-[420px] lg:min-h-[480px]">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="h-full w-full origin-center transition-transform duration-[900ms] ease-out will-change-transform group-hover:scale-[1.05]">
                    <img
                      src={featuredImage}
                      alt={featured.mainImage?.alt || featuredTitle}
                      loading="eager"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/45 to-gray-900/15" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 via-transparent to-transparent" />

                <div className="absolute left-5 top-5 flex flex-wrap gap-2 sm:left-6 sm:top-6">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold sm:text-xs ${statusClass(
                      featured.status
                    )}`}
                  >
                    {statusLabel(featured.status, isFr)}
                  </span>
                  <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm sm:text-xs">
                    {featured.sector}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-8">
                  <div className="mb-3 flex items-center gap-2 text-xs text-white/80 sm:text-sm">
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{isFr ? featured.province.nameFr : featured.province.nameEn}</span>
                  </div>

                  <h3 className="mb-4 max-w-2xl text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                    {truncateText(featuredTitle, 110)}
                  </h3>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-4">
                    {featured.budget ? (
                      <span className="text-base font-bold text-white sm:text-lg">
                        {formatCurrency(featured.budget, locale as 'fr' | 'en')}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-all group-hover:gap-3">
                      {isFr ? 'Voir le projet' : 'View project'}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Side list */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            {rest.map((project, index) => {
              const projectTitle = isFr ? project.titleFr : project.titleEn;
              const projectImage = project.mainImage?.asset?.url || PROJECT_PLACEHOLDER_IMAGE;

              return (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.45, ease, delay: index * 0.08 }}
                >
                  <Link
                    href={`/${locale}/projets/${project.slug}`}
                    className="group flex overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-rdc-blue/25 hover:shadow-lg"
                  >
                    <div className="relative w-[34%] min-w-[112px] max-w-[148px] shrink-0 overflow-hidden bg-gray-100 sm:w-[38%]">
                      <img
                        src={projectImage}
                        alt={project.mainImage?.alt || projectTitle}
                        loading="lazy"
                        className="h-full min-h-[112px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent" />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold sm:text-[11px] ${statusClass(
                            project.status
                          )}`}
                        >
                          {statusLabel(project.status, isFr)}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-rdc-blue sm:text-[11px]">
                          {project.sector}
                        </span>
                      </div>

                      <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-snug text-gray-900 transition-colors group-hover:text-rdc-blue sm:text-base">
                        {truncateText(projectTitle, 90)}
                      </h3>

                      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                        <span className="flex items-center gap-1 text-[11px] text-gray-500 sm:text-xs">
                          <MapPin className="h-3.5 w-3.5 text-rdc-blue" aria-hidden="true" />
                          <span className="truncate">
                            {isFr ? project.province.nameFr : project.province.nameEn}
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-rdc-blue opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
