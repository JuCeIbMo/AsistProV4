import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsModal } from '../components/dashboard/SettingsModal';
import * as dashboardService from '../services/dashboardService';

vi.mock('../services/dashboardService', async () => {
  const actual = await vi.importActual<typeof import('../services/dashboardService')>(
    '../services/dashboardService',
  );
  return { ...actual, updateSettings: vi.fn() };
});

const mockedUpdate = vi.mocked(dashboardService.updateSettings);

describe('SettingsModal', () => {
  const user = userEvent.setup();
  const onClose = vi.fn();
  const onSaved = vi.fn();
  const onUnauthorized = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderModal(currentCurrency = 'BOB') {
    render(
      <SettingsModal
        isOpen
        onClose={onClose}
        currentCurrency={currentCurrency}
        onSaved={onSaved}
        onUnauthorized={onUnauthorized}
      />,
    );
  }

  it('preselects the current currency and warns that it does not convert past amounts', () => {
    renderModal('BOB');
    expect(screen.getByLabelText('Moneda base')).toHaveValue('BOB');
    expect(screen.getByText(/no convierte los montos anteriores/i)).toBeInTheDocument();
  });

  it('saves the new currency and notifies on success', async () => {
    mockedUpdate.mockResolvedValue({
      ok: true,
      data: { currency: 'USD', timezone: 'America/La_Paz', locale: 'es_BO' },
    });
    renderModal('BOB');

    await user.selectOptions(screen.getByLabelText('Moneda base'), 'USD');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => {
      expect(mockedUpdate).toHaveBeenCalledWith({ base_currency: 'USD' });
    });
    expect(onSaved).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call the API when nothing changed', async () => {
    renderModal('BOB');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(mockedUpdate).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('redirects on unauthorized', async () => {
    mockedUpdate.mockResolvedValue({ ok: false, status: 'unauthorized' });
    renderModal('BOB');

    await user.selectOptions(screen.getByLabelText('Moneda base'), 'USD');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => {
      expect(onUnauthorized).toHaveBeenCalledTimes(1);
    });
  });
});
