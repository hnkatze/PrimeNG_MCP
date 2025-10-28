/**
 * Tool for getting PrimeNG theming guide
 */

import { GetGuideTool } from './GetGuideTool.js';
import { DocsScraperService } from '../services/DocsScraperService.js';
import { CacheService } from '../services/CacheService.js';

export class GetThemingGuideTool extends GetGuideTool {
  constructor(scraperService: DocsScraperService, cacheService: CacheService) {
    super('get_theming_guide', 'theming', scraperService, cacheService);
  }
}
