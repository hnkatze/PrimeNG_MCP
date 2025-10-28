/**
 * Try to find the actual content anywhere in the page
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

async function findContent() {
  console.log('Searching for installation content...\n');

  try {
    const url = 'https://primeng.org/installation';
    const response = await axios.get(url, { timeout: 30000 });
    const $ = cheerio.load(response.data);

    // Search for text that should be in the installation guide
    const searchTerms = ['npm install primeng', 'providePrimeNG', 'Angular CLI'];

    for (const term of searchTerms) {
      console.log(`\nSearching for: "${term}"`);

      // Find all elements containing this text
      const elements = $('*').filter(function() {
        return $(this).text().includes(term);
      });

      console.log(`Found in ${elements.length} elements`);

      elements.slice(0, 3).each((i, elem) => {
        const $elem = $(elem);
        const tag = $elem.prop('tagName');
        const classes = $elem.attr('class') || 'none';
        console.log(`  ${i + 1}. <${tag}> class="${classes}"`);
        console.log(`     Text snippet: "${$elem.text().trim().substring(0, 100)}..."`);
      });
    }

    // Check if content is in script tags (might be JSON data for Angular)
    console.log('\n\nChecking script tags for JSON data...');
    const scripts = $('script[type="application/json"]');
    console.log(`Found ${scripts.length} JSON script tags`);

    scripts.each((i, script) => {
      const content = $(script).html();
      if (content && content.includes('installation')) {
        console.log(`Script ${i + 1} contains "installation" - length: ${content.length}`);
      }
    });

    // Check for any pre-rendered content in the body
    console.log('\n\nAll code blocks on page:');
    const codeBlocks = $('pre code, code');
    console.log(`Found ${codeBlocks.length} code elements`);

    codeBlocks.slice(0, 5).each((i, code) => {
      const text = $(code).text().trim();
      if (text.length > 10) {
        console.log(`  ${i + 1}. "${text.substring(0, 60)}..."`);
      }
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

findContent();
