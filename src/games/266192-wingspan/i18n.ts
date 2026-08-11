import type { Locale, TranslationParams } from '../../i18n/LocaleContext';
import { interpolate } from '../../i18n/translate';

const en = {
  deleteConfirm: 'Delete this {{game}} record?',
  birds: 'Birds',
  bonusCards: 'Bonus cards',
  endOfRoundGoals: 'End-of-round goals',
  eggs: 'Eggs',
  cachedFood: 'Cached food',
  tuckedCards: 'Tucked cards',
  nectar: 'Nectar (Oceania)',
  player: 'Player {{number}}',
  playerName: 'Player name',
  addPlayer: '+ Add player',
  total: 'Total: {{points}} pts',
  missingPlayerName: 'Enter a name for every player.',
  invalidScores: 'Scores must be zero or positive numbers.',
} as const;

export type WingspanTranslationKey = keyof typeof en;

const messages: Record<
  Locale,
  Record<WingspanTranslationKey, string>
> = {
  en,
  'zh-TW': {
    deleteConfirm: '確定刪除此 {{game}} 紀錄？',
    birds: '鳥類分數',
    bonusCards: '獎勵卡',
    endOfRoundGoals: '回合目標',
    eggs: '蛋',
    cachedFood: '鳥卡上的食物',
    tuckedCards: '塞在鳥下的卡牌',
    nectar: '花蜜（大洋洲擴充）',
    player: '玩家 {{number}}',
    playerName: '玩家名稱',
    addPlayer: '+ 新增玩家',
    total: '總分：{{points}} 分',
    missingPlayerName: '請輸入每位玩家的名稱。',
    invalidScores: '分數必須為零或正數。',
  },
};

export function wingspanText(
  locale: Locale,
  key: WingspanTranslationKey,
  params?: TranslationParams,
): string {
  return interpolate(messages[locale][key], params);
}
