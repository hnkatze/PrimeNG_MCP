/**
 * Tool for getting PrimeNG installation guide
 */

import { GetGuideTool } from './GetGuideTool.js';
import { DocsScraperService } from '../services/DocsScraperService.js';
import { CacheService } from '../services/CacheService.js';

export class GetInstallationGuideTool extends GetGuideTool {
  constructor(scraperService: DocsScraperService, cacheService: CacheService) {
    super('get_installation_guide', 'installation', scraperService, cacheService);
  }
}
