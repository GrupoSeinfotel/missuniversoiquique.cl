# Fondos de portada · Iquique 2027

La modelo, el marco de cristales y la marca permanecen fijos. Solo los fondos cambian con una transición suave. No se utilizan posiciones aleatorias.

## Configurar un fondo

1. Entrar a https://missuniversoiquique.cl/#admin con la cuenta administrativa.
2. Abrir **Fondos de portada**. El enlace directo es https://missuniversoiquique.cl/#gestion/portada.
3. Elegir un fondo o pulsar **Añadir fondo**. Se puede subir una imagen JPG, PNG o WEBP de hasta 12 MB, o indicar su dirección. La imagen móvil es opcional.
4. Elegir **Computador** y **Editar inicio**. Arrastrar el paisaje o ajustar Horizontal, Vertical y Acercamiento. Hacer lo mismo con **Editar final**.
5. Repetir el ajuste en **Móvil**. Sus posiciones son independientes de las del computador.
6. Ajustar la duración entre 3 y 60 segundos y pulsar **Reproducir recorrido**. La vista previa usa las mismas capas y estilos de la portada, en formatos de 1270×650 y 390×900.
7. Pulsar **Guardar fondo y recorrido**. Cambiar el orden o desmarcar **Mostrar este fondo** permite reordenar o pausar sin eliminar registros.

Si una imagen ya cabe completa en un eje, el desplazamiento de ese eje no tendrá recorrido visible; aumentar el acercamiento permite crear espacio para moverla. Los extremos se mantienen dentro de la imagen para evitar huecos. Otros tamaños de pantalla conservan las mismas posiciones relativas, adaptando el recorte a su proporción.

**Pausar efectos** detiene el movimiento y la rotación. También se respeta la preferencia de movimiento reducido y se pausa al ocultar la pestaña o salir de la portada.

## Reparación realizada

- Se aisló el fondo en dos capas de intercambio y se eliminaron los tamaños negativos del sistema anterior.
- Se desactivaron los dos temporizadores antiguos y su movimiento adicional de zoom.
- Se corrigió una regla antigua `is-active` que mantenía un fondo visible aun al ocultarlo.
- Se retiraron de los fondos activos las composiciones que ya incluían una modelo o un marco de cristales. Los originales siguen conservados. Las versiones limpias son arte conceptual de campaña, no fotografías documentales.
- Se conservan los cuatro registros anteriores del slider compartido, dos por sede; cada sitio solo puede editar los suyos. Se añadió el recorrido sin eliminar los textos anteriores.
- `/admin-postulantes/slider.php` lleva al editor integrado y `/api/slider.php` se convirtió en lectura compatible, sin migraciones que reescriban las imágenes del otro sitio.
- Se corrigió un error previo al abrir Administración con una sesión ya iniciada.

## Respaldo y validación

Respaldo íntegro anterior: `C:/MISS UNIVERSO/backups/iquique-slider-20261015-105713`. Incluye servidor, base compartida comprimida y copia local de producción. Los archivos históricos 2026 y las imágenes originales de la modelo y los cristales se conservaron.

15 comprobaciones del backend pasaron en base aislada: acceso público y privado, sesión, CSRF, origen, guardado, posiciones cero, independencia móvil/computador, límites de zoom, direcciones seguras, pausa, exclusión de fondos pausados y subida válida/falsa de archivos. Se comprobó también el editor real con superadministración y ambas portadas en escritorio y móvil.

## Corrección de carga del fondo

La versión 20261015-background4 mantiene un paisaje de respaldo visible desde CSS, no oculta la primera imagen antes de cargar la siguiente, y elimina el plano negativo del slider anterior. La portada se revalida sin caché y sus recursos tienen versión coordinada. Se verificó el paisaje incluso sin JavaScript ni imágenes dinámicas, y Arica en pantalla de 1908 píxeles de ancho.
