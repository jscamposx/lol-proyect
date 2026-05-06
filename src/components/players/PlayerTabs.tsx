import type { RiotProfileSummary } from "../../hooks/useRiotProfiles";
import { getProfileIconUrl } from "../../services/riotTransformers";
import type { UserConfig } from "../../types/user";

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
  const mobileColumns = users.length <= 1 ? "grid-cols-1" : users.length === 2 ? "grid-cols-2" : "grid-cols-3";
  const tabletColumns =
    users.length <= 1 ? "md:grid-cols-1" :
    users.length === 2 ? "md:grid-cols-2" :
    users.length === 3 ? "md:grid-cols-3" :
    users.length === 4 ? "md:grid-cols-4" :
    "md:grid-cols-5";

  return (
    <div className="max-w-full p-0 xl:w-auto">
      <div className={`grid w-full ${mobileColumns} ${tabletColumns} gap-2 xl:flex xl:min-w-0 xl:flex-col xl:items-center xl:gap-4`}>
        {users.map((u) => {
          const isActive = activeId === u.id;
          const avatarUrl = getProfileIconUrl(profiles?.[u.id]?.profileIconId) || u.avatar || "/avatars/default.png";

          return (
            <button
              key={u.id}
              type="button"
              onClick={() => onChange(u.id)}
              className={`group relative flex h-[4.75rem] min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-lg border px-1.5 py-2 text-center font-bold transition duration-200 ease-out active:scale-[0.98] xl:h-14 xl:w-14 xl:overflow-visible xl:rounded-full xl:border-transparent xl:bg-transparent xl:p-0 xl:hover:translate-x-1 xl:active:scale-100 ${
                isActive
                  ? "border-cyan-200/40 bg-cyan-300/[0.11] text-white shadow-[0_16px_36px_-26px_rgba(34,211,238,0.95)]"
                  : "border-white/10 bg-white/[0.035] text-slate-400 hover:border-white/18 hover:bg-white/[0.07] hover:text-white"
              }`}
              aria-current={isActive ? "true" : undefined}
              aria-label={`Cambiar a ${u.displayName}`}
            >
              <span className="relative shrink-0">
                <img
                  src={avatarUrl}
                  alt=""
                  className={`h-10 w-10 rounded-full border object-cover bg-black/30 transition-all duration-200 xl:h-[52px] xl:w-[52px] ${
                    isActive
                      ? "border-cyan-100/80 opacity-100 shadow-[0_12px_32px_-20px_rgba(125,211,252,0.95)]"
                      : "border-white/15 opacity-65 group-hover:border-white/40 group-hover:opacity-100"
                  }`}
                  onError={(event) => { (event.currentTarget as HTMLImageElement).src = "/avatars/default.png"; }}
                />
                <span className={`absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border border-[#080510] transition-all duration-200 xl:right-0 xl:top-0 xl:h-3 xl:w-3 ${
                  isActive ? "scale-100 bg-emerald-300 opacity-100" : "scale-75 bg-slate-500 opacity-0 group-hover:opacity-70"
                }`}></span>
              </span>

              <span className="max-w-full truncate text-[11px] leading-tight xl:pointer-events-none xl:absolute xl:left-[4.45rem] xl:top-1/2 xl:max-w-none xl:-translate-y-1/2 xl:-translate-x-1 xl:rounded-full xl:border xl:border-white/10 xl:bg-[#07030e]/80 xl:px-3 xl:py-1.5 xl:text-xs xl:font-semibold xl:text-slate-50 xl:opacity-0 xl:shadow-[0_16px_36px_-18px_rgba(0,0,0,0.95)] xl:backdrop-blur-md xl:[text-shadow:_0_2px_12px_rgb(0_0_0_/_0.9)] xl:transition-all xl:duration-200 xl:group-hover:translate-x-0.5 xl:group-hover:opacity-100">
                {u.displayName}
              </span>
              <span className={`max-w-full truncate text-[9px] leading-none xl:hidden ${
                isActive ? "text-cyan-100/85" : "text-slate-500"
              }`}>
                #{u.tagLine}
              </span>
              <span className={`pointer-events-none absolute inset-x-2 bottom-1 h-0.5 rounded-full transition-opacity xl:hidden ${
                isActive ? "bg-cyan-200 opacity-100" : "bg-transparent opacity-0"
              }`}></span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
