import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlayerNameField,
  type PlayerOption,
} from '../../../components/forms/PlayerNameField';
import {
  createGameCampaign,
  getGameCampaign,
  updateGameCampaign,
} from '../../../services/gameCampaigns';
import { listWhitelistUsers } from '../../../services/whitelist';
import { localizeError } from '../../../i18n/errors';
import { useLocale } from '../../../i18n/useLocale';
import type { CampaignPlayer, HunterCharacter } from '../../../types/campaign';
import type { GameConfig } from '../../../types/game';
import { CatalogIcon } from '../CatalogIcon';
import {
  ARMOR_SLOTS,
  EQUIPMENT_CATALOG,
  HUNTER_CHARACTERS,
  ITEM_CATALOG,
  equipmentForCharacter,
  getCharacterLabel,
} from '../catalog';
import { mhwText } from '../i18n';

interface MonsterHunterWorldRecordFormProps {
  game: GameConfig;
  mode: 'create' | 'edit';
  recordId?: string;
  userEmail: string;
}

function createEmptyHunter(
  character: HunterCharacter = 'bow',
): CampaignPlayer {
  return {
    name: '',
    email: null,
    character,
    equipment: [],
    items: {},
  };
}

function groupItemsByGroup() {
  const groups = new Map<string, typeof ITEM_CATALOG>();
  for (const item of ITEM_CATALOG) {
    const current = groups.get(item.group) ?? [];
    current.push(item);
    groups.set(item.group, current);
  }
  return [...groups.entries()];
}

const ITEM_GROUPS = groupItemsByGroup();

