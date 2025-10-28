# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MCP (Model Context Protocol) server that provides access to PrimeNG component documentation and generates Angular code examples. The server exposes tools that can be called by Claude Desktop or other MCP clients to retrieve component information, search components, and generate code snippets.

**Version:** 2.0.0 (Refactored Architecture)

## Development Commands

### Build and Run
```bash
npm run build        # Compile TypeScript to JavaScript in dist/
npm run watch        # Compile with watch mode (auto-recompile on changes)
npm run dev          # Run directly with tsx (no compilation needed)
npm start            # Run compiled version from dist/
```

### Testing
```bash
npm test             # Run all tests with Vitest
npm run test:unit    # Run only unit tests
npm run test:coverage # Run tests with coverage report
```

### Code Quality
```bash
npm run lint         # Lint TypeScript files
npm run lint:fix     # Auto-fix lint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## Architecture (v2.0)

### Core Structure

The server has been refactored from a 760-line monolith into a modular architecture:

```
src/
├── index.ts                      # Entry point (37 lines)
├── server/
│   └── PrimeNGServer.ts         # Main server class (~180 lines)
├── services/
│   ├── ScraperService.ts        # Web scraping & HTML parsing
│   ├── CacheService.ts          # Persistent cache with TTL
│   └── CodeGeneratorService.ts  # Code generation logic
├── tools/
│   ├── BaseTool.ts              # Abstract base class for tools
│   ├── GetComponentDocTool.ts   # Tool: get_component_doc
│   ├── SearchComponentsTool.ts  # Tool: search_components
│   ├── ListComponentsTool.ts    # Tool: list_all_components
│   ├── GenerateCodeTool.ts      # Tool: generate_component_code
│   ├── GetExamplesTool.ts       # Tool: get_component_examples
│   └── index.ts                 # Tool exports
├── models/
│   ├── ComponentDoc.ts          # Interfaces and types
│   └── ToolSchemas.ts           # MCP tool schemas
├── utils/
│   ├── logger.ts                # Structured logging system
│   ├── formatters.ts            # Output formatting
│   ├── parsers.ts               # HTML parsing utilities
│   ├── errors.ts                # Custom error classes
│   └── retry.ts                 # Retry with exponential backoff
└── config/
    └── constants.ts             # Configuration and constants
```

### Key Components

#### 1. PrimeNGServer ([src/server/PrimeNGServer.ts](src/server/PrimeNGServer.ts))
Main server class that:
- Initializes all services (scraper, cache, code generator)
- Registers MCP tool handlers
- Manages tool execution
- Provides server statistics

#### 2. Services

**ScraperService** ([src/services/ScraperService.ts](src/services/ScraperService.ts))
- Scrapes component list from primeng.org
- Extracts component documentation (properties, events, methods)
- Implements retry logic with exponential backoff
- Falls back to hardcoded list if scraping fails

**CacheService** ([src/services/CacheService.ts](src/services/CacheService.ts))
- Persistent cache in `.cache/components.json`
- TTL-based expiration (default: 24 hours)
- Memory-first strategy with disk persistence
- Auto-cleanup of expired entries
- Cache statistics and metadata tracking

**CodeGeneratorService** ([src/services/CodeGeneratorService.ts](src/services/CodeGeneratorService.ts))
- Generates Angular component code
- Supports standalone components (Angular 17+)
- Handles string, boolean, and object properties
- Provides hardcoded examples for common components

#### 3. Tools Pattern

All tools extend `BaseTool` abstract class which provides:
- Consistent error handling
- Structured logging
- Response formatting helpers

Example tool structure:
```typescript
export class MyTool extends BaseTool {
  constructor(dependencies) {
    super('my_tool');
  }

