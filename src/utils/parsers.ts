/**
 * HTML parsing utilities for extracting component documentation
 */

import * as cheerio from 'cheerio';
import { ComponentProperty, ComponentEvent, ComponentMethod } from '../models/ComponentDoc.js';

/**
 * Extracts component properties from HTML table
 */
export function extractProperties($: cheerio.CheerioAPI): ComponentProperty[] {
  const properties: ComponentProperty[] = [];

  $('table').each((_i, table) => {
    const headers: string[] = [];
    $(table).find('thead th').each((_j, th) => {
      headers.push($(th).text().trim().toLowerCase());
    });

    // Verify if it's a properties table
    if (headers.includes('name') && (headers.includes('type') || headers.includes('default'))) {
      $(table).find('tbody tr').each((_j, tr) => {
        const cells: string[] = [];
        $(tr).find('td').each((_k, td) => {
          cells.push($(td).text().trim());
        });

        if (cells.length >= 3) {
          const nameIdx = headers.indexOf('name');
          const typeIdx = headers.indexOf('type');
          const defaultIdx = headers.indexOf('default');
          const descIdx = headers.indexOf('description');

          if (nameIdx >= 0 && cells[nameIdx]) {
            properties.push({
              name: cells[nameIdx] || '',
              type: typeIdx >= 0 ? cells[typeIdx] || 'any' : 'any',
              default: defaultIdx >= 0 ? cells[defaultIdx] : undefined,
              description: descIdx >= 0 ? cells[descIdx] || '' : ''
            });
          }
        }
      });
    }
  });

  return properties.slice(0, 20); // Limit to 20 properties
}

/**
 * Extracts component events from HTML table
 */
export function extractEvents($: cheerio.CheerioAPI): ComponentEvent[] {
  const events: ComponentEvent[] = [];

  $('table').each((_i, table) => {
    const headers: string[] = [];
    $(table).find('thead th').each((_j, th) => {
      headers.push($(th).text().trim().toLowerCase());
    });

    // Event tables typically have: name, parameters, description
    if (headers.includes('name') && headers.includes('parameters')) {
      $(table).find('tbody tr').each((_j, tr) => {
        const cells: string[] = [];
        $(tr).find('td').each((_k, td) => {
          cells.push($(td).text().trim());
        });

        if (cells.length >= 2) {
          const nameIdx = headers.indexOf('name');
          const paramsIdx = headers.indexOf('parameters');
          const descIdx = headers.indexOf('description');

          if (nameIdx >= 0 && cells[nameIdx]) {
            events.push({
              name: cells[nameIdx] || '',
              parameters: paramsIdx >= 0 ? cells[paramsIdx] || '' : '',
              description: descIdx >= 0 ? cells[descIdx] || '' : ''
            });
          }
        }
      });
    }
  });

  return events.slice(0, 15); // Limit to 15 events
}

/**
 * Extracts component methods from HTML table
 */
export function extractMethods($: cheerio.CheerioAPI): ComponentMethod[] {
  const methods: ComponentMethod[] = [];

  // Look specifically for "Methods" sections
  $('h2:contains("Methods"), h3:contains("Methods")').each((_i, heading) => {
    const table = $(heading).nextAll('table').first();
    if (table.length > 0) {
      const headers: string[] = [];
      table.find('thead th').each((_j, th) => {
        headers.push($(th).text().trim().toLowerCase());
      });

      table.find('tbody tr').each((_j, tr) => {
        const cells: string[] = [];
        $(tr).find('td').each((_k, td) => {
          cells.push($(td).text().trim());
        });

        if (cells.length >= 2) {
          const nameIdx = headers.indexOf('name');
          const paramsIdx = headers.indexOf('parameters');
          const descIdx = headers.indexOf('description');

          if (nameIdx >= 0 && cells[nameIdx]) {
            methods.push({
              name: cells[nameIdx] || '',
              parameters: paramsIdx >= 0 ? cells[paramsIdx] || '' : '',
              description: descIdx >= 0 ? cells[descIdx] || '' : ''
            });
          }
        }
      });
    }
  });

  return methods.slice(0, 10); // Limit to 10 methods
}

/**
 * Extracts component description from meta tag
 */
export function extractDescription($: cheerio.CheerioAPI, componentName: string): string {
  const metaDescription = $('meta[name="description"]').attr('content');
  return metaDescription || `Componente ${componentName} de PrimeNG`;
}

/**
 * Extracts basic usage code from first code block
 */
export function extractBasicUsage($: cheerio.CheerioAPI, component: string, fallback: string): string {
  const firstCodeBlock = $('pre code').first().text().trim();
  if (firstCodeBlock && firstCodeBlock.includes(component) && firstCodeBlock.length < 300) {
    return firstCodeBlock;
  }
  return fallback;
}

/**
 * Extracts guide sections (for documentation pages)
 * NOTE: PrimeNG uses Angular components, so content may be in the full DOM rather than sibling elements
 */
export function extractGuideSections($: cheerio.CheerioAPI): Array<{ heading: string; content: string; codeBlocks?: string[] }> {
  const sections: Array<{ heading: string; content: string; codeBlocks?: string[] }> = [];

  // First, collect all paragraphs and code blocks from the entire page
  const allParagraphs: string[] = [];
  $('p').each((_i, p) => {
    const text = $(p).text().trim();
    if (text.length > 20 && !text.includes('©') && text !== '...') {
      allParagraphs.push(text);
    }
  });

  const allCodeBlocks: string[] = [];
  $('pre code, code').each((_i, code) => {
    const text = $(code).text().trim();
    // Only include substantial code blocks
    if (text.length > 15 && (text.includes('\n') || text.includes('import') || text.includes('npm') || text.includes('<'))) {
      allCodeBlocks.push(text);
    }
  });

  // Extract h2 headings
  const headings: string[] = [];
  $('h2').each((_i, h2) => {
    const heading = $(h2).text().trim().replace(/\s*#\s*$/, '');
    if (heading) {
      headings.push(heading);
    }
  });

  // If we have content, create sections
  // For guide pages, distribute paragraphs and code blocks among sections
  if (headings.length > 0 && (allParagraphs.length > 0 || allCodeBlocks.length > 0)) {
    const parasPerSection = Math.max(1, Math.floor(allParagraphs.length / headings.length));
    const codesPerSection = Math.max(1, Math.floor(allCodeBlocks.length / headings.length));

    headings.forEach((heading, i) => {
      const startPara = i * parasPerSection;
      const endPara = i === headings.length - 1 ? allParagraphs.length : (i + 1) * parasPerSection;
      const sectionParas = allParagraphs.slice(startPara, endPara);

      const startCode = i * codesPerSection;
      const endCode = i === headings.length - 1 ? allCodeBlocks.length : (i + 1) * codesPerSection;
      const sectionCodes = allCodeBlocks.slice(startCode, endCode);

      if (sectionParas.length > 0 || sectionCodes.length > 0) {
        sections.push({
          heading,
          content: sectionParas.join('\n\n'),
          codeBlocks: sectionCodes.length > 0 ? sectionCodes : undefined
        });
      }
    });
  }

  return sections;
}

/**
 * Extracts all code blocks from a guide page
 */
export function extractGuideCodeBlocks($: cheerio.CheerioAPI): string[] {
  const codeBlocks: string[] = [];

  $('pre code, code').each((_i, el) => {
    const code = $(el).text().trim();
    if (code.length > 10) {
      codeBlocks.push(code);
    }
  });

  return codeBlocks;
}

/**
 * Extracts guide title from h1
 */
export function extractGuideTitle($: cheerio.CheerioAPI): string {
  return $('h1').first().text().trim();
}
