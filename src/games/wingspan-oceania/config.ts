import type { GameConfig } from '../../types/game';
import bgImage from './bg-image.webp';

export interface WingspanOceaniaMeta {
  scoreCategories: string[];
}

/** BoardGameGeek: https://boardgamegeek.com/boardgame/300580/wingspan-oceania-expansion */
export const wingspanOceaniaConfig: GameConfig<WingspanOceaniaMeta> = {
  id: '300580',
  slug: 'wingspan-oceania',
  name: 'Wingspan: Oceania Expansion',
  type: 'result',
  minPlayers: 1,
  maxPlayers: 5,
  bggUrl: 'https://boardgamegeek.com/boardgame/300580/wingspan-oceania-expansion',
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
