export type GameType = 'result' | 'status';

export interface GameConfig {
  id: string;
  name: string;
  type: GameType;
  coverImage: string;
}
