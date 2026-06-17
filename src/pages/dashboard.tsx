import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { AlertCircle, Settings, Sparkles } from 'lucide-react';
import { logout as logoutSession, checkAuth } from '../services/authService';
import {
  fetchSummary,
  fetchAppointments,
  type DashboardSummary,
} from '../services/dashboardService';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { ExpenseCategoriesList } from '../components/dashboard/ExpenseCategoriesList';
import { ExpensePieChart } from '../components/dashboard/ExpensePieChart';
import { MonthlyTrendBars } from '../components/dashboard/MonthlyTrendBars';
import { TransactionsList } from '../components/dashboard/TransactionsList';
import { AppointmentsList } from '../components/dashboard/AppointmentsList';
import { CategoryManager } from '../components/dashboard/CategoryManager';
import { fmt } from '../components/dashboard/format';
import { Skeleton, Badge, Card } from '../components/ui';

function ErrorPanel({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="section-frame rounded-[1.75rem] bg-dark-card/95 border border-red-500/20 p-8 text-center">
      <AlertCircle className="w-8 h-8 text-red-300 mx-auto mb-3" aria-hidden="true" />
      <p className="text-base text-dark-text-primary mb-2">No pudimos cargar tus datos.</p>
      <p className="text-sm text-dark-secondary mb-5">
        Reintentá para recuperar el estado del panel.
      </p>
      <button
        onClick={onRetry}
        className="text-xs font-semibold uppercase tracking-[0.18em] px-5 py-3 rounded-lg bg-dark-accent-light text-dark-accent-dark hover:bg-dark-accent/25 transition cursor-pointer"
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
  const [authChecking, setAuthChecking] = useState(true);
  const hasFetched = useRef(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const goLogin = useCallback(() => {
    router.replace('/login');
  }, [router]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    const controller = new AbortController();

    try {
      const [summaryResult, appointmentsResult] = await Promise.all([
        fetchSummary(),
        fetchAppointments({}),
      ]);

      if (!summaryResult.ok) {
        if (summaryResult.status === 'unauthorized') {
          goLogin();
          return;
        }
        setError(true);
        setLoading(false);
        return;
      }

      if (!appointmentsResult.ok && appointmentsResult.status === 'unauthorized') {
        goLogin();
        return;
      }

      setData(summaryResult.data);
      setLoading(false);
    } catch {
      setError(true);
      setLoading(false);
    }

    return () => controller.abort();
  }, [goLogin]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      checkAuth().then(res => {
        if (!res.ok) {
          goLogin();
          return;
        }
        setAuthChecking(false);
        load();
      });
    }
  }, [router, load, goLogin]);

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

      <div className="min-h-screen bg-dark-bg text-dark-text overflow-x-hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(182,138,62,0.15),transparent_22%),radial-gradient(circle_at_top_right,rgba(93,133,179,0.10),transparent_18%)]"
          aria-hidden="true"
        />

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <section className="section-frame rounded-[2rem] bg-dark-card/82 px-5 py-6 sm:px-7 sm:py-7 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
              <div>
                <div className="editorial-kicker !text-dark-accent-dark before:!bg-current">
                  Control brief
                </div>
                <h1 className="mt-4 font-display text-4xl sm:text-5xl leading-none text-dark-text-primary">
                  Dashboard
                </h1>
                <p className="mt-3 text-sm sm:text-base text-dark-secondary max-w-2xl">
                  Lectura rápida del mes, estado de cuentas y actividad reciente sin ruido visual.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-dark-border px-4 py-2 text-xs uppercase tracking-[0.18em] text-dark-secondary">
                  <Sparkles className="w-3.5 h-3.5 text-dark-accent-dark" aria-hidden="true" />
                  Datos en tiempo real
                </div>
                <button
                  onClick={() => setCategoriesOpen(true)}
                  className="inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] px-4 py-3 rounded-lg bg-dark-elevated border border-dark-border text-dark-secondary hover:text-dark-text-primary hover:border-dark-border-strong transition cursor-pointer"
                >
                  <Settings className="w-4 h-4" aria-hidden="true" />
                  Categorías
                </button>
              </div>
            </div>
          </section>

          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-6">
            <aside className="lg:order-2 lg:sticky lg:top-6 lg:self-start mb-6 lg:mb-0">
              <SummaryCard
                data={data}
                loading={loading}
                onRefresh={load}
                onLogout={logout}
                onUnauthorized={goLogin}
              />
            </aside>

            <div className="lg:order-1 space-y-6 min-w-0">
              {authChecking ? (
                <div className="section-frame rounded-[1.75rem] bg-dark-card/92 h-96 flex flex-col items-center justify-center">
                  <div className="w-9 h-9 border-2 border-dark-accent/30 border-t-dark-accent rounded-full animate-spin mb-4" />
                  <p className="text-sm text-dark-secondary">Verificando sesión...</p>
                </div>
              ) : error ? (
                <ErrorPanel onRetry={load} />
              ) : (
                <>
                  <MonthlyTrendBars
                    trend={data?.monthly_trend || []}
                    loading={loading}
                    currency={data?.currency}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div className="mb-3">
                      <p className="text-[11px] font-semibold text-dark-secondary uppercase tracking-[0.22em]">
                        Cuentas
                      </p>
                    </div>

                    {loading ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[1, 2].map(n => (
                          <div
                            key={n}
                            className="section-frame rounded-[1.35rem] bg-dark-card/90 p-5"
                          >
                            <Skeleton className="h-4 w-24 mb-3" />
                            <Skeleton className="h-7 w-32" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {data?.accounts?.map(acc => (
                          <div
                            key={acc.id}
                            className="section-frame rounded-[1.35rem] bg-dark-card/90 p-5 flex items-center justify-between hover:border-dark-border-strong transition-colors"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-dark-text-primary text-sm truncate">
                                  {acc.name}
                                </p>
                                {acc.is_default && (
                                  <Badge variant="accent" size="sm">
                                    Principal
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs uppercase tracking-[0.18em] text-dark-muted mt-1">
                                {acc.currency}
                              </p>
                            </div>
                            <p className="text-xl font-semibold font-display text-dark-text-primary tabular-nums ml-3">
                              {fmt(acc.balance)}
                            </p>
                          </div>
                        ))}
                        {!data?.accounts?.length && (
                          <p className="text-dark-muted text-sm col-span-2 py-6 text-center">
                            Sin cuentas registradas.
                          </p>
                        )}
                      </div>
                    )}
                  </section>

                  <section>
                    <div className="mb-3">
                      <p className="text-[11px] font-semibold text-dark-secondary uppercase tracking-[0.22em]">
                        Presupuestos
                      </p>
                    </div>
                    <Card theme="dark">
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
                                ? 'from-red-500 to-rose-400'
                                : b.threshold === 'warning'
                                ? 'from-amber-500 to-yellow-300'
                                : 'from-emerald-500 to-emerald-300';
                            return (
                              <div key={b.id}>
                                <div className="flex justify-between text-xs mb-2">
                                  <span className="font-medium text-dark-text-primary">
                                    {b.category.display_name}
                                  </span>
                                  <span className="text-dark-muted tabular-nums">
                                    {fmt(b.spent_amount)} / {fmt(b.limit_amount)}
                                  </span>
                                </div>
                                <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full bg-gradient-to-r ${colorClass} transition-all duration-700`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <div className="flex justify-between mt-2">
                                  <span className="text-[11px] uppercase tracking-[0.18em] text-dark-muted">
                                    {b.period === 'monthly' ? 'Mensual' : 'Semanal'}
                                  </span>
                                  <span
                                    className={`text-xs font-semibold tabular-nums ${
                                      b.threshold === 'over_limit'
                                        ? 'text-red-300'
                                        : b.threshold === 'warning'
                                        ? 'text-amber-300'
                                        : 'text-emerald-300'
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
                          <p className="text-sm text-dark-muted">Sin presupuestos activos</p>
                        </div>
                      )}
                    </Card>
                  </section>

                  <TransactionsList
                    initialItems={data?.recent_transactions || []}
                    loading={loading}
                    onUnauthorized={goLogin}
                  />

                  <AppointmentsList onUnauthorized={goLogin} />
                </>
              )}
            </div>
          </div>

          <footer className="pt-8 pb-6 text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-dark-muted">
              AsistPro · Datos en tiempo real
            </p>
          </footer>
        </main>
      </div>

      <CategoryManager
        isOpen={categoriesOpen}
        onClose={() => setCategoriesOpen(false)}
        onUnauthorized={goLogin}
      />
    </>
  );
}
