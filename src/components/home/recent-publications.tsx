"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { FileText, Download, ArrowRight } from "lucide-react";
import type { Publication } from "@/lib/sanity/types";
import { cleanMigratedText, truncateText } from "@/lib/content-cleanup";

export function RecentPublications({ publications }: { publications?: Publication[] }) {
  const t = useTranslations("home.sections");
  const locale = useLocale();
  if (!publications?.length) return null;

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
              key={publication._id}
              href={`/${locale}/publications/${publication.slug}`}
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
                  {publication.publicationType}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-rdc-blue transition-colors line-clamp-2">
                  {truncateText(locale === "fr" ? publication.titleFr : publication.titleEn, 105)}
                </h3>
                <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                  {truncateText(
                    cleanMigratedText(locale === "fr" ? publication.descriptionFr : publication.descriptionEn),
                    130
                  )}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{publication.publicationType}</span>
                  {publication.pdfFile?.asset?.size ? (
                    <>
                      <span>•</span>
                      <span>{(publication.pdfFile.asset.size / 1024 / 1024).toFixed(1)} MB</span>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Download Icon */}
              <div className="flex-shrink-0">
                {publication.pdfFile?.asset?.url ? (
                  <Download className="h-5 w-5 text-gray-400 group-hover:text-rdc-blue transition-colors" />
                ) : null}
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
