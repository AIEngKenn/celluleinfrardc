const VIEWER_NOISE_PATTERNS = [
  /chargement\.\.\.\s*précédent\s+page\s*\/\s*suivant\s+zoom\s*\+\s*zoom\s*-/gi,
  /chargement\.\.\./gi,
  /précédent\s+page\s*\/\s*suivant/gi,
  /zoom\s*\+\s*zoom\s*-/gi,
  /page\s+\d+\s+\/\s+\d+/gi,
  /loading\.\.\./gi,
  /previous\s+page\s*\/\s*next/gi,
];

export function cleanMigratedText(value = '') {
  return VIEWER_NOISE_PATTERNS.reduce((text, pattern) => text.replace(pattern, ' '), value)
    .replace(/\s+/g, ' ')
    .trim();
}

export function truncateText(value = '', maxLength = 120) {
  const text = value.replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

export function pageWindow(pageParam: string | undefined, pageSize: number) {
  const page = Math.max(1, Number(pageParam || '1') || 1);
  const start = (page - 1) * pageSize;
  return { page, start, end: start + pageSize };
}
