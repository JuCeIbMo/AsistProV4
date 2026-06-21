import { type CSSProperties, useMemo } from 'react';
import type { Appointment, DashboardSummary } from '../../../services/dashboardService';
import { fmt } from '../format';
import { useMobile } from '../../../hooks/useMobile';

const mono: CSSProperties = { fontFamily: "'JetBrains Mono',monospace" };

const MONTH_SHORT = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

function TicketHole({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        [side]: -7,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: '#E4DCC8',
      }}
    />
  );
}

interface KpiStub {
  label: string;
  value: string;
  hint: string;
  hintColor: string;
  valueColor?: string;
  rotation: number;
  dark?: boolean;
}

interface MesaFinanzasViewProps {
  data: DashboardSummary;
  currency: string;
  appointments: Appointment[];
}

export function MesaFinanzasView({ data, currency, appointments }: MesaFinanzasViewProps) {
  const isMobile = useMobile();

  const chartData = useMemo(() => {
    const trend = data.monthly_trend || [];
    return trend.slice(-6);
  }, [data.monthly_trend]);

  const maxIncome = useMemo(() => {
    const vals = chartData.map(d => parseFloat(d.income) || 0);
    return Math.max(...vals, 1);
  }, [chartData]);

  const kpis: KpiStub[] = [
    {
      label: 'Cobrado',
      value: `${currency} ${fmt(data.month.income)}`,
      hint: data.month_label,
      hintColor: '#547552',
      rotation: -0.5,
    },
    {
      label: 'Gastos',
      value: `${currency} ${fmt(data.month.expense)}`,
      hint: `${data.month_label}`,
      hintColor: '#C94E2C',
      valueColor: '#C94E2C',
      rotation: 0.4,
    },
    {
      label: 'Balance total',
      value: `${currency} ${fmt(data.total_balance)}`,
      hint: `${data.accounts.length} cuenta${data.accounts.length === 1 ? '' : 's'}`,
      hintColor: '#9a824a',
      rotation: -0.3,
    },
    {
      label: 'Neto del mes',
      value: `${currency} ${fmt(data.month.net)}`,
      hint: `ahorro ${Math.round(data.month.savings_rate * 100)}%`,
      hintColor: '#9cb89a',
      rotation: 0.5,
      dark: true,
    },
  ];

  const pendingAppts = useMemo(() =>
    appointments
      .filter(a => a.status === 'scheduled')
      .slice(0, 5),
    [appointments],
  );

  const categories = data.expense_categories || [];
  const maxShare   = Math.max(...categories.map(c => c.share), 0.01);
  const catColors  = ['#547552', '#6652B5', '#C48B1E', '#C94E2C', '#9a824a'];

  return (
    <section>
      {/* HEADER */}
      <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...mono, fontSize: 11, letterSpacing: '.14em', color: '#8a7c5e', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ display: 'block', width: 18, height: 1, background: '#547552', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Resumen de caja · {data.month_label}</span>
          </div>
          <h1 style={{ fontFamily: "'Dancing Script',cursive", fontWeight: 700, fontSize: isMobile ? 38 : 52, lineHeight: 1.05, margin: '4px 0 10px', color: '#221f1b' }}>
            Finanzas
          </h1>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6B6560', margin: 0 }}>
            {currency} {fmt(data.month.net)} neto · {currency} {fmt(data.month.income)} cobrado
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="mesa-btn-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: isMobile ? '9px 14px' : '10px 18px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, background: '#C94E2C', color: '#fff', boxShadow: '0 6px 16px rgba(201,78,44,.3)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7bdc8a', boxShadow: '0 0 0 3px rgba(123,220,138,.35)' }} /> Cobrar
          </button>
          {!isMobile && (
            <button className="mesa-btn-ghost" style={{ padding: '10px 16px', borderRadius: 9, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, background: 'rgba(255,253,246,.7)', color: '#1A1816', border: '1.5px solid rgba(168,153,122,.6)' }}>
              Exportar
            </button>
          )}
        </div>
      </header>

      {/* KPI STUBS */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
        {kpis.map((k) => (
          <div
            key={k.label}
            className="mesa-lift"
            style={{
              position: 'relative',
              flex: 1,
              minWidth: isMobile ? 'calc(50% - 7px)' : 160,
              background: k.dark ? '#1A1816' : '#FCFAF2',
              borderRadius: 7,
              padding: isMobile ? '12px 14px' : '16px 20px',
              boxShadow: '0 10px 22px rgba(70,55,28,.13)',
              transform: `rotate(${k.rotation}deg)`,
              overflow: 'hidden',
            }}
          >
            <TicketHole side="left" />
            <TicketHole side="right" />
            <div style={{ ...mono, fontSize: 9.5, letterSpacing: '.14em', color: k.dark ? '#C9A86A' : '#9a824a', textTransform: 'uppercase' }}>{k.label}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: isMobile ? 22 : 30, lineHeight: 1.1, color: k.dark ? '#F5F1E8' : (k.valueColor || '#221f1b') }}>
              {k.value}
            </div>
            <div style={{ ...mono, fontSize: 10, color: k.hintColor, marginTop: 2 }}>{k.hint}</div>
          </div>
        ))}
      </div>

      {/* TWO COLUMN */}
      <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* LEFT */}
        <div style={{ flex: 1.7, minWidth: isMobile ? '100%' : 360, display: 'flex', flexDirection: 'column', gap: 30 }}>

          {/* BAR CHART */}
          <section style={{ position: 'relative', borderRadius: 8, padding: isMobile ? '22px 14px 16px' : '24px 26px 20px', background: '#FBF8EC', backgroundImage: 'repeating-linear-gradient(0deg,rgba(102,82,181,.09) 0 1px,transparent 1px 22px),repeating-linear-gradient(90deg,rgba(102,82,181,.09) 0 1px,transparent 1px 22px)', backgroundSize: '22px 22px', boxShadow: '0 16px 34px rgba(70,55,28,.16), inset 0 1px 0 rgba(255,255,255,.6)', border: '1px solid #E6DCC2' }}>
            <div style={{ position: 'absolute', top: -12, left: 20, background: '#1A1816', color: '#F5F1E8', ...mono, fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 4, transform: 'rotate(-1.5deg)', boxShadow: '0 5px 12px rgba(0,0,0,.28)' }}>
              Ingresos · últimos {chartData.length} meses
            </div>
            {chartData.length === 0 ? (
              <div style={{ ...mono, fontSize: 13, color: '#A8997A', textAlign: 'center', paddingTop: 40 }}>Sin datos de tendencia aún.</div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: isMobile ? 8 : 14, height: isMobile ? 140 : 200, paddingTop: 18, borderBottom: '2px solid #1A1816' }}>
                  {chartData.map((d, i) => {
                    const val    = parseFloat(d.income) || 0;
                    const h      = Math.round((val / maxIncome) * (isMobile ? 120 : 180));
                    const isLast = i === chartData.length - 1;
                    return (
                      <div key={`${d.year}-${d.month}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 4, height: '100%' }}>
                        {!isMobile && <div style={{ ...mono, fontSize: 11, color: isLast ? '#C94E2C' : '#7a6e55', fontWeight: isLast ? 500 : 400 }}>{fmt(String(val))}</div>}
                        <div style={{ width: '100%', maxWidth: isMobile ? 32 : 46, height: h, background: isLast ? 'linear-gradient(#E0673F,#C94E2C)' : 'linear-gradient(#7ba06d,#547552)', borderRadius: '3px 3px 0 0', boxShadow: isLast ? 'inset 0 2px 0 rgba(255,255,255,.3), 0 6px 14px rgba(201,78,44,.28)' : 'inset 0 2px 0 rgba(255,255,255,.25), 0 4px 10px rgba(70,55,28,.16)' }} />
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: isMobile ? 8 : 14, marginTop: 9, ...mono, fontSize: 10, color: '#9a824a', textAlign: 'center' }}>
                  {chartData.map((d, i) => {
                    const isLast = i === chartData.length - 1;
                    return (
                      <div key={`${d.year}-${d.month}`} style={{ flex: 1, color: isLast ? '#C94E2C' : '#9a824a', fontWeight: isLast ? 500 : 400 }}>
                        {MONTH_SHORT[d.month - 1]}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </section>

          {/* PENDING APPOINTMENTS */}
          <section style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 400, fontSize: 21, color: '#221f1b', margin: 0 }}>Citas por confirmar</h3>
              <span style={{ ...mono, fontSize: 10, color: '#C94E2C', background: '#FAE8E2', padding: '3px 9px', borderRadius: 100 }}>{pendingAppts.length} pendientes</span>
            </div>
            {pendingAppts.length === 0 ? (
              <div style={{ ...mono, fontSize: 13, color: '#A8997A', padding: '20px 0' }}>¡Todo al día! Sin citas pendientes.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pendingAppts.map((a, i) => {
                  const person  = a.with_person || a.title;
                  const cat     = a.category?.display_name || '';
                  const dateStr = new Date(a.starts_at).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
                  const rots    = [-0.3, 0.3, -0.2, 0.2, -0.1];
                  return (
                    <div
                      key={a.id}
                      className="mesa-lift"
                      style={{ background: '#FBF6E6', padding: '12px 16px', borderRadius: 6, boxShadow: '0 8px 18px rgba(70,55,28,.12)', borderLeft: '4px solid #C94E2C', display: 'flex', alignItems: 'center', gap: 12, transform: `rotate(${rots[i] ?? 0}deg)` }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#221f1b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{person}</div>
                        <div style={{ ...mono, fontSize: 11, color: '#A8997A' }}>{cat ? `${cat} · ` : ''}{dateStr}</div>
                      </div>
                      <button style={{ ...mono, fontSize: 11, border: 'none', color: '#fff', background: '#C94E2C', borderRadius: 6, padding: '6px 11px', cursor: 'pointer', flexShrink: 0 }}>
                        Recordar
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </div>

        {/* RIGHT */}
        <div style={{ flex: 1, minWidth: isMobile ? '100%' : 280, display: 'flex', flexDirection: 'column', gap: 34 }}>

          {/* RECEIPT ROLL */}
          <section style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: isMobile ? 'center' : 'flex-start' }}>
            {!isMobile && (
              <div className="mesa-vinyl" aria-hidden="true" style={{ position: 'absolute', right: -22, bottom: 8, width: 130, height: 130, borderRadius: '50%', background: 'radial-gradient(circle,#547552 0 16px,#1c1a18 16px 18px,#262320 18px 28px,#1c1a18 28px 30px,#2a2724 30px 42px,#1c1a18 42px 44px,#2a2724 44px 56px,#161412 56px 58px,#242120 58px 66px)', boxShadow: '0 14px 30px rgba(0,0,0,.32)', zIndex: 0, cursor: 'pointer' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: 5, height: 5, borderRadius: '50%', background: '#0a0908', transform: 'translate(-50%,-50%)' }} />
              </div>
            )}
            <div className="mesa-lift" style={{ position: 'relative', zIndex: 2, width: isMobile ? '100%' : 262, maxWidth: 320, background: '#FFFDF7', padding: '18px 22px 34px', boxShadow: '0 14px 30px rgba(70,55,28,.2)', transform: 'rotate(-.7deg)', clipPath: 'polygon(0 0,100% 0,100% 93%,95% 100%,90% 93%,85% 100%,80% 93%,75% 100%,70% 93%,65% 100%,60% 93%,55% 100%,50% 93%,45% 100%,40% 93%,35% 100%,30% 93%,25% 100%,20% 93%,15% 100%,10% 93%,5% 100%,0 93%)', ...mono, color: '#2a2722' }}>
              <div style={{ textAlign: 'center', borderBottom: '1.5px dashed #cfc4a4', paddingBottom: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 12, letterSpacing: '.22em', color: '#221f1b' }}>★ MESA ★</div>
                <div style={{ fontSize: 9.5, letterSpacing: '.12em', color: '#9a824a', marginTop: 3, textTransform: 'uppercase' }}>CAJA — {data.month_label}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#5c5648', padding: '5px 0' }}><span>Cobrado</span><span style={{ color: '#221f1b' }}>{currency} {fmt(data.month.income)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#5c5648', padding: '5px 0', borderBottom: '1.5px dashed #cfc4a4', paddingBottom: 10, marginBottom: 8 }}><span>Gastos</span><span style={{ color: '#C94E2C' }}>− {currency} {fmt(data.month.expense)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '4px 0 12px' }}>
                <span style={{ fontSize: 11, letterSpacing: '.1em', color: '#221f1b' }}>NETO</span>
                <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 26, color: '#547552' }}>{currency} {fmt(data.month.net)}</span>
              </div>
              <div style={{ height: 34, borderRadius: 1, background: 'repeating-linear-gradient(90deg,#1A1816 0 2px,#FFFDF7 2px 3px,#1A1816 3px 6px,#FFFDF7 6px 9px,#1A1816 9px 11px,#FFFDF7 11px 13px,#1A1816 13px 14px,#FFFDF7 14px 17px)' }} />
              <div style={{ textAlign: 'center', fontSize: 8.5, letterSpacing: '.14em', color: '#9a824a', marginTop: 8 }}>GRACIAS · ASISTPRO</div>
            </div>
          </section>

          {/* CATEGORY BREAKDOWN */}
          {categories.length > 0 && (
            <section className="mesa-card" style={{ background: '#FCFAF2', borderRadius: 8, padding: 20, boxShadow: '0 14px 30px rgba(70,55,28,.16)', transform: 'rotate(.4deg)' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: '#221f1b', marginBottom: 16 }}>Gastos por categoría</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {categories.slice(0, 5).map((cat, i) => (
                  <div key={cat.slug || cat.display_name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', ...mono, fontSize: 11.5, color: '#5c5648', marginBottom: 5 }}>
                      <span>{cat.display_name}</span>
                      <span style={{ color: '#221f1b' }}>{Math.round(cat.share * 100)}%</span>
                    </div>
                    <div style={{ height: 9, borderRadius: 100, background: '#ECE4D0', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.round((cat.share / maxShare) * 100)}%`, height: '100%', background: catColors[i % catColors.length], borderRadius: 100 }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </section>
  );
}
