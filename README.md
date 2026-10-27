# Guitar Tech Córdoba — Technical Guitar Services Website

Sitio web profesional, bilingüe (ES | EN), orientado a producción y optimizado para SEO local para un técnico especialista en guitarras y bajos en Córdoba (Andalucía, España).

---

## 1. Arquitectura y Decisiones Técnicas

- **Frontend:** React 19 + TypeScript sobre Vite con Tailwind CSS v4.
- **Backend Fullstack:** Servidor Express integrado (`server.ts`) que monta los middlewares de desarrollo de Vite en desarrollo y sirve la aplicación estática optimizada en producción.
- **Diseño & UI:** Estética técnica oscura, refinada y sobria acorde a un taller de luthería y calibración. Tipografía cuidada (`Plus Jakarta Sans` y `JetBrains Mono`), contraste accesible WCAG AA y fotografía documental generada para el taller.
- **Persistencia & CMS Ligero:** Almacenamiento seguro en archivo JSON (`/data/content.json`), con soporte de API REST (`/api/content`) para edición en tiempo real desde el panel `/admin`.
- **Copias de Seguridad Automáticas:** Con cada guardado administrativo se genera una copia timestamped en `/data/backups/backup-<fecha>-v<version>.json`, manteniendo un histórico rotativo de hasta 20 respaldos con restauración en un clic.
- **Canal de Conversión Oficial WhatsApp:** Generación de enlaces oficiales `https://wa.me/` con codificación segura de caracteres y mensaje introductorio configurable. Sin formularios con dependencias externas o bases de datos opacas.
- **SEO Local & Multilingüe:**
  - Rutas canónicas separadas para español e inglés (`/es`, `/es/servicios`, `/es/sobre-mi`, `/es/contacto` y `/en`, `/en/services`, `/en/about`, `/en/contact`).
  - Etiquetas `hreflang` cruzadas y etiquetas meta individuales.
  - Datos estructurados Schema.org (`ProfessionalService` / `LocalBusiness`) orientados a Córdoba.
  - Endpoints dinámicos de `/sitemap.xml` y `/robots.txt`.

---

## 2. Estructura de Archivos del Proyecto

```
/
├── data/
│   ├── content.json          # Archivo de contenido persistente editable
│   └── backups/              # Respaldos automáticos con versionado
├── src/
│   ├── assets/images/        # Fotografía de taller, trastes y electrónica
│   ├── components/
│   │   ├── Header.tsx        # Cabecera conforme al Top Bar Contract y selector ES|EN
│   │   ├── Footer.tsx        # Pie de página sobrio con enlaces y ámbito territorial
│   │   ├── FloatingWhatsApp.tsx # Botón flotante accesible (límite móvil <15%)
│   │   ├── QuoteForm.tsx     # Formulario guiado con validación y traspaso a WhatsApp
│   │   └── WhatsAppModal.tsx # Diálogo informativo cuando el número está en configuración
│   ├── context/
│   │   └── ContentContext.tsx # Estado global, sincronización de rutas y traducciones
│   ├── data/
│   │   └── defaultContent.ts # Contenido predeterminado con los 9 servicios y textos
│   ├── pages/
│   │   ├── HomePage.tsx      # Portada: Hero, preview de servicios, enfoque y llamadas
│   │   ├── ServicesPage.tsx  # Catálogo con los 9 servicios, síntomas y labores técnicas
│   │   ├── AboutPage.tsx     # Sobre mí: experiencia, pasión, filosofía y herramientas
│   │   ├── ContactPage.tsx   # Contacto directo, formulario guiado y cobertura en Córdoba
│   │   ├── PrivacyPolicyPage.tsx # Borrador de política de privacidad RGPD/LOPDGDD
│   │   └── AdminPage.tsx     # Panel protegido para editar textos, servicios y copias
│   ├── types.ts              # Modelos TypeScript estrictos
│   ├── App.tsx               # Enrutador bilingüe y sincronización de títulos
│   ├── main.tsx              # Punto de entrada de React
│   └── index.css             # Importación de Tailwind CSS v4 y tipografía
├── index.html                # Plantilla base con metadatos y JSON-LD de Schema.org
├── server.ts                 # Servidor Express fullstack con API y middlewares Vite
├── metadata.json             # Metadatos del applet en AI Studio
├── package.json              # Scripts y dependencias
└── .env.example              # Variables de entorno documentadas
```

---

## 3. Catálogo de los 9 Servicios Incluidos

