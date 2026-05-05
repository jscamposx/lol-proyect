import type { ChampionSummary, PlayerRecentStats } from "../../types/dashboard";
import { Badge, Card } from "../ui";
import { getChampionIconUrl } from "../../services/riotTransformers";

export const RecentGamesCard = ({ stats, championPool }: { stats: PlayerRecentStats, championPool: ChampionSummary[] }) => {
  return (
    <Card className="p-6 h-full relative z-0 shrink-0 flex flex-col justify-center gap-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-slate-400 uppercase">{stats.totalGames} partidas recientes</h3>
        <Badge variant={stats.winrate >= 50 ? "green" : "red"}>{stats.winrate}% WR</Badge>
      </div>

      <div className="grid grid-cols-3 gap-3 rounded-lg border border-white/10 overflow-hidden">
        <div className="text-center bg-black/20 p-3">
          <div className="text-2xl font-black text-white">{stats.wins} <span className="text-slate-600 font-normal">/</span> {stats.losses}</div>
          <div className="text-[10px] text-slate-500 uppercase mt-1">W / L</div>
        </div>
        <div className="text-center bg-black/20 p-3 border-x border-white/10">
          <div className="text-2xl font-black text-violet-200">{stats.averageKda.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500 uppercase mt-1">KDA</div>
        </div>
        <div className="text-center bg-black/20 p-3">
          <div className="text-2xl font-black text-cyan-200">{stats.averageCsPerMin.toFixed(1)}</div>
          <div className="text-[10px] text-slate-500 uppercase mt-1">CS / MIN</div>
        </div>
      </div>

      {championPool.length > 0 && (
        <div className="pt-4 border-t border-white/10">
          <h4 className="text-xs text-slate-500 uppercase font-semibold mb-3">Top campeones recientes</h4>
          <div className="divide-y divide-white/10">
            {championPool.slice(0, 3).map((champ) => (
              <div key={champ.championName} className="flex items-center gap-3 py-3">
                <img
                  src={getChampionIconUrl(champ.championName)}
                  alt={champ.championName}
                  className="w-10 h-10 rounded-lg shadow border border-white/10"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-slate-200 truncate">{champ.championName}</div>
                  <div className="text-xs text-slate-500">{champ.winrate}% WR ({champ.wins}W {champ.losses}L)</div>
                </div>
                <div className="text-sm font-semibold text-slate-400 shrink-0">{champ.kda.toFixed(2)} KDA</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
