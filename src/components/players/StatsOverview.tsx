import { Activity, CircleEqual, Clock3, Crosshair, Flame, Layers3, Shield, ShieldAlert, Swords, TrendingDown, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ChampionSummary, DashboardMatch, PlayerRecentStats } from "../../types/dashboard";
import type { AverageEnemyRank } from "../../hooks/useMatchParticipantRanks";
import { Badge, Card } from "../ui";
import { getRankDisplayTitle, getRankPillToneClasses, getShortRankLabel } from "../../services/rankedVisuals";
import { getChampionIconUrl } from "../../services/riotTransformers";
import { formatDuration, getWinrateTone } from "../../utils/formatters";

type StatsOverviewProps = {
  stats: PlayerRecentStats;
  championPool: ChampionSummary[];
  matches: DashboardMatch[];
  averageEnemyRank?: AverageEnemyRank | null;
};

type RecordSignal = {
  Icon: LucideIcon;
  label: string;
  iconClassName: string;
  surfaceClassName: string;
};

function getChampionGames(champ: ChampionSummary) {
  return champ.wins + champ.losses;
}

function getPercent(value: number, total: number, minVisible = 0) {
  if (total <= 0 || value <= 0) return "0%";
  const percent = Math.min(Math.max((value / total) * 100, minVisible), 100);
  return `${percent}%`;
}

function getPoolWinrateTone(winrate: number) {
  if (winrate >= 60) return "text-emerald-300";
  if (winrate >= 50) return "text-cyan-200";
  return "text-rose-300";
}

function getCurrentStreak(matches: DashboardMatch[]) {
  const playedMatches = [...matches]
    .filter((match) => !match.isRemake)
    .sort((a, b) => b.timestamp - a.timestamp);
  const latestMatch = playedMatches[0];

  if (!latestMatch) return { result: "none" as const, count: 0 };

  const result = latestMatch.win ? "win" : "loss";
  let count = 0;

  for (const match of playedMatches) {
    const matchResult = match.win ? "win" : "loss";
    if (matchResult !== result) break;
    count++;
  }

  return { result, count };
}

function getRecordSignal(stats: PlayerRecentStats, matches: DashboardMatch[]): RecordSignal {
  const currentStreak = getCurrentStreak(matches);
  const hasEnoughGames = stats.totalGames >= 6;

  if (currentStreak.result === "win" && currentStreak.count >= 3) {
    return {
      Icon: Flame,
      label: `Racha de ${currentStreak.count} victorias`,
      iconClassName: "text-amber-200",
      surfaceClassName: "border-amber-200/25 bg-amber-300/10 shadow-[0_0_28px_rgba(251,191,36,0.12)]",
    };
  }

  if (currentStreak.result === "loss" && currentStreak.count >= 3) {
    return {
      Icon: currentStreak.count >= 5 ? ShieldAlert : TrendingDown,
      label: `Racha de ${currentStreak.count} derrotas`,
      iconClassName: "text-rose-200",
      surfaceClassName: "border-rose-300/25 bg-rose-400/10 shadow-[0_0_28px_rgba(251,113,133,0.1)]",
    };
  }

  if (stats.totalGames === 0) {
    return {
      Icon: CircleEqual,
      label: "Sin partidas recientes",
      iconClassName: "text-slate-300",
      surfaceClassName: "border-white/10 bg-white/[0.045]",
    };
  }

  if (hasEnoughGames && stats.winrate >= 55) {
    return {
      Icon: Flame,
      label: `${stats.winrate}% de winrate`,
      iconClassName: "text-amber-200",
      surfaceClassName: "border-amber-200/25 bg-amber-300/10 shadow-[0_0_28px_rgba(251,191,36,0.12)]",
    };
  }

  if (stats.winrate >= 50) {
    return {
      Icon: TrendingUp,
      label: `${stats.winrate}% de winrate`,
      iconClassName: "text-emerald-200",
      surfaceClassName: "border-emerald-300/25 bg-emerald-300/10 shadow-[0_0_28px_rgba(52,211,153,0.1)]",
    };
  }

  if (hasEnoughGames && stats.winrate <= 40) {
    return {
      Icon: ShieldAlert,
      label: `${stats.winrate}% de winrate`,
      iconClassName: "text-rose-200",
      surfaceClassName: "border-rose-300/25 bg-rose-400/10 shadow-[0_0_28px_rgba(251,113,133,0.1)]",
    };
  }

  if (stats.winrate <= 47) {
    return {
      Icon: TrendingDown,
      label: `${stats.winrate}% de winrate`,
      iconClassName: "text-rose-200",
      surfaceClassName: "border-rose-300/25 bg-rose-400/10",
    };
  }

  return {
    Icon: CircleEqual,
    label: `${stats.winrate}% de winrate`,
    iconClassName: "text-slate-300",
    surfaceClassName: "border-white/10 bg-white/[0.045]",
  };
};

