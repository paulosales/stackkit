import React, { useState, useEffect } from 'react';
import { tools, categories, findToolByIdOrAlias } from './data/toolsData';
import Sidebar from './components/Sidebar';
import AppHeader from './components/AppHeader';
import ToolTabs from './components/ToolTabs';
import CommandPalette from './components/CommandPalette';
import ToastContainer from './components/ToastContainer';
import CatalogView from './components/CatalogView';
import ToolLayout from './components/ToolLayout';
import PrivacyPolicy from './components/compliance/PrivacyPolicy';
import TermsOfService from './components/compliance/TermsOfService';
import AboutUs from './components/compliance/AboutUs';
import { X, Check, Shield, Zap, Terminal, Code2 } from 'lucide-react';

import './App.css';

// Detect default language from user's explicit preference or browser preferences
function getInitialLanguage() {
  try {
    const userSelected = localStorage.getItem('stackkit_user_lang');
    if (userSelected === 'pt' || userSelected === 'en') {
      return userSelected;
    }
  } catch {
    // Ignore localStorage errors
  }

  try {
    // Read browser preferred languages array or fallback to primary navigator.language
    const browserLangs = (typeof navigator !== 'undefined' && navigator.languages && navigator.languages.length)
      ? navigator.languages
      : [(typeof navigator !== 'undefined' && (navigator.language || navigator.userLanguage)) || ''];

    for (const langTag of browserLangs) {
      if (!langTag) continue;
      const clean = langTag.toLowerCase();
      if (clean.startsWith('pt')) return 'pt';
      if (clean.startsWith('en')) return 'en';
    }
  } catch {
    // Ignore navigator errors
  }

  // Fallback to English for international users
  return 'en';
}

