'use client';

import { useMemo, useState } from 'react';
import { Check, Copy, Facebook, Linkedin, Mail, Send, Share2, Twitter } from 'lucide-react';

interface SharePanelProps {
  title: string;
  description?: string;
  path: string;
  locale: string;
}

export function SharePanel({ title, description, path, locale }: SharePanelProps) {
  const [copied, setCopied] = useState(false);
  const isFr = locale === 'fr';
  const url = useMemo(() => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || '';
    if (typeof window !== 'undefined') return new URL(path, window.location.origin).toString();
    return `${siteUrl}${path}`;
  }, [path]);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || title);

  const shareLinks = [
    {
      label: 'WhatsApp',
      icon: Send,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      label: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: 'X',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: 'Email',
      icon: Mail,
      href: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    },
  ];

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function nativeShare() {
    if (!navigator.share) return copyLink();
    await navigator.share({ title, text: description || title, url });
  }

  return (
    <section className="ci-share-panel" aria-label={isFr ? 'Partager' : 'Share'}>
      <div>
        <p className="ci-share-eyebrow">{isFr ? 'Partager cette page' : 'Share this page'}</p>
        <h2 className="ci-share-title">{isFr ? 'Diffuser le contenu' : 'Share this content'}</h2>
      </div>

      <div className="ci-share-actions">
        <button type="button" onClick={nativeShare} className="ci-share-primary">
          <Share2 className="h-4 w-4" />
          {isFr ? 'Partager' : 'Share'}
        </button>
        <button type="button" onClick={copyLink} className="ci-share-copy">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? (isFr ? 'Copié' : 'Copied') : isFr ? 'Copier le lien' : 'Copy link'}
        </button>
      </div>

      <div className="ci-share-grid">
        {shareLinks.map(({ label, icon: Icon, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="ci-share-link">
            <Icon className="h-4 w-4" />
            {label}
          </a>
        ))}
      </div>

      <p className="ci-share-url">{url}</p>
    </section>
  );
}
