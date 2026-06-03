import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { sanityFetch } from '@/lib/sanity/client';
import { mediaGalleryQuery, mediaAlbumsQuery } from '@/lib/sanity/queries';
import { MediaItem, MediaAlbum } from '@/lib/sanity/types';
import { urlFor } from '@/lib/sanity/client';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Download, ExternalLink, Calendar, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'media' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function MediaCenterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'media' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  // Fetch media and albums
  const [media, albums] = await Promise.all([
    sanityFetch<MediaItem[]>({
      query: mediaGalleryQuery,
      revalidate: 3600,
    }),
    sanityFetch<MediaAlbum[]>({
      query: mediaAlbumsQuery,
      revalidate: 3600,
    }),
  ]);

  const photos = media.filter((item) => item.type === 'image');
  const videos = media.filter((item) => item.type === 'video');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">{t('title')}</h1>
        <p className="text-lg text-gray-600">{t('description')}</p>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="photos" className="space-y-8">
        <TabsList>
          <TabsTrigger value="photos">
            {t('photos')} ({photos.length})
          </TabsTrigger>
          <TabsTrigger value="videos">
            {t('videos')} ({videos.length})
          </TabsTrigger>
          <TabsTrigger value="albums">
            {t('albums')} ({albums.length})
          </TabsTrigger>
        </TabsList>

        {/* Photos Grid */}
        <TabsContent value="photos" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {photos.map((item) => (
              <div
                key={item._id}
                className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 transition-shadow hover:shadow-lg"
              >
                {item.image && (
                  <Image
                    src={urlFor(item.image).width(600).height(600).url()}
                    alt={item.title[locale as 'fr' | 'en'] || item.title.fr || 'Photo'}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="mb-2 line-clamp-2 font-semibold text-white">
                      {item.title[locale] || item.title.fr}
                    </h3>
                    {item.caption && (
                      <p className="mb-3 line-clamp-1 text-sm text-gray-200">
                        {item.caption[locale] || item.caption.fr}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" className="flex-1">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {tCommon('view')}
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Date Badge */}
                {item.date && (
                  <div className="absolute right-3 top-3">
                    <Badge variant="secondary" className="bg-white/90">
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(item.date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                        year: 'numeric',
                        month: 'short',
                      })}
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>

          {photos.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">{tCommon('noResults')}</p>
            </div>
          )}
        </TabsContent>

        {/* Videos Grid */}
        <TabsContent value="videos" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((item) => (
              <div
                key={item._id}
                className="group relative overflow-hidden rounded-lg bg-gray-100 transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-video">
                  {item.thumbnail ? (
                    <Image
                      src={urlFor(item.thumbnail).width(800).height(450).url()}
                      alt={item.title[locale] || item.title.fr || 'Video'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-rdc-blue to-rdc-blue/80" />
                  )}

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/50">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 transition-transform group-hover:scale-110">
                      <Play className="ml-1 h-8 w-8 text-rdc-blue" fill="currentColor" />
                    </div>
                  </div>

                  {/* Date Badge */}
                  {item.date && (
                    <div className="absolute right-3 top-3">
                      <Badge variant="secondary" className="bg-white/90">
                        <Calendar className="mr-1 h-3 w-3" />
                        {new Date(item.date).toLocaleDateString(
                          locale === 'fr' ? 'fr-FR' : 'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                          }
                        )}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900">
                    {item.title[locale] || item.title.fr}
                  </h3>
                  {item.caption && (
                    <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                      {item.caption[locale] || item.caption.fr}
                    </p>
                  )}
                  {item.videoUrl && (
                    <Button size="sm" className="w-full" asChild>
                      <a href={item.videoUrl} target="_blank" rel="noopener noreferrer">
                        <Play className="mr-2 h-4 w-4" />
                        {tCommon('view')}
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {videos.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">{tCommon('noResults')}</p>
            </div>
          )}
        </TabsContent>

        {/* Albums Grid */}
        <TabsContent value="albums" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <div
                key={album._id}
                className="group relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-video">
                  {album.coverImage ? (
                    <Image
                      src={urlFor(album.coverImage).width(800).height(450).url()}
                      alt={album.title[locale] || album.title.fr || 'Album'}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <Folder className="h-16 w-16 text-gray-400" />
                    </div>
                  )}

                  {/* Item Count Badge */}
                  <div className="absolute right-3 top-3">
                    <Badge variant="secondary" className="bg-white/90">
                      {album.itemCount || 0} {t('photos')}
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="mb-2 font-semibold text-gray-900">
                    {album.title[locale] || album.title.fr}
                  </h3>
                  {album.description && (
                    <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                      {album.description[locale] || album.description.fr}
                    </p>
                  )}
                  {album.date && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1 h-4 w-4" />
                      {new Date(album.date).toLocaleDateString(
                        locale === 'fr' ? 'fr-FR' : 'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {albums.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">{tCommon('noResults')}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
