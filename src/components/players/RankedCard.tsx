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
      <Card className="flex h-full flex-col items-center justify-center p-5 text-center sm:p-8">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-lg border border-white/10 bg-black/35 shadow-inner sm:h-24 sm:w-24">
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
    <Card className="group relative flex h-full flex-col items-center overflow-hidden p-4 sm:p-6">
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-violet-300/70 to-cyan-200/70"></div>
      <h3 className="z-10 mb-3 text-xs font-bold uppercase text-slate-500 sm:mb-4">{ranked.queue}</h3>

      <div className="z-10 mb-3 h-32 w-32 overflow-visible sm:mb-4 sm:h-44 sm:w-44">
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
        <h2 className="mb-1 text-xl font-black uppercase text-white sm:text-2xl">{displayRank}</h2>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-violet-200 font-bold">{ranked.lp} LP</span>
        </div>
      </div>
    </Card>
  );
};
