# PrimeNG MCP Server

Servidor MCP (Model Context Protocol) para acceder a la documentación de componentes PrimeNG y generar código.

## Características

- 📚 Documentación completa de componentes PrimeNG
- 🔍 Búsqueda de componentes
- 💻 Generación automática de código
- 📝 Ejemplos prácticos de uso
- ⚡ Cache de documentación para respuestas rápidas

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
Obtiene ejemplos prácticos de uso.

**Parámetros:**
- `component` (string): Nombre del componente

**Ejemplo de uso:**
```
Dame ejemplos de cómo usar el componente Table de PrimeNG
```

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

## Arquitectura

```
primeng-mcp-server/
├── src/
│   └── index.ts          # Servidor MCP principal
├── dist/                 # Código compilado
├── package.json
├── tsconfig.json
└── README.md
```

## Desarrollo

### Añadir nuevos componentes

Edita el array `PRIMENG_COMPONENTS` en `src/index.ts`:

```typescript
const PRIMENG_COMPONENTS = [
  "accordion", "button", "table", // ... más componentes
];
```

### Añadir ejemplos personalizados

Modifica el método `getCommonExamples()` en `src/index.ts`:

```typescript
private getCommonExamples(component: string): string {
  const examples: Record<string, string> = {
    button: `...`,
    table: `...`,
    // Añade más aquí
  };
  // ...
}
```

## Mejoras Futuras

- [ ] Scraping automático de la documentación oficial de PrimeNG
- [ ] Cache persistente en disco
- [ ] Soporte para temas y estilos
- [ ] Validación de propiedades
- [ ] Generación de tests unitarios
- [ ] Integración con PrimeNG CLI
- [ ] Soporte para templates de componentes complejos
- [ ] Generación de código TypeScript para lógica de componentes

## Recursos

- [Documentación de PrimeNG](https://primeng.org/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP SDK para Node.js](https://github.com/modelcontextprotocol/typescript-sdk)

## Licencia

MIT
