# AsistPro Editorial Tech Redesign

**Goal**

Replace the current generic orange SaaS presentation with a more distinctive, premium interface system while preserving the existing product flows and page structure.

**Approved Direction**

- Style: Editorial Tech
- Mood: premium, sharp, high-contrast, deliberate
- Core surfaces: ink, slate, parchment, brass
- Product metaphor: assistant + financial briefing, not startup template

**Visual System**

- Typography:
  - Display typography becomes larger, tighter, and more assertive.
  - Body and UI typography stay calm and readable.
- Color:
  - Replace the bright orange-led palette with deep navy/ink surfaces and brass-gold accents.
  - Keep semantic greens/reds/blues for finance states, but tune them to fit the darker system.
- Surfaces:
  - Cards become panel-like with framed borders, layered shadows, and restrained glass only where useful.
  - Backgrounds use atmospheric gradients and soft texture instead of flat fills.
- Motion:
  - Reduce gimmicky floating behavior.
  - Use restrained reveal and emphasis motion.
  - Respect `prefers-reduced-motion`.

**Page-Level Direction**

- Landing:
  - Rebuild the hero around stronger editorial composition.
  - Keep the WhatsApp demonstration, but present it as a flagship artifact.
  - Reframe features, proof, pricing, and CTA with more intentional hierarchy.
- Login:
  - Present login as a premium checkpoint rather than a default app card.
  - Improve hierarchy, step clarity, and atmosphere.
- Dashboard:
  - Treat the dashboard as a command brief.
  - Stronger summary rail, cleaner spacing, better density control, more intentional chart/list framing.
- Shared UI:
  - Button, input, badge, card, modal, and skeleton styles must shift with the system so the redesign is consistent.
- Remaining surfaces:
  - Legal and payment pages must inherit the new system so they do not look disconnected.

**Constraints**

- Keep current flows functional:
  - marketing CTA flow
  - pricing modal flow
  - OTP login flow
  - dashboard data loading and filtering
  - payment success/failure surfaces
- Avoid introducing new product behavior unless needed to support the redesign.
- Preserve accessibility basics: contrast, visible focus states, keyboard access, reduced motion.

**Implementation Strategy**

1. Replace root design tokens and global CSS atmosphere.
2. Refactor shared UI primitives to the new system.
3. Redesign the main marketing surface.
4. Redesign login and dashboard shells.
5. Retheme remaining legal/payment surfaces.
6. Verify with tests, lint/build where feasible, and responsive checks.
