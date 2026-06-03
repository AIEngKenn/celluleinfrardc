"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Calendar, FileText, ArrowRight, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Placeholder data
const opportunities = [
  {
    id: 1,
    titleFr: "Appel d'offres pour la construction de ponts sur la RN2",
    titleEn: "Tender for bridge construction on RN2",
    reference: "AO-2024-001",
    closingDate: "2024-06-30",
    category: "Travaux",
  },
  {
    id: 2,
    titleFr: "Recrutement de consultants pour l'étude d'impact environnemental",
    titleEn: "Recruitment of consultants for environmental impact study",
    reference: "AO-2024-002",
    closingDate: "2024-06-25",
    category: "Consultance",
  },
  {
    id: 3,
    titleFr: "Fourniture d'équipements pour le projet d'électrification rurale",
    titleEn: "Supply of equipment for rural electrification project",
    reference: "AO-2024-003",
    closingDate: "2024-07-10",
    category: "Fournitures",
  },
];

export function CurrentProcurement() {
  const t = useTranslations("home.sections");
  const locale = useLocale();

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="container-wide">
        {/* Section Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t("procurement")}
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              {locale === "fr"
                ? "Opportunités d'affaires actuelles"
                : "Current business opportunities"}
            </p>
          </div>
          <Link
            href={`/${locale}/appels-offres`}
            className="hidden sm:flex items-center gap-2 text-rdc-blue hover:text-rdc-blue/80 font-medium transition-colors"
          >
            {locale === "fr" ? "Tous les appels d'offres" : "All procurement"}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Opportunities List */}
        <div className="space-y-4">
          {opportunities.map((opportunity) => {
            const daysUntilDeadline = Math.ceil(
              (new Date(opportunity.closingDate).getTime() -
                new Date().getTime()) /
                (1000 * 60 * 60 * 24),
            );
            const isUrgent = daysUntilDeadline <= 7;

            return (
              <Link
                key={opportunity.id}
                href={`/${locale}/appels-offres/${opportunity.id}`}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg bg-white p-6 border border-gray-200 transition-all hover:shadow-lg hover:border-rdc-blue"
              >
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-flex rounded-full bg-rdc-blue/10 px-3 py-1 text-xs font-medium text-rdc-blue">
                      {opportunity.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {opportunity.reference}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-rdc-blue transition-colors mb-2">
                    {locale === "fr"
                      ? opportunity.titleFr
                      : opportunity.titleEn}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {locale === "fr" ? "Date limite: " : "Deadline: "}
                        {formatDate(opportunity.closingDate, locale)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isUrgent && (
                    <div className="flex items-center gap-1 rounded-full bg-rdc-red/10 px-3 py-1">
                      <AlertCircle className="h-4 w-4 text-rdc-red" />
                      <span className="text-xs font-medium text-rdc-red">
                        {daysUntilDeadline} {locale === "fr" ? "jours" : "days"}
                      </span>
                    </div>
                  )}
                  <FileText className="h-5 w-5 text-gray-400 group-hover:text-rdc-blue transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href={`/${locale}/appels-offres`}
            className="flex items-center gap-2 text-rdc-blue hover:text-rdc-blue/80 font-medium transition-colors"
          >
            {locale === "fr" ? "Tous les appels d'offres" : "All procurement"}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
