"use client";

import { useLocale } from "next-intl";
import type { HomePartner } from "@/lib/sanity/types";

const fallbackPartners: HomePartner[] = [
  { name: "Gouvernement de la RDC" },
  { name: "Banque mondiale", url: "https://www.worldbank.org" },
  { name: "Banque Africaine de Développement", url: "https://www.afdb.org" },
  { name: "Union européenne", url: "https://european-union.europa.eu" },
  { name: "FONER" },
  { name: "MITP" },
];

export function PartnersSection({ partners }: { partners?: HomePartner[] }) {
  const locale = useLocale();
  const visiblePartners = partners?.length ? partners : fallbackPartners;
  const marqueePartners = [...visiblePartners, ...visiblePartners];

  return (
    <section className="overflow-hidden border-y border-slate-200 bg-white py-20 sm:py-28">
      <div className="container-wide">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-rdc-blue/15 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-rdc-blue">
            {locale === "fr" ? "Réseau institutionnel" : "Institutional network"}
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {locale === "fr" ? "Nos Partenaires" : "Our Partners"}
          </h2>
          <p className="mt-3 text-lg leading-8 text-gray-600">
            {locale === "fr"
              ? "Collaborations stratégiques pour le développement des infrastructures"
              : "Strategic partnerships for infrastructure development"}
          </p>
        </div>

        {/* Partners Marquee */}
        <div className="ci-partners-marquee group relative">
          <div className="ci-partners-track flex w-max items-stretch gap-6">
          {marqueePartners.map((partner, index) => (
            <a
              key={`${partner.name}-${index}`}
              href={partner.url || '#'}
              target={partner.url ? '_blank' : undefined}
              rel={partner.url ? 'noopener noreferrer' : undefined}
              aria-hidden={index >= visiblePartners.length}
              tabIndex={index >= visiblePartners.length ? -1 : undefined}
              className="flex h-40 w-72 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-rdc-blue/30 hover:shadow-lg"
            >
              <div className="flex h-24 w-full items-center justify-center">
                {partner.logo?.asset?.url ? (
                  <img
                    src={partner.logo.asset.url}
                    alt={partner.name}
                    className="max-h-20 max-w-full object-contain grayscale transition duration-300 group-hover:grayscale-0"
                  />
                ) : (
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-rdc-blue/15 bg-rdc-blue text-2xl font-black text-white">
                      {partner.name.charAt(0)}
                    </div>
                    <div className="text-base font-bold leading-snug text-slate-700">{partner.name}</div>
                  </div>
                )}
              </div>
            </a>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
