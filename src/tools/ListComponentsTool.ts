/**
 * Tool for listing all components
 */

import { BaseTool, ToolResponse } from './BaseTool.js';
import { formatComponentList } from '../utils/formatters.js';
import { COMPONENT_CATEGORIES } from '../config/constants.js';

export class ListComponentsTool extends BaseTool {
  constructor() {
    super('list_all_components');
  }

  async execute(_args: Record<string, any>): Promise<ToolResponse> {
    return this.createResponse(formatComponentList(COMPONENT_CATEGORIES));
  }
}
