import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bot } from 'lucide-react';

const LegalHeader = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 py-6 mb-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/" className="flex items-center gap-3 mb-6">
          <div className="bg-white p-2 rounded-lg shadow-md">
            <Bot className="w-8 h-8 text-blue-600" />
          </div>
          <span className="text-2xl font-bold text-white">AsistPro</span>
        </Link>
        <p className="text-blue-100 text-sm">
          Tu asistente virtual profesional
        </p>
      </div>
    </header>
  );
};

export default LegalHeader;
