import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ResultGamePage } from '../../../components/game/ResultGamePage';
import { useAuth } from '../../../contexts/AuthContext';
import {
  deleteGameResult,
  listGameResults,
} from '../../../services/gameResults';
import {
  deleteIncenseMoney,
  listIncenseMoney,
} from '../../../services/gameIncenseMoney';
import { localizeError } from '../../../i18n/errors';
import type { Locale } from '../../../i18n/LocaleContext';
import { useLocale } from '../../../i18n/useLocale';
import type { IncenseMoneyRecord } from '../../../types/incenseMoney';
import type { GameResultRecord } from '../../../types/record';
import { getGameName } from '../../getGameName';
import type { GamePageProps } from '../../loadGameView';
import { formatBalance, hkTwMjText } from '../i18n';
import { buildLeaderboardTables } from '../leaderboard';
import type {
  IncenseLeaderboardEntry,
  ResultLeaderboardEntry,
} from '../leaderboard';
import { FloatingAddMenu } from './FloatingAddMenu';
import { IncenseMoneyForm } from './IncenseMoneyForm';
import { HkTwMjRecordForm } from './RecordForm';

type ListTab = 'results' | 'incense' | 'leaderboard';

function formatPlayedDate(date: Date, locale: Locale): string {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatPlayedTime(date: Date, locale: Locale): string {
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function parseListTab(value: string | null): ListTab {
  if (value === 'incense' || value === 'leaderboard') {
    return value;
  }
  return 'results';
}

function TabSegment({
  value,
  onChange,
}: {
  value: ListTab;
  onChange: (tab: ListTab) => void;
}) {
  const { locale } = useLocale();
  const options: Array<{ id: ListTab; label: string }> = [
    { id: 'results', label: hkTwMjText(locale, 'tabResults') },
    { id: 'incense', label: hkTwMjText(locale, 'tabIncense') },
    { id: 'leaderboard', label: hkTwMjText(locale, 'tabLeaderboard') },
  ];

  return (
    <div
      role="tablist"
      aria-label={hkTwMjText(locale, 'tabsLabel')}
      className="inline-flex min-h-9 max-w-full items-stretch overflow-x-auto rounded-lg border border-neutral-300 bg-white/95 p-0.5 dark:border-neutral-600 dark:bg-neutral-900/95"
    >
      {options.map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => {
              onChange(option.id);
            }}
            className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              selected
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function signedClass(value: number): string {
  if (value > 0) {
    return 'text-emerald-700 dark:text-emerald-400';
  }
  if (value < 0) {
    return 'text-red-700 dark:text-red-400';
  }
  return 'text-neutral-900 dark:text-neutral-50';
}

function ResultStandings({ entries }: { entries: ResultLeaderboardEntry[] }) {
  const { locale, t } = useLocale();

  if (entries.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-neutral-300 px-4 py-8 text-center text-sm text-neutral-500 dark:border-neutral-600 dark:text-neutral-400">
        {hkTwMjText(locale, 'leaderboardResultsEmpty')}
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {entries.map((entry, index) => (
        <li
          key={entry.key}
          className="flex items-baseline justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-900"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-50">
              <span className="mr-2 text-neutral-400 dark:text-neutral-500">
                {t('common.rank', { rank: index + 1 })}
              </span>
              {entry.name}
            </p>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              {hkTwMjText(locale, 'leaderboardResultMeta', {
                games: entry.games,
              })}
            </p>
          </div>
          <p
            className={`shrink-0 text-sm font-semibold tabular-nums ${signedClass(entry.total)}`}
          >
            {formatBalance(entry.total)}
          </p>
        </li>
      ))}
    </ul>
  );
}

function IncenseStandings({ entries }: { entries: IncenseLeaderboardEntry[] }) {
  const { locale, t } = useLocale();

  if (entries.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-neutral-300 px-4 py-8 text-center text-sm text-neutral-500 dark:border-neutral-600 dark:text-neutral-400">
        {hkTwMjText(locale, 'leaderboardIncenseEmpty')}
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {entries.map((entry, index) => (
        <li
          key={entry.key}
          className="flex items-baseline justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-900"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-50">
              <span className="mr-2 text-neutral-400 dark:text-neutral-500">
                {t('common.rank', { rank: index + 1 })}
              </span>
              {entry.name}
            </p>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              {hkTwMjText(locale, 'leaderboardIncenseMeta', {
                count: entry.count,
              })}
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold tabular-nums text-neutral-900 dark:text-neutral-50">
            {entry.total}
          </p>
        </li>
      ))}
    </ul>
  );
}

function LeaderboardList({
  results,
  incense,
}: {
  results: ResultLeaderboardEntry[];
  incense: IncenseLeaderboardEntry[];
}) {
  const { locale } = useLocale();

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {hkTwMjText(locale, 'leaderboardResultsTitle')}
        </h3>
        <ResultStandings entries={results} />
      </section>
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {hkTwMjText(locale, 'leaderboardIncenseTitle')}
        </h3>
        <IncenseStandings entries={incense} />
      </section>
    </div>
  );
}

function ResultsList({
  game,
  records,
  deletingId,
  onDelete,
}: {
  game: GamePageProps['game'];
  records: GameResultRecord[];
  deletingId: string | null;
  onDelete: (recordId: string) => void;
}) {
  const { locale, t } = useLocale();

  return (
    <ul className="space-y-3">
      {records.map((record) => {
        const rankedPlayers = [...record.players].sort(
          (a, b) => b.points - a.points,
        );
        return (
          <li
            key={record.id}
            className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                  {formatPlayedDate(record.playedAt, locale)}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {formatPlayedTime(record.playedAt, locale)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  to={`/game/${game.id}/edit/${record.id}`}
                  className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs hover:bg-neutral-50 dark:border-neutral-600 dark:hover:bg-neutral-800"
                >
                  {t('common.edit')}
                </Link>
                <button
                  type="button"
                  disabled={deletingId === record.id}
                  onClick={() => {
                    onDelete(record.id);
                  }}
                  className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                >
                  {deletingId === record.id
                    ? t('common.deleting')
                    : t('common.delete')}
                </button>
              </div>
            </div>

            <ol className="mt-3 space-y-1.5 border-t border-neutral-100 pt-3 dark:border-neutral-800">
              {rankedPlayers.map((player, index) => (
                <li
                  key={`${record.id}-${player.email ?? player.name}-${index}`}
                  className="flex items-baseline justify-between gap-3 text-sm"
                >
                  <span className="min-w-0 truncate text-neutral-700 dark:text-neutral-300">
                    <span className="mr-2 text-neutral-400 dark:text-neutral-500">
                      {t('common.rank', { rank: index + 1 })}
                    </span>
                    {player.name}
                  </span>
                  <span
                    className={`shrink-0 font-medium tabular-nums ${
                      player.points > 0
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : player.points < 0
                          ? 'text-red-700 dark:text-red-400'
                          : 'text-neutral-900 dark:text-neutral-50'
                    }`}
                  >
                    {hkTwMjText(locale, 'formatBalance', {
                      balance: formatBalance(player.points),
                    })}
                  </span>
                </li>
              ))}
            </ol>
          </li>
        );
      })}
    </ul>
  );
}

function IncenseList({
  game,
  records,
  deletingId,
  onDelete,
}: {
  game: GamePageProps['game'];
  records: IncenseMoneyRecord[];
  deletingId: string | null;
  onDelete: (recordId: string) => void;
}) {
  const { locale, t } = useLocale();

  return (
    <ul className="space-y-3">
      {records.map((record) => (
        <li
          key={record.id}
          className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                {record.name}
              </p>
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                {formatPlayedDate(record.date, locale)}
              </p>
            </div>
            <div className="flex shrink-0 items-start gap-2">
              <p className="pt-0.5 text-sm font-semibold tabular-nums text-neutral-900 dark:text-neutral-50">
                {hkTwMjText(locale, 'incenseFormatCost', {
                  cost: record.cost,
                })}
              </p>
              <Link
                to={`/game/${game.id}/edit/${record.id}?set=incense`}
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs hover:bg-neutral-50 dark:border-neutral-600 dark:hover:bg-neutral-800"
              >
                {t('common.edit')}
              </Link>
              <button
                type="button"
                disabled={deletingId === record.id}
                onClick={() => {
                  onDelete(record.id);
                }}
                className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
              >
                {deletingId === record.id
                  ? t('common.deleting')
                  : t('common.delete')}
              </button>
            </div>
          </div>
          {record.remark.trim().length > 0 ? (
            <p className="mt-3 border-t border-neutral-100 pt-3 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
              {record.remark}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function HkTwMjRecordList({ game }: Pick<GamePageProps, 'game'>) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { locale, t } = useLocale();
  const tRef = useRef(t);
  tRef.current = t;
  const tab = parseListTab(searchParams.get('tab'));
  const [resultRecords, setResultRecords] = useState<GameResultRecord[]>([]);
  const [incenseRecords, setIncenseRecords] = useState<IncenseMoneyRecord[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRecords() {
      setLoading(true);
      setError(null);
      try {
        const [results, incense] = await Promise.all([
          listGameResults(game.id),
          listIncenseMoney(game.id),
        ]);
        if (!cancelled) {
          setResultRecords(results);
          setIncenseRecords(incense);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            localizeError(err, tRef.current, 'records.loadFailed'),
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadRecords();
    return () => {
      cancelled = true;
    };
  }, [game.id]);

  function setTab(next: ListTab) {
    if (next === 'results') {
      setSearchParams({}, { replace: true });
      return;
    }
    setSearchParams({ tab: next }, { replace: true });
  }

  async function handleDeleteResult(recordId: string) {
    if (
      !window.confirm(
        hkTwMjText(locale, 'deleteConfirm', {
          game: getGameName(game, locale),
        }),
      )
    ) {
      return;
    }

    setDeletingId(recordId);
    setError(null);
    try {
      await deleteGameResult(recordId);
      setResultRecords((current) =>
        current.filter((item) => item.id !== recordId),
      );
    } catch (err) {
      setError(localizeError(err, t, 'records.deleteFailed'));
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDeleteIncense(recordId: string) {
    if (!window.confirm(hkTwMjText(locale, 'deleteIncenseConfirm'))) {
      return;
    }

    setDeletingId(recordId);
    setError(null);
    try {
      await deleteIncenseMoney(recordId);
      setIncenseRecords((current) =>
        current.filter((item) => item.id !== recordId),
      );
    } catch (err) {
      setError(localizeError(err, t, 'records.deleteFailed'));
    } finally {
      setDeletingId(null);
    }
  }

  const leaderboard = buildLeaderboardTables(resultRecords, incenseRecords);
  const pageTitle =
    tab === 'results'
      ? hkTwMjText(locale, 'tabResults')
      : tab === 'incense'
        ? hkTwMjText(locale, 'tabIncense')
        : hkTwMjText(locale, 'tabLeaderboard');
  const isEmpty =
    !loading &&
    (tab === 'leaderboard'
      ? leaderboard.results.length === 0 && leaderboard.incense.length === 0
      : tab === 'results'
        ? resultRecords.length === 0
        : incenseRecords.length === 0);

  return (
    <>
      {error ? (
        <p className="mb-4 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <ResultGamePage
        title={pageTitle}
        loading={loading}
        isEmpty={isEmpty}
        emptyMessage={
          tab === 'incense'
            ? hkTwMjText(locale, 'incenseEmpty')
            : tab === 'leaderboard'
              ? hkTwMjText(locale, 'leaderboardEmpty')
              : undefined
        }
        showAddButton={false}
        headerExtra={
          <TabSegment
            value={tab}
            onChange={(next) => {
              setTab(next);
            }}
          />
        }
      >
        {tab === 'results' ? (
          <ResultsList
            game={game}
            records={resultRecords}
            deletingId={deletingId}
            onDelete={(recordId) => {
              void handleDeleteResult(recordId);
            }}
          />
        ) : null}
        {tab === 'incense' ? (
          <IncenseList
            game={game}
            records={incenseRecords}
            deletingId={deletingId}
            onDelete={(recordId) => {
              void handleDeleteIncense(recordId);
            }}
          />
        ) : null}
        {tab === 'leaderboard' ? (
          <LeaderboardList
            results={leaderboard.results}
            incense={leaderboard.incense}
          />
        ) : null}
      </ResultGamePage>

      <FloatingAddMenu
        onAddResult={() => {
          navigate(`/game/${game.id}/new`);
        }}
        onAddIncense={() => {
          navigate(`/game/${game.id}/new?set=incense`);
        }}
      />
    </>
  );
}

export default function HkTwMjGamePage({
  game,
  mode,
  recordId,
}: GamePageProps) {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const isIncense = searchParams.get('set') === 'incense';

  if (mode === 'create' || mode === 'edit') {
    if (isIncense) {
      return (
        <IncenseMoneyForm
          game={game}
          mode={mode}
          recordId={recordId}
          userEmail={user?.email ?? ''}
        />
      );
    }

    return (
      <HkTwMjRecordForm
        game={game}
        mode={mode}
        recordId={recordId}
        userEmail={user?.email ?? ''}
      />
    );
  }

  return <HkTwMjRecordList game={game} />;
}
