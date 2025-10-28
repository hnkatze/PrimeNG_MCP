/**
 * Base tool for getting PrimeNG documentation guides
 */

import { BaseTool, ToolResponse } from './BaseTool.js';
import { DocsScraperService } from '../services/DocsScraperService.js';
import { CacheService } from '../services/CacheService.js';
import { formatGuideDoc } from '../utils/formatters.js';
import { logger } from '../utils/logger.js';

export class GetGuideTool extends BaseTool {
  protected scraperService: DocsScraperService;
  protected cacheService: CacheService;
  protected guideName: string;

  constructor(
    toolName: string,
    guideName: string,
    scraperService: DocsScraperService,
    cacheService: CacheService
  ) {
    super(toolName);
    this.guideName = guideName;
    this.scraperService = scraperService;
    this.cacheService = cacheService;
  }

  async execute(_args: Record<string, any>): Promise<ToolResponse> {
    try {
      // Check cache first
      const cachedGuide = await this.cacheService.getGuide(this.guideName);
      if (cachedGuide) {
        logger.info(`Returning cached guide: ${this.guideName}`);
        return this.createResponse(formatGuideDoc(cachedGuide));
      }

      // Scrape guide
      const guide = await this.scraperService.scrapeGuide(this.guideName);

      // Cache the result
      await this.cacheService.setGuide(this.guideName, guide);

      return this.createResponse(formatGuideDoc(guide));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return this.createErrorResponse(
        `Failed to get ${this.guideName} guide: ${errorMessage}`
      );
    }
  }
}
