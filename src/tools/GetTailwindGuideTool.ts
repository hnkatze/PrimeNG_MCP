/**
 * Tool for getting PrimeNG Tailwind CSS integration guide
 */

import { GetGuideTool } from './GetGuideTool.js';
import { DocsScraperService } from '../services/DocsScraperService.js';
import { CacheService } from '../services/CacheService.js';

export class GetTailwindGuideTool extends GetGuideTool {
  constructor(scraperService: DocsScraperService, cacheService: CacheService) {
    super('get_tailwind_guide', 'tailwind', scraperService, cacheService);
  }
}
