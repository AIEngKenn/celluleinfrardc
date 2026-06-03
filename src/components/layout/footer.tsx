import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Facebook, Twitter, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

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
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rdc-blue">
                <span className="text-xl font-bold text-white">CI</span>
              </div>
              <div className="text-sm font-semibold leading-tight">
                <div>Cellule Infrastructures</div>
                <div className="text-xs text-gray-400">RDC</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              {locale === 'fr'
                ? "Plateforme officielle de transparence et d'information sur les infrastructures de la RDC."
                : 'Official platform for transparency and information on DRC infrastructure.'}
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Youtube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
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
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {locale === 'fr' ? 'Projets' : 'Projects'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/actualites`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {locale === 'fr' ? 'Actualités' : 'News'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/appels-offres`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {locale === 'fr' ? 'Appels d\'Offres' : 'Procurement'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/publications`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
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
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {locale === 'fr' ? 'Médiathèque' : 'Media Center'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/geomatique`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {locale === 'fr' ? 'Géomatique' : 'Geomatics'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/plaintes`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {locale === 'fr' ? 'Plaintes' : 'Complaints'}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              {t('contact')}
            </h3>
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
            <p className="text-sm text-gray-400">
              {t('copyright', { year: currentYear })}
            </p>
            <div className="flex gap-6">
              <Link
                href={`/${locale}/confidentialite`}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {t('links.privacy')}
              </Link>
              <Link
                href={`/${locale}/conditions`}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {t('links.terms')}
              </Link>
              <Link
                href={`/${locale}/accessibilite`}
                className="text-sm text-gray-400 hover:text-white transition-colors"
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
