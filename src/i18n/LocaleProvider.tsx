import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  LocaleContext,
  type Locale,
  type LocaleContextValue,
} from './LocaleContext';
import { translate } from './translate';

const STORAGE_KEY = 'boardgame-resultor-locale';

function isLocale(value: string | null): value is Locale {
  return value === 'en' || value === 'zh-TW';
}

function readStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) {
      return stored;
    }
  } catch {
    // Ignore storage access errors (private mode, etc.).
  }

  return 'en';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(readStoredLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // Ignore storage write errors.
    }
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, params) => translate(locale, key, params),
    }),
    [locale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}
