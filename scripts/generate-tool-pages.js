import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { tools } from '../src/data/toolsData.js';
import { getToolEditorialContent } from '../src/data/toolsContentData.js';

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

console.log(`Generating Multilingual static landing pages for ${tools.length} tools and compliance pages (EN & PT)...`);

// Helper to escape HTML attributes and text content
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const languages = ['en', 'pt'];
let generatedCount = 0;

// Helper to inject meta tags and alternates into template
function buildHtmlForPage({
  lang,
  url,
  canonicalUrl,
  alternateEnUrl,
  alternatePtUrl,
  title,
  description,
  keywords,
  ogImageUrl,
  ogLocale,
  initialToolId = null,
  jsonLdBlocks = [],
  prerenderedBodyHtml = ''
}) {
  let html = template;

  // 1. Update <html lang="...">
  html = html.replace(/<html\s+lang="[^"]*"/, `<html lang="${lang}"`);

  // 2. Replace <title>
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`);

  // 3. Replace primary meta description
  html = html.replace(
    /<meta name="description"\s+content=".*?"\s*\/?>/s,
    `<meta name="description" content="${escapeHtml(description)}" />`
  );

  // 4. Replace keywords
  if (keywords) {
    html = html.replace(
      /<meta name="keywords"\s+content=".*?"\s*\/?>/s,
      `<meta name="keywords" content="${escapeHtml(keywords)}" />`
    );
  }

  // 5. Replace canonical and inject hreflang alternates
  const alternateTags = `
  <link rel="canonical" href="${canonicalUrl}" />
  <link rel="alternate" hreflang="en" href="${alternateEnUrl}" />
  <link rel="alternate" hreflang="pt" href="${alternatePtUrl}" />
  <link rel="alternate" hreflang="x-default" href="${alternateEnUrl}" />`;

  html = html.replace(/<link rel="canonical"\s+href=".*?"\s*\/?>/s, alternateTags.trim());

  // 6. Replace Open Graph tags
  html = html.replace(
    /<meta property="og:url"\s+content=".*?"\s*\/?>/s,
    `<meta property="og:url" content="${url}" />`
  );
  html = html.replace(
    /<meta property="og:title"\s+content=".*?"\s*\/?>/s,
    `<meta property="og:title" content="${escapeHtml(title)}" />`
  );
  html = html.replace(
    /<meta property="og:description"\s+content=".*?"\s*\/?>/s,
    `<meta property="og:description" content="${escapeHtml(description)}" />`
  );
  html = html.replace(
    /<meta property="og:locale"\s+content=".*?"\s*\/?>/s,
    `<meta property="og:locale" content="${ogLocale}" />`
  );

  if (html.includes('property="og:image"')) {
    html = html.replace(
      /<meta property="og:image"\s+content=".*?"\s*\/?>/s,
      `<meta property="og:image" content="${ogImageUrl}" />`
    );
  } else {
    html = html.replace(
      /<meta property="og:site_name"/,
      `<meta property="og:image" content="${ogImageUrl}" />\n  <meta property="og:image:width" content="1200" />\n  <meta property="og:image:height" content="630" />\n  <meta property="og:site_name"`
    );
  }
  html = html.replace(
    /<meta property="og:image:height"\s+content=".*?"\s*\/?>/s,
    `<meta property="og:image:height" content="630" />`
  );

  // 7. Replace Twitter tags
  html = html.replace(
    /<meta name="twitter:title"\s+content=".*?"\s*\/?>/s,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`
  );
  html = html.replace(
    /<meta name="twitter:description"\s+content=".*?"\s*\/?>/s,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`
  );
  if (html.includes('name="twitter:image"')) {
    html = html.replace(
      /<meta name="twitter:image"\s+content=".*?"\s*\/?>/s,
      `<meta name="twitter:image" content="${ogImageUrl}" />`
    );
  } else {
    html = html.replace(
      /<\/head>/,
      `  <meta name="twitter:image" content="${ogImageUrl}" />\n</head>`
    );
  }

  // 8. Inject JSON-LD
  if (jsonLdBlocks.length > 0) {
    html = html.replace(
      /<script type="application\/ld\+json">.*?<\/script>/s,
      jsonLdBlocks.join('\n  ')
    );
  }

  // 9. Inject language and initial tool ID preloader script
  const scriptContent = initialToolId
    ? `window.__INITIAL_TOOL_ID__ = ${JSON.stringify(initialToolId)}; window.__INITIAL_LANG__ = ${JSON.stringify(lang)};`
    : `window.__INITIAL_LANG__ = ${JSON.stringify(lang)};`;

  const scriptTag = `  <script>${scriptContent}</script>\n</head>`;
  html = html.replace('</head>', scriptTag);

  // 10. Replace root body with pre-rendered content
  if (prerenderedBodyHtml) {
    html = html.replace('<div id="root"></div>', prerenderedBodyHtml);
  }

  return html;
}

// 1. Generate pages for all tools across both languages
for (const tool of tools) {
  for (const lang of languages) {
    const isPt = lang === 'pt';
    const toolUrl = `https://stackkit.com.br/${lang}/${tool.id}`;
    const canonicalUrl = toolUrl;
    const alternateEnUrl = `https://stackkit.com.br/en/${tool.id}`;
    const alternatePtUrl = `https://stackkit.com.br/pt/${tool.id}`;

    const title = isPt
      ? `${tool.name} — StackKit DevStudio`
      : `${tool.nameEn || tool.name} — StackKit DevStudio`;

    const metaDesc = isPt
      ? `${tool.description}. Ferramenta online gratuita, segura e 100% client-side.`
      : `${tool.descriptionEn || tool.description}. Free, secure, client-side online developer tool.`;

    const keywords = [...(tool.tags || []), tool.id, 'developer tools', 'stackkit', 'client-side tools'].join(', ');
    const ogImageUrl = `https://stackkit.com.br/og/${lang}/${tool.id}.png`;
    const ogLocale = isPt ? 'pt_BR' : 'en_US';

    const editorial = getToolEditorialContent(tool, lang);

    const toolJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': title,
      'url': toolUrl,
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'All',
      'description': metaDesc,
      'inLanguage': isPt ? 'pt-BR' : 'en-US',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    };

    const faqJsonLd = editorial && editorial.faqs && editorial.faqs.length > 0 ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': editorial.faqs.map(f => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': f.a
        }
      }))
    } : null;

    const jsonLdBlocks = [
      `<script type="application/ld+json">\n${JSON.stringify(toolJsonLd, null, 2)}\n  </script>`
    ];
    if (faqJsonLd) {
      jsonLdBlocks.push(`<script type="application/ld+json">\n${JSON.stringify(faqJsonLd, null, 2)}\n  </script>`);
    }

    const headingTitle = isPt ? tool.name : (tool.nameEn || tool.name);
    const subDesc = isPt ? tool.description : (tool.descriptionEn || tool.description);
    const howToTitle = isPt ? 'Como Utilizar: Passo a Passo' : 'How to Use: Step-by-Step';
    const privacyTitle = isPt ? 'Privacidade e Execução Segura no Navegador' : 'Privacy & Secure Browser Execution';
    const privacyBody = isPt
      ? 'O StackKit DevStudio executa todas as rotinas, cálculos de dígitos verificadores e formatações 100% no seu navegador (client-side). Seus dados e parâmetros nunca são enviados a servidores remotos.'
      : 'StackKit DevStudio executes all algorithms, checksum calculations, and transformations 100% inside your local browser JavaScript engine. Your data and inputs are never transmitted to remote servers.';
    const faqHeading = isPt ? 'Perguntas Frequentes (FAQ)' : 'Frequently Asked Questions (FAQ)';
    const footerText = isPt ? '© 2026 StackKit DevStudio · Ferramentas Gratuitas para Desenvolvedores' : '© 2026 StackKit DevStudio · Free Client-Side Developer Tools';
    const privacyLinkText = isPt ? 'Política de Privacidade' : 'Privacy Policy';
    const termsLinkText = isPt ? 'Termos de Uso' : 'Terms of Service';
    const aboutLinkText = isPt ? 'Sobre Nós' : 'About Us';

    const prerenderedBody = `
  <div id="root">
    <div style="max-width: 960px; margin: 40px auto; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e2e8f0; background: #0f172a; border-radius: 12px; line-height: 1.6;">
      <header style="margin-bottom: 24px; border-bottom: 1px solid #334155; padding-bottom: 16px;">
        <h1 style="font-size: 26px; font-weight: 800; color: #38bdf8; margin: 0 0 8px 0;">${escapeHtml(headingTitle)}</h1>
        <p style="font-size: 15px; color: #94a3b8; margin: 0;">${escapeHtml(subDesc)}</p>
      </header>

      <article id="publisher-content">
        <h2 style="font-size: 20px; font-weight: 700; color: #f1f5f9; margin-top: 24px;">${escapeHtml(editorial.title)}</h2>
        <p style="font-size: 14.5px; color: #cbd5e1; line-height: 1.7;">${escapeHtml(editorial.overview)}</p>

        <h3 style="font-size: 17px; font-weight: 700; color: #38bdf8; margin-top: 24px;">${escapeHtml(howToTitle)}</h3>
        <ol style="padding-left: 20px; color: #cbd5e1;">
          ${editorial.howTo.map(step => `<li style="margin-bottom: 8px;">${escapeHtml(step)}</li>`).join('\n          ')}
        </ol>

        <h3 style="font-size: 17px; font-weight: 700; color: #34d399; margin-top: 24px;">${escapeHtml(privacyTitle)}</h3>
        <p style="font-size: 14px; color: #cbd5e1;">${escapeHtml(privacyBody)}</p>

        <h3 style="font-size: 17px; font-weight: 700; color: #fbbf24; margin-top: 24px;">${escapeHtml(faqHeading)}</h3>
        <div style="margin-top: 12px;">
          ${editorial.faqs.map(faq => `
          <div style="margin-bottom: 14px; border: 1px solid #334155; border-radius: 8px; padding: 12px 16px; background: #1e293b;">
            <h4 style="font-size: 15px; font-weight: 600; color: #f8fafc; margin: 0 0 6px 0;">${escapeHtml(faq.q)}</h4>
            <p style="font-size: 13.5px; color: #cbd5e1; margin: 0;">${escapeHtml(faq.a)}</p>
          </div>`).join('\n          ')}
        </div>
      </article>

      <footer style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #334155; font-size: 12px; color: #64748b; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>${escapeHtml(footerText)}</div>
        <div>
          <a href="https://stackkit.com.br/${lang}/privacy-policy" style="color: #38bdf8; text-decoration: none;">${escapeHtml(privacyLinkText)}</a> ·
          <a href="https://stackkit.com.br/${lang}/terms-of-service" style="color: #38bdf8; text-decoration: none;">${escapeHtml(termsLinkText)}</a> ·
          <a href="https://stackkit.com.br/${lang}/about" style="color: #38bdf8; text-decoration: none;">${escapeHtml(aboutLinkText)}</a>
        </div>
      </footer>
    </div>
  </div>`;

    const pageHtml = buildHtmlForPage({
      lang,
      url: toolUrl,
      canonicalUrl,
      alternateEnUrl,
      alternatePtUrl,
      title,
      description: metaDesc,
      keywords,
      ogImageUrl,
      ogLocale,
      initialToolId: tool.id,
      jsonLdBlocks,
      prerenderedBodyHtml: prerenderedBody
    });

    // Write to dist/${lang}/${tool.id}/index.html
    const langToolDir = path.resolve(distDir, lang, tool.id);
    if (!fs.existsSync(langToolDir)) fs.mkdirSync(langToolDir, { recursive: true });
    fs.writeFileSync(path.resolve(langToolDir, 'index.html'), pageHtml, 'utf-8');
    generatedCount++;

    // Write aliases in language dir
    if (tool.aliasIds && tool.aliasIds.length > 0) {
      for (const alias of tool.aliasIds) {
        const aliasDir = path.resolve(distDir, lang, alias);
        if (!fs.existsSync(aliasDir)) fs.mkdirSync(aliasDir, { recursive: true });
        fs.writeFileSync(path.resolve(aliasDir, 'index.html'), pageHtml, 'utf-8');
        generatedCount++;
      }
    }

    // Also write root fallback in dist/${tool.id}/index.html for root backwards-compatibility
    const isDefaultFallback = (lang === 'pt' && tool.categoryId === 'brazil') || (lang === 'en' && tool.categoryId !== 'brazil');
    if (isDefaultFallback) {
      const rootToolDir = path.resolve(distDir, tool.id);
      if (!fs.existsSync(rootToolDir)) fs.mkdirSync(rootToolDir, { recursive: true });
      fs.writeFileSync(path.resolve(rootToolDir, 'index.html'), pageHtml, 'utf-8');
      generatedCount++;

      for (const alias of (tool.aliasIds || [])) {
        const rootAliasDir = path.resolve(distDir, alias);
        if (!fs.existsSync(rootAliasDir)) fs.mkdirSync(rootAliasDir, { recursive: true });
        fs.writeFileSync(path.resolve(rootAliasDir, 'index.html'), pageHtml, 'utf-8');
        generatedCount++;
      }
    }
  }
}

