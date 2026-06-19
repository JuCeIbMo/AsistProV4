import {
  BarChart3,
  CalendarRange,
  MessageCircle,
  Mic,
  NotebookTabs,
  Sparkles,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

export type ChatMessage = {
  side: 'user' | 'bot';
  text: string;
  time: string;
};

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type Testimonial = {
  name: string;
  role: string;
  initials: string;
  content: string;
  rating: number;
};

export type PricingPlan = {
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

export const navItems = [
  ['#features', 'Sistema'],
  ['#proof', 'Prueba'],
  ['#pricing', 'Planes'],
  ['#contact', 'Contacto'],
] as const;

export const chatMessages: ChatMessage[] = [
  { side: 'user', text: 'Agendá una reunión con Martina mañana a las 15:00.', time: '14:32' },
  {
    side: 'bot',
    text: 'Reunión creada. También dejé un recordatorio 30 minutos antes.',
    time: '14:32',
  },
  { side: 'user', text: 'Registrá 2500 en almuerzo con cliente.', time: '14:35' },
  {
    side: 'bot',
    text: 'Movimiento guardado en Alimentación. Tu presupuesto mensual está en 65%.',
    time: '14:35',
  },
  { side: 'user', text: 'Mostrame el resumen del mes.', time: '14:36' },
  {
    side: 'bot',
    text: 'Ingresos 84.200. Gastos 28.450. Alimentación 42%. Transporte 23%.',
    time: '14:36',
  },
];

export const heroStatusItems = [
  ['Próxima cita', 'Martina · 15:00'],
  ['Caja del mes', 'ARS 84.200'],
  ['Gasto operativo', 'ARS 28.450'],
] as const;

export const stats = [
  { value: 10000, prefix: '+', suffix: '', label: 'Usuarios activos' },
  { value: 98, prefix: '', suffix: '%', label: 'Satisfacción' },
  { value: 500, prefix: '+', suffix: 'K', label: 'Mensajes al mes' },
  { value: 3, prefix: '', suffix: '', label: 'Mercados activos' },
];

export const features: Feature[] = [
  {
    icon: CalendarRange,
    title: 'Agenda ejecutiva por WhatsApp',
    description:
      'Citas, recordatorios y seguimiento sin abrir otra herramienta ni romper tu flujo.',
  },
  {
    icon: Wallet,
    title: 'Finanzas conversacionales',
    description:
      'Ingresos, gastos y categorías quedan registrados desde lenguaje natural.',
  },
  {
    icon: BarChart3,
    title: 'Lectura operativa inmediata',
    description:
      'El panel resume el estado del mes con una jerarquía clara y accionable.',
  },
  {
    icon: Mic,
    title: 'Notas de voz interpretadas',
    description:
      'La fricción baja cuando la captura también funciona en audio y contexto real.',
  },
];

export const testimonials: Testimonial[] = [
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

export const processSteps = [
  ['Captura', 'Hablas o escribes en WhatsApp.'],
  ['Estructura', 'AsistPro convierte intención en cita, gasto o recordatorio.'],
  ['Lectura', 'El panel traduce actividad en estado operativo.'],
] as const;

export const footerColumns = [
  {
    title: 'Producto',
    icon: Sparkles,
    links: ['Sistema', 'Planes', 'Integraciones', 'Estado'],
  },
  {
    title: 'Soporte',
    icon: NotebookTabs,
    links: ['Centro de ayuda', 'Contacto', 'Privacidad', 'Términos'],
  },
  {
    title: 'Canales',
    icon: MessageCircle,
    links: ['WhatsApp', 'Email', 'Ventas', 'Comunidad'],
  },
] as const;

export function getPricingPlans(isAnnual: boolean): PricingPlan[] {
  return [
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
}
