/*
  Datos del capítulo. Edita este archivo y todas las landings se actualizan.
  - Usa null para lo que todavía esté pendiente: la página lo muestra como "Pendiente".
  - No borres las comas ni las comillas.
*/
window.ITVER = {
  nombre: 'IEEE Computer Society ITVer',
  fundacion: 2026,

  // Pendiente: cuando tengas el correo del capítulo, escríbelo entre comillas, p. ej. 'capitulo@dominio.mx'.
  // Mientras sea null, los botones de "escríbenos" llevan a Instagram.
  correo: null,

  redes: {
    instagram: { url: 'https://www.instagram.com/computersociety.itver/', usuario: '@computersociety.itver' },
    facebook: { url: 'https://www.facebook.com/share/1FXS5EFD8y/', usuario: 'IEEE Computer Society ITVer' },
  },

  // Mesa directiva. La foto es opcional: ruta dentro de la carpeta assets, p. ej. 'mesa/chucho-lara.webp'.
  mesa: [
    { rol: 'Presidente', nombre: 'Chucho Lara', foto: null },
    { rol: 'Vicepresidente', nombre: null, foto: null },
    { rol: 'Secretaría', nombre: 'Sarahí', foto: null },
    { rol: 'Tesorero', nombre: 'Marco Parra', foto: null },
  ],

  // Pendientes
  mision: null,
  vision: null,
};
