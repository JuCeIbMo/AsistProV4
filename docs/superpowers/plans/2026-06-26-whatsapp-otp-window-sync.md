# WhatsApp OTP Window Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Block web OTP sends when the WhatsApp conversation window is stale, while giving the user a direct WhatsApp CTA and keeping the source of truth in `asistpro-back`.

**Architecture:** `aicore` remains the inbound WhatsApp owner and emits a lightweight sync call to `asistpro-back` every time a real inbound or outbound message is processed. `asistpro-back` stores only the minimal message-window projection it needs (`last_inbound_at`, optionally `last_outbound_at`) and enforces the `23h58m` OTP rule. `AsistProV4` consumes a structured backend error code and swaps the generic OTP error for a targeted WhatsApp CTA state.

**Tech Stack:** FastAPI, SQLAlchemy, Alembic-style SQL migrations, Next.js, React 18, TypeScript, Vitest, Testing Library, WhatsApp `wa.me` deep links

---

### External Contract: `aicore`

**Purpose:** Keep `asistpro-back` synchronized with WhatsApp activity without forcing the OTP flow to query `aicore` storage directly.

**Inbound sync request:**

```http
POST /internal/whatsapp/message-touch
X-Internal-Api-Key: <asistpro-back internal key>
Content-Type: application/json
```

```json
{
  "phone": "59170000000",
  "direction": "inbound",
  "occurred_at": "2026-06-26T14:32:10Z",
  "message_id": "wamid.HBgL..."
}
```

**Outbound sync request:**

```json
{
  "phone": "59170000000",
  "direction": "outbound",
  "occurred_at": "2026-06-26T14:33:02Z",
  "message_id": "wamid.HBgL..."
}
```

**Expected response:**

```json
{
  "ok": true
}
```

**Rules for `aicore`:**
- Call the sync endpoint once for every real inbound WhatsApp message that reaches normal processing.
- Call the sync endpoint once for every real outbound WhatsApp message accepted for delivery if you want full conversation observability.
- Send `occurred_at` from the provider event time when available; fall back to `now()` in `aicore` only if the provider payload has no timestamp.
- Log non-2xx responses, but do not block the user-facing AI response on this sync call.
- Retry only transient failures; do not create an infinite retry loop on permanent 4xx responses.
- Use the same normalized phone format that `asistpro-back` expects for OTP (`591...`, without `+`).

### Task 1: Add Message Window State To `asistpro-back`

**Files:**
- Modify: `../asistpro-back/app/models.py`
- Create: `../asistpro-back/supabase/migrations/202606260001_whatsapp_message_window.sql`
- Test: `../asistpro-back/tests/test_api.py`

- [ ] **Step 1: Write the failing backend tests for the new projection fields and OTP window rule**
  Add tests in `../asistpro-back/tests/test_api.py` covering:
  - OTP request returns `200` when `last_inbound_at` is within `23h58m`.
  - OTP request returns `409` with code `WHATSAPP_WINDOW_EXPIRED` when `last_inbound_at` is missing.
  - OTP request returns `409` with code `WHATSAPP_WINDOW_EXPIRED` when `last_inbound_at` is older than `23h58m`.
  - Internal sync endpoint updates `last_inbound_at` for `direction = inbound`.
  - Internal sync endpoint updates `last_outbound_at` for `direction = outbound`.

- [ ] **Step 2: Run the focused backend tests and verify they fail for the right reason**
  Run:
  ```bash
  pytest ../asistpro-back/tests/test_api.py -k "otp or message_touch" -v
  ```
  Expected:
  - Failing assertions because the sync endpoint and timestamp fields do not exist yet.

- [ ] **Step 3: Extend the backend identity model with message-window timestamps**
  Add nullable timestamp fields on `ChannelIdentity` in `../asistpro-back/app/models.py`:
  ```python
  last_inbound_at = Column(DateTime, nullable=True)
  last_outbound_at = Column(DateTime, nullable=True)
  ```
  Create a migration in `../asistpro-back/supabase/migrations/202606260001_whatsapp_message_window.sql`:
  ```sql
  alter table if exists channel_identities
    add column if not exists last_inbound_at timestamp null,
    add column if not exists last_outbound_at timestamp null;

  create index if not exists ix_channel_identities_channel_external_user
    on channel_identities (channel, external_user_id);
  ```

