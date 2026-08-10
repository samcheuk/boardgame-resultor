import { useEffect, useState, type ComponentType } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { SaveStateForm } from '../components/forms/SaveStateForm';
import { getGameById } from '../games';
import { loadGamePage, type GamePageProps } from '../games/loadGameView';

function FallbackGamePage({ game, mode }: GamePageProps) {
  if (game.type === 'result') {
    if (mode !== 'list') {
      return (
        <p className="text-sm text-neutral-500">
          Record form template is not implemented for this game yet.
        </p>
      );
    }

    return (
      <p className="rounded-lg border border-dashed border-neutral-300 px-4 py-10 text-center text-sm text-neutral-500">
        No custom result UI for this game yet.
      </p>
    );
  }

  return <SaveStateForm game={game} />;
}

interface GameViewProps {
  mode: 'list' | 'create' | 'edit';
}

export function GameView({ mode }: GameViewProps) {
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

    void loadGamePage(game.slug).then((CustomPage) => {
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

      <div className="relative mx-auto w-full max-w-4xl px-4 py-8">
        <Link
          to="/"
          className="text-sm text-neutral-500 transition hover:text-neutral-800"
        >
          ← Back to games
        </Link>

        <header className="mt-6 mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">{game.name}</h1>
          <p className="mt-1 text-sm text-neutral-600">
            {game.type === 'result' ? 'Result Record' : 'Status Saving'} · BGG #
            {game.id} · {game.minPlayers}–{game.maxPlayers} players
            {game.bggUrl ? (
              <>
                {' · '}
                <a
                  href={game.bggUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-neutral-800"
                >
                  BoardGameGeek
                </a>
              </>
            ) : null}
          </p>
        </header>

        {loadingView ? (
          <p className="text-sm text-neutral-500">Loading game...</p>
        ) : (
          <Page game={game} mode={mode} recordId={recordId} />
        )}
      </div>
    </main>
  );
}
