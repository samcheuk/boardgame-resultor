import { useDeferredValue, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  filterAndSortGames,
  games,
  getGameName,
} from '../games';
import { sortGamesByPinned } from '../games/pinnedGames';
import { usePinnedGames } from '../hooks/usePinnedGames';
import type { Translate } from '../i18n/LocaleContext';
import { useLocale } from '../i18n/useLocale';
import type { GameType } from '../types/game';

function gameTypeLabel(type: GameType, t: Translate): string {
  return t(type === 'status' ? 'game.type.status' : 'game.type.result');
}

function PinIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-4"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 17v5" />
      <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
    </svg>
  );
}

export function Home() {
  const { user, signOut } = useAuth();
  const { locale, t } = useLocale();
  const { pinnedIds, isPinned, togglePin } = usePinnedGames();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const filteredGames = sortGamesByPinned(
    filterAndSortGames(games, deferredQuery),
    pinnedIds,
  );

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
            {filteredGames.map((game) => {
              const pinned = isPinned(game.id);
              return (
                <li key={game.id}>
                  <div className="relative overflow-hidden rounded-lg border border-neutral-200 bg-white transition hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-500">
                    <Link
                      to={`/game/${game.id}`}
                      className="relative block p-5 pr-14"
                    >
                      {game.coverImage ? (
                        <>
                          <div
                            aria-hidden
                            className="absolute inset-0 bg-cover bg-right bg-no-repeat opacity-45"
                            style={{
                              backgroundImage: `url(${game.coverImage})`,
                            }}
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
                          {t(game.bggUrl ? 'game.bggId' : 'game.id', {
                            id: game.id,
                          })}
                        </p>
                      </div>
                    </Link>
                    <button
                      type="button"
                      aria-pressed={pinned}
                      aria-label={pinned ? t('home.unpin') : t('home.pin')}
                      title={pinned ? t('home.unpin') : t('home.pin')}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        togglePin(game.id);
                      }}
                      className={`absolute top-3 right-3 z-10 inline-flex size-9 items-center justify-center rounded-md border transition ${
                        pinned
                          ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
                          : 'border-neutral-300 bg-white/90 text-neutral-500 hover:border-neutral-400 hover:text-neutral-800 dark:border-neutral-600 dark:bg-neutral-900/90 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-neutral-100'
                      }`}
                    >
                      <PinIcon filled={pinned} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
