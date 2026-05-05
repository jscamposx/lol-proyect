export interface RiotAccountDto {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface RiotSummonerDto {
  id?: string;
  accountId?: string;
  puuid: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export interface RiotLeagueEntryDto {
  leagueId: string;
  queueType: string;
  tier: string;
  rank: string;
  summonerId: string;
  summonerName: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

export interface RiotMatchDto {
  metadata: {
    dataVersion: string;
    matchId: string;
    participants: string[];
  };
  info: {
    gameCreation: number;
    gameDuration: number;
    gameEndTimestamp: number;
    gameId: number;
    gameMode: string;
    gameName: string;
    gameStartTimestamp: number;
    gameType: string;
    gameVersion: string;
    mapId: number;
    participants: RiotParticipantDto[];
    platformId: string;
    queueId: number;
    teams: RiotTeamDto[];
  };
}

export interface RiotParticipantDto {
  assists: number;
  championId: number;
  championName: string;
  champLevel: number;
  deaths: number;
  kills: number;
  puuid: string;
  summonerId?: string;
  summonerName: string;
  riotIdGameName?: string;
  riotIdTagline?: string;
  teamPosition?: string;
  individualPosition?: string;
  teamId: number;
  win: boolean;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  summoner1Id: number;
  summoner2Id: number;
  perks?: {
    styles: Array<{
      description: string;
      selections: Array<{ perk: number }>;
      style: number;
    }>;
  };
}

export interface RiotTeamDto {
  teamId: number;
  win: boolean;
  objectives: unknown;
}

export type LoLQueueId = 420 | 440 | 400 | 430 | number;
