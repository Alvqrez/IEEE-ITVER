# Fase 3 · Sistema de diseño — IEEE Computer Society ITVer

Base: la landing D (aprobada), la *IEEE Computer Society Brand Identity & Graphic Style Guide*, `design-taste-frontend-v1` (diales: variación 8, movimiento 6, densidad 4) y `high-end-visual-design`.
Tokens implementados en [`propuestas/d-moderna/tokens.css`](../propuestas/d-moderna/tokens.css). Muestrario visual en [`docs/sistema-de-diseno.html`](sistema-de-diseno.html).
Estado: **pendiente de aprobación**.

## 1. Principios

1. **Noche azul sobre el Golfo.** Las superficies oscuras van de navy PMS 295 a azul IEEE PMS 3015 con un resplandor cian. Las claras son un tinte del 4 % del azul IEEE.
2. **Un solo acento.** El naranja PMS 137 C marca solo la acción y el estado activo, como en el logo oficial sobre azul.
3. **Piezas físicas.** Los contenedores principales usan doble bisel (carcasa más núcleo con radio concéntrico). Las sombras son difusas y teñidas de navy, nunca negras.
4. **Interfaz real, no decoración.** Las imágenes de producto son fragmentos de interfaz con contenido verdadero (código, formatos, tableros).
5. **Movimiento con masa.** Curvas de resorte, entradas escalonadas, solo `transform`, `opacity` y `clip-path`, y versión estática con movimiento reducido.

## 2. Color

| Token | Valor | Uso |
| --- | --- | --- |
| `--navy` | `#002855` (PMS 295) | Tinta, fondos nocturnos |
| `--blue` | `#00629B` (PMS 3015) | Marca, enlaces, etiquetas |
| `--cyan` | `#00B5E2` (Process Cyan) | Resplandores, acentos fríos |
| `--orange` | `#FFA300` (PMS 137 C) | Acento único: CTA, activo, foco |
| `--paper` | tinte 4 % de azul IEEE | Fondo claro |
| `--surface` / `--surface-2` | blanco / tinte 8 % | Núcleo y carcasa del doble bisel |
| `--line` | tinte 10 % de navy | Bordes de 1 px |
| `--muted` | tinte 72 % de navy | Texto secundario (6:1 sobre blanco) |
| `--danger` | `#BA0C2F` (PMS 200 C) | Errores de formulario |
| `--area-*` | paleta brillante oficial | Solo para codificar las 7 áreas |

**Reglas:** texto naranja solo sobre navy o azul, nunca sobre blanco (no alcanza el contraste). No se usan los morados de la paleta. Las páginas de aplicación (inicio de sesión, panel) van sobre `--paper`, con navy como tinta.

## 3. Tipografía

Familia única **Montserrat** (400, 500, 600, 700). **JetBrains Mono** solo para código y datos (conflicto menor con la guía: la mono no está en ella; si no se aprueba, se sustituye por Montserrat con cifras tabulares).

| Token | Tamaño | Uso |
| --- | --- | --- |
| `--s-h1` | 40–92 px, tracking −0.055em, interlínea 0.98 | Título de página (uno por página) |
| `--s-h2` | 34–56 px, tracking −0.045em | Títulos de sección |
| `--s-h3` | 28–40 px | Títulos de tarjeta y bloque |
| `--s-lead` | 17–20 px | Subtítulos |
| `--s-body` | 16–17 px, interlínea 1.6, medida ≤ 65 ch | Texto |
| `--s-small` | 14 px | Metadatos, etiquetas (13 px mínimo absoluto) |

Titulares de dos líneas como máximo en todos los anchos. Mayúsculas solo en siglas.

## 4. Espacio, radios y profundidad

- **Escala de 4 px:** `--sp-1` (4) … `--sp-16` (64). Margen de página `--m` de 16–40 px; contenido a 1180 px; separación entre secciones `--section` de 96–176 px.
- **Radios:** píldora (`999px`) para botones, chips y pestañas; `--r-xl` 32 px para contenedores principales; `--r-l` 24 px para tarjetas internas; `--r-m` 14 px para fragmentos de interfaz; `--r-s` 8 px para campos pequeños.
- **Doble bisel:** carcasa (`--surface-2` o vidrio, borde de 1 px, `padding: --bezel` de 8 px) con núcleo de radio `calc(exterior − bezel)`.
- **Sombras:** `--shadow-soft` para tarjetas y `--shadow-ui` para fragmentos. En vidrio sobre oscuro, `--edge-light` como refracción del borde. Sin brillos ni sombras negras.

## 5. Componentes

