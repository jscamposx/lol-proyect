import type { PlayerRankedSummary } from "../types/dashboard";

const STORAGE_KEY = "ranking:elo-snapshots:v1";
const MAX_SNAPSHOTS_PER_PLAYER = 180;
const UNCHANGED_SNAPSHOT_INTERVAL_MS = 6 * 60 * 60 * 1000;

export type EloSnapshot = {
  userId: string;
  observedAt: number;
  absoluteLp: number;
  tier: string;
  rank: string;
  lp: number;
  wins: number;
  losses: number;
  totalGames: number;
};

type EloSnapshotStore = Record<string, EloSnapshot[]>;

const canUseStorage = () => {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
};

const isSnapshot = (value: unknown): value is EloSnapshot => {
  const item = value as Partial<EloSnapshot>;
  return (
    typeof item?.userId === "string" &&
    typeof item.observedAt === "number" &&
    typeof item.absoluteLp === "number" &&
    typeof item.tier === "string" &&
    typeof item.rank === "string" &&
    typeof item.lp === "number" &&
    typeof item.wins === "number" &&
    typeof item.losses === "number" &&
    typeof item.totalGames === "number"
  );
};

const normalizeStore = (value: unknown): EloSnapshotStore => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.entries(value as Record<string, unknown>).reduce<EloSnapshotStore>((acc, [userId, snapshots]) => {
    if (!Array.isArray(snapshots)) return acc;

    const cleanSnapshots = snapshots
      .filter(isSnapshot)
      .filter((snapshot) => snapshot.userId === userId)
      .sort((a, b) => a.observedAt - b.observedAt)
      .slice(-MAX_SNAPSHOTS_PER_PLAYER);

    if (cleanSnapshots.length > 0) acc[userId] = cleanSnapshots;
    return acc;
  }, {});
};

export const readEloSnapshotStore = (): EloSnapshotStore => {
  if (!canUseStorage()) return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return normalizeStore(JSON.parse(raw));
  } catch {
    return {};
  }
};

const writeEloSnapshotStore = (store: EloSnapshotStore) => {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Best-effort local history. Ranked reads remain the source of truth.
  }
};

const sameRankedObservation = (a: EloSnapshot, b: EloSnapshot) =>
  a.absoluteLp === b.absoluteLp &&
  a.tier === b.tier &&
  a.rank === b.rank &&
  a.lp === b.lp &&
  a.wins === b.wins &&
  a.losses === b.losses &&
  a.totalGames === b.totalGames;

export const recordEloSnapshot = (
  userId: string,
  ranked: PlayerRankedSummary,
  observedAt = Date.now()
): EloSnapshotStore => {
  const store = readEloSnapshotStore();
  const currentSnapshots = store[userId] ?? [];
  const nextSnapshot: EloSnapshot = {
    userId,
    observedAt,
    absoluteLp: ranked.absoluteLp,
    tier: ranked.tier,
    rank: ranked.rank,
    lp: ranked.lp,
    wins: ranked.wins,
    losses: ranked.losses,
    totalGames: ranked.totalGames,
  };

  const lastSnapshot = currentSnapshots.at(-1);
  if (lastSnapshot) {
    const isDuplicateTimestamp = lastSnapshot.observedAt === nextSnapshot.observedAt;
    const isUnchanged = sameRankedObservation(lastSnapshot, nextSnapshot);
    const unchangedTooSoon = nextSnapshot.observedAt - lastSnapshot.observedAt < UNCHANGED_SNAPSHOT_INTERVAL_MS;

    if (isDuplicateTimestamp || (isUnchanged && unchangedTooSoon)) {
      return store;
    }
  }

  const nextStore = {
    ...store,
    [userId]: [...currentSnapshots, nextSnapshot]
      .sort((a, b) => a.observedAt - b.observedAt)
      .slice(-MAX_SNAPSHOTS_PER_PLAYER),
  };

  writeEloSnapshotStore(nextStore);
  return nextStore;
};

export const getPlayerEloHistory = (store: EloSnapshotStore, userId: string) => store[userId] ?? [];