// 2. Helper to generate compliance static pages
function generateCompliancePage({
  lang,
  slug,
  aliases = [],
  title,
  description,
  h1,
  contentHtml
}) {
  const isPt = lang === 'pt';
  const url = `https://stackkit.com.br/${lang}/${slug}`;
  const canonicalUrl = url;
  const alternateEnUrl = `https://stackkit.com.br/en/${slug}`;
  const alternatePtUrl = `https://stackkit.com.br/pt/${slug}`;
  const ogImageUrl = `https://stackkit.com.br/og/${lang}/${slug}.png`;
  const ogLocale = isPt ? 'pt_BR' : 'en_US';

  const subHeader = isPt
    ? 'StackKit DevStudio · Transparência, Privacidade e Padrões Abertos'
    : 'StackKit DevStudio · Transparency, Privacy & Open Standards';
  const footerContact = isPt
    ? '© 2026 StackKit DevStudio · contato@stackkit.com.br'
    : '© 2026 StackKit DevStudio · contato@stackkit.com.br';
  const privacyText = isPt ? 'Política de Privacidade' : 'Privacy Policy';
  const termsText = isPt ? 'Termos de Uso' : 'Terms of Service';
  const aboutText = isPt ? 'Sobre Nós' : 'About Us';

  const prerenderedBody = `
  <div id="root">
    <div style="max-width: 900px; margin: 40px auto; padding: 32px 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e2e8f0; background: #0f172a; border-radius: 12px; line-height: 1.7;">
      <header style="margin-bottom: 28px; border-bottom: 1px solid #334155; padding-bottom: 20px;">
        <h1 style="font-size: 28px; font-weight: 800; color: #38bdf8; margin: 0 0 8px 0;">${escapeHtml(h1)}</h1>
        <p style="font-size: 14px; color: #94a3b8; margin: 0;">${escapeHtml(subHeader)}</p>
      </header>
      <main style="display: flex; flex-direction: column; gap: 24px; color: #cbd5e1;">
        ${contentHtml}
      </main>
      <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #334155; font-size: 12px; color: #64748b; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>${escapeHtml(footerContact)}</div>
        <div>
          <a href="https://stackkit.com.br/${lang}/privacy-policy" style="color: #38bdf8; text-decoration: none;">${escapeHtml(privacyText)}</a> ·
          <a href="https://stackkit.com.br/${lang}/terms-of-service" style="color: #38bdf8; text-decoration: none;">${escapeHtml(termsText)}</a> ·
          <a href="https://stackkit.com.br/${lang}/about" style="color: #38bdf8; text-decoration: none;">${escapeHtml(aboutText)}</a>
        </div>
      </footer>
    </div>
  </div>`;

  const pageHtml = buildHtmlForPage({
    lang,
    url,
    canonicalUrl,
    alternateEnUrl,
    alternatePtUrl,
    title,
    description,
    keywords: 'privacy, terms, about, stackkit, developer tools',
    ogImageUrl,
    ogLocale,
    prerenderedBodyHtml: prerenderedBody
  });

  // Write to dist/${lang}/${slug}/index.html
  const targetDirs = [slug, ...aliases];
  for (const s of targetDirs) {
    const dir = path.resolve(distDir, lang, s);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.resolve(dir, 'index.html'), pageHtml, 'utf-8');
    generatedCount++;
  }

  // Also write to dist/${slug}/index.html for root backward-compatibility
  if (lang === 'en') {
    for (const s of targetDirs) {
      const rootDirItem = path.resolve(distDir, s);
      if (!fs.existsSync(rootDirItem)) fs.mkdirSync(rootDirItem, { recursive: true });
      fs.writeFileSync(path.resolve(rootDirItem, 'index.html'), pageHtml, 'utf-8');
      generatedCount++;
    }
  }
}

