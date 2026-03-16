# Especificación de Producto: ARTEM

## 1. Visión del Producto

### 1.1 Propósito
ARTEM es una aplicación de gestión de siniestros diseñada para profesionales que trabajan con compañías de seguros. La plataforma centraliza toda la información del proceso de siniestros, desde la recepción del parte hasta la elaboración de presupuestos, proporcionando además un asistente IA para optimizar y automatizar tareas repetitivas.

### 1.2 Problema que Resuelve
Los profesionales del sector asegurador enfrentan múltiples desafíos:
- Descentralización de documentos (PDFs, fotos, presupuestos en diferentes ubicaciones)
- Proceso manual de creación de presupuestos usando baremos
- Dificultad para rastrear y gestionar el estado de cada siniestro
- Pérdida de tiempo en tareas repetitivas que podrían automatizarse

### 1.3 Propuesta de Valor
- **Centralización**: Todo el expediente del siniestro en un único lugar
- **Eficiencia**: Asistente IA que genera presupuestos automáticamente
- **Organización**: Catálogo estructurado de baremos por compañía
- **Trazabilidad**: Historial completo de cada expediente

### 1.4 Usuarios Objetivo
- Peritos de seguros
- Gestorías especializadas en siniestros
- Departments de siniestros de compañías de seguros
- Reparadores autorizados por compañías de seguros

---

## 2. Requisitos Funcionales

### 2.1 Gestión de Expedientes

#### RF-001: Crear Expediente
- El usuario debe poder crear un nuevo expediente de siniestro
- Datos requeridos: número de siniestro, compañía de seguros, fecha del siniestro, ubicación, descripción básica
- El sistema debe asignar un identificador único al expediente

#### RF-002: Subir PDF del Parte de Compañía
- El usuario debe poder subir archivos PDF del parte de compañía
- El sistema debe almacenar el archivo y asociarlo al expediente correspondiente
- Debe visualizarse el documento dentro de la aplicación
- Formatos aceptados: PDF

#### RF-003: Subir Fotos al Expediente
- El usuario debe poder subir múltiples fotografías al expediente
- El sistema debe permitir organizar las fotos en álbumes o categorías
- Debe mostrar una galería visual de las imágenes
- Formatos aceptados: JPG, PNG, WEBP

#### RF-004: Subir Presupuestos
- El usuario debe poder subir presupuestos en PDF o formato digital
- El sistema debe registrar la fecha de subida y el usuario que lo realizó
- Debe permitir comparar varios presupuestos de un mismo expediente

#### RF-005: Asignar Reparador
- El usuario debe poder asignar un reparador al expediente
- El sistema debe permitir seleccionar de una lista de reparadores disponibles
- Debe registrar la fecha de asignación y el estado del trabajo

#### RF-006: Estados del Expediente
- El sistema debe gestionar los siguientes estados: Nuevo, En Tramitación, Pendiente Documentación, Presupuesto Pendiente, Presupuesto Aprobado, En Reparación, Finalizado, Cerrado

#### RF-007: Buscar y Filtrar Expedientes
- El usuario debe poder buscar expedientes por número, compañía, fecha, estado
- El sistema debe permitir filtros combinados

### 2.2 Sección de Baremos

#### RF-008: Gestionar Baremos
- El usuario debe poder crear, editar y eliminar baremos
- Cada baremo debe tener: nombre, compañía de seguros asociada, fecha de vigencia, conceptos y precios

#### RF-009: Subir Baremos
- El usuario debe poder subir archivos de baremos (Excel, PDF)
- El sistema debe parsear el contenido y permitir su catalogación

#### RF-010: Catalogar Baremos por Compañía
- El sistema debe permitir organizar baremos por compañía de seguros
- Debe facilitar la búsqueda de baremos por compañía

#### RF-011: Eliminar Baremos
- El usuario debe poder eliminar baremos existentes
- El sistema debe pedir confirmación antes de eliminar

### 2.3 Asistente IA (ARTEM)

