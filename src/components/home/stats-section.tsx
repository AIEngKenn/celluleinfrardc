'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import CountUp from '@/components/ui/count-up';
import type { SiteStatistics } from '@/lib/sanity/types';

const ease = [0.22, 1, 0.36, 1] as const;

export function StatsSection({ stats }: { stats?: SiteStatistics }) {
  const locale = useLocale();
  const isFr = locale === 'fr';

  const items = [
    {
      id: 1,
      prefix: '',
      value: stats?.ongoingProjects ?? 0,
      suffix: '+',
      labelFr: 'Projets en cours',
      labelEn: 'Active projects',
    },
    {
      id: 2,
      prefix: '',
      value: stats?.provinces ?? 0,
      suffix: '',
      labelFr: 'Provinces couvertes',
      labelEn: 'Provinces covered',
    },
    {
      id: 3,
      prefix: '',
      value: stats?.publications ?? 0,
      suffix: '+',
      labelFr: 'Publications',
      labelEn: 'Publications',
    },
    {
      id: 4,
      prefix: '',
      value: stats?.completedProjects ?? 0,
      suffix: '+',
      labelFr: 'Projets achevés',
      labelEn: 'Completed projects',
    },
  ];

  return (
    <section className="bg-[#17418a] py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-10 max-w-xl text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, ease }}
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-rdc-yellow">
            {isFr ? 'Chiffres clés' : 'Key figures'}
          </span>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            {isFr ? 'Impact national' : 'National impact'}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 lg:grid-cols-4">
          {items.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="bg-[#17418a] px-5 py-7 sm:px-8 sm:py-9"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, ease, delay: index * 0.06 }}
            >
              <div className="text-3xl font-bold tabular-nums text-white sm:text-4xl">
                {stat.prefix}
                <CountUp
                  end={stat.value}
                  duration={1.6}
                  decimals={stat.value % 1 !== 0 ? 1 : 0}
                />
                {stat.suffix}
              </div>
              <p className="mt-2 text-sm text-blue-100">
                {isFr ? stat.labelFr : stat.labelEn}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
