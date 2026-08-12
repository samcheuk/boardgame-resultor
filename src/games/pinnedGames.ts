const STORAGE_KEY = 'boardgame-resultor-pinned-games';

function isGameIdArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === 'string')
  );
}

export function readPinnedGameIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isGameIdArray(parsed)) {
      return [];
    }
    // Dedupe while preserving order
    return [...new Set(parsed.map((id) => id.trim()).filter(Boolean))];
  } catch {
    return [];
  }
}

export function writePinnedGameIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Ignore storage write errors (private mode, etc.).
  }
}

export function togglePinnedGameId(
  ids: readonly string[],
  gameId: string,
): string[] {
  if (ids.includes(gameId)) {
    return ids.filter((id) => id !== gameId);
  }
  // Newest pin goes first
  return [gameId, ...ids.filter((id) => id !== gameId)];
}

/**
 * Pinned games first (in pin order), then the rest in their existing order.
 */
export function sortGamesByPinned<T extends { id: string }>(
  gameList: readonly T[],
  pinnedIds: readonly string[],
): T[] {
  if (pinnedIds.length === 0) {
    return [...gameList];
  }

  const byId = new Map(gameList.map((game) => [game.id, game]));
  const pinned: T[] = [];
  for (const id of pinnedIds) {
    const game = byId.get(id);
    if (game) {
      pinned.push(game);
    }
  }

  const pinnedSet = new Set(pinned.map((game) => game.id));
  const rest = gameList.filter((game) => !pinnedSet.has(game.id));
  return [...pinned, ...rest];
}
