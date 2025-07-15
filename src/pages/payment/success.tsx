import dynamic from 'next/dynamic';

// Lazy load the PaymentSuccess component
const PaymentSuccess = dynamic(() => import('../../components/PaymentSuccess'), {
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
    </div>
  ),
  ssr: false
});

export default function PaymentSuccessPage() {
  return <PaymentSuccess />;
}