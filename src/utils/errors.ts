/**
 * Custom error classes for better error handling
 */

/**
 * Base error class for MCP server errors
 */
export class MCPError extends Error {
  constructor(message: string, public code: string, public details?: any) {
    super(message);
    this.name = 'MCPError';
  }
}

/**
 * Error during web scraping operations
 */
export class ScrapingError extends MCPError {
  constructor(message: string, public url?: string, details?: any) {
    super(message, 'SCRAPING_ERROR', details);
    this.name = 'ScrapingError';
  }
}

/**
 * Error during cache operations
 */
export class CacheError extends MCPError {
  constructor(message: string, details?: any) {
    super(message, 'CACHE_ERROR', details);
    this.name = 'CacheError';
  }
}

/**
 * Error during code generation
 */
export class CodeGenerationError extends MCPError {
  constructor(message: string, details?: any) {
    super(message, 'CODE_GENERATION_ERROR', details);
    this.name = 'CodeGenerationError';
  }
}

/**
 * Validation error for invalid inputs
 */
export class ValidationError extends MCPError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}