// Generate Privacy Policy (EN & PT)
generateCompliancePage({
  lang: 'pt',
  slug: 'privacy-policy',
  aliases: ['privacidade'],
  title: 'Política de Privacidade | StackKit DevStudio',
  description: 'Política de Privacidade do StackKit DevStudio: arquitetura 100% client-side, zero armazenamento em servidores e conformidade total com Google AdSense, LGPD e GDPR.',
  h1: 'Política de Privacidade & Proteção de Dados',
  contentHtml: `
    <section>
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">1. Processamento 100% Client-Side e Zero Armazenamento de Dados</h2>
      <p>No StackKit DevStudio (https://stackkit.com.br), toda a execução de ferramentas ocorre exclusivamente no navegador do usuário. Tokens JWT, códigos-fonte, payloads JSON, senhas geradas ou documentos fiscais inseridos nunca são enviados a servidores remotos ou gravados em bancos de dados.</p>
    </section>

    <section style="background: rgba(56, 189, 248, 0.08); border-left: 4px solid #38bdf8; padding: 16px 20px; border-radius: 4px;">
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">2. Publicidade e Cookies do Google AdSense</h2>
      <p>O StackKit exibe anúncios veiculados pelo Google AdSense para financiar a manutenção da infraestrutura e garantir o acesso gratuito.</p>
      <ul style="padding-left: 20px; margin-top: 8px;">
        <li>Fornecedores terceiros, incluindo o Google, utilizam cookies para veicular anúncios com base nas visitas anteriores do usuário a este site ou a outros sites na internet.</li>
        <li>O uso de cookies de publicidade pelo Google permite que ele e seus parceiros veiculem anúncios para seus usuários com base nas visitas a seus sites e/ou outros sites na internet.</li>
        <li>Os usuários podem desativar a publicidade personalizada acessando as Configurações de Anúncios do Google em: <a href="https://adssettings.google.com/" target="_blank" rel="noopener" style="color: #38bdf8;">https://adssettings.google.com/</a>.</li>
        <li>Alternativamente, você pode desativar o uso de cookies para publicidade personalizada acessando o portal <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener" style="color: #38bdf8;">www.aboutads.info/choices/</a>.</li>
      </ul>
    </section>

    <section>
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">3. Arquivos de Log e LocalStorage</h2>
      <p>Utilizamos registros de log padrão de servidor (endereço IP, tipo de navegador, timestamp) apenas para diagnóstico de rede e proteção contra ataques. O LocalStorage do navegador armazena unicamente preferências de interface (tema dark/light, idioma e favoritos).</p>
    </section>

    <section>
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">4. Direitos do Titular (LGPD e GDPR)</h2>
      <p>Em conformidade com a LGPD (Lei 13.709/2018) e com o GDPR, respeitamos integralmente o direito à transparência e à revogação de consentimento de rastreamento publicitário. Contato: contato@stackkit.com.br.</p>
    </section>
  `
});

