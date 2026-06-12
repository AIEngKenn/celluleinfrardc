"use client";

import { useMemo, type CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { HomePartner } from "@/lib/sanity/types";
import { getPartnerLogoUrl } from "@/lib/home/resolve-home-partners";
import CountUp from "@/components/ui/count-up";

const ease = [0.22, 1, 0.36, 1] as const;

interface PartnersSectionProps {
  partners: HomePartner[];
  eyebrowFr?: string;
  eyebrowEn?: string;
  titleFr?: string;
  titleEn?: string;
  descriptionFr?: string;
  descriptionEn?: string;
}

interface PartnerTileProps {
  partner: HomePartner;
  visitLabel: string;
  duplicate?: boolean;
}

function PartnerTile({ partner, visitLabel, duplicate = false }: PartnerTileProps) {
  const logoUrl = getPartnerLogoUrl(partner);

  const inner = (
    <>
      <div className="flex h-[3.25rem] w-full items-center justify-center sm:h-[3.75rem]">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={partner.logo?.alt || partner.name}
            className="max-h-full max-w-[78%] object-contain transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
            draggable={false}
          />
        ) : (
          <div className="flex items-center gap-3 px-1">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#17418a] text-base font-black text-white">
              {partner.name.charAt(0)}
            </span>
            <span className="line-clamp-2 text-left text-sm font-semibold leading-snug text-[#0a2540]">
              {partner.name}
            </span>
          </div>
        )}
      </div>

      <span className="pointer-events-none absolute inset-x-4 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-rdc-blue via-rdc-yellow to-rdc-red transition-transform duration-500 ease-out group-hover:scale-x-100" />

      {partner.url ? (
        <span className="pointer-events-none absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#17418a] text-white opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1">
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      ) : null}
    </>
  );

  const className =
    "group relative flex h-[5.5rem] w-[11.5rem] shrink-0 flex-col justify-center rounded-2xl border border-gray-200/80 bg-white px-4 shadow-[0_8px_24px_rgba(10,37,64,0.06)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#17418a]/25 hover:shadow-[0_16px_36px_rgba(10,37,64,0.12)] sm:h-[6.25rem] sm:w-[13rem]";

  if (partner.url) {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={visitLabel}
        aria-hidden={duplicate || undefined}
        tabIndex={duplicate ? -1 : undefined}
      >
        {inner}
      </a>
    );
  }

  return (
    <div
      className={className}
      aria-label={partner.name}
      aria-hidden={duplicate || undefined}
    >
      {inner}
    </div>
  );
}

export function PartnersSection({
  partners,
  eyebrowFr,
  eyebrowEn,
  titleFr,
  titleEn,
  descriptionFr,
  descriptionEn,
}: PartnersSectionProps) {
  const locale = useLocale();
  const t = useTranslations("home.partners");
  const isFr = locale === "fr";

  const eyebrow = (isFr ? eyebrowFr : eyebrowEn) || t("eyebrow");
  const title = (isFr ? titleFr : titleEn) || t("title");
  const description = (isFr ? descriptionFr : descriptionEn) || t("description");

  const marqueeDuration = useMemo(
    () => `${Math.max(partners.length * 5.5, 28)}s`,
    [partners.length]
  );

  const loopPartners = useMemo(() => [...partners, ...partners], [partners]);

  const visitLabel = (name: string) => t("visitSite", { name });

  return (
    <section
      className="overflow-hidden bg-[#f9fafb] py-16 sm:py-20"
      aria-labelledby="home-partners-heading"
    >
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease }}
        >
          <div className="max-w-2xl text-left">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-rdc-blue">
              {eyebrow}
            </span>
            <h2
              id="home-partners-heading"
              className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl"
            >
              {title}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
              {description}
            </p>
          </div>

          <div className="inline-flex items-center gap-3 rounded-2xl border border-[#17418a]/10 bg-white px-4 py-3 shadow-sm">
            <div className="text-3xl font-bold tabular-nums text-[#17418a] sm:text-4xl">
              <CountUp end={partners.length} duration={1.4} decimals={0} />
            </div>
            <p className="max-w-[8rem] text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t("countLabel")}
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease, delay: 0.05 }}
      >
        <div
          className="ci-partners-marquee group relative overflow-hidden py-2"
          style={{ "--marquee-duration": marqueeDuration } as CSSProperties}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#f9fafb] via-[#f9fafb]/90 to-transparent sm:w-24 lg:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#f9fafb] via-[#f9fafb]/90 to-transparent sm:w-24 lg:w-32" />

          <div className="ci-partners-track flex w-max items-stretch gap-4 sm:gap-5">
            {loopPartners.map((partner, index) => (
              <PartnerTile
                key={`${partner._id ?? partner.name}-${index}`}
                partner={partner}
                visitLabel={visitLabel(partner.name)}
                duplicate={index >= partners.length}
              />
            ))}
          </div>
        </div>

        <div className="ci-partners-static mt-0 flex-wrap justify-center gap-4 px-4 sm:gap-5 sm:px-6 lg:px-8">
          {partners.map((partner) => (
            <PartnerTile
              key={partner._id ?? partner.name}
              partner={partner}
              visitLabel={visitLabel(partner.name)}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
