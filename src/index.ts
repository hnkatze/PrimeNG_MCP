#!/usr/bin/env node

/**
 * PrimeNG MCP Server - Entry Point
 *
 * A Model Context Protocol server for PrimeNG documentation and code generation
 */

import { PrimeNGServer } from './server/PrimeNGServer.js';
import { DEFAULT_CONFIG } from './config/constants.js';
import { logger } from './utils/logger.js';

/**
 * Main entry point
 */
async function main() {
  try {
    // Create and initialize server
    const server = new PrimeNGServer(DEFAULT_CONFIG);
    await server.initialize();

    // Start server
    await server.start();

    // Log stats
    const stats = server.getStats();
    logger.info('Server stats', stats);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Failed to start server', { error: errorMessage });
    process.exit(1);
  }
}

// Run the server
main();
