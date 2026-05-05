import { CircleCheck, Medal } from "lucide-react";
import { Card } from "../ui";
import { getTierDisplayName, getTierIconUrl, TIER_ICON_FALLBACK_SRC } from "../../services/rankedVisuals";

type RankingRow = {
  rank: number;
  summoner: string;
  region: string;
  routing: string;
  tier: "GOLD" | "SILVER";
  elo: string;
  absoluteLp: string;
  climb: string;
  games: string;
  winrate: string;
  kda: string;
  csPerMinute: string;
};

const fallbackAvatar = "https://ddragon.leagueoflegends.com/cdn/15.9.1/img/profileicon/29.png";

const rankingRows: RankingRow[] = [
  {
    rank: 1,
    summoner: "HHH Maximal27",
    region: "la1",
    routing: "americas",
    tier: "GOLD",
    elo: "Oro II - 92 LP",
    absoluteLp: "1,492 LP abs.",
    climb: "0 LP",
    games: "19W/27L",
    winrate: "40%",
    kda: "2.48",
    csPerMinute: "3.9",
  },
  {
    rank: 2,
    summoner: "camposx",
    region: "la1",
    routing: "americas",
    tier: "GOLD",
    elo: "Oro III - 10 LP",
    absoluteLp: "1,310 LP abs.",
    climb: "0 LP",
    games: "7W/7L",
    winrate: "50%",
    kda: "3.05",
    csPerMinute: "6.4",
  },
  {
    rank: 3,
    summoner: "AssessinRD",
    region: "la1",
    routing: "americas",
    tier: "SILVER",
    elo: "Plata I - 36 LP",
    absoluteLp: "1,136 LP abs.",
    climb: "0 LP",
    games: "20W/14L",
    winrate: "61%",
    kda: "3.14",
    csPerMinute: "6.4",
  },
];

const getWinrateTone = (winrate: string) => {
  const value = Number.parseInt(winrate, 10);
  if (value >= 55) return "text-emerald-300";
  if (value >= 50) return "text-cyan-200";
  return "text-rose-300";
};

const RankEmblem = ({ tier }: { tier: RankingRow["tier"] }) => (
  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-visible">
    <img
      src={getTierIconUrl(tier)}
      alt={`Emblema ${getTierDisplayName(tier)}`}
      className="h-full w-full scale-125 object-contain drop-shadow-[0_0_18px_rgba(255,255,255,0.18)]"
      onError={(event) => {
        event.currentTarget.src = TIER_ICON_FALLBACK_SRC;
        event.currentTarget.className = "h-full w-full rounded-lg bg-white/[0.06]";
      }}
    />
  </div>
);

export default function RankingSection() {
  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <Card className="overflow-hidden">
        <div className="overflow-x-auto thin-scrollbar">
          <table className="w-full min-w-[1050px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 bg-black/25 text-xs uppercase text-slate-500">
                <th className="px-5 py-4 text-center font-bold">Rank</th>
                <th className="px-5 py-4 font-bold">Invocador</th>
                <th className="px-5 py-4 text-center font-bold">ELO actual</th>
                <th className="px-5 py-4 text-center font-bold">Subida</th>
                <th className="px-5 py-4 text-center font-bold">Partidas</th>
                <th className="px-5 py-4 text-center font-bold">Winrate</th>
                <th className="px-5 py-4 text-center font-bold">KDA</th>
                <th className="px-5 py-4 text-center font-bold">CS/M</th>
                <th className="px-5 py-4 text-center font-bold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {rankingRows.map((player) => {
                const isLeader = player.rank === 1;

                return (
                  <tr
                    key={player.summoner}
                    className={`border-b border-white/10 font-medium transition-colors last:border-b-0 hover:bg-white/[0.04] ${
                      isLeader ? "bg-amber-300/[0.055] text-amber-100" : "text-slate-300"
                    }`}
                  >
                    <td className="px-5 py-4 text-center">
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
                    <td className="px-5 py-4 font-bold text-white">
                      <div className="flex items-center gap-3">
                        <img
                          src={fallbackAvatar}
                          className={`h-11 w-11 rounded-lg border object-cover shadow-md ${
                            isLeader ? "border-amber-300/60" : "border-white/10"
                          }`}
                          alt={`Avatar de ${player.summoner}`}
                        />
                        <div className="min-w-0">
                          <div className="truncate">{player.summoner}</div>
                          <div className="text-[10px] font-bold uppercase leading-tight text-slate-500">
                            {player.region} / {player.routing}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-5">
                        <RankEmblem tier={player.tier} />
                        <div className="min-w-0 text-left">
                          <div className="truncate font-black text-violet-100">{player.elo}</div>
                          <div className="mt-1 text-[10px] font-bold uppercase text-slate-500">{player.absoluteLp}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center rounded-md border border-white/10 bg-white/[0.055] px-2 py-1 text-xs font-black text-slate-300">
                        {player.climb}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-center font-bold text-slate-300">{player.games}</td>
                    <td className={`px-5 py-4 text-center font-bold ${getWinrateTone(player.winrate)}`}>{player.winrate}</td>
                    <td className="px-5 py-4 text-center">{player.kda}</td>
                    <td className="px-5 py-4 text-center font-bold text-cyan-100">{player.csPerMinute}</td>
                    <td className="px-5 py-4 text-center font-bold">
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
