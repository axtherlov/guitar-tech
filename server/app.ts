import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import express, { Request, Response, NextFunction } from 'express';
import { DEFAULT_CONTENT } from '../src/data/defaultContent.js';
import type { SiteContent } from '../src/types.js';
import { createStore, type Store } from './store.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', 'data');

// Fallback password is only honoured in development when ADMIN_PASSWORD is unset.
const DEV_FALLBACK_PASSWORD = 'guitartech2026';
const BACKUP_FILENAME = /^backup-[\w-]+\.json$/;

export const isProd = () => process.env.NODE_ENV === 'production';

type Handler = (req: Request, res: Response) => Promise<void>;

// Express 4 does not catch rejected promises from async handlers.
const route = (handler: Handler) => (req: Request, res: Response, next: NextFunction) => {
  handler(req, res).catch(err => {
    console.error(`${req.method} ${req.path} failed:`, err);
    if (!res.headersSent) res.status(500).json({ error: err?.message || 'Internal error' });
    else next(err);
  });
};

/**
 * Builds the API (content, auth, backups, sitemap, robots). It is used both by the
 * local dev server (server.ts) and by the Vercel function (api/index.ts).
 * Environment is read here, not at import time, so dotenv has already run.
 */
export function createApp(store: Store = createStore(DATA_DIR)) {
  const app = express();

  const envAdminPassword = process.env.ADMIN_PASSWORD;
  const isDefaultPassword = !envAdminPassword;

  if (isDefaultPassword && isProd()) {
    console.warn('[security] ADMIN_PASSWORD is not set: admin login is disabled in production.');
  }

  const verifyAdminPassword = (password: string): boolean => {
    if (!password) return false;
    if (envAdminPassword) return password === envAdminPassword;
    return !isProd() && password === DEV_FALLBACK_PASSWORD;
  };

  const loadContent = async (): Promise<SiteContent> => {
    try {
      const stored = await store.getContent();
      // Merge with defaults in case new fields were added
      if (stored) return { ...DEFAULT_CONTENT, ...stored };
    } catch (err) {
      console.error('Error reading content, falling back to defaults:', err);
      return DEFAULT_CONTENT;
    }
    // First run: initialize storage with the defaults
    try {
      await store.setContent(DEFAULT_CONTENT);
    } catch (err) {
      console.error('Could not initialize content storage:', err);
    }
    return DEFAULT_CONTENT;
  };

  app.use(express.json({ limit: '10mb' }));

  const admin = (handler: Handler) => route(async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: missing or invalid token' });
      return;
    }
    const token = authHeader.split(' ')[1];
    if (!(await store.hasToken(token))) {
      res.status(403).json({ error: 'Forbidden: invalid or expired session' });
      return;
    }
    await handler(req, res);
  });

  // 1. Get Site Content
  app.get('/api/content', route(async (_req, res) => {
    res.json({ content: await loadContent(), isDefaultPassword });
  }));

  // 2. Admin Login
  app.post('/api/auth/login', route(async (req, res) => {
    const { password } = req.body || {};
    if (!password || typeof password !== 'string' || !verifyAdminPassword(password)) {
      res.status(401).json({ error: 'Contraseña incorrecta / Invalid password' });
      return;
    }
    const token = `adm_${crypto.randomBytes(32).toString('hex')}`;
    await store.addToken(token);
    res.json({ token, isDefaultPassword });
  }));

  // 3. Admin Logout
  app.post('/api/auth/logout', route(async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      await store.removeToken(authHeader.split(' ')[1]);
    }
    res.json({ success: true });
  }));

  // 4. Update Site Content (Protected)
  app.post('/api/content', admin(async (req, res) => {
    const updatedContent = req.body as SiteContent;
    if (!updatedContent || !updatedContent.services) {
      res.status(400).json({ error: 'Invalid content payload' });
      return;
    }
    updatedContent.lastUpdated = new Date().toISOString();
    updatedContent.version = (updatedContent.version || 1) + 1;

    await store.createBackup(updatedContent);
    await store.setContent(updatedContent);
    res.json({ success: true, content: updatedContent });
  }));

  // 5. List Backups (Protected)
  app.get('/api/backups', admin(async (_req, res) => {
    res.json({ backups: await store.listBackups() });
  }));

  // 6. Create Manual Backup (Protected)
  app.post('/api/backups/create', admin(async (_req, res) => {
    const filename = await store.createBackup(await loadContent());
    res.json({ success: true, filename });
  }));

  // 7. Restore Backup (Protected)
  app.post('/api/backups/restore', admin(async (req, res) => {
    const { filename } = req.body || {};
    if (!filename || typeof filename !== 'string' || !BACKUP_FILENAME.test(filename)) {
      res.status(400).json({ error: 'Nombre de archivo inválido' });
      return;
    }
    const backupData = await store.getBackup(filename);
    if (!backupData) {
      res.status(404).json({ error: 'Copia de seguridad no encontrada' });
      return;
    }
    // Take a snapshot of current state before restoring
    await store.createBackup(await loadContent());
    await store.setContent(backupData);
    res.json({ success: true, content: backupData });
  }));

  // Dynamic Sitemap & Robots.txt for Local SEO
  app.get('/sitemap.xml', (_req: Request, res: Response) => {
    const baseUrl = process.env.APP_URL || 'https://cordobaguitartech.com';
    const lastMod = new Date().toISOString().split('T')[0];

    const routes = [
      { es: '/es', en: '/en', changefreq: 'weekly', priority: '1.0' },
      { es: '/es/servicios', en: '/en/services', changefreq: 'weekly', priority: '0.9' },
      { es: '/es/sobre-mi', en: '/en/about', changefreq: 'monthly', priority: '0.8' },
      { es: '/es/contacto', en: '/en/contact', changefreq: 'weekly', priority: '0.9' },
      { es: '/es/politica-privacidad', en: '/en/privacy-policy', changefreq: 'yearly', priority: '0.3' }
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

    for (const r of routes) {
      for (const loc of [r.es, r.en]) {
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}${loc}</loc>\n`;
        xml += `    <lastmod>${lastMod}</lastmod>\n`;
        xml += `    <changefreq>${r.changefreq}</changefreq>\n`;
        xml += `    <priority>${r.priority}</priority>\n`;
        xml += `    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}${r.es}"/>\n`;
        xml += `    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${r.en}"/>\n`;
        xml += `  </url>\n`;
      }
    }

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  app.get('/robots.txt', (_req: Request, res: Response) => {
    const baseUrl = process.env.APP_URL || 'https://cordobaguitartech.com';
    const robots = `User-agent: *\r\nAllow: /\r\nDisallow: /admin\r\nDisallow: /api/\r\n\r\nSitemap: ${baseUrl}/sitemap.xml\r\n`;
    res.type('text/plain').send(robots);
  });

  return app;
}
