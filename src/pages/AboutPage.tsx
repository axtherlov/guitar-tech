import React from 'react';
import { useContent } from '../context/ContentContext.tsx';
import { Wrench, Heart, Compass, Cpu, Info, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { content, language, navigate } = useContent();

  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <div className="space-y-16">
      
      {/* Header */}
      <div className="max-w-3xl">
        <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
          {language === 'es' ? 'Sobre el Técnico' : 'About the Technician'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight mb-4">
          {language === 'es'
            ? 'Cuidado técnico, precisión y respeto por la música'
            : 'Technical care, precision and respect for music'}
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
          {language === 'es'
            ? 'Detrás de cada guitarra hay horas de ensayo, composiciones y recuerdos. Este taller nació de la necesidad de ofrecer a los músicos de Córdoba y Andalucía un servicio técnico riguroso, honesto y transparente.'
            : 'Behind every guitar are countless hours of rehearsal, composition, and memory. This workshop was born out of a desire to provide musicians in Córdoba and Andalusia with thorough, transparent, and honest technical service.'}
        </p>

        {/* Owner notice - explicit editable notice */}
        <div className="mt-6 flex items-start gap-3 p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg text-xs text-amber-300/90">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {content.about.ownerNotice[language]}
          </p>
        </div>
      </div>

      {/* Hero Workshop Image */}
      <div className="rounded-2xl overflow-hidden border border-zinc-800 shadow-xl bg-zinc-950 aspect-21/9 max-h-96">
        <img
          src="/src/assets/images/technician_tools_workbench_1793042583573.jpg"
          alt="Banco de trabajo con herramientas de luthería y guitarras en Córdoba"
          className="w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* 4 Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 1. Technical Experience */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-7 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400">
              <Wrench className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-zinc-100">
              {language === 'es' ? 'Experiencia Técnica y Conocimiento' : 'Technical Experience & Knowledge'}
            </h2>
          </div>
          <div className="space-y-3 text-xs text-zinc-400 leading-relaxed">
            {content.about.experience[language].map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* 2. Passion for Guitars */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-7 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400">
              <Heart className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-zinc-100">
              {language === 'es' ? 'Pasión por el Instrumento' : 'Passion for the Instrument'}
            </h2>
          </div>
          <div className="space-y-3 text-xs text-zinc-400 leading-relaxed">
            {content.about.passion[language].map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* 3. Working Philosophy & Precision */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-7 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400">
              <Compass className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-zinc-100">
              {language === 'es' ? 'Filosofía de Trabajo' : 'Work Philosophy & Care'}
            </h2>
          </div>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            {content.about.philosophy[language].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold leading-none mt-0.5">·</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Workshop Tools & Equipment */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-7 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400">
              <Cpu className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-zinc-100">
              {language === 'es' ? 'Herramientas y Banco de Trabajo' : 'Workshop Tooling & Equipment'}
            </h2>
          </div>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            {content.about.equipment[language].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold leading-none mt-0.5">·</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Callout to Contact */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-base font-bold text-zinc-100 mb-1">
            {language === 'es' ? '¿Quieres comentar el estado de tu instrumento?' : 'Ready to discuss your instrument?'}
          </h3>
          <p className="text-xs text-zinc-400">
            {language === 'es'
              ? 'Concierta una cita para revisión en el taller de Córdoba o solicita información sobre trabajos específicos.'
              : 'Book an inspection slot at the Córdoba workshop or ask about specific technical work.'}
          </p>
        </div>
        <a
          href={language === 'es' ? '/es/contacto' : '/en/contact'}
          onClick={(e) => handleNav(language === 'es' ? '/es/contacto' : '/en/contact', e)}
          className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors whitespace-nowrap inline-flex items-center gap-2"
        >
          <span>{language === 'es' ? 'Ir a Contacto' : 'Go to Contact'}</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
};
