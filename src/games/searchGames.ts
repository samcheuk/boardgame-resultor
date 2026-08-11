import type { GameConfig, LocalizedText } from '../types/game';

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

function scoreLocalizedText(text: LocalizedText, query: string): number {
  return Math.max(
    scoreField(text.en, query),
    scoreField(text['zh-TW'], query),
  );
}

export function scoreGameSearch(game: GameConfig, query: string): number {
  const needle = normalize(query);
  if (!needle) {
    return 0;
  }

  return Math.max(
    scoreLocalizedText(game.name, needle),
    scoreField(game.slug, needle),
    scoreField(game.slug.replace(/-/g, ' '), needle),
    scoreField(game.slug.replace(/-/g, ''), needle),
    scoreField(game.id, needle),
  );
}

/**
 * Instant filter + best-match sort.
 * Empty query returns games in original order.
 * Matches against all locale names, slug, and BGG id.
 */
export function filterAndSortGames(
  gameList: readonly GameConfig[],
  query: string,
): GameConfig[] {
  const needle = normalize(query);
  if (!needle) {
    return [...gameList];
  }

  return gameList
    .map((game) => ({ game, score: scoreGameSearch(game, needle) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.game.slug.localeCompare(b.game.slug);
    })
    .map((entry) => entry.game);
}
