import { Badge, Card } from "../ui";
import usersData from "../../data/users.json";
import type { UserConfig } from "../../types/user";
import { MapPin, Shield, UserRoundCheck } from "lucide-react";
import { useRiotProfiles } from "../../hooks/useRiotProfiles";
import { getProfileIconUrl } from "../../services/riotTransformers";

const typedUsers = usersData as UserConfig[];
const fallbackAvatar = "https://ddragon.leagueoflegends.com/cdn/15.9.1/img/profileicon/29.png";

export default function ParticipantsSection() {
  const profiles = useRiotProfiles(typedUsers);

  return (
    <div className="flex flex-col gap-5 sm:gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 py-2 sm:py-4">
        <div>
          <Badge variant="cyan">
            <UserRoundCheck className="h-3.5 w-3.5" />
            Roster oficial
          </Badge>
          <h2 className="mt-3 text-3xl md:text-5xl font-black text-white uppercase">Participantes</h2>
          <p className="text-sm text-slate-400 mt-2 font-medium sm:text-base">Cuentas fijadas desde la configuración base del reto.</p>
        </div>
        <div className="panel-muted px-4 py-3 flex items-center gap-3 w-full md:w-auto">
          <Shield className="h-5 w-5 text-violet-200" />
          <div>
            <div className="text-sm font-black text-white">{typedUsers.length} jugadores</div>
            <div className="text-xs text-slate-500">Sin alta manual desde UI</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {typedUsers.map((u, index) => {
          const profile = profiles[u.id];
          const avatarUrl = getProfileIconUrl(profile?.profileIconId) || u.avatar;

          return (
            <Card key={u.id} className="p-4 sm:p-5 relative overflow-hidden group">
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-violet-400/70 via-cyan-300/70 to-amber-200/70 opacity-70"></div>
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src={avatarUrl}
                    alt={`Avatar de ${u.displayName}`}
                    className="w-16 h-16 rounded-lg shadow-xl border border-white/10 object-cover bg-black/30 sm:h-20 sm:w-20"
                    onError={(event) => { (event.currentTarget as HTMLImageElement).src = fallbackAvatar; }}
                  />
                  <div className="absolute -bottom-2 -right-2 h-7 min-w-7 px-2 rounded-md bg-[#090511] border border-white/10 flex items-center justify-center text-xs font-black text-violet-100">
                    {index + 1}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-black text-lg text-white truncate sm:text-xl">{u.displayName}</h3>
                  <p className="text-sm text-slate-500 font-medium truncate">
                    {profile?.summonerLevel ? `Nivel ${profile.summonerLevel}` : `#${u.id}`}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="blue">
                      <MapPin className="h-3 w-3" />
                      {u.region.toUpperCase()}
                    </Badge>
                    <Badge variant="gray">{u.routing.toUpperCase()}</Badge>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
