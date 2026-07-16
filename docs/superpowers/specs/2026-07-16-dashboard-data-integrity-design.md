# Integridad y utilidad de los datos del dashboard "Mesa"

## Contexto

El dashboard "Mesa" (vista post-login, `src/pages/dashboard.tsx`) consume datos reales del
backend (`asistpro-back`, endpoint `/api/web/summary`), pero la capa de presentación en el
frontend introdujo inconsistencias:

1. Un bug de cálculo hace que los porcentajes de "gastos por categoría" y "ahorro del mes"
   se muestren multiplicados por 100 de más (ej. 34% se ve como 3420%).
2. El backend calcula presupuestos (`budget_status`) con alertas de sobregasto, y existe un
   componente frontend correcto para mostrarlos (`BudgetsSection`), pero no está montado en
   ninguna vista del dashboard actual — es funcionalidad invisible para el usuario.
3. Los datos que sí se muestran carecen de contexto temporal (no hay comparación mes a mes
   en gastos por categoría) y el gráfico de tendencia en Finanzas solo grafica ingresos pese
   a que el backend ya entrega ingresos y gastos por mes.

Objetivo: que el dashboard transmita información correcta, completa y accionable — un
producto "robusto, profesional, maduro y fiable" en palabras del usuario.

## Alcance

Incluye: vista de Finanzas del dashboard Mesa (`MesaFinanzasView.tsx`), su fuente de datos en
el backend (`app/finance/services.py`, endpoint `/api/web/summary`), y el componente de
presupuestos que hoy es código muerto.

Fuera de alcance: Agenda y Ajustes (auditados puntualmente, sin bugs de cálculo encontrados),
landing page, login — no se tocan en este trabajo.

## Fase 1 — Corrección de cálculo de porcentajes

**Problema:** en `src/components/dashboard/mesa/MesaFinanzasView.tsx`, el backend ya entrega
`share` (en `expense_categories`) y `savings_rate` (en `month`) en escala 0–100. El frontend
los multiplica de nuevo por 100 antes de redondear:

- Línea 131: `Math.round(data.month.savings_rate * 100)` → debe ser
  `Math.round(data.month.savings_rate)`
- Línea 282: `Math.round(cat.share * 100)` → debe ser `Math.round(cat.share)`

**Nota:** las barras de progreso (línea 285, `(cat.share / maxShare) * 100`) no requieren
cambio — son una proporción relativa entre categorías y ya se veían correctas al cancelarse
el factor de escala común.

**Testing:** test de regresión en `src/__tests__/mesa-finanzas-view.test.tsx` que fije un
`share`/`savings_rate` conocido (ej. 34.2) y verifique que el texto renderizado sea `34%` y
`ahorro 34%`, no `3420%`.

## Fase 2 — Recuperar Presupuestos en la vista de Finanzas

**Problema:** `budget_status()` (backend) calcula `spent_amount`, `limit_amount`,
`percentage_used` y `threshold` (ok/warning/over_limit) por presupuesto, y viaja en
`summary.budgets`. El componente `BudgetsSection` (en
`src/components/dashboard/DashboardSections.tsx`) consume ese dato correctamente, pero usa
clases Tailwind del tema oscuro antiguo y **no está importado en `dashboard.tsx`** — es
código muerto en la práctica.

**Solución:**
- Crear `src/components/dashboard/mesa/MesaBudgets.tsx`: misma lógica de `BudgetsSection`
  (porcentaje clamped a 100, tono por `threshold`), pero con el lenguaje visual "Mesa" (fondo
  papel `#FCFAF2`, tipografía mono para labels, acentos de la paleta ya usada en
  `MesaFinanzasView` — verde `#547552` / ámbar / rojo terracota `#C94E2C` según `threshold`).
- Montarlo en `dashboard.tsx`, dentro de `activeView === 'finanzas'`, pasando `MesaFinanzasView`
  como hijo o como sección hermana (a decidir en implementación según el layout de dos
  columnas existente — encaja naturalmente en la columna derecha, bajo "Gastos por
  categoría").
- Estado vacío (`budgets.length === 0`): mensaje breve invitando a crear un presupuesto
  (el alta se hace por WhatsApp, no hay formulario web de creación — mencionarlo así).
- Sin cambios de backend: el dato ya existe y ya viaja en el summary.

**Testing:** test de render con `budgets: []` (estado vacío) y con un presupuesto en cada
`threshold` (ok/warning/over_limit) verificando el color/tono aplicado.

## Fase 3 — Utilidad temporal de los datos

**3.1 — Comparación mes a mes en "Gastos por categoría"**

Hoy `expense_categories()` (backend) solo calcula el mes actual; no hay forma de saber si una
categoría subió o bajó. Se extiende la función para aceptar además un rango de comparación
opcional:

```python
def expense_categories(session, profile, *, start, end, compare_start=None, compare_end=None) -> list[dict]:
    ...
    # agrega "previous_amount": money_str | None y "change_pct": float | None por categoría
```

El endpoint `web_summary` calcula el mes anterior (mismo cálculo que ya hace para `month_start`/
`month_end`, desplazado un mes) y lo pasa como rango de comparación. Categorías presentes solo
en el mes anterior (gasto que desapareció) se ignoran para este cálculo — no se agregan como
categorías "fantasma" en la lista actual.

Frontend (`MesaFinanzasView.tsx`): junto al `%` de cada categoría, un indicador compacto
(`↑12%` / `↓8%` / sin cambio) coloreado (rojo si sube gasto, verde si baja), solo si
`previous_amount` no es `null`.

**3.2 — Gráfico de caja con ingresos y gastos**

El bloque "Ingresos · últimos N meses" en `MesaFinanzasView.tsx` (líneas ~201-234) ya recibe
`monthly_trend`, que incluye `income` **y** `expense` por punto — el gráfico solo dibuja
`income`. Cambio puramente frontend: barras duales (ingreso en verde, gasto en terracota) por
mes, o barra apilada con el neto como línea superpuesta. Se elige barras duales por
consistencia con el resto de la paleta de "Mesa" (categorías ya usan colores por barra
individual). Título del bloque pasa de "Ingresos · últimos N meses" a "Ingresos y gastos ·
últimos N meses".

**Testing:** test de `monthly_trend` con datos mixtos (mes con solo ingreso, mes con solo
gasto, mes con ambos) verificando que ambas series se rendericen con las alturas
correspondientes.

## Fuera de alcance confirmado

Auditoría puntual de Agenda (`MesaAgendaView.tsx`) y Ajustes (`MesaAjustesView.tsx`): los
cálculos de proporciones (`donutV`, `donutG`, `fillPct`) son correctos — dividen conteos
reales entre totales reales sin doble escalado. No se encontraron datos mock, aleatorios ni
hardcodeados en ninguna vista de Mesa. No requieren cambios en este trabajo.

## Riesgos / decisiones tomadas

- No se agrega conversión de moneda ni FX: fuera de alcance, no relacionado al pedido.
- Fase 3.1 requiere un cambio de contrato en el backend (`expense_categories` gana
  parámetros opcionales y las respuestas ganan dos campos nuevos) — es aditivo, no rompe
  consumidores existentes del endpoint.
- Se prioriza consistencia visual con el sistema "Mesa" ya existente antes que introducir un
  nuevo lenguaje visual para presupuestos o comparativas.
