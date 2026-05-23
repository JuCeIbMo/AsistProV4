import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import LoginPage from '../pages/login';
import * as authService from '../services/authService';

// Mock authService
vi.mock('../services/authService', () => ({
  requestOtp: vi.fn(),
  verifyOtp: vi.fn(),
  resendOtp: vi.fn(),
}));

describe('OTP Resend Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('"Reenviar código" button appears in step 2', async () => {
    vi.mocked(authService.requestOtp).mockResolvedValue({ ok: true });

    render(<LoginPage />);

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
});
