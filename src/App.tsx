/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ContentProvider, useContent } from './context/ContentContext.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { FloatingWhatsApp } from './components/FloatingWhatsApp.tsx';
import { WhatsAppModal } from './components/WhatsAppModal.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { ServicesPage } from './pages/ServicesPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';

const AppRouter: React.FC = () => {
  const { currentPath, language, content } = useContent();

  // Dynamic SEO metadata synchronization
  useEffect(() => {
    const seo = content.seo[language];
    let pageTitle = seo.title;

    if (currentPath.includes('/servicios') || currentPath.includes('/services')) {
      pageTitle = `${language === 'es' ? 'Servicios de Calibración y Reparación' : 'Guitar & Bass Services'} | ${content.brandName}`;
    } else if (currentPath.includes('/sobre-mi') || currentPath.includes('/about')) {
      pageTitle = `${language === 'es' ? 'Sobre el Técnico' : 'About the Technician'} | ${content.brandName}`;
    } else if (currentPath.includes('/contacto') || currentPath.includes('/contact')) {
      pageTitle = `${language === 'es' ? 'Contacto y Presupuestos' : 'Contact & Quotes'} | ${content.brandName}`;
    } else if (currentPath.includes('/politica-privacidad') || currentPath.includes('/privacy-policy')) {
      pageTitle = `${language === 'es' ? 'Política de Privacidad' : 'Privacy Policy'} | ${content.brandName}`;
    } else if (currentPath.includes('/admin')) {
      pageTitle = `Admin Panel | ${content.brandName}`;
    }

    document.title = pageTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', seo.description);
    }
  }, [currentPath, language, content]);

  // Blue wash follows the scroll: only the ".glow" blocks crossing the middle band of the
  // screen are active, so it moves to the next block as the visitor scrolls.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          (entry.target as HTMLElement).dataset.active = entry.isIntersecting ? 'true' : 'false';
        });
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );

    const watched = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll('.glow').forEach((el) => {
        if (!watched.has(el)) {
          watched.add(el);
          observer.observe(el);
        }
      });
    };

    scan();
    // Pages and the rotating service cards add new blocks to the DOM over time
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  // Route resolver
  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/es':
      case '/en':
      case '/':
        return <HomePage />;

      case '/es/servicios':
      case '/en/services':
        return <ServicesPage />;

      case '/es/sobre-mi':
      case '/en/about':
        return <AboutPage />;

      case '/es/contacto':
      case '/en/contact':
        return <ContactPage />;

      case '/es/politica-privacidad':
      case '/en/privacy-policy':
        return <PrivacyPolicyPage />;

      case '/admin':
        return <AdminPage />;

      default:
        // Graceful fallback to translated homepage
        return <HomePage />;
    }
  };

  const isAdmin = currentPath === '/admin';

  return (
    <div className="min-h-screen bg-[#0b0d11] text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 sm:pb-16 w-full">
        {renderCurrentPage()}
      </main>

      <Footer />

      {/* Floating WhatsApp on customer-facing pages */}
      {!isAdmin && <FloatingWhatsApp />}

      {/* WhatsApp configuration guidance modal */}
      <WhatsAppModal />
    </div>
  );
};

export default function App() {
  return (
    <ContentProvider>
      <AppRouter />
    </ContentProvider>
  );
}
