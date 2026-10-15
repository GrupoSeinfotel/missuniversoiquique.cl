# Documentación del Sistema Web y Panel de Administración

## 1. Visión General
Esta documentación detalla las funcionalidades implementadas en el sistema web de Miss Universo Iquique, enfocándose en el Panel de Administración y los flujos principales. El objetivo es mantener una referencia clara para asegurar que ninguna función se pierda durante actualizaciones futuras.

## 2. Autenticación y Seguridad
- **Sistema:** Lucia Auth.
- **Roles:**
  - `SUPERADMIN` (Juan): Acceso total, incluyendo gestión de directores y aprobación directa.
  - `DIRECTOR`: Acceso a gestión de candidatas, votos y contenido.
  - `CANDIDATE`: Acceso limitado a su perfil y subida de contenido.
- **Mecanismos:**
  - Login con email/password.
  - Protección de rutas vía Middleware y `layout.tsx` (Server-Side).
  - Sesiones persistentes con cookies seguras.

## 3. Panel de Administración (Responsive)

### 3.1. Dashboard Principal (`/admin`)
- **Estadísticas en Tiempo Real:** Total candidatas, Pendientes, Votos, Sponsors Activos, Sliders.
- **Acciones Pendientes:** Lista rápida de las últimas 5 postulaciones pendientes.
- **Últimos Patrocinios:** Visualización rápida de PyMEs registradas.
- **Herramientas Rápidas:**
  - Creador de Publicaciones (Feed de Noticias).
  - Accesos a Configuración y Manuales.

### 3.2. Gestión de Candidatas (`/admin/candidatas`)
- **Tabla de Datos:** Listado completo con filtros de estado.
- **Sistema de Veting (Aprobación):**
  - Requiere consenso de **2 votos positivos** de directores distintos para aprobar a una candidata.
  - **Excepción de Superusuario:** El usuario "Juan" tiene un botón "Aprobar Directamente" que omite el consenso.
  - Visualización gráfica de votos (👍/👎) por cada director.
- **Modal de Expediente (`CandidateGalleryModal`):**
  - Información Personal Completa (Medidas, Bio, RRSS).
  - **Video Pitch:** Visualización directa o enlace externo.
  - **Galería de Fotos:** Visor interactivo con opción de descarga.
  - **Acción Directa:** Botón "ACEPTAR PARTICIPACIÓN" dentro del modal (Solo Juan).
- **Eliminación:** Solo el Superusuario puede eliminar registros de candidatas.
- **Votos Artificiales:** Herramienta para inyectar votos base y tasas de crecimiento simulado.

### 3.3. Gestión de Contenido y Feed (`/admin`)
- **AdminPostCreator:**
  - Creación de posts con texto, imágenes y video.
  - **Crecimiento Inteligente:** Configuración de Likes y Shares base + Tasa de crecimiento diario (simulación de viralidad).
  - Edición y Eliminación de posts existentes.
  - Reinicio de "Día 1" para el cálculo de crecimiento.

### 3.4. Galería de Fotos (`/admin/galeria`)
- **Visor Centralizado:** Todas las fotos subidas por todas las candidatas.
- **Filtros:** Por tipo de foto (Rostro, Perfil, Cuerpo Completo, Editorial).
- **Detalles Técnicos:** Metadatos de fecha, marca de agua e identificación de usuario.

### 3.5. Patrocinadores (`/admin/sponsors`)
- **Tabla de Solicitudes:** Gestión de empresas que solicitan ser sponsors.
- **Flujo de Aprobación:** Aprobar o Rechazar solicitudes, habilitando su visualización en la web pública.
- **Datos Financieros:** Visualización de montos comprometidos.

### 3.6. Registro de Votos (`/admin/votos`)
- **Auditoría:** Registro detallado de cada voto emitido.
- **Identificación:** IP del votante, correo (si está registrado), candidata votada.
- **Tipos:** Diferenciación entre votos gratuitos y votos de pago.

### 3.7. Gestión de Directores (`/admin/directors`) - Solo Superusuario
- Creación de nuevas cuentas de directores.
- Asignación de credenciales.
- Listado de equipo administrativo.

## 4. API Routes Principales
- `/api/admin/candidate/[id]/[action]`: Lógica de aprobación/rechazo (consenso).
- `/api/admin/candidate/[id]/approve`: Endpoint específico para aprobación directa (Juan).
- `/api/feed`: CRUD de noticias.
- `/api/casting/apply`: Recepción de formularios de postulantes con subida de archivos.
- `/api/vote`: Registro y validación de votos.

## 5. Diseño y UX
- **Responsive Design:** Todo el panel utiliza grids adaptativos (`.admin-main`, `.admin-post-grid`, `.admin-modal-grid`) y tablas con scroll horizontal para móviles.
- **Estética Dark Mode:** Interfaz profesional en tonos oscuros con acentos dorados/rosados.
- **Feedback Visual:** Notificaciones de éxito/error en acciones críticas.
