import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders default variant', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-dark-elevated/90', 'text-dark-secondary');
  });

  it('renders success variant', () => {
    render(<Badge variant="success">Success</Badge>);
    const badge = screen.getByText('Success');

    expect(badge).toHaveClass('bg-emerald-500/12', 'text-emerald-300');
  });

  it('renders warning variant', () => {
    render(<Badge variant="warning">Warning</Badge>);
    const badge = screen.getByText('Warning');

    expect(badge).toHaveClass('bg-amber-500/12', 'text-amber-300');
  });

  it('renders danger variant', () => {
    render(<Badge variant="danger">Danger</Badge>);
    const badge = screen.getByText('Danger');

    expect(badge).toHaveClass('bg-red-500/12', 'text-red-300');
  });

  it('renders info variant', () => {
    render(<Badge variant="info">Info</Badge>);
    const badge = screen.getByText('Info');

    expect(badge).toHaveClass('bg-sky-500/12', 'text-sky-300');
  });

  it('renders small size by default', () => {
    render(<Badge>Small</Badge>);
    const badge = screen.getByText('Small');

    expect(badge).toHaveClass('text-[11px]', 'px-2', 'py-0.5');
  });

  it('renders medium size', () => {
    render(<Badge size="md">Medium</Badge>);
    const badge = screen.getByText('Medium');

    expect(badge).toHaveClass('text-xs', 'px-2.5', 'py-1');
  });
});
