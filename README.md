# Cuatro estaciones contigo

Experiencia web interactiva en **Next.js + App Router + TypeScript + Tailwind CSS**. Está planteada como una carta personal para revelar cuatro regalos en orden: Primavera, Verano, Otoño e Invierno.

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

- **Mensajes, regalos, títulos, detalles y colores:** `data/estaciones.ts`
- **Carta final:** `components/experience/FinalLetter.tsx`
- **Texto de portada:** `components/experience/Cover.tsx`
- **Imágenes provisionales:** `public/placeholders/`

Reemplaza los cuatro SVG por tus fotos conservando los mismos nombres, o cambia la ruta `image` correspondiente en `data/estaciones.ts`. Las imágenes actuales son ilustraciones abstractas locales marcadas como `IMAGEN PROVISIONAL`; no representan fotografías ni productos reales.

## Qué queda provisional

1. Los mensajes románticos de cada estación y la carta final son textos de muestra.
2. Los cuatro archivos visuales son placeholders abstractos y deben cambiarse por tus fotos.
3. La etiqueta `Carta / 2026` de la portada es orientativa y puede sustituirse por el año o texto que prefieras.
4. El nombre «Jormands» se conserva tal como aparece en el brief original.

## Comportamiento incluido

- Desbloqueo secuencial: solo Primavera aparece disponible al inicio.
- Progreso persistente en `localStorage` (`cuatro-estaciones-progress`).
- Botón discreto para reiniciar la experiencia durante las pruebas.
- Navegación con teclado, botones semánticos, estados bloqueados y `prefers-reduced-motion`.
- Sin reproducción automática de música ni dependencias externas para las imágenes.
