import React from 'react';
import Link from 'next/link';

const LegalFooter = () => {
  return (
    <footer className="bg-gray-100 py-6 mt-auto">
      <div className="max-w-4xl mx-auto px-4 flex justify-center space-x-8">
        <Link href="/legal/privacy-policy" className="text-gray-600 hover:text-gray-900">
          Política de Privacidad
        </Link>
        <Link href="/legal/terms-of-service" className="text-gray-600 hover:text-gray-900">
          Términos y Condiciones
        </Link>
      </div>
    </footer>
  );
};

export default LegalFooter;
