import { useEffect, useState } from "react";
import { DDRAGON_VERSION } from "../services/riotTransformers";

type DdragonItem = {
  name: string;
  plaintext?: string;
  gold?: number;
};

type DdragonSpell = {
  name: string;
  icon: string;
};

type DdragonRune = {
  name: string;
  icon: string;
};

type DdragonItemsResponse = {
  data?: Record<string, {
    name: string;
    plaintext?: string;
    gold?: { total?: number };
  }>;
};

type DdragonSpellsResponse = {
  data?: Record<string, {
    key: string;
    name: string;
    image?: { full?: string };
  }>;
};

type DdragonRunesResponse = Array<{
  id: number;
  name: string;
  icon: string;
  slots?: Array<{
    runes?: Array<{
      id: number;
      name: string;
      icon: string;
    }>;
  }>;
}>;

export type DdragonMaps = {
  itemById: Record<number, DdragonItem>;
  spellById: Record<number, DdragonSpell>;
  runeById: Record<number, DdragonRune>;
  styleById: Record<number, DdragonRune>;
  loading: boolean;
  locale: string;
};

const DEFAULT_LOCALE = "es_MX";
const FALLBACK_LOCALE = "en_US";

const emptyMaps: DdragonMaps = {
  itemById: {},
  spellById: {},
  runeById: {},
  styleById: {},
  loading: true,
  locale: DEFAULT_LOCALE,
};

const fetchJson = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }
  return res.json();
};

const buildMaps = (itemsJson: DdragonItemsResponse, spellsJson: DdragonSpellsResponse, runesJson: DdragonRunesResponse) => {
  const itemById: Record<number, DdragonItem> = {};
  const spellById: Record<number, DdragonSpell> = {};
  const runeById: Record<number, DdragonRune> = {};
  const styleById: Record<number, DdragonRune> = {};

  Object.entries(itemsJson.data || {}).forEach(([id, item]) => {
    const itemId = Number(id);
    if (!Number.isNaN(itemId)) {
      itemById[itemId] = {
        name: item.name,
        plaintext: item.plaintext,
        gold: item.gold?.total,
      };
    }
  });

  Object.values(spellsJson.data || {}).forEach((spell) => {
    const spellId = Number(spell.key);
    if (!Number.isNaN(spellId)) {
      spellById[spellId] = {
        name: spell.name,
        icon: spell.image?.full || "",
      };
    }
  });

  (runesJson || []).forEach((style) => {
    styleById[style.id] = {
      name: style.name,
      icon: style.icon,
    };
    (style.slots || []).forEach((slot) => {
      (slot.runes || []).forEach((rune) => {
        runeById[rune.id] = {
          name: rune.name,
          icon: rune.icon,
        };
      });
    });
  });

  return { itemById, spellById, runeById, styleById };
};

const loadLocaleData = async (locale: string) => {
  const base = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/data/${locale}`;
  const [itemsJson, spellsJson, runesJson] = await Promise.all([
    fetchJson<DdragonItemsResponse>(`${base}/item.json`),
    fetchJson<DdragonSpellsResponse>(`${base}/summoner.json`),
    fetchJson<DdragonRunesResponse>(`${base}/runesReforged.json`),
  ]);

  return buildMaps(itemsJson, spellsJson, runesJson);
};

export const useDdragonData = () => {
  const [state, setState] = useState<DdragonMaps>(emptyMaps);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      const cacheKeyDefault = `ddragon:${DDRAGON_VERSION}:${DEFAULT_LOCALE}`;
      const cacheKeyFallback = `ddragon:${DDRAGON_VERSION}:${FALLBACK_LOCALE}`;

      try {
        const cached = localStorage.getItem(cacheKeyDefault) || localStorage.getItem(cacheKeyFallback);
        if (cached) {
          const parsed = JSON.parse(cached) as DdragonMaps;
          if (isActive) {
            setState({ ...parsed, loading: false });
          }
          return;
        }
      } catch {
        // ignore cache errors
      }

      try {
        const locale = DEFAULT_LOCALE;
        const maps = await loadLocaleData(locale);

        if (!maps || Object.keys(maps.itemById).length === 0) {
          throw new Error("Locale data empty");
        }

        if (isActive) {
          const nextState: DdragonMaps = { ...maps, loading: false, locale };
          setState(nextState);
          localStorage.setItem(`ddragon:${DDRAGON_VERSION}:${locale}`, JSON.stringify(nextState));
        }
      } catch {
        try {
          const locale = FALLBACK_LOCALE;
          const maps = await loadLocaleData(locale);
          if (isActive) {
            const nextState: DdragonMaps = { ...maps, loading: false, locale };
            setState(nextState);
            localStorage.setItem(`ddragon:${DDRAGON_VERSION}:${locale}`, JSON.stringify(nextState));
          }
        } catch {
          if (isActive) {
            setState((prev) => ({ ...prev, loading: false }));
          }
        }
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, []);

  return state;
};
