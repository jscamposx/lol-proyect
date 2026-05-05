import type { RiotRegion } from "../types/user";

const REGION_TIMEZONES: Record<RiotRegion, string> = {
  la1: "America/Mexico_City",
  br1: "America/Sao_Paulo",
  na1: "America/Los_Angeles",
  euw1: "Europe/Madrid",
  eun1: "Europe/Warsaw",
  kr: "Asia/Seoul",
  jp1: "Asia/Tokyo",
  oc1: "Australia/Sydney",
  tr1: "Europe/Istanbul",
  ru: "Europe/Moscow",
};

export const getSeasonStartTimestamp = (region: RiotRegion) => {
  const timeZone = REGION_TIMEZONES[region] || "UTC";
  return getZonedTimestamp(2026, 1, 8, 12, 0, timeZone);
};

const getZonedTimestamp = (year: number, month: number, day: number, hour: number, minute: number, timeZone: string) => {
  const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const offset = getTimeZoneOffset(utcDate, timeZone);
  return utcDate.getTime() - offset;
};

const getTimeZoneOffset = (date: Date, timeZone: string) => {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const asUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  );
  return asUtc - date.getTime();
};
