import type { Locale, TranslationParams } from '../../i18n/LocaleContext';
import { interpolate } from '../../i18n/translate';

const en = {
  deleteConfirm: 'Delete this {{game}} record?',
  deleteIncenseConfirm: 'Delete this incense money record?',
  tabResults: 'Results',
  tabIncense: 'Incense money',
  tabsLabel: 'Record sets',
  addMenuLabel: 'Add record',
  addResult: 'Add result',
  addIncense: 'Add incense money',
  incenseEmpty: 'No incense money records yet. Tap + to add one.',
  playersAndBalances: 'Players & balances',
  playerInstructions:
    "Add at least {{min}} players. Enter each player's money balance (win positive, lose negative). Balances must sum to zero.",
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
  incenseName: 'Name',
  incenseCost: 'Cost',
  incenseRemark: 'Remark',
  incenseDate: 'Date',
  incenseMissingName: 'Enter a name.',
  incenseInvalidCost: 'Cost must be a valid number.',
  incenseInvalidDate: 'Please enter a valid date.',
  incenseFormatCost: '{{cost}}',
} as const;

export type HkTwMjTranslationKey = keyof typeof en;

const messages: Record<Locale, Record<HkTwMjTranslationKey, string>> = {
  en,
  'zh-TW': {
    deleteConfirm: '確定刪除此 {{game}} 紀錄？',
    deleteIncenseConfirm: '確定刪除此香油錢紀錄？',
    tabResults: '賽果',
    tabIncense: '香油錢',
    tabsLabel: '紀錄分類',
    addMenuLabel: '新增紀錄',
    addResult: '新增賽果',
    addIncense: '新增香油錢',
    incenseEmpty: '尚未有香油錢紀錄，按 + 新增。',
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
    incenseName: '名稱',
    incenseCost: '金額',
    incenseRemark: '備註',
    incenseDate: '日期',
    incenseMissingName: '請輸入名稱。',
    incenseInvalidCost: '金額必須為有效數字。',
    incenseInvalidDate: '請輸入有效日期。',
    incenseFormatCost: '{{cost}}',
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