generateCompliancePage({
  lang: 'en',
  slug: 'privacy-policy',
  aliases: [],
  title: 'Privacy Policy | StackKit DevStudio',
  description: 'StackKit DevStudio Privacy Policy: 100% client-side architecture, zero server data storage, and strict compliance with Google AdSense, GDPR, and LGPD.',
  h1: 'Privacy Policy & Data Protection',
  contentHtml: `
    <section>
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">1. 100% Client-Side Architecture & Zero Server Storage</h2>
      <p>At StackKit DevStudio (https://stackkit.com.br), all tool processing occurs exclusively in the client's web browser. JWT tokens, source code, JSON payloads, generated passwords, and test identifiers are never transmitted to remote servers or persisted in backend databases.</p>
    </section>

    <section style="background: rgba(56, 189, 248, 0.08); border-left: 4px solid #38bdf8; padding: 16px 20px; border-radius: 4px;">
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">2. Google AdSense Advertising & Cookies</h2>
      <p>StackKit displays advertisements served by Google AdSense to sustain free high-performance infrastructure for developers.</p>
      <ul style="padding-left: 20px; margin-top: 8px;">
        <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.</li>
        <li>Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to your sites and/or other sites on the Internet.</li>
        <li>Users may opt out of personalized advertising by visiting Google Ads Settings at: <a href="https://adssettings.google.com/" target="_blank" rel="noopener" style="color: #38bdf8;">https://adssettings.google.com/</a>.</li>
        <li>Alternatively, users can opt out of third-party vendor use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener" style="color: #38bdf8;">www.aboutads.info/choices/</a>.</li>
      </ul>
    </section>

    <section>
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">3. Log Files & LocalStorage</h2>
      <p>Standard server access logs (IP address, user agent, timestamp) are recorded strictly for network diagnostics and DDoS prevention. Browser LocalStorage is used solely to preserve client UI state (theme preferences, language selection, and favorited tools).</p>
    </section>

    <section>
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">4. User Rights (GDPR & LGPD)</h2>
      <p>In full compliance with the European General Data Protection Regulation (GDPR) and Brazilian General Data Protection Law (LGPD), users retain all rights of access, explanation, and consent revocation. Contact: contato@stackkit.com.br.</p>
    </section>
  `
});