- [ ] **Step 4: Re-run the focused backend tests to keep the red/green cycle honest**
  Run:
  ```bash
  pytest ../asistpro-back/tests/test_api.py -k "otp or message_touch" -v
  ```
  Expected:
  - Still failing, now only because the route and OTP enforcement are missing.

### Task 2: Add The Sync Endpoint And OTP Enforcement In `asistpro-back`

**Files:**
- Modify: `../asistpro-back/app/web/auth.py`
- Modify: `../asistpro-back/app/web/router.py`
- Modify: `../asistpro-back/app/schemas.py`
- Modify: `../asistpro-back/tests/test_api.py`

- [ ] **Step 1: Add a schema for the internal WhatsApp sync payload**
  In `../asistpro-back/app/schemas.py`, add a small request model:
  ```python
  class WhatsAppMessageTouch(BaseModel):
      phone: str
      direction: Literal["inbound", "outbound"]
      occurred_at: datetime
      message_id: str | None = None
  ```

- [ ] **Step 2: Implement the message-touch route protected by the internal API key**
  In `../asistpro-back/app/web/router.py`, add:
  ```python
  @router.post("/internal/whatsapp/message-touch", include_in_schema=False)
  def whatsapp_message_touch(
      payload: WhatsAppMessageTouch,
      request: Request,
      session: Session = Depends(get_session),
      _: None = Depends(require_internal_key),
  ):
      phone = normalize_phone(payload.phone)
      if not validate_phone(phone):
          return JSONResponse({"ok": False, "error": "Número de teléfono inválido."}, status_code=422)

      profile = ensure_profile_for_identity(
          session=session,
          channel="whatsapp",
          external_user_id=phone,
          default_currency=request.app.state.settings.default_currency,
          default_timezone=request.app.state.settings.default_timezone,
      )
      identity = next(i for i in profile.identities if i.channel == "whatsapp" and i.external_user_id == phone)
      if payload.direction == "inbound":
          identity.last_inbound_at = payload.occurred_at
      else:
          identity.last_outbound_at = payload.occurred_at
      session.commit()
      return JSONResponse({"ok": True})
  ```

- [ ] **Step 3: Enforce the `23h58m` inbound window before sending OTP**
  In `../asistpro-back/app/web/auth.py`, add a helper like:
  ```python
  _OTP_WHATSAPP_WINDOW = timedelta(hours=23, minutes=58)

  def ensure_recent_whatsapp_inbound(session: Session, phone: str) -> None:
      identity = (
          session.query(ChannelIdentity)
          .filter(ChannelIdentity.channel == "whatsapp", ChannelIdentity.external_user_id == phone)
          .one_or_none()
      )
      if identity is None or identity.last_inbound_at is None:
          raise HTTPException(
              status_code=409,
              detail={"code": "WHATSAPP_WINDOW_EXPIRED", "error": "Antes de recibir tu código, primero envíanos un mensaje por WhatsApp."},
          )
      if utcnow() - identity.last_inbound_at > _OTP_WHATSAPP_WINDOW:
          raise HTTPException(
              status_code=409,
              detail={"code": "WHATSAPP_WINDOW_EXPIRED", "error": "Antes de recibir tu código, primero envíanos un mensaje por WhatsApp."},
          )
  ```
  Then call it at the start of `request_otp(...)` before rate-limit and before `send_otp_via_n8n(...)`.

- [ ] **Step 4: Preserve the existing web response shape while adding `code`**
  In `../asistpro-back/app/web/router.py`, update the OTP request exception path so dict-shaped details survive:
  ```python
  except HTTPException as exc:
      detail = exc.detail
      if isinstance(detail, dict):
          return JSONResponse({"ok": False, **detail}, status_code=exc.status_code)
      return JSONResponse({"ok": False, "error": detail}, status_code=exc.status_code)
  ```

- [ ] **Step 5: Run the focused backend tests and verify they pass**
  Run:
  ```bash
  pytest ../asistpro-back/tests/test_api.py -k "otp or message_touch" -v
  ```
  Expected:
  - PASS for the new OTP-window and message-touch cases.

### Task 3: Teach `AsistProV4` To Render The WhatsApp CTA State

**Files:**
- Modify: `AsistProV4/src/services/authService.ts`
- Modify: `AsistProV4/src/pages/login.tsx`
- Modify: `AsistProV4/src/config/whatsapp.ts`
- Modify: `AsistProV4/src/__tests__/otp-resend.test.tsx`

