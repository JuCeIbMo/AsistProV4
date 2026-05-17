import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Bot, LogOut, RefreshCw, TrendingUp, TrendingDown,
  Wallet, ArrowUpRight, ArrowDownLeft, ArrowLeftRight,
} from 'lucide-react';
import { clearToken, isAuthenticated } from '../services/authService';
import { fetchSummary, DashboardSummary, BudgetItem, Transaction } from '../services/dashboardService';

function fmt(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '—';
  const n = parseFloat(String(value));
  if (isNaN(n)) return '—';
  return n.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function SkeletonBlock({ className }: { className: string }) {
  return (
    <div
      className={`rounded-lg ${className}`}
      style={{
        background: 'linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s infinite',
      }}
    />
  );
}

function BarChart({ income, expense }: { income: number; expense: number }) {
  const max = Math.max(income, expense, 1);
  const ih = Math.round((income / max) * 100);
  const eh = Math.round((expense / max) * 100);
  return (
    <div className="flex items-end justify-center gap-8 h-36 px-4">
      <div className="flex flex-col items-center gap-2 flex-1">
        <div className="w-full relative flex items-end justify-center" style={{ height: 120 }}>
          <div
            className="w-full rounded-t-xl bg-gradient-to-b from-emerald-400 to-emerald-600 transition-all duration-700"
            style={{ height: `${ih}%`, minHeight: 4 }}
          />
        </div>
        <span className="text-xs font-semibold text-emerald-400">Ingresos</span>
      </div>
      <div className="flex flex-col items-center gap-2 flex-1">
        <div className="w-full relative flex items-end justify-center" style={{ height: 120 }}>
          <div
            className="w-full rounded-t-xl bg-gradient-to-b from-red-400 to-red-600 transition-all duration-700"
            style={{ height: `${eh}%`, minHeight: 4 }}
          />
        </div>
        <span className="text-xs font-semibold text-red-400">Gastos</span>
      </div>
    </div>
  );
}

function BudgetBar({ budget }: { budget: BudgetItem }) {
  const pct = Math.min(parseFloat(budget.percentage_used), 100);
  const colorClass =
    budget.threshold === 'over_limit' ? 'from-red-500 to-rose-500' :
    budget.threshold === 'warning'    ? 'from-yellow-400 to-amber-500' :
                                        'from-emerald-400 to-emerald-500';
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="font-medium text-gray-300">{budget.category.display_name}</span>
        <span className="text-gray-600 tabular-nums">{fmt(budget.spent_amount)} / {fmt(budget.limit_amount)}</span>
      </div>
      <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorClass} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-700">
          {budget.period === 'monthly' ? 'Mensual' : 'Semanal'}
        </span>
        <span className={`text-[10px] font-semibold tabular-nums ${
          budget.threshold === 'over_limit' ? 'text-red-400' :
          budget.threshold === 'warning'    ? 'text-yellow-400' : 'text-emerald-400'
        }`}>
          {budget.percentage_used}%
        </span>
      </div>
    </div>
  );
}

