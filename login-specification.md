# Especificación de Pantalla de Login - ARTEM

## 1. Información General

**Proyecto:** ARTEM - Sistema de Agentes IA para Desarrollo de Software  
**Pantalla:** Login / Autenticación  
**Versión:** 1.0  
**Fecha:** 15/03/2026  
**Tech Stack:** React + TypeScript + Mock API

---

## 2. Resumen Ejecutivo

Pantalla de autenticación para el sistema ARTEM que permite a los usuarios acceder a la plataforma de agentes IA para desarrollo de software. El diseño sigue un estilo moderno, minimalista con temática oscura y acentos en azul/púrpura.

---

## 3. Requisitos Funcionales

### 3.1 Métodos de Autenticación

| Método | Descripción | Prioridad |
|--------|-------------|-----------|
| Email + Contraseña | Credenciales tradicionales | Requerido |
| Recordar usuario | Checkbox para persistir sesión | Opcional |
| Recuperación de contraseña | Link para resetear contraseña | Requerido |
| Registro de usuarios | Link a pantalla de registro | Requerido |

### 3.2 Campos del Formulario

| Campo | Tipo | Validación | Requerido |
|-------|------|------------|-----------|
| Email | email | Formato válido de email | Sí |
| Contraseña | password | Mínimo 8 caracteres | Sí |
| Recordar usuario | checkbox | Boolean | No |

### 3.3 Comportamiento del Formulario

- Validación en tiempo real al perder el foco (blur)
- Mensajes de error claros y específicos
- Botón deshabilitado hasta completar campos requeridos
- Loading state durante autenticación
- Redirección a dashboard tras login exitoso

### 3.4 API Mock

```typescript
// Endpoint: POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
  token: string;
  expiresIn: number;
}

// Endpoint: POST /api/auth/forgot-password
interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}
```

**Simulaciones:**
- Login exitoso: Retorna usuario demo tras 1.5s de delay
- Login fallido: Error de credenciales tras 1s de delay
- Forgot password: Email de recuperación enviado tras 1s

---

## 4. Requisitos de Diseño

### 4.1 Paleta de Colores

| Nombre | Hex | Uso |
|--------|-----|-----|
| Background Primary | `#0D0D12` | Fondo principal |
| Background Secondary | `#16161D` | Tarjetas, inputs |
| Background Tertiary | `#1E1E28` | Hover states |
| Accent Primary | `#6366F1` | Botón primario, links |
| Accent Secondary | `#8B5CF6` | Gradientes, acentos |
| Accent Gradient | `linear-gradient(135deg, #6366F1, #8B5CF6)` | Highlights |
| Text Primary | `#F8FAFC` | Títulos, texto principal |
| Text Secondary | `#94A3B8` | Labels, placeholders |
| Text Muted | `#64748B` | Texto secundario |
| Success | `#22C55E` | Mensajes exitosos |
| Error | `#EF4444` | Mensajes de error |
| Border | `#2D2D3A` | Bordes de inputs |

### 4.2 Tipografía

| Elemento | Font | Weight | Size | Line Height |
|----------|------|--------|------|-------------|
| Logo | Inter | 700 | 28px | 1.2 |
| Título | Inter | 600 | 24px | 1.3 |
| Subtítulo | Inter | 400 | 14px | 1.5 |
| Labels | Inter | 500 | 14px | 1.4 |
| Inputs | Inter | 400 | 16px | 1.5 |
| Botones | Inter | 600 | 16px | 1.0 |
| Links | Inter | 500 | 14px | 1.4 |

### 4.3 Espaciado

| Elemento | Valor |
|----------|-------|
| Container padding | 48px |
| Card padding | 40px |
| Input gap | 20px |
| Section gap | 24px |
| Button padding | 12px 24px |
| Border radius (card) | 16px |
| Border radius (inputs) | 10px |
| Border radius (buttons) | 10px |

### 4.4 Layout

```
┌─────────────────────────────────────────────┐
│              Background + Pattern           │
│                                             │
│    ┌─────────────────────────────────┐      │
│    │           LOGO                 │      │
│    │           ARTEM                │      │
│    │                                 │      │
│    │     Welcome back               │      │
│    │     Sign in to continue        │      │
│    │                                 │      │
│    │  ┌─────────────────────────┐   │      │
│    │  │ Email                   │   │      │
│    │  └─────────────────────────┘   │      │
│    │                                 │      │
│    │  ┌─────────────────────────┐   │      │
│    │  │ Password                │   │      │
│    │  └─────────────────────────┘   │      │
│    │                                 │      │
│    │  ☐ Remember me    [Forgot?]  │      │
│    │                                 │      │
│    │  ┌─────────────────────────┐   │      │
│    │  │     Sign In             │   │      │
│    │  └─────────────────────────┘   │      │
│    │                                 │      │
│    │   Don't have an account?       │      │
│    │   [Create one]                │      │
│    └─────────────────────────────────┘      │
│                                             │
└─────────────────────────────────────────────┘
```

**Responsive:**
- Mobile (< 480px): Ancho 100%, padding 24px
- Tablet (480px - 768px): Ancho 420px, padding 32px
- Desktop (> 768px): Ancho 440px, padding 40px

