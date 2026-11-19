# Web de Taller Romero · cómo publicarla y mantenerla

Versión v5: misma web que la v4, con portada a pantalla completa, la historia «Del kart al taller» (antes y después) y todo el diseño llevado a la paleta negro, azul y gris del logo y la fachada.

La web es estática: HTML, CSS y un poco de JavaScript. No hay que compilar nada. Todo lo que se publica está en la carpeta `sitio/`.

## 1. Publicar en Cloudflare Pages (gratis)

1. Comprime **el contenido** de `sitio/` en un ZIP (o usa `web-sobrinos-v5.zip`, que ya está hecho así). Dentro del ZIP, `index.html` tiene que estar en la raíz, no dentro de otra carpeta.
2. En Cloudflare: **Workers y Pages → Crear → Pages → Subir recursos (Direct Upload)**.
3. Ponle nombre al proyecto (por ejemplo `taller-romero`) y **arrastra el ZIP**. No arrastres la carpeta: con la carpeta a veces se queda fuera `_headers`, que es un archivo que empieza por guion bajo.
4. Queda en `https://taller-romero.pages.dev`. Esa es la dirección para enseñársela a Miguel y Silvia.
5. Para cambios: edita los archivos, vuelve a hacer el ZIP y en el proyecto pulsa **Crear implementación nueva** y arrastra el ZIP nuevo.

Qué hace cada archivo especial:
- `404.html`: la página de «no existe». Sin ella, Cloudflare devuelve la portada para cualquier dirección mal escrita.
- `_headers`: caché y cabeceras de seguridad (CSP). Si un día activas Cloudflare Web Analytics, dentro del archivo hay una nota con lo que hay que añadir.

## 2. Cuando haya dominio

Mientras esté en `pages.dev` no hay `canonical` ni `sitemap.xml` a propósito: así nada apunta a un dominio que todavía no existe. Cuando lo compréis:

1. En Cloudflare Pages: proyecto → **Dominios personalizados** → añadir el dominio.
2. `sitio/assets/config.js` → `dominio: 'https://www.EL-DOMINIO.es'` (sin barra final). Eso añade la web a los datos para Google y a la tarjeta de contacto.
3. `sitio/index.html` → en el `<head>` hay un bloque comentado «DOMINIO»: descomenta las 3 líneas, cambia el dominio y borra la línea `og:image` relativa que hay encima.
4. `sitio/robots.txt` → descomenta la línea `Sitemap:`.
5. Crea `sitio/sitemap.xml` con esto (cambiando el dominio):

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url><loc>https://www.EL-DOMINIO.es/</loc></url>
   </urlset>
   ```
6. Correo: en la zona del dominio, **Email → Email Routing**, crea por ejemplo `hola@EL-DOMINIO.es` → reenviar a `taller.romero22@hotmail.com`. Si se cambia el correo de la web, cámbialo en `config.js` y en los enlaces `mailto:` de `index.html` y `aviso-legal.html`.
7. Opcional: en la zona, activa HSTS (SSL/TLS → Certificados perimetrales).

## 3. Horario, festivos y vacaciones

Todo está en **`sitio/assets/config.js`**. La web lo usa para el «Abierto, cierra a las 16:00 / Cerrado, abre el lunes a las 8:00», la tabla de horario, la frase de los sábados y los datos para Google. No hay que tocar el HTML.

- **Horario actual**: de lunes a viernes, de 8:00 a 16:00, todo el año. Sábados, domingos y festivos, cerrado. En `horario`, el sábado (`6`) y el domingo (`0`) van con lista vacía `[]`.
- **Horario normal**: `horario`. `1` es lunes … `6` sábado, `0` domingo. Cada día es una lista de tramos, por ejemplo `[['08:00','13:30'], ['16:00','19:00']]` si cierran a mediodía, o `[]` si está cerrado.
- **Horario de verano** [PENDIENTE]: `verano`. Ahora está desactivado y el horario de ejemplo es inventado. Si lo tienen, pon `activo: true`, las fechas (`'07-01'` = 1 de julio) y sus tramos.
- **Festivos oficiales**: `festivosOficiales`. Están los nacionales y de Andalucía de 2026 y 2027, sacados del BOE y del BOJA (la fuente está citada en el propio archivo). Para 2028, cuando salga el decreto de la Junta en el BOJA (suele publicarse en primavera), añade las fechas en el mismo formato `['2028-01-01', 'Año Nuevo']`.
- **Festivos locales de Roquetas** [PENDIENTE]: `festivosLocales`. Hay un ejemplo comentado. Las fiestas locales las publica la Junta en el BOJA para cada municipio.
- **Vacaciones o cierres puntuales**: añádelos también en `festivosLocales` con su nombre, por ejemplo `['2027-08-16', 'Vacaciones']`.

## 4. Reseñas de Google

En `config.js` → `resenas` están la nota (4,0), el total (30) y la `fecha` (18/11/2026), copiados de la ficha de Google, más los dos enlaces. Cuando cambien en Google, actualiza esos datos y el texto de respaldo de `index.html` (`#nota-google`), que es lo que se ve si falla el JavaScript. Nunca redondear hacia arriba. La nota va discreta, como dato, no como reclamo.

