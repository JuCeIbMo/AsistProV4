import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionsList } from '../components/dashboard/TransactionsList';
import * as dashboardService from '../services/dashboardService';
import type { Transaction } from '../services/dashboardService';

// Mock dashboardService
vi.mock('../services/dashboardService', async () => {
  const actual = await vi.importActual<typeof import('../services/dashboardService')>('../services/dashboardService');
  return {
    ...actual,
    fetchTransactionsPage: vi.fn(),
  };
});

const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    direction: 'income',
    amount: '1500.00',
    currency: 'BOB',
    description: 'Salario',
    category: 'Trabajo',
    occurred_at: '2024-05-15T10:00:00Z',
  },
  {
    id: 'tx-2',
    direction: 'expense',
    amount: '250.00',
    currency: 'BOB',
    description: 'Supermercado',
    category: 'Comida',
    occurred_at: '2024-05-10T14:30:00Z',
  },
  {
    id: 'tx-3',
    direction: 'expense',
    amount: '100.00',
    currency: 'BOB',
    description: 'Transporte',
    category: 'Movilidad',
    occurred_at: '2024-04-05T08:00:00Z',
  },
];

describe('Date Filter Integration', () => {
  const user = userEvent.setup();
  const onUnauthorized = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('preset buttons render ("Este mes", "Últimos 3 meses", "Último año")', () => {
    render(
      <TransactionsList
        initialItems={mockTransactions}
        loading={false}
        onUnauthorized={onUnauthorized}
      />
    );

    expect(screen.getByRole('button', { name: 'Este mes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Últimos 3 meses' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Último año' })).toBeInTheDocument();
  });

  it('selecting preset filters transactions', async () => {
    const filteredItems = [mockTransactions[0], mockTransactions[1]];
    vi.mocked(dashboardService.fetchTransactionsPage).mockResolvedValue({
      ok: true,
      data: { items: filteredItems, next_cursor: null },
    });

    render(
      <TransactionsList
        initialItems={mockTransactions}
        loading={false}
        onUnauthorized={onUnauthorized}
      />
    );

    const thisMonthButton = screen.getByRole('button', { name: 'Este mes' });
    await user.click(thisMonthButton);

    await waitFor(() => {
      expect(dashboardService.fetchTransactionsPage).toHaveBeenCalled();
    });

    // Verify the API was called with a start_date parameter
    const calls = vi.mocked(dashboardService.fetchTransactionsPage).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    const [, , , startDate] = calls[0];
    expect(startDate).toBeTruthy();
  });

  it('custom date range works', async () => {
    const filteredItems = [mockTransactions[2]];
    vi.mocked(dashboardService.fetchTransactionsPage).mockResolvedValue({
      ok: true,
      data: { items: filteredItems, next_cursor: null },
    });

    render(
      <TransactionsList
        initialItems={mockTransactions}
        loading={false}
        onUnauthorized={onUnauthorized}
      />
    );

    const startDateInput = screen.getByLabelText('Fecha inicial');
    const endDateInput = screen.getByLabelText('Fecha final');

    await user.type(startDateInput, '2024-04-01');
    await user.type(endDateInput, '2024-04-30');

    await waitFor(() => {
      expect(dashboardService.fetchTransactionsPage).toHaveBeenCalled();
    });

    const calls = vi.mocked(dashboardService.fetchTransactionsPage).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    const [, , , startDate, endDate] = calls[calls.length - 1];
    expect(startDate).toBe('2024-04-01');
    expect(endDate).toBe('2024-04-30');
  });

  it('"Limpiar filtro" resets the filter', async () => {
    vi.mocked(dashboardService.fetchTransactionsPage).mockResolvedValue({
      ok: true,
      data: { items: mockTransactions, next_cursor: null },
    });

    render(
      <TransactionsList
        initialItems={mockTransactions}
        loading={false}
        onUnauthorized={onUnauthorized}
      />
    );

    // Apply a preset filter first
    const thisMonthButton = screen.getByRole('button', { name: 'Este mes' });
    await user.click(thisMonthButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Limpiar filtro' })).toBeInTheDocument();
    });

    // Clear the filter
    const clearButton = screen.getByRole('button', { name: 'Limpiar filtro' });
    await user.click(clearButton);

    // After clearing, the preset should no longer be active
    // and the initial items should be shown
    await waitFor(() => {
      expect(thisMonthButton).not.toHaveClass('bg-orange-500/15');
    });

    // The clear button should disappear
    expect(screen.queryByRole('button', { name: 'Limpiar filtro' })).not.toBeInTheDocument();
  });
});
