'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, ChevronDown, Globe, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/**
 * Navigation data — shape preserved from original implementation.
 */
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
  const [compact, setCompact] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { scrollY } = useScroll();

  const isFr = locale === 'fr';

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setCompact((prev) => {
      if (!prev && latest > 100) return true;
      if (prev && latest < 30) return false;
      return prev;
    });
  });

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = useCallback(
    (href: string) => {
      const full = `/${locale}${href}`;
      if (href === '') return pathname === `/${locale}`;
      return pathname.startsWith(full);
    },
    [locale, pathname]
  );

  const handleDropdownEnter = (href: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(href);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 120);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/${locale}/recherche?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        {/* ── Tricolour sovereignty stripe ── */}
        <div className="flex h-[3px] w-full" aria-hidden="true">
          <span className="flex-1 bg-[#007FFF]" />
          <span className="flex-1 bg-[#F7D618]" />
          <span className="flex-1 bg-[#CE1021]" />
        </div>

        {/* ── Brand bar (collapses on scroll) ── */}
        <div
          className={cn(
            'ease-[cubic-bezier(0.4,0,0.2,1)] w-full overflow-hidden bg-white transition-all duration-500',
            compact ? 'max-h-0 opacity-0' : 'max-h-40 opacity-100'
          )}
        >
          <div className="mx-auto max-w-[1360px] px-4 py-4 sm:px-6 sm:py-4 lg:px-8 lg:py-4">
            {/* Mobile: stacked layout | Desktop: side by side */}
            <div className="flex items-center justify-between gap-4">
              {/* Left: Logos + Ministry title */}
              <Link
                href={`/${locale}`}
                className="group flex items-center gap-3 no-underline sm:gap-4 lg:gap-5"
                aria-label="Cellule Infrastructures — Accueil"
              >
                {/* Logos */}
                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                  <Image
                    src="/ci-logo.png"
                    alt="Cellule Infrastructures"
                    width={200}
                    height={200}
                    className="hidden h-12 w-36 object-contain transition-transform duration-300 group-hover:scale-105 sm:h-16 sm:w-16 md:block lg:h-20 lg:w-20"
                    priority
                    unoptimized
                  />
                  <span
                    className="hidden h-10 w-px bg-gray-200 sm:block md:block lg:h-14"
                    aria-hidden="true"
                  />
                  <Image
                    src="/gouv-logo.png"
                    alt="Gouvernement RDC"
                    width={160}
                    height={160}
                    className="h-12 w-12 object-contain sm:block lg:h-16 lg:w-16"
                    priority
                    unoptimized
                  />
                </div>

                {/* Text */}
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-[0.55rem] font-semibold uppercase tracking-[0.1em] text-[#007FFF] sm:text-[0.625rem] lg:text-[0.7rem]">
                    {isFr ? 'Rép. Dém. du Congo' : 'Dem. Rep. of the Congo'}
                  </span>
                  <span className="text-[0.7rem] font-extrabold uppercase leading-tight tracking-wide text-gray-900 sm:text-sm lg:text-base">
                    {isFr
                      ? 'Ministère des Infrastructures et Travaux Publics'
                      : 'Ministry of Infrastructure and Public Works'}
                  </span>
                  <span className="text-[0.6rem] font-medium text-gray-500 sm:text-[0.7rem] lg:text-xs">
                    Cellule Infrastructures
                  </span>
                </div>
              </Link>

              {/* Right: Search + Language (hidden on mobile, shown in nav bar instead) */}
              <div className="hidden items-center gap-2 sm:flex sm:gap-3">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:px-4 sm:py-2"
                  aria-label={isFr ? 'Rechercher' : 'Search'}
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden md:inline">{isFr ? 'Rechercher' : 'Search'}</span>
                </button>
                <a
                  href={`/${isFr ? 'en' : 'fr'}${pathname.replace(`/${locale}`, '')}`}
                  className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 no-underline transition-all duration-200 hover:border-[#007FFF]/30 hover:bg-[#007FFF]/5 hover:text-[#007FFF] sm:px-3.5 sm:py-2 sm:text-sm"
                >
                  <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {isFr ? 'EN' : 'FR'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Navigation bar (always visible, absorbs elements on scroll) ── */}
        <nav
          className={cn(
            'ease-[cubic-bezier(0.4,0,0.2,1)] w-full border-b bg-white transition-all duration-500',
            compact ? 'border-gray-200 shadow-lg shadow-black/[0.04]' : 'border-gray-100'
          )}
          aria-label={isFr ? 'Navigation principale' : 'Main navigation'}
        >
          <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-3 px-4 py-1 sm:px-6 lg:gap-4 lg:px-8 lg:py-0">
            {/* Left: Logo for mobile (always) + compact logos for desktop (on scroll) */}
            <Link
              href={`/${locale}`}
              className="flex shrink-0 items-center gap-2 no-underline lg:hidden"
              aria-label="Accueil"
            >
              <Image
                src="/ci-logo.png"
                alt="CI"
                width={120}
                height={120}
                className="h-9 w-28 object-contain"
                unoptimized
              />
            </Link>

            {/* Desktop compact logos (appear on scroll) */}
            <Link
              href={`/${locale}`}
              className={cn(
                'ease-[cubic-bezier(0.4,0,0.2,1)] hidden shrink-0 items-center gap-2 no-underline transition-all duration-500 lg:flex',
                compact
                  ? 'w-auto translate-x-0 opacity-100'
                  : 'pointer-events-none w-0 -translate-x-4 opacity-0'
              )}
              aria-hidden={!compact}
              tabIndex={compact ? 0 : -1}
            >
              <Image
                src="/ci-logo.png"
                alt="CI"
                width={120}
                height={120}
                className="h-9 w-28 object-contain"
                unoptimized
              />
              <Image
                src="/gouv-logo.png"
                alt="Gouvernement"
                width={100}
                height={100}
                className="h-7 w-7 object-contain"
                unoptimized
              />
            </Link>

            {/* Center: Navigation links (desktop) */}
            <ul className="hidden flex-1 items-center justify-center gap-0.5 lg:flex" role="list">
              {navItems.map((item) => {
                const label = isFr ? item.labelFr : item.labelEn;
                const active = isActive(item.href);

                if (item.children) {
                  return (
                    <li
                      key={item.href}
                      className="relative"
                      onMouseEnter={() => handleDropdownEnter(item.href)}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <Link
                        href={`/${locale}${item.href}`}
                        className={cn(
                          'group relative flex items-center gap-1 rounded-lg px-3 py-3 text-[0.8125rem] font-medium no-underline transition-all duration-200',
                          active
                            ? 'text-[#007FFF]'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                        aria-haspopup="true"
                        aria-expanded={activeDropdown === item.href}
                      >
                        {label}
                        <ChevronDown
                          className={cn(
                            'h-3.5 w-3.5 text-gray-400 transition-transform duration-200',
                            activeDropdown === item.href && 'rotate-180 text-[#007FFF]'
                          )}
                          aria-hidden="true"
                        />
                        {active && (
                          <motion.span
                            layoutId="nav-indicator"
                            className="absolute inset-x-3 -bottom-px h-[2.5px] rounded-full bg-[#007FFF]"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                      </Link>

                      <AnimatePresence>
                        {activeDropdown === item.href && (
                          <motion.ul
                            key={`dd-${item.href}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                            className="shadow-black/8 absolute left-1/2 top-full z-50 mt-1 min-w-[240px] -translate-x-1/2 overflow-hidden rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl"
                            role="menu"
                            onMouseEnter={() => handleDropdownEnter(item.href)}
                            onMouseLeave={handleDropdownLeave}
                          >
                            {item.children.map((child) => (
                              <li key={child.href} role="none">
                                <Link
                                  href={`/${locale}${child.href}`}
                                  className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm text-gray-600 no-underline transition-all duration-150 hover:bg-[#007FFF]/5 hover:text-[#007FFF]"
                                  role="menuitem"
                                >
                                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gray-50 text-gray-400">
                                    <ArrowRight className="h-3 w-3" />
                                  </span>
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
                  <li key={item.href} className="relative">
                    <Link
                      href={`/${locale}${item.href}`}
                      className={cn(
                        'relative flex items-center rounded-lg px-3 py-3 text-[0.8125rem] font-medium no-underline transition-all duration-200',
                        active
                          ? 'text-[#007FFF]'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      {label}
                      {active && (
                        <motion.span
                          layoutId="nav-indicator"
                          className="absolute inset-x-3 -bottom-px h-[2.5px] rounded-full bg-[#007FFF]"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Right: Actions */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              {/* Search — always visible on mobile, only on scroll for desktop */}
              <button
                onClick={() => setSearchOpen(true)}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900',
                  'lg:transition-all lg:duration-300',
                  compact
                    ? 'lg:scale-100 lg:opacity-100'
                    : 'lg:pointer-events-none lg:scale-75 lg:opacity-0'
                )}
                aria-label={isFr ? 'Rechercher' : 'Search'}
              >
                <Search className="h-[18px] w-[18px]" />
              </button>

              {/* Language — always visible on mobile, only on scroll for desktop */}
              <a
                href={`/${isFr ? 'en' : 'fr'}${pathname.replace(`/${locale}`, '')}`}
                className={cn(
                  'flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-600 no-underline transition-all duration-200 hover:border-[#007FFF]/30 hover:text-[#007FFF] sm:flex',
                  'lg:transition-all lg:duration-300',
                  compact
                    ? 'lg:scale-100 lg:opacity-100'
                    : 'lg:pointer-events-none lg:scale-75 lg:opacity-0'
                )}
              >
                <Globe className="h-3 w-3" />
                {isFr ? 'EN' : 'FR'}
              </a>

              {/* Mobile hamburger */}
              <button
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition-all duration-200 hover:bg-gray-100 lg:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={mobileOpen}
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </nav>

        {/* ── Mobile drawer ── */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
                onClick={() => setMobileOpen(false)}
                aria-hidden="true"
              />

              <motion.div
                key="mobile-drawer"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[340px] flex-col bg-white shadow-2xl lg:hidden"
                aria-modal="true"
                role="dialog"
              >
                {/* Drawer header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <Image
                      src="/ci-logo.png"
                      alt="CI"
                      width={120}
                      height={120}
                      className="h-9 w-9 object-contain"
                      unoptimized
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase leading-tight tracking-wide text-gray-900">
                        {isFr ? 'Min. Infrastructures' : 'Min. of Infrastructure'}
                      </span>
                      <span className="text-[0.6rem] text-gray-500">Cellule Infrastructures</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                    aria-label="Fermer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Drawer search */}
                <div className="px-5 pb-2 pt-4">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setTimeout(() => setSearchOpen(true), 200);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl bg-gray-50 px-3.5 py-2.5 text-sm text-gray-400 transition-colors hover:bg-gray-100"
                  >
                    <Search className="h-4 w-4 shrink-0" />
                    {isFr ? 'Rechercher…' : 'Search…'}
                  </button>
                </div>

                {/* Drawer nav */}
                <nav aria-label="Menu mobile" className="flex-1 overflow-y-auto px-4 py-3">
                  <ul role="list" className="space-y-0.5">
                    {navItems.map((item, i) => {
                      const label = isFr ? item.labelFr : item.labelEn;
                      const active = isActive(item.href);
                      return (
                        <motion.li
                          key={item.href}
                          initial={{ opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.1 + i * 0.04,
                            duration: 0.3,
                            ease: [0.23, 1, 0.32, 1],
                          }}
                        >
                          <Link
                            href={`/${locale}${item.href}`}
                            className={cn(
                              'flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-[0.9375rem] font-medium no-underline transition-all duration-150',
                              active
                                ? 'bg-[#007FFF]/8 text-[#007FFF]'
                                : 'text-gray-700 hover:bg-gray-50'
                            )}
                            onClick={() => setMobileOpen(false)}
                          >
                            {active && (
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#007FFF]" />
                            )}
                            {label}
                          </Link>
                          {item.children && (
                            <ul className="mb-1.5 ml-4 space-y-0.5 border-l-2 border-gray-100 pl-3">
                              {item.children.map((child) => (
                                <li key={child.href}>
                                  <Link
                                    href={`/${locale}${child.href}`}
                                    className="flex items-center rounded-lg px-3 py-2 text-[0.8125rem] text-gray-500 no-underline transition-colors hover:text-[#007FFF]"
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
                </nav>

                {/* Drawer footer */}
                <div className="border-t border-gray-100 px-5 py-4">
                  <a
                    href={`/${isFr ? 'en' : 'fr'}${pathname.replace(`/${locale}`, '')}`}
                    className="flex items-center gap-2 text-sm font-semibold text-[#007FFF] no-underline"
                  >
                    <Globe className="h-4 w-4" />
                    {isFr ? 'Switch to English' : 'Passer en Français'}
                  </a>
                  <div
                    className="mt-4 flex h-1 w-full overflow-hidden rounded-full"
                    aria-hidden="true"
                  >
                    <span className="flex-1 bg-[#007FFF]" />
                    <span className="flex-1 bg-[#F7D618]" />
                    <span className="flex-1 bg-[#CE1021]" />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* ── Search Modal ── */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="left-[50%] top-4 w-[calc(100%-2rem)] -translate-x-1/2 translate-y-0 gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:top-[20%] sm:w-full sm:max-w-lg">
          <DialogHeader className="sr-only">
            <DialogTitle>{isFr ? 'Rechercher' : 'Search'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSearchSubmit} className="flex flex-col">
            <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 sm:px-5 sm:py-4">
              <Search className="h-5 w-5 shrink-0 text-[#007FFF]" />
              <input
                ref={searchInputRef}
                name="q"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={isFr ? 'Rechercher projets, actualités…' : 'Search projects, news…'}
                className="flex-1 bg-transparent text-base text-gray-900 placeholder-gray-400 outline-none"
                aria-label={isFr ? 'Rechercher' : 'Search'}
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => setSearchValue('')}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between px-4 py-2.5 sm:px-5 sm:py-3">
              <p className="text-xs text-gray-400">
                {isFr ? 'Appuyez Entrée pour rechercher' : 'Press Enter to search'}
              </p>
              <kbd className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[0.65rem] font-medium text-gray-500">
                ↵
              </kbd>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
