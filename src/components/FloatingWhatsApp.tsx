import React from 'react';
import { useContent } from '../context/ContentContext.tsx';
import { WhatsAppIcon } from './WhatsAppIcon.tsx';

export const FloatingWhatsApp: React.FC = () => {
  const { openWhatsApp, language } = useContent();

  return (
    <div className="fixed bottom-8 right-6 z-30">
      {/* Speech-bubble shape: one squared corner plus a small tail pointing down-right */}
      <button
        type="button"
        onClick={() => openWhatsApp()}
        className="group relative flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-zinc-950 p-3.5 rounded-2xl rounded-br-md shadow-xl shadow-black/50 hover:shadow-[#25D366]/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-[#0b0d11]"
        aria-label={language === 'es' ? 'Contactar por WhatsApp' : 'Chat on WhatsApp'}
      >
        <WhatsAppIcon className="w-7 h-7" />
        <span
          aria-hidden="true"
          className="absolute -bottom-2 right-0 h-2.5 w-3.5 bg-[#25D366] group-hover:bg-[#20bd5a] transition-colors duration-300 [clip-path:polygon(0_0,100%_0,100%_100%)]"
        />
      </button>
    </div>
  );
};
