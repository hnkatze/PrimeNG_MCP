/**
 * Tool for getting component examples
 */

import { BaseTool, ToolResponse } from './BaseTool.js';
import { ScraperService } from '../services/ScraperService.js';
import { CacheService } from '../services/CacheService.js';
import { CodeGeneratorService } from '../services/CodeGeneratorService.js';
import { ComponentDoc } from '../models/ComponentDoc.js';
import { detectCodeLanguage } from '../utils/formatters.js';
import { logger } from '../utils/logger.js';

export class GetExamplesTool extends BaseTool {
  private scraperService: ScraperService;
  private cacheService: CacheService;
  private codeGenerator: CodeGeneratorService;
  private availableComponents: string[];

  constructor(
    scraperService: ScraperService,
    cacheService: CacheService,
    codeGenerator: CodeGeneratorService,
    availableComponents: string[]
  ) {
    super('get_component_examples');
    this.scraperService = scraperService;
    this.cacheService = cacheService;
    this.codeGenerator = codeGenerator;
    this.availableComponents = availableComponents;
  }

  async execute(args: Record<string, any>): Promise<ToolResponse> {
    const component = args.component as string;

    if (!component) {
      return this.createErrorResponse('Component name is required');
    }

    // Validate component exists
    if (!this.availableComponents.includes(component)) {
      return this.createErrorResponse(
        `Component "${component}" not found. Use list_all_components to see available components.`
      );
    }

    try {
      // Check cache first
      const cachedDoc = await this.cacheService.get(component);

      if (cachedDoc) {
        logger.info(`Returning cached examples for ${component}`);
        return this.createResponse(this.formatExamples(component, cachedDoc));
      }

      // Scrape documentation
      logger.info(`Scraping examples for ${component}`);
      const doc = await this.scraperService.scrapeComponentDoc(component);

      // Cache the result
      await this.cacheService.set(component, doc);

      return this.createResponse(this.formatExamples(component, doc));
    } catch (error) {
      // Fallback to hardcoded examples
      logger.warn(`Failed to scrape examples for ${component}, using fallback`, {
        error: error instanceof Error ? error.message : String(error)
      });
      const fallbackExamples = this.codeGenerator.getComponentExamples(component);
      return this.createResponse(fallbackExamples);
    }
  }

  /**
   * Formats examples from ComponentDoc into markdown
   */
  private formatExamples(component: string, doc: ComponentDoc): string {
    // If no scraped examples, use hardcoded ones
    if (!doc.examples || doc.examples.length === 0) {
      logger.info(`No scraped examples for ${component}, using hardcoded examples`);
      return this.codeGenerator.getComponentExamples(component);
    }

    let text = `# Ejemplos de ${component.toUpperCase()}\n\n`;
    text += `${doc.description}\n\n`;

    // Show all scraped examples
    doc.examples.forEach((example, index) => {
      const lang = detectCodeLanguage(example);
      text += `## Ejemplo ${index + 1}\n\`\`\`${lang}\n${example}\n\`\`\`\n\n`;
    });

    text += `---\n📄 Documentación completa: https://primeng.org/${component}\n`;

    return text;
  }
}
