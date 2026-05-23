import { useRouter } from 'next/router';
import { XCircle, ArrowLeft, MessageCircle, Bot } from 'lucide-react';
import { Button } from './ui/Button';

export default function PaymentFailure() {
  const router = useRouter();

  const whatsappRedirect = () => {
    window.open('https://wa.me/5492604086606', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-light-bg to-red-100 font-sans overflow-x-hidden">
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

      {/* Failure Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-light-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 overflow-hidden">
            {/* Failure Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <XCircle className="w-12 h-12 text-red-500" aria-hidden="true" />
            </div>

            {/* Main Message */}
            <h1 className="text-4xl font-bold text-light-text mb-6">
              Pago No Completado
            </h1>
            
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
              <p className="text-lg text-red-800 font-medium mb-2">
                No pudimos procesar tu pago
              </p>
              <p className="text-red-700">
                Esto puede deberse a un problema temporal con el proveedor de pagos o que hayas cancelado la transacción.
              </p>
            </div>

            {/* What to do next */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                ¿Qué puedes hacer?
              </h3>
              <ul className="text-left space-y-3 text-blue-800">
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-700 text-sm font-bold">1</span>
                  </div>
                  <span>Intenta realizar el pago nuevamente</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-700 text-sm font-bold">2</span>
                  </div>
                  <span>Verifica que tu método de pago tenga fondos suficientes</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-700 text-sm font-bold">3</span>
                  </div>
                  <span>Contacta a nuestro soporte si el problema persiste</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={() => router.push('/')}
                size="lg"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                <ArrowLeft className="w-5 h-5" aria-hidden="true" />
                <span>Volver e Intentar de Nuevo</span>
              </Button>

              <Button 
                onClick={whatsappRedirect}
                size="lg"
                className="w-full bg-[#25d366] hover:bg-[#20c55a]"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                <span>Contactar Soporte</span>
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-8 pt-6 border-t border-light-border">
              <p className="text-sm text-light-muted">
                Si necesitas ayuda, nuestro equipo de soporte está disponible por WhatsApp
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}