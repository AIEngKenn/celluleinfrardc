import type { Procurement } from '@/lib/sanity/types';

const SIDE_CARD_COUNT = 4;

/** Featured opportunity + up to four list cards for the homepage section. */
export function resolveHomeProcurement(
  open: Procurement[] | undefined,
  backfill: Procurement[] | undefined
): Procurement[] {
  const openItems = open ?? [];
  if (openItems.length === 0) return [];

  const featured = openItems[0];
  const rest: Procurement[] = [];
  const usedIds = new Set<string>([featured._id]);

  for (const item of openItems.slice(1)) {
    if (rest.length >= SIDE_CARD_COUNT) break;
    rest.push(item);
    usedIds.add(item._id);
  }

  if (rest.length < SIDE_CARD_COUNT) {
    for (const item of backfill ?? []) {
      if (rest.length >= SIDE_CARD_COUNT) break;
      if (usedIds.has(item._id)) continue;
      rest.push(item);
      usedIds.add(item._id);
    }
  }

  return [featured, ...rest];
}
