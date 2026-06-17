import { type ReactNode, type CSSProperties } from 'react';
import { lightColors, darkColors, borderRadius, spacing, shadows } from '../../styles/tokens';

type CardVariant = 'default' | 'elevated' | 'outline';
type CardTheme = 'light' | 'dark';

interface CardProps {
  variant?: CardVariant;
  theme?: CardTheme;
  children: ReactNode;
  className?: string;
}

function getCardStyles(variant: CardVariant, theme: CardTheme): CSSProperties {
  const colors = theme === 'light' ? lightColors : darkColors;
  const isLight = theme === 'light';

  const baseStyles: CSSProperties = {
    backgroundColor: isLight ? 'rgba(255, 251, 245, 0.84)' : 'rgba(16, 25, 39, 0.94)',
    borderRadius: borderRadius.xl,
    padding: spacing[5],
    position: 'relative',
    overflow: 'hidden',
  };

  switch (variant) {
    case 'default':
      return {
        ...baseStyles,
        border: `1px solid ${colors.border}`,
        boxShadow: isLight ? shadows.sm : shadows.md,
      };
    case 'elevated':
      return {
        ...baseStyles,
        border: `1px solid ${colors['border-strong']}`,
        boxShadow: isLight ? shadows.xl : shadows['2xl'],
      };
    case 'outline':
      return {
        ...baseStyles,
        border: `1px solid ${colors['border-strong']}`,
        boxShadow: 'none',
      };
    default:
      return baseStyles;
  }
}

export function Card({
  variant = 'default',
  theme = 'dark',
  children,
  className = '',
}: CardProps) {
  const styles = getCardStyles(variant, theme);

  return (
    <div
      className={['section-frame', className].filter(Boolean).join(' ')}
      style={styles}
      data-theme={theme}
      data-variant={variant}
    >
      {children}
    </div>
  );
}
