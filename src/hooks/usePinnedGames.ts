import { useState } from 'react';
import {
  readPinnedGameIds,
  togglePinnedGameId,
  writePinnedGameIds,
} from '../games/pinnedGames';

export function usePinnedGames() {
  const [pinnedIds, setPinnedIds] = useState<string[]>(() =>
    readPinnedGameIds(),
  );

  function isPinned(gameId: string): boolean {
    return pinnedIds.includes(gameId);
  }

  function togglePin(gameId: string) {
    setPinnedIds((current) => {
      const next = togglePinnedGameId(current, gameId);
      writePinnedGameIds(next);
      return next;
    });
  }

  return { pinnedIds, isPinned, togglePin };
}