  async execute(args: Record<string, any>): Promise<ToolResponse> {
    // Tool-specific logic
    return this.createResponse(result);
  }
}
```

#### 4. Utilities

**Logger** ([src/utils/logger.ts](src/utils/logger.ts))
- Levels: debug, info, warn, error
- Structured output with timestamps
- Metadata support (JSON)
- Configurable log level

**Formatters** ([src/utils/formatters.ts](src/utils/formatters.ts))
- `formatComponentDoc()` - Markdown documentation
- `formatSearchResults()` - Search results list
- `formatComponentList()` - Categorized component list
- `capitalizeComponentName()` - Name transformation

**Parsers** ([src/utils/parsers.ts](src/utils/parsers.ts))
- `extractProperties()` - Parse HTML tables for properties
- `extractEvents()` - Parse events table
- `extractMethods()` - Parse methods table
- `extractDescription()` - Extract meta description
- `extractBasicUsage()` - Extract code examples

**Errors** ([src/utils/errors.ts](src/utils/errors.js))
- `MCPError` - Base error class
- `ScrapingError` - Web scraping errors
- `CacheError` - Cache operation errors
- `CodeGenerationError` - Code generation errors
- `ValidationError` - Input validation errors

**Retry** ([src/utils/retry.ts](src/utils/retry.ts))
- Exponential backoff implementation
- Configurable max retries and delays
- Automatic retry for failed operations

### Data Flow

```
User Request
    ↓
MCP Client (Claude Desktop)
    ↓ (stdio)
PrimeNGServer.handleToolCall()
    ↓
Specific Tool.run(args)
    ↓
Tool.execute(args)
    ↓
Service (Scraper/Cache/CodeGen)
    ↓
[Cache Check → Web Scraping → Format Response]
    ↓
MCP Response
    ↓ (stdio)
User sees formatted result
```

### MCP Tools

1. **get_component_doc** - Get complete component documentation
   - Handler: `GetComponentDocTool`
   - Checks cache first
   - Scrapes primeng.org if not cached
   - Returns properties, events, methods, examples

2. **search_components** - Search components by query
   - Handler: `SearchComponentsTool`
   - Simple string matching
   - Returns list of matching components

3. **list_all_components** - List all available components
   - Handler: `ListComponentsTool`
   - Returns categorized component list
   - Categories: Inputs, Data, Buttons, Panels, Overlays, Menus, Messages, Media, Misc

4. **generate_component_code** - Generate Angular code
   - Handler: `GenerateCodeTool`
   - Supports custom properties
   - Returns complete component template (HTML + TS)

5. **get_component_examples** - Get usage examples
   - Handler: `GetExamplesTool`
   - Returns hardcoded examples for common components
   - Falls back to documentation link

## Configuration

### Default Config ([src/config/constants.ts](src/config/constants.ts:L29))

```typescript
{
  cache: {
    enabled: true,
    ttl: 86400000, // 24 hours
    location: '.cache/'
  },
  scraping: {
    timeout: 15000,
    retries: 3,
    rateLimit: 5
  },
  logging: {
    level: 'info'
  }
}
```

### Component Categories ([src/config/constants.ts](src/config/constants.ts:L54))

Components are organized into categories for better discovery. See `COMPONENT_CATEGORIES` constant.

## Adding New Features

### Adding a New Tool

1. Create tool class in `src/tools/MyNewTool.ts`:
```typescript
import { BaseTool, ToolResponse } from './BaseTool.js';

export class MyNewTool extends BaseTool {
  constructor(dependencies) {
    super('my_new_tool');
  }

