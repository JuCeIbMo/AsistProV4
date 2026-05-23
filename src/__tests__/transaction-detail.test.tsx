import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionsList } from '../components/dashboard/TransactionsList';
import type { Transaction } from '../services/dashboardService';

const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    direction: 'income',
    amount: '1500.00',
    currency: 'BOB',
    description: 'Salario mensual',
    category: 'Trabajo',
    occurred_at: '2024-05-15T10:00:00Z',
  },
  {
    id: 'tx-2',
    direction: 'expense',
    amount: '250.50',
    currency: 'BOB',
    description: 'Compra supermercado',
    category: 'Comida',
    occurred_at: '2024-05-10T14:30:00Z',
  },
];

describe('Transaction Detail Integration', () => {
  const user = userEvent.setup();
  const onUnauthorized = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('clicking a transaction row opens detail panel', async () => {
    render(
      <TransactionsList
        initialItems={mockTransactions}
        loading={false}
        onUnauthorized={onUnauthorized}
      />
    );

    const rows = screen.getAllByRole('button');
    // The transaction rows are role="button"
    const txRows = rows.filter(r => r.className.includes('cursor-pointer'));
    expect(txRows.length).toBeGreaterThan(0);

    await user.click(txRows[0]);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    expect(screen.getByText('Detalle del movimiento')).toBeInTheDocument();
  });

  it('detail panel shows all fields (description, amount, currency, category, date, direction)', async () => {
    render(
      <TransactionsList
        initialItems={mockTransactions}
        loading={false}
        onUnauthorized={onUnauthorized}
      />
    );

    const rows = screen.getAllByRole('button');
    const txRows = rows.filter(r => r.className.includes('cursor-pointer'));
    await user.click(txRows[0]);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Check all fields are present
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Description
    expect(screen.getByText('Descripción')).toBeInTheDocument();
    expect(within(dialog).getByText('Salario mensual')).toBeInTheDocument();

    // Amount
    expect(within(dialog).getByText(/1\.500,00/)).toBeInTheDocument();

    // Currency
    expect(within(dialog).getByText('BOB')).toBeInTheDocument();

    // Category
    expect(screen.getByText('Categoría')).toBeInTheDocument();
    expect(within(dialog).getByText('Trabajo')).toBeInTheDocument();

    // Direction - income shows ArrowUpRight icon
    expect(screen.getByText('Fecha')).toBeInTheDocument();
  });

  it('Escape key closes the panel', async () => {
    render(
      <TransactionsList
        initialItems={mockTransactions}
        loading={false}
        onUnauthorized={onUnauthorized}
      />
    );

    const rows = screen.getAllByRole('button');
    const txRows = rows.filter(r => r.className.includes('cursor-pointer'));
    await user.click(txRows[0]);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('overlay click closes the panel', async () => {
    render(
      <TransactionsList
        initialItems={mockTransactions}
        loading={false}
        onUnauthorized={onUnauthorized}
      />
    );

    const rows = screen.getAllByRole('button');
    const txRows = rows.filter(r => r.className.includes('cursor-pointer'));
    await user.click(txRows[0]);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Click on the backdrop (the div with aria-hidden="true" behind the panel)
    const backdrop = screen.getByRole('dialog').parentElement?.querySelector('[aria-hidden="true"]');
    if (backdrop) {
      await user.click(backdrop);
    }

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
