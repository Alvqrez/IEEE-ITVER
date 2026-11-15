/*
  SOLO PARA REVISAR EL DISEÑO. Nada de esto es real.
  Se carga únicamente al abrir una página con ?ejemplos en la dirección (p. ej. eventos.html?ejemplos)
  y cada tarjeta lleva la etiqueta "Ejemplo". No se publica: construir.mjs no lo copia a dist/.
*/
window.ITVER_EJEMPLOS = {
  eventos: [
    { titulo: 'Taller de Git y GitHub', tipo: 'Taller', inicio: '2026-12-03T16:00', fin: '2026-12-03T18:00', lugar: 'Laboratorio de cómputo', descripcion: 'Tu primer pull request en un repositorio real. Trae tu laptop.', imagen: 'img/campus-itver.webp', publicacion: { instagram: 'https://www.instagram.com/computersociety.itver/' } },
    { titulo: 'Visita a un centro de datos', tipo: 'Visita industrial', inicio: '2026-12-10T08:00', fin: '2026-12-10T13:00', lugar: 'Salida desde la explanada del ITVER', descripcion: 'Recorrido por la sala de servidores y charla con el equipo de infraestructura.', publicacion: { facebook: 'https://www.facebook.com/share/1FXS5EFD8y/' } },
    { titulo: 'Cómo se protege una red universitaria', tipo: 'Conferencia', inicio: '2027-01-21T12:00', fin: '2027-01-21T13:30', lugar: 'Auditorio', descripcion: 'Una charla sobre los ataques más comunes a una red de campus y cómo se detienen.' },
    { titulo: 'Entrenamiento para IEEEXtreme', tipo: 'Competencia', inicio: '2026-10-08', lugar: 'En línea', descripcion: 'Sesión de problemas de práctica para formar los equipos del concurso.' },
  ],
  noticias: [
    { titulo: 'Nace IEEE Computer Society ITVer', fecha: '2026-10-01', resumen: 'El Tec de Veracruz ya tiene capítulo estudiantil de computación. Así puedes participar desde el primer día.', tipo: 'Anuncio', imagen: 'img/campus-palmas.webp', enlace: 'https://www.instagram.com/computersociety.itver/' },
    { titulo: 'Abrimos registro para el taller de Git', fecha: '2026-11-12', resumen: 'Cupo para una sala de laboratorio. Regístrate desde el enlace de nuestra publicación.', tipo: 'Convocatoria', imagen: 'img/campus-itver.webp' },
    { titulo: 'IEEE Computer Society cumple 80 años', fecha: '2026-11-02', resumen: 'La sociedad que nació en 1946, el año de la ENIAC, celebra ocho décadas.', tipo: 'Anuncio', imagen: 'img/eniac-1946.webp', enlace: 'https://www.computer.org/press-room/ieee-cs-80th-anniversary' },
  ],
  proyectos: [
    { titulo: 'Mapa de salones del ITVER', fecha: '2026-11-10', tipo: 'Proyecto', descripcion: 'Un mapa web para encontrar salones y laboratorios del campus.', imagen: 'img/campus-itver.webp' },
    { titulo: 'Taller de Python para datos', fecha: '2026-10-20', tipo: 'Taller', descripcion: 'Limpieza y gráficas con pandas sobre datos abiertos de Veracruz.' },
    { titulo: 'Reto de 24 horas', fecha: '2026-10-05', tipo: 'Hackatón', descripcion: 'Cinco equipos construyeron prototipos para la comunidad del Tec.', imagen: 'img/tarjetas-perforadas.webp' },
  ],
  galeria: [
    { imagen: 'img/campus-itver.webp', alt: 'Explanada del ITVER con palmeras', album: 'Campus', fecha: '2026-10-01' },
    { imagen: 'img/campus-palmas.webp', alt: 'Palmeras frente al edificio azul y blanco', album: 'Campus', fecha: '2026-10-01' },
    { imagen: 'img/campus-celosia.webp', alt: 'Celosía blanca de la fachada', album: 'Campus', fecha: '2026-10-01' },
    { imagen: 'img/eniac-1946.webp', alt: 'Dos programadoras frente a la ENIAC', album: 'Historia', fecha: '2026-11-02' },
    { imagen: 'img/eniac-programacion.webp', alt: 'Programación de la ENIAC con cables', album: 'Historia', fecha: '2026-11-02' },
    { imagen: 'img/tarjetas-perforadas.webp', alt: 'Tarjetas perforadas', album: 'Historia', fecha: '2026-11-02' },
  ],
  integrantes: [
    { nombre: 'Integrante de ejemplo', area: 'Ciberseguridad', carrera: 'Ing. en Sistemas Computacionales', foto: null },
    { nombre: 'Otra integrante', area: 'Ciencia de datos', carrera: 'Ing. Industrial', foto: null },
    { nombre: 'Un integrante más', area: 'Desarrollo de software', carrera: 'Ing. Electrónica', foto: null },
  ],
};
