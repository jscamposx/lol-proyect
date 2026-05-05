import { useEffect, useRef, useState } from 'react';
import type { UserConfig } from '../types/user';
import type { LoadablePlayerDashboard } from '../types/dashboard';
import { clearExpiredCache } from '../services/cache';
import { loadPlayerDashboard } from '../services/playerDashboard';

export const usePlayersDashboard = (users: UserConfig[]) => {
  const [dashboards, setDashboards] = useState<LoadablePlayerDashboard[]>(
    users.map((user) => ({ userId: user.id, data: null, loading: true, error: null, lastUpdated: null }))
  );

  const isFetching = useRef(false);

  useEffect(() => {
    if (isFetching.current || users.length === 0) return;
    isFetching.current = true;
    clearExpiredCache();

    Promise.all(
      users.map(async (user): Promise<LoadablePlayerDashboard> => {
        try {
          const dashboard = await loadPlayerDashboard(user);
          return { userId: user.id, data: dashboard, loading: false, error: null, lastUpdated: Date.now() };
        } catch (error) {
          return {
            userId: user.id,
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : "No se pudo cargar el dashboard.",
            lastUpdated: Date.now()
          };
        }
      })
    ).then((results) => {
      setDashboards(results);
      isFetching.current = false;
    });
  }, [users]);

  return dashboards;
};
