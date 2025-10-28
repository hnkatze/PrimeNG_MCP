# 🔧 Configuración del Servidor MCP en Claude Desktop

Este documento explica cómo configurar el servidor MCP de PrimeNG en tu instalación local de Claude Desktop.

## 📍 Paso 1: Ubicar el Archivo de Configuración

El archivo de configuración se encuentra en:

- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

### Abrir el archivo:

**En Windows:**
```bash
notepad %APPDATA%\Claude\claude_desktop_config.json
```

**En macOS/Linux:**
```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
# o
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

## 🎯 Paso 2: Elegir tu Modo de Configuración

Tienes 2 opciones según tus necesidades:

---

### ⚡ OPCIÓN 1: Modo Producción (Recomendado)

**Ventajas:**
- Más rápido al iniciar
- Usa código compilado
- Mejor para uso diario

**Requisitos:**
- Debes compilar el proyecto primero: `npm run build`
- Si modificas el código, debes recompilar

**Configuración:**

```json
{
  "mcpServers": {
    "primeng": {
      "command": "node",
      "args": [
        "C:\\Users\\henri\\CIT\\primeng-mcp-server\\dist\\index.js"
      ]
    }
  }
}
```

**⚠️ IMPORTANTE para Windows:** Usa `\\` (doble backslash) en las rutas.

**Para macOS/Linux:**
```json
{
  "mcpServers": {
    "primeng": {
      "command": "node",
      "args": [
        "/Users/henri/CIT/primeng-mcp-server/dist/index.js"
      ]
    }
  }
}
```

---

### 🛠️ OPCIÓN 2: Modo Desarrollo

**Ventajas:**
- No necesitas compilar (`npm run build`)
- Los cambios en el código se reflejan inmediatamente
- Ideal para desarrollo y pruebas

**Desventajas:**
- Inicio ligeramente más lento
- Requiere tsx instalado

**Configuración:**

```json
{
  "mcpServers": {
    "primeng": {
      "command": "npx",
      "args": [
        "-y",
        "tsx",
        "C:\\Users\\henri\\CIT\\primeng-mcp-server\\src\\index.ts"
      ]
    }
  }
}
```

**Para macOS/Linux:**
```json
{
  "mcpServers": {
    "primeng": {
      "command": "npx",
      "args": [
        "-y",
        "tsx",
        "/Users/henri/CIT/primeng-mcp-server/src/index.ts"
      ]
    }
  }
}
```

---

## 🔄 Paso 3: Aplicar la Configuración

1. **Guarda** el archivo `claude_desktop_config.json`
2. **Cierra completamente** Claude Desktop
3. **Abre** Claude Desktop de nuevo
4. Espera unos segundos a que el servidor se inicialice

## ✅ Paso 4: Verificar que Funciona

En Claude Desktop, deberías ver:

1. Un **ícono de martillo** 🔨 o herramientas en la parte inferior
2. Al hacer clic, aparece **"primeng"** en la lista de servidores
3. Puedes ver las herramientas disponibles:
   - `get_component_doc`
   - `search_components`
   - `list_all_components`
   - `generate_component_code`
   - `get_component_examples`

## 🧪 Prueba Rápida

Una vez configurado, prueba con:

```
Dame la documentación del componente Button de PrimeNG
```

O:

```
Lista todos los componentes de PrimeNG disponibles
```

## 🚨 Solución de Problemas

### El servidor no aparece en Claude Desktop

1. ✅ Verifica que la **ruta sea absoluta** (no relativa)
2. ✅ En Windows, usa `\\` en lugar de `\`
3. ✅ Asegúrate de que el archivo existe en esa ruta
4. ✅ Si usas modo producción, ejecuta `npm run build`
5. ✅ **Reinicia Claude Desktop completamente**

### Error al iniciar el servidor

1. Verifica que Node.js esté instalado:
   ```bash
   node --version
   ```

2. Verifica que las dependencias estén instaladas:
   ```bash
   cd C:\Users\henri\CIT\primeng-mcp-server
   npm install
   ```

3. Compila el proyecto (modo producción):
   ```bash
   npm run build
   ```

### Ver los logs del servidor

1. Abre **DevTools** en Claude Desktop:
   - **Windows/Linux**: `Ctrl + Shift + I`
   - **macOS**: `Cmd + Option + I`

2. Ve a la pestaña **Console**
3. Busca mensajes con `[MCP]` o errores relacionados con `primeng`

### El servidor se conecta pero no responde

1. Verifica que tengas **conexión a internet** (el servidor hace scraping)
2. Prueba ejecutar el servidor manualmente:
   ```bash
   cd C:\Users\henri\CIT\primeng-mcp-server
   npm run dev
   ```
   Deberías ver:
   ```
   [MCP] Scraping components from primeng.org...
   [MCP] Found 91 components
   PrimeNG MCP Server running on stdio
   ```

## 📝 Ejemplo Completo de Configuración

Si tienes **múltiples servidores MCP**, tu configuración se vería así:

```json
{
  "mcpServers": {
    "primeng": {
      "command": "node",
      "args": [
        "C:\\Users\\henri\\CIT\\primeng-mcp-server\\dist\\index.js"
      ]
    },
    "otro-servidor": {
      "command": "node",
      "args": [
        "C:\\ruta\\a\\otro-servidor\\index.js"
      ]
    }
  }
}
```

## 🎉 ¡Listo!

Tu servidor MCP de PrimeNG debería estar funcionando. Ahora puedes:

- 📚 Obtener documentación de cualquier componente de PrimeNG
- 🔍 Buscar componentes por nombre
- 💻 Generar código de ejemplo
- 📋 Ver listas de componentes organizadas por categoría

---

**¿Necesitas ayuda?** Revisa los logs en DevTools o ejecuta el servidor manualmente para ver mensajes de error detallados.
