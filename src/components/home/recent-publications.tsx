"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { FileText, Download, ArrowRight } from "lucide-react";

// Placeholder data
const publications = [
  {
    id: 1,
    titleFr: "Rapport Annuel 2023 - Cellule Infrastructures",
    titleEn: "2023 Annual Report - Cellule Infrastructures",
    type: "Rapport",
    pages: 156,
    size: "12.5 MB",
  },
  {
    id: 2,
    titleFr: "Étude d'Impact Environnemental - Projet Inga 3",
    titleEn: "Environmental Impact Study - Inga 3 Project",
    type: "Environnemental",
    pages: 320,
    size: "28.3 MB",
  },
  {
    id: 3,
    titleFr: "Plan Stratégique de Développement des Infrastructures 2024-2028",
    titleEn: "Strategic Infrastructure Development Plan 2024-2028",
    type: "Planification",
    pages: 89,
    size: "8.7 MB",
  },
  {
    id: 4,
    titleFr: "Guide des Procédures d'Appels d'Offres",
    titleEn: "Procurement Procedures Guide",
    type: "Guide",
    pages: 45,
    size: "3.2 MB",
  },
];

export function RecentPublications() {
  const t = useTranslations("home.sections");
  const locale = useLocale();

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-wide">
        {/* Section Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t("publications")}
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              {locale === "fr"
                ? "Rapports, études et documents officiels"
                : "Reports, studies and official documents"}
            </p>
          </div>
          <Link
            href={`/${locale}/publications`}
            className="hidden sm:flex items-center gap-2 text-rdc-blue hover:text-rdc-blue/80 font-medium transition-colors"
          >
            {locale === "fr" ? "Toutes les publications" : "All publications"}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Publications Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {publications.map((publication) => (
            <Link
              key={publication.id}
              href={`/${locale}/publications/${publication.id}`}
              className="group flex gap-4 rounded-lg bg-white border border-gray-200 p-6 transition-all hover:shadow-lg hover:border-rdc-blue"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-rdc-red/10 group-hover:bg-rdc-red/20 transition-colors">
                  <FileText className="h-8 w-8 text-rdc-red" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="mb-2 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {publication.type}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-rdc-blue transition-colors line-clamp-2">
                  {locale === "fr" ? publication.titleFr : publication.titleEn}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{publication.pages} pages</span>
                  <span>•</span>
                  <span>{publication.size}</span>
                </div>
              </div>

              {/* Download Icon */}
              <div className="flex-shrink-0">
                <Download className="h-5 w-5 text-gray-400 group-hover:text-rdc-blue transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href={`/${locale}/publications`}
            className="flex items-center gap-2 text-rdc-blue hover:text-rdc-blue/80 font-medium transition-colors"
          >
            {locale === "fr" ? "Toutes les publications" : "All publications"}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
