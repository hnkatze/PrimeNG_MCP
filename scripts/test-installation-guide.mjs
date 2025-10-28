/**
 * Test script to verify the get_installation_guide tool works correctly
 */

import { PrimeNGServer } from '../dist/server/PrimeNGServer.js';
import { GetInstallationGuideTool } from '../dist/tools/GetInstallationGuideTool.js';
import { DocsScraperService } from '../dist/services/DocsScraperService.js';
import { CacheService } from '../dist/services/CacheService.js';

async function testInstallationGuide() {
  console.log('Testing get_installation_guide tool...\n');

  try {
    // Initialize services
    const cacheService = new CacheService('.cache', 86400000, true);
    await cacheService.initialize();

    const scraperService = new DocsScraperService(30000, 3);

    // Create tool
    const tool = new GetInstallationGuideTool(scraperService, cacheService);

    console.log('Fetching installation guide...');
    const result = await tool.run({});

    if (result.content && result.content.length > 0) {
      const content = result.content[0].text;
      console.log('\n✓ Successfully retrieved installation guide');
      console.log(`✓ Content length: ${content.length} characters`);

      // Show first 500 characters
      console.log('\nPreview (first 500 chars):');
      console.log('─'.repeat(80));
      console.log(content.substring(0, 500) + '...');
      console.log('─'.repeat(80));

      // Check for expected content
      const hasInstallation = content.toLowerCase().includes('installation');
      const hasNpm = content.toLowerCase().includes('npm');

      console.log('\n✓ Content validation:');
      console.log(`  - Contains "installation": ${hasInstallation ? '✓' : '✗'}`);
      console.log(`  - Contains "npm": ${hasNpm ? '✓' : '✗'}`);

      if (hasInstallation && hasNpm) {
        console.log('\n✓ Installation guide tool is working correctly!');
        process.exit(0);
      } else {
        console.log('\n✗ Content validation failed');
        process.exit(1);
      }
    } else {
      console.log('✗ No content returned');
      process.exit(1);
    }
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testInstallationGuide();
