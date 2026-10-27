import React from 'react';
import { useContent } from '../context/ContentContext.tsx';
import { QuoteForm } from '../components/QuoteForm.tsx';
import { MapPin, ExternalLink } from 'lucide-react';
import { WhatsAppIcon } from '../components/WhatsAppIcon.tsx';

// Placeholder workshop address; replace with the final one when it is confirmed.
const WORKSHOP_ADDRESS = 'Maestro Priego López 43, Córdoba, España';
const MAP_QUERY = encodeURIComponent(WORKSHOP_ADDRESS);
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`;
const MAPS_EMBED_URL = `https://maps.google.com/maps?q=${MAP_QUERY}&z=16&output=embed`;

export const ContactPage: React.FC = () => {
  const { content, language, openWhatsApp } = useContent();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

      {/* Left: heading, WhatsApp channel and workshop card with map */}
      <div className="lg:col-span-5 space-y-8">
        <div>
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
            {language === 'es' ? 'Contacto' : 'Contact'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-silver tracking-tight">
            {language === 'es'
              ? 'Cuéntame qué necesita tu instrumento'
              : 'Tell me what your instrument needs'}
          </h1>
        </div>

        {/* Direct WhatsApp channel: text on the left, icon-only button on the right */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-900/40 hover:to-bg-base hover:border-blue-700/60 p-6 flex items-center justify-between gap-5 shadow-lg">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>{language === 'es' ? 'Canal de atención preferente' : 'Primary Contact Channel'}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-100">
              {language === 'es' ? '¿Prefieres consultar directamente por WhatsApp?' : 'Prefer to chat directly on WhatsApp?'}
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {language === 'es'
                ? 'Todas las consultas y presupuestos se gestionan de forma directa y personalizada a través de WhatsApp. Puedes usar el formulario guiado a continuación para detallar tu instrumento o escribir directamente.'
                : 'All inquiries and quotes are handled directly and personally via WhatsApp. You can use the guided form below to specify your instrument details or message directly.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => openWhatsApp()}
            className="shrink-0 inline-flex items-center justify-center p-3 bg-[#25D366] hover:bg-[#20bd5a] text-zinc-950 rounded-xl transition-all shadow-md hover:shadow-[#25D366]/20 active:scale-[0.96] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-zinc-900"
            aria-label={language === 'es' ? 'Abrir chat de WhatsApp' : 'Open WhatsApp chat'}
          >
            <WhatsAppIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Workshop intake info with clickable map preview */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-900/40 hover:to-bg-base hover:border-blue-700/60">
          <div className="p-6 pb-4 space-y-3">
            <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{language === 'es' ? 'Servicio en Taller (Córdoba)' : 'Workshop Service (Córdoba)'}</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {content.coverage.workshopDescription[language]}
            </p>
          </div>

          <div className="px-6 pb-6">
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={language === 'es' ? `Abrir ${WORKSHOP_ADDRESS} en Google Maps` : `Open ${WORKSHOP_ADDRESS} in Google Maps`}
              className="group relative block aspect-16/10 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950"
            >
              <iframe
                src={MAPS_EMBED_URL}
                title={language === 'es' ? 'Mapa de la ubicación del taller' : 'Workshop location map'}
                className="absolute inset-0 h-full w-full border-0 pointer-events-none"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                tabIndex={-1}
              />
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-lg bg-zinc-950/85 px-3 py-1.5 text-xs font-semibold text-amber-300 transition-colors group-hover:bg-zinc-950 group-hover:text-amber-200">
                <span>{language === 'es' ? 'Abrir en Google Maps' : 'Open in Google Maps'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Right: guided quote form */}
      <div className="lg:col-span-7">
        <QuoteForm />
      </div>

    </div>
  );
};
