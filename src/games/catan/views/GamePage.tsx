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

function formatPlayedAt(date: Date): string {
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPlayers(record: GameResultRecord): string {
  return record.players
    .map((player) => `${player.name} (${player.points})`)
    .join(', ');
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

      <div className="overflow-x-auto rounded-lg border border-neutral-200">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Date & time</th>
              <th className="px-4 py-3 font-medium">Players & points</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 whitespace-nowrap text-neutral-900">
                  {formatPlayedAt(record.playedAt)}
                </td>
                <td className="px-4 py-3 text-neutral-700">
                  {formatPlayers(record)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      to={`/game/${game.id}/edit/${record.id}`}
                      className="rounded-md border border-neutral-300 px-2.5 py-1 text-xs hover:bg-neutral-50"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      disabled={deletingId === record.id}
                      onClick={() => {
                        void handleDelete(record.id);
                      }}
                      className="rounded-md border border-red-200 px-2.5 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingId === record.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