function TxRow({ tx }: { tx: Transaction }) {
  const isIncome   = tx.direction === 'income';
  const isExpense  = tx.direction === 'expense';
  const Icon = isIncome ? ArrowUpRight : isExpense ? ArrowDownLeft : ArrowLeftRight;
  const iconBg  = isIncome ? 'bg-emerald-500/10' : isExpense ? 'bg-red-500/10' : 'bg-blue-500/10';
  const iconCol = isIncome ? 'text-emerald-400'  : isExpense ? 'text-red-400'  : 'text-blue-400';
  const amtCol  = isIncome ? 'text-emerald-400'  : isExpense ? 'text-red-400'  : 'text-gray-400';
  const prefix  = isIncome ? '+' : isExpense ? '-' : '';
  const label   = tx.description || tx.category || (isIncome ? 'Ingreso' : isExpense ? 'Gasto' : 'Transferencia');

  return (
    <div className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.03] transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconCol}`} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-200 truncate">{label}</p>
          <p className="text-xs text-gray-600 truncate">
            {tx.category && tx.description ? `${tx.category} · ` : ''}{tx.occurred_at}
          </p>
        </div>
      </div>
      <p className={`text-sm font-semibold ml-4 flex-shrink-0 tabular-nums ${amtCol}`}>
        {prefix}{fmt(tx.amount)}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const router  = useRouter();
  const [data, setData]       = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  async function load() {
    setLoading(true);
    const summary = await fetchSummary();
    if (!summary) {
      clearToken();
      router.replace('/login');
      return;
    }
    setData(summary);
    setLoading(false);
  }

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    if (!hasFetched.current) { hasFetched.current = true; load(); }
  }, []);

  function logout() {
    clearToken();
    router.push('/login');
  }

  const income  = parseFloat(data?.month?.income  || '0');
  const expense = parseFloat(data?.month?.expense || '0');

  return (
    <>
      <Head>
        <title>AsistPro — Dashboard</title>
        <meta name="robots" content="noindex" />
      </Head>

      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>

      <div className="min-h-screen bg-[#0c0c12]">

        {/* Header */}
        <header className="bg-[#0c0c12]/90 backdrop-blur-xl border-b border-white/[0.05] sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-white">AsistPro</span>
              {data?.month_label && (
                <>
                  <span className="text-white/20 hidden sm:block">·</span>
                  <span className="text-gray-500 text-sm hidden sm:block">{data.month_label}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={load}
                disabled={loading}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-400 hover:bg-white/[0.05] transition disabled:opacity-40"
                title="Actualizar"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/[0.08] transition text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">

          {/* ── Summary cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Total balance */}
            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute right-4 top-4 w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-orange-400" />
              </div>
              <p className="text-xs font-semibold text-orange-400/70 uppercase tracking-wider">Balance total</p>
              {loading ? (
                <SkeletonBlock className="h-9 w-36 mt-2" />
              ) : (
                <>
                  <p className="text-3xl font-bold font-display text-white mt-2 tracking-tight">
                    {fmt(data?.total_balance)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{data?.currency}</p>
                </>
              )}
            </div>

            {/* Income */}
            <div className="bg-[#13131c] border border-white/[0.07] rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute right-4 top-4 w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-xs font-semibold text-emerald-400/70 uppercase tracking-wider">Ingresos</p>
              {loading ? (
                <SkeletonBlock className="h-9 w-32 mt-2" />
              ) : (
                <>
                  <p className="text-3xl font-bold font-display text-white mt-2 tracking-tight">
                    {fmt(data?.month?.income)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{data?.month_label}</p>
                </>
              )}
            </div>

            {/* Expense */}
            <div className="bg-[#13131c] border border-white/[0.07] rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute right-4 top-4 w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-400" />
              </div>
              <p className="text-xs font-semibold text-red-400/70 uppercase tracking-wider">Gastos</p>
              {loading ? (
                <SkeletonBlock className="h-9 w-32 mt-2" />
              ) : (
                <>
                  <p className="text-3xl font-bold font-display text-white mt-2 tracking-tight">
                    {fmt(data?.month?.expense)}
                  </p>
                  <p className={`text-xs mt-1 ${parseFloat(data?.month?.net || '0') >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    Neto: {fmt(data?.month?.net)}
                  </p>
                </>
              )}
            </div>

          </div>

          {/* ── Accounts ── */}
          <section>
            <h2 className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest mb-3">Cuentas</h2>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[1, 2].map(n => (
                  <div key={n} className="bg-[#13131c] border border-white/[0.07] rounded-xl p-4">
                    <SkeletonBlock className="h-4 w-24 mb-2" />
                    <SkeletonBlock className="h-7 w-32" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {data?.accounts?.map(acc => (
                  <div key={acc.id} className="bg-[#13131c] border border-white/[0.07] rounded-xl p-4 flex items-center justify-between hover:border-white/[0.12] transition-colors">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-medium text-gray-200 text-sm">{acc.name}</p>
                        {acc.is_default && (
                          <span className="text-[9px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 rounded-full">
                            Principal
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{acc.currency}</p>
                    </div>
                    <p className="text-xl font-bold font-display text-white tabular-nums">{fmt(acc.balance)}</p>
                  </div>
                ))}
                {!data?.accounts?.length && (
                  <p className="text-gray-600 text-sm col-span-3 py-4 text-center">Sin cuentas registradas.</p>
                )}
              </div>
            )}
          </section>

          {/* ── Chart + Budgets ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            <div className="bg-[#13131c] border border-white/[0.07] rounded-2xl p-5">
              <h2 className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest mb-1">Resumen mensual</h2>
              <p className="text-sm text-gray-500 mb-4">{data?.month_label || ''}</p>
              {loading ? (
                <div className="flex items-end justify-center gap-8 h-36 px-4">
                  <SkeletonBlock className="flex-1 h-20" />
                  <SkeletonBlock className="flex-1 h-14" />
                </div>
              ) : (
                <BarChart income={income} expense={expense} />
              )}
              {!loading && (
                <div className="flex justify-center gap-8 mt-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Ingresos</p>
                    <p className="text-sm font-semibold text-emerald-400 tabular-nums">{fmt(data?.month?.income)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Gastos</p>
                    <p className="text-sm font-semibold text-red-400 tabular-nums">{fmt(data?.month?.expense)}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#13131c] border border-white/[0.07] rounded-2xl p-5">
              <h2 className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest mb-4">Presupuestos</h2>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(n => (
                    <div key={n}>
                      <div className="flex justify-between mb-1.5">
                        <SkeletonBlock className="h-3.5 w-24" />
                        <SkeletonBlock className="h-3.5 w-20" />
                      </div>
                      <SkeletonBlock className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              ) : data?.budgets?.length ? (
                <div className="space-y-4">
                  {data.budgets.map(b => <BudgetBar key={b.id} budget={b} />)}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-sm text-gray-600">Sin presupuestos activos</p>
                </div>
              )}
            </div>

          </div>

          {/* ── Recent Transactions ── */}
          <section>
            <h2 className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest mb-3">Últimas transacciones</h2>
            <div className="bg-[#13131c] border border-white/[0.07] rounded-2xl overflow-hidden">
              {loading ? (
                <div className="divide-y divide-white/[0.04]">
                  {[1, 2, 3, 4, 5].map(n => (
                    <div key={n} className="px-5 py-3.5 flex items-center gap-3">
                      <SkeletonBlock className="w-9 h-9 rounded-full flex-shrink-0" />
                      <div className="flex-1">
                        <SkeletonBlock className="h-3.5 w-40 mb-1.5" />
                        <SkeletonBlock className="h-3 w-24" />
                      </div>
                      <SkeletonBlock className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              ) : data?.recent_transactions?.length ? (
                <div className="divide-y divide-white/[0.04]">
                  {data.recent_transactions.map(tx => <TxRow key={tx.id} tx={tx} />)}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-14 text-center px-6">
                  <p className="text-sm font-medium text-gray-500">Sin transacciones aún</p>
                  <p className="text-xs text-gray-700 mt-1">Los movimientos que registres por WhatsApp aparecerán aquí.</p>
                </div>
              )}
            </div>
          </section>

        </main>

        <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-[11px] text-gray-800">AsistPro · Datos en tiempo real</p>
        </footer>

      </div>
    </>
  );
}
