import type { Locale } from '../i18n/LocaleContext';
import type { GameConfig } from '../types/game';

/** Resolve a game's display name for the active locale. */
export function getGameName(game: GameConfig, locale: Locale): string {
  return game.name[locale] || game.name.en;
}
