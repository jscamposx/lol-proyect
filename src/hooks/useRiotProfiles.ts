import { useEffect, useMemo, useRef, useState } from "react";
import { clearExpiredCache } from "../services/cache";
import { getAccountByRiotId, getSummonerByPuuid } from "../services/riotApi";
import type { UserConfig } from "../types/user";

export type RiotProfileSummary = {
  userId: string;
  profileIconId: number | null;
  summonerLevel: number | null;
  loading: boolean;
  error: string | null;
};

export const useRiotProfiles = (users: UserConfig[]) => {
  const [profiles, setProfiles] = useState<RiotProfileSummary[]>(
    users.map((user) => ({
      userId: user.id,
      profileIconId: null,
      summonerLevel: null,
      loading: true,
      error: null,
    }))
  );

  const isFetching = useRef(false);

  useEffect(() => {
    if (isFetching.current || users.length === 0) return;
    isFetching.current = true;
    clearExpiredCache();

    Promise.all(
      users.map(async (user): Promise<RiotProfileSummary> => {
        try {
          const account = await getAccountByRiotId(user.gameName, user.tagLine, user.routing);
          const summoner = await getSummonerByPuuid(account.puuid, user.region);

          return {
            userId: user.id,
            profileIconId: summoner.profileIconId,
            summonerLevel: summoner.summonerLevel,
            loading: false,
            error: null,
          };
        } catch (error) {
          return {
            userId: user.id,
            profileIconId: null,
            summonerLevel: null,
            loading: false,
            error: error instanceof Error ? error.message : "No se pudo cargar el perfil.",
          };
        }
      })
    ).then((results) => {
      setProfiles(results);
      isFetching.current = false;
    });
  }, [users]);

  return useMemo(() => {
    return Object.fromEntries(profiles.map((profile) => [profile.userId, profile])) as Record<string, RiotProfileSummary>;
  }, [profiles]);
};
