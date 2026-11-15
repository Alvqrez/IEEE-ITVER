# Fase 1 · Auditoría y exploración — Landing IEEE CS ITVER

Fecha: 15 de noviembre de 2026. Estado: prototipos de exploración (Fase 2) listos para elegir. No se ha iniciado el sistema de diseño (Fase 3) ni la implementación definitiva (Fase 4).

## 1. Skills verificadas

| Skill | Estado | Qué aporta al proyecto |
| --- | --- | --- |
| `design-taste-frontend` (pediste `desing-taste-frontend`; el nombre instalado es este, versión 2) | Disponible. Leí `SKILL.md` y las referencias de copy, color, tipografía, layout, imágenes, movimiento, escenas, crítica y "tells". | Proceso completo: inventario del sujeto → argumento → dirección repartida por `draw.mjs` → idea + "cosa viva" → texto → construcción → `lint.mjs` + `inspect.mjs` (1440/768/390) → crítica con rúbrica tipo Awwwards. Reglas de la casa medidas en navegador real. |
| `high-end-visual-design` | Disponible. Leí la instrucción completa. | Curvas de movimiento personalizadas, botón con icono anidado, "doble bisel" (carcasa + núcleo), menú con revelado escalonado y hamburguesa que se transforma en X, espacio macro, reglas de rendimiento (solo `transform`/`opacity`, `IntersectionObserver`, sin blur en contenido que hace scroll). |

### Conflictos entre las dos skills y cómo los resolví

Las dos skills se contradicen en varios puntos. Usé `design-taste-frontend` como regla cuando chocan, porque sus reglas se miden en navegador y porque coinciden con lo que pediste evitar (plantillas genéricas):

| `high-end-visual-design` pide | `design-taste-frontend` prohíbe | Decisión |
| --- | --- | --- |
| Etiqueta "eyebrow" en píldora sobre cada título | Eyebrows y etiquetas pequeñas en mayúsculas | Sin eyebrows; la información va en el título |
| Navbar flotante de vidrio con blur | Vidrio y navegación en píldora flotante | Barra simple: logo, 3–4 enlaces, una acción |
| Fondo negro con orbes de degradado ("Ethereal Glass") | Degradados y brillos | Colores planos de la paleta oficial |
| Doble bisel con bordes de 1 px | Líneas finas | Doble bisel hecho con un escalón de tono, sin bordes |
| Entrada con `blur` en todo | Blur solo hasta 8 px y nunca en texto | Entradas con desplazamiento y opacidad |
| Prohíbe Open Sans | (no opina) | **Conflicto con la marca**: Open Sans es la tipografía secundaria oficial de IEEE CS. A y B usan solo Montserrat; C usa Montserrat + Open Sans para que veas el emparejamiento oficial. Decide tú. |

De `high-end-visual-design` sí se aplicó: curvas `cubic-bezier` propias, botón con icono anidado, doble bisel por tonos (panel de actividades y celosía en A, carta en C), menú móvil con transformación a X y enlaces escalonados, y solo `transform`/`opacity`/`clip-path` en animaciones.

## 2. Repositorio y tecnologías

- El repositorio solo contenía `README.md`. No había stack.
- **Recomendación para la implementación final: Astro** (sitio estático, cero JavaScript por defecto, optimización de imágenes con `astro:assets`, buen SEO, componentes reutilizables) con CSS propio basado en tokens. Despliegue en GitHub Pages, Netlify o Vercel.
- Los prototipos están en HTML, CSS y JavaScript sin dependencias, para pasarlos a componentes de Astro uno a uno.

## 3. Identidad institucional (fuente: *IEEE Computer Society Brand Identity & Graphic Style Guide*)

**Paleta principal:** azul IEEE `#00629B` (PMS 3015), naranja `#FFA300` (PMS 137 C), cian `#00B5E2` (Process Cyan), gris `#75787B` (Cool Gray 9), negro, blanco.
**Paleta brillante (preferida):** `#BA0C2F`, `#FFA300`, `#FFD100`, `#78BE20`, `#00843D`, `#981D97`, `#009CA6`, `#00629B`, `#00B5E2`, blanco.
**Paleta oscura:** `#861F41`, `#E87722`, `#FFC72C`, `#658D1B`, `#006341`, `#772583`, `#007377`, `#002855`, `#75787B`, negro. Tintes autorizados: 80, 60, 40 y 20 %.

