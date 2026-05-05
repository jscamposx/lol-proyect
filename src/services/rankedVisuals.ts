const TIER_ICON_BASE_URL =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem";

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

export const getTierDisplayName = (tier?: string | null) => {
  if (!tier) return "Unranked";
  return tierDisplayNames[tier] ?? tier;
};

export const getTierIconUrl = (tier?: string | null) => {
  const normalizedTier = tier?.trim().toLowerCase();
  return normalizedTier ? `${TIER_ICON_BASE_URL}/emblem-${normalizedTier}.png` : "";
};

export const isApexTier = (tier?: string | null) => Boolean(tier && apexTiers.has(tier));
