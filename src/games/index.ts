import type { GameConfig } from '../types/game';
import { catanConfig } from './catan/config';
import { gloomhavenConfig } from './gloomhaven/config';
import { wingspanConfig } from './wingspan/config';

export const games: GameConfig[] = [
  catanConfig,
  gloomhavenConfig,
  wingspanConfig,
];

export function getGameById(gameId: string): GameConfig | undefined {
  return games.find((game) => game.id === gameId);
}
