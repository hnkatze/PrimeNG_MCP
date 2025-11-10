# Contributing to PrimeNG MCP Server

Thank you for your interest in contributing to PrimeNG MCP Server! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)

## 🤝 Code of Conduct

This project adheres to a simple code of conduct: be respectful, constructive, and collaborative.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/primeng-mcp-server.git
   cd primeng-mcp-server
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/original/primeng-mcp-server.git
   ```

## 💻 Development Setup

### Prerequisites

- Node.js 18+ and npm
- TypeScript knowledge
- Familiarity with MCP (Model Context Protocol)

### Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev

# Run tests
npm test
```

### Project Structure

```
src/
├── server/          # Main server class
├── services/        # Business logic (scraping, caching, code gen)
├── tools/           # MCP tool implementations
├── models/          # TypeScript interfaces
├── utils/           # Helper functions
└── config/          # Configuration constants
```

## 🔧 Making Changes

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages

Follow conventional commits format:

```
type(scope): brief description

Detailed explanation if needed

- Bullet points for additional context
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(tools): add GetExamplesTool with web scraping
fix(cache): resolve TTL expiration issue
docs(readme): update installation instructions
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run with coverage
npm run test:coverage
```

### Writing Tests

- Place tests in `tests/unit/` directory
- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert
- Mock external dependencies

Example:
```typescript
import { describe, it, expect } from 'vitest';

describe('CacheService', () => {
  it('should store and retrieve values correctly', async () => {
    // Arrange
    const cache = new CacheService();

    // Act
    await cache.set('key', 'value');
    const result = await cache.get('key');

    // Assert
    expect(result).toBe('value');
  });
});
```

## 📤 Submitting Changes

### Pull Request Process

1. **Update your fork**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** and commit:
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** on GitHub

### PR Guidelines

- ✅ Provide a clear description of changes
- ✅ Reference related issues (e.g., "Fixes #123")
- ✅ Include screenshots for UI changes
- ✅ Ensure all tests pass
- ✅ Update documentation if needed
- ✅ Keep PRs focused (one feature/fix per PR)

## 📐 Coding Standards

### TypeScript Guidelines

- Use TypeScript strict mode
- Add type annotations for all public APIs
- Prefer `interface` over `type` for object shapes
- Use meaningful variable names
- Add JSDoc comments for public functions

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Lint code
npm run lint

# Auto-fix issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Best Practices

1. **Follow existing patterns**: Look at existing code for consistency
2. **SOLID principles**: Write modular, testable code
3. **Error handling**: Always handle errors gracefully
4. **Logging**: Use the logger utility, never `console.log()`
5. **Documentation**: Update CLAUDE.md and README.md when needed

### File Organization

- One class/interface per file
- Use barrel exports (`index.ts`) in directories
- Import with `.js` extension (ES modules requirement)
- Group imports: external → internal → types

Example:
```typescript
// External dependencies
import axios from 'axios';
import * as cheerio from 'cheerio';

// Internal modules
import { logger } from '../utils/logger.js';
import { ScrapingError } from '../utils/errors.js';

// Types
import { ComponentDoc } from '../models/ComponentDoc.js';
```

## 🐛 Reporting Bugs

When reporting bugs, include:

- **Description**: Clear description of the issue
- **Steps to reproduce**: Detailed steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: Node version, OS, etc.
- **Logs**: Relevant error messages

## 💡 Feature Requests

For feature requests, provide:

- **Use case**: Why is this needed?
- **Proposed solution**: How should it work?
- **Alternatives**: Other approaches considered
- **Examples**: Code examples if applicable

## 📝 Documentation

- Update README.md for user-facing changes
- Update CLAUDE.md for architecture changes
- Add inline comments for complex logic
- Include JSDoc for all public APIs

## ❓ Questions?

- Check existing issues and discussions
- Read the [README.md](README.md) and [CLAUDE.md](CLAUDE.md)
- Create a discussion for general questions
- Create an issue for bugs/features

## 🎉 Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- Project documentation

Thank you for contributing! 🚀
