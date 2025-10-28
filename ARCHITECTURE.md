# 📐 Arquitectura del Proyecto

## Estructura de archivos

```
primeng-mcp-server/
├── src/
│   └── index.ts                 # Servidor MCP principal
├── dist/                        # Código compilado (generado)
│   ├── index.js
│   ├── index.d.ts
│   └── index.js.map
├── node_modules/                # Dependencias (generado)
├── package.json                 # Configuración de npm
├── tsconfig.json               # Configuración de TypeScript
├── .gitignore                  # Archivos a ignorar en Git
├── README.md                   # Documentación principal
├── QUICKSTART.md               # Guía de inicio rápido
├── test.mjs                    # Script de pruebas
└── claude_desktop_config.example.json  # Ejemplo de configuración
```

## Componentes principales

### 1. PrimeNGMCPServer (Clase principal)
**Ubicación:** `src/index.ts`

**Responsabilidades:**
- Inicializar el servidor MCP
- Registrar y manejar herramientas (tools)
- Gestionar el cache de componentes
- Formatear respuestas

**Métodos públicos:**
- `run()`: Inicia el servidor en modo stdio

**Métodos privados:**
- `setupHandlers()`: Configura los manejadores de requests
- `getTools()`: Define las herramientas disponibles
- `getComponentDoc()`: Obtiene documentación de un componente
- `searchComponents()`: Busca componentes por término
- `listAllComponents()`: Lista todos los componentes
- `generateComponentCode()`: Genera código de ejemplo
- `getComponentExamples()`: Obtiene ejemplos prácticos

### 2. Herramientas (Tools)

#### get_component_doc
- **Input:** `component` (string)
- **Output:** Documentación completa del componente
- **Cache:** Sí

#### search_components
- **Input:** `query` (string)
- **Output:** Lista de componentes que coinciden
- **Cache:** No

#### list_all_components
- **Input:** Ninguno
- **Output:** Todos los componentes categorizados
- **Cache:** No

#### generate_component_code
- **Input:** `component` (string), `properties` (object)
- **Output:** Código HTML/TypeScript generado
- **Cache:** No

#### get_component_examples
- **Input:** `component` (string)
- **Output:** Ejemplos prácticos
- **Cache:** Sí (parcial)

## Flujo de datos

```
Claude Desktop
    ↓ (solicitud)
StdioServerTransport
    ↓
MCP Server (index.ts)
    ↓
CallToolRequestSchema handler
    ↓
Tool específica (getComponentDoc, etc.)
    ↓ (si es necesario)
Cache o HTTP Request a primeng.org
    ↓
Formato de respuesta
    ↓
StdioServerTransport
    ↓ (respuesta)
Claude Desktop
```

## 🔄 Próximos pasos y mejoras

### Fase 1: Mejoras básicas (Corto plazo)
- [ ] Implementar scraping real de la documentación de PrimeNG
- [ ] Añadir más ejemplos para componentes comunes
- [ ] Implementar cache persistente en disco (JSON)
- [ ] Añadir logs para debugging
- [ ] Crear tests automatizados

### Fase 2: Características avanzadas (Mediano plazo)
- [ ] Sistema de actualización automática de documentación
- [ ] Soporte para versiones específicas de PrimeNG
- [ ] Generación de código TypeScript para lógica de componentes
- [ ] Validación de propiedades y tipos
- [ ] Sugerencias de accesibilidad (a11y)
- [ ] Búsqueda semántica de componentes
- [ ] Integración con Angular CLI para crear componentes directamente

### Fase 3: Ecosistema (Largo plazo)
- [ ] Soporte para PrimeReact y PrimeVue
- [ ] Generación automática de tests unitarios
- [ ] Análisis de rendimiento de componentes
- [ ] Recomendaciones de best practices
- [ ] Integración con sistemas de diseño (Figma, etc.)
- [ ] API REST paralela al servidor MCP
- [ ] Dashboard web para gestión del servidor

## 🛠️ Guía de contribución

### Añadir un nuevo componente

1. Actualizar el array `PRIMENG_COMPONENTS` en `src/index.ts`:
```typescript
const PRIMENG_COMPONENTS = [
  // ... existentes
  "nuevo-componente",
];
```

