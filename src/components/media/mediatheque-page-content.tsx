'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import CountUp from '@/components/ui/count-up';
import type { ResolvedMediaGallery, ResolvedMediaItem } from '@/lib/media/types';
import { MediaHeroShowcase } from '@/components/media/media-hero-showcase';
import { MediaPhotoGrid } from '@/components/media/media-photo-grid';
import { MediaVideoTheater } from '@/components/media/media-video-theater';
import { MediaAlbumGrid } from '@/components/media/media-album-grid';
import { MediaSectionNav } from '@/components/media/media-section-nav';
import { MediaLightbox } from '@/components/media/media-lightbox';

interface MediathequePageContentProps {
  locale: string;
  gallery: ResolvedMediaGallery;
}

const ease = [0.22, 1, 0.36, 1] as const;

function TricolourStripe() {
  return (
    <div className="flex h-[3px] w-full" aria-hidden="true">
      <span className="flex-1 bg-rdc-blue" />
      <span className="flex-1 bg-rdc-yellow" />
      <span className="flex-1 bg-rdc-red" />
    </div>
  );
}

export function MediathequePageContent({ locale, gallery }: MediathequePageContentProps) {
  const t = useTranslations('media');
  const isFr = locale === 'fr';
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [photoFilter, setPhotoFilter] = useState<string>('all');

  const uniquePhotos = useMemo(() => {
    const seen = new Set<string>();
    return gallery.photos.filter((photo) => {
      if (seen.has(photo.id)) {
        return false;
      }
      seen.add(photo.id);
      return true;
    });
  }, [gallery.photos]);

  const projectFilters = useMemo(() => {
    const projects = new Map<string, { slug: string; labelFr: string; labelEn: string }>();
    uniquePhotos.forEach((photo) => {
      if (photo.projectSlug && photo.projectTitleFr) {
        projects.set(photo.projectSlug, {
          slug: photo.projectSlug,
          labelFr: photo.projectTitleFr,
          labelEn: photo.projectTitleEn || photo.projectTitleFr,
        });
      }
    });
    return Array.from(projects.values());
  }, [uniquePhotos]);

  const filteredPhotos = useMemo(() => {
    if (photoFilter === 'all') {
      return uniquePhotos;
    }
    return uniquePhotos.filter((photo) => photo.projectSlug === photoFilter);
  }, [uniquePhotos, photoFilter]);

  const openLightboxAt = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const openPhotoById = (id: string) => {
    const index = filteredPhotos.findIndex((photo) => photo.id === id);
    if (index >= 0) {
      openLightboxAt(index);
    }
  };

  const handleHeroOpenPhoto = (featuredIndex: number) => {
    const item = gallery.featured[featuredIndex];
    if (item?.type === 'image') {
      openPhotoById(item.id);
    }
  };

  const handleSelectVideo = (_item: ResolvedMediaItem) => {
    const videosSection = document.getElementById('media-section-videos');
    if (videosSection) {
      videosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sections = [
    { id: 'spotlight' as const, label: t('spotlight'), count: gallery.featured.length },
    { id: 'photos' as const, label: t('photos'), count: uniquePhotos.length },
    { id: 'videos' as const, label: t('videos'), count: gallery.videos.length },
    { id: 'albums' as const, label: t('albums'), count: gallery.albums.length },
  ];

  const mediaStats = [
    { id: 'photos', value: uniquePhotos.length, label: t('photos') },
    { id: 'videos', value: gallery.videos.length, label: t('videos') },
    { id: 'albums', value: gallery.albums.length, label: t('albums') },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <TricolourStripe />

      <header className="bg-[#17418a] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.nav
            className="mb-8 flex items-center gap-1.5 text-sm text-white/70"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <Link
              href={`/${locale}`}
              className="hover:text-white"
              aria-label={isFr ? 'Accueil' : 'Home'}
            >
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4 opacity-50" aria-hidden="true" />
            <span className="text-white">{t('title')}</span>
          </motion.nav>

          <motion.div
            className="mb-10 max-w-3xl text-left [&_p]:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease, delay: 0.05 }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-rdc-yellow">
              {t('statsEyebrow')}
            </span>
            <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">{t('title')}</h1>
            <p className="mt-4 text-sm leading-7 text-blue-100 sm:text-base">{t('description')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease, delay: 0.1 }}
          >
            <div className="mb-8 max-w-xl text-left">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-rdc-yellow/90">
                {isFr ? 'Chiffres clés' : 'Key figures'}
              </span>
              <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">{t('statsTitle')}</h2>
            </div>

            <div
              className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-3"
              aria-label={t('statsTitle')}
            >
              {mediaStats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  className="bg-[#17418a] px-5 py-7 sm:px-8 sm:py-9"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease, delay: 0.14 + index * 0.06 }}
                >
                  <div className="text-3xl font-bold tabular-nums text-white sm:text-4xl">
                    <CountUp end={stat.value} duration={1.6} decimals={0} />
                  </div>
                  <p className="mt-2 text-sm text-blue-100">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </header>

      {/* {gallery.isDemoContent ? (
        <div className="border-b border-rdc-blue/15 bg-rdc-blue/5 px-4 py-3 text-center text-sm text-[#0a2540] sm:px-6">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-rdc-blue" />
            {t("demoNotice")}
          </span>
        </div>
      ) : null} */}

      <MediaSectionNav locale={locale} sections={sections} />

      <section id="media-section-spotlight" className="scroll-mt-24">
        <MediaHeroShowcase
          locale={locale}
          items={gallery.featured}
          onOpenPhoto={handleHeroOpenPhoto}
          onSelectVideo={handleSelectVideo}
        />
      </section>

      <div className="mx-auto max-w-[1360px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <section id="media-section-photos" className="scroll-mt-28">
          <SectionHeading
            eyebrow={t('photos')}
            title={t('photoGalleryTitle')}
            description={t('photoGalleryDescription')}
          />

          {projectFilters.length > 0 ? (
            <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label={t('byProject')}>
              <FilterChip
                active={photoFilter === 'all'}
                onClick={() => setPhotoFilter('all')}
                label={t('allMedia')}
              />
              {projectFilters.map((project) => (
                <FilterChip
                  key={project.slug}
                  active={photoFilter === project.slug}
                  onClick={() => setPhotoFilter(project.slug)}
                  label={isFr ? project.labelFr : project.labelEn}
                />
              ))}
            </div>
          ) : null}

          <MediaPhotoGrid
            locale={locale}
            photos={filteredPhotos}
            onOpenPhoto={openLightboxAt}
            layoutLabel={t('photoGalleryTitle')}
            resetKey={photoFilter}
            loadingLabel={t('loadingMore')}
          />
        </section>

        <section id="media-section-videos" className="mt-20 scroll-mt-28 sm:mt-24">
          <SectionHeading
            eyebrow={t('videos')}
            title={t('videoTheaterTitle')}
            description={t('videoTheaterDescription')}
          />
          <MediaVideoTheater
            locale={locale}
            videos={gallery.videos}
            labels={{
              watchOnYoutube: t('watchOnYoutube'),
              closePlayer: t('closePlayer'),
              reelLabel: t('videoReel'),
              loadingLabel: t('loadingMore'),
            }}
          />
        </section>

        <section id="media-section-albums" className="mt-20 scroll-mt-28 sm:mt-24">
          <SectionHeading
            eyebrow={t('albums')}
            title={t('albumsTitle')}
            description={t('albumsDescription')}
          />
          <MediaAlbumGrid
            locale={locale}
            albums={gallery.albums}
            photosLabel={t('photos')}
            openAlbumLabel={t('openAlbum')}
            loadingLabel={t('loadingMore')}
          />
        </section>
      </div>

      <MediaLightbox
        items={filteredPhotos}
        initialIndex={lightboxIndex}
        locale={locale}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        labels={{
          previous: t('lightbox.previous'),
          next: t('lightbox.next'),
          close: t('lightbox.close'),
          of: t('lightbox.of'),
          download: t('lightbox.download'),
        }}
      />
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="mb-8 max-w-3xl text-left sm:mb-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease }}
    >
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-rdc-blue">{eyebrow}</span>
      <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">{description}</p>
    </motion.div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? 'bg-rdc-blue text-white shadow-sm'
          : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-rdc-blue/30'
      }`}
    >
      {label}
    </button>
  );
}
