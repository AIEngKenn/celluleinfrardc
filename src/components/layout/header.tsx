'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { labelFr: 'Accueil', labelEn: 'Home', href: '' },
  { labelFr: 'À Propos', labelEn: 'About', href: '/a-propos' },
  {
    labelFr: 'Projets',
    labelEn: 'Projects',
    href: '/projets',
    children: [
      { labelFr: 'Tous les projets', labelEn: 'All projects', href: '/projets' },
      { labelFr: 'Carte interactive', labelEn: 'Interactive map', href: '/geomatique' },
    ],
  },
  { labelFr: 'Actualités', labelEn: 'News', href: '/actualites' },
  {
    labelFr: "Appels d'Offres",
    labelEn: 'Procurement',
    href: '/appels-offres',
    children: [
      { labelFr: 'Opportunités ouvertes', labelEn: 'Open opportunities', href: '/appels-offres' },
      {
        labelFr: 'Marchés attribués',
        labelEn: 'Awarded contracts',
        href: '/appels-offres?status=closed',
      },
    ],
  },
  { labelFr: 'Publications', labelEn: 'Publications', href: '/publications' },
  { labelFr: 'Médiathèque', labelEn: 'Media', href: '/mediatheque' },
  { labelFr: 'Contact', labelEn: 'Contact', href: '/contact' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const locale = useLocale();
  const pathname = usePathname();
  const searchRef = useRef<HTMLInputElement>(null);

  const isFr = locale === 'fr';

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const isActive = (href: string) => {
    const full = `/${locale}${href}`;
    if (href === '') return pathname === `/${locale}`;
    return pathname.startsWith(full);
  };

  return (
    <header className="ci-header">
      {/* ── Tier 1: Official government banner ── */}
      <div className="ci-banner">
        <div className="ci-banner-inner">
          <div className="ci-banner-left">
            {/* RDC flag micro-stripe */}
            <span className="ci-flag-stripe" aria-hidden="true">
              <span style={{ background: '#007FFF' }} />
              <span style={{ background: '#F7D618' }} />
              <span style={{ background: '#CE1021' }} />
            </span>
            <span>
              {isFr
                ? 'Site officiel · Gouvernement de la République Démocratique du Congo'
                : 'Official website · Government of the Democratic Republic of Congo'}
            </span>
          </div>
          <div className="ci-banner-right">
            <a
              href={`/${isFr ? 'en' : 'fr'}${pathname.replace(`/${locale}`, '')}`}
              className="ci-lang-toggle"
            >
              {isFr ? 'English' : 'Français'}
            </a>
          </div>
        </div>
      </div>

      {/* ── Tier 2: Brand row ── */}
      <div className="ci-brand-row">
        <div className="ci-brand-inner">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="ci-logo"
            aria-label="Cellule Infrastructures — Accueil"
          >
            <span className="ci-logo-emblem" aria-hidden="true">
              CI
            </span>
            <span className="ci-logo-text">
              <span className="ci-logo-name">Cellule Infrastructures</span>
              <span className="ci-logo-country">République Démocratique du Congo</span>
            </span>
          </Link>

          {/* Right side actions */}
          <div className="ci-brand-actions">
            {/* Search */}
            <div className={cn('ci-search-wrap', searchOpen && 'ci-search-open')}>
              {searchOpen ? (
                <form
                  className="ci-search-form"
                  action={`/${locale}/recherche`}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) setSearchOpen(false);
                  }}
                >
                  <input
                    ref={searchRef}
                    name="q"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={isFr ? 'Rechercher…' : 'Search…'}
                    className="ci-search-input"
                    aria-label={isFr ? 'Rechercher' : 'Search'}
                  />
                  <button type="submit" className="ci-search-btn" aria-label="Rechercher">
                    <Search className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="ci-search-close"
                    onClick={() => setSearchOpen(false)}
                    aria-label="Fermer la recherche"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="ci-icon-btn"
                  aria-label={isFr ? 'Rechercher' : 'Search'}
                >
                  <Search className="h-5 w-5" />
                  <span className="ci-icon-btn-label">{isFr ? 'Recherche' : 'Search'}</span>
                </button>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className="ci-mobile-toggle lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Tier 3: Navigation ── */}
      <nav className="ci-nav" aria-label={isFr ? 'Navigation principale' : 'Main navigation'}>
        <div className="ci-nav-inner">
          <ul className="ci-nav-list" role="list">
            {navItems.map((item) => {
              const label = isFr ? item.labelFr : item.labelEn;
              const active = isActive(item.href);

              if (item.children) {
                return (
                  <li
                    key={item.href}
                    className="ci-nav-item ci-nav-has-dropdown"
                    onMouseEnter={() => setActiveDropdown(item.href)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={`/${locale}${item.href}`}
                      className={cn('ci-nav-link', active && 'ci-nav-link--active')}
                      aria-haspopup="true"
                      aria-expanded={activeDropdown === item.href}
                    >
                      {label}
                      <ChevronDown className="ci-nav-chevron" aria-hidden="true" />
                    </Link>
                    {activeDropdown === item.href && (
                      <ul className="ci-dropdown" role="menu">
                        {item.children.map((child) => (
                          <li key={child.href} role="none">
                            <Link
                              href={`/${locale}${child.href}`}
                              className="ci-dropdown-item"
                              role="menuitem"
                            >
                              {isFr ? child.labelFr : child.labelEn}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.href} className="ci-nav-item">
                  <Link
                    href={`/${locale}${item.href}`}
                    className={cn('ci-nav-link', active && 'ci-nav-link--active')}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="ci-mobile-drawer lg:hidden" aria-modal="true" role="dialog">
          <nav aria-label="Menu mobile">
            <ul role="list" className="ci-mobile-nav">
              {navItems.map((item) => {
                const label = isFr ? item.labelFr : item.labelEn;
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={`/${locale}${item.href}`}
                      className={cn('ci-mobile-link', active && 'ci-mobile-link--active')}
                      onClick={() => setMobileOpen(false)}
                    >
                      {label}
                    </Link>
                    {item.children && (
                      <ul className="ci-mobile-sub">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={`/${locale}${child.href}`}
                              className="ci-mobile-sub-link"
                              onClick={() => setMobileOpen(false)}
                            >
                              {isFr ? child.labelFr : child.labelEn}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="ci-mobile-footer">
              <a
                href={`/${isFr ? 'en' : 'fr'}${pathname.replace(`/${locale}`, '')}`}
                className="ci-mobile-lang"
              >
                {isFr ? 'Switch to English' : 'Passer en Français'}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations('nav');
  const locale = useLocale();

  const navigation = [
    { name: t('home'), href: `/${locale}` },
    { name: t('about'), href: `/${locale}/a-propos` },
    { name: t('projects'), href: `/${locale}/projets` },
    { name: t('news'), href: `/${locale}/actualites` },
    { name: t('procurement'), href: `/${locale}/appels-offres` },
    { name: t('publications'), href: `/${locale}/publications` },
    { name: t('media'), href: `/${locale}/mediatheque` },
    { name: t('contact'), href: `/${locale}/contact` },
  ];

  const toggleLanguage = () => {
    const newLocale = locale === 'fr' ? 'en' : 'fr';
    const currentPath = window.location.pathname.replace(`/${locale}`, '');
    window.location.href = `/${newLocale}${currentPath}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="container-wide flex h-16 items-center justify-between" aria-label="Global">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href={`/${locale}`} className="-m-1.5 p-1.5">
            <span className="sr-only">Cellule Infrastructures RDC</span>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rdc-blue">
                <span className="text-xl font-bold text-white">CI</span>
              </div>
              <div className="hidden text-sm font-semibold leading-tight sm:block">
                <div className="text-gray-900">Cellule Infrastructures</div>
                {/* <div className="text-xs text-gray-600">
                  République Démocratique du Congo
                </div> */}
              </div>
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex gap-2 lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-rdc-blue"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <GlobalSearch />
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            aria-label="Change language"
          >
            <Globe className="h-4 w-4" />
            <span>{locale === 'fr' ? 'EN' : 'FR'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-rdc-blue"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={toggleLanguage}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              <Globe className="h-4 w-4" />
              <span>{locale === 'fr' ? 'English' : 'Français'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
