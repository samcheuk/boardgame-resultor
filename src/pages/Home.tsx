import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { games } from '../games';
import type { GameType } from '../types/game';

function gameTypeLabel(type: GameType): string {
  if (type === 'status') {
    return 'Status Saving';
  }
  return 'Result Record';
}

export function Home() {
  const { user, signOut } = useAuth();

  return (
    <main className="mx-auto min-h-svh w-full max-w-5xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Boardgame Tracker</h1>
          {user?.email ? (
            <p className="mt-1 text-sm text-neutral-500">{user.email}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => {
            void signOut();
          }}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
        >
          Sign out
        </button>
      </header>

      <section>
        <h2 className="mb-4 text-sm font-medium text-neutral-500">Games</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <li key={game.id}>
              <Link
                to={`/game/${game.id}`}
                className="block rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-neutral-400 hover:bg-neutral-50"
              >
                <h3 className="text-lg font-semibold text-neutral-900">{game.name}</h3>
                <p className="mt-2 text-sm text-neutral-500">{gameTypeLabel(game.type)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
