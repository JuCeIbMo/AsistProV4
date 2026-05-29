import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppointmentsList } from '../components/dashboard/AppointmentsList';
import * as dashboardService from '../services/dashboardService';
import type { Appointment } from '../services/dashboardService';

vi.mock('../services/dashboardService', async () => {
  const actual = await vi.importActual<typeof import('../services/dashboardService')>(
    '../services/dashboardService',
  );
  return {
    ...actual,
    fetchAppointments: vi.fn(),
    updateAppointmentStatus: vi.fn(),
  };
});

const mockAppointments: Appointment[] = [
  {
    id: 'ap-1',
    title: 'Cita médica',
    description: 'Chequeo general',
    category: {
      id: 'cat-1',
      kind: 'appointment',
      slug: 'medical',
      display_name: 'Médico',
      is_active: true,
      sort_order: 1,
    },
    starts_at: '2026-06-02T13:00:00Z',
    ends_at: '2026-06-02T13:45:00Z',
    location: 'Clínica',
    with_person: 'Dra. Pérez',
    status: 'scheduled',
    reminder_minutes: 60,
    raw_input: 'cita médica el martes',
  },
];

const mockedFetch = vi.mocked(dashboardService.fetchAppointments);
const mockedUpdate = vi.mocked(dashboardService.updateAppointmentStatus);

describe('AppointmentsList', () => {
  const user = userEvent.setup();
  const onUnauthorized = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the list after a successful fetch', async () => {
    mockedFetch.mockResolvedValue({ ok: true, data: { appointments: mockAppointments } });

    render(<AppointmentsList onUnauthorized={onUnauthorized} />);

    await waitFor(() => {
      expect(screen.getByText('Cita médica')).toBeInTheDocument();
    });
    expect(screen.getByText('Programada')).toBeInTheDocument();
  });

  it('shows the empty state when there are no appointments', async () => {
    mockedFetch.mockResolvedValue({ ok: true, data: { appointments: [] } });

    render(<AppointmentsList onUnauthorized={onUnauthorized} />);

    await waitFor(() => {
      expect(screen.getByText('Sin citas')).toBeInTheDocument();
    });
  });

  it('calls onUnauthorized when the fetch returns unauthorized', async () => {
    mockedFetch.mockResolvedValue({ ok: false, status: 'unauthorized' });

    render(<AppointmentsList onUnauthorized={onUnauthorized} />);

    await waitFor(() => {
      expect(onUnauthorized).toHaveBeenCalled();
    });
  });

  it('opens the detail panel and completes an appointment via the confirmation modal', async () => {
    mockedFetch.mockResolvedValue({ ok: true, data: { appointments: mockAppointments } });
    mockedUpdate.mockResolvedValue({
      ok: true,
      data: { appointment: { ...mockAppointments[0], status: 'completed' } },
    });

    render(<AppointmentsList onUnauthorized={onUnauthorized} />);

    await waitFor(() => {
      expect(screen.getByText('Cita médica')).toBeInTheDocument();
    });

    // Open detail
    const rows = screen.getAllByRole('button').filter((r) => r.className.includes('cursor-pointer'));
    await user.click(rows[0]);

    await waitFor(() => {
      expect(screen.getByText('Detalle de la cita')).toBeInTheDocument();
    });

    // Click "Completar" -> opens confirmation modal
    await user.click(screen.getByRole('button', { name: 'Completar' }));

    await waitFor(() => {
      expect(screen.getByText('¿Marcar esta cita como completada?')).toBeInTheDocument();
    });

    // Confirm
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));

    await waitFor(() => {
      expect(mockedUpdate).toHaveBeenCalledWith('ap-1', 'completed');
    });

    // Badge updates to "Completada" in the detail panel
    await waitFor(() => {
      expect(screen.getAllByText('Completada').length).toBeGreaterThan(0);
    });
  });
});
