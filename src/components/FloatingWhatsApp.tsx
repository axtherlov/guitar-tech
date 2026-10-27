import React from 'react';
import { useContent } from '../context/ContentContext.tsx';
import { MessageSquare } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { openWhatsApp, language } = useContent();

  return (
    <div className="fixed bottom-6 right-6 z-30">
      <button
        type="button"
        onClick={() => openWhatsApp()}
        className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-zinc-950 font-bold px-4 py-3 rounded-2xl shadow-xl shadow-black/50 hover:shadow-[#25D366]/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-[#0b0d11]"
        aria-label={language === 'es' ? 'Contactar por WhatsApp' : 'Chat on WhatsApp'}
      >
        <MessageSquare className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
          {language === 'es' ? 'WhatsApp' : 'WhatsApp'}
        </span>
      </button>
    </div>
  );
};
