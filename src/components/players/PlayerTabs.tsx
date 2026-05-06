import type { RiotProfileSummary } from "../../hooks/useRiotProfiles";
import { getProfileIconUrl } from "../../services/riotTransformers";
import type { UserConfig } from "../../types/user";

type PlayerTabsPlacement = "side" | "bottom";

export const PlayerTabs = ({
  users,
  activeId,
  onChange,
  profiles,
  placement,
}: {
  users: UserConfig[];
  activeId: string;
  onChange: (id: string) => void;
  profiles?: Record<string, RiotProfileSummary>;
  placement: PlayerTabsPlacement;
}) => {
  const isSide = placement === "side";
  const layoutClass = isSide
    ? "flex flex-col items-center gap-4"
    : "flex items-center justify-center gap-2 sm:gap-3";
  const buttonSizeClass = isSide
    ? "h-14 w-14 hover:translate-x-1"
    : "h-12 w-12 sm:h-14 sm:w-14";
  const avatarSizeClass = isSide
    ? "h-[52px] w-[52px]"
    : "h-11 w-11 sm:h-[52px] sm:w-[52px]";
  const tooltipClass = "left-[4.55rem] top-1/2 -translate-y-1/2 -translate-x-1 group-hover:translate-x-0 group-focus-visible:translate-x-0";
  const tooltipArrowClass = "-left-1 top-1/2 -translate-y-1/2 border-b border-l";

  return (
    <div className={isSide ? "max-w-full p-0 xl:w-auto" : "w-auto"}>
      <div className={layoutClass}>
        {users.map((u) => {
          const isActive = activeId === u.id;
          const avatarUrl = getProfileIconUrl(profiles?.[u.id]?.profileIconId) || u.avatar || "/avatars/default.png";

          return (
            <button
              key={u.id}
              type="button"
              onClick={() => onChange(u.id)}
              className={`group relative flex shrink-0 items-center justify-center rounded-full border text-center font-bold transition duration-200 ease-out active:scale-[0.96] ${buttonSizeClass} ${
                isActive
                  ? "border-cyan-200/40 bg-cyan-300/[0.11] text-white shadow-[0_16px_36px_-26px_rgba(34,211,238,0.95)]"
                  : "border-white/10 bg-white/[0.035] text-slate-400 hover:border-white/18 hover:bg-white/[0.07] hover:text-white"
              }`}
              aria-current={isActive ? "true" : undefined}
              aria-label={`Cambiar a ${u.displayName}`}
            >
              <img
                src={avatarUrl}
                alt=""
                className={`rounded-full border object-cover bg-black/30 transition-all duration-200 ${avatarSizeClass} ${
                  isActive
                    ? "border-cyan-100/80 opacity-100 shadow-[0_12px_32px_-20px_rgba(125,211,252,0.95)]"
                    : "border-white/15 opacity-65 group-hover:border-white/40 group-hover:opacity-100 group-focus-visible:border-white/40 group-focus-visible:opacity-100"
                }`}
                onError={(event) => { (event.currentTarget as HTMLImageElement).src = "/avatars/default.png"; }}
              />
              <span className={`absolute right-0 top-0 h-3 w-3 rounded-full border border-[#080510] transition-all duration-200 ${
                isActive ? "scale-100 bg-emerald-300 opacity-100" : "scale-75 bg-slate-500 opacity-0 group-hover:opacity-70 group-focus-visible:opacity-70"
              }`}></span>

              {isSide && (
                <span
                  className={`pointer-events-none absolute z-20 flex min-w-[5.5rem] flex-col items-center rounded-lg border px-3 py-2 opacity-0 shadow-[0_18px_42px_-30px_rgba(0,0,0,0.95)] backdrop-blur-xl transition-all duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 ${tooltipClass} ${
                    isActive
                      ? "border-cyan-200/20 bg-[#081522]/96"
                      : "border-white/10 bg-[#090511]/94"
                  }`}
                >
                  <span className="max-w-[8.5rem] truncate text-[11px] font-black leading-none text-white">
                    {u.displayName}
                  </span>
                  <span className={`mt-1 text-[9px] font-bold leading-none ${
                    isActive ? "text-cyan-100/80" : "text-slate-400"
                  }`}>
                    #{u.tagLine}
                  </span>
                  <span className={`absolute h-2 w-2 rotate-45 ${tooltipArrowClass} ${
                    isActive
                      ? "border-cyan-200/20 bg-[#081522]"
                      : "border-white/10 bg-[#090511]"
                  }`}></span>
                </span>
              )}

              <span className={`pointer-events-none absolute rounded-full transition-opacity ${
                isSide
                  ? "inset-y-2 -left-2 w-1"
                  : "inset-x-2 -bottom-1 h-0.5"
              } ${isActive ? "bg-cyan-200 opacity-100" : "bg-transparent opacity-0"}`}></span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
