# PrimeNG MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-18+-green)](https://nodejs.org/)

Servidor MCP (Model Context Protocol) para acceder a la documentación de componentes PrimeNG y generar código Angular.

## ✨ Características

- 📚 **Documentación completa** - Extrae properties, events, methods y descripciones
- 🔍 **Búsqueda inteligente** - Encuentra componentes por nombre o categoría
- 💻 **Generación de código** - Crea componentes Angular listos para usar
- 📝 **Múltiples ejemplos** - Extrae todos los ejemplos de código de PrimeNG.org
- ⚡ **Cache persistente** - Almacena documentación en disco con TTL configurable
- 🌐 **Web scraping robusto** - Sistema de reintentos con exponential backoff
- 🎨 **Syntax highlighting** - Auto-detección de lenguaje para formateo
- 📖 **Guías de configuración** - Documentación de instalación, theming, iconos, etc.

## Instalación

```bash
npm install
npm run build
```

## Uso en Desarrollo

```bash
npm run dev
```

## Configuración en Claude Desktop

Añade lo siguiente a tu archivo de configuración de Claude Desktop:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "primeng": {
      "command": "node",
      "args": ["/ruta/absoluta/a/primeng-mcp-server/dist/index.js"]
    }
  }
}
```

O en modo desarrollo:

```json
{
  "mcpServers": {
    "primeng": {
      "command": "npx",
      "args": ["-y", "tsx", "/ruta/absoluta/a/primeng-mcp-server/src/index.ts"]
    }
  }
}
```

## Herramientas Disponibles

### 1. `get_component_doc`
Obtiene documentación completa de un componente.

**Parámetros:**
- `component` (string): Nombre del componente (ej: "button", "table", "dialog")

**Ejemplo de uso:**
```
¿Cuáles son las propiedades del componente Button de PrimeNG?
```

### 2. `search_components`
Busca componentes por término.

**Parámetros:**
- `query` (string): Término de búsqueda

**Ejemplo de uso:**
```
Busca componentes de PrimeNG relacionados con "input"
```

### 3. `list_all_components`
Lista todos los componentes disponibles organizados por categoría.

**Ejemplo de uso:**
```
Muéstrame todos los componentes de PrimeNG
```

### 4. `generate_component_code`
Genera código de ejemplo para un componente.

**Parámetros:**
- `component` (string): Nombre del componente
- `properties` (object, opcional): Propiedades del componente

**Ejemplo de uso:**
```
Genera código para un botón con label "Guardar" y icono "pi pi-save"
```

### 5. `get_component_examples`
Obtiene **todos los ejemplos** de código extraídos de la documentación oficial.

**Parámetros:**
- `component` (string): Nombre del componente

**Mejoras (v2.0):**
- ✨ Extrae todos los ejemplos del sitio web (no solo 1-3 hardcodeados)
- ✨ Auto-detección de lenguaje (HTML, TypeScript, etc.)
- ✨ Cache-first para respuestas rápidas
- ✨ Fallback a ejemplos hardcodeados si falla el scraping

**Ejemplo de uso:**
```
Dame ejemplos de cómo usar el componente Table de PrimeNG
```

**Resultado:** ~18 ejemplos para Button, ~7 para Dialog, etc.

## Componentes Soportados

El servidor incluye más de 70 componentes de PrimeNG:

- **Inputs**: autocomplete, calendar, checkbox, dropdown, inputtext, etc.
- **Data**: datatable, table, dataview, tree, etc.
- **Buttons**: button, splitbutton, speeddial
- **Panels**: accordion, card, panel, tabview, etc.
- **Overlays**: dialog, sidebar, tooltip
- **Menus**: breadcrumb, menu, menubar, megamenu, etc.
- **Messages**: message, toast
- **Media**: carousel, galleria, image
- Y muchos más...

## Ejemplos de Consultas

```
1. "¿Cómo uso el componente Calendar de PrimeNG?"
2. "Genera un dialog con header y footer"
3. "Busca componentes de menú"
4. "Dame ejemplos del componente Table"
5. "Lista todos los componentes de entrada"
```

## 🏗️ Arquitectura (v2.0)

El proyecto sigue una arquitectura modular y escalable:

```
primeng-mcp-server/
├── src/
│   ├── index.ts              # Entry point
│   ├── server/
│   │   └── PrimeNGServer.ts  # Main server class
│   ├── services/
│   │   ├── ScraperService.ts       # Web scraping & HTML parsing
│   │   ├── CacheService.ts         # Persistent cache with TTL
│   │   ├── CodeGeneratorService.ts # Code generation
│   │   └── DocsScraperService.ts   # Guide documentation scraping
│   ├── tools/
│   │   ├── BaseTool.ts             # Abstract base class
│   │   ├── GetComponentDocTool.ts  # Tool: get_component_doc
│   │   ├── SearchComponentsTool.ts # Tool: search_components
│   │   ├── ListComponentsTool.ts   # Tool: list_all_components
│   │   ├── GenerateCodeTool.ts     # Tool: generate_component_code
│   │   ├── GetExamplesTool.ts      # Tool: get_component_examples
│   │   └── Get*GuideTool.ts        # Guide tools (installation, theming, etc)
│   ├── models/
│   │   ├── ComponentDoc.ts   # Interfaces and types
│   │   └── ToolSchemas.ts    # MCP tool schemas
│   ├── utils/
│   │   ├── logger.ts         # Structured logging
│   │   ├── formatters.ts     # Output formatting
│   │   ├── parsers.ts        # HTML parsing utilities
│   │   ├── errors.ts         # Custom error classes
│   │   └── retry.ts          # Retry with exponential backoff
│   └── config/
│       └── constants.ts      # Configuration
├── tests/
│   └── unit/                 # Unit tests
├── dist/                     # Compiled JavaScript
├── .cache/                   # Component cache (gitignored)
└── docs/                     # Documentation (CLAUDE.md, CONTRIBUTING.md, etc)
```

## 💻 Desarrollo

### Scripts Disponibles

```bash
npm run build         # Compile TypeScript
npm run watch         # Compile with watch mode
npm run dev           # Run with tsx (no compilation)
npm start             # Run compiled version
npm test              # Run tests
npm run test:unit     # Run unit tests only
npm run test:coverage # Run with coverage
npm run lint          # Lint code
npm run lint:fix      # Auto-fix lint issues
npm run format        # Format with Prettier
```

### Añadir un Nuevo Tool

1. Crea el tool en `src/tools/MyNewTool.ts` extendiendo `BaseTool`
2. Define el schema en `src/models/ToolSchemas.ts`
3. Registra en `src/server/PrimeNGServer.ts`:
   - Inicializa en `initializeTools()`
   - Agrega case en el handler `CallToolRequestSchema`
   - Agrega schema en `ListToolsRequestSchema`

**Ejemplo:**
```typescript
// src/tools/MyNewTool.ts
import { BaseTool, ToolResponse } from './BaseTool.js';