#### RF-012: Interfaz de Chat
- El usuario debe poder interactuar con el asistente mediante texto
- El sistema debe mostrar las respuestas de manera estructurada

#### RF-013: Interfaz de Voz
- El usuario debe poder interactuar mediante comandos de voz
- El sistema debe convertir voz a texto para procesar la consulta

#### RF-014: Generar Presupuestos
- El usuario debe poder pedir al asistente que genere un presupuesto
- El sistema debe usar los baremos disponibles para calcular importes
- El presupuesto generado debe guardarse como borrador en el expediente

#### RF-015: Consultar Información del Siniestro
- El usuario debe poder pedir información sobre un siniestro específico
- El sistema debe devolver los datos relevantes del expediente

#### RF-016: Recordatorios y Notificaciones
- El asistente debe poder configurar recordatorios sobre acciones pendientes en expedientes

---

## 3. Requisitos No Funcionales

### 3.1 Usabilidad
- La interfaz debe ser intuitiva y fácil de usar
- Tiempo máximo de aprendizaje: 2 horas para funcionalidades básicas
- El asistente IA debe entender lenguaje natural

### 3.2 Rendimiento
- Tiempo de respuesta máximo para consultas: 3 segundos
- Carga de archivos PDF de hasta 50MB
- Almacenamiento de fotos de hasta 10MB cada una

### 3.3 Seguridad
- Autenticación de usuarios mediante credenciales
- Control de acceso basado en roles
- Cifrado de datos en tránsito y en reposo
- Registro de auditoría de acciones

### 3.4 Disponibilidad
- Disponibilidad del sistema: 99.5%
- Mantenimiento programado en horas de baja actividad

### 3.5 Escalabilidad
- Soporte para al menos 100 usuarios concurrentes
- Capacidad de存储 al menos 10,000 expedientes

### 3.6 Compatibilidad
- Navegadores soportados: Chrome, Firefox, Safari, Edge (versiones actuales y anteriores)
- Diseño responsive para tablets y móviles

---

## 4. Historias de Usuario

### Gestión de Expedientes

**HU-001: Crear nuevo expediente**
> Como usuario, quiero crear un nuevo expediente de siniestro para iniciar la gestión del caso.
> *Criterios de aceptación:*
> - Puedo crear un expediente con número de siniestro, compañía, fecha y ubicación
> - El sistema me muestra el expediente creado con un ID único
> - El estado inicial es "Nuevo"

**HU-002: Subir parte de compañía**
> Como usuario, quiero subir el PDF del parte de compañía al expediente para tener toda la documentación centralizada.
> *Criterios de aceptación:*
> - Puedo seleccionar y subir un archivo PDF
> - El archivo se associa correctamente al expediente
> - Puedo visualizar el documento desde la aplicación

**HU-003: Subir fotografías**
> Como usuario, quiero subir fotografías del siniestro para documentar los daños.
> *Criterios de aceptación:*
> - Puedo subir múltiples fotos a la vez
> - Las fotos se muestran en una galería
> - Puedo eliminar fotos si es necesario

**HU-004: Asignar reparador**
> Como usuario, quiero asignar un reparador al expediente para iniciar la reparación.
> *Criterios de aceptación:*
> - Puedo seleccionar un reparador de una lista
> - Se registra la fecha de asignación
> - El expediente muestra el reparador asignado

### Baremos

**HU-005: Crear baremo**
> Como usuario, quiero crear un nuevo baremo para usarlo en la elaboración de presupuestos.
> *Criterios de aceptación:*
> - Puedo crear un baremo con nombre y compañía asociada
> - Puedo agregar conceptos con sus precios
> - El baremo se guarda correctamente

**HU-006: Eliminar baremo**
> Como usuario, quiero eliminar un baremo que ya no uso para mantener mi lista actualizada.
> *Criterios de aceptación:*
> - Puedo seleccionar el baremo a eliminar
> - El sistema me pide confirmación
> - El baremo se elimina definitivamente

