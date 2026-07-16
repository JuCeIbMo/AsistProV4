import type { CSSProperties } from 'react';
import type { DashboardSummary } from '../../../services/dashboardService';
import { fmt } from '../format';

const mono: CSSProperties = { fontFamily: "'JetBrains Mono',monospace" };

function toneFor(threshold: string): { bar: string; text: string } {
  switch (threshold) {
    case 'over_limit':
      return { bar: '#C94E2C', text: '#C94E2C' };
    case 'warning':
      return { bar: '#C48B1E', text: '#9a824a' };
    default:
      return { bar: '#547552', text: '#547552' };
  }
}

interface MesaBudgetsProps {
  budgets: DashboardSummary['budgets'];
  currency: string;
}

export function MesaBudgets({ budgets, currency }: MesaBudgetsProps) {
  return (
    <section className="mesa-card" style={{ background: '#FCFAF2', borderRadius: 8, padding: 20, boxShadow: '0 14px 30px rgba(70,55,28,.16)', transform: 'rotate(-.3deg)' }}>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: '#221f1b', marginBottom: 16 }}>
        Presupuestos
      </div>

      {budgets.length === 0 ? (
        <div style={{ ...mono, fontSize: 12.5, color: '#8a7c5e', lineHeight: 1.6 }}>
          Sin presupuestos activos todavía. Pedile a tu asistente por WhatsApp que te cree uno
          para una categoría (ej. "ponme un presupuesto de 500 en comida").
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {budgets.map(budget => {
            const percentage = Math.min(parseFloat(budget.percentage_used), 100);
            const tone = toneFor(budget.threshold);
            return (
              <div key={budget.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', ...mono, fontSize: 11.5, color: '#5c5648', marginBottom: 5 }}>
                  <span>{budget.category.display_name}</span>
                  <span style={{ color: '#221f1b' }}>
                    {currency} {fmt(budget.spent_amount)} / {fmt(budget.limit_amount)}
                  </span>
                </div>
                <div style={{ height: 9, borderRadius: 100, background: '#ECE4D0', overflow: 'hidden' }}>
                  <div style={{ width: `${percentage}%`, height: '100%', background: tone.bar, borderRadius: 100 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, ...mono, fontSize: 10, color: '#9a824a' }}>
                  <span>{budget.period === 'monthly' ? 'Mensual' : 'Semanal'}</span>
                  <span style={{ color: tone.text, fontWeight: 600 }}>{budget.percentage_used}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
