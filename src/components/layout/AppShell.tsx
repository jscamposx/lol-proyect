import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { tabs } from "./navTabs";

export default function AppShell({ children, currentTab, setTab }: { children: ReactNode, currentTab: string, setTab: (tab: string) => void }) {
  const activeTab = tabs.find((tab) => tab.id === currentTab) ?? tabs[0];
  const ActiveIcon = activeTab.Icon;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && !menuRef.current?.contains(target)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const selectNavTab = (tab: string) => {
    setTab(tab);
    setMenuOpen(false);
  };

  return (
    <div className="app-root">
      <div className="app-grid"></div>
      <div className="app-rift"></div>
      <div className="app-vignette"></div>

      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4 md:px-6 md:pt-4 xl:px-8">
        <div className="max-w-7xl mx-auto glass-nav flex items-center justify-between gap-3 px-2.5 py-2 sm:px-3 sm:py-2.5 lg:gap-4">
          <button
            type="button"
            onClick={() => selectNavTab("home")}
            className="min-w-0 flex flex-1 items-center gap-2 rounded-lg px-1.5 py-1.5 text-left transition hover:bg-white/[0.06] sm:gap-3 sm:px-2"
            aria-label="Ir al inicio"
          >
            <img src="/favicon.svg" alt="" className="h-8 w-8 shrink-0" />
            <div className="min-w-0 leading-tight">
              <div className="truncate text-xs font-black text-white uppercase sm:text-sm">Pequeño César</div>
              <div className="truncate text-[11px] text-violet-200/70">{activeTab.label}</div>
            </div>
          </button>

          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex min-h-11 w-[9.75rem] items-center justify-between gap-2 rounded-lg border border-violet-300/20 bg-violet-500/15 px-3 py-2 text-left text-xs font-bold text-white shadow-[0_14px_34px_-26px_rgba(167,139,250,0.95)] transition hover:border-violet-200/35 hover:bg-violet-500/20 sm:w-48 sm:text-sm"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <span className="flex min-w-0 items-center gap-2">
                <ActiveIcon className="h-4 w-4 shrink-0" strokeWidth={2.35} />
                <span className="truncate">{activeTab.label}</span>
              </span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-violet-100 transition-transform ${menuOpen ? "rotate-180" : ""}`} strokeWidth={2.4} />
            </button>

            {menuOpen && (
              <nav
                className="absolute right-0 top-[calc(100%+0.55rem)] z-50 w-56 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-lg border border-white/10 bg-[#090511]/96 p-1.5 shadow-[0_24px_70px_-34px_rgba(0,0,0,0.95)] backdrop-blur-xl"
                aria-label="Navegación principal"
                role="menu"
              >
                {tabs.map(({ id, label, Icon }) => {
                  const isActive = currentTab === id;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => selectNavTab(id)}
                      className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm font-bold transition ${
                        isActive
                          ? "border-violet-300/25 bg-violet-500/20 text-white"
                          : "border-transparent text-slate-400 hover:bg-white/[0.06] hover:text-white"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                      role="menuitem"
                    >
                      <Icon className="h-4 w-4 shrink-0" strokeWidth={2.25} />
                      <span className="min-w-0 flex-1 truncate">{label}</span>
                    </button>
                  );
                })}
              </nav>
            )}
          </div>
        </div>
      </header>

      <main className={`relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 xl:px-8 pt-4 sm:pt-6 md:pt-7 xl:pt-8 ${currentTab === "matches" ? "matches-safe-bottom" : "mobile-safe-bottom"}`}>
        {children}
      </main>
    </div>
  );
}
