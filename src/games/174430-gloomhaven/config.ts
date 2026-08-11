import type { GameConfig } from '../../types/game';

export interface GloomhavenMeta {
  campaignName: string;
  scenarioCount: number;
}

/** BoardGameGeek: https://boardgamegeek.com/boardgame/174430/gloomhaven */
export const gloomhavenConfig: GameConfig<GloomhavenMeta> = {
  id: '174430',
  slug: 'gloomhaven',
  name: {
    en: 'Gloomhaven',
    'zh-TW': '幽港迷城',
  },
  type: 'status',
  minPlayers: 1,
  maxPlayers: 4,
  bggUrl: 'https://boardgamegeek.com/boardgame/174430/gloomhaven',
  meta: {
    campaignName: 'Gloomhaven',
    scenarioCount: 95,
  },
};
