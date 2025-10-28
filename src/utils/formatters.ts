/**
 * Formatters for component documentation output
 */

import { ComponentDoc } from '../models/ComponentDoc.js';

/**
 * Formats component documentation as markdown
 */
export function formatComponentDoc(doc: ComponentDoc): string {
  let text = `# ${doc.name.toUpperCase()}\n\n`;
  text += `${doc.description}\n\n`;
  text += `## Import\n\`\`\`typescript\n${doc.importStatement}\n${doc.moduleImport}\n\`\`\`\n\n`;
  text += `## Uso Básico\n\`\`\`html\n${doc.basicUsage}\n\`\`\`\n\n`;

  // Properties
  if (doc.properties && doc.properties.length > 0) {
    text += `## Properties\n\n`;
    text += `| Name | Type | Default | Description |\n`;
    text += `|------|------|---------|-------------|\n`;
    doc.properties.forEach(prop => {
      const defaultVal = prop.default ? prop.default : '-';
      const desc = prop.description.substring(0, 100);
      text += `| ${prop.name} | ${prop.type} | ${defaultVal} | ${desc} |\n`;
    });
    text += `\n`;
  }

  // Events
  if (doc.events && doc.events.length > 0) {
    text += `## Events\n\n`;
    text += `| Name | Parameters | Description |\n`;
    text += `|------|------------|-------------|\n`;
    doc.events.forEach(event => {
      const params = event.parameters.substring(0, 80);
      const desc = event.description.substring(0, 100);
      text += `| ${event.name} | ${params} | ${desc} |\n`;
    });
    text += `\n`;
  }

  // Methods
  if (doc.methods && doc.methods.length > 0) {
    text += `## Methods\n\n`;
    text += `| Name | Parameters | Description |\n`;
    text += `|------|------------|-------------|\n`;
    doc.methods.forEach(method => {
      const params = method.parameters.substring(0, 80);
      const desc = method.description.substring(0, 100);
      text += `| ${method.name} | ${params} | ${desc} |\n`;
    });
    text += `\n`;
  }

  text += `## Documentación completa\nhttps://primeng.org/${doc.name}\n`;

  return text;
}

/**
 * Formats search results
 */
export function formatSearchResults(results: string[], query: string): string {
  if (results.length === 0) {
    return `No se encontraron componentes que coincidan con "${query}"`;
  }
  return `Componentes encontrados:\n\n${results.map(c => `- ${c}`).join('\n')}`;
}

/**
 * Formats categorized component list
 */
export function formatComponentList(categorized: Record<string, string[]>): string {
  let text = "# Componentes de PrimeNG\n\n";
  for (const [category, components] of Object.entries(categorized)) {
    text += `## ${category}\n${components.map(c => `- ${c}`).join('\n')}\n\n`;
  }
  return text;
}

/**
 * Capitalizes component name for imports
 */
export function capitalizeComponentName(component: string): string {
  return component.charAt(0).toUpperCase() + component.slice(1);
}

/**
 * Formats guide documentation as markdown
 */
export function formatGuideDoc(guide: import('../models/ComponentDoc.js').GuideDoc): string {
  let text = `# ${guide.title.toUpperCase()}\n\n`;
  text += `${guide.description}\n\n`;

  for (const section of guide.sections) {
    text += `## ${section.heading}\n\n`;

    if (section.content) {
      text += `${section.content}\n\n`;
    }

    if (section.codeBlocks && section.codeBlocks.length > 0) {
      for (const codeBlock of section.codeBlocks) {
        // Detect code language from content
        const lang = detectCodeLanguage(codeBlock);
        text += `\`\`\`${lang}\n${codeBlock}\n\`\`\`\n\n`;
      }
    }
  }

  text += `\n---\n📄 Full documentation: ${guide.url}\n`;

  return text;
}

/**
 * Detects code language from content
 */
function detectCodeLanguage(code: string): string {
  if (code.includes('npm install') || code.includes('yarn add') || code.includes('pnpm add')) {
    return 'bash';
  }
  if (code.includes('import ') || code.includes('export ') || code.includes('@Component')) {
    return 'typescript';
  }
  if (code.includes('<') && code.includes('>') && code.includes('p-')) {
    return 'html';
  }
  if (code.includes('{') && code.includes('}') && code.includes(':')) {
    return 'json';
  }
  if (code.includes('class=') || code.includes('className=')) {
    return 'html';
  }
  return '';
}
