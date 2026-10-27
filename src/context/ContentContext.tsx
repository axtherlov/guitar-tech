import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteContent, Language } from '../types.ts';
import { DEFAULT_CONTENT } from '../data/defaultContent.ts';

interface ContentContextType {
  content: SiteContent;
  language: Language;
  currentPath: string;
  isDefaultPassword: boolean;
  setLanguage: (lang: Language) => void;
  navigate: (path: string) => void;
  getWhatsAppUrl: (messageOverride?: string) => string;
  openWhatsApp: (messageOverride?: string) => void;
  updateContent: (newContent: SiteContent, token: string) => Promise<boolean>;
  showConfigModal: boolean;
  setShowConfigModal: (show: boolean) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Route localization map
const ROUTE_MAP: Record<string, { es: string; en: string }> = {
  home: { es: '/es', en: '/en' },
  services: { es: '/es/servicios', en: '/en/services' },
  about: { es: '/es/sobre-mi', en: '/en/about' },
  contact: { es: '/es/contacto', en: '/en/contact' },
  privacy: { es: '/es/politica-privacidad', en: '/en/privacy-policy' }
};

/** Thrown by updateContent when the server rejects the admin token (expired or revoked). */
export class SessionExpiredError extends Error {
  constructor() {
    super('Admin session expired');
    this.name = 'SessionExpiredError';
  }
}

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [isDefaultPassword, setIsDefaultPassword] = useState<boolean>(true);
  const [language, setLanguageState] = useState<Language>('es');
  const [currentPath, setCurrentPath] = useState<string>('/es');
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  // Sync state with browser location
  useEffect(() => {
    const handleLocationChange = () => {
      let path = window.location.pathname;
      if (path === '/' || path === '') {
        path = '/es';
        window.history.replaceState({}, '', '/es');
      }

      setCurrentPath(path);

      if (path.startsWith('/en')) {
        setLanguageState('en');
        document.documentElement.lang = 'en';
      } else if (path.startsWith('/es')) {
        setLanguageState('es');
        document.documentElement.lang = 'es';
      }
    };

    handleLocationChange();
    // Landing directly on "/path#section": scroll to that section once rendered
    if (window.location.hash) scrollToHash(window.location.hash.slice(1));
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Fetch persisted content from server
  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (data && data.content) {
          setContent(data.content);
        }
        if (typeof data.isDefaultPassword === 'boolean') {
          setIsDefaultPassword(data.isDefaultPassword);
        }
      })
      .catch(err => {
        console.warn('Could not load remote content, using local defaults', err);
      });
  }, []);

  // Scroll to an element id once the target page has rendered (retries briefly)
  const scrollToHash = (hash: string) => {
    let attempts = 0;
    const tryScroll = () => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (attempts++ < 20) {
        setTimeout(tryScroll, 50);
      }
    };
    tryScroll();
  };

  // Navigate cleanly; supports "/path#section" so a link can land on a specific section
  const navigate = (toPath: string) => {
    const [pathOnly, hash] = toPath.split('#');

    if (pathOnly !== currentPath) {
      window.history.pushState({}, '', toPath);
      setCurrentPath(pathOnly);
      if (!hash) window.scrollTo({ top: 0, behavior: 'smooth' });

      if (pathOnly.startsWith('/en')) {
        setLanguageState('en');
        document.documentElement.lang = 'en';
      } else if (pathOnly.startsWith('/es')) {
        setLanguageState('es');
        document.documentElement.lang = 'es';
      }
    } else if (hash) {
      window.history.pushState({}, '', toPath);
    }

    if (hash) scrollToHash(hash);
  };

  // Switch language preserving equivalent route
  const setLanguage = (newLang: Language) => {
    if (newLang === language) return;
    setLanguageState(newLang);
    document.documentElement.lang = newLang;

    // Check if current route is in route map
    let targetPath = newLang === 'es' ? '/es' : '/en';

    if (currentPath === '/admin') {
      return; // Admin path is identical
    }

    for (const key of Object.keys(ROUTE_MAP)) {
      const mapping = ROUTE_MAP[key];
      if (currentPath === mapping.es || currentPath === mapping.en) {
        targetPath = mapping[newLang];
        break;
      }
    }

    navigate(targetPath);
  };

  // Generate official WhatsApp URL
  const getWhatsAppUrl = (messageOverride?: string): string => {
    const rawNumber = content.whatsappNumber || '';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    const defaultMsg = content.defaultIntroMessage[language];
    const text = messageOverride || defaultMsg;
    const encodedText = encodeURIComponent(text);

    return `https://wa.me/${cleanNumber}?text=${encodedText}`;
  };

  const openWhatsApp = (messageOverride?: string) => {
    const rawNumber = content.whatsappNumber || '';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

    // Check if number is still default placeholder (e.g., 600000000 or empty)
    if (!content.isWhatsappConfigured || cleanNumber === '34600000000' || cleanNumber.length < 9) {
      setShowConfigModal(true);
      return;
    }

    const url = getWhatsAppUrl(messageOverride);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Save updated content to server
  const updateContent = async (newContent: SiteContent, token: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newContent)
      });
      if (res.status === 401 || res.status === 403) {
        throw new SessionExpiredError();
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update content');
      }
      const data = await res.json();
      if (data.content) {
        setContent(data.content);
      }
      return true;
    } catch (err) {
      if (err instanceof SessionExpiredError) throw err;
      console.error('Update content error:', err);
      return false;
    }
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        language,
        currentPath,
        isDefaultPassword,
        setLanguage,
        navigate,
        getWhatsAppUrl,
        openWhatsApp,
        updateContent,
        showConfigModal,
        setShowConfigModal
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
