import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useFocusTrap } from '../useFocusTrap';

function TestComponent({ active }: { active: boolean }) {
  const ref = useFocusTrap<HTMLDivElement>({ active });
  return (
    <div ref={ref} data-testid="trap">
      <button data-testid="first">First</button>
      <button data-testid="second">Second</button>
      <button data-testid="third">Third</button>
    </div>
  );
}

describe('useFocusTrap', () => {
  it('traps Tab cycling within the container', () => {
    render(<TestComponent active={true} />);

    const trap = screen.getByTestId('trap');
    const first = screen.getByTestId('first');
    const third = screen.getByTestId('third');

    // Tab from last focusable should cycle back to first
    third.focus();
    expect(document.activeElement).toBe(third);

    fireEvent.keyDown(trap, { key: 'Tab' });
    expect(document.activeElement).toBe(first);
  });

  it('traps Shift+Tab cycling within the container', () => {
    render(<TestComponent active={true} />);

    const trap = screen.getByTestId('trap');
    const first = screen.getByTestId('first');
    const third = screen.getByTestId('third');

    // Shift+Tab from first focusable should cycle to last
    first.focus();
    expect(document.activeElement).toBe(first);

    fireEvent.keyDown(trap, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(third);
  });

  it('restores focus on deactivate', () => {
    const outsideButton = document.createElement('button');
    outsideButton.setAttribute('data-testid', 'outside');
    document.body.appendChild(outsideButton);
    outsideButton.focus();

    const { rerender } = render(<TestComponent active={true} />);
    rerender(<TestComponent active={false} />);

    expect(document.activeElement).toBe(outsideButton);

    document.body.removeChild(outsideButton);
  });
});
