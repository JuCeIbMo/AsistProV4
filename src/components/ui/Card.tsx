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
    backgroundColor: isLight ? lightColors.bg : darkColors.card,
    borderRadius: borderRadius['2xl'],
    padding: spacing[5],
  };

  switch (variant) {
    case 'default':
      return {
        ...baseStyles,
        border: `1px solid ${colors.border}`,
      };
    case 'elevated':
      return {
        ...baseStyles,
        border: `1px solid ${colors.border}`,
        boxShadow: isLight ? shadows.lg : shadows.xl,
      };
    case 'outline':
      return {
        ...baseStyles,
        border: `2px solid ${colors['border-strong']}`,
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
      className={className}
      style={styles}
      data-theme={theme}
      data-variant={variant}
    >
      {children}
    </div>
  );
}