**Tipografía:** Montserrat (principal; Light a Bold), Open Sans (secundaria, textos largos), Calibri fuera de línea.

**Logotipo:** versión principal negro + naranja; alternativas blanco + naranja (fondos oscuros como el azul IEEE), negro sólido y blanco sólido. Margen mínimo de 0.3 × altura. Nunca dentro de un titular, alterado, inclinado, tramado ni sobre fotografía cargada. Debe ir con el logotipo maestro de IEEE con **igual o mayor** prominencia. Los capítulos usan el logo principal con el nombre completo del capítulo debajo, del ancho del símbolo más "COMPUTER", en Montserrat, máximo dos líneas.

**Archivos usados:** logos oficiales de IEEE CS descargados de computer.org (naranja, negro y blanco, solo redimensionados). Logos de TecNM e ITV que me diste, sin alterar, como afiliación institucional. Fotografía del campus que me diste.

**Colores medidos en tus archivos:** TecNM `#1B396A`; ITV amarillo `#F5EB00`, rojo `#EE2224`, verde `#008A46`. No los usé como colores de interfaz: la página es de IEEE CS y los logos institucionales aparecen como afiliación.

**Datos verificados:** IEEE CS nace en 1946 como subcomité del AIEE y cumple 80 años en 2026 (computer.org). La ENIAC se presentó en 1946. El ITVER tenía 703 estudiantes en Ingeniería en Sistemas Computacionales en 2022 (DataMéxico).

## 4. Restricciones detectadas

- Falta el **logotipo maestro de IEEE**; la política de IEEE CS exige que acompañe al logo de la sociedad. En los prototipos no aparece (no lo dibujé ni lo descargué de fuentes no oficiales).
- Falta la versión **naranja + blanco** del logo de IEEE CS (para fondos azules); usé la blanca sólida, que también está autorizada.
- La foto del campus mide 1024 × 768: a sangre completa se ve suave. Se necesitan originales en alta resolución.
- Montserrat genera un aviso de "fuente por defecto" en el linter; se mantiene porque la exige la marca.
- Los morados de la paleta oficial (`#981D97`, `#772583`) no se usan: la skill los prohíbe y no hacen falta.

## 5. Información faltante (preguntas para ti)

1. Logotipo maestro de IEEE (archivos oficiales) y lockup oficial del capítulo, o autorización para construirlo según la página 6 de la guía.
2. Nombre oficial del capítulo tal como aparece en IEEE (por ejemplo, "IEEE Computer Society Student Branch Chapter, Instituto Tecnológico de Veracruz") y año de fundación.
3. Misión, visión y valores aprobados.
4. Mesa directiva: nombres, cargos y fotos (con consentimiento).
5. Eventos reales: calendario, actividades pasadas y fotos de ellas.
6. Correo, redes sociales y proceso de registro (¿formulario propio, Google Forms, solo correo?).
7. ¿Hace falta ser miembro de IEEE para participar en las actividades?
8. Fotos del campus en alta resolución.
9. Bases de la competencia: criterios, fecha límite y si piden un stack o hosting concreto.

## 6. Contenido provisional (marcado con `data-provisional`; ábrelo con `?provisional` para verlo en rojo)

- Correo `ieeecs.itver@example.com` y el enlace a Instagram del capítulo.
- Mesa directiva ("Por anunciar"), misión y visión (borradores).
- Títulos de eventos (son ejemplos de formato; la página lo dice).
- Duraciones y formatos de actividades, lo que se hace en cada área "en el capítulo" y los tiempos de afiliación.
- Ningún nombre de persona, cifra del capítulo ni testimonio fue inventado.

## 7. Los tres conceptos

