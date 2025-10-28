#!/usr/bin/env node

/**
 * Test script to scrape PrimeNG documentation pages
 * This helps us understand the structure before implementing the actual tools
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';

const PAGES_TO_SCRAPE = [
  'installation',
  'theming',
  'icons',
  'tailwind'
];

const BASE_URL = 'https://primeng.org';

/**
 * Scrapes a documentation page and extracts structure
 */
async function scrapePage(pageName) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📄 Scraping: ${pageName.toUpperCase()}`);
  console.log(`${'='.repeat(80)}\n`);

  try {
    const url = `${BASE_URL}/${pageName}`;
    console.log(`🔗 URL: ${url}`);

    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    // Extract page structure
    const structure = {
      pageName,
      url,
      title: $('title').text().trim(),
      metaDescription: $('meta[name="description"]').attr('content') || '',
      headings: [],
      sections: [],
      codeBlocks: [],
      tables: [],
      lists: []
    };

    // Extract all headings
    $('h1, h2, h3, h4').each((i, el) => {
      const tag = el.name;
      const text = $(el).text().trim();
      if (text) {
        structure.headings.push({ level: tag, text });
      }
    });

    // Extract sections (try different selectors)
    $('section, .doc-section, article, .content > div').each((i, el) => {
      const sectionTitle = $(el).find('h2, h3').first().text().trim();
      const content = $(el).text().trim().substring(0, 300); // First 300 chars

      if (sectionTitle || content.length > 50) {
        structure.sections.push({
          title: sectionTitle || `Section ${i + 1}`,
          contentPreview: content.substring(0, 200) + '...'
        });
      }
    });

    // Extract code blocks
    $('pre code, .p-code, code').each((i, el) => {
      const code = $(el).text().trim();
      if (code.length > 10 && code.length < 500) {
        structure.codeBlocks.push({
          index: i,
          language: $(el).attr('class') || 'unknown',
          preview: code.substring(0, 150) + (code.length > 150 ? '...' : '')
        });
      }
    });

    // Extract tables
    $('table').each((i, table) => {
      const headers = [];
      $(table).find('thead th').each((j, th) => {
        headers.push($(th).text().trim());
      });

      const rows = [];
      $(table).find('tbody tr').slice(0, 3).each((j, tr) => {
        const cells = [];
        $(tr).find('td').each((k, td) => {
          cells.push($(td).text().trim().substring(0, 50));
        });
        rows.push(cells);
      });

      if (headers.length > 0 || rows.length > 0) {
        structure.tables.push({
          index: i,
          headers,
          sampleRows: rows,
          totalRows: $(table).find('tbody tr').length
        });
      }
    });

    // Extract lists (ul, ol)
    $('ul, ol').each((i, list) => {
      const items = [];
      $(list).find('> li').slice(0, 5).each((j, li) => {
        items.push($(li).text().trim().substring(0, 100));
      });

      if (items.length > 0) {
        structure.lists.push({
          type: list.name,
          itemCount: $(list).find('> li').length,
          sampleItems: items
        });
      }
    });

    // Extract main content text
    const mainContent = $('.doc-main, main, article, .content').first().text().trim();
    structure.mainContentLength = mainContent.length;
    structure.mainContentPreview = mainContent.substring(0, 500);

    // Print results
    printStructure(structure);

    return structure;

  } catch (error) {
    console.error(`❌ Error scraping ${pageName}:`, error.message);
    return null;
  }
}

/**
 * Pretty prints the structure
 */
function printStructure(structure) {
  console.log(`\n📊 STRUCTURE ANALYSIS\n`);

  console.log(`📌 Title: ${structure.title}`);
  console.log(`📝 Meta Description: ${structure.metaDescription}\n`);

  if (structure.headings.length > 0) {
    console.log(`📑 HEADINGS (${structure.headings.length}):`);
    structure.headings.forEach((h, i) => {
      const indent = '  '.repeat(parseInt(h.level.replace('h', '')) - 1);
      console.log(`${indent}${i + 1}. [${h.level}] ${h.text}`);
    });
    console.log('');
  }

  if (structure.sections.length > 0) {
    console.log(`📦 SECTIONS (${structure.sections.length}):`);
    structure.sections.slice(0, 5).forEach((s, i) => {
      console.log(`\n  ${i + 1}. ${s.title}`);
      console.log(`     ${s.contentPreview.substring(0, 100)}...`);
    });
    console.log('');
  }

  if (structure.codeBlocks.length > 0) {
    console.log(`💻 CODE BLOCKS (${structure.codeBlocks.length}):`);
    structure.codeBlocks.slice(0, 3).forEach((c, i) => {
      console.log(`\n  ${i + 1}. [${c.language}]`);
      console.log(`     ${c.preview.split('\n')[0]}...`);
    });
    console.log('');
  }

  if (structure.tables.length > 0) {
    console.log(`📊 TABLES (${structure.tables.length}):`);
    structure.tables.forEach((t, i) => {
      console.log(`\n  ${i + 1}. Headers: ${t.headers.join(', ')}`);
      console.log(`     Rows: ${t.totalRows}`);
    });
    console.log('');
  }

  if (structure.lists.length > 0) {
    console.log(`📋 LISTS (${structure.lists.length}):`);
    structure.lists.slice(0, 3).forEach((l, i) => {
      console.log(`\n  ${i + 1}. ${l.type.toUpperCase()} - ${l.itemCount} items`);
      l.sampleItems.slice(0, 2).forEach(item => {
        console.log(`     • ${item.substring(0, 80)}...`);
      });
    });
    console.log('');
  }

  console.log(`📏 Main Content Length: ${structure.mainContentLength} characters`);
  console.log(`\n📄 Content Preview:\n${structure.mainContentPreview}\n`);
}

/**
 * Main execution
 */
async function main() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║   PrimeNG Documentation Scraping Test                         ║
║   Testing: Installation, Theming, Icons, Tailwind             ║
╚═══════════════════════════════════════════════════════════════╝
  `);

  const results = {};

  for (const page of PAGES_TO_SCRAPE) {
    const result = await scrapePage(page);
    if (result) {
      results[page] = result;
    }

    // Wait 1 second between requests to be polite
    if (page !== PAGES_TO_SCRAPE[PAGES_TO_SCRAPE.length - 1]) {
      console.log('\n⏳ Waiting 1 second before next request...\n');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Save full results to file
  const outputPath = './scripts/scraping-results.json';
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2));

  console.log(`\n${'='.repeat(80)}`);
  console.log(`✅ COMPLETE - Results saved to: ${outputPath}`);
  console.log(`${'='.repeat(80)}\n`);

  // Print summary
  console.log(`\n📊 SUMMARY:\n`);
  for (const [page, data] of Object.entries(results)) {
    console.log(`  ${page.toUpperCase()}:`);
    console.log(`    - Headings: ${data.headings.length}`);
    console.log(`    - Code Blocks: ${data.codeBlocks.length}`);
    console.log(`    - Tables: ${data.tables.length}`);
    console.log(`    - Lists: ${data.lists.length}`);
    console.log(`    - Content: ${(data.mainContentLength / 1000).toFixed(1)}KB`);
    console.log('');
  }
}

main().catch(console.error);
