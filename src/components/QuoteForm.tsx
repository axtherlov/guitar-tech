import React, { useState } from 'react';
import { useContent } from '../context/ContentContext.tsx';
import { Camera, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon.tsx';

interface FormState {
  name: string;
  instrumentType: string;
  brandModel: string;
  description: string;
  acceptPrivacy: boolean;
}

interface FormErrors {
  name?: string;
  instrumentType?: string;
  brandModel?: string;
  description?: string;
  acceptPrivacy?: string;
}

export const QuoteForm: React.FC = () => {
  const { language, openWhatsApp, navigate } = useContent();

  const [formData, setFormData] = useState<FormState>({
    name: '',
    instrumentType: '',
    brandModel: '',
    description: '',
    acceptPrivacy: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const instrumentOptions = language === 'es' ? [
    'Guitarra Eléctrica',
    'Guitarra Acústica / Electroacústica',
    'Bajo Eléctrico (4/5 cuerdas)',
    'Guitarra 7 / 8 Cuerdas'
  ] : [
    'Electric Guitar',
    'Acoustic / Electro-acoustic Guitar',
    'Electric Bass (4/5 strings)',
    '7 / 8 String Guitar'
  ];

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = language === 'es' ? 'Por favor, introduce tu nombre' : 'Please enter your name';
    }

    if (!formData.instrumentType) {
      newErrors.instrumentType = language === 'es' ? 'Selecciona el tipo de instrumento' : 'Please select your instrument type';
    }

    if (!formData.brandModel.trim()) {
      newErrors.brandModel = language === 'es' ? 'Indica la marca y modelo (ej. Fender Stratocaster, Gibson Les Paul, Ibanez...)' : 'Please enter brand and model (e.g. Fender Stratocaster, Gibson Les Paul, Ibanez...)';
    }

    if (!formData.description.trim()) {
      newErrors.description = language === 'es' ? 'Describe qué necesita tu instrumento o qué problema experimentas' : 'Please describe what your instrument needs or the issues you are experiencing';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = language === 'es' ? 'Por favor, proporciona algún detalle más sobre el problema' : 'Please provide a bit more detail about the issue';
    }

    if (!formData.acceptPrivacy) {
      newErrors.acceptPrivacy = language === 'es' ? 'Debes leer y aceptar la política de privacidad para continuar' : 'You must accept the privacy policy to proceed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Build the formatted WhatsApp message
    let message = '';
    if (language === 'es') {
      message = `*SOLICITUD DE PRESUPUESTO — GUITAR TECH CÓRDOBA*\n` +
        `• *Nombre:* ${formData.name.trim()}\n` +
        `• *Tipo de instrumento:* ${formData.instrumentType}\n` +
        `• *Marca y modelo:* ${formData.brandModel.trim()}\n\n` +
        `*Descripción del problema o trabajo requerido:*\n` +
        `${formData.description.trim()}\n\n` +
        `_(Enviado desde el formulario web de cordobaguitartech.com)_`;
    } else {
      message = `*QUOTE REQUEST — GUITAR TECH CÓRDOBA*\n` +
        `• *Name:* ${formData.name.trim()}\n` +
        `• *Instrument type:* ${formData.instrumentType}\n` +
        `• *Brand & Model:* ${formData.brandModel.trim()}\n\n` +
        `*Description of issue or requested service:*\n` +
        `${formData.description.trim()}\n\n` +
        `_(Sent from cordobaguitartech.com web form)_`;
    }

    setTimeout(() => {
      setIsSubmitting(false);
      openWhatsApp(message);
    }, 200);
  };

  const handlePrivacyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(language === 'es' ? '/es/politica-privacidad' : '/en/privacy-policy');
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-6 sm:p-8 max-w-2xl mx-auto shadow-xl transition-all duration-300 glow">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-zinc-100 tracking-tight">
          {language === 'es' ? 'Solicitar presupuesto personalizado' : 'Request a personalized quote'}
        </h3>
        <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
          {language === 'es'
            ? 'Completa los datos de tu instrumento. Al pulsar el botón, se generará el mensaje directamente en WhatsApp para que puedas revisarlo y enviarlo al técnico.'
            : 'Fill in your instrument details. Clicking the button will format your request in WhatsApp so you can review and send it directly to the technician.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        
        {/* Name */}
        <div>
          <label htmlFor="quote-name" className="block text-xs font-semibold text-zinc-300 mb-1.5">
            {language === 'es' ? 'Tu nombre *' : 'Your name *'}
          </label>
          <input
            id="quote-name"
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            placeholder={language === 'es' ? 'ej. Javier Moreno' : 'e.g. Alex Miller'}
            className={`w-full px-3.5 py-2.5 bg-zinc-950 border rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 transition-all ${
              errors.name
                ? 'border-red-500 focus:ring-red-500'
                : 'border-zinc-800 focus:border-amber-400 focus:ring-amber-400/50'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {/* Instrument Type */}
        <div>
          <label htmlFor="quote-type" className="block text-xs font-semibold text-zinc-300 mb-1.5">
            {language === 'es' ? 'Tipo de instrumento *' : 'Instrument type *'}
          </label>
          <select
            id="quote-type"
            value={formData.instrumentType}
            onChange={(e) => {
              setFormData({ ...formData, instrumentType: e.target.value });
              if (errors.instrumentType) setErrors({ ...errors, instrumentType: undefined });
            }}
            className={`w-full px-3.5 py-2.5 bg-zinc-950 border rounded-lg text-sm text-zinc-100 focus:outline-none focus:ring-1 transition-all ${
              errors.instrumentType
                ? 'border-red-500 focus:ring-red-500'
                : 'border-zinc-800 focus:border-amber-400 focus:ring-amber-400/50'
            }`}
          >
            <option value="">
              {language === 'es' ? '— Selecciona el tipo de instrumento —' : '— Select instrument type —'}
            </option>
            {instrumentOptions.map((opt) => (
              <option key={opt} value={opt} className="bg-zinc-950 text-zinc-200">
                {opt}
              </option>
            ))}
          </select>
          {errors.instrumentType && (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.instrumentType}</span>
            </p>
          )}
        </div>

        {/* Instrument Brand & Model */}
        <div>
          <label htmlFor="quote-brand" className="block text-xs font-semibold text-zinc-300 mb-1.5">
            {language === 'es' ? 'Marca y modelo del instrumento *' : 'Instrument brand and model *'}
          </label>
          <input
            id="quote-brand"
            type="text"
            value={formData.brandModel}
            onChange={(e) => {
              setFormData({ ...formData, brandModel: e.target.value });
              if (errors.brandModel) setErrors({ ...errors, brandModel: undefined });
            }}
            placeholder={language === 'es' ? 'ej. Fender Telecaster American Standard 2012' : 'e.g. Gibson Les Paul Standard, PRS Custom 24'}
            className={`w-full px-3.5 py-2.5 bg-zinc-950 border rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 transition-all ${
              errors.brandModel
                ? 'border-red-500 focus:ring-red-500'
                : 'border-zinc-800 focus:border-amber-400 focus:ring-amber-400/50'
            }`}
          />
          {errors.brandModel && (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.brandModel}</span>
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="quote-desc" className="block text-xs font-semibold text-zinc-300 mb-1.5">
            {language === 'es'
              ? 'Descripción del problema o trabajo solicitado *'
              : 'Description of problem or requested work *'}
          </label>
          <textarea
            id="quote-desc"
            rows={4}
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              if (errors.description) setErrors({ ...errors, description: undefined });
            }}
            placeholder={
              language === 'es'
                ? 'Describe los síntomas que notas (ej. trasteo en los trastes 7 al 12, cuerdas demasiado altas, potenciómetro de volumen que rasca, deseo de instalar unas pastillas Seymour Duncan, etc.)'
                : 'Describe what you notice (e.g. fret buzz between frets 7 to 12, action feels very high, scratchy volume pot, want to upgrade to Seymour Duncan pickups, etc.)'
            }
            className={`w-full px-3.5 py-2.5 bg-zinc-950 border rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 transition-all ${
              errors.description
                ? 'border-red-500 focus:ring-red-500'
                : 'border-zinc-800 focus:border-amber-400 focus:ring-amber-400/50'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.description}</span>
            </p>
          )}
        </div>

        {/* Photo attachment tip */}
        <div className="flex items-start gap-3 p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-lg text-xs text-zinc-400">
          <Camera className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {language === 'es'
              ? 'Consejo: Puedes adjuntar fotografías del instrumento (pala, trastes, puente o zonas afectadas) directamente en el chat de WhatsApp una vez se abra la conversación.'
              : 'Tip: You can attach photos of your instrument (headstock, frets, bridge or affected areas) directly in WhatsApp once the chat opens.'}
          </p>
        </div>

        {/* Privacy Checkbox */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer text-xs text-zinc-300">
            <input
              type="checkbox"
              checked={formData.acceptPrivacy}
              onChange={(e) => {
                setFormData({ ...formData, acceptPrivacy: e.target.checked });
                if (errors.acceptPrivacy) setErrors({ ...errors, acceptPrivacy: undefined });
              }}
              className="mt-0.5 rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-amber-400/40"
            />
            <span className="leading-relaxed">
              {language === 'es' ? (
                <>
                  He leído y acepto la{' '}
                  <a
                    href="/es/politica-privacidad"
                    onClick={handlePrivacyLink}
                    className="text-amber-400 underline hover:text-amber-300"
                  >
                    política de privacidad
                  </a>{' '}
                  para la gestión y comunicación de mi consulta técnica. *
                </>
              ) : (
                <>
                  I have read and accept the{' '}
                  <a
                    href="/en/privacy-policy"
                    onClick={handlePrivacyLink}
                    className="text-amber-400 underline hover:text-amber-300"
                  >
                    privacy policy
                  </a>{' '}
                  regarding data handling for my technical inquiry. *
                </>
              )}
            </span>
          </label>
          {errors.acceptPrivacy && (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.acceptPrivacy}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.99] text-zinc-950 font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-[#25D366]/20 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current" />
            <span>
              {isSubmitting
                ? (language === 'es' ? 'Preparando mensaje...' : 'Preparing message...')
                : (language === 'es' ? 'Revisar y enviar por WhatsApp' : 'Review and send via WhatsApp')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Security / Non-storage notice */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
          <span>
            {language === 'es'
              ? 'Conexión directa: tus datos no se almacenan en servidores y se transmiten únicamente mediante WhatsApp.'
              : 'Direct handoff: your details are not stored on web servers and transfer directly into WhatsApp.'}
          </span>
        </div>
      </form>
    </div>
  );
};
