'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';
import type { ProjectMapData } from '@/lib/sanity/types';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const getMarkerColor = (status: string) => {
  switch (status) {
    case 'completed':
      return '#10b981'; // green
    case 'ongoing':
      return '#007FFF'; // rdc-blue
    case 'preparation':
      return '#f59e0b'; // yellow
    default:
      return '#6b7280'; // gray
  }
};

interface GeomaticsMapProps {
  projects: ProjectMapData[];
}

export default function GeomaticsMap({ projects }: GeomaticsMapProps) {
  const t = useTranslations('geomatics');
  const locale = useLocale() as 'fr' | 'en';
  const [selectedProject, setSelectedProject] = useState<ProjectMapData | null>(null);
  const [filter, setFilter] = useState<{
    status?: string;
    sector?: string;
  }>({});

  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    if (filter.status && project.status !== filter.status) return false;
    if (filter.sector && project.sector !== filter.sector) return false;
    return true;
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map centered on DRC
    const map = L.map(containerRef.current).setView([-4.0383, 21.7587], 6);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when filtered projects change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    filteredProjects.forEach((project) => {
      if (!project.location) return;

      const markerIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          background-color: ${getMarkerColor(project.status)};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([project.location.lat, project.location.lng], {
        icon: markerIcon,
      })
        .addTo(mapRef.current!)
        .on('click', () => {
          setSelectedProject(project);
        });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      mapRef.current!.fitBounds(group.getBounds().pad(0.1));
    }
  }, [filteredProjects]);

  const statuses = ['preparation', 'ongoing', 'completed', 'suspended'];
  const sectors = [
    'roads',
    'bridges',
    'water',
    'electricity',
    'schools',
    'hospitals',
    'ports',
    'airports',
  ];

  return (
    <div className="relative h-[calc(100vh-200px)] min-h-[600px]">
      {/* Filters */}
      <div className="absolute left-4 top-4 z-[1000] max-w-xs rounded-lg bg-white p-4 shadow-lg">
        <h3 className="mb-3 font-bold text-gray-900">{t('filters')}</h3>

        <div className="space-y-3">
          {/* Status Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('filterByStatus')}
            </label>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={!filter.status ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setFilter({ ...filter, status: undefined })}
              >
                {t('all')}
              </Badge>
              {statuses.map((status) => (
                <Badge
                  key={status}
                  variant={filter.status === status ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setFilter({ ...filter, status })}
                >
                  {t(`status.${status}`)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Sector Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t('filterBySector')}
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={filter.sector || ''}
              onChange={(e) => setFilter({ ...filter, sector: e.target.value || undefined })}
            >
              <option value="">{t('allSectors')}</option>
              {sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {t(`sectors.${sector}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 border-t border-gray-200 pt-3 text-sm text-gray-600">
          {t('projectsShown', { count: filteredProjects.length })}
        </div>
      </div>

      {/* Selected Project Info */}
      {selectedProject && (
        <div className="absolute right-4 top-4 z-[1000] max-w-sm rounded-lg bg-white p-4 shadow-lg">
          <div className="mb-3 flex items-start justify-between">
            <h3 className="pr-8 font-bold text-gray-900">
              {locale === 'fr' ? selectedProject.titleFr : selectedProject.titleEn}
            </h3>
            <button
              onClick={() => setSelectedProject(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {selectedProject.mainImage && (
            <div className="mb-3 aspect-video overflow-hidden rounded-lg bg-gray-200">
              <img
                src={selectedProject.mainImage.asset.url}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline">{t(`status.${selectedProject.status}`)}</Badge>
              <Badge variant="secondary">{t(`sectors.${selectedProject.sector}`)}</Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>
                {locale === 'fr'
                  ? selectedProject.province.nameFr
                  : selectedProject.province.nameEn}
              </span>
            </div>
          </div>

          <a
            href={`/${locale}/projets/${selectedProject.slug}`}
            className="block w-full rounded-md bg-rdc-blue px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-rdc-blue/90"
          >
            {t('viewProject')}
          </a>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] rounded-lg bg-white p-4 shadow-lg">
        <h4 className="mb-2 text-sm font-semibold text-gray-900">{t('legend')}</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: getMarkerColor('completed') }}
            />
            <span className="text-gray-700">{t('status.completed')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: getMarkerColor('ongoing') }}
            />
            <span className="text-gray-700">{t('status.ongoing')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: getMarkerColor('preparation') }}
            />
            <span className="text-gray-700">{t('status.preparation')}</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div ref={containerRef} className="z-0 h-full w-full rounded-lg" />
    </div>
  );
}
