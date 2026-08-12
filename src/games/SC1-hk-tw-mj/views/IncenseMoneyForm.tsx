import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlayerNameField,
  type PlayerOption,
} from '../../../components/forms/PlayerNameField';
import {
  createIncenseMoney,
  getIncenseMoney,
  updateIncenseMoney,
} from '../../../services/gameIncenseMoney';
import { listWhitelistUsers } from '../../../services/whitelist';
import { localizeError } from '../../../i18n/errors';
import { useLocale } from '../../../i18n/useLocale';
import type { GameConfig } from '../../../types/game';
import { hkTwMjText } from '../i18n';

interface IncenseMoneyFormProps {
  game: GameConfig;
  mode: 'create' | 'edit';
  recordId?: string;
  userEmail: string;
}

function toDateInputValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function IncenseMoneyForm({
  game,
  mode,
  recordId,
  userEmail,
}: IncenseMoneyFormProps) {
  const navigate = useNavigate();
  const { locale, t } = useLocale();
  const tRef = useRef(t);
  tRef.current = t;
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [remark, setRemark] = useState('');
  const [date, setDate] = useState(() => toDateInputValue(new Date()));
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
          const record = await getIncenseMoney(recordId);
          if (cancelled) {
            return;
          }
          if (!record || record.gameId !== game.id) {
            setError(tRef.current('records.notFound'));
            return;
          }

          setName(record.name);
          setCost(String(record.cost));
          setRemark(record.remark);
          setDate(toDateInputValue(record.date));
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
  }, [mode, recordId, game.id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!userEmail) {
      setError(t('records.signInRequired'));
      return;
    }

    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      setError(hkTwMjText(locale, 'incenseMissingName'));
      return;
    }

    const parsedCost = Number(cost);
    if (!Number.isFinite(parsedCost)) {
      setError(hkTwMjText(locale, 'incenseInvalidCost'));
      return;
    }

    const parsedDate = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) {
      setError(hkTwMjText(locale, 'incenseInvalidDate'));
      return;
    }

    setSaving(true);
    try {
      if (mode === 'edit' && recordId) {
        await updateIncenseMoney(recordId, {
          name: trimmedName,
          cost: parsedCost,
          remark: remark.trim(),
          date: parsedDate,
        });
      } else {
        await createIncenseMoney({
          gameId: game.id,
          name: trimmedName,
          cost: parsedCost,
          remark: remark.trim(),
          date: parsedDate,
          createdBy: userEmail,
        });
      }
      navigate(`/game/${game.id}?tab=incense`);
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
            : hkTwMjText(locale, 'addIncense')}
        </h2>
        <Link
          to={`/game/${game.id}?tab=incense`}
          className="text-sm text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          {t('common.cancel')}
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {hkTwMjText(locale, 'incenseName')}
          </span>
          <PlayerNameField
            id="hk-tw-mj-incense-name"
            value={name}
            options={whitelistOptions}
            loadError={whitelistError}
            onChange={({ name: nextName }) => {
              setName(nextName);
            }}
          />
        </div>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {hkTwMjText(locale, 'incenseCost')}
          </span>
          <input
            type="number"
            step="any"
            value={cost}
            onChange={(event) => {
              setCost(event.target.value);
            }}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100"
            placeholder="0"
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {hkTwMjText(locale, 'incenseRemark')}
          </span>
          <textarea
            value={remark}
            onChange={(event) => {
              setRemark(event.target.value);
            }}
            rows={3}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {hkTwMjText(locale, 'incenseDate')}
          </span>
          <input
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
            }}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:[color-scheme:dark]"
            required
          />
        </label>

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
