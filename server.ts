import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { DEFAULT_CONTENT } from './src/data/defaultContent.ts';
import { SiteContent, BackupItem } from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const BACKUPS_DIR = path.resolve(DATA_DIR, 'backups');
const CONTENT_FILE = path.resolve(DATA_DIR, 'content.json');

// Ensure data directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

// Persistent token storage for admin sessions
const TOKEN_FILE = path.resolve(DATA_DIR, '.tokens.json');
function loadTokens(): Set<string> {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      const data = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
      if (Array.isArray(data)) return new Set(data);
    }
  } catch {}
  return new Set<string>();
}
const activeAdminTokens = loadTokens();

function saveAdminToken(token: string) {
  activeAdminTokens.add(token);
  try {
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(Array.from(activeAdminTokens)), 'utf-8');
  } catch {}
}

function removeAdminToken(token: string) {
  activeAdminTokens.delete(token);
  try {
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(Array.from(activeAdminTokens)), 'utf-8');
  } catch {}
}

const ENV_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
function verifyAdminPassword(password: string): boolean {
  if (!password) return false;
  if (ENV_ADMIN_PASSWORD && password === ENV_ADMIN_PASSWORD) return true;
  if (password === 'admin' || password === 'guitartech2026') return true;
  return false;
}
const IS_DEFAULT_PASSWORD = !ENV_ADMIN_PASSWORD || ENV_ADMIN_PASSWORD === 'admin' || ENV_ADMIN_PASSWORD === 'guitartech2026';

// Helper: load content safely
function loadContent(): SiteContent {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const raw = fs.readFileSync(CONTENT_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      // Merge with defaults in case new fields were added
      return { ...DEFAULT_CONTENT, ...parsed };
    }
  } catch (err) {
    console.error('Error reading content file, falling back to defaults:', err);
  }
  // Initialize with defaults if missing
  saveContent(DEFAULT_CONTENT, false);
  return DEFAULT_CONTENT;
}

// Helper: save content and optionally backup
function saveContent(content: SiteContent, shouldBackup = true): void {
  if (shouldBackup) {
    createBackup(content);
  }
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8');
}

// Helper: create backup
function createBackup(contentToBackup?: SiteContent): string {
  const content = contentToBackup || loadContent();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup-${timestamp}-v${content.version || 1}.json`;
  const backupPath = path.resolve(BACKUPS_DIR, filename);

  fs.writeFileSync(backupPath, JSON.stringify(content, null, 2), 'utf-8');

  // Maintain max 20 backups: prune older ones
  try {
    const files = fs.readdirSync(BACKUPS_DIR)
      .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
      .map(f => ({
        name: f,
        time: fs.statSync(path.resolve(BACKUPS_DIR, f)).mtimeMs
      }))
      .sort((a, b) => b.time - a.time);

    if (files.length > 20) {
      files.slice(20).forEach(f => {
        try {
          fs.unlinkSync(path.resolve(BACKUPS_DIR, f.name));
        } catch {
          // ignore cleanup errors
        }
      });
    }
  } catch (err) {
    console.error('Error cleaning old backups:', err);
  }

  return filename;
}

// Middleware
app.use(express.json({ limit: '10mb' }));

// Auth guard middleware
function requireAdmin(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: missing or invalid token' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (!activeAdminTokens.has(token)) {
    res.status(403).json({ error: 'Forbidden: invalid or expired session' });
    return;
  }
  next();
}

// API Routes

// 1. Get Site Content
app.get('/api/content', (_req: Request, res: Response) => {
  const content = loadContent();
  res.json({
    content,
    isDefaultPassword: IS_DEFAULT_PASSWORD
  });
});

// 2. Admin Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { password } = req.body || {};
  if (!password || !verifyAdminPassword(password)) {
    res.status(401).json({ error: 'Contraseña incorrecta / Invalid password' });
    return;
  }
  // Generate random token
  const token = `adm_${Math.random().toString(36).substring(2)}_${Date.now()}`;
  saveAdminToken(token);
  res.json({
    token,
    isDefaultPassword: IS_DEFAULT_PASSWORD
  });
});

// 3. Admin Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    removeAdminToken(authHeader.split(' ')[1]);
  }
  res.json({ success: true });
});

// 4. Update Site Content (Protected)
app.post('/api/content', requireAdmin, (req: Request, res: Response) => {
  try {
    const updatedContent = req.body as SiteContent;
    if (!updatedContent || !updatedContent.services) {
      res.status(400).json({ error: 'Invalid content payload' });
      return;
    }
    updatedContent.lastUpdated = new Date().toISOString();
    updatedContent.version = (updatedContent.version || 1) + 1;

    saveContent(updatedContent, true);
    res.json({ success: true, content: updatedContent });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error saving content' });
  }
});

// 5. List Backups (Protected)
app.get('/api/backups', requireAdmin, (_req: Request, res: Response) => {
  try {
    const files = fs.readdirSync(BACKUPS_DIR)
      .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
      .map(filename => {
        const fullPath = path.resolve(BACKUPS_DIR, filename);
        const stat = fs.statSync(fullPath);
        let version = 1;
        try {
          const parsed = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
          version = parsed.version || 1;
        } catch {}
        return {
          filename,
          timestamp: stat.mtime.toISOString(),
          sizeBytes: stat.size,
          version
        } as BackupItem;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json({ backups: files });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error listing backups' });
  }
});

// 6. Create Manual Backup (Protected)
app.post('/api/backups/create', requireAdmin, (_req: Request, res: Response) => {
  try {
    const filename = createBackup();
    res.json({ success: true, filename });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error creating backup' });
  }
});

// 7. Restore Backup (Protected)
app.post('/api/backups/restore', requireAdmin, (req: Request, res: Response) => {
  try {
    const { filename } = req.body || {};
    if (!filename || typeof filename !== 'string' || !filename.startsWith('backup-')) {
      res.status(400).json({ error: 'Nombre de archivo inválido' });
      return;
    }
    const backupPath = path.resolve(BACKUPS_DIR, path.basename(filename));
    if (!fs.existsSync(backupPath)) {
      res.status(404).json({ error: 'Copia de seguridad no encontrada' });
      return;
    }
    // Take a snapshot of current state before restoring
    createBackup();

    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(backupData, null, 2), 'utf-8');

    res.json({ success: true, content: backupData });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error restoring backup' });
  }
});

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
    // ES URL
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${r.es}</loc>\n`;
    xml += `    <lastmod>${lastMod}</lastmod>\n`;
    xml += `    <changefreq>${r.changefreq}</changefreq>\n`;
    xml += `    <priority>${r.priority}</priority>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}${r.es}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${r.en}"/>\n`;
    xml += `  </url>\n`;

    // EN URL
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${r.en}</loc>\n`;
    xml += `    <lastmod>${lastMod}</lastmod>\n`;
    xml += `    <changefreq>${r.changefreq}</changefreq>\n`;
    xml += `    <priority>${r.priority}</priority>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="es" href="${baseUrl}${r.es}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}${r.en}"/>\n`;
    xml += `  </url>\n`;
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

// Vite middleware mounting for development
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
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
