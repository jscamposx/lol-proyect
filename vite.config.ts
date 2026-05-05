import { defineConfig, loadEnv } from 'vite'
import type { Connect, Plugin } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import type { ServerResponse } from 'node:http'

const RIOT_API_HOST_PATTERN = /^[a-z0-9-]+\.api\.riotgames\.com$/i;

const riotProxyPlugin = (apiKey: string): Plugin => ({
  name: 'riot-api-proxy',
  configureServer(server) {
    server.middlewares.use('/api/riot', createRiotProxyHandler(apiKey));
  },
  configurePreviewServer(server) {
    server.middlewares.use('/api/riot', createRiotProxyHandler(apiKey));
  },
});

const createRiotProxyHandler = (apiKey: string): Connect.NextHandleFunction => async (req, res) => {
  if (req.method !== 'GET') {
    sendJson(res, 405, { message: 'Method not allowed' });
    return;
  }

  if (!apiKey) {
    sendJson(res, 500, { message: 'Falta RIOT_API_KEY en el entorno del servidor' });
    return;
  }

  const requestUrl = new URL(req.url || '', 'http://localhost');
  const targetParam = requestUrl.searchParams.get('url');

  if (!targetParam) {
    sendJson(res, 400, { message: 'Missing Riot target URL' });
    return;
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(targetParam);
  } catch {
    sendJson(res, 400, { message: 'Invalid Riot target URL' });
    return;
  }

  if (targetUrl.protocol !== 'https:' || !RIOT_API_HOST_PATTERN.test(targetUrl.hostname)) {
    sendJson(res, 400, { message: 'Blocked non-Riot API target' });
    return;
  }

  try {
    const upstream = await fetch(targetUrl, {
      headers: {
        Accept: 'application/json',
        'X-Riot-Token': apiKey,
      },
    });
    const body = Buffer.from(await upstream.arrayBuffer());

    res.statusCode = upstream.status;
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.end(body);
  } catch {
    sendJson(res, 502, { message: 'No se pudo contactar Riot API' });
  }
};

const sendJson = (res: ServerResponse, statusCode: number, payload: unknown) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const riotApiKey = env.RIOT_API_KEY || env.VITE_RIOT_API_KEY || '';

  return {
    envPrefix: 'APP_',
    plugins: [
      react(),
      tailwindcss(),
      riotProxyPlugin(riotApiKey),
      babel({ presets: [reactCompilerPreset()] })
    ],
  };
})
