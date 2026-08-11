import type { Locale } from '../i18n/LocaleContext';

export type GameType = 'status' | 'result';

/** Display strings keyed by app locale (EN / zh-TW). */
export type LocalizedText = Record<Locale, string>;

export interface GameConfig<TMeta = unknown> {
  /** BoardGameGeek item ID, e.g. "13" for Catan */
  id: string;
  /**
   * Short kebab-case code name, e.g. "catan".
   * Module folder is `{id}-{slug}` under src/games/ (e.g. `13-catan`).
   */
  slug: string;
  /** Localized display name */
  name: LocalizedText;
  type: GameType;
  minPlayers: number;
  maxPlayers: number;
  bggUrl?: string;
  /** Optional cover / background image URL (Vite-imported asset) */
  coverImage?: string;
  meta: TMeta;
}
