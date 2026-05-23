import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Phone, CreditCard, Globe, Mail, MessageCircle } from 'lucide-react';
import Select, { type SingleValue, type StylesConfig } from 'react-select';
import { validateEmail, validatePhoneE164, formatPhoneE164, mapPlanName } from '../utils/validation';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { lightColors, borderRadius, spacing } from '../styles/tokens';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: {
    name: string;
    monthlyPrice: string;
    annualPrice: string;
    features: string[];
    description: string;
  } | null;
  isAnnual: boolean;
}

interface CountryOption {
  value: string;
  label: string;
  code: string;
  flag: string;
}

const countries: CountryOption[] = [
  { value: '+54', label: 'Argentina', code: 'AR', flag: 'https://flagcdn.com/ar.svg' },
  { value: '+1', label: 'Estados Unidos', code: 'US', flag: 'https://flagcdn.com/us.svg' },
  { value: '+52', label: 'México', code: 'MX', flag: 'https://flagcdn.com/mx.svg' },
  { value: '+34', label: 'España', code: 'ES', flag: 'https://flagcdn.com/es.svg' },
  { value: '+55', label: 'Brasil', code: 'BR', flag: 'https://flagcdn.com/br.svg' },
  { value: '+56', label: 'Chile', code: 'CL', flag: 'https://flagcdn.com/cl.svg' },
  { value: '+57', label: 'Colombia', code: 'CO', flag: 'https://flagcdn.com/co.svg' },
  { value: '+51', label: 'Perú', code: 'PE', flag: 'https://flagcdn.com/pe.svg' },
  { value: '+58', label: 'Venezuela', code: 'VE', flag: 'https://flagcdn.com/ve.svg' },
  { value: '+591', label: 'Bolivia', code: 'BO', flag: 'https://flagcdn.com/bo.svg' },
  { value: '+593', label: 'Ecuador', code: 'EC', flag: 'https://flagcdn.com/ec.svg' },
  { value: '+502', label: 'Guatemala', code: 'GT', flag: 'https://flagcdn.com/gt.svg' },
  { value: '+53', label: 'Cuba', code: 'CU', flag: 'https://flagcdn.com/cu.svg' },
  { value: '+504', label: 'Honduras', code: 'HN', flag: 'https://flagcdn.com/hn.svg' },
  { value: '+505', label: 'Nicaragua', code: 'NI', flag: 'https://flagcdn.com/ni.svg' },
  { value: '+503', label: 'El Salvador', code: 'SV', flag: 'https://flagcdn.com/sv.svg' },
  { value: '+595', label: 'Paraguay', code: 'PY', flag: 'https://flagcdn.com/py.svg' },
  { value: '+598', label: 'Uruguay', code: 'UY', flag: 'https://flagcdn.com/uy.svg' },
  { value: '+507', label: 'Panamá', code: 'PA', flag: 'https://flagcdn.com/pa.svg' },
  { value: '+506', label: 'Costa Rica', code: 'CR', flag: 'https://flagcdn.com/cr.svg' },
  { value: '+240', label: 'Guinea Ecuatorial', code: 'GQ', flag: 'https://flagcdn.com/gq.svg' },
  { value: '+1809', label: 'República Dominicana', code: 'DO', flag: 'https://flagcdn.com/do.svg' },
  { value: '+1787', label: 'Puerto Rico', code: 'PR', flag: 'https://flagcdn.com/pr.svg' },
];


const paymentMethods = [
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    logo: 'https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/6.6.92/mercadolibre/logo_large_25years@2x.png',
    description: 'Pago seguro con Mercado Pago'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    logo: 'https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-200px.png',
    description: 'Pago internacional con PayPal'
  }
];

