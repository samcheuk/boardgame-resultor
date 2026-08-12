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
import { formatBalance, hkTwMjText } from '../i18n';

interface PlayerInput {
  name: string;
  email: string | null;
  /** Raw input string so empty / "-" / partial values stay editable */
  balance: string;
}

interface HkTwMjRecordFormProps {
  game: GameConfig;
  mode: 'create' | 'edit';
  recordId?: string;
  userEmail: string;
}

function toDateTimeLocalValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function createEmptyPlayer(): PlayerInput {
  return {
    name: '',
    email: null,
    balance: '',
  };
}

function createEmptyPlayers(count: number): PlayerInput[] {
  return Array.from({ length: count }, () => createEmptyPlayer());
}

function toPlayerInput(player: PlayerScore): PlayerInput {
  return {
    name: player.name,
    email: player.email,
    balance: String(player.points),
  };
}

function parseBalance(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '' || trimmed === '-' || trimmed === '+' || trimmed === '.') {
    return null;
  }
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return parsed;
}

function isZeroSum(balances: number[]): boolean {
  const sum = balances.reduce((total, value) => total + value, 0);
  return Math.abs(sum) < 1e-9;
}

export function HkTwMjRecordForm({
  game,
  mode,
  recordId,
  userEmail,
}: HkTwMjRecordFormProps) {
  const navigate = useNavigate();
  const { locale, t } = useLocale();
  const tRef = useRef(t);
  tRef.current = t;
  const [playedAt, setPlayedAt] = useState(() =>
    toDateTimeLocalValue(new Date()),
  );
  const [players, setPlayers] = useState<PlayerInput[]>(() =>
    createEmptyPlayers(game.minPlayers),
  );
  const [whitelistOptions, setWhitelistOptions] = useState<PlayerOption[]>([]);
  const [whitelistError, setWhitelistError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedBalances = players.map((player) => parseBalance(player.balance));
  const allBalancesParsed = parsedBalances.every(
    (value): value is number => value != null,
  );
  const balanceSum = allBalancesParsed
    ? parsedBalances.reduce((total, value) => total + value, 0)
    : null;
  const zeroSumOk = balanceSum != null && isZeroSum(parsedBalances as number[]);

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
          const loadedPlayers = (
            game.maxPlayers == null
              ? record.players
              : record.players.slice(0, game.maxPlayers)
          ).map(toPlayerInput);
          setPlayers(
            loadedPlayers.length >= game.minPlayers
              ? loadedPlayers
              : [
                  ...loadedPlayers,
                  ...createEmptyPlayers(game.minPlayers - loadedPlayers.length),
                ],
          );
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
  }, [mode, recordId, game.id, game.maxPlayers, game.minPlayers]);

  function updatePlayer(
    index: number,
    update: (player: PlayerInput) => PlayerInput,
  ) {
    setPlayers((current) =>
      current.map((player, playerIndex) =>
        playerIndex === index ? update(player) : player,
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

    if (players.length < game.minPlayers) {
      setError(
        hkTwMjText(locale, 'invalidPlayerCount', { min: game.minPlayers }),
      );
      return;
    }

    if (players.some((player) => player.name.trim().length === 0)) {
      setError(hkTwMjText(locale, 'missingPlayerName'));
      return;
    }

    const balances = players.map((player) => parseBalance(player.balance));
    if (balances.some((value) => value == null)) {
      setError(hkTwMjText(locale, 'invalidBalances'));
      return;
    }

    const numericBalances = balances as number[];
    if (!isZeroSum(numericBalances)) {
      const sum = numericBalances.reduce((total, value) => total + value, 0);
      setError(
        hkTwMjText(locale, 'zeroSumRequired', {
          sum: formatBalance(sum),
        }),
      );
      return;
    }

    const normalizedPlayers: PlayerScore[] = players.map((player, index) => ({
      name: player.name.trim(),
      email: player.email,
      points: numericBalances[index],
      scoreBreakdown: { balance: numericBalances[index] },
    }));

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
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        {t('records.loadingForm')}
      </p>
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
          className="text-sm text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          {t('common.cancel')}
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {t('records.dateTime')}
          </span>
          <input
            type="datetime-local"
            value={playedAt}
            onChange={(event) => {
              setPlayedAt(event.target.value);
            }}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:[color-scheme:dark]"
            required
          />
        </label>

        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {hkTwMjText(locale, 'playersAndBalances')}
              </h3>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                {hkTwMjText(locale, 'playerInstructions', {
                  min: game.minPlayers,
                })}
              </p>
            </div>
            <p
              className={`shrink-0 text-xs font-medium ${
                zeroSumOk
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              {balanceSum == null
                ? hkTwMjText(locale, 'balanceSum', { sum: '—' })
                : zeroSumOk
                  ? hkTwMjText(locale, 'balanceSumOk')
                  : hkTwMjText(locale, 'balanceSum', {
                      sum: formatBalance(balanceSum),
                    })}
            </p>
          </div>

          {players.map((player, playerIndex) => (
            <div
              key={playerIndex}
              className="flex items-end gap-2 rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {hkTwMjText(locale, 'player', { number: playerIndex + 1 })}
                  </span>
                  {players.length > game.minPlayers ? (
                    <button
                      type="button"
                      onClick={() => {
                        setPlayers((current) =>
                          current.filter((_, index) => index !== playerIndex),
                        );
                      }}
                      className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      {t('common.remove')}
                    </button>
                  ) : null}
                </div>
                <PlayerNameField
                  id={`hk-tw-mj-player-${playerIndex}`}
                  value={player.name}
                  options={whitelistOptions}
                  loadError={whitelistError}
                  onChange={({ name, email }) => {
                    updatePlayer(playerIndex, (current) => ({
                      ...current,
                      name,
                      email,
                    }));
                  }}
                />
              </div>
              <label className="w-28 space-y-1.5">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {hkTwMjText(locale, 'balance')}
                </span>
                <input
                  type="number"
                  step="any"
                  value={player.balance}
                  onChange={(event) => {
                    const value = event.target.value;
                    updatePlayer(playerIndex, (current) => ({
                      ...current,
                      balance: value,
                    }));
                  }}
                  className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100"
                  placeholder="0"
                  required
                />
              </label>
            </div>
          ))}
        </div>

        {game.maxPlayers == null || players.length < game.maxPlayers ? (
          <button
            type="button"
            onClick={() => {
              setPlayers((current) => [...current, createEmptyPlayer()]);
            }}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-600 dark:hover:bg-neutral-800"
          >
            {hkTwMjText(locale, 'addPlayer')}
          </button>
        ) : null}

        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
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
