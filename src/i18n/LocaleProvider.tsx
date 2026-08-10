import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  LocaleContext,
  type Locale,
  type LocaleContextValue,
} from './LocaleContext';
import { translate } from './translate';

const COOKIE_NAME = 'boardgame-tracker-locale';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function readLocaleCookie(): Locale {
  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${COOKIE_NAME}=`));
  const value = cookie?.slice(COOKIE_NAME.length + 1);
  return value === 'zh-TW' || value === 'en' ? value : 'en';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(readLocaleCookie);

  useEffect(() => {
    document.cookie = `${COOKIE_NAME}=${locale}; Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
    document.documentElement.lang = locale;
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
