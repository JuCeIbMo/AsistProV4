import { useState, useEffect, useRef } from 'react';
import PricingModal from './components/PricingModal';
import {
  MessageCircle,
  Check,
  Star,
  Bot,
  Mic,
  Users,
  Clock3,
  ShieldCheck,
  Menu,
  X,
  Phone,
  Video,
  MoreVertical,
  Send,
  CalendarRange,
  Wallet,
  BarChart3,
  ChevronRight,
  Zap,
  Sparkles,
  MoveRight,
  NotebookTabs,
} from 'lucide-react';

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function StatCounter({
  value,
  prefix = '',
  suffix = '',
  label,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setStarted(true);
        obs.disconnect();
      }
    });

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    const duration = 1500;
    const startedAt = Date.now();

    const tick = () => {
      const progress = Math.min((Date.now() - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [started, value]);

  const formatted = count >= 1000 ? count.toLocaleString('es-AR') : String(count);

  return (
    <div ref={ref}>
      <p className="font-display text-4xl lg:text-5xl font-semibold text-light-text">
        {prefix}
        {formatted}
        {suffix}
      </p>
      <p className="mt-2 text-sm uppercase tracking-[0.18em] text-light-secondary">{label}</p>
    </div>
  );
}

const CHAT = [
  {
    side: 'user',
    text: 'Agendá una reunión con Martina mañana a las 15:00.',
    time: '14:32',
  },
  {
    side: 'bot',
    text: 'Reunión creada. También dejé un recordatorio 30 minutos antes.',
    time: '14:32',
  },
  {
    side: 'user',
    text: 'Registrá 2500 en almuerzo con cliente.',
    time: '14:35',
  },
  {
    side: 'bot',
    text: 'Movimiento guardado en Alimentación. Tu presupuesto mensual está en 65%.',
    time: '14:35',
  },
  {
    side: 'user',
    text: 'Mostrame el resumen del mes.',
    time: '14:36',
  },
  {
    side: 'bot',
    text: 'Ingresos 84.200. Gastos 28.450. Alimentación 42%. Transporte 23%.',
    time: '14:36',
  },
] as const;

type PricingPlan = {
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  period: string;
  savings: string | null;
  description: string;
  features: string[];
  notIncluded: string[];
  cardClass: string;
  buttonClass: string;
  popular?: boolean;
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useScrollReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function show(index: number) {
      if (index >= CHAT.length) {
        timerRef.current = setTimeout(() => {
          setVisibleCount(0);
          setIsTyping(false);
          timerRef.current = setTimeout(() => show(0), 900);
        }, 4200);
        return;
      }

      if (CHAT[index].side === 'bot') {
        setIsTyping(true);
        timerRef.current = setTimeout(() => {
          setIsTyping(false);
          setVisibleCount(index + 1);
          timerRef.current = setTimeout(() => show(index + 1), 1100);
        }, 1000);
      } else {
        setVisibleCount(index + 1);
        timerRef.current = setTimeout(() => show(index + 1), 850);
      }
    }

    timerRef.current = setTimeout(() => show(0), 1000);
    return () => clearTimeout(timerRef.current);
  }, []);

  const features = [
    {
      icon: <CalendarRange className="w-5 h-5" aria-hidden="true" />,
      title: 'Agenda ejecutiva por WhatsApp',
      description:
        'Citas, recordatorios y seguimiento sin abrir otra herramienta ni romper tu flujo.',
    },
    {
      icon: <Wallet className="w-5 h-5" aria-hidden="true" />,
      title: 'Finanzas conversacionales',
      description:
        'Ingresos, gastos y categorías quedan registrados desde lenguaje natural.',
    },
    {
      icon: <BarChart3 className="w-5 h-5" aria-hidden="true" />,
      title: 'Lectura operativa inmediata',
      description:
        'El panel resume el estado del mes con una jerarquía clara y accionable.',
    },
    {
      icon: <Mic className="w-5 h-5" aria-hidden="true" />,
      title: 'Notas de voz interpretadas',
      description:
        'La fricción baja cuando la captura también funciona en audio y contexto real.',
    },
  ];

  const testimonials = [
    {
      name: 'María González',
      role: 'Dirección comercial',
      initials: 'MG',
      content:
        'La diferencia no es solo automatizar. Ahora tengo una lectura diaria de agenda y caja sin perseguir datos.',
      rating: 5,
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Consultor independiente',
      initials: 'CR',
      content:
        'Pasé de mensajes sueltos y notas perdidas a una operación ordenada desde el mismo chat que ya usaba.',
      rating: 5,
    },
    {
      name: 'Ana Martín',
      role: 'Operaciones',
      initials: 'AM',
      content:
        'La interfaz nueva se siente como una herramienta seria. Entiendo el mes en segundos y actúo más rápido.',
      rating: 5,
    },
  ];

  const pricingPlans: PricingPlan[] = [
    {
      name: 'Starter',
      monthlyPrice: 'ARS $3.999',
      annualPrice: 'ARS $39.990',
      period: isAnnual ? 'por año' : 'por mes',
      savings: isAnnual ? 'Ahorra ARS $7.998' : null,
      description: 'Base personal para ordenar agenda y seguimiento.',
      features: [
        '40 recordatorios por mes',
        'Notas de voz',
        'Recordatorios recurrentes',
        'Listas y seguimiento básico',
      ],
      notIncluded: [
        'Múltiples recordatorios por mensaje',
        'Acceso anticipado',
        'Audio del asistente',
        'Google Calendar',
        'Finanzas personales',
      ],
      cardClass:
        'bg-[rgba(255,251,245,0.72)] border border-light-border shadow-lg shadow-dark-bg/5',
      buttonClass:
        'bg-light-elevated hover:bg-light-bg text-light-text border border-light-border',
    },
    {
      name: 'Pro',
      monthlyPrice: 'ARS $5.999',
      annualPrice: 'ARS $59.990',
      period: isAnnual ? 'por año' : 'por mes',
      savings: isAnnual ? 'Ahorra ARS $11.998' : null,
      description: 'El sistema operativo diario para profesionales activos.',
      features: [
        '180 recordatorios por mes',
        'Notas de voz',
        'Recordatorios recurrentes',
        'Listas',
        'Múltiples recordatorios por mensaje',
        'Acceso anticipado',
        'Google Calendar con notificaciones',
      ],
      notIncluded: ['Audio del asistente', 'Finanzas personales'],
      cardClass:
        'bg-dark-bg text-dark-text border border-dark-accent/35 shadow-2xl shadow-dark-bg/25 animate-glow-pulse',
      buttonClass: 'bg-dark-accent hover:bg-dark-accent-dark text-dark-bg',
      popular: true,
    },
    {
      name: 'Premium',
      monthlyPrice: 'ARS $9.999',
      annualPrice: 'ARS $99.990',
      period: isAnnual ? 'por año' : 'por mes',
      savings: isAnnual ? 'Ahorra ARS $19.998' : null,
      description: 'Cobertura completa para operación, calendario y finanzas.',
      features: [
        'Recordatorios ilimitados',
        'Notas de voz',
        'Recordatorios recurrentes',
        'Listas',
        'Múltiples recordatorios por mensaje',
        'Acceso anticipado',
        'Audio del asistente',
        'Google Calendar completo',
        'Finanzas personales por WhatsApp',
      ],
      notIncluded: [],
      cardClass:
        'bg-[linear-gradient(180deg,rgba(255,251,245,0.92),rgba(229,220,203,0.85))] border border-light-border-strong shadow-xl shadow-dark-bg/10',
      buttonClass: 'bg-light-text hover:bg-dark-bg text-light-bg',
    },
  ];

  const stats = [
    { value: 10000, prefix: '+', suffix: '', label: 'Usuarios activos' },
    { value: 98, prefix: '', suffix: '%', label: 'Satisfacción' },
    { value: 500, prefix: '+', suffix: 'K', label: 'Mensajes al mes' },
    { value: 3, prefix: '', suffix: '', label: 'Mercados activos' },
  ];

  const openModal = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  const whatsappRedirect = () => window.open('https://wa.me/5492604086606', '_blank');

  return (
    <div className="min-h-screen bg-light-bg font-sans text-light-text overflow-x-hidden">
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'pt-3' : 'pt-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`section-frame flex items-center justify-between rounded-2xl px-4 sm:px-6 py-4 transition-all duration-300 ${
              scrolled
                ? 'bg-[rgba(9,17,27,0.92)] text-dark-text shadow-xl shadow-dark-bg/25'
                : 'bg-[rgba(255,251,245,0.78)] backdrop-blur-md'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-dark-bg text-dark-accent flex items-center justify-center shadow-lg shadow-dark-bg/20">
                <Bot className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <span className="block font-display text-xl leading-none">AsistPro</span>
                <span className="block text-[11px] uppercase tracking-[0.22em] text-light-secondary">
                  Editorial assistant OS
                </span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              {[
                ['#features', 'Sistema'],
                ['#proof', 'Prueba'],
                ['#pricing', 'Planes'],
                ['#contact', 'Contacto'],
              ].map(([href, label]) => (
                <a key={href} href={href} className="hover:text-light-accent-dark transition-colors">
                  {label}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <a
                href="/login"
                className="px-4 py-2.5 rounded-lg border border-light-border hover:border-light-border-strong transition-colors min-h-[44px] inline-flex items-center"
              >
                Ingresar
              </a>
              <a
                href="#pricing"
                className="px-5 py-2.5 rounded-lg bg-light-text text-light-bg hover:bg-dark-bg transition-colors min-h-[44px] inline-flex items-center"
              >
                Empezar
              </a>
            </div>

            <button
              className="md:hidden p-2 rounded-lg border border-light-border min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden mt-3 section-frame rounded-2xl bg-[rgba(255,251,245,0.92)] px-4 py-4">
              <nav className="flex flex-col gap-3 text-sm">
                {[
                  ['#features', 'Sistema'],
                  ['#proof', 'Prueba'],
                  ['#pricing', 'Planes'],
                  ['#contact', 'Contacto'],
                ].map(([href, label]) => (
                  <a key={href} href={href} className="min-h-[44px] flex items-center">
                    {label}
                  </a>
                ))}
                <a href="/login" className="min-h-[44px] flex items-center">
                  Ingresar
                </a>
                <a
                  href="#pricing"
                  className="min-h-[44px] rounded-lg bg-light-text text-light-bg px-4 flex items-center justify-center"
                >
                  Empezar
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main>
        <section className="relative pt-16 pb-24 lg:pt-20 lg:pb-28">
          <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top_left,rgba(182,138,62,0.18),transparent_42%),radial-gradient(circle_at_top_right,rgba(93,133,179,0.14),transparent_28%)]" aria-hidden="true" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
              <div className="reveal">
                <div className="editorial-kicker mb-6">Asistente de operaciones por WhatsApp</div>
                <h1 className="font-display text-5xl sm:text-6xl xl:text-7xl font-semibold leading-[0.95] tracking-tight text-light-text max-w-4xl">
                  Una interfaz con criterio para tu agenda, tus recordatorios y tu dinero.
                </h1>
                <p className="mt-7 text-lg sm:text-xl leading-relaxed text-light-secondary max-w-2xl">
                  AsistPro convierte conversaciones en organización real. Agenda citas, registra movimientos y lee el estado del mes desde un panel que se siente menos genérico y mucho más útil.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <a
                    href="#pricing"
                    className="min-h-[48px] px-7 py-3.5 rounded-lg bg-light-text text-light-bg hover:bg-dark-bg transition-colors font-semibold inline-flex items-center justify-center gap-2"
                  >
                    Activar prueba
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <button
                    onClick={whatsappRedirect}
                    className="min-h-[48px] px-7 py-3.5 rounded-lg border border-light-border-strong hover:border-light-text transition-colors font-semibold inline-flex items-center justify-center gap-2 cursor-pointer bg-[rgba(255,251,245,0.55)]"
                  >
                    Ver conversación real
                    <MoveRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-10 flex flex-wrap gap-6 text-sm text-light-secondary">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-light-accent-dark" aria-hidden="true" />
                    <span>Prueba gratuita de 3 días</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-light-accent-dark" aria-hidden="true" />
                    <span>Más de 10.000 usuarios</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 className="w-4 h-4 text-light-accent-dark" aria-hidden="true" />
                    <span>Disponible 24/7</span>
                  </div>
                </div>
              </div>

              <div className="reveal reveal-delay-2">
                <div className="section-frame rounded-[2rem] bg-dark-bg text-dark-text p-4 sm:p-5 shadow-2xl shadow-dark-bg/25">
                  <div className="rounded-[1.65rem] border border-dark-border bg-dark-card overflow-hidden">
                    <div className="border-b border-dark-border px-4 py-3 flex items-center justify-between bg-dark-bg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-dark-accent-light text-dark-accent-dark flex items-center justify-center">
                          <Bot className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-dark-text-primary">AsistPro</p>
                          <p className="text-xs uppercase tracking-[0.18em] text-dark-secondary">panel conversacional</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-dark-secondary">
                        <Video className="w-4 h-4" aria-hidden="true" />
                        <Phone className="w-4 h-4" aria-hidden="true" />
                        <MoreVertical className="w-4 h-4" aria-hidden="true" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-[1.1fr_0.9fr]">
                      <div
                        className="p-4 min-h-[22rem] border-b md:border-b-0 md:border-r border-dark-border"
                        style={{
                          background:
                            'linear-gradient(180deg, rgba(23,34,52,0.95) 0%, rgba(16,25,39,0.98) 100%)',
                        }}
                      >
                        <div className="space-y-3">
                          {CHAT.slice(0, visibleCount).map((msg, i) => (
                            <div
                              key={i}
                              className={`flex ${msg.side === 'user' ? 'justify-end' : 'justify-start'} animate-message`}
                            >
                              <div
                                className={`max-w-[85%] rounded-2xl px-3.5 py-3 shadow-md ${
                                  msg.side === 'user'
                                    ? 'bg-dark-accent text-dark-bg'
                                    : 'bg-dark-elevated text-dark-text'
                                }`}
                              >
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                <p
                                  className={`mt-1 text-[11px] ${
                                    msg.side === 'user' ? 'text-dark-bg/70 text-right' : 'text-dark-secondary'
                                  }`}
                                >
                                  {msg.time}
                                </p>
                              </div>
                            </div>
                          ))}

                          {isTyping && (
                            <div className="flex justify-start animate-message">
                              <div className="bg-dark-elevated rounded-2xl px-4 py-3 flex items-center gap-1">
                                {[0, 150, 300].map(delay => (
                                  <span
                                    key={delay}
                                    className="w-2 h-2 rounded-full bg-dark-secondary animate-bounce"
                                    style={{ animationDelay: `${delay}ms` }}
                                    aria-hidden="true"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-4 bg-[linear-gradient(180deg,rgba(16,25,39,0.98),rgba(9,17,27,1))]">
                        <div className="rounded-2xl border border-dark-border bg-dark-bg/70 p-4">
                          <div className="editorial-kicker !text-dark-accent-dark before:!bg-current mb-4">
                            Estado del día
                          </div>
                          <div className="space-y-3">
                            {[
                              ['Próxima cita', 'Martina · 15:00'],
                              ['Caja del mes', 'ARS 84.200'],
                              ['Gasto operativo', 'ARS 28.450'],
                            ].map(([label, value]) => (
                              <div key={label} className="flex items-center justify-between border-b border-dark-border-subtle pb-3 last:border-b-0 last:pb-0">
                                <span className="text-xs uppercase tracking-[0.18em] text-dark-secondary">
                                  {label}
                                </span>
                                <span className="font-semibold text-dark-text-primary">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 rounded-full bg-dark-elevated px-4 py-3">
                          <Mic className="w-4 h-4 text-dark-secondary" aria-hidden="true" />
                          <span className="text-sm text-dark-secondary">Dictar una nueva instrucción</span>
                          <button className="ml-auto w-8 h-8 rounded-full bg-dark-accent text-dark-bg flex items-center justify-center cursor-pointer" aria-label="Enviar">
                            <Send className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-dark-text-primary">
                        Todo parte del mismo chat. La diferencia está en cómo termina organizado.
                      </p>
                      <p className="text-sm text-dark-secondary mt-1">
                        Menos ruido visual, más lectura operativa.
                      </p>
                    </div>
                    <button
                      onClick={whatsappRedirect}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#25D366] text-white hover:bg-[#1fbc58] transition-colors font-semibold min-h-[44px] cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                      Abrir WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="proof" className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="section-frame rounded-[2rem] bg-[rgba(255,251,245,0.7)] p-8 lg:p-10 reveal">
              <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-10 items-start">
                <div>
                  <div className="editorial-kicker">Prueba de sistema</div>
                  <h2 className="mt-5 font-display text-4xl lg:text-5xl font-semibold leading-tight">
                    Diseñado para sentirse como una herramienta seria, no como otro SaaS genérico.
                  </h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {stats.map((stat, index) => (
                    <div key={stat.label} className={`reveal reveal-delay-${index + 1}`}>
                      <StatCounter
                        value={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        label={stat.label}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-start mb-14">
              <div className="reveal">
                <div className="editorial-kicker">Sistema</div>
                <h2 className="mt-5 font-display text-4xl lg:text-5xl font-semibold leading-tight">
                  Una capa editorial para ordenar operaciones pequeñas con claridad grande.
                </h2>
              </div>
              <div className="reveal reveal-delay-2">
                <p className="text-lg leading-relaxed text-light-secondary">
                  El valor no está solo en automatizar. Está en tomar mensajes, convertirlos en estructura y presentar el resultado con una jerarquía que invite a decidir, no a buscar.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`section-frame rounded-[1.5rem] bg-[rgba(255,251,245,0.68)] p-6 reveal reveal-delay-${index + 1}`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-dark-bg text-dark-accent flex items-center justify-center mb-5">
                    {feature.icon}
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-light-text mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-light-secondary">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
              <div className="section-frame rounded-[2rem] bg-dark-bg text-dark-text p-8 reveal">
                <div className="editorial-kicker !text-dark-accent-dark before:!bg-current">Método</div>
                <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-dark-text-primary">
                  Tres capas. Un mismo flujo.
                </h2>
                <div className="mt-8 space-y-6">
                  {[
                    ['Captura', 'Hablas o escribes en WhatsApp.'],
                    ['Estructura', 'AsistPro convierte intención en cita, gasto o recordatorio.'],
                    ['Lectura', 'El panel traduce actividad en estado operativo.'],
                  ].map(([title, copy], index) => (
                    <div key={title} className="flex gap-4">
                      <div className="w-9 h-9 rounded-full border border-dark-accent/35 text-dark-accent-dark flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-dark-text-primary">{title}</p>
                        <p className="text-sm text-dark-secondary mt-1">{copy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.name}
                    className={`section-frame rounded-[1.75rem] bg-[rgba(255,251,245,0.68)] p-6 reveal reveal-delay-${index + 1}`}
                  >
                    <div className="flex items-center gap-1 mb-5">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-light-accent-dark fill-current" aria-hidden="true" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-light-secondary">"{testimonial.content}"</p>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-dark-bg text-dark-accent flex items-center justify-center text-xs font-bold">
                        {testimonial.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{testimonial.name}</p>
                        <p className="text-xs uppercase tracking-[0.18em] text-light-muted">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 reveal">
              <div className="editorial-kicker justify-center">Planes</div>
              <h2 className="mt-5 font-display text-4xl lg:text-5xl font-semibold">
                Un sistema sobrio también necesita una estructura clara de entrada.
              </h2>
              <p className="mt-5 text-lg text-light-secondary max-w-2xl mx-auto">
                Los tres planes conservan el flujo actual. La diferencia está en profundidad, volumen y cobertura operativa.
              </p>

              <div className="mt-8 inline-flex items-center gap-4 rounded-full border border-light-border bg-[rgba(255,251,245,0.78)] px-4 py-2">
                <span className={`text-sm font-medium ${!isAnnual ? 'text-light-text' : 'text-light-muted'}`}>
                  Mensual
                </span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    isAnnual ? 'bg-light-text' : 'bg-light-text/15'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-light-bg shadow-sm transition-transform ${
                      isAnnual ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${isAnnual ? 'text-light-text' : 'text-light-muted'}`}>
                  Anual
                </span>
                {isAnnual && (
                  <span className="rounded-full bg-light-accent-light text-light-accent-dark border border-light-border px-3 py-1 text-xs font-semibold">
                    Mejor relación anual
                  </span>
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {pricingPlans.map((plan, index) => (
                <div
                  key={plan.name}
                  className={`relative rounded-[1.9rem] p-8 reveal reveal-delay-${index + 1} ${plan.cardClass}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="bg-dark-accent text-dark-bg px-4 py-1 rounded-full text-xs font-semibold shadow-lg shadow-dark-bg/20 flex items-center gap-1">
                        <Zap className="w-3 h-3" aria-hidden="true" />
                        Selección editorial
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.22em] text-inherit/70 mb-3">{plan.name}</p>
                    <h3 className="font-display text-3xl font-semibold mb-2">{plan.name}</h3>
                    <p className={`${plan.popular ? 'text-dark-secondary' : 'text-light-secondary'} text-sm`}>
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-4xl font-semibold">
                        {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span className={`${plan.popular ? 'text-dark-secondary' : 'text-light-muted'} text-sm`}>
                        {plan.period}
                      </span>
                    </div>
                    {plan.savings && isAnnual && (
                      <p className={`mt-2 text-xs font-medium ${plan.popular ? 'text-dark-accent-dark' : 'text-light-accent-dark'}`}>
                        {plan.savings}
                      </p>
                    )}
                    <p className={`mt-2 text-xs ${plan.popular ? 'text-dark-secondary' : 'text-light-secondary'}`}>
                      Prueba gratuita de 3 días
                    </p>
                  </div>

                  <div className="space-y-3 mb-8">
                    {plan.features.map(feature => (
                      <div key={feature} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                          plan.popular ? 'bg-dark-accent-light text-dark-accent-dark' : 'bg-light-accent-light text-light-accent-dark'
                        }`}>
                          <Check className="w-3 h-3" aria-hidden="true" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}

                    {plan.notIncluded.length > 0 && (
                      <>
                        <div className={`pt-3 text-[11px] uppercase tracking-[0.22em] ${plan.popular ? 'text-dark-secondary' : 'text-light-muted'}`}>
                          No incluye
                        </div>
                        {plan.notIncluded.map(feature => (
                          <div key={feature} className={`flex items-start gap-3 text-sm ${plan.popular ? 'text-dark-secondary' : 'text-light-muted'}`}>
                            <X className="w-4 h-4 mt-0.5" aria-hidden="true" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => openModal(plan)}
                    className={`w-full min-h-[46px] rounded-lg font-semibold transition-colors cursor-pointer ${plan.buttonClass}`}
                  >
                    Abrir plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="section-frame rounded-[2rem] bg-dark-bg text-dark-text p-8 lg:p-10 reveal">
              <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
                <div>
                  <div className="editorial-kicker !text-dark-accent-dark before:!bg-current">Cierre</div>
                  <h2 className="mt-5 font-display text-4xl lg:text-5xl font-semibold leading-tight text-dark-text-primary">
                    Si el producto organiza tu operación, la interfaz tiene que demostrarlo desde el primer segundo.
                  </h2>
                  <p className="mt-5 text-lg text-dark-secondary max-w-2xl">
                    AsistPro ya resolvía el flujo. Ahora también comunica criterio, estructura y confianza.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:items-start">
                  <a
                    href="#pricing"
                    className="min-h-[48px] px-7 py-3.5 rounded-lg bg-dark-accent text-dark-bg hover:bg-dark-accent-dark transition-colors font-semibold inline-flex items-center justify-center gap-2"
                  >
                    Comenzar ahora
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <button
                    onClick={whatsappRedirect}
                    className="min-h-[48px] px-7 py-3.5 rounded-lg border border-dark-border-strong text-dark-text-primary hover:border-dark-accent/45 transition-colors font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Hablar con ventas
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <p className="text-sm text-dark-secondary">
                    Sin tarjeta obligatoria para iniciar. Cancelación simple.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-light-border bg-[rgba(217,207,187,0.42)] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-dark-bg text-dark-accent flex items-center justify-center">
                  <Bot className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="block font-display text-2xl leading-none">AsistPro</span>
                  <span className="block text-[11px] uppercase tracking-[0.22em] text-light-secondary">
                    Assistant OS
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-light-secondary max-w-sm">
                Un asistente conversacional con una capa visual más precisa para agenda, recordatorios y finanzas.
              </p>
            </div>

            {[
              {
                title: 'Producto',
                icon: <Sparkles className="w-4 h-4" aria-hidden="true" />,
                links: ['Sistema', 'Planes', 'Integraciones', 'Estado'],
              },
              {
                title: 'Soporte',
                icon: <NotebookTabs className="w-4 h-4" aria-hidden="true" />,
                links: ['Centro de ayuda', 'Contacto', 'Privacidad', 'Términos'],
              },
              {
                title: 'Canales',
                icon: <MessageCircle className="w-4 h-4" aria-hidden="true" />,
                links: ['WhatsApp', 'Email', 'Ventas', 'Comunidad'],
              },
            ].map(column => (
              <div key={column.title}>
                <div className="flex items-center gap-2 mb-4 text-light-text">
                  {column.icon}
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">{column.title}</h3>
                </div>
                <ul className="space-y-3 text-sm text-light-secondary">
                  {column.links.map(link => (
                    <li key={link}>
                      <a href="#" className="hover:text-light-accent-dark transition-colors min-h-[44px] flex items-center">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-light-border pt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs uppercase tracking-[0.18em] text-light-muted">
            <p>© 2026 AsistPro</p>
            <p>Asistencia conversacional para operación real</p>
          </div>
        </div>
      </footer>

      <PricingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPlan={selectedPlan}
        isAnnual={isAnnual}
      />
    </div>
  );
}

export default App;
