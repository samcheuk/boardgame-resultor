export interface PlayerScore {
  name: string;
  /** Whitelist email when picked from list; null for custom free-text names */
  email: string | null;
  points: number;
  /** Optional, game-defined score categories stored with English keys */
  scoreBreakdown?: Record<string, number>;
}

export interface GameResultRecord {
  id: string;
  gameId: string;
  playedAt: Date;
  players: PlayerScore[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameResultInput {
  gameId: string;
  playedAt: Date;
  players: PlayerScore[];
  createdBy: string;
}
