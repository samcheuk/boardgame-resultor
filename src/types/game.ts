export type GameType = 'status' | 'result';

export interface GameConfig<TMeta = unknown> {
  /** BoardGameGeek item ID, e.g. "13" for Catan */
  id: string;
  /** Folder / code slug under src/games/, e.g. "catan" */
  slug: string;
  name: string;
  type: GameType;
  minPlayers: number;
  maxPlayers: number;
  bggUrl?: string;
  meta: TMeta;
}
