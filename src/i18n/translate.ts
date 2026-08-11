import { en, type TranslationKey } from './locales/en';
import { zhTW } from './locales/zh-TW';
import type { Locale, TranslationParams } from './LocaleContext';

const dictionaries: Record<Locale, Record<TranslationKey, string>> = {
  en,
  'zh-TW': zhTW,
};

export function interpolate(
  message: string,
  params: TranslationParams = {},
): string {
  return message.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    const value = params[key];
    return value === undefined ? match : String(value);
  });
}

export function translate(
  locale: Locale,
  key: TranslationKey,
  params?: TranslationParams,
): string {
  return interpolate(dictionaries[locale][key], params);
}
