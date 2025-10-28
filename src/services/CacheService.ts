/**
 * Cache service with persistent storage
 */

import fs from 'fs/promises';
import path from 'path';
import { ComponentDoc, GuideDoc, CacheEntry, CacheMetadata } from '../models/ComponentDoc.js';
import { logger } from '../utils/logger.js';
import { CacheError } from '../utils/errors.js';

export class CacheService {
  private memoryCache: Map<string, CacheEntry<ComponentDoc>> = new Map();
  private guidesCache: Map<string, CacheEntry<GuideDoc>> = new Map();
  private cacheDir: string;
  private cacheFile: string;
  private guidesFile: string;
  private metadataFile: string;
  private ttl: number;
  private enabled: boolean;

  constructor(cacheDir: string = '.cache', ttl: number = 86400000, enabled: boolean = true) {
    this.cacheDir = cacheDir;
    this.cacheFile = path.join(cacheDir, 'components.json');
    this.guidesFile = path.join(cacheDir, 'guides.json');
    this.metadataFile = path.join(cacheDir, 'metadata.json');
    this.ttl = ttl;
    this.enabled = enabled;
  }

  /**
   * Initializes the cache by loading from disk
   */
  async initialize(): Promise<void> {
    if (!this.enabled) {
      logger.info('Cache is disabled');
      return;
    }

    try {
      await fs.mkdir(this.cacheDir, { recursive: true });
      await this.loadFromDisk();
      await this.loadGuidesFromDisk();
      logger.info('Cache initialized successfully', {
        components: this.memoryCache.size,
        guides: this.guidesCache.size
      });
    } catch (error) {
      logger.error('Failed to initialize cache', { error: error instanceof Error ? error.message : String(error) });
      throw new CacheError('Failed to initialize cache', error);
    }
  }

  /**
   * Gets a component from cache
   */
  async get(componentName: string): Promise<ComponentDoc | null> {
    if (!this.enabled) return null;

    const entry = this.memoryCache.get(componentName);

    if (!entry) {
      logger.debug(`Cache miss for ${componentName}`);
      return null;
    }

    // Check if entry is expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      logger.debug(`Cache entry expired for ${componentName}`);
      this.memoryCache.delete(componentName);
      await this.saveToDisk();
      return null;
    }

