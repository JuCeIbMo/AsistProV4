import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpensePieChart } from '../components/dashboard/ExpensePieChart';
import { MonthlyTrendBars } from '../components/dashboard/MonthlyTrendBars';
import type { ExpenseCategoryItem, MonthlyTrendPoint } from '../services/dashboardService';

const mockCategories: ExpenseCategoryItem[] = [
  { slug: 'food', display_name: 'Comida', amount: '500.00', share: 50 },
  { slug: 'transport', display_name: 'Transporte', amount: '300.00', share: 30 },
  { slug: 'entertainment', display_name: 'Entretenimiento', amount: '200.00', share: 20 },
];

const mockTrend: MonthlyTrendPoint[] = [
  { label: 'May 2024', year: 2024, month: 5, income: '2000.00', expense: '1000.00', net: '1000.00' },
  { label: 'Jun 2024', year: 2024, month: 6, income: '2500.00', expense: '1200.00', net: '1300.00' },
];

describe('Chart Tooltips Integration', () => {
  const user = userEvent.setup();

  describe('ExpensePieChart', () => {
    it('hovering shows tooltip with category, amount, percentage', async () => {
      render(
        <ExpensePieChart
          categories={mockCategories}
          loading={false}
          currency="BOB"
        />
      );

      // Find the SVG paths (pie slices)
      const paths = document.querySelectorAll('path[aria-label]');
      expect(paths.length).toBeGreaterThan(0);

      // Hover over the first slice
      await user.hover(paths[0]);

      await waitFor(() => {
        const comidaElements = screen.getAllByText('Comida');
        expect(comidaElements.length).toBeGreaterThanOrEqual(1);
      });

      // Check for amount and percentage in tooltip
      const comidaElements = screen.getAllByText('Comida');
      const tooltip = comidaElements.find(el =>
        el.closest('div[class*="absolute"]') !== null
      )?.closest('div[class*="absolute"]');
      expect(tooltip).toBeInTheDocument();
      if (tooltip) {
        expect(tooltip.textContent).toMatch(/500/);
        expect(tooltip.textContent).toMatch(/50\.0%/);
      }
    });
  });

  describe('MonthlyTrendBars', () => {
    it('hovering shows tooltip with month, income, expense, net', async () => {
      render(
        <MonthlyTrendBars
          trend={mockTrend}
          loading={false}
          currency="BOB"
        />
      );

      // Find the bar groups (each month is a flex-1 div with cursor-pointer)
      const bars = document.querySelectorAll('.cursor-pointer');
      expect(bars.length).toBeGreaterThan(0);

      // Hover over the first bar group
      await user.hover(bars[0]);

      await waitFor(() => {
        // The tooltip should appear with month label
        expect(screen.getByText('May 2024')).toBeInTheDocument();
      });

      // Check for income, expense, and net in tooltip
      const tooltip = screen.getByText('May 2024').closest('div[class*="absolute"]');
      expect(tooltip).toBeInTheDocument();
      if (tooltip) {
        expect(tooltip.textContent).toMatch(/\+2\.000/);
        expect(tooltip.textContent).toMatch(/-1\.000/);
        expect(tooltip.textContent).toMatch(/= 1\.000/);
      }
    });
  });
});
