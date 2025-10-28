/**
 * Tool for getting PrimeNG icons guide
 */

import { GetGuideTool } from './GetGuideTool.js';
import { DocsScraperService } from '../services/DocsScraperService.js';
import { CacheService } from '../services/CacheService.js';

export class GetIconsGuideTool extends GetGuideTool {
  constructor(scraperService: DocsScraperService, cacheService: CacheService) {
    super('get_icons_guide', 'icons', scraperService, cacheService);
  }
}
