function normalize(value: string): string {
  return value.trim().toLowerCase();
}

/** Higher score = better match. 0 means no match. */
function scoreField(field: string, query: string): number {
  const value = normalize(field);
  if (!value || !query) {
    return 0;
  }

  if (value === query) {
    return 100;
  }
  if (value.startsWith(query)) {
    return 80;
  }
  if (value.includes(query)) {
    return 60;
  }

  return 0;
}

export function scoreCatalogEntry(
  entry: { id: string; name: string },
  query: string,
): number {
  const needle = normalize(query);
  if (!needle) {
    return 0;
  }

  return Math.max(
    scoreField(entry.name, needle),
    scoreField(entry.id, needle),
    scoreField(entry.id.replace(/-/g, ' '), needle),
    scoreField(entry.id.replace(/-/g, ''), needle),
  );
}

/**
 * Instant filter + best-match sort (same scoring style as game search).
 * Empty query returns entries in original order.
 */
export function filterAndSortCatalogEntries<T extends { id: string; name: string }>(
  entries: readonly T[],
  query: string,
): T[] {
  const needle = normalize(query);
  if (!needle) {
    return [...entries];
  }

  return entries
    .map((entry) => ({ entry, score: scoreCatalogEntry(entry, needle) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.entry.name.localeCompare(b.entry.name);
    })
    .map((row) => row.entry);
}
