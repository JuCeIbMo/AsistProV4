import { render, screen } from '@testing-library/react';
import { MesaAgenda } from '../components/dashboard/mesa/MesaAgenda';
import { MesaBookings } from '../components/dashboard/mesa/MesaBookings';

vi.mock('../hooks/useMobile', () => ({
  useMobile: () => true,
}));

describe('Mesa home mobile layout', () => {
  it('lets agenda rows wrap cleanly on mobile', () => {
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
    expect(screen.getByText('Programada')).toHaveStyle({ marginLeft: '59px' });
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
