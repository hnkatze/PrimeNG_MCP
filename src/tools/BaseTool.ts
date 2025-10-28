/**
 * Base class for MCP tools
 */

import { logger } from '../utils/logger.js';
import { CallToolResult, TextContent } from '@modelcontextprotocol/sdk/types.js';

export type ToolResponse = CallToolResult;

export abstract class BaseTool {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Executes the tool with given arguments
   */
  abstract execute(args: Record<string, any>): Promise<ToolResponse>;

  /**
   * Wraps execution with error handling and logging
   */
  async run(args: Record<string, any>): Promise<ToolResponse> {
    try {
      logger.info(`Executing tool: ${this.name}`, { args });
      const result = await this.execute(args);
      logger.info(`Tool ${this.name} executed successfully`);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Tool ${this.name} failed`, { error: errorMessage });

      return {
        content: [
          {
            type: "text",
            text: `Error: ${errorMessage}`,
          },
        ],
      };
    }
  }

  /**
   * Creates a successful response
   */
  protected createResponse(text: string): ToolResponse {
    return {
      content: [
        {
          type: "text",
          text,
        } as TextContent,
      ],
    };
  }

  /**
   * Creates an error response
   */
  protected createErrorResponse(message: string): ToolResponse {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${message}`,
        } as TextContent,
      ],
      isError: true,
    };
  }
}
