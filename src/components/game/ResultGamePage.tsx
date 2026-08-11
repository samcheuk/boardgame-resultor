import type { ReactNode } from 'react';
import { useLocale } from '../../i18n/useLocale';
import { FloatingAddButton } from './FloatingAddButton';

interface ResultGamePageProps {
  title?: string;
  loading?: boolean;
  emptyMessage?: string;
  isEmpty?: boolean;
  onAdd: () => void;
  children: ReactNode;
}

/**
 * Shared UI template for result-type games:
 * record list in the main area + floating add button.
 */
export function ResultGamePage({
  title,
  loading = false,
  emptyMessage,
  isEmpty = false,
  onAdd,
  children,
}: ResultGamePageProps) {
  const { t } = useLocale();

  return (
    <section className="relative pb-24">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {title ?? t('records.title')}
        </h2>
      </div>

      {loading ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {t('records.loading')}
        </p>
      ) : null}

      {!loading && isEmpty ? (
        <p className="rounded-lg border border-dashed border-neutral-300 px-4 py-10 text-center text-sm text-neutral-500 dark:border-neutral-600 dark:text-neutral-400">
          {emptyMessage ?? t('records.empty')}
        </p>
      ) : null}

      {!loading && !isEmpty ? children : null}

      <FloatingAddButton onClick={onAdd} />
    </section>
  );
}
