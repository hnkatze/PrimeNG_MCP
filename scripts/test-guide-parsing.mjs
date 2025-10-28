/**
 * Test script to debug guide parsing
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractGuideSections, extractGuideTitle } from '../dist/utils/parsers.js';

async function testGuideParsing() {
  console.log('Testing guide parsing for installation page...\n');

  try {
    const url = 'https://primeng.org/installation';
    console.log(`Fetching: ${url}`);

    const response = await axios.get(url, { timeout: 30000 });
    const $ = cheerio.load(response.data);

    console.log('\n1. Extracting title...');
    const title = extractGuideTitle($);
    console.log(`   Title: "${title}"`);

    console.log('\n2. Finding h2 elements...');
    const h2Count = $('h2').length;
    console.log(`   Found ${h2Count} h2 elements`);

    $('h2').each((i, elem) => {
      console.log(`   - h2[${i}]: "${$(elem).text().trim()}"`);
    });

    console.log('\n3. Extracting sections...');
    const sections = extractGuideSections($);
    console.log(`   Extracted ${sections.length} sections`);

    sections.forEach((section, i) => {
      console.log(`\n   Section ${i + 1}: "${section.heading}"`);
      console.log(`   - Content length: ${section.content.length} chars`);
      console.log(`   - Code blocks: ${section.codeBlocks?.length || 0}`);
      if (section.content.length > 0) {
        console.log(`   - Content preview: "${section.content.substring(0, 100)}..."`);
      }
      if (section.codeBlocks && section.codeBlocks.length > 0) {
        console.log(`   - First code block: "${section.codeBlocks[0].substring(0, 80)}..."`);
      }
    });

    console.log('\n4. Checking page structure...');
    console.log(`   - Total paragraphs: ${$('p').length}`);
    console.log(`   - Total code blocks: ${$('pre code').length}`);
    console.log(`   - Total divs: ${$('div').length}`);

    // Sample the first h2 structure
    console.log('\n5. Analyzing first h2 structure...');
    const firstH2 = $('h2').first();
    console.log(`   - First h2: "${firstH2.text().trim()}"`);
    console.log(`   - Next element tag: ${firstH2.next().prop('tagName')}`);
    console.log(`   - Next element text: "${firstH2.next().text().trim().substring(0, 100)}..."`);

  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

testGuideParsing();
