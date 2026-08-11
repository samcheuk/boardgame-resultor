import type { ChangeEvent } from 'react';
import type { Locale } from '../../i18n/LocaleContext';
import { useLocale } from '../../i18n/useLocale';

export function LanguageSelector() {
  const { locale, setLocale, t } = useLocale();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    setLocale(event.target.value as Locale);
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <label className="sr-only" htmlFor="language-selector">
        {t('language.label')}
      </label>
      <select
        id="language-selector"
        value={locale}
        onChange={handleChange}
        aria-label={t('language.label')}
        className="rounded-md border border-neutral-300 bg-white/95 px-3 py-2 text-sm text-neutral-800 shadow-sm backdrop-blur transition hover:border-neutral-400"
      >
        <option value="en">English</option>
        <option value="zh-TW">繁體中文</option>
      </select>
    </div>
  );
}
