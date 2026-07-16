import { useEffect, useState } from 'react';
import PricingModal from './components/PricingModal';
import { buildWhatsAppUrl } from './config/whatsapp';
import {
  MessageCircle,
  Check,
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
  Send
} from 'lucide-react';

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

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currency, setCurrency] = useState<'ARS' | 'USD'>('ARS');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedIsAnnual, setSelectedIsAnnual] = useState(false);

  useScrollReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    {
      tag: "Agenda",
      emoji: "📅",
      title: "Programación de Citas",
      description: "Agenda automáticamente tus reuniones y citas a través de WhatsApp con comandos naturales."
    },
    {
      tag: "Finanzas",
      emoji: "💰",
      title: "Gestión Financiera",
      description: "Registra tus gastos e ingresos automáticamente y mantén control de tu dinero."
    },
    {
      tag: "Informes",
      emoji: "📊",
      title: "Informes Inteligentes",
      description: "Genera reportes detallados sobre tus gastos y patrones financieros."
    },
    {
      tag: "Voz",
      emoji: "🎤",
      title: "Reconocimiento de Voz",
      description: "Habla naturalmente y AsistPro entenderá tus notas de voz perfectamente."
    }
  ];

  const testimonials = [
    {
      name: "María González",
      role: "Empresaria",
      content: "AsistPro revolucionó mi organización diaria. Ahora nunca olvido una cita y tengo control total de mis gastos.",
      time: "10:24"
    },
    {
      name: "Carlos Rodríguez",
      role: "Freelancer",
      content: "La integración con WhatsApp es perfecta. Puedo gestionar todo mi negocio desde una sola conversación.",
      time: "16:07"
    },
    {
      name: "Ana Martín",
      role: "Consultora",
      content: "Los informes financieros me ayudaron a identificar patrones de gasto que no veía antes. Increíble herramienta.",
      time: "09:41"
    }
  ];

  // Un solo plan, mostrado en dos modalidades (mensual/anual) y dos monedas (ARS/USD).
  // El nombre interno se mantiene "Pro" para no romper mapPlanName()/el webhook de
  // WhatsApp ni el mapa de precios USD de PricingModal, que ya usan ese valor.
  const plan = {
    name: "Pro",
    displayName: "AsistPro",
    description: "Todo lo que necesitás para organizarte, sin límites",
    price: {
      ARS: { monthly: "ARS $5.999", annual: "ARS $59.990", savings: "Ahorra ARS $11.998" },
      USD: { monthly: "USD $5.99", annual: "USD $59.99", savings: "Ahorra USD $11.89" },
    },
    features: [
      "Recordatorios ilimitados",
      "Reconocimiento de notas de voz",
      "Recordatorios recurrentes",
      "Creación de listas",
      "Múltiples recordatorios en un solo mensaje",
      "Acceso anticipado a nuevas funciones",
      "Respuestas del asistente por audio",
      "Google Calendar (gestión completa de eventos y notificaciones)",
      "Finanzas personales (asistente por WhatsApp para tus gastos)"
    ],
  };

  const openModal = (annual: boolean) => {
    setSelectedIsAnnual(annual);
    setSelectedPlan({
      name: plan.name,
      description: plan.description,
      monthlyPrice: plan.price.ARS.monthly,
      annualPrice: plan.price.ARS.annual,
      features: plan.features,
    });
    setModalOpen(true);
  };

  const whatsappRedirect = () => {
    window.open(buildWhatsAppUrl(), '_blank');
  };

  return (
    <div className="min-h-screen font-sans" style={{ color: 'var(--text-primary)' }}>
      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all ${scrolled ? 'shadow-sm' : ''}`}
        style={{
          background: scrolled ? 'rgba(243, 237, 227, 0.88)' : 'rgba(243, 237, 227, 0.55)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--accent-dark)' }}
              >
                <Bot className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <span className="text-2xl font-display font-extrabold tracking-tight">
                AsistPro
              </span>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}>Funciones</a>
              <a href="#testimonials" className="font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}>Testimonios</a>
              <a href="#pricing" className="font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}>Precios</a>
              <a href="#contact" className="font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}>Contacto</a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <a
                href="#pricing"
                className="u-press px-6 py-2 rounded-lg font-semibold block text-center text-white"
                style={{ background: 'var(--accent-dark)' }}
              >
                Prueba Gratis
              </a>
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4" style={{ borderTop: '1px solid var(--border)' }}>
              <nav className="flex flex-col space-y-4">
                <a href="#features" className="font-medium" style={{ color: 'var(--text-secondary)' }}>Funciones</a>
                <a href="#testimonials" className="font-medium" style={{ color: 'var(--text-secondary)' }}>Testimonios</a>
                <a href="#pricing" className="font-medium" style={{ color: 'var(--text-secondary)' }}>Precios</a>
                <a href="#contact" className="font-medium" style={{ color: 'var(--text-secondary)' }}>Contacto</a>
                <a
                  href="#pricing"
                  className="px-6 py-2 rounded-lg text-left font-semibold block text-white"
                  style={{ background: 'var(--accent-dark)' }}
                >
                  Prueba Gratis
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal">
              <span className="editorial-kicker font-mono">Tu asistente, organizado</span>
              <h1 className="mt-4 text-5xl lg:text-6xl font-display font-extrabold mb-6 leading-tight">
                Tu <span style={{ color: 'var(--accent-dark)' }}>Asistente Virtual</span> Inteligente
              </h1>
              <p className="text-xl mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                AsistPro organiza tu vida automáticamente. Programa citas, controla gastos y genera informes
                detallados, todo desde WhatsApp con inteligencia artificial avanzada.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#pricing"
                  className="u-press px-8 py-4 rounded-xl font-semibold text-center text-white"
                  style={{ background: 'var(--accent-dark)' }}
                >
                  Comenzar Prueba Gratuita
                </a>
                <button
                  className="u-press px-8 py-4 rounded-xl font-semibold border-2"
                  style={{ borderColor: 'var(--accent-dark)', color: 'var(--accent-dark)' }}
                >
                  Ver Demo
                </button>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" aria-hidden="true" />
                  <span>3 días gratis</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" aria-hidden="true" />
                  <span>+10,000 usuarios</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  <span>Disponible 24/7</span>
                </div>
              </div>
            </div>
            <div className="relative reveal reveal-delay-2">
              {/* WhatsApp-style Chat Interface — colores reales de WhatsApp: es una
                  representación literal del producto, no parte del acento de marca. */}
              <div className="bg-white rounded-2xl overflow-hidden max-w-sm mx-auto" style={{ boxShadow: 'var(--shadow-md)' }}>
                {/* WhatsApp Header */}
                <div className="bg-[#075e54] text-white p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-gray-600" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-semibold">AsistPro</p>
                      <p className="text-xs text-green-200">en línea</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Video className="w-5 h-5" aria-hidden="true" />
                    <Phone className="w-5 h-5" aria-hidden="true" />
                    <MoreVertical className="w-5 h-5" aria-hidden="true" />
                  </div>
                </div>

                {/* WhatsApp Background Pattern */}
                <div
                  className="p-4 min-h-[400px] relative"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundColor: '#efeae2'
                  }}
                >
                  <div className="space-y-4">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-[#dcf8c6] text-gray-800 rounded-lg p-3 max-w-xs shadow-sm">
                        <p className="text-sm">Hola! Recordame agendar reunión con cliente mañana a las 3pm</p>
                        <p className="text-xs text-gray-600 mt-1 text-right font-mono">14:32</p>
                      </div>
                    </div>

                    {/* Bot Response */}
                    <div className="flex justify-start">
                      <div className="bg-white rounded-lg p-3 max-w-xs shadow-sm">
                        <p className="text-sm text-gray-800">✅ Perfecto! He agendado tu reunión para mañana 15:00. También creé un recordatorio 30 minutos antes.</p>
                        <p className="text-xs text-gray-500 mt-1 font-mono">14:32</p>
                      </div>
                    </div>

                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-[#dcf8c6] text-gray-800 rounded-lg p-3 max-w-xs shadow-sm">
                        <p className="text-sm">Genial! También registra que gasté $2500 en almuerzo</p>
                        <p className="text-xs text-gray-600 mt-1 text-right font-mono">14:35</p>
                      </div>
                    </div>

                    {/* Bot Response */}
                    <div className="flex justify-start">
                      <div className="bg-white rounded-lg p-3 max-w-xs shadow-sm">
                        <p className="text-sm text-gray-800">💰 Registrado! Gasto de $2.500 en categoría "Alimentación". Tu presupuesto mensual va en 65%.</p>
                        <p className="text-xs text-gray-500 mt-1 font-mono">14:35</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Input */}
                <div className="bg-[#f0f0f0] p-3 flex items-center space-x-2">
                  <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Escribe un mensaje..."
                      className="flex-1 outline-none text-sm"
                      disabled
                    />
                    <Mic className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  </div>
                  <button className="bg-[#25d366] p-2 rounded-full">
                    <Send className="w-4 h-4 text-white" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* WhatsApp CTA Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={whatsappRedirect}
                  className="u-press bg-[#25d366] hover:bg-[#20c55a] text-white px-6 py-3 rounded-full font-semibold flex items-center space-x-2 mx-auto shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" aria-hidden="true" />
                  <span>Chatear con AsistPro</span>
                </button>
                <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Comienza tu prueba gratuita ahora</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 reveal">
            <span className="editorial-kicker font-mono">Cómo te ayuda</span>
            <h2 className="mt-4 text-4xl font-display font-extrabold mb-4">
              Todo lo que Necesitas en un Solo Lugar
            </h2>
            <p className="text-xl max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
              AsistPro combina inteligencia artificial avanzada con simplicidad de uso para
              transformar cómo gestionas tu tiempo y dinero.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`reveal reveal-delay-${Math.min(index + 1, 6)} pt-6`}
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl" aria-hidden="true">{feature.emoji}</span>
                  <span className="font-mono text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-dark)' }}>
                    {feature.tag}
                  </span>
                </div>
                <h3 className="text-xl font-display font-semibold mb-3">
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20" style={{ background: 'var(--bg-elevated)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <span className="editorial-kicker font-mono justify-center">Lo que dicen</span>
            <h2 className="mt-4 text-4xl font-display font-extrabold mb-4">
              Lo que Dicen Nuestros Usuarios
            </h2>
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
              Miles de personas ya transformaron su productividad con AsistPro
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`reveal reveal-delay-${index + 1}`}>
                {/* Burbuja de chat entrante — mismo lenguaje visual que el mockup del hero */}
                <div className="bg-white rounded-2xl rounded-tl-sm p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
                  <p className="text-gray-800 text-sm leading-relaxed">
                    {testimonial.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-2 text-right font-mono">{testimonial.time}</p>
                </div>
                <div className="mt-3 pl-2">
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <span className="editorial-kicker font-mono justify-center">Un solo plan, sin sorpresas</span>
            <h2 className="mt-4 text-4xl font-display font-extrabold mb-4">
              Todo Incluido, a un Precio Justo
            </h2>
            <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
              Todas las funciones de AsistPro, sin límites. Incluye 3 días de prueba gratuita.
            </p>

            {/* Currency Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-10">
              <span className="font-mono text-sm font-semibold" style={{ color: currency === 'ARS' ? 'var(--accent-dark)' : 'var(--text-muted)' }}>
                ARS
              </span>
              <button
                onClick={() => setCurrency(currency === 'ARS' ? 'USD' : 'ARS')}
                aria-label="Cambiar moneda"
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                style={{ background: currency === 'USD' ? 'var(--accent-dark)' : '#D8CFBB' }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    currency === 'USD' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="font-mono text-sm font-semibold" style={{ color: currency === 'USD' ? 'var(--accent-dark)' : 'var(--text-muted)' }}>
                USD
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Mensual */}
            <div className="reveal reveal-delay-1 rounded-2xl p-8 bg-white relative" style={{ boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-display font-bold mb-2">{plan.displayName}</h3>
                <p style={{ color: 'var(--text-secondary)' }} className="mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-mono font-bold">{plan.price[currency].monthly}</span>
                  <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>por mes</span>
                </div>
                <p className="text-sm font-semibold" style={{ color: 'var(--accent-dark)' }}>🆓 Prueba gratis por 3 días</p>
              </div>

              <ul className="space-y-2 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-dark)' }} aria-hidden="true" />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => openModal(false)}
                className="u-press w-full text-white py-3 px-6 rounded-xl font-semibold"
                style={{ background: 'var(--accent-dark)' }}
              >
                Comenzar Prueba Gratuita
              </button>
            </div>

            {/* Anual */}
            <div className="reveal reveal-delay-2 rounded-2xl p-8 relative" style={{ background: 'var(--accent-light)', border: '2px solid var(--accent)' }}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="text-white px-4 py-2 rounded-full text-sm font-semibold" style={{ background: 'var(--accent-dark)' }}>
                  Más conveniente
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-display font-bold mb-2">{plan.displayName}</h3>
                <p style={{ color: 'var(--text-secondary)' }} className="mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-mono font-bold">{plan.price[currency].annual}</span>
                  <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>por año</span>
                </div>
                <p className="text-sm font-semibold mb-2" style={{ color: 'var(--accent-dark)' }}>{plan.price[currency].savings}</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--accent-dark)' }}>🆓 Prueba gratis por 3 días</p>
              </div>

              <ul className="space-y-2 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-dark)' }} aria-hidden="true" />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => openModal(true)}
                className="u-press w-full text-white py-3 px-6 rounded-xl font-semibold"
                style={{ background: 'var(--accent-dark)' }}
              >
                Comenzar Prueba Gratuita
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: 'var(--accent-dark)' }}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 reveal">
          <h2 className="text-4xl font-display font-extrabold text-white mb-6">
            ¿Listo para Transformar tu Productividad?
          </h2>
          <p className="text-xl mb-8" style={{ color: 'var(--accent-light)' }}>
            Únete a miles de usuarios que ya optimizaron su tiempo y finanzas con AsistPro.
            Comienza tu prueba gratuita hoy mismo.
          </p>
          <button className="u-press bg-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg" style={{ color: 'var(--accent-dark)' }}>
            Comenzar Ahora - Gratis por 3 Días
          </button>
          <p className="mt-4 text-sm" style={{ color: 'var(--accent-light)' }}>
            Sin tarjeta de crédito requerida • Cancela en cualquier momento
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 text-white" style={{ background: 'var(--text-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-dark)' }}>
                  <Bot className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <span className="text-2xl font-display font-extrabold">AsistPro</span>
              </div>
              <p className="text-gray-400">
                Tu asistente virtual inteligente para una vida más organizada y productiva.
              </p>
            </div>
            <div>
              <h3 className="font-mono text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>Producto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Funciones</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonios</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/legal/privacy-policy" className="hover:text-white transition-colors">Política de Privacidad</a></li>
                <li><a href="/legal/terms-of-service" className="hover:text-white transition-colors">Términos de Servicio</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 AsistPro. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      <PricingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPlan={selectedPlan}
        isAnnual={selectedIsAnnual}
      />
    </div>
  );
}

export default App;
