import { render, screen } from '@testing-library/react';
import { MesaAgenda } from '../components/dashboard/mesa/MesaAgenda';
import { MesaBookings } from '../components/dashboard/mesa/MesaBookings';
import { MesaMetrics, type MesaMetric } from '../components/dashboard/mesa/MesaMetrics';

vi.mock('../hooks/useMobile', () => ({
  useMobile: () => true,
}));

describe('Mesa home mobile layout', () => {
  it('renders money metrics as full-width cards on mobile', () => {
    const metrics: MesaMetric[] = [
      {
        kind: 'split',
        label: 'Ingresos y gastos del mes',
        value: '2000,00',
        secondaryLabel: 'Gastos',
        secondaryValue: '599,50',
        hint: 'Junio 2026',
        hintColor: '#547552',
        rotation: 0,
        currency: 'BOB',
      },
      {
        label: 'Gastado hoy',
        value: '18,00',
        hint: 'Solo gastos del día',
        hintColor: '#9a824a',
        rotation: 0,
        currency: 'BOB',
      },
    ];

    render(<MesaMetrics metrics={metrics} />);

    expect(screen.getByText('Ingresos y gastos del mes').closest('.mesa-lift')).toHaveStyle({
      minWidth: '100%',
      transform: 'none',
    });
    expect(screen.getByText('Gastado hoy').closest('.mesa-lift')).toHaveStyle({ minWidth: '100%' });
  });

  it('keeps agenda rows compact on mobile', () => {
    render(
      <MesaAgenda
        dayNumber="26"
        monthLabel="viernes, junio"
        appointments={[
          {
            id: 'appt-1',
            title: 'Consulta',
            description: 'Control de seguimiento',
            category: null,
            starts_at: '2026-06-26T14:00:00.000Z',
            ends_at: '2026-06-26T14:30:00.000Z',
            location: 'WhatsApp',
            with_person: 'Paciente con nombre largo',
            status: 'scheduled',
            reminder_minutes: 30,
            raw_input: null,
          },
        ]}
      />,
    );

    expect(screen.getByText('Agenda de hoy')).toBeInTheDocument();
    expect(screen.queryByText('Hoy')).not.toBeInTheDocument();
    expect(screen.getByText('Programada')).toHaveStyle({ padding: '2px 8px' });
  });

  it('moves the recent amount below the description on mobile', () => {
    render(
      <MesaBookings
        currency="BOB"
        transactions={[
          {
            id: 'tx-1',
            direction: 'expense',
            amount: '130.00',
            currency: 'BOB',
            category: 'Comida',
            description: 'Compra de supermercado extensa',
            occurred_at: '2026-06-26T12:00:00.000Z',
          },
        ]}
      />,
    );

    expect(screen.getByText('Movimientos recientes')).toBeInTheDocument();
    expect(screen.getByText(/−\s*BOB\s*130,00/)).toHaveStyle({ width: '100%', textAlign: 'right' });
  });
});
