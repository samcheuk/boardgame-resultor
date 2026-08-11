import type { Locale, TranslationParams } from '../../i18n/LocaleContext';
import { interpolate } from '../../i18n/translate';

const en = {
  deleteConfirm: 'Delete this Catan record?',
  playersAndPoints: 'Players & points',
  playerInstructions:
    'Focus a name field to open the whitelist list. Type to filter, or enter a custom name. Fill {{min}}–{{max}} players; leave unused slots blank.',
  player: 'Player {{number}}',
  points: 'Points',
  invalidPlayerCount:
    'Fill in {{min}}–{{max}} players (leave unused slots blank).',
  invalidPoints: 'Points must be zero or a positive number.',
} as const;

type CatanTranslationKey = keyof typeof en;

const messages: Record<
  Locale,
  Record<CatanTranslationKey, string>
> = {
  en,
  'zh-TW': {
    deleteConfirm: '確定刪除此 Catan 紀錄？',
    playersAndPoints: '玩家及分數',
    playerInstructions:
      '點選名稱欄以開啟允許名單。輸入文字可篩選，亦可輸入自訂名稱。請填寫 {{min}}–{{max}} 位玩家，未使用的欄位留空。',
    player: '玩家 {{number}}',
    points: '分數',
    invalidPlayerCount: '請填寫 {{min}}–{{max}} 位玩家，未使用的欄位留空。',
    invalidPoints: '分數必須為零或正數。',
  },
};

export function catanText(
  locale: Locale,
  key: CatanTranslationKey,
  params?: TranslationParams,
): string {
  return interpolate(messages[locale][key], params);
}
