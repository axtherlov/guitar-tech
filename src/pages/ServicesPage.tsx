import React from 'react';
import { useContent } from '../context/ContentContext.tsx';
import { Check, AlertCircle } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { content, language } = useContent();

  // Sort services according to their designated order property (display order: 1 first)
  const sortedServices = [...content.services].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Small note shown under every price
  const priceNote = language === 'es'
    ? 'Los precios están sujetos a inspección previa.'
    : 'Prices are subject to prior inspection.';

  return (
    <div className="space-y-16">
      
      {/* Header */}
      <div className="max-w-3xl">
        <div>
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
            {language === 'es' ? 'Catálogo Comercial y Técnico' : 'Commercial & Technical Catalog'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-silver tracking-tight mb-4">
            {language === 'es'
              ? 'Servicios para tu guitarra o bajo'
              : 'Services for your guitar or bass'}
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            {language === 'es'
              ? 'Cada instrumento que llega a mi banco de trabajo recibe una evaluación técnica exhaustiva. Aquí abajo tienes lo que hacemos, en qué casos te conviene cada servicio y en qué consiste el trabajo.'
              : 'Every instrument that arrives at my bench undergoes a thorough technical evaluation. Below you will find what we do, when each service makes sense for you, and what the work involves.'}
          </p>
        </div>
      </div>

      {/* Services list (Requirement 2: Top 3 services receive strongest visual prominence) */}
      <div className="space-y-12">
        {sortedServices.map((service, index) => {
          // First 3 services receive marquee prominence
          const isTopPriority = index < 3;

          return (
            <article
              key={service.id}
              id={service.id}
              className={`group rounded-2xl p-6 sm:p-9 transition-all duration-300 ease-out hover:-translate-y-1.5 scroll-mt-24 border ${
                isTopPriority
                  ? 'bg-zinc-900/80 border-amber-500/40 glow shadow-xl shadow-amber-500/5'
                  : 'bg-zinc-900/50 border-zinc-800/80 glow'
              }`}
            >
              {/* Title on the left, price in the top-right corner (one line per option) */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                  {service.name[language]}
                </h2>
                {service.price?.[language] && (
                  <div className="shrink-0 w-max min-w-[10rem] px-4 py-3 rounded-xl border border-amber-500/40 bg-amber-500/10 text-center">
                    <div className="whitespace-pre-line text-xs font-semibold text-amber-300 leading-snug">
                      {service.price[language]}
                    </div>
                    {!service.hidePriceNote && (
                      <div className="mt-1.5 w-0 min-w-full text-[11px] leading-snug text-amber-200/60">
                        {priceNote}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                {/* Left: Info, Problems, Work Included */}
                <div className="lg:col-span-7 space-y-6">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {service.shortDesc[language]}
                  </p>

                  {/* Two columns for problems & work */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                    
                    {/* Work Included */}
                    <div className="space-y-2.5 p-4 bg-zinc-950/70 rounded-xl border border-zinc-800/70">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{language === 'es' ? 'Trabajo técnico incluido' : 'Technical work involved'}</span>
                      </div>
                      <ul className="space-y-2 text-xs text-zinc-400">
                        {service.workIncluded[language].map((work, wIdx) => (
                          <li key={wIdx} className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold leading-none mt-1">✓</span>
                            <span className="leading-relaxed">{work}</span>
                          </li>
                        ))}
                        {service.notIncluded?.[language]?.map((item, nIdx) => (
                          <li key={`not-${nIdx}`} className="flex items-start gap-2">
                            <span className="text-red-500 font-bold leading-none mt-1">✗</span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Symptoms / Problems */}
                    <div className="space-y-2.5 p-4 bg-zinc-950/70 rounded-xl border border-zinc-800/70">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400/90" />
                        <span>{language === 'es' ? '¿Cuándo lo necesitas?' : 'When is this needed?'}</span>
                      </div>
                      <ul className="space-y-2 text-xs text-zinc-400">
                        {service.problems[language].map((prob, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2">
                            <span className="text-amber-500 font-bold leading-none mt-1">·</span>
                            <span className="leading-relaxed">{prob}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </div>

                {/* Right: Distinct Stock Photo for each service (Requirement 3 & 5: Coordinated hover zoom) */}
                <div className="lg:col-span-5 self-center">
                  <div className="relative rounded-xl overflow-hidden border border-zinc-800 shadow-md bg-zinc-950 aspect-4/3">
                    <img
                      src={service.image}
                      alt={service.imageAlt ? service.imageAlt[language] : service.name[language]}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

              </div>
            </article>
          );
        })}
      </div>

    </div>
  );
};
