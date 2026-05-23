import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRef } from 'react';
import { useClickOutside } from '../useClickOutside';

function TestComponent({ onOutsideClick }: { onOutsideClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onOutsideClick);
  return (
    <div>
      <div ref={ref} data-testid="inside">Inside</div>
      <div data-testid="outside">Outside</div>
    </div>
  );
}

describe('useClickOutside', () => {
  it('calls handler when click outside element', () => {
    const handleOutsideClick = vi.fn();
    render(<TestComponent onOutsideClick={handleOutsideClick} />);

    const outside = screen.getByTestId('outside');
    fireEvent.mouseDown(outside);

    expect(handleOutsideClick).toHaveBeenCalledTimes(1);
  });

  it('does not call handler when click inside element', () => {
    const handleOutsideClick = vi.fn();
    render(<TestComponent onOutsideClick={handleOutsideClick} />);

    const inside = screen.getByTestId('inside');
    fireEvent.mouseDown(inside);

    expect(handleOutsideClick).not.toHaveBeenCalled();
  });
});
