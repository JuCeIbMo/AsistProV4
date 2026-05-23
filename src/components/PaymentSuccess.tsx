import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MessageCircle, CheckCircle, Clock, Shield, Bot, Copy, Check } from 'lucide-react';
import { Button } from './ui/Button';
import { PaymentSuccessProps, MercadoPagoParams, PayPalParams } from '../types/payment';

export default function PaymentSuccess() {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentSuccessProps>({
    paymentProvider: null,
    params: null,
    isValid: false
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const copyTransactionId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!paymentData.isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center font-sans overflow-x-hidden">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="bg-light-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-red-500" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-light-text mb-4">
              Acceso Inválido
            </h1>
            <p className="text-light-secondary mb-6">
              Esta página solo está disponible después de completar una transacción.
            </p>
            <Button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const transactionId = paymentData.paymentProvider === 'mercadopago'
    ? (paymentData.params as MercadoPagoParams).preapproval_id
    : (paymentData.params as PayPalParams).subscription_id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-light-bg to-green-100 font-sans overflow-x-hidden">
      {/* Header */}
      <header className="bg-light-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                AsistPro
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Success Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-light-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 overflow-hidden">
            {/* Success Icon */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-12 h-12 text-green-500" aria-hidden="true" />
            </div>

            {/* Main Message */}
            <h1 className="text-4xl font-bold text-light-text mb-6">
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
            <div className="bg-light-elevated rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-light-text mb-4">
                Detalles de la Transacción
              </h3>
              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-light-secondary">Proveedor de Pago:</span>
                  <span className="font-semibold capitalize">
                    {paymentData.paymentProvider === 'mercadopago' ? 'Mercado Pago' : 'PayPal'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-light-secondary">ID de Transacción:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm bg-light-elevated px-3 py-1.5 rounded-lg border border-light-border">
                      {transactionId}
                    </span>
                    <button
                      onClick={() => copyTransactionId(transactionId)}
                      className="p-2 rounded-lg bg-light-accent-light hover:bg-light-accent/10 transition-colors"
                      title="Copiar ID"
                      aria-label="Copiar ID de transacción"
                    >
                      {copiedId === transactionId ? (
                        <Check className="w-4 h-4 text-green-600" aria-hidden="true" />
                      ) : (
                        <Copy className="w-4 h-4 text-light-accent" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center justify-center">
                <Clock className="w-5 h-5 mr-2" aria-hidden="true" />
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
              <Button 
                onClick={whatsappRedirect}
                size="lg"
                className="bg-[#25d366] hover:bg-[#20c55a]"
              >
                <MessageCircle className="w-6 h-6" aria-hidden="true" />
                <span>Chatear con AsistPro</span>
              </Button>
              <p className="text-sm text-light-muted mt-4">
                ¡Tu asistente virtual te está esperando!
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-8 pt-6 border-t border-light-border">
              <p className="text-xs text-light-muted flex items-center justify-center">
                <Shield className="w-4 h-4 mr-1" aria-hidden="true" />
                Transacción procesada de forma segura
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}