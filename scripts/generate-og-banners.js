import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resvg } from '@resvg/resvg-js';
import { tools } from '../src/data/toolsData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicOgDir = path.resolve(rootDir, 'public/og');
const distOgDir = path.resolve(rootDir, 'dist/og');

// Ensure output directories exist including language subdirectories
for (const dir of [
  publicOgDir,
  distOgDir,
  path.resolve(publicOgDir, 'en'),
  path.resolve(publicOgDir, 'pt'),
  path.resolve(distOgDir, 'en'),
  path.resolve(distOgDir, 'pt')
]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const categoryThemes = {
  brazil: { labelEn: 'BRAZIL', labelPt: 'BRASIL', accent: '#10b981', secondary: '#06b6d4', glow: '#10b981' },
  generators: { labelEn: 'GENERATORS', labelPt: 'GERADORES', accent: '#a855f7', secondary: '#ec4899', glow: '#a855f7' },
  formatters: { labelEn: 'FORMATTERS', labelPt: 'FORMATADORES', accent: '#3b82f6', secondary: '#06b6d4', glow: '#3b82f6' },
  converters: { labelEn: 'CONVERTERS', labelPt: 'CONVERSORES', accent: '#f59e0b', secondary: '#ef4444', glow: '#f59e0b' },
  encoders: { labelEn: 'ENCODE / DECODE', labelPt: 'ENCODE / DECODE', accent: '#06b6d4', secondary: '#3b82f6', glow: '#06b6d4' },
  network: { labelEn: 'NETWORK & TIME', labelPt: 'REDE & TEMPO', accent: '#0ea5e9', secondary: '#8b5cf6', glow: '#0ea5e9' },
  utilities: { labelEn: 'UTILITIES', labelPt: 'UTILIDADES', accent: '#ec4899', secondary: '#f43f5e', glow: '#ec4899' },
  default: { labelEn: 'DEVSTUDIO', labelPt: 'DEVSTUDIO', accent: '#38bdf8', secondary: '#818cf8', glow: '#38bdf8' }
};

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(text, maxCharsPerLine = 68, maxLines = 2) {
  const words = String(text || '').split(/\s+/);
  const lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;

    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (lines.length < maxLines - 1) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        if (currentLine.length + 3 <= maxCharsPerLine) {
          currentLine = `${currentLine}…`;
        }
        break;
      }
    }
  }
  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }
  return lines;
}

const tagTranslations = {
  'brasil': 'brazil',
  'gerador': 'generator',
  'validacao': 'validation',
  'documentos': 'documents',
  'empresa': 'company',
  'identidade': 'id',
  'cidadania': 'citizenship',
  'simulado': 'practice-test',
  'pagamento': 'payment',
  'cores': 'colors',
  'paleta': 'palette',
  'formatador': 'formatter',
  'conversor': 'converter',
  'codificador': 'encoder',
  'leitura': 'reading',
  'palavras': 'words',
  'caracteres': 'characters',
  'rede': 'network',
  'tempo': 'time',
  'fuso': 'time-zone',
  'fuso horario': 'time-zone',
  'fuso-horario': 'time-zone',
  'assinatura': 'signature',
  'cartao': 'credit-card',
  'credito': 'credit',
  'aleatorio': 'random',
  'pessoa': 'person',
  'dados': 'data',
  'seguranca': 'security',
  'senha': 'password',
  'diferenca': 'difference',
  'comparar': 'diff',
  'texto': 'text',
  'estatisticas': 'stats',
  'hora-extra': 'overtime',
  'trabalhista': 'labor-law',
  'lote': 'bulk',
  'processo': 'court-case',
  'juridico': 'legal',
  'beneficio': 'benefit',
  'previdencia': 'pension',
  'curriculo': 'resume',
  'carreira': 'career'
};

function translateTag(tag) {
  const lower = String(tag).toLowerCase().trim();
  return tagTranslations[lower] || lower;
}

