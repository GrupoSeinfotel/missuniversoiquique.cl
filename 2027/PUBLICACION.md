# Miss Universo Iquique 2027

- Sitio: https://missuniversoiquique.cl/
- Archivo 2026: https://missuniversoiquique.cl/#archivo
- Ganadora 2026: https://missuniversoiquique.cl/#reina-2026
- Administración: https://missuniversoiquique.cl/#admin
- Preinscripción: https://missuniversoiquique.cl/#casting

La versión de producción independiente está en `produccion/`. El diseño y los ZIP originales están preservados. Los cambios de esta entrega no requieren compilar el proyecto Next antiguo.

## Operación

El único superadministrador de Iquique 2027 es seinfotel.com@gmail.com. Su acceso se entregó en un archivo privado del equipo. La base impide crear un segundo superadministrador y el servidor reserva ese rol para dicho correo. Las cuentas administrativas PHP existentes conservan el rol de administrador. No se publica aquí ninguna contraseña. En Administración se revisan solicitudes y sus fotografías privadas, se actualizan sus estados, y se gestionan fichas, noticias, patrocinadores, agenda y configuración. Las candidatas deben crear su cuenta 2027 antes de asociarles una ficha.

Para subir noticias de la reina, seleccionar edición 2026 en el editor. Para noticias de la nueva convocatoria, seleccionar 2027. El archivo importado es de consulta y sus datos originales no se editan desde este panel.

Los formularios reciben antecedentes en la base. El envío de correos, los pagos y las entradas quedan pendientes según `DIFERENCIAS-Y-PENDIENTES.md`.

## Recuperación

Respaldos privados: `C:/MISS UNIVERSO/backups/iquique-20261015/`.
`herramientas/revertir-portada.py --restaurar-portada` restaura la portada y las reglas anteriores desde ese respaldo; no elimina recursos ni modifica las bases. Revisar el script antes de ejecutarlo.

La publicación usa únicamente la cuenta FTP de Iquique. El alojamiento comparte una base con Arica, por eso esta adaptación utiliza exclusivamente tablas con prefijo `iquique27_` y cookies independientes.
