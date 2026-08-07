import { useEffect, useState, type ComponentType } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { SaveStateForm } from '../components/forms/SaveStateForm';
import { ScoreSubmissionForm } from '../components/forms/ScoreSubmissionForm';
import { getGameById } from '../games';
import { loadGameView, type GameFormProps } from '../games/loadGameView';

function FallbackGameForm({ game }: GameFormProps) {
  if (game.type === 'result') {
    return <ScoreSubmissionForm game={game} />;
  }

  return <SaveStateForm game={game} />;
}

export function GameView() {
  const { gameId } = useParams<{ gameId: string }>();
  const game = gameId ? getGameById(gameId) : undefined;

  const [GameForm, setGameForm] = useState<ComponentType<GameFormProps> | null>(
    null,
  );
  const [loadingView, setLoadingView] = useState(true);

  useEffect(() => {
    if (!game) {
      setGameForm(null);
      setLoadingView(false);
      return;
    }

    let cancelled = false;
    setLoadingView(true);

    void loadGameView(game.id).then((CustomForm) => {
      if (cancelled) {
        return;
      }
      setGameForm(() => CustomForm);
      setLoadingView(false);
    });

    return () => {
      cancelled = true;
    };
  }, [game]);

  if (!gameId || !game) {
    return <Navigate to="/" replace />;
  }

  const Form = GameForm ?? FallbackGameForm;

  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-4 py-8">
      <Link
        to="/"
        className="text-sm text-neutral-500 transition hover:text-neutral-800"
      >
        ← Back to games
      </Link>

      <header className="mt-6 mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">{game.name}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {game.type === 'result' ? 'Result Record' : 'Status Saving'} ·{' '}
          {game.minPlayers}–{game.maxPlayers} players
        </p>
      </header>

      {loadingView ? (
        <p className="text-sm text-neutral-500">Loading form...</p>
      ) : (
        <Form game={game} />
      )}
    </main>
  );
}
