# Páginas adicionales

Aquí van las páginas que no son la landing (por ejemplo `iniciar-sesion/index.html`). Al ejecutar `npm run construir`, todo lo que haya en esta carpeta se copia a `dist/` junto a la landing elegida, así que `paginas/iniciar-sesion/index.html` se publica como `/iniciar-sesion/`.

Para que una página nueva se vea como el resto del sitio:

1. Enlaza los tokens del sistema de diseño: `<link rel="stylesheet" href="../propuestas/d-moderna/tokens.css">` (al construir, copia `tokens.css` junto a la página o muévelo a `assets/` cuando pasemos a la Fase 4).
2. Usa las rutas `../assets/...` para logos e imágenes y carga `../contenido/capitulo.js` si necesitas el nombre, las redes o la mesa directiva.
3. Sigue los componentes documentados en `docs/fase-3-sistema-de-diseno.md`.

Nota: un inicio de sesión necesita un servicio real de autenticación (por ejemplo Firebase Auth, Supabase o Auth0). Una página de inicio de sesión sin ese servicio sería una funcionalidad simulada, así que se decide junto con el backend en la Fase 4.
