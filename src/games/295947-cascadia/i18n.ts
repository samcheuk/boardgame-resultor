import type { Locale, TranslationParams } from '../../i18n/LocaleContext';
import { interpolate } from '../../i18n/translate';

const en = {
  deleteConfirm: 'Delete this {{game}} record?',
  sectionWildlife: 'Wildlife',
  sectionHabitats: 'Habitats (corridors)',
  sectionOther: 'Other',
  bears: 'Bears',
  elk: 'Elk',
  salmon: 'Salmon',
  hawks: 'Hawks',
  foxes: 'Foxes',
  mountains: 'Mountains',
  forests: 'Forests',
  prairies: 'Prairies',
  wetlands: 'Wetlands',
  rivers: 'Rivers',
  natureTokens: 'Nature tokens',
  subtotalWildlife: 'Wildlife subtotal: {{points}}',
  subtotalHabitats: 'Habitat subtotal: {{points}}',
  subtotalMajority: 'Habitat majority: {{points}}',
  subtotalMajorityHint: 'Auto-calculated by comparing corridor sizes',
  subtotalNature: 'Nature tokens: {{points}}',
  player: 'Player {{number}}',
  playerName: 'Player name',
  addPlayer: '+ Add player',
  total: 'Total: {{points}} pts',
  missingPlayerName: 'Enter a name for every player.',
  invalidScores: 'Scores must be zero or positive numbers.',
} as const;

export type CascadiaTranslationKey = keyof typeof en;

const messages: Record<Locale, Record<CascadiaTranslationKey, string>> = {
  en,
  'zh-TW': {
    deleteConfirm: '確定刪除此 {{game}} 紀錄？',
    sectionWildlife: '野生動物',
    sectionHabitats: '地形（走廊）',
    sectionOther: '其他',
    bears: '熊',
    elk: '麋鹿',
    salmon: '鮭魚',
    hawks: '鷹',
    foxes: '狐狸',
    mountains: '山地',
    forests: '森林',
    prairies: '草原',
    wetlands: '濕地',
    rivers: '河流',
    natureTokens: '自然代幣（松果）',
    subtotalWildlife: '野生動物小計：{{points}}',
    subtotalHabitats: '地形小計：{{points}}',
    subtotalMajority: '地形多數：{{points}}',
    subtotalMajorityHint: '按各玩家走廊大小自動比較計算',
    subtotalNature: '自然代幣：{{points}}',
    player: '玩家 {{number}}',
    playerName: '玩家名稱',
    addPlayer: '+ 新增玩家',
    total: '總分：{{points}} 分',
    missingPlayerName: '請輸入每位玩家的名稱。',
    invalidScores: '分數必須為零或正數。',
  },
};

export function cascadiaText(
  locale: Locale,
  key: CascadiaTranslationKey,
  params?: TranslationParams,
): string {
  return interpolate(messages[locale][key], params);
}
