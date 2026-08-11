import type { GameConfig } from '../../types/game';
import bgImage from './bg-image.webp';

export interface WingspanMeta {
  scoreCategories: string[];
}

/** BoardGameGeek: https://boardgamegeek.com/boardgame/266192/wingspan */
export const wingspanConfig: GameConfig<WingspanMeta> = {
  id: '266192',
  slug: 'wingspan',
  name: 'Wingspan',
  type: 'result',
  minPlayers: 1,
  maxPlayers: 5,
  bggUrl: 'https://boardgamegeek.com/boardgame/266192/wingspan',
  coverImage: bgImage,
  meta: {
    scoreCategories: [
      'birds',
      'bonusCards',
      'endOfRoundGoals',
      'eggs',
      'cachedFood',
      'tuckedCards',
      'nectar',
    ],
  },
};
