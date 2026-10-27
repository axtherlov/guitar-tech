import React from 'react';
import { useContent } from '../context/ContentContext.tsx';
import { Check, AlertCircle, ShieldAlert } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { content, language } = useContent();

  // Sort services according to their designated order property (commercial priority: 1 to 9)
  const sortedServices = [...content.services].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-16">
      
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
        <div>
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
            {language === 'es' ? 'Catálogo Comercial y Técnico' : 'Commercial & Technical Catalog'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-silver tracking-tight mb-4">
            {language === 'es'
              ? 'Servicios técnicos para guitarra y bajo'
              : 'Technical services for guitar and bass'}
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            {language === 'es'
              ? 'Cada instrumento que llega a mi banco de trabajo recibe una evaluación técnica exhaustiva. A continuación encontrarás las 9 especialidades ordenadas por prioridad comercial, los problemas habituales que resuelven y el trabajo técnico implicado.'
              : 'Every instrument that arrives at my bench undergoes a thorough technical evaluation. Below you will find all 9 specialties arranged by commercial priority, the common symptoms they address, and the precise benchwork involved.'}
          </p>
        </div>

        {/* Pricing notice - anti-hallucination requirement */}
        <div className="flex items-start gap-3 p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-zinc-300">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-zinc-100">
              {language === 'es' ? 'Presupuestos personalizados:' : 'Personalized quotes:'}
            </strong>{' '}
            {language === 'es'
              ? 'El estado del mástil, el desgaste de componentes y los calibres de cuerda varían en cada guitarra. No publicamos tarifas genéricas ni precios cerrados arbitrarios; diagnosticamos el instrumento e informamos del presupuesto exacto antes de empezar.'
              : 'Neck stability, fret wear and hardware specs differ from instrument to instrument. We do not publish generic flat rates or arbitrary estimates; we inspect the instrument and provide a customized quote before performing any work.'}
          </p>
        </div>
      </div>

      {/* 9 Services List (Requirement 2: Top 3 services receive strongest visual prominence) */}
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
                  ? 'bg-zinc-900/80 border-amber-500/40 hover:bg-gradient-to-br hover:from-blue-900/40 hover:to-bg-base hover:border-blue-700/60 shadow-xl shadow-amber-500/5'
                  : 'bg-zinc-900/50 border-zinc-800/80 hover:bg-gradient-to-br hover:from-blue-900/40 hover:to-bg-base hover:border-blue-700/60'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left: Info, Problems, Work Included */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 group-hover:text-amber-300 transition-colors mb-2">
                      {service.name[language]}
                    </h2>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {service.shortDesc[language]}
                    </p>
                  </div>

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
