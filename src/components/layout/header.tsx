'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
        href: '/appels-offres?tab=closed',
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
                ? 'Ministère des Infrastructures et Travaux Publics'
                : 'Ministry of Infrastructure and Public Works'}
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
                    <AnimatePresence>
                      {activeDropdown === item.href && (
                        <motion.ul
                          key={`dd-${item.href}`}
                          initial={{ opacity: 0, y: 4, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.98 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="ci-dropdown"
                          role="menu"
                        >
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
                        </motion.ul>
                      )}
                    </AnimatePresence>
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
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="ci-mobile-drawer lg:hidden"
            aria-modal="true"
            role="dialog"
          >
            <nav aria-label="Menu mobile">
              <ul role="list" className="ci-mobile-nav">
                {navItems.map((item, i) => {
                  const label = isFr ? item.labelFr : item.labelEn;
                  const active = isActive(item.href);
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                    >
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
                    </motion.li>
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
