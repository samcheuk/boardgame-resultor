import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ResultGamePage } from '../../../components/game/ResultGamePage';
import { useAuth } from '../../../contexts/AuthContext';
import {
  deleteGameResult,
  listGameResults,
} from '../../../services/gameResults';
import type { GameResultRecord } from '../../../types/record';
import type { GamePageProps } from '../../loadGameView';
import { CatanRecordForm } from './RecordForm';

function formatPlayedDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatPlayedTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function CatanRecordList({ game }: Pick<GamePageProps, 'game'>) {
  const navigate = useNavigate();
  const [records, setRecords] = useState<GameResultRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadRecords() {
    setLoading(true);
    setError(null);
    try {
      const items = await listGameResults(game.id);
      setRecords(items);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load records';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRecords();
  }, [game.id]);

  async function handleDelete(recordId: string) {
    const confirmed = window.confirm('Delete this Catan record?');
    if (!confirmed) {
      return;
    }

    setDeletingId(recordId);
    setError(null);
    try {
      await deleteGameResult(recordId);
      setRecords((current) => current.filter((item) => item.id !== recordId));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete record';
      setError(message);
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
        {records.map((record) => (
          <li
            key={record.id}
            className="rounded-lg border border-neutral-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-900">
                  {formatPlayedDate(record.playedAt)}
                </p>
                <p className="text-xs text-neutral-500">
                  {formatPlayedTime(record.playedAt)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  to={`/game/${game.id}/edit/${record.id}`}
                  className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs hover:bg-neutral-50"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  disabled={deletingId === record.id}
                  onClick={() => {
                    void handleDelete(record.id);
                  }}
                  className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  {deletingId === record.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>

            <ul className="mt-3 space-y-1.5 border-t border-neutral-100 pt-3">
              {record.players.map((player, index) => (
                <li
                  key={`${record.id}-${player.email ?? player.name}-${index}`}
                  className="flex items-baseline justify-between gap-3 text-sm"
                >
                  <span className="min-w-0 truncate text-neutral-700">
                    {player.name}
                  </span>
                  <span className="shrink-0 font-medium text-neutral-900">
                    {player.points} pts
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </ResultGamePage>
  );
}

export default function CatanGamePage({ game, mode, recordId }: GamePageProps) {
  const { user } = useAuth();

  if (mode === 'create' || mode === 'edit') {
    return (
      <CatanRecordForm
        game={game}
        mode={mode}
        recordId={recordId}
        userEmail={user?.email ?? ''}
      />
    );
  }

  return <CatanRecordList game={game} />;
}