Los textos de las 3 reseñas que se ven en la web están copiados literalmente de Google (confirmado por el propietario).

- «Ver reseñas en Google» abre la ficha (`enlaceVer`).
- «Dejar una reseña» abre directamente el formulario de reseña de Google (`enlaceResena`, hecho con el Place ID de la ficha). Si algún día falla, el enlace «Pedir reseñas» del Perfil de Empresa (`g.page/r/…/review`) sirve igual.
- La nota no se manda a Google como datos estructurados a propósito: Google no admite que un negocio marque en su web sus propias valoraciones.

## 5. Fotos

- **Miguel de pequeño en el kart**: ya está (`assets/miguel-kart.jpg/.webp` y `-720`), recortada sin la barra gris de la captura. Va en «Del kart al taller» frente a la foto de Miguel hoy, sin edad ni año a propósito.
- **Silvia** — foto [PENDIENTE]: `sitio/assets/silvia.jpg`, cuadrada (unos 400×400 px). Mientras no esté, sale un círculo con una «S». Su papel ya está resuelto: lleva la oficina del taller.
- **Fachada en grande** (opcional): la portada usa `fachada-llaves.jpg`, que solo existe a 1200 px. Si hay una versión de 2000 px o más, en pantallas grandes se verá más nítida; guárdala con el mismo nombre (y su `.webp`).

Los nombres tienen que ser exactamente esos, en minúsculas.

## 6. Ficha de Google

La ficha de Google Maps todavía no tiene web («Añadir sitio web»). En cuanto esté publicada en `pages.dev` o en el dominio, hay que añadirla ahí desde el Perfil de Empresa.

## 7. Movimiento (v5)

Solo hay cuatro movimientos ligados al scroll, todos en CSS (sin librerías) y solo en navegadores que lo soportan (`@supports (animation-timeline: …)`). Si el móvil tiene activado «reducir movimiento», todo se ve quieto y completo.

1. Portada: la foto de la nave se aleja un poco y se recorta como una tarjeta al bajar.
2. «Del kart al taller»: la foto de Miguel hoy se descubre de izquierda a derecha y se traza la línea de «Antes» a «Hoy».
3. Servicios: la raya azul de cada fila se pinta al llegar a ella.
4. Las franjas azules entre secciones (como la de la fachada) se pintan de izquierda a derecha (ya estaba en la v4).

## 8. Lo que queda [PENDIENTE]

Para encontrarlos todos: buscar `PENDIENTE` en `index.html`, `aviso-legal.html` y `config.js`.

- Dominio y correo del dominio.
- Foto de Silvia. Sigue pendiente.
- Papel de Silvia: resuelto. Lleva la oficina del taller.
- Festivos locales de Roquetas y si hay horario de verano.
- Reseñas: resuelto. Las 3 reseñas de la web están copiadas literalmente de Google (confirmado).
- Respuestas de las dudas: presupuesto antes de tocar, garantía, marcas, formas de pago, qué no hacen, si hace falta cita. Están como borrador o vacías: que las confirmen ellos.
- Aviso legal: el titular es un autónomo (no es una S.L.). Nombre comercial: Taller Romero. NIF: 15428943Z. Sigue pendiente el nombre completo del autónomo.
- ¿Tienen página de Facebook? (sale el icono en la fachada). Si la tienen, se añade el enlace.
