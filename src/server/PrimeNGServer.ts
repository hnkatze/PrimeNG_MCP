/**
 * Main PrimeNG MCP Server class
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { ScraperService } from '../services/ScraperService.js';
import { CacheService } from '../services/CacheService.js';
import { CodeGeneratorService } from '../services/CodeGeneratorService.js';
import { DocsScraperService } from '../services/DocsScraperService.js';

import {
  GetComponentDocTool,
  SearchComponentsTool,
  ListComponentsTool,
  GenerateCodeTool,
  GetExamplesTool,
  GetInstallationGuideTool,
  GetThemingGuideTool,
  GetIconsGuideTool,
  GetTailwindGuideTool,
} from '../tools/index.js';

import {
  createGetComponentDocSchema,
  createSearchComponentsSchema,
  createListAllComponentsSchema,
  createGenerateComponentCodeSchema,
  createGetComponentExamplesSchema,
  createGetInstallationGuideSchema,
  createGetThemingGuideSchema,
  createGetIconsGuideSchema,
  createGetTailwindGuideSchema,
} from '../models/ToolSchemas.js';

import { logger } from '../utils/logger.js';
import { DEFAULT_CONFIG } from '../config/constants.js';
import { ServerConfig } from '../models/ComponentDoc.js';

export class PrimeNGServer {
  private server: Server;
  private scraperService: ScraperService;
  private docsScraperService: DocsScraperService;
  private cacheService: CacheService;
  private codeGeneratorService: CodeGeneratorService;
  private components: string[] = [];
  private config: ServerConfig;

  // Component Tools
  private getComponentDocTool!: GetComponentDocTool;
  private searchComponentsTool!: SearchComponentsTool;
  private listComponentsTool!: ListComponentsTool;
  private generateCodeTool!: GenerateCodeTool;
  private getExamplesTool!: GetExamplesTool;

  // Guide Tools
  private getInstallationGuideTool!: GetInstallationGuideTool;
  private getThemingGuideTool!: GetThemingGuideTool;
  private getIconsGuideTool!: GetIconsGuideTool;
  private getTailwindGuideTool!: GetTailwindGuideTool;

  constructor(config: ServerConfig = DEFAULT_CONFIG) {
    this.config = config;

    // Initialize server
    this.server = new Server(
      {
        name: "primeng-mcp-server",
        version: "2.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize services
    this.scraperService = new ScraperService(
      config.scraping.timeout,
      config.scraping.retries
    );

    this.docsScraperService = new DocsScraperService(
      config.scraping.timeout,
      config.scraping.retries
    );

    this.cacheService = new CacheService(
      config.cache.location,
      config.cache.ttl,
      config.cache.enabled
    );

    this.codeGeneratorService = new CodeGeneratorService();

    // Set log level
    logger.setLevel(config.logging.level);
  }

  /**
   * Initializes the server
   */
  async initialize(): Promise<void> {
    logger.info('Initializing PrimeNG MCP Server');

    // Initialize cache
    await this.cacheService.initialize();

    // Scrape component list
    this.components = await this.scraperService.scrapeComponentList();
    logger.info(`Loaded ${this.components.length} components`);

    // Initialize tools
    this.initializeTools();

    // Setup request handlers
    this.setupHandlers();

    logger.info('Server initialized successfully');
  }

  /**
   * Initializes all tools
   */
  private initializeTools(): void {
    // Component tools
    this.getComponentDocTool = new GetComponentDocTool(
      this.scraperService,
      this.cacheService,
      this.components
    );

    this.searchComponentsTool = new SearchComponentsTool(this.components);
    this.listComponentsTool = new ListComponentsTool();

    this.generateCodeTool = new GenerateCodeTool(this.codeGeneratorService);
    this.getExamplesTool = new GetExamplesTool(
      this.scraperService,
      this.cacheService,
      this.codeGeneratorService,
      this.components
    );

    // Guide tools
    this.getInstallationGuideTool = new GetInstallationGuideTool(
      this.docsScraperService,
      this.cacheService
    );

    this.getThemingGuideTool = new GetThemingGuideTool(
      this.docsScraperService,
      this.cacheService
    );

    this.getIconsGuideTool = new GetIconsGuideTool(
      this.docsScraperService,
      this.cacheService
    );

    this.getTailwindGuideTool = new GetTailwindGuideTool(
      this.docsScraperService,
      this.cacheService
    );
  }

  /**
   * Sets up MCP request handlers
   */
  private setupHandlers(): void {
    // List tools handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // Component tools
          createGetComponentDocSchema(this.components),
          createSearchComponentsSchema(),
          createListAllComponentsSchema(),
          createGenerateComponentCodeSchema(this.components),
          createGetComponentExamplesSchema(this.components),
          // Guide tools
          createGetInstallationGuideSchema(),
          createGetThemingGuideSchema(),
          createGetIconsGuideSchema(),
          createGetTailwindGuideSchema(),
        ],
      };
    });

    // Call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (!args) {
        throw new Error("Missing arguments");
      }

      switch (name) {
        // Component tools
        case "get_component_doc":
          return await this.getComponentDocTool.run(args);

        case "search_components":
          return await this.searchComponentsTool.run(args);

        case "list_all_components":
          return await this.listComponentsTool.run(args);

        case "generate_component_code":
          return await this.generateCodeTool.run(args);

        case "get_component_examples":
          return await this.getExamplesTool.run(args);

        // Guide tools
        case "get_installation_guide":
          return await this.getInstallationGuideTool.run(args);

        case "get_theming_guide":
          return await this.getThemingGuideTool.run(args);

        case "get_icons_guide":
          return await this.getIconsGuideTool.run(args);

        case "get_tailwind_guide":
          return await this.getTailwindGuideTool.run(args);

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  /**
   * Starts the server
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    logger.info('PrimeNG MCP Server running on stdio');
    logger.info(`Components loaded: ${this.components.length}`);
    logger.info(`Cache status: ${this.cacheService.getStats().enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Gets server statistics
   */
  getStats(): {
    components: number;
    cache: { size: number; enabled: boolean };
  } {
    return {
      components: this.components.length,
      cache: this.cacheService.getStats(),
    };
  }
}