export function MonsterHunterWorldRecordForm({
  game,
  mode,
  recordId,
  userEmail,
}: MonsterHunterWorldRecordFormProps) {
  const navigate = useNavigate();
  const { locale, t } = useLocale();
  const tRef = useRef(t);
  tRef.current = t;

  const [campaignName, setCampaignName] = useState('');
  const [day, setDay] = useState(1);
  const [notes, setNotes] = useState('');
  const [players, setPlayers] = useState<CampaignPlayer[]>([
    createEmptyHunter(),
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
          const record = await getGameCampaign(recordId);
          if (cancelled) {
            return;
          }
          if (!record || record.gameId !== game.id) {
            setError(tRef.current('records.notFound'));
            return;
          }
          setCampaignName(record.name);
          setDay(record.day);
          setNotes(record.notes);
          setPlayers(
            record.players.length > 0
              ? record.players
              : [createEmptyHunter()],
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
  }, [game.id, mode, recordId]);

  function updatePlayer(
    index: number,
    update: (player: CampaignPlayer) => CampaignPlayer,
  ) {
    setPlayers((current) =>
      current.map((player, playerIndex) =>
        playerIndex === index ? update(player) : player,
      ),
    );
  }

  function toggleEquipment(index: number, equipmentId: string) {
    updatePlayer(index, (player) => {
      const owned = new Set(player.equipment);
      if (owned.has(equipmentId)) {
        owned.delete(equipmentId);
      } else {
        owned.add(equipmentId);
      }
      return { ...player, equipment: [...owned] };
    });
  }

  function setItemQty(index: number, itemId: string, rawValue: string) {
    updatePlayer(index, (player) => {
      const nextItems = { ...player.items };
      const qty = Number(rawValue);
      if (!Number.isFinite(qty) || qty <= 0) {
        delete nextItems[itemId];
      } else {
        nextItems[itemId] = Math.floor(qty);
      }
      return { ...player, items: nextItems };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userEmail) {
      setError(t('records.signInRequired'));
      return;
    }

    const trimmedName = campaignName.trim();
    if (!trimmedName) {
      setError(mhwText(locale, 'missingCampaignName'));
      return;
    }
    if (!Number.isFinite(day) || day < 1) {
      setError(mhwText(locale, 'invalidDay'));
      return;
    }
    if (players.some((player) => !player.name.trim())) {
      setError(mhwText(locale, 'missingHunterName'));
      return;
    }

    const knownEquipment = new Set(EQUIPMENT_CATALOG.map((item) => item.id));
    const payloadPlayers: CampaignPlayer[] = players.map((player) => ({
      name: player.name.trim(),
      email: player.email,
      character: player.character,
      equipment: player.equipment.filter((id) => knownEquipment.has(id)),
      items: Object.fromEntries(
        Object.entries(player.items).filter(([, qty]) => qty > 0),
      ),
    }));

    setSaving(true);
    setError(null);
    try {
      if (mode === 'edit' && recordId) {
        await updateGameCampaign(recordId, {
          name: trimmedName,
          day,
          notes: notes.trim(),
          players: payloadPlayers,
        });
      } else {
        await createGameCampaign({
          gameId: game.id,
          name: trimmedName,
          day,
          notes: notes.trim(),
          players: payloadPlayers,
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
    <section className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">
          {mode === 'edit'
            ? mhwText(locale, 'editTitle')
            : mhwText(locale, 'addTitle')}
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
            {mhwText(locale, 'campaignName')}
          </span>
          <input
            type="text"
            value={campaignName}
            onChange={(event) => {
              setCampaignName(event.target.value);
            }}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100"
            required
          />
        </label>

        <label className="block max-w-[10rem] space-y-1.5">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {mhwText(locale, 'dayTracker')}
          </span>
          <input
            type="number"
            min={1}
            value={day}
            onChange={(event) => {
              setDay(Number(event.target.value));
            }}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100"
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {mhwText(locale, 'notes')}
          </span>
          <textarea
            value={notes}
            onChange={(event) => {
              setNotes(event.target.value);
            }}
            rows={3}
            placeholder={mhwText(locale, 'notesPlaceholder')}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500"
          />
        </label>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {mhwText(locale, 'hunters')}
          </h3>

          {players.map((player, playerIndex) => {
            const visibleEquipment = equipmentForCharacter(player.character);
            const weapons = visibleEquipment.filter(
              (item) => item.category === 'weapon',
            );
            const armor = visibleEquipment.filter(
              (item) => item.category === 'armor',
            );
            const owned = new Set(player.equipment);

            return (
              <fieldset
                key={playerIndex}
                className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <legend className="font-medium text-neutral-900 dark:text-neutral-50">
                    {mhwText(locale, 'hunter', { number: playerIndex + 1 })}
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

                <div className="mb-4 grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {mhwText(locale, 'hunterName')}
                    </span>
                    <PlayerNameField
                      id={`mhw-hunter-${playerIndex}`}
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

                  <label className="space-y-1.5">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {mhwText(locale, 'character')}
                    </span>
                    <select
                      value={player.character}
                      onChange={(event) => {
                        const character = event.target
                          .value as HunterCharacter;
                        updatePlayer(playerIndex, (current) => ({
                          ...current,
                          character,
                        }));
                      }}
                      className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100"
                    >
                      {HUNTER_CHARACTERS.map((option) => (
                        <option key={option.id} value={option.id}>
                          {getCharacterLabel(option.id, locale)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mb-4 space-y-3">
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    {mhwText(locale, 'equipment')}
                  </p>
                  <div>
                    <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">
                      {mhwText(locale, 'weapons')}
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {weapons.map((entry) => (
                        <li key={entry.id}>
                          <label className="flex items-center gap-2 text-sm text-neutral-800 dark:text-neutral-200">
                            <input
                              type="checkbox"
                              checked={owned.has(entry.id)}
                              onChange={() => {
                                toggleEquipment(playerIndex, entry.id);
                              }}
                              className="size-4 rounded border-neutral-300 dark:border-neutral-600"
                            />
                            <CatalogIcon icon={entry.icon} alt="" />
                            <span>{entry.name}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {mhwText(locale, 'armor')}
                    </p>
                    {ARMOR_SLOTS.map((slot) => {
                      const slotItems = armor.filter(
                        (item) => item.armorSlot === slot.id,
                      );
                      if (slotItems.length === 0) {
                        return null;
                      }
                      return (
                        <div key={slot.id}>
                          <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">
                            {mhwText(locale, slot.id)}
                          </p>
                          <ul className="grid gap-2 sm:grid-cols-2">
                            {slotItems.map((entry) => (
                              <li key={entry.id}>
                                <label className="flex items-center gap-2 text-sm text-neutral-800 dark:text-neutral-200">
                                  <input
                                    type="checkbox"
                                    checked={owned.has(entry.id)}
                                    onChange={() => {
                                      toggleEquipment(playerIndex, entry.id);
                                    }}
                                    className="size-4 rounded border-neutral-300 dark:border-neutral-600"
                                  />
                                  <CatalogIcon icon={entry.icon} alt="" />
                                  <span>{entry.name}</span>
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    {mhwText(locale, 'items')}
                  </p>
                  {ITEM_GROUPS.map(([group, items]) => (
                    <div key={group}>
                      <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">
                        {group}
                      </p>
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {items.map((entry) => (
                          <li
                            key={entry.id}
                            className="flex items-center justify-between gap-2"
                          >
                            <span className="flex min-w-0 flex-1 items-center gap-2 text-sm text-neutral-800 dark:text-neutral-200">
                              <CatalogIcon icon={entry.icon} alt="" />
                              <span className="truncate">{entry.name}</span>
                            </span>
                            <input
                              type="number"
                              min={0}
                              value={player.items[entry.id] ?? ''}
                              placeholder="0"
                              onChange={(event) => {
                                setItemQty(
                                  playerIndex,
                                  entry.id,
                                  event.target.value,
                                );
                              }}
                              className="w-16 rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm text-neutral-900 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100"
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </fieldset>
            );
          })}
        </div>

        {players.length < game.maxPlayers ? (
          <button
            type="button"
            onClick={() => {
              setPlayers((current) => [...current, createEmptyHunter()]);
            }}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-600 dark:hover:bg-neutral-800"
          >
            {mhwText(locale, 'addHunter')}
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
