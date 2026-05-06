import type { RankedQueueType } from "../types/ranked";

const SOLO_QUEUE_TYPE: RankedQueueType = "RANKED_SOLO_5x5";

export const QUEUE_ID_TO_RANKED_QUEUE_TYPE: Partial<Record<number, RankedQueueType>> = {
  420: SOLO_QUEUE_TYPE,
};

const QUEUE_LABELS: Record<RankedQueueType, string> = {
  RANKED_SOLO_5x5: "Ranked Solo/Duo",
};

const TIER_BASE_LP: Record<string, number> = {
  IRON: 0,
  BRONZE: 400,
  SILVER: 800,
  GOLD: 1200,
  PLATINUM: 1600,
  EMERALD: 2000,
  DIAMOND: 2400,
  MASTER: 2800,
  GRANDMASTER: 2800,
  CHALLENGER: 2800,
};

const RANK_BASE_LP: Record<string, number> = {
  IV: 0,
  III: 100,
  II: 200,
  I: 300,
};

const TIERS_BELOW_APEX = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "EMERALD", "DIAMOND"] as const;
const RANKS_FROM_LOW_TO_HIGH = ["IV", "III", "II", "I"] as const;

export const getRankedQueueLabel = (queueType: RankedQueueType) => QUEUE_LABELS[queueType];

export const isRankedQueueType = (queueType: string): queueType is RankedQueueType =>
  queueType === SOLO_QUEUE_TYPE;

export const getQueueTypeFromQueueId = (queueId?: number) =>
  typeof queueId === "number" ? QUEUE_ID_TO_RANKED_QUEUE_TYPE[queueId] : undefined;

export const getTierRankKey = (tier: string, rank: string) => `${tier}:${rank || "I"}`;

export const getAbsoluteLp = (tier: string, rank: string, leaguePoints: number) => {
  const tierBase = TIER_BASE_LP[tier] ?? 0;
  const rankBase = tier === "MASTER" || tier === "GRANDMASTER" || tier === "CHALLENGER"
    ? 0
    : RANK_BASE_LP[rank] ?? 0;

  return tierBase + rankBase + leaguePoints;
};

export const getTierRankFromAbsoluteLp = (absoluteLp: number) => {
  const safeLp = Math.max(0, Math.round(absoluteLp));

  if (safeLp >= TIER_BASE_LP.MASTER) {
    return {
      tier: "MASTER",
      rank: "",
      leaguePoints: safeLp - TIER_BASE_LP.MASTER,
    };
  }

  const tierIndex = Math.min(Math.floor(safeLp / 400), TIERS_BELOW_APEX.length - 1);
  const tier = TIERS_BELOW_APEX[tierIndex];
  const tierLp = safeLp - TIER_BASE_LP[tier];
  const rankIndex = Math.min(Math.floor(tierLp / 100), RANKS_FROM_LOW_TO_HIGH.length - 1);
  const rank = RANKS_FROM_LOW_TO_HIGH[rankIndex];

  return {
    tier,
    rank,
    leaguePoints: tierLp - RANK_BASE_LP[rank],
  };
};
