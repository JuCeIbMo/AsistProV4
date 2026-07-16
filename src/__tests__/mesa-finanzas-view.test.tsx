import { render, screen } from '@testing-library/react';
import { MesaFinanzasView } from '../components/dashboard/mesa/MesaFinanzasView';
import { MesaFinance } from '../components/dashboard/mesa/MesaFinance';
import type { DashboardSummary } from '../services/dashboardService';

vi.mock('../hooks/useMobile', () => ({
  useMobile: () => false,
}));

const summary: DashboardSummary = {
  currency: 'BOB',
  total_balance: '15430.00',
  month_label: 'Junio 2026',
  accounts: [{ id: 'acc-1', name: 'Efectivo', currency: 'BOB', balance: '15430.00', is_default: true }],
  month: { income: '12000.00', expense: '9430.00', net: '2570.00', savings_rate: 21.4 },
  today: { income: '800.00', expense: '230.00', event_count: 2 },
  pending_items: [],
  budgets: [],
  expense_categories: [
    { slug: 'food', display_name: 'Comida', amount: '400.00', share: 42.4, previous_amount: null, change_pct: null },
  ],
  monthly_trend: [
    { label: 'May 26', year: 2026, month: 5, income: '10000.00', expense: '8000.00', net: '2000.00' },
    { label: 'Jun 26', year: 2026, month: 6, income: '12000.00', expense: '9430.00', net: '2570.00' },
  ],
  recent_transactions: [],
};

describe('MesaFinanzasView', () => {
  it('keeps confirmations out of finance view', () => {
    render(<MesaFinanzasView data={summary} currency="BOB" />);

    expect(screen.queryByText('Citas por confirmar')).not.toBeInTheDocument();
    expect(screen.getByText('Finanzas')).toBeInTheDocument();
  });

  it('renders backend percentages as-is, without doubling them', () => {
    render(<MesaFinanzasView data={summary} currency="BOB" />);

    // savings_rate: 21.4 (ya en escala 0-100) -> "ahorro 21%", nunca "2140%"
    expect(screen.getByText('ahorro 21%')).toBeInTheDocument();
    // share: 42.4 (ya en escala 0-100) -> "42%", nunca "4240%"
    expect(screen.getByText('42%')).toBeInTheDocument();
  });

  it('renders currency with quieter typography in finance surfaces', () => {
    const { container } = render(<MesaFinance monthLabel="Junio 2026" income="12000.00" expense="9430.00" net="2570.00" currency="BOB" />);

    const currencyTokens = container.querySelectorAll('[data-currency-token="true"]');
    expect(currencyTokens.length).toBeGreaterThan(0);
    currencyTokens.forEach(token => {
      expect(token).toHaveStyle({ fontSize: '0.62em' });
    });
  });
});
