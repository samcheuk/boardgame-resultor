import type { GameConfig } from '../../types/game';
import bgImage from './bg-image.webp';

export interface MonsterHunterWorldMeta {
  set: 'ancient-forest';
}

/** BoardGameGeek: https://boardgamegeek.com/boardgame/319971/monster-hunter-world-the-board-game */
export const monsterHunterWorldConfig: GameConfig<MonsterHunterWorldMeta> = {
  id: '319971',
  slug: 'monster-hunter-world',
  name: {
    en: 'Monster Hunter World: The Board Game',
    'zh-TW': '魔物獵人：世界 桌遊',
  },
  type: 'status',
  minPlayers: 1,
  maxPlayers: 4,
  bggUrl:
    'https://boardgamegeek.com/boardgame/319971/monster-hunter-world-the-board-game',
  coverImage: bgImage,
  meta: {
    set: 'ancient-forest',
  },
};
