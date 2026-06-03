import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Facebook, Twitter, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const locale = useLocale();
  const isFr = locale === 'fr';
  const year = new Date().getFullYear();

  const sections = [
    {
      heading: isFr ? 'Navigation' : 'Navigation',
      links: [
        { label: isFr ? 'À Propos' : 'About', href: '/a-propos' },
        { label: isFr ? 'Projets' : 'Projects', href: '/projets' },
        { label: isFr ? 'Actualités' : 'News', href: '/actualites' },
        { label: isFr ? "Appels d'Offres" : 'Procurement', href: '/appels-offres' },
      ],
    },
    {
      heading: isFr ? 'Ressources' : 'Resources',
      links: [
        { label: 'Publications', href: '/publications' },
        { label: isFr ? 'Médiathèque' : 'Media Center', href: '/mediatheque' },
        { label: isFr ? 'Géomatique' : 'Geomatics', href: '/geomatique' },
        { label: isFr ? 'Plaintes & Réclamations' : 'Complaints', href: '/reclamations' },
      ],
    },
    {
      heading: isFr ? 'Légal' : 'Legal',
      links: [
        {
          label: isFr ? 'Politique de confidentialité' : 'Privacy Policy',
          href: '/confidentialite',
        },
        { label: isFr ? "Conditions d'utilisation" : 'Terms of Use', href: '/conditions' },
        { label: isFr ? 'Accessibilité' : 'Accessibility', href: '/accessibilite' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ];

  return (
    <footer className="ci-footer" role="contentinfo">
      {/* Main footer */}
      <div className="ci-footer-main">
        <div className="ci-footer-grid">
          {/* Brand column */}
          <div className="ci-footer-brand">
            <Link href={`/${locale}`} className="ci-footer-logo">
              <span className="ci-footer-logo-emblem">CI</span>
              <span className="ci-footer-logo-text">
                <span>Cellule Infrastructures</span>
                <span className="ci-footer-logo-sub">République Démocratique du Congo</span>
              </span>
            </Link>
            <p className="ci-footer-desc">
              {isFr
                ? "Plateforme officielle de transparence et de suivi des projets d'infrastructures de la République Démocratique du Congo."
                : 'Official transparency and project monitoring platform for infrastructure in the Democratic Republic of Congo.'}
            </p>
            <div className="ci-footer-social">
              {[
                { href: '#', icon: Facebook, label: 'Facebook' },
                { href: '#', icon: Twitter, label: 'Twitter / X' },
                { href: '#', icon: Youtube, label: 'YouTube' },
                { href: '#', icon: Linkedin, label: 'LinkedIn' },
              ].map(({ href, icon: Icon, label }) => (
                <a key={label} href={href} aria-label={label} className="ci-footer-social-link">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {sections.map((section) => (
            <div key={section.heading} className="ci-footer-col">
              <h3 className="ci-footer-col-heading">{section.heading}</h3>
              <ul role="list" className="ci-footer-col-list">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={`/${locale}${link.href}`} className="ci-footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div className="ci-footer-col">
            <h3 className="ci-footer-col-heading">Contact</h3>
            <ul className="ci-footer-contact-list">
              <li>
                <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Kinshasa, RDC</span>
              </li>
              <li>
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>+243 XX XXX XXXX</span>
              </li>
              <li>
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                <a href="mailto:contact@celluleinfra.cd" className="ci-footer-link">
                  contact@celluleinfra.cd
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="ci-footer-bottom">
        <div className="ci-footer-bottom-inner">
          <p>
            © {year} Cellule Infrastructures —{' '}
            {isFr
              ? 'Gouvernement de la République Démocratique du Congo'
              : 'Government of the Democratic Republic of Congo'}
            . {isFr ? 'Tous droits réservés.' : 'All rights reserved.'}
          </p>
          <p className="ci-footer-bottom-right">
            {isFr ? 'Un service public numérique' : 'A public digital service'}
          </p>
        </div>
      </div>
    </footer>
  );
}

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-wide py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* About Section */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rdc-blue">
                <span className="text-xl font-bold text-white">CI</span>
              </div>
              <div className="text-sm font-semibold leading-tight">
                <div>Cellule Infrastructures</div>
                <div className="text-xs text-gray-400">RDC</div>
              </div>
            </div>
            <p className="mb-4 text-sm text-gray-400">
              {locale === 'fr'
                ? "Plateforme officielle de transparence et d'information sur les infrastructures de la RDC."
                : 'Official platform for transparency and information on DRC infrastructure.'}
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
                aria-label="Youtube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/projets`}
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  {locale === 'fr' ? 'Projets' : 'Projects'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/actualites`}
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  {locale === 'fr' ? 'Actualités' : 'News'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/appels-offres`}
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  {locale === 'fr' ? "Appels d'Offres" : 'Procurement'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/publications`}
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Publications
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              {t('resources')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/mediatheque`}
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  {locale === 'fr' ? 'Médiathèque' : 'Media Center'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/geomatique`}
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  {locale === 'fr' ? 'Géomatique' : 'Geomatics'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/plaintes`}
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  {locale === 'fr' ? 'Plaintes' : 'Complaints'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">{t('contact')}</h3>
            <ul className="space-y-3">
              <li className="flex gap-2 text-sm text-gray-400">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <span>Kinshasa, République Démocratique du Congo</span>
              </li>
              <li className="flex gap-2 text-sm text-gray-400">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>+243 XX XXX XXXX</span>
              </li>
              <li className="flex gap-2 text-sm text-gray-400">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>contact@celluleinfra.cd</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-400">{t('copyright', { year: currentYear })}</p>
            <div className="flex gap-6">
              <Link
                href={`/${locale}/confidentialite`}
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                {t('links.privacy')}
              </Link>
              <Link
                href={`/${locale}/conditions`}
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                {t('links.terms')}
              </Link>
              <Link
                href={`/${locale}/accessibilite`}
                className="text-sm text-gray-400 transition-colors hover:text-white"
              >
                {t('links.accessibility')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
