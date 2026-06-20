import type { CSSProperties } from 'react';
import type { Transaction } from '../../../services/dashboardService';
import { fmt } from '../format';

const mono: CSSProperties = { fontFamily: "'JetBrains Mono',monospace" };
const TORN = 'polygon(0 5%,6% 0,13% 5%,20% 0,28% 5%,36% 0,44% 5%,52% 0,60% 5%,68% 0,76% 5%,84% 0,92% 5%,100% 0,100% 100%,0 100%)';
const PAPER = ['#FBF6E6', '#FBF7EA', '#FAF8EE'];
const ROT = [-0.5, 0.4, -0.3];

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.round(diffMs / 60000);
  if (min < 1) return 'recién';
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return `hace ${d} d`;
}

interface MesaBookingsProps {
  transactions: Transaction[];
  currency: string;
}

export function MesaBookings({ transactions, currency }: MesaBookingsProps) {
  const items = transactions.slice(0, 3);

  return (
    <section style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 400, fontSize: 21, color: '#221f1b', margin: 0 }}>
          Movimientos recientes
        </h3>
        <span style={{ ...mono, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#547552', background: '#E2EDDE', padding: '3px 9px', borderRadius: 100 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#547552', animation: 'om-pulse 2s ease-in-out infinite' }} />
          vía WhatsApp
        </span>
      </div>
      {/* clip sobre la pila */}
      <div aria-hidden="true" style={{ position: 'absolute', top: 36, left: 24, width: 16, height: 44, border: '2.5px solid #b3b6bd', borderRadius: 9, transform: 'rotate(-6deg)', zIndex: 5, boxShadow: '0 1px 2px rgba(0,0,0,.18)' }}>
        <div style={{ position: 'absolute', left: 2.5, top: 5, right: 2.5, bottom: 11, border: '2.5px solid #c9ccd2', borderRadius: 6 }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {items.length === 0 ? (
          <div style={{ ...mono, fontSize: 13, color: '#A8997A', padding: '20px 0 0 46px' }}>Sin movimientos recientes.</div>
        ) : (
          items.map((tx, i) => (
            <div
              key={tx.id}
              className="mesa-paper"
              style={{
                background: PAPER[i] || PAPER[2],
                padding: '14px 18px 14px 46px',
                boxShadow: '0 8px 18px rgba(70,55,28,.13)',
                transform: `rotate(${ROT[i] ?? 0}deg)`,
                clipPath: TORN,
                marginTop: i === 0 ? 0 : -8,
                position: 'relative',
                zIndex: items.length - i,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14.5, color: '#221f1b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {tx.description || tx.category || 'Movimiento'}
                </div>
                <div style={{ ...mono, fontSize: 11, color: '#A8997A' }}>
                  {(tx.category || (tx.direction === 'income' ? 'Ingreso' : 'Gasto'))} · {relativeTime(tx.occurred_at)}
                </div>
              </div>
              <div style={{ ...mono, fontSize: 13, color: tx.direction === 'income' ? '#547552' : '#C94E2C' }}>
                {tx.direction === 'income' ? '+' : '−'} {currency} {fmt(tx.amount)}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
