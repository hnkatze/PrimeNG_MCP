/**
 * 🧪 Demo Script - Prueba las mejoras del Web Scraping
 *
 * Ejecuta: node demo.mjs
 */

import { ScraperService } from './dist/services/ScraperService.js';
import { formatComponentDoc } from './dist/utils/formatters.js';

const RESET = '\x1b[0m';
const BRIGHT = '\x1b[1m';
const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';

async function demo() {
  console.log(`\n${BRIGHT}${CYAN}╔═══════════════════════════════════════════════╗${RESET}`);
  console.log(`${BRIGHT}${CYAN}║   🚀 Demo: Mejoras de Web Scraping PrimeNG   ║${RESET}`);
  console.log(`${BRIGHT}${CYAN}╚═══════════════════════════════════════════════╝${RESET}\n`);

  const scraper = new ScraperService(15000, 3);

  // Lista de componentes para probar
  const components = ['button', 'dialog', 'dropdown'];

  for (const component of components) {
    console.log(`${BRIGHT}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
    console.log(`${BRIGHT}${GREEN}📦 Componente: ${component.toUpperCase()}${RESET}`);
    console.log(`${BRIGHT}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);

    try {
      const doc = await scraper.scrapeComponentDoc(component);

      // Mostrar estadísticas
      console.log(`${YELLOW}📊 Estadísticas extraídas:${RESET}`);
      console.log(`   ✓ Ejemplos de código: ${BRIGHT}${doc.examples?.length || 0}${RESET} (antes: solo 1)`);
      console.log(`   ✓ Properties: ${BRIGHT}${doc.properties?.length || 0}${RESET} (sin límite de 20)`);
      console.log(`   ✓ Events: ${BRIGHT}${doc.events?.length || 0}${RESET} (sin límite de 15)`);
      console.log(`   ✓ Methods: ${BRIGHT}${doc.methods?.length || 0}${RESET} (sin límite de 10)\n`);

      // Mostrar algunos ejemplos
      if (doc.examples && doc.examples.length > 0) {
        console.log(`${YELLOW}💡 Primeros 3 ejemplos extraídos:${RESET}`);
        doc.examples.slice(0, 3).forEach((example, i) => {
          const preview = example.substring(0, 60).replace(/\n/g, ' ');
          console.log(`   ${i + 1}. ${preview}...`);
        });
        console.log('');
      }

      // Mostrar documentación formateada (preview)
      console.log(`${YELLOW}📄 Preview de documentación formateada:${RESET}`);
      const formatted = formatComponentDoc(doc);
      const lines = formatted.split('\n');
      const preview = lines.slice(0, 30).join('\n');
      console.log(`${CYAN}${preview}${RESET}`);
      console.log(`${CYAN}... (${lines.length - 30} líneas más)${RESET}\n`);

      // Esperar un poco entre componentes
      if (component !== components[components.length - 1]) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

    } catch (error) {
      console.log(`${BRIGHT}\x1b[31m❌ Error: ${error.message}${RESET}\n`);
    }
  }

  console.log(`${BRIGHT}${GREEN}╔═══════════════════════════════════════════════╗${RESET}`);
  console.log(`${BRIGHT}${GREEN}║          ✅ Demo completado exitosamente!      ║${RESET}`);
  console.log(`${BRIGHT}${GREEN}╚═══════════════════════════════════════════════╝${RESET}\n`);

  console.log(`${YELLOW}💡 Próximos pasos:${RESET}`);
  console.log(`   1. Configura el servidor en Claude Desktop`);
  console.log(`   2. Pregunta: "Dame la documentación del componente Button"`);
  console.log(`   3. ¡Disfruta de toda la información extraída!${RESET}\n`);
}

// Ejecutar demo
demo().catch(error => {
  console.error('Error en demo:', error);
  process.exit(1);
});
