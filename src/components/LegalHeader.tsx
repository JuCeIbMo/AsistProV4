import React from 'react';
import Link from 'next/link';
import { Bot } from 'lucide-react';

const LegalHeader = () => {
  return (
    <header className="bg-gradient-to-r from-light-accent to-light-accent-dark py-6 mb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 mb-4 min-h-[44px]">
          <div className="bg-light-white p-2 rounded-lg shadow-md">
            <Bot className="w-8 h-8 text-light-accent" aria-hidden="true" />
          </div>
          <span className="text-2xl font-bold text-light-white font-display">AsistPro</span>
        </Link>
        <p className="text-light-accent-light text-sm">
          Tu asistente virtual profesional
        </p>
      </div>
    </header>
  );
};

export default LegalHeader;