// Generate Terms of Service (EN & PT)
generateCompliancePage({
  lang: 'pt',
  slug: 'terms-of-service',
  aliases: ['termos', 'termos-de-uso'],
  title: 'Termos de Serviço e Uso | StackKit DevStudio',
  description: 'Termos de Uso do StackKit DevStudio: finalidade educacional e testes de homologação de software para desenvolvedores e analistas de QA.',
  h1: 'Termos de Serviço e Uso',
  contentHtml: `
    <section>
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">1. Aceitação dos Termos</h2>
      <p>Ao utilizar o StackKit DevStudio, você concorda em cumprir integralmente estes termos de uso.</p>
    </section>

    <section style="background: rgba(245, 158, 11, 0.08); border-left: 4px solid #f59e0b; padding: 16px 20px; border-radius: 4px;">
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">2. Finalidade Estritamente Educacional e Homologação de Software</h2>
      <p>As ferramentas de geração de documentos (CPF, CNPJ, RG, INSS NB, Processos Judiciais CNJ e Cartões de Teste) foram concebidas exclusivamente para auxiliar desenvolvedores e engenheiros de qualidade (QA) no teste de validações de formulários e sistemas ERP em ambientes de desenvolvimento (sandbox).</p>
      <p><strong>Aviso:</strong> Os dados gerados não possuem validade fiscal ou legal e não devem ser utilizados para fraudes ou cadastros reais.</p>
    </section>

    <section>
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">3. Limitação de Responsabilidade</h2>
      <p>Os serviços são fornecidos "como estão", sem garantias expressas ou implícitas de qualquer natureza. O StackKit não se responsabiliza por indisponibilidades técnicas ou uso indevido de terceiros.</p>
    </section>
  `
});

