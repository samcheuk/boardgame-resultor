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
  IncenseMoneyInput,
  IncenseMoneyRecord,
} from '../types/incenseMoney';

const COLLECTION = 'game_incense_money';

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

function mapRecord(id: string, data: DocumentData): IncenseMoneyRecord {
  return {
    id,
    gameId: String(data.gameId ?? ''),
    name: typeof data.name === 'string' ? data.name : '',
    cost: typeof data.cost === 'number' ? data.cost : Number(data.cost) || 0,
    remark: typeof data.remark === 'string' ? data.remark : '',
    date: toDate(data.date),
    createdBy: String(data.createdBy ?? ''),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export async function listIncenseMoney(
  gameId: string,
): Promise<IncenseMoneyRecord[]> {
  const firestore = requireDb();
  const resultsQuery = query(
    collection(firestore, COLLECTION),
    where('gameId', '==', gameId),
  );
  const snapshot = await getDocs(resultsQuery);
  return snapshot.docs
    .map((item) => mapRecord(item.id, item.data()))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function getIncenseMoney(
  recordId: string,
): Promise<IncenseMoneyRecord | null> {
  const firestore = requireDb();
  const snapshot = await getDoc(doc(firestore, COLLECTION, recordId));
  if (!snapshot.exists()) {
    return null;
  }
  return mapRecord(snapshot.id, snapshot.data());
}

export async function createIncenseMoney(
  input: IncenseMoneyInput,
): Promise<string> {
  const firestore = requireDb();
  const docRef = await addDoc(collection(firestore, COLLECTION), {
    gameId: input.gameId,
    name: input.name,
    cost: input.cost,
    remark: input.remark,
    date: Timestamp.fromDate(input.date),
    createdBy: input.createdBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateIncenseMoney(
  recordId: string,
  input: Pick<IncenseMoneyInput, 'name' | 'cost' | 'remark' | 'date'>,
): Promise<void> {
  const firestore = requireDb();
  await updateDoc(doc(firestore, COLLECTION, recordId), {
    name: input.name,
    cost: input.cost,
    remark: input.remark,
    date: Timestamp.fromDate(input.date),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteIncenseMoney(recordId: string): Promise<void> {
  const firestore = requireDb();
  await deleteDoc(doc(firestore, COLLECTION, recordId));
}
