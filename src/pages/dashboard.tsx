import { useCallback, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuthCheckingPanel, ErrorPanel } from '../components/dashboard/DashboardSections';
import { MesaSidebar, type DashboardView } from '../components/dashboard/mesa/MesaSidebar';
import { MesaHeader } from '../components/dashboard/mesa/MesaHeader';
import { MesaMetrics, type MesaMetric } from '../components/dashboard/mesa/MesaMetrics';
import { MesaAgenda } from '../components/dashboard/mesa/MesaAgenda';
import { MesaBookings } from '../components/dashboard/mesa/MesaBookings';
import { MesaCorkBoard } from '../components/dashboard/mesa/MesaCorkBoard';
import { MesaFinance } from '../components/dashboard/mesa/MesaFinance';
import { MesaDeskProps } from '../components/dashboard/mesa/MesaDeskProps';
import { MesaAgendaView } from '../components/dashboard/mesa/MesaAgendaView';
import { MesaFinanzasView } from '../components/dashboard/mesa/MesaFinanzasView';
import { MesaAjustesView } from '../components/dashboard/mesa/MesaAjustesView';
import { fmt } from '../components/dashboard/format';
import { useDashboardPageData } from '../hooks/useDashboardPageData';

const DESK_BG =
  "radial-gradient(140% 110% at 50% -10%, rgba(255,253,246,.65), rgba(220,210,186,0) 50%)," +
  "radial-gradient(130% 120% at 50% 125%, rgba(120,105,75,.18), rgba(120,105,75,0) 55%)," +
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")";

function greetingForHour(hour: number): string {
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

function isToday(iso: string, now: Date): boolean {
  const d = new Date(iso);
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<DashboardView>('inicio');

  const goLogin = useCallback(() => {
    router.replace('/login');
  }, [router]);

  const { appointments, authChecking, data, error, load, logout } =
    useDashboardPageData(goLogin);

  const handleLogout = useCallback(async () => {
    await logout();
    router.push('/login');
  }, [logout, router]);

  const now      = useMemo(() => new Date(), []);
  const currency = data?.currency || 'Bs';

  const dateLabel = useMemo(
    () =>
      now.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    [now],
  );
  const dayNumber = String(now.getDate());
  const monthLabel = useMemo(
    () => now.toLocaleDateString('es-ES', { weekday: 'long', month: 'long' }),
    [now],
  );

  const todays = useMemo(
    () =>
      appointments
        .filter(a => isToday(a.starts_at, now))
        .sort((a, b) => a.starts_at.localeCompare(b.starts_at)),
    [appointments, now],
  );

  const scheduledToday = todays.filter(a => a.status === 'scheduled').length;

  const metrics: MesaMetric[] = useMemo(
    () => [
      {
        label: 'Ingresos del mes',
        value: `${currency} ${fmt(data?.month.income)}`,
        hint: data?.month_label || '',
        hintColor: '#547552',
        rotation: -0.6,
      },
      {
        label: 'Citas hoy',
        value: String(todays.length),
        hint: `${scheduledToday} programadas`,
        hintColor: '#C48B1E',
        rotation: 0.5,
      },
      {
        label: 'Neto del mes',
        value: `${currency} ${fmt(data?.month.net)}`,
        hint: `Ahorro ${data ? Math.round(data.month.savings_rate * 100) : 0}%`,
        hintColor: '#9a824a',
        valueColor: '#C94E2C',
        rotation: -0.3,
      },
    ],
    [currency, data, todays.length, scheduledToday],
  );

  const subtitle = `${todays.length} citas hoy · ${scheduledToday} programadas · ${currency} ${fmt(
    data?.month.expense,
  )} en gastos`;

  return (
    <>
      <Head>
        <title>AsistPro — Escritorio</title>
        <meta name="robots" content="noindex" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;500&family=Dancing+Script:wght@600;700&family=Caveat:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div
        style={{
          position: 'relative',
          minHeight: '100vh',
          padding: '30px 40px 70px',
          overflow: 'hidden',
          fontFamily: "'DM Sans',system-ui,sans-serif",
          color: '#1A1816',
          backgroundColor: '#E4DCC8',
          backgroundImage: DESK_BG,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 30,
            maxWidth: 1500,
            margin: '0 auto',
            alignItems: 'flex-start',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <MesaSidebar
            userName="Mi cuenta"
            userRole="Plan Pro · WhatsApp"
            activeView={activeView}
            onNavigate={view => {
              setActiveView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLogout={handleLogout}
          />

          <main style={{ flex: 1, minWidth: 0 }}>

            {/* ── INICIO ── */}
            {activeView === 'inicio' && (
              <>
                <MesaHeader
                  dateLabel={dateLabel}
                  greeting={greetingForHour(now.getHours())}
                  subtitle={subtitle}
                  onReminder={() => setActiveView('agenda')}
                />

                {authChecking ? (
                  <div style={{ marginTop: 26 }}><AuthCheckingPanel /></div>
                ) : error ? (
                  <div style={{ marginTop: 26 }}><ErrorPanel onRetry={load} /></div>
                ) : (
                  <>
                    <MesaMetrics metrics={metrics} />
                    <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', marginTop: 26, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1.5, minWidth: 340, display: 'flex', flexDirection: 'column', gap: 30 }}>
                        <MesaAgenda dayNumber={dayNumber} monthLabel={monthLabel} appointments={todays} />
                        <MesaBookings transactions={data?.recent_transactions || []} currency={currency} />
                      </div>
                      <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 34 }}>
                        <MesaCorkBoard />
                        <MesaFinance
                          monthLabel={data?.month_label || ''}
                          income={data?.month.income || '0'}
                          expense={data?.month.expense || '0'}
                          net={data?.month.net || '0'}
                          currency={currency}
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* ── AGENDA ── */}
            {activeView === 'agenda' && (
              authChecking ? (
                <div style={{ marginTop: 26 }}><AuthCheckingPanel /></div>
              ) : error ? (
                <div style={{ marginTop: 26 }}><ErrorPanel onRetry={load} /></div>
              ) : (
                <MesaAgendaView appointments={appointments} now={now} />
              )
            )}

            {/* ── FINANZAS ── */}
            {activeView === 'finanzas' && (
              authChecking ? (
                <div style={{ marginTop: 26 }}><AuthCheckingPanel /></div>
              ) : error ? (
                <div style={{ marginTop: 26 }}><ErrorPanel onRetry={load} /></div>
              ) : data ? (
                <MesaFinanzasView data={data} currency={currency} appointments={appointments} />
              ) : null
            )}

            {/* ── AJUSTES ── */}
            {activeView === 'ajustes' && (
              <MesaAjustesView
                currentCurrency={currency}
                onSaved={load}
                onUnauthorized={goLogin}
              />
            )}

          </main>
        </div>

        <MesaDeskProps />
      </div>
    </>
  );
}
