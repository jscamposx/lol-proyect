import { ScrollText, Swords, Trophy } from "lucide-react";
import { Badge, Button } from "../ui";
import usersData from "../../data/users.json";

const heroImage = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Malzahar_0.jpg";

export default function HomeSection({ setTab }: { setTab: (t: string) => void }) {
  return (
    <div className="flex flex-col gap-5 sm:gap-8 animate-in slide-in-from-bottom-4 duration-700">
      <section className="hero-arena relative min-h-[calc(100dvh-10rem)] sm:min-h-[620px] md:min-h-[68vh] overflow-hidden flex items-end">
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-55 saturate-[0.78] contrast-110"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#090511] via-[#090511]/88 to-[#090511]/25"></div>
        <div className="absolute inset-0 bg-linear-to-t from-[#090511] via-transparent to-[#090511]/30"></div>
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-violet-200/50 to-transparent"></div>

        <div className="relative z-10 w-full p-4 sm:p-6 md:p-10 lg:p-14">
          <div className="max-w-3xl text-left">
            <Badge variant="gold">
              <Trophy className="h-3.5 w-3.5" />
              Temporada 2026
            </Badge>
            <h1 className="mt-5 text-4xl sm:text-5xl md:text-7xl font-black text-white uppercase leading-[0.98] text-balance">
              El Reto del Pequeño César
            </h1>
            <p className="mt-4 sm:mt-5 max-w-2xl text-sm sm:text-base md:text-lg text-slate-200/80 leading-relaxed font-medium">
              Quien más ELO suba se lleva una pizza de Pequeño César. El ranking y el historial de partidas quedan como prueba del reto.
            </p>

            <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button onClick={() => setTab("ranking")} className="px-5 py-3.5 bg-linear-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 w-full sm:w-auto sm:px-6">
                <Trophy className="h-5 w-5" />
                Ranking
              </Button>
              <Button onClick={() => setTab("matches")} className="px-5 py-3.5 bg-white/[0.08] hover:bg-white/[0.13] border border-white/10 text-white w-full sm:w-auto sm:px-6">
                <Swords className="h-5 w-5" />
                Historial de partidas
              </Button>
            </div>
          </div>

          <div className="hidden lg:grid absolute right-8 bottom-8 w-[360px] grid-cols-3 overflow-hidden rounded-lg border border-white/10 bg-black/35 backdrop-blur-xl">
            <div className="p-4 border-r border-white/10">
              <div className="text-2xl font-black text-white">{usersData.length}</div>
              <div className="text-[11px] text-slate-400 uppercase">Cuentas</div>
            </div>
            <div className="p-4 border-r border-white/10">
              <div className="text-2xl font-black text-cyan-200">LAN</div>
              <div className="text-[11px] text-slate-400 uppercase">Región</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-black text-amber-200">SoloQ</div>
              <div className="text-[11px] text-slate-400 uppercase">Modo</div>
            </div>
          </div>
        </div>
      </section>

      <div className="panel-muted p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <ScrollText className="h-5 w-5 text-amber-200" />
          <p className="text-sm text-slate-300">
            Consulta las reglas para conocer cómo se mide la subida de ELO, qué partidas cuentan y cómo se valida el reto.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setTab("rules")}
          className="text-sm font-bold text-violet-200 hover:text-white transition text-left md:text-right"
        >
          Ver reglas
        </button>
      </div>
    </div>
  );
}
