import type { Locale, TranslationParams } from '../../i18n/LocaleContext';
import { interpolate } from '../../i18n/translate';

const en = {
  campaigns: 'Campaigns',
  empty: 'No campaigns yet. Tap + to start one.',
  add: 'Add campaign',
  addTitle: 'New campaign',
  editTitle: 'Edit campaign',
  deleteConfirm: 'Delete campaign "{{name}}"?',
  campaignName: 'Campaign name',
  dayTracker: 'Day tracker',
  day: 'Day {{day}}',
  notes: 'Notes',
  notesPlaceholder: 'Optional campaign notes',
  hunters: 'Hunters',
  hunter: 'Hunter {{number}}',
  hunterName: 'Hunter name',
  character: 'Character',
  equipment: 'Equipment',
  weapons: 'Weapons',
  armor: 'Armor',
  helm: 'Helm',
  mail: 'Mail',
  greaves: 'Greaves',
  items: 'Items',
  addHunter: '+ Add hunter',
  missingCampaignName: 'Enter a campaign name.',
  missingHunterName: 'Enter a name for every hunter.',
  invalidDay: 'Day must be 1 or higher.',
  huntersCount: '{{count}} hunters',
  ownedEquipment: '{{count}} equipment',
  ownedItems: '{{count}} item types',
} as const;

export type MhwTranslationKey = keyof typeof en;

const messages: Record<Locale, Record<MhwTranslationKey, string>> = {
  en,
  'zh-TW': {
    campaigns: '戰役',
    empty: '尚未有戰役，按 + 開始。',
    add: '新增戰役',
    addTitle: '新增戰役',
    editTitle: '編輯戰役',
    deleteConfirm: '確定刪除戰役「{{name}}」？',
    campaignName: '戰役名稱',
    dayTracker: '日程追蹤',
    day: '第 {{day}} 天',
    notes: '備註',
    notesPlaceholder: '可選的戰役備註',
    hunters: '獵人',
    hunter: '獵人 {{number}}',
    hunterName: '獵人名稱',
    character: '角色',
    equipment: '裝備',
    weapons: '武器',
    armor: '防具',
    helm: '頭盔',
    mail: '鎧甲',
    greaves: '護腿',
    items: '道具／素材',
    addHunter: '+ 新增獵人',
    missingCampaignName: '請輸入戰役名稱。',
    missingHunterName: '請輸入每位獵人的名稱。',
    invalidDay: '日程必須為 1 或以上。',
    huntersCount: '{{count}} 位獵人',
    ownedEquipment: '{{count}} 件裝備',
    ownedItems: '{{count}} 種道具',
  },
};

export function mhwText(
  locale: Locale,
  key: MhwTranslationKey,
  params?: TranslationParams,
): string {
  return interpolate(messages[locale][key], params);
}
