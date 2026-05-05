import type { RankedQueueType } from "./ranked";

export interface PlayerRankedSummary {
  queueType: RankedQueueType;
  queue: string;
  tier: string;
  rank: string;
  lp: number;
  wins: number;
  losses: number;
  winrate: number;
  totalGames: number;
  tierRankKey: string;
  absoluteLp: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
}

export interface ChampionSummary {
  championName: string;
  wins: number;
  losses: number;
  winrate: number;
  kda: number;
}

export interface DashboardMatchParticipant {
  summonerName: string;
  championName: string;
  puuid: string;
  summonerId?: string;
  riotIdGameName?: string;
  riotIdTagline?: string;
  teamId: number;
}

export interface DashboardMatch {
  matchId: string;
  queueType?: RankedQueueType;
  queue: string;
  timestamp: number;
  dateLabel: string;
  duration: number;
  win: boolean;
  isRemake?: boolean;
  championName: string;
  championLevel: number;
  position?: string;
  kills: number;
  deaths: number;
  assists: number;
  kdaRatio: number;
  csTotal: number;
  csPerMin: number;
  items: number[];
  spells: number[];
  mainRuneId?: number;
  secondaryStyleId?: number;
  allyTeam: DashboardMatchParticipant[];
  enemyTeam: DashboardMatchParticipant[];
}

export interface PlayerRecentStats {
  totalGames: number;
  wins: number;
  losses: number;
  winrate: number;
  averageKda: number;
  averageCsPerMin: number;
  averageDuration: number;
}

export interface DashboardPlayer {
  accountInfo: {
    puuid: string;
    gameName: string;
    tagLine: string;
    summonerLevel: number;
    profileIconId: number;
  };
  ranked: PlayerRankedSummary | null;
  rankedQueues: Partial<Record<RankedQueueType, PlayerRankedSummary>>;
  recentStats: PlayerRecentStats;
  championPool: ChampionSummary[];
  matchHistory: DashboardMatch[];
}

export interface LoadablePlayerDashboard {
  userId: string;
  data: DashboardPlayer | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}
