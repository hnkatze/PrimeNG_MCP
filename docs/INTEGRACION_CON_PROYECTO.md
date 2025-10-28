# 🔗 Integración del MCP de PrimeNG con tu Proyecto de Contratación

## 📋 Casos de uso específicos para tu proyecto

Basándome en los documentos que compartiste del sistema de contratación y onboarding, aquí están los componentes de PrimeNG más relevantes:

### 1. Formularios de Solicitud (CU001)

#### Componentes necesarios:
```typescript
// Para el formulario de solicitud de personal
- Dropdown → Seleccionar departamento, nivel del puesto, ubicación
- Calendar → Fecha de inicio estimada
- InputText → Título del puesto, presupuesto salarial
- Textarea → Comentarios, motivo de vacante
- FileUpload → Archivos adjuntos
- Button → Enviar solicitud
```

#### Consultas útiles en Claude:
```
"Genera un formulario de PrimeNG con dropdown para departamentos, calendar para fecha de inicio e inputtext para título del puesto"

"¿Cómo validar un formulario de PrimeNG antes de enviarlo?"

"Crea un componente FileUpload de PrimeNG con múltiples archivos"
```

### 2. Lista de Solicitudes (CU003)

#### Componentes necesarios:
```typescript
// Para la tabla de solicitudes
- Table → Lista de solicitudes con filtros
- Tag → Estado de la solicitud (Pendiente, Aprobada, Rechazada)
- Button → Acciones por solicitud
- InputText → Búsqueda global
- Dropdown → Filtros por tipo, departamento, estado
```

#### Consultas útiles:
```
"Genera una tabla de PrimeNG con paginación y filtros para listar solicitudes"

"¿Cómo agregar filtros por columna en una tabla de PrimeNG?"

"Crea tags con diferentes severidades para estados: pendiente, aprobado, rechazado"
```

### 3. Aprobación de Solicitudes (CU002)

#### Componentes necesarios:
```typescript
// Para el flujo de aprobación
- Card → Detalles de la solicitud
- Panel → Información expandible
- Button → Aprobar/Rechazar
- Textarea → Retroalimentación
- Dialog → Confirmación de acciones
```

#### Consultas útiles:
```
"Crea un Dialog de confirmación de PrimeNG para aprobar una solicitud"

"¿Cómo usar Card de PrimeNG para mostrar detalles de una solicitud?"

"Genera botones de aprobación y rechazo con iconos en PrimeNG"
```

### 4. Checklist de Pre-contratación (CU005, CU006)

#### Componentes necesarios:
```typescript
// Para el checklist
- Checkbox → Marcar tareas completadas
- Timeline → Visualización del progreso
- ProgressBar → Porcentaje completado
- Accordion → Agrupar actividades
- FileUpload → Documentos por actividad
```

#### Consultas útiles:
```
"Genera un checklist con checkboxes de PrimeNG"

"¿Cómo usar Timeline de PrimeNG para mostrar progreso de onboarding?"

"Crea un ProgressBar que muestre el porcentaje de tareas completadas"
```

### 5. Dashboard de Onboarding (CU012)

#### Componentes necesarios:
```typescript
// Para el tablero de onboarding
- DataView → Vista de procesos de onboarding
- Chip → Etiquetas de colaboradores
- Badge → Contadores de tareas
- Toolbar → Acciones del tablero
- TabView → Separar "En curso" y "Completados"
```

#### Consultas útiles:
```
"Crea un TabView de PrimeNG con pestañas para 'En curso' y 'Completados'"

"¿Cómo usar DataView de PrimeNG para mostrar tarjetas de empleados?"

"Genera badges con contadores para el número de tareas pendientes"
```

### 6. Encuestas de Experiencia (CU015, CU016)

#### Componentes necesarios:
```typescript
// Para encuestas
- RadioButton → Preguntas de opción única
- Rating → Calificaciones
- Slider → Escalas numéricas
- Textarea → Comentarios abiertos
- Panel → Agrupar preguntas
```

#### Consultas útiles:
```
"Crea un formulario de encuesta con RadioButtons y Rating de PrimeNG"

"¿Cómo usar el componente Rating para calificaciones de 1 a 5?"

"Genera un Slider de PrimeNG para escalas de satisfacción"
```

### 7. Reportes y KPIs (CU017)

#### Componentes necesarios:
```typescript
// Para dashboards y reportes
- Chart → Gráficos de datos
- DataTable → Tabla avanzada con exportación
- Calendar → Filtros por rango de fechas
- Dropdown → Filtros múltiples
- Toolbar → Acciones de exportar
```

#### Consultas útiles:
```
"¿Cómo crear gráficos de dona con Chart de PrimeNG?"

"Genera una tabla con exportación a Excel usando PrimeNG"

"Crea un filtro de rango de fechas con Calendar de PrimeNG"
```

## 🎯 Implementación práctica

### Ejemplo 1: Formulario de Solicitud de Personal

**Consulta en Claude con MCP activado:**
```
"Genera un formulario Angular completo usando PrimeNG para solicitud de personal que incluya:
- Dropdown para departamento
- InputText para título del puesto
- Calendar para fecha de inicio
- InputNumber para rango salarial
- Dropdown para tipo de contrato
- Textarea para comentarios
- Button para enviar"
```

