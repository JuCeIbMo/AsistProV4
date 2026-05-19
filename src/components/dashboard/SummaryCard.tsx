import { Bot, LogOut, RefreshCw, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import type { DashboardSummary } from '../../services/dashboardService';
import { fmt } from './format';

interface Props {
  data: DashboardSummary | null;
  loading: boolean;
  onRefresh: () => void;
  onLogout: () => void;
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

export function SummaryCard({ data, loading, onRefresh, onLogout }: Props) {
  const net = parseFloat(data?.month?.net || '0');
  const savings = data?.month?.savings_rate ?? 0;
  const savingsColor =
    savings >= 20 ? 'text-emerald-400' : savings >= 0 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="bg-[#13131c] border border-white/[0.07] rounded-2xl p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/20 flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-white text-sm leading-none">AsistPro</p>
            <p className="text-[11px] text-gray-500 mt-1 truncate">{data?.month_label || 'Cargando...'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-400 hover:bg-white/[0.05] transition disabled:opacity-40"
            title="Actualizar"
            aria-label="Actualizar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onLogout}
            className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/[0.08] transition"
            title="Salir"
            aria-label="Salir"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-4 relative overflow-hidden">
        <div className="absolute right-3 top-3 w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center">
          <Wallet className="w-4 h-4 text-orange-400" />
        </div>
        <p className="text-[11px] font-semibold text-orange-400/70 uppercase tracking-wider">Balance total</p>
        {loading ? (
          <Skeleton className="h-9 w-32 mt-2" />
        ) : (
          <>
            <p className="text-2xl font-bold font-display text-white mt-1 tracking-tight">
              {fmt(data?.total_balance)}
            </p>
            <p className="text-[11px] text-gray-600 mt-0.5">{data?.currency}</p>
          </>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-xs text-gray-500">Ingresos</span>
          </div>
          {loading ? (
            <Skeleton className="h-5 w-20" />
          ) : (
            <span className="text-sm font-semibold text-emerald-400 tabular-nums">
              {fmt(data?.month?.income)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-400" />
            </div>
            <span className="text-xs text-gray-500">Gastos</span>
          </div>
          {loading ? (
            <Skeleton className="h-5 w-20" />
          ) : (
            <span className="text-sm font-semibold text-red-400 tabular-nums">
              {fmt(data?.month?.expense)}
            </span>
          )}
        </div>
        <div className="border-t border-white/[0.05] pt-3 flex items-center justify-between">
          <span className="text-xs text-gray-500">Neto</span>
          {loading ? (
            <Skeleton className="h-5 w-20" />
          ) : (
            <span className={`text-sm font-bold tabular-nums ${net >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {fmt(data?.month?.net)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Tasa de ahorro</span>
          {loading ? (
            <Skeleton className="h-5 w-16" />
          ) : (
            <span className={`text-sm font-semibold tabular-nums ${savingsColor}`}>
              {savings.toFixed(1)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
