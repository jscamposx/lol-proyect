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

export const LoadingState = () => (
  <div className="flex flex-col gap-6 animate-pulse w-full py-4">
    <div className="panel-surface p-5 md:p-7">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="h-28 w-28 rounded-lg bg-white/[0.07] border border-white/10"></div>
        <div className="flex-1 w-full space-y-3">
          <div className="h-5 w-32 rounded bg-white/[0.07]"></div>
          <div className="h-10 w-full max-w-md rounded bg-white/[0.07]"></div>
          <div className="h-4 w-48 rounded bg-white/[0.06]"></div>
        </div>
        <div className="h-12 w-full md:w-36 rounded-lg bg-white/[0.07] border border-white/10"></div>
      </div>
    </div>

    <div className="panel-surface p-5 md:p-7">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 border border-white/10 rounded-lg overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-24 bg-white/[0.045] border-b md:border-b-0 border-r border-white/10"></div>
        ))}
      </div>
    </div>

    <div className="space-y-3">
      <div className="h-8 w-56 rounded bg-white/[0.06]"></div>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] p-4">
          <div className="absolute inset-y-0 left-0 w-1 bg-violet-300/30"></div>
          <div className="grid grid-cols-1 xl:grid-cols-[9rem_18rem_10rem_12rem_3rem_minmax(13rem,1fr)] gap-4 items-center">
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-white/[0.08]"></div>
              <div className="h-3 w-16 rounded bg-white/[0.06]"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-lg bg-white/[0.08]"></div>
              <div className="space-y-2">
                <div className="h-6 w-24 rounded bg-white/[0.07]"></div>
                <div className="h-6 w-28 rounded bg-white/[0.06]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-5 w-24 rounded bg-white/[0.08]"></div>
              <div className="h-5 w-20 rounded bg-white/[0.06]"></div>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {Array.from({ length: 6 }).map((_, itemIndex) => (
                <div key={itemIndex} className="aspect-square rounded-md bg-white/[0.07]"></div>
              ))}
            </div>
            <div className="h-8 w-8 rounded-md bg-white/[0.07]"></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                {Array.from({ length: 5 }).map((_, lineIndex) => (
                  <div key={lineIndex} className="h-3 rounded bg-white/[0.06]"></div>
                ))}
              </div>
              <div className="space-y-1.5">
                {Array.from({ length: 5 }).map((_, lineIndex) => (
                  <div key={lineIndex} className="h-3 rounded bg-white/[0.045]"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
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
