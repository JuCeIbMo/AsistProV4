import { useState, useCallback } from 'react';
import { BarChart3 } from 'lucide-react';
import type { MonthlyTrendPoint } from '../../services/dashboardService';
import { darkColors } from '../../styles/tokens';
import { fmt } from './format';
import { Skeleton } from '../ui';

interface Props {
  trend: MonthlyTrendPoint[];
  loading: boolean;
  currency?: string;
}

function niceMax(value: number): number {
  if (value <= 0) return 1;
  const digits = Math.floor(Math.log10(value));
  const pow10 = 10 ** digits;
  const normalized = value / pow10;
  let ceil: number;
  if (normalized <= 1) ceil = 1;
  else if (normalized <= 2) ceil = 2;
  else if (normalized <= 5) ceil = 5;
  else ceil = 10;
  return ceil * pow10;
}

function yTicks(maxValue: number): number[] {
  const nice = niceMax(maxValue);
  const steps = 4;
  const ticks: number[] = [];
  for (let i = 0; i <= steps; i++) {
    ticks.push(Math.round((nice / steps) * i));
  }
  return ticks;
}

export function MonthlyTrendBars({ trend, loading, currency }: Props) {
  const [hover, setHover] = useState<number | null>(null);

  const clearHover = useCallback(() => setHover(null), []);

  const max = trend.reduce((m, p) => {
    const i = parseFloat(p.income);
    const e = parseFloat(p.expense);
    return Math.max(m, i, e);
  }, 1);

  const hasData = trend.some(p => parseFloat(p.income) > 0 || parseFloat(p.expense) > 0);
  const ticks = yTicks(max);
  const chartMax = ticks[ticks.length - 1] || 1;

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold text-dark-muted uppercase tracking-widest">
          Tendencia 12 meses
        </h2>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-emerald-500" aria-hidden="true" />
            <span className="text-dark-secondary">Ingresos</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-red-500" aria-hidden="true" />
            <span className="text-dark-secondary">Gastos</span>
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
          <BarChart3 className="w-8 h-8 text-dark-muted-dim mb-2" aria-hidden="true" />
          <p className="text-sm text-dark-muted">Aún no hay historial</p>
        </div>
      ) : (
        <div className="relative" onTouchStart={clearHover}>
<div className="flex items-end h-40">
            {/* Y-axis labels - hidden on very small screens */}
            <div className="hidden sm:flex flex-col justify-between h-32 pr-2 text-xs text-dark-muted-dim tabular-nums text-right">
              {ticks.slice().reverse().map(t => (
                <span key={t}>{fmt(t.toFixed(2))}</span>
              ))}
            </div>

            {/* Bars */}
            <div className="flex-1 flex items-end justify-between gap-1 h-32 px-1">
              {trend.map((p, idx) => {
                const inc = parseFloat(p.income);
                const exp = parseFloat(p.expense);
                const iH = Math.max((inc / chartMax) * 100, inc > 0 ? 2 : 0);
                const eH = Math.max((exp / chartMax) * 100, exp > 0 ? 2 : 0);
                const net = parseFloat(p.net);
                return (
                  <div
                    key={`${p.year}-${p.month}`}
                    className="flex-1 flex flex-col items-center gap-1 cursor-pointer relative"
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
                    role="button"
                    tabIndex={0}
                    aria-label={`${p.label}: Ingresos ${fmt(p.income)}, Gastos ${fmt(p.expense)}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setHover(hover === idx ? null : idx);
                      }
                    }}
                  >
                    <div className="w-full h-full flex items-end justify-center gap-0.5 relative">
                      <div
                        className={`w-1/2 rounded-t bg-gradient-to-b from-emerald-400 to-emerald-600 transition-all duration-500 ${hover === idx ? 'opacity-100' : 'opacity-90'}`}
                        style={{ height: `${iH}%` }}
                        aria-label={`Ingresos ${p.label}: ${fmt(p.income)}`}
                      />
                      <div
                        className={`w-1/2 rounded-t bg-gradient-to-b from-red-400 to-red-600 transition-all duration-500 ${hover === idx ? 'opacity-100' : 'opacity-90'}`}
                        style={{ height: `${eH}%` }}
                        aria-label={`Gastos ${p.label}: ${fmt(p.expense)}`}
                      />

                      {/* Floating tooltip */}
                      {hover === idx && (
                        <div
                          className="absolute pointer-events-none z-10 px-3 py-2 rounded-lg text-xs"
                          style={{
                            backgroundColor: darkColors.elevated,
                            border: `1px solid ${darkColors['border-strong']}`,
                            boxShadow: darkColors.shadow,
                            bottom: `${Math.max(iH, eH) + 8}%`,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <div className="font-medium text-dark-text mb-1">{p.label}</div>
                          <div className="flex items-center gap-3 tabular-nums">
                            <span className="text-emerald-400">+{fmt(p.income)}</span>
                            <span className="text-red-400">-{fmt(p.expense)}</span>
                            <span className={net >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                              = {fmt(p.net)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <span className={`text-xs tabular-nums ${hover === idx ? 'text-dark-text' : 'text-dark-muted'}`}>
                      {p.label.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {currency && (
            <p className="text-xs text-dark-muted-dim mt-2 text-center">Montos en {currency}</p>
          )}
        </div>
      )}
    </div>
  );
}
