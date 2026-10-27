import React, { useEffect, useRef, useState } from 'react';
import { useContent } from '../context/ContentContext.tsx';
import { MessageSquare, ArrowRight, Gauge, Wrench, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { content, language, navigate, openWhatsApp } = useContent();

  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  // Requirement 1: Selection of main services prioritizing Setup, Electronics, and Repairs (Top 3)
  const featuredServices = content.services.slice(0, 3);

  // Requirement 4: Smooth viewport reveal observer with prefers-reduced-motion support
  const [revealedSections, setRevealedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // If user prefers reduced motion, reveal all immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealedSections({ hero: true, services: true, approach: true, about: true, coverage: true, cta: true });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section-id');
            if (id) {
              setRevealedSections((prev) => ({ ...prev, [id]: true }));
            }
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const sections = document.querySelectorAll('[data-section-id]');
    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-24 sm:space-y-32">
      
      {/* 1. HERO SECTION (Requirement 7: Two-column layout with text and photography side-by-side) */}
      <section
        data-section-id="hero"
        className={`relative transition-all duration-700 ease-out ${
          revealedSections.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Column 1: Main heading, supporting text and primary WhatsApp CTA */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Clean unboxed metadata kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
              <span>{content.hero.badge[language]}</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="text-zinc-400 font-normal">Andalucía</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-100 tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
              {content.hero.title[language]}
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
              {content.hero.subtitle[language]}
            </p>

            {/* CTAs with modern rounded edges and WhatsApp green (Requirement 8 & 9) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => openWhatsApp()}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-[#25D366]/25 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-[#0b0d11]"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>{content.hero.ctaWhatsapp[language]}</span>
              </button>

              <a
                href={language === 'es' ? '/es/contacto' : '/en/contact'}
                onClick={(e) => handleNav(language === 'es' ? '/es/contacto' : '/en/contact', e)}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 hover:border-zinc-600 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all active:scale-[0.98]"
              >
                <span>{content.hero.ctaQuote[language]}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Key Service Highlights */}
            <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{language === 'es' ? 'Taller en Córdoba' : 'Workshop in Córdoba'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{language === 'es' ? 'Servicio a domicilio' : 'On-site service'}</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{language === 'es' ? 'Presupuesto previo' : 'Prior quote'}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Prominent realistic photography of guitar workbench */}
          <div className="lg:col-span-5 relative">
            <div className="group relative rounded-2xl overflow-hidden border border-zinc-800/90 shadow-2xl bg-zinc-900 aspect-16/10 sm:aspect-4/3 lg:aspect-square">
              <img
                src="/src/assets/images/hero_guitar_workbench_1793042582513.jpg"
                alt={language === 'es' ? 'Guitarra eléctrica en banco de calibración con galgas y reglas rectificadas' : 'Electric guitar on precision luthier workbench undergoing calibration with gauges and straightedges'}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-xs text-zinc-300 bg-zinc-950/80 backdrop-blur-md p-3.5 rounded-xl border border-zinc-800/80">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Banco de Trabajo & Calibración' : 'Luthier Bench & Precision Setup'}</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  {language === 'es'
                    ? 'Reglas rectificadas, galgas de espesores y ajuste fino individualizado en Córdoba.'
                    : 'Precision ground straightedges, metric feeler gauges and individual fine tuning in Córdoba.'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FEATURED SERVICES (Requirement 1 & 5: Selected top services with hover elevation, border highlight, and image zoom) */}
      <section
        data-section-id="services"
        className={`space-y-10 transition-all duration-700 ease-out delay-100 ${
          revealedSections.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1.5">
              {language === 'es' ? 'Servicios Destacados' : 'Featured Services'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
              {language === 'es' ? 'Principales especialidades del taller' : 'Core workshop specialties'}
            </h2>
          </div>

          {/* Requirement 1: Clear localized button linking to complete Services page */}
          <a
            href={language === 'es' ? '/es/servicios' : '/en/services'}
            onClick={(e) => handleNav(language === 'es' ? '/es/servicios' : '/en/services', e)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-amber-400 hover:text-amber-300 border border-zinc-800 hover:border-amber-400/50 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-xs active:scale-[0.98]"
          >
            <span>{language === 'es' ? 'Ver todos los servicios' : 'View all services'}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* 3 Featured Service Cards with coordinated hover effects (Requirement 5) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredServices.map((service, index) => (
            <div
              key={service.id}
              className="group bg-zinc-900/60 hover:bg-zinc-900/90 border border-zinc-800/80 hover:border-amber-400/60 rounded-2xl p-5 sm:p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-500/5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Visual card header with stock photo */}
                <div className="relative rounded-xl overflow-hidden aspect-16/10 bg-zinc-950 border border-zinc-800/60">
                  <img
                    src={service.image}
                    alt={service.imageAlt ? service.imageAlt[language] : service.name[language]}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-amber-400 border border-zinc-800/60">
                    0{index + 1}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-zinc-100 group-hover:text-amber-300 transition-colors mb-2">
                    {service.name[language]}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                    {service.shortDesc[language]}
                  </p>
                </div>

                {/* Key problem bullet points */}
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block mb-2">
                    {language === 'es' ? 'Atiende síntomas como:' : 'Addresses symptoms like:'}
                  </span>
                  <ul className="space-y-1.5 text-xs text-zinc-400">
                    {service.problems[language].slice(0, 2).map((prob, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold leading-none mt-1">·</span>
                        <span className="line-clamp-2">{prob}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer with Link */}
              <div className="pt-5 mt-4 border-t border-zinc-800/60 flex items-center justify-between">
                <a
                  href={`${language === 'es' ? '/es/servicios' : '/en/services'}#${service.id}`}
                  onClick={(e) => handleNav(`${language === 'es' ? '/es/servicios' : '/en/services'}#${service.id}`, e)}
                  className="text-xs font-semibold text-zinc-300 group-hover:text-amber-400 inline-flex items-center gap-1 transition-colors"
                >
                  <span>{language === 'es' ? 'Ver detalles técnicos' : 'View technical details'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => openWhatsApp(`Hola, me gustaría consultar presupuesto sobre el servicio de "${service.name[language]}".`)}
                  className="p-2 text-zinc-400 hover:text-[#25D366] transition-colors rounded-lg hover:bg-zinc-800"
                  aria-label={language === 'es' ? `Consultar por WhatsApp sobre ${service.name[language]}` : `Chat on WhatsApp about ${service.name[language]}`}
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Localized Bottom Button for Services */}
        <div className="text-center pt-2">
          <a
            href={language === 'es' ? '/es/servicios' : '/en/services'}
            onClick={(e) => handleNav(language === 'es' ? '/es/servicios' : '/en/services', e)}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 hover:text-amber-300 border border-zinc-700/80 hover:border-amber-400/60 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-[0.98]"
          >
            <span>{language === 'es' ? 'Ver todos los servicios' : 'View all services'}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* 3. WORKING APPROACH & RIGOR */}
      <section
        data-section-id="approach"
        className={`bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8 sm:p-12 transition-all duration-700 ease-out delay-150 ${
          revealedSections.approach ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0'
        }`}
      >
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1.5">
            {language === 'es' ? 'Metodología' : 'Methodology'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight mb-3">
            {content.approach.title[language]}
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {content.approach.subtitle[language]}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {content.approach.pillars.map((pillar, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400 font-mono text-xs shrink-0 font-bold">
                0{idx + 1}
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-200 mb-1.5">
                  {pillar.title[language]}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {pillar.description[language]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ABOUT SNIPPET & WORKSHOP ENVIRONMENT */}
      <section
        data-section-id="about"
        className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center transition-all duration-700 ease-out delay-200 ${
          revealedSections.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0'
        }`}
      >
        <div className="lg:col-span-5 relative">
          <div className="group rounded-2xl overflow-hidden border border-zinc-800 shadow-xl bg-zinc-900 aspect-4/3">
            <img
              src="/src/assets/images/technician_tools_workbench_1793042583573.jpg"
              alt="Taller de luthería y banco de calibración en Córdoba"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
            {language === 'es' ? 'El Técnico' : 'The Technician'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
            {language === 'es'
              ? 'Pasión por la acústica, la mecánica y el sonido'
              : 'Passion for acoustics, mechanics and guitar tone'}
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {content.about.experience[language][0]}
          </p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {content.about.philosophy[language][0]}
          </p>
          <div className="pt-3">
            <a
              href={language === 'es' ? '/es/sobre-mi' : '/en/about'}
              onClick={(e) => handleNav(language === 'es' ? '/es/sobre-mi' : '/en/about', e)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-amber-400 hover:text-amber-300 border border-zinc-800 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all active:scale-[0.98]"
            >
              <span>{language === 'es' ? 'Conocer más sobre mi trayectoria' : 'Read more about my background'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 5. COVERAGE & MODALITIES STATEMENT */}
      <section
        data-section-id="coverage"
        className={`bg-zinc-900/60 border border-zinc-800 rounded-2xl p-8 sm:p-10 transition-all duration-700 ease-out delay-150 ${
          revealedSections.coverage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Wrench className="w-4 h-4" />
              <span>{language === 'es' ? 'Servicio en Taller' : 'Workshop Service'}</span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100 mb-2">
              {language === 'es' ? 'Córdoba Capital' : 'Córdoba City'}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {content.coverage.workshopDescription[language]}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Gauge className="w-4 h-4" />
              <span>{language === 'es' ? 'Servicio a Domicilio y Locales' : 'On-Site Bench Service'}</span>
            </div>
            <h3 className="text-lg font-bold text-zinc-100 mb-2">
              {language === 'es' ? 'Ensayos, Estudios y Hogares' : 'Rehearsals, Studios & Homes'}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {content.coverage.onsiteDescription[language]}
            </p>
          </div>
        </div>
      </section>

      {/* 6. FINAL DIRECT CALL TO ACTION (Requirement 8 & 9) */}
      <section
        data-section-id="cta"
        className={`text-center bg-gradient-to-b from-zinc-900/80 to-zinc-950 border border-zinc-800/80 rounded-2xl p-8 sm:p-14 transition-all duration-700 ease-out delay-100 ${
          revealedSections.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0'
        }`}
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight mb-3">
          {language === 'es'
            ? '¿Tu guitarra o bajo necesita una puesta a punto?'
            : 'Does your guitar or bass need a professional setup?'}
        </h2>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed">
          {language === 'es'
            ? 'Escríbeme por WhatsApp contándome qué instrumento tienes y qué necesitas. Te orientaré de forma personalizada y sin compromiso.'
            : 'Drop a message on WhatsApp explaining your instrument and what you need. I will give you personalized guidance with no obligation.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => openWhatsApp()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-[#25D366]/25 active:scale-[0.98]"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>{content.hero.ctaWhatsapp[language]}</span>
          </button>

          <a
            href={language === 'es' ? '/es/contacto' : '/en/contact'}
            onClick={(e) => handleNav(language === 'es' ? '/es/contacto' : '/en/contact', e)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors active:scale-[0.98]"
          >
            <span>{language === 'es' ? 'Rellenar formulario de presupuesto' : 'Fill out quote request form'}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

    </div>
  );
};
