export type HunterCharacter =
  | 'bow'
  | 'dual-blades'
  | 'great-sword'
  | 'sword-and-shield';

export interface CampaignPlayer {
  name: string;
  email: string | null;
  character: HunterCharacter;
  /** Owned equipment ids */
  equipment: string[];
  /** Material / item id → quantity */
  items: Record<string, number>;
}

export interface CampaignRecord {
  id: string;
  gameId: string;
  name: string;
  day: number;
  notes: string;
  players: CampaignPlayer[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignInput {
  gameId: string;
  name: string;
  day: number;
  notes: string;
  players: CampaignPlayer[];
  createdBy: string;
}
