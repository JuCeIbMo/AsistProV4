import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextInput } from '../TextInput';

describe('TextInput', () => {
  it('renders with label', () => {
    render(<TextInput label="Email" />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('shows error state when error prop provided', () => {
    render(<TextInput label="Email" error="Invalid email" />);
    const input = screen.getByLabelText(/email/i);

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
  });

  it('calls onChange when typed', async () => {
    const handleChange = vi.fn();
    render(<TextInput label="Name" onChange={handleChange} />);
    const input = screen.getByLabelText(/name/i);

    await userEvent.type(input, 'John');
    expect(handleChange).toHaveBeenCalledTimes(4);
  });

  it('has aria-invalid when error is present', () => {
    render(<TextInput label="Email" error="Required" />);
    const input = screen.getByLabelText(/email/i);

    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('has aria-describedby pointing to error message', () => {
    render(<TextInput label="Email" error="Required" />);
    const input = screen.getByLabelText(/email/i);
    const errorId = input.getAttribute('aria-describedby');

    expect(errorId).toBeDefined();
    expect(screen.getByRole('alert')).toHaveAttribute('id', errorId);
  });
});
