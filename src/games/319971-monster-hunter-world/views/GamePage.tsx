import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ResultGamePage } from '../../../components/game/ResultGamePage';
import { useAuth } from '../../../contexts/AuthContext';
import {
  deleteGameCampaign,
  listGameCampaigns,
} from '../../../services/gameCampaigns';
import { localizeError } from '../../../i18n/errors';
import { useLocale } from '../../../i18n/useLocale';
import type { CampaignRecord } from '../../../types/campaign';
import type { GamePageProps } from '../../loadGameView';
import { getCharacterLabel } from '../catalog';
import { mhwText } from '../i18n';
import { MonsterHunterWorldRecordForm } from './RecordForm';

function MonsterHunterWorldCampaignList({
  game,
}: Pick<GamePageProps, 'game'>) {
  const navigate = useNavigate();
  const { locale, t } = useLocale();
  const tRef = useRef(t);
  tRef.current = t;
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCampaigns() {
      setLoading(true);
      setError(null);
      try {
        const items = await listGameCampaigns(game.id);
        if (!cancelled) {
          setCampaigns(items);
        }
      } catch (err) {
        if (!cancelled) {
          setError(localizeError(err, tRef.current, 'records.loadFailed'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCampaigns();
    return () => {
      cancelled = true;
    };
  }, [game.id]);

  async function handleDelete(campaign: CampaignRecord) {
    if (
      !window.confirm(
        mhwText(locale, 'deleteConfirm', { name: campaign.name }),
      )
    ) {
      return;
    }

    setDeletingId(campaign.id);
    setError(null);
    try {
      await deleteGameCampaign(campaign.id);
      setCampaigns((current) =>
        current.filter((item) => item.id !== campaign.id),
      );
    } catch (err) {
      setError(localizeError(err, t, 'records.deleteFailed'));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <ResultGamePage
      title={mhwText(locale, 'campaigns')}
      emptyMessage={mhwText(locale, 'empty')}
      addLabel={mhwText(locale, 'add')}
      loading={loading}
      isEmpty={!loading && campaigns.length === 0}
      onAdd={() => {
        navigate(`/game/${game.id}/new`);
      }}
    >
      {error ? (
        <p className="mb-4 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <ul className="space-y-3">
        {campaigns.map((campaign) => {
          const itemTypes = campaign.players.reduce(
            (sum, player) => sum + Object.keys(player.items).length,
            0,
          );
          const equipmentCount = campaign.players.reduce(
            (sum, player) => sum + player.equipment.length,
            0,
          );

          return (
            <li
              key={campaign.id}
              className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                    {campaign.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {mhwText(locale, 'day', { day: campaign.day })} ·{' '}
                    {mhwText(locale, 'huntersCount', {
                      count: campaign.players.length,
                    })}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    to={`/game/${game.id}/edit/${campaign.id}`}
                    className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs hover:bg-neutral-50 dark:border-neutral-600 dark:hover:bg-neutral-800"
                  >
                    {t('common.edit')}
                  </Link>
                  <button
                    type="button"
                    disabled={deletingId === campaign.id}
                    onClick={() => {
                      void handleDelete(campaign);
                    }}
                    className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    {deletingId === campaign.id
                      ? t('common.deleting')
                      : t('common.delete')}
                  </button>
                </div>
              </div>

              <ul className="mt-3 space-y-1.5 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                {campaign.players.map((player, index) => (
                  <li
                    key={`${campaign.id}-${player.email ?? player.name}-${index}`}
                    className="flex items-baseline justify-between gap-3 text-sm"
                  >
                    <span className="min-w-0 truncate text-neutral-700 dark:text-neutral-300">
                      {player.name}
                      <span className="ml-2 text-neutral-400 dark:text-neutral-500">
                        {getCharacterLabel(player.character, locale)}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-neutral-500 dark:text-neutral-400">
                      {player.equipment.length} eq ·{' '}
                      {Object.keys(player.items).length} items
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
                {mhwText(locale, 'ownedEquipment', { count: equipmentCount })} ·{' '}
                {mhwText(locale, 'ownedItems', { count: itemTypes })}
              </p>
            </li>
          );
        })}
      </ul>
    </ResultGamePage>
  );
}

export default function MonsterHunterWorldGamePage({
  game,
  mode,
  recordId,
}: GamePageProps) {
  const { user } = useAuth();

  if (mode === 'create' || mode === 'edit') {
    return (
      <MonsterHunterWorldRecordForm
        game={game}
        mode={mode}
        recordId={recordId}
        userEmail={user?.email ?? ''}
      />
    );
  }

  return <MonsterHunterWorldCampaignList game={game} />;
}