export function generateBannerSvg({
  id,
  title,
  subtitle = '',
  description,
  categoryId = 'default',
  tags = [],
  urlPath = '',
  lang = 'en'
}) {
  const theme = categoryThemes[categoryId] || categoryThemes.default;
  const isPt = lang === 'pt';
  const url = urlPath ? `stackkit.com.br/${lang}/${urlPath}` : `stackkit.com.br/${lang}`;

  // Dynamic font sizing for title to prevent overflow
  const cleanTitle = title.trim();
  let titleFontSize = 52;
  if (cleanTitle.length > 34) {
    titleFontSize = 38;
  } else if (cleanTitle.length > 25) {
    titleFontSize = 44;
  }

  // Description lines (wrap to 2 lines max)
  const descLines = wrapText(description, 68, 2);

  // Process tags
  const processedTags = isPt ? tags : tags.map(translateTag);
  const displayTags = [...new Set(processedTags)].slice(0, 3);
  const privacyTag = isPt ? 'Zero Armazenamento' : 'Zero Server Storage';
  if (!displayTags.includes(privacyTag) && displayTags.length < 4) {
    displayTags.push(privacyTag);
  }

  let tagPillsSvg = '';
  let currentX = 0;
  const tagFontSize = 14;
  const charWidth = 8.5;

  for (const tag of displayTags) {
    const textStr = String(tag).trim();
    const pillWidth = Math.round(textStr.length * charWidth + 28);
    tagPillsSvg += `
      <g transform="translate(${currentX}, 0)">
        <rect width="${pillWidth}" height="36" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.2"/>
        <text x="${Math.round(pillWidth / 2)}" y="23" fill="#cbd5e1" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${tagFontSize}" font-weight="600" text-anchor="middle">${escapeXml(textStr)}</text>
      </g>`;
    currentX += pillWidth + 12;
  }

  // Category badge width
  const catLabel = isPt ? (theme.labelPt || theme.labelEn) : theme.labelEn;
  const catBadgeWidth = Math.max(90, Math.round(catLabel.length * 8.5 + 32));

  const clientSideIndicator = isPt ? '● 100% NO NAVEGADOR' : '● 100% CLIENT-SIDE';
  const footerSecText = isPt ? '🔒 100% no Navegador · Gratuito e Seguro' : '🔒 100% Client-Side · Free &amp; Secure';

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Slate Gradient -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070b14"/>
      <stop offset="50%" stop-color="#0b1120"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>

    <!-- Accent Header Gradient -->
    <linearGradient id="accent-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${theme.accent}"/>
      <stop offset="100%" stop-color="${theme.secondary}"/>
    </linearGradient>

    <!-- Subtle Radial Glows -->
    <radialGradient id="glow-left" cx="10%" cy="10%" r="65%">
      <stop offset="0%" stop-color="${theme.glow}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${theme.glow}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow-right" cx="90%" cy="90%" r="60%">
      <stop offset="0%" stop-color="${theme.secondary}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${theme.secondary}" stop-opacity="0"/>
    </radialGradient>

    <!-- Tech Grid Pattern -->
    <pattern id="tech-grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" stroke-width="0.75" stroke-opacity="0.15"/>
    </pattern>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#tech-grid)"/>
  <rect width="1200" height="630" fill="url(#glow-left)"/>
  <rect width="1200" height="630" fill="url(#glow-right)"/>

  <!-- Card Border -->
  <rect x="24" y="24" width="1152" height="582" rx="20" fill="none" stroke="#334155" stroke-width="1.5" stroke-opacity="0.55"/>

  <!-- TOP BRANDING BAR -->
  <g transform="translate(72, 68)">
    <!-- Terminal Logo Icon -->
    <rect width="44" height="44" rx="12" fill="url(#accent-grad)"/>
    <path d="M14 16 L22 22 L14 28 M24 28 L30 28" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

    <!-- Brand Typography -->
    <text x="58" y="29" fill="#f8fafc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="900" letter-spacing="0.06em">STACKKIT</text>
    <text x="176" y="29" fill="${theme.accent}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="900" letter-spacing="0.06em">DEVSTUDIO</text>

    <!-- Category Pill Badge -->
    <g transform="translate(340, 7)">
      <rect width="${catBadgeWidth}" height="30" rx="15" fill="${theme.accent}" fill-opacity="0.14" stroke="${theme.accent}" stroke-opacity="0.45" stroke-width="1.2"/>
      <text x="${Math.round(catBadgeWidth / 2)}" y="20" fill="${theme.accent}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" text-anchor="middle" letter-spacing="0.08em">${escapeXml(catLabel)}</text>
    </g>

    <!-- Privacy Shield Indicator (Right Aligned) -->
    <g transform="translate(1056, 12)">
      <text x="0" y="16" fill="#10b981" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" text-anchor="end" letter-spacing="0.05em">${clientSideIndicator}</text>
    </g>
  </g>

  <!-- MAIN CENTER HERO -->
  <g transform="translate(72, 195)">
    <!-- Main Tool Title -->
    <text x="0" y="44" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${titleFontSize}" font-weight="900" letter-spacing="-0.02em">${escapeXml(cleanTitle)}</text>

    <!-- Tool Description Lines -->
    <text x="0" y="112" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="23" font-weight="400">${escapeXml(descLines[0] || '')}</text>
    ${descLines[1] ? `<text x="0" y="152" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="23" font-weight="400">${escapeXml(descLines[1])}</text>` : ''}
  </g>

  <!-- FEATURE TAGS -->
  <g transform="translate(72, 405)">
    ${tagPillsSvg}
  </g>

  <!-- FOOTER -->
  <g transform="translate(72, 515)">
    <line x1="0" y1="0" x2="1056" y2="0" stroke="#334155" stroke-width="1.2" stroke-opacity="0.75"/>
    <text x="0" y="40" fill="${theme.accent}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700" letter-spacing="0.02em">${escapeXml(url)}</text>
    <text x="1056" y="40" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600" text-anchor="end">${footerSecText}</text>
  </g>
</svg>`;
}

function renderAndSaveBanner(config, lang, slug, aliases = []) {
  const svg = generateBannerSvg({ ...config, lang });
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 }
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  const langPublicDir = path.resolve(publicOgDir, lang);
  const langDistDir = path.resolve(distOgDir, lang);

  for (const dir of [langPublicDir, langDistDir]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  // 1. Save language-prefixed banner in public/og/${lang}/${slug}.png
  const publicPngPath = path.resolve(langPublicDir, `${slug}.png`);
  fs.writeFileSync(publicPngPath, pngBuffer);

  // Copy to dist/og/${lang} if dist exists
  if (fs.existsSync(distOgDir)) {
    fs.writeFileSync(path.resolve(langDistDir, `${slug}.png`), pngBuffer);
  }

  // Handle aliases in language subfolder
  for (const alias of aliases) {
    fs.writeFileSync(path.resolve(langPublicDir, `${alias}.png`), pngBuffer);
    if (fs.existsSync(distOgDir)) {
      fs.writeFileSync(path.resolve(langDistDir, `${alias}.png`), pngBuffer);
    }
  }

  // 2. Also maintain root public/og/${slug}.png fallback for root backwards-compatibility
  const isDefaultFallback = (lang === 'pt' && config.categoryId === 'brazil') || (lang === 'en' && config.categoryId !== 'brazil');
  if (isDefaultFallback) {
    fs.writeFileSync(path.resolve(publicOgDir, `${slug}.png`), pngBuffer);
    if (fs.existsSync(distOgDir)) {
      fs.writeFileSync(path.resolve(distOgDir, `${slug}.png`), pngBuffer);
    }
    for (const alias of aliases) {
      fs.writeFileSync(path.resolve(publicOgDir, `${alias}.png`), pngBuffer);
      if (fs.existsSync(distOgDir)) {
        fs.writeFileSync(path.resolve(distOgDir, `${alias}.png`), pngBuffer);
      }
    }
  }
}

const languages = ['en', 'pt'];

console.log(`Generating Multilingual Open Graph banners (1200x630 PNG) for EN and PT...`);
let totalGenerated = 0;

for (const lang of languages) {
  console.log(`\nGenerating [${lang.toUpperCase()}] banners for all ${tools.length} tools...`);
  for (const tool of tools) {
    const isPt = lang === 'pt';
    const title = isPt ? tool.name : (tool.nameEn || tool.name);
    const description = isPt ? tool.description : (tool.descriptionEn || tool.description);

    renderAndSaveBanner({
      id: tool.id,
      title,
      description,
      categoryId: tool.categoryId,
      tags: tool.tags,
      urlPath: tool.id
    }, lang, tool.id, tool.aliasIds || []);

    totalGenerated++;
    process.stdout.write(`\rGenerated: [${lang.toUpperCase()}] ${tool.id}.png`);
  }
}
console.log('\nAll tool banners generated for EN and PT!');

// Generate compliance and homepage banners for each language
const compliancePages = {
  en: [
    {
      slug: 'privacy-policy',
      aliases: ['privacidade'],
      title: 'Privacy Policy',
      subtitle: 'LGPD & GDPR Compliant',
      description: '100% client-side architecture, zero server storage, and strict data privacy protection for developers.',
      categoryId: 'default',
      tags: ['privacy', 'lgpd', 'gdpr', 'client-side'],
      urlPath: 'privacy-policy'
    },
    {
      slug: 'terms-of-service',
      aliases: ['termos', 'termos-de-uso'],
      title: 'Terms of Service',
      subtitle: 'Developer Guidelines & Usage Terms',
      description: 'Guidelines and terms of use for developers, QA engineers, and software validation sandbox environments.',
      categoryId: 'default',
      tags: ['terms', 'sandbox', 'testing', 'license'],
      urlPath: 'terms-of-service'
    },
    {
      slug: 'about',
      aliases: ['sobre'],
      title: 'About StackKit DevStudio',
      subtitle: 'Open Standards & Client-Side Engineering',
      description: 'All-in-one developer workstation featuring 40+ free, private, high-performance client-side utilities.',
      categoryId: 'default',
      tags: ['devstudio', 'open-standards', 'performance', 'client-side'],
      urlPath: 'about'
    },
    {
      slug: 'default',
      aliases: ['home'],
      title: 'StackKit DevStudio',
      subtitle: '40+ Free Developer Tools, World Clock & Color Palette',
      description: 'All-in-one developer workstation with free client-side utilities: World Time Buddy, Coolors palette generator, QR Code, formatters, and encoders.',
      categoryId: 'default',
      tags: ['developer-tools', 'world-clock', 'coolors', 'jwt', 'json'],
      urlPath: ''
    }
  ],
  pt: [
    {
      slug: 'privacy-policy',
      aliases: ['privacidade'],
      title: 'Política de Privacidade',
      subtitle: 'Conforme LGPD & GDPR',
      description: 'Arquitetura 100% no navegador, zero armazenamento em servidores e proteção estrita de privacidade.',
      categoryId: 'default',
      tags: ['privacidade', 'lgpd', 'gdpr', 'client-side'],
      urlPath: 'privacy-policy'
    },
    {
      slug: 'terms-of-service',
      aliases: ['termos', 'termos-de-uso'],
      title: 'Termos de Uso e Serviço',
      subtitle: 'Diretrizes para Desenvolvedores & QA',
      description: 'Termos de uso para desenvolvedores e analistas de QA em ambientes de homologação de software.',
      categoryId: 'default',
      tags: ['termos', 'sandbox', 'testes', 'licenca'],
      urlPath: 'terms-of-service'
    },
    {
      slug: 'about',
      aliases: ['sobre'],
      title: 'Sobre o StackKit DevStudio',
      subtitle: 'Padrões Abertos & Alta Performance',
      description: 'Estúdio all-in-one com mais de 40 ferramentas client-side gratuitas, seguras e de alta performance.',
      categoryId: 'default',
      tags: ['devstudio', 'padroes-abertos', 'performance', 'client-side'],
      urlPath: 'about'
    },
    {
      slug: 'default',
      aliases: ['home'],
      title: 'StackKit DevStudio',
      subtitle: 'Mais de 40 Ferramentas Gratuitas para Desenvolvedores',
      description: 'Estúdio all-in-one para desenvolvedores com utilitários gratuitos: World Time Buddy, paleta Coolors, QR Code, formatadores e codificadores.',
      categoryId: 'default',
      tags: ['ferramentas-dev', 'world-clock', 'coolors', 'jwt', 'json'],
      urlPath: ''
    }
  ]
};

console.log('Generating compliance and homepage Open Graph banners in EN and PT...');
for (const lang of languages) {
  for (const page of compliancePages[lang]) {
    renderAndSaveBanner(page, lang, page.slug, page.aliases);
    console.log(`Generated [${lang.toUpperCase()}] banner for ${page.slug} (+ aliases: ${page.aliases.join(', ')})`);
  }
}

// Ensure default root og-banner fallback
const defaultEnPng = path.resolve(publicOgDir, 'en/default.png');
const rootDefaultPng = path.resolve(publicOgDir, 'default.png');
if (fs.existsSync(defaultEnPng)) {
  fs.copyFileSync(defaultEnPng, rootDefaultPng);
  fs.copyFileSync(defaultEnPng, path.resolve(rootDir, 'public/og-banner.png'));
  if (fs.existsSync(path.resolve(rootDir, 'dist'))) {
    fs.copyFileSync(defaultEnPng, path.resolve(rootDir, 'dist/og-banner.png'));
    fs.copyFileSync(defaultEnPng, path.resolve(rootDir, 'dist/og/default.png'));
  }
}

// Clean up test script if present
const testScript = path.resolve(__dirname, 'test-banner.js');
if (fs.existsSync(testScript)) {
  fs.unlinkSync(testScript);
}

console.log('All Multilingual Open Graph banners generated successfully in public/og/ and dist/og/!');
