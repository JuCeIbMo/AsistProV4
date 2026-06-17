# Editorial Tech Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current frontend visual system with the approved Editorial Tech redesign across landing, login, dashboard, and supporting surfaces without breaking existing flows.

**Architecture:** The redesign is rooted in a token and CSS overhaul first, then shared UI primitive updates, then page-shell rewrites for the landing page, login, dashboard, and remaining legal/payment surfaces. Existing behavior and data wiring stay intact while presentation, hierarchy, and layout are rebuilt.

**Tech Stack:** Next.js, React 18, TypeScript, Tailwind CSS, Vitest, Testing Library, Lucide React

---

### Task 1: Replace Design Tokens And Global Atmosphere

**Files:**
- Modify: `AsistProV4/src/styles/tokens.ts`
- Modify: `AsistProV4/src/index.css`
- Modify: `AsistProV4/tailwind.config.ts`
- Test: `AsistProV4/src/components/ui/__tests__/Button.test.tsx`
- Test: `AsistProV4/src/components/ui/__tests__/TextInput.test.tsx`
- Test: `AsistProV4/src/components/ui/__tests__/Badge.test.tsx`

- [ ] Update token definitions for the Editorial Tech palette, typography pairings, shadows, and semantic colors.
- [ ] Rewrite global CSS variables and atmosphere utilities for ink backgrounds, brass accents, texture, and restrained motion.
- [ ] Update Tailwind font families to match the new system.
- [ ] Adjust existing UI primitive tests to assert the new class signatures before changing production components.

### Task 2: Refactor Shared UI Primitives

**Files:**
- Modify: `AsistProV4/src/components/ui/Button.tsx`
- Modify: `AsistProV4/src/components/ui/Card.tsx`
- Modify: `AsistProV4/src/components/ui/TextInput.tsx`
- Modify: `AsistProV4/src/components/ui/Badge.tsx`
- Modify: `AsistProV4/src/components/ui/Skeleton.tsx`
- Modify: `AsistProV4/src/components/ui/__tests__/Card.test.tsx`

- [ ] Update button variants and sizes to the new visual language.
- [ ] Refactor card styling away from generic rounded panels into framed editorial surfaces.
- [ ] Retheme text inputs for the new login/modal forms.
- [ ] Retheme badges and skeletons to match the darker premium system.
- [ ] Run the primitive UI tests and fix mismatches.

### Task 3: Rebuild The Landing Page

**Files:**
- Modify: `AsistProV4/src/App.tsx`
- Modify: `AsistProV4/src/pages/index.tsx`
- Modify: `AsistProV4/src/components/PricingModal.tsx`
- Create or modify tests if needed under: `AsistProV4/src/__tests__/`

- [ ] Recompose the landing page sections with stronger editorial hierarchy.
- [ ] Retheme the WhatsApp demo artifact, pricing cards, CTA, and footer.
- [ ] Retheme the pricing modal so it matches the new system.
- [ ] Add or update page tests for key visible copy and CTA behavior if current coverage is missing.

### Task 4: Redesign Login And Dashboard Shells

**Files:**
- Modify: `AsistProV4/src/pages/login.tsx`
- Modify: `AsistProV4/src/pages/dashboard.tsx`
- Modify: `AsistProV4/src/components/dashboard/SummaryCard.tsx`
- Modify: `AsistProV4/src/components/dashboard/MonthlyTrendBars.tsx`
- Modify: `AsistProV4/src/components/dashboard/ExpensePieChart.tsx`
- Modify: `AsistProV4/src/components/dashboard/ExpenseCategoriesList.tsx`
- Modify: `AsistProV4/src/components/dashboard/TransactionsList.tsx`
- Modify: `AsistProV4/src/components/dashboard/AppointmentsList.tsx`
- Modify: `AsistProV4/src/components/dashboard/CategoryManager.tsx`

- [ ] Redesign the login page shell without changing OTP behavior.
- [ ] Rebuild dashboard page hierarchy and summary rail treatment.
- [ ] Retheme chart/list/category panels so old orange fragments disappear.
- [ ] Preserve all existing data and filtering behavior.

### Task 5: Retheme Remaining Supporting Surfaces

**Files:**
- Modify: `AsistProV4/src/components/PaymentSuccess.tsx`
- Modify: `AsistProV4/src/components/PaymentFailure.tsx`
- Modify: `AsistProV4/src/components/LegalHeader.tsx`
- Modify: `AsistProV4/src/components/LegalFooter.tsx`
- Modify: `AsistProV4/src/pages/legal/privacy-policy.tsx`
- Modify: `AsistProV4/src/pages/legal/terms-of-service.tsx`

- [ ] Retheme payment success/failure to the approved system.
- [ ] Retheme legal header/footer and article surfaces so they visually belong to the redesigned product.

### Task 6: Verify

**Files:**
- Verify all modified files above

- [ ] Run the focused Vitest suites for shared UI and any added page coverage.
- [ ] Run the full frontend test suite if it remains tractable.
- [ ] Run lint and build if the environment supports them.
- [ ] Manually inspect for leftover hard-coded orange/generic classes and remove them.
