"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Calendar, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Placeholder data
const news = [
  {
    id: 1,
    titleFr: "Lancement officiel des travaux de réhabilitation de la RN1",
    titleEn: "Official launch of RN1 rehabilitation works",
    excerptFr:
      "Le ministre des Infrastructures a procédé au lancement officiel des travaux...",
    excerptEn:
      "The Minister of Infrastructure officially launched the works...",
    date: "2024-05-15",
    category: "Projets",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    titleFr: "Signature d'un accord de financement pour Inga 3",
    titleEn: "Signing of financing agreement for Inga 3",
    excerptFr:
      "Un accord historique de financement a été signé pour le projet Inga 3...",
    excerptEn:
      "A historic financing agreement was signed for the Inga 3 project...",
    date: "2024-05-10",
    category: "Financement",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    titleFr: "Visite de terrain des partenaires internationaux",
    titleEn: "Field visit by international partners",
    excerptFr:
      "Une délégation de partenaires internationaux a effectué une visite...",
    excerptEn: "A delegation of international partners conducted a visit...",
    date: "2024-05-08",
    category: "Partenariats",
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop",
  },
];

export function LatestNews() {
  const t = useTranslations("home.sections");
  const locale = useLocale();

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-wide">
        {/* Section Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t("latestNews")}
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              {locale === "fr"
                ? "Restez informé des dernières actualités"
                : "Stay informed with the latest news"}
            </p>
          </div>
          <Link
            href={`/${locale}/actualites`}
            className="hidden sm:flex items-center gap-2 text-rdc-blue hover:text-rdc-blue/80 font-medium transition-colors"
          >
            {locale === "fr" ? "Toutes les actualités" : "All news"}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {news.map((article) => (
            <Link
              key={article.id}
              href={`/${locale}/actualites/${article.id}`}
              className="group overflow-hidden rounded-lg bg-white border border-gray-200 transition-all hover:shadow-lg"
            >
              {/* Image */}
              <div className="aspect-video w-full overflow-hidden bg-gray-200">
                <img
                  src={article.image}
                  alt={locale === "fr" ? article.titleFr : article.titleEn}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="inline-flex rounded-full bg-rdc-yellow/20 px-3 py-1 text-xs font-medium text-gray-900">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(article.date, locale)}</span>
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 group-hover:text-rdc-blue transition-colors line-clamp-2">
                  {locale === "fr" ? article.titleFr : article.titleEn}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {locale === "fr" ? article.excerptFr : article.excerptEn}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href={`/${locale}/actualites`}
            className="flex items-center gap-2 text-rdc-blue hover:text-rdc-blue/80 font-medium transition-colors"
          >
            {locale === "fr" ? "Toutes les actualités" : "All news"}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
