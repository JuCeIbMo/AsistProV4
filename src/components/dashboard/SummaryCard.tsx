import { Bot, LogOut, RefreshCw, TrendingDown, TrendingUp, Wallet, PiggyBank } from 'lucide-react';
import type { DashboardSummary } from '../../services/dashboardService';
import { fmt } from './format';
import { Badge, Button, Skeleton } from '../ui';

interface Props {
  data: DashboardSummary | null;
  loading: boolean;
  onRefresh: () => void;
  onLogout: () => void;
}

export function SummaryCard({ data, loading, onRefresh, onLogout }: Props) {
  const net = parseFloat(data?.month?.net || '0');
  const income = parseFloat(data?.month?.income || '0');
  const expense = parseFloat(data?.month?.expense || '0');
  const savings = data?.month?.savings_rate ?? 0;
  const isPositive = net >= 0;

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-5 space-y-5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/20 flex-shrink-0">
            <Bot className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-white text-sm leading-none">AsistPro</p>
            <p className="text-xs text-gray-500 mt-1 truncate">{data?.month_label || 'Cargando...'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            aria-label="Actualizar"
            className="!p-2.5"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            aria-label="Salir"
            className="!p-2.5 !text-gray-600 hover:!text-red-400 hover:!bg-red-500/[0.08]"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Hero: Saldo del mes */}
      <div
        className={`rounded-xl p-5 relative overflow-hidden ${
          isPositive
            ? 'bg-gradient-to-br from-emerald-500/[0.08] to-emerald-600/[0.04] border border-emerald-500/20'
            : 'bg-gradient-to-br from-red-500/[0.08] to-red-600/[0.04] border border-red-500/20'
        }`}
      >
        <div className="relative z-10">
          <p
            className={`text-xs font-semibold uppercase tracking-wider ${
              isPositive ? 'text-emerald-400/70' : 'text-red-400/70'
            }`}
          >
            Saldo del mes
          </p>
          {loading ? (
            <Skeleton className="h-10 w-40 mt-2" />
          ) : (
            <p
              className={`text-3xl font-bold font-display tracking-tight mt-1 ${
                isPositive ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {isPositive ? '+' : ''}
              {fmt(data?.month?.net)}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">{data?.currency}</p>
        </div>
        <div
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl flex items-center justify-center ${
            isPositive ? 'bg-emerald-500/10' : 'bg-red-500/10'
          }`}
        >
          <Wallet
            className={`w-5 h-5 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Metrics row: Ingresos | Gastos | Tasa de ahorro */}
      <div className="grid grid-cols-3 gap-3">
        {/* Ingresos */}
        <div className="bg-dark-bg/50 rounded-lg p-3 border border-white/[0.04]">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            </div>
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Ingresos</span>
          </div>
          {loading ? (
            <Skeleton className="h-5 w-20" />
          ) : (
            <p className="text-sm font-semibold text-emerald-400 tabular-nums">+{fmt(data?.month?.income)}</p>
          )}
        </div>

        {/* Gastos */}
        <div className="bg-dark-bg/50 rounded-lg p-3 border border-white/[0.04]">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center">
              <TrendingDown className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />
            </div>
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Gastos</span>
          </div>
          {loading ? (
            <Skeleton className="h-5 w-20" />
          ) : (
            <p className="text-sm font-semibold text-red-400 tabular-nums">-{fmt(data?.month?.expense)}</p>
          )}
        </div>

        {/* Tasa de ahorro */}
        <div className="bg-dark-bg/50 rounded-lg p-3 border border-white/[0.04]">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center">
              <PiggyBank className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
            </div>
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Ahorro</span>
          </div>
          {loading ? (
            <Skeleton className="h-5 w-16" />
          ) : (
            <Badge variant={savings >= 20 ? 'success' : savings >= 0 ? 'warning' : 'danger'} size="sm">
              {savings.toFixed(1)}%
            </Badge>
          )}
        </div>
      </div>

      {/* Footer: Balance total histórico */}
      <div className="flex items-center justify-center pt-1 border-t border-white/[0.04]">
        {loading ? (
          <Skeleton className="h-4 w-32" />
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <span>Balance acumulado:</span>
            <span className="font-medium text-gray-400 tabular-nums">
              {fmt(data?.total_balance)} {data?.currency}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
