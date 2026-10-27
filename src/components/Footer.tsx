import React from 'react';
import { useContent } from '../context/ContentContext.tsx';
import { Shield, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { content, language, navigate } = useContent();

  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  const navLinks = language === 'es' ? [
    { label: 'Inicio', path: '/es' },
    { label: 'Servicios', path: '/es/servicios' },
    { label: 'Sobre mí', path: '/es/sobre-mi' },
    { label: 'Contacto', path: '/es/contacto' },
    { label: 'Política de Privacidad', path: '/es/politica-privacidad' },
  ] : [
    { label: 'Home', path: '/en' },
    { label: 'Services', path: '/en/services' },
    { label: 'About', path: '/en/about' },
    { label: 'Contact', path: '/en/contact' },
    { label: 'Privacy Policy', path: '/en/privacy-policy' },
  ];

  return (
    <footer className="w-full bg-[#08090c] border-t border-zinc-800/80 text-zinc-400 text-sm mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Column 1: Brand & Service Area */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-zinc-100 font-bold text-base tracking-tight">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 rotate-45 inline-block" />
              <span>{content.brandName}</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
              {language === 'es'
                ? 'Servicio técnico especializado para guitarras eléctricas, acústicas y bajos. Taller en Córdoba y asistencia en locales y estudios.'
                : 'Specialized technical service for electric guitars, acoustics and basses. Workshop based in Córdoba with on-site assistance.'}
            </p>
            <div className="pt-1 text-xs text-zinc-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 inline-block" />
              <span>{content.serviceArea[language]}</span>
            </div>
          </div>

          {/* Column 2: Navigation Mirror */}
          <div>
            <h4 className="text-zinc-200 font-semibold text-xs uppercase tracking-wider mb-4">
              {language === 'es' ? 'Navegación' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <a
                    href={link.path}
                    onClick={(e) => handleNav(link.path, e)}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Workshop Policy & Confidentiality */}
          <div className="space-y-3">
            <h4 className="text-zinc-200 font-semibold text-xs uppercase tracking-wider mb-2">
              {language === 'es' ? 'Atención y Citas' : 'Appointments & Care'}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {language === 'es'
                ? 'Atención en taller exclusivamente mediante cita previa coordinada a través de WhatsApp. Presupuestos y diagnósticos individualizados sin compromiso.'
                : 'Workshop intake strictly by prior appointment scheduled via WhatsApp. Individualized quotes and diagnoses with no obligation.'}
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-zinc-500" />
                <span>RGPD / LOPDGDD</span>
              </div>
              <a
                href="/admin"
                onClick={(e) => handleNav('/admin', e)}
                className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                title="Acceso Administración"
              >
                <Lock className="w-3 h-3" />
                <span>Admin</span>
              </a>
            </div>
          </div>
        </div>

        {/* Quiet bottom bar */}
        <div className="mt-12 pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-3">
          <div>
            © {new Date().getFullYear()} {content.brandName}. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </div>
          <div className="text-zinc-400 text-[11px]">
            Córdoba, Andalucía, España
          </div>
        </div>
      </div>
    </footer>
  );
};
