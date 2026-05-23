import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  it('renders children', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    );

    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default variant styles', () => {
    const { container } = render(<Card>Default</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveAttribute('data-variant', 'default');
    expect(card.style.border).toContain('1px solid');
  });

  it('applies elevated variant styles', () => {
    const { container } = render(<Card variant="elevated">Elevated</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveAttribute('data-variant', 'elevated');
    expect(card).toHaveStyle({
      boxShadow: expect.any(String),
    });
  });

  it('applies outline variant styles', () => {
    const { container } = render(<Card variant="outline">Outline</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveAttribute('data-variant', 'outline');
    expect(card.style.border).toContain('2px solid');
  });

  it('works in light theme', () => {
    const { container } = render(<Card theme="light">Light</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveAttribute('data-theme', 'light');
  });

  it('works in dark theme by default', () => {
    const { container } = render(<Card>Dark</Card>);
    const card = container.firstChild as HTMLElement;

    expect(card).toHaveAttribute('data-theme', 'dark');
  });
});
