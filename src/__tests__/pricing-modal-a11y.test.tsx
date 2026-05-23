import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PricingModal from '../components/PricingModal';

const mockPlan = {
  name: 'Pro',
  monthlyPrice: '$5.99',
  annualPrice: '$59.99',
  features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
  description: 'Plan Pro description',
};

describe('PricingModal Accessibility Integration', () => {
  const user = userEvent.setup();
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('modal has role="dialog" and aria-modal="true"', () => {
    render(
      <PricingModal
        isOpen={true}
        onClose={onClose}
        selectedPlan={mockPlan}
        isAnnual={false}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('focus trap works (Tab cycles within modal)', async () => {
    render(
      <PricingModal
        isOpen={true}
        onClose={onClose}
        selectedPlan={mockPlan}
        isAnnual={false}
      />
    );

    const dialog = screen.getByRole('dialog');
    const focusableElements = dialog.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    expect(focusableElements.length).toBeGreaterThan(0);

    // The first focusable element should receive focus initially
    // due to useFocusTrap
    await waitFor(() => {
      const firstFocusable = focusableElements[0] as HTMLElement;
      expect(document.activeElement).toBe(firstFocusable);
    });

    // Tab through all focusable elements
    for (let i = 0; i < focusableElements.length; i++) {
      await user.tab();
    }

    // After tabbing through all elements, focus should cycle back
    // to the first element (focus trap behavior)
    const firstFocusable = focusableElements[0] as HTMLElement;
    expect(document.activeElement).toBe(firstFocusable);
  });

  it('Escape key closes modal', async () => {
    render(
      <PricingModal
        isOpen={true}
        onClose={onClose}
        selectedPlan={mockPlan}
        isAnnual={false}
      />
    );

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
