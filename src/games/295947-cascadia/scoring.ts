const WILDLIFE_KEYS = [
  'bears',
  'elk',
  'salmon',
  'hawks',
  'foxes',
] as const;

const HABITAT_KEYS = [
  'mountains',
  'forests',
  'prairies',
  'wetlands',
  'rivers',
] as const;

export type WildlifeKey = (typeof WILDLIFE_KEYS)[number];
export type HabitatKey = (typeof HABITAT_KEYS)[number];

export { WILDLIFE_KEYS, HABITAT_KEYS };

export function sumKeys(
  scores: Record<string, string | number>,
  keys: readonly string[],
): number {
  return keys.reduce((total, key) => {
    const value = Number(scores[key]);
    return total + (Number.isFinite(value) ? value : 0);
  }, 0);
}

/**
 * Cascadia habitat majority bonuses for one habitat type.
 * `sizes` is each player's corridor size for that habitat (same order as players).
 */
export function majorityBonusesForHabitat(
  sizes: number[],
  playerCount: number,
): number[] {
  const bonuses = sizes.map(() => 0);
  if (sizes.length === 0) {
    return bonuses;
  }

  if (playerCount <= 1) {
    return sizes.map((size) => (size >= 7 ? 2 : 0));
  }

  const max = Math.max(...sizes);
  if (max <= 0) {
    return bonuses;
  }

  const firstIndexes = sizes.flatMap((size, index) =>
    size === max ? [index] : [],
  );

  if (playerCount === 2) {
    const bonus = firstIndexes.length >= 2 ? 1 : 2;
    for (const index of firstIndexes) {
      bonuses[index] = bonus;
    }
    return bonuses;
  }

  // 3–4 players
  if (firstIndexes.length >= 3) {
    for (const index of firstIndexes) {
      bonuses[index] = 1;
    }
    return bonuses;
  }

  if (firstIndexes.length === 2) {
    for (const index of firstIndexes) {
      bonuses[index] = 2;
    }
    return bonuses;
  }

  // Unique first place
  bonuses[firstIndexes[0]] = 3;

  const remaining = sizes
    .map((size, index) => ({ size, index }))
    .filter(({ index, size }) => index !== firstIndexes[0] && size > 0);

  if (remaining.length === 0) {
    return bonuses;
  }

  const secondMax = Math.max(...remaining.map((row) => row.size));
  const secondIndexes = remaining
    .filter((row) => row.size === secondMax)
    .map((row) => row.index);

  if (secondIndexes.length === 1) {
    bonuses[secondIndexes[0]] = 1;
  }
  // Ties for second → 0 each (already 0)

  return bonuses;
}

/** Per-player majority total across all five habitats. */
export function computeHabitatMajorityTotals(
  players: Array<Record<string, string | number>>,
): number[] {
  const playerCount = players.length;
  const totals = players.map(() => 0);

  for (const habitat of HABITAT_KEYS) {
    const sizes = players.map((player) => {
      const value = Number(player[habitat]);
      return Number.isFinite(value) && value > 0 ? value : 0;
    });
    const bonuses = majorityBonusesForHabitat(sizes, playerCount);
    for (let index = 0; index < totals.length; index += 1) {
      totals[index] += bonuses[index];
    }
  }

  return totals;
}

export function computePlayerScoreTotals(
  scores: Record<string, string | number>,
  majorityTotal: number,
): {
  wildlife: number;
  habitats: number;
  majority: number;
  natureTokens: number;
  total: number;
} {
  const wildlife = sumKeys(scores, WILDLIFE_KEYS);
  const habitats = sumKeys(scores, HABITAT_KEYS);
  const natureTokens = Number(scores.natureTokens);
  const nature = Number.isFinite(natureTokens) ? natureTokens : 0;

  return {
    wildlife,
    habitats,
    majority: majorityTotal,
    natureTokens: nature,
    total: wildlife + habitats + majorityTotal + nature,
  };
}