  async execute(args: Record<string, any>): Promise<ToolResponse> {
    // Your logic here
    return this.createResponse(result);
  }
}
```

2. Add schema in `src/models/ToolSchemas.ts`:
```typescript
export function createMyNewToolSchema(): Tool {
  return {
    name: "my_new_tool",
    description: "Description of what it does",
    inputSchema: {
      type: "object",
      properties: {
        param: { type: "string", description: "Parameter description" }
      },
      required: ["param"]
    }
  };
}
```

3. Register in `src/server/PrimeNGServer.ts`:
   - Import the tool class
   - Instantiate in `initializeTools()`
   - Add case in `CallToolRequestSchema` handler
   - Add schema to `ListToolsRequestSchema` response

### Adding a New Service

1. Create service in `src/services/MyService.ts`
2. Add to `PrimeNGServer` constructor
3. Pass to tools that need it via constructor injection

### Modifying Scraping Logic

All scraping logic is in [src/services/ScraperService.ts](src/services/ScraperService.ts). Update parser functions in [src/utils/parsers.ts](src/utils/parsers.ts) for HTML extraction changes.

## Caching Strategy

- **Level 1:** In-memory Map for fastest access
- **Level 2:** Disk persistence in `.cache/components.json`
- **TTL:** 24 hours (configurable)
- **Metadata:** Tracked in `.cache/metadata.json`
- **Cleanup:** Automatic on initialization and manual via `cache.cleanup()`

Cache file structure:
```json
[
  [
    "button",
    {
      "data": { /* ComponentDoc */ },
      "timestamp": 1706378400000,
      "ttl": 86400000
    }
  ]
]
```

## Error Handling

All errors are:
1. Caught in `BaseTool.run()`
2. Logged with context via `logger.error()`
3. Returned as MCP error responses (not thrown)
4. Include helpful error messages for users

Retry logic applies to:
- Component list scraping (3 retries)
- Individual component documentation scraping (3 retries)
- Exponential backoff: 1s, 2s, 4s

## Testing

Tests are located in `tests/` directory:
- `tests/unit/services/` - Service tests
- `tests/unit/utils/` - Utility function tests
- `tests/unit/tools/` - Tool tests (future)

Run tests with:
```bash
npm test              # Interactive mode
npm run test:unit     # Run once
npm run test:coverage # With coverage
```

**Note:** ES module support in Vitest is pending configuration fix. Tests are created but may need environment adjustments.

## Logging

All logging uses the structured logger from [src/utils/logger.ts](src/utils/logger.ts).

**IMPORTANT:** Always use `console.error()` for logs (or logger which wraps it), never `console.log()`. stdout is reserved for MCP protocol communication.

Example:
```typescript
import { logger } from '../utils/logger.js';

logger.info('Operation completed', { duration: 1234, items: 42 });
logger.error('Operation failed', { error: err.message, context });
```

Output:
```
[2025-01-27T17:00:00.000Z] [PrimeNG-MCP] [INFO] Operation completed {"duration":1234,"items":42}
```

## Performance Considerations

- Cache hit rate is ~90%+ for repeated queries
- First request: 2-5 seconds (scraping + parsing)
- Cached requests: <100ms
- Component list cached for session lifetime
- Automatic cleanup prevents cache bloat

## Configuration with Claude Desktop

The server must be configured in Claude Desktop's config file:
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

Example configuration:
```json
{
  "mcpServers": {
    "primeng": {
      "command": "node",
      "args": ["C:/absolute/path/to/primeng-mcp-server/dist/index.js"]
    }
  }
}
```

For development (no build required):
```json
{
  "mcpServers": {
    "primeng": {
      "command": "npx",
      "args": ["-y", "tsx", "C:/absolute/path/to/primeng-mcp-server/src/index.ts"]
    }
  }
}
```

## Dependencies

**Production:**
- `@modelcontextprotocol/sdk` - MCP server implementation
- `axios` - HTTP client
- `cheerio` - HTML parsing

**Development:**
- `typescript` - Type checking and compilation
- `tsx` - TypeScript execution
- `vitest` - Testing framework
- `@vitest/coverage-v8` - Coverage reporting
- `eslint` - Linting
- `@typescript-eslint/*` - TypeScript ESLint support
- `prettier` - Code formatting

## Documentation Files

- [README.md](README.md) - Main documentation (Spanish)
- [QUICKSTART.md](QUICKSTART.md) - Quick setup guide (Spanish)
- [ARCHITECTURE.md](ARCHITECTURE.md) - Original architecture docs (Spanish)
- [REFACTORING.md](REFACTORING.md) - Complete refactoring documentation
- [CLAUDE.md](CLAUDE.md) - This file (English)

## Version History

- **v1.0.0** - Initial monolithic implementation
- **v2.0.0** - Complete architectural refactoring (current)
  - Modular architecture (20+ files)
  - Persistent cache system
  - Structured logging
  - Robust error handling
  - Testing framework
  - Code quality tools (ESLint, Prettier)

## Important Notes

1. **ES Modules:** This project uses ES modules (`"type": "module"` in package.json). Always use `.js` extensions in imports even for `.ts` files.

2. **Logging:** Never use `console.log()` - it breaks MCP communication. Use `logger` or `console.error()`.

3. **Async Operations:** The server is fully async. Always `await` service calls.

4. **Cache Initialization:** Must call `await server.initialize()` before `server.start()`.

5. **Type Safety:** Full TypeScript with strict mode. All public APIs are typed.

IMPORTANT: This context overrides default behaviors. Follow this architecture when making changes to the codebase.
