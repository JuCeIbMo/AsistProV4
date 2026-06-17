import { type ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-dark-elevated/90 text-dark-secondary border-dark-border',
  success: 'bg-emerald-500/12 text-emerald-300 border-emerald-500/20',
  warning: 'bg-amber-500/12 text-amber-300 border-amber-500/20',
  danger: 'bg-red-500/12 text-red-300 border-red-500/20',
  info: 'bg-sky-500/12 text-sky-300 border-sky-500/20',
  accent: 'bg-dark-accent-light text-dark-accent-dark border-dark-accent/20',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-[11px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
};

export function Badge({
  variant = 'default',
  size = 'sm',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'font-bold rounded-full whitespace-nowrap border tracking-[0.04em]',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}
