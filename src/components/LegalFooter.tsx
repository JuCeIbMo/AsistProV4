import React from 'react';
import Link from 'next/link';

const LegalFooter = () => {
  return (
    <footer className="bg-light-footer py-6 mt-auto border-t border-light-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
        <Link
          href="/legal/privacy-policy"
          className="text-light-secondary hover:text-light-text transition-colors duration-200 text-sm min-h-[44px] flex items-center"
        >
          Política de Privacidad
        </Link>
        <span className="hidden sm:inline text-light-muted">|</span>
        <Link
          href="/legal/terms-of-service"
          className="text-light-secondary hover:text-light-text transition-colors duration-200 text-sm min-h-[44px] flex items-center"
        >
          Términos y Condiciones
        </Link>
      </div>
    </footer>
  );
};

export default LegalFooter;
