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

console.log(`Generating dedicated static landing pages for ${tools.length} tools and compliance pages...`);

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

let generatedCount = 0;

// 1. Generate pages for all tools
for (const tool of tools) {
  const toolUrl = `https://stackkit.com.br/${tool.id}`;
  const title = tool.nameEn && tool.nameEn.toLowerCase() !== tool.name.toLowerCase()
    ? `${tool.name} (${tool.nameEn}) — StackKit DevStudio`
    : `${tool.name} — StackKit DevStudio`;

  const metaDesc = `${tool.description}. ${tool.descriptionEn && tool.descriptionEn !== tool.description ? tool.descriptionEn + '. ' : ''}Ferramenta online gratuita, segura e 100% client-side.`
    .replace(/\s+/g, ' ')
    .trim();

  const keywords = [...(tool.tags || []), tool.id, 'developer tools', 'stackkit', 'client-side tools'].join(', ');

  const editorial = getToolEditorialContent(tool, 'pt');

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

  // 7. Inject JSON-LD blocks (WebApplication + FAQPage)
  const jsonLdBlocks = [
    `<script type="application/ld+json">\n${JSON.stringify(toolJsonLd, null, 2)}\n  </script>`
  ];
  if (faqJsonLd) {
    jsonLdBlocks.push(`<script type="application/ld+json">\n${JSON.stringify(faqJsonLd, null, 2)}\n  </script>`);
  }

  pageHtml = pageHtml.replace(
    /<script type="application\/ld\+json">.*?<\/script>/s,
    jsonLdBlocks.join('\n  ')
  );

  // 8. Inject initial tool ID preloader script
  const scriptTag = `  <script>window.__INITIAL_TOOL_ID__ = ${JSON.stringify(tool.id)};</script>\n</head>`;
  pageHtml = pageHtml.replace('</head>', scriptTag);

  // 9. CRITICAL FOR ADSENSE: Pre-render rich semantic publisher content directly inside <div id="root">
  // When search engine bots & AdSense compliance crawlers inspect the HTTP response without JS execution,
  // they encounter 500-1000 words of authentic documentation, guides, and FAQs rather than a blank screen.
  const prerenderedBody = `
  <div id="root">
    <div style="max-width: 960px; margin: 40px auto; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e2e8f0; background: #0f172a; border-radius: 12px; line-height: 1.6;">
      <header style="margin-bottom: 24px; border-bottom: 1px solid #334155; padding-bottom: 16px;">
        <h1 style="font-size: 26px; font-weight: 800; color: #38bdf8; margin: 0 0 8px 0;">${escapeHtml(tool.name)} (${escapeHtml(tool.nameEn || tool.name)})</h1>
        <p style="font-size: 15px; color: #94a3b8; margin: 0;">${escapeHtml(tool.description)}</p>
      </header>

      <article id="publisher-content">
        <h2 style="font-size: 20px; font-weight: 700; color: #f1f5f9; margin-top: 24px;">${escapeHtml(editorial.title)}</h2>
        <p style="font-size: 14.5px; color: #cbd5e1; line-height: 1.7;">${escapeHtml(editorial.overview)}</p>

        <h3 style="font-size: 17px; font-weight: 700; color: #38bdf8; margin-top: 24px;">Como Utilizar: Passo a Passo</h3>
        <ol style="padding-left: 20px; color: #cbd5e1;">
          ${editorial.howTo.map(step => `<li style="margin-bottom: 8px;">${escapeHtml(step)}</li>`).join('\n          ')}
        </ol>

        <h3 style="font-size: 17px; font-weight: 700; color: #34d399; margin-top: 24px;">Privacidade e Execução Segura no Navegador</h3>
        <p style="font-size: 14px; color: #cbd5e1;">O StackKit DevStudio executa todas as rotinas, cálculos de dígitos verificadores e formatações 100% no seu navegador (client-side). Seus dados e parâmetros nunca são enviados a servidores remotos.</p>

        <h3 style="font-size: 17px; font-weight: 700; color: #fbbf24; margin-top: 24px;">Perguntas Frequentes (FAQ)</h3>
        <div style="margin-top: 12px;">
          ${editorial.faqs.map(faq => `
          <div style="margin-bottom: 14px; border: 1px solid #334155; border-radius: 8px; padding: 12px 16px; background: #1e293b;">
            <h4 style="font-size: 15px; font-weight: 600; color: #f8fafc; margin: 0 0 6px 0;">${escapeHtml(faq.q)}</h4>
            <p style="font-size: 13.5px; color: #cbd5e1; margin: 0;">${escapeHtml(faq.a)}</p>
          </div>`).join('\n          ')}
        </div>
      </article>

      <footer style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #334155; font-size: 12px; color: #64748b; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>© 2026 StackKit DevStudio · Ferramentas Gratuitas para Desenvolvedores</div>
        <div>
          <a href="https://stackkit.com.br/privacy-policy" style="color: #38bdf8; text-decoration: none;">Política de Privacidade</a> ·
          <a href="https://stackkit.com.br/terms-of-service" style="color: #38bdf8; text-decoration: none;">Termos de Uso</a> ·
          <a href="https://stackkit.com.br/about" style="color: #38bdf8; text-decoration: none;">Sobre Nós</a>
        </div>
      </footer>
    </div>
  </div>`;

  pageHtml = pageHtml.replace('<div id="root"></div>', prerenderedBody);

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

// 2. Helper to generate compliance static pages
function generateCompliancePage({ slug, aliases = [], title, description, h1, contentHtml }) {
  const url = `https://stackkit.com.br/${slug}`;
  let pageHtml = template;

  pageHtml = pageHtml.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`);
  pageHtml = pageHtml.replace(/<meta name="description"\s+content=".*?"\s*\/?>/s, `<meta name="description" content="${escapeHtml(description)}" />`);
  pageHtml = pageHtml.replace(/<link rel="canonical"\s+href=".*?"\s*\/?>/s, `<link rel="canonical" href="${url}" />`);
  pageHtml = pageHtml.replace(/<meta property="og:url"\s+content=".*?"\s*\/?>/s, `<meta property="og:url" content="${url}" />`);
  pageHtml = pageHtml.replace(/<meta property="og:title"\s+content=".*?"\s*\/?>/s, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  pageHtml = pageHtml.replace(/<meta property="og:description"\s+content=".*?"\s*\/?>/s, `<meta property="og:description" content="${escapeHtml(description)}" />`);

  const prerenderedBody = `
  <div id="root">
    <div style="max-width: 900px; margin: 40px auto; padding: 32px 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e2e8f0; background: #0f172a; border-radius: 12px; line-height: 1.7;">
      <header style="margin-bottom: 28px; border-bottom: 1px solid #334155; padding-bottom: 20px;">
        <h1 style="font-size: 28px; font-weight: 800; color: #38bdf8; margin: 0 0 8px 0;">${escapeHtml(h1)}</h1>
        <p style="font-size: 14px; color: #94a3b8; margin: 0;">StackKit DevStudio · Transparência, Privacidade e Padrões Abertos</p>
      </header>
      <main style="display: flex; flex-direction: column; gap: 24px; color: #cbd5e1;">
        ${contentHtml}
      </main>
      <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #334155; font-size: 12px; color: #64748b; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>© 2026 StackKit DevStudio · contato@stackkit.com.br</div>
        <div>
          <a href="https://stackkit.com.br/privacy-policy" style="color: #38bdf8; text-decoration: none;">Política de Privacidade</a> ·
          <a href="https://stackkit.com.br/terms-of-service" style="color: #38bdf8; text-decoration: none;">Termos de Uso</a> ·
          <a href="https://stackkit.com.br/about" style="color: #38bdf8; text-decoration: none;">Sobre Nós</a>
        </div>
      </footer>
    </div>
  </div>`;

  pageHtml = pageHtml.replace('<div id="root"></div>', prerenderedBody);

  const targetDirs = [slug, ...aliases];
  for (const s of targetDirs) {
    const dir = path.resolve(distDir, s);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.resolve(dir, 'index.html'), pageHtml, 'utf-8');
    generatedCount++;
  }
}

// Generate Privacy Policy page (AdSense & LGPD compliant)
generateCompliancePage({
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

// Generate Terms of Service page
generateCompliancePage({
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

// Generate About Us page
generateCompliancePage({
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

// 3. Update sitemap.xml with all tools AND compliance pages
const today = new Date().toISOString().split('T')[0];
const complianceRoutes = [
  { path: 'privacy-policy', priority: '0.7', freq: 'monthly' },
  { path: 'terms-of-service', priority: '0.7', freq: 'monthly' },
  { path: 'about', priority: '0.7', freq: 'monthly' }
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://stackkit.com.br/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${complianceRoutes.map(route => `  <url>
    <loc>https://stackkit.com.br/${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.freq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
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

// 4. Update dist/index.html with pre-rendered publisher catalog content
const homePrerenderedBody = `
  <div id="root">
    <div style="max-width: 1080px; margin: 40px auto; padding: 32px 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e2e8f0; background: #0f172a; border-radius: 12px; line-height: 1.6;">
      <header style="margin-bottom: 32px; border-bottom: 1px solid #334155; padding-bottom: 24px;">
        <h1 style="font-size: 28px; font-weight: 800; color: #38bdf8; margin: 0 0 10px 0;">StackKit DevStudio — Mais de 40 Ferramentas Gratuitas para Desenvolvedores</h1>
        <p style="font-size: 15px; color: #94a3b8; margin: 0; line-height: 1.6;">
          Estúdio all-in-one de ferramentas e utilitários técnicos para desenvolvedores, equipes de QA e engenharia de software.
          Processamento 100% privado no cliente (client-side), sem gravação de dados ou códigos em servidores remotos.
        </p>
      </header>

      <section style="margin-bottom: 36px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-bottom: 16px;">Ferramentas em Destaque</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px;">
          ${tools.slice(0, 24).map(t => `
          <div style="padding: 16px; background: #1e293b; border: 1px solid #334155; border-radius: 8px;">
            <h3 style="font-size: 15px; font-weight: 700; margin: 0 0 6px 0;">
              <a href="https://stackkit.com.br/${t.id}" style="color: #38bdf8; text-decoration: none;">${escapeHtml(t.name)}</a>
            </h3>
            <p style="font-size: 12.5px; color: #94a3b8; margin: 0; line-height: 1.5;">${escapeHtml(t.description)}</p>
          </div>`).join('\n          ')}
        </div>
      </section>

      <section style="margin-bottom: 36px; padding: 24px; background: #1e293b; border-radius: 8px; border: 1px solid #334155;">
        <h2 style="font-size: 18px; font-weight: 700; color: #34d399; margin-bottom: 10px;">Segurança Absoluta: Arquitetura Zero Server Storage</h2>
        <p style="font-size: 13.5px; color: #cbd5e1; line-height: 1.7; margin: 0;">
          Diferente de utilitários convencionais, o StackKit executa toda a computação localmente via Web Cryptography API e motor JavaScript do seu navegador. Seus tokens JWT, chaves de autenticação, payloads JSON, senhas geradas e dados de teste nunca trafegam pela rede ou são gravados em servidores remotos.
        </p>
      </section>

      <footer style="margin-top: 36px; padding-top: 20px; border-top: 1px solid #334155; font-size: 12px; color: #64748b; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
        <div>© 2026 StackKit DevStudio · Ferramentas Gratuitas e Seguras para Desenvolvedores</div>
        <div style="display: flex; gap: 16px;">
          <a href="https://stackkit.com.br/privacy-policy" style="color: #38bdf8; text-decoration: none;">Política de Privacidade</a>
          <span>·</span>
          <a href="https://stackkit.com.br/terms-of-service" style="color: #38bdf8; text-decoration: none;">Termos de Uso</a>
          <span>·</span>
          <a href="https://stackkit.com.br/about" style="color: #38bdf8; text-decoration: none;">Sobre Nós</a>
        </div>
      </footer>
    </div>
  </div>`;

const homeHtml = template.replace('<div id="root"></div>', homePrerenderedBody);
fs.writeFileSync(templatePath, homeHtml, 'utf-8');

console.log(`Successfully generated ${generatedCount} static HTML pages, compliance pages, pre-rendered homepage, and updated sitemap.xml!`);

