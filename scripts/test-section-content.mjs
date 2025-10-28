/**
 * Find all content between h2 elements
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

async function findSectionContent() {
  console.log('Finding content between h2 elements...\n');

  try {
    const url = 'https://primeng.org/installation';
    const response = await axios.get(url, { timeout: 30000 });
    const $ = cheerio.load(response.data);

    const h2Elements = $('h2').toArray();
    console.log(`Found ${h2Elements.length} h2 elements\n`);

    for (let i = 0; i < Math.min(2, h2Elements.length); i++) {
      const $h2 = $(h2Elements[i]);
      const heading = $h2.text().trim();
      console.log(`\n${'='.repeat(80)}`);
      console.log(`H2 [${i}]: "${heading}"`);
      console.log('='.repeat(80));

      // Get parent container
      const parent = $h2.parent();
      console.log(`Parent tag: ${parent.prop('tagName')}`);
      console.log(`Parent class: ${parent.attr('class') || 'none'}`);
      console.log(`Siblings in parent: ${parent.children().length}`);

      // Look at next elements until next h2
      let sibling = $h2.next();
      let siblingCount = 0;
      console.log('\nSiblings until next h2:');

      while (sibling.length > 0 && sibling.prop('tagName') !== 'H2' && siblingCount < 10) {
        const tag = sibling.prop('tagName');
        const classes = sibling.attr('class') || 'none';
        const text = sibling.text().trim();
        console.log(`  ${siblingCount + 1}. <${tag}> class="${classes}" text-length=${text.length}`);

        if (text.length > 0 && text.length < 200) {
          console.log(`     Text: "${text}"`);
        }

        sibling = sibling.next();
        siblingCount++;
      }

      // Try a different approach: look for content in the parent's children after the h2
      console.log('\nSearching parent\'s children after h2:');
      const h2Index = parent.children().index($h2);
      console.log(`H2 is child #${h2Index} of parent`);

      const nextSiblings = parent.children().slice(h2Index + 1, h2Index + 5);
      nextSiblings.each((j, elem) => {
        const $elem = $(elem);
        const tag = $elem.prop('tagName');
        const text = $elem.text().trim();
        console.log(`  Child ${h2Index + 1 + j}. <${tag}> text-length=${text.length}`);
        if (text.length > 0 && text.length < 200) {
          console.log(`     "${text}"`);
        }
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

findSectionContent();
