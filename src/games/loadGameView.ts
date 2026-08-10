import type { ComponentType } from 'react';
import type { GameConfig } from '../types/game';

export interface GamePageProps {
  game: GameConfig;
  mode: 'list' | 'create' | 'edit';
  recordId?: string;
}

type GamePageComponent = ComponentType<GamePageProps>;

/**
 * Vite glob of optional per-game pages.
 * Path uses folder slug: src/games/<slug>/views/GamePage.tsx
 * GameConfig.id remains the BoardGameGeek item ID.
 */
const gamePageModules = import.meta.glob<{ default: GamePageComponent }>(
  './*/views/GamePage.tsx',
);

export async function loadGamePage(
  slug: string,
): Promise<GamePageComponent | null> {
  const path = `./${slug}/views/GamePage.tsx`;
  const loader = gamePageModules[path];

  if (!loader) {
    return null;
  }

  const module = await loader();
  return module.default;
}
