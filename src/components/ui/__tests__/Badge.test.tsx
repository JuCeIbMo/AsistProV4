import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('renders default variant', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-white/[0.08]', 'text-gray-400');
  });

  it('renders success variant', () => {
    render(<Badge variant="success">Success</Badge>);
    const badge = screen.getByText('Success');

    expect(badge).toHaveClass('bg-green-500/15', 'text-green-400');
  });

  it('renders warning variant', () => {
    render(<Badge variant="warning">Warning</Badge>);
    const badge = screen.getByText('Warning');

    expect(badge).toHaveClass('bg-yellow-500/15', 'text-yellow-400');
  });

  it('renders danger variant', () => {
    render(<Badge variant="danger">Danger</Badge>);
    const badge = screen.getByText('Danger');

    expect(badge).toHaveClass('bg-red-500/15', 'text-red-400');
  });

  it('renders info variant', () => {
    render(<Badge variant="info">Info</Badge>);
    const badge = screen.getByText('Info');

    expect(badge).toHaveClass('bg-blue-500/15', 'text-blue-400');
  });

  it('renders small size by default', () => {
    render(<Badge>Small</Badge>);
    const badge = screen.getByText('Small');

    expect(badge).toHaveClass('text-xs', 'px-1.5', 'py-0.5');
  });

  it('renders medium size', () => {
    render(<Badge size="md">Medium</Badge>);
    const badge = screen.getByText('Medium');

    expect(badge).toHaveClass('text-xs', 'px-2', 'py-1');
  });
});
