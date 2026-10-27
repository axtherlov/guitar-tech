import React from 'react';
import { useContent } from '../context/ContentContext.tsx';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const { content, language, navigate } = useContent();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(language === 'es' ? '/es/contacto' : '/en/contact');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      
      {/* Back link */}
      <div>
        <a
          href={language === 'es' ? '/es/contacto' : '/en/contact'}
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'es' ? 'Volver a Contacto' : 'Back to Contact'}</span>
        </a>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight mb-2">
          {language === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
        </h1>
        <p className="text-xs text-zinc-400">
          {language === 'es' ? 'Borrador informativo para revisión previa al lanzamiento' : 'Informative draft for pre-launch review'}
        </p>
      </div>

      {/* Important Notice */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300/90 flex items-start gap-3 leading-relaxed">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-200 block mb-1">
            {language === 'es' ? 'Aviso importante para el titular del negocio:' : 'Important notice for business owner:'}
          </strong>
          {language === 'es'
            ? 'Este documento constituye un modelo preliminar redactado conforme a los principios generales del RGPD (Reglamento UE 2016/679) y la LOPDGDD 3/2018 para España. No sustituye el asesoramiento legal formal y debe ser completado con los datos fiscales definitivos del profesional antes de su publicación oficial.'
            : 'This document represents an initial template drafted according to general GDPR (EU Regulation 2016/679) and Spanish LOPDGDD 3/2018 guidelines. It does not replace professional legal advice and must be updated with the technician’s definitive tax identification details prior to commercial launch.'}
        </div>
      </div>

      {/* Policy Content */}
      <div className="space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800 pt-8">
        
        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-100">
            {language === 'es' ? '1. Responsable del Tratamiento' : '1. Data Controller'}
          </h2>
          <p className="text-zinc-400">
            {language === 'es'
              ? `El responsable del tratamiento de los datos recabados para la gestión de solicitudes técnicas es el titular de ${content.brandName}, con ámbito de actuación en Córdoba (Andalucía, España). Puede contactar directamente a través del canal oficial de WhatsApp del taller.`
              : `The data controller for technical inquiries is the owner of ${content.brandName}, operating in Córdoba (Andalusia, Spain). Contact is conducted directly via the official workshop WhatsApp channel.`}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-100">
            {language === 'es' ? '2. Finalidad del Tratamiento y Canal WhatsApp' : '2. Purpose of Data Processing & WhatsApp Channel'}
          </h2>
          <p className="text-zinc-400">
            {language === 'es'
              ? 'La finalidad exclusiva del tratamiento es atender su solicitud de información técnica, elaborar presupuestos personalizados para la calibración o reparación de su instrumento, y coordinar citas de entrega y recogida.'
              : 'The sole purpose of processing is handling your technical inquiries, preparing personalized calibration or repair quotes, and scheduling workshop appointments.'}
          </p>
          <p className="text-zinc-400">
            {language === 'es'
              ? 'El formulario del sitio web no almacena sus datos en bases de datos web persistentes ni los cede a terceros. Su función es formatear un mensaje predefinido que se transfiere directamente a la aplicación de mensajería WhatsApp para que usted mantenga el control total sobre el envío.'
              : 'The website quote form does not store your submission in persistent web databases or share it with third parties. It simply compiles a pre-formatted message transferred directly to WhatsApp, allowing you complete control over sending.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-100">
            {language === 'es' ? '3. Base Jurídica' : '3. Legal Basis'}
          </h2>
          <p className="text-zinc-400">
            {language === 'es'
              ? 'La base legal para el tratamiento de sus datos es la aplicación de medidas precontractuales a petición del interesado (art. 6.1.b del RGPD) y el consentimiento explícito otorgado al marcar la casilla de aceptación y remitir la consulta.'
              : 'The legal ground is pre-contractual measures requested by the user (Art. 6.1.b GDPR) and consent given by ticking the acceptance checkbox before contacting.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-100">
            {language === 'es' ? '4. Conservación de Datos' : '4. Data Retention'}
          </h2>
          <p className="text-zinc-400">
            {language === 'es'
              ? 'Los mensajes mantenidos en WhatsApp se conservarán durante el tiempo necesario para resolver la consulta y realizar el seguimiento técnico del instrumento reparado, tras lo cual podrán ser eliminados periódicamente.'
              : 'Chat conversations on WhatsApp are retained only as long as necessary to fulfill the service inquiry and warranty tracking, after which they may be pruned.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-100">
            {language === 'es' ? '5. Derechos del Usuario' : '5. User Rights'}
          </h2>
          <p className="text-zinc-400">
            {language === 'es'
              ? 'Usted puede ejercer en cualquier momento sus derechos de acceso, rectificación, supresión y oposición solicitándolo directamente a través de nuestro canal de WhatsApp o mediante comunicación formal.'
              : 'You have the right to access, rectify, delete, and object to the processing of your personal information at any time by contacting us directly.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-100">
            {language === 'es' ? '6. Ausencia de Comunicaciones Comerciales' : '6. No Unsolicited Marketing'}
          </h2>
          <p className="text-zinc-400">
            {language === 'es'
              ? 'No utilizamos sus datos de contacto para remitir publicidad, boletines promocionales ni comunicaciones comerciales no solicitadas.'
              : 'We never use your contact details for unsolicited marketing, promotional newsletters, or advertising spam.'}
          </p>
        </section>

      </div>
    </div>
  );
};