| Componente | Anatomía | Estados |
| --- | --- | --- |
| **Botón** | Píldora con icono anidado en círculo. Variantes: naranja (primario), claro (sobre oscuro), navy (sobre claro) | Hover: el icono se desplaza 3 px con resorte. Activo: escala 0.97. Foco: anillo naranja de 3 px |
| **Navegación-isla** | Píldora fija y centrada: logo, 4 enlaces, CTA naranja; vidrio con desenfoque (solo en elementos fijos) | Cambia a tema claro sobre secciones claras. En móvil, "Menú" abre una hoja navy con enlaces escalonados y la hamburguesa se transforma en X |
| **Etiqueta de sección** | Píldora blanca con cuadro naranja y texto azul | Estática |
| **Chip** | Mono, 13 px, fondo `--paper`, radio 8 px | Estático. El chip social es enlace y su flecha se desplaza en hover |
| **Tarjeta de función** | Doble bisel: panel con degradado de tintes cian y azul más texto (etiqueta, h3, párrafo, chip) | Entrada escalonada al aparecer |
| **Fragmento de interfaz** (`data-ui`) | Ventana blanca o navy, barra de título y contenido real | Microinteracción continua discreta (cursor, punto que respira, tarjeta flotante) |
| **Gafete** | Tarjeta 1.586:1 con color del área, logo (blanco u oficial negro según contraste) y celosía | Inclinación 3D y brillo bajo el puntero |
| **Rueda** | Lista en cilindro 3D ligada al scroll, banda activa con marcas naranjas, contador "n de 7" | Estática con movimiento reducido |
| **Paso a paso** | Lista con barra naranja activa más tarjeta de lista de verificación con progreso | Avanza con el scroll en escritorio y con clic en cualquier ancho |
| **Pestañas** | Segmentado en píldora; la activa es blanca y lleva sombra mínima | Flechas del teclado |
| **Tarjeta de proyecto** | Doble bisel: imagen 16:10 (opcional), tipo, fecha, título, descripción, enlace | Hover: sube 3 px y la imagen escala a 1.04. Filtros por tipo cuando hay dos o más tipos |
| **Estado vacío** | Doble bisel con texto, CTA y línea de tiempo desde la fundación (2026) | Punto "próximo" que respira |
| **Pregunta frecuente** | `details`/`summary` nativo con "+" que gira 45° | Abierto: icono naranja |

**Formularios (para inicio de sesión y páginas futuras):** etiqueta arriba, campo de 52 px con radio de píldora o de 14 px (según contexto), ayuda opcional debajo y error debajo en `--danger` con `aria-describedby`. Estados: reposo, foco (anillo naranja), error, deshabilitado y cargando (esqueleto o botón con indicador; nunca un spinner genérico). Ver el muestrario.

## 6. Responsive

- **Puntos de quiebre:** 1024 px (tableta) y 760 px (móvil).
- **Móvil:** una columna. Los botones ocupan todo el ancho, con el icono al extremo. La navegación queda en logo y "Menú". El gafete va encima del formulario, la rueda baja a 6.4vw, el paso a paso no se fija y las tarjetas de proyecto ocupan el ancho completo.
- **Alturas:** `min-height: 100dvh`, nunca `100vh`, en las secciones de pantalla completa.
- **Objetivos táctiles:** 44 px como mínimo.

## 7. Sistema de movimiento

| Token | Valor | Uso |
| --- | --- | --- |
| `--spring` | `cubic-bezier(.32,.72,0,1)` | Botones, menú, gafete, filtros |
| `--ease-out` | `cubic-bezier(.22,1,.36,1)` | Entradas cortas |
| `--ease-expo` | `cubic-bezier(.16,1,.3,1)` | Revelados largos |
| Duraciones | presión 160 · hover 200 · UI 400 · revelado 900 ms | Escalonado de 90 ms, máximo 4 pasos |

- **Revelado:** sube 28 px con un desenfoque de 6 px que se resuelve, una sola vez, con `IntersectionObserver`.
- **Escenas ligadas al scroll** (rueda y pasos): un bucle `requestAnimationFrame` activo solo mientras la sección es visible; nunca un listener de `scroll`.
- **Microinteracciones continuas:** solo dentro de los fragmentos de interfaz y se detienen con movimiento reducido.
- **Movimiento reducido:** todo queda en su estado final y la rueda pasa a lista.

## 8. Accesibilidad y marca

- Contraste AA o mejor. Foco visible en todo control. Grupos de radio, pestañas y listas de pasos navegables con teclado. Texto alternativo en toda imagen.
- Logo de IEEE CS sin alterar: versión blanca sobre oscuro, oficial naranja y negro sobre claro, y negra sólida sobre colores claros del gafete. Margen mínimo de 0.3 × altura.
- Logo maestro de IEEE: pendiente por decisión del capítulo.

## 9. Arquitectura del sitio

- `sitio.config.json` → `"landing"` elige qué propuesta es el sitio publicado. `npm run construir` sincroniza cabecera y pie y genera `dist/`; `npm run vista-previa` lo sirve en `localhost:4321`.
- **A y D son multipágina** (inicio, quiénes somos, eventos, noticias, únete, proyectos, equipo, galería). B y C siguen siendo de una página: si se eligen, el sitio publicado solo tiene inicio.
- La cabecera y el pie de cada propuesta se editan **solo en su `index.html`** (bloques `<!-- comun:… -->`); `npm run sincronizar` los copia a las demás páginas y marca la página actual.
- Datos en `contenido/`: `capitulo.js` (nombre, redes, mesa, asesoría, coordinaciones, integrantes, misión, visión, objetivos y valores en borrador), `eventos.js`, `noticias.js`, `proyectos.js` y `galeria.js`. `aplicar.js` los pinta y da vida a filtros, calendario (.ics y Google Calendar), compartir, visor de fotos y el formulario "Escríbenos".
- Revisión de diseño: abrir cualquier página con `?ejemplos` carga `contenido/ejemplos.js` (contenido falso etiquetado "Ejemplo"); ese archivo no se publica.
- `paginas/` queda para páginas adicionales comunes (p. ej. inicio de sesión, aún sin confirmar).
- Si se cambia a A, B o C como página de inicio, las páginas nuevas seguirán usando este sistema. Recomiendo mantenerlo, porque es el más preparado para una aplicación (formularios, estados, tarjetas).

## 10. Para aprobar

1. Paleta y reglas del acento naranja.
2. JetBrains Mono en código y datos (o sustituirla).
3. Componentes y estados de formulario para el inicio de sesión.
4. Siguiente paso (Fase 4): mover los tokens a `assets/` compartido y decidir el servicio de autenticación antes de construir el inicio de sesión.
