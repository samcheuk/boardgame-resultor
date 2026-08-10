import type { GameConfig } from '../../types/game';
import catanBgImage from './bg-image.jpg';

export interface CatanMeta {
  expansions: string[];
}

/** BoardGameGeek: https://boardgamegeek.com/boardgame/13/catan */
export const catanConfig: GameConfig<CatanMeta> = {
  id: '13',
  slug: 'catan',
  name: 'Catan',
  type: 'result',
  minPlayers: 3,
  maxPlayers: 4,
  bggUrl: 'https://boardgamegeek.com/boardgame/13/catan',
  coverImage: catanBgImage,
  meta: {
    expansions: ['Seafarers', 'Cities & Knights'],
  },
};
