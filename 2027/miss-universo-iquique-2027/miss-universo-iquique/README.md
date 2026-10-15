# Miss Universo Iquique 2027

Proyecto independiente basado en las seis maquetas de Iquique suministradas. Conserva la arquitectura de la plataforma de Arica, pero tiene identidad visual, carpeta, publicación privada y base de datos separadas. No se copiaron cuentas, sesiones ni datos de Arica. No se modificó ningún dominio existente.

## Instalación

Python 3.11 o superior:

```sh
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
python -m pip install -r requirements.txt
python server.py --create-admin administrador@tu-dominio.cl
python server.py
```

Abrir http://127.0.0.1:8028. La contraseña se solicita en la terminal y no hay credenciales predeterminadas. SQLite se crea en `data/iquique.sqlite3`. Se puede seleccionar otra ruta con `MUA_DB`. No sobrescribir bases existentes.

## Páginas y controles

- Portada: escena nocturna de Iquique con capas, modelo coronada conceptual, marca 27 metálica, cristales, partículas y ocho accesos. Pausa de efectos y soporte de movimiento reducido.
- Certamen: misión, visión, pilares e impacto con paneles seleccionables y enlaces a las áreas del programa.
- Candidatas: directorio, búsqueda, filtros por categorías, ordenación y favoritos guardados solo en el dispositivo. Los favoritos no suman votos. Si aún no hay datos reales, se muestran diez espacios de muestra claramente identificados, con fotos de campaña conceptuales.
- Perfil: fotos ampliables, galerías, enlaces reales de videos/redes cuando se carguen, datos del perfil, misiones y progreso. `#perfil-diseno` es una vista de muestra con voto bloqueado, sin inscripción real.
- Votación y ranking: la votación gratuita local requiere sesión y apertura por administración; un voto total por cuenta/día en horario America/Santiago. El ranking cuenta únicamente votos registrados. Sin registros muestra guiones, sin posiciones, porcentajes o resultados inventados. La compra de votos está bloqueada.
- Camino: escalones interactivos y 17 niveles de propuesta. Misiones: estructura de desafíos y acceso a entrega de evidencia en el panel de candidata. Nombres, puntos y recompensas requieren aprobación antes de anunciarlos como programa oficial.
- Sponsors: propuestas Diamante/Gold/Silver, beneficios, aliados y captación. Los niveles comerciales son propuestas; no incluyen precios, contratos ni acuerdos confirmados.
- Galería, noticias, contacto, casting, archivo 2026 y vistas de diseño de administración.

## Gestión real en la instalación local

1. Crear una cuenta de votante en Mi universo. Para una candidata, crear primero su cuenta.
2. Ingresar con el administrador creado por terminal en `#admin`.
3. Crear/actualizar la ficha usando el correo de la futura candidata y publicar solo con autorización. La asignación de rol se hace en el servidor.
4. Las fotos se añaden mediante URLs HTTPS o archivos propios desplegados en `public/assets/`. Las galerías/redes se gestionan con JSON:

```json
{"gallery":["/assets/foto-autorizada.jpg"],"videos":["https://www.youtube.com/watch?v=ID_REAL"],"socials":[{"label":"Instagram","url":"https://www.instagram.com/CUENTA_REAL/"}]}
```

5. Las candidatas entregan evidencia del nivel actual; administración revisa y aprueba/rechaza. El avance es consecutivo.
6. Administración publica noticias y sponsors, y consulta solicitudes de casting, contacto y captación. No salen correos de esta instalación.

La categoría del perfil se selecciona en el formulario de administración y se guarda en la API (`category`). El directorio filtra los perfiles reales por esa categoría. Los registros sin categoría se muestran en Todas y en la búsqueda. Los espacios conceptuales también permiten revisar la interfaz de filtros, sin crear inscripciones reales.

## Publicación y pendientes

La publicación de Sites es una **revisión visual estática**, sin el servidor Python. Cuando no hay API, los formularios explican que se necesita la instalación local; no simulan guardados. Para actualizar esa publicación, sincronizar `public/` hacia `dist/` sin copiar `data/` ni credenciales.

Pendientes antes de apertura pública:

- Proveedor de pagos, precios y paquetes aprobados, órdenes de servidor, webhooks con firma, idempotencia, conciliación, reversas y pruebas reales autorizadas.
- Correo de verificación/recuperación, prevención de cuentas múltiples y controles de fraude antes de abrir votación pública.
- Subida de archivos desde el navegador, almacenamiento privado, validación de medios y publicación autorizada. Hoy se admiten enlaces y archivos desplegados.
- Datos oficiales de candidatas, sponsors, noticias, bases, calendario, privacidad y datos de contacto. Los datos de las maquetas no se importan como hechos.
- Importación del archivo 2026 desde una copia y con revisión previa; actualmente se conserva un espacio vacío y no hay ruta de borrado.
- Endurecimiento de producción y migración desde el servidor HTTP estándar de Python a un servidor/framework de producción; HTTPS, proxy, `MUA_SECURE_COOKIE=1`, copias cifradas y restauración probada, monitorización y revisión de seguridad. El servidor por defecto solo escucha en localhost.

Incluye hash scrypt, sesiones con tokens aleatorios almacenados como hash, cookies HttpOnly/SameSite, CSRF, control de origen, roles de servidor, consultas parametrizadas, limitación persistente de solicitudes por IP/ruta y auditoría administrativa. No reemplazan una revisión de seguridad de producción. No hay MFA ni envío de correo.

## Verificación

```sh
python -m unittest test_server.py -v
node --check public/iquique.js
```

Las pruebas usan una base temporal, sin tocar los datos de la instalación. Cubren permisos, registro, CSRF, consentimiento, origen, URLs inseguras, publicación de candidata, cierre y duplicación de votos, revisión de misiones y rechazo de pagos.

## Fuente y assets

`iquique.js` y `iquique.css` definen las composiciones específicas de estas referencias sobre la base funcional compartida. Las capas anteriores se conservan como soporte de los módulos. Consulta `ASSETS-IQUIQUE.md` para el inventario de imágenes nuevas.

Las modelos coronadas son **imágenes conceptuales de campaña**, no ganadoras proclamadas ni candidatas inscritas. No se atribuyen marcas, hoteles o sponsors reales a esta edición. El diseño sigue las referencias, con imágenes nuevas y adaptación responsive; no se presenta como reproducción idéntica píxel por píxel.
