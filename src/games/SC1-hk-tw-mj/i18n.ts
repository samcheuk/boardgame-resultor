import type { Locale, TranslationParams } from '../../i18n/LocaleContext';
import { interpolate } from '../../i18n/translate';

const en = {
  deleteConfirm: 'Delete this {{game}} record?',
  playersAndBalances: 'Players & balances',
  playerInstructions:
    'Add at least {{min}} players. Enter each player\'s money balance (win positive, lose negative). Balances must sum to zero.',
  player: 'Player {{number}}',
  playerName: 'Player name',
  balance: 'Balance',
  addPlayer: '+ Add player',
  balanceSum: 'Sum: {{sum}}',
  balanceSumOk: 'Zero-sum ✓',
  formatBalance: '{{balance}}',
  missingPlayerName: 'Enter a name for every player.',
  invalidPlayerCount: 'Add at least {{min}} players.',
  invalidBalances: 'Balances must be valid numbers.',
  zeroSumRequired: 'Balances must sum to zero (currently {{sum}}).',
} as const;

export type HkTwMjTranslationKey = keyof typeof en;

const messages: Record<Locale, Record<HkTwMjTranslationKey, string>> = {
  en,
  'zh-TW': {
    deleteConfirm: '確定刪除此 {{game}} 紀錄？',
    playersAndBalances: '玩家及金錢結餘',
    playerInstructions:
      '至少 {{min}} 位玩家。輸入每位玩家的金錢結餘（贏為正、輸為負）。所有結餘加總必須為 0。',
    player: '玩家 {{number}}',
    playerName: '玩家名稱',
    balance: '結餘',
    addPlayer: '+ 新增玩家',
    balanceSum: '加總：{{sum}}',
    balanceSumOk: '零和 ✓',
    formatBalance: '{{balance}}',
    missingPlayerName: '請輸入每位玩家的名稱。',
    invalidPlayerCount: '請至少加入 {{min}} 位玩家。',
    invalidBalances: '結餘必須為有效數字。',
    zeroSumRequired: '結餘加總必須為 0（目前為 {{sum}}）。',
  },
};

export function hkTwMjText(
  locale: Locale,
  key: HkTwMjTranslationKey,
  params?: TranslationParams,
): string {
  return interpolate(messages[locale][key], params);
}

/** Signed money display, e.g. +120 / -80 / 0 */
export function formatBalance(value: number): string {
  if (value > 0) {
    return `+${value}`;
  }
  return String(value);
}
