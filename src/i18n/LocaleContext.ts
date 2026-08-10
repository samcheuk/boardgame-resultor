import { createContext } from 'react';
import type { TranslationKey } from './locales/en';

export type Locale = 'en' | 'zh-TW';
export type TranslationParams = Record<string, string | number>;
export type Translate = (
  key: TranslationKey,
  params?: TranslationParams,
) => string;

export interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translate;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);
