import type { RiotProfileSummary } from "../../hooks/useRiotProfiles";
import { getProfileIconUrl } from "../../services/riotTransformers";
import type { UserConfig } from "../../types/user";

const fallbackAvatar = "https://ddragon.leagueoflegends.com/cdn/15.9.1/img/profileicon/29.png";

export const PlayerTabs = ({
  users,
  activeId,
  onChange,
  profiles,
}: {
  users: UserConfig[];
  activeId: string;
  onChange: (id: string) => void;
  profiles?: Record<string, RiotProfileSummary>;
}) => {
  return (
    <div className="max-w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-px-4 thin-scrollbar p-1 md:w-auto md:snap-none md:overflow-visible md:p-0">
      <div className="flex min-w-max gap-2 pr-3 md:min-w-0 md:flex-col md:items-center md:gap-4 md:pr-0">
        {users.map((u) => {
          const isActive = activeId === u.id;
          const avatarUrl = getProfileIconUrl(profiles?.[u.id]?.profileIconId) || u.avatar;

          return (
            <button
              key={u.id}
              type="button"
              onClick={() => onChange(u.id)}
              className={`group relative flex snap-start items-center gap-2 rounded-full border border-white/10 bg-black/20 p-1 pr-3 font-bold whitespace-nowrap transition-transform duration-200 ease-out hover:-translate-y-0.5 md:h-14 md:w-14 md:justify-center md:gap-0 md:border-transparent md:bg-transparent md:p-0 md:pr-0 md:hover:translate-x-1 md:hover:translate-y-0 ${
                isActive
                  ? "text-white"
                  : "text-slate-400 hover:text-white"
              }`}
              aria-current={isActive ? "true" : undefined}
              aria-label={u.displayName}
            >
              <span className="relative shrink-0">
                <img
                  src={avatarUrl}
                  alt=""
                  className={`h-11 w-11 rounded-full border object-cover bg-black/30 transition-all duration-200 md:h-[52px] md:w-[52px] ${
                    isActive
                      ? "border-white/75 opacity-100 shadow-[0_12px_32px_-20px_rgba(255,255,255,0.9)]"
                      : "border-white/15 opacity-65 group-hover:border-white/40 group-hover:opacity-100"
                  }`}
                  onError={(event) => { (event.currentTarget as HTMLImageElement).src = fallbackAvatar; }}
                />
                <span className={`absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border border-[#080510] transition-all duration-200 md:right-0 md:top-0 md:h-3 md:w-3 ${
                  isActive ? "scale-100 bg-emerald-300 opacity-100" : "scale-75 bg-slate-500 opacity-0 group-hover:opacity-70"
                }`}></span>
              </span>

              <span className="text-sm md:pointer-events-none md:absolute md:left-[4.45rem] md:top-1/2 md:-translate-y-1/2 md:-translate-x-1 md:rounded-full md:border md:border-white/10 md:bg-[#07030e]/80 md:px-3 md:py-1.5 md:text-xs md:font-semibold md:text-slate-50 md:opacity-0 md:shadow-[0_16px_36px_-18px_rgba(0,0,0,0.95)] md:backdrop-blur-md md:[text-shadow:_0_2px_12px_rgb(0_0_0_/_0.9)] md:transition-all md:duration-200 md:group-hover:translate-x-0.5 md:group-hover:opacity-100">
                {u.displayName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
