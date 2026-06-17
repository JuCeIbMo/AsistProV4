import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-light-text hover:bg-dark-bg text-light-bg shadow-lg shadow-dark-bg/20',
  secondary:
    'bg-light-accent-light text-light-text border border-light-border hover:border-light-accent hover:bg-light-bg/70',
  ghost:
    'bg-transparent text-dark-secondary hover:text-dark-text hover:bg-dark-elevated/80',
  danger:
    'bg-red-500/12 hover:bg-red-500/18 text-red-300 border border-red-500/20',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-md min-h-[36px]',
  md: 'px-4 py-2.5 text-sm rounded-lg min-h-[42px]',
  lg: 'px-5 py-3 text-sm rounded-lg min-h-[46px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={[
        'font-semibold tracking-[0.02em] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
