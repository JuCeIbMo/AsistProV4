import { render, screen } from '@testing-library/react';
import DashboardPage from '../pages/dashboard';

vi.mock('next/head', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('next/router', () => ({
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
  }),
}));

vi.mock('../hooks/useMobile', () => ({
  useMobile: () => false,
}));

vi.mock('../hooks/useDashboardPageData', () => ({
  useDashboardPageData: () => ({
    appointments: [
      {
        id: 'appt-1',
        title: 'Control médico',
        description: null,
        category: {
          id: 'cat-1',
          kind: 'appointment',
          slug: 'medical',
          display_name: 'Médico',
          is_active: true,
          sort_order: 1,
        },
        starts_at: '2026-06-26T14:00:00.000Z',
        ends_at: '2026-06-26T14:30:00.000Z',
        location: null,
        with_person: 'Dr. Ruiz',
        status: 'scheduled',
        reminder_minutes: 30,
        raw_input: null,
      },
    ],
    authChecking: false,
    data: {
      currency: 'BOB',
      total_balance: '500.00',
      month_label: 'Junio 2026',
      accounts: [],
      month: {
        income: '1200.00',
        expense: '450.00',
        net: '750.00',
        savings_rate: 62.5,
      },
      today: {
        income: '80.00',
        expense: '35.00',
        event_count: 1,
      },
      pending_items: [
        {
          id: 'appt-1',
          title: 'Control médico',
          with_person: 'Dr. Ruiz',
          starts_at: '2026-06-26T14:00:00.000Z',
          status: 'scheduled',
          reminder_minutes: 30,
          note_kind: 'up_next',
        },
      ],
      budgets: [],
      expense_categories: [],
      monthly_trend: [],
      recent_transactions: [],
    },
    error: false,
    load: vi.fn(),
    loading: false,
    logout: vi.fn(),
  }),
}));

describe('DashboardPage', () => {
  it('shows the cleaned dashboard copy and removes placeholder modules', () => {
    render(<DashboardPage />);

    expect(screen.queryByText('Clientes')).not.toBeInTheDocument();
    expect(screen.queryByText('Mensajes')).not.toBeInTheDocument();
    expect(screen.getByText('Ingresos y gastos del mes')).toBeInTheDocument();
    expect(screen.getByText('Eventos de hoy')).toBeInTheDocument();
    expect(screen.getByText('Gastado hoy')).toBeInTheDocument();
  });
});
