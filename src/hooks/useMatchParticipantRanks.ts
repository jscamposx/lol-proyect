import { useEffect, useMemo, useRef, useState } from "react";
import type { DashboardMatch, PlayerRankedSummary } from "../types/dashboard";
import type { RiotRegion } from "../types/user";
import { getRankedEntriesByPuuid } from "../services/riotApi";
import { getTierRankFromAbsoluteLp } from "../services/rankedQueues";
import { getSoloDuoRankedSummary } from "../services/rankedSummaries";

const RANK_FETCH_CHUNK_SIZE = 6;

export type ParticipantRankMap = Record<string, PlayerRankedSummary | null>;

export type AverageEnemyRank = {
  tier: string | null;
  rank: string;
  leaguePoints?: number;
  rankedEnemyCount: number;
  resolvedEnemyCount: number;
  totalEnemyCount: number;
  loading: boolean;
};

type ParticipantRankCache = {
  region: RiotRegion;
  ranks: ParticipantRankMap;
};

const EMPTY_RANK_MAP: ParticipantRankMap = {};

const hasRankResult = (rankByPuuid: ParticipantRankMap, puuid: string) =>
  Object.prototype.hasOwnProperty.call(rankByPuuid, puuid);

const fetchParticipantRankChunk = async (puuids: string[], region: RiotRegion) => {
  const results: ParticipantRankMap = {};

  const entries = await Promise.all(
    puuids.map(async (puuid, idx) => {
      try {
        // Pausa escalonada artificial para evitar Rate Limit rápido a /league/v4/entries
        if (idx > 0) {
          await new Promise((resolve) => setTimeout(resolve, idx * 100)); // 100ms separación
        }
        const rankedEntries = await getRankedEntriesByPuuid(puuid, region);
        return [puuid, getSoloDuoRankedSummary(rankedEntries)] as const;
      } catch (error) {
        return [puuid, null] as const;
      }
    })
  );

  entries.forEach(([puuid, rank]) => {
    results[puuid] = rank;
  });

  return results;
};

export const useMatchParticipantRanks = (matches: DashboardMatch[], region: RiotRegion) => {
  const [rankCache, setRankCache] = useState<ParticipantRankCache>({ region, ranks: {} });
  const inFlightRankPuuids = useRef(new Set<string>());
  const activeRegion = useRef(region);
  const rankByPuuid = rankCache.region === region ? rankCache.ranks : EMPTY_RANK_MAP;

  const participantPuuids = useMemo(() => {
    const puuids = new Set<string>();

    matches.forEach((match) => {
      match.allyTeam.forEach((participant) => {
        if (participant.puuid) puuids.add(participant.puuid);
      });
      match.enemyTeam.forEach((participant) => {
        if (participant.puuid) puuids.add(participant.puuid);
      });
    });

    return Array.from(puuids).sort();
  }, [matches]);

  const enemyParticipantsForAverage = useMemo(
    () => matches
      .filter((match) => !match.isRemake)
      .flatMap((match) => match.enemyTeam),
    [matches]
  );

  const averageEnemyRank = useMemo<AverageEnemyRank | null>(() => {
    const totalEnemyCount = enemyParticipantsForAverage.length;
    if (totalEnemyCount === 0) return null;

    let resolvedEnemyCount = 0;
    let rankedEnemyCount = 0;
    let absoluteLpTotal = 0;

    enemyParticipantsForAverage.forEach((participant) => {
      if (!hasRankResult(rankByPuuid, participant.puuid)) return;

      resolvedEnemyCount += 1;
      const rank = rankByPuuid[participant.puuid];
      if (!rank) return;

      rankedEnemyCount += 1;
      absoluteLpTotal += rank.absoluteLp;
    });

    const loading = resolvedEnemyCount < totalEnemyCount;
    if (rankedEnemyCount === 0) {
      return {
        tier: null,
        rank: "",
        rankedEnemyCount,
        resolvedEnemyCount,
        totalEnemyCount,
        loading,
      };
    }

    const average = getTierRankFromAbsoluteLp(absoluteLpTotal / rankedEnemyCount);

    return {
      tier: average.tier,
      rank: average.rank,
      leaguePoints: average.leaguePoints,
      rankedEnemyCount,
      resolvedEnemyCount,
      totalEnemyCount,
      loading,
    };
  }, [enemyParticipantsForAverage, rankByPuuid]);

  useEffect(() => {
    activeRegion.current = region;
    inFlightRankPuuids.current.clear();
  }, [region]);

  useEffect(() => {
    // TODO: Desactivado temporalmente para no consumir la API.
    // Retirar este return cuando se vaya a optimizar.
    return;

    const missingPuuids = participantPuuids.filter((puuid) =>
      !hasRankResult(rankByPuuid, puuid) && !inFlightRankPuuids.current.has(puuid)
    );

    if (missingPuuids.length === 0) return;

    missingPuuids.forEach((puuid) => inFlightRankPuuids.current.add(puuid));
    const requestedRegion = region;

    void (async () => {
      for (let index = 0; index < missingPuuids.length; index += RANK_FETCH_CHUNK_SIZE) {
        const chunk = missingPuuids.slice(index, index + RANK_FETCH_CHUNK_SIZE);
        const results = await fetchParticipantRankChunk(chunk, requestedRegion);
        if (activeRegion.current !== requestedRegion) return;

        setRankCache((prev) => ({
          region: requestedRegion,
          ranks: {
            ...(prev.region === requestedRegion ? prev.ranks : EMPTY_RANK_MAP),
            ...results,
          },
        }));
        // Pausa entre chunks para dar un pequeño respiro a la API
        await new Promise((resolve) => setTimeout(resolve, 800));      }
    })()
      .finally(() => {
        missingPuuids.forEach((puuid) => inFlightRankPuuids.current.delete(puuid));
      });
  }, [participantPuuids, rankByPuuid, region]);

  return {
    rankByPuuid,
    averageEnemyRank,
  };
};
