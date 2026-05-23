import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Bot, Phone, ArrowRight, ChevronLeft } from 'lucide-react';
import { requestOtp, verifyOtp, resendOtp } from '../services/authService';
import { TextInput } from '../components/ui/TextInput';
import { Button } from '../components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep]       = useState<1 | 2>(1);
  const [phone, setPhone]     = useState('');
  const [code, setCode]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [countdown, setCountdown] = useState(0);
  const phoneRef = useRef<HTMLInputElement>(null);
  const codeRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    phoneRef.current?.focus();
  }, []);

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
    setLoading(true);
    try {
      const res = await requestOtp(phone);
      if (res.ok) {
        setStep(2);
        setCountdown(60);
      } else {
        setError(res.error || 'No se pudo enviar el código. Intenta de nuevo.');
      }
    } catch {
      setError('Error de conexión.');
    }
    setLoading(false);
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await verifyOtp(phone, code);
      if (res.ok) {
        router.push('/dashboard');
      } else {
        setError(res.error || 'Código incorrecto o expirado.');
        setCode('');
        setTimeout(() => codeRef.current?.focus(), 50);
      }
    } catch {
      setError('Error de conexión.');
    }
    setLoading(false);
  }

  async function handleResendOtp() {
    setError('');
    setLoading(true);
    try {
      const res = await resendOtp(phone);
      if (res.ok) {
        setCountdown(60);
        setCode('');
        setTimeout(() => codeRef.current?.focus(), 50);
      } else {
        setError(res.error || 'No se pudo reenviar el código. Intenta de nuevo.');
      }
    } catch {
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

      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4 relative overflow-x-hidden">
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-orange-500/[0.06] blur-[140px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-orange-400/[0.04] blur-[120px] pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 w-full max-w-sm">

          {/* Card */}
          <div className="bg-dark-card border border-dark-border rounded-3xl overflow-hidden shadow-2xl">

            {/* Orange accent line */}
            <div className="h-1 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400" />

            <div className="p-8">

              {/* Logo */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 shadow-lg shadow-orange-500/25 mb-4">
                  <Bot className="w-8 h-8 text-white" aria-hidden="true" />
                </div>
                <h1 className="font-display text-2xl font-bold text-dark-text-primary tracking-tight">
                  AsistPro
                </h1>
                <p className="text-dark-secondary text-sm mt-1">
                  {step === 1 ? 'Ingresa tu número de WhatsApp' : 'Verifica tu identidad'}
                </p>
              </div>

              {/* Step dots */}
              <div className="flex gap-2 mb-7">
                <div className="flex-1 h-0.5 rounded-full bg-orange-500 transition-colors" />
                <div className={`flex-1 h-0.5 rounded-full transition-colors duration-300 ${step === 2 ? 'bg-orange-500' : 'bg-white/10'}`} />
              </div>

              {/* Step 1 */}
              {step === 1 && (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <TextInput
                    ref={phoneRef}
                    label="Número de WhatsApp"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+591 70 000 000"
                    autoComplete="tel"
                    disabled={loading}
                    icon={Phone}
                    error={error || undefined}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    disabled={!phone.trim()}
                    className="w-full"
                  >
                    {!loading && (
                      <>Enviar código <ArrowRight className="w-4 h-4" aria-hidden="true" /></>
                    )}
                  </Button>
                </form>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-dark-secondary uppercase tracking-wider mb-2">
                      Código de verificación
                    </label>
                    <p className="text-dark-secondary text-xs mb-3">
                      Enviado a <span className="text-dark-text">+{phone.replace(/^\+/, '')}</span> por WhatsApp
                    </p>
                    <TextInput
                      ref={codeRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={code}
                      onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      autoComplete="one-time-code"
                      disabled={loading}
                      className="text-2xl sm:text-3xl tracking-[0.3em] sm:tracking-[0.5em] md:tracking-[0.7em] text-center font-mono py-4 min-h-[52px]"
                      error={error || undefined}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    disabled={code.length < 6}
                    className="w-full"
                  >
                    {!loading && (
                      <>Ingresar al panel <ArrowRight className="w-4 h-4" aria-hidden="true" /></>
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
                    onClick={() => { setStep(1); setCode(''); setError(''); setCountdown(0); }}
                    className="w-full py-2 text-xs text-dark-muted hover:text-dark-secondary transition flex items-center justify-center gap-1"
                  >
                    <ChevronLeft className="w-3 h-3" aria-hidden="true" /> Cambiar número
                  </button>
                </form>
              )}

            </div>
          </div>

          <p className="text-center text-xs text-dark-muted-dim mt-5">
            Sesión válida 7 días · Código expira en 10 min
          </p>

        </div>
      </div>
    </>
  );
}
