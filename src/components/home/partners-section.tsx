"use client";

import { useLocale } from "next-intl";
import type { HomePartner } from "@/lib/sanity/types";

export function PartnersSection({ partners }: { partners?: HomePartner[] }) {
  const locale = useLocale();
  if (!partners?.length) return null;

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-wide">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {locale === "fr" ? "Nos Partenaires" : "Our Partners"}
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            {locale === "fr"
              ? "Collaborations stratégiques pour le développement des infrastructures"
              : "Strategic partnerships for infrastructure development"}
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.url || '#'}
              target={partner.url ? '_blank' : undefined}
              rel={partner.url ? 'noopener noreferrer' : undefined}
              className="flex items-center justify-center rounded-lg bg-gray-50 p-6 grayscale hover:grayscale-0 transition-all hover:bg-white hover:shadow-lg"
            >
              <div className="flex h-16 w-full items-center justify-center">
                {partner.logo?.asset?.url ? (
                  <img src={partner.logo.asset.url} alt={partner.name} className="max-h-14 max-w-full object-contain" />
                ) : (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-400">{partner.name.charAt(0)}</div>
                    <div className="text-xs text-gray-500 mt-1">{partner.name}</div>
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
