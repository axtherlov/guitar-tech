import React from 'react';
import { useContent } from '../context/ContentContext.tsx';
import { WhatsAppIcon } from './WhatsAppIcon.tsx';

export const FloatingWhatsApp: React.FC = () => {
  const { openWhatsApp, language } = useContent();

  return (
    <div className="fixed bottom-8 right-6 z-30">
      {/* Speech-bubble shape: one squared corner plus a small tail pointing down-right.
          Deep emerald instead of the bright WhatsApp green so it sits well on the dark page. */}
      <button
        type="button"
        onClick={() => openWhatsApp()}
        className="group relative flex items-center justify-center bg-[#0A4A33] hover:bg-[#0F6845] text-white-soft p-3.5 rounded-2xl rounded-br-md border border-white/10 shadow-xl shadow-black/50 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-110 hover:shadow-[0_10px_30px_rgba(15,104,69,0.55)] active:scale-95 motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0d11]"
        aria-label={language === 'es' ? 'Contactar por WhatsApp' : 'Chat on WhatsApp'}
      >
        <WhatsAppIcon className="w-7 h-7 origin-center group-hover:animate-[wa-ring_800ms_ease-in-out] motion-reduce:group-hover:animate-none" />
        <span
          aria-hidden="true"
          className="absolute -bottom-2 right-0 h-2.5 w-3.5 bg-[#0A4A33] group-hover:bg-[#0F6845] transition-colors duration-300 [clip-path:polygon(0_0,100%_0,100%_100%)]"
        />
      </button>
    </div>
  );
};