generateCompliancePage({
  lang: 'en',
  slug: 'terms-of-service',
  aliases: [],
  title: 'Terms of Service | StackKit DevStudio',
  description: 'Terms of service and software testing guidelines for StackKit DevStudio users.',
  h1: 'Terms of Service',
  contentHtml: `
    <section>
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">1. Acceptance of Terms</h2>
      <p>By accessing or using StackKit DevStudio, you agree to be bound by these Terms of Service.</p>
    </section>

    <section style="background: rgba(245, 158, 11, 0.08); border-left: 4px solid #f59e0b; padding: 16px 20px; border-radius: 4px;">
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">2. Strictly Educational & Testing Sandbox Purpose</h2>
      <p>Mock data generators (identifiers, documents, credentials, test credit cards) are engineered strictly to assist software developers and QA teams in validating forms, API pipelines, and staging environments.</p>
      <p><strong>Notice:</strong> Generated identifiers carry zero legal or financial validity and must never be utilized for illicit actions or real commercial registrations.</p>
    </section>

    <section>
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">3. Limitation of Liability</h2>
      <p>The platform is provided "as is" without express or implied warranties. StackKit DevStudio assumes no liability for technical interruptions or third-party misuse.</p>
    </section>
  `
});

// Generate About Us (EN & PT)
generateCompliancePage({
  lang: 'pt',
  slug: 'about',
  aliases: ['sobre'],
  title: 'Sobre o StackKit DevStudio | Utilitários Gratuitos para Desenvolvedores',
  description: 'Conheça o StackKit DevStudio: estação all-in-one de ferramentas client-side para desenvolvedores modernos, alta performance e respeito à privacidade.',
  h1: 'Sobre o StackKit DevStudio',
  contentHtml: `
    <section>
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">Nossa Missão</h2>
      <p>O StackKit DevStudio foi desenvolvido para oferecer a experiência mais veloz, completa e elegante para engenheiros de software, estudantes e equipes globais. Eliminamos o atrito de utilitários poluídos e inseguros, garantindo processamento 100% no cliente com padrões abertos da internet.</p>
    </section>

    <section>
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">Pilares Técnicos</h2>
      <ul style="padding-left: 20px;">
        <li><strong>Zero Server Storage:</strong> Segurança absoluta via Web Crypto API nativa do navegador.</li>
        <li><strong>Performance Instantânea:</strong> Construído em React e Vite de última geração.</li>
        <li><strong>Padrões Globais & Brasil:</strong> Suporte completo a RFC 7519, RFC 8259, RFC 4648, Módulo 11 da Receita Federal e Resolução 65/2008 do CNJ.</li>
      </ul>
    </section>

    <section>
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">Contato</h2>
      <p>Dúvidas, sugestões ou parcerias: <a href="mailto:contato@stackkit.com.br" style="color: #38bdf8;">contato@stackkit.com.br</a>.</p>
    </section>
  `
});

generateCompliancePage({
  lang: 'en',
  slug: 'about',
  aliases: [],
  title: 'About StackKit DevStudio | Free Developer Tools & Workstation',
  description: 'Learn about StackKit DevStudio: mission, high-performance client-side architecture, and developer privacy standards.',
  h1: 'About StackKit DevStudio',
  contentHtml: `
    <section>
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">Our Mission</h2>
      <p>StackKit DevStudio provides a fast, secure, client-side workstation for software developers, QA engineers, and distributed global teams. We replace cluttered, insecure online utilities with zero-server-storage tools adhering to open standards.</p>
    </section>

    <section>
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">Technical Pillars</h2>
      <ul style="padding-left: 20px;">
        <li><strong>Zero Server Storage:</strong> Pure browser execution via native Web Cryptography API.</li>
        <li><strong>Instant Performance:</strong> Engineered with state-of-the-art React and Vite.</li>
        <li><strong>Global & Regional Standards:</strong> Full conformance with RFC 7519, RFC 8259, RFC 4648, and Brazilian fiscal specifications.</li>
      </ul>
    </section>

    <section>
      <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 8px;">Contact</h2>
      <p>Inquiries, feature suggestions, or partnerships: <a href="mailto:contato@stackkit.com.br" style="color: #38bdf8;">contato@stackkit.com.br</a>.</p>
    </section>
  `
});

