import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlayerNameField,
  type PlayerOption,
} from '../../../components/forms/PlayerNameField';
import {
  createGameResult,
  getGameResult,
  updateGameResult,
} from '../../../services/gameResults';
import { listWhitelistUsers } from '../../../services/whitelist';
import type { GameConfig } from '../../../types/game';
import type { PlayerScore } from '../../../types/record';

interface CatanRecordFormProps {
  game: GameConfig;
  mode: 'create' | 'edit';
  recordId?: string;
  userEmail: string;
}

function toDateTimeLocalValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function createEmptyPlayers(count: number): PlayerScore[] {
  return Array.from({ length: count }, () => ({
    name: '',
    email: null,
    points: 0,
  }));
}

function padPlayers(players: PlayerScore[], count: number): PlayerScore[] {
  if (players.length >= count) {
    return players.slice(0, count);
  }
  return [...players, ...createEmptyPlayers(count - players.length)];
}

export function CatanRecordForm({
  game,
  mode,
  recordId,
  userEmail,
}: CatanRecordFormProps) {
  const navigate = useNavigate();
  const playerSlots = game.maxPlayers;
  const [playedAt, setPlayedAt] = useState(() => toDateTimeLocalValue(new Date()));
  const [players, setPlayers] = useState<PlayerScore[]>(() =>
    createEmptyPlayers(playerSlots),
  );
  const [whitelistOptions, setWhitelistOptions] = useState<PlayerOption[]>([]);
  const [whitelistError, setWhitelistError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setWhitelistError(null);

      try {
        const users = await listWhitelistUsers();
        if (!cancelled) {
          setWhitelistOptions(
            users.map((user) => ({
              name: user.name,
              email: user.email,
            })),
          );
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Failed to load whitelist';
          setWhitelistError(message);
          setWhitelistOptions([]);
        }
      }

      try {
        if (mode === 'edit' && recordId) {
          const record = await getGameResult(recordId);
          if (cancelled) {
            return;
          }

          if (!record || record.gameId !== game.id) {
            setError('Record not found.');
            return;
          }

          setPlayedAt(toDateTimeLocalValue(record.playedAt));
          setPlayers(padPlayers(record.players, playerSlots));
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Failed to load form data';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [mode, recordId, game.id, playerSlots]);

  function updatePlayer(index: number, patch: Partial<PlayerScore>) {
    setPlayers((current) =>
      current.map((player, playerIndex) =>
        playerIndex === index ? { ...player, ...patch } : player,
      ),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!userEmail) {
      setError('You must be signed in to save a record.');
      return;
    }

    const playedAtDate = new Date(playedAt);
    if (Number.isNaN(playedAtDate.getTime())) {
      setError('Please enter a valid date and time.');
      return;
    }

    const normalizedPlayers = players
      .map((player) => ({
        name: player.name.trim(),
        email: player.email,
        points: Number(player.points),
      }))
      .filter((player) => player.name.length > 0);

    if (
      normalizedPlayers.length < game.minPlayers ||
      normalizedPlayers.length > game.maxPlayers
    ) {
      setError(
        `Fill in ${game.minPlayers}–${game.maxPlayers} players (leave unused slots blank).`,
      );
      return;
    }

    if (
      normalizedPlayers.some(
        (player) => Number.isNaN(player.points) || player.points < 0,
      )
    ) {
      setError('Points must be zero or a positive number.');
      return;
    }

    setSaving(true);
    try {
      if (mode === 'edit' && recordId) {
        await updateGameResult(recordId, {
          playedAt: playedAtDate,
          players: normalizedPlayers,
        });
      } else {
        await createGameResult({
          gameId: game.id,
          playedAt: playedAtDate,
          players: normalizedPlayers,
          createdBy: userEmail,
        });
      }
      navigate(`/game/${game.id}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to save record';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-neutral-500">Loading form...</p>;
  }

  return (
    <section className="max-w-xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">
          {mode === 'edit' ? 'Edit record' : 'Add record'}
        </h2>
        <Link
          to={`/game/${game.id}`}
          className="text-sm text-neutral-500 hover:text-neutral-800"
        >
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-neutral-700">
            Date & time
          </span>
          <input
            type="datetime-local"
            value={playedAt}
            onChange={(event) => {
              setPlayedAt(event.target.value);
            }}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            required
          />
        </label>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-neutral-700">
            Players & points
          </h3>
          <p className="text-xs text-neutral-500">
            Focus a name field to open the whitelist list. Type to filter, or
            enter a custom name. Fill {game.minPlayers}–{game.maxPlayers}{' '}
            players; leave unused slots blank.
          </p>

          {players.map((player, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="min-w-0 flex-1 space-y-1.5">
                <span className="text-xs text-neutral-500">
                  Player {index + 1}
                  {player.email ? (
                    <span className="text-neutral-400"> · {player.email}</span>
                  ) : null}
                </span>
                <PlayerNameField
                  id={`catan-player-${index}`}
                  value={player.name}
                  options={whitelistOptions}
                  loadError={whitelistError}
                  onChange={({ name, email }) => {
                    updatePlayer(index, { name, email });
                  }}
                />
              </div>
              <label className="w-24 space-y-1.5">
                <span className="text-xs text-neutral-500">Points</span>
                <input
                  type="number"
                  min={0}
                  value={player.points}
                  onChange={(event) => {
                    updatePlayer(index, {
                      points: Number(event.target.value),
                    });
                  }}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                />
              </label>
            </div>
          ))}
        </div>

        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
        >
          {saving
            ? 'Saving...'
            : mode === 'edit'
              ? 'Save changes'
              : 'Save record'}
        </button>
      </form>
    </section>
  );
}