| | A · Unos y ceros | B · La paleta del campus | C · Actas |
| --- | --- | --- | --- |
| Dirección repartida | Solo tipografía (`type-only-statement`) | Capítulos de color (`colour-chapters`) | Categoría prestada (`borrowed-category`) |
| Idea | La celosía del edificio del ITVER se vuelve un mapa de bits: los unos y ceros del símbolo de IEEE CS | Los colores de IEEE ya están en el campus: azul en la fachada, naranja en el almendro, verde en las palmas | La página se viste como un artículo de IEEE y el programa de un congreso |
| Héroe | Titular enorme "Unos y ceros junto al mar", sin imagen | "Computación en el puerto" junto a una gran ventana con la foto del campus y su leyenda de colores | Título centrado, autores, "Resumen—", "Términos clave—" y figura que alterna campus y ENIAC |
| Cosa viva | Escribe tu nombre y se enciende en la celosía | Siete áreas, siete colores oficiales: acordeón | Firma como coautor: tu nombre entra a la línea de autores, la cita y la carta |
| Movimiento firma | Titular que sube desde su línea base | Foto que se abre como persiana | Fundido lento entre 2026 y 1946 |
| Ventaja | La idea más propia del ITVER; muy cercana a Linear/Vercel; paleta = logo principal | La más reconocible como IEEE; muy viva en móvil; foto real del campus en el primer pantallazo | La más inteligente para un jurado de IEEE; datos con referencias reales |
| Riesgo | Primer pantallazo sin imagen puede parecer sobrio de más | Mucho color: hay que contenerlo para que no parezca volante | Mucha lectura; menos impacto visual inmediato |
| Puntuación de mi crítica (sobre 10) | 7.5 | 7.3 | 7.2 |

Las puntuaciones aplican los topes de la skill: el contenido provisional limita la nota de contenido a 5 en los tres. Los tres pasan `inspect.mjs` sin fallos a 1440, 768 y 390 px, sin errores de consola.

**Recomendación:** A como base. Es la idea que solo puede pertenecer al ITVER (la competencia de otro capítulo no tiene esa celosía), su paleta es literalmente la del logo principal de IEEE CS y su lenguaje es el más cercano a las referencias que diste. Se le pueden sumar la foto real del campus en grande de B y las referencias verificables de C.

## 8. Créditos de imágenes encontradas

Registrados en `propuestas/assets/found/credits.json`. ENIAC (1946 y c. 1947) y almacén de tarjetas (1959): dominio público. Tabla de funciones de la ENIAC: Logg Tandy, CC BY 4.0. Fotografías de Veracruz: xiquinhosilva, CC BY 4.0. San Juan de Ulúa, 1592: Jl FilpoC, CC BY-SA 4.0 (adaptada a escala de grises, por lo que la versión adaptada queda bajo la misma licencia). Todas vía Wikimedia Commons; el crédito aparece en el pie de cada propuesta.

## 9. Propuesta D · Moderna (añadida a petición)

Inspirada en el lenguaje visual de tasteskill.dev, sin copiar sus textos, logotipo, capturas ni maquetación exacta. Usa `design-taste-frontend-v1` (diales 8/6/4) y `high-end-visual-design` como guía de estilo. De la v2 solo se tomaron las comprobaciones estructurales (márgenes, desbordes, titulares de dos líneas, contraste, huecos).

- **Idea:** noche azul IEEE sobre el Golfo (navy PMS 295 → azul PMS 3015 → resplandor cian), con naranja PMS 137 C para lo activo, igual que el tratamiento oficial del logo sobre azul.
- **Patrones:** navegación-isla de vidrio que cambia de tema según la sección, anuncio del 80 aniversario, chip para copiar el correo, gafete del capítulo con inclinación 3D (nombre, color oficial del área, celosía del edificio grabada), respaldo institucional, rueda de las siete áreas que gira con el scroll, actividades con fragmentos de interfaz reales (Git, formato de hackatón, problema de práctica, tablero), paso a paso fijo para unirse, pestañas de eventos, tarjeta oscura de comunidad, preguntas frecuentes y CTA final.
- **Reglas de la v2 relajadas a propósito:** degradados, vidrio, píldoras, etiquetas, monoespaciada en código y correo, sombras suaves, bordes de 1 px y composición centrada.
- **Conflicto de marca:** usa JetBrains Mono (no está en la guía) solo para código y el correo; puede sustituirse.
- **Estado:** `inspect.mjs` sin fallos a 1440, 768 y 390 px (con las excepciones anteriores); sin errores de consola.
