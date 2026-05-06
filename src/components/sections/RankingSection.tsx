import { useMemo } from "react";
import { CircleCheck, Medal } from "lucide-react";
import { Card } from "../ui";
import { getTierDisplayName, getTierIconUrl, TIER_ICON_FALLBACK_SRC } from "../../services/rankedVisuals";
import { getProfileIconUrl } from "../../services/riotTransformers";
import { usePlayersDashboard } from "../../hooks/usePlayersDashboard";
import usersData from "../../data/users.json";
import type { RiotRegion, RiotRouting, UserConfig } from "../../types/user";

type RankingRow = {
  rank: number;
  summoner: string;
  region: RiotRegion;
  routing: RiotRouting;
  tier: string;
  elo: string;
  absoluteLp: string;
  games: string;
  winrate: string;
  kda: string;
  csPerMinute: string;
};

const typedUsers = usersData as UserConfig[];

// You'll want to either pass the Riot icon id here, or match the user from usePlayersDashboard.
// For now, this fallback stays until we integrate the real profile icons.
const fallbackAvatar = "https://ddragon.leagueoflegends.com/cdn/15.9.1/img/profileicon/29.png";

const getWinrateTone = (winrate: string) => {
  const value = Number.parseInt(winrate, 10);
  if (value >= 55) return "text-emerald-300";
  if (value >= 50) return "text-cyan-200";
  return "text-rose-300";
};

const RankEmblem = ({ tier, compact = false }: { tier: RankingRow["tier"]; compact?: boolean }) => {
  const isUnranked = tier === "UNRANKED" || !tier;
  return (
    <div className={`flex shrink-0 items-center justify-center ${compact ? "h-14 w-14" : "h-16 w-16"}`}>
      <img
        src={getTierIconUrl(tier)}
        alt={`Emblema ${getTierDisplayName(tier)}`}
        className={`w-full h-full object-center drop-shadow-[0_0_18px_rgba(255,255,255,0.18)] ${
          isUnranked ? "object-contain scale-75 opacity-70" : "object-cover scale-[1.15]"
        }`}
        onError={(event) => {
          event.currentTarget.src = TIER_ICON_FALLBACK_SRC;
          event.currentTarget.className = "h-full w-full object-contain p-2 rounded-lg bg-white/[0.06] opacity-50";
        }}
      />
    </div>
  );
};

const MobileMetric = ({ label, value, tone = "text-slate-100" }: { label: string; value: string; tone?: string }) => (
  <div className="min-w-0 rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2.5">
    <div className="text-[10px] font-bold uppercase text-slate-500">{label}</div>
    <div className={`mt-1 truncate text-sm font-black ${tone}`}>{value}</div>
  </div>
);

