import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Bot, Phone, ArrowRight, Loader2, ChevronLeft } from 'lucide-react';
import { requestOtp, verifyOtp, setToken, isAuthenticated } from '../services/authService';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep]       = useState<1 | 2>(1);
  const [phone, setPhone]     = useState('');
  const [code, setCode]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const phoneRef = useRef<HTMLInputElement>(null);
  const codeRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuthenticated()) router.replace('/dashboard');
    else phoneRef.current?.focus();
  }, []);

  useEffect(() => {
    if (step === 2) setTimeout(() => codeRef.current?.focus(), 100);
  }, [step]);

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await requestOtp(phone);
      if (res.ok) {
        setStep(2);
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
      if (res.ok && res.token) {
        setToken(res.token);
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

  return (
    <>
      <Head>
        <title>AsistPro — Iniciar sesión</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen bg-[#0c0c12] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-orange-500/[0.06] blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-orange-400/[0.04] blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-sm">

          {/* Card */}
          <div className="bg-[#13131c] border border-white/[0.07] rounded-3xl overflow-hidden shadow-2xl">

            {/* Orange accent line */}
            <div className="h-1 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400" />

            <div className="p-8">

              {/* Logo */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 shadow-lg shadow-orange-500/25 mb-4">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h1 className="font-display text-2xl font-bold text-white tracking-tight">
                  AsistPro
                </h1>
                <p className="text-gray-500 text-sm mt-1">
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
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Número de WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input
                        ref={phoneRef}
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+591 70 000 000"
                        autoComplete="tel"
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/60 focus:bg-white/[0.07] transition text-sm"
                      />
                    </div>
                    {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !phone.trim()}
                    className="w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed bg-orange-500 hover:bg-orange-400 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                    ) : (
                      <>Enviar código <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Código de verificación
                    </label>
                    <p className="text-gray-500 text-xs mb-3">
                      Enviado a <span className="text-gray-300">+{phone.replace(/^\+/, '')}</span> por WhatsApp
                    </p>
                    <input
                      ref={codeRef}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={code}
                      onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      autoComplete="one-time-code"
                      disabled={loading}
                      className="w-full px-4 py-4 bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-gray-700 focus:outline-none focus:border-orange-500/60 focus:bg-white/[0.07] transition text-3xl tracking-[0.7em] text-center font-mono"
                    />
                    {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={loading || code.length < 6}
                    className="w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed bg-orange-500 hover:bg-orange-400 text-white shadow-lg shadow-orange-500/20"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Verificando...</>
                    ) : (
                      <>Ingresar al panel <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStep(1); setCode(''); setError(''); }}
                    className="w-full py-2 text-xs text-gray-600 hover:text-gray-400 transition flex items-center justify-center gap-1"
                  >
                    <ChevronLeft className="w-3 h-3" /> Cambiar número
                  </button>
                </form>
              )}

            </div>
          </div>

          <p className="text-center text-xs text-gray-700 mt-5">
            Sesión válida 7 días · Código expira en 10 min
          </p>

        </div>
      </div>
    </>
  );
}
