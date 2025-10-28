/**
 * MCP Tool schemas and definitions
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * Creates the schema for get_component_doc tool
 */
export function createGetComponentDocSchema(components: string[]): Tool {
  return {
    name: "get_component_doc",
    description: "Obtiene la documentación completa de un componente de PrimeNG incluyendo propiedades, eventos y métodos",
    inputSchema: {
      type: "object",
      properties: {
        component: {
          type: "string",
          description: "Nombre del componente de PrimeNG (ej: 'button', 'table', 'dialog')",
          enum: components,
        },
      },
      required: ["component"],
    },
  };
}

/**
 * Creates the schema for search_components tool
 */
export function createSearchComponentsSchema(): Tool {
  return {
    name: "search_components",
    description: "Busca componentes de PrimeNG que coincidan con una consulta",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Término de búsqueda (ej: 'input', 'table', 'menu')",
        },
      },
      required: ["query"],
    },
  };
}

/**
 * Creates the schema for list_all_components tool
 */
export function createListAllComponentsSchema(): Tool {
  return {
    name: "list_all_components",
    description: "Lista todos los componentes disponibles en PrimeNG con una breve descripción",
    inputSchema: {
      type: "object",
      properties: {},
    },
  };
}

/**
 * Creates the schema for generate_component_code tool
 */
export function createGenerateComponentCodeSchema(components: string[]): Tool {
  return {
    name: "generate_component_code",
    description: "Genera código de ejemplo para un componente de PrimeNG con las propiedades especificadas",
    inputSchema: {
      type: "object",
      properties: {
        component: {
          type: "string",
          description: "Nombre del componente",
          enum: components,
        },
        properties: {
          type: "object",
          description: "Propiedades del componente (ej: {label: 'Click me', icon: 'pi pi-check'})",
        },
      },
      required: ["component"],
    },
  };
}

/**
 * Creates the schema for get_component_examples tool
 */
export function createGetComponentExamplesSchema(components: string[]): Tool {
  return {
    name: "get_component_examples",
    description: "Obtiene ejemplos de uso prácticos de un componente específico",
    inputSchema: {
      type: "object",
      properties: {
        component: {
          type: "string",
          description: "Nombre del componente",
          enum: components,
        },
      },
      required: ["component"],
    },
  };
}

/**
 * Creates the schema for get_installation_guide tool
 */
export function createGetInstallationGuideSchema(): Tool {
  return {
    name: "get_installation_guide",
    description: "Obtiene la guía de instalación y configuración inicial de PrimeNG",
    inputSchema: {
      type: "object",
      properties: {},
    },
  };
}

/**
 * Creates the schema for get_theming_guide tool
 */
export function createGetThemingGuideSchema(): Tool {
  return {
    name: "get_theming_guide",
    description: "Obtiene la guía de theming de PrimeNG (temas, personalización, modo oscuro)",
    inputSchema: {
      type: "object",
      properties: {},
    },
  };
}

/**
 * Creates the schema for get_icons_guide tool
 */
export function createGetIconsGuideSchema(): Tool {
  return {
    name: "get_icons_guide",
    description: "Obtiene la guía de uso de PrimeIcons",
    inputSchema: {
      type: "object",
      properties: {},
    },
  };
}

/**
 * Creates the schema for get_tailwind_guide tool
 */
export function createGetTailwindGuideSchema(): Tool {
  return {
    name: "get_tailwind_guide",
    description: "Obtiene la guía de integración de PrimeNG con Tailwind CSS",
    inputSchema: {
      type: "object",
      properties: {},
    },
  };
}
