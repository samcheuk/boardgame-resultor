import type { IncenseMoneyRecord } from '../../types/incenseMoney';
import type { GameResultRecord } from '../../types/record';

export interface ResultLeaderboardEntry {
  key: string;
  name: string;
  email: string | null;
  total: number;
  games: number;
}

export interface IncenseLeaderboardEntry {
  key: string;
  name: string;
  total: number;
  count: number;
}

export interface LeaderboardTables {
  results: ResultLeaderboardEntry[];
  incense: IncenseLeaderboardEntry[];
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Build two independent standings tables:
 * - results: sum of balances from game_results
 * - incense: sum of costs from game_incense_money
 */
export function buildLeaderboardTables(
  results: GameResultRecord[],
  incense: IncenseMoneyRecord[],
): LeaderboardTables {
  const resultByKey = new Map<
    string,
    { name: string; email: string | null; total: number; games: number }
  >();
  const incenseByKey = new Map<
    string,
    { name: string; total: number; count: number }
  >();

  for (const record of results) {
    for (const player of record.players) {
      const key = normalizeName(player.name);
      if (!key) {
        continue;
      }
      const existing = resultByKey.get(key);
      if (existing) {
        existing.total += player.points;
        existing.games += 1;
        if (!existing.email && player.email) {
          existing.email = player.email;
        }
        continue;
      }
      resultByKey.set(key, {
        name: player.name.trim(),
        email: player.email,
        total: player.points,
        games: 1,
      });
    }
  }

  for (const record of incense) {
    const key = normalizeName(record.name);
    if (!key) {
      continue;
    }
    const existing = incenseByKey.get(key);
    if (existing) {
      existing.total += record.cost;
      existing.count += 1;
      continue;
    }
    incenseByKey.set(key, {
      name: record.name.trim(),
      total: record.cost,
      count: 1,
    });
  }

  const resultEntries = [...resultByKey.entries()]
    .map(([key, entry]) => ({
      key,
      name: entry.name,
      email: entry.email,
      total: entry.total,
      games: entry.games,
    }))
    .sort((a, b) => {
      if (b.total !== a.total) {
        return b.total - a.total;
      }
      return a.name.localeCompare(b.name);
    });

  const incenseEntries = [...incenseByKey.entries()]
    .map(([key, entry]) => ({
      key,
      name: entry.name,
      total: entry.total,
      count: entry.count,
    }))
    .sort((a, b) => {
      if (b.total !== a.total) {
        return b.total - a.total;
      }
      return a.name.localeCompare(b.name);
    });

  return {
    results: resultEntries,
    incense: incenseEntries,
  };
}
