import { useDeferredValue, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { filterAndSortGames, games, getGameName } from '../games';
import type { Translate } from '../i18n/LocaleContext';
import { useLocale } from '../i18n/useLocale';
import type { GameType } from '../types/game';

function gameTypeLabel(type: GameType, t: Translate): string {
  return t(type === 'status' ? 'game.type.status' : 'game.type.result');
}

export function Home() {
  const { user, signOut } = useAuth();
  const { locale, t } = useLocale();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const filteredGames = filterAndSortGames(games, deferredQuery);

  return (
    <main className="mx-auto min-h-svh w-full max-w-5xl px-4 pt-[max(4.5rem,calc(env(safe-area-inset-top)+3.5rem))] pb-8">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Boardgame Resultor
          </h1>
          {user?.email ? (
            <p className="mt-1 truncate text-sm text-neutral-500 dark:text-neutral-400">
              {user.email}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => {
            void signOut();
          }}
          className="shrink-0 rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-600 dark:hover:bg-neutral-800"
        >
          {t('auth.signOut')}
        </button>
      </header>

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {t('home.games')} ({filteredGames.length})
          </h2>
          <label className="block w-full sm:max-w-xs">
            <span className="sr-only">{t('home.searchPlaceholder')}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
              placeholder={t('home.searchPlaceholder')}
              autoComplete="off"
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-400"
            />
          </label>
        </div>

        {filteredGames.length === 0 ? (
          <p className="rounded-lg border border-dashed border-neutral-300 px-4 py-10 text-center text-sm text-neutral-500 dark:border-neutral-600 dark:text-neutral-400">
            {t('home.noSearchResults')}
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGames.map((game) => (
              <li key={game.id}>
                <Link
                  to={`/game/${game.id}`}
                  className="relative block overflow-hidden rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-500"
                >
                  {game.coverImage ? (
                    <>
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-cover bg-right bg-no-repeat opacity-45"
                        style={{ backgroundImage: `url(${game.coverImage})` }}
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/25 dark:from-neutral-900 dark:via-neutral-900/90 dark:to-neutral-900/25"
                      />
                    </>
                  ) : null}
                  <div className="relative">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                      {getGameName(game, locale)}
                    </h3>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                      {gameTypeLabel(game.type, t)} ·{' '}
                      {t('game.bggId', { id: game.id })}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
