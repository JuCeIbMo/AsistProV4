import { render } from '@testing-library/react';
import { MesaMetrics, type MesaMetric } from '../components/dashboard/mesa/MesaMetrics';

vi.mock('../hooks/useMobile', () => ({
  useMobile: () => false,
}));

describe('MesaMetrics', () => {
  it('renders dashboard money metrics with a quieter currency token', () => {
    const metrics: MesaMetric[] = [
      {
        kind: 'split',
        label: 'Ingresos y gastos del mes',
        value: '1200.00',
        secondaryLabel: 'Gastos',
        secondaryValue: '450.00',
        hint: 'Junio 2026',
        hintColor: '#547552',
        rotation: 0,
        currency: 'BOB',
      },
      {
        label: 'Gastado hoy',
        value: '35.00',
        hint: 'Solo gastos del día',
        hintColor: '#9a824a',
        rotation: 0,
        currency: 'BOB',
      },
    ];

    const { container } = render(<MesaMetrics metrics={metrics} />);

    const currencyTokens = container.querySelectorAll('[data-currency-token="true"]');
    expect(currencyTokens.length).toBeGreaterThan(0);
    currencyTokens.forEach(token => {
      expect(token).toHaveStyle({ fontSize: '0.62em' });
    });
  });
});
