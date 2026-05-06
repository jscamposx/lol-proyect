import type { PlayerRankedSummary } from "../types/dashboard";
import type { RiotLeagueEntryDto } from "../types/riot";
import {
  getAbsoluteLp,
  getRankedQueueLabel,
  getTierRankKey,
  isRankedQueueType,
} from "./rankedQueues";

export const toRankedSummary = (entry: RiotLeagueEntryDto): PlayerRankedSummary | null => {
  if (!isRankedQueueType(entry.queueType)) return null;

  const totalGames = entry.wins + entry.losses;

  return {
    queueType: entry.queueType,
    queue: getRankedQueueLabel(entry.queueType),
    tier: entry.tier,
    rank: entry.rank,
    lp: entry.leaguePoints,
    wins: entry.wins,
    losses: entry.losses,
    winrate: totalGames > 0 ? Math.round((entry.wins / totalGames) * 100) : 0,
    totalGames,
    tierRankKey: getTierRankKey(entry.tier, entry.rank),
    absoluteLp: getAbsoluteLp(entry.tier, entry.rank, entry.leaguePoints),
    hotStreak: entry.hotStreak,
    veteran: entry.veteran,
    freshBlood: entry.freshBlood,
    inactive: entry.inactive,
  };
};

export const getSoloDuoRankedSummary = (entries: RiotLeagueEntryDto[]) => {
  for (const entry of entries) {
    const summary = toRankedSummary(entry);
    if (summary?.queueType === "RANKED_SOLO_5x5") return summary;
  }

  return null;
};