export class MyNewTool extends BaseTool {
  constructor(dependencies) {
    super('my_new_tool');
  }

  async execute(args: Record<string, any>): Promise<ToolResponse> {
    // Tu lógica aquí
    return this.createResponse(result);
  }
}
```

### Modificar el Scraping

- **Lógica de scraping**: `src/services/ScraperService.ts`
- **Parsers HTML**: `src/utils/parsers.ts`
- **Formateo de salida**: `src/utils/formatters.ts`

Ver [CLAUDE.md](CLAUDE.md) para documentación detallada de arquitectura.

## 🎯 Mejoras Recientes (v2.0)

- ✅ **Web scraping completo** - Extrae documentación real de PrimeNG.org
- ✅ **Cache persistente** - Sistema de cache en `.cache/` con TTL de 24h
- ✅ **Múltiples ejemplos** - Extrae TODOS los ejemplos (no solo el primero)
- ✅ **Sin límites** - Elimina límites de 20 properties, 15 events, 10 methods
- ✅ **Descripciones completas** - Sin truncamiento a 100 caracteres
- ✅ **Arquitectura modular** - Separación en services, tools, utils
- ✅ **Sistema de logging** - Logger estructurado con niveles
- ✅ **Reintentos robustos** - Exponential backoff para web scraping
- ✅ **Testing** - Framework Vitest configurado
- ✅ **Code quality** - ESLint + Prettier

## 🚧 Roadmap

- [ ] Soporte para API documentation tabs en nueva estructura PrimeNG
- [ ] Validación de propiedades con schemas
- [ ] Generación de tests unitarios
- [ ] Integración con PrimeNG CLI
- [ ] Generación de código TypeScript para lógica
- [ ] Soporte para temas y estilos customizados
- [ ] CLI tool para testing local

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor lee [CONTRIBUTING.md](CONTRIBUTING.md) para detalles sobre:

- Cómo reportar bugs
- Cómo proponer nuevas características
- Guías de estilo de código
- Proceso de pull requests

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📚 Recursos

- [Documentación de PrimeNG](https://primeng.org/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP SDK para Node.js](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude Desktop](https://claude.ai/download)

## 👥 Autores

PrimeNG MCP Server Contributors

## 🙏 Agradecimientos

- PrimeNG team por su excelente biblioteca de componentes
- Anthropic por el Model Context Protocol
- Comunidad open source

---

**¿Preguntas o problemas?** Abre un [issue](https://github.com/yourusername/primeng-mcp-server/issues)
