import { useCallback, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Settings, Sparkles } from 'lucide-react';
import { AppointmentsList } from '../components/dashboard/AppointmentsList';
import {
  AccountsSection,
  AuthCheckingPanel,
  BudgetsSection,
  ErrorPanel,
} from '../components/dashboard/DashboardSections';
import { CategoryManager } from '../components/dashboard/CategoryManager';
import { ExpenseCategoriesList } from '../components/dashboard/ExpenseCategoriesList';
import { ExpensePieChart } from '../components/dashboard/ExpensePieChart';
import { MonthlyTrendBars } from '../components/dashboard/MonthlyTrendBars';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { TransactionsList } from '../components/dashboard/TransactionsList';
import { useDashboardPageData } from '../hooks/useDashboardPageData';

export default function DashboardPage() {
  const router = useRouter();
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const goLogin = useCallback(() => {
    router.replace('/login');
  }, [router]);

  const { authChecking, data, error, load, loading, logout } = useDashboardPageData(goLogin);

  async function handleLogout() {
    await logout();
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
                onLogout={handleLogout}
                onUnauthorized={goLogin}
              />
            </aside>

            <div className="lg:order-1 space-y-6 min-w-0">
              {authChecking ? (
                <AuthCheckingPanel />
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

                  <AccountsSection accounts={data?.accounts} loading={loading} />
                  <BudgetsSection budgets={data?.budgets} loading={loading} />

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
