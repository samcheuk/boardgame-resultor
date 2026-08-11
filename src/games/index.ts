import type { GameConfig } from '../types/game';
import { catanConfig } from './catan/config';
import { gloomhavenConfig } from './gloomhaven/config';
import { wingspanConfig } from './wingspan/config';
import { wingspanOceaniaConfig } from './wingspan-oceania/config';

export { getGameName } from './getGameName';
export { filterAndSortGames, scoreGameSearch } from './searchGames';

export const games: GameConfig[] = [
  catanConfig,
  gloomhavenConfig,
  wingspanConfig,
  wingspanOceaniaConfig,
];

export function getGameById(gameId: string): GameConfig | undefined {
  return games.find((game) => game.id === gameId);
}
