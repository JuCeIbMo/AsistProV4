import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Bot, Phone, ArrowRight, ChevronLeft, MessageCircle, Loader2 } from 'lucide-react';
import { requestOtp, verifyOtp, resendOtp, checkAuth } from '../services/authService';
import { buildWhatsAppOtpRecoveryUrl } from '../config/whatsapp';

/* ────────────────────────────────────────────────────────────
   Login / OTP — reescrito con la identidad de la landing:
   fondo crema cálido (heredado del body), acento naranja,
   display Syne, tarjeta blanca con sombra suave. Mobile-first:
   una sola columna centrada, inputs de 52px+ y un código OTP
   de 6 casillas segmentadas (teclado numérico, pegado y foco
   automático) que se siente nativo en el celular.
──────────────────────────────────────────────────────────── */

/* ── Campo de texto (tema claro, táctil) ─────────────────────── */
const Field = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { icon?: typeof Phone; hasError?: boolean }
>(function Field({ icon: Icon, hasError, className = '', ...props }, ref) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-light-muted pointer-events-none"
          aria-hidden="true"
        />
      )}
      <input
        ref={ref}
        className={[
          'w-full min-h-[54px] rounded-xl border bg-white text-light-text text-base',
          'placeholder:text-light-muted transition-colors duration-200',
          'focus:outline-none focus:border-light-accent focus:ring-2 focus:ring-light-accent/25',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          Icon ? 'pl-12 pr-4' : 'px-4',
          hasError ? 'border-red-400 focus:ring-red-400/25' : 'border-light-border-strong',
          className,
        ].join(' ')}
        {...props}
      />
    </div>
  );
});

/* ── Botón acento (matchea el CTA del hero) ──────────────────── */
function AccentButton({
  loading,
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      className={[
        'u-press w-full min-h-[54px] rounded-xl px-6 font-semibold text-[15px] text-white',
        'bg-light-accent-dark flex items-center justify-center gap-2 cursor-pointer',
        'shadow-[var(--shadow-accent)]',
        'disabled:opacity-45 disabled:cursor-not-allowed disabled:shadow-none',
        className,
      ].join(' ')}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : children}
    </button>
  );
}

/* ── Código OTP: 6 casillas segmentadas ──────────────────────── */
type OtpHandle = { focus: () => void };
const OtpInput = forwardRef<
  OtpHandle,
  {
    value: string;
    onChange: (v: string) => void;
    onComplete?: (v: string) => void;
    disabled?: boolean;
    hasError?: boolean;
  }
