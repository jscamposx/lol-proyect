import type { DashboardPlayer } from "../types/dashboard";
import type { RiotLeagueEntryDto, RiotMatchDto } from "../types/riot";
import type { UserConfig } from "../types/user";
import { getSeasonStartTimestamp } from "../utils/season";
import { getQueueTypeFromQueueId } from "./rankedQueues";
import {
  getAccountByRiotId,
  getMatchById,
  getMatchIdsByPuuid,
  getRankedEntriesByPuuid,
  getRankedEntriesBySummonerId,
  getSummonerByPuuid,
} from "./riotApi";
import { transformRiotData } from "./riotTransformers";

const DEFAULT_MAX_MATCHES = 500;
const DEFAULT_MATCH_PAGE_SIZE = 100;
const DEFAULT_MATCH_CHUNK_SIZE = 10;

type LoadPlayerDashboardOptions = {
  maxMatches?: number;
  matchPageSize?: number;
  matchChunkSize?: number;
};

export const loadPlayerDashboard = async (
  user: UserConfig,
  options: LoadPlayerDashboardOptions = {}
): Promise<DashboardPlayer> => {
  const maxMatches = options.maxMatches ?? DEFAULT_MAX_MATCHES;
  const matchPageSize = options.matchPageSize ?? DEFAULT_MATCH_PAGE_SIZE;
  const matchChunkSize = options.matchChunkSize ?? DEFAULT_MATCH_CHUNK_SIZE;

  const account = await getAccountByRiotId(user.gameName, user.tagLine, user.routing);
  const puuid = account.puuid;
  const summoner = await getSummonerByPuuid(puuid, user.region);
  const matches = await loadRecentRankedMatches(puuid, user, maxMatches, matchPageSize, matchChunkSize);
  const ranked = await loadRankedEntries(puuid, summoner.id, user);
  const seasonStart = getSeasonStartTimestamp(user.region);
  const validMatches = matches
    .filter((match): match is RiotMatchDto => Boolean(match?.info))
    .filter((match) => Boolean(getQueueTypeFromQueueId(match.info.queueId)))
    .filter((match) => match.info.gameCreation >= seasonStart);

  return transformRiotData(account, summoner, ranked, validMatches, puuid);
};

const loadRankedEntries = async (
  puuid: string,
  summonerId: string | undefined,
  user: UserConfig
): Promise<RiotLeagueEntryDto[]> => {
  try {
    return await getRankedEntriesByPuuid(puuid, user.region);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Failed fetching ranked entries by PUUID, trying summoner id fallback:", error);
    }
  }

  if (!summonerId) {
    if (import.meta.env.DEV) {
      console.warn(`No summoner.id for ${user.id}, skipping ranked fallback.`);
    }
    return [];
  }

  try {
    return await getRankedEntriesBySummonerId(summonerId, user.region);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Failed fetching ranked entries by summoner id:", error);
    }
    return [];
  }
};

const loadRecentRankedMatches = async (
  puuid: string,
  user: UserConfig,
  maxMatches: number,
  matchPageSize: number,
  matchChunkSize: number
): Promise<Array<RiotMatchDto | null>> => {
  const matchIds: string[] = [];

  for (let start = 0; start < maxMatches; start += matchPageSize) {
    const batch = await getMatchIdsByPuuid(puuid, user.routing, matchPageSize, start);
    matchIds.push(...batch);
    if (batch.length < matchPageSize) break;
  }

  const matches: Array<RiotMatchDto | null> = [];

  for (let i = 0; i < Math.min(matchIds.length, maxMatches); i += matchChunkSize) {
    const chunk = matchIds.slice(i, i + matchChunkSize);
    const chunkMatches = await Promise.all(
      chunk.map((id) => getMatchById(id, user.routing).catch(() => null))
    );
    matches.push(...chunkMatches);
  }

  return matches;
};
