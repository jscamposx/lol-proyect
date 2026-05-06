export const formatDuration = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "-";
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}m ${sec.toString().padStart(2, "0")}s`;
};

export const formatShortDate = (timestamp: number) => {
  if (!timestamp) return "-";
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};

export const formatLongSpanishDate = (timestamp: number) => {
  if (!timestamp) return "-";

  const parts = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(new Date(timestamp));

  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value || "";

  const weekday = getPart("weekday");
  const day = getPart("day");
  const month = getPart("month");
  const year = getPart("year");

  return `${weekday} ${day} de ${month} del ${year}`;
};

export const formatShortTime = (timestamp: number | null) => {
  if (!timestamp) return "N/A";
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const formatMatchStartTime = (timestamp: number | null) => {
  if (!timestamp) return "-";

  return new Intl.DateTimeFormat("es-MX", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(timestamp));
};

export const getWinrateTone = (winrate: number) => {
  if (winrate >= 55) return "text-emerald-400";
  if (winrate >= 48) return "text-amber-400";
  return "text-rose-400";
};

export const getMatchTone = (win: boolean) => {
  return win
    ? {
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/5",
        text: "text-emerald-300",
        badge: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
      }
    : {
        border: "border-rose-500/30",
        bg: "bg-rose-500/5",
        text: "text-rose-300",
        badge: "bg-rose-500/15 text-rose-300 border-rose-400/30",
      };
};

export const getOpgRegion = (region: string) => {
  const map: Record<string, string> = {
    la1: "lan",
    br1: "br",
    na1: "na",
    euw1: "euw",
    eun1: "eune",
    kr: "kr",
    jp1: "jp",
    oc1: "oce",
    tr1: "tr",
    ru: "ru",
  };
  return map[region] || region;
};

export const getOpgProfileUrl = (region: string, gameName?: string, tagLine?: string) => {
  if (!gameName || !tagLine) return "";
  const opgRegion = getOpgRegion(region);
  const slug = `${gameName}-${tagLine}`.replace(/\s+/g, "%20");
  return `https://www.op.gg/summoners/${opgRegion}/${slug}`;
};
