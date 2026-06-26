import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import LoginPage from '../pages/login';
import * as authService from '../services/authService';

// Mock authService
vi.mock('../services/authService', () => ({
  requestOtp: vi.fn(),
  verifyOtp: vi.fn(),
  resendOtp: vi.fn(),
  checkAuth: vi.fn().mockResolvedValue({ ok: false }),
}));

describe('OTP Resend Integration', () => {
  const openSpy = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    openSpy.mockReset();
    vi.stubGlobal('open', openSpy);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('"Reenviar código" button appears in step 2', async () => {
    vi.mocked(authService.requestOtp).mockResolvedValue({ ok: true });

    render(<LoginPage />);
    await act(async () => { await Promise.resolve(); });

    const phoneInput = screen.getByPlaceholderText('+591 70 000 000');
    await act(async () => {
      phoneInput.setAttribute('value', '+59170000000');
      phoneInput.dispatchEvent(new Event('change', { bubbles: true }));
      await Promise.resolve();
    });

    const submitButton = screen.getByRole('button', { name: /enviar código/i });
    await act(async () => {
      submitButton.click();
      await Promise.resolve();
    });

    expect(screen.getByRole('button', { name: /reenviar/i })).toBeInTheDocument();
  });

  it('button shows countdown text immediately after OTP sent', async () => {
    vi.mocked(authService.requestOtp).mockResolvedValue({ ok: true });

    render(<LoginPage />);
    await act(async () => { await Promise.resolve(); });

    const phoneInput = screen.getByPlaceholderText('+591 70 000 000');
    await act(async () => {
      phoneInput.setAttribute('value', '+59170000000');
      phoneInput.dispatchEvent(new Event('change', { bubbles: true }));
      await Promise.resolve();
    });

    const submitButton = screen.getByRole('button', { name: /enviar código/i });
    await act(async () => {
      submitButton.click();
      await Promise.resolve();
    });

    expect(screen.getByText(/reenviar en \d+s/i)).toBeInTheDocument();
  });

  it('button is disabled during countdown', async () => {
    vi.mocked(authService.requestOtp).mockResolvedValue({ ok: true });

    render(<LoginPage />);
    await act(async () => { await Promise.resolve(); });

    const phoneInput = screen.getByPlaceholderText('+591 70 000 000');
    await act(async () => {
      phoneInput.setAttribute('value', '+59170000000');
      phoneInput.dispatchEvent(new Event('change', { bubbles: true }));
      await Promise.resolve();
    });

    const submitButton = screen.getByRole('button', { name: /enviar código/i });
    await act(async () => {
      submitButton.click();
      await Promise.resolve();
    });

    const resendButton = screen.getByRole('button', { name: /reenviar/i });
    expect(resendButton).toBeDisabled();
  });

  it('button re-enables after 60 seconds', async () => {
    vi.mocked(authService.requestOtp).mockResolvedValue({ ok: true });

    render(<LoginPage />);
    await act(async () => { await Promise.resolve(); });

    const phoneInput = screen.getByPlaceholderText('+591 70 000 000');
    await act(async () => {
      phoneInput.setAttribute('value', '+59170000000');
      phoneInput.dispatchEvent(new Event('change', { bubbles: true }));
      await Promise.resolve();
    });

    const submitButton = screen.getByRole('button', { name: /enviar código/i });
    await act(async () => {
      submitButton.click();
      await Promise.resolve();
    });

    expect(screen.getByText(/reenviar en \d+s/i)).toBeInTheDocument();

    // Advance 61 seconds in 1-second increments to allow React to re-render between each tick
    for (let i = 0; i < 61; i++) {
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      await act(async () => {
        await Promise.resolve();
      });
    }

    const resendButton = screen.getByRole('button', { name: /^reenviar código$/i });
    expect(resendButton).toBeEnabled();
  });

  it('clicking resend calls the API', async () => {
    vi.mocked(authService.requestOtp).mockResolvedValue({ ok: true });
    vi.mocked(authService.resendOtp).mockResolvedValue({ ok: true });

    render(<LoginPage />);
    await act(async () => { await Promise.resolve(); });

    const phoneInput = screen.getByPlaceholderText('+591 70 000 000');
    await act(async () => {
      phoneInput.setAttribute('value', '+59170000000');
      phoneInput.dispatchEvent(new Event('change', { bubbles: true }));
      await Promise.resolve();
    });

    const submitButton = screen.getByRole('button', { name: /enviar código/i });
    await act(async () => {
      submitButton.click();
      await Promise.resolve();
    });

    expect(screen.getByText(/reenviar en \d+s/i)).toBeInTheDocument();

    // Advance 61 seconds in 1-second increments
    for (let i = 0; i < 61; i++) {
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      await act(async () => {
        await Promise.resolve();
      });
    }

    const resendButton = screen.getByRole('button', { name: /^reenviar código$/i });
    expect(resendButton).toBeEnabled();

    await act(async () => {
      resendButton.click();
      await Promise.resolve();
    });

    expect(authService.resendOtp).toHaveBeenCalledWith('+59170000000');
  });

  it('shows a WhatsApp CTA when the initial OTP request is blocked by the conversation window', async () => {
    vi.mocked(authService.requestOtp).mockResolvedValue({
      ok: false,
      code: 'WHATSAPP_WINDOW_EXPIRED',
      error: 'Antes de recibir tu código, primero debes enviarnos un mensaje por WhatsApp.',
    });

    render(<LoginPage />);
    await act(async () => { await Promise.resolve(); });

    const phoneInput = screen.getByPlaceholderText('+591 70 000 000');
    await act(async () => {
      phoneInput.setAttribute('value', '+59170000000');
      phoneInput.dispatchEvent(new Event('change', { bubbles: true }));
      await Promise.resolve();
    });

    await act(async () => {
      screen.getByRole('button', { name: /enviar código/i }).click();
      await Promise.resolve();
    });

    expect(screen.getByText(/primero debes enviarnos un mensaje por whatsapp/i)).toBeInTheDocument();

    await act(async () => {
      screen.getByRole('button', { name: /abrir whatsapp/i }).click();
      await Promise.resolve();
    });

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/59175014755?text='),
      '_blank',
    );
  });

  it('shows the same WhatsApp CTA when resend is blocked by the conversation window', async () => {
    vi.mocked(authService.requestOtp).mockResolvedValue({ ok: true });
    vi.mocked(authService.resendOtp).mockResolvedValue({
      ok: false,
      code: 'WHATSAPP_WINDOW_EXPIRED',
      error: 'Antes de recibir tu código, primero debes enviarnos un mensaje por WhatsApp.',
    });

    render(<LoginPage />);
    await act(async () => { await Promise.resolve(); });

    const phoneInput = screen.getByPlaceholderText('+591 70 000 000');
    await act(async () => {
      phoneInput.setAttribute('value', '+59170000000');
      phoneInput.dispatchEvent(new Event('change', { bubbles: true }));
      await Promise.resolve();
    });

    await act(async () => {
      screen.getByRole('button', { name: /enviar código/i }).click();
      await Promise.resolve();
    });

    for (let i = 0; i < 61; i++) {
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      await act(async () => {
        await Promise.resolve();
      });
    }

    await act(async () => {
      screen.getByRole('button', { name: /^reenviar código$/i }).click();
      await Promise.resolve();
    });

    expect(screen.getByText(/primero debes enviarnos un mensaje por whatsapp/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /abrir whatsapp/i })).toBeInTheDocument();
  });
});
