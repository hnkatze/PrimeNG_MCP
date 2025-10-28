/**
 * Code generation service for PrimeNG components
 */

import { logger } from '../utils/logger.js';
import { capitalizeComponentName } from '../utils/formatters.js';
import { CodeGenerationError } from '../utils/errors.js';

export class CodeGeneratorService {
  /**
   * Generates component code with specified properties
   */
  generateComponentCode(component: string, properties: Record<string, any> = {}): string {
    try {
      logger.debug(`Generating code for ${component}`, { properties });

      const capitalizedComponent = capitalizeComponentName(component);
      const propsString = this.formatProperties(properties);
      const content = this.getComponentContent(component);

      const code = `
<!-- Component Import -->
import { ${capitalizedComponent}Module } from 'primeng/${component}';

<!-- Component.ts -->
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [${capitalizedComponent}Module],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  // Tu lógica aquí
}

<!-- Component.html -->
<p-${component} ${propsString}>
  ${content}
</p-${component}>
      `.trim();

      return code;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to generate code for ${component}`, { error: errorMessage });
      throw new CodeGenerationError(`Failed to generate code for ${component}`, error);
    }
  }

  /**
   * Gets examples for a component
   */
  getComponentExamples(component: string): string {
    const examples = this.getCommonExamples(component);
    if (examples) {
      return examples;
    }

    return `# Ejemplos para ${component}\n\nConsulta la documentación oficial: https://primeng.org/${component}`;
  }

  /**
   * Formats properties as HTML attributes
   */
  private formatProperties(properties: Record<string, any>): string {
    return Object.entries(properties)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}="${value}"`;
        } else if (typeof value === 'boolean') {
          return value ? key : `[${key}]="false"`;
        } else {
          return `[${key}]="${JSON.stringify(value)}"`;
        }
      })
      .join(' ');
  }

  /**
   * Gets component inner content for components that need it
   */
  private getComponentContent(component: string): string {
    const contentComponents = ['dialog', 'card', 'panel', 'fieldset'];
    return contentComponents.includes(component) ? 'Content here' : '';
  }

  /**
   * Gets hardcoded examples for common components
   */
  private getCommonExamples(component: string): string | null {
    const examples: Record<string, string> = {
      button: `
# Ejemplos de Button

## Básico
\`\`\`html
<p-button label="Submit" />
\`\`\`

## Con icono
\`\`\`html
<p-button label="Search" icon="pi pi-search" />
\`\`\`

## Severidades
\`\`\`html
<p-button label="Primary" />
<p-button label="Secondary" severity="secondary" />
<p-button label="Success" severity="success" />
<p-button label="Info" severity="info" />
<p-button label="Warning" severity="warning" />
<p-button label="Help" severity="help" />
<p-button label="Danger" severity="danger" />
\`\`\`

## Con loading
\`\`\`html
<p-button label="Save" [loading]="loading" (onClick)="save()" />
\`\`\`
      `,
      table: `
# Ejemplos de Table

## Básico
\`\`\`typescript
@Component({
  selector: 'app-table-demo',
  template: \`
    <p-table [value]="products">
      <ng-template pTemplate="header">
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Category</th>
          <th>Quantity</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-product>
        <tr>
          <td>{{ product.code }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.category }}</td>
          <td>{{ product.quantity }}</td>
        </tr>
      </ng-template>
    </p-table>
  \`
})
export class TableDemoComponent {
  products: Product[] = [];
}
\`\`\`

## Con paginación
\`\`\`html
<p-table [value]="products" [paginator]="true" [rows]="10">
  <!-- headers and body -->
</p-table>
\`\`\`

## Con filtros
\`\`\`html
<p-table [value]="products" [globalFilterFields]="['name','category']">
  <ng-template pTemplate="caption">
    <input pInputText type="text" (input)="dt.filterGlobal($event.target.value, 'contains')" placeholder="Search" />
  </ng-template>
</p-table>
\`\`\`
      `,
      dialog: `
# Ejemplos de Dialog

## Básico
\`\`\`typescript
@Component({
  template: \`
    <p-button (click)="showDialog()" label="Show" />
    <p-dialog header="Header" [(visible)]="visible">
      <p>Dialog content</p>
    </p-dialog>
  \`
})
export class DialogDemoComponent {
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }
}
\`\`\`

## Con footer
\`\`\`html
<p-dialog header="Header" [(visible)]="visible">
  <p>Content</p>
  <ng-template pTemplate="footer">
    <p-button label="No" (onClick)="visible=false" severity="secondary" />
    <p-button label="Yes" (onClick)="confirm()" />
  </ng-template>
</p-dialog>
\`\`\`

## Modal y responsive
\`\`\`html
<p-dialog
  header="Title"
  [(visible)]="visible"
  [modal]="true"
  [breakpoints]="{'960px': '75vw', '640px': '90vw'}"
  [style]="{width: '50vw'}">
  Content
</p-dialog>
\`\`\`
      `
    };

    return examples[component] || null;
  }
}
