# ARTEM - Sistema de Gestión de Siniestros

## 📋 Resumen del Proyecto

**ARTEM** es un sistema de gestión de siniestros de seguros con asistente IA.

## 🏗️ Arquitectura

### Frontend
- **Next.js 14** con App Router
- **React 19** + TypeScript
- **Tailwind CSS** para estilos
- **shadcn/ui** para componentes

### Backend
- **Fastify** (servidor Node.js)
- **Prisma** (ORM)
- **PostgreSQL** (base de datos)
- **Groq API** (IA para el asistente)

### Estructura
```
/frontend          - Next.js 16
  /src
    /app          - Páginas (dashboard, expedientes, baremos, asistente, login, register)
    /components   - Componentes React
    /contexts     - Contextos (AuthContext)

/backend          - Fastify
  /src
    /routes      - API endpoints (auth, expeditions, companies, baremos, repairs, assistant)
    /lib         - Utilidades (Prisma client)
  prisma/         - Schema de base de datos
  uploads/        - PDFssubidos

/artem-docs/      - Documentación
```

## ✨ Funcionalidades

### 1. Autenticación
- Registro y login de usuarios
- Tokens JWT en cookies httpOnly
- Rutas protegidas

### 2. Expedientes
- CRUD completo de expedientes
- Estados: ABIERTO, EN PROGRESO, PENDIENTE PRESUPUESTO, COMPLETADO, CANCELLED
- Datos: código, compañía, cliente, teléfono, ubicación, descripción

### 3. Baremos (Tarifas)
- CRUD completo
- Subida de PDFs
- Extracción de texto con **pdfreader**
- Textos extraídos consultables por el asistente IA

### 4. Asistente IA
- **Groq API** (modelo Llama 3.3)
- Lenguaje natural
- Consulta datos de la base de datos
- Puede responder sobre:
  - Expedientes
  - Baremos (incluidos textos extraídos de PDFs)
  - Compañías
  - Reparadores

## 🔧 APIs

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/register | Registro de usuarios |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Datos del usuario |
| GET/POST | /api/expeditions | Expedientes |
| GET/POST | /api/companies | Compañías |
| GET/POST | /api/baremos | Baremos + upload PDF |
| GET | /api/baremos/sectors | Sectores disponibles |
| POST | /api/assistant/chat | Chat con IA |

## 🗄️ Base de Datos

### Modelos Prisma

- **User**: Usuarios del sistema
- **Company**: Compañías aseguradoras
- **Expedition**: Expedientes de siniestros
- **Barem**: Tarifas de reparaciones
- **Repair**: Reparadores asignados
- **Photo**: Fotos de expedientes
- **Budget**: Presupuestos

## 🤖 Asistente IA

### Cómo funciona
1. Detecta intención del mensaje
2. Si es dato已知 → consulta BD
3. Si es pregunta general → usa Groq API
4. Proporciona contexto de baremos con textos extraídos

### Prompts
- Sistema define comportamiento como asistente de seguros
- Contexto incluye todos los datos de la BD

## 📦 Dependencias

### Frontend
- next, react, react-dom
- tailwindcss
- lucide-react (iconos)
- @radix-ui (componentes)

### Backend
- fastify, @fastify/cors, @fastify/jwt, @fastify/cookie
- @prisma/client
- pdfreader (extracción PDF)
- groq (API de IA)

## 🔐 Seguridad
- Contraseñas hasheadas con bcrypt
- JWT en cookies httpOnly
- Validación con Zod
- Params de usuario en consultas

## 🚀 Despliegue

### Producción
1. Cambiar `NODE_ENV=production` en .env
2. Groq API funcionará automáticamente
3. PostgreSQL en servidor (Supabase, Railway, etc.)

## 📝 Notas

- Los PDFs de baremos se guardan localmente en `/uploads`
- La extracción de texto usa pdfreader para mantener formato de tablas
- El asistente puede responder preguntas específicas sobre códigos de tarifarios

---

**Última actualización**: Marzo 2026
