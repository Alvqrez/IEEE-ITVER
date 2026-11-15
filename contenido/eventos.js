/*
  Eventos del capítulo: talleres, conferencias, visitas industriales, hackatones, competencias.
  Para agregar uno, copia el bloque de ejemplo, quítale las barras // del inicio y edita los textos.
  Los que ya pasaron se mueven solos a "Eventos pasados" (según la fecha de fin, o de inicio si no hay fin).

  Campos:
    titulo       (obligatorio) nombre del evento
    tipo         (obligatorio) Taller, Conferencia, Visita industrial, Hackatón, Competencia o Reunión
    inicio       (obligatorio) 'AAAA-MM-DDTHH:MM' en hora de Veracruz; solo 'AAAA-MM-DD' si dura todo el día
    fin          (opcional)    igual que inicio; si falta, se asumen dos horas
    lugar        (obligatorio) p. ej. 'Laboratorio de cómputo, edificio X' o 'En línea'
    descripcion  (obligatorio) una o dos frases: qué se hará y para quién
    imagen       (opcional)    ruta dentro de la carpeta assets, p. ej. 'eventos/taller-git.webp'
    registro     (opcional)    URL del formulario de registro
    publicacion  (opcional)    la publicación del evento en redes: { instagram: 'URL', facebook: 'URL' }
*/
window.ITVER_EVENTOS = [
  // {
  //   titulo: 'Taller de Git y GitHub',
  //   tipo: 'Taller',
  //   inicio: '2026-11-20T16:00',
  //   fin: '2026-11-20T18:00',
  //   lugar: 'Laboratorio de cómputo',
  //   descripcion: 'Tu primer pull request en un repositorio real. Trae tu laptop.',
  //   imagen: 'eventos/taller-git.webp',
  //   registro: 'https://forms.gle/...',
  //   publicacion: { instagram: 'https://www.instagram.com/p/...', facebook: 'https://www.facebook.com/...' },
  // },
];