### 4.5 Efectos Visuales

- Fondo con gradiente sutil y patrón de grid sutil
- Card con `box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5)`
- Inputs con transición de 200ms en border-color y box-shadow
- Botón con efecto hover: slight scale (1.02) y brillo
- Loading spinner animado durante autenticación
- Transiciones suaves en todos los estados (200ms ease)

---

## 5. Accesibilidad (WCAG 2.1 AA)

### 5.1 Requisitos Obligatorios

| Requisito | Implementación |
|-----------|----------------|
| Contraste texto | Ratio mínimo 4.5:1 para texto normal |
| ContrasteUI | Ratio mínimo 3:1 para componentes UI |
| Labels | Todos los inputs tienen label asociado |
| Focus visible | Outline visible en focus (2px solid #6366F1) |
| Error announce | Mensajes de error anunciados a screen readers |
| Autocomplete | Atributos autocomplete en campos |
| aria-describedby | Errores vinculados a inputs |
| aria-live | Region live para mensajes de estado |

### 5.2 Navegación

- Tab order logical: Logo → Email → Password → Remember → Submit
- Skip to main content link
- Enter submission del formulario
- Escape para cerrar modales (recuperación password)

### 5.3 Estados de Focus

```css
:focus-visible {
  outline: 2px solid #6366F1;
  outline-offset: 2px;
}
```

---

## 6. Componentes

### 6.1 Input Field

**Props:**
```typescript
interface InputProps {
  id: string;
  label: string;
  type: 'email' | 'password';
  placeholder?: string;
  error?: string;
  autocomplete: string;
  required?: boolean;
  disabled?: boolean;
}
```

**Estados:**
- Default: Border #2D2D3A, bg #16161D
- Focus: Border #6366F1, box-shadow glow
- Error: Border #EF4444, mensaje de error
- Disabled: Opacity 0.5, cursor not-allowed

### 6.2 Checkbox

**Props:**
```typescript
interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}
```

### 6.3 Button

**Props:**
```typescript
interface ButtonProps {
  type: 'submit' | 'button';
  variant: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}
```

### 6.4 Link

**Props:**
```typescript
interface LinkProps {
  to: string;
  children: React.ReactNode;
  variant: 'primary' | 'secondary';
}
```

---

## 7. Funcionalidades Adicionales

### 7.1 Recuperación de Contraseña

- Modal o página separada
- Campo: Email
- Submit → Mock response "Email de recuperación enviado"
- Link de retorno al login

### 7.2 Registro de Usuarios

- Link externo a pantalla de registro
- URL: `/register`

### 7.3 Validaciones

| Campo | Reglas |
|-------|--------|
| Email | Required, formato email válido |
| Contraseña | Required, mínimo 8 caracteres |

### 7.4 Manejo de Errores

| Escenario | Mensaje |
|-----------|---------|
| Email vacío | "El email es requerido" |
| Email inválido | "Ingresa un email válido" |
| Contraseña vacía | "La contraseña es requerida" |
| Contraseña corta | "Mínimo 8 caracteres" |
| Credenciales inválidas | "Email o contraseña incorrectos" |
| Error de red | "Error de conexión. Intenta de nuevo" |

---

## 8. Criterios de Aceptación

### 8.1 Funcionales

- [ ] Usuario puede iniciar sesión con email y contraseña
- [ ] Validación en tiempo real funciona correctamente
- [ ] Recordar usuario persiste el email en localStorage
- [ ] Link de recuperación de contraseña abre modal/página
- [ ] Link de registro redirige a /register
- [ ] Loading state visible durante autenticación
- [ ] Redirección a dashboard tras login exitoso

### 8.2 Visuales

- [ ] Diseño coincide con paleta de colores especificada
- [ ] Tipografía correcta según especificación
- [ ] Espaciado y border-radius correctos
- [ ] Efectos hover y focus funcionan
- [ ] Responsive en mobile, tablet, desktop

### 8.3 Accesibilidad

- [ ] Contraste cumple WCAG AA
- [ ] Navegación por teclado funciona
- [ ] Focus visible en todos los elementos
- [ ] Screen readers anuncian errores
- [ ] Labels asociados correctamente

---

## 9. Estructura de Archivos

```
src/
├── components/
│   ├── Login/
│   │   ├── LoginForm.tsx
│   │   ├── LoginForm.module.css
│   │   ├── Input.tsx
│   │   ├── Button.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Link.tsx
│   │   └── index.ts
│   └── Modal/
│       ├── ForgotPasswordModal.tsx
│       └── index.ts
├── hooks/
│   └── useAuth.ts
├── api/
│   └── mock/
│       └── auth.ts
├── types/
│   └── auth.ts
├── pages/
│   └── LoginPage.tsx
├── styles/
│   └── global.css
└── App.tsx
```

---

## 10. Notas

- Mock API con delay para simular network
- Token almacenado en localStorage (si rememberMe) o sessionStorage
- Demo credentials: demo@artem.ai / demo123456
- Considerar rate limiting visual después de 3 intentos fallidos
