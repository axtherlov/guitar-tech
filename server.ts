import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApp, isProd } from './server/app.js';

// Local entry point: API (server/app.ts) + Vite middleware in dev, or the built `dist` in production.
// On Vercel the API runs from api/index.ts and the static build is served by the platform.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const app = createApp();

async function startServer() {
  if (!isProd()) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`> Guitar Tech Córdoba Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
