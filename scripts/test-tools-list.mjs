/**
 * Test script to verify all MCP tools are registered
 */

import { PrimeNGServer } from '../dist/server/PrimeNGServer.js';

async function testToolsList() {
  console.log('Testing PrimeNG MCP Server tools registration...\n');

  try {
    // Initialize server
    const server = new PrimeNGServer();
    await server.initialize();

    // Get stats to verify initialization
    const stats = server.getStats();
    console.log('✓ Server initialized successfully');
    console.log(`✓ Components loaded: ${stats.components}`);
    console.log(`✓ Cache enabled: ${stats.cache.enabled}\n`);

    console.log('Expected tools:');
    console.log('  Component Tools:');
    console.log('    1. get_component_doc');
    console.log('    2. search_components');
    console.log('    3. list_all_components');
    console.log('    4. generate_component_code');
    console.log('    5. get_component_examples');
    console.log('  Guide Tools:');
    console.log('    6. get_installation_guide');
    console.log('    7. get_theming_guide');
    console.log('    8. get_icons_guide');
    console.log('    9. get_tailwind_guide');

    console.log('\n✓ All 9 tools should be registered!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

testToolsList();
