import { ListChecks } from "lucide-react";
import { useMatchParticipantRanks } from "../../hooks/useMatchParticipantRanks";
import { useRiotPlayer } from "../../hooks/useRiotPlayer";
import type { UserConfig } from "../../types/user";
import { Badge, EmptyState, ErrorState, LoadingState } from "../ui";
import { PlayerHeader } from "../players/PlayerHeader";
import { RankedCard } from "../players/RankedCard";
import { StatsOverview } from "../players/StatsOverview";
import { MatchHistory } from "../players/MatchHistory";
import usersData from "../../data/users.json";

export default function MatchesSection({ user }: { user: UserConfig }) {
  const { data, loading, error, lastUpdated, refresh, refreshMessage } = useRiotPlayer(user);
  const participantRanks = useMatchParticipantRanks(data?.matchHistory ?? [], user.region);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refresh} />;
  if (!data) return <EmptyState message="No hay datos de este jugador." />;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <PlayerHeader player={data} onRefresh={refresh} lastUpdated={lastUpdated} message={refreshMessage} />

      <div className="grid grid-cols-1 gap-4">
        <RankedCard
          ranked={data.rankedQueues.RANKED_SOLO_5x5 || null}
          queueLabel="Ranked Solo/Duo"
        />
      </div>

      <StatsOverview
        stats={data.recentStats}
        championPool={data.championPool}
        matches={data.matchHistory}
        averageEnemyRank={participantRanks.averageEnemyRank}
      />

      <section className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <Badge variant="blue">
              <ListChecks className="h-3.5 w-3.5" />
              Partidas
            </Badge>
            <h2 className="mt-3 text-2xl md:text-3xl font-black text-white uppercase">
              Historial de partidas
            </h2>
          </div>
        </div>

        <MatchHistory
          matches={data.matchHistory}
          region={user.region}
          currentRiotId={`${user.gameName}#${user.tagLine}`}
          knownRiotIds={(usersData as UserConfig[]).map((u) => `${u.gameName}#${u.tagLine}`)}
          rankByPuuid={participantRanks.rankByPuuid}
        />
      </section>
    </div>
  );
}
