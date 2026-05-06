export const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`panel-surface ${className}`}>
    {children}
  </div>
);

export const Badge = ({ children, variant = 'gray' }: { children: React.ReactNode; variant?: 'gray'|'green'|'red'|'yellow'|'blue'|'purple'|'cyan'|'gold' }) => {
  const v = {
    gray: 'bg-white/[0.06] text-slate-300 border-white/10',
    green: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/25',
    red: 'bg-rose-500/10 text-rose-300 border-rose-400/25',
    yellow: 'bg-amber-500/10 text-amber-300 border-amber-400/25',
    blue: 'bg-violet-500/15 text-violet-200 border-violet-300/25',
    purple: 'bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-300/25',
    cyan: 'bg-cyan-500/10 text-cyan-200 border-cyan-300/25',
    gold: 'bg-amber-300/15 text-amber-200 border-amber-200/25'
  }[variant];

  return <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold border backdrop-blur-sm ${v}`}>{children}</span>;
};

export const Button = ({ children, onClick, disabled = false, className = '' }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold py-2.5 px-5 rounded-lg transition-all shadow-lg hover:shadow-violet-600/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 ${className}`}
  >
    {children}
  </button>
);

const SkeletonBlock = ({ className = '' }: { className?: string }) => (
  <div className={`skeleton-shimmer rounded-lg ${className}`} />
);

const SkeletonLine = ({ className = '' }: { className?: string }) => (
  <SkeletonBlock className={`h-3 ${className}`} />
);

