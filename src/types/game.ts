export type GameType = 'status' | 'result';

export interface GameConfig<TMeta = unknown> {
  id: string;
  name: string;
  type: GameType;
  minPlayers: number;
  maxPlayers: number;
  meta: TMeta;
}
