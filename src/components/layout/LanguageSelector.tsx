import { useEffect, useId, useRef, useState } from 'react';
import type { Locale } from '../../i18n/LocaleContext';
import { useLocale } from '../../i18n/useLocale';

const OPTIONS: Array<{ value: Locale; label: string }> = [
  { value: 'en', label: 'English' },
  { value: 'zh-TW', label: '繁體中文' },
];

export function LanguageSelector() {
  const { locale, setLocale, t } = useLocale();
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const currentLabel =
    OPTIONS.find((option) => option.value === locale)?.label ?? locale;

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={t('language.label')}
        onClick={() => {
          setOpen((current) => !current);
        }}
        className="inline-flex min-h-11 min-w-[7.5rem] items-center justify-between gap-2 rounded-lg border border-neutral-300 bg-white/95 px-3 text-sm font-medium text-neutral-800 shadow-sm backdrop-blur transition hover:border-neutral-400 dark:border-neutral-600 dark:bg-neutral-900/95 dark:text-neutral-100 dark:hover:border-neutral-500"
      >
        <span className="truncate">{currentLabel}</span>
        <span aria-hidden className="text-neutral-500 dark:text-neutral-400">
          ▾
        </span>
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={t('language.label')}
          className="absolute right-0 z-50 mt-1 max-h-[min(16rem,50vh)] min-w-full overflow-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
        >
          {OPTIONS.map((option) => {
            const selected = locale === option.value;
            return (
              <li key={option.value} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={`flex min-h-11 w-full items-center px-3 text-left text-sm ${
                    selected
                      ? 'bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50'
                      : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800'
                  }`}
                  onClick={() => {
                    setLocale(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