const SkeletonMatchCard = ({ index }: { index: number }) => {
  const isWinTone = index % 2 === 0;

  return (
    <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] p-3 sm:p-4 min-[980px]:p-3 xl:p-4">
      <div className={`absolute inset-y-0 left-0 w-1 ${isWinTone ? "bg-emerald-300/35" : "bg-rose-300/35"}`}></div>
      <div className="grid grid-cols-1 gap-3 sm:gap-4 min-[980px]:grid-cols-[7rem_minmax(12rem,15rem)_7.5rem_minmax(9rem,11rem)_2.25rem_minmax(12rem,1fr)] min-[980px]:items-center min-[980px]:gap-3 xl:grid-cols-[8rem_minmax(14rem,17rem)_8rem_minmax(10rem,12rem)_2.5rem_minmax(13rem,1fr)] xl:gap-4">
        <div className="flex min-w-0 items-center justify-between gap-2 min-[980px]:flex-col min-[980px]:items-start">
          <div className="min-w-0 space-y-2">
            <SkeletonLine className="h-4 w-28" />
            <SkeletonLine className="h-3 w-20" />
          </div>
          <div className="flex shrink-0 items-center gap-2 min-[980px]:flex-col min-[980px]:items-start">
            <SkeletonBlock className="h-7 w-20 rounded-md" />
            <SkeletonLine className="h-3 w-24" />
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <SkeletonBlock className="h-14 w-14 shrink-0 sm:h-16 sm:w-16" />
          <div className="min-w-0 space-y-2">
            <SkeletonBlock className="h-7 w-18 rounded-md" />
            <div className="flex gap-1.5">
              {Array.from({ length: 4 }).map((_, itemIndex) => (
                <SkeletonBlock key={itemIndex} className="h-6 w-6 rounded-md" />
              ))}
            </div>
          </div>
        </div>

        <div className="flex min-w-0 items-center justify-between gap-2 min-[980px]:flex-col min-[980px]:items-start">
          <div className="space-y-2">
            <SkeletonLine className="h-5 w-24" />
            <SkeletonLine className="h-3 w-16" />
          </div>
          <SkeletonBlock className="h-7 w-24 rounded-md" />
        </div>

        <div className="grid w-full max-w-[20rem] grid-cols-6 gap-1.5 min-[980px]:max-w-none">
          {Array.from({ length: 6 }).map((_, itemIndex) => (
            <SkeletonBlock key={itemIndex} className="aspect-square rounded-md" />
          ))}
        </div>

        <div className="flex items-center justify-start min-[980px]:justify-center">
          <SkeletonBlock className="h-8 w-8 rounded-md" />
        </div>

        <div className="grid grid-cols-1 gap-2 overflow-hidden rounded-lg border border-white/10 bg-black/20 p-2 sm:grid-cols-2 sm:gap-3 min-[980px]:border-0 min-[980px]:bg-transparent min-[980px]:p-0">
          {Array.from({ length: 2 }).map((_, teamIndex) => (
            <div key={teamIndex} className="flex min-w-0 flex-col gap-1.5">
              {Array.from({ length: 5 }).map((__, lineIndex) => (
                <div key={lineIndex} className="flex min-w-0 items-center gap-1.5">
                  <SkeletonBlock className="h-4 w-4 shrink-0 rounded-sm" />
                  <SkeletonLine className={lineIndex % 2 === 0 ? "w-24" : "w-20"} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const LoadingState = () => (
  <div className="flex w-full flex-col gap-5 py-1 sm:gap-6" aria-label="Cargando datos del jugador">
    <div className="panel-surface relative overflow-hidden p-4 sm:p-5 md:p-6 xl:p-7">
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-violet-300/45 via-cyan-200/35 to-amber-200/45"></div>
      <div className="absolute inset-0 bg-linear-to-br from-violet-500/[0.08] via-transparent to-cyan-500/[0.08] pointer-events-none"></div>

      <div className="relative flex flex-col items-center gap-5 md:flex-row md:items-stretch sm:gap-6">
        <div className="relative flex shrink-0 items-center">
          <SkeletonBlock className="absolute inset-0 translate-x-2 translate-y-2 opacity-45" />
          <SkeletonBlock className="relative z-10 h-24 w-24 border border-white/10 sm:h-28 sm:w-28 md:h-32 md:w-32" />
          <SkeletonBlock className="absolute -bottom-3 -right-3 z-20 h-8 w-18 rounded-md border border-white/10" />
        </div>

        <div className="z-10 min-w-0 flex-1 space-y-4 text-center md:text-left">
          <div className="flex flex-wrap justify-center gap-2 md:justify-start">
            <SkeletonBlock className="h-7 w-24 rounded-md" />
            <SkeletonBlock className="h-7 w-32 rounded-md" />
          </div>
          <div className="space-y-2">
            <SkeletonLine className="mx-auto h-9 w-56 md:mx-0 sm:h-11 sm:w-72" />
            <SkeletonLine className="mx-auto h-6 w-28 md:mx-0 sm:w-36" />
          </div>
          <div className="flex justify-center md:justify-start">
            <SkeletonLine className="h-4 w-44" />
          </div>
        </div>

        <div className="z-10 flex w-full flex-col justify-center gap-3 md:w-auto">
          <SkeletonBlock className="h-12 w-full border border-white/10 md:w-36" />
          <SkeletonLine className="mx-auto h-3 w-32" />
        </div>
      </div>
    </div>

    <div className="panel-surface relative overflow-hidden p-4 sm:p-6">
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-violet-300/45 to-cyan-200/45"></div>
      <div className="flex flex-col items-center gap-4 sm:gap-5">
        <SkeletonLine className="h-3 w-32" />
        <SkeletonBlock className="h-32 w-32 sm:h-44 sm:w-44" />
        <SkeletonLine className="h-7 w-36" />
        <SkeletonLine className="h-4 w-20" />
      </div>
    </div>

    <div className="panel-surface relative overflow-hidden p-0">
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-300/45 via-violet-300/40 to-cyan-200/45"></div>
      <div className="grid min-[980px]:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[21rem_minmax(0,1fr)]">
        <div className="relative overflow-hidden border-b border-white/10 p-4 sm:p-6 min-[980px]:border-b-0 min-[980px]:border-r min-[980px]:p-7">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <SkeletonLine className="h-3 w-20" />
                <SkeletonLine className="h-7 w-44 sm:h-8 sm:w-52" />
              </div>
              <SkeletonBlock className="h-7 w-24 rounded-md" />
            </div>
            <div className="flex flex-col items-center gap-5 pt-1">
              <SkeletonBlock className="h-32 w-32 rounded-full sm:h-38 sm:w-38" />
              <div className="w-full space-y-3">
                <div className="flex items-end justify-between gap-4">
                  <div className="space-y-2">
                    <SkeletonLine className="h-3 w-16" />
                    <SkeletonLine className="h-8 w-28" />
                  </div>
                  <SkeletonBlock className="h-8 w-8" />
                </div>
                <SkeletonBlock className="h-2 w-full rounded-full" />
                <div className="border-t border-white/10 pt-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <SkeletonBlock className="h-16 w-16 shrink-0" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <SkeletonLine className="h-3 w-24" />
                      <SkeletonLine className="h-6 w-36" />
                      <SkeletonLine className="h-3 w-full max-w-52" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 min-[980px]:p-7">
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-5 sm:gap-y-6 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="min-w-0 space-y-3">
                <SkeletonBlock className="h-9 w-9" />
                <SkeletonLine className="h-8 w-24 sm:h-9" />
                <SkeletonLine className="h-3 w-28" />
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-white/10 pt-5 sm:mt-7">
            <div className="mb-4 space-y-3">
              <SkeletonBlock className="h-7 w-32 rounded-md" />
              <SkeletonLine className="h-7 w-24" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                  <div className="flex items-center gap-3">
                    <SkeletonBlock className="h-9 w-9 shrink-0" />
                    <SkeletonBlock className="h-13 w-13 shrink-0" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <SkeletonLine className="h-5 w-24" />
                      <SkeletonLine className="h-3 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <SkeletonBlock className="h-7 w-24 rounded-md" />
          <SkeletonLine className="h-8 w-56" />
        </div>
      </div>
      <div className="mb-3 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10"></div>
        <SkeletonBlock className="h-7 w-36 rounded-md" />
        <div className="h-px flex-1 bg-white/10"></div>
      </div>
      {Array.from({ length: 4 }).map((_, index) => (
        <SkeletonMatchCard key={index} index={index} />
      ))}
    </div>
  </div>
);

const RankingCardSkeleton = ({ index }: { index: number }) => {
  const isLeader = index === 0;

  return (
    <div className={`panel-surface relative overflow-hidden p-4 ${isLeader ? "border-amber-200/20 bg-amber-300/[0.035]" : ""}`}>
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-violet-300/45 via-cyan-200/40 to-amber-200/45"></div>
      <div className="flex min-w-0 items-start gap-3">
        <SkeletonBlock className="h-11 w-11 shrink-0" />
        <SkeletonBlock className="h-12 w-12 shrink-0" />
        <div className="min-w-0 flex-1 space-y-2">
          <SkeletonLine className="h-5 w-32" />
          <SkeletonLine className="h-3 w-24" />
        </div>
        <SkeletonBlock className="h-7 w-16 shrink-0 rounded-md" />
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-3">
        <SkeletonBlock className="h-14 w-14 shrink-0" />
        <div className="min-w-0 flex-1 space-y-2">
          <SkeletonLine className="h-5 w-40" />
          <SkeletonLine className="h-3 w-24" />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 min-[420px]:grid-cols-3">
        {Array.from({ length: 5 }).map((_, metricIndex) => (
          <div key={metricIndex} className="rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2.5">
            <SkeletonLine className="h-3 w-14" />
            <SkeletonLine className="mt-2 h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const RankingLoadingState = () => (
  <div className="animate-in fade-in duration-300" aria-label="Cargando ranking">
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 min-[980px]:hidden">
      {Array.from({ length: 4 }).map((_, index) => (
        <RankingCardSkeleton key={index} index={index} />
      ))}
    </div>

    <div className="panel-surface hidden overflow-hidden min-[980px]:block">
      <div className="overflow-x-auto thin-scrollbar">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm xl:min-w-[1050px]">
          <thead>
            <tr className="border-b border-white/10 bg-black/25">
              {Array.from({ length: 8 }).map((_, index) => (
                <th key={index} className="px-3 py-3 xl:px-5 xl:py-4">
                  <SkeletonLine className={`mx-auto h-3 ${index === 1 ? "w-24" : index === 2 ? "w-28" : "w-14"}`} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-white/10 last:border-b-0">
                <td className="px-3 py-3 text-center xl:px-5 xl:py-4">
                  <SkeletonBlock className="mx-auto h-10 w-10" />
                </td>
                <td className="px-3 py-3 xl:px-5 xl:py-4">
                  <div className="flex items-center gap-3">
                    <SkeletonBlock className="h-11 w-11 shrink-0" />
                    <div className="min-w-0 space-y-2">
                      <SkeletonLine className="h-4 w-32" />
                      <SkeletonLine className="h-3 w-20" />
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 xl:px-5 xl:py-4">
                  <div className="flex items-center justify-center gap-3 xl:gap-5">
                    <SkeletonBlock className="h-14 w-14 shrink-0" />
                    <div className="min-w-0 space-y-2 text-left">
                      <SkeletonLine className="h-4 w-36" />
                      <SkeletonLine className="h-3 w-24" />
                    </div>
                  </div>
                </td>
                {Array.from({ length: 5 }).map((_, cellIndex) => (
                  <td key={cellIndex} className="px-3 py-3 xl:px-5 xl:py-4">
                    <SkeletonLine className="mx-auto h-4 w-16" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export const ErrorState = ({ message, onRetry }: { message: string, onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="bg-rose-950/30 text-rose-300 p-5 rounded-lg text-center max-w-md border border-rose-500/25 shadow-xl">
      <p className="mb-4 font-semibold">Ocurrio un error</p>
      <p className="text-sm mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="bg-rose-600 hover:bg-rose-500">
          Reintentar
        </Button>
      )}
    </div>
  </div>
);

export const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-center">
    <p>{message}</p>
  </div>
);
