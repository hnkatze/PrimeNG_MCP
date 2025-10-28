/**
 * Web scraping service for PrimeNG documentation
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { ComponentDoc } from '../models/ComponentDoc.js';
import { logger } from '../utils/logger.js';
import { ScrapingError } from '../utils/errors.js';
import { retryWithBackoff } from '../utils/retry.js';
import {
  extractProperties,
  extractEvents,
  extractMethods,
  extractDescription,
  extractBasicUsage
} from '../utils/parsers.js';
import { capitalizeComponentName } from '../utils/formatters.js';
import {
  PRIMENG_BASE_URL,
  SCRAPING_HEADERS,
  NON_COMPONENT_PAGES,
  FALLBACK_COMPONENTS
} from '../config/constants.js';

export class ScraperService {
  private timeout: number;
  private retries: number;

  constructor(timeout: number = 15000, retries: number = 3) {
    this.timeout = timeout;
    this.retries = retries;
  }

  /**
   * Scrapes the list of components from PrimeNG website
   */
  async scrapeComponentList(): Promise<string[]> {
    try {
      logger.info('Scraping component list from PrimeNG website');

      const components = await retryWithBackoff(
        async () => {
          const response = await axios.get(`${PRIMENG_BASE_URL}/installation`, {
            timeout: this.timeout,
            headers: SCRAPING_HEADERS
          });

          const $ = cheerio.load(response.data);
          const componentSet = new Set<string>();

          // Find all navigation links
          $('nav a, .layout-sidebar a, a[href^="/"]').each((_i, el) => {
            const href = $(el).attr('href');
            if (href && href.startsWith('/') && href !== '/' && !href.includes('#')) {
              const path = href.replace('/', '').split('/')[0];

              // Filter out non-component pages
              if (path &&
                  !NON_COMPONENT_PAGES.includes(path) &&
                  !path.includes('guide') &&
                  !path.includes('migration') &&
                  !path.includes('ci')) {
                componentSet.add(path);
              }
            }
          });

          const componentList = Array.from(componentSet).sort();
          logger.info(`Found ${componentList.length} components`);

          return componentList;
        },
        { maxRetries: this.retries },
        'Scrape component list'
      );

      return components;
    } catch (error) {
      logger.error('Failed to scrape component list, using fallback', {
        error: error instanceof Error ? error.message : String(error)
      });

      return FALLBACK_COMPONENTS;
    }
  }

  /**
   * Scrapes documentation for a specific component
   */
  async scrapeComponentDoc(componentName: string): Promise<ComponentDoc> {
    const url = `${PRIMENG_BASE_URL}/${componentName}`;

    try {
      logger.info(`Scraping documentation for ${componentName}`, { url });

      const doc = await retryWithBackoff(
        async () => {
          const response = await axios.get(url, {
            timeout: this.timeout,
            headers: SCRAPING_HEADERS
          });

          const $ = cheerio.load(response.data);

          // Extract component information
          const description = extractDescription($, componentName);
          const basicUsage = extractBasicUsage($, componentName, this.getBasicUsageFallback(componentName));

          const doc: ComponentDoc = {
            name: componentName,
            description,
            importStatement: `import { ${capitalizeComponentName(componentName)} } from 'primeng/${componentName}';`,
            moduleImport: `import { ${capitalizeComponentName(componentName)}Module } from 'primeng/${componentName}';`,
            basicUsage,
            properties: extractProperties($),
            events: extractEvents($),
            methods: extractMethods($)
          };

          logger.info(`Successfully scraped documentation for ${componentName}`, {
            properties: doc.properties?.length || 0,
            events: doc.events?.length || 0,
            methods: doc.methods?.length || 0
          });

          return doc;
        },
        { maxRetries: this.retries },
        `Scrape ${componentName} documentation`
      );

      return doc;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to scrape documentation for ${componentName}`, { error: errorMessage });
      throw new ScrapingError(`Failed to scrape documentation for ${componentName}`, url, error);
    }
  }

  /**
   * Gets basic usage fallback for common components
   */
  private getBasicUsageFallback(component: string): string {
    const usageFallbacks: Record<string, string> = {
      button: '<p-button label="Click me" />',
      dialog: '<p-dialog header="Title" [(visible)]="visible">Content</p-dialog>',
      table: '<p-table [value]="items"><ng-template pTemplate="header">...</ng-template></p-table>',
      dropdown: '<p-dropdown [options]="cities" [(ngModel)]="selectedCity" optionLabel="name" />',
      calendar: '<p-calendar [(ngModel)]="date" />',
      inputtext: '<input type="text" pInputText [(ngModel)]="value" />',
    };

    return usageFallbacks[component] || `<p-${component}></p-${component}>`;
  }
}
