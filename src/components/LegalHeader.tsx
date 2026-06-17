import React from 'react';
import Link from 'next/link';
import { Bot } from 'lucide-react';

const LegalHeader = () => {
  return (
    <header className="py-8 mb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="section-frame rounded-[1.75rem] bg-dark-bg text-dark-text px-5 py-6 sm:px-7 sm:py-7">
          <Link href="/" className="flex items-center gap-3 mb-4 min-h-[44px]">
            <div className="bg-dark-accent text-dark-bg p-2.5 rounded-2xl shadow-md">
              <Bot className="w-8 h-8" aria-hidden="true" />
            </div>
            <span className="text-3xl font-display text-dark-text-primary">AsistPro</span>
          </Link>
          <p className="text-dark-secondary text-sm uppercase tracking-[0.18em]">
            Documentación legal del servicio
          </p>
          <p className="text-dark-muted text-sm mt-2">
            Política, términos y condiciones presentados dentro del nuevo sistema visual.
          </p>
        </div>
      </div>
    </header>
  );
};

export default LegalHeader;
