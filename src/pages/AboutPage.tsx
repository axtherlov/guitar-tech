import React from 'react';
import { useContent } from '../context/ContentContext.tsx';
import { Wrench, Heart, Compass, Cpu, Info } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { content, language } = useContent();


  return (
    <div className="space-y-16">
      
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
        <div>
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2">
            {language === 'es' ? 'Sobre el Técnico' : 'About the Technician'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-silver tracking-tight mb-4">
            {language === 'es'
              ? 'Cuidado técnico, precisión y respeto por la música'
              : 'Technical care, precision and respect for music'}
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            {language === 'es'
              ? 'Detrás de cada guitarra hay horas de ensayo, composiciones y recuerdos. Este taller nació de la necesidad de ofrecer a los músicos de Córdoba un servicio técnico riguroso, honesto y transparente.'
              : 'Behind every guitar are countless hours of rehearsal, composition, and memory. This workshop was born out of a desire to provide musicians in Córdoba with thorough, transparent, and honest technical service.'}
          </p>
        </div>

        {/* Owner notice - explicit editable notice */}
        <div className="flex items-start gap-3 p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg text-xs text-amber-300/90">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {content.about.ownerNotice[language]}
          </p>
        </div>
      </div>

      {/* Hero Workshop Image: full width, fixed height so it lines up with the cards below */}
      <div className="rounded-2xl overflow-hidden border border-zinc-800 shadow-xl bg-zinc-950 w-full h-64 sm:h-80 lg:h-96">
        <img
          src="/images/technician_tools_workbench_1793042583573.jpg"
          alt="Banco de trabajo con herramientas de luthería y guitarras en Córdoba"
          className="w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* 4 Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 1. Technical Experience */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-7 space-y-4 transition-all duration-300 glow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400">
              <Wrench className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-100">
              {language === 'es' ? 'Experiencia Técnica y Conocimiento' : 'Technical Experience & Knowledge'}
            </h2>
          </div>
          <div className="space-y-3 text-sm text-zinc-400 leading-relaxed">
            {content.about.experience[language].map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* 2. Passion for Guitars */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-7 space-y-4 transition-all duration-300 glow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-100">
              {language === 'es' ? 'Pasión por el Instrumento' : 'Passion for the Instrument'}
            </h2>
          </div>
          <div className="space-y-3 text-sm text-zinc-400 leading-relaxed">
            {content.about.passion[language].map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* 3. Working Philosophy & Precision */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-7 space-y-4 transition-all duration-300 glow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-100">
              {language === 'es' ? 'Filosofía de Trabajo' : 'Work Philosophy & Care'}
            </h2>
          </div>
          <ul className="space-y-2.5 text-sm text-zinc-400">
            {content.about.philosophy[language].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold leading-none mt-0.5">·</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Workshop Tools & Equipment */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-7 space-y-4 transition-all duration-300 glow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-100">
              {language === 'es' ? 'Herramientas y Banco de Trabajo' : 'Workshop Tooling & Equipment'}
            </h2>
          </div>
          <ul className="space-y-2.5 text-sm text-zinc-400">
            {content.about.equipment[language].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold leading-none mt-0.5">·</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>


    </div>
  );
};
