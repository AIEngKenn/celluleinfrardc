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
    setCompact(latest > 50);
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

        {/* ── Main header ── */}
        <div
          className={cn(
            'w-full border-b bg-white transition-all duration-300 ease-out',
            compact ? 'border-gray-200 shadow-lg shadow-black/5' : 'border-gray-100 shadow-sm'
          )}
        >
          <div
            className={cn(
              'mx-auto flex max-w-[1360px] items-center justify-between gap-6 px-4 transition-all duration-300 ease-out sm:px-6 lg:px-8',
              compact ? 'py-2' : 'py-4 lg:py-5'
            )}
          >
            {/* ── Left: Logo cluster ── */}
            <Link
              href={`/${locale}`}
              className="group flex shrink-0 items-center gap-3 no-underline"
              aria-label="Cellule Infrastructures — Accueil"
            >
              <div className="flex items-center gap-2.5">
                <Image
                  src="/ci-logo.png"
                  alt="Cellule Infrastructures"
                  width={52}
                  height={52}
                  className={cn(
                    'object-contain transition-all duration-300',
                    compact ? 'h-9 w-9' : 'h-11 w-11 lg:h-12 lg:w-12'
                  )}
                  priority
                />
                <span
                  className={cn(
                    'hidden w-px self-stretch bg-gray-200 sm:block',
                    compact ? 'my-1' : 'my-0.5'
                  )}
                  aria-hidden="true"
                />
                <Image
                  src="/gouv-logo.png"
                  alt="Gouvernement RDC"
                  width={52}
                  height={52}
                  className={cn(
                    'hidden object-contain transition-all duration-300 sm:block',
                    compact ? 'h-9 w-9' : 'h-11 w-11 lg:h-12 lg:w-12'
                  )}
                  priority
                />
              </div>
              <div className="hidden flex-col">
                <span
                  className={cn(
                    'font-bold leading-tight tracking-tight text-gray-900 transition-all duration-300',
                    compact ? 'hidden' : 'text-xs lg:text-xs'
                  )}
                >
                  Cellule Infrastructures
                </span>
                <span
                  className={cn(
                    'hidden font-normal leading-tight text-gray-500 transition-all duration-300',
                    compact ? 'hidden text-[0.625rem]' : 'text-[0.4rem] lg:text-xs'
                  )}
                >
                  {isFr ? 'République Démocratique du Congo' : 'Democratic Republic of the Congo'}
                </span>
              </div>
            </Link>

            {/* ── Center: Desktop navigation ── */}
            <nav
              className="hidden flex-1 justify-center lg:flex"
              aria-label={isFr ? 'Navigation principale' : 'Main navigation'}
            >
              <ul className="flex items-center gap-0.5" role="list">
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
                            'group relative flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium no-underline transition-all duration-200',
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
                              layoutId="nav-active"
                              className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-[#007FFF]"
                              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                          )}
                        </Link>

                        <AnimatePresence>
                          {activeDropdown === item.href && (
                            <motion.ul
                              key={`dd-${item.href}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 6 }}
                              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                              className="shadow-gray-900/8 absolute left-1/2 top-full z-50 mt-1 min-w-[240px] -translate-x-1/2 overflow-hidden rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl"
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
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-400">
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
                          'relative flex items-center rounded-lg px-3 py-2 text-sm font-medium no-underline transition-all duration-200',
                          active
                            ? 'text-[#007FFF]'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        )}
                      >
                        {label}
                        {active && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-[#007FFF]"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* ── Right: Actions ── */}
            <div className="flex shrink-0 items-center gap-2">
              {/* Search trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
                aria-label={isFr ? 'Rechercher' : 'Search'}
              >
                <Search className="h-[18px] w-[18px]" />
              </button>

              {/* Language toggle — desktop */}
              <a
                href={`/${isFr ? 'en' : 'fr'}${pathname.replace(`/${locale}`, '')}`}
                className="hidden items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 no-underline transition-all duration-200 hover:border-[#007FFF]/30 hover:bg-[#007FFF]/5 hover:text-[#007FFF] sm:flex"
              >
                <Globe className="h-3.5 w-3.5" />
                {isFr ? 'EN' : 'FR'}
              </a>

              {/* Mobile toggle */}
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
        </div>

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
                      width={36}
                      height={36}
                      className="h-9 w-9 object-contain"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold leading-tight text-gray-900">
                        Cellule Infrastructures
                      </span>
                      <span className="text-[0.6rem] text-gray-500">
                        {isFr ? 'Rép. Dém. du Congo' : 'Dem. Rep. of the Congo'}
                      </span>
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

      {/* ── Search Modal (shadcn Dialog) ── */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="top-[20%] translate-y-0 gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-lg">
          <DialogHeader className="sr-only">
            <DialogTitle>{isFr ? 'Rechercher' : 'Search'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSearchSubmit} className="flex flex-col">
            <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
              <Search className="h-5 w-5 shrink-0 text-[#007FFF]" />
              <input
                ref={searchInputRef}
                name="q"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={
                  isFr
                    ? 'Rechercher des projets, actualités, publications…'
                    : 'Search projects, news, publications…'
                }
                className="flex-1 bg-transparent text-base text-gray-900 placeholder-gray-400 outline-none"
                aria-label={isFr ? 'Rechercher' : 'Search'}
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => setSearchValue('')}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between px-5 py-3">
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
