import type { Theme } from '../../theme/ThemeContext';
import { useTheme } from '../../theme/useTheme';
import { useLocale } from '../../i18n/useLocale';

const OPTIONS: Array<{
  value: Theme;
  labelKey: 'theme.light' | 'theme.dark';
  icon: 'sun' | 'moon';
}> = [
  { value: 'light', labelKey: 'theme.light', icon: 'sun' },
  { value: 'dark', labelKey: 'theme.dark', icon: 'moon' },
];

function ThemeIcon({ icon }: { icon: 'sun' | 'moon' }) {
  if (icon === 'sun') {
    return (
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a7 7 0 0 0 11.5 11.5Z" />
    </svg>
  );
}

export function ThemeSegmentControl() {
  const { theme, setTheme } = useTheme();
  const { t } = useLocale();

  return (
    <div
      role="group"
      aria-label={t('theme.label')}
      className="inline-flex min-h-11 items-stretch rounded-lg border border-neutral-300 bg-white/95 p-0.5 shadow-sm backdrop-blur dark:border-neutral-600 dark:bg-neutral-900/95"
    >
      {OPTIONS.map((option) => {
        const selected = theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            aria-label={t(option.labelKey)}
            title={t(option.labelKey)}
            onClick={() => {
              setTheme(option.value);
            }}
            className={`inline-flex min-w-10 items-center justify-center rounded-md px-2.5 transition ${
              selected
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'
            }`}
          >
            <ThemeIcon icon={option.icon} />
          </button>
        );
      })}
    </div>
  );
}
