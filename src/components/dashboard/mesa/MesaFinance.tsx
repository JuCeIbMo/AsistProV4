import type { CSSProperties } from 'react';
import { fmt } from '../format';

const mono: CSSProperties = { fontFamily: "'JetBrains Mono',monospace" };

interface MesaFinanceProps {
  monthLabel: string;
  income: string;
  expense: string;
  net: string;
  currency: string;
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#5c5648', padding: '5px 0' }}>
      <span>{label}</span>
      <span style={{ color: color || '#221f1b' }}>{value}</span>
    </div>
  );
}

export function MesaFinance({ monthLabel, income, expense, net, currency }: MesaFinanceProps) {
  return (
    <section style={{ position: 'relative', display: 'flex', alignItems: 'flex-start' }}>
      {/* disco de vinilo decorativo */}
      <div
        className="mesa-vinyl"
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: -22,
          bottom: 8,
          width: 140,
          height: 140,
          borderRadius: '50%',
          background:
            'radial-gradient(circle,#C94E2C 0 17px,#1c1a18 17px 19px,#262320 19px 30px,#1c1a18 30px 32px,#2a2724 32px 44px,#1c1a18 44px 46px,#2a2724 46px 58px,#161412 58px 60px,#242120 60px 70px)',
          boxShadow: '0 14px 30px rgba(0,0,0,.32)',
          zIndex: 0,
          cursor: 'pointer',
        }}
      >
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 5, height: 5, borderRadius: '50%', background: '#0a0908', transform: 'translate(-50%,-50%)' }} />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: 262,
          background: '#FFFDF7',
          padding: '18px 22px 34px',
          boxShadow: '0 14px 30px rgba(70,55,28,.2)',
          transform: 'rotate(.7deg)',
          clipPath:
            'polygon(0 0,100% 0,100% 93%,95% 100%,90% 93%,85% 100%,80% 93%,75% 100%,70% 93%,65% 100%,60% 93%,55% 100%,50% 93%,45% 100%,40% 93%,35% 100%,30% 93%,25% 100%,20% 93%,15% 100%,10% 93%,5% 100%,0 93%)',
          ...mono,
          color: '#2a2722',
        }}
      >
        <div style={{ textAlign: 'center', borderBottom: '1.5px dashed #cfc4a4', paddingBottom: 10, marginBottom: 12 }}>
          <div style={{ fontSize: 12, letterSpacing: '.22em', color: '#221f1b' }}>★ MESA ★</div>
          <div style={{ fontSize: 9.5, letterSpacing: '.12em', color: '#9a824a', marginTop: 3, textTransform: 'uppercase' }}>
            Caja — {monthLabel}
          </div>
        </div>
        <Row label="Ingresos" value={`${currency} ${fmt(income)}`} />
        <Row label="Gastos" value={`− ${currency} ${fmt(expense)}`} color="#C94E2C" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '4px 0 12px', borderTop: '1.5px dashed #cfc4a4', marginTop: 8, paddingTop: 12 }}>
          <span style={{ fontSize: 11, letterSpacing: '.1em', color: '#221f1b' }}>NETO</span>
          <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 26, color: '#547552' }}>
            {currency} {fmt(net)}
          </span>
        </div>
        <div style={{ height: 34, borderRadius: 1, background: 'repeating-linear-gradient(90deg,#1A1816 0 2px,#FFFDF7 2px 3px,#1A1816 3px 6px,#FFFDF7 6px 9px,#1A1816 9px 11px,#FFFDF7 11px 13px,#1A1816 13px 14px,#FFFDF7 14px 17px)' }} />
        <div style={{ textAlign: 'center', fontSize: 8.5, letterSpacing: '.14em', color: '#9a824a', marginTop: 8 }}>
          GRACIAS · COBRADO POR WHATSAPP
        </div>
      </div>
    </section>
  );
}
