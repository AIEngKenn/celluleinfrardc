"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Image as ImageIcon } from "lucide-react";

// Placeholder data
const mediaItems = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
    titleFr: "Construction de la route RN1",
    titleEn: "RN1 road construction",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&h=400&fit=crop",
    titleFr: "Barrage hydroélectrique",
    titleEn: "Hydroelectric dam",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    titleFr: "Développement urbain",
    titleEn: "Urban development",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop",
    titleFr: "Infrastructure moderne",
    titleEn: "Modern infrastructure",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop",
    titleFr: "Projet de construction",
    titleEn: "Construction project",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
    titleFr: "Chantier en cours",
    titleEn: "Ongoing construction",
  },
];

export function MediaPreview() {
  const t = useTranslations("home.sections");
  const locale = useLocale();

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="container-wide">
        {/* Section Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t("media")}
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              {locale === "fr"
                ? "Découvrez nos projets en images"
                : "Discover our projects in images"}
            </p>
          </div>
          <Link
            href={`/${locale}/mediatheque`}
            className="hidden sm:flex items-center gap-2 text-rdc-blue hover:text-rdc-blue/80 font-medium transition-colors"
          >
            {locale === "fr" ? "Voir la galerie complète" : "View full gallery"}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {mediaItems.map((item, index) => (
            <Link
              key={item.id}
              href={`/${locale}/mediatheque`}
              className={`group relative overflow-hidden rounded-lg bg-gray-200 ${
                index === 0 || index === 5 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <div
                className={`aspect-square ${index === 0 || index === 5 ? "md:aspect-video" : ""}`}
              >
                <img
                  src={item.image}
                  alt={locale === "fr" ? item.titleFr : item.titleEn}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-sm font-medium text-white">
                      {locale === "fr" ? item.titleFr : item.titleEn}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href={`/${locale}/mediatheque`}
            className="flex items-center gap-2 text-rdc-blue hover:text-rdc-blue/80 font-medium transition-colors"
          >
            {locale === "fr" ? "Voir la galerie complète" : "View full gallery"}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