>(function OtpInput({ value, onChange, onComplete, disabled, hasError }, ref) {
  const boxes = useRef<(HTMLInputElement | null)[]>([]);
  useImperativeHandle(ref, () => ({ focus: () => boxes.current[0]?.focus() }), []);

  const commit = (chars: string[], focusIdx: number) => {
    const next = chars.join('').replace(/\D/g, '').slice(0, 6);
    onChange(next);
    boxes.current[Math.min(focusIdx, 5)]?.focus();
    if (next.length === 6) onComplete?.(next);
  };

  const handleInput = (i: number, raw: string) => {
    const digits = raw.replace(/\D/g, '');
    const chars = Array.from({ length: 6 }, (_, k) => value[k] ?? '');
    if (!digits) {
      chars[i] = '';
      commit(chars, i);
      return;
    }
    let ci = i;
    for (const d of digits) {
      if (ci > 5) break;
      chars[ci] = d;
      ci += 1;
    }
    commit(chars, ci);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      e.preventDefault();
      boxes.current[i - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && i > 0) {
      boxes.current[i - 1]?.focus();
    } else if (e.key === 'ArrowRight' && i < 5) {
      boxes.current[i + 1]?.focus();
    }
  };

  return (
    <div className="grid grid-cols-6 gap-2 sm:gap-3" role="group" aria-label="Código de verificación">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={el => {
            boxes.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={6}
          value={value[i] ?? ''}
          disabled={disabled}
          aria-label={`Dígito ${i + 1}`}
          onChange={e => handleInput(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onFocus={e => e.target.select()}
          className={[
            'aspect-square w-full rounded-xl border bg-white text-center',
            'font-display text-2xl sm:text-3xl font-bold text-light-text tabular-nums',
            'transition-colors duration-200',
            'focus:outline-none focus:border-light-accent focus:ring-2 focus:ring-light-accent/25',
            'disabled:opacity-50',
            hasError ? 'border-red-400 focus:ring-red-400/25' : 'border-light-border-strong',
          ].join(' ')}
        />
      ))}
    </div>
  );
});

/* ── Aviso de ventana de WhatsApp cerrada ────────────────────── */
function WhatsAppRecovery({ phone }: { phone: string }) {
  return (
    <div className="rounded-xl border border-light-border bg-light-accent-light/60 p-4">
      <p className="text-sm text-light-text leading-relaxed">
        Antes de recibir tu código, primero debes enviarnos un mensaje por WhatsApp para reabrir la
        conversación.
      </p>
      <button
        type="button"
        onClick={() => window.open(buildWhatsAppOtpRecoveryUrl(phone), '_blank')}
        className="u-press mt-3 w-full min-h-[48px] rounded-xl px-5 font-semibold text-sm text-white bg-[#25D366] flex items-center justify-center gap-2 cursor-pointer"
      >
        <MessageCircle className="w-4 h-4" aria-hidden="true" />
        Abrir WhatsApp
      </button>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [checking, setChecking] = useState(true);
  const phoneRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<OtpHandle>(null);
  const whatsappWindowExpired = errorCode === 'WHATSAPP_WINDOW_EXPIRED';

  const clearErrors = () => {
    if (error || errorCode) {
      setError('');
      setErrorCode('');
    }
  };

  useEffect(() => {
    checkAuth().then(res => {
      if (res.ok) {
        router.replace('/dashboard');
      } else {
        setChecking(false);
        phoneRef.current?.focus();
      }
    });
  }, [router]);

  useEffect(() => {
    if (step === 2) setTimeout(() => codeRef.current?.focus(), 100);
  }, [step]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setErrorCode('');
    setLoading(true);
    try {
      const res = await requestOtp(phone);
      if (res.ok) {
        setStep(2);
        setCountdown(60);
      } else {
        setErrorCode(res.code || '');
        setError(res.error || 'No se pudo enviar el código. Intenta de nuevo.');
      }
    } catch {
      setErrorCode('');
      setError('Error de conexión.');
    }
    setLoading(false);
  }

  async function submitVerify(value: string) {
    if (loading) return;
    setError('');
    setErrorCode('');
    setLoading(true);
    try {
      const res = await verifyOtp(phone, value);
      if (res.ok) {
        router.push('/dashboard');
      } else {
        setErrorCode(res.code || '');
        setError(res.error || 'Código incorrecto o expirado.');
        setCode('');
        setTimeout(() => codeRef.current?.focus(), 50);
      }
    } catch {
      setErrorCode('');
      setError('Error de conexión.');
    }
    setLoading(false);
  }

  async function handleResendOtp() {
    setError('');
    setErrorCode('');
    setLoading(true);
    try {
      const res = await resendOtp(phone);
      if (res.ok) {
        setCountdown(60);
        setCode('');
        setTimeout(() => codeRef.current?.focus(), 50);
      } else {
        setErrorCode(res.code || '');
        setError(res.error || 'No se pudo reenviar el código. Intenta de nuevo.');
      }
    } catch {
      setErrorCode('');
      setError('Error de conexión.');
    }
    setLoading(false);
  }

  const stepMeta: Record<1 | 2, { label: string; title: string; copy: ReactNode }> = {
    1: {
      label: 'Paso 1 de 2',
      title: 'Ingresá a tu panel',
      copy: 'Usá tu número de WhatsApp y te enviamos un código de acceso.',
    },
    2: {
      label: 'Paso 2 de 2',
      title: 'Revisá tu WhatsApp',
      copy: (
        <>
          Escribí el código que enviamos a{' '}
          <span className="font-semibold text-light-text">+{phone.replace(/^\+/, '')}</span>.
        </>
      ),
    },
  };
  const meta = stepMeta[step];

  return (
    <>
      <Head>
        <title>AsistPro — Iniciar sesión</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main className="relative min-h-screen flex flex-col items-center justify-center px-5 py-10 sm:py-14">
        {/* Halo cálido detrás de la tarjeta (guiño al hero) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-[min(560px,90vw)] h-[min(560px,90vw)] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.14), transparent 62%)' }}
        />

        <div className="relative w-full max-w-[440px] animate-fade-in-up">
          {/* Marca */}
          <a
            href="/"
            className="u-press flex items-center gap-3 justify-center mb-7 no-underline w-fit mx-auto"
          >
            <span className="w-11 h-11 rounded-2xl bg-light-accent text-white flex items-center justify-center shadow-[var(--shadow-accent)]">
              <Bot className="w-6 h-6" aria-hidden="true" />
            </span>
            <span className="font-display text-[26px] font-extrabold tracking-[-0.02em] text-light-text">
              AsistPro
            </span>
          </a>

          {/* Tarjeta */}
          <div className="rounded-[1.75rem] bg-white border border-light-border shadow-md p-6 sm:p-8">
            {/* Progreso segmentado */}
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              <span className="h-1.5 rounded-full bg-light-accent" />
              <span
                className={`h-1.5 rounded-full transition-colors duration-300 ${
                  step === 2 ? 'bg-light-accent' : 'bg-light-elevated'
                }`}
              />
            </div>

            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-light-muted">
              {meta.label}
            </p>
            <h1 className="mt-2 font-display text-[30px] sm:text-4xl font-extrabold tracking-[-0.02em] leading-[1.05] text-light-text text-balance">
              {meta.title}
            </h1>
            <p className="mt-2.5 text-[15px] text-light-secondary leading-relaxed">{meta.copy}</p>

            <div className="mt-7">
              {checking ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-light-accent animate-spin mb-4" aria-hidden="true" />
                  <p className="text-sm text-light-secondary">Verificando sesión…</p>
                </div>
              ) : step === 1 ? (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold text-light-text"
                    >
                      Número de WhatsApp
                    </label>
                    <Field
                      ref={phoneRef}
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      value={phone}
                      onChange={e => {
                        setPhone(e.target.value);
                        clearErrors();
                      }}
                      placeholder="+591 70 000 000"
                      autoComplete="tel"
                      disabled={loading}
                      icon={Phone}
                      hasError={Boolean(error) && !whatsappWindowExpired}
                    />
                    {error && !whatsappWindowExpired && (
                      <p className="text-sm text-red-500" role="alert">
                        {error}
                      </p>
                    )}
                  </div>

                  {whatsappWindowExpired && <WhatsAppRecovery phone={phone} />}

                  <AccentButton type="submit" loading={loading} disabled={!phone.trim()}>
                    Enviar código
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </AccentButton>
                </form>
              ) : (
                <form onSubmit={e => e.preventDefault()} className="space-y-4">
                  <div className="space-y-3">
                    <OtpInput
                      ref={codeRef}
                      value={code}
                      onChange={v => {
                        setCode(v);
                        clearErrors();
                      }}
                      onComplete={submitVerify}
                      disabled={loading}
                      hasError={Boolean(error) && !whatsappWindowExpired}
                    />
                    {error && !whatsappWindowExpired && (
                      <p className="text-sm text-red-500 text-center" role="alert">
                        {error}
                      </p>
                    )}
                  </div>

                  {whatsappWindowExpired && <WhatsAppRecovery phone={phone} />}

                  <AccentButton
                    type="button"
                    onClick={() => submitVerify(code)}
                    loading={loading}
                    disabled={code.length < 6}
                  >
                    Abrir panel
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </AccentButton>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || loading}
                    className="w-full min-h-[44px] rounded-xl text-sm font-semibold text-light-accent-dark hover:bg-light-accent-light/60 transition-colors disabled:text-light-muted disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer"
                  >
                    {countdown > 0 ? `Reenviar en ${countdown}s` : 'Reenviar código'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setCode('');
                      setError('');
                      setErrorCode('');
                      setCountdown(0);
                    }}
                    className="w-full py-2 text-sm text-light-muted hover:text-light-secondary transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    Cambiar número
                  </button>
                </form>
              )}
            </div>
          </div>

          <p className="text-center text-[15px] text-light-secondary mt-6">
            ¿No tenés cuenta?{' '}
            <a href="/#pricing" className="font-semibold text-light-accent-dark hover:underline">
              Probá gratis
            </a>
          </p>
          <p className="text-center text-xs text-light-muted mt-3">
            Sesión válida 7 días · el código expira en 10 minutos
          </p>
        </div>
      </main>
    </>
  );
}
