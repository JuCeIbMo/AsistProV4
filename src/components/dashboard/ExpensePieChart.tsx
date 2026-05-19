import { PieChart } from 'lucide-react';
import type { ExpenseCategoryItem } from '../../services/dashboardService';
import { fmt } from './format';

interface Props {
  categories: ExpenseCategoryItem[];
  loading: boolean;
  currency?: string;
}

const PALETTE = ['#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12', '#52525b'];

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

export function ExpensePieChart({ categories, loading, currency }: Props) {
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
    <div className="bg-[#13131c] border border-white/[0.07] rounded-2xl p-5">
      <h2 className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest mb-4">
        Distribución de gastos
      </h2>
      {loading ? (
        <div className="flex items-center justify-center h-44">
          <div
            className="w-32 h-32 rounded-full"
            style={{
              background:
                'conic-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
              animation: 'shimmer 1.4s infinite',
            }}
          />
        </div>
      ) : slices.length === 0 || total === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <PieChart className="w-8 h-8 text-gray-700 mb-2" />
          <p className="text-sm text-gray-600">Sin gastos este mes</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <svg viewBox="0 0 100 100" className="w-36 h-36 flex-shrink-0">
            {slices.map((c, idx) => {
              const start = (cumulative / total) * 360;
              cumulative += parseFloat(c.amount);
              const end = (cumulative / total) * 360;
              const color = PALETTE[idx % PALETTE.length];
              return (
                <path
                  key={(c.slug || c.display_name) + idx}
                  d={arcPath(50, 50, 48, start, end)}
                  fill={color}
                  stroke="#13131c"
                  strokeWidth="0.5"
                />
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
          <div className="flex-1 space-y-2 w-full">
            {slices.map((c, idx) => (
              <div key={(c.slug || c.display_name) + idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: PALETTE[idx % PALETTE.length] }}
                  />
                  <span className="text-gray-300 truncate">{c.display_name}</span>
                </div>
                <span className="text-gray-500 tabular-nums ml-2 whitespace-nowrap">
                  {c.share.toFixed(0)}%
                </span>
              </div>
            ))}
            {currency && (
              <p className="text-[10px] text-gray-700 pt-1">Montos en {currency}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