export default function PricingModal({ isOpen, onClose, selectedPlan, isAnnual }: PricingModalProps) {
  // Función para obtener el precio en USD según el plan y periodicidad
  function getUsdPrice(planName: string, isAnnual: boolean) {
    const monthlyPrices: Record<string, string> = {
      'Starter': '3.99',
      'Pro': '5.99',
      'Premium': '9.99',
    };
    const annualPrices: Record<string, string> = {
      'Starter': '39.99',
      'Pro': '59.99',
      'Premium': '99.99',
    };
    if (isAnnual) {
      return annualPrices[planName] || '';
    } else {
      return monthlyPrices[planName] || '';
    }
  }
  const [step, setStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Reset form state when modal opens (Modal handles scroll lock)
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPhoneNumber('');
      setEmail('');
      setSelectedPayment('');
      setErrors({});
      setIsProcessing(false);
    }
  }, [isOpen]);

  // Prevent closing during payment processing
  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    // Phone validation
    if (!phoneNumber.trim()) {
      newErrors.phone = 'El número de teléfono es requerido';
    } else {
      const fullPhone = formatPhoneE164(selectedCountry.value, phoneNumber);
      if (!validatePhoneE164(fullPhone)) {
        newErrors.phone = 'Ingresa un número de teléfono válido (8-15 dígitos)';
      }
    }

    // Payment method validation
    if (!selectedPayment) {
      newErrors.payment = 'Selecciona un método de pago';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      setStep(2);
    }
  };

  const handleConfirmPayment = () => {
    if (!selectedPlan) return;

    setIsProcessing(true);
    const phoneE164 = formatPhoneE164(selectedCountry.value, phoneNumber);
    const paymentName = paymentMethods.find(p => p.id === selectedPayment)?.name || selectedPayment;
    const message = [
      'Hola, quiero activar AsistPro.',
      `Plan: ${mapPlanName(selectedPlan.name)}`,
      `Facturación: ${isAnnual ? 'annual' : 'monthly'}`,
      `Pago preferido: ${paymentName}`,
      `WhatsApp: ${phoneE164}`,
      `Email: ${email.trim()}`,
    ].join('\n');

    window.open(`https://wa.me/5492604086606?text=${encodeURIComponent(message)}`, '_blank');
    onClose();
  };

  // Token-based select styles (replaces hardcoded hex values)
  const customSelectStyles: StylesConfig<CountryOption, false> = {
    control: (provided) => ({
      ...provided,
      border: `2px solid ${lightColors['accent-light']}`,
      borderRadius: borderRadius.xl,
      padding: spacing[2],
      boxShadow: 'none',
      '&:hover': {
        border: `2px solid ${lightColors.accent}`,
      },
      '&:focus-within': {
        border: `2px solid ${lightColors['accent-dark']}`,
        boxShadow: `0 0 0 3px rgba(249, 115, 22, 0.1)`,
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? lightColors['accent-dark'] : state.isFocused ? lightColors['accent-light'] : lightColors.white,
      color: state.isSelected ? lightColors.white : lightColors.text,
      padding: spacing[3],
      cursor: 'pointer',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: lightColors.text,
      fontWeight: '500',
    }),
  };

  if (!selectedPlan) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={selectedPlan.name} theme="light">
      {/* Price subtitle */}
      <p className="text-sm mt-1" style={{ color: lightColors.secondary }}>
        {/* Mostrar precio en USD solo si PayPal está seleccionado */}
        {selectedPayment === 'paypal' ? (
          isAnnual
            ? `${getUsdPrice(selectedPlan.name, true)} USD por año`
            : `${getUsdPrice(selectedPlan.name, false)} USD por mes`
        ) : (
          <>
            {isAnnual ? selectedPlan.annualPrice : selectedPlan.monthlyPrice} {isAnnual ? ' por año' : ' por mes'}
          </>
        )}
      </p>

      {/* Scrollable content */}
      <div className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto mt-4">
        {step === 1 && (
          <div>
            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-2" style={{ color: lightColors.text }}>
                Información de Contacto
              </h4>
            </div>
            {/* Country Selector */}
            <div className="mb-4">
              <label htmlFor="country-select" className="block text-sm font-medium mb-2" style={{ color: lightColors.secondary }}>
                <Globe className="w-4 h-4 inline mr-1" aria-hidden="true" />
                País
              </label>
              <Select<CountryOption, false>
                inputId="country-select-input"
                aria-label="Seleccionar país"
                value={selectedCountry}
                onChange={(option: SingleValue<CountryOption>) => {
                  if (option) setSelectedCountry(option);
                }}
                options={countries}
                styles={customSelectStyles}
                formatOptionLabel={(option: CountryOption) => (
                  <div className="flex items-center space-x-3">
                    <img src={option.flag} alt={option.label} className="w-6 h-4 object-cover rounded-sm border border-gray-200" />
                    <span>{option.label}</span>
                    <span className="text-sm" style={{ color: lightColors.muted }}>({option.value})</span>
                  </div>
                )}
                isSearchable
                placeholder="Selecciona tu país"
              />
            </div>

            {/* Phone Number */}
            <div className="mb-6">
              <label htmlFor="phone-number" className="block text-sm font-medium mb-2" style={{ color: lightColors.secondary }}>
                <Phone className="w-4 h-4 inline mr-1" aria-hidden="true" />
                Número de WhatsApp
              </label>
              <div className="flex w-full">
                <div className="bg-gray-100 border-2 border-r-0 rounded-l-xl px-3 sm:px-4 py-3 flex items-center flex-shrink-0 min-h-[44px]" style={{ borderColor: lightColors['accent-light'] }}>
                  <span className="font-medium" style={{ color: lightColors.secondary }}>{selectedCountry.value}</span>
                </div>
                <input
                  id="phone-number"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/\D/g, '');
                    setPhoneNumber(value);
                  }}
                  placeholder="1122334455"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  className={`flex-1 min-w-0 border-2 border-l-0 rounded-r-xl px-3 sm:px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-h-[44px] ${
                    errors.phone ? 'border-red-300' : ''
                  }`}
                  style={!errors.phone ? { borderColor: lightColors['accent-light'] } : undefined}
                />
              </div>
              {phoneNumber && !errors.phone && (
                <p className="text-orange-600 text-xs mt-1 flex items-center">
                  <Phone className="w-3 h-3 mr-1" aria-hidden="true" />
                  La activación del servicio se realizará para ese número
                </p>
              )}
              {errors.phone && (
                <p id="phone-error" className="text-red-500 text-sm mt-1" role="alert">{errors.phone}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email-input" className="block text-sm font-medium mb-2" style={{ color: lightColors.secondary }}>
                <Mail className="w-4 h-4 inline mr-1" aria-hidden="true" />
                Email
              </label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-h-[44px] ${
                  errors.email ? 'border-red-300' : ''
                }`}
                style={!errors.email ? { borderColor: lightColors['accent-light'] } : undefined}
              />
              {email && !errors.email && (
                <p className="text-orange-600 text-xs mt-1 flex items-center">
                  <Mail className="w-3 h-3 mr-1" aria-hidden="true" />
                  Ingresa el correo donde quieres recibir la transacción
                </p>
              )}
              {errors.email && (
                <p id="email-error" className="text-red-500 text-sm mt-1" role="alert">{errors.email}</p>
              )}
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <span id="payment-label" className="block text-sm font-medium mb-3" style={{ color: lightColors.secondary }}>
                <CreditCard className="w-4 h-4 inline mr-1" aria-hidden="true" />
                Método de Pago
              </span>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4" role="radiogroup" aria-labelledby="payment-label">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    aria-label={`Pago con ${method.name}`}
                    role="radio"
                    aria-checked={selectedPayment === method.id}
                    className={`border-2 rounded-xl transition-all flex items-center justify-center bg-white focus:outline-none relative sm:w-1/2 h-14 min-h-[44px] ${
                      selectedPayment === method.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <img 
                      src={method.logo} 
                      alt={method.name}
                      className="h-8 w-auto object-contain mx-auto"
                    />
                    {selectedPayment === method.id && (
                      <Check className="w-5 h-5 text-orange-600 absolute top-2 right-2" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
              {errors.payment && (
                <p id="payment-error" className="text-red-500 text-sm mt-1" role="alert">{errors.payment}</p>
              )}
            </div>

            {/* Continue Button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full py-4"
              onClick={handleContinue}
            >
              Continuar con el Pago
            </Button>

            <p className="text-center text-sm mt-4" style={{ color: lightColors.muted }}>
              🔒 Tus datos están protegidos con encriptación SSL
            </p>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => setStep(1)}
                className="flex items-center text-orange-600 hover:text-orange-700 transition-colors mb-4"
                disabled={isProcessing}
                aria-label="Volver al paso anterior"
              >
                <ArrowLeft className="w-4 h-4 mr-1" aria-hidden="true" />
                Volver
              </button>
              <h3 className="text-xl font-semibold mb-2" style={{ color: lightColors.text }}>
                Confirmar Suscripción
              </h3>
              <p style={{ color: lightColors.secondary }}>
                Revisa los detalles antes de solicitar la activación
              </p>
            </div>

            {/* Order Summary */}
            <div className="bg-orange-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold mb-3" style={{ color: lightColors.text }}>Resumen del Pedido</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ color: lightColors.secondary }}>Plan:</span>
                  <span className="font-semibold">{selectedPlan.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span style={{ color: lightColors.secondary }}>Facturación:</span>
                  <span className="font-semibold">
                    {isAnnual ? 'Anual' : 'Mensual'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span style={{ color: lightColors.secondary }}>Precio:</span>
                  <span className="font-semibold text-orange-600">
                    {selectedPayment === 'paypal' ? (
                      isAnnual
                        ? `${getUsdPrice(selectedPlan.name, true)} USD`
                        : `${getUsdPrice(selectedPlan.name, false)} USD`
                    ) : (
                      <>
                        {isAnnual ? selectedPlan.annualPrice : selectedPlan.monthlyPrice} {isAnnual ? ' ' : ' '}
                      </>
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span style={{ color: lightColors.secondary }}>Email:</span>
                  <span className="font-semibold text-sm">{email}</span>
                </div>
                
                <div className="flex justify-between">
                  <span style={{ color: lightColors.secondary }}>WhatsApp:</span>
                  <span className="font-semibold text-sm">
                    {selectedCountry.code} {formatPhoneE164(selectedCountry.value, phoneNumber)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span style={{ color: lightColors.secondary }}>Pago:</span>
                  <span className="font-semibold">
                    {paymentMethods.find(p => p.id === selectedPayment)?.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Features Included */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3" style={{ color: lightColors.text }}>Incluye:</h4>
              <ul className="space-y-2">
                {selectedPlan.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm" style={{ color: lightColors.secondary }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trial Notice */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-green-800 text-sm font-medium">
                🎉 ¡Prueba gratuita por 3 días! No se te cobrará hasta que termine tu período de prueba.
              </p>
            </div>
            {/* Processing State */}
              {isProcessing && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" aria-hidden="true" />
                  <p className="text-green-800 font-medium">
                    Abriendo WhatsApp para coordinar la activación...
                  </p>
                </div>
              )}

            {/* Confirm Button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full py-4"
              onClick={handleConfirmPayment}
              disabled={isProcessing}
            >
              <MessageCircle className="w-5 h-5 mr-2" aria-hidden="true" />
              Solicitar Activación
            </Button>

            <p className="text-center text-xs mt-4" style={{ color: lightColors.muted }}>
              El checkout automático se habilitará cuando el backend de pagos esté disponible.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}