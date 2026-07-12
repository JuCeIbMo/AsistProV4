/**
 * Design Token System for AsistProV4
 *
 * Typed design tokens for light and dark themes.
 * Consumed by tailwind.config.js and available for TypeScript autocomplete.
 */

// ── Color Palettes ──

export const lightColors = {
  bg: '#F3EDE3',
  elevated: '#E5DCCB',
  footer: '#D9CFBB',
  text: '#131A26',
  secondary: '#4F5B70',
  muted: '#7A808D',
  accent: '#F97316',
  'accent-dark': '#EA580C',
  'accent-light': '#FFEDD5',
  purple: '#6652B5',
  'purple-light': '#EAE5F7',
  sage: '#547552',
  'sage-light': '#E2EDDE',
  border: 'rgba(19, 26, 38, 0.10)',
  'border-strong': 'rgba(19, 26, 38, 0.18)',
  'border-subtle': 'rgba(19, 26, 38, 0.06)',
  shadow: 'rgba(19, 26, 38, 0.10)',
  'shadow-strong': 'rgba(19, 26, 38, 0.18)',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const darkColors = {
  bg: '#09111B',
  card: '#101927',
  elevated: '#172234',
  text: '#DEE5F2',
  'text-primary': '#F7F1E8',
  secondary: '#A7B0C2',
  'secondary-dim': '#73809A',
  muted: '#57657C',
  'muted-dim': '#3A4557',
  accent: '#B68A3E',
  'accent-dark': '#D2AD63',
  'accent-light': 'rgba(182, 138, 62, 0.16)',
  border: 'rgba(197, 210, 228, 0.10)',
  'border-strong': 'rgba(197, 210, 228, 0.18)',
  'border-subtle': 'rgba(197, 210, 228, 0.05)',
  shadow: 'rgba(4, 8, 14, 0.45)',
  'shadow-strong': 'rgba(4, 8, 14, 0.70)',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const chartColors = [
  '#C7A15A',
  '#5D85B3',
  '#D17C52',
  '#7E9B74',
  '#8F6BB3',
  '#D7C7A4',
  '#A1AEC5',
] as const;

export type LightColorToken = keyof typeof lightColors;
export type DarkColorToken = keyof typeof darkColors;

// ── Spacing Scale (rem units) ──

export const spacing = {
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px
  1.5: '0.375rem',   // 6px
  2: '0.5rem',       // 8px
  2.5: '0.625rem',   // 10px
  3: '0.75rem',      // 12px
  4: '1rem',         // 16px
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px
  8: '2rem',         // 32px
  10: '2.5rem',      // 40px
  12: '3rem',        // 48px
  16: '4rem',        // 64px
  20: '5rem',        // 80px
  24: '6rem',        // 96px
  32: '8rem',        // 128px
  40: '10rem',       // 160px
  48: '12rem',       // 192px
  64: '16rem',       // 256px
  80: '20rem',       // 320px
  96: '24rem',       // 384px
} as const;

export type SpacingToken = keyof typeof spacing;

// ── Typography Scale ──

export const typography = {
  xs: { fontSize: '0.75rem', lineHeight: '1rem' },      // 12px / 16px
  sm: { fontSize: '0.875rem', lineHeight: '1.25rem' },   // 14px / 20px
  base: { fontSize: '1rem', lineHeight: '1.5rem' },      // 16px / 24px
  lg: { fontSize: '1.125rem', lineHeight: '1.75rem' },   // 18px / 28px
  xl: { fontSize: '1.25rem', lineHeight: '1.75rem' },    // 20px / 28px
  '2xl': { fontSize: '1.5rem', lineHeight: '2rem' },      // 24px / 32px
  '3xl': { fontSize: '1.875rem', lineHeight: '2.25rem' }, // 30px / 36px
  '4xl': { fontSize: '2.25rem', lineHeight: '2.5rem' },   // 36px / 40px
  '5xl': { fontSize: '3rem', lineHeight: '1' },          // 48px / 48px
} as const;

export type TypographyToken = keyof typeof typography;

// ── Font Weights ──

export const fontWeight = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

export type FontWeightToken = keyof typeof fontWeight;

// ── Border Radii ──

export const borderRadius = {
  none: '0',
  sm: '0.125rem',    // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',     // 16px
  '3xl': '1.5rem',   // 24px
  full: '9999px',
} as const;

export type BorderRadiusToken = keyof typeof borderRadius;

// ── Shadows ──

export const shadows = {
  sm: '0 6px 14px rgba(10, 17, 27, 0.08)',
  DEFAULT: '0 12px 24px rgba(10, 17, 27, 0.10), 0 2px 6px rgba(10, 17, 27, 0.06)',
  md: '0 18px 30px rgba(10, 17, 27, 0.14), 0 6px 12px rgba(10, 17, 27, 0.08)',
  lg: '0 26px 50px rgba(10, 17, 27, 0.18), 0 8px 18px rgba(10, 17, 27, 0.10)',
  xl: '0 32px 70px rgba(10, 17, 27, 0.24), 0 10px 24px rgba(10, 17, 27, 0.14)',
  '2xl': '0 44px 100px rgba(10, 17, 27, 0.30), 0 16px 34px rgba(10, 17, 27, 0.18)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  none: 'none',
} as const;

export type ShadowToken = keyof typeof shadows;

// ── Transitions ──

export const transitions = {
  fast: '150ms',
  DEFAULT: '200ms',
  slow: '300ms',
} as const;

export type TransitionToken = keyof typeof transitions;

export const transitionTiming = {
  DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export type TransitionTimingToken = keyof typeof transitionTiming;

// ── Z-Index Layers ──

export const zIndex = {
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  auto: 'auto',
  dropdown: '1000',
  sticky: '1020',
  fixed: '1030',
  modal: '1040',
  popover: '1050',
  tooltip: '1060',
} as const;

export type ZIndexToken = keyof typeof zIndex;

// ── Composite Token Exports ──

export const tokens = {
  colors: {
    light: lightColors,
    dark: darkColors,
  },
  spacing,
  typography,
  fontWeight,
  borderRadius,
  shadows,
  transitions,
  transitionTiming,
  zIndex,
} as const;

export type TokenTheme = typeof tokens;
