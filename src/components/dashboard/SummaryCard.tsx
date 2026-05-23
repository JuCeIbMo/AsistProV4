import { Bot, LogOut, RefreshCw, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
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
  const savings = data?.month?.savings_rate ?? 0;
  const savingsVariant = savings >= 20 ? 'success' : savings >= 0 ? 'warning' : 'danger';

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-5 space-y-5 overflow-hidden">
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

      <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-4 relative overflow-hidden">
          <div className="absolute right-3 top-3 w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-orange-400" aria-hidden="true" />
          </div>
        <p className="text-xs font-semibold text-orange-400/70 uppercase tracking-wider">Balance total</p>
        {loading ? (
          <Skeleton className="h-9 w-32 mt-2" />
        ) : (
          <>
            <p className="text-2xl font-bold font-display text-white mt-1 tracking-tight">
              {fmt(data?.total_balance)}
            </p>
            <p className="text-xs text-gray-500 mt-1">{data?.currency}</p>
          </>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-400" aria-hidden="true" />
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
              <TrendingDown className="w-4 h-4 text-red-400" aria-hidden="true" />
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
            <Badge variant={savingsVariant} size="sm">
              {savings.toFixed(1)}%
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
