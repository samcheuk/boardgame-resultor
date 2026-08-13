import { useLocale } from '../../../i18n/useLocale';
import {
  FAN_TABLE_ROWS,
  FAN_TABLE_SOURCE_URL,
  IMMEDIATE_PAYMENT_ROWS,
  type FanTableRow,
} from '../fanTable';
import { hkTwMjText } from '../i18n';

function FanList({
  caption,
  rows,
}: {
  caption: string;
  rows: FanTableRow[];
}) {
  const { locale } = useLocale();

  return (
    <section aria-label={caption}>
      <ul className="divide-y divide-neutral-100 overflow-hidden rounded-lg border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-700 dark:bg-neutral-900">
        {rows.map((row) => (
          <li key={row.id} className="px-3 py-3">
            <div className="flex items-start justify-between gap-3">
              <h4 className="min-w-0 text-sm font-medium break-words text-neutral-900 dark:text-neutral-50">
                {row.name}
              </h4>
              <p className="shrink-0 rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-semibold tabular-nums text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
                <span className="sr-only">
                  {hkTwMjText(locale, 'fanColFan')}:{' '}
                </span>
                {row.fan}
              </p>
            </div>
            {row.description ? (
              <p className="mt-1.5 text-sm leading-relaxed break-words text-neutral-600 dark:text-neutral-300">
                {row.description}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function HelperPage() {
  const { locale } = useLocale();

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {hkTwMjText(locale, 'fanTableTitle')}
          </h3>
          <a
            href={FAN_TABLE_SOURCE_URL}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-neutral-500 underline hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            {hkTwMjText(locale, 'fanTableSource')}
          </a>
        </div>
        <FanList
          caption={hkTwMjText(locale, 'fanTableTitle')}
          rows={FAN_TABLE_ROWS}
        />
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {hkTwMjText(locale, 'immediatePayTitle')}
        </h3>
        <FanList
          caption={hkTwMjText(locale, 'immediatePayTitle')}
          rows={IMMEDIATE_PAYMENT_ROWS}
        />
      </section>
    </div>
  );
}
