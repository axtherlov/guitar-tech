import type { SiteContent } from '../types.js';

// Placeholder price label until a real price is set for the service.
const QUOTE_PRICE = {
  es: 'Consultar precio',
  en: 'Ask for a quote'
};

/**
 * Bump this number whenever the services in this file must overwrite what is stored in
 * production (Redis). On the next request the server compares it with the stored
 * `servicesSeed`; if the stored one is lower, services are replaced by these defaults
 * (the previous content is backed up first). Admin edits made afterwards are kept.
 */
export const SERVICES_SEED_VERSION = 1;

export const DEFAULT_CONTENT: SiteContent = {
  brandName: 'Kuervo Guitar Tech',
  whatsappNumber: '+34600000000',
  isWhatsappConfigured: false,
  defaultIntroMessage: {
    es: 'Hola, estoy interesado/a en tus servicios de guitar tech. ¿Podrías darme más información?',
    en: 'Hello, I am interested in your guitar tech services. Could you provide more information?'
  },
  serviceArea: {
    es: 'Córdoba (España)',
    en: 'Córdoba (Spain)'
  },
  hero: {
    badge: {
      es: 'Servicio Técnico Especializado · Córdoba',
      en: 'Specialized Technical Service · Córdoba'
    },
    title: {
      es: 'Precisión técnica y calibración para tu guitarra o bajo',
      en: 'Technical precision and setup for your guitar or bass'
    },
    subtitle: {
      es: 'Ajuste fino, electrónica, nivelado de trastes y mantenimiento integral en Córdoba. Tu instrumento optimizado para su máximo confort, afinación y respuesta sonora.',
      en: 'Fine setup, custom wiring, fret leveling and thorough maintenance in Córdoba. Optimizing your instrument for maximum playability, tuning stability and tone.'
    },
    ctaQuote: {
      es: 'Solicitar presupuesto',
      en: 'Request a quote'
    },
    ctaWhatsapp: {
      es: 'Consultar por WhatsApp',
      en: 'Chat on WhatsApp'
    }
  },
  approach: {
    title: {
      es: 'Enfoque de trabajo: rigor milimétrico y respeto por el instrumento',
      en: 'Work approach: millimeter precision and respect for the instrument'
    },
    subtitle: {
      es: 'Cada instrumento responde a una tensión, calibre de cuerdas y tacto de pulsación específicos. No aplicamos ajustes genéricos; medimos, diagnosticamos y ajustamos de forma individual.',
      en: 'Every instrument responds to specific string tension, gauge and playing touch. We do not apply generic settings; we measure, diagnose and calibrate each piece individually.'
    },
    pillars: [
      {
        title: {
          es: 'Diagnóstico previo minucioso',
          en: 'Meticulous preliminary diagnosis'
        },
        description: {
          es: 'Inspección de curvatura de mástil, altura de cejuela, estado de trastes, radio del diapasón y electrónica antes de intervenir.',
          en: 'Inspection of neck relief, nut height, fret condition, fretboard radius and electronics before any intervention.'
        }
      },
      {
        title: {
          es: 'Herramientas de luthería de precisión',
          en: 'Precision lutherie tooling'
        },
        description: {
          es: 'Galgas de espesores, reglas de filo biselado, calibres digitales, afinadores estroboscópicos y estaciones de soldadura con temperatura controlada.',
          en: 'Feeler gauges, precision straightedges, digital calipers, strobe tuning accuracy and temperature-controlled soldering stations.'
        }
      },
      {
        title: {
          es: 'Ajuste personalizado a tu estilo',
          en: 'Customized to your playing style'
        },
        description: {
          es: 'Calibramos la acción, altura de pastillas y compensación según toques con púa pesada, dedos, afinaciones alternativas o afinación estándar.',
          en: 'Action, pickup heights and intonation are dialed in according to whether you use heavy picks, fingerstyle, standard or drop tunings.'
        }
      },
      {
        title: {
          es: 'Transparencia y comunicación directa',
          en: 'Transparency and direct contact'
        },
        description: {
          es: 'Te explicamos con total claridad el estado real de tu instrumento, los pasos necesarios y el presupuesto antes de iniciar cualquier labor.',
          en: 'We clearly explain the actual state of your instrument, the necessary steps and the quote before starting any work.'
        }
      }
    ]
  },
  about: {
    ownerNotice: {
      es: '[Espacio configurable: Los detalles específicos de trayectoria y equipamiento exacto del taller pueden actualizarse desde el panel de administración]',
      en: '[Configurable section: Specific background and exact workshop equipment can be updated via the admin panel]'
    },
    experience: {
      es: [
        'Formación técnica continua y años dedicados al estudio del comportamiento de las maderas, la tensión de las cuerdas y los sistemas electromagnéticos de guitarras eléctricas, acústicas y bajos.',
        'Experiencia en el diagnóstico de problemas de trasteo, desajustes estacionales por variaciones de temperatura y humedad, y resolución de ruidos o pérdidas de señal en circuitos pasivos y activos.'
      ],
      en: [
        'Continuous technical training and years dedicated to studying wood stability, string tension dynamics and electromagnetic circuits in electric guitars, acoustics and basses.',
        'Experience diagnosing fret buzz, seasonal neck shifts caused by Córdoba’s temperature and humidity swings, and resolving ground loops or signal loss in passive and active systems.'
      ]
    },
    passion: {
      es: [
        'La guitarra no es solo un objeto de madera y metal: es el canal expresivo de un músico. Ver cómo un instrumento apagado o incómodo recupera su comodidad y resonancia tras una intervención es el núcleo de este taller.',
        'Tratamos cada guitarra o bajo con la misma atención y cuidado minucioso, ya sea un instrumento de iniciación con alto valor sentimental o una pieza vintage de colección.'
      ],
      en: [
        'A guitar is not merely wood and metal; it is an artist’s expressive tool. Seeing an uncomfortable or dull instrument regain its resonance and ease of play is the heart of this workshop.',
        'Every guitar or bass is handled with the exact same rigor and care, whether it is a first instrument of high sentimental value or a high-end vintage piece.'
      ]
    },
    philosophy: {
      es: [
        'Mínima intervención destructiva: conservar siempre las piezas originales siempre que sea técnicamente viable.',
        'Ajustes basados en mediciones cuantificables, no en suposiciones.',
        'Compromiso ético: presupuestos personalizados sin costes ocultos ni intervenciones innecesarias.'
      ],
      en: [
        'Minimal destructive intervention: preserving original components whenever technically viable.',
        'Calibrations driven by quantifiable tolerances and measurements, never guesswork.',
        'Ethical commitment: transparent personalized quotes with no hidden costs or unneeded modifications.'
      ]
    },
    equipment: {
      es: [
        'Reglas de verificación de mástil entalladas y rectas de precisión rectificadas.',
        'Fret rocker y galgas milimétricas de espesores para detección de desniveles.',
        'Limas de coronado diamantadas y abrasivos micromesh de hasta 12.000 grit.',
        'Afinador estroboscópico de alta resolución para quintado e intonación armónica exacta.',
        'Estación de desoldadura y soldadura profesional regulada, multímetro digital y cables apantallados.'
      ],
      en: [
        'Precision notched straightedges and ground true leveling beams.',
        'Fret rockers and metric feeler gauges for pinpointing high frets.',
        'Diamond crowning files and micro-mesh polishing pads up to 12,000 grit.',
        'High-resolution strobe tuner for exact octave intonation and harmonic alignment.',
        'Temperature-regulated soldering station, digital multimeter and braided shielded wire.'
      ]
    }
  },
  // Display order: 1. Setup (includes maintenance), 2. Fret leveling, 3. Refretting, 4. Electronics, 5. Modifications, 6. Repairs, 7. Onsite
  services: [
    {
      id: 'setup-calibration',
      order: 1,
      price: { es: 'Básico 30 €\nPremium 50 €', en: 'Basic €30\nPremium €50' },
      category: 'setup',
      name: {
        es: 'Ajuste y calibración (setup)',
        en: 'Setup and calibration'
      },
      shortDesc: {
        es: 'Dejamos tu guitarra cómoda de tocar y afinada en todo el mástil: ajustamos el mástil, la altura de las cuerdas, la intonación y las pastillas, y la limpiamos a fondo.',
        en: 'We make your guitar comfortable to play and in tune all along the neck: we adjust the neck, string height, intonation and pickups, and give it a deep clean.'
      },
      problems: {
        es: [
          'Las cuerdas están duras o muy altas y te cuesta apretarlas.',
          'Las cuerdas suenan "rasposas" en los primeros trastes o en las notas agudas.',
          'Afinas bien al aire, pero desafina al tocar acordes más arriba en el mástil.',
          'Las notas se apagan muy rápido o una pastilla suena más fuerte que otra.',
          'Tus cuerdas están viejas, apagadas u oxidadas y toca cambiarlas.',
          'Tu guitarra lleva mucho tiempo guardada, o tiene el diapasón reseco o sucio y los herrajes con óxido.'
        ],
        en: [
          'Strings feel stiff or sit too high and are hard to press.',
          'Strings sound buzzy on the first frets or on high notes.',
          'You tune fine open, but chords higher up the neck sound out of tune.',
          'Notes die out very fast or one pickup sounds louder than another.',
          'Your strings are old, dull or rusty and it is time to change them.',
          'Your guitar has been in storage for a long time, or has a dry or dirty fretboard and rusty hardware.'
        ]
      },
      workIncluded: {
        es: [
          'Revisamos el mástil y lo ajustamos con el alma (truss rod) para que tenga la curvatura justa.',
          'Subimos o bajamos las cuerdas en el puente y en la cejuela hasta que se toque cómodo y no suenen rasposas.',
          'Ajustamos la entonación para que afine bien, tanto con las cuerdas al aire como pisadas.',
          'Regulamos la altura de las pastillas para que suenen parejas entre sí.',
          'Revisamos y apretamos tornillos, clavijas y la entrada del cable (jack).',
          'Limpiamos a fondo el diapasón y los trastes, sin productos abrasivos.',
          'Hidratamos la madera del diapasón con aceites adecuados para cada tipo de madera.',
          'Limpiamos y lubricamos las piezas que se mueven (clavijas y puente) y los contactos del volumen, el tono y el selector.'
        ],
        en: [
          'We check the neck and adjust it with the truss rod so it has just the right curve.',
          'We raise or lower the strings at the bridge and nut until it plays comfortably with no buzz.',
          'We adjust the intonation so it stays in tune, both on open strings and when fretted.',
          'We adjust pickup height so they sound even with each other.',
          'We check and tighten screws, tuners and the cable input (jack).',
          'We deep-clean the fretboard and frets, with no abrasive products.',
          'We hydrate the fretboard wood with oils suited to each type of wood.',
          'We clean and lubricate the moving parts (tuners and bridge) and the contacts of the volume, tone and selector.'
        ]
      },
      notIncluded: {
        es: [
          'Las cuerdas no están incluidas en el precio: puedes traerlas tú o las ponemos nosotros con un costo extra.',
          'No incluye el nivelado de trastes: es otro servicio.'
        ],
        en: [
          'Strings are not included in the price: bring your own, or we can supply them for an extra cost.',
          'Fret leveling is not included: it is a separate service.'
        ]
      },
      image: '/images/hero_guitar_workbench_1793042582513.jpg',
      imageAlt: {
        es: 'Calibración y ajuste fino de guitarra en banco de trabajo con galgas y reglas',
        en: 'Guitar setup and fine calibration on luthier workbench with feeler gauges'
      }
    },
    {
      id: 'fret-leveling',
      order: 2,
      price: {
        es: 'Níquel 150 €\nAcero inoxidable 200 €',
        en: 'Nickel silver €150\nStainless steel €200'
      },
      category: 'frets',
      name: {
        es: 'Nivelado y pulido de trastes',
        en: 'Fret leveling and polishing'
      },
      shortDesc: {
        es: 'Dejamos todos los trastes a la misma altura y bien pulidos, para que puedas bajar las cuerdas sin que suenen rasposas ni se ahoguen las notas, lo que permite una acción ultrabaja sin zumbidos.',
        en: 'We bring all the frets to the same height and polish them well, so you can lower the strings without buzzing or choked notes, which allows ultra-low action with no buzz.'
      },
      problems: {
        es: [
          'Notas surcos o marcas de desgaste en los trastes, sobre todo bajo las cuerdas finas.',
          'Algunas notas suenan rasposas o se ahogan y no puedes bajar la altura de las cuerdas.',
          'Al hacer bendings o vibrato sientes los trastes ásperos o la cuerda chirría.',
          'Sientes los bordes de los trastes afilados al pasar la mano por el mástil.'
        ],
        en: [
          'You notice grooves or wear marks on the frets, especially under the thin strings.',
          'Some notes sound rough or choke out and you cannot lower the string height.',
          'When bending or using vibrato, the frets feel rough or the string squeaks.',
          'You feel sharp fret ends when you slide your hand along the neck.'
        ]
      },
      workIncluded: {
        es: [
          'Revisamos la curvatura del mástil con una regla de precisión antes de empezar.',
          'Rectificado y nivelado de precisión de la corona de todos los trastes.',
          'Recoronado manual con limas diamantadas para devolver la cumbre cilíndrica exacta.',
          'Pulimos los trastes poco a poco hasta dejarlos lisos y brillantes como un espejo.',
          'Suavizamos los bordes de los trastes para que no se noten al pasar la mano por el mástil.'
        ],
        en: [
          'We check the neck curvature with a precision straightedge before we start.',
          'Precision leveling along the entire fret run with ground leveling beam.',
          'Hand recrowning with specialized diamond files to restore the narrow crown apex.',
          'We polish the frets step by step until they are smooth and mirror-bright.',
          'We smooth the fret ends so you do not feel them when your hand slides along the neck.'
        ]
      },
      image: '/images/fretwork_precision_luthier_1793042582589.jpg',
      imageAlt: {
        es: 'Nivelado, coronado y pulido de trastes con abrasivos micro-mesh en diapasón',
        en: 'Fret leveling, recrowning and micro-mesh polishing on rosewood fretboard'
      }
    },
    {
      id: 'refretting',
      order: 3,
      price: QUOTE_PRICE,
      hidePriceNote: true,
      category: 'frets',
      name: {
        es: 'Retrasteado completo o parcial',
        en: 'Complete or partial refretting'
      },
      shortDesc: {
        es: 'Cambiamos los trastes gastados por unos nuevos, de níquel (los de toda la vida) o de acero inoxidable, que duran muchísimo más.',
        en: 'We replace worn frets with new ones, in nickel (the classic choice) or stainless steel, which lasts much longer.'
      },
      problems: {
        es: [
          'Los trastes están tan gastados que ya no se pueden nivelar más.',
          'Hay trastes sueltos o levantados.',
          'Preferencia por cambiar a un perfil diferente (Medium Jumbo, Jumbo, Vintage).',
          'Deseo de actualizar a trastes de acero inoxidable para evitar desgaste futuro.'
        ],
        en: [
          'Your frets are so worn they cannot be leveled any more.',
          'You have loose or lifted frets.',
          'Desire to change to a different fret size (Medium Jumbo, Jumbo, Narrow Tall).',
          'Seeking an upgrade to stainless steel frets for lifetime smooth bending and zero wear.'
        ]
      },
      workIncluded: {
        es: [
          'Quitamos los trastes viejos con calor controlado, para no dañar ni astillar el diapasón.',
          'Corregimos y preparamos la curvatura del diapasón (ébano, palisandro o arce).',
          'Limpiamos las ranuras de los trastes y las dejamos todas a la misma profundidad.',
          'Instalamos los trastes nuevos a presión, de níquel o de acero inoxidable.',
          'Nivelado final, coronado, pulido y calibración completa del instrumento.'
        ],
        en: [
          'We remove the old frets with controlled heat, so we do not damage or chip the fretboard.',
          'We correct and prepare the fretboard curvature (ebony, rosewood or maple).',
          'We clean the fret slots and make them all the same depth.',
          'We press in the new frets, in nickel or stainless steel.',
          'Subsequent leveling, precision crowning, high polish and full setup.'
        ]
      },
      image: '/images/service_refretting_workshop_1793091765400.jpg',
      imageAlt: {
        es: 'Inserción y prensado de hilo de traste nuevo en diapasón de guitarra',
        en: 'Pressing new fret wire into guitar fretboard using brass radiused luthier press'
      }
    },
    {
      id: 'electronics',
      order: 4,
      price: QUOTE_PRICE,
      hidePriceNote: true,
      category: 'electronics',
      name: {
        es: 'Electrónica y cambio de pastillas',
        en: 'Electronics and pickup changes'
      },
      shortDesc: {
        es: 'Instalamos pastillas, arreglamos los controles de volumen y tono y eliminamos ruidos y zumbidos.',
        en: 'We install pickups, fix your volume and tone controls, and get rid of noise and hum.'
      },
      problems: {
        es: [
          'Oyes chasquidos o ruidos al mover el volumen, el tono o el selector.',
          'Se oye un zumbido constante que baja cuando tocas las cuerdas o el puente.',
          'El sonido se corta o falla al mover el cable, o el jack está flojo.',
          'Quieres cambiar el sonido de tu guitarra con pastillas mejores.'
        ],
        en: [
          'You hear crackling or noise when you move the volume, the tone or the selector.',
          'There is a constant hum that gets quieter when you touch the strings or the bridge.',
          'The sound cuts out or fails when you move the cable, or the jack is loose.',
          'You want to change your guitar\'s sound with better pickups.'
        ]
      },
      workIncluded: {
        es: [
          'Instalamos y conectamos pastillas nuevas, pasivas o activas.',
          'Cambiamos los controles de volumen y tono, el selector de pastillas y el jack por piezas premium de alta calidad o de marcas de calidad estándar del mercado.',
          'Cableado y apantallamiento de alta fidelidad.',
          'Forramos con cobre el hueco de los controles para eliminar ruidos y zumbidos.'
        ],
        en: [
          'We install and wire new pickups, passive or active.',
          'We replace the volume and tone controls, the pickup selector and the jack with premium, high-quality parts or standard-quality brands from the market.',
          'High-fidelity wiring and shielding.',
          'We line the control cavity with copper to get rid of noise and hum.'
        ]
      },
      image: '/images/guitar_electronics_soldering_1793042584609.jpg',
      imageAlt: {
        es: 'Soldadura de circuito de guitarra con potenciómetros y condensador de tono',
        en: 'Guitar electronics cavity soldering with potentiometers and tone capacitor'
      }
    },
    {
      id: 'modifications',
      order: 5,
      price: QUOTE_PRICE,
      hidePriceNote: true,
      category: 'modifications',
      name: {
        es: 'Modificaciones y mejoras (upgrades)',
        en: 'Modifications and hardware upgrades'
      },
      shortDesc: {
        es: 'Mejoramos tu guitarra con mejores piezas: clavijas de bloqueo, puentes, cejuelas de hueso hechas a medida y cambios en el circuito para tener más sonidos.',
        en: 'We upgrade your guitar with better parts: locking tuners, bridges, custom-fit bone nuts and circuit changes for more tones.'
      },
      problems: {
        es: [
          'La guitarra se desafina al hacer bendings o al usar la palanca de trémolo.',
          'La cejuela de plástico está gastada o hace que las cuerdas se atasquen.',
          'El puente original está oxidado o no se adapta bien al mástil.',
          'Necesidad de opciones tímbricas como coil-split, serie/paralelo o treble bleed.'
        ],
        en: [
          'Your guitar goes out of tune when you bend strings or use the tremolo arm.',
          'The plastic nut is worn or makes the strings stick.',
          'The original bridge is rusty or does not fit the neck well.',
          'Seeking expanded tonal options like coil-splitting, phase inversion or treble bleed.'
        ]
      },
      workIncluded: {
        es: [
          'Tallamos a mano una cejuela de hueso natural o sintético, a la medida de tu guitarra y tus cuerdas.',
          'Instalación de clavijeros de bloqueo (Gotoh, Schaller, Grover).',
          'Cambiamos el puente por otro mejor: fijo, tipo Strat o trémolo flotante.',
          'Instalamos circuitos nuevos para conseguir más sonidos: treble bleed, potenciómetros push-pull o blend.'
        ],
        en: [
          'We hand-carve a natural or synthetic bone nut, fitted to your guitar and your strings.',
          'Installation of precision locking tuners (Gotoh, Schaller, Grover).',
          'We replace the bridge with a better one: fixed, Strat-style or floating tremolo.',
          'We install new circuits to get more tones: treble bleed, push-pull pots or blend.'
        ]
      },
      image: '/images/service_modifications_hardware_1793091764589.jpg',
      imageAlt: {
        es: 'Instalación de puente de latón y clavijeros de bloqueo en guitarra eléctrica',
        en: 'Installing precision brass bridge and locking tuners on electric guitar'
      }
    },
    {
      id: 'repairs',
      order: 6,
      price: QUOTE_PRICE,
      category: 'repairs',
      name: {
        es: 'Reparaciones mecánicas y estructurales',
        en: 'Mechanical and structural repairs'
      },
      shortDesc: {
        es: 'Reparación de fracturas de pala, encolados estructurales, fisuras y problemas mecánicos de hardware.',
        en: 'Headstock break repair, structural regluing, wood fissures and mechanical hardware restoration.'
      },
      problems: {
        es: [
          'Pala rota o fracturada por impacto (habitual en mástiles inclinados tipo Gibson).',
          'Puente de guitarra acústica despegado o levantado de la tapa armónica.',
          'Pernos de puente o anclajes flojos o con madera rajada.',
          'Grietas por sequedad o golpes en la caja o el mástil.'
        ],
        en: [
          'Headstock fracture or cracked neck from a fall or case impact.',
          'Acoustic guitar bridge lifting away from the spruce soundboard.',
          'Stripped bridge studs, strap screw holes or worn anchor points.',
          'Wood fissures or seam separations due to climate exposure or trauma.'
        ]
      },
      workIncluded: {
        es: [
          'Diagnóstico estructural y estabilización del instrumento.',
          'Encolado con adhesivos de luthería adecuados (Titebond tradicional o cola animal).',
          'Refuerzos internos o espigas de madera maciza cuando la rotura lo requiera.',
          'Retoque de barniz y sellado en la zona intervenida.',
          'Comprobación de resistencia bajo tensión completa de cuerdas.'
        ],
        en: [
          'Structural diagnosis and tension stabilization.',
          'Clamping and bonding with authentic lutherie glues (aliphatic resin / hide glue).',
          'Splines or reinforcement dowels when required for structural rigidity.',
          'Localized lacquer touch-up and seal around repair seams.',
          'Proof testing under full string tension and pitch calibration.'
        ]
      },
      image: '/images/service_repairs_structural_1793091764480.jpg',
      imageAlt: {
        es: 'Reparación estructural de mástil y cuerpo con sargentos de madera para luthería',
        en: 'Structural guitar neck and body repair using specialized luthier clamps'
      }
    },
    {
      id: 'onsite',
      order: 7,
      price: QUOTE_PRICE,
      category: 'onsite',
      name: {
        es: 'Servicio técnico a domicilio y local de ensayo',
        en: 'On-site technical service (Homes, Studios & Rehearsal Spaces)'
      },
      shortDesc: {
        es: 'Ajustes y puestas a punto in situ en Córdoba para grabaciones, ensayos o músicos con varios instrumentos.',
        en: 'On-site calibrations and troubleshooting in Córdoba for recording sessions, rehearsals or multi-instrument setups.'
      },
      problems: {
        es: [
          'Sesión de grabación inminente en estudio donde una guitarra desajustada arruina las tomas.',
          'Músicos o coleccionistas con varias guitarras que prefieren calibrarlas en su propio espacio.',
          'Urgencias técnicas previas a un concierto o ensayo general.',
          'Dificultad de desplazamiento del músico para transportar varios instrumentos.'
        ],
        en: [
          'Upcoming recording session where poor intonation or hum threatens track takes.',
          'Players or collectors with multiple instruments preferring adjustments at their location.',
          'Last-minute pre-gig emergencies or studio setup checks.',
          'Logistical difficulty transporting multiple delicate instruments across town.'
        ]
      },
      workIncluded: {
        es: [
          'Desplazamiento con banco de trabajo portátil y kit técnico completo a Córdoba capital y cercanías.',
          'Calibración y ajuste fino en el entorno real del músico (temperatura y amplificación propia).',
          'Ajustes de acción, quintado, cambio de cuerdas y solución de ruidos rápidos.',
          'Evaluación previa: los trabajos complejos (fresados, encolados estructurales o nivelados) se canalizan al taller.'
        ],
        en: [
          'Travel with mobile workstation and professional precision kit within Córdoba and immediate surrounds.',
          'Setup and fine calibration directly against the player’s own backline and amp rig.',
          'Action adjustments, intonation, restringing and quick noise troubleshooting.',
          'Prior feasibility assessment: heavy structural gluing or machine fretwork are strictly conducted in workshop.'
        ]
      },
      image: '/images/service_onsite_studio_tech_1793091766613.jpg',
      imageAlt: {
        es: 'Puesto de trabajo técnico portátil en estudio de grabación musical',
        en: 'Portable mobile guitar tech workstation case in recording studio'
      }
    }
  ],
  coverage: {
    title: {
      es: 'Área de servicio y modalidad de trabajo',
      en: 'Service area and working modalities'
    },
    workshopDescription: {
      es: 'El servicio principal se realiza en taller en Córdoba. El cliente entrega el instrumento en cita coordinada y lo recoge una vez finalizada y testeada la intervención. No se realizan envíos nacionales ni internacionales.',
      en: 'The core service is conducted at the workshop in Córdoba. Clients drop off their instruments by scheduled appointment and pick them up once work is complete and tested. We do not handle national or international shipping.'
    },
    onsiteDescription: {
      es: 'Para trabajos adecuados (calibraciones, revisiones previas a grabación o lotes de varios instrumentos), se ofrece servicio técnico desplazado en Córdoba capital y localidades limítrofes, previa evaluación de viabilidad del trabajo requerido.',
      en: 'For suitable tasks (calibrations, pre-recording bench checks or multiple instruments), on-site service is available in Córdoba city and nearby municipalities, following a preliminary feasibility check of the required work.'
    },
    areasList: {
      es: [
        'Córdoba capital (todos los distritos)',
        'Polígonos industriales y estudios de grabación de la zona',
        'Locales de ensayo de Córdoba y área metropolitana',
        'Municipios cercanos previa consulta (ej. Almodóvar, Posadas, Fernán Núñez, La Carlota)'
      ],
      en: [
        'Córdoba city (all districts and historical quarters)',
        'Local recording studios and industrial music facilities',
        'Córdoba rehearsal spaces and artist collectives',
        'Nearby towns upon prior inquiry (e.g., Almodóvar, Posadas, Fernán Núñez, La Carlota)'
      ]
    }
  },
  seo: {
    es: {
      title: 'Kuervo Guitar Tech | Calibración, Ajuste y Reparación de Guitarras',
      description: 'Técnico especialista en guitarras y bajos en Córdoba. Calibración milimétrica, electrónica, reparaciones y nivelado de trastes. Presupuestos personalizados por WhatsApp.',
      keywords: 'guitar tech cordoba, luthier cordoba, calibracion guitarra cordoba, ajuste guitarra cordoba, reparacion bajo cordoba, nivelado trastes cordoba'
    },
    en: {
      title: 'Kuervo Guitar Tech | Professional Guitar & Bass Technical Services',
      description: 'Specialist guitar and bass technician in Córdoba, Spain. Precision setups, electronics, structural repairs, and fret leveling. Personalized quotes via WhatsApp.',
      keywords: 'guitar tech cordoba spain, guitar repair cordoba, guitar setup cordoba, luthier cordoba andalusia, bass setup cordoba'
    }
  },
  lastUpdated: new Date().toISOString(),
  version: 1,
  servicesSeed: SERVICES_SEED_VERSION
};
