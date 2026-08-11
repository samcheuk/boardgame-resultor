import type { GameConfig } from '../types/game';
import { catanConfig } from './13-catan/config';
import { gloomhavenConfig } from './174430-gloomhaven/config';
import { wingspanConfig } from './266192-wingspan/config';
import { wingspanOceaniaConfig } from './300580-wingspan-oceania/config';

export { getGameModuleDir } from './getGameModuleDir';
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
