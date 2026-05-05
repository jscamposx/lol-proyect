export type RiotRegion = "la1" | "br1" | "na1" | "euw1" | "eun1" | "kr" | "jp1" | "oc1" | "tr1" | "ru";
export type RiotRouting = "americas" | "asia" | "europe" | "sea";

export interface UserConfig {
  id: string;
  displayName: string;
  gameName: string;
  tagLine: string;
  region: RiotRegion;
  routing: RiotRouting;
  avatar: string;
}
