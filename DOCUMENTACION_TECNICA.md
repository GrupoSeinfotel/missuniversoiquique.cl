# Documentación Técnica - Miss Universe Iquique

**Versión:** 1.0.0  
**Última actualización:** Enero 2026  
**Desarrollador Principal:** Juan Limache

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
4. [Base de Datos](#base-de-datos)
5. [Sistema de Autenticación](#sistema-de-autenticación)
6. [Módulos Principales](#módulos-principales)
7. [API Endpoints](#api-endpoints)
8. [Sistema de Slider (Hero)](#sistema-de-slider-hero)
9. [Sistema de Assets](#sistema-de-assets)
10. [Deployment](#deployment)
11. [Guía de Desarrollo](#guía-de-desarrollo)
12. [Resolución de Problemas](#resolución-de-problemas)

---

## 1. Resumen Ejecutivo

**Miss Universe Iquique** es una plataforma web fullstack moderna para la gestión, votación y promoción de candidatas al concurso Miss Universe Iquique. El sistema integra:

- **Portal Público:** Landing page con slider animado, galería de candidatas, sponsors, información del evento
- **Sistema de Votación:** Votación gratuita y premium (con MercadoPago)
- **Panel de Administración:** Gestión completa de candidatas, contenido, assets, misiones, feed social
- **Dashboard de Candidatas:** Perfil, misiones, patrocinadores, estadísticas
- **Sistema de Gamificación:** Puntos por misiones completadas (Instagram, TikTok, etc.)
- **Votación Artificial Inteligente:** Sistema de crecimiento orgánico simulado para engagement

---

## 2. Stack Tecnológico

### Frontend
```json
{
  "framework": "Next.js 16.1.1 (App Router)",
  "runtime": "React 19.2.3",
  "styling": "Tailwind CSS + Custom CSS",
  "animations": "GSAP 3.14.2 + Framer Motion 12.26.1",
  "ui-components": "Lucide React, React Icons",
  "slider": "Swiper 12.0.3",
  "editor": "React Moveable 0.56.0"
}
```

### Backend
```json
{
  "runtime": "Node.js (Next.js API Routes)",
  "orm": "Prisma 6.19.1",
  "database": "MySQL",
  "auth": "Lucia Auth 3.2.2",
  "payments": "Mercadopago SDK 2.12.0",
  "pdf": "pdf-lib 1.17.1",
  "realtime": "Socket.IO 4.8.3"
}
```

### DevTools
```json
{
  "language": "TypeScript 5.9.3",
  "linter": "ESLint 9",
  "package-manager": "npm"
}
```

---

## 3. Arquitectura del Proyecto

### Estructura de Carpetas

```
missuniversoiquique.cl/
├── prisma/
│   ├── schema.prisma              # Definición de modelos de BD
│   ├── seed.ts                    # Datos iniciales
│   └── generated/                 # Cliente Prisma generado
├── public/
│   ├── assets/                    # Imágenes/Videos subidos por usuarios
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── (rutas públicas)
│   │   │   ├── page.tsx           # Homepage
│   │   │   ├── casting/           # Formulario de postulación
│   │   │   ├── candidata/[slug]/  # Perfil público de candidata
│   │   │   ├── sponsors/          # Página de patrocinadores
│   │   │   ├── descubre-iquique/  # Landing de turismo
│   │   │   └── sobre-nosotros/    # Acerca de
│   │   ├── admin/
│   │   │   ├── dashboard/         # Panel principal admin
│   │   │   ├── candidates/        # CRUD candidatas
│   │   │   ├── directors/         # Gestión de directores
│   │   │   ├── slider/
│   │   │   │   ├── page.tsx       # Lista de sliders
│   │   │   │   └── editor/        # Editor visual de slider
│   │   │   ├── assets/            # Gestor de archivos
│   │   │   ├── missions/          # CRUD misiones
│   │   │   ├── feed/              # Feed social
│   │   │   └── settings/          # Configuración CMS
│   │   ├── dashboard/             # Dashboard de candidatas
│   │   ├── sponsor/               # Panel de patrocinadores
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── logout/
│   │   ├── api/
│   │   │   ├── auth/              # Endpoints de autenticación
│   │   │   ├── admin/             # APIs protegidas admin
│   │   │   │   ├── candidates/    # CRUD candidatas
│   │   │   │   ├── slider/        # Gestión de sliders
│   │   │   │   ├── assets/        # Upload/delete archivos
│   │   │   │   ├── settings/      # CMS settings
│   │   │   │   └── directors/     # Gestión directores
│   │   │   ├── voting/            # Sistema de votación
│   │   │   ├── mercadopago/       # Webhooks MercadoPago
│   │   │   └── public/            # APIs públicas (sin auth)
│   │   ├── globals.css            # Estilos globales
│   │   └── layout.tsx             # Layout raíz
│   ├── components/
│   │   ├── home/
│   │   │   ├── HeroExact.tsx      # Hero con slider
│   │   │   ├── CandidatesSection.tsx
│   │   │   ├── CountdownSection.tsx
│   │   │   └── SponsorsSection.tsx
│   │   ├── ui/
│   │   │   ├── ResponsiveSlider.tsx  # Componente de slider
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ...
│   │   └── admin/
│   │       └── ...
│   └── lib/
│       ├── auth.ts                # Configuración Lucia Auth
│       ├── db.ts                  # Cliente Prisma
│       └── utils.ts
├── .env                           # Variables de entorno
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Patrón de Arquitectura

**Next.js App Router con Server Components**
- **Server Components (RSC):** Fetching de datos, SEO, rendering inicial
- **Client Components:** Interactividad, estado, animaciones
- **API Routes:** Backend RESTful integrado
- **Middleware:** Protección de rutas, autenticación

---

## 4. Base de Datos

### Diagrama de Modelos (Simplificado)

```
┌─────────────┐
│    User     │──────┐
└─────────────┘      │
       │             │
       │ 1:1         │ 1:N
       ▼             ▼
┌─────────────┐  ┌─────────────┐
│  Candidate  │  │   Session   │
└─────────────┘  └─────────────┘
    │   │   │
    │   │   └── 1:N ─▶ CandidatePhoto
    │   └──── 1:N ─▶ SponsorPyme
    └──────── 1:N ─▶ Vote

┌─────────────┐
│  HeroSlide  │ (Sistema de Slider)
└─────────────┘

┌─────────────┐
│    Asset    │ (Archivos subidos)
└─────────────┘
```

### Modelos Clave

#### **User**
```prisma
model User {
  id             String    @id @default(cuid())
  email          String    @unique
  username       String?   @unique
  slug           String?   @unique
  hashedPassword String
  role           Role      @default(VOTER)  // SUPERADMIN | DIRECTOR | CANDIDATE | SPONSOR_PYME | VOTER
  
  candidate      Candidate?
  sessions       Session[]
  votes          Vote[]
  // ... otros campos
}
```

#### **Candidate**
```prisma
model Candidate {
  id              String   @id @default(cuid())
  userId          String   @unique
  fullName        String
  birthDate       DateTime
  height          Float
  bio             String?
  videoPitchUrl   String?
  instagram       String?
  points          Int      @default(0)
  status          Status   @default(PENDING)  // PENDING | APPROVED | REJECTED
  
  // Votación artificial inteligente
  growthBaseVotes Int      @default(0)
  growthRate      Float    @default(0)
  artificialVotes Int      @default(0)
  
  photos         CandidatePhoto[]
  sponsors       SponsorPyme[]
  votes          Vote[]
}
```

#### **HeroSlide**
```prisma
model HeroSlide {
  id         String   @id          // Ej: "home-main"
  name       String
  configJson String   @db.LongText // JSON con slides, layers, settings
  updatedAt  DateTime @updatedAt
}
```

**Estructura del JSON:**
```json
{
  "settings": {
    "canvasHeightDesktop": 800,
    "canvasHeightMobile": 600,
    "autoPlay": true,
    "delay": 5000
  },
  "slides": [
    {
      "id": "slide_1",
      "backgroundSrc": "/assets/1768426536234_imagen.jpeg",
      "backgroundPosition": { "x": 17, "y": 42 },
      "layers": [
        {
          "id": "layer_1768417317690",
          "type": "text | image",
          "content": "<h1>MISS UNIVERSE</h1>",
          "src": "/assets/modelo.png",
          "zIndex": 10,
          "animation": "fade-in-up | fade-in-right | scale-up",
          "animationDelay": 0.5,
          "animationDuration": 1.2,
          "desktop": {
            "top": 100,
            "left": 200,
            "width": 800,
            "height": "auto",
            "fontSize": 80,
            "color": "#ffffff",
            "opacity": 1,
            "visible": true
          },
          "mobile": {
            "top": 50,
            "left": 20,
            "fontSize": 40,
            "visible": true
          },
          "style": {
            "fontWeight": "900",
            "fontFamily": "Raleway, sans-serif",
            "gradient": "linear-gradient(...)",
            "backgroundClip": "text"
          }
        }
      ]
    }
  ]
}
```

#### **Asset**
```prisma
model Asset {
  id        String   @id @default(cuid())
  name      String   // Nombre original del archivo
  url       String   // /assets/1768426536234_file.jpg
  type      String   // "image" | "video" | "file"
  ownerRole Role     // Control de acceso
  createdAt DateTime @default(now())
}
```

---

## 5. Sistema de Autenticación

### Tecnología: Lucia Auth v3

**Características:**
- ✅ Basado en sesiones (no JWT)
- ✅ Cookies HttpOnly seguras
- ✅ Compatible con Prisma
- ✅ RBAC (Role-Based Access Control)

### Flujo de Autenticación

```typescript
// src/lib/auth.ts
import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { db } from "./db";

const adapter = new PrismaAdapter(db.session, db.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production"
    }
  },
  getUserAttributes: (attributes) => ({
    email: attributes.email,
    role: attributes.role,
    username: attributes.username
  })
});
```

### Middleware de Protección

```typescript
// Ejemplo en API Route
export async function GET(request: Request) {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  
  const { user } = await lucia.validateSession(sessionId);
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  
  // Validar rol
  if (user.role !== "SUPERADMIN" && user.role !== "DIRECTOR") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  
  // Procesar request...
}
```

### Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **SUPERADMIN** | Full access: Gestión de directores, CMS settings, todo el panel admin |
| **DIRECTOR** | Panel admin (excepto gestión de directores y algunos settings) |
| **CANDIDATE** | Dashboard de candidata: editar perfil, ver misiones, ver patrocinadores |
| **SPONSOR_PYME** | Panel de sponsor: ver candidata patrocinada, subir comprobantes |
| **VOTER** | Solo votación pública |

---

## 6. Módulos Principales

### 6.1 Sistema de Votación

**Tipos de Voto:**
1. **Gratuito:** 1 voto por IP cada 24h
2. **Premium:** Voto pagado via MercadoPago (CLP $500 - $10,000)

**Votación Artificial Inteligente:**
```typescript
// Algoritmo de crecimiento orgánico simulado
const calculateArtificialVotes = (candidate: Candidate) => {
  const daysSinceStart = differenceInDays(new Date(), candidate.growthStartDate);
  const artificialVotes = Math.floor(
    candidate.growthBaseVotes * Math.pow(1 + candidate.growthRate, daysSinceStart)
  );
  return artificialVotes;
};
```

**Endpoints:**
- `POST /api/voting/free` - Voto gratuito (validación IP + cooldown)
- `POST /api/voting/premium` - Crear preferencia de pago MercadoPago
- `POST /api/mercadopago/webhook` - Confirmar pago y registrar voto

### 6.2 Sistema de Misiones (Gamificación)

**Flujo:**
1. Admin crea misión (ej: "Subir Reel a Instagram")
2. Candidata completa misión → Sube screenshot
3. Admin revisa → Aprueba/Rechaza
4. Si aprueba → Puntos sumados a `candidate.taskPoints`

**Endpoints:**
- `GET /api/admin/missions` - Listar misiones
- `POST /api/admin/missions` - Crear misión
- `POST /api/candidate/missions/submit` - Candidata envía evidencia
- `PATCH /api/admin/missions/submissions/:id` - Admin aprueba/rechaza

### 6.3 Feed Social

**Concepto:** Muro de publicaciones con engagement artificial

**Campos clave:**
```prisma
model FeedPost {
  content   String
  imageUrl  String?
  
  // Engagement real
  // (Actualmente no implementado, preparado para futuro)
  
  // Engagement artificial
  artificialLikes  Int @default(0)
  artificialShares Int @default(0)
  growthBaseLikes  Int
  growthLikesRate  Float
}
```

---

## 7. API Endpoints

### Autenticación
```
POST   /api/auth/register       - Registro de usuario
POST   /api/auth/login          - Login
POST   /api/auth/logout         - Logout
GET    /api/auth/user           - Usuario actual
```

### Candidatas (Admin)
```
GET    /api/admin/candidates                - Listar todas
GET    /api/admin/candidates/:id            - Detalle
POST   /api/admin/candidates                - Crear
PATCH  /api/admin/candidates/:id            - Actualizar
DELETE /api/admin/candidates/:id            - Eliminar
POST   /api/admin/candidates/:id/approve    - Aprobar
POST   /api/admin/candidates/:id/reject     - Rechazar
POST   /api/admin/candidates/:id/growth     - Configurar crecimiento artificial
```

### Candidatas (Público)
```
GET    /api/public/candidates               - Listar aprobadas
GET    /api/public/candidates/:slug         - Perfil público
```

### Slider
```
GET    /api/admin/slider?id=home-main       - Obtener slider
POST   /api/admin/slider                    - Guardar slider
DELETE /api/admin/slider?id=home-main       - Eliminar slider
```

### Assets
```
GET    /api/admin/assets/list               - Listar archivos
POST   /api/admin/assets                    - Upload archivo
PUT    /api/admin/assets                    - Renombrar
DELETE /api/admin/assets                    - Eliminar (BD + filesystem)
```

### Settings (CMS)
```
GET    /api/admin/settings/:key             - Obtener setting
POST   /api/admin/settings                  - Guardar setting (solo SUPERADMIN)
```

### Directores (Gestión)
```
GET    /api/admin/directors                 - Listar directores
POST   /api/admin/directors                 - Crear director (solo SUPERADMIN)
DELETE /api/admin/directors/:id             - Eliminar director (solo SUPERADMIN)
POST   /api/admin/directors/:id/reset-password - Reset password
```

---

## 8. Sistema de Slider (Hero)

### Arquitectura del Slider

El slider es un sistema complejo de 3 partes:

#### 8.1 Editor Visual (`/admin/slider/editor`)

**Tecnología:** React Moveable + GSAP

**Funcionalidades:**
- ✅ Canvas Desktop (1920x800) / Mobile (360x600+)
- ✅ Drag & Drop de capas (texto/imagen)
- ✅ Resize, rotate, ajustar posición con precisión
- ✅ Control de animaciones (fade-in-up, fade-in-right, scale-up)
- ✅ Timeline visual de animaciones
- ✅ Vista previa en tiempo real
- ✅ Configuración separada Desktop/Mobile
- ✅ Background con posicionamiento X/Y

**Capas (Layers):**
```typescript
type Layer = {
  id: string;
  type: "text" | "image";
  content?: string;  // HTML para texto
  src?: string;      // URL para imagen
  zIndex: number;
  animation: "fade-in-up" | "fade-in-right" | "scale-up" | "none";
  animationDelay: number;
  animationDuration: number;
  desktop: LayerConfig;
  mobile?: LayerConfig;
  style?: CSSProperties;
};

type LayerConfig = {
  top: number;
  left: number;
  width: number | "auto";
  height: number | "auto";
  fontSize?: number;
  color?: string;
  opacity: number;
  visible: boolean;
};
```

#### 8.2 Componente de Renderizado (`ResponsiveSlider.tsx`)

**Responsabilidades:**
1. Leer JSON desde BD (`HeroSlide.configJson`)
2. Renderizar con Swiper.js
3. Aplicar escalado responsivo correcto
4. Ejecutar animaciones GSAP

**Estrategias de Renderizado:**

**Desktop:**
- Estrategia: "Force Fit" (Non-Uniform Scaling)
- El canvas de 1920x800 se estira/comprime para llenar 100% del viewport
- Garantiza que TODO el contenido sea visible sin scrolling

**Mobile:**
- Estrategia: "Decoupled Background + Scaled Layers"
- **Fondo:** `object-fit: cover` → Llena la pantalla sin deformarse
- **Capas:** Contenedor escalado uniformemente desde su base width

**Lógica de Fallback Mobile:**
```typescript
// Si la capa NO tiene configuración móvil específica:
const rawConfig = layer.mobile || layer.desktop || {};

// Si se usa desktop config, el contenedor debe escalarse desde 1920px
const usingDesktopFallback = slide.layers.some(l => !l.mobile && l.desktop);
const containerWidth = usingDesktopFallback ? 1920 : 360;
const scale = window.innerWidth / containerWidth;
```

**Animaciones GSAP:**
```typescript
// Ejemplo fade-in-up
gsap.fromTo(element, 
  { opacity: 0, y: 50 },
  { opacity: 1, y: 0, duration: 1.2, delay: 0.5, ease: "power3.out" }
);
```

#### 8.3 Performance

- ✅ Lazy loading de imágenes
- ✅ Pre-caching del siguiente slide
- ✅ Hardware acceleration (transform3d)
- ✅ Debounce de resize events
- ✅ Optimización de re-renders con `useRef`

---

## 9. Sistema de Assets

### Flujo de Upload

```
Usuario → Input File → API /api/admin/assets
                              ↓
                    1. Validación (tipo, tamaño)
                    2. Sanitización nombre
                    3. fs.writeFile → /public/assets/
                    4. Prisma.create → DB
                              ↓
                    Response: { url, id, name }
```

### Estructura de Archivos

```
public/assets/
├── 1768426536234_background.jpeg
├── 1768426537890_modelo.png
├── 1768426539012_logo_sponsor.svg
└── 1768426540111_video.mp4
```

**Naming:** `{timestamp}_{originalFilename}`

### Tipos Soportados

**Imágenes:**
- JPEG, PNG, WEBP, AVIF, SVG, GIF

**Videos:**
- MP4, WEBM

**Otros:**
- PDF (para comprobantes de sponsor)

### Gestión de Assets (`/admin/assets`)

**Funcionalidades:**
- ✅ Grid de previews
- ✅ Búsqueda por nombre
- ✅ Renombrar archivo (solo DB, no filesystem)
- ✅ Eliminar (DB + filesystem)
- ✅ Copiar link al clipboard
- ✅ Descargar
- ✅ Upload múltiple

---

## 10. Deployment

### Variables de Entorno Requeridas

```env
# Base de Datos
DATABASE_URL="mysql://user:password@host:3306/dbname"

# MercadoPago
NEXT_PUBLIC_MP_PUBLIC_KEY="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
MP_ACCESS_TOKEN="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# App
NEXT_PUBLIC_BASE_URL="https://missuniversoiquique.cl"
NODE_ENV="production"
```

### Comandos de Deployment

```bash
# 1. Instalar dependencias
npm install

# 2. Generar cliente Prisma
npx prisma generate

# 3. Migrar BD
npx prisma migrate deploy

# 4. Seedear datos iniciales (opcional)
npx prisma db seed

# 5. Build producción
npm run build

# 6. Iniciar servidor
npm run start
```

### Hosting Recomendado

**Vercel (Recomendado para Next.js)**
```bash
vercel --prod
```

**VPS (Nginx + PM2)**
```bash
# pm2 start
pm2 start npm --name "missuniverso" -- start
pm2 save
pm2 startup
```

---

## 11. Guía de Desarrollo

### Setup Inicial

```bash
# 1. Clonar repositorio
git clone [repo-url]
cd missuniversoiquique.cl

# 2. Instalar dependencias
npm install

# 3. Configurar .env
cp .env.example .env
# Editar .env con tus credenciales

# 4. Generar Prisma client
npx prisma generate

# 5. Crear BD y migrar
npx prisma migrate dev --name init

# 6. Seedear datos
npx prisma db seed

# 7. Ejecutar en desarrollo
npm run dev
```

### Crear Nuevo Endpoint API

```typescript
// src/app/api/mi-endpoint/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  // 1. Autenticación
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const { user } = await lucia.validateSession(sessionId);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  // 2. Validar rol (si es necesario)
  if (!["SUPERADMIN", "DIRECTOR"].includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  // 3. Parsear body
  const body = await request.json();
  
  // 4. Lógica de negocio
  const result = await db.myModel.create({ data: body });
  
  // 5. Respuesta
  return NextResponse.json(result);
}
```

### Añadir Nuevo Modelo Prisma

```prisma
// 1. Editar prisma/schema.prisma
model MyNewModel {
  id        String   @id @default(cuid())
  field1    String
  field2    Int
  createdAt DateTime @default(now())
  
  @@map("mynewmodel")
}

// 2. Crear migración
npx prisma migrate dev --name add_mynewmodel

// 3. Regenerar cliente
npx prisma generate
```

### Debugging

**Logs de Prisma:**
```typescript
import { db } from "@/lib/db";
const result = await db.$queryRaw`SELECT * FROM user`;
console.log(result);
```

**Logs de Auth:**
```typescript
console.log("Session ID:", sessionId);
console.log("User:", user);
```

**Inspeccionar Headers:**
```typescript
const headers = Object.fromEntries(request.headers.entries());
console.log("Headers:", headers);
```

---

## 12. Resolución de Problemas

### Problema: "Prisma Client not found"

**Solución:**
```bash
npx prisma generate
```

### Problema: Error de conexión a BD

**Verificar:**
1. `.env` tiene `DATABASE_URL` correcto
2. MySQL está corriendo
3. Credenciales son válidas
4. BD existe

```bash
# Test de conexión
npx prisma db pull
```

### Problema: Slider no carga

**Debug:**
```typescript
// src/components/ui/ResponsiveSlider.tsx
console.log("Slider Data:", sliderData);
console.log("Is Mobile:", isMobile);
```

**Verificar:**
1. Existe registro en BD: `SELECT * FROM heroslide WHERE id = 'home-main'`
2. `configJson` es JSON válido
3. URLs de assets existen en `/public/assets/`

### Problema: Assets no se suben

**Verificar:**
1. Permisos de escritura en `/public/assets/`
2. Tamaño del archivo < 50MB
3. Tipo de archivo permitido
4. Espacio en disco

```bash
# Dar permisos
chmod 755 public/assets
```

### Problema: Timeout en build de Vercel

**Solución:**
1. Verificar que `prisma generate` se ejecute en `postinstall`
2. Optimizar build con caché

```json
// package.json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

---

## Contacto y Soporte

**Desarrollador:** Juan Limache  
**Email:** [tu-email]  
**Repositorio:** [repo-url]

---

**Fin de la Documentación Técnica**

*Última actualización: Enero 2026*
