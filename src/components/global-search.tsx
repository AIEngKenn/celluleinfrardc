'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Search, FileText, Newspaper, Briefcase, FolderOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface SearchResult {
  _id: string;
  _type: 'project' | 'news' | 'publication' | 'procurement';
  titleFr: string;
  titleEn: string;
  slug: string;
}

interface SearchResults {
  projects: SearchResult[];
  news: SearchResult[];
  publications: SearchResult[];
  procurement?: SearchResult[];
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchResults>({
    projects: [],
    news: [],
    publications: [],
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('search');

  // Register keyboard shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Debounced search
  React.useEffect(() => {
    if (!query || query.length < 2) {
      setResults({ projects: [], news: [], publications: [] });
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&locale=${locale}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, locale]);

  const handleSelect = (type: string, slug: string) => {
    setIsOpen(false);
    setQuery('');

    const routes: Record<string, string> = {
      project: `/projets/${slug}`,
      news: `/actualites/${slug}`,
      publication: `/publications/${slug}`,
      procurement: `/appels-offres/${slug}`,
    };

    const route = routes[type];
    if (route) {
      router.push(`/${locale}${route}`);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <FolderOpen className="h-4 w-4 text-rdc-blue" />;
      case 'news':
        return <Newspaper className="h-4 w-4 text-green-600" />;
      case 'publication':
        return <FileText className="h-4 w-4 text-purple-600" />;
      case 'procurement':
        return <Briefcase className="h-4 w-4 text-orange-600" />;
      default:
        return <Search className="h-4 w-4 text-gray-400" />;
    }
  };

  const getResultTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      project: t('categories.projects'),
      news: t('categories.news'),
      publication: t('categories.publications'),
      procurement: t('categories.procurement'),
    };
    return labels[type] || type;
  };

  const totalResults =
    results.projects.length +
    results.news.length +
    results.publications.length +
    (results.procurement?.length || 0);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">{t('placeholder')}</span>
        <kbd className="hidden h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-xs font-medium text-gray-600 sm:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl gap-0 p-0">
          <DialogTitle className="sr-only">{t('title')}</DialogTitle>

          {/* Search Input */}
          <div className="flex items-center border-b px-4">
            <Search className="mr-2 h-5 w-5 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('placeholder')}
              className="h-12 flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
            {isLoading && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-rdc-blue border-t-transparent" />
            )}
          </div>

          {/* Results */}
          <ScrollArea className="max-h-[400px]">
            {query.length < 2 ? (
              <div className="p-8 text-center text-gray-500">
                <Search className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                <p className="text-sm">{t('placeholder')}</p>
                <p className="mt-1 text-xs text-gray-400">{t('suggestions')}</p>
              </div>
            ) : totalResults === 0 && !isLoading ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-sm">{t('noResults', { query })}</p>
              </div>
            ) : (
              <div className="p-2">
                {/* Projects */}
                {results.projects.length > 0 && (
                  <div className="mb-4">
                    <div className="px-2 py-1.5 text-xs font-semibold uppercase text-gray-500">
                      {t('categories.projects')} ({results.projects.length})
                    </div>
                    {results.projects.map((result) => (
                      <button
                        key={result._id}
                        onClick={() => handleSelect('project', result.slug)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gray-100"
                      >
                        {getResultIcon('project')}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {locale === 'fr' ? result.titleFr : result.titleEn}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {getResultTypeLabel('project')}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}

                {/* News */}
                {results.news.length > 0 && (
                  <div className="mb-4">
                    <div className="px-2 py-1.5 text-xs font-semibold uppercase text-gray-500">
                      {t('categories.news')} ({results.news.length})
                    </div>
                    {results.news.map((result) => (
                      <button
                        key={result._id}
                        onClick={() => handleSelect('news', result.slug)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gray-100"
                      >
                        {getResultIcon('news')}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {locale === 'fr' ? result.titleFr : result.titleEn}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {getResultTypeLabel('news')}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}

                {/* Publications */}
                {results.publications.length > 0 && (
                  <div className="mb-4">
                    <div className="px-2 py-1.5 text-xs font-semibold uppercase text-gray-500">
                      {t('categories.publications')} ({results.publications.length})
                    </div>
                    {results.publications.map((result) => (
                      <button
                        key={result._id}
                        onClick={() => handleSelect('publication', result.slug)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gray-100"
                      >
                        {getResultIcon('publication')}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {locale === 'fr' ? result.titleFr : result.titleEn}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {getResultTypeLabel('publication')}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}

                {/* Procurement */}
                {results.procurement && results.procurement.length > 0 && (
                  <div className="mb-4">
                    <div className="px-2 py-1.5 text-xs font-semibold uppercase text-gray-500">
                      {t('categories.procurement')} ({results.procurement.length})
                    </div>
                    {results.procurement.map((result) => (
                      <button
                        key={result._id}
                        onClick={() => handleSelect('procurement', result.slug)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gray-100"
                      >
                        {getResultIcon('procurement')}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {locale === 'fr' ? result.titleFr : result.titleEn}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {getResultTypeLabel('procurement')}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {totalResults > 0 && (
            <div className="border-t px-4 py-2 text-xs text-gray-500">
              {t('resultCount', { count: totalResults })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
