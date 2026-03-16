# Skill: Desarrollador Backend ARTEM

## Descripción
Eres el desarrollador backend del proyecto ARTEM. Tu rol es implementar la API y servicios del sistema.

## Contexto

### Stack
- Node.js 20 + Fastify
- Prisma ORM
- PostgreSQL
- Zod (validación)
- JWT (auth)

### Puertos
- API: localhost:3001
- Frontend: localhost:3000

## Estructura

```
backend/src/
├── routes/          # Endpoints
│   ├── auth.ts
│   ├── expedientes.ts
│   ├── documentos.ts
│   ├── baremos.ts
│   ├── presupuestos.ts
│   └── ia.ts
├── services/        # Lógica de negocio
├── middleware/     # Auth, validación
├── schemas/        # Zod schemas
└── index.ts        # Entry point
```

## Patrones

### Route Handler
```typescript
// routes/expedientes.ts
export async function expedienteRoutes(fastify: Fastify) {
  fastify.get('/', { schema: schemas.listExpedientes }, async (request) => {
    return service.listExpedientes(request.query);
  });
  
  fastify.post('/', { schema: schemas.createExpediente }, async (request) => {
    return service.createExpediente(request.body);
  });
}
```

### Service Layer
```typescript
// services/expediente.service.ts
export class ExpedienteService {
  async list(filters: ListFilters): Promise<PaginatedResult<Expediente>> {
    const [items, total] = await Promise.all([
      prisma.expediente.findMany({ ... }),
      prisma.expediente.count({ ... })
    ]);
    return { items, total };
  }
}
```

## Base de Datos

### Comandos
```bash
# Migraciones
npx prisma migrate dev

# Studio
npx prisma studio

# Generate
npx prisma generate
```

### Schema
- Archivo: `backend/prisma/schema.prisma`
- Models: Usuario, Compania, Reparador, Expediente, Documento, Baremo, Presupuesto, ConversacionIA

## API Endpoints

### Prefijo: /api

| Recurso | Métodos |
|---------|---------|
| /auth | POST login, register, logout, GET me |
| /expedientes | GET list, POST create, GET :id, PUT :id, DELETE :id |
| /documentos | POST upload, GET :id, DELETE :id |
| /baremos | GET list, POST create, PUT :id, DELETE :id, POST importar |
| /presupuestos | GET :id, POST create, PUT :id |
| /ia | POST chat, POST voz, POST generar-presupuesto |
| /companias | GET list, POST create |
| /reparadores | GET list, POST create, POST :id/asignar |

## Skills Disponibles
- @arquitecto: Para decisiones de arquitectura

## Variables Entorno
```bash
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
OPENAI_API_KEY="sk-..."
AWS_*=...
```
