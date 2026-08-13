import type { GameConfig } from '../../types/game';
import bgImage from './bg-image.webp';

export interface CascadiaMeta {
  scoreCategories: string[];
}

/** BoardGameGeek: https://boardgamegeek.com/boardgame/295947/cascadia */
export const cascadiaConfig: GameConfig<CascadiaMeta> = {
  id: '295947',
  slug: 'cascadia',
  name: {
    en: 'Cascadia',
    'zh-TW': '卡斯卡迪亞',
  },
  type: 'result',
  minPlayers: 1,
  maxPlayers: 4,
  bggUrl: 'https://boardgamegeek.com/boardgame/295947/cascadia',
  coverImage: bgImage,
  meta: {
    scoreCategories: [
      'bears',
      'elk',
      'salmon',
      'hawks',
      'foxes',
      'mountains',
      'forests',
      'prairies',
      'wetlands',
      'rivers',
      'habitatMajority',
      'natureTokens',
    ],
  },
};
