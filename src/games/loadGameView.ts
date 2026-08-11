import type { ComponentType } from 'react';
import type { GameConfig } from '../types/game';
import { getGameModuleDir } from './getGameModuleDir';

export interface GamePageProps {
  game: GameConfig;
  mode: 'list' | 'create' | 'edit';
  recordId?: string;
}

type GamePageComponent = ComponentType<GamePageProps>;

/**
 * Vite glob of optional per-game pages.
 * Path uses module dir: src/games/<id>-<slug>/views/GamePage.tsx
 * GameConfig.id remains the BoardGameGeek item ID.
 */
const gamePageModules = import.meta.glob<{ default: GamePageComponent }>(
  './*/views/GamePage.tsx',
);

export async function loadGamePage(
  game: Pick<GameConfig, 'id' | 'slug'>,
): Promise<GamePageComponent | null> {
  const path = `./${getGameModuleDir(game)}/views/GamePage.tsx`;
  const loader = gamePageModules[path];

  if (!loader) {
    return null;
  }

  const module = await loader();
  return module.default;
}
