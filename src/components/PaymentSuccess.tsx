import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MessageCircle, CheckCircle, Clock, Shield, Bot } from 'lucide-react';
import { PaymentSuccessProps, MercadoPagoParams, PayPalParams } from '../types/payment';

export default function PaymentSuccess() {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentSuccessProps>({
    paymentProvider: null,
    params: null,
    isValid: false
  });

  useEffect(() => {
    // Validate payment parameters
    const { preapproval_id, subscription_id, ba_token, token } = router.query;

    if (preapproval_id && typeof preapproval_id === 'string') {
      // MercadoPago success
      setPaymentData({
        paymentProvider: 'mercadopago',
        params: { preapproval_id } as MercadoPagoParams,
        isValid: true
      });
    } else if (subscription_id && ba_token && token && 
               typeof subscription_id === 'string' && 
               typeof ba_token === 'string' && 
               typeof token === 'string') {
      // PayPal success
      setPaymentData({
        paymentProvider: 'paypal',
        params: { subscription_id, ba_token, token } as PayPalParams,
        isValid: true
      });
    } else {
      // Invalid access
      setPaymentData({
        paymentProvider: null,
        params: null,
        isValid: false
      });
    }
  }, [router.query]);

  const whatsappRedirect = () => {
    window.open('https://wa.me/5492604086606', '_blank');
  };

  if (!paymentData.isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center font-['Inter',sans-serif]">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Acceso Inválido
            </h1>
            <p className="text-gray-600 mb-6">
              Esta página solo está disponible después de completar una transacción.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-800 transition-all transform hover:scale-105 shadow-lg"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 font-['Inter',sans-serif]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                AsistPro
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Success Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>

            {/* Main Message */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              ¡Gracias por tu Pago!
            </h1>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
              <p className="text-lg text-green-800 font-medium mb-2">
                Tu suscripción está siendo procesada.
              </p>
              <p className="text-green-700">
                La activación puede demorar unos minutos mientras confirmamos el pago con el proveedor.
              </p>
            </div>

            {/* Payment Details */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Detalles de la Transacción
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Proveedor de Pago:</span>
                  <span className="font-semibold capitalize">
                    {paymentData.paymentProvider === 'mercadopago' ? 'Mercado Pago' : 'PayPal'}
                  </span>
                </div>
                {paymentData.paymentProvider === 'mercadopago' && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ID de Transacción:</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {(paymentData.params as MercadoPagoParams).preapproval_id}
                    </span>
                  </div>
                )}
                {paymentData.paymentProvider === 'paypal' && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">ID de Suscripción:</span>
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {(paymentData.params as PayPalParams).subscription_id}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center justify-center">
                <Clock className="w-5 h-5 mr-2" />
                Próximos Pasos
              </h3>
              <ul className="text-left space-y-3 text-blue-800">
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-700 text-sm font-bold">1</span>
                  </div>
                  <span>Recibirás una confirmación por WhatsApp en los próximos minutos</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-700 text-sm font-bold">2</span>
                  </div>
                  <span>Tu asistente virtual se activará automáticamente</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-700 text-sm font-bold">3</span>
                  </div>
                  <span>Podrás comenzar a usar todas las funciones de AsistPro</span>
                </li>
              </ul>
            </div>

            {/* WhatsApp CTA */}
            <div className="text-center">
              <button 
                onClick={whatsappRedirect}
                className="bg-[#25d366] hover:bg-[#20c55a] text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center space-x-3 mx-auto mb-4"
              >
                <MessageCircle className="w-6 h-6" />
                <span>Chatear con AsistPro</span>
              </button>
              <p className="text-sm text-gray-500">
                ¡Tu asistente virtual te está esperando!
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 flex items-center justify-center">
                <Shield className="w-4 h-4 mr-1" />
                Transacción procesada de forma segura
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}