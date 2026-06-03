'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, FormEvent } from 'react';
import { Search } from 'lucide-react';

interface Props {
  defaultValue?: string;
  locale: string;
  placeholder?: string;
}

export function SearchForm({ defaultValue = '', locale, placeholder }: Props) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (q) {
      router.push(`/${locale}/recherche?q=${encodeURIComponent(q)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
      <div className="relative flex overflow-hidden rounded-xl border-2 border-rdc-blue bg-white shadow-md focus-within:ring-2 focus-within:ring-rdc-blue/30">
        <input
          ref={inputRef}
          type="search"
          name="q"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder ?? (locale === 'fr' ? 'Rechercher...' : 'Search...')}
          className="flex-1 bg-transparent px-5 py-4 text-lg text-gray-900 placeholder-gray-400 outline-none"
          autoFocus
          aria-label={locale === 'fr' ? 'Rechercher' : 'Search'}
        />
        <button
          type="submit"
          className="flex items-center gap-2 bg-rdc-blue px-6 py-4 text-white transition-colors hover:bg-rdc-blue/90 focus:outline-none focus:ring-2 focus:ring-rdc-blue/50"
          aria-label={locale === 'fr' ? 'Lancer la recherche' : 'Search'}
        >
          <Search className="h-5 w-5" />
          <span className="hidden text-sm font-medium sm:inline">
            {locale === 'fr' ? 'Rechercher' : 'Search'}
          </span>
        </button>
      </div>
    </form>
  );
}