**HU-007: Buscar baremos por compañía**
> Como usuario, quiero buscar los baremos de una compañía específica para usarlos en un presupuesto.
> *Criterios de aceptación:*
> - Puedo buscar por nombre de compañía
> - El sistema me muestra los baremos coincidentes

### Asistente IA

**HU-008: Consultar siniestro por ubicación**
> Como usuario, quiero decir "tengo un siniestro en la calle X" para que el asistente me proporcione información sobre ese siniestro.
> *Criterios de aceptación:*
> - El asistente entiende la ubicación mencionada
> - Devuelve los datos del expediente o indica si no existe
> - Muestra la información de forma clara

**HU-009: Generar presupuesto con IA**
> Como usuario, quiero pedir al asistente que me genere un presupuesto para guardarlo como borrador.
> *Criterios de aceptación:*
> - El asistente usa los baremos disponibles
> - Genera un presupuesto detallado
> - Lo guarda como borrador en el expediente

**HU-010: Interactuar por voz**
> Como usuario, quiero interacturar con el asistente mediante voz para mayor comodidad.
> *Criterios de aceptación:*
> - Puedo activar el modo voz
> - El sistema reconoce mi voz
> - El asistente responde de manera auditiva y visual

---

## 5. Casos de Uso

### CU-001: Alta de Expediente
1. El usuario accede a la sección "Expedientes"
2. El usuario hace clic en "Nuevo Expediente"
3. El usuario completa los datos obligatorios
4. El usuario hace clic en "Guardar"
5. El sistema crea el expediente y muestra su ID único

### CU-002: Subir Documentación
1. El usuario accede a un expediente existente
2. El usuario hace clic en "Subir Documento"
3. El usuario selecciona el archivo (PDF, imagen)
4. El sistema valida el formato y tamaño
5. El sistema almacena el archivo y lo associa al expediente
6. El sistema muestra confirmación de subida

### CU-003: Asignar Reparador
1. El usuario accede a un expediente
2. El usuario hace clic en "Asignar Reparador"
3. El usuario selecciona un reparador de la lista
4. El usuario confirma la asignación
5. El sistema actualiza el expediente y notifica al reparador

### CU-004: Gestionar Baremos
1. El usuario accede a la sección "Baremos"
2. Para crear: hace clic en "Nuevo Baremo" y completa los datos
3. Para editar: selecciona el baremo y modifica los valores
4. Para eliminar: selecciona el baremo, confirma y se elimina
5. El sistema actualiza la lista de baremos

### CU-005: Consulta con Asistente IA (Texto)
1. El usuario accede al chat con ARTEM
2. El usuario escribe su consulta
3. El sistema procesa la consulta
4. El sistema devuelve la respuesta
5. Si aplica, el sistema guarda la acción en el expediente

### CU-006: Consulta con Asistente IA (Voz)
1. El usuario activa el micrófono
2. El usuario habla su consulta
3. El sistema convierte voz a texto
4. El sistema procesa la consulta
5. El sistema devuelve la respuesta (texto y voz)
6. Si aplica, el sistema guarda la acción en el expediente

### CU-007: Generar Presupuesto Automático
1. El usuario dice al asistente "genera un presupuesto para el siniestro X"
2. El sistema identifica el expediente
3. El sistema consulta los baremos de la compañía
4. El sistema genera un presupuesto basado en los daños documentados
5. El sistema guarda el presupuesto como borrador
6. El sistema notifica al usuario

---

## 6. Estructura de Datos Sugerida

### 6.1 Modelos Principales

