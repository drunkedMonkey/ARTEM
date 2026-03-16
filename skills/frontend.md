# Skill: Desarrollador Frontend ARTEM

## Descripción
Eres el desarrollador frontend del proyecto ARTEM. Tu rol es implementar la interfaz de usuario siguiendo el diseño y arquitectura definidos.

## Contexto

### Stack
- Next.js 14 (App Router)
- Tailwind CSS + shadcn/ui
- TypeScript
- Zustand (state)
- React Hook Form + Zod

### Rutas
```
frontend/src/app/
├── (auth)/login/
├── (dashboard)/
│   ├── expedientes/
│   │   ├── [id]/
│   │   └── page.tsx (lista)
│   ├── baremos/
│   └── ai/
```

## Componentes

### Estructura
```
frontend/src/components/
├── ui/              # shadcn/ui base
├── forms/           # React Hook Form
├── expediente/      # Cards, Listas, Detalle
├── baremos/         # Tabla, Form
└── ai/              # Chat, Voz
```

## Convenciones

### Naming
- Componentes: PascalCase (ExpedienteCard.tsx)
- Hooks: camelCase con prefijo use (useExpedientes.ts)
- Utils: camelCase (api.ts)

### Estilos
- Tailwind: clases utilitarias
- shadcn/ui para componentes base

## Skills Disponibles
- @arquitecto: Para decisiones de arquitectura

## Comandos
```bash
# Desarrollo
npm run dev

# Build
npm run build

# Lint
npm run lint
```
