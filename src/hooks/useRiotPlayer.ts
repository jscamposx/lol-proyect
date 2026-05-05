import { useState, useEffect, useCallback } from 'react';
import type { UserConfig } from '../types/user';
import type { LoadablePlayerDashboard } from '../types/dashboard';
import { clearExpiredCache, getCacheMeta, removeCachedData, RIOT_CACHE_TTL_MS } from '../services/cache';
import { loadPlayerDashboard } from '../services/playerDashboard';

export const useRiotPlayer = (user: UserConfig) => {
  const [data, setData] = useState<LoadablePlayerDashboard>({
    userId: user.id,
    data: null,
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  const fetchPlayerData = useCallback(async (forceRefresh = false) => {
    setData((prev) => ({ ...prev, loading: true, error: null }));
    try {
      if (forceRefresh) {
        const pKey = `riot:account:${user.routing}:${user.gameName}:${user.tagLine}`;
        const pMeta = getCacheMeta(pKey);
        if (pMeta && (Date.now() - pMeta.createdAt < RIOT_CACHE_TTL_MS)) {
          const remain = Math.ceil((pMeta.expiresAt - Date.now()) / 60000);
          setRefreshMessage(`Los datos aún están frescos. Intenta de nuevo en ${remain} min.`);
          setData((prev) => ({ ...prev, loading: false }));
          return;
        } else {
          setRefreshMessage(null);
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith("riot:")) {
              keysToRemove.push(k);
            }
          }
          keysToRemove.forEach(k => removeCachedData(k));
        }
      }

      const dashboard = await loadPlayerDashboard(user);
      
      setData({
        userId: user.id,
        data: dashboard,
        loading: false,
        error: null,
        lastUpdated: Date.now(),
      });
    } catch (err) {
      let errorMessage = "Ocurrió un error inesperado conectando con Riot API.";
      if (err instanceof Error) {
        if (err.message.includes("401")) {
          errorMessage = "API key inválida o expirada.";
        } else if (err.message.includes("403")) {
          errorMessage = "Acceso denegado por Riot API. Revisa si tu API key está vencida, inválida o sin permisos.";
        } else if (err.message.includes("429")) {
          errorMessage = "Rate limit de Riot alcanzado. Intenta más tarde.";
        } else {
          errorMessage = err.message;
        }
      }
      
      setData((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, [user]);

  useEffect(() => {
    clearExpiredCache();
    const timeout = window.setTimeout(() => {
      void fetchPlayerData();
    }, 0);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [fetchPlayerData]);

  return {
    ...data,
    refresh: () => fetchPlayerData(true),
    refreshMessage,
    canRefresh: true, // simplified logic since we show message if they can't
  };
};

