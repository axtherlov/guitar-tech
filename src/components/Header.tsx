import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext.tsx';
import { MessageSquare, Menu, X, ArrowUpRight } from 'lucide-react';

export const Header: React.FC = () => {
  const { content, language, setLanguage, navigate, currentPath, openWhatsApp } = useContent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll for compact header behavior (Requirement 6)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = language === 'es' ? [
    { label: 'Inicio', path: '/es' },
    { label: 'Servicios', path: '/es/servicios' },
    { label: 'Sobre mí', path: '/es/sobre-mi' },
    { label: 'Contacto', path: '/es/contacto' },
  ] : [
    { label: 'Home', path: '/en' },
    { label: 'Services', path: '/en/services' },
    { label: 'About', path: '/en/about' },
    { label: 'Contact', path: '/en/contact' },
  ];

  const handleNavClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    navigate(path);
  };

  const isCurrentActive = (path: string) => {
    return currentPath === path;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'h-14 sm:h-15 bg-[#0b0d11]/95 backdrop-blur-md border-b border-zinc-800 shadow-lg shadow-black/40'
          : 'h-18 sm:h-20 bg-[#0b0d11]/80 backdrop-blur-sm border-b border-zinc-800/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-6">
        
        {/* Zone 1: Single text element wordmark */}
        <a
          href={language === 'es' ? '/es' : '/en'}
          onClick={(e) => handleNavClick(language === 'es' ? '/es' : '/en', e)}
          className="text-base sm:text-lg font-bold tracking-tight text-zinc-100 hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 rotate-45 inline-block shrink-0" />
          <span className="truncate">{content.brandName}</span>
        </a>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-300">
          {navLinks.map((link) => (
            <a
              key={link.path}
              href={link.path}
              onClick={(e) => handleNavClick(link.path, e)}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 py-1 relative ${
                isCurrentActive(link.path)
                  ? 'text-amber-400 font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-400'
                  : 'text-zinc-300'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Language Selector & Primary WhatsApp Action */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Language selector: ES | EN with soft modern rounded corners */}
          <div className="flex items-center bg-zinc-900/90 border border-zinc-800 rounded-xl p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLanguage('es')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                language === 'es'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              aria-label="Cambiar idioma a Español"
            >
              ES
            </button>
            <span className="text-zinc-600 px-0.5">|</span>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                language === 'en'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              aria-label="Switch language to English"
            >
              EN
            </button>
          </div>

          {/* Primary CTA button with WhatsApp Green (Requirement 8 & 9) */}
          <button
            type="button"
            onClick={() => openWhatsApp()}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-950 bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] rounded-xl transition-all whitespace-nowrap shrink-0 shadow-sm hover:shadow-[#25D366]/20 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-[#0b0d11]"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-current" />
            <span>WhatsApp</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
          </button>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-xl transition-colors"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950/98 backdrop-blur-md border-b border-zinc-800 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1.5">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleNavClick(link.path, e)}
                className={`px-3.5 py-2.5 text-base font-medium rounded-xl transition-colors ${
                  isCurrentActive(link.path)
                    ? 'bg-amber-500/10 text-amber-400 font-semibold'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openWhatsApp();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-zinc-950 bg-[#25D366] hover:bg-[#20bd5a] rounded-xl transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>{language === 'es' ? 'Consultar por WhatsApp' : 'Contact via WhatsApp'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
