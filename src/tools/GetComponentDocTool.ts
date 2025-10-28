/**
 * Tool for getting component documentation
 */

import { BaseTool, ToolResponse } from './BaseTool.js';
import { ScraperService } from '../services/ScraperService.js';
import { CacheService } from '../services/CacheService.js';
import { formatComponentDoc } from '../utils/formatters.js';
import { logger } from '../utils/logger.js';

export class GetComponentDocTool extends BaseTool {
  private scraperService: ScraperService;
  private cacheService: CacheService;
  private availableComponents: string[];

  constructor(
    scraperService: ScraperService,
    cacheService: CacheService,
    availableComponents: string[]
  ) {
    super('get_component_doc');
    this.scraperService = scraperService;
    this.cacheService = cacheService;
    this.availableComponents = availableComponents;
  }

  async execute(args: Record<string, any>): Promise<ToolResponse> {
    const component = args.component as string;

    if (!component) {
      return this.createErrorResponse('Component name is required');
    }

    // Check cache first
    const cachedDoc = await this.cacheService.get(component);
    if (cachedDoc) {
      logger.info(`Returning cached documentation for ${component}`);
      return this.createResponse(formatComponentDoc(cachedDoc));
    }

    // Scrape documentation
    try {
      const doc = await this.scraperService.scrapeComponentDoc(component);

      // Cache the result
      await this.cacheService.set(component, doc);

      return this.createResponse(formatComponentDoc(doc));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const suggestion = this.availableComponents.slice(0, 10).join(', ');

      return this.createErrorResponse(
        `Failed to get documentation for ${component}: ${errorMessage}\n\nTry one of these: ${suggestion}...`
      );
    }
  }
}
