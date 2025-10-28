/**
 * Tests for CacheService
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CacheService } from '../../../src/services/CacheService.js';
import { ComponentDoc } from '../../../src/models/ComponentDoc.js';
import fs from 'fs/promises';

describe('CacheService', () => {
  let cacheService: CacheService;
  const testCacheDir = '.cache-test';

  beforeEach(async () => {
    cacheService = new CacheService(testCacheDir, 1000, true); // 1 second TTL for testing
    await cacheService.initialize();
  });

  afterEach(async () => {
    await cacheService.clear();
    try {
      await fs.rm(testCacheDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  it('should initialize successfully', async () => {
    const stats = cacheService.getStats();
    expect(stats.enabled).toBe(true);
  });

  it('should set and get a component', async () => {
    const mockDoc: ComponentDoc = {
      name: 'button',
      description: 'Button component',
      importStatement: "import { Button } from 'primeng/button';",
      moduleImport: "import { ButtonModule } from 'primeng/button';",
      basicUsage: '<p-button label="Click" />',
      properties: [],
      events: [],
      methods: [],
    };

    await cacheService.set('button', mockDoc);
    const retrieved = await cacheService.get('button');

    expect(retrieved).not.toBeNull();
    expect(retrieved?.name).toBe('button');
    expect(retrieved?.description).toBe('Button component');
  });

  it('should return null for non-existent component', async () => {
    const result = await cacheService.get('non-existent');
    expect(result).toBeNull();
  });

  it('should check if component exists in cache', async () => {
    const mockDoc: ComponentDoc = {
      name: 'button',
      description: 'Button component',
      importStatement: "import { Button } from 'primeng/button';",
      moduleImport: "import { ButtonModule } from 'primeng/button';",
      basicUsage: '<p-button label="Click" />',
    };

    await cacheService.set('button', mockDoc);
    expect(cacheService.has('button')).toBe(true);
    expect(cacheService.has('non-existent')).toBe(false);
  });

  it('should respect TTL and expire entries', async () => {
    const mockDoc: ComponentDoc = {
      name: 'button',
      description: 'Button component',
      importStatement: "import { Button } from 'primeng/button';",
      moduleImport: "import { ButtonModule } from 'primeng/button';",
      basicUsage: '<p-button label="Click" />',
    };

    await cacheService.set('button', mockDoc);

    // Should exist immediately
    expect(cacheService.has('button')).toBe(true);

    // Wait for TTL to expire (1 second + buffer)
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Should be expired
    expect(cacheService.has('button')).toBe(false);
    const result = await cacheService.get('button');
    expect(result).toBeNull();
  });

  it('should clear all cache', async () => {
    const mockDoc: ComponentDoc = {
      name: 'button',
      description: 'Button component',
      importStatement: "import { Button } from 'primeng/button';",
      moduleImport: "import { ButtonModule } from 'primeng/button';",
      basicUsage: '<p-button label="Click" />',
    };

    await cacheService.set('button', mockDoc);
    await cacheService.set('dialog', { ...mockDoc, name: 'dialog' });

    let stats = cacheService.getStats();
    expect(stats.size).toBe(2);

    await cacheService.clear();

    stats = cacheService.getStats();
    expect(stats.size).toBe(0);
  });
});
