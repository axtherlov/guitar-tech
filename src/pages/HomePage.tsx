import React, { useEffect, useRef, useState } from 'react';
import { useContent } from '../context/ContentContext.tsx';
import { ArrowRight, Gauge, Wrench } from 'lucide-react';

/** Cards per view for the featured services: 1 on phones, 2 on tablets, 3 on desktop. */
const getPageSize = () => {
  if (window.matchMedia('(min-width: 1024px)').matches) return 3;
  if (window.matchMedia('(min-width: 640px)').matches) return 2;
  return 1;
};

export const HomePage: React.FC = () => {
  const { content, language, navigate } = useContent();

  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  const servicesPath = language === 'es' ? '/es/servicios' : '/en/services';

  // Featured services rotate through all services, in commercial priority order.
  // Cards per view follow the screen: 1 on phones, 2 on tablets, 3 on desktop.
  const ROTATE_MS = 7000;
  const sortedServices = [...content.services].sort((x, y) => (x.order || 0) - (y.order || 0));
  const serviceCount = sortedServices.length;
  const [pageSize, setPageSize] = useState(getPageSize);
  const pageCount = Math.max(1, Math.ceil(serviceCount / pageSize));
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  // Wrap around so every view always shows `pageSize` cards
  const visibleServices = Array.from({ length: Math.min(pageSize, serviceCount) }, (_, i) =>
    sortedServices[(page * pageSize + i) % serviceCount]
  );

  useEffect(() => {
    const queries = [window.matchMedia('(min-width: 1024px)'), window.matchMedia('(min-width: 640px)')];
    const update = () => setPageSize(getPageSize());
    queries.forEach((q) => q.addEventListener('change', update));
    return () => queries.forEach((q) => q.removeEventListener('change', update));
  }, []);

  // Start again from the first group when the number of cards per view changes
  useEffect(() => {
    setPage(0);
  }, [pageSize]);

  useEffect(() => {
    // Auto-rotate unless hovered/focused, single group, or the visitor prefers reduced motion
    if (paused || pageCount < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => setPage((p) => (p + 1) % pageCount), ROTATE_MS);
    return () => clearInterval(timer);
  }, [paused, pageCount, page]);

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
        {/* Mobile order: kicker, logo, then heading/text. Desktop: text on the left, logo on the right. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-6 items-center">

          {/* Clean unboxed metadata kicker */}
          <div className="order-1 lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:self-end flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
            <span>{content.hero.badge[language]}</span>
          </div>

          {/* Main heading, supporting text and primary CTA */}
          <div className="order-3 lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-start space-y-6">

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-silver tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
              {content.hero.title[language]}
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl">
              {content.hero.subtitle[language]}
            </p>

            {/* CTAs with modern rounded edges and WhatsApp green (Requirement 8 & 9) */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-2">
              <a
                href={language === 'es' ? '/es/contacto' : '/en/contact'}
                onClick={(e) => handleNav(language === 'es' ? '/es/contacto' : '/en/contact', e)}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 hover:border-zinc-600 text-sm font-semibold uppercase tracking-wider rounded-xl transition-all active:scale-[0.98]"
              >
                <span>{content.hero.ctaQuote[language]}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Logo */}
          <div className="order-2 lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:row-span-2 lg:self-center relative">
            <div className="group relative rounded-2xl overflow-hidden border border-zinc-800/90 shadow-2xl bg-zinc-900">
              <img
                src="/images/el-kuervo-logo.webp"
                alt={language === 'es' ? 'Logo de El Kuervo Guitar Tech Córdoba: una guitarra con alas azules' : 'El Kuervo Guitar Tech Córdoba logo: a guitar with blue wings'}
                width={1122}
                height={675}
                className="w-full h-auto transition-transform duration-700 ease-out group-hover:scale-105"
                loading="eager"
                fetchPriority="high"
              />
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
            <h2 className="text-4xl sm:text-5xl font-bold text-silver tracking-tight pb-1">
              {language === 'es' ? 'Principales especialidades del taller' : 'Core workshop specialties'}
            </h2>
          </div>
        </div>

        {/* Rotating service cards: 3 at a time, whole card links to that service on the Services page */}
        <div
          onPointerEnter={(e) => { if (e.pointerType === 'mouse') setPaused(true); }}
          onPointerLeave={() => setPaused(false)}
          onFocus={(e) => { if (e.target.matches(':focus-visible')) setPaused(true); }}
          onBlur={() => setPaused(false)}
        >
          <div key={page} className="services-fade grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleServices.map((service) => (
              <a
                key={service.id}
                href={`${servicesPath}#${service.id}`}
                onClick={(e) => handleNav(`${servicesPath}#${service.id}`, e)}
                className="group bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl flex flex-col glow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
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
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-zinc-100 group-hover:text-amber-300 transition-colors mb-2">
                      {service.name[language]}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">
                      {service.shortDesc[language]}
                    </p>
                  </div>

                  {/* Key problem bullet points */}
                  <div className="pt-2">
                    <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-2">
                      {language === 'es' ? 'Atiende síntomas como:' : 'Addresses symptoms like:'}
                    </span>
                    <ul className="space-y-1.5 text-sm text-zinc-400">
                      {service.problems[language].slice(0, 2).map((prob, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold leading-none mt-1">·</span>
                          <span className="line-clamp-2">{prob}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Page indicators: also let visitors jump to another group manually */}
          {pageCount > 1 && (
            <div
              className="flex justify-center gap-2.5 pt-8"
              role="group"
              aria-label={language === 'es' ? 'Grupos de servicios' : 'Service groups'}
            >
              {Array.from({ length: pageCount }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i)}
                  aria-label={language === 'es' ? `Ver grupo de servicios ${i + 1} de ${pageCount}` : `Show service group ${i + 1} of ${pageCount}`}
                  aria-current={i === page ? 'true' : undefined}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === page ? 'w-8 bg-amber-400' : 'w-2.5 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. WORKING APPROACH & RIGOR */}
      <section
        data-section-id="approach"
        className={`bg-zinc-900/40 border border-zinc-800/80 rounded-2xl glow p-8 sm:p-12 transition-all duration-700 ease-out delay-150 ${
          revealedSections.approach ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0'
        }`}
      >
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1.5">
            {language === 'es' ? 'Metodología' : 'Methodology'}
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-silver tracking-tight pb-1 mb-3">
            {content.approach.title[language]}
          </h2>
          <p className="text-base text-zinc-400 leading-relaxed">
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
                <h3 className="text-2xl font-bold text-zinc-200 mb-1.5">
                  {pillar.title[language]}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
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
        className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center glow glow-outset transition-all duration-700 ease-out delay-200 ${
          revealedSections.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0'
        }`}
      >
        <div className="lg:col-span-5 relative">
          <div className="group rounded-2xl overflow-hidden border border-zinc-800 shadow-xl bg-zinc-900 aspect-4/3">
            <img
              src="/images/technician_tools_workbench_1793042583573.jpg"
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
          <h2 className="text-4xl sm:text-5xl font-bold text-silver tracking-tight pb-1">
            {language === 'es'
              ? 'Pasión por la acústica, la mecánica y el sonido'
              : 'Passion for acoustics, mechanics and guitar tone'}
          </h2>
          <p className="text-base text-zinc-400 leading-relaxed">
            {content.about.experience[language][0]}
          </p>
          <p className="text-base text-zinc-400 leading-relaxed">
            {content.about.philosophy[language][0]}
          </p>
          <div className="pt-3">
            <a
              href={language === 'es' ? '/es/sobre-mi' : '/en/about'}
              onClick={(e) => handleNav(language === 'es' ? '/es/sobre-mi' : '/en/about', e)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-amber-400 hover:text-amber-300 border border-zinc-800 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all active:scale-[0.98]"
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
        className={`bg-zinc-900/60 border border-zinc-800 rounded-2xl glow p-8 sm:p-10 transition-all duration-700 ease-out delay-150 ${
          revealedSections.coverage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Wrench className="w-4 h-4" />
              <span>{language === 'es' ? 'Servicio en Taller' : 'Workshop Service'}</span>
            </div>
            <h3 className="text-3xl font-bold text-zinc-100 mb-2">
              {language === 'es' ? 'Córdoba Capital' : 'Córdoba City'}
            </h3>
            <p className="text-base text-zinc-400 leading-relaxed">
              {content.coverage.workshopDescription[language]}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Gauge className="w-4 h-4" />
              <span>{language === 'es' ? 'Servicio a Domicilio y Locales' : 'On-Site Bench Service'}</span>
            </div>
            <h3 className="text-3xl font-bold text-zinc-100 mb-2">
              {language === 'es' ? 'Ensayos, Estudios y Hogares' : 'Rehearsals, Studios & Homes'}
            </h3>
            <p className="text-base text-zinc-400 leading-relaxed">
              {content.coverage.onsiteDescription[language]}
            </p>
          </div>
        </div>
      </section>

      {/* 6. FINAL DIRECT CALL TO ACTION (Requirement 8 & 9) */}
      <section
        data-section-id="cta"
        className={`text-center bg-gradient-to-b from-zinc-900/80 to-zinc-950 border border-zinc-800/80 rounded-2xl glow p-8 sm:p-14 transition-all duration-700 ease-out delay-100 ${
          revealedSections.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0'
        }`}
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-silver tracking-tight mb-3">
          {language === 'es'
            ? '¿Tu guitarra o bajo necesita una puesta a punto?'
            : 'Does your guitar or bass need a professional setup?'}
        </h2>
        <p className="text-base text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed">
          {language === 'es'
            ? 'Escríbeme por WhatsApp contándome qué instrumento tienes y qué necesitas. Te orientaré de forma personalizada y sin compromiso.'
            : 'Drop a message on WhatsApp explaining your instrument and what you need. I will give you personalized guidance with no obligation.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={language === 'es' ? '/es/contacto' : '/en/contact'}
            onClick={(e) => handleNav(language === 'es' ? '/es/contacto' : '/en/contact', e)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-sm font-semibold uppercase tracking-wider rounded-xl transition-colors active:scale-[0.98]"
          >
            <span>{language === 'es' ? 'Rellenar formulario de presupuesto' : 'Fill out quote request form'}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

    </div>
  );
};
