import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useReducedMotion } from '../useReducedMotion';

function TestComponent() {
  const prefersReducedMotion = useReducedMotion();
  return <div data-testid="result">{prefersReducedMotion ? 'true' : 'false'}</div>;
}

describe('useReducedMotion', () => {
  let listeners = new Set<(e: MediaQueryListEvent) => void>();
  let matches = false;

  beforeEach(() => {
    listeners = new Set();
    matches = false;

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches,
        media: query,
        onchange: null,
        addEventListener: vi.fn((event: string, listener: (e: MediaQueryListEvent) => void) => {
          listeners.add(listener);
        }),
        removeEventListener: vi.fn((event: string, listener: (e: MediaQueryListEvent) => void) => {
          listeners.delete(listener);
        }),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns boolean value', () => {
    render(<TestComponent />);
    const result = screen.getByTestId('result');

    expect(result).toHaveTextContent(/true|false/);
  });

  it('updates on preference change', () => {
    render(<TestComponent />);
    const result = screen.getByTestId('result');

    expect(result).toHaveTextContent('false');

    matches = true;
    act(() => {
      listeners.forEach((listener) => {
        listener({ matches: true } as MediaQueryListEvent);
      });
    });

    expect(result).toHaveTextContent('true');
  });
});
