import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  locale?: string;
}

export function PageHeader({ title, subtitle, breadcrumbs, locale = 'fr' }: PageHeaderProps) {
  return (
    <div className="ci-page-header">
      <div className="ci-page-header-inner">
        {/* Breadcrumbs */}
        <nav className="ci-breadcrumb" aria-label="Fil d'Ariane">
          <Link href={`/${locale}`} className="ci-breadcrumb" aria-label="Accueil">
            <Home size={12} />
          </Link>
          {breadcrumbs?.map((crumb, i) => (
            <span key={i} style={{ display: 'contents' }}>
              <ChevronRight size={12} className="ci-breadcrumb-sep" aria-hidden="true" />
              {crumb.href ? (
                <Link href={crumb.href}>{crumb.label}</Link>
              ) : (
                <span aria-current="page">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Title */}
        <h1 className="ci-page-title">{title}</h1>
        {subtitle && <p className="ci-page-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}
