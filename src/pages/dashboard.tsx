import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { AlertCircle } from 'lucide-react';
import { logout as logoutSession } from '../services/authService';
import {
  fetchSummary,
  type DashboardSummary,
} from '../services/dashboardService';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { ExpenseCategoriesList } from '../components/dashboard/ExpenseCategoriesList';
import { ExpensePieChart } from '../components/dashboard/ExpensePieChart';
import { MonthlyTrendBars } from '../components/dashboard/MonthlyTrendBars';
import { TransactionsList } from '../components/dashboard/TransactionsList';
import { fmt } from '../components/dashboard/format';

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

function ErrorPanel({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="bg-[#13131c] border border-red-500/20 rounded-2xl p-6 text-center">
      <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
      <p className="text-sm text-gray-300 mb-3">No pudimos cargar tus datos.</p>
      <button
        onClick={onRetry}
        className="text-xs font-medium px-4 py-2 rounded-lg bg-orange-500/15 text-orange-300 hover:bg-orange-500/25 transition"
      >
        Reintentar
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const hasFetched = useRef(false);

  const goLogin = useCallback(() => {
    router.replace('/login');
  }, [router]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const result = await fetchSummary();
    if (!result.ok) {
      if (result.status === 'unauthorized') {
        goLogin();
        return;
      }
      setError(true);
      setLoading(false);
      return;
    }
    setData(result.data);
    setLoading(false);
  }, [goLogin]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      load();
    }
  }, [router, load]);

  async function logout() {
    await logoutSession();
    router.push('/login');
  }

  return (
    <>
      <Head>
        <title>AsistPro — Dashboard</title>
        <meta name="robots" content="noindex" />
      </Head>

      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

      <div className="min-h-screen bg-[#0c0c12]">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-6">
            {/* Right rail on desktop / top on mobile */}
            <aside className="lg:order-2 lg:sticky lg:top-6 lg:self-start mb-6 lg:mb-0">
              <SummaryCard
                data={data}
                loading={loading}
                onRefresh={load}
                onLogout={logout}
              />
            </aside>

            {/* Main content */}
            <div className="lg:order-1 space-y-5 min-w-0">
              {error ? (
                <ErrorPanel onRetry={load} />
              ) : (
                <>
                  <MonthlyTrendBars
                    trend={data?.monthly_trend || []}
                    loading={loading}
                    currency={data?.currency}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <ExpensePieChart
                      categories={data?.expense_categories || []}
                      loading={loading}
                      currency={data?.currency}
                    />
                    <ExpenseCategoriesList
                      categories={data?.expense_categories || []}
                      loading={loading}
                      currency={data?.currency}
                    />
                  </div>

                  <section>
                    <h2 className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest mb-3">
                      Cuentas
                    </h2>
                    {loading ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[1, 2].map(n => (
                          <div
                            key={n}
                            className="bg-[#13131c] border border-white/[0.07] rounded-xl p-4"
                          >
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-7 w-32" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {data?.accounts?.map(acc => (
                          <div
                            key={acc.id}
                            className="bg-[#13131c] border border-white/[0.07] rounded-xl p-4 flex items-center justify-between hover:border-white/[0.12] transition-colors"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="font-medium text-gray-200 text-sm truncate">
                                  {acc.name}
                                </p>
                                {acc.is_default && (
                                  <span className="text-[9px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                                    Principal
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-0.5">{acc.currency}</p>
                            </div>
                            <p className="text-lg font-bold font-display text-white tabular-nums ml-2">
                              {fmt(acc.balance)}
                            </p>
                          </div>
                        ))}
                        {!data?.accounts?.length && (
                          <p className="text-gray-600 text-sm col-span-2 py-4 text-center">
                            Sin cuentas registradas.
                          </p>
                        )}
                      </div>
                    )}
                  </section>

                  <section>
                    <h2 className="text-[11px] font-semibold text-gray-600 uppercase tracking-widest mb-3">
                      Presupuestos
                    </h2>
                    <div className="bg-[#13131c] border border-white/[0.07] rounded-2xl p-5">
                      {loading ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map(n => (
                            <div key={n}>
                              <div className="flex justify-between mb-1.5">
                                <Skeleton className="h-3.5 w-24" />
                                <Skeleton className="h-3.5 w-20" />
                              </div>
                              <Skeleton className="h-2 w-full" />
                            </div>
                          ))}
                        </div>
                      ) : data?.budgets?.length ? (
                        <div className="space-y-4">
                          {data.budgets.map(b => {
                            const pct = Math.min(parseFloat(b.percentage_used), 100);
                            const colorClass =
                              b.threshold === 'over_limit'
                                ? 'from-red-500 to-rose-500'
                                : b.threshold === 'warning'
                                ? 'from-yellow-400 to-amber-500'
                                : 'from-emerald-400 to-emerald-500';
                            return (
                              <div key={b.id}>
                                <div className="flex justify-between text-xs mb-1.5">
                                  <span className="font-medium text-gray-300">
                                    {b.category.display_name}
                                  </span>
                                  <span className="text-gray-600 tabular-nums">
                                    {fmt(b.spent_amount)} / {fmt(b.limit_amount)}
                                  </span>
                                </div>
                                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full bg-gradient-to-r ${colorClass} transition-all duration-700`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <div className="flex justify-between mt-1">
                                  <span className="text-[10px] text-gray-700">
                                    {b.period === 'monthly' ? 'Mensual' : 'Semanal'}
                                  </span>
                                  <span
                                    className={`text-[10px] font-semibold tabular-nums ${
                                      b.threshold === 'over_limit'
                                        ? 'text-red-400'
                                        : b.threshold === 'warning'
                                        ? 'text-yellow-400'
                                        : 'text-emerald-400'
                                    }`}
                                  >
                                    {b.percentage_used}%
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                          <p className="text-sm text-gray-600">Sin presupuestos activos</p>
                        </div>
                      )}
                    </div>
                  </section>

                  <TransactionsList
                    initialItems={data?.recent_transactions || []}
                    loading={loading}
                    onUnauthorized={goLogin}
                  />
                </>
              )}
            </div>
          </div>

          <footer className="max-w-6xl mx-auto pt-8 pb-6 text-center">
            <p className="text-[11px] text-gray-800">AsistPro · Datos en tiempo real</p>
          </footer>
        </main>
      </div>
    </>
  );
}
