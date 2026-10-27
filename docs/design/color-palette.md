# Paleta de colores: El Kuervo Guitar Tech Córdoba

Los valores salen de un análisis de los píxeles de la imagen. Los he redondeado y ajustado a mano en los acentos dorados y azules, para que funcionen como tokens de UI.

## Concepto visual
- **Estilo:** dark mode premium, ambiente nocturno y artesanal, con un toque rock/metal elegante.
- **Combinación base:** negro azulado profundo, azul eléctrico (las alas), dorado cálido (títulos y detalles) y plata metálica (logo).
- **Contraste:** dorado y azul sobre fondo casi negro. Los textos son claros y los acentos brillantes.

## 1. Fondos y superficies
| Token | HEX | Uso |
|---|---|---|
| `--bg-base` | `#050A12` | Fondo principal de la página (negro azulado) |
| `--bg-deep` | `#040404` | Secciones más oscuras, footer |
| `--bg-navy` | `#051425` | Superficie alternativa, hero, bandas de sección |
| `--surface` | `#0B1A2C` | Tarjetas, paneles |
| `--surface-warm` | `#26180F` | Superficies cálidas (zona madera/taller) |
| `--border-subtle` | `#483323` | Bordes sutiles, separadores cálidos |

## 2. Azul (color de marca principal, las alas)
| Token | HEX | Uso |
|---|---|---|
| `--blue-900` | `#0E325C` | Fondos azules profundos, hover oscuro |
| `--blue-700` | `#1A5493` | Elementos secundarios, bordes activos |
| `--blue-500` | `#1C79CF` | **Azul de marca: botones, enlaces, acentos** |
| `--blue-300` | `#6797BE` | Estados hover, iconos secundarios |
| `--blue-glow` | `#3FA2FF` | Brillos, glow, efectos de luz (usar con moderación) |

## 3. Dorado (acento premium, "CÓRDOBA", iconos, líneas)
| Token | HEX | Uso |
|---|---|---|
| `--gold-700` | `#865426` | Dorado oscuro, sombras, bordes |
| `--gold-500` | `#D3934B` | **Dorado principal: CTA, iconos, detalles** |
| `--gold-300` | `#F0C27A` | Highlights, títulos destacados |
| `--gold-line` | `#C9A15A` | Líneas finas, ornamentos, círculos de iconos |

## 4. Plata y neutros (logo metálico, textos)
| Token | HEX | Uso |
|---|---|---|
| `--silver-100` | `#DFCDB9` | Texto principal sobre fondo oscuro, títulos |
| `--silver-300` | `#B09F91` | Texto secundario |
| `--silver-500` | `#887668` | Texto terciario, placeholders |
| `--steel` | `#5B5451` | Elementos desactivados, bordes neutros |
| `--white-soft` | `#F2EDE6` | Texto de máxima legibilidad (titulares) |

## 5. Tokens semánticos
```css
:root {
  /* Fondos */
  --bg-base: #050A12;
  --bg-deep: #040404;
  --bg-navy: #051425;
  --surface: #0B1A2C;
  --surface-warm: #26180F;
  --border-subtle: #483323;

  /* Marca */
  --primary: #1C79CF;        /* azul */
  --primary-hover: #3FA2FF;
  --primary-dark: #0E325C;
  --accent: #D3934B;         /* dorado */
  --accent-hover: #F0C27A;
  --accent-dark: #865426;

  /* Texto */
  --text-heading: #F2EDE6;
  --text-body: #DFCDB9;
  --text-muted: #B09F91;
  --text-subtle: #887668;

  /* Efectos */
  --glow-blue: 0 0 24px rgba(63,162,255,.35);
  --glow-gold: 0 0 18px rgba(211,147,75,.30);
  --gradient-gold: linear-gradient(180deg, #F0C27A 0%, #D3934B 50%, #865426 100%);
  --gradient-wing: linear-gradient(135deg, #0E325C 0%, #1C79CF 60%, #6797BE 100%);
  --gradient-hero: radial-gradient(ellipse at top, #0E325C 0%, #051425 45%, #040404 100%);
}
```

## 6. Reglas de uso recomendadas
- **Proporción:** 70% fondos oscuros, 15% azul, 10% dorado, 5% plata y neutros.
- **CTA principal:** fondo dorado (`--gradient-gold`) con texto oscuro (`#050A12`). Hover con `--glow-gold`.
- **CTA secundario:** borde azul `--primary` con texto claro. Hover con relleno azul.
- **Títulos grandes:** dorado o plata (`--text-heading`). Para "efecto metal", usar un degradado plateado.
- **Iconos:** trazo fino dorado (`--gold-line`) dentro de círculos con borde del mismo color, como en la imagen.
- **Separadores:** líneas finas doradas, con rombos u ornamentos pequeños.
- **Glow azul:** solo en hero y elementos destacados. No usarlo en todo el sitio.
- **Contraste:** `--text-body` y `--text-heading` sobre `--bg-base` superan AA. El dorado `--accent` sobre fondo oscuro también supera AA para texto grande y botones.
- **Evitar:** fondos claros, blancos puros grandes y colores saturados fuera de esta paleta (verdes, rojos).

## 7. Tipografía sugerida
- **Display (títulos):** serif gótica o display con carácter metálico, tipo *Cinzel*, *Cormorant SC* o *Trajan-like*.
- **Texto:** sans limpia, tipo *Inter* o *Montserrat*.
- **Acento manuscrito:** script fino, como el "Guitars in good hands", p. ej. *Allura* o *Great Vibes*, en dorado y con poco uso.
