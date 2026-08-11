import type { GameConfig } from '../../types/game';

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