**El MCP generará:**
```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-solicitud-personal',
  standalone: true,
  imports: [
    FormsModule,
    DropdownModule,
    InputTextModule,
    CalendarModule,
    InputNumberModule,
    InputTextareaModule,
    ButtonModule
  ],
  template: `
    <div class="card">
      <h2>Nueva Solicitud de Personal</h2>
      
      <div class="field">
        <label>Departamento</label>
        <p-dropdown 
          [options]="departamentos" 
          [(ngModel)]="solicitud.departamento"
          optionLabel="nombre"
          placeholder="Seleccionar departamento"
          [style]="{'width': '100%'}">
        </p-dropdown>
      </div>
      
      <div class="field">
        <label>Título del Puesto</label>
        <input 
          type="text" 
          pInputText 
          [(ngModel)]="solicitud.titulo"
          placeholder="Ej: Desarrollador de Software"
          [style]="{'width': '100%'}" />
      </div>
      
      <div class="field">
        <label>Fecha de Inicio Estimada</label>
        <p-calendar 
          [(ngModel)]="solicitud.fechaInicio"
          dateFormat="dd/mm/yy"
          [showIcon]="true"
          [style]="{'width': '100%'}">
        </p-calendar>
      </div>
      
      <div class="field">
        <label>Presupuesto Salarial (Rango)</label>
        <div class="flex gap-2">
          <p-inputNumber 
            [(ngModel)]="solicitud.salarioMin"
            mode="currency"
            currency="GTQ"
            placeholder="Mínimo">
          </p-inputNumber>
          <p-inputNumber 
            [(ngModel)]="solicitud.salarioMax"
            mode="currency"
            currency="GTQ"
            placeholder="Máximo">
          </p-inputNumber>
        </div>
      </div>
      
      <div class="field">
        <label>Comentarios</label>
        <textarea 
          pInputTextarea 
          [(ngModel)]="solicitud.comentarios"
          rows="4"
          [style]="{'width': '100%'}">
        </textarea>
      </div>
      
      <p-button 
        label="Enviar Solicitud" 
        icon="pi pi-send"
        (onClick)="enviarSolicitud()">
      </p-button>
    </div>
  `
})
export class SolicitudPersonalComponent {
  departamentos = [
    { id: 1, nombre: 'Ingeniería' },
    { id: 2, nombre: 'Marketing' },
    { id: 3, nombre: 'Ventas' },
    { id: 4, nombre: 'RRHH' }
  ];
  
  solicitud = {
    departamento: null,
    titulo: '',
    fechaInicio: null,
    salarioMin: null,
    salarioMax: null,
    comentarios: ''
  };
  
  enviarSolicitud() {
    console.log('Enviando solicitud:', this.solicitud);
    // Implementar lógica de envío
  }
}
```

### Ejemplo 2: Tabla de Solicitudes

**Consulta:**
```
"Crea una tabla de PrimeNG para listar solicitudes de empleo con:
- Columnas: Solicitante, Departamento, Fecha, Estado
- Filtros globales y por columna
- Paginación de 10 registros
- Tags de colores para estados
- Botón de ver detalles por fila"
```

### Ejemplo 3: Checklist de Onboarding

**Consulta:**
```
"Genera un componente de checklist de onboarding con:
- Timeline mostrando el progreso
- Checkboxes para cada tarea
- ProgressBar con porcentaje
- Botón para finalizar onboarding"
```

## 📱 Mobile vs Web

Según tu flujo, algunos casos de uso son móviles y otros web. El MCP puede ayudarte con ambos:

### Para móvil (Ionic + PrimeNG):
```
"¿Cómo adaptar un formulario de PrimeNG para móvil usando Ionic?"
```

### Para web:
```
"Genera una tabla responsiva de PrimeNG con breakpoints"
```

## 🔄 Flujo de trabajo sugerido

1. **Identifica el caso de uso** (de tu documentación)
2. **Consulta los componentes necesarios** en Claude con MCP
3. **Genera el código base** con el MCP
4. **Personaliza** según tus necesidades
5. **Integra** con tu lógica de negocio

## 💡 Tips específicos para tu proyecto

### Para formularios complejos:
```
"Genera un FormGroup reactivo de Angular con validaciones para [tu caso de uso]"
```

### Para estados de workflow:
```
"Crea un Stepper de PrimeNG para el flujo: Solicitud → Aprobación → Pre-contratación → Contratación → Onboarding"
```

### Para notificaciones:
```
"¿Cómo usar Toast de PrimeNG para notificar cuando una solicitud cambia de estado?"
```

### Para permisos por rol:
```
"¿Cómo deshabilitar botones de PrimeNG basado en el rol del usuario?"
```

## 🚀 Siguiente paso

1. Descarga y configura el MCP
2. Abre Claude Desktop
3. Comienza a hacer consultas específicas para tu proyecto
4. Copia el código generado a tu proyecto Angular
5. Personaliza según necesites

**¡El MCP te ahorrará horas de búsqueda en documentación! 🎉**
