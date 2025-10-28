/**
 * Debug DOM structure around h2 elements
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

async function debugDOMStructure() {
  console.log('Debugging DOM structure...\n');

  try {
    const url = 'https://primeng.org/installation';
    const response = await axios.get(url, { timeout: 30000 });
    const $ = cheerio.load(response.data);

    const firstH2 = $('h2').first();
    console.log('First h2:', firstH2.text().trim());
    console.log('\nNext 3 siblings:');

    let sibling = firstH2.next();
    let count = 0;

    while (sibling.length > 0 && count < 3) {
      const tagName = sibling.prop('tagName');
      console.log(`\n${count + 1}. Tag: ${tagName}`);
      console.log(`   Classes: ${sibling.attr('class') || 'none'}`);
      console.log(`   Direct text length: ${sibling.clone().children().remove().end().text().trim().length}`);
      console.log(`   Total text length: ${sibling.text().trim().length}`);
      console.log(`   Has children: ${sibling.children().length} children`);

      // If it's a DIV, inspect its children
      if (tagName === 'DIV') {
        console.log('   Children:');
        sibling.children().each((i, child) => {
          const childTag = $(child).prop('tagName');
          const childText = $(child).text().trim();
          console.log(`     - ${childTag}: "${childText.substring(0, 60)}${childText.length > 60 ? '...' : ''}"`);
        });

        // Look for p tags
        const pTags = sibling.find('p');
        console.log(`   Paragraphs found: ${pTags.length}`);
        pTags.each((i, p) => {
          console.log(`     p[${i}]: "${$(p).text().trim().substring(0, 80)}..."`);
        });

        // Look for code blocks
        const codeTags = sibling.find('pre code');
        console.log(`   Code blocks found: ${codeTags.length}`);
        codeTags.each((i, code) => {
          console.log(`     code[${i}]: "${$(code).text().trim().substring(0, 60)}..."`);
        });
      }

      sibling = sibling.next();
      count++;
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugDOMStructure();
