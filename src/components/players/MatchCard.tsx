import type { DashboardMatch } from "../../types/dashboard";
import type { DdragonMaps } from "../../hooks/useDdragonData";
import type { RiotRegion } from "../../types/user";
import { BadgePlus, Crosshair, Map, Shield, Swords, Target } from "lucide-react";
import { Badge } from "../ui";
import {
  getChampionIconUrl,
  getItemIconUrl,
  getRuneIconUrl,
  getSpellIconUrl,
  getSummonerSpellIconUrl
} from "../../services/riotTransformers";
import { formatDuration, getMatchTone, getOpgProfileUrl } from "../../utils/formatters";

type MatchCardProps = {
  match: DashboardMatch;
  ddragon: DdragonMaps;
  region: RiotRegion;
  currentRiotId: string;
  knownRiotIds: string[];
};

const normalizeRiotId = (value: string) => value.trim().toLowerCase();

const POSITION_META = {
  TOP: { label: "Top", Icon: Shield },
  JUNGLE: { label: "Jungla", Icon: Map },
  MIDDLE: { label: "Mid", Icon: Crosshair },
  MID: { label: "Mid", Icon: Crosshair },
  BOTTOM: { label: "Bot", Icon: Target },
  ADC: { label: "Bot", Icon: Target },
  UTILITY: { label: "Supp", Icon: BadgePlus },
  SUPPORT: { label: "Supp", Icon: BadgePlus },
  NONE: { label: "Rol", Icon: Swords },
} as const;

