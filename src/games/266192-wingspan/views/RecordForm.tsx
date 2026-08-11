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
import { wingspanText } from '../i18n';

const SCORE_CATEGORIES = [
  { key: 'birds', translationKey: 'birds' },
  { key: 'bonusCards', translationKey: 'bonusCards' },
  { key: 'endOfRoundGoals', translationKey: 'endOfRoundGoals' },
  { key: 'eggs', translationKey: 'eggs' },
  { key: 'cachedFood', translationKey: 'cachedFood' },
  { key: 'tuckedCards', translationKey: 'tuckedCards' },
  { key: 'nectar', translationKey: 'nectar' },
] as const;

type ScoreCategoryKey = (typeof SCORE_CATEGORIES)[number]['key'];
type ScoreInputs = Record<ScoreCategoryKey, string>;

interface WingspanPlayerInput {
  name: string;
  email: string | null;
  scores: ScoreInputs;
}

interface WingspanRecordFormProps {
  game: GameConfig;
  mode: 'create' | 'edit';
  recordId?: string;
  userEmail: string;
}

function toDateTimeLocalValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function createEmptyScores(): ScoreInputs {
  return {
    birds: '',
    bonusCards: '',
    endOfRoundGoals: '',
    eggs: '',
    cachedFood: '',
    tuckedCards: '',
    nectar: '',
  };
}

function createEmptyPlayer(): WingspanPlayerInput {
  return {
    name: '',
    email: null,
    scores: createEmptyScores(),
  };
}

function toPlayerInput(player: PlayerScore): WingspanPlayerInput {
  const scores = createEmptyScores();
  for (const { key } of SCORE_CATEGORIES) {
    const value = player.scoreBreakdown?.[key];
    scores[key] = typeof value === 'number' ? String(value) : '';
  }
  return {
    name: player.name,
    email: player.email,
    scores,
  };
}

function getTotal(scores: ScoreInputs): number {
  return SCORE_CATEGORIES.reduce(
    (total, { key }) => total + (Number(scores[key]) || 0),
    0,
  );
}

export function WingspanRecordForm({
  game,
  mode,
  recordId,
  userEmail,
}: WingspanRecordFormProps) {
  const navigate = useNavigate();
  const { locale, t } = useLocale();
  const tRef = useRef(t);
  tRef.current = t;
  const [playedAt, setPlayedAt] = useState(() =>
    toDateTimeLocalValue(new Date()),
  );
  const [players, setPlayers] = useState<WingspanPlayerInput[]>([
    createEmptyPlayer(),
  ]);
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
          const loadedPlayers = record.players
            .slice(0, game.maxPlayers)
            .map(toPlayerInput);
          setPlayers(
            loadedPlayers.length > 0 ? loadedPlayers : [createEmptyPlayer()],
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
  }, [mode, recordId, game.id, game.maxPlayers]);

  function updatePlayer(
    index: number,
    update: (player: WingspanPlayerInput) => WingspanPlayerInput,
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

    if (players.some((player) => player.name.trim().length === 0)) {
      setError(wingspanText(locale, 'missingPlayerName'));
      return;
    }

    const hasInvalidScore = players.some((player) =>
      SCORE_CATEGORIES.some(({ key }) => {
        const value = player.scores[key];
        return value !== '' && (!Number.isFinite(Number(value)) || Number(value) < 0);
      }),
    );
    if (hasInvalidScore) {
      setError(wingspanText(locale, 'invalidScores'));
      return;
    }

    const normalizedPlayers: PlayerScore[] = players.map((player) => {
      const scoreBreakdown = Object.fromEntries(
        SCORE_CATEGORIES.map(({ key }) => [key, Number(player.scores[key]) || 0]),
      );
      return {
        name: player.name.trim(),
        email: player.email,
        points: getTotal(player.scores),
        scoreBreakdown,
      };
    });

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
    <section className="max-w-2xl">
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

        <div className="space-y-4">
          {players.map((player, playerIndex) => (
            <fieldset
              key={playerIndex}
              className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div className="mb-4 flex items-center justify-between">
                <legend className="font-medium text-neutral-900 dark:text-neutral-50">
                  {wingspanText(locale, 'player', {
                    number: playerIndex + 1,
                  })}
                </legend>
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

              <div className="mb-4 space-y-1.5">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {wingspanText(locale, 'playerName')}
                </span>
                <PlayerNameField
                  id={`wingspan-player-${playerIndex}`}
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

              <div className="grid gap-3 sm:grid-cols-2">
                {SCORE_CATEGORIES.map(({ key, translationKey }) => (
                  <label key={key} className="space-y-1.5">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {wingspanText(locale, translationKey)}
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={player.scores[key]}
                      onChange={(event) => {
                        const value = event.target.value;
                        updatePlayer(playerIndex, (current) => ({
                          ...current,
                          scores: { ...current.scores, [key]: value },
                        }));
                      }}
                      className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100"
                      placeholder="0"
                    />
                  </label>
                ))}
              </div>

              <p className="mt-4 border-t border-neutral-100 pt-3 text-right text-sm font-semibold dark:border-neutral-800">
                {wingspanText(locale, 'total', {
                  points: getTotal(player.scores),
                })}
              </p>
            </fieldset>
          ))}
        </div>

        {players.length < game.maxPlayers ? (
          <button
            type="button"
            onClick={() => {
              setPlayers((current) => [...current, createEmptyPlayer()]);
            }}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-600 dark:hover:bg-neutral-800"
          >
            {wingspanText(locale, 'addPlayer')}
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
