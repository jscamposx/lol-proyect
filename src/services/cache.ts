export const RIOT_CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheItem<T> {
  data: T;
  createdAt: number;
  expiresAt: number;
}

export function getCachedData<T>(key: string): T | null {
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    const item: CacheItem<T> = JSON.parse(itemStr);
    if (Date.now() > item.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return item.data;
  } catch {
    return null;
  }
}

export function setCachedData<T>(key: string, data: T, ttlMs: number = RIOT_CACHE_TTL_MS): void {
  try {
    if (key.includes('undefined') || key.includes('null') || key.match(/:\s*$/)) {
      return;
    }
    const item: CacheItem<T> = {
      data,
      createdAt: Date.now(),
      expiresAt: Date.now() + ttlMs,
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (e) {
    // ignore
  }
}

export function clearInvalidCache(): void {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('riot:') && (key.includes('undefined') || key.includes('null'))) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

export function removeCachedData(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function clearExpiredCache(): void {
  try {
    const now = Date.now();
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('riot:')) {
            if (key.includes('undefined') || key.includes('null')) {
                localStorage.removeItem(key);
                continue;
            }
            const itemStr = localStorage.getItem(key);
            if (itemStr) {
                const item = JSON.parse(itemStr);
                if (now > item.expiresAt) {
                    localStorage.removeItem(key);
                }
            }
        }
    }
  } catch {
    // ignore
  }
}

export function getCacheMeta(key: string): { createdAt: number; expiresAt: number } | null {
    try {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;
        const item = JSON.parse(itemStr);
        return { createdAt: item.createdAt, expiresAt: item.expiresAt };
    } catch {
        return null;
    }
}
