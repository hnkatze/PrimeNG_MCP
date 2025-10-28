/**
 * Tool for generating component code
 */

import { BaseTool, ToolResponse } from './BaseTool.js';
import { CodeGeneratorService } from '../services/CodeGeneratorService.js';

export class GenerateCodeTool extends BaseTool {
  private codeGenerator: CodeGeneratorService;

  constructor(codeGenerator: CodeGeneratorService) {
    super('generate_component_code');
    this.codeGenerator = codeGenerator;
  }

  async execute(args: Record<string, any>): Promise<ToolResponse> {
    const component = args.component as string;
    const properties = (args.properties as Record<string, any>) || {};

    if (!component) {
      return this.createErrorResponse('Component name is required');
    }

    const code = this.codeGenerator.generateComponentCode(component, properties);
    return this.createResponse(code);
  }
}
