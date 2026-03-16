# Arquitectura Técnica - ARTEM

## 1. Stack Tecnológico

### 1.1 Frontend
- **Framework**: Next.js 14 (React) - SSR/ISR para SEO y rendimiento
- **UI Library**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Formularios**: React Hook Form + Zod
- **Voz/Texto**: Web Speech API + Custom Hooks

### 1.2 Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Fastify (rendimiento superior a Express)
- **ORM**: Prisma
- **Validación**: Zod
- **Autenticación**: JWT + Cookies httpOnly

### 1.3 Base de Datos
- **Motor**: PostgreSQL 15
- **Hosting**: Supabase (PostgreSQL + Auth + Storage) o Railway
- **Índices**: Como especificado en sección 6.3

### 1.4 Almacenamiento de Archivos
- **Proveedor**: AWS S3 o Supabase Storage
- **CDN**: CloudFront (si AWS)
- **Límites**: PDF 50MB, fotos 10MB c/u

### 1.5 IA y Voz
- **LLM**: OpenAI GPT-4o (API)
- **Embedding**: OpenAI text-embedding-3-small (búsqueda semantic)
- **Voz**: 
  - Entrada: Web Speech API (STT) o Deepgram
  - Salida: Web Speech API (TTS) o ElevenLabs

---

## 2. Estructura del Proyecto