    logger.debug(`Cache hit for ${componentName}`);
    return entry.data;
  }

  /**
   * Sets a component in cache
   */
  async set(componentName: string, doc: ComponentDoc): Promise<void> {
    if (!this.enabled) return;

    const entry: CacheEntry<ComponentDoc> = {
      data: doc,
      timestamp: Date.now(),
      ttl: this.ttl
    };

    this.memoryCache.set(componentName, entry);
    logger.debug(`Cached ${componentName}`);

    // Save to disk asynchronously (don't await to avoid blocking)
    this.saveToDisk().catch(err => {
      logger.error('Failed to save cache to disk', { error: err instanceof Error ? err.message : String(err) });
    });
  }

  /**
   * Checks if a component exists in cache and is not expired
   */
  has(componentName: string): boolean {
    if (!this.enabled) return false;

    const entry = this.memoryCache.get(componentName);
    if (!entry) return false;

    const now = Date.now();
    return now - entry.timestamp <= entry.ttl;
  }

  /**
   * Clears all cache
   */
  async clear(): Promise<void> {
    this.memoryCache.clear();
    await this.saveToDisk();
    logger.info('Cache cleared');
  }

  /**
   * Removes expired entries
   */
  async cleanup(): Promise<void> {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.memoryCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.memoryCache.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      await this.saveToDisk();
      logger.info(`Cleaned up ${removedCount} expired cache entries`);
    }
  }

  /**
   * Loads cache from disk
   */
  private async loadFromDisk(): Promise<void> {
    try {
      const data = await fs.readFile(this.cacheFile, 'utf-8');
      const entries: Array<[string, CacheEntry<ComponentDoc>]> = JSON.parse(data);

      // Load into memory cache and validate TTL
      const now = Date.now();
      let validCount = 0;

      for (const [key, entry] of entries) {
        if (now - entry.timestamp <= entry.ttl) {
          this.memoryCache.set(key, entry);
          validCount++;
        }
      }

      logger.info(`Loaded ${validCount} valid cache entries from disk`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        logger.info('No existing cache file found, starting with empty cache');
      } else {
        logger.warn('Failed to load cache from disk', { error: error instanceof Error ? error.message : String(error) });
      }
    }
  }

  /**
   * Saves cache to disk
   */
  private async saveToDisk(): Promise<void> {
    try {
      const entries = Array.from(this.memoryCache.entries());
      await fs.writeFile(this.cacheFile, JSON.stringify(entries, null, 2), 'utf-8');

      // Save metadata
      const metadata: CacheMetadata = {
        version: '1.0.0',
        lastUpdate: Date.now(),
        componentCount: this.memoryCache.size
      };
      await fs.writeFile(this.metadataFile, JSON.stringify(metadata, null, 2), 'utf-8');

      logger.debug('Cache saved to disk', { entries: entries.length });
    } catch (error) {
      logger.error('Failed to save cache to disk', { error: error instanceof Error ? error.message : String(error) });
      throw new CacheError('Failed to save cache to disk', error);
    }
  }

  /**
   * Gets a guide from cache
   */
  async getGuide(guideName: string): Promise<GuideDoc | null> {
    if (!this.enabled) return null;

    const entry = this.guidesCache.get(guideName);

    if (!entry) {
      logger.debug(`Cache miss for guide ${guideName}`);
      return null;
    }

    // Check if entry is expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      logger.debug(`Cache entry expired for guide ${guideName}`);
      this.guidesCache.delete(guideName);
      await this.saveGuidesToDisk();
      return null;
    }

    logger.debug(`Cache hit for guide ${guideName}`);
    return entry.data;
  }

  /**
   * Sets a guide in cache
   */
  async setGuide(guideName: string, doc: GuideDoc): Promise<void> {
    if (!this.enabled) return;

    const entry: CacheEntry<GuideDoc> = {
      data: doc,
      timestamp: Date.now(),
      ttl: this.ttl
    };

    this.guidesCache.set(guideName, entry);
    logger.debug(`Cached guide ${guideName}`);

    // Save to disk asynchronously
    this.saveGuidesToDisk().catch(err => {
      logger.error('Failed to save guides cache to disk', { error: err instanceof Error ? err.message : String(err) });
    });
  }

  /**
   * Saves guides cache to disk
   */
  private async saveGuidesToDisk(): Promise<void> {
    try {
      const entries = Array.from(this.guidesCache.entries());
      await fs.writeFile(this.guidesFile, JSON.stringify(entries, null, 2), 'utf-8');
      logger.debug('Guides cache saved to disk', { entries: entries.length });
    } catch (error) {
      logger.error('Failed to save guides cache to disk', { error: error instanceof Error ? error.message : String(error) });
      throw new CacheError('Failed to save guides cache to disk', error);
    }
  }

  /**
   * Loads guides from disk
   */
  private async loadGuidesFromDisk(): Promise<void> {
    try {
      const data = await fs.readFile(this.guidesFile, 'utf-8');
      const entries: Array<[string, CacheEntry<GuideDoc>]> = JSON.parse(data);

      const now = Date.now();
      let validCount = 0;

      for (const [key, entry] of entries) {
        if (now - entry.timestamp <= entry.ttl) {
          this.guidesCache.set(key, entry);
          validCount++;
        }
      }

      logger.info(`Loaded ${validCount} valid guide cache entries from disk`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        logger.info('No existing guides cache file found');
      } else {
        logger.warn('Failed to load guides cache from disk', { error: error instanceof Error ? error.message : String(error) });
      }
    }
  }

  /**
   * Gets cache statistics
   */
  getStats(): { size: number; guides: number; enabled: boolean } {
    return {
      size: this.memoryCache.size,
      guides: this.guidesCache.size,
      enabled: this.enabled
    };
  }
}
