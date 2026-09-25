# Cuatro estaciones contigo

Experiencia web interactiva en **Next.js + App Router + TypeScript + Tailwind CSS**. Está planteada como una carta personal para revelar cuatro regalos en orden: Primavera, Verano, Otoño e Invierno.

## Estructura

- `src/app/`: layout, página y estilos globales.
- `src/components/`: `Intro`, `AccessGate`, `MusicPlayer`, `SeasonCard`, `SpringReveal`, `SummerReveal`, `AutumnReveal`, `WinterReveal`, `FinalLetter`, `SeasonExperience`, `SeasonIcon`.
- `src/data/seasons.ts`: contenido de las estaciones.
- `src/data/music.ts`: enlace de la playlist de Spotify (Embed oficial; la playlist solo abre con su enlace compartido, incluido `si`).
- `src/hooks/useGiftProgress.ts`: inicio, progreso, selección, desbloqueo y reinicio.
- `public/placeholders/`: SVG provisionales; `public/gifts/` reservada para las fotos reales.

## Ejecutar localmente

```bash
pnpm install
pnpm dev
```

Después abre [http://localhost:3000](http://localhost:3000). Para una comprobación de producción:

```bash
pnpm typecheck
pnpm build
pnpm start
```

## Dónde personalizar el contenido

- **Mensajes, regalos, títulos, detalles y colores:** `src/data/seasons.ts`
- **Carta final:** `src/components/FinalLetter.tsx`
- **Texto de portada:** `src/components/Intro.tsx`
- **Imágenes provisionales:** `public/placeholders/`

Reemplaza los cuatro SVG por tus fotos conservando los mismos nombres, o cambia la ruta `image` correspondiente en `src/data/seasons.ts`. Las imágenes actuales son ilustraciones abstractas locales marcadas como `IMAGEN PROVISIONAL`; no representan fotografías ni productos reales.

## Qué queda provisional

1. Los mensajes románticos de cada estación y la carta final son textos de muestra.
2. Los cuatro archivos visuales son placeholders abstractos y deben cambiarse por tus fotos.
3. La etiqueta `Carta / 2026` de la portada es orientativa y puede sustituirse por el año o texto que prefieras.
4. El nombre «Jormands» se conserva tal como aparece en el brief original.

## Comportamiento incluido

- Desbloqueo secuencial: solo Primavera aparece disponible al inicio.
- Progreso persistente en `localStorage` (`cuatro-estaciones-progress`), gestionado por `src/hooks/useGiftProgress.ts`.
- Botón discreto para reiniciar la experiencia durante las pruebas.
- Navegación con teclado, botones semánticos, estados bloqueados y `prefers-reduced-motion`.
- Sin reproducción automática de música ni dependencias externas para las imágenes.

## Reproductor de Spotify en la web (prueba)

Prueba funcional con el **Web Playback SDK** (canciones completas dentro del navegador, requiere Spotify Premium). El Embed anterior sigue en el mismo panel hasta confirmar la prueba en un teléfono real.

Código: `src/lib/spotify.ts` (PKCE, tokens, API), `src/hooks/useSpotifyPlayback.ts` (una sola instancia del SDK, montada en `SeasonExperience`) y `src/components/SpotifyControls.tsx` (botones temporales).

### Configuración

1. En <https://developer.spotify.com/dashboard> crea una app y copia su **Client ID** (no se usa Client Secret).
2. Copia `.env.example` a `.env.local` y rellena `NEXT_PUBLIC_SPOTIFY_CLIENT_ID`. En Vercel u otro hosting, define la misma variable y vuelve a desplegar.
3. En **Redirect URIs** de la app registra exactamente estas URL (la de retorno es la raíz del sitio, con la barra final; Spotify no admite `localhost`):
   - Local: `http://127.0.0.1:3000/` (abre la web con `http://127.0.0.1:3000`, no con `localhost`).
   - Producción / prueba en el teléfono: `https://TU-DOMINIO/` (HTTPS obligatorio).
4. En **User Management** añade el nombre y el correo de cada cuenta de Spotify que vaya a probar (tu cuenta y, después, la de ella). Sin eso Spotify responde 403 y la web muestra «cuenta no autorizada».
5. Scopes solicitados: `streaming`, `user-read-email`, `user-read-private`, `user-modify-playback-state`, `user-read-playback-state`.

Tokens: se guardan en `localStorage` (`cuatro-estaciones-spotify-auth`) y nunca se escriben en la consola.