```json
// Usuario
{
  "id": "uuid",
  "email": "string",
  "password_hash": "string",
  "nombre": "string",
  "apellidos": "string",
  "rol": "enum[admin, perito, gestor]",
  "activo": "boolean",
  "fecha_creacion": "datetime",
  "ultimo_login": "datetime"
}

// Compañía de Seguros
{
  "id": "uuid",
  "nombre": "string",
  "codigo": "string",
  "activo": "boolean"
}

// Reparador
{
  "id": "uuid",
  "nombre": "string",
  "direccion": "string",
  "telefono": "string",
  "email": "string",
  "especialidades": "string[]",
  "activo": "boolean"
}

// Expediente
{
  "id": "uuid",
  "numero_siniestro": "string",
  "compania_id": "uuid",
  "fecha_siniestro": "date",
  "ubicacion": {
    "direccion": "string",
    "codigo_postal": "string",
    "ciudad": "string"
  },
  "descripcion": "string",
  "estado": "enum[nuevo, en_tramitacion, pendiente_documentacion, presupuesto_pendiente, presupuesto_aprobado, en_reparacion, finalizado, cerrado]",
  "reparador_id": "uuid | null",
  "usuario_creador_id": "uuid",
  "fecha_creacion": "datetime",
  "fecha_actualizacion": "datetime"
}

// Documento
{
  "id": "uuid",
  "expediente_id": "uuid",
  "tipo": "enum[parte_compania, presupuesto, foto, otro]",
  "nombre_archivo": "string",
  "url": "string",
  "tamano": "number",
  "mime_type": "string",
  "usuario_subida_id": "uuid",
  "fecha_subida": "datetime"
}

// Baremo
{
  "id": "uuid",
  "nombre": "string",
  "compania_id": "uuid",
  "fecha_vigencia": "date",
  "conceptos": [
    {
      "codigo": "string",
      "descripcion": "string",
      "precio": "number",
      "unidad": "string"
    }
  ],
  "usuario_creador_id": "uuid",
  "fecha_creacion": "datetime"
}

// Presupuesto (Borrador)
{
  "id": "uuid",
  "expediente_id": "uuid",
  "baremo_id": "uuid",
  "conceptos": [
    {
      "codigo": "string",
      "descripcion": "string",
      "cantidad": "number",
      "precio_unitario": "number",
      "importe": "number"
    }
  ],
  "total": "number",
  "estado": "enum[borrador, enviado, aprobado, rechazado]",
  "notas": "string",
  "fecha_creacion": "datetime",
  "fecha_actualizacion": "datetime"
}

// Conversación IA
{
  "id": "uuid",
  "expediente_id": "uuid | null",
  "tipo": "enum[texto, voz]",
  "mensajes": [
    {
      "rol": "enum[usuario, asistente]",
      "contenido": "string",
      "timestamp": "datetime"
    }
  ],
  "fecha_inicio": "datetime",
  "fecha_fin": "datetime"
}
```

### 6.2 Relaciones entre Entidades

```
Usuario (1) ─────< (N) Expediente
Compañía (1) ─────< (N) Expediente
Compañía (1) ─────< (N) Baremo
Reparador (1) ─────< (N) Expediente
Expediente (1) ─────< (N) Documento
Expediente (1) ─────< (N) Presupuesto
Expediente (1) ─────< (N) Conversación IA
Baremo (1) ─────< (N) Presupuesto
```

### 6.3 Índices Recomendados

- `expediente.numero_siniestro` (único)
- `expediente.estado`
- `expediente.compania_id`
- `expediente.fecha_siniestro`
- `baremo.compania_id`
- `documento.expediente_id`
- `presupuesto.expediente_id`

---

## 7. Consideraciones Adicionales

### 7.1 Integraciones Futuras
- API con compañías de seguros para consulta automática de baremos
- Integración con sistemas de facturación
- Conexión con herramientas de gestión empresarial (ERP)

### 7.2 Mejoras Potenciales
- Módulo de reporting y estadísticas
- Portal del cliente para seguimiento del siniestro
- App móvil nativa
- Notificaciones push

### 7.3 Tecnologías Sugeridas
- Frontend: React o Vue.js
- Backend: Node.js o Python (Django/FastAPI)
- Base de datos: PostgreSQL
- Almacenamiento: AWS S3 o similar
- IA: OpenAI API o similar para el asistente
- Voz: Web Speech API o servicios especializados

---

*Documento generado para ARTEM - Especificación de Producto v1.0*