```
ARTEM/
├── frontend/                    # Next.js app
│   ├── src/
│   │   ├── app/                 # App Router
│   │   │   ├── (auth)/          # Rutas autenticación
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/     # Rutas protegidas
│   │   │   │   ├── expedientes/
│   │   │   │   ├── baremos/
│   │   │   │   └── ai/
│   │   │   ├── api/             # API Routes (proxy)
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── ui/              # Componentes base
│   │   │   ├── forms/            # Formularios
│   │   │   ├── expediente/      # Componentes expediente
│   │   │   ├── baremos/         # Componentes baremos
│   │   │   └── ai/              # Componentes asistente
│   │   ├── hooks/               # Custom hooks
│   │   │   ├── useSpeech.ts
│   │   │   └── useIA.ts
│   │   ├── lib/
│   │   │   ├── api.ts           # Cliente API
│   │   │   ├── auth.ts          # Utilidades auth
│   │   │   └── utils.ts
│   │   ├── stores/              # Zustand stores
│   │   └── types/               # TypeScript types
│   ├── public/
│   ├── package.json
│   └── tailwind.config.ts
│
├── backend/                     # Fastify API
│   ├── src/
│   │   ├── routes/              # Endpoints
│   │   │   ├── auth.ts
│   │   │   ├── expedientes.ts
│   │   │   ├── documentos.ts
│   │   │   ├── baremos.ts
│   │   │   ├── presupuestos.ts
│   │   │   ├── reparadores.ts
│   │   │   ├── companias.ts
│   │   │   └── ia.ts
│   │   ├── services/            # Lógica de negocio
│   │   │   ├── ia.service.ts
│   │   │   ├── presupuesto.service.ts
│   │   │   └── documento.service.ts
│   │   ├── plugins/             # Plugins Fastify
│   │   ├── middleware/          # Auth, validación
│   │   ├── schemas/              # Zod schemas
│   │   └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 3. Patrones de Diseño

### 3.1 Arquitectura General
- **Pattern**: Clean Architecture (3 capas)
  - **Presentation**: Next.js + Componentes
  - **Application**: Fastify Routes + Services
  - **Domain**: Prisma + Models

### 3.2 Patrones Específicos

| Patrón | Uso |
|--------|-----|
| Repository | Prisma Client abstraction |
| Service Layer | Lógica de negocio en `/services` |
| DTO | Zod schemas para validación |
| Middleware | Auth, logging, validación |
| Factory | Creación de presupuestos |
| Strategy | Diferentes baremos por compañía |

### 3.3 Frontend Patterns
- **Compound Components**: Componentes compuestos (Tabs, Accordion)
- **Render Props**: Para hooks de voz/IA
- **Custom Hooks**: Lógica reutilizable
- **Presenter**: Separación UI/lógica en formularios

---

## 4. API Endpoints

### 4.1 Autenticación
```
POST   /api/auth/register     # Registrar usuario
POST   /api/auth/login        # Iniciar sesión
POST   /api/auth/logout       # Cerrar sesión
GET    /api/auth/me           # Usuario actual
POST   /api/auth/refresh      # Refresh token
```

### 4.2 Expedientes
```
GET    /api/expedientes              # Listar (paginado, filtros)
GET    /api/expedientes/:id           # Ver expediente
POST   /api/expedientes              # Crear expediente
PUT    /api/expedientes/:id           # Actualizar expediente
DELETE /api/expedientes/:id           # Eliminar expediente
GET    /api/expedientes/:id/documentos  # Documentos del expediente
GET    /api/expedientes/:id/presupuestos # Presupuestos del expediente
```

### 4.3 Documentos
```
POST   /api/documentos/upload        # Subir documento
GET    /api/documentos/:id           # Descargar documento
DELETE /api/documentos/:id           # Eliminar documento
```

### 4.4 Baremos
```
GET    /api/baremos                  # Listar baremos
GET    /api/baremos/:id              # Ver baremo
GET    /api/baremos/companias/:id    # Baremos por compañía
POST   /api/baremos                  # Crear baremo
PUT    /api/baremos/:id              # Actualizar baremo
DELETE /api/baremos/:id              # Eliminar baremo
POST   /api/baremos/importar         # Importar baremo (Excel/PDF)
```

### 4.5 Reparadores
```
GET    /api/reparadores              # Listar reparadores
GET    /api/reparadores/:id          # Ver reparador
POST   /api/reparadores              # Crear reparador
PUT    /api/reparadores/:id          # Actualizar reparador
DELETE /api/reparadores/:id          # Eliminar reparador
POST   /api/expedientes/:id/asignar-reparador  # Asignar a expediente
```

### 4.6 Compañías
```
GET    /api/companias                # Listar compañías
GET    /api/companias/:id            # Ver compañía
POST   /api/companias                # Crear compañía
PUT    /api/companias/:id            # Actualizar compañía
DELETE /api/companias/:id            # Eliminar compañía
```

### 4.7 Presupuestos
```
GET    /api/presupuestos/:id         # Ver presupuesto
POST   /api/presupuestos            # Crear presupuesto
PUT    /api/presupuestos/:id        # Actualizar presupuesto
PUT    /api/presupuestos/:id/estado # Cambiar estado
DELETE /api/presupuestos/:id        # Eliminar presupuesto
```

### 4.8 Asistente IA
```
POST   /api/ia/chat                 # Chat con IA
POST   /api/ia/voz                  # Procesar voz
POST   /api/ia/generar-presupuesto  # Generar presupuesto
GET    /api/ia/historial/:expedienteId  # Historial conversación
POST   /api/ia/buscar-siniestro     # Buscar por ubicación
```

---

## 5. Estructura de Base de Datos

### 5.1 Schema Prisma

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Rol {
  ADMIN
  PERITO
  GESTOR
}

enum EstadoExpediente {
  NUEVO
  EN_TRAMITACION
  PENDIENTE_DOCUMENTACION
  PRESUPUESTO_PENDIENTE
  PRESUPUESTO_APROBADO
  EN_REPARACION
  FINALIZADO
  CERRADO
}

enum TipoDocumento {
  PARTE_COMPANIA
  PRESUPUESTO
  FOTO
  OTRO
}

enum EstadoPresupuesto {
  BORRADOR
  ENVIADO
  APROBADO
  RECHAZADO
}

model Usuario {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String    @map("password_hash")
  nombre        String
  apellidos     String?
  rol           Rol       @default(GESTOR)
  activo        Boolean   @default(true)
  fechaCreacion DateTime  @default(now()) @map("fecha_creacion")
  ultimoLogin   DateTime? @map("ultimo_login")

  expedientes    Expediente[]
  documentos     Documento[]
  baremos        Baremo[]
  presupuestos   Presupuesto[]

  @@map("usuarios")
}

model Compania {
  id       String  @id @default(uuid())
  nombre   String
  codigo   String  @unique
  activo   Boolean @default(true)

  expedientes Expediente[]
  baremos     Baremo[]

  @@map("companias")
}

model Reparador {
  id            String   @id @default(uuid())
  nombre        String
  direccion     String?
  telefono      String?
  email         String?
  especialidades String[]
  activo        Boolean  @default(true)

  expedientes Expediente[]

  @@map("reparadores")
}

model Expediente {
  id              String            @id @default(uuid())
  numeroSiniestro String            @unique @map("numero_siniestro")
  companiaId      String            @map("compania_id")
  fechaSiniestro  DateTime          @map("fecha_siniestro")
  direccion       String
  codigoPostal    String?           @map("codigo_postal")
  ciudad          String?
  descripcion     String?
  estado          EstadoExpediente  @default(NUEVO)
  reparadorId     String?           @map("reparador_id")
  usuarioCreadorId String           @map("usuario_creador_id")
  fechaCreacion   DateTime          @default(now()) @map("fecha_creacion")
  fechaActualizacion DateTime       @updatedAt @map("fecha_actualizacion")

  compania      Compania      @relation(fields: [companiaId], references: [id])
  reparador     Reparador?    @relation(fields: [reparadorId], references: [id])
  usuarioCreador Usuario      @relation(fields: [usuarioCreadorId], references: [id])
  documentos    Documento[]
  presupuestos  Presupuesto[]
  conversaciones ConversacionIA[]

  @@index([estado])
  @@index([companiaId])
  @@index([fechaSiniestro])
  @@map("expedientes")
}

model Documento {
  id              String        @id @default(uuid())
  expedienteId    String        @map("expediente_id")
  tipo            TipoDocumento
  nombreArchivo   String        @map("nombre_archivo")
  url             String
  tamano          Int
  mimeType        String        @map("mime_type")
  usuarioSubidaId String        @map("usuario_subida_id")
  fechaSubida     DateTime      @default(now()) @map("fecha_subida")

  expediente Expediente @relation(fields: [expedienteId], references: [id])
  usuario   Usuario     @relation(fields: [usuarioSubidaId], references: [id])

  @@index([expedienteId])
  @@map("documentos")
}

model Baremo {
  id            String   @id @default(uuid())
  nombre        String
  companiaId    String   @map("compania_id")
  fechaVigencia DateTime @map("fecha_vigencia")
  conceptos     Json     @default("[]")
  usuarioCreadorId String @map("usuario_creador_id")
  fechaCreacion DateTime @default(now()) @map("fecha_creacion")

  compania    Compania     @relation(fields: [companiaId], references: [id])
  usuario     Usuario      @relation(fields: [usuarioCreadorId], references: [id])
  presupuestos Presupuesto[]

  @@index([companiaId])
  @@map("baremos")
}

model Presupuesto {
  id              String            @id @default(uuid())
  expedienteId    String            @map("expediente_id")
  baremoId        String            @map("baremo_id")
  conceptos       Json              @default("[]")
  total           Float             @default(0)
  estado          EstadoPresupuesto @default(BORRADOR)
  notas           String?
  fechaCreacion   DateTime          @default(now()) @map("fecha_creacion")
  fechaActualizacion DateTime        @updatedAt @map("fecha_actualizacion")

  expediente Expediente @relation(fields: [expedienteId], references: [id])
  baremo    Baremo     @relation(fields: [baremoId], references: [id])

  @@index([expedienteId])
  @@map("presupuestos")
}

model ConversacionIA {
  id           String   @id @default(uuid())
  expedienteId String?  @map("expediente_id")
  tipo         String   @default("texto") // "texto" | "voz"
  mensajes     Json     @default("[]")
  fechaInicio  DateTime @default(now()) @map("fecha_inicio")
  fechaFin     DateTime? @map("fecha_fin")

  expediente Expediente? @relation(fields: [expedienteId], references: [id])

  @@index([expedienteId])
  @@map("conversaciones_ia")
}
```

