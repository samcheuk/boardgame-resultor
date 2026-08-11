import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ResultGamePage } from '../../../components/game/ResultGamePage';
import { useAuth } from '../../../contexts/AuthContext';
import {
  deleteGameResult,
  listGameResults,
} from '../../../services/gameResults';
import { localizeError } from '../../../i18n/errors';
import type { Locale } from '../../../i18n/LocaleContext';
import { useLocale } from '../../../i18n/useLocale';
import type { GameResultRecord } from '../../../types/record';
import type { GamePageProps } from '../../loadGameView';
import { wingspanText } from '../i18n';
import { WingspanRecordForm } from './RecordForm';

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

function WingspanRecordList({ game }: Pick<GamePageProps, 'game'>) {
  const navigate = useNavigate();
  const { locale, t } = useLocale();
  const tRef = useRef(t);
  tRef.current = t;
  const [records, setRecords] = useState<GameResultRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRecords() {
      setLoading(true);
      setError(null);
      try {
        const items = await listGameResults(game.id);
        if (!cancelled) {
          setRecords(items);
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

  async function handleDelete(recordId: string) {
    if (!window.confirm(wingspanText(locale, 'deleteConfirm'))) {
      return;
    }

    setDeletingId(recordId);
    setError(null);
    try {
      await deleteGameResult(recordId);
      setRecords((current) => current.filter((item) => item.id !== recordId));
    } catch (err) {
      setError(localizeError(err, t, 'records.deleteFailed'));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <ResultGamePage
      loading={loading}
      isEmpty={!loading && records.length === 0}
      onAdd={() => {
        navigate(`/game/${game.id}/new`);
      }}
    >
      {error ? (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <ul className="space-y-3">
        {records.map((record) => {
          const rankedPlayers = [...record.players].sort(
            (a, b) => b.points - a.points,
          );
          return (
            <li
              key={record.id}
              className="rounded-lg border border-neutral-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900">
                    {formatPlayedDate(record.playedAt, locale)}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {formatPlayedTime(record.playedAt, locale)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    to={`/game/${game.id}/edit/${record.id}`}
                    className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs hover:bg-neutral-50"
                  >
                    {t('common.edit')}
                  </Link>
                  <button
                    type="button"
                    disabled={deletingId === record.id}
                    onClick={() => {
                      void handleDelete(record.id);
                    }}
                    className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === record.id
                      ? t('common.deleting')
                      : t('common.delete')}
                  </button>
                </div>
              </div>

              <ol className="mt-3 space-y-1.5 border-t border-neutral-100 pt-3">
                {rankedPlayers.map((player, index) => (
                  <li
                    key={`${record.id}-${player.email ?? player.name}-${index}`}
                    className="flex items-baseline justify-between gap-3 text-sm"
                  >
                    <span className="min-w-0 truncate text-neutral-700">
                      <span className="mr-2 text-neutral-400">
                        {t('common.rank', { rank: index + 1 })}
                      </span>
                      {player.name}
                    </span>
                    <span className="shrink-0 font-medium text-neutral-900">
                      {t('common.points', { points: player.points })}
                    </span>
                  </li>
                ))}
              </ol>
            </li>
          );
        })}
      </ul>
    </ResultGamePage>
  );
}

export default function WingspanGamePage({
  game,
  mode,
  recordId,
}: GamePageProps) {
  const { user } = useAuth();

  if (mode === 'create' || mode === 'edit') {
    return (
      <WingspanRecordForm
        game={game}
        mode={mode}
        recordId={recordId}
        userEmail={user?.email ?? ''}
      />
    );
  }

  return <WingspanRecordList game={game} />;
}
