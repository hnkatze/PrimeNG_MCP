import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";

async function testMCPServer() {
  console.log("🚀 Iniciando prueba del servidor MCP de PrimeNG...\n");

  // Crear transporte
  const serverProcess = spawn("node", ["dist/index.js"], {
    cwd: process.cwd(),
  });

  const transport = new StdioClientTransport({
    command: "node",
    args: ["dist/index.js"],
  });

  // Crear cliente
  const client = new Client(
    {
      name: "test-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  try {
    await client.connect(transport);
    console.log("✅ Conectado al servidor MCP\n");

    // Listar herramientas disponibles
    console.log("📋 Herramientas disponibles:");
    const tools = await client.listTools();
    tools.tools.forEach((tool) => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
    console.log("");

    // Prueba 1: Listar todos los componentes
    console.log("🧪 Prueba 1: Listar todos los componentes");
    const listResult = await client.callTool({
      name: "list_all_components",
      arguments: {},
    });
    console.log("✅ Resultado:", listResult.content[0].text?.substring(0, 200) + "...\n");

    // Prueba 2: Buscar componentes
    console.log("🧪 Prueba 2: Buscar componentes con 'input'");
    const searchResult = await client.callTool({
      name: "search_components",
      arguments: { query: "input" },
    });
    console.log("✅ Resultado:", searchResult.content[0].text + "\n");

    // Prueba 3: Obtener documentación de Button
    console.log("🧪 Prueba 3: Documentación del componente Button");
    const docResult = await client.callTool({
      name: "get_component_doc",
      arguments: { component: "button" },
    });
    console.log("✅ Resultado:", docResult.content[0].text?.substring(0, 300) + "...\n");

    // Prueba 4: Generar código
    console.log("🧪 Prueba 4: Generar código de botón");
    const codeResult = await client.callTool({
      name: "generate_component_code",
      arguments: {
        component: "button",
        properties: {
          label: "Click me",
          icon: "pi pi-check",
          severity: "success",
        },
      },
    });
    console.log("✅ Resultado:");
    console.log(codeResult.content[0].text + "\n");

    // Prueba 5: Obtener ejemplos
    console.log("🧪 Prueba 5: Ejemplos del componente Table");
    const examplesResult = await client.callTool({
      name: "get_component_examples",
      arguments: { component: "table" },
    });
    console.log("✅ Resultado:", examplesResult.content[0].text?.substring(0, 400) + "...\n");

    console.log("🎉 ¡Todas las pruebas pasaron exitosamente!");
  } catch (error) {
    console.error("❌ Error durante las pruebas:", error);
  } finally {
    await client.close();
    serverProcess.kill();
  }
}

testMCPServer().catch(console.error);
