import { useEffect, useState, type ComponentType } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { SaveStateForm } from '../components/forms/SaveStateForm';
import { getGameById, getGameName } from '../games';
import { loadGamePage, type GamePageProps } from '../games/loadGameView';
import { useLocale } from '../i18n/useLocale';

function FallbackGamePage({ game, mode }: GamePageProps) {
  const { t } = useLocale();

  if (game.type === 'result') {
    if (mode !== 'list') {
      return (
        <p className="text-sm text-neutral-500">
          {t('game.resultFormUnavailable')}
        </p>
      );
    }

    return (
      <p className="rounded-lg border border-dashed border-neutral-300 px-4 py-10 text-center text-sm text-neutral-500">
        {t('game.resultUiUnavailable')}
      </p>
    );
  }

  return <SaveStateForm game={game} />;
}

interface GameViewProps {
  mode: 'list' | 'create' | 'edit';
}

export function GameView({ mode }: GameViewProps) {
  const { locale, t } = useLocale();
  const { gameId, recordId } = useParams<{
    gameId: string;
    recordId?: string;
  }>();
  const game = gameId ? getGameById(gameId) : undefined;

  const [GamePage, setGamePage] = useState<ComponentType<GamePageProps> | null>(
    null,
  );
  const [loadingView, setLoadingView] = useState(true);

  useEffect(() => {
    if (!game) {
      setGamePage(null);
      setLoadingView(false);
      return;
    }

    let cancelled = false;
    setLoadingView(true);

    void loadGamePage(game).then((CustomPage) => {
      if (cancelled) {
        return;
      }
      setGamePage(() => CustomPage);
      setLoadingView(false);
    });

    return () => {
      cancelled = true;
    };
  }, [game]);

  if (!gameId || !game) {
    return <Navigate to="/" replace />;
  }

  if (mode === 'edit' && !recordId) {
    return <Navigate to={`/game/${game.id}`} replace />;
  }

  const Page = GamePage ?? FallbackGamePage;

  return (
    <main className="relative isolate min-h-svh w-full overflow-hidden">
      {game.coverImage ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute inset-0 bg-cover bg-bottom bg-no-repeat opacity-40"
            style={{ backgroundImage: `url(${game.coverImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/88 to-white/35" />
        </div>
      ) : null}

      <div className="relative mx-auto w-full max-w-4xl px-4 pt-[max(4.5rem,calc(env(safe-area-inset-top)+3.5rem))] pb-8">
        <Link
          to="/"
          className="text-sm text-neutral-500 transition hover:text-neutral-800"
        >
          {t('game.backToGames')}
        </Link>

        <header className="mt-6 mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            {getGameName(game, locale)}
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            {t(
              game.type === 'result'
                ? 'game.type.result'
                : 'game.type.status',
            )}{' '}
            · {t('game.bggId', { id: game.id })} ·{' '}
            {t('game.playerRange', {
              min: game.minPlayers,
              max: game.maxPlayers,
            })}
            {game.bggUrl ? (
              <>
                {' · '}
                <a
                  href={game.bggUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-neutral-800"
                >
                  {t('game.boardGameGeek')}
                </a>
              </>
            ) : null}
          </p>
        </header>

        {loadingView ? (
          <p className="text-sm text-neutral-500">{t('game.loading')}</p>
        ) : (
          <Page game={game} mode={mode} recordId={recordId} />
        )}
      </div>
    </main>
  );
}
