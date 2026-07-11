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
        // ── Mesa (Escritorio) desk-paper palette ──
        mesa: {
          desk: '#E4DCC8',
          paper: '#FCFAF2',
          ink: '#1A1816',
          'ink-soft': '#221f1b',
          manila: '#EBDBAB',
          'manila-deep': '#E3D0A0',
          gold: '#D9A82E',
          terracotta: '#C94E2C',
          violet: '#6652B5',
          green: '#547552',
          amber: '#C48B1E',
          cork: '#C19A6B',
          muted: '#A8997A',
          'muted-deep': '#8a7c5e',
        },
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
        display: ['Fraunces', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        // ── Mesa (Escritorio) typefaces ──
        serifMesa: ['"Playfair Display"', 'Georgia', 'serif'],
        sansMesa: ['"DM Sans"', 'system-ui', 'sans-serif'],
        monoMesa: ['"JetBrains Mono"', 'monospace'],
        hand: ['"Dancing Script"', 'cursive'],
        note: ['Caveat', 'cursive'],
      },
    },
  },
  plugins: [],
};

export default config;
