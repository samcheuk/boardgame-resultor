import { useLocale } from '../../i18n/useLocale';

interface FloatingAddButtonProps {
  onClick: () => void;
  label?: string;
}

export function FloatingAddButton({
  onClick,
  label,
}: FloatingAddButtonProps) {
  const { t } = useLocale();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label ?? t('records.add')}
      className="fixed right-5 bottom-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-2xl text-white shadow-lg transition hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
    >
      +
    </button>
  );
}
