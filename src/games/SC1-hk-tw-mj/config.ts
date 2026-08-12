import type { GameConfig } from '../../types/game';
import bgImage from './bg-image.webp';

export interface HkTwMjMeta {
  scoreUnit: 'balance';
}

/** Custom (non-BGG) game: HK-style Taiwanese Mahjong / 港式台牌 */
export const hkTwMjConfig: GameConfig<HkTwMjMeta> = {
  id: 'SC1',
  slug: 'hk-tw-mj',
  name: {
    en: 'HK-style Taiwanese Mahjong',
    'zh-TW': '港式台牌',
  },
  type: 'result',
  minPlayers: 4,
  maxPlayers: null,
  coverImage: bgImage,
  meta: {
    scoreUnit: 'balance',
  },
};
