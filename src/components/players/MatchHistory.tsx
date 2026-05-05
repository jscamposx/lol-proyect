import { ChevronDown, ListPlus } from "lucide-react";
import { useState } from "react";
import type { DashboardMatch } from "../../types/dashboard";
import type { RiotRegion } from "../../types/user";
import { MatchCard } from "./MatchCard";
import { useDdragonData } from "../../hooks/useDdragonData";

export const MatchHistory = ({
  matches,
  region,
  currentRiotId,
  knownRiotIds,
}: {
  matches: DashboardMatch[];
  region: RiotRegion;
  currentRiotId: string;
  knownRiotIds: string[];
}) => {
  const ddragon = useDdragonData();
  const [visibleCount, setVisibleCount] = useState(5);

  if (matches.length === 0) {
    return <div className="text-slate-500 text-center py-10 font-medium panel-muted">No hay partidas recientes analizadas.</div>;
  }

  const visibleMatches = matches.slice(0, visibleCount);
  const grouped = visibleMatches.reduce((acc, match) => {
    if (!acc[match.dateLabel]) acc[match.dateLabel] = [];
    acc[match.dateLabel].push(match);
    return acc;
  }, {} as Record<string, DashboardMatch[]>);

  return (
    <div className="flex flex-col gap-7 w-full">
      {Object.entries(grouped).map(([date, dayMatches]) => {
        const dayWins = dayMatches.filter((match) => !match.isRemake && match.win).length;
        const dayLosses = dayMatches.filter((match) => !match.isRemake && !match.win).length;

        return (
          <div key={date}>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10"></div>
              <div className="flex items-center gap-2 px-1 text-xs uppercase font-bold">
                <span className="text-slate-500">{date}</span>
                <span className="rounded-md border border-emerald-300/20 bg-emerald-300/10 px-2 py-0.5 text-emerald-200">{dayWins}W</span>
                <span className="rounded-md border border-rose-300/20 bg-rose-300/10 px-2 py-0.5 text-rose-200">{dayLosses}L</span>
              </div>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>
            <div className="flex flex-col gap-2.5">
              {dayMatches.map((match) => (
                <MatchCard
                  key={match.matchId}
                  match={match}
                  ddragon={ddragon}
                  region={region}
                  currentRiotId={currentRiotId}
                  knownRiotIds={knownRiotIds}
                />
              ))}
            </div>
          </div>
        );
      })}
      {matches.length > visibleCount && (
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-2">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => Math.min(prev + 5, matches.length))}
            className="inline-flex w-full items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-white/10 bg-white/[0.06] text-slate-200 text-xs uppercase font-semibold hover:bg-white/10 transition sm:w-auto sm:py-2"
          >
            <ChevronDown className="h-4 w-4" />
            Cargar más
          </button>
          <button
            type="button"
            onClick={() => setVisibleCount(matches.length)}
            className="inline-flex w-full items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-white/10 bg-transparent text-slate-500 text-xs uppercase font-semibold hover:text-slate-300 hover:bg-white/[0.04] transition sm:w-auto sm:py-2"
          >
            <ListPlus className="h-4 w-4" />
            Mostrar todo
          </button>
        </div>
      )}
    </div>
  );
};