export default function RankingSection() {
  const dashboards = usePlayersDashboard(typedUsers);

  const getDynamicAvatarUrl = (summonerName: string) => {
    const p = dashboards.find(
      (d) => d.data && d.data.accountInfo.gameName?.toLowerCase() === summonerName.toLowerCase()
    );
    if (p && p.data && p.data.accountInfo.profileIconId) {
      return getProfileIconUrl(p.data.accountInfo.profileIconId);
    }
    return fallbackAvatar;
  };

  const dynamicRankingRows: RankingRow[] = useMemo(() => {
    return dashboards
      .filter((d) => d.data)
      .map((d) => {
        const p = d.data!;
        const r = p.ranked;
        const userConfig = typedUsers.find((user) => user.id === d.userId);
        const recentGames = p.recentStats?.totalGames ?? 0;
        const hasRecentGames = recentGames > 0;
        const wins = hasRecentGames ? p.recentStats.wins : r?.wins ?? 0;
        const losses = hasRecentGames ? p.recentStats.losses : r?.losses ?? 0;
        const totalGames = wins + losses;
        const winrate = hasRecentGames
          ? p.recentStats.winrate
          : totalGames > 0
            ? Math.round((wins / totalGames) * 100)
            : 0;
        
        return {
          summoner: p.accountInfo.gameName,
          region: userConfig?.region ?? "la1",
          routing: userConfig?.routing ?? "americas",
          tier: r ? r.tier : "UNRANKED",
          elo: r ? `${getTierDisplayName(r.tier)} ${r.rank} - ${r.lp} LP` : "Unranked",
          absoluteLp: r ? `${r.absoluteLp.toLocaleString()} LP abs.` : "0 LP abs.",
          games: `${wins}W/${losses}L`,
          winrate: `${winrate}%`,
          kda: p.recentStats?.averageKda ? p.recentStats.averageKda.toFixed(2) : "0.00",
          csPerMinute: p.recentStats?.averageCsPerMin ? p.recentStats.averageCsPerMin.toFixed(1) : "0.0",
          _sortValue: r ? r.absoluteLp : -1,
        };
      })
      .sort((a, b) => b._sortValue - a._sortValue)
      .map((row, index) => ({
        ...row,
        rank: index + 1,
      }));
  }, [dashboards]);

  if (dynamicRankingRows.length === 0) {
    return <div className="text-center text-slate-400 py-10">Cargando ranking u obteniendo datos...</div>;
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:hidden">
        {dynamicRankingRows.map((player) => {
          const isLeader = player.rank === 1;

          return (
            <Card
              key={player.summoner}
              className={`relative overflow-hidden p-4 ${
                isLeader ? "border-amber-200/20 bg-amber-300/[0.045]" : ""
              }`}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-violet-300/70 via-cyan-200/65 to-amber-200/70"></div>

              <div className="flex min-w-0 items-start gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border font-black ${
                  isLeader
                    ? "border-amber-200/25 bg-amber-300/15 text-amber-100"
                    : "border-white/10 bg-white/[0.06] text-slate-300"
                }`}>
                  {isLeader ? <Medal className="h-5 w-5" /> : player.rank}
                </div>

                <img
                  src={getDynamicAvatarUrl(player.summoner)}
                  className={`h-12 w-12 shrink-0 rounded-lg border object-cover shadow-md ${
                    isLeader ? "border-amber-300/60" : "border-white/10"
                  }`}
                  alt={`Avatar de ${player.summoner}`}
                  onError={(e) => { e.currentTarget.src = fallbackAvatar; }}
                />

                <div className="min-w-0 flex-1">
                  <div className="truncate text-base font-black text-white">{player.summoner}</div>
                  <div className="text-[10px] font-bold uppercase text-slate-500">
                    {player.region} / {player.routing}
                  </div>
                </div>

                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-emerald-300/20 bg-emerald-300/10 px-2 py-1 text-[10px] font-black uppercase text-emerald-300">
                  <CircleCheck className="h-3.5 w-3.5" />
                  Listo
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-3">
                <RankEmblem tier={player.tier} compact />
                <div className="min-w-0">
                  <div className="truncate text-base font-black text-violet-100">{player.elo}</div>
                  <div className="mt-1 text-[10px] font-bold uppercase text-slate-500">{player.absoluteLp}</div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 min-[420px]:grid-cols-3">
                <MobileMetric label="Partidas" value={player.games} />
                <MobileMetric label="Winrate" value={player.winrate} tone={getWinrateTone(player.winrate)} />
                <MobileMetric label="KDA" value={player.kda} />
                <MobileMetric label="CS/M" value={player.csPerMinute} tone="text-cyan-100" />
                <MobileMetric label="Rank" value={`#${player.rank}`} tone={isLeader ? "text-amber-100" : "text-slate-100"} />
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="hidden overflow-hidden lg:block">
        <div className="overflow-x-auto thin-scrollbar">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm xl:min-w-[1050px]">
            <thead>
              <tr className="border-b border-white/10 bg-black/25 text-xs uppercase text-slate-500">
                <th className="px-3 py-3 text-center font-bold xl:px-5 xl:py-4">Rank</th>
                <th className="px-3 py-3 font-bold xl:px-5 xl:py-4">Invocador</th>
                <th className="px-3 py-3 text-center font-bold xl:px-5 xl:py-4">ELO actual</th>
                <th className="px-3 py-3 text-center font-bold xl:px-5 xl:py-4">Partidas</th>
                <th className="px-3 py-3 text-center font-bold xl:px-5 xl:py-4">Winrate</th>
                <th className="px-3 py-3 text-center font-bold xl:px-5 xl:py-4">KDA</th>
                <th className="px-3 py-3 text-center font-bold xl:px-5 xl:py-4">CS/M</th>
                <th className="px-3 py-3 text-center font-bold xl:px-5 xl:py-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {dynamicRankingRows.map((player) => {
                const isLeader = player.rank === 1;

                return (
                  <tr
                    key={player.summoner}
                    className={`border-b border-white/10 font-medium transition-colors last:border-b-0 hover:bg-white/[0.04] ${
                      isLeader ? "bg-amber-300/[0.055] text-amber-100" : "text-slate-300"
                    }`}
                  >
                    <td className="px-3 py-3 text-center xl:px-5 xl:py-4">
                      {isLeader ? (
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-amber-200/25 bg-amber-300/15 text-amber-100">
                          <Medal className="h-5 w-5" />
                        </span>
                      ) : (
                        <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] font-black text-slate-300">
                          {player.rank}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 font-bold text-white xl:px-5 xl:py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getDynamicAvatarUrl(player.summoner)}
                          className={`h-11 w-11 rounded-lg border object-cover shadow-md ${
                            isLeader ? "border-amber-300/60" : "border-white/10"
                          }`}
                          alt={`Avatar de ${player.summoner}`}
                          onError={(e) => { e.currentTarget.src = fallbackAvatar; }}
                        />
                        <div className="min-w-0">
                          <div className="truncate">{player.summoner}</div>
                          <div className="text-[10px] font-bold uppercase leading-tight text-slate-500">
                            {player.region} / {player.routing}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center xl:px-5 xl:py-4">
                      <div className="flex items-center justify-center gap-3 xl:gap-5">
                        <RankEmblem tier={player.tier} compact />
                        <div className="min-w-0 text-left">
                          <div className="truncate font-black text-violet-100">{player.elo}</div>
                          <div className="mt-1 text-[10px] font-bold uppercase text-slate-500">{player.absoluteLp}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-center font-bold text-slate-300 xl:px-5 xl:py-4">{player.games}</td>
                    <td className={`px-3 py-3 text-center font-bold xl:px-5 xl:py-4 ${getWinrateTone(player.winrate)}`}>{player.winrate}</td>
                    <td className="px-3 py-3 text-center xl:px-5 xl:py-4">{player.kda}</td>
                    <td className="px-3 py-3 text-center font-bold text-cyan-100 xl:px-5 xl:py-4">{player.csPerMinute}</td>
                    <td className="px-3 py-3 text-center font-bold xl:px-5 xl:py-4">
                      <span className="inline-flex items-center justify-center gap-2 text-emerald-300">
                        <CircleCheck className="h-4 w-4" />
                        Listo
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
