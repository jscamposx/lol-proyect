import type { ReactNode } from "react";
import { tabs } from "./navTabs";

export default function AppShell({ children, currentTab, setTab }: { children: ReactNode, currentTab: string, setTab: (tab: string) => void }) {
  const activeTab = tabs.find((tab) => tab.id === currentTab) ?? tabs[0];
  const mobileLabels: Record<string, string> = {
    participants: "Equipo",
    matches: "Partidas",
    ranking: "Rank",
  };

  return (
    <div className="app-root">
      <div className="app-grid"></div>
      <div className="app-rift"></div>
      <div className="app-vignette"></div>

      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4 md:px-6 md:pt-4 xl:px-8">
        <div className="max-w-7xl mx-auto glass-nav px-2.5 py-2 flex items-center justify-between gap-3 sm:px-3 sm:py-2.5 lg:gap-4">
          <button
            type="button"
            onClick={() => setTab("home")}
            className="min-w-0 flex items-center gap-2 rounded-lg px-1.5 py-1.5 text-left hover:bg-white/[0.06] transition sm:gap-3 sm:px-2"
            aria-label="Ir al inicio"
          >
            <img src="/favicon.svg" alt="" className="h-8 w-8 shrink-0" />
            <div className="min-w-0 leading-tight">
              <div className="truncate text-xs font-black text-white uppercase sm:text-sm">Pequeño César</div>
              <div className="truncate text-[11px] text-violet-200/70">{activeTab.label}</div>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
            {tabs.map(({ id, label, Icon }) => {
              const isActive = currentTab === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-bold transition lg:gap-2 lg:px-3 lg:text-sm ${
                    isActive
                      ? "bg-violet-500/20 text-white border border-violet-300/25"
                      : "text-slate-400 border border-transparent hover:text-white hover:bg-white/[0.06]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.2} />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 xl:px-8 pt-4 sm:pt-6 md:pt-7 xl:pt-8 mobile-safe-bottom">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 px-3 pt-2 md:hidden mobile-nav-safe" aria-label="Navegación principal">
        <div className="glass-nav mx-auto grid max-w-md grid-cols-5 gap-1 p-1.5">
          {tabs.map(({ id, label, Icon }) => {
            const isActive = currentTab === id;
            const navLabel = mobileLabels[id] ?? label;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex min-h-[3.25rem] min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-0.5 py-1.5 text-[9px] font-bold leading-tight transition ${
                  isActive
                    ? "border border-violet-300/25 bg-violet-500/20 text-white shadow-[0_10px_26px_-20px_rgba(167,139,250,0.9)]"
                    : "border border-transparent text-slate-400 hover:bg-white/[0.06] hover:text-white"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" strokeWidth={2.3} />
                <span className="w-full truncate text-center">{navLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
