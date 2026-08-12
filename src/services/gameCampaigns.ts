import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import type {
  CampaignInput,
  CampaignPlayer,
  CampaignRecord,
  HunterCharacter,
} from '../types/campaign';

const COLLECTION = 'game_campaigns';

const CHARACTERS: HunterCharacter[] = [
  'bow',
  'dual-blades',
  'great-sword',
  'sword-and-shield',
];

function requireDb() {
  if (!db) {
    throw new Error('Firestore is not configured.');
  }
  return db;
}

function toDate(value: unknown): Date {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return new Date(value);
  }
  return new Date();
}

function isHunterCharacter(value: unknown): value is HunterCharacter {
  return (
    typeof value === 'string' &&
    (CHARACTERS as string[]).includes(value)
  );
}

function mapItems(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).flatMap(([key, qty]) => {
      const numeric = Number(qty);
      return Number.isFinite(numeric) && numeric > 0
        ? [[key, Math.floor(numeric)]]
        : [];
    }),
  );
}

function mapPlayers(value: unknown): CampaignPlayer[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((player) => {
    const row = player as {
      name?: unknown;
      email?: unknown;
      character?: unknown;
      equipment?: unknown;
      items?: unknown;
    };
    const email =
      typeof row.email === 'string' && row.email.trim().length > 0
        ? row.email.trim()
        : null;
    const equipment = Array.isArray(row.equipment)
      ? row.equipment.filter((id): id is string => typeof id === 'string')
      : [];

    return {
      name: typeof row.name === 'string' ? row.name : '',
      email,
      character: isHunterCharacter(row.character) ? row.character : 'bow',
      equipment,
      items: mapItems(row.items),
    };
  });
}

function mapRecord(id: string, data: DocumentData): CampaignRecord {
  return {
    id,
    gameId: String(data.gameId ?? ''),
    name: typeof data.name === 'string' ? data.name : '',
    day: typeof data.day === 'number' ? data.day : Number(data.day) || 1,
    notes: typeof data.notes === 'string' ? data.notes : '',
    players: mapPlayers(data.players),
    createdBy: String(data.createdBy ?? ''),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export async function listGameCampaigns(
  gameId: string,
): Promise<CampaignRecord[]> {
  const firestore = requireDb();
  const campaignsQuery = query(
    collection(firestore, COLLECTION),
    where('gameId', '==', gameId),
  );
  const snapshot = await getDocs(campaignsQuery);
  return snapshot.docs
    .map((item) => mapRecord(item.id, item.data()))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export async function getGameCampaign(
  recordId: string,
): Promise<CampaignRecord | null> {
  const firestore = requireDb();
  const snapshot = await getDoc(doc(firestore, COLLECTION, recordId));
  if (!snapshot.exists()) {
    return null;
  }
  return mapRecord(snapshot.id, snapshot.data());
}

export async function createGameCampaign(
  input: CampaignInput,
): Promise<string> {
  const firestore = requireDb();
  const docRef = await addDoc(collection(firestore, COLLECTION), {
    gameId: input.gameId,
    name: input.name,
    day: input.day,
    notes: input.notes,
    players: input.players,
    createdBy: input.createdBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateGameCampaign(
  recordId: string,
  input: Pick<CampaignInput, 'name' | 'day' | 'notes' | 'players'>,
): Promise<void> {
  const firestore = requireDb();
  await updateDoc(doc(firestore, COLLECTION, recordId), {
    name: input.name,
    day: input.day,
    notes: input.notes,
    players: input.players,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteGameCampaign(recordId: string): Promise<void> {
  const firestore = requireDb();
  await deleteDoc(doc(firestore, COLLECTION, recordId));
}
