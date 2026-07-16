# Rediseño visual de la landing (Fase 2)

## Contexto

La landing (`src/App.tsx`) tiene look genérico de template Tailwind: botones y texto en
gradiente naranja, tarjetas `shadow-sm hover:shadow-lg` intercambiables con cualquier SaaS,
estrellas de rating de relleno en testimonios, `hover:scale-105` en casi todo. El usuario pide
un rediseño visual completo, con una única restricción dura: **el naranja se conserva** como
acento de marca; todo lo demás (tipografía, paleta neutra, layout, motion) es libre.

## Alcance

Incluye: `src/App.tsx` completo (header, hero, features, testimonios, pricing, CTA, footer),
`src/index.css` (limpieza de reglas obsoletas si aplica). No toca `tailwind.config.ts` (los
tokens de tipografía Syne/Outfit/JetBrains Mono ya existen, ver abajo).

Fuera de alcance: login (`src/pages/login.tsx`) y dashboard (`src/pages/dashboard.tsx` y
`src/components/dashboard/**`) — quedan intactos. La sección de precios ya fue rediseñada en
la Fase 1 (spec `2026-07-16-pricing-single-plan-design.md`); aquí solo se armoniza su
tipografía con el resto (Syne/mono), sin tocar su estructura de datos ni lógica.

## Sistema de tokens

**Color** (único acento de marca: naranja; resto neutro cálido, sin gradientes de color):
- Tinta (texto principal): `#1A1816`
- Papel (fondo de página): `#FDFBF7`
- Superficie alterna (tarjetas): `#F5F1E9`
- Gris cálido (texto secundario): `#6B6255`
- Borde sutil: `#E8E1D3`
- Acento: Tailwind `orange-600` (`#EA580C`) sólido; `orange-500`/`orange-700` para
  hover/estados, nunca como gradiente ni como `bg-clip-text`.

**Tipografía** (ya cargada en `index.css`, sin agregar fuentes nuevas):
- Display (`font-display` → Syne): títulos H1/H2, peso 700-800, tracking ajustado.
- Cuerpo (`font-sans` → Outfit): párrafos, navegación, botones.
- Utilitaria (`font-mono` → JetBrains Mono): eyebrow-labels, timestamps del mockup de
  WhatsApp, precios en la sección de pricing, "tags" de datos parseados (ver firma).
- Se elimina el `font-['Inter',sans-serif]` forzado en el `<div>` raíz de `App.tsx`.

**Firma visual:** AsistPro convierte mensajes de WhatsApp en datos organizados. Esa idea se
hace visible con pequeñas etiquetas mono estilo "dato parseado", ej. `[CITA · MAÑANA 15:00]`
o `[GASTO · $2.500 · ALIMENTACIÓN]`, usadas como eyebrow-label recurrente antes de cada
título de sección (reemplazando el patrón genérico de ícono+título+párrafo centrado).

## Cambios por sección

**Header:** logo sin gradiente (ícono en cuadro naranja sólido + wordmark en tinta, no
`bg-clip-text`). Nav en Outfit, hover en naranja sólido sin transición de escala.

**Hero:** título en Syne, palabra destacada en naranja sólido (no degradado). CTA primario
naranja sólido; CTA secundario en outline. El mockup de WhatsApp se mantiene tal cual
(colores verdes/reales de WhatsApp) porque es una representación literal de la app real, no
parte de la paleta de marca del sitio — repintarlo de naranja sería falsear el producto que
se muestra. Se agrega la eyebrow-label mono sobre el título (`[TU ASISTENTE, ORGANIZADO]`).

**Features:** se abandona la grilla 4-up de tarjeta+ícono+sombra. Cada feature lleva su
eyebrow mono (`AGENDA`, `FINANZAS`, `INFORMES`, `VOZ` — etiquetas de categoría, no números:
no son una secuencia, así que no se usa 01/02/03/04) y su descripción, en dos columnas,
sobre fondo papel sin tarjetas con sombra — separadas por un borde sutil superior.

**Testimonios:** se elimina el patrón de estrellas de relleno + tarjeta blanca + cursiva
(genérico y no verificable). Se reemplaza por burbujas de chat entrantes (mismo lenguaje
visual que el mockup del hero — fondo blanco, cola de burbuja, timestamp mono), atribuidas a
nombre + rol debajo. Mismo contenido de testimonios ya existente, solo cambia la presentación.

**Pricing:** sin cambios de estructura/lógica (Fase 1). Solo se actualiza tipografía: título
en Syne, precios en JetBrains Mono, botones en naranja sólido sin gradiente.

**CTA final:** de fondo en gradiente naranja pasa a fondo naranja sólido (`orange-600`).

**Footer:** fondo tinta (`#1A1816` en vez de `gray-900` genérico). Se eliminan los links
muertos a `#` (Sobre Nosotros / Blog / Carreras, que no llevan a ninguna página real) y se
dejan solo enlaces reales: Funciones, Testimonios, Precios, Contacto (anclas existentes) y
Privacidad/Términos apuntando a `/legal/privacy-policy` y `/legal/terms-of-service` (páginas
que ya existen en `src/pages/legal/`).

## Motion

- Reveal al hacer scroll (fade + leve desplazamiento vertical) en cada sección, usando
  `IntersectionObserver` vía un hook simple (`useScrollReveal`), sin librería nueva.
- Hover: lift sutil (`translateY(-2px)` + sombra suave) en tarjetas/botones interactivos, no
  `scale-105`.
- Se respeta `prefers-reduced-motion`: sin reveal ni transform si el usuario lo pide.

## Testing

Landing sin lógica de negocio compleja (ya cubierta la única lógica real — precios/moneda —
en la Fase 1). No se agregan tests nuevos de UI para esta pasada puramente visual; se valida
con `next build` (type-check) y verificación visual manual en el navegador.

## Riesgos / decisiones tomadas

- El mockup de WhatsApp conserva sus colores reales (verde) — decisión explícita, ver Hero.
- No se toca `tailwind.config.ts`: los tokens de tipografía ya existen desde un rediseño
  previo no completado; este trabajo los activa y les da uso real.
- Los testimonios son contenido de ejemplo preexistente (no verídico) — se mantiene el mismo
  texto, solo cambia el continente visual; no se inventan nuevos testimonios.
