import type { GameConfig } from '../../types/game';
import bgImage from './bg-image.webp';

export interface CatanMeta {
  expansions: string[];
}

/** BoardGameGeek: https://boardgamegeek.com/boardgame/13/catan */
export const catanConfig: GameConfig<CatanMeta> = {
  id: '13',
  slug: 'catan',
  name: {
    en: 'Catan',
    'zh-TW': '卡坦島',
  },
  type: 'result',
  minPlayers: 3,
  maxPlayers: 4,
  bggUrl: 'https://boardgamegeek.com/boardgame/13/catan',
  coverImage: bgImage,
  meta: {
    expansions: ['Seafarers', 'Cities & Knights'],
  },
};
