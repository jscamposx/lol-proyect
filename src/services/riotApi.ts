import type { RiotAccountDto, RiotSummonerDto, RiotLeagueEntryDto, RiotMatchDto } from '../types/riot';
import type { RiotRegion, RiotRouting } from '../types/user';
import { getCachedData, setCachedData, RIOT_CACHE_TTL_MS } from './cache';

const API_BASE_URL = import.meta.env.APP_RIOT_API_BASE_URL?.replace(/\/$/, "") || "";
const SOLO_DUO_QUEUE_ID = 420;

const handleRiotResponse = async (res: Response) => {
  if (!res.ok) {
    const apiMessage = await getApiErrorMessage(res);
    if (apiMessage) throw new Error(apiMessage);
    if (res.status === 401) throw new Error("API key inválida o expirada (401)");
    if (res.status === 403) throw new Error("Acceso denegado (403). Revisa tus permisos o API key");
    if (res.status === 404) throw new Error("Jugador o recurso no encontrado (404)");
    if (res.status === 429) throw new Error("Rate limit de Riot alcanzado (429)");
    if (res.status >= 500) throw new Error(`Error de Riot API (${res.status})`);
    throw new Error(`Error de red HTTP: ${res.status}`);
  }
  return res.json();
};

const getApiErrorMessage = async (res: Response) => {
  try {
    const data = await res.clone().json();
    return typeof data?.message === "string" ? data.message : null;
  } catch {
    return null;
  }
};

const getProxyUrl = (riotUrl: string) => {
  const proxyUrl = new URL(`${API_BASE_URL}/api/riot`, window.location.origin);
  proxyUrl.searchParams.set("url", riotUrl);
  return proxyUrl.toString();
};

const fetchWithCache = async <T>(url: string, cacheKey: string): Promise<T> => {
  const cached = getCachedData<T>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(getProxyUrl(url));

    const data = await handleRiotResponse(res);
    setCachedData(cacheKey, data, RIOT_CACHE_TTL_MS); // Default 5 mins
    return data;
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error("Ocurrió un error inesperado de red", { cause: err });
  }
};

export const getAccountByRiotId = async (gameName: string, tagLine: string, routing: RiotRouting): Promise<RiotAccountDto> => {
  const url = `https://${routing}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
  const key = `riot:account:${routing}:${gameName}:${tagLine}`;
  const account = await fetchWithCache<RiotAccountDto>(url, key);
  if (import.meta.env.DEV) {
    console.log("Account response:", account);
  }
  return account;
};

export const getSummonerByPuuid = async (puuid: string, region: RiotRegion): Promise<RiotSummonerDto> => {
  if (!puuid) throw new Error("Missing puuid. Cannot fetch summoner.");
  const url = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
  const key = `riot:summoner:${region}:${puuid}`;
  if (import.meta.env.DEV) {
    console.log("Summoner by PUUID URL:", url);
  }
  const summoner = await fetchWithCache<RiotSummonerDto>(url, key);
  if (import.meta.env.DEV) {
    console.log("Summoner response:", summoner);
  }
  return summoner;
};

export const getRankedEntriesBySummonerId = async (summonerId: string, region: RiotRegion): Promise<RiotLeagueEntryDto[]> => {
  if (!summonerId) {
    throw new Error("Missing summonerId. Cannot fetch ranked entries.");
  }
  const requestedUrl = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`;
  const key = `riot:ranked:${region}:${summonerId}`;
  return fetchWithCache<RiotLeagueEntryDto[]>(requestedUrl, key);
};

export const getRankedEntriesByPuuid = async (puuid: string, region: RiotRegion): Promise<RiotLeagueEntryDto[]> => {
  if (!puuid) {
    throw new Error("Missing puuid. Cannot fetch ranked entries.");
  }
  const requestedUrl = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`;
  const key = `riot:ranked:${region}:puuid:${puuid}`;
  return fetchWithCache<RiotLeagueEntryDto[]>(requestedUrl, key);
};

export const getMatchIdsByPuuid = async (
  puuid: string,
  routing: RiotRouting,
  count = 20,
  start = 0
): Promise<string[]> => {
  if (!puuid) throw new Error("Missing puuid. Cannot fetch match IDs.");
  const safeCount = Math.min(Math.max(count, 1), 100);
  const safeStart = Math.max(start, 0);
  const url = `https://${routing}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=${SOLO_DUO_QUEUE_ID}&type=ranked&start=${safeStart}&count=${safeCount}`;
  const key = `riot:matchIds:${routing}:${puuid}:solo:${safeStart}:${safeCount}`;
  return fetchWithCache<string[]>(url, key);
};

export const getMatchById = async (matchId: string, routing: RiotRouting): Promise<RiotMatchDto> => {
  const url = `https://${routing}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
  const key = `riot:match:${routing}:${matchId}`;
  return fetchWithCache<RiotMatchDto>(url, key);
};
