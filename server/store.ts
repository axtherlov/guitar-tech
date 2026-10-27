import fs from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';
import type { SiteContent, BackupItem } from '../src/types.js';

export const MAX_BACKUPS = 20;
const TOKEN_TTL_SECONDS = 60 * 60;

export interface Store {
  getContent(): Promise<SiteContent | null>;
  setContent(content: SiteContent): Promise<void>;
  /** Persists a snapshot and prunes the oldest ones. Returns the backup filename. */
  createBackup(content: SiteContent): Promise<string>;
  listBackups(): Promise<BackupItem[]>;
  getBackup(filename: string): Promise<SiteContent | null>;
  addToken(token: string): Promise<void>;
  hasToken(token: string): Promise<boolean>;
  removeToken(token: string): Promise<void>;
}

function backupName(content: SiteContent): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `backup-${timestamp}-v${content.version || 1}.json`;
}

// ---------------------------------------------------------------------------
// Local development: JSON files under /data
// ---------------------------------------------------------------------------

export function createFileStore(dataDir: string): Store {
  const backupsDir = path.resolve(dataDir, 'backups');
  const contentFile = path.resolve(dataDir, 'content.json');
  const tokenFile = path.resolve(dataDir, '.tokens.json');

  try {
    fs.mkdirSync(backupsDir, { recursive: true });
  } catch (err) {
    console.error('Could not create data directories (read-only filesystem?):', err);
  }

  const loadTokens = (): Set<string> => {
    try {
      if (fs.existsSync(tokenFile)) {
        const data = JSON.parse(fs.readFileSync(tokenFile, 'utf-8'));
        if (Array.isArray(data)) return new Set(data);
      }
    } catch {}
    return new Set<string>();
  };
  const tokens = loadTokens();
  const saveTokens = () => {
    try {
      fs.writeFileSync(tokenFile, JSON.stringify(Array.from(tokens)), 'utf-8');
    } catch {}
  };

  return {
    async getContent() {
      if (!fs.existsSync(contentFile)) return null;
      return JSON.parse(fs.readFileSync(contentFile, 'utf-8'));
    },

    async setContent(content) {
      fs.writeFileSync(contentFile, JSON.stringify(content, null, 2), 'utf-8');
    },

    async createBackup(content) {
      const filename = backupName(content);
      fs.writeFileSync(path.resolve(backupsDir, filename), JSON.stringify(content, null, 2), 'utf-8');

      try {
        const files = fs.readdirSync(backupsDir)
          .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
          .map(f => ({ name: f, time: fs.statSync(path.resolve(backupsDir, f)).mtimeMs }))
          .sort((a, b) => b.time - a.time);
        files.slice(MAX_BACKUPS).forEach(f => {
          try {
            fs.unlinkSync(path.resolve(backupsDir, f.name));
          } catch {
            // ignore cleanup errors
          }
        });
      } catch (err) {
        console.error('Error cleaning old backups:', err);
      }
      return filename;
    },

    async listBackups() {
      return fs.readdirSync(backupsDir)
        .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
        .map(filename => {
          const fullPath = path.resolve(backupsDir, filename);
          const stat = fs.statSync(fullPath);
          let version = 1;
          try {
            version = JSON.parse(fs.readFileSync(fullPath, 'utf-8')).version || 1;
          } catch {}
          return { filename, timestamp: stat.mtime.toISOString(), sizeBytes: stat.size, version } as BackupItem;
        })
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },

    async getBackup(filename) {
      const backupPath = path.resolve(backupsDir, path.basename(filename));
      if (!fs.existsSync(backupPath)) return null;
      return JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
    },

    async addToken(token) {
      tokens.add(token);
      saveTokens();
    },
    async hasToken(token) {
      return tokens.has(token);
    },
    async removeToken(token) {
      tokens.delete(token);
      saveTokens();
    },
  };
}

// ---------------------------------------------------------------------------
// Production (Vercel): Upstash Redis over REST
// ---------------------------------------------------------------------------

const CONTENT_KEY = 'gt:content';
const BACKUP_INDEX_KEY = 'gt:backups';
const backupKey = (filename: string) => `gt:backup:${filename}`;
const tokenKey = (token: string) => `gt:token:${token}`;

// Upstash deserializes JSON values on read, so a stored string may come back as an object.
function parseValue<T>(value: unknown): T | null {
  if (value === null || value === undefined) return null;
  return (typeof value === 'string' ? JSON.parse(value) : value) as T;
}

export function createRedisStore(redis: Redis): Store {
  return {
    async getContent() {
      return parseValue<SiteContent>(await redis.get(CONTENT_KEY));
    },

    async setContent(content) {
      await redis.set(CONTENT_KEY, JSON.stringify(content));
    },

    async createBackup(content) {
      const filename = backupName(content);
      await redis.set(backupKey(filename), JSON.stringify(content));
      await redis.zadd(BACKUP_INDEX_KEY, { score: Date.now(), member: filename });

      // Members are ordered oldest-first; everything but the newest MAX_BACKUPS is stale.
      const stale = await redis.zrange<string[]>(BACKUP_INDEX_KEY, 0, -(MAX_BACKUPS + 1));
      if (stale.length > 0) {
        await redis.del(...stale.map(backupKey));
        await redis.zrem(BACKUP_INDEX_KEY, ...stale);
      }
      return filename;
    },

    async listBackups() {
      const entries = await redis.zrange<string[]>(BACKUP_INDEX_KEY, 0, -1, { withScores: true });
      const items: { filename: string; score: number }[] = [];
      for (let i = 0; i < entries.length; i += 2) {
        items.push({ filename: String(entries[i]), score: Number(entries[i + 1]) });
      }
      if (items.length === 0) return [];

      const values = await redis.mget<unknown[]>(...items.map(i => backupKey(i.filename)));
      return items
        .map((item, idx): BackupItem | null => {
          const content = parseValue<SiteContent>(values[idx]);
          if (!content) return null;
          return {
            filename: item.filename,
            timestamp: new Date(item.score).toISOString(),
            sizeBytes: Buffer.byteLength(JSON.stringify(content), 'utf-8'),
            version: content.version || 1,
          };
        })
        .filter((b): b is BackupItem => b !== null)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },

    async getBackup(filename) {
      return parseValue<SiteContent>(await redis.get(backupKey(filename)));
    },

    async addToken(token) {
      await redis.set(tokenKey(token), '1', { ex: TOKEN_TTL_SECONDS });
    },
    async hasToken(token) {
      return (await redis.exists(tokenKey(token))) === 1;
    },
    async removeToken(token) {
      await redis.del(tokenKey(token));
    },
  };
}

// Vercel's Upstash integration may expose either naming scheme.
function redisCredentials(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

export function createStore(dataDir: string): Store {
  const creds = redisCredentials();
  if (creds) return createRedisStore(new Redis(creds));

  if (process.env.VERCEL) {
    console.warn('[storage] Redis credentials not found on Vercel: content edits cannot be persisted.');
  }
  return createFileStore(dataDir);
}
