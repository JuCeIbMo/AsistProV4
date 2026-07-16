import { render, screen } from '@testing-library/react';
import { MesaBudgets } from '../components/dashboard/mesa/MesaBudgets';
import type { DashboardSummary } from '../services/dashboardService';

type Budget = DashboardSummary['budgets'][number];

function budget(overrides: Partial<Budget>): Budget {
  return {
    id: 'b-1',
    category: { display_name: 'Comida' },
    period: 'monthly',
    spent_amount: '100.00',
    limit_amount: '500.00',
    percentage_used: '20.0',
    threshold: 'ok',
    ...overrides,
  };
}

describe('MesaBudgets', () => {
  it('shows an actionable empty state when there are no active budgets', () => {
    render(<MesaBudgets budgets={[]} currency="BOB" />);

    expect(screen.getByText(/Sin presupuestos activos/)).toBeInTheDocument();
    expect(screen.getByText(/WhatsApp/)).toBeInTheDocument();
  });

  it('renders spent/limit and percentage for each budget without altering backend scale', () => {
    render(
      <MesaBudgets
        budgets={[
          budget({ id: 'b-ok', threshold: 'ok', percentage_used: '20.0' }),
          budget({ id: 'b-warn', threshold: 'warning', percentage_used: '85.0', category: { display_name: 'Ocio' } }),
          budget({ id: 'b-over', threshold: 'over_limit', percentage_used: '140.0', category: { display_name: 'Transporte' } }),
        ]}
        currency="BOB"
      />,
    );

    expect(screen.getByText('20.0%')).toBeInTheDocument();
    expect(screen.getByText('85.0%')).toBeInTheDocument();
    // over_limit percentages are clamped visually to 100% on the bar but the label keeps the real value.
    expect(screen.getByText('140.0%')).toBeInTheDocument();
  });
});
