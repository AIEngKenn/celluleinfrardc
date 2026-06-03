'use client';

import { useLocale } from 'next-intl';
import CountUp from '@/components/ui/count-up';

export function StatsSection() {
  const locale = useLocale();
  const isFr = locale === 'fr';

  const stats = [
    {
      id: 1,
      value: 250,
      suffix: '+',
      labelFr: 'Projets en cours',
      labelEn: 'Active projects',
    },
    {
      id: 2,
      value: 26,
      suffix: '',
      labelFr: 'Provinces couvertes',
      labelEn: 'Provinces covered',
    },
    {
      id: 3,
      prefix: '$',
      value: 5.2,
      suffix: 'Mrd',
      labelFr: 'Budget engagé',
      labelEn: 'Committed budget',
    },
    {
      id: 4,
      value: 180,
      suffix: '+',
      labelFr: 'Projets achevés',
      labelEn: 'Completed projects',
    },
  ];

  return (
    <section className="ci-stats">
      <div className="ci-stats-grid">
        {stats.map((stat) => (
          <div key={stat.id} className="ci-stat-item">
            <div className="ci-stat-number">
              {stat.prefix}
              <CountUp end={stat.value} duration={2} decimals={stat.value % 1 !== 0 ? 1 : 0} />
              {stat.suffix}
            </div>
            <div className="ci-stat-label">{isFr ? stat.labelFr : stat.labelEn}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