- [ ] **Step 1: Write the failing frontend tests for the new backend error code**
  Add tests in `AsistProV4/src/__tests__/otp-resend.test.tsx` for:
  - Initial OTP request with `{ ok: false, code: 'WHATSAPP_WINDOW_EXPIRED' }` shows the specialized explanation and CTA button.
  - Resend OTP with the same code shows the same CTA state.
  - Clicking the CTA opens WhatsApp for the entered phone if present, otherwise falls back to the central support number.

- [ ] **Step 2: Run the focused frontend tests and verify they fail**
  Run:
  ```bash
  npm test -- --run src/__tests__/otp-resend.test.tsx
  ```
  Expected:
  - Failing assertions because the auth service drops `code` and the login page has no CTA branch.

- [ ] **Step 3: Extend the auth service response type to preserve backend `code`**
  In `AsistProV4/src/services/authService.ts`, replace the narrow result type with:
  ```ts
  type ApiResult = { ok: boolean; error?: string; code?: string };
  ```
  Keep `requestOtp`, `verifyOtp`, and `resendOtp` returning that richer shape.

- [ ] **Step 4: Add a WhatsApp deep link helper for this OTP recovery path**
  In `AsistProV4/src/config/whatsapp.ts`, add:
  ```ts
  export function buildWhatsAppOtpRecoveryUrl(phone?: string) {
    const normalized = (phone || '').replace(/[^\d]/g, '');
    const text = 'Hola, quiero reabrir la conversación para recibir mi código de acceso.';
    return buildWhatsAppUrl(normalized ? `Mi número es ${normalized}.\n${text}` : text);
  }
  ```

- [ ] **Step 5: Render a dedicated OTP-window-expired panel in the login page**
  In `AsistProV4/src/pages/login.tsx`:
  - Track a derived flag like `const whatsappWindowExpired = errorCode === 'WHATSAPP_WINDOW_EXPIRED';`
  - Reset that code when the user changes phone, retries, or goes back.
  - Under both OTP request and resend failures, show:
  ```tsx
  <div className="section-frame rounded-2xl bg-dark-card/70 p-4">
    <p className="text-sm text-dark-text-primary">
      Antes de recibir tu código, primero debes enviarnos un mensaje por WhatsApp para reabrir la conversación.
    </p>
    <Button
      type="button"
      variant="secondary"
      onClick={() => window.open(buildWhatsAppOtpRecoveryUrl(phone), '_blank')}
      className="w-full mt-3"
    >
      Abrir WhatsApp
    </Button>
  </div>
  ```
  Keep the existing inline `TextInput` error only for generic failures.

- [ ] **Step 6: Re-run the focused frontend tests and verify they pass**
  Run:
  ```bash
  npm test -- --run src/__tests__/otp-resend.test.tsx
  ```
  Expected:
  - PASS for the specialized OTP window UX.

### Task 4: End-To-End Verification

**Files:**
- Verify all modified files above

- [ ] **Step 1: Backend smoke test with a fresh identity**
  Run a manual sequence:
  1. `POST /auth/otp/request` for a phone with no `last_inbound_at`
  2. Expect `409` with `code = WHATSAPP_WINDOW_EXPIRED`
  3. `POST /internal/whatsapp/message-touch` with `direction = inbound`
  4. Retry `POST /auth/otp/request`
  5. Expect `200` and new OTP row

- [ ] **Step 2: Frontend smoke test in the login page**
  Verify manually:
  - Enter phone
  - Trigger blocked OTP response
  - See the WhatsApp explanation
  - Click CTA
  - Confirm `wa.me` opens with the recovery text

- [ ] **Step 3: `aicore` integration smoke test**
  Verify from logs or tracing:
  - Inbound message reaches `aicore`
  - `aicore` sends `message-touch`
  - `asistpro-back` stores `last_inbound_at`
  - Subsequent OTP request succeeds inside the window

- [ ] **Step 4: Commit in small slices**
  Suggested commit boundaries:
  ```bash
  git -C ../asistpro-back add app/models.py app/web/auth.py app/web/router.py app/schemas.py supabase/migrations/202606260001_whatsapp_message_window.sql tests/test_api.py
  git -C ../asistpro-back commit -m "sync whatsapp message window for otp"
  ```
  ```bash
  git add src/services/authService.ts src/pages/login.tsx src/config/whatsapp.ts src/__tests__/otp-resend.test.tsx docs/superpowers/plans/2026-06-26-whatsapp-otp-window-sync.md
  git commit -m "handle whatsapp otp window errors in login"
  ```
