import type { PlayerRankedSummary } from "../../types/dashboard";
import { getTierDisplayName, getTierIconUrl, isApexTier, TIER_ICON_FALLBACK_SRC } from "../../services/rankedVisuals";
import { Card } from "../ui";

type RankedCardProps = {
  ranked: PlayerRankedSummary | null;
  queueLabel: string;
};

export const RankedCard = ({ ranked, queueLabel }: RankedCardProps) => {
  if (!ranked) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 h-full text-center">
        <div className="w-24 h-24 rounded-lg bg-black/35 flex items-center justify-center mb-4 border border-white/10 shadow-inner">
          <span className="text-slate-500 text-2xl font-bold">?</span>
        </div>
        <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase">{queueLabel}</h3>
        <p className="text-sm font-bold text-slate-400">Sin rank disponible</p>
      </Card>
    );
  }

  const tierIconUrl = getTierIconUrl(ranked.tier);
  const displayRank = `${getTierDisplayName(ranked.tier)}${isApexTier(ranked.tier) ? "" : ` ${ranked.rank}`}`;

  return (
    <Card className="p-6 flex flex-col items-center h-full relative overflow-hidden group">
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-violet-300/70 to-cyan-200/70"></div>
      <h3 className="text-xs font-bold text-slate-500 mb-4 z-10 uppercase">{ranked.queue}</h3>

      <div className="w-44 h-44 mb-4 z-10 overflow-visible">
        <img
          src={tierIconUrl}
          alt={ranked.tier}
          className="w-full h-full scale-125 object-contain filter drop-shadow-[0_0_20px_rgba(255,255,255,0.18)] transition-transform duration-500 group-hover:scale-[1.35]"
          onError={(event) => {
            event.currentTarget.src = TIER_ICON_FALLBACK_SRC;
            event.currentTarget.className = "w-full h-full bg-white/[0.06] rounded-lg";
          }}
        />
      </div>

      <div className="text-center z-10 w-full">
        <h2 className="text-2xl font-black text-white uppercase mb-1">{displayRank}</h2>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-violet-200 font-bold">{ranked.lp} LP</span>
        </div>
      </div>
    </Card>
  );
};