// 3. Generate pre-rendered homepages for EN, PT, and root
function buildCatalogPrerenderedBody(lang) {
  const isPt = lang === 'pt';
  const heading = isPt
    ? 'StackKit DevStudio — Mais de 40 Ferramentas Gratuitas para Desenvolvedores'
    : 'StackKit DevStudio — 40+ Free Developer Tools, World Clock & Color Palette';
  const intro = isPt
    ? 'Estúdio all-in-one de ferramentas e utilitários técnicos para desenvolvedores, equipes de QA e engenharia de software. Processamento 100% privado no cliente (client-side), sem gravação de dados em servidores remotos.'
    : 'All-in-one developer workstation featuring 40+ free client-side utilities: World Time Buddy meeting scheduler, Coolors palette generator, QR Code generator, JSON/SQL formatters, Base64/JWT encoders, and more. 100% private client-side execution.';
  const featuredTitle = isPt ? 'Ferramentas em Destaque' : 'Featured Developer Tools';
  const securityTitle = isPt ? 'Segurança Absoluta: Arquitetura Zero Server Storage' : 'Absolute Privacy: Zero Server Storage Architecture';
  const securityBody = isPt
    ? 'Diferente de utilitários convencionais, o StackKit executa toda a computação localmente via Web Cryptography API e motor JavaScript do seu navegador. Seus tokens JWT, chaves de autenticação, payloads JSON, senhas geradas e dados de teste nunca trafegam pela rede ou são gravados em servidores remotos.'
    : 'Unlike conventional utilities, StackKit executes all computing locally via Web Cryptography API and your browser JavaScript engine. Your JWT tokens, API keys, JSON payloads, generated passwords, and test data never traverse the network or persist on remote servers.';
  const footerText = isPt ? '© 2026 StackKit DevStudio · Ferramentas Gratuitas e Seguras para Desenvolvedores' : '© 2026 StackKit DevStudio · Free & Secure Developer Utilities';
  const privLink = isPt ? 'Política de Privacidade' : 'Privacy Policy';
  const termsLink = isPt ? 'Termos de Uso' : 'Terms of Service';
  const aboutLink = isPt ? 'Sobre Nós' : 'About Us';

  return `
  <div id="root">
    <div style="max-width: 1080px; margin: 40px auto; padding: 32px 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e2e8f0; background: #0f172a; border-radius: 12px; line-height: 1.6;">
      <header style="margin-bottom: 32px; border-bottom: 1px solid #334155; padding-bottom: 24px;">
        <h1 style="font-size: 28px; font-weight: 800; color: #38bdf8; margin: 0 0 10px 0;">${escapeHtml(heading)}</h1>
        <p style="font-size: 15px; color: #94a3b8; margin: 0; line-height: 1.6;">${escapeHtml(intro)}</p>
      </header>

      <section style="margin-bottom: 36px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 16px;">${escapeHtml(featuredTitle)}</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px;">
          ${tools.slice(0, 24).map(t => `
          <div style="padding: 16px; background: #1e293b; border: 1px solid #334155; border-radius: 8px;">
            <h3 style="font-size: 15px; font-weight: 700; margin: 0 0 6px 0;">
              <a href="https://stackkit.com.br/${lang}/${t.id}" style="color: #38bdf8; text-decoration: none;">${escapeHtml(isPt ? t.name : (t.nameEn || t.name))}</a>
            </h3>
            <p style="font-size: 12.5px; color: #94a3b8; margin: 0; line-height: 1.5;">${escapeHtml(isPt ? t.description : (t.descriptionEn || t.description))}</p>
          </div>`).join('\n          ')}
        </div>
      </section>

      <section style="margin-bottom: 36px; padding: 24px; background: #1e293b; border-radius: 8px; border: 1px solid #334155;">
        <h2 style="font-size: 18px; font-weight: 700; color: #34d399; margin-bottom: 10px;">${escapeHtml(securityTitle)}</h2>
        <p style="font-size: 13.5px; color: #cbd5e1; line-height: 1.7; margin: 0;">${escapeHtml(securityBody)}</p>
      </section>

      <footer style="margin-top: 36px; padding-top: 20px; border-top: 1px solid #334155; font-size: 12px; color: #64748b; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
        <div>${escapeHtml(footerText)}</div>
        <div style="display: flex; gap: 16px;">
          <a href="https://stackkit.com.br/${lang}/privacy-policy" style="color: #38bdf8; text-decoration: none;">${escapeHtml(privLink)}</a>
          <span>·</span>
          <a href="https://stackkit.com.br/${lang}/terms-of-service" style="color: #38bdf8; text-decoration: none;">${escapeHtml(termsLink)}</a>
          <span>·</span>
          <a href="https://stackkit.com.br/${lang}/about" style="color: #38bdf8; text-decoration: none;">${escapeHtml(aboutLink)}</a>
        </div>
      </footer>
    </div>
  </div>`;
}

