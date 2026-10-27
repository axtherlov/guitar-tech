import React, { useState } from 'react';
import { useContent } from '../context/ContentContext.tsx';
import { MessageSquare, X, Settings, Check, Copy, ExternalLink } from 'lucide-react';

export const WhatsAppModal: React.FC = () => {
  const { showConfigModal, setShowConfigModal, content, language, navigate } = useContent();
  const [copied, setCopied] = useState(false);

  if (!showConfigModal) return null;

  const defaultMsg = content.defaultIntroMessage[language];

  const handleCopy = () => {
    navigator.clipboard.writeText(defaultMsg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoToAdmin = () => {
    setShowConfigModal(false);
    navigate('/admin');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          type="button"
          onClick={() => setShowConfigModal(false)}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 p-1 rounded-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-100">
              {language === 'es' ? 'Canal de WhatsApp' : 'WhatsApp Channel'}
            </h3>
            <p className="text-xs text-zinc-400">
              {language === 'es' ? 'Configuración de contacto' : 'Contact configuration'}
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-zinc-300">
          <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-lg">
            <p className="text-xs text-amber-300/90 font-medium mb-1.5 flex items-center gap-1.5">
              <span>●</span>
              <span>
                {language === 'es'
                  ? 'Número de WhatsApp pendiente de configurar'
                  : 'WhatsApp number pending configuration'}
              </span>
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {language === 'es'
                ? 'El propietario del taller debe indicar su número real de WhatsApp en el panel de administración. Mientras tanto, puedes revisar el mensaje preparado o acceder al panel para introducirlo:'
                : 'The workshop technician needs to enter their verified WhatsApp number in the admin panel. In the meantime, you can review the generated message or visit the admin panel to configure it:'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
              {language === 'es' ? 'Mensaje generado para WhatsApp' : 'Generated message for WhatsApp'}
            </label>
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md text-xs font-mono text-zinc-200 select-all whitespace-pre-wrap">
              {defaultMsg}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopy}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-zinc-100 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (language === 'es' ? 'Copiado' : 'Copied') : (language === 'es' ? 'Copiar texto' : 'Copy text')}</span>
            </button>

            <button
              type="button"
              onClick={handleGoToAdmin}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>{language === 'es' ? 'Configurar en Admin' : 'Configure in Admin'}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
