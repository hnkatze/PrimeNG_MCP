/**
 * Tests for formatters
 */

import { describe, it, expect } from 'vitest';
import {
  formatComponentDoc,
  formatSearchResults,
  formatComponentList,
  capitalizeComponentName,
} from '../../../src/utils/formatters.js';
import { ComponentDoc } from '../../../src/models/ComponentDoc.js';

describe('Formatters', () => {
  describe('capitalizeComponentName', () => {
    it('should capitalize component name', () => {
      expect(capitalizeComponentName('button')).toBe('Button');
      expect(capitalizeComponentName('dialog')).toBe('Dialog');
      expect(capitalizeComponentName('inputtext')).toBe('Inputtext');
    });
  });

  describe('formatSearchResults', () => {
    it('should format search results with matches', () => {
      const results = ['button', 'splitbutton', 'togglebutton'];
      const formatted = formatSearchResults(results, 'button');

      expect(formatted).toContain('Componentes encontrados');
      expect(formatted).toContain('- button');
      expect(formatted).toContain('- splitbutton');
    });

    it('should handle empty search results', () => {
      const formatted = formatSearchResults([], 'xyz');

      expect(formatted).toContain('No se encontraron componentes');
      expect(formatted).toContain('xyz');
    });
  });

  describe('formatComponentList', () => {
    it('should format categorized component list', () => {
      const categorized = {
        Buttons: ['button', 'splitbutton'],
        Inputs: ['inputtext', 'dropdown'],
      };

      const formatted = formatComponentList(categorized);

      expect(formatted).toContain('# Componentes de PrimeNG');
      expect(formatted).toContain('## Buttons');
      expect(formatted).toContain('- button');
      expect(formatted).toContain('## Inputs');
      expect(formatted).toContain('- inputtext');
    });
  });

  describe('formatComponentDoc', () => {
    it('should format complete component documentation', () => {
      const doc: ComponentDoc = {
        name: 'button',
        description: 'Button component for Angular',
        importStatement: "import { Button } from 'primeng/button';",
        moduleImport: "import { ButtonModule } from 'primeng/button';",
        basicUsage: '<p-button label="Click" />',
        properties: [
          {
            name: 'label',
            type: 'string',
            default: 'null',
            description: 'Label text',
          },
        ],
        events: [
          {
            name: 'onClick',
            parameters: 'event',
            description: 'Callback to invoke on click',
          },
        ],
        methods: [
          {
            name: 'focus',
            parameters: 'none',
            description: 'Focuses the button',
          },
        ],
      };

      const formatted = formatComponentDoc(doc);

      expect(formatted).toContain('# BUTTON');
      expect(formatted).toContain('Button component for Angular');
      expect(formatted).toContain('## Import');
      expect(formatted).toContain('ButtonModule');
      expect(formatted).toContain('## Uso Básico');
      expect(formatted).toContain('## Properties');
      expect(formatted).toContain('| label | string | null | Label text |');
      expect(formatted).toContain('## Events');
      expect(formatted).toContain('| onClick | event | Callback to invoke on click |');
      expect(formatted).toContain('## Methods');
      expect(formatted).toContain('| focus | none | Focuses the button |');
      expect(formatted).toContain('https://primeng.org/button');
    });

    it('should handle minimal component doc without properties/events/methods', () => {
      const doc: ComponentDoc = {
        name: 'divider',
        description: 'Divider component',
        importStatement: "import { Divider } from 'primeng/divider';",
        moduleImport: "import { DividerModule } from 'primeng/divider';",
        basicUsage: '<p-divider />',
      };

      const formatted = formatComponentDoc(doc);

      expect(formatted).toContain('# DIVIDER');
      expect(formatted).toContain('Divider component');
      expect(formatted).not.toContain('## Properties');
      expect(formatted).not.toContain('## Events');
      expect(formatted).not.toContain('## Methods');
    });
  });
});
