import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from '../Skeleton';

describe('Skeleton', () => {
  it('renders with shimmer animation', () => {
    const { container } = render(<Skeleton className="h-4 w-32" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveStyle({
      animation: 'shimmer 1.4s infinite',
    });
  });

  it('accepts className prop', () => {
    const { container } = render(<Skeleton className="h-4 w-32" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveClass('h-4', 'w-32');
  });
});
