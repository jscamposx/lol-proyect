import { Home, ScrollText, Swords, Trophy, UsersRound } from "lucide-react";
import type { ComponentType } from "react";

export type NavTab = {
  id: string;
  label: string;
  Icon: ComponentType<{ className?: string; strokeWidth?: number }>;
};

export const tabs: NavTab[] = [
  { id: "home", label: "Inicio", Icon: Home },
  { id: "participants", label: "Jugadores", Icon: UsersRound },
  { id: "matches", label: "Partidas", Icon: Swords },
  { id: "ranking", label: "Ranking", Icon: Trophy },
  { id: "rules", label: "Reglas", Icon: ScrollText },
];
