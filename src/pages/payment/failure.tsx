import dynamic from 'next/dynamic';

// Lazy load the PaymentFailure component
const PaymentFailure = dynamic(() => import('../../components/PaymentFailure'), {
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
    </div>
  ),
  ssr: false
});

export default function PaymentFailurePage() {
  return <PaymentFailure />;
}