import { useState, useCallback } from 'react';
import { PieChart } from 'lucide-react';
import type { ExpenseCategoryItem } from '../../services/dashboardService';
import { chartColors, darkColors } from '../../styles/tokens';
import { fmt } from './format';

interface Props {
  categories: ExpenseCategoryItem[];
  loading: boolean;
  currency?: string;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  if (endAngle - startAngle >= 360) {
    return `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} Z`;
  }
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

function getSliceCenter(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const midAngle = ((startAngle + endAngle) / 2 - 90) * (Math.PI / 180);
  const distance = r * 0.65;
  return {
    x: cx + distance * Math.cos(midAngle),
    y: cy + distance * Math.sin(midAngle),
  };
}

export function ExpensePieChart({ categories, loading, currency }: Props) {
  const [hover, setHover] = useState<number | null>(null);

  const clearHover = useCallback(() => setHover(null), []);

  const slices = (() => {
    if (categories.length <= 6) return categories;
    const top = categories.slice(0, 5);
    const restAmount = categories
      .slice(5)
      .reduce((sum, c) => sum + parseFloat(c.amount), 0);
    const restShare = categories.slice(5).reduce((sum, c) => sum + c.share, 0);
    return [
      ...top,
      {
        slug: '__other__',
        display_name: 'Otros',
        amount: restAmount.toFixed(2),
        share: restShare,
      },
    ];
  })();

  const total = slices.reduce((sum, c) => sum + parseFloat(c.amount), 0);
  let cumulative = 0;

  return (
    <div
      className="bg-dark-card border-dark-border rounded-2xl p-5"
      onTouchStart={clearHover}
    >
      <h2 className="text-xs font-semibold text-dark-muted uppercase tracking-widest mb-4">
        Distribución de gastos
      </h2>
      {loading ? (
        <div className="flex items-center justify-center h-44">
          <div
            className="w-32 h-32 rounded-full"
            aria-hidden="true"
            style={{
              background:
                'conic-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
              animation: 'shimmer 1.4s infinite',
            }}
          />
        </div>
      ) : slices.length === 0 || total === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <PieChart className="w-8 h-8 text-dark-muted-dim mb-2" aria-hidden="true" />
          <p className="text-sm text-dark-muted">Sin gastos este mes</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative">
            <svg
              viewBox="0 0 100 100"
              className="w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0"
              onClick={clearHover}
              aria-label="Gráfico de distribución de gastos por categoría"
              role="img"
            >
              {slices.map((c, idx) => {
                const start = (cumulative / total) * 360;
                cumulative += parseFloat(c.amount);
                const end = (cumulative / total) * 360;
                const color = chartColors[idx % chartColors.length];
                const percentage = ((parseFloat(c.amount) / total) * 100).toFixed(1);
                return (
                  <path
                    key={(c.slug || c.display_name) + idx}
                    d={arcPath(50, 50, 48, start, end)}
                    fill={color}
                    stroke="#13131c"
                    strokeWidth="0.5"
                    className="transition-opacity duration-200 cursor-pointer"
                    style={{ opacity: hover === idx ? 1 : 0.85 }}
                    onMouseEnter={() => setHover(idx)}
                    onMouseLeave={() => setHover(null)}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      setHover(idx);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setHover(hover === idx ? null : idx);
                    }}
                    aria-label={`Categoría: ${c.display_name}, Monto: ${fmt(parseFloat(c.amount))}, Porcentaje: ${percentage}%`}
                  >
                    <title>{`${c.display_name}: ${fmt(parseFloat(c.amount))} (${percentage}%)`}</title>
                  </path>
                );
              })}
              <circle cx="50" cy="50" r="26" fill="#13131c" />
              <text
                x="50"
                y="49"
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="6"
                fontFamily="Outfit, sans-serif"
              >
                Total
              </text>
              <text
                x="50"
                y="57"
                textAnchor="middle"
                fill="#fff"
                fontSize="8"
                fontWeight="700"
                fontFamily="Syne, sans-serif"
              >
                {fmt(total)}
              </text>
            </svg>
            {hover !== null && slices[hover] && (() => {
              const idx = hover;
              let startCumulative = 0;
              for (let i = 0; i < idx; i++) {
                startCumulative += parseFloat(slices[i].amount);
              }
              const start = (startCumulative / total) * 360;
              const end = ((startCumulative + parseFloat(slices[hover].amount)) / total) * 360;
              const pos = getSliceCenter(50, 50, 48, start, end);
              const svgRect = { x: 0, y: 0, width: 144, height: 144 };
              const pctX = (pos.x / 100) * svgRect.width + svgRect.x;
              const pctY = (pos.y / 100) * svgRect.height + svgRect.y;
              const tooltipOffsetX = pctX < svgRect.width / 2 ? 8 : -8;
              const tooltipOffsetY = pctY < svgRect.height / 2 ? 8 : -8;
              return (
                <div
                  className="absolute pointer-events-none z-10 px-3 py-2 rounded-lg text-xs"
                  style={{
                    backgroundColor: darkColors.elevated,
                    border: `1px solid ${darkColors['border-strong']}`,
                    boxShadow: darkColors.shadow,
                    top: pctY + tooltipOffsetY,
                    left: pctX + tooltipOffsetX,
                    transform: 'translate(-50%, -50%)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <div className="font-medium text-dark-text">{slices[hover].display_name}</div>
                  <div className="text-dark-secondary">
                    {fmt(parseFloat(slices[hover].amount))} ({((parseFloat(slices[hover].amount) / total) * 100).toFixed(1)}%)
                  </div>
                </div>
              );
            })()}
          </div>
          <div className="flex-1 space-y-2 w-full">
            {slices.map((c, idx) => (
              <div
                key={(c.slug || c.display_name) + idx}
                className="flex items-center justify-between text-xs cursor-pointer"
                onMouseEnter={() => setHover(idx)}
                onMouseLeave={() => setHover(null)}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setHover(idx);
                }}
                onClick={() => setHover(hover === idx ? null : idx)}
                role="button"
                tabIndex={0}
                aria-label={`${c.display_name}: ${c.share.toFixed(0)}%`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setHover(hover === idx ? null : idx);
                  }
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: chartColors[idx % chartColors.length] }}
                    aria-hidden="true"
                  />
                  <span className={`truncate ${hover === idx ? 'text-dark-text' : 'text-dark-text/80'}`}>
                    {c.display_name}
                  </span>
                </div>
                <span className="text-dark-secondary tabular-nums ml-2 whitespace-nowrap">
                  {c.share.toFixed(0)}%
                </span>
              </div>
            ))}
            {currency && (
              <p className="text-xs text-dark-muted-dim pt-1">Montos en {currency}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
