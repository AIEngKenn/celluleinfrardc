import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
  labels?: {
    previous?: string;
    next?: string;
    page?: string;
  };
}

function pageHref(basePath: string, params: Record<string, string | undefined>, page: number) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value && key !== 'page') query.set(key, value);
  }
  if (page > 1) query.set('page', String(page));
  const qs = query.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function Pagination({
  page,
  pageSize,
  total,
  basePath,
  searchParams = {},
  labels,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (value) => value === 1 || value === totalPages || Math.abs(value - page) <= 1
  );

  return (
    <nav className="ci-pagination" aria-label="Pagination">
      <Link
        href={pageHref(basePath, searchParams, Math.max(1, page - 1))}
        className={cn('ci-pagination-arrow', page === 1 && 'ci-pagination-disabled')}
        aria-disabled={page === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">{labels?.previous || 'Précédent'}</span>
      </Link>

      <div className="ci-pagination-pages">
        {pages.map((value, index) => {
          const previous = pages[index - 1];
          const showGap = previous && value - previous > 1;
          return (
            <span key={value} className="contents">
              {showGap && <span className="ci-pagination-gap">...</span>}
              <Link
                href={pageHref(basePath, searchParams, value)}
                className={cn('ci-pagination-page', value === page && 'ci-pagination-page-active')}
                aria-current={value === page ? 'page' : undefined}
              >
                <span className="sr-only">{labels?.page || 'Page'} </span>
                {value}
              </Link>
            </span>
          );
        })}
      </div>

      <Link
        href={pageHref(basePath, searchParams, Math.min(totalPages, page + 1))}
        className={cn('ci-pagination-arrow', page === totalPages && 'ci-pagination-disabled')}
        aria-disabled={page === totalPages}
      >
        <span className="hidden sm:inline">{labels?.next || 'Suivant'}</span>
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
