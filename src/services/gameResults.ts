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
import type { GameResultInput, GameResultRecord, PlayerScore } from '../types/record';

const COLLECTION = 'game_results';

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

function mapPlayers(value: unknown): PlayerScore[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((player) => {
    const row = player as {
      name?: unknown;
      email?: unknown;
      points?: unknown;
      scoreBreakdown?: unknown;
    };
    const email =
      typeof row.email === 'string' && row.email.trim().length > 0
        ? row.email.trim()
        : null;
    const scoreBreakdown =
      row.scoreBreakdown &&
      typeof row.scoreBreakdown === 'object' &&
      !Array.isArray(row.scoreBreakdown)
        ? Object.fromEntries(
            Object.entries(row.scoreBreakdown).flatMap(([key, score]) => {
              const numericScore = Number(score);
              return Number.isFinite(numericScore) ? [[key, numericScore]] : [];
            }),
          )
        : undefined;

    return {
      name: typeof row.name === 'string' ? row.name : '',
      email,
      points: typeof row.points === 'number' ? row.points : Number(row.points) || 0,
      ...(scoreBreakdown ? { scoreBreakdown } : {}),
    };
  });
}

function mapRecord(id: string, data: DocumentData): GameResultRecord {
  return {
    id,
    gameId: String(data.gameId ?? ''),
    playedAt: toDate(data.playedAt),
    players: mapPlayers(data.players),
    createdBy: String(data.createdBy ?? ''),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export async function listGameResults(gameId: string): Promise<GameResultRecord[]> {
  const firestore = requireDb();
  const resultsQuery = query(
    collection(firestore, COLLECTION),
    where('gameId', '==', gameId),
  );
  const snapshot = await getDocs(resultsQuery);
  return snapshot.docs
    .map((item) => mapRecord(item.id, item.data()))
    .sort((a, b) => b.playedAt.getTime() - a.playedAt.getTime());
}

export async function getGameResult(
  recordId: string,
): Promise<GameResultRecord | null> {
  const firestore = requireDb();
  const snapshot = await getDoc(doc(firestore, COLLECTION, recordId));
  if (!snapshot.exists()) {
    return null;
  }
  return mapRecord(snapshot.id, snapshot.data());
}

export async function createGameResult(input: GameResultInput): Promise<string> {
  const firestore = requireDb();
  const docRef = await addDoc(collection(firestore, COLLECTION), {
    gameId: input.gameId,
    playedAt: Timestamp.fromDate(input.playedAt),
    players: input.players,
    createdBy: input.createdBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateGameResult(
  recordId: string,
  input: Pick<GameResultInput, 'playedAt' | 'players'>,
): Promise<void> {
  const firestore = requireDb();
  await updateDoc(doc(firestore, COLLECTION, recordId), {
    playedAt: Timestamp.fromDate(input.playedAt),
    players: input.players,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteGameResult(recordId: string): Promise<void> {
  const firestore = requireDb();
  await deleteDoc(doc(firestore, COLLECTION, recordId));
}
