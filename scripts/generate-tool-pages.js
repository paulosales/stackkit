import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { tools } from '../src/data/toolsData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const templatePath = path.resolve(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('Error: dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf-8');

console.log(`Generating dedicated static landing pages for ${tools.length} tools...`);

// Helper to escape HTML attributes
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

let generatedCount = 0;

for (const tool of tools) {
  const toolUrl = `https://stackkit.com.br/${tool.id}`;
  const title = tool.nameEn && tool.nameEn.toLowerCase() !== tool.name.toLowerCase()
    ? `${tool.name} (${tool.nameEn}) — StackKit DevStudio`
    : `${tool.name} — StackKit DevStudio`;

  const metaDesc = `${tool.description}. ${tool.descriptionEn && tool.descriptionEn !== tool.description ? tool.descriptionEn + '. ' : ''}Ferramenta gratuita, segura e client-side.`
    .replace(/\s+/g, ' ')
    .trim();

  const keywords = [...(tool.tags || []), tool.id, 'developer tools', 'stackkit'].join(', ');

  const toolJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': `${tool.name} — StackKit DevStudio`,
    'url': toolUrl,
    'applicationCategory': 'DeveloperApplication',
    'operatingSystem': 'All',
    'description': metaDesc,
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    }
  };

  let pageHtml = template;

  // 1. Replace <title>
  pageHtml = pageHtml.replace(
    /<title>.*?<\/title>/s,
    `<title>${escapeHtml(title)}</title>`
  );

  // 2. Replace primary description
  pageHtml = pageHtml.replace(
    /<meta name="description"\s+content=".*?"\s*\/?>/s,
    `<meta name="description" content="${escapeHtml(metaDesc)}" />`
  );

  // 3. Replace keywords
  pageHtml = pageHtml.replace(
    /<meta name="keywords"\s+content=".*?"\s*\/?>/s,
    `<meta name="keywords" content="${escapeHtml(keywords)}" />`
  );

  // 4. Replace canonical
  pageHtml = pageHtml.replace(
    /<link rel="canonical"\s+href=".*?"\s*\/?>/s,
    `<link rel="canonical" href="${toolUrl}" />`
  );

  // 5. Replace Open Graph tags
  pageHtml = pageHtml.replace(
    /<meta property="og:url"\s+content=".*?"\s*\/?>/s,
    `<meta property="og:url" content="${toolUrl}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta property="og:title"\s+content=".*?"\s*\/?>/s,
    `<meta property="og:title" content="${escapeHtml(title)}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta property="og:description"\s+content=".*?"\s*\/?>/s,
    `<meta property="og:description" content="${escapeHtml(metaDesc)}" />`
  );

  // Ensure og:image exists
  if (!pageHtml.includes('property="og:image"')) {
    pageHtml = pageHtml.replace(
      /<meta property="og:site_name"/,
      `<meta property="og:image" content="https://stackkit.com.br/og-banner.jpg" />\n  <meta property="og:image:width" content="1200" />\n  <meta property="og:image:height" content="675" />\n  <meta property="og:site_name"`
    );
  }

  // 6. Replace Twitter tags
  pageHtml = pageHtml.replace(
    /<meta name="twitter:title"\s+content=".*?"\s*\/?>/s,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta name="twitter:description"\s+content=".*?"\s*\/?>/s,
    `<meta name="twitter:description" content="${escapeHtml(metaDesc)}" />`
  );
  if (!pageHtml.includes('name="twitter:image"')) {
    pageHtml = pageHtml.replace(
      /<\/head>/,
      `  <meta name="twitter:image" content="https://stackkit.com.br/og-banner.jpg" />\n</head>`
    );
  }

  // 7. Replace JSON-LD block
  pageHtml = pageHtml.replace(
    /<script type="application\/ld\+json">.*?<\/script>/s,
    `<script type="application/ld+json">\n${JSON.stringify(toolJsonLd, null, 2)}\n  </script>`
  );

  // 8. Inject initial tool ID preloader script
  const scriptTag = `  <script>window.__INITIAL_TOOL_ID__ = ${JSON.stringify(tool.id)};</script>\n</head>`;
  pageHtml = pageHtml.replace('</head>', scriptTag);

  // Write tool page
  const toolDir = path.resolve(distDir, tool.id);
  if (!fs.existsSync(toolDir)) {
    fs.mkdirSync(toolDir, { recursive: true });
  }
  fs.writeFileSync(path.resolve(toolDir, 'index.html'), pageHtml, 'utf-8');
  generatedCount++;

  // Write aliases
  if (tool.aliasIds && tool.aliasIds.length > 0) {
    for (const alias of tool.aliasIds) {
      const aliasDir = path.resolve(distDir, alias);
      if (!fs.existsSync(aliasDir)) {
        fs.mkdirSync(aliasDir, { recursive: true });
      }
      fs.writeFileSync(path.resolve(aliasDir, 'index.html'), pageHtml, 'utf-8');
      generatedCount++;
    }
  }
}

// Update sitemap.xml with clean /tool-id paths
const today = new Date().toISOString().split('T')[0];
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://stackkit.com.br/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${tools.map(tool => `  <url>
    <loc>https://stackkit.com.br/${tool.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${tool.popular ? '0.9' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.resolve(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
fs.writeFileSync(path.resolve(rootDir, 'public/sitemap.xml'), sitemapXml, 'utf-8');

console.log(`Successfully generated ${generatedCount} static pages and updated sitemap.xml!`);