export default function App() {
  const [activeToolId, setActiveToolId] = useState(null);
  const [compliancePage, setCompliancePage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [openToolIds, setOpenToolIds] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('stackkit_favorites');
      return saved ? JSON.parse(saved) : ['cpf-generator', 'json-formatter', 'pix-generator', 'jwt-inspector'];
    } catch {
      return ['cpf-generator', 'json-formatter', 'pix-generator', 'jwt-inspector'];
    }
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('stackkit_theme') || 'dark';
  });

  const [lang, setLang] = useState(getInitialLanguage);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('stackkit_sidebar_collapsed') === 'true';
  });

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast notification dispatcher
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2800);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Explicit user language toggle handler
  const handleToggleLang = () => {
    setLang(prevLang => {
      const nextLang = prevLang === 'pt' ? 'en' : 'pt';
      try {
        localStorage.setItem('stackkit_user_lang', nextLang);
        localStorage.setItem('stackkit_lang', nextLang);
      } catch {
        // ignore
      }
      return nextLang;
    });
  };

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('stackkit_theme', theme);
  }, [theme]);

  // Sync lang to document html tag
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // React to browser language change if user hasn't explicitly overridden it
  useEffect(() => {
    const handleBrowserLanguageChange = () => {
      try {
        if (!localStorage.getItem('stackkit_user_lang')) {
          setLang(getInitialLanguage());
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('languagechange', handleBrowserLanguageChange);
    return () => window.removeEventListener('languagechange', handleBrowserLanguageChange);
  }, []);

  // Sync favorites
  useEffect(() => {
    localStorage.setItem('stackkit_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Sync sidebar
  useEffect(() => {
    localStorage.setItem('stackkit_sidebar_collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Dynamic SEO & Open Graph metadata updates
  useEffect(() => {
    const updateMetaTag = (selector, attribute, value) => {
      let tag = document.querySelector(selector);
      if (!tag && value) {
        tag = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
        if (selector.includes('property="')) {
          const prop = selector.match(/property="([^"]+)"/)?.[1];
          if (prop) tag.setAttribute('property', prop);
        } else if (selector.includes('name="')) {
          const name = selector.match(/name="([^"]+)"/)?.[1];
          if (name) tag.setAttribute('name', name);
        } else if (selector.includes('rel="')) {
          const rel = selector.match(/rel="([^"]+)"/)?.[1];
          if (rel) tag.setAttribute('rel', rel);
        }
        document.head.appendChild(tag);
      }
      if (tag && value) {
        tag.setAttribute(attribute, value);
      }
    };

    if (compliancePage) {
      if (compliancePage === 'privacy-policy') {
        const title = lang === 'pt'
          ? 'Política de Privacidade | StackKit DevStudio'
          : 'Privacy Policy | StackKit DevStudio';
        const desc = lang === 'pt'
          ? 'Política de privacidade do StackKit DevStudio: arquitetura 100% client-side, sem armazenamento de dados em servidores, e conformidade estrita com LGPD, GDPR e Google AdSense.'
          : 'StackKit DevStudio Privacy Policy: 100% client-side architecture, zero server data storage, and strict compliance with LGPD, GDPR, and Google AdSense.';
        const url = 'https://stackkit.com.br/privacy-policy';

        document.title = title;
        updateMetaTag('meta[name="description"]', 'content', desc);
        updateMetaTag('link[rel="canonical"]', 'href', url);
        updateMetaTag('meta[property="og:title"]', 'content', title);
        updateMetaTag('meta[property="og:description"]', 'content', desc);
        updateMetaTag('meta[property="og:url"]', 'content', url);
      } else if (compliancePage === 'terms-of-service') {
        const title = lang === 'pt'
          ? 'Termos de Serviço e Uso | StackKit DevStudio'
          : 'Terms of Service | StackKit DevStudio';
        const desc = lang === 'pt'
          ? 'Termos de uso e diretrizes para desenvolvedores e testes de software no StackKit DevStudio.'
          : 'Terms of service and software testing guidelines for StackKit DevStudio users.';
        const url = 'https://stackkit.com.br/terms-of-service';

        document.title = title;
        updateMetaTag('meta[name="description"]', 'content', desc);
        updateMetaTag('link[rel="canonical"]', 'href', url);
        updateMetaTag('meta[property="og:title"]', 'content', title);
        updateMetaTag('meta[property="og:description"]', 'content', desc);
        updateMetaTag('meta[property="og:url"]', 'content', url);
      } else if (compliancePage === 'about') {
        const title = lang === 'pt'
          ? 'Sobre o StackKit DevStudio | Ferramentas Gratuitas para Desenvolvedores'
          : 'About StackKit DevStudio | Free Developer Tools & Workstation';
        const desc = lang === 'pt'
          ? 'Conheça o StackKit DevStudio: missão, arquitetura client-side de alta performance e compromisso com privacidade para desenvolvedores.'
          : 'Learn about StackKit DevStudio: mission, high-performance client-side architecture, and developer privacy standards.';
        const url = 'https://stackkit.com.br/about';

        document.title = title;
        updateMetaTag('meta[name="description"]', 'content', desc);
        updateMetaTag('link[rel="canonical"]', 'href', url);
        updateMetaTag('meta[property="og:title"]', 'content', title);
        updateMetaTag('meta[property="og:description"]', 'content', desc);
        updateMetaTag('meta[property="og:url"]', 'content', url);
      }
    } else if (activeToolId) {
      const tool = tools.find(t => t.id === activeToolId);
      if (tool) {
        const titleName = lang === 'pt' ? tool.name : (tool.nameEn || tool.name);
        const desc = lang === 'pt' ? tool.description : (tool.descriptionEn || tool.description);
        const fullTitle = `${titleName} — ${lang === 'pt' ? 'Ferramenta Online Gratuita' : 'Free Online Developer Tool'} | StackKit DevStudio`;
        const fullDesc = `${desc}. ${lang === 'pt' ? 'Ferramenta gratuita, segura e client-side com resultados instantâneos.' : 'Free, private, client-side tool with instant results.'}`;
        const canonicalUrl = `https://stackkit.com.br/${tool.id}`;

        document.title = fullTitle;
        updateMetaTag('meta[name="description"]', 'content', fullDesc);
        updateMetaTag('link[rel="canonical"]', 'href', canonicalUrl);
        updateMetaTag('meta[property="og:title"]', 'content', fullTitle);
        updateMetaTag('meta[property="og:description"]', 'content', fullDesc);
        updateMetaTag('meta[property="og:url"]', 'content', canonicalUrl);
        updateMetaTag('meta[name="twitter:title"]', 'content', fullTitle);
        updateMetaTag('meta[name="twitter:description"]', 'content', fullDesc);
      }
    } else {
      const defaultTitle = lang === 'pt'
        ? 'StackKit DevStudio — Mais de 40 Ferramentas Gratuitas para Desenvolvedores'
        : 'StackKit DevStudio — 40+ Free Developer Tools, World Clock & Color Palette Generator';
      const defaultDesc = lang === 'pt'
        ? 'Estúdio all-in-one para desenvolvedores com mais de 40 utilitários client-side gratuitos: World Time Buddy, gerador de paleta de cores Coolors, gerador de QR Code, formatadores JSON/SQL e codificadores Base64/JWT.'
        : 'All-in-one developer workstation with 40+ free client-side utilities: World Time Buddy, Coolors palette generator, QR Code generator, JSON/SQL formatters, Base64/JWT encoders.';
      const homeUrl = 'https://stackkit.com.br/';

      document.title = defaultTitle;
      updateMetaTag('meta[name="description"]', 'content', defaultDesc);
      updateMetaTag('link[rel="canonical"]', 'href', homeUrl);
      updateMetaTag('meta[property="og:title"]', 'content', defaultTitle);
      updateMetaTag('meta[property="og:description"]', 'content', defaultDesc);
      updateMetaTag('meta[property="og:url"]', 'content', homeUrl);
      updateMetaTag('meta[name="twitter:title"]', 'content', defaultTitle);
      updateMetaTag('meta[name="twitter:description"]', 'content', defaultDesc);
    }
  }, [activeToolId, compliancePage, lang]);

  // Clean Path & Hash Router (supports /jwt-inspector, /privacy-policy, /terms-of-service, /about)
  useEffect(() => {
    const resolveToolFromUrl = () => {
      const pathnameSlug = window.location.pathname.replace(/^\/|\/$/g, '').trim().toLowerCase();
      const rawHash = window.location.hash.replace(/^#\/?/, '').trim().split('?')[0].toLowerCase();
      const currentSlug = pathnameSlug || rawHash;

      // Compliance routes
      if (['privacy-policy', 'privacidade'].includes(currentSlug)) {
        setCompliancePage('privacy-policy');
        return null;
      }
      if (['terms-of-service', 'termos', 'termos-de-uso'].includes(currentSlug)) {
        setCompliancePage('terms-of-service');
        return null;
      }
      if (['about', 'sobre'].includes(currentSlug)) {
        setCompliancePage('about');
        return null;
      }

      setCompliancePage(null);

      // 1. Injected from static HTML page
      if (typeof window !== 'undefined' && window.__INITIAL_TOOL_ID__) {
        const found = findToolByIdOrAlias(window.__INITIAL_TOOL_ID__);
        if (found) return found.id;
      }

      // 2. From pathname (e.g. /jwt-inspector or /canadian-citizenship-test)
      if (pathnameSlug && pathnameSlug !== 'index.html') {
        const found = findToolByIdOrAlias(pathnameSlug);
        if (found) return found.id;
      }

      // 3. From hash (backward-compatibility for /#jwt-inspector)
      if (rawHash) {
        const found = findToolByIdOrAlias(rawHash);
        if (found) return found.id;
      }

      return null;
    };

    const handleLocationChange = () => {
      const toolId = resolveToolFromUrl();
      if (toolId) {
        openTool(toolId, false);
      } else if (window.location.pathname === '/' && !window.location.hash) {
        setActiveToolId(null);
        setCompliancePage(null);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Global Keyboard shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Tool Opening & Tabs Management (Clean URL path synchronization)
  const openTool = (rawToolId, updateHistory = true) => {
    setCompliancePage(null);
    if (!rawToolId) {
      setActiveToolId(null);
      if (window.location.pathname !== '/' || window.location.hash) {
        window.history.pushState(null, '', `/${window.location.search}`);
      }
      return;
    }

    const found = findToolByIdOrAlias(rawToolId);
    const canonicalId = found ? found.id : rawToolId;

    setActiveToolId(canonicalId);

    const targetPath = `/${canonicalId}`;
    if (updateHistory) {
      if (window.location.pathname !== targetPath || window.location.hash) {
        window.history.pushState({ toolId: canonicalId }, '', targetPath + window.location.search);
      }
    } else {
      // Normalize URL to clean path without hash
      if (window.location.pathname !== targetPath || window.location.hash) {
        window.history.replaceState({ toolId: canonicalId }, '', targetPath + window.location.search);
      }
    }

    setOpenToolIds(prev => (prev.includes(canonicalId) ? prev : [...prev, canonicalId]));
    setMobileOpen(false);
  };

  const closeTab = (rawToolId) => {
    const canonicalId = findToolByIdOrAlias(rawToolId)?.id || rawToolId;
    setOpenToolIds(prev => {
      const nextTabs = prev.filter(id => id !== canonicalId);
      if (activeToolId === canonicalId) {
        if (nextTabs.length > 0) {
          const nextTool = nextTabs[nextTabs.length - 1];
          openTool(nextTool, true);
        } else {
          setActiveToolId(null);
          window.history.pushState(null, '', `/${window.location.search}`);
        }
      }
      return nextTabs;
    });
  };

  const toggleFavorite = (rawToolId) => {
    const canonicalId = findToolByIdOrAlias(rawToolId)?.id || rawToolId;
    setFavorites(prev => {
      const isFav = prev.includes(canonicalId);
      const next = isFav ? prev.filter(id => id !== canonicalId) : [...prev, canonicalId];
      addToast(isFav ? 'Removido dos favoritos' : 'Adicionado aos favoritos ⭐');
      return next;
    });
  };

  const openRandomTool = () => {
    const rand = tools[Math.floor(Math.random() * tools.length)];
    openTool(rand.id);
    addToast(`Ferramenta aleatória: ${rand.name}`);
  };

  const navigateToCompliance = (pageSlug) => {
    setActiveToolId(null);
    setCompliancePage(pageSlug);
    if (window.location.pathname !== `/${pageSlug}`) {
      window.history.pushState(null, '', `/${pageSlug}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <Sidebar
        activeToolId={activeToolId}
        activeCategory={activeCategory}
        onSelectCategory={(catId) => {
          setCompliancePage(null);
          setActiveCategory(catId);
          setActiveToolId(null);
          setMobileOpen(false);
        }}
        onSelectTool={openTool}
        onGoHome={() => {
          setCompliancePage(null);
          setActiveCategory('all');
          setActiveToolId(null);
          setMobileOpen(false);
          if (window.location.pathname !== '/' || window.location.hash) {
            window.history.pushState(null, '', '/');
          }
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
        favorites={favorites}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        lang={lang}
        onToggleLang={handleToggleLang}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Workspace Frame */}
      <div className="app-main">
        {/* Header Bar */}
        <AppHeader
          activeToolId={activeToolId}
          activeCategory={activeCategory}
          onGoHome={() => {
            setCompliancePage(null);
            setActiveCategory('all');
            setActiveToolId(null);
            if (window.location.pathname !== '/' || window.location.hash) {
              window.history.pushState(null, '', '/');
            }
          }}
          onSelectCategory={(catId) => {
            setCompliancePage(null);
            setActiveCategory(catId);
            setActiveToolId(null);
          }}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onRandomTool={openRandomTool}
          onToggleMobile={() => setMobileOpen(prev => !prev)}
          onShowAbout={() => navigateToCompliance('about')}
          lang={lang}
        />

        {/* Multi-Tool Workspace Tabs Strip */}
        <ToolTabs
          openToolIds={openToolIds}
          activeToolId={activeToolId}
          onSelectTab={openTool}
          onCloseTab={closeTab}
          onOpenNew={() => setCommandPaletteOpen(true)}
          lang={lang}
        />

        {/* Content Body Area */}
        <main className="app-content-body custom-scrollbar">
          {compliancePage === 'privacy-policy' ? (
            <PrivacyPolicy onGoBack={() => openTool(null)} lang={lang} />
          ) : compliancePage === 'terms-of-service' ? (
            <TermsOfService onGoBack={() => openTool(null)} lang={lang} />
          ) : compliancePage === 'about' ? (
            <AboutUs onGoBack={() => openTool(null)} lang={lang} />
          ) : activeToolId ? (
            <ToolLayout
              toolId={activeToolId}
              onGoBack={() => openTool(null)}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onToast={addToast}
              lang={lang}
              onSelectTool={openTool}
              onNavigateCompliance={navigateToCompliance}
            />
          ) : (
            <CatalogView
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              onSelectTool={openTool}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              lang={lang}
              onNavigateCompliance={navigateToCompliance}
            />
          )}
        </main>
      </div>

      {/* Universal Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectTool={openTool}
        favorites={favorites}
        lang={lang}
      />

      {/* Toast Feedback */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* About Modal */}
      {aboutOpen && (
        <div className="command-palette-backdrop" onClick={() => setAboutOpen(false)}>
          <div className="command-palette" onClick={e => e.stopPropagation()} style={{ maxWidth: 520, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="brand-logo-icon">
                  <Code2 size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800 }}>StackKit DevStudio</h3>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {lang === 'pt' ? 'Versão 2.1.0 · React 19 & Vite' : 'Version 2.1.0 · React 19 & Vite'}
                  </div>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setAboutOpen(false)} aria-label={lang === 'pt' ? 'Fechar' : 'Close'}>
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p>
                {lang === 'pt' ? (
                  <>O <strong>StackKit DevStudio</strong> foi desenvolvido para oferecer a experiência mais rápida, completa e elegante para desenvolvedores e equipes globais.</>
                ) : (
                  <><strong>StackKit DevStudio</strong> was engineered to provide the fastest, most comprehensive, and elegant experience for developers and global teams.</>
                )}
              </p>
              <p>
                {lang === 'pt' ? (
                  <>Apresenta 40 ferramentas essenciais, incluindo gerador de paleta de cores (estilo Coolors), conversor de fuso horário mundial (World Time Buddy), geradores de QR Code/senhas/hashes, formatadores e codificadores, com execução 100% no seu navegador.</>
                ) : (
                  <>Features 40 essential developer utilities including a color palette generator (Coolors style), world time converter (World Time Buddy), QR Code / password / hash generators, formatters, and encoders — running 100% client-side in your browser.</>
                )}
              </p>
              <div style={{
                padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)', fontSize: 12
              }}>
                {lang === 'pt' ? (
                  <>🔒 <strong>100% Client-Side & Privado:</strong> Seus dados, textos e códigos nunca saem do seu computador.</>
                ) : (
                  <>🔒 <strong>100% Client-Side & Private:</strong> Your data, text, and code never leave your browser.</>
                )}
              </div>
            </div>

            <div style={{ marginTop: 20, textAlign: 'right' }}>
              <button className="btn-primary" onClick={() => setAboutOpen(false)}>
                {lang === 'pt' ? 'Entendido' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
