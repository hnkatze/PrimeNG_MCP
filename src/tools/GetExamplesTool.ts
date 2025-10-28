/**
 * Tool for getting component examples
 */

import { BaseTool, ToolResponse } from './BaseTool.js';
import { CodeGeneratorService } from '../services/CodeGeneratorService.js';

export class GetExamplesTool extends BaseTool {
  private codeGenerator: CodeGeneratorService;

  constructor(codeGenerator: CodeGeneratorService) {
    super('get_component_examples');
    this.codeGenerator = codeGenerator;
  }

  async execute(args: Record<string, any>): Promise<ToolResponse> {
    const component = args.component as string;

    if (!component) {
      return this.createErrorResponse('Component name is required');
    }

    const examples = this.codeGenerator.getComponentExamples(component);
    return this.createResponse(examples);
  }
}
