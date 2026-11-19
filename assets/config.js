/* =====================================================================
   TALLER ROMERO · CONFIGURACIÓN ÚNICA
   Este es el ÚNICO sitio donde se cambian horario, festivos, verano,
   reseñas y dominio. La web (estado abierto/cerrado, tabla de horario,
   respuesta de los sábados, datos para Google, contacto descargable y
   recordatorio de calendario) lo lee todo de aquí.
   Formato de horas: "HH:MM" en hora de Madrid. Fechas: "AAAA-MM-DD".
   ===================================================================== */
window.TALLER = {

  negocio: {
    nombre: 'Taller Romero',
    telefonoFijo: '+34950885158',
    telefonoMovil: '+34668589283',      // también WhatsApp
    whatsapp: '34668589283',
    email: 'taller.romero22@hotmail.com',
    calle: 'Calle Luarca, 17',
    cp: '04740',
    localidad: 'Roquetas de Mar',
    provincia: 'Almería',
    // Ficha de Google Maps «TALLER ROMERO S.L» (enlace que pasó Alejandro, 18/11/2026).
    mapa: 'https://maps.app.goo.gl/t4EHG9oKdSrzEHbh6',
    // Place ID de la ficha. Comprobado: abre «TALLER ROMERO S.L» en Google Maps.
    placeId: 'ChIJrWbAO3pxcA0RxRs7Sl1MRZg',
    // Coordenadas y plus code de la ficha de Google.
    lat: 36.7857233,
    lng: -2.6046616,
    plusCode: 'Q9PW+74 Roquetas de Mar',
    instagram: 'https://www.instagram.com/tallerromero22/',
    // DOMINIO: déjalo en null mientras la web esté en *.pages.dev.
    // Cuando haya dominio, pon aquí 'https://www.eldominio.es' (sin barra final)
    // y sigue los pasos de README-PUBLICAR.md (canonical y og en index.html).
    dominio: null
  },

  /* Horario normal de la semana, todo el año. 1 = lunes … 6 = sábado, 0 = domingo.
     Cada día es una lista de tramos [abre, cierra]. Lista vacía = cerrado.
     Confirmado: lunes a viernes 8:00-16:00. Sábados, domingos y festivos, cerrado.
     Si un día abren mañana y tarde: [['08:00','13:30'], ['16:00','19:00']] */
  horario: {
    1: [['08:00', '16:00']],
    2: [['08:00', '16:00']],
    3: [['08:00', '16:00']],
    4: [['08:00', '16:00']],
    5: [['08:00', '16:00']],
    6: [],
    0: []
  },

  /* [PENDIENTE] Horario de verano. Ahora está DESACTIVADO (activo: false).
     Si tienen horario de verano, pon activo: true y ajusta fechas (MM-DD) y tramos.
     El ejemplo de abajo es INVENTADO para que se vea el formato. No es su horario. */
  verano: {
    activo: false,
    desde: '07-01',
    hasta: '08-31',
    horario: {
      1: [['07:00', '15:00']], 2: [['07:00', '15:00']], 3: [['07:00', '15:00']],
      4: [['07:00', '15:00']], 5: [['07:00', '15:00']], 6: [], 0: []
    }
  },

  /* Festivos oficiales nacionales y de Andalucía (taller cerrado).
     Fuentes oficiales comprobadas el 18/11/2026:
     - 2026: Decreto 101/2025, de 14 de mayo (BOJA n.º 93, 19/05/2025),
       https://www.juntadeandalucia.es/boja/2025/93/1
       y Resolución de 17/10/2025 de la Dirección General de Trabajo
       (BOE n.º 259, 28/10/2025, BOE-A-2025-21667).
     - 2027: Decreto 84/2026, de 29 de abril (BOJA n.º 84 de 2026),
       https://www.juntadeandalucia.es/boja/2026/84/BOJA26-084-00002-5812-01_00337048.pdf
       y Resolución de 8/10/2026 de la Dirección General de Trabajo
       (BOE n.º 254, 13/10/2026, BOE-A-2026-21254).
     Para 2028 y siguientes, añadir cuando se publiquen en BOJA/BOE. */
  festivosOficiales: [
    ['2026-01-01', 'Año Nuevo'],
    ['2026-01-06', 'Epifanía del Señor'],
    ['2026-02-28', 'Día de Andalucía'],
    ['2026-04-02', 'Jueves Santo'],
    ['2026-04-03', 'Viernes Santo'],
    ['2026-05-01', 'Fiesta del Trabajo'],
    ['2026-08-15', 'Asunción de la Virgen'],
    ['2026-10-12', 'Fiesta Nacional de España'],
    ['2026-11-02', 'Todos los Santos (trasladado al lunes)'],
    ['2026-12-07', 'Día de la Constitución (trasladado al lunes)'],
    ['2026-12-08', 'Inmaculada Concepción'],
    ['2026-12-25', 'Navidad'],
    ['2027-01-01', 'Año Nuevo'],
    ['2027-01-06', 'Epifanía del Señor'],
    ['2027-03-01', 'Día de Andalucía (trasladado al lunes)'],
    ['2027-03-25', 'Jueves Santo'],
    ['2027-03-26', 'Viernes Santo'],
    ['2027-05-01', 'Fiesta del Trabajo'],
    ['2027-08-16', 'Asunción de la Virgen (trasladada al lunes)'],
    ['2027-10-12', 'Fiesta Nacional de España'],
    ['2027-11-01', 'Todos los Santos'],
    ['2027-12-06', 'Día de la Constitución'],
    ['2027-12-08', 'Inmaculada Concepción'],
    ['2027-12-25', 'Navidad']
  ],

  /* [PENDIENTE] Fiestas locales de Roquetas de Mar (dos al año) y días que
     el taller cierre aunque no sea festivo (vacaciones, puentes…).
     Las fiestas locales se publican cada año en BOJA (resolución de fiestas
     locales de los municipios de Andalucía). Ejemplo de formato, comentado:
       ['2026-MM-DD', 'Fiesta local de Roquetas de Mar'],
       ['2026-08-10', 'Vacaciones del taller'],                 */
  festivosLocales: [
  ],

  /* Reseñas de Google, copiadas de la ficha el 18/11/2026. Cuando cambien en
     Google, actualiza nota, total y fecha (y el texto de respaldo #nota-google
     de index.html). No redondear nunca hacia arriba. */
  resenas: {
    nota: 4.0,
    total: 30,
    fecha: '2026-11-18',
    enlaceVer: 'https://maps.app.goo.gl/t4EHG9oKdSrzEHbh6',
    enlaceResena: 'https://search.google.com/local/writereview?placeid=ChIJrWbAO3pxcA0RxRs7Sl1MRZg'
  }
};