const formatEnemyRankProgress = (averageEnemyRank?: AverageEnemyRank | null) => {
  if (!averageEnemyRank) return "sin rivales";
  if (averageEnemyRank.loading) return `${averageEnemyRank.resolvedEnemyCount}/${averageEnemyRank.totalEnemyCount} rivales`;
  return `${averageEnemyRank.rankedEnemyCount}/${averageEnemyRank.totalEnemyCount} con rank`;
};

const EnemyRankValue = ({ averageEnemyRank }: { averageEnemyRank?: AverageEnemyRank | null }) => {
  if (averageEnemyRank?.tier) {
    const title = `Promedio rivales: ${getRankDisplayTitle(
      averageEnemyRank.tier,
      averageEnemyRank.rank,
      averageEnemyRank.leaguePoints
    )}`;

    return (
      <span
        className={`inline-flex h-8 items-center justify-center rounded-lg border px-2.5 text-base font-black uppercase leading-none sm:h-9 sm:text-lg ${getRankPillToneClasses(averageEnemyRank.tier)}`}
        title={title}
      >
        {getShortRankLabel(averageEnemyRank.tier, averageEnemyRank.rank)}
      </span>
    );
  }

  return averageEnemyRank?.loading ? "..." : "N/D";
};

export const StatsOverview = ({ stats, championPool, matches, averageEnemyRank }: StatsOverviewProps) => {
  const mostPlayed = championPool[0] ?? null;
  const topPool = championPool.slice(0, 8);
  const winrate = Math.min(Math.max(stats.winrate, 0), 100);
  const winrateAngle = `${winrate * 3.6}deg`;
  const recordTotal = Math.max(stats.wins + stats.losses, 1);
  const winsPercent = `${(stats.wins / recordTotal) * 100}%`;
  const recordSignal = getRecordSignal(stats, matches);
  const RecordIcon = recordSignal.Icon;
  const statItems = [
    { label: "Partidas", value: stats.totalGames, detail: `${stats.wins}W / ${stats.losses}L`, Icon: Swords, tone: "text-white" },
    { label: "KDA prom.", value: stats.averageKda.toFixed(2), detail: "KDA", Icon: Crosshair, tone: "text-violet-200" },
    { label: "CS / min", value: stats.averageCsPerMin.toFixed(1), detail: "farm", Icon: Activity, tone: "text-cyan-200" },
    { label: "Duracion", value: formatDuration(stats.averageDuration), detail: "promedio", Icon: Clock3, tone: "text-slate-100" },
    { label: "Rivales", value: <EnemyRankValue averageEnemyRank={averageEnemyRank} />, detail: formatEnemyRankProgress(averageEnemyRank), Icon: Shield, tone: averageEnemyRank?.loading ? "text-slate-400" : "text-emerald-100" },
  ];

  return (
    <Card className="relative overflow-hidden p-0">
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-300/80 via-violet-300/75 to-cyan-200/80"></div>

      <div className="grid min-[980px]:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[21rem_minmax(0,1fr)]">
        <div className="relative overflow-hidden border-b border-white/10 p-4 sm:p-6 min-[980px]:border-b-0 min-[980px]:border-r min-[980px]:p-7">
          <div className="absolute inset-0 bg-linear-to-br from-emerald-400/[0.08] via-transparent to-cyan-300/[0.07]"></div>
          <div className="relative">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Resumen</p>
                <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">Estadisticas ranked</h2>
              </div>
              <Badge variant={stats.winrate >= 55 ? "green" : stats.winrate >= 48 ? "yellow" : "red"}>
                {stats.totalGames} partidas
              </Badge>
            </div>

            <div className="mt-5 flex flex-col items-center gap-5 sm:mt-6">
              <div className="relative h-32 w-32 shrink-0 rounded-full p-1.5 shadow-[0_0_42px_rgba(34,211,238,0.12)] sm:h-38 sm:w-38">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(rgba(52, 211, 153, 0.92) ${winrateAngle}, rgba(244, 63, 94, 0.72) 0deg)`,
                  }}
                ></div>
                <div className="absolute inset-2 rounded-full border border-white/10 bg-[#0a0612]"></div>
                <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full border border-white/10 bg-white/[0.035]">
                  <div className={`text-3xl font-black sm:text-4xl ${getWinrateTone(stats.winrate)}`}>{stats.winrate}%</div>
                  <div className="mt-1 text-[10px] font-bold uppercase text-slate-500">Winrate</div>
                </div>
              </div>

              <div className="w-full min-w-0 flex-1">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-bold uppercase text-slate-500">Record</div>
                    <div className="mt-1 text-3xl font-black text-white">
                      <span className="text-emerald-300">{stats.wins}</span>
                      <span className="px-1.5 text-slate-600">/</span>
                      <span className="text-rose-300">{stats.losses}</span>
                    </div>
                  </div>
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${recordSignal.surfaceClassName}`}
                    title={recordSignal.label}
                    aria-label={recordSignal.label}
                  >
                    <RecordIcon className={`h-6 w-6 ${recordSignal.iconClassName}`} />
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-rose-300/20">
                  <div className="h-full rounded-full bg-linear-to-r from-emerald-300 to-cyan-200" style={{ width: winsPercent }}></div>
                </div>

                {mostPlayed && <FeaturedChampion champ={mostPlayed} />}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 min-[980px]:p-7">
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-5 sm:gap-y-6 xl:grid-cols-5">
            {statItems.map(({ label, value, detail, Icon, tone }) => (
              <div key={label} className="min-w-0">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.045] text-slate-300">
                  <Icon className="h-4 w-4" />
                </div>
                <div className={`truncate text-xl font-black sm:text-3xl ${tone}`}>{value}</div>
                <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] uppercase sm:text-[11px]">
                  <span className="font-bold text-slate-500">{label}</span>
                  <span className="text-slate-600">{detail}</span>
                </div>
              </div>
            ))}
          </div>

          <ChampionPoolPanel
            topPool={topPool}
          />
        </div>
      </div>
    </Card>
  );
};

