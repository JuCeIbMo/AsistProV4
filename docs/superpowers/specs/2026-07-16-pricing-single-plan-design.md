# Landing: plan único con switch de moneda

## Contexto

La sección de precios de la landing (`src/App.tsx`, `#pricing`) ofrece hoy 3 planes
(Starter/Pro/Premium) con un switch Mensual/Anual. Se simplifica a **un solo plan**, y el
switch pasa a alternar **moneda** (ARS/USD) en vez de periodicidad.

## Alcance

Incluye: sección `#pricing` en `src/App.tsx`, y el mapa hardcodeado de precios USD en
`src/components/PricingModal.tsx` (`getUsdPrice`).

Fuera de alcance: rediseño visual completo de la landing (hero, features, testimonios,
footer) — se trata como proyecto aparte. Login y dashboard no se tocan.

## Datos del plan único

- Nombre: se mantiene "Pro" internamente (para no romper `mapPlanName`/webhook de WhatsApp
  que ya usa ese valor en producción), mostrado en la UI como "AsistPro" o similar copy.
- Precio ARS: $5.999/mes · $59.990/año (ahorro ARS $11.998/año).
- Precio USD: $5.99/mes · $59.99/año — valor ya existente en `getUsdPrice` para "Pro", no
  se inventa un nuevo número.
- Features: unión completa de las 9 funciones que hoy solo tenía el plan Premium
  (recordatorios ilimitados, notas de voz, recordatorios recurrentes, listas, múltiples
  recordatorios por mensaje, acceso anticipado, Google Calendar completo, respuestas por
  audio, finanzas personales). Sin lista de "no incluye".

## Estado y periodicidad

- `isAnnual` (boolean, estado de página) se elimina como controlador del switch visible.
- Nuevo estado `currency: 'ARS' | 'USD'` controla qué precio se muestra en las tarjetas.
- La periodicidad (mensual vs anual) ya no es un estado global: cada tarjeta es fija (una
  "Mensual", otra "Anual") y al hacer click en "Comenzar prueba gratuita" se abre el modal
  pasándole `isAnnual={true|false}` según cuál tarjeta se clickeó — mismo contrato de props
  que `PricingModal` ya espera.

## Layout

- Switch de moneda (ARS/USD) centrado arriba de las tarjetas, mismo estilo de pill toggle
  que existía para Mensual/Anual.
- Dos tarjetas lado a lado (una columna en mobile): "Mensual" y "Anual". La tarjeta Anual
  lleva el badge "Más conveniente" (reemplaza al anterior "Más Popular", ya no aplica el
  sentido de popularidad entre planes) y el texto de ahorro.
- Cada tarjeta muestra: nombre del plan, precio en la moneda seleccionada + periodo,
  ahorro (solo en Anual), lista completa de features, botón "Comenzar prueba gratuita".

## Modal (`PricingModal.tsx`)

- Sin cambios de contrato de props.
- `getUsdPrice`: el mapa `monthlyPrices`/`annualPrices` pasa de 3 claves (Starter/Pro/Premium)
  a 1 clave (el nombre interno del plan único), valor `5.99`/`59.99`.
- Su lógica de mostrar USD solo cuando se elige PayPal como método de pago no cambia — es
  independiente del switch de moneda de la landing, que es solo informativo antes de abrir
  el modal.

## Testing

- Si existen tests de la landing/pricing (a verificar), actualizarlos al nuevo modelo de un
  solo plan. Si no existen, no se agregan nuevos por ser una landing sin lógica de negocio
  compleja (decisión de alcance: priorizar el fix funcional sobre cobertura nueva).

## Visual (esta fase)

Pulido acotado de la tarjeta de precios dentro de la paleta actual (crema/naranja/Inter):
mejor jerarquía tipográfica del precio, espaciado consistente entre las dos tarjetas, un
único acento visual en la tarjeta Anual (borde/badge) para diferenciarla sin volver a la
lógica de "plan popular". No se toca identidad de marca — eso es la Fase 2 (landing
completa), a brainstormear aparte.