---

## 6. Configuración de Servicios

### 6.1 Asistente IA (OpenAI)

```typescript
// backend/src/services/ia.service.ts

interface Message {
  rol: 'usuario' | 'asistente';
  contenido: string;
  timestamp: Date;
}

interface ArtemSystemPrompt {
  rol: 'system';
  contenido: string;
}

const SYSTEM_PROMPT: ArtemSystemPrompt = {
  rol: 'system',
  contenido: `
Eres ARTEM, asistente IA especializado en gestión de siniestros de seguros.
Tu función es ayudar a peritos y gestores a:
- Buscar información de expedientes por ubicación o número de siniestro
- Generar presupuestos basados en baremos disponibles
- Resolver dudas sobre el proceso de siniestros
- Proporcionar información sobre el estado de expedientes

Tienes acceso a:
- Expedientes de siniestro con todos sus documentos
- Baremos de precios por compañía de seguros
- Historial de presupuestos

Responde de forma clara, concisa y profesional.
Si no tienes información suficiente, pide clarification.
`
};

export class IAService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async chat(mensajes: Message[], contexto?: Record<string, unknown>) {
    const messages = [SYSTEM_PROMPT, ...mensajes.map(m => ({
      role: m.rol,
      content: m.contenido,
    }))];

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages as ChatCompletionMessageParam[],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content;
  }

  async generarPresupuesto(expedienteId: string, danos: string[]): Promise<Presupuesto> {
    // 1. Obtener expediente y baremos de la compañía
    // 2. Enviar a IA con los daños documentados
    // 3. Generar presupuesto basado en conceptos del baremo
    // 4. Guardar como borrador
  }

  async buscarPorUbicacion(ubicacion: string): Promise<Expediente[]> {
    // Búsqueda semántica usando embeddings
  }
}
```

