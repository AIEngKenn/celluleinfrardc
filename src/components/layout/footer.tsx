'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Facebook, Twitter, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import type { SiteSettings } from '@/lib/sanity/types';

export function Footer({ settings }: { settings?: SiteSettings }) {
  const locale = useLocale();
  const isFr = locale === 'fr';
  const year = new Date().getFullYear();
  const footerDescription =
    (isFr ? settings?.footerDescriptionFr : settings?.footerDescriptionEn) ||
    (isFr
      ? "Plateforme officielle de transparence et de suivi des projets d'infrastructures de la République Démocratique du Congo."
      : 'Official transparency and project monitoring platform for infrastructure in the Democratic Republic of Congo.');
  const address = (isFr ? settings?.addressFr : settings?.addressEn) || 'Kinshasa, RDC';
  const email = settings?.email || 'contact@celluleinfra.cd';
  const phone = settings?.phone || '+243 XX XXX XXXX';

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
        { label: isFr ? 'Plan du site' : 'Sitemap', href: '/sitemap.xml', root: true },
        { label: isFr ? 'Flux RSS' : 'RSS feed', href: '/rss.xml', root: true },
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
        // { label: 'LLMs.txt', href: '/llms.txt', root: true },
        // { label: 'Robots.txt', href: '/robots.txt', root: true },
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
              <Image
                src="/ci-logo-white.png"
                alt="Cellule Infrastructures"
                width={160}
                height={48}
                className="h-10 w-auto object-contain sm:h-12"
              />
              <Image
                src="/gouv-logo.png"
                alt={isFr ? 'Gouvernement de la RDC' : 'Government of the DRC'}
                width={56}
                height={56}
                className="h-11 w-11 object-contain opacity-90 sm:h-12 sm:w-12"
              />
            </Link>
            <div className="ci-footer-brand-copy">
              <p className="ci-footer-logo-sub">
                {isFr ? 'République Démocratique du Congo' : 'Democratic Republic of Congo'}
              </p>
              <p className="ci-footer-desc">{footerDescription}</p>
            </div>
            <div className="ci-footer-social">
              {[
                { href: settings?.facebookUrl, icon: Facebook, label: 'Facebook' },
                { href: settings?.xUrl, icon: Twitter, label: 'Twitter / X' },
                { href: settings?.youtubeUrl, icon: Youtube, label: 'YouTube' },
                { href: settings?.linkedinUrl, icon: Linkedin, label: 'LinkedIn' },
              ].filter((item) => item.href).map(({ href, icon: Icon, label }) => (
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
                    {'root' in link && link.root ? (
                      <a href={link.href} className="ci-footer-link">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={`/${locale}${link.href}`} className="ci-footer-link">
                        {link.label}
                      </Link>
                    )}
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
                <span>{address}</span>
              </li>
              <li>
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{phone}</span>
              </li>
              <li>
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                <a href={`mailto:${email}`} className="ci-footer-link">
                  {email}
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
