/**
 * Tests for CodeGeneratorService
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CodeGeneratorService } from '../../../src/services/CodeGeneratorService.js';

describe('CodeGeneratorService', () => {
  let codeGenerator: CodeGeneratorService;

  beforeEach(() => {
    codeGenerator = new CodeGeneratorService();
  });

  it('should generate basic component code', () => {
    const code = codeGenerator.generateComponentCode('button');

    expect(code).toContain('ButtonModule');
    expect(code).toContain('primeng/button');
    expect(code).toContain('<p-button');
    expect(code).toContain('</p-button>');
  });

  it('should generate component code with properties', () => {
    const code = codeGenerator.generateComponentCode('button', {
      label: 'Submit',
      icon: 'pi pi-check',
    });

    expect(code).toContain('label="Submit"');
    expect(code).toContain('icon="pi pi-check"');
  });

  it('should handle boolean properties correctly', () => {
    const code = codeGenerator.generateComponentCode('button', {
      disabled: true,
      outlined: false,
    });

    expect(code).toContain('disabled');
    expect(code).toContain('[outlined]="false"');
  });

  it('should handle object properties correctly', () => {
    const code = codeGenerator.generateComponentCode('button', {
      style: { width: '100px' },
    });

    expect(code).toContain('[style]');
    expect(code).toContain('width');
  });

  it('should get examples for known components', () => {
    const examples = codeGenerator.getComponentExamples('button');

    expect(examples).toContain('Ejemplos de Button');
    expect(examples).toContain('Básico');
    expect(examples).toContain('```html');
  });

  it('should return fallback message for unknown components', () => {
    const examples = codeGenerator.getComponentExamples('unknown-component');

    expect(examples).toContain('Ejemplos para unknown-component');
    expect(examples).toContain('https://primeng.org/unknown-component');
  });
});
