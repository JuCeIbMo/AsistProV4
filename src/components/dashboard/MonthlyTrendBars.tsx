import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import type { MonthlyTrendPoint } from '../../services/dashboardService';
import { fmt } from './format';

interface Props {
  trend: MonthlyTrendPoint[];
  loading: boolean;
  currency?: string;
}

function Skeleton({ className }: { className: string }) {
  return (
    <div
      className={`rounded-lg ${className}`}
      style={{
        background:
          'linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s infinite',
      }}
    />
  );
}

export function MonthlyTrendBars({ trend, loading, currency }: Props) {
  const [hover, setHover] = useState<number | null>(null);

  const max = trend.reduce((m, p) => {
    const i = parseFloat(p.income);
    const e = parseFloat(p.expense);
    return Math.max(m, i, e);
  }, 1);

  const hasData = trend.some(p => parseFloat(p.income) > 0 || parseFloat(p.expense) > 0);

  return (
    <div className="bg-[#13131c] border border-white/[0.07] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest">
          Tendencia 12 meses
        </h2>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-emerald-500" />
            <span className="text-gray-500">Ingresos</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-red-500" />
            <span className="text-gray-500">Gastos</span>
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-end gap-1.5 h-40 px-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="flex-1 h-full opacity-50" />
          ))}
        </div>
      ) : !hasData ? (
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <BarChart3 className="w-8 h-8 text-gray-700 mb-2" />
          <p className="text-sm text-gray-600">Aún no hay historial</p>
        </div>
      ) : (
        <div className="relative">
          <div className="flex items-end justify-between gap-1 h-40 px-1">
            {trend.map((p, idx) => {
              const inc = parseFloat(p.income);
              const exp = parseFloat(p.expense);
              const iH = Math.max((inc / max) * 100, inc > 0 ? 2 : 0);
              const eH = Math.max((exp / max) * 100, exp > 0 ? 2 : 0);
              return (
                <div
                  key={`${p.year}-${p.month}`}
                  className="flex-1 flex flex-col items-center gap-1 cursor-pointer"
                  onMouseEnter={() => setHover(idx)}
                  onMouseLeave={() => setHover(null)}
                  onTouchStart={() => setHover(idx)}
                >
                  <div className="w-full h-32 flex items-end justify-center gap-0.5">
                    <div
                      className={`w-1/2 rounded-t bg-gradient-to-b from-emerald-400 to-emerald-600 transition-all duration-500 ${hover === idx ? 'opacity-100' : 'opacity-90'}`}
                      style={{ height: `${iH}%` }}
                    />
                    <div
                      className={`w-1/2 rounded-t bg-gradient-to-b from-red-400 to-red-600 transition-all duration-500 ${hover === idx ? 'opacity-100' : 'opacity-90'}`}
                      style={{ height: `${eH}%` }}
                    />
                  </div>
                  <span className={`text-[10px] tabular-nums ${hover === idx ? 'text-gray-300' : 'text-gray-600'}`}>
                    {p.label.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
          {hover !== null && trend[hover] && (
            <div className="mt-3 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.05] flex items-center justify-between text-xs">
              <span className="font-medium text-gray-300">{trend[hover].label}</span>
              <div className="flex items-center gap-4 tabular-nums">
                <span className="text-emerald-400">+{fmt(trend[hover].income)}</span>
                <span className="text-red-400">-{fmt(trend[hover].expense)}</span>
                <span className={parseFloat(trend[hover].net) >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                  = {fmt(trend[hover].net)}
                </span>
              </div>
            </div>
          )}
          {currency && (
            <p className="text-[10px] text-gray-700 mt-2 text-center">Montos en {currency}</p>
          )}
        </div>
      )}
    </div>
  );
}