type ChampionPoolPanelProps = {
  topPool: ChampionSummary[];
};

const ChampionPoolPanel = ({
  topPool,
}: ChampionPoolPanelProps) => (
  <section className="mt-6 border-t border-white/10 pt-5 sm:mt-7">
    <div className="mb-4 flex items-center justify-between gap-4">
      <div>
        <Badge variant="purple">
          <Layers3 className="h-3.5 w-3.5" />
          Champion pool
        </Badge>
        <h3 className="mt-3 text-xl font-black text-white sm:text-2xl">Picks</h3>
      </div>
    </div>

    {topPool.length === 0 ? (
      <div className="rounded-lg border border-white/10 bg-black/20 py-8 text-center text-sm font-semibold text-slate-500">
        Sin campeones suficientes.
      </div>
    ) : (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {topPool.map((champ, index) => (
          <ChampionPoolCard
            key={champ.championName}
            champ={champ}
            index={index}
          />
        ))}
      </div>
    )}
  </section>
);

const FeaturedChampion = ({ champ }: { champ: ChampionSummary }) => {
  const total = getChampionGames(champ);
  const winsWidth = getPercent(champ.wins, total);

  return (
    <div className="mt-5 border-t border-white/10 pt-4">
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={getChampionIconUrl(champ.championName)}
          alt={champ.championName}
          className="h-16 w-16 shrink-0 rounded-lg border border-white/10 bg-black/30 object-cover shadow-xl shadow-black/30"
        />
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-bold uppercase text-violet-200">Pick principal</div>
          <div className="truncate text-xl font-black text-white">{champ.championName}</div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase">
            <span className="text-emerald-200">{champ.wins}W</span>
            <span className="text-rose-200">{champ.losses}L</span>
            <span className={getPoolWinrateTone(champ.winrate)}>{champ.winrate}% WR</span>
            <span className="text-slate-500">{total} partidas</span>
          </div>
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-rose-300/20">
        <div className="h-full rounded-full bg-linear-to-r from-emerald-300 to-cyan-200" style={{ width: winsWidth }}></div>
      </div>
    </div>
  );
};

const ChampionPoolCard = ({
  champ,
  index,
}: {
  champ: ChampionSummary;
  index: number;
}) => {
  const total = getChampionGames(champ);

  return (
    <article className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] p-3 transition-colors hover:bg-white/[0.06]">
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-violet-300/70 via-cyan-200/65 to-emerald-300/65 opacity-0 transition-opacity group-hover:opacity-100"></div>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/25 text-xs font-black text-slate-300">
          {index + 1}
        </div>
        <img
          src={getChampionIconUrl(champ.championName)}
          alt={champ.championName}
          className="h-13 w-13 shrink-0 rounded-lg border border-white/10 bg-black/30 object-cover shadow-lg"
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-black text-white">{champ.championName}</div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase">
            <span className="text-slate-400">{total} partidas</span>
            <span className="text-emerald-200">{champ.wins}W</span>
            <span className="text-rose-200">{champ.losses}L</span>
            <span className={getPoolWinrateTone(champ.winrate)}>{champ.winrate}% WR</span>
            <span className="text-violet-200">{champ.kda.toFixed(2)} KDA</span>
          </div>
        </div>
      </div>

    </article>
  );
};
