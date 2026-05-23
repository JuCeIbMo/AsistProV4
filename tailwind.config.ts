import type { Config } from 'tailwindcss';
import {
  lightColors,
  darkColors,
  spacing,
  typography,
  fontWeight,
  borderRadius,
  shadows,
  transitions,
  transitionTiming,
  zIndex,
} from './src/styles/tokens';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // ── Colors ──
      colors: {
        light: lightColors,
        dark: darkColors,
      },

      // ── Spacing ──
      spacing,

      // ── Typography ──
      fontSize: {
        xs: [typography.xs.fontSize, { lineHeight: typography.xs.lineHeight }],
        sm: [typography.sm.fontSize, { lineHeight: typography.sm.lineHeight }],
        base: [typography.base.fontSize, { lineHeight: typography.base.lineHeight }],
        lg: [typography.lg.fontSize, { lineHeight: typography.lg.lineHeight }],
        xl: [typography.xl.fontSize, { lineHeight: typography.xl.lineHeight }],
        '2xl': [typography['2xl'].fontSize, { lineHeight: typography['2xl'].lineHeight }],
        '3xl': [typography['3xl'].fontSize, { lineHeight: typography['3xl'].lineHeight }],
        '4xl': [typography['4xl'].fontSize, { lineHeight: typography['4xl'].lineHeight }],
        '5xl': [typography['5xl'].fontSize, { lineHeight: typography['5xl'].lineHeight }],
      },
      fontWeight,

      // ── Border Radius ──
      borderRadius,

      // ── Shadows ──
      boxShadow: shadows,

      // ── Transitions ──
      transitionDuration: transitions,
      transitionTimingFunction: transitionTiming,

      // ── Z-Index ──
      zIndex,

      // ── Font Family (preserved from original config) ──
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
