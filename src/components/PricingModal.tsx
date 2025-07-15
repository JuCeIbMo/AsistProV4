import { useState, useEffect } from 'react';
import { X, ArrowLeft, Check, Loader2, Phone, CreditCard, Globe, Mail, AlertCircle } from 'lucide-react';
import Select from 'react-select';
import { validateEmail, validatePhoneE164, formatPhoneE164, mapPlanName } from '../utils/validation';
import { SubscriptionService, CreateSubscriptionRequest, CreateSubscriptionError } from '../services/subscriptionService';

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
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [apiError, setApiError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPhoneNumber('');
      setEmail('');
      setSelectedPayment('');
      setErrors({});
      setApiError('');
      setIsProcessing(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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

  const handleConfirmPayment = async () => {
    if (!selectedPlan) return;

    setIsLoading(true);
    setIsProcessing(true);
    setApiError('');

    try {
      const subscriptionData: CreateSubscriptionRequest = {
        plan: mapPlanName(selectedPlan.name),
        periodicity: isAnnual ? 'annual' : 'monthly',
        paymentProvider: selectedPayment as 'mercadopago' | 'paypal',
        phoneE164: formatPhoneE164(selectedCountry.value, phoneNumber),
        email: email.trim(),
      };
      console.log(subscriptionData)
      const response = await SubscriptionService.createSubscription(subscriptionData);

      // Show success message briefly before redirect
      setIsLoading(false);
      
      // Auto-redirect to checkout URL
      setTimeout(() => {
        window.open(response.data.checkoutUrl, '_blank');
        onClose();
      }, 1000);

    } catch (error) {
      setIsLoading(false);
      setIsProcessing(false);
      
      const apiError = error as CreateSubscriptionError;
      
      if (apiError.details && apiError.details.length > 0) {
        // Handle validation errors
        const newErrors: {[key: string]: string} = {};
        apiError.details.forEach(detail => {
          if (detail.param === 'email') {
            newErrors.email = detail.msg;
          } else if (detail.param === 'phoneE164') {
            newErrors.phone = detail.msg;
          }
        });
        setErrors(newErrors);
        setStep(1); // Go back to form
      } else {
        // Handle general errors
        setApiError(apiError.error || apiError.message || 'Error al procesar el pago');
      }
    }
  };

  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      border: '2px solid #fed7aa',
      borderRadius: '12px',
      padding: '8px',
      boxShadow: 'none',
      '&:hover': {
        border: '2px solid #fb923c',
      },
      '&:focus-within': {
        border: '2px solid #ea580c',
        boxShadow: '0 0 0 3px rgba(251, 146, 60, 0.1)',
      }
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#ea580c' : state.isFocused ? '#fed7aa' : 'white',
      color: state.isSelected ? 'white' : '#1f2937',
      padding: '12px',
      cursor: 'pointer',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#1f2937',
      fontWeight: '500',
    }),
  };

  if (!isOpen || !selectedPlan) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col transform transition-all duration-300 scale-100 opacity-100">
        {/* Header sticky */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{selectedPlan.name}</h2>
              <p className="text-orange-100 text-sm">
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
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-orange-200 transition-colors"
              disabled={isProcessing}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Contenido scrollable debajo de la cabecera sticky */}
        <div className="flex-1 overflow-y-auto">
        {step === 1 && (
          <div className="p-6">
            <div className="mb-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Información de Contacto
              </h4>
            </div>
            {/* Country Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                País
              </label>
              <Select
                value={selectedCountry}
                onChange={(option) => setSelectedCountry(option as CountryOption)}
                options={countries}
                styles={customSelectStyles}
                formatOptionLabel={(option: CountryOption) => (
                  <div className="flex items-center space-x-3">
                    <img src={option.flag} alt={option.label} className="w-6 h-4 object-cover rounded-sm border border-gray-200" />
                    <span>{option.label}</span>
                    <span className="text-gray-500 text-sm">({option.value})</span>
                  </div>
                )}
                isSearchable
                placeholder="Selecciona tu país"
              />
            </div>

            {/* Phone Number */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Número de WhatsApp
              </label>
              <div className="flex w-full">
                <div className="bg-gray-100 border-2 border-r-0 border-orange-200 rounded-l-xl px-3 sm:px-4 py-3 flex items-center flex-shrink-0">
                  <span className="font-medium text-gray-700">{selectedCountry.value}</span>
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/\D/g, '');
                    setPhoneNumber(value);
                  }}
                  placeholder="1122334455"
                  className={`flex-1 min-w-0 border-2 border-l-0 rounded-r-xl px-3 sm:px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.phone ? 'border-red-300' : 'border-orange-200'
                  }`}
                />
              </div>
              {phoneNumber && !errors.phone && (
                <p className="text-orange-600 text-xs mt-1 flex items-center">
                  <Phone className="w-3 h-3 mr-1" />
                  La activación del servicio se realizará para ese número
                </p>
              )}
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.email ? 'border-red-300' : 'border-orange-200'
                }`}
              />
              {email && !errors.email && (
                <p className="text-orange-600 text-xs mt-1 flex items-center">
                  <Mail className="w-3 h-3 mr-1" />
                  Ingresa el correo donde quieres recibir la transacción
                </p>
              )}
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <CreditCard className="w-4 h-4 inline mr-1" />
                Método de Pago
              </label>
              <div className="flex gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`border-2 rounded-xl transition-all flex items-center justify-center bg-white focus:outline-none relative w-1/2 h-14 ${
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
                      <Check className="w-5 h-5 text-orange-600 absolute top-2 right-2" />
                    )}
                  </button>
                ))}
              </div>
              {errors.payment && (
                <p className="text-red-500 text-sm mt-1">{errors.payment}</p>
              )}
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-800 transition-all transform hover:scale-105 shadow-lg"
            >
              Continuar con el Pago
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              🔒 Tus datos están protegidos con encriptación SSL
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="p-6">
            <div className="mb-6">
              <button
                onClick={() => setStep(1)}
                className="flex items-center text-orange-600 hover:text-orange-700 transition-colors mb-4"
                disabled={isProcessing}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Volver
              </button>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Confirmar Suscripción
              </h3>
              <p className="text-gray-600">
                Revisa los detalles antes de confirmar tu pago
              </p>
            </div>
            {/* Status de los fetching aqui estaban  */}

          
            {/* Order Summary */}
            <div className="bg-orange-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Resumen del Pedido</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-semibold">{selectedPlan.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Facturación:</span>
                  <span className="font-semibold">
                    {isAnnual ? 'Anual' : 'Mensual'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Precio:</span>
                  <span className="font-semibold text-orange-600">
{/* Mostrar precio en USD solo si PayPal está seleccionado //                    {isAnnual ? selectedPlan.annualPrice : selectedPlan.monthlyPrice}
//*/}
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
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold text-sm">{email}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">WhatsApp:</span>
                  <span className="font-semibold text-sm">
                    {selectedCountry.code} {formatPhoneE164(selectedCountry.value, phoneNumber)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Pago:</span>
                  <span className="font-semibold">
                    {paymentMethods.find(p => p.id === selectedPayment)?.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Features Included */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Incluye:</h4>
              <ul className="space-y-2">
                {selectedPlan.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
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
  {/* API Error Display */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">Error al procesar el pago</p>
                  <p className="text-red-700 text-sm mt-1">{apiError}</p>
                </div>
              </div>
            )}

            {/* Processing State */}
            {isProcessing && !isLoading && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500" />
                <p className="text-green-800 font-medium">
                  ¡Suscripción creada! Redirigiendo a la plataforma de pago...
                </p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center space-x-3">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                <div>
                  <p className="text-blue-800 font-medium">Creando tu suscripción...</p>
                  <p className="text-blue-700 text-sm">Te redirigiremos a tu plataforma de pago</p>
                </div>
              </div>
            )}

            {/* Confirm Button */}
            <button
              onClick={handleConfirmPayment}
              disabled={isLoading || isProcessing}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-800 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Procesando...
                </>
              ) : (
                'Confirmar Pago'
              )}
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              Al confirmar, aceptas nuestros términos de servicio y política de privacidad.
              Puedes cancelar en cualquier momento.
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}