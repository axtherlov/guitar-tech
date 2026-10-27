import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext.tsx';
import { SiteContent, BackupItem, ServiceItem } from '../types.ts';
import {
  Lock,
  LogOut,
  Save,
  Check,
  AlertTriangle,
  History,
  Settings,
  Briefcase,
  FileText,
  Search,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { content, updateContent, isDefaultPassword, language } = useContent();

  const [token, setToken] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'services' | 'content' | 'seo' | 'backups' | 'checklist'>('general');

  // Form editable state
  const [formData, setFormData] = useState<SiteContent>(content);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState<string>('');

  // Backups state
  const [backupsList, setBackupsList] = useState<BackupItem[]>([]);
  const [loadingBackups, setLoadingBackups] = useState(false);

  // Sync formData when content updates from context
  useEffect(() => {
    setFormData(content);
  }, [content]);

  // Check existing session token
  useEffect(() => {
    const savedToken = sessionStorage.getItem('gt_admin_token');
    if (savedToken) {
      setToken(savedToken);
      fetchBackups(savedToken);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Contraseña incorrecta');
      }
      const data = await res.json();
      setToken(data.token);
      sessionStorage.setItem('gt_admin_token', data.token);
      fetchBackups(data.token);
    } catch (err: any) {
      setLoginError(err.message || 'Error al iniciar sesión');
    }
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch {}
    }
    setToken(null);
    sessionStorage.removeItem('gt_admin_token');
  };

  const fetchBackups = async (authToken: string) => {
    setLoadingBackups(true);
    try {
      const res = await fetch('/api/backups', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBackupsList(data.backups || []);
      }
    } catch (err) {
      console.error('Error fetching backups:', err);
    } finally {
      setLoadingBackups(false);
    }
  };

  const handleSave = async () => {
    if (!token) return;
    setSaveStatus('saving');
    try {
      const success = await updateContent(formData, token);
      if (success) {
        setSaveStatus('success');
        setSaveMessage('¡Cambios guardados con éxito y copia de seguridad generada automáticamente!');
        fetchBackups(token);
        setTimeout(() => setSaveStatus('idle'), 4000);
      } else {
        throw new Error('Error al guardar en el servidor');
      }
    } catch (err: any) {
      setSaveStatus('error');
      setSaveMessage(err.message || 'Ocurrió un error');
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  };

  const handleCreateManualBackup = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/backups/create', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchBackups(token);
        alert('Copia de seguridad manual creada con éxito.');
      }
    } catch {
      alert('Error creando la copia de seguridad.');
    }
  };

  const handleRestoreBackup = async (filename: string) => {
    if (!token) return;
    if (!window.confirm(`¿Estás seguro de restaurar la versión "${filename}"? Se guardará una copia previa de seguridad del estado actual.`)) {
      return;
    }
    try {
      const res = await fetch('/api/backups/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ filename })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          setFormData(data.content);
        }
        alert('Copia de seguridad restaurada correctamente.');
        fetchBackups(token);
      } else {
        alert('Error al restaurar copia.');
      }
    } catch {
      alert('Error de conexión.');
    }
  };

  // Helper for updating nested service
  const updateService = (index: number, updated: ServiceItem) => {
    const list = [...formData.services];
    list[index] = updated;
    setFormData({ ...formData, services: list });
  };

  // If not logged in, render password barrier
  if (!token) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-zinc-100">
              Panel de Administración
            </h1>
            <p className="text-xs text-zinc-400">
              Acceso seguro para el técnico de Guitar Tech Córdoba
            </p>
          </div>

          {isDefaultPassword && (
            <div className="p-3.5 bg-zinc-950 border border-amber-500/30 rounded-lg text-xs text-amber-300/90 leading-relaxed">
              <strong className="block text-amber-200 mb-1">Clave de acceso inicial:</strong>
              Puedes acceder con la clave de configuración <code className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-100 font-mono">admin</code> o <code className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-100 font-mono">guitartech2026</code>.
              Para producción, define <code className="text-zinc-100 font-mono">ADMIN_PASSWORD</code> en el archivo <code className="text-zinc-100 font-mono">.env</code>.
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Contraseña de acceso
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Introduce tu contraseña..."
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-amber-400"
                autoFocus
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-400 font-medium">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="space-y-8 py-4">
      
      {/* Top Bar of Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400">v{formData.version || 1}</span>
            <span className="text-xs text-zinc-400">·</span>
            <span className="text-xs text-zinc-400">
              Última actualización: {new Date(formData.lastUpdated).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">
            Gestión de Contenido y Configuración
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-sm"
          >
            {saveStatus === 'saving' ? (
              <span>Guardando...</span>
            ) : saveStatus === 'success' ? (
              <>
                <Check className="w-4 h-4" />
                <span>Guardado</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="p-2.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Save status notification */}
      {saveMessage && (
        <div className={`p-4 rounded-xl text-xs font-medium flex items-center gap-2 ${
          saveStatus === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'
        }`}>
          {saveStatus === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-zinc-800 overflow-x-auto pb-1 text-xs font-medium">
        {[
          { id: 'general', label: 'General & WhatsApp', icon: Settings },
          { id: 'services', label: 'Los 9 Servicios', icon: Briefcase },
          { id: 'content', label: 'Textos & Sobre mí', icon: FileText },
          { id: 'seo', label: 'SEO & Metadatos', icon: Search },
          { id: 'backups', label: 'Copias de Seguridad', icon: History },
          { id: 'checklist', label: 'Checklist de Lanzamiento', icon: CheckCircle2 }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-zinc-800 text-amber-400 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: GENERAL & WHATSAPP */}
      {activeTab === 'general' && (
        <div className="space-y-6 max-w-3xl">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
              Identidad y Datos de Contacto
            </h2>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Nombre comercial del taller
              </label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Número de WhatsApp oficial (incluye prefijo internacional, ej. +34612345678)
              </label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({
                  ...formData,
                  whatsappNumber: e.target.value,
                  isWhatsappConfigured: e.target.value.replace(/[^0-9]/g, '') !== '34600000000' && e.target.value.trim().length > 8
                })}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-amber-400"
              />
              <p className="text-[11px] text-zinc-400 mt-1">
                Estado actual: {formData.isWhatsappConfigured ? (
                  <span className="text-emerald-400 font-semibold">Configurado y activo</span>
                ) : (
                  <span className="text-amber-400 font-semibold">Número de marcador de posición (no verificado)</span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Mensaje inicial por defecto (Español)
                </label>
                <textarea
                  rows={3}
                  value={formData.defaultIntroMessage.es}
                  onChange={(e) => setFormData({
                    ...formData,
                    defaultIntroMessage: { ...formData.defaultIntroMessage, es: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Mensaje inicial por defecto (English)
                </label>
                <textarea
                  rows={3}
                  value={formData.defaultIntroMessage.en}
                  onChange={(e) => setFormData({
                    ...formData,
                    defaultIntroMessage: { ...formData.defaultIntroMessage, en: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Área de cobertura (ES)
                </label>
                <input
                  type="text"
                  value={formData.serviceArea.es}
                  onChange={(e) => setFormData({
                    ...formData,
                    serviceArea: { ...formData.serviceArea, es: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Área de cobertura (EN)
                </label>
                <input
                  type="text"
                  value={formData.serviceArea.en}
                  onChange={(e) => setFormData({
                    ...formData,
                    serviceArea: { ...formData.serviceArea, en: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: THE 9 SERVICES */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <p className="text-xs text-zinc-400">
            Edita los nombres, descripciones cortas, problemas resueltos y trabajos técnicos incluidos para cada uno de los 9 servicios.
          </p>

          <div className="space-y-6">
            {formData.services.map((service, index) => (
              <div key={service.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-zinc-800 text-amber-400 flex items-center justify-center font-mono text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="font-bold text-sm text-zinc-100">{service.name.es}</span>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-mono">id: {service.id}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Nombre (ES)</label>
                    <input
                      type="text"
                      value={service.name.es}
                      onChange={(e) => {
                        const s = { ...service, name: { ...service.name, es: e.target.value } };
                        updateService(index, s);
                      }}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Name (EN)</label>
                    <input
                      type="text"
                      value={service.name.en}
                      onChange={(e) => {
                        const s = { ...service, name: { ...service.name, en: e.target.value } };
                        updateService(index, s);
                      }}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Descripción corta (ES)</label>
                    <textarea
                      rows={2}
                      value={service.shortDesc.es}
                      onChange={(e) => {
                        const s = { ...service, shortDesc: { ...service.shortDesc, es: e.target.value } };
                        updateService(index, s);
                      }}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">Short Description (EN)</label>
                    <textarea
                      rows={2}
                      value={service.shortDesc.en}
                      onChange={(e) => {
                        const s = { ...service, shortDesc: { ...service.shortDesc, en: e.target.value } };
                        updateService(index, s);
                      }}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Prioridad Comercial / Orden (1 = Primero)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={service.order || (index + 1)}
                      onChange={(e) => {
                        const s = { ...service, order: parseInt(e.target.value, 10) || (index + 1) };
                        updateService(index, s);
                      }}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Ruta de Fotografía (Reemplazable con fotos del propio taller)
                    </label>
                    <input
                      type="text"
                      value={service.image || ''}
                      onChange={(e) => {
                        const s = { ...service, image: e.target.value };
                        updateService(index, s);
                      }}
                      placeholder="/src/assets/images/..."
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CONTENT & ABOUT ME */}
      {activeTab === 'content' && (
        <div className="space-y-6 max-w-3xl">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
              Página de Inicio — Titulares y Textos Principales
            </h2>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Titular Hero (ES)</label>
              <input
                type="text"
                value={formData.hero.title.es}
                onChange={(e) => setFormData({
                  ...formData,
                  hero: { ...formData.hero, title: { ...formData.hero.title, es: e.target.value } }
                })}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Hero Title (EN)</label>
              <input
                type="text"
                value={formData.hero.title.en}
                onChange={(e) => setFormData({
                  ...formData,
                  hero: { ...formData.hero, title: { ...formData.hero.title, en: e.target.value } }
                })}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Subtítulo Hero (ES)</label>
              <textarea
                rows={2}
                value={formData.hero.subtitle.es}
                onChange={(e) => setFormData({
                  ...formData,
                  hero: { ...formData.hero, subtitle: { ...formData.hero.subtitle, es: e.target.value } }
                })}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100"
              />
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
              Página Sobre mí — Trayectoria y Filosofía
            </h2>
            <p className="text-xs text-zinc-400">
              Aquí el propietario puede personalizar los detalles específicos de su taller y herramientas.
            </p>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Aviso de personalización (ES)</label>
              <input
                type="text"
                value={formData.about.ownerNotice.es}
                onChange={(e) => setFormData({
                  ...formData,
                  about: { ...formData.about, ownerNotice: { ...formData.about.ownerNotice, es: e.target.value } }
                })}
                className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SEO */}
      {activeTab === 'seo' && (
        <div className="space-y-6 max-w-3xl">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
              Optimización para Motores de Búsqueda (SEO Local Córdoba)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Título SEO (ES)</label>
                <input
                  type="text"
                  value={formData.seo.es.title}
                  onChange={(e) => setFormData({
                    ...formData,
                    seo: { ...formData.seo, es: { ...formData.seo.es, title: e.target.value } }
                  })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">SEO Title (EN)</label>
                <input
                  type="text"
                  value={formData.seo.en.title}
                  onChange={(e) => setFormData({
                    ...formData,
                    seo: { ...formData.seo, en: { ...formData.seo.en, title: e.target.value } }
                  })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Meta Descripción (ES)</label>
                <textarea
                  rows={3}
                  value={formData.seo.es.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    seo: { ...formData.seo, es: { ...formData.seo.es, description: e.target.value } }
                  })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Meta Description (EN)</label>
                <textarea
                  rows={3}
                  value={formData.seo.en.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    seo: { ...formData.seo, en: { ...formData.seo.en, description: e.target.value } }
                  })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-100"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: BACKUPS & RESTORE */}
      {activeTab === 'backups' && (
        <div className="space-y-6 max-w-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
                Copias de Seguridad Automáticas
              </h2>
              <p className="text-xs text-zinc-400">
                El sistema genera automáticamente un respaldo timestamped con cada guardado. Puedes crear respaldos manuales o restaurar cualquier punto anterior.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCreateManualBackup}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Crear copia ahora</span>
            </button>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
            {loadingBackups ? (
              <div className="p-8 text-center text-xs text-zinc-400">Cargando copias de seguridad...</div>
            ) : backupsList.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-400">
                No hay copias de seguridad aún. Guarda algún cambio o crea una copia manual.
              </div>
            ) : (
              <div className="divide-y divide-zinc-800">
                {backupsList.map((b) => (
                  <div key={b.filename} className="p-4 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="font-mono text-zinc-200 font-semibold">{b.filename}</div>
                      <div className="text-[11px] text-zinc-400">
                        {new Date(b.timestamp).toLocaleString()} · {(b.sizeBytes / 1024).toFixed(1)} KB · v{b.version}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRestoreBackup(b.filename)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-amber-400 hover:text-zinc-950 text-zinc-300 font-medium rounded transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restaurar</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: LAUNCH CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="space-y-6 max-w-3xl">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Lista de Comprobación Previa al Lanzamiento</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Antes de apuntar el dominio comercial definitivo a este servidor, el titular del negocio debe completar y verificar los siguientes elementos:
            </p>

            <ul className="space-y-3 text-xs text-zinc-300 pt-2">
              <li className="flex items-start gap-2.5 p-3 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
                <span className="w-4 h-4 rounded-full border border-amber-400/60 flex items-center justify-center shrink-0 mt-0.5 text-[10px] text-amber-400 font-bold">1</span>
                <div>
                  <strong className="text-zinc-100 block">Número de WhatsApp Verificado:</strong>
                  Actualizar en la pestaña "General" el número de teléfono con prefijo internacional (+34...) donde se recibirán las consultas.
                </div>
              </li>

              <li className="flex items-start gap-2.5 p-3 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
                <span className="w-4 h-4 rounded-full border border-amber-400/60 flex items-center justify-center shrink-0 mt-0.5 text-[10px] text-amber-400 font-bold">2</span>
                <div>
                  <strong className="text-zinc-100 block">Contraseña de Administrador Segura:</strong>
                  Configurar la variable de entorno <code className="font-mono text-amber-300">ADMIN_PASSWORD</code> en el archivo <code className="font-mono text-zinc-200">.env</code> para sustituir la clave de desarrollo por defecto.
                </div>
              </li>

              <li className="flex items-start gap-2.5 p-3 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
                <span className="w-4 h-4 rounded-full border border-amber-400/60 flex items-center justify-center shrink-0 mt-0.5 text-[10px] text-amber-400 font-bold">3</span>
                <div>
                  <strong className="text-zinc-100 block">Revisión de la Política de Privacidad:</strong>
                  Adaptar los campos de identificación fiscal y domicilio social en la página de política de privacidad conforme a las normativas de la Agencia Española de Protección de Datos (AEPD).
                </div>
              </li>

              <li className="flex items-start gap-2.5 p-3 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
                <span className="w-4 h-4 rounded-full border border-amber-400/60 flex items-center justify-center shrink-0 mt-0.5 text-[10px] text-amber-400 font-bold">4</span>
                <div>
                  <strong className="text-zinc-100 block">Fotografías del Taller Propio:</strong>
                  El sitio web ya incluye fotografía de luthería y banco de trabajo de alta fidelidad. Progresivamente pueden incorporarse fotos reales del propio taller y banco del técnico en Córdoba.
                </div>
              </li>

              <li className="flex items-start gap-2.5 p-3 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
                <span className="w-4 h-4 rounded-full border border-amber-400/60 flex items-center justify-center shrink-0 mt-0.5 text-[10px] text-amber-400 font-bold">5</span>
                <div>
                  <strong className="text-zinc-100 block">Google Business Profile (Perfil de Empresa en Google):</strong>
                  Vincular la ficha local de Google Maps sin exponer dirección física privada innecesaria, configurando Córdoba como área de servicio.
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};
