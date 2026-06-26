import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Bot, Phone, ArrowRight, ChevronLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { requestOtp, verifyOtp, resendOtp, checkAuth } from '../services/authService';
import { TextInput } from '../components/ui/TextInput';
import { Button } from '../components/ui/Button';
import { buildWhatsAppOtpRecoveryUrl } from '../config/whatsapp';

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
  const codeRef = useRef<HTMLInputElement>(null);
  const whatsappWindowExpired = errorCode === 'WHATSAPP_WINDOW_EXPIRED';

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

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setErrorCode('');
    setLoading(true);
    try {
      const res = await verifyOtp(phone, code);
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

  return (
    <>
      <Head>
        <title>AsistPro — Iniciar sesión</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen bg-dark-bg text-dark-text overflow-x-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(182,138,62,0.16),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(93,133,179,0.12),transparent_22%)]" aria-hidden="true" />

        <div className="relative z-10 min-h-screen grid lg:grid-cols-[0.95fr_1.05fr]">
          <section className="hidden lg:flex border-r border-dark-border p-10 xl:p-14">
            <div className="max-w-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-dark-accent text-dark-bg flex items-center justify-center">
                    <Bot className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-display text-3xl text-dark-text-primary">AsistPro</p>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-dark-secondary">
                      Access checkpoint
                    </p>
                  </div>
                </div>

                <div className="mt-16">
                  <div className="editorial-kicker !text-dark-accent-dark before:!bg-current">Ingreso seguro</div>
                  <h1 className="mt-5 font-display text-5xl xl:text-6xl leading-[0.95] text-dark-text-primary">
                    Entrá al panel con un flujo simple y sin ruido.
                  </h1>
                  <p className="mt-6 text-lg text-dark-secondary leading-relaxed">
                    El acceso sigue siendo por OTP de WhatsApp, pero ahora vive dentro de una experiencia más clara, más sobria y mejor jerarquizada.
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {[
                  ['Confirmación por WhatsApp', 'Un código corto, una sola acción y foco inmediato.'],
                  ['Sesión de 7 días', 'Persistencia suficiente para uso real sin fricción excesiva.'],
                  ['Interfaz más legible', 'Tipografía, color y progresión pensadas como producto, no como plantilla.'],
                ].map(([title, copy]) => (
                  <div key={title} className="section-frame rounded-2xl bg-dark-card/70 p-5">
                    <p className="text-sm font-semibold text-dark-text-primary">{title}</p>
                    <p className="mt-2 text-sm text-dark-secondary">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center p-4 sm:p-6 lg:p-10">
            <div className="w-full max-w-xl">
              <div className="section-frame rounded-[2rem] bg-dark-card/92 p-6 sm:p-8 lg:p-10 shadow-2xl shadow-black/30">
                <div className="flex items-start justify-between gap-4 mb-8">
                  <div>
                    <div className="editorial-kicker !text-dark-accent-dark before:!bg-current">
                      {step === 1 ? 'Identidad' : 'Verificación'}
                    </div>
                    <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-none text-dark-text-primary">
                      {step === 1 ? 'Ingresar' : 'Confirmar código'}
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-dark-secondary max-w-md">
                      {step === 1
                        ? 'Usá tu número de WhatsApp para recibir el código de acceso.'
                        : 'Escribí el código recibido para abrir el panel.'}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl border border-dark-border bg-dark-bg flex items-center justify-center text-dark-accent-dark">
                    {step === 1 ? <Sparkles className="w-5 h-5" aria-hidden="true" /> : <ShieldCheck className="w-5 h-5" aria-hidden="true" />}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="rounded-full h-1.5 bg-dark-accent" />
                  <div className={`rounded-full h-1.5 transition-colors ${step === 2 ? 'bg-dark-accent' : 'bg-dark-elevated'}`} />
                </div>

                {checking ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-9 h-9 border-2 border-dark-accent/30 border-t-dark-accent rounded-full animate-spin mb-4" />
                    <p className="text-sm text-dark-secondary">Verificando sesión...</p>
                  </div>
                ) : (
                  <>
                    {step === 1 && (
                      <form onSubmit={handleRequestOtp} className="space-y-5">
                        <TextInput
                          ref={phoneRef}
                          label="Número de WhatsApp"
                          type="tel"
                          value={phone}
                          onChange={e => {
                            setPhone(e.target.value);
                            if (error || errorCode) {
                              setError('');
                              setErrorCode('');
                            }
                          }}
                          placeholder="+591 70 000 000"
                          autoComplete="tel"
                          disabled={loading}
                          icon={Phone}
                          error={!whatsappWindowExpired ? error || undefined : undefined}
                        />
                        {whatsappWindowExpired && (
                          <div className="section-frame rounded-2xl bg-dark-card/70 p-4">
                            <p className="text-sm text-dark-text-primary">
                              Antes de recibir tu código, primero debes enviarnos un mensaje por WhatsApp para reabrir la conversación.
                            </p>
                            <Button
                              type="button"
                              variant="secondary"
                              className="w-full mt-3"
                              onClick={() => window.open(buildWhatsAppOtpRecoveryUrl(phone), '_blank')}
                            >
                              Abrir WhatsApp
                            </Button>
                          </div>
                        )}
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          loading={loading}
                          disabled={!phone.trim()}
                          className="w-full"
                        >
                          {!loading && (
                            <>
                              Enviar código
                              <ArrowRight className="w-4 h-4" aria-hidden="true" />
                            </>
                          )}
                        </Button>
                      </form>
                    )}

                    {step === 2 && (
                      <form onSubmit={handleVerifyOtp} className="space-y-5">
                        <div>
                          <label className="block text-[11px] font-semibold text-dark-secondary uppercase tracking-[0.22em] mb-2">
                            Código de verificación
                          </label>
                          <p className="text-dark-secondary text-xs mb-3">
                            Enviado a <span className="text-dark-text-primary">+{phone.replace(/^\+/, '')}</span>
                          </p>
                          <TextInput
                            ref={codeRef}
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={code}
                            onChange={e => {
                              setCode(e.target.value.replace(/\D/g, ''));
                              if (error || errorCode) {
                                setError('');
                                setErrorCode('');
                              }
                            }}
                            placeholder="000000"
                            autoComplete="one-time-code"
                            disabled={loading}
                            className="text-2xl sm:text-3xl tracking-[0.3em] sm:tracking-[0.55em] text-center font-mono"
                            error={!whatsappWindowExpired ? error || undefined : undefined}
                          />
                        </div>

                        {whatsappWindowExpired && (
                          <div className="section-frame rounded-2xl bg-dark-card/70 p-4">
                            <p className="text-sm text-dark-text-primary">
                              Antes de recibir tu código, primero debes enviarnos un mensaje por WhatsApp para reabrir la conversación.
                            </p>
                            <Button
                              type="button"
                              variant="secondary"
                              className="w-full mt-3"
                              onClick={() => window.open(buildWhatsAppOtpRecoveryUrl(phone), '_blank')}
                            >
                              Abrir WhatsApp
                            </Button>
                          </div>
                        )}

                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          loading={loading}
                          disabled={code.length < 6}
                          className="w-full"
                        >
                          {!loading && (
                            <>
                              Abrir panel
                              <ArrowRight className="w-4 h-4" aria-hidden="true" />
                            </>
                          )}
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleResendOtp}
                          disabled={countdown > 0 || loading}
                          className="w-full"
                        >
                          {countdown > 0 ? `Reenviar en ${countdown}s` : 'Reenviar código'}
                        </Button>

                        <button
                          type="button"
                          onClick={() => {
                            setStep(1);
                            setCode('');
                            setError('');
                            setErrorCode('');
                            setCountdown(0);
                          }}
                          className="w-full py-2 text-xs text-dark-muted hover:text-dark-secondary transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ChevronLeft className="w-3 h-3" aria-hidden="true" />
                          Cambiar número
                        </button>
                      </form>
                    )}
                  </>
                )}
              </div>

              <p className="text-center text-xs uppercase tracking-[0.18em] text-dark-muted mt-5">
                Sesión válida 7 días · Código expira en 10 minutos
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