export const MatchCard = ({ match, ddragon, region, currentRiotId, knownRiotIds }: MatchCardProps) => {
  const isWin = match.win;
  const tone = match.isRemake
    ? {
        border: "border-white/10",
        bg: "bg-white/[0.04]",
        text: "text-slate-400",
      }
    : getMatchTone(isWin);
  const resultLabel = match.isRemake ? "Remake" : isWin ? "Victoria" : "Derrota";
  const currentKey = normalizeRiotId(currentRiotId);
  const knownSet = new Set(knownRiotIds.map(normalizeRiotId));

  const { itemById, spellById, runeById, styleById } = ddragon;

  const durationLabel = formatDuration(match.duration);
  const trinketId = match.items[6];
  const mainRune = match.mainRuneId ? runeById[match.mainRuneId] : undefined;
  const secondaryStyle = match.secondaryStyleId ? styleById[match.secondaryStyleId] : undefined;

  const spellA = spellById[match.spells[0]];
  const spellB = spellById[match.spells[1]];
  const spellAIcon = spellA?.icon ? getSummonerSpellIconUrl(spellA.icon) : getSpellIconUrl(match.spells[0]);
  const spellBIcon = spellB?.icon ? getSummonerSpellIconUrl(spellB.icon) : getSpellIconUrl(match.spells[1]);
  const positionKey = (match.position || "NONE").toUpperCase() as keyof typeof POSITION_META;
  const positionMeta = POSITION_META[positionKey] ?? POSITION_META.NONE;
  const PositionIcon = positionMeta.Icon;

  const renderParticipant = (participant: DashboardMatch["allyTeam"][number], muted = false) => {
    const displayName = participant.riotIdGameName && participant.riotIdTagline
      ? `${participant.riotIdGameName}#${participant.riotIdTagline}`
      : participant.summonerName;
    const opgg = getOpgProfileUrl(region, participant.riotIdGameName, participant.riotIdTagline);
    const key = normalizeRiotId(displayName);
    const colorClass = key === currentKey
      ? "text-violet-200 font-bold"
      : knownSet.has(key)
        ? "text-emerald-300 font-bold"
        : muted
          ? "text-slate-500"
          : "text-slate-400";

    const content = (
      <>
        <img src={getChampionIconUrl(participant.championName)} className="w-4 h-4 rounded-sm shrink-0 object-cover" alt="" />
        <span className="truncate">{displayName}</span>
      </>
    );

    return opgg ? (
      <a
        href={opgg}
        target="_blank"
        rel="noreferrer"
        className={`flex items-center gap-1.5 min-w-0 hover:text-cyan-200 transition ${colorClass}`}
        title={displayName}
      >
        {content}
      </a>
    ) : (
      <span className={`flex items-center gap-1.5 min-w-0 ${colorClass}`} title={displayName}>
        {content}
      </span>
    );
  };

  return (
    <article className={`relative overflow-hidden border ${tone.border} ${tone.bg} rounded-lg p-3 sm:p-4 transition-all hover:bg-white/[0.055]`}>
      <div className={`absolute inset-y-0 left-0 w-1 ${match.isRemake ? "bg-slate-400/30" : isWin ? "bg-emerald-300/70" : "bg-rose-300/70"}`}></div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 xl:grid-cols-[9rem_18rem_10rem_12rem_3rem_minmax(13rem,1fr)] xl:items-center">
        <div className="flex min-w-0 items-center justify-between gap-2 text-sm xl:flex-col xl:items-start xl:justify-start">
          <div className="min-w-0">
            <h4 className="truncate font-black text-slate-200">{match.queue}</h4>
          </div>
          <div className="flex shrink-0 items-end gap-2 xl:flex-col xl:items-start xl:gap-1">
            <Badge variant={match.isRemake ? "gray" : isWin ? "green" : "red"}>{resultLabel}</Badge>
            <span className="text-slate-500 text-[11px]">{durationLabel}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="relative w-14 h-14 shrink-0 sm:h-16 sm:w-16">
            <img
              src={getChampionIconUrl(match.championName)}
              alt={match.championName}
              className="w-full h-full rounded-lg border border-white/10 shadow-md object-cover"
            />
            <span className="absolute -bottom-1 -right-1 bg-[#0a0612] border border-white/10 text-[10px] w-6 h-6 flex items-center justify-center rounded-md text-white font-bold z-10">
              {match.championLevel}
            </span>
          </div>
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] uppercase border border-white/10 text-slate-300" title={match.position || "Sin rol"}>
                <PositionIcon className="h-3.5 w-3.5 text-violet-200" />
                {positionMeta.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <img src={spellAIcon} alt={spellA?.name || "Spell"} title={spellA?.name} className="w-6 h-6 rounded-md border border-white/10" />
              <img src={spellBIcon} alt={spellB?.name || "Spell"} title={spellB?.name} className="w-6 h-6 rounded-md border border-white/10" />
              {mainRune?.icon && <img src={getRuneIconUrl(mainRune.icon)} className="w-6 h-6" alt={mainRune.name} />}
              {secondaryStyle?.icon && <img src={getRuneIconUrl(secondaryStyle.icon)} className="w-6 h-6 opacity-80" alt={secondaryStyle.name} />}
            </div>
          </div>
        </div>

        <div className="flex min-w-0 xl:flex-col items-center xl:items-start justify-between gap-2">
          <div>
            <div className="font-black text-base text-white whitespace-nowrap sm:text-lg">
              {match.kills} / <span className="text-rose-300">{match.deaths}</span> / {match.assists}
            </div>
            <span className="text-xs text-slate-400 font-bold">{match.kdaRatio}:1 KDA</span>
          </div>
          <Badge variant="cyan">CS {match.csTotal} ({match.csPerMin}/m)</Badge>
        </div>

        <div className="grid w-full max-w-[20rem] grid-cols-6 gap-1.5 xl:max-w-none">
          {match.items.slice(0, 6).map((itemId, index) => {
            const itemName = itemById[itemId]?.name || (itemId > 0 ? `Item ${itemId}` : "Sin item");
            return (
              <div key={index} className="aspect-square bg-black/35 rounded-md border border-white/10 overflow-hidden shadow-inner">
                {itemId > 0 && (
                  <img
                    src={getItemIconUrl(itemId)}
                    className="w-full h-full object-cover scale-110"
                    alt={itemName}
                    title={itemName}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-start xl:justify-center">
          <div className="w-8 h-8 bg-black/35 rounded-md border border-white/10 overflow-hidden flex items-center justify-center shadow-inner">
            {trinketId > 0 && (
              <img
                src={getItemIconUrl(trinketId)}
                className="w-full h-full object-cover scale-110"
                alt={itemById[trinketId]?.name || "Trinket"}
                title={itemById[trinketId]?.name || "Trinket"}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 overflow-hidden rounded-lg border border-white/10 bg-black/20 p-2 text-[10px] sm:grid-cols-2 sm:gap-3 xl:border-0 xl:bg-transparent xl:p-0">
          <div className="flex flex-col gap-1 min-w-0">
            {match.allyTeam.map((participant) => (
              <div key={`${participant.puuid}-ally`} className="min-w-0">
                {renderParticipant(participant)}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            {match.enemyTeam.map((participant) => (
              <div key={`${participant.puuid}-enemy`} className="min-w-0">
                {renderParticipant(participant, true)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};
