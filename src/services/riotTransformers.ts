import type { RiotAccountDto, RiotLeagueEntryDto, RiotMatchDto, RiotParticipantDto, RiotSummonerDto } from "../types/riot";
import type { ChampionSummary, DashboardMatch, DashboardPlayer, PlayerRankedSummary, PlayerRecentStats } from "../types/dashboard";
import type { RankedQueueType } from "../types/ranked";
import { formatLongSpanishDate } from "../utils/formatters";
import {
  getAbsoluteLp,
  getQueueTypeFromQueueId,
  getRankedQueueLabel,
  getTierRankKey,
  isRankedQueueType,
} from "./rankedQueues";

const getQueueLabel = (queueId?: number) => {
  const queueType = getQueueTypeFromQueueId(queueId);
  if (queueType) return getRankedQueueLabel(queueType);
  return "Ranked";
};

const toRankedSummary = (entry: RiotLeagueEntryDto): PlayerRankedSummary | null => {
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

export const DDRAGON_VERSION = "15.9.1";

const CHAMPION_DISPLAY_NAMES: Record<string, string> = {
  MonkeyKing: "Wukong",
};

const CHAMPION_ASSET_KEYS: Record<string, string> = {
  Wukong: "MonkeyKing",
};

export const getChampionDisplayName = (championName: string) =>
  CHAMPION_DISPLAY_NAMES[championName] ?? championName;

export const getChampionIconUrl = (championName: string) => {
  const assetKey = CHAMPION_ASSET_KEYS[championName] ?? championName;
  const cleanName = assetKey.replace(/[\s'.]/g, '');
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${cleanName}.png`;
};

export const getChampionSplashUrl = (championName: string) => {
  const assetKey = CHAMPION_ASSET_KEYS[championName] ?? championName;
  const cleanName = assetKey.replace(/[\s'.]/g, '');
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${cleanName}_0.jpg`;
};

export const getItemIconUrl = (itemId: number) => {
  return itemId > 0 ? `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/item/${itemId}.png` : '';
};

export const getSpellIconUrl = (spellId: number) => {
  void spellId;
  // Placeholder logic, you'd ideally map IDs to names
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/spell/SummonerFlash.png`; // Fallback
};

export const getSummonerSpellIconUrl = (iconName?: string) => {
  return iconName ? `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/spell/${iconName}` : '';
};

export const getProfileIconUrl = (profileIconId?: number | null) => {
  return profileIconId != null
    ? `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/profileicon/${profileIconId}.png`
    : '';
};

export const getRuneIconUrl = (iconPath?: string) => {
  return iconPath ? `https://ddragon.leagueoflegends.com/cdn/img/${iconPath}` : '';
};

export const transformRiotData = (
  account: RiotAccountDto,
  summoner: RiotSummonerDto,
  rankedEntries: RiotLeagueEntryDto[] | null,
  matches: RiotMatchDto[],
  targetPuuid: string
): DashboardPlayer => {
  const rankedQueues: Partial<Record<RankedQueueType, PlayerRankedSummary>> = {};

  (rankedEntries || []).forEach((entry) => {
    const summary = toRankedSummary(entry);
    if (summary) rankedQueues[summary.queueType] = summary;
  });

  const rankedSummary = rankedQueues.RANKED_SOLO_5x5 || null;

  let totalGames = 0, totalWins = 0, totalDuration = 0, totalKills = 0, totalDeaths = 0, totalAssists = 0, totalCs = 0;
  const champStats: Record<string, { wins: number; losses: number; kills: number; deaths: number; assists: number }> = {};
  
  const dashboardMatches: DashboardMatch[] = matches.filter(m => m && m.info).map(match => {
    const p = match.info.participants.find(part => part.puuid === targetPuuid);
    if (!p) return null;
    const isRemake = match.info.gameDuration < 300;
    
    const cs = p.totalMinionsKilled + p.neutralMinionsKilled;

    if (!isRemake) {
      totalGames++;
      if (p.win) totalWins++;
      totalDuration += match.info.gameDuration;
      totalKills += p.kills;
      totalDeaths += p.deaths;
      totalAssists += p.assists;
      totalCs += cs;
    }

    if (!isRemake) {
      const championName = getChampionDisplayName(p.championName);
      if (!champStats[championName]) {
        champStats[championName] = { wins: 0, losses: 0, kills: 0, deaths: 0, assists: 0 };
      }
      if (p.win) champStats[championName].wins++;
      else champStats[championName].losses++;
      champStats[championName].kills += p.kills;
      champStats[championName].deaths += p.deaths;
      champStats[championName].assists += p.assists;
    }

    const dateLabel = formatLongSpanishDate(match.info.gameCreation);
    const queueType = getQueueTypeFromQueueId(match.info.queueId);

    const allyTeamIds = match.info.participants.filter(part => part.teamId === p.teamId);
    const enemyTeamIds = match.info.participants.filter(part => part.teamId !== p.teamId);

    const mapParticipant = (part: RiotParticipantDto) => ({
      summonerName: part.summonerName,
      championName: getChampionDisplayName(part.championName),
      puuid: part.puuid,
      summonerId: part.summonerId,
      riotIdGameName: part.riotIdGameName,
      riotIdTagline: part.riotIdTagline,
      teamId: part.teamId
    });

    return {
      matchId: match.metadata.matchId,
      queueType,
      queue: getQueueLabel(match.info.queueId),
      timestamp: match.info.gameCreation,
      dateLabel,
      duration: match.info.gameDuration,
      win: p.win,
      isRemake,
      championName: getChampionDisplayName(p.championName),
      championLevel: p.champLevel,
      position: p.teamPosition || p.individualPosition,
      kills: p.kills,
      deaths: p.deaths,
      assists: p.assists,
      kdaRatio: p.deaths === 0 ? p.kills + p.assists : Number(((p.kills + p.assists) / p.deaths).toFixed(2)),
      csTotal: cs,
      csPerMin: Number((cs / (match.info.gameDuration / 60)).toFixed(1)),
      items: [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6],
      spells: [p.summoner1Id, p.summoner2Id],
      mainRuneId: p.perks?.styles[0]?.selections[0]?.perk,
      secondaryStyleId: p.perks?.styles[1]?.style,
      allyTeam: allyTeamIds.map(mapParticipant),
      enemyTeam: enemyTeamIds.map(mapParticipant)
    };
  }).filter(Boolean) as DashboardMatch[];

  const championPool: ChampionSummary[] = Object.keys(champStats).map(champ => {
    const stats = champStats[champ];
    const total = stats.wins + stats.losses;
    const wr = Math.round((stats.wins / total) * 100);
    const kda = stats.deaths === 0 ? stats.kills + stats.assists : (stats.kills + stats.assists) / stats.deaths;
    return { championName: champ, wins: stats.wins, losses: stats.losses, winrate: wr, kda: Number(kda.toFixed(2)) };
  }).sort((a,b) => (b.wins + b.losses) - (a.wins + a.losses));

  const recentStats: PlayerRecentStats = {
    totalGames,
    wins: totalWins,
    losses: totalGames - totalWins,
    winrate: totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0,
    averageKda: totalGames > 0 && totalDeaths > 0 ? Number(((totalKills + totalAssists) / totalDeaths).toFixed(2)) : 0,
    averageCsPerMin: totalGames > 0 ? Number((totalCs / (totalDuration / 60)).toFixed(1)) : 0,
    averageDuration: totalGames > 0 ? Math.round(totalDuration / totalGames) : 0
  };

  return {
    accountInfo: {
      puuid: account.puuid,
      gameName: account.gameName,
      tagLine: account.tagLine,
      summonerLevel: summoner.summonerLevel,
      profileIconId: summoner.profileIconId,
    },
    ranked: rankedSummary,
    rankedQueues,
    recentStats,
    championPool,
    matchHistory: dashboardMatches
  };
};
