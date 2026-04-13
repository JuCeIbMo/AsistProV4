import { useState } from 'react';
import PricingModal from './components/PricingModal';
import {
  MessageCircle,
  Check,
  Star,
  Bot,
  Mic,
  Users,
  Clock,
  Shield,
  Menu,
  X,
  Phone,
  Video,
  MoreVertical,
  Send,
  Calendar,
  Wallet,
  BarChart3,
  ChevronRight,
  Zap,
} from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen]   = useState(false);
  const [isAnnual, setIsAnnual]       = useState(false);
  const [modalOpen, setModalOpen]     = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const features = [
    {
      icon: <Calendar className="w-5 h-5 text-orange-400" />,
      title: 'Programación de Citas',
      description:
        'Agenda automáticamente tus reuniones y citas a través de WhatsApp con comandos naturales.',
    },
    {
      icon: <Wallet className="w-5 h-5 text-orange-400" />,
      title: 'Gestión Financiera',
      description:
        'Registra tus gastos e ingresos automáticamente y mantén control de tu dinero.',
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-orange-400" />,
      title: 'Informes Inteligentes',
      description:
        'Genera reportes detallados sobre tus gastos y patrones financieros.',
    },
    {
      icon: <Mic className="w-5 h-5 text-orange-400" />,
      title: 'Reconocimiento de Voz',
      description:
        'Habla naturalmente y AsistPro entenderá tus notas de voz perfectamente.',
    },
  ];

  const testimonials = [
    {
      name: 'María González',
      role: 'Empresaria',
      initials: 'MG',
      content:
        'AsistPro revolucionó mi organización diaria. Ahora nunca olvido una cita y tengo control total de mis gastos.',
      rating: 5,
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Freelancer',
      initials: 'CR',
      content:
        'La integración con WhatsApp es perfecta. Puedo gestionar todo mi negocio desde una sola conversación.',
      rating: 5,
    },
    {
      name: 'Ana Martín',
      role: 'Consultora',
      initials: 'AM',
      content:
        'Los informes financieros me ayudaron a identificar patrones de gasto que no veía antes. Increíble herramienta.',
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      monthlyPrice: 'ARS $3.999',
      annualPrice: 'ARS $39.990',
      period: isAnnual ? 'por año' : 'por mes',
      savings: isAnnual ? 'Ahorra ARS $7.998' : null,
      description: 'Ideal para quienes quieren comenzar a organizarse',
      features: [
        '40 recordatorios por mes',
        'Reconocimiento de notas de voz',
        'Recordatorios recurrentes',
        'Creación de listas',
      ],
      notIncluded: [
        'Múltiples recordatorios en un solo mensaje',
        'Acceso anticipado a nuevas funciones',
        'Respuestas del asistente por audio',
        'Google Calendar',
        'Finanzas personales',
      ],
      cardClass: 'bg-[#13131c] border border-white/[0.07]',
      buttonClass: 'bg-white/10 hover:bg-white/[0.15] text-white',
    },
    {
      name: 'Pro',
      monthlyPrice: 'ARS $5.999',
      annualPrice: 'ARS $59.990',
      period: isAnnual ? 'por año' : 'por mes',
      savings: isAnnual ? 'Ahorra ARS $11.998' : null,
      description: 'Para usuarios activos que quieren mayor control',
      features: [
        '180 recordatorios por mes',
        'Reconocimiento de notas de voz',
        'Recordatorios recurrentes',
        'Creación de listas',
        'Múltiples recordatorios en un solo mensaje',
        'Acceso anticipado a nuevas funciones',
        'Google Calendar (notificaciones de eventos)',
      ],
      notIncluded: [
        'Respuestas del asistente por audio',
        'Finanzas personales',
      ],
      cardClass: 'bg-[#1a1008] border border-orange-500/30 animate-glow-pulse',
      buttonClass:
        'bg-orange-500 hover:bg-orange-400 text-white shadow-lg shadow-orange-500/20',
      popular: true,
    },
    {
      name: 'Premium',
      monthlyPrice: 'ARS $9.999',
      annualPrice: 'ARS $99.990',
      period: isAnnual ? 'por año' : 'por mes',
      savings: isAnnual ? 'Ahorra ARS $19.998' : null,
      description: 'Todo lo que necesitás, sin límites',
      features: [
        'Recordatorios ilimitados',
        'Reconocimiento de notas de voz',
        'Recordatorios recurrentes',
        'Creación de listas',
        'Múltiples recordatorios en un solo mensaje',
        'Acceso anticipado a nuevas funciones',
        'Respuestas del asistente por audio',
        'Google Calendar (gestión completa de eventos y notificaciones)',
        'Finanzas personales (asistente por WhatsApp para tus gastos)',
      ],
      notIncluded: [],
      cardClass:
        'bg-gradient-to-br from-[#1a1008] to-[#0c0c12] border border-orange-500/20',
      buttonClass:
        'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white shadow-lg shadow-orange-500/20',
    },
  ];

  const openModal = (plan: any) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  const whatsappRedirect = () => {
    window.open('https://wa.me/5492604086606', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0c0c12] font-sans">

      {/* ── HEADER ── */}
      <header className="bg-[#0c0c12]/90 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">

            {/* Logo */}
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white font-display tracking-tight">
                AsistPro
              </span>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex space-x-8">
              {['#features', '#testimonials', '#pricing', '#contact'].map(
                (href, i) => (
                  <a
                    key={i}
                    href={href}
                    className="text-gray-400 hover:text-orange-400 transition-colors text-sm font-medium"
                  >
                    {['Funciones', 'Testimonios', 'Precios', 'Contacto'][i]}
                  </a>
                )
              )}
            </nav>

            {/* CTA */}
            <div className="hidden md:flex items-center">
              <a
                href="#pricing"
                className="bg-orange-500 hover:bg-orange-400 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-orange-500/25"
              >
                Prueba Gratis
              </a>
            </div>

            {/* Hamburger */}
            <button
              className="md:hidden text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/5">
              <nav className="flex flex-col space-y-4">
                {['#features', '#testimonials', '#pricing', '#contact'].map(
                  (href, i) => (
                    <a
                      key={i}
                      href={href}
                      className="text-gray-400 hover:text-orange-400 transition-colors text-sm font-medium"
                    >
                      {['Funciones', 'Testimonios', 'Precios', 'Contacto'][i]}
                    </a>
                  )
                )}
                <a
                  href="#pricing"
                  className="bg-orange-500 text-white px-5 py-2 rounded-lg text-sm font-semibold text-center"
                >
                  Prueba Gratis
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative bg-[#0c0c12] py-24 lg:py-32 overflow-hidden">
        {/* Ambient glow orbs */}
        <div className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full bg-orange-500/[0.08] blur-[140px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-orange-400/[0.06] blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left: copy */}
            <div>
              <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-orange-400 text-xs font-medium tracking-wide uppercase">
                  Disponible 24/7 en WhatsApp
                </span>
              </div>

              <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-6 leading-[1.03] tracking-tight animate-fade-in-up-1">
                Tu{' '}
                <span className="text-orange-500">Asistente</span>
                <br />
                Virtual{' '}
                <span className="text-orange-500">Inteligente</span>
              </h1>

              <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-md animate-fade-in-up-2">
                AsistPro organiza tu vida automáticamente. Programa citas,
                controla gastos y genera informes detallados, todo desde
                WhatsApp con inteligencia artificial avanzada.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10 animate-fade-in-up-3">
                <a
                  href="#pricing"
                  className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2"
                >
                  Comenzar Prueba Gratuita
                  <ChevronRight className="w-4 h-4" />
                </a>
                <button className="border border-white/10 text-gray-300 hover:border-white/20 hover:text-white px-8 py-3.5 rounded-xl font-semibold transition-all">
                  Ver Demo
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 animate-fade-in-up-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-500/70" />
                  <span>3 días gratis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-500/70" />
                  <span>+10,000 usuarios</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500/70" />
                  <span>Disponible 24/7</span>
                </div>
              </div>
            </div>

            {/* Right: WhatsApp mockup */}
            <div className="relative flex flex-col items-center">
              {/* Glow halo */}
              <div className="absolute inset-0 bg-orange-500/[0.12] rounded-3xl blur-[80px] pointer-events-none" />

              <div className="animate-float relative z-10 w-full max-w-sm mx-auto">
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
                    <Video className="w-4 h-4" />
                    <Phone className="w-4 h-4" />
                    <MoreVertical className="w-4 h-4" />
                  </div>
                </div>

                {/* Chat bubbles */}
                <div
                  className="p-4 min-h-[360px] relative"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundColor: '#efeae2',
                  }}
                >
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <div className="bg-[#dcf8c6] text-gray-800 rounded-lg p-3 max-w-xs shadow-sm">
                        <p className="text-sm">
                          Hola! Recordame agendar reunión con cliente mañana a
                          las 3pm
                        </p>
                        <p className="text-xs text-gray-600 mt-1 text-right">14:32</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-white rounded-lg p-3 max-w-xs shadow-sm">
                        <p className="text-sm text-gray-800">
                          ✅ Perfecto! He agendado tu reunión para mañana 15:00.
                          También creé un recordatorio 30 minutos antes.
                        </p>
                        <p className="text-xs text-gray-500 mt-1">14:32</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-[#dcf8c6] text-gray-800 rounded-lg p-3 max-w-xs shadow-sm">
                        <p className="text-sm">
                          Genial! También registra que gasté $2500 en almuerzo
                        </p>
                        <p className="text-xs text-gray-600 mt-1 text-right">14:35</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-white rounded-lg p-3 max-w-xs shadow-sm">
                        <p className="text-sm text-gray-800">
                          💰 Registrado! Gasto de $2.500 en categoría
                          "Alimentación". Tu presupuesto mensual va en 65%.
                        </p>
                        <p className="text-xs text-gray-500 mt-1">14:35</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input bar */}
                <div className="bg-[#f0f0f0] rounded-b-2xl p-3 flex items-center space-x-2">
                  <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Escribe un mensaje..."
                      className="flex-1 outline-none text-sm"
                      disabled
                    />
                    <Mic className="w-4 h-4 text-gray-400" />
                  </div>
                  <button className="bg-[#25d366] p-2 rounded-full">
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="mt-8 text-center relative z-10">
                <button
                  onClick={whatsappRedirect}
                  className="bg-[#25d366] hover:bg-[#20c55a] text-white px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 shadow-xl shadow-[#25d366]/20 flex items-center space-x-2 mx-auto"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chatear con AsistPro</span>
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  Comienza tu prueba gratuita ahora
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 bg-[#13131c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-3">
              Funcionalidades
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              Todo lo que Necesitas
              <br />
              en un Solo Lugar
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              AsistPro combina inteligencia artificial avanzada con simplicidad
              de uso para transformar cómo gestionas tu tiempo y dinero.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-6 hover:border-orange-500/20 transition-all duration-300 group"
              >
                <div className="w-11 h-11 bg-orange-500/15 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500/25 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section
        id="testimonials"
        className="py-24 bg-[#0c0c12] relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-500/[0.05] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-3">
              Testimonios
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              Lo que Dicen Nuestros Usuarios
            </h2>
            <p className="text-gray-400 text-lg">
              Miles de personas ya transformaron su productividad con AsistPro
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass rounded-2xl p-6 relative">
                {/* Decorative quote */}
                <div className="text-orange-500/15 text-9xl font-serif leading-none absolute top-2 right-4 select-none pointer-events-none">
                  "
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-orange-400 fill-current"
                    />
                  ))}
                </div>

                <p className="text-gray-300 mb-5 leading-relaxed text-sm relative z-10">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-400 text-xs font-bold">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-500 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 bg-[#13131c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-3">
              Precios
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              Planes que Se Adaptan a Ti
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Elige el plan perfecto para tus necesidades. Todos incluyen 3 días
              de prueba gratuita.
            </p>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-4">
              <span
                className={`text-sm font-medium transition-colors ${
                  !isAnnual ? 'text-white' : 'text-gray-500'
                }`}
              >
                Mensual
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAnnual ? 'bg-orange-500' : 'bg-white/15'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span
                className={`text-sm font-medium transition-colors ${
                  isAnnual ? 'text-white' : 'text-gray-500'
                }`}
              >
                Anual
              </span>
              {isAnnual && (
                <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-0.5 rounded-full text-xs font-semibold">
                  Ahorra hasta 20%
                </span>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 relative ${plan.cardClass}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg shadow-orange-500/30 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Más Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-display text-xl font-bold text-white mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{plan.description}</p>
                </div>

                <div className="mb-7">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-3xl font-bold text-white">
                      {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-500 text-sm">{plan.period}</span>
                  </div>
                  {plan.savings && isAnnual && (
                    <p className="text-orange-400 text-xs font-medium mt-1">
                      {plan.savings}
                    </p>
                  )}
                  <p className="text-green-400 text-xs font-medium mt-1">
                    🆓 Prueba gratis por 3 días
                  </p>
                </div>

                <div className="space-y-2.5 mb-8">
                  <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                    Incluye:
                  </p>
                  {plan.features.map((feature, fi) => (
                    <div key={fi} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-orange-400" />
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}

                  {plan.notIncluded.length > 0 && (
                    <>
                      <p className="text-gray-600 text-[11px] font-bold uppercase tracking-wider pt-2">
                        No incluye:
                      </p>
                      {plan.notIncluded.map((feature, fi) => (
                        <div key={fi} className="flex items-start gap-2.5">
                          <X className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <button
                  onClick={() => openModal(plan)}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${plan.buttonClass}`}
                >
                  Comenzar Prueba Gratuita
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-[#0c0c12] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/[0.08] via-orange-500/[0.04] to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-5">
            Empieza hoy
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">
            ¿Listo para Transformar
            <br />
            tu Productividad?
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Únete a miles de usuarios que ya optimizaron su tiempo y finanzas
            con AsistPro. Comienza tu prueba gratuita hoy mismo.
          </p>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-2xl shadow-orange-500/25 text-lg"
          >
            Comenzar Ahora — Gratis por 3 Días
            <ChevronRight className="w-5 h-5" />
          </a>
          <p className="text-gray-600 mt-5 text-sm">
            Sin tarjeta de crédito requerida · Cancela en cualquier momento
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contact" className="bg-[#080810] border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center space-x-2.5 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white font-display">
                  AsistPro
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Tu asistente virtual inteligente para una vida más organizada y
                productiva.
              </p>
            </div>

            {[
              {
                title: 'Producto',
                links: ['Funciones', 'Precios', 'API', 'Integraciones'],
              },
              {
                title: 'Soporte',
                links: [
                  'Centro de Ayuda',
                  'Contacto',
                  'Comunidad',
                  'Estado del Servicio',
                ],
              },
              {
                title: 'Empresa',
                links: ['Sobre Nosotros', 'Blog', 'Carreras', 'Privacidad'],
              },
            ].map((col, i) => (
              <div key={i}>
                <h3 className="text-white font-semibold text-sm mb-5">
                  {col.title}
                </h3>
                <ul className="space-y-3 text-gray-500 text-sm">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a
                        href="#"
                        className="hover:text-orange-400 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-8 text-center text-gray-600 text-sm">
            <p>© 2024 AsistPro. Todos los derechos reservados.</p>
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
