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
