"use client";

import { useLocale, useTranslations } from "next-intl";
import { Briefcase, MapPin, DollarSign, CheckCircle } from "lucide-react";
import CountUp from "@/components/ui/count-up";

export function StatsSection() {
  const t = useTranslations("home.stats");
  const locale = useLocale();

  const stats = [
    {
      id: 1,
      name: t("projects"),
      value: 250,
      icon: Briefcase,
      suffix: "+",
    },
    {
      id: 2,
      name: t("provinces"),
      value: 26,
      icon: MapPin,
      suffix: "",
    },
    {
      id: 3,
      name: t("budget"),
      value: 5.2,
      icon: DollarSign,
      prefix: "$",
      suffix: "B",
    },
    {
      id: 4,
      name: t("completed"),
      value: 180,
      icon: CheckCircle,
      suffix: "+",
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-wide">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rdc-blue/10">
                  <Icon className="h-8 w-8 text-rdc-blue" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.prefix}
                  <CountUp end={stat.value} duration={2} />
                  {stat.suffix}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {stat.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
