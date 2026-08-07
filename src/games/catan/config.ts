import type { GameConfig } from '../../types/game';

export interface CatanMeta {
  expansions: string[];
}

export const catanConfig: GameConfig<CatanMeta> = {
  id: 'catan',
  name: 'Catan',
  type: 'result',
  minPlayers: 3,
  maxPlayers: 4,
  meta: {
    expansions: ['Seafarers', 'Cities & Knights'],
  },
};
