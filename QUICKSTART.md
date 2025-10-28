# 🚀 Guía de Inicio Rápido - PrimeNG MCP Server

## Pasos para configurar

### 1. Instalar dependencias
```bash
cd primeng-mcp-server
npm install
```

### 2. Compilar el proyecto
```bash
npm run build
```

### 3. Verificar que funciona
```bash
npm run dev
```

Si ves el mensaje "PrimeNG MCP Server running on stdio", ¡está funcionando! Presiona Ctrl+C para detenerlo.

### 4. Configurar en Claude Desktop

#### a. Obtén la ruta absoluta del proyecto:
```bash
pwd
```

Copia el resultado (ejemplo: `/home/usuario/primeng-mcp-server`)

#### b. Abre el archivo de configuración de Claude Desktop:

**MacOS:**
```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Windows:**
```
notepad %APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```bash
code ~/.config/Claude/claude_desktop_config.json
```

#### c. Añade la configuración del servidor:

```json
{
  "mcpServers": {
    "primeng": {
      "command": "node",
      "args": [
        "/RUTA/ABSOLUTA/A/primeng-mcp-server/dist/index.js"
      ]
    }
  }
}
```

**¡IMPORTANTE!** Reemplaza `/RUTA/ABSOLUTA/A/` con el resultado del comando `pwd` del paso 4a.

### 5. Reiniciar Claude Desktop

Cierra completamente Claude Desktop y ábrelo de nuevo.

### 6. Verificar que está funcionando

En Claude Desktop, deberías ver un ícono de herramientas (🔨) en la barra inferior. Al hacer clic, deberías ver "primeng" listado.

## 🎯 Ejemplos de uso

Una vez configurado, puedes hacer preguntas como:

```
"¿Cómo uso el componente Button de PrimeNG?"

"Genera un ejemplo de tabla con paginación"

"Busca componentes relacionados con formularios"

"Dame ejemplos del componente Dialog"

"Lista todos los componentes de entrada"
```

## 🔧 Solución de problemas

### El servidor no aparece en Claude Desktop
1. Verifica que la ruta en el archivo de configuración sea absoluta y correcta
2. Asegúrate de haber compilado el proyecto (`npm run build`)
3. Reinicia Claude Desktop completamente

### Error al iniciar el servidor
1. Ejecuta `npm run build` de nuevo
2. Verifica que Node.js esté instalado (`node --version`)
3. Revisa los logs en la consola de desarrollador de Claude Desktop

### Las respuestas no son precisas
El servidor incluye ejemplos básicos incorporados. Para obtener documentación más detallada, el servidor intenta acceder a primeng.org (requiere conexión a internet).

## 📚 Recursos adicionales

- [Documentación completa](./README.md)
- [PrimeNG Official](https://primeng.org/)
- [MCP Documentation](https://modelcontextprotocol.io/)

## 💡 Tips

1. **Modo desarrollo**: Si estás haciendo cambios al código, usa la configuración con `tsx` en lugar de `node` para no tener que recompilar cada vez.

2. **Cache**: El servidor cachea la documentación de componentes. Si necesitas refrescar, reinicia Claude Desktop.

3. **Componentes personalizados**: Puedes añadir tus propios ejemplos editando el archivo `src/index.ts`.

## ✅ Checklist de instalación

- [ ] Dependencias instaladas (`npm install`)
- [ ] Proyecto compilado (`npm run build`)
- [ ] Ruta absoluta obtenida (`pwd`)
- [ ] Configuración añadida a `claude_desktop_config.json`
- [ ] Claude Desktop reiniciado
- [ ] Servidor visible en la lista de herramientas

¡Listo! Ahora puedes usar Claude para obtener ayuda con PrimeNG. 🎉
