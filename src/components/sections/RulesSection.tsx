import { KeyRound, ShieldCheck } from "lucide-react";
import { Badge, Card } from "../ui";

const rules = [
  {
    title: "Solo/Duo permitida",
    Icon: ShieldCheck,
    tone: "text-emerald-200 bg-emerald-500/10 border-emerald-300/25",
    body: (
      <>
        El reto se juega en <strong className="text-violet-200">Ranked Solo/Duo</strong>. DuoQ esta permitido dentro de esa cola.
      </>
    ),
  },
  {
    title: "Sin eloboosting",
    Icon: KeyRound,
    tone: "text-rose-200 bg-rose-500/10 border-rose-300/25",
    body: "Queda prohibido el eloboosting, compartir la cuenta o pedir a otra persona que juegue por ti. Cada participante debe subir por su propio rendimiento.",
  },
  {
    title: "Compromiso competitivo",
    Icon: ShieldCheck,
    tone: "text-amber-100 bg-amber-500/10 border-amber-300/25",
    body: "El reto es para tomarse League of Legends en serio: jugar para ganar, respetar cada partida y evitar trolear, rendirse sin motivo o jugar en modo casual.",
  },
];

export default function RulesSection() {
  return (
    <div className="flex flex-col gap-5 sm:gap-6 animate-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="py-2 sm:py-4">
        <Badge variant="purple">Manual del reto</Badge>
        <h2 className="mt-3 text-3xl md:text-4xl xl:text-5xl font-black text-white uppercase">Reglas del reto</h2>
        <p className="text-sm text-slate-400 mt-2 font-medium sm:text-base">Condiciones claras para que el ranking tenga piso firme.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="divide-y divide-white/10">
          {rules.map(({ title, Icon, tone, body }, index) => (
            <div key={title} className="grid grid-cols-1 md:grid-cols-[96px_1fr] gap-4 p-4 sm:p-5 md:p-6 hover:bg-white/[0.03] transition">
              <div className="flex md:flex-col items-center md:items-start gap-3">
                <div className={`h-12 w-12 flex items-center justify-center rounded-lg border ${tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-black text-slate-500 uppercase">0{index + 1}</span>
              </div>
              <div>
                <h4 className="text-lg font-black text-white mb-2">{title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
