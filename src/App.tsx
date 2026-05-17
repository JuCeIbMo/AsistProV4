import { useState, useEffect, useRef } from 'react';
import PricingModal from './components/PricingModal';
import ActivityTicker from './components/ActivityTicker';
import {
  MessageCircle, Check, Star, Bot, Mic, Users, Clock, Shield,
  Menu, X, Phone, Video, MoreVertical, Send, Calendar, Wallet,
  BarChart3, ChevronRight, Zap,
} from 'lucide-react';

// ── Scroll Reveal hook ──────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ── Stat Counter component ──────────────────────────────────────
function StatCounter({
  value, prefix = '', suffix = '', label,
}: { value: number; prefix?: string; suffix?: string; label: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const dur = 1500, t0 = Date.now();
    const raf = () => {
      const p = Math.min((Date.now() - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(e * value));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [started, value]);

  const fmt = count >= 1000 ? count.toLocaleString('es-AR') : String(count);

  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-4xl lg:text-5xl font-bold text-[#1C1209] mb-1">
        {prefix}{fmt}{suffix}
      </p>
      <p className="text-[#9E948C] text-sm font-medium">{label}</p>
    </div>
  );
}

// ── Chat messages for animated mockup ──────────────────────────
const CHAT = [
  { side: 'user', text: 'Hola! Recordame agendar reunión con cliente mañana a las 3pm', time: '14:32' },
  { side: 'bot',  text: '✅ Perfecto! He agendado tu reunión para mañana 15:00. También creé un recordatorio 30 minutos antes.', time: '14:32' },
  { side: 'user', text: 'Genial! También registra que gasté $2500 en almuerzo', time: '14:35' },
  { side: 'bot',  text: '💰 Registrado! Gasto de $2.500 en categoría "Alimentación". Tu presupuesto mensual va en 65%.', time: '14:35' },
  { side: 'user', text: 'Dame un resumen de gastos del mes', time: '14:36' },
  { side: 'bot',  text: '📊 Resumen de abril: Total $28.450. Alimentación 42%, Transporte 23%, Servicios 18%.', time: '14:36' },
] as const;

// ── Main component ──────────────────────────────────────────────
function App() {
  const [isMenuOpen,    setIsMenuOpen]    = useState(false);
  const [isAnnual,      setIsAnnual]      = useState(false);
  const [modalOpen,     setModalOpen]     = useState(false);
  const [selectedPlan,  setSelectedPlan]  = useState<any>(null);
  const [scrolled,      setScrolled]      = useState(false);
  const [visibleCount,  setVisibleCount]  = useState(0);
  const [isTyping,      setIsTyping]      = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useScrollReveal();

  // Nav blur on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Animated WhatsApp mockup
  useEffect(() => {
    function show(index: number) {
      if (index >= CHAT.length) {
        timerRef.current = setTimeout(() => {
          setVisibleCount(0);
          setIsTyping(false);
          timerRef.current = setTimeout(() => show(0), 700);
        }, 5000);
        return;
      }
      if (CHAT[index].side === 'bot') {
        setIsTyping(true);
        timerRef.current = setTimeout(() => {
          setIsTyping(false);
          setVisibleCount(index + 1);
          timerRef.current = setTimeout(() => show(index + 1), 1100);
        }, 1200);
      } else {
        setVisibleCount(index + 1);
        timerRef.current = setTimeout(() => show(index + 1), 750);
      }
    }
    timerRef.current = setTimeout(() => show(0), 900);
    return () => clearTimeout(timerRef.current);
  }, []);

  const features = [
    { icon: <Calendar className="w-5 h-5 text-orange-500" />, title: 'Programación de Citas', description: 'Agenda automáticamente tus reuniones y citas a través de WhatsApp con comandos naturales.' },
    { icon: <Wallet   className="w-5 h-5 text-orange-500" />, title: 'Gestión Financiera',    description: 'Registra tus gastos e ingresos automáticamente y mantén control de tu dinero.' },
    { icon: <BarChart3 className="w-5 h-5 text-orange-500" />, title: 'Informes Inteligentes', description: 'Genera reportes detallados sobre tus gastos y patrones financieros.' },
    { icon: <Mic      className="w-5 h-5 text-orange-500" />, title: 'Reconocimiento de Voz',  description: 'Habla naturalmente y AsistPro entenderá tus notas de voz perfectamente.' },
  ];

  const testimonials = [
    { name: 'María González', role: 'Empresaria',  initials: 'MG', content: 'AsistPro revolucionó mi organización diaria. Ahora nunca olvido una cita y tengo control total de mis gastos.', rating: 5 },
    { name: 'Carlos Rodríguez', role: 'Freelancer', initials: 'CR', content: 'La integración con WhatsApp es perfecta. Puedo gestionar todo mi negocio desde una sola conversación.', rating: 5 },
    { name: 'Ana Martín',   role: 'Consultora',    initials: 'AM', content: 'Los informes financieros me ayudaron a identificar patrones de gasto que no veía antes. Increíble herramienta.', rating: 5 },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      monthlyPrice: 'ARS $3.999', annualPrice: 'ARS $39.990',
      period: isAnnual ? 'por año' : 'por mes',
      savings: isAnnual ? 'Ahorra ARS $7.998' : null,
      description: 'Ideal para quienes quieren comenzar a organizarse',
      features: ['40 recordatorios por mes','Reconocimiento de notas de voz','Recordatorios recurrentes','Creación de listas'],
      notIncluded: ['Múltiples recordatorios en un solo mensaje','Acceso anticipado a nuevas funciones','Respuestas del asistente por audio','Google Calendar','Finanzas personales'],
      cardClass: 'bg-white border border-[#1C1209]/[0.08]',
      buttonClass: 'bg-[#F3EFE8] hover:bg-[#EAE5DC] text-[#1C1209]',
    },
    {
      name: 'Pro',
      monthlyPrice: 'ARS $5.999', annualPrice: 'ARS $59.990',
      period: isAnnual ? 'por año' : 'por mes',
      savings: isAnnual ? 'Ahorra ARS $11.998' : null,
      description: 'Para usuarios activos que quieren mayor control',
      features: ['180 recordatorios por mes','Reconocimiento de notas de voz','Recordatorios recurrentes','Creación de listas','Múltiples recordatorios en un solo mensaje','Acceso anticipado a nuevas funciones','Google Calendar (notificaciones de eventos)'],
      notIncluded: ['Respuestas del asistente por audio','Finanzas personales'],
      cardClass: 'bg-orange-50 border border-orange-300/50 animate-glow-pulse',
      buttonClass: 'bg-orange-500 hover:bg-orange-400 text-white shadow-lg shadow-orange-500/20',
      popular: true,
    },
    {
      name: 'Premium',
      monthlyPrice: 'ARS $9.999', annualPrice: 'ARS $99.990',
      period: isAnnual ? 'por año' : 'por mes',
      savings: isAnnual ? 'Ahorra ARS $19.998' : null,
      description: 'Todo lo que necesitás, sin límites',
      features: ['Recordatorios ilimitados','Reconocimiento de notas de voz','Recordatorios recurrentes','Creación de listas','Múltiples recordatorios en un solo mensaje','Acceso anticipado a nuevas funciones','Respuestas del asistente por audio','Google Calendar (gestión completa de eventos y notificaciones)','Finanzas personales (asistente por WhatsApp para tus gastos)'],
      notIncluded: [],
      cardClass: 'bg-gradient-to-br from-orange-50 via-white to-orange-50/30 border border-orange-200/70',
      buttonClass: 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white shadow-lg shadow-orange-500/20',
    },
  ];

  const stats = [
    { value: 10000, prefix: '+', suffix: '',  label: 'Usuarios Activos' },
    { value: 98,    prefix: '',  suffix: '%', label: 'Tasa de Satisfacción' },
    { value: 500,   prefix: '+', suffix: 'K', label: 'Mensajes al Mes' },
    { value: 3,     prefix: '',  suffix: '',  label: 'Países Disponibles' },
  ];

  const openModal = (plan: any) => { setSelectedPlan(plan); setModalOpen(true); };
  const whatsappRedirect = () => window.open('https://wa.me/5492604086606', '_blank');

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans">

      {/* ── HEADER ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#FFFDF9]/95 backdrop-blur-xl border-b border-[#1C1209]/[0.06] shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">

            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/25">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#1C1209] font-display tracking-tight">
                AsistPro
              </span>
            </div>

            <nav className="hidden md:flex space-x-8">
              {['#features','#testimonials','#pricing','#contact'].map((href, i) => (
                <a key={i} href={href}
                  className="text-[#6B5F55] hover:text-orange-500 transition-colors text-sm font-medium">
                  {['Funciones','Testimonios','Precios','Contacto'][i]}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <a href="/login"
                className="text-[#6B5F55] hover:text-[#1C1209] text-sm font-medium transition-colors">
                Iniciar sesión
              </a>
              <a href="#pricing"
                className="bg-orange-500 hover:bg-orange-400 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-md shadow-orange-500/20">
                Prueba Gratis
              </a>
            </div>

            <button className="md:hidden text-[#6B5F55] hover:text-[#1C1209] transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-[#1C1209]/[0.06]">
              <nav className="flex flex-col space-y-4">
                {['#features','#testimonials','#pricing','#contact'].map((href, i) => (
                  <a key={i} href={href}
                    className="text-[#6B5F55] hover:text-orange-500 transition-colors text-sm font-medium">
                    {['Funciones','Testimonios','Precios','Contacto'][i]}
                  </a>
                ))}
                <a href="/login"
                  className="text-[#6B5F55] text-sm font-medium text-center py-1">
                  Iniciar sesión
                </a>
                <a href="#pricing"
                  className="bg-orange-500 text-white px-5 py-2 rounded-lg text-sm font-semibold text-center">
                  Prueba Gratis
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative bg-[#FFFDF9] py-24 lg:py-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full bg-orange-400/[0.13] blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-orange-300/[0.10] blur-[130px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Copy */}
            <div>
              <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-orange-600 text-xs font-semibold tracking-wide uppercase">
                  Disponible 24/7 en WhatsApp
                </span>
              </div>

              <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-extrabold text-[#1C1209] mb-6 leading-[1.03] tracking-tight animate-fade-in-up-1">
                Tu{' '}
                <span className="text-orange-500">Asistente</span>
                <br />
                Virtual{' '}
                <span className="text-orange-500">Inteligente</span>
              </h1>

              <p className="text-[#6B5F55] text-lg mb-10 leading-relaxed max-w-md animate-fade-in-up-2">
                AsistPro organiza tu vida automáticamente. Programa citas,
                controla gastos y genera informes detallados, todo desde
                WhatsApp con inteligencia artificial avanzada.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10 animate-fade-in-up-3">
                <a href="#pricing"
                  className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2">
                  Comenzar Prueba Gratuita
                  <ChevronRight className="w-4 h-4" />
                </a>
                <button className="border border-[#1C1209]/10 text-[#6B5F55] hover:border-[#1C1209]/20 hover:text-[#1C1209] px-8 py-3.5 rounded-xl font-semibold transition-all bg-white/60">
                  Ver Demo
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-[#9E948C] animate-fade-in-up-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-400" />
                  <span>3 días gratis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-400" />
                  <span>+10,000 usuarios</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span>Disponible 24/7</span>
                </div>
              </div>
            </div>

            {/* Animated WhatsApp mockup */}
            <div className="relative flex flex-col items-center">
              <div className="absolute inset-0 bg-orange-400/[0.10] rounded-3xl blur-[80px] pointer-events-none" />

              <div className="animate-float relative z-10 w-full max-w-sm mx-auto shadow-2xl shadow-orange-500/10 rounded-2xl">
                {/* Header bar */}
                <div className="bg-[#075e54] rounded-t-2xl text-white p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">AsistPro</p>
                      <p className="text-xs text-green-200">en línea</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-white/70">
                    <Video className="w-4 h-4" /><Phone className="w-4 h-4" /><MoreVertical className="w-4 h-4" />
                  </div>
                </div>

                {/* Chat area */}
                <div
                  className="p-4 min-h-[320px] relative overflow-hidden"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundColor: '#efeae2',
                  }}
                >
                  <div className="space-y-3">
                    {CHAT.slice(0, visibleCount).map((msg, i) => (
                      <div key={i} className={`flex ${msg.side === 'user' ? 'justify-end' : 'justify-start'} animate-message`}>
                        <div className={`rounded-lg p-3 max-w-[85%] shadow-sm ${
                          msg.side === 'user'
                            ? 'bg-[#dcf8c6] text-gray-800'
                            : 'bg-white text-gray-800'
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                          <p className={`text-xs mt-1 ${msg.side === 'user' ? 'text-gray-500 text-right' : 'text-gray-400'}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start animate-message">
                        <div className="bg-white rounded-lg px-4 py-3 shadow-sm flex items-center gap-1">
                          {[0, 150, 300].map((d) => (
                            <span key={d} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: `${d}ms` }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Input bar */}
                <div className="bg-[#f0f0f0] rounded-b-2xl p-3 flex items-center space-x-2">
                  <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center space-x-2">
                    <input type="text" placeholder="Escribe un mensaje..."
                      className="flex-1 outline-none text-sm text-gray-500" disabled />
                    <Mic className="w-4 h-4 text-gray-400" />
                  </div>
                  <button className="bg-[#25d366] p-2 rounded-full">
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              <div className="mt-8 text-center relative z-10">
                <button onClick={whatsappRedirect}
                  className="bg-[#25d366] hover:bg-[#20c55a] text-white px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 shadow-xl shadow-[#25d366]/20 flex items-center space-x-2 mx-auto">
                  <MessageCircle className="w-5 h-5" />
                  <span>Chatear con AsistPro</span>
                </button>
                <p className="text-sm text-[#9E948C] mt-2">
                  Comienza tu prueba gratuita ahora
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 bg-[#F3EFE8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map((s, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1}`}>
                <StatCounter value={s.value} prefix={s.prefix} suffix={s.suffix} label={s.label} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 bg-[#FFFDF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-3">
              Funcionalidades
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#1C1209] mb-4">
              Todo lo que Necesitas
              <br />
              en un Solo Lugar
            </h2>
            <p className="text-[#6B5F55] text-lg max-w-2xl mx-auto">
              AsistPro combina inteligencia artificial avanzada con simplicidad
              de uso para transformar cómo gestionas tu tiempo y dinero.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => (
              <div key={index}
                className={`glass rounded-2xl p-6 hover:border-orange-400/40 hover:shadow-md transition-all duration-300 group reveal reveal-delay-${index + 1}`}>
                <div className="w-11 h-11 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-[#1C1209] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#6B5F55] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-24 bg-[#F3EFE8] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-400/[0.07] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 reveal">
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-3">
              Testimonios
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#1C1209] mb-4">
              Lo que Dicen Nuestros Usuarios
            </h2>
            <p className="text-[#6B5F55] text-lg">
              Miles de personas ya transformaron su productividad con AsistPro
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <div key={index}
                className={`glass rounded-2xl p-6 relative hover:shadow-md transition-all duration-300 reveal reveal-delay-${index + 1}`}>
                <div className="text-orange-400/20 text-9xl font-serif leading-none absolute top-2 right-4 select-none pointer-events-none">
                  "
                </div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-orange-400 fill-current" />
                  ))}
                </div>
                <p className="text-[#4A3E35] mb-5 leading-relaxed text-sm relative z-10">
                  "{t.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 border border-orange-200">
                    <span className="text-orange-600 text-xs font-bold">{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-[#1C1209] text-sm font-semibold">{t.name}</p>
                    <p className="text-[#9E948C] text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 bg-[#FFFDF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-3">
              Precios
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#1C1209] mb-4">
              Planes que Se Adaptan a Ti
            </h2>
            <p className="text-[#6B5F55] text-lg mb-8">
              Elige el plan perfecto para tus necesidades. Todos incluyen 3 días
              de prueba gratuita.
            </p>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-[#1C1209]' : 'text-[#9E948C]'}`}>
                Mensual
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAnnual ? 'bg-orange-500' : 'bg-[#1C1209]/15'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-[#1C1209]' : 'text-[#9E948C]'}`}>
                Anual
              </span>
              {isAnnual && (
                <span className="bg-orange-100 text-orange-600 border border-orange-200 px-3 py-0.5 rounded-full text-xs font-semibold">
                  Ahorra hasta 20%
                </span>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {pricingPlans.map((plan, index) => (
              <div key={index}
                className={`rounded-2xl p-8 relative shadow-sm reveal reveal-delay-${index + 1} ${plan.cardClass}`}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg shadow-orange-500/30 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Más Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-display text-xl font-bold text-[#1C1209] mb-1">{plan.name}</h3>
                  <p className="text-[#9E948C] text-sm">{plan.description}</p>
                </div>

                <div className="mb-7">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-3xl font-bold text-[#1C1209]">
                      {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-[#9E948C] text-sm">{plan.period}</span>
                  </div>
                  {plan.savings && isAnnual && (
                    <p className="text-orange-500 text-xs font-medium mt-1">{plan.savings}</p>
                  )}
                  <p className="text-green-600 text-xs font-medium mt-1">
                    🆓 Prueba gratis por 3 días
                  </p>
                </div>

                <div className="space-y-2.5 mb-8">
                  <p className="text-[#9E948C] text-[11px] font-bold uppercase tracking-wider">Incluye:</p>
                  {plan.features.map((f, fi) => (
                    <div key={fi} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-orange-500" />
                      </div>
                      <span className="text-[#4A3E35] text-sm">{f}</span>
                    </div>
                  ))}
                  {plan.notIncluded.length > 0 && (
                    <>
                      <p className="text-[#C4B8B0] text-[11px] font-bold uppercase tracking-wider pt-2">No incluye:</p>
                      {plan.notIncluded.map((f, fi) => (
                        <div key={fi} className="flex items-start gap-2.5">
                          <X className="w-4 h-4 text-[#C4B8B0] flex-shrink-0 mt-0.5" />
                          <span className="text-[#C4B8B0] text-sm">{f}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <button onClick={() => openModal(plan)}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${plan.buttonClass}`}>
                  Comenzar Prueba Gratuita
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-[#F3EFE8] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-400/[0.06] via-orange-400/[0.03] to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-400/[0.09] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <div className="reveal">
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-5">
              Empieza hoy
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#1C1209] mb-6">
              ¿Listo para Transformar
              <br />
              tu Productividad?
            </h2>
            <p className="text-[#6B5F55] text-lg mb-10">
              Únete a miles de usuarios que ya optimizaron su tiempo y finanzas
              con AsistPro. Comienza tu prueba gratuita hoy mismo.
            </p>
            <a href="#pricing"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-2xl shadow-orange-500/20 text-lg">
              Comenzar Ahora — Gratis por 3 Días
              <ChevronRight className="w-5 h-5" />
            </a>
            <p className="text-[#9E948C] mt-5 text-sm">
              Sin tarjeta de crédito requerida · Cancela en cualquier momento
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contact" className="bg-[#F3EFE8] border-t border-[#1C1209]/[0.06] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center space-x-2.5 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md shadow-orange-500/20">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-[#1C1209] font-display">AsistPro</span>
              </div>
              <p className="text-[#9E948C] text-sm leading-relaxed">
                Tu asistente virtual inteligente para una vida más organizada y
                productiva.
              </p>
            </div>

            {[
              { title: 'Producto', links: ['Funciones','Precios','API','Integraciones'] },
              { title: 'Soporte',  links: ['Centro de Ayuda','Contacto','Comunidad','Estado del Servicio'] },
              { title: 'Empresa',  links: ['Sobre Nosotros','Blog','Carreras','Privacidad'] },
            ].map((col, i) => (
              <div key={i}>
                <h3 className="text-[#1C1209] font-semibold text-sm mb-5">{col.title}</h3>
                <ul className="space-y-3 text-[#9E948C] text-sm">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="hover:text-orange-500 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-[#1C1209]/[0.06] pt-8 text-center text-[#C4B8B0] text-sm">
            <p>© 2026 AsistPro. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      <PricingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPlan={selectedPlan}
        isAnnual={isAnnual}
      />

      {/* Activity Ticker — componente aislado, eliminar sin efectos secundarios */}
      <ActivityTicker />
    </div>
  );
}

export default App;
