import { useState } from 'react';
import { Bot, LogOut, RefreshCw, Settings, TrendingDown, TrendingUp, Wallet, PiggyBank } from 'lucide-react';
import type { DashboardSummary } from '../../services/dashboardService';
import { fmt } from './format';
import { Badge, Button, Skeleton } from '../ui';
import { SettingsModal } from './SettingsModal';

interface Props {
  data: DashboardSummary | null;
  loading: boolean;
  onRefresh: () => void;
  onLogout: () => void;
  onUnauthorized: () => void;
}

export function SummaryCard({ data, loading, onRefresh, onLogout, onUnauthorized }: Props) {
  const net = parseFloat(data?.month?.net || '0');
  const savings = data?.month?.savings_rate ?? 0;
  const isPositive = net >= 0;
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="section-frame rounded-[1.9rem] bg-dark-card/95 p-5 sm:p-6 space-y-5 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-dark-accent text-dark-bg flex items-center justify-center shadow-lg shadow-black/20 flex-shrink-0">
            <Bot className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-xl leading-none text-dark-text-primary">AsistPro</p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-dark-secondary mt-1 truncate">
              {data?.month_label || 'Cargando...'}
            </p>
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
            onClick={() => setSettingsOpen(true)}
            disabled={!data}
            aria-label="Configuración"
            className="!p-2.5"
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            aria-label="Salir"
            className="!p-2.5 !text-dark-muted hover:!text-red-300 hover:!bg-red-500/[0.08]"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {data && (
        <SettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          currentCurrency={data.currency}
          onSaved={onRefresh}
          onUnauthorized={onUnauthorized}
        />
      )}
      <div
        className={`rounded-[1.5rem] p-5 relative overflow-hidden border ${
          isPositive
            ? 'bg-gradient-to-br from-emerald-500/[0.10] to-dark-card border-emerald-500/18'
            : 'bg-gradient-to-br from-red-500/[0.10] to-dark-card border-red-500/18'
        }`}
      >
        <div className="relative z-10">
          <p
            className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${
              isPositive ? 'text-emerald-300/80' : 'text-red-300/80'
            }`}
          >
            Saldo del mes
          </p>
          {loading ? (
            <Skeleton className="h-10 w-40 mt-3" />
          ) : (
            <p
              className={`text-4xl font-display font-semibold tracking-tight mt-2 ${
                isPositive ? 'text-emerald-300' : 'text-red-300'
              }`}
            >
              {isPositive ? '+' : ''}
              {fmt(data?.month?.net)}
            </p>
          )}
          <p className="text-xs uppercase tracking-[0.16em] text-dark-secondary mt-2">
            {data?.currency}
          </p>
        </div>
        <div
          className={`absolute right-4 top-4 w-12 h-12 rounded-2xl flex items-center justify-center ${
            isPositive ? 'bg-emerald-500/10' : 'bg-red-500/10'
          }`}
        >
          <Wallet
            className={`w-5 h-5 ${isPositive ? 'text-emerald-300' : 'text-red-300'}`}
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-[1.1rem] p-3 border border-dark-border bg-dark-bg/55">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-300" aria-hidden="true" />
            </div>
            <span className="text-[10px] text-dark-secondary font-semibold uppercase tracking-[0.16em]">
              Ingresos
            </span>
          </div>
          {loading ? (
            <Skeleton className="h-5 w-20" />
          ) : (
            <p className="text-sm font-semibold text-emerald-300 tabular-nums">
              +{fmt(data?.month?.income)}
            </p>
          )}
        </div>

        <div className="rounded-[1.1rem] p-3 border border-dark-border bg-dark-bg/55">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
              <TrendingDown className="w-3.5 h-3.5 text-red-300" aria-hidden="true" />
            </div>
            <span className="text-[10px] text-dark-secondary font-semibold uppercase tracking-[0.16em]">
              Gastos
            </span>
          </div>
          {loading ? (
            <Skeleton className="h-5 w-20" />
          ) : (
            <p className="text-sm font-semibold text-red-300 tabular-nums">
              -{fmt(data?.month?.expense)}
            </p>
          )}
        </div>

        <div className="rounded-[1.1rem] p-3 border border-dark-border bg-dark-bg/55">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center">
              <PiggyBank className="w-3.5 h-3.5 text-sky-300" aria-hidden="true" />
            </div>
            <span className="text-[10px] text-dark-secondary font-semibold uppercase tracking-[0.16em]">
              Ahorro
            </span>
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

      <div className="pt-3 border-t border-dark-border-subtle">
        {loading ? (
          <Skeleton className="h-4 w-32 mx-auto" />
        ) : (
          <div className="flex items-center justify-center gap-1.5 text-xs text-dark-secondary">
            <span className="uppercase tracking-[0.16em]">Balance acumulado</span>
            <span className="font-medium text-dark-text-primary tabular-nums">
              {fmt(data?.total_balance)} {data?.currency}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
