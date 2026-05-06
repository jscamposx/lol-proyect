const TIER_ICON_BASE_URL =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests";

export const TIER_ICON_FALLBACK_SRC =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

const tierDisplayNames: Record<string, string> = {
  IRON: "Hierro",
  BRONZE: "Bronce",
  SILVER: "Plata",
  GOLD: "Oro",
  PLATINUM: "Platino",
  EMERALD: "Esmeralda",
  DIAMOND: "Diamante",
  MASTER: "Maestro",
  GRANDMASTER: "Gran Maestro",
  CHALLENGER: "Retador",
};

const apexTiers = new Set(["MASTER", "GRANDMASTER", "CHALLENGER"]);

const tierShortCodes: Record<string, string> = {
  IRON: "H",
  BRONZE: "B",
  SILVER: "P",
  GOLD: "O",
  PLATINUM: "P",
  EMERALD: "E",
  DIAMOND: "D",
  MASTER: "M",
  GRANDMASTER: "GM",
  CHALLENGER: "R",
};

const rankShortCodes: Record<string, string> = {
  IV: "4",
  III: "3",
  II: "2",
  I: "1",
};

const rankPillToneClasses: Record<string, string> = {
  IRON: "border-zinc-200/45 bg-zinc-300/20 text-zinc-50 shadow-[0_0_12px_rgba(212,212,216,0.18)]",
  BRONZE: "border-orange-200/55 bg-orange-400/25 text-orange-50 shadow-[0_0_12px_rgba(251,146,60,0.26)]",
  SILVER: "border-slate-100/60 bg-slate-200/25 text-white shadow-[0_0_12px_rgba(226,232,240,0.28)]",
  GOLD: "border-amber-200/60 bg-amber-300/25 text-amber-50 shadow-[0_0_14px_rgba(251,191,36,0.32)]",
  PLATINUM: "border-teal-100/65 bg-teal-300/30 text-teal-50 shadow-[0_0_14px_rgba(45,212,191,0.34)]",
  EMERALD: "border-emerald-100/65 bg-emerald-300/30 text-emerald-50 shadow-[0_0_14px_rgba(52,211,153,0.36)]",
  DIAMOND: "border-sky-100/65 bg-sky-300/30 text-sky-50 shadow-[0_0_14px_rgba(56,189,248,0.34)]",
  MASTER: "border-violet-100/65 bg-violet-300/30 text-violet-50 shadow-[0_0_14px_rgba(167,139,250,0.36)]",
  GRANDMASTER: "border-rose-100/65 bg-rose-300/30 text-rose-50 shadow-[0_0_14px_rgba(251,113,133,0.36)]",
  CHALLENGER: "border-cyan-100/70 bg-cyan-300/30 text-cyan-50 shadow-[0_0_14px_rgba(103,232,249,0.38)]",
  UNRANKED: "border-white/15 bg-white/[0.07] text-slate-400",
};

export const getTierDisplayName = (tier?: string | null) => {
  if (!tier) return "Unranked";
  return tierDisplayNames[tier] ?? tier;
};

export const getTierIconUrl = (tier?: string | null) => {
  const normalizedTier = tier?.trim().toLowerCase();
  return normalizedTier ? `${TIER_ICON_BASE_URL}/${normalizedTier}.svg` : "";
};

export const isApexTier = (tier?: string | null) => Boolean(tier && apexTiers.has(tier));

export const getShortRankLabel = (tier?: string | null, rank?: string | null) => {
  if (!tier || tier === "UNRANKED") return "UR";

  const tierCode = tierShortCodes[tier] ?? tier.slice(0, 1);
  if (isApexTier(tier)) return tierCode;

  return `${tierCode}${rankShortCodes[rank || ""] ?? ""}`;
};

export const getRankPillToneClasses = (tier?: string | null) => {
  if (!tier) return rankPillToneClasses.UNRANKED;
  return rankPillToneClasses[tier] ?? rankPillToneClasses.UNRANKED;
};

export const getRankDisplayTitle = (tier?: string | null, rank?: string | null, lp?: number | null) => {
  if (!tier || tier === "UNRANKED") return "Unranked";

  const division = isApexTier(tier) ? "" : ` ${rank || ""}`;
  const points = typeof lp === "number" ? ` - ${lp} LP` : "";
  return `${getTierDisplayName(tier)}${division}${points}`;
};
