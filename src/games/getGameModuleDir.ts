import type { GameConfig } from '../types/game';

/**
 * Folder under `src/games/`: `{id}-{slug}` (e.g. `13-catan`).
 */
export function getGameModuleDir(
  game: Pick<GameConfig, 'id' | 'slug'>,
): string {
  return `${game.id}-${game.slug}`;
}
