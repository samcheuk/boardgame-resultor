import { useEffect, useRef, useState, type FormEvent } from 'react';
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
import { localizeError } from '../../../i18n/errors';
import { useLocale } from '../../../i18n/useLocale';
import type { GameConfig } from '../../../types/game';
import type { PlayerScore } from '../../../types/record';
import { catanText } from '../i18n';

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
  const { locale, t } = useLocale();
  const tRef = useRef(t);
  tRef.current = t;
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
          setWhitelistError(
            localizeError(err, tRef.current, 'whitelist.loadFailed'),
          );
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
            setError(tRef.current('records.notFound'));
            return;
          }

          setPlayedAt(toDateTimeLocalValue(record.playedAt));
          setPlayers(padPlayers(record.players, playerSlots));
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            localizeError(err, tRef.current, 'records.formLoadFailed'),
          );
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
      setError(t('records.signInRequired'));
      return;
    }

    const playedAtDate = new Date(playedAt);
    if (Number.isNaN(playedAtDate.getTime())) {
      setError(t('records.invalidDateTime'));
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
        catanText(locale, 'invalidPlayerCount', {
          min: game.minPlayers,
          max: game.maxPlayers,
        }),
      );
      return;
    }

    if (
      normalizedPlayers.some(
        (player) => Number.isNaN(player.points) || player.points < 0,
      )
    ) {
      setError(catanText(locale, 'invalidPoints'));
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
      setError(localizeError(err, t, 'records.saveFailed'));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <p className="text-sm text-neutral-500">{t('records.loadingForm')}</p>
    );
  }

  return (
    <section className="max-w-xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">
          {mode === 'edit'
            ? t('records.editTitle')
            : t('records.addTitle')}
        </h2>
        <Link
          to={`/game/${game.id}`}
          className="text-sm text-neutral-500 hover:text-neutral-800"
        >
          {t('common.cancel')}
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-neutral-700">
            {t('records.dateTime')}
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
            {catanText(locale, 'playersAndPoints')}
          </h3>
          <p className="text-xs text-neutral-500">
            {catanText(locale, 'playerInstructions', {
              min: game.minPlayers,
              max: game.maxPlayers,
            })}
          </p>

          {players.map((player, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="min-w-0 flex-1 space-y-1.5">
                <span className="text-xs text-neutral-500">
                  {catanText(locale, 'player', { number: index + 1 })}
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
                <span className="text-xs text-neutral-500">
                  {catanText(locale, 'points')}
                </span>
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
            ? t('records.saving')
            : mode === 'edit'
              ? t('records.saveChanges')
              : t('records.save')}
        </button>
      </form>
    </section>
  );
}