// Generate dist/en/index.html
const enHomeHtml = buildHtmlForPage({
  lang: 'en',
  url: 'https://stackkit.com.br/en',
  canonicalUrl: 'https://stackkit.com.br/en',
  alternateEnUrl: 'https://stackkit.com.br/en',
  alternatePtUrl: 'https://stackkit.com.br/pt',
  title: 'StackKit DevStudio — 40+ Free Developer Tools, World Clock & Color Palette Generator',
  description: 'All-in-one developer workstation with 40+ free client-side utilities: World Time Buddy, Coolors palette generator, QR Code generator, JSON/SQL formatters, Base64/JWT encoders.',
  keywords: 'developer tools, world time buddy, color palette generator, coolors, qr code, json formatter, jwt inspector, base64 encoder',
  ogImageUrl: 'https://stackkit.com.br/og/en/default.png',
  ogLocale: 'en_US',
  prerenderedBodyHtml: buildCatalogPrerenderedBody('en')
});
const enHomeDir = path.resolve(distDir, 'en');
if (!fs.existsSync(enHomeDir)) fs.mkdirSync(enHomeDir, { recursive: true });
fs.writeFileSync(path.resolve(enHomeDir, 'index.html'), enHomeHtml, 'utf-8');
generatedCount++;

// Generate dist/pt/index.html
const ptHomeHtml = buildHtmlForPage({
  lang: 'pt',
  url: 'https://stackkit.com.br/pt',
  canonicalUrl: 'https://stackkit.com.br/pt',
  alternateEnUrl: 'https://stackkit.com.br/en',
  alternatePtUrl: 'https://stackkit.com.br/pt',
  title: 'StackKit DevStudio — Mais de 40 Ferramentas Gratuitas para Desenvolvedores',
  description: 'Estúdio all-in-one para desenvolvedores com mais de 40 utilitários client-side gratuitos: World Time Buddy, gerador de paleta de cores Coolors, gerador de QR Code, formatadores JSON/SQL e codificadores Base64/JWT.',
  keywords: 'ferramentas desenvolvedor, gerador de cpf, gerador de cnpj, validador cpf, world time buddy, gerador de qr code, formatador json, jwt, base64',
  ogImageUrl: 'https://stackkit.com.br/og/pt/default.png',
  ogLocale: 'pt_BR',
  prerenderedBodyHtml: buildCatalogPrerenderedBody('pt')
});
const ptHomeDir = path.resolve(distDir, 'pt');
if (!fs.existsSync(ptHomeDir)) fs.mkdirSync(ptHomeDir, { recursive: true });
fs.writeFileSync(path.resolve(ptHomeDir, 'index.html'), ptHomeHtml, 'utf-8');
generatedCount++;

// Update root dist/index.html
let rootHomeHtml = enHomeHtml.replace(/<link rel="canonical"\s+href="[^"]*"\s*\/?>/, '<link rel="canonical" href="https://stackkit.com.br/" />');
rootHomeHtml = rootHomeHtml.replace(/<meta property="og:url"\s+content="[^"]*"\s*\/?>/, '<meta property="og:url" content="https://stackkit.com.br/" />');
fs.writeFileSync(templatePath, rootHomeHtml, 'utf-8');

// 4. Update sitemap.xml with multilingual alternates
const today = new Date().toISOString().split('T')[0];
const complianceRoutes = ['privacy-policy', 'terms-of-service', 'about'];

const sitemapEntries = [];

// Homepages
sitemapEntries.push(`  <url>
    <loc>https://stackkit.com.br/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://stackkit.com.br/en" />
    <xhtml:link rel="alternate" hreflang="pt" href="https://stackkit.com.br/pt" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://stackkit.com.br/en" />
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

for (const lang of languages) {
  sitemapEntries.push(`  <url>
    <loc>https://stackkit.com.br/${lang}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://stackkit.com.br/en" />
    <xhtml:link rel="alternate" hreflang="pt" href="https://stackkit.com.br/pt" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://stackkit.com.br/en" />
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>`);
}

// Compliance pages
for (const slug of complianceRoutes) {
  for (const lang of languages) {
    sitemapEntries.push(`  <url>
    <loc>https://stackkit.com.br/${lang}/${slug}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://stackkit.com.br/en/${slug}" />
    <xhtml:link rel="alternate" hreflang="pt" href="https://stackkit.com.br/pt/${slug}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://stackkit.com.br/en/${slug}" />
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  }
}

// Tool pages
for (const tool of tools) {
  for (const lang of languages) {
    sitemapEntries.push(`  <url>
    <loc>https://stackkit.com.br/${lang}/${tool.id}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://stackkit.com.br/en/${tool.id}" />
    <xhtml:link rel="alternate" hreflang="pt" href="https://stackkit.com.br/pt/${tool.id}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://stackkit.com.br/en/${tool.id}" />
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${tool.popular ? '0.9' : '0.8'}</priority>
  </url>`);
  }
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries.join('\n')}
</urlset>
`;

fs.writeFileSync(path.resolve(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
fs.writeFileSync(path.resolve(rootDir, 'public/sitemap.xml'), sitemapXml, 'utf-8');

console.log(`Successfully generated ${generatedCount} multilingual static HTML pages and updated sitemap.xml!`);
