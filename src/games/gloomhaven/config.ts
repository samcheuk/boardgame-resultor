import type { GameConfig } from '../../types/game';

export interface GloomhavenMeta {
  campaignName: string;
  scenarioCount: number;
}

export const gloomhavenConfig: GameConfig<GloomhavenMeta> = {
  id: 'gloomhaven',
  name: 'Gloomhaven',
  type: 'status',
  minPlayers: 1,
  maxPlayers: 4,
  meta: {
    campaignName: 'Gloomhaven',
    scenarioCount: 95,
  },
};
