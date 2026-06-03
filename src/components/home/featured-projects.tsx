"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { MapPin, Calendar, ArrowRight } from "lucide-react";

// Placeholder data
const projects = [
  {
    id: 1,
    titleFr: "Réhabilitation de la Route Nationale N°1",
    titleEn: "Rehabilitation of National Road N°1",
    province: "Kinshasa",
    status: "En cours",
    budget: 45000000,
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    titleFr: "Construction du Barrage Hydroélectrique Inga 3",
    titleEn: "Construction of Inga 3 Hydroelectric Dam",
    province: "Kongo Central",
    status: "En préparation",
    budget: 120000000,
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    titleFr: "Modernisation de l'Aéroport International de Kinshasa",
    titleEn: "Modernization of Kinshasa International Airport",
    province: "Kinshasa",
    status: "En cours",
    budget: 85000000,
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop",
  },
];

export function FeaturedProjects() {
  const t = useTranslations("home.sections");
  const locale = useLocale();

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="container-wide">
        {/* Section Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t("featuredProjects")}
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              {locale === "fr"
                ? "Projets majeurs transformant les infrastructures de la RDC"
                : "Major projects transforming DRC infrastructure"}
            </p>
          </div>
          <Link
            href={`/${locale}/projets`}
            className="hidden sm:flex items-center gap-2 text-rdc-blue hover:text-rdc-blue/80 font-medium transition-colors"
          >
            {locale === "fr" ? "Voir tous les projets" : "View all projects"}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/${locale}/projets/${project.id}`}
              className="group overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl"
            >
              {/* Image */}
              <div className="aspect-video w-full overflow-hidden bg-gray-200">
                <img
                  src={project.image}
                  alt={locale === "fr" ? project.titleFr : project.titleEn}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>{project.province}</span>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 group-hover:text-rdc-blue transition-colors">
                  {locale === "fr" ? project.titleFr : project.titleEn}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="inline-flex rounded-full bg-rdc-blue/10 px-3 py-1 text-xs font-medium text-rdc-blue">
                    {project.status}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    ${(project.budget / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href={`/${locale}/projets`}
            className="flex items-center gap-2 text-rdc-blue hover:text-rdc-blue/80 font-medium transition-colors"
          >
            {locale === "fr" ? "Voir tous les projets" : "View all projects"}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
