import type { ComponentType } from 'react';
import type { GameConfig } from '../types/game';

export interface GameFormProps {
  game: GameConfig;
}

type GameFormComponent = ComponentType<GameFormProps>;

/**
 * Vite glob of optional per-game views.
 * Add `src/games/<gameId>/views/GameForm.tsx` (default export) to override
 * the generic Score Submission / Save State placeholders.
 */
const gameViewModules = import.meta.glob<{ default: GameFormComponent }>(
  './*/views/GameForm.tsx',
);

export async function loadGameView(
  gameId: string,
): Promise<GameFormComponent | null> {
  const path = `./${gameId}/views/GameForm.tsx`;
  const loader = gameViewModules[path];

  if (!loader) {
    return null;
  }

  const module = await loader();
  return module.default;
}
