import { RefreshCw, ShieldCheck } from "lucide-react";
import type { DashboardPlayer } from "../../types/dashboard";
import { Badge, Card } from "../ui";
import { formatShortTime } from "../../utils/formatters";
import { getProfileIconUrl } from "../../services/riotTransformers";

export const PlayerHeader = ({ player, onRefresh, lastUpdated, message }: { player: DashboardPlayer, onRefresh: () => void, lastUpdated: number|null, message: string|null }) => {
  const rankLabel = player.ranked ? `${player.ranked.tier} ${player.ranked.rank} · ${player.ranked.lp} LP` : "Unranked";

  return (
    <Card className="flex flex-col md:flex-row items-center md:items-stretch gap-5 sm:gap-6 p-4 sm:p-5 md:p-6 xl:p-7 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-violet-300/75 via-cyan-200/60 to-amber-200/70"></div>
      <div className="absolute inset-0 bg-linear-to-br from-violet-500/10 via-transparent to-cyan-500/10 pointer-events-none"></div>

      <div className="relative shrink-0 flex items-center">
        <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-lg bg-violet-500/20"></div>
        <img
          src={getProfileIconUrl(player.accountInfo.profileIconId)}
          alt="Icono de invocador"
          className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-lg shadow-xl border border-white/10 z-10 bg-black/30"
          onError={(event) => { (event.currentTarget as HTMLImageElement).src = "https://ddragon.leagueoflegends.com/cdn/15.9.1/img/profileicon/29.png"; }}
        />
        <span className="absolute -bottom-3 -right-3 z-20 bg-[#0a0612] border border-white/10 text-xs px-3 py-1.5 rounded-md text-cyan-200 font-bold shadow-lg">
          Lvl {player.accountInfo.summonerLevel}
        </span>
      </div>

      <div className="flex-1 text-center md:text-left z-10 min-w-0">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-3 flex-wrap">
          <Badge variant="cyan">
            <ShieldCheck className="h-3.5 w-3.5" />
            Riot API
          </Badge>
          <Badge variant="blue">{rankLabel}</Badge>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-4xl xl:text-5xl font-black text-white flex flex-col md:flex-row items-center md:items-baseline gap-1.5 sm:gap-2 mb-3 min-w-0">
          <span className="truncate max-w-full">{player.accountInfo.gameName}</span>
          <span className="max-w-full truncate text-violet-200/90 font-semibold text-xl sm:text-2xl md:text-3xl">#{player.accountInfo.tagLine}</span>
        </h1>
        <p className="text-slate-400 text-sm flex items-center justify-center md:justify-start gap-3 flex-wrap">
          <span className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Actualizado: {formatShortTime(lastUpdated)}
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full md:w-auto z-10 justify-center">
        <button
          onClick={onRefresh}
          className="group/btn whitespace-nowrap px-6 py-3.5 bg-linear-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-violet-500/25 border border-white/10 w-full md:w-auto"
        >
          <RefreshCw className="h-4 w-4 transition-transform duration-500 group-hover/btn:rotate-180" />
          Actualizar
        </button>
        {message && <div className="text-[10px] text-amber-200/90 text-center uppercase font-bold max-w-[14rem] leading-tight">{message}</div>}
      </div>
    </Card>
  );
};
