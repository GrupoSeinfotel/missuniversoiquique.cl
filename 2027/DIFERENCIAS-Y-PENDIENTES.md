# Iquique 2027: diferencias y pendientes

La entrega original permanece intacta. La adaptación publicable se encuentra en `produccion/`. Fecha: 15 de octubre de 2026.

| Área | Resultado y diferencia pendiente |
| --- | --- |
| Alojamiento | El prototipo utiliza Python y SQLite. La publicación se adaptó a PHP y MySQL disponibles en el servidor. |
| Separación | Recursos `/iquique2027/`, tablas `iquique27_*`, sesión IQUIQUE2027 y fotografías privadas fuera de la carpeta pública. La base del alojamiento es compartida con Arica; sus tablas se conservan. |
| Legado | 11 fichas aprobadas, 127 fotografías de sus galerías y 35 publicaciones recuperadas. Los textos originales y sus fechas permanecen como 2026. |
| Ganadora | Ayalent Álvarez aparece como Miss Universo Iquique 2026, con su ficha y galería reales. Fuente enlazada: Radio Paulina, 27 de abril de 2026. |
| Resultados | No se deducen posiciones del jurado desde votos digitales. Los resultados secundarios requieren documentación oficial. |
| Participantes antiguas | Hay publicaciones de personas que ya no constan entre las 11 fichas aprobadas actuales. Se mantienen como publicaciones históricas, sin crear fichas ni inventar su situación final. |
| Medios faltantes | 7 referencias de publicaciones corresponden a 5 archivos distintos ausentes del servidor. Listado en `medios-por-recuperar.json`. Las 127 fotos de candidatas sí están disponibles. |
| Portada anterior | Copia conservada en `/legado/2026/`, sin scripts de venta o votación. La copia íntegra se conserva en el respaldo privado. |
| Rutas antiguas | Los enlaces de fichas anteriores redirigen al archivo 2026. Las páginas antiguas de tickets y ranking se conservan en el respaldo y sus rutas originales; no forman parte del flujo 2027 ni se presentan como resultados oficiales. |
| Diseño | Se conserva la composición de Iquique, costa, cristales, partículas, capas, pausa y movimiento reducido. Las imágenes generadas se identifican como conceptuales. |
| Candidatas 2027 | Sin fichas ficticias: se publicarán con autorización desde Administración. Las de 2026 no se trasladan automáticamente. |
| Noticias y agenda | Administración permite crear, editar, publicar y despublicar contenidos; no se inventan actividades, fechas ni noticias 2027. |
| Casting | Preinscripción con consentimiento, mayoría de edad, datos de contacto y dos fotografías privadas. La recepción no confirma selección ni sustituye las bases oficiales. |
| Contacto y alianzas | Formularios guardados en la base; bandeja administrativa, estados y exportación CSV. |
| Cuentas | Registro y acceso 2027 conectados. No se convierten las contraseñas del sistema Next 2026; administración puede usar el acceso PHP existente. |
| Correo | No se ha configurado envío SMTP ni recuperación automática. Los mensajes quedan guardados; no se promete correo de confirmación. Confirmar también el buzón público contacto@missuniversoiquique.cl. |
| Votación | Cerrada. Existe voto gratuito con sesión y límite diario, probado en base aislada. Reglas y apertura requieren confirmación administrativa. |
| Pagos y entradas | Flow, MercadoPago, paquetes de votos y tickets del sistema antiguo no se conectan automáticamente a 2027. Confirmar precios, fechas, stock, devoluciones y reglas antes de habilitarlos. |
| Misiones | El prototipo propone niveles, premios y puntos. El programa permanece cerrado hasta aprobar sus reglas; no se otorgan beneficios prometidos por una maqueta. |
| Patrocinadores | Solo alianzas confirmadas publicadas desde administración. Categorías Diamante/Gold/Silver de muestra no se presentan como contratos vigentes. |
| Redes y turismo | Completar las redes oficiales verificadas y sustituir arte conceptual por material local autorizado cuando corresponda. |
| Privacidad | Formularios privados y controles de acceso activos. Confirmar texto definitivo de bases, conservación de antecedentes y autorizaciones editoriales de 2027. |
| Certificado FTP | Publicación con el acceso FTP autorizado por el titular en esta conversación. Sigue pendiente que el alojamiento renueve su certificado FTPS. |

## Respaldos

`C:/MISS UNIVERSO/backups/iquique-20261015/`: proyecto original ZIP verificado, historial Git, servidor original con manifiesto y SHA256, base local completa SQL y JSON, y base compartida del alojamiento comprimida. No se publican credenciales ni respaldos.

## Validación

17 pruebas del backend pasaron en `missuniversoiquique2027_test`: roles, sesiones, consentimiento, CSRF, origen, casting multipart con archivos privados, edición de noticias y perfiles, CSV, rechazo de votación cerrada, límite diario y ausencia de operaciones destructivas sobre el legado. Revisión visual de escritorio y móvil.

La restauración del respaldo local se comprobó en la base aislada: 25 tablas y 51.106 registros coinciden con el manifiesto. Las huellas de las tablas preexistentes del alojamiento compartido coinciden antes y después de preparar Iquique.