2. Añadir ejemplos en `getCommonExamples()`:
```typescript
private getCommonExamples(component: string): string {
  const examples: Record<string, string> = {
    // ... existentes
    "nuevo-componente": `
# Ejemplos de NuevoComponente
...
    `,
  };
}
```

3. Recompilar:
```bash
npm run build
```

### Añadir una nueva herramienta

1. Definir la herramienta en `getTools()`:
```typescript
{
  name: "nueva_herramienta",
  description: "Descripción de la herramienta",
  inputSchema: {
    type: "object",
    properties: {
      parametro: {
        type: "string",
        description: "Descripción del parámetro",
      },
    },
    required: ["parametro"],
  },
}
```

2. Implementar el handler en `CallToolRequestSchema`:
```typescript
case "nueva_herramienta":
  return this.nuevaHerramienta(args.parametro as string);
```

3. Crear el método:
```typescript
private nuevaHerramienta(parametro: string) {
  // Implementación
  return {
    content: [
      {
        type: "text",
        text: resultado,
      },
    ],
  };
}
```

## 🔍 Debugging

### Ver logs del servidor en Claude Desktop

1. Abrir DevTools en Claude Desktop:
   - **MacOS:** `Cmd + Option + I`
   - **Windows/Linux:** `Ctrl + Shift + I`

2. Ir a la pestaña "Console"

3. Buscar mensajes que contengan "primeng"

### Modo verbose

Para añadir logging detallado, modifica `src/index.ts`:

```typescript
private setupHandlers() {
  this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
    console.error(`[MCP] Tool called: ${request.params.name}`);
    console.error(`[MCP] Arguments:`, JSON.stringify(request.params.arguments));
    
    // ... resto del código
  });
}
```

**Nota:** Usa `console.error` en lugar de `console.log` porque stdout está reservado para la comunicación MCP.

## 📊 Métricas y monitoreo

### Estadísticas útiles para trackear:

1. **Herramientas más usadas**
2. **Componentes más consultados**
3. **Tiempo de respuesta promedio**
4. **Cache hit rate**
5. **Errores más comunes**

Implementación sugerida:

```typescript
private stats = {
  toolCalls: new Map<string, number>(),
  componentQueries: new Map<string, number>(),
  cacheHits: 0,
  cacheMisses: 0,
};

private trackToolCall(toolName: string) {
  const count = this.stats.toolCalls.get(toolName) || 0;
  this.stats.toolCalls.set(toolName, count + 1);
}

private printStats() {
  console.error("[Stats]", JSON.stringify(Object.fromEntries(this.stats.toolCalls)));
}
```

## 🔒 Seguridad

### Consideraciones:

1. **Input validation**: Validar todos los inputs del usuario
2. **Rate limiting**: Limitar requests a primeng.org
3. **Sanitización**: Limpiar HTML/código antes de devolverlo
4. **Error handling**: No exponer información sensible en errores

## 🌐 Recursos externos

- [PrimeNG Docs](https://primeng.org/)
- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Cheerio Documentation](https://cheerio.js.org/)

## 📝 Notas de desarrollo

### Limitaciones actuales:

1. Los ejemplos son estáticos (no scraped en tiempo real)
2. No hay soporte offline completo
3. El cache es solo en memoria (se pierde al reiniciar)
4. No hay validación de versiones de PrimeNG
5. La documentación de propiedades no está completa

### Decisiones de diseño:

1. **Cache en memoria**: Más rápido pero se pierde al reiniciar
2. **Ejemplos hardcoded**: Garantiza respuestas rápidas
3. **Scraping on-demand**: Solo cuando se consulta un componente
4. **Stdio transport**: Estándar para MCP servers

## 🎯 Casos de uso principales

1. **Desarrollo rápido**: Generar código sin salir de Claude
2. **Aprendizaje**: Explorar componentes de PrimeNG
3. **Documentación**: Consulta rápida de APIs
4. **Prototipado**: Crear mockups rápidamente
5. **Code review**: Verificar uso correcto de componentes
