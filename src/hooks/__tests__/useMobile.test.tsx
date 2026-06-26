import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMobile } from '../useMobile';

function TestComponent() {
  const isMobile = useMobile();
  return <div data-testid="result">{isMobile ? 'mobile' : 'desktop'}</div>;
}

describe('useMobile', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('768px'),
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('syncs the current breakpoint during initial render cycle', () => {
    render(<TestComponent />);

    expect(screen.getByTestId('result')).toHaveTextContent('mobile');
  });
});
