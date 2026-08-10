import { collection, getDocs, Timestamp, type DocumentData } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import type { WhitelistUser } from '../types/whitelist';

/**
 * Firestore `whitelist` collection:
 * - Document ID = email
 * - Fields: name (string), createdAt (timestamp)
 */
function toDate(value: unknown): Date | null {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function mapWhitelistUser(email: string, data: DocumentData): WhitelistUser {
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  return {
    email,
    name: name || email,
    createdAt: toDate(data.createdAt),
  };
}

export async function listWhitelistUsers(): Promise<WhitelistUser[]> {
  if (!db) {
    throw new Error('Firestore is not configured.');
  }

  const snapshot = await getDocs(collection(db, 'whitelist'));

  return snapshot.docs
    .map((item) => mapWhitelistUser(item.id, item.data()))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export type { WhitelistUser };
