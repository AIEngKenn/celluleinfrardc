"use client";

import { useLocale } from "next-intl";

// Placeholder partner data
const partners = [
  { id: 1, name: "World Bank", logo: "/logos/worldbank.svg" },
  { id: 2, name: "African Development Bank", logo: "/logos/afdb.svg" },
  { id: 3, name: "European Union", logo: "/logos/eu.svg" },
  { id: 4, name: "USAID", logo: "/logos/usaid.svg" },
  { id: 5, name: "China Road & Bridge", logo: "/logos/crbc.svg" },
  { id: 6, name: "French Development Agency", logo: "/logos/afd.svg" },
];

export function PartnersSection() {
  const locale = useLocale();

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
            <div
              key={partner.id}
              className="flex items-center justify-center rounded-lg bg-gray-50 p-6 grayscale hover:grayscale-0 transition-all hover:bg-white hover:shadow-lg"
            >
              <div className="flex h-16 w-full items-center justify-center">
                {/* Placeholder for logo */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-400">
                    {partner.name.charAt(0)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {partner.name}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
