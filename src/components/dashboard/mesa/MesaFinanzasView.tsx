import { type CSSProperties, useMemo } from 'react';
import type { DashboardSummary } from '../../../services/dashboardService';
import { fmt } from '../format';
import { useMobile } from '../../../hooks/useMobile';
import { MesaBudgets } from './MesaBudgets';

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
  amount: string;
  hint: string;
  hintColor: string;
  valueColor?: string;
  rotation: number;
  dark?: boolean;
}

interface MesaFinanzasViewProps {
  data: DashboardSummary;
  currency: string;
}

function MoneyValue({
  currency,
  amount,
  color,
  size,
}: {
  currency: string;
  amount: string;
  color: string;
  size: number;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 8,
        color,
        minWidth: 0,
      }}
    >
      <span
        data-currency-token="true"
        style={{
          ...mono,
          fontSize: '0.62em',
          letterSpacing: '.08em',
          opacity: 0.82,
          flexShrink: 0,
        }}
      >
        {currency}
      </span>
      <span
        style={{
          fontFamily: "'Playfair Display',serif",
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.1,
          minWidth: 0,
          wordBreak: 'break-word',
        }}
      >
        {fmt(amount)}
      </span>
    </span>
  );
}

export function MesaFinanzasView({ data, currency }: MesaFinanzasViewProps) {
  const isMobile = useMobile();

  const chartData = useMemo(() => {
    const trend = data.monthly_trend || [];
    return trend.slice(-6);
  }, [data.monthly_trend]);

  const maxFlow = useMemo(() => {
    const vals = chartData.flatMap(d => [parseFloat(d.income) || 0, parseFloat(d.expense) || 0]);
    return Math.max(...vals, 1);
  }, [chartData]);

  const kpis: KpiStub[] = [
    {
      label: 'Ingresos',
      amount: data.month.income,
      hint: data.month_label,
      hintColor: '#547552',
      rotation: -0.5,
    },
    {
      label: 'Gastos',
      amount: data.month.expense,
      hint: `${data.month_label}`,
      hintColor: '#C94E2C',
      valueColor: '#C94E2C',
      rotation: 0.4,
    },
    {
      label: 'Balance total',
      amount: data.total_balance,
      hint: `${data.accounts.length} cuenta${data.accounts.length === 1 ? '' : 's'}`,
      hintColor: '#9a824a',
      rotation: -0.3,
    },
    {
      label: 'Neto del mes',
      amount: data.month.net,
      hint: `ahorro ${Math.round(data.month.savings_rate)}%`,
      hintColor: '#9cb89a',
      rotation: 0.5,
      dark: true,
    },
  ];

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
            <div style={{ marginTop: 6 }}>
              <MoneyValue
                currency={currency}
                amount={k.amount}
                color={k.dark ? '#F5F1E8' : (k.valueColor || '#221f1b')}
                size={isMobile ? 22 : 30}
              />
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
              Ingresos y gastos · últimos {chartData.length} meses
            </div>
            {chartData.length === 0 ? (
              <div style={{ ...mono, fontSize: 13, color: '#A8997A', textAlign: 'center', paddingTop: 40 }}>Sin datos de tendencia aún.</div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: isMobile ? 8 : 14, height: isMobile ? 140 : 200, paddingTop: 18, borderBottom: '2px solid #1A1816' }}>
                  {chartData.map((d, i) => {
                    const incomeVal  = parseFloat(d.income) || 0;
                    const expenseVal = parseFloat(d.expense) || 0;
                    const incomeH    = Math.round((incomeVal / maxFlow) * (isMobile ? 120 : 180));
                    const expenseH   = Math.round((expenseVal / maxFlow) * (isMobile ? 120 : 180));
                    const isLast     = i === chartData.length - 1;
                    return (
                      <div key={`${d.year}-${d.month}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 4, height: '100%' }}>
                        {!isMobile && (
                          <div style={{ ...mono, fontSize: 10, color: isLast ? '#C94E2C' : '#7a6e55', fontWeight: isLast ? 500 : 400, textAlign: 'center' }}>
                            {fmt(String(incomeVal))}
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3 }}>
                          <div style={{ width: isMobile ? 14 : 20, height: incomeH, background: isLast ? 'linear-gradient(#8bc47d,#547552)' : 'linear-gradient(#7ba06d,#547552)', borderRadius: '3px 3px 0 0', boxShadow: 'inset 0 2px 0 rgba(255,255,255,.25), 0 4px 10px rgba(70,55,28,.16)' }} title="Ingresos" />
                          <div style={{ width: isMobile ? 14 : 20, height: expenseH, background: isLast ? 'linear-gradient(#E0673F,#C94E2C)' : 'linear-gradient(#d9855f,#C94E2C)', borderRadius: '3px 3px 0 0', boxShadow: 'inset 0 2px 0 rgba(255,255,255,.25), 0 4px 10px rgba(70,55,28,.16)' }} title="Gastos" />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 6, ...mono, fontSize: 9.5, color: '#7a6e55' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: '#547552' }} />Ingresos</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: '#C94E2C' }} />Gastos</span>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 12, color: '#5c5648', padding: '5px 0' }}>
                <span>Ingresos</span>
                <MoneyValue currency={currency} amount={data.month.income} color="#221f1b" size={16} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 12, color: '#5c5648', padding: '5px 0', borderBottom: '1.5px dashed #cfc4a4', paddingBottom: 10, marginBottom: 8 }}>
                <span>Gastos</span>
                <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6, color: '#C94E2C' }}>
                  <span aria-hidden="true">−</span>
                  <MoneyValue currency={currency} amount={data.month.expense} color="#C94E2C" size={16} />
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '4px 0 12px' }}>
                <span style={{ fontSize: 11, letterSpacing: '.1em', color: '#221f1b' }}>NETO</span>
                <MoneyValue currency={currency} amount={data.month.net} color="#547552" size={26} />
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
                      <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
                        {cat.change_pct !== null && (
                          <span style={{ fontSize: 10, color: cat.change_pct > 0 ? '#C94E2C' : cat.change_pct < 0 ? '#547552' : '#9a824a' }}>
                            {cat.change_pct > 0 ? '↑' : cat.change_pct < 0 ? '↓' : '='}
                            {Math.abs(Math.round(cat.change_pct))}%
                          </span>
                        )}
                        <span style={{ color: '#221f1b' }}>{Math.round(cat.share)}%</span>
                      </span>
                    </div>
                    <div style={{ height: 9, borderRadius: 100, background: '#ECE4D0', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.round((cat.share / maxShare) * 100)}%`, height: '100%', background: catColors[i % catColors.length], borderRadius: 100 }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <MesaBudgets budgets={data.budgets || []} currency={currency} />

        </div>
      </div>
    </section>
  );
}
