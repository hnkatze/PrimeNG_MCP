/**
 * Tool for searching components
 */

import { BaseTool, ToolResponse } from './BaseTool.js';
import { formatSearchResults } from '../utils/formatters.js';

export class SearchComponentsTool extends BaseTool {
  private availableComponents: string[];

  constructor(availableComponents: string[]) {
    super('search_components');
    this.availableComponents = availableComponents;
  }

  async execute(args: Record<string, any>): Promise<ToolResponse> {
    const query = args.query as string;

    if (!query) {
      return this.createErrorResponse('Search query is required');
    }

    const results = this.availableComponents.filter(comp =>
      comp.toLowerCase().includes(query.toLowerCase())
    );

    return this.createResponse(formatSearchResults(results, query));
  }
}
