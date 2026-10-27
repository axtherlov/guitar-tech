import React from 'react';
import { useContent } from '../context/ContentContext.tsx';
import { QuoteForm } from '../components/QuoteForm.tsx';
import { MessageSquare, MapPin, Wrench, Clock, ShieldCheck, Check } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { content, language, openWhatsApp } = useContent();

  return (
    <div className="space-y-16">
      
      {/* Header */}
      <div className="max-w-3xl">
        <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
          {language === 'es' ? 'Contacto y Citas' : 'Contact & Inquiries'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight mb-4">
          {language === 'es'
            ? 'Cuéntame qué necesita tu guitarra o bajo'
            : 'Tell me what your guitar or bass needs'}
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          {language === 'es'
            ? 'Todas las consultas y presupuestos se gestionan de forma directa y personalizada a través de WhatsApp. Puedes usar el formulario guiado a continuación para detallar tu instrumento o escribir directamente.'
            : 'All inquiries and quotes are handled directly and personally via WhatsApp. You can use the guided form below to specify your instrument details or message directly.'}
        </p>
      </div>

      {/* Prominent Direct WhatsApp Action Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-900/80 border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-1 text-center md:text-left">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center justify-center md:justify-start gap-1.5">
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>{language === 'es' ? 'Canal de atención preferente' : 'Primary Contact Channel'}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-100">
            {language === 'es' ? '¿Prefieres consultar directamente por WhatsApp?' : 'Prefer to chat directly on WhatsApp?'}
          </h2>
          <p className="text-xs text-zinc-400">
            {language === 'es'
              ? 'Inicia una conversación directa para resolver dudas rápidas o coordinar una cita.'
              : 'Start a direct chat to ask quick questions or schedule a drop-off.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => openWhatsApp()}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-[#25D366]/20 active:scale-[0.98] shrink-0"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          <span>{language === 'es' ? 'Abrir chat de WhatsApp' : 'Open WhatsApp chat'}</span>
        </button>
      </div>

      {/* Main Grid: Guided Quote Form (Left) + Workshop & Area Coverage (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: The Guided Form */}
        <div className="lg:col-span-7">
          <QuoteForm />
        </div>

        {/* Right: Coverage & Workshop Modalities */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Workshop Intake Info */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>{language === 'es' ? 'Servicio en Taller (Córdoba)' : 'Workshop Service (Córdoba)'}</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {content.coverage.workshopDescription[language]}
            </p>
            <div className="pt-2 text-[11px] text-zinc-500 border-t border-zinc-800/80 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>
                {language === 'es'
                  ? 'Recepción y entrega exclusivamente con cita previa coordinada.'
                  : 'Drop-off and pick-up strictly by appointment.'}
              </span>
            </div>
          </div>

          {/* On-Site Bench Service */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-zinc-100 font-bold text-sm">
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>{language === 'es' ? 'Servicio Técnico Desplazado' : 'On-Site Technical Service'}</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {content.coverage.onsiteDescription[language]}
            </p>
          </div>

          {/* Service Area list */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              {language === 'es' ? 'Zonas y Cobertura' : 'Coverage & Locations'}
            </h3>
            <ul className="space-y-2 text-xs text-zinc-400">
              {content.coverage.areasList[language].map((area, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Notice on Shipping */}
          <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-xl text-xs text-zinc-500 leading-relaxed">
            <p>
              {language === 'es'
                ? 'Nota: Por motivos de seguridad y calibración óptima, no se realizan envíos de paquetería de instrumentos fuera del área de servicio.'
                : 'Note: For instrument safety and fine calibration preservation, shipping via parcel carriers outside the service area is not offered.'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
