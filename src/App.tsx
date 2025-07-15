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
  Send
} from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const features = [
    {
      emoji: "📅",
      title: "Programación de Citas",
      description: "Agenda automáticamente tus reuniones y citas a través de WhatsApp con comandos naturales."
    },
    {
      emoji: "💰",
      title: "Gestión Financiera",
      description: "Registra tus gastos e ingresos automáticamente y mantén control de tu dinero."
    },
    {
      emoji: "📊",
      title: "Informes Inteligentes",
      description: "Genera reportes detallados sobre tus gastos y patrones financieros."
    },
    {
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
      rating: 5
    },
    {
      name: "Carlos Rodríguez",
      role: "Freelancer",
      content: "La integración con WhatsApp es perfecta. Puedo gestionar todo mi negocio desde una sola conversación.",
      rating: 5
    },
    {
      name: "Ana Martín",
      role: "Consultora",
      content: "Los informes financieros me ayudaron a identificar patrones de gasto que no veía antes. Increíble herramienta.",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      monthlyPrice: "ARS $3.999",
      annualPrice: "ARS $39.990",
      period: isAnnual ? "por año" : "por mes",
      savings: isAnnual ? "Ahorra ARS $7.998" : null,
      description: "Ideal para quienes quieren comenzar a organizarse",
      features: [
        "40 recordatorios por mes",
        "Reconocimiento de notas de voz",
        "Recordatorios recurrentes",
        "Creación de listas"
      ],
      notIncluded: [
        "Múltiples recordatorios en un solo mensaje",
        "Acceso anticipado a nuevas funciones",
        "Respuestas del asistente por audio",
        "Google Calendar",
        "Finanzas personales"
      ],
      color: "bg-orange-50 border-orange-200",
      buttonColor: "bg-orange-600 hover:bg-orange-700"
    },
    {
      name: "Pro",
      monthlyPrice: "ARS $5.999",
      annualPrice: "ARS $59.990",
      period: isAnnual ? "por año" : "por mes",
      savings: isAnnual ? "Ahorra ARS $11.998" : null,
      description: "Para usuarios activos que quieren mayor control",
      features: [
        "180 recordatorios por mes",
        "Reconocimiento de notas de voz",
        "Recordatorios recurrentes",
        "Creación de listas",
        "Múltiples recordatorios en un solo mensaje",
        "Acceso anticipado a nuevas funciones",
        "Google Calendar (notificaciones de eventos)"
      ],
      notIncluded: [
        "Respuestas del asistente por audio",
        "Finanzas personales"
      ],
      color: "bg-orange-100 border-orange-300",
      buttonColor: "bg-orange-700 hover:bg-orange-800",
      popular: true
    },
    {
      name: "Premium",
      monthlyPrice: "ARS $9.999",
      annualPrice: "ARS $99.990",
      period: isAnnual ? "por año" : "por mes",
      savings: isAnnual ? "Ahorra ARS $19.998" : null,
      description: "Todo lo que necesitás, sin límites",
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
      notIncluded: [],
      color: "bg-gradient-to-br from-orange-100 to-orange-200 border-orange-400",
      buttonColor: "bg-gradient-to-r from-orange-700 to-orange-800 hover:from-orange-800 hover:to-orange-900"
    }
  ];

  const openModal = (plan: any) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  const whatsappRedirect = () => {
    window.open('https://wa.me/5492604086606', '_blank');
  };

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              {/* LOGO PLACEHOLDER - Replace with your logo */}
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                AsistPro
              </span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Funciones</a>
              <a href="#testimonials" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Testimonios</a>
              <a href="#pricing" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Precios</a>
              <a href="#contact" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Contacto</a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <a href="#pricing" className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-2 rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all font-semibold block text-center">
                Prueba Gratis
              </a>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Funciones</a>
                <a href="#testimonials" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Testimonios</a>
                <a href="#pricing" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Precios</a>
                <a href="#contact" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Contacto</a>
                <a href="#pricing" className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-2 rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all text-left font-semibold block">
                  Prueba Gratis
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Tu <span className="bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">Asistente Virtual</span> Inteligente
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                AsistPro organiza tu vida automáticamente. Programa citas, controla gastos y genera informes 
                detallados, todo desde WhatsApp con inteligencia artificial avanzada.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#pricing" className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-800 transition-all transform hover:scale-105 shadow-lg block text-center">
                  Comenzar Prueba Gratuita
                </a>
                <button className="border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-xl font-semibold hover:bg-orange-600 hover:text-white transition-all">
                  Ver Demo
                </button>
              </div>
              <div className="mt-8 flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>3 días gratis</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>+10,000 usuarios</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Disponible 24/7</span>
                </div>
              </div>
            </div>
            <div className="relative">
              {/* WhatsApp-style Chat Interface */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-sm mx-auto">
                {/* WhatsApp Header */}
                <div className="bg-[#075e54] text-white p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold">AsistPro</p>
                      <p className="text-xs text-green-200">en línea</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Video className="w-5 h-5" />
                    <Phone className="w-5 h-5" />
                    <MoreVertical className="w-5 h-5" />
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
                        <p className="text-xs text-gray-600 mt-1 text-right">14:32</p>
                      </div>
                    </div>
                    
                    {/* Bot Response */}
                    <div className="flex justify-start">
                      <div className="bg-white rounded-lg p-3 max-w-xs shadow-sm">
                        <p className="text-sm text-gray-800">✅ Perfecto! He agendado tu reunión para mañana 15:00. También creé un recordatorio 30 minutos antes.</p>
                        <p className="text-xs text-gray-500 mt-1">14:32</p>
                      </div>
                    </div>

                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-[#dcf8c6] text-gray-800 rounded-lg p-3 max-w-xs shadow-sm">
                        <p className="text-sm">Genial! También registra que gasté $2500 en almuerzo</p>
                        <p className="text-xs text-gray-600 mt-1 text-right">14:35</p>
                      </div>
                    </div>

                    {/* Bot Response */}
                    <div className="flex justify-start">
                      <div className="bg-white rounded-lg p-3 max-w-xs shadow-sm">
                        <p className="text-sm text-gray-800">💰 Registrado! Gasto de $2.500 en categoría "Alimentación". Tu presupuesto mensual va en 65%.</p>
                        <p className="text-xs text-gray-500 mt-1">14:35</p>
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
                    <Mic className="w-4 h-4 text-gray-400" />
                  </div>
                  <button className="bg-[#25d366] p-2 rounded-full">
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* WhatsApp CTA Button */}
              <div className="mt-6 text-center">
                <button 
                  onClick={whatsappRedirect}
                  className="bg-[#25d366] hover:bg-[#20c55a] text-white px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chatear con AsistPro</span>
                </button>
                <p className="text-sm text-gray-500 mt-2">Comienza tu prueba gratuita ahora</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Todo lo que Necesitas en un Solo Lugar
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AsistPro combina inteligencia artificial avanzada con simplicidad de uso para 
              transformar cómo gestionas tu tiempo y dinero.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-orange-100 hover:border-orange-300">
                <div className="text-4xl mb-4">
                  {feature.emoji}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Lo que Dicen Nuestros Usuarios
            </h2>
            <p className="text-xl text-gray-600">
              Miles de personas ya transformaron su productividad con AsistPro
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-orange-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Planes que Se Adaptan a Ti
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Elige el plan perfecto para tus necesidades. Todos incluyen 3 días de prueba gratuita.
            </p>
            
            {/* Pricing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`font-medium ${!isAnnual ? 'text-orange-600' : 'text-gray-500'}`}>
                Mensual
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAnnual ? 'bg-orange-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`font-medium ${isAnnual ? 'text-orange-600' : 'text-gray-500'}`}>
                Anual
              </span>
              {isAnnual && (
                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-sm font-medium">
                  Ahorra hasta 20%
                </span>
              )}
            </div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`rounded-2xl p-8 ${plan.color} relative ${plan.popular ? 'ring-2 ring-orange-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Más Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  {plan.savings && isAnnual && (
                    <p className="text-sm text-orange-600 font-semibold mb-2">{plan.savings}</p>
                  )}
                  <p className="text-sm text-green-600 font-semibold">🆓 Prueba gratis por 3 días</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Incluye:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-2">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {plan.notIncluded.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">No incluye:</h4>
                      <ul className="space-y-2">
                        {plan.notIncluded.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start space-x-2">
                            <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-500 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => openModal(plan)}
                  className={`w-full ${plan.buttonColor} text-white py-3 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg`}
                >
                  Comenzar Prueba Gratuita
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para Transformar tu Productividad?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Únete a miles de usuarios que ya optimizaron su tiempo y finanzas con AsistPro. 
            Comienza tu prueba gratuita hoy mismo.
          </p>
          <button className="bg-white text-orange-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 text-lg shadow-lg">
            Comenzar Ahora - Gratis por 3 Días
          </button>
          <p className="text-orange-100 mt-4 text-sm">
            Sin tarjeta de crédito requerida • Cancela en cualquier momento
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                {/* FOOTER LOGO PLACEHOLDER - Replace with your logo */}
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">AsistPro</span>
              </div>
              <p className="text-gray-400">
                Tu asistente virtual inteligente para una vida más organizada y productiva.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Funciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integraciones</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Comunidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Estado del Servicio</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AsistPro. Todos los derechos reservados.</p>
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