1. **Ajuste y calibración completa** (Alma, acción milimétrica, quintado con afinador estroboscópico, balance de pastillas).
2. **Electrónica y sustitución de pastillas** (Instalación de pastillas, potenciómetros CTS, jacks, apantallado en cobre, eliminación de ruidos).
3. **Modificaciones y mejoras (Upgrades)** (Cejuelas de hueso talladas a mano, clavijeros de bloqueo, puentes de precisión, modificaciones de circuito).
4. **Nivelado, coronado y pulido de trastes** (Rectificado de precisión, lima diamantada de coronado y pulido espejo hasta 12.000 grit).
5. **Retrasteado completo o parcial** (Extracción térmica sin astillado, instalación por prensa en alpaca o acero inoxidable).
6. **Reparaciones mecánicas y estructurales** (Fracturas de pala, despegue de puentes acústicos, encolados con resinas de luthería y refuerzos).
7. **Mantenimiento preventivo y limpieza profunda** (Hidratación de diapasones con aceites botánicos, pulido de herrajes y abrillantado).
8. **Servicio técnico a domicilio y local de ensayo** (Asistencia desplazada en Córdoba para ensayos, grabaciones o colecciones de instrumentos).
9. **Servicios para tiendas de música y profesionales** (Ajuste de exposición, convenios de reparación técnica y revisiones preferentes).

*Nota sobre precios:* No se publican tarifas fijas o estimaciones automáticas arbitrarias; cada instrumento requiere evaluación individual.

---

## 4. Instalación y Ejecución

### Desarrollo local
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo en puerto 3000
npm run dev
```

### Compilación y producción
```bash
# Compilar frontend
npm run build

# Iniciar servidor de producción
npm start
```

---

## 5. Variables de Entorno

Configurables en `.env` (guía en `.env.example`):

- `ADMIN_PASSWORD`: Contraseña para el panel administrativo `/admin`. **Obligatoria en producción**: si no está definida, el acceso queda deshabilitado. En desarrollo (sin `NODE_ENV=production`) y sin esta variable, se acepta una clave de desarrollo local.
- `APP_URL`: Dominio público del sitio web (ej. `https://cordobaguitartech.com`) utilizado en `sitemap.xml`, `robots.txt` y canonical tags.
- `PORT`: Puerto de escucha del servidor (por defecto `3000`).
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`: Credenciales de Upstash Redis. Si existen, el contenido, las copias de seguridad y las sesiones de admin se guardan en Redis; si no, se usan archivos en `/data` (solo desarrollo local). También se aceptan los nombres `KV_REST_API_URL` / `KV_REST_API_TOKEN` que inyecta Vercel.

### Despliegue en Vercel

1. Importar el repositorio en Vercel (`vercel.json` ya fija el preset Vite y el directorio `dist`).
2. En **Storage / Marketplace**, añadir **Upstash Redis** al proyecto: Vercel inyecta las credenciales automáticamente.
3. En **Settings → Environment Variables**, definir `ADMIN_PASSWORD` (contraseña larga y única) y `APP_URL` (dominio público final).
4. Desplegar. La API corre como función serverless en `api/index.ts` (`/api/*`, `/sitemap.xml`, `/robots.txt`); el frontend se sirve como estático.

Sin `ADMIN_PASSWORD` el acceso a `/admin` queda deshabilitado en producción. El contenido se inicializa con los valores por defecto la primera vez que se consulta.

---

## 6. Panel de Administración (`/admin`)

Para acceder:
1. Navega a `/admin` o pulsa el enlace discreto "Admin" en el pie de página.
2. Introduce la contraseña definida en `ADMIN_PASSWORD`.
3. Desde el panel puedes:
   - **General & WhatsApp:** Actualizar el número de WhatsApp oficial, mensaje inicial predeterminado y área de cobertura.
   - **Los 9 Servicios:** Modificar títulos, descripciones, síntomas atendidos y trabajos técnicos tanto en español como en inglés.
   - **Textos & Sobre mí:** Personalizar los titulares, trayectoria y listado de herramientas.
   - **SEO:** Actualizar títulos y meta descripciones bilingües.
   - **Copias de Seguridad:** Crear copias manuales inmediatas o restaurar cualquier copia previa con un solo clic.

---

## 7. Checklist Previo al Lanzamiento Comercial

Antes de vincular el dominio definitivo:
- [ ] Introducir el número verificado de WhatsApp en la pestaña "General" del panel `/admin`.
- [ ] Cambiar la contraseña `ADMIN_PASSWORD` en el archivo de entorno `.env`.
- [ ] Revisar y completar los datos fiscales del titular en la página de **Política de Privacidad**.
- [ ] Comprobar el dominio en `APP_URL` para que el archivo `sitemap.xml` refleje la URL pública final.
- [ ] Dar de alta el perfil de empresa local en Google Business Profile seleccionando Córdoba y comarca como área de servicio.