### 6.2 Voz (Speech-to-Text / Text-to-Speech)

```typescript
// frontend/src/hooks/useSpeech.ts

interface UseSpeechOptions {
  onTranscript?: (text: string) => void;
  onSpeaking?: (speaking: boolean) => void;
  lang?: string;
}

export function useSpeech(options: UseSpeechOptions = {}) {
  const { onTranscript, onSpeaking, lang = 'es-ES' } = options;
  
  const speechRecognition = useRef<SpeechRecognition | null>(null);
  const speechSynthesis = useRef<SpeechSynthesisUtterance | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported');
      return;
    }

    speechRecognition.current = new SpeechRecognition();
    speechRecognition.current.lang = lang;
    speechRecognition.current.continuous = false;
    speechRecognition.current.interimResults = true;

    speechRecognition.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      onTranscript?.(transcript);
    };

    speechRecognition.current.onstart = () => setIsListening(true);
    speechRecognition.current.onend = () => setIsListening(false);
    
    speechRecognition.current.start();
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    speechSynthesis.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopListening = () => {
    speechRecognition.current?.stop();
  };

  return {
    isListening,
    isSpeaking,
    startListening,
    stopListening,
    speak,
  };
}
```

### 6.3 Variables de Entorno

```bash
# .env

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/artem"

# Auth
JWT_SECRET="your-secret-key-min-32-chars"
JWT_EXPIRES_IN="7d"

# OpenAI
OPENAI_API_KEY="sk-..."

# Storage (AWS S3)
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_BUCKET_NAME="artem-documents"
AWS_REGION="eu-west-1"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## 7. Seguridad

### 7.1 Autenticación
- JWT en cookies httpOnly (SameSite=Strict)
- Refresh token mechanism
- Rate limiting en login

### 7.2 Autorización
- RBAC: ADMIN, PERITO, GESTOR
- ownership check en endpoints

### 7.3 Datos
- Passwords: bcrypt hashing
- Archivos: signed URLs (15 min expiry)
- SQL: Prisma parameterized queries

---

## 8. Despliegue

### 8.1 Desarrollo
```bash
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: artem
      POSTGRES_USER: artem
      POSTGRES_PASSWORD: artem
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://artem:artem@postgres:5432/artem
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 8.2 Producción Recomendada
- **Frontend**: Vercel (Next.js)
- **Backend**: Railway o Render
- **DB**: Supabase o Railway PostgreSQL
- **Storage**: Supabase Storage o AWS S3
- **CDN**: CloudFront (si S3)

---

*Documento de Arquitectura Técnica - ARTEM v1.0*
