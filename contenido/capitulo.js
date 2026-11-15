/*
  Datos del capítulo. Edita este archivo y todas las páginas se actualizan.
  - Usa null para lo que todavía esté pendiente: la página lo muestra como "Pendiente".
  - No borres las comas ni las comillas.
  Otros archivos de datos en esta carpeta: eventos.js, noticias.js, proyectos.js y galeria.js.
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

  /* ---------- Equipo ----------
     Mesa directiva. La foto es opcional: ruta dentro de la carpeta assets, p. ej. 'equipo/chucho-lara.webp'.
     nivel ordena el organigrama: 1 arriba, 2 debajo, 3 al final. */
  mesa: [
    { rol: 'Presidente', nombre: 'Chucho Lara', foto: null, nivel: 1 },
    { rol: 'Vicepresidente', nombre: null, foto: null, nivel: 2 },
    { rol: 'Secretaría', nombre: 'Sarahí', foto: null, nivel: 3 },
    { rol: 'Tesorero', nombre: 'Marco Parra', foto: null, nivel: 3 },
  ],

  // Docente que asesora al capítulo (IEEE lo pide a los capítulos estudiantiles). Pendiente de confirmar.
  asesoria: { rol: 'Asesoría docente', nombre: null, foto: null },

  // Coordinaciones de área, si el capítulo las forma. Ejemplo:
  // { rol: 'Coordinación de Ciberseguridad', nombre: 'Nombre Apellido', foto: null },
  coordinaciones: [],

  // Integrantes del capítulo. Ejemplo:
  // { nombre: 'Nombre Apellido', area: 'Inteligencia artificial', carrera: 'Ing. en Sistemas Computacionales', foto: null },
  integrantes: [],

  /* ---------- Quiénes somos ----------
     BORRADOR redactado a partir de la guía de marca de IEEE CS ("About us" y "Noble purpose").
     Cuando la mesa directiva lo apruebe, cambia identidadBorrador a false y la etiqueta "Borrador" desaparece. */
  identidadBorrador: true,
  mision: 'Acercar a los estudiantes del Instituto Tecnológico de Veracruz a la computación como práctica: aprender haciendo en talleres, retos y proyectos, y conectarlos con la red internacional de IEEE Computer Society.',
  vision: 'Ser la comunidad de computación de referencia del Tec de Veracruz: el lugar donde cualquier estudiante, de cualquier carrera, encuentra con quién construir y un camino para crecer como profesional.',
  objetivos: [
    { titulo: 'Aprender haciendo', texto: 'Organizar talleres prácticos en las siete áreas del capítulo, en los que cada persona termine con algo funcionando.' },
    { titulo: 'Impulsar la innovación', texto: 'Formar equipos que construyan proyectos reales durante el semestre y los presenten a la comunidad del Tec.' },
    { titulo: 'Competir', texto: 'Preparar equipos para concursos de programación como IEEEXtreme.' },
    { titulo: 'Conectar', texto: 'Vincular a los estudiantes con egresados, profesionales, empresas de la región y otros capítulos de IEEE.' },
    { titulo: 'Formar líderes', texto: 'Dar experiencia de organización y liderazgo a quienes coordinan actividades y equipos.' },
    { titulo: 'Abrir la puerta', texto: 'Que cualquier estudiante pueda participar sin experiencia previa: lo único que pedimos es participación.' },
  ],
  valores: [
    { titulo: 'Participación', texto: 'Se aprende estando: en la actividad, en el equipo, en la entrega.' },
    { titulo: 'Conocimiento compartido', texto: 'Quien sabe algo lo enseña; quien empieza pregunta sin pena.' },
    { titulo: 'Calidad', texto: 'Terminar lo que se empieza y hacerlo bien.' },
    { titulo: 'Comunidad global', texto: 'Somos parte de una red que reúne a la computación de todo el mundo.' },
  ],

  // Texto oficial de IEEE CS ("About us", guía de identidad), traducido. No editar sin revisar la guía.
  sobreIEEECS: 'Con la participación de ingenieros y científicos de la computación, académicos y profesionales de la industria de todas las áreas de la computación, IEEE Computer Society (CS) marca la pauta en la formación y la vinculación que impulsan el avance tecnológico global. A través de conferencias, publicaciones y programas, y reuniendo a líderes de la ciencia y la ingeniería de la computación en cada etapa de su carrera para dialogar, debatir y colaborar, IEEE CS impulsa, da forma y orienta el futuro no solo de sus miembros, sino de toda la industria, y abre nuevas oportunidades para servir mejor a nuestro mundo.',
  propositoIEEECS: [
    'Hacer avanzar la tecnología en beneficio de la humanidad',
    'Impulsar la innovación',
    'Ser la fuente líder de información técnica',
    'Hacer avanzar a la sociedad por medio de la tecnología',
    'Hacer avanzar la profesión de la computación',
    'Apoyar a quienes se dedican a la computación',
  ],
};
