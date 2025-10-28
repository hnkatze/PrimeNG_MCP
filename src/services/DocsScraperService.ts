/**
 * Documentation scraping service for PrimeNG setup and styling guides
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { GuideDoc } from '../models/ComponentDoc.js';
import { logger } from '../utils/logger.js';
import { ScrapingError } from '../utils/errors.js';
import { retryWithBackoff } from '../utils/retry.js';
import {
  extractGuideSections,
  extractDescription,
  extractGuideTitle
} from '../utils/parsers.js';
import { PRIMENG_BASE_URL, SCRAPING_HEADERS } from '../config/constants.js';

export class DocsScraperService {
  private timeout: number;
  private retries: number;

  constructor(timeout: number = 15000, retries: number = 3) {
    this.timeout = timeout;
    this.retries = retries;
  }

  /**
   * Scrapes a documentation guide page
   */
  async scrapeGuide(pageName: string): Promise<GuideDoc> {
    const url = `${PRIMENG_BASE_URL}/${pageName}`;

    try {
      logger.info(`Scraping guide: ${pageName}`, { url });

      const guide = await retryWithBackoff(
        async () => {
          const response = await axios.get(url, {
            timeout: this.timeout,
            headers: SCRAPING_HEADERS
          });

          const $ = cheerio.load(response.data);

          // Extract guide information
          const title = extractGuideTitle($) || pageName;
          const description = extractDescription($, pageName);
          const sections = extractGuideSections($);

          const guideDoc: GuideDoc = {
            name: pageName,
            title,
            description,
            sections,
            url
          };

          logger.info(`Successfully scraped guide: ${pageName}`, {
            sections: sections.length,
            title
          });

          return guideDoc;
        },
        { maxRetries: this.retries },
        `Scrape ${pageName} guide`
      );

      return guide;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to scrape guide: ${pageName}`, { error: errorMessage });
      throw new ScrapingError(`Failed to scrape guide: ${pageName}`, url, error);
    }
  }
}
