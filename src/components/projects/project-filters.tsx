'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface Province {
  _id: string;
  nameFr: string;
  nameEn: string;
  slug: string;
}

interface Props {
  provinces: Province[];
  currentProvince?: string;
  currentStatus?: string;
  currentSector?: string;
  locale: string;
  labels: {
    province: string;
    status: string;
    sector: string;
    allProvinces: string;
    allStatuses: string;
    allSectors: string;
    statusOptions: { value: string; label: string }[];
    sectorOptions: { value: string; label: string }[];
  };
}

export function ProjectFilters({
  provinces,
  currentProvince,
  currentStatus,
  currentSector,
  locale,
  labels,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Province */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">{labels.province}</label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 transition-colors focus:border-rdc-blue focus:outline-none focus:ring-1 focus:ring-rdc-blue"
            value={currentProvince || ''}
            onChange={(e) => updateParam('province', e.target.value)}
          >
            <option value="">{labels.allProvinces}</option>
            {provinces.map((p) => (
              <option key={p._id} value={p.slug}>
                {locale === 'fr' ? p.nameFr : p.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">{labels.status}</label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 transition-colors focus:border-rdc-blue focus:outline-none focus:ring-1 focus:ring-rdc-blue"
            value={currentStatus || ''}
            onChange={(e) => updateParam('status', e.target.value)}
          >
            <option value="">{labels.allStatuses}</option>
            {labels.statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sector */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">{labels.sector}</label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 transition-colors focus:border-rdc-blue focus:outline-none focus:ring-1 focus:ring-rdc-blue"
            value={currentSector || ''}
            onChange={(e) => updateParam('sector', e.target.value)}
          >
            <option value="">{labels.allSectors}</option>
            {labels.sectorOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
