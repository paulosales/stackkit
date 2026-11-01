import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { tools, categories, findToolByIdOrAlias, getToolName, getToolDescription, getCategoryName } from './data/toolsData';
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

// Clean URL path and hash parser with language prefix support
export function parseUrlPath(pathname = '', hash = '') {
  const cleanPath = (pathname || '').replace(/^\/+|\/+$/g, '').trim().toLowerCase();
  const rawHash = (hash || '').replace(/^#\/?/, '').trim().split('?')[0].toLowerCase();
  const full = cleanPath || rawHash;

  const parts = full.split('/').filter(Boolean);
  let detectedLang = null;
  let remainingSlug = '';

  if (parts.length > 0 && (parts[0] === 'en' || parts[0] === 'pt' || parts[0] === 'es')) {
    detectedLang = parts[0];
    remainingSlug = parts.slice(1).join('/');
  } else {
    remainingSlug = full;
  }

  return { detectedLang, slug: remainingSlug };
}

// Detect default language from URL, user's explicit preference, or browser preferences
function getInitialLanguage() {
  if (typeof window !== 'undefined') {
    const { detectedLang } = parseUrlPath(window.location.pathname, window.location.hash);
    if (detectedLang) {
      return detectedLang;
    }
    if (window.__INITIAL_LANG__ === 'pt' || window.__INITIAL_LANG__ === 'en' || window.__INITIAL_LANG__ === 'es') {
      return window.__INITIAL_LANG__;
    }
  }

  try {
    const userSelected = localStorage.getItem('stackkit_user_lang');
    if (userSelected === 'pt' || userSelected === 'en' || userSelected === 'es') {
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
      if (clean.startsWith('es')) return 'es';
      if (clean.startsWith('en')) return 'en';
    }
  } catch {
    // Ignore navigator errors
  }

  // Fallback to English for international users
  return 'en';
}

const DEFAULT_FAVORITES = [
  'pix-generator',
  'email-signature-generator',
  'color-palette-generator',
  'password-generator',
  'whatsapp-link-generator',
  'world-time-buddy',
  'canadian-citizenship-test'
];

export default function App() {
  const { t, i18n } = useTranslation();
  const [activeToolId, setActiveToolId] = useState(null);
  const [compliancePage, setCompliancePage] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [openToolIds, setOpenToolIds] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('stackkit_favorites');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Automatically migrate users having legacy default 4 favorites
        const legacyDefault = ['cpf-generator', 'json-formatter', 'pix-generator', 'jwt-inspector'];
        const isLegacy = Array.isArray(parsed) &&
          parsed.length === legacyDefault.length &&
          legacyDefault.every(id => parsed.includes(id));
        if (!isLegacy && Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return DEFAULT_FAVORITES;
    } catch {
      return DEFAULT_FAVORITES;
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
    const nextLang = lang === 'pt' ? 'en' : lang === 'en' ? 'es' : 'pt';
    setLang(nextLang);
    try {
      localStorage.setItem('stackkit_user_lang', nextLang);
      localStorage.setItem('stackkit_lang', nextLang);
    } catch {
      // ignore
    }

    if (compliancePage) {
      const targetPath = `/${nextLang}/${compliancePage}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath + window.location.search);
      }
    } else if (activeToolId) {
      const targetPath = `/${nextLang}/${activeToolId}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ toolId: activeToolId }, '', targetPath + window.location.search);
      }
    } else {
      const targetPath = `/${nextLang}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath + window.location.search);
      }
    }
  };

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('stackkit_theme', theme);
  }, [theme]);

  // Sync lang to document html tag and i18next
  useEffect(() => {
    document.documentElement.lang = lang;
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

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

    const updateAlternateLinks = (slugPath = '') => {
      const enUrl = `https://stackkit.com.br/en${slugPath ? `/${slugPath}` : ''}`;
      const ptUrl = `https://stackkit.com.br/pt${slugPath ? `/${slugPath}` : ''}`;
      const esUrl = `https://stackkit.com.br/es${slugPath ? `/${slugPath}` : ''}`;

      let enLink = document.querySelector('link[rel="alternate"][hreflang="en"]');
      if (!enLink) {
        enLink = document.createElement('link');
        enLink.setAttribute('rel', 'alternate');
        enLink.setAttribute('hreflang', 'en');
        document.head.appendChild(enLink);
      }
      enLink.setAttribute('href', enUrl);

      let ptLink = document.querySelector('link[rel="alternate"][hreflang="pt"]');
      if (!ptLink) {
        ptLink = document.createElement('link');
        ptLink.setAttribute('rel', 'alternate');
        ptLink.setAttribute('hreflang', 'pt');
        document.head.appendChild(ptLink);
      }
      ptLink.setAttribute('href', ptUrl);

      let esLink = document.querySelector('link[rel="alternate"][hreflang="es"]');
      if (!esLink) {
        esLink = document.createElement('link');
        esLink.setAttribute('rel', 'alternate');
        esLink.setAttribute('hreflang', 'es');
        document.head.appendChild(esLink);
      }
      esLink.setAttribute('href', esUrl);

      let defLink = document.querySelector('link[rel="alternate"][hreflang="x-default"]');
      if (!defLink) {
        defLink = document.createElement('link');
        defLink.setAttribute('rel', 'alternate');
        defLink.setAttribute('hreflang', 'x-default');
        document.head.appendChild(defLink);
      }
      defLink.setAttribute('href', enUrl);
    };

    const ogLocale = lang === 'pt' ? 'pt_BR' : lang === 'es' ? 'es_ES' : 'en_US';

    if (compliancePage) {
      if (compliancePage === 'privacy-policy') {
        const title = t('seo.privacyPolicy.title');
        const desc = t('seo.privacyPolicy.desc');
        const url = `https://stackkit.com.br/${lang}/privacy-policy`;
        const ogImage = `https://stackkit.com.br/og/${lang}/privacy-policy.png`;

        document.title = title;
        updateMetaTag('meta[name="description"]', 'content', desc);
        updateMetaTag('link[rel="canonical"]', 'href', url);
        updateAlternateLinks('privacy-policy');
        updateMetaTag('meta[property="og:title"]', 'content', title);
        updateMetaTag('meta[property="og:description"]', 'content', desc);
        updateMetaTag('meta[property="og:url"]', 'content', url);
        updateMetaTag('meta[property="og:locale"]', 'content', ogLocale);
        updateMetaTag('meta[property="og:image"]', 'content', ogImage);
        updateMetaTag('meta[name="twitter:image"]', 'content', ogImage);
        updateMetaTag('meta[name="twitter:title"]', 'content', title);
        updateMetaTag('meta[name="twitter:description"]', 'content', desc);
      } else if (compliancePage === 'terms-of-service') {
        const title = t('seo.termsOfService.title');
        const desc = t('seo.termsOfService.desc');
        const url = `https://stackkit.com.br/${lang}/terms-of-service`;
        const ogImage = `https://stackkit.com.br/og/${lang}/terms-of-service.png`;

        document.title = title;
        updateMetaTag('meta[name="description"]', 'content', desc);
        updateMetaTag('link[rel="canonical"]', 'href', url);
        updateAlternateLinks('terms-of-service');
        updateMetaTag('meta[property="og:title"]', 'content', title);
        updateMetaTag('meta[property="og:description"]', 'content', desc);
        updateMetaTag('meta[property="og:url"]', 'content', url);
        updateMetaTag('meta[property="og:locale"]', 'content', ogLocale);
        updateMetaTag('meta[property="og:image"]', 'content', ogImage);
        updateMetaTag('meta[name="twitter:image"]', 'content', ogImage);
        updateMetaTag('meta[name="twitter:title"]', 'content', title);
        updateMetaTag('meta[name="twitter:description"]', 'content', desc);
      } else if (compliancePage === 'about') {
        const title = t('seo.about.title');
        const desc = t('seo.about.desc');
        const url = `https://stackkit.com.br/${lang}/about`;
        const ogImage = `https://stackkit.com.br/og/${lang}/about.png`;

        document.title = title;
        updateMetaTag('meta[name="description"]', 'content', desc);
        updateMetaTag('link[rel="canonical"]', 'href', url);
        updateAlternateLinks('about');
        updateMetaTag('meta[property="og:title"]', 'content', title);
        updateMetaTag('meta[property="og:description"]', 'content', desc);
        updateMetaTag('meta[property="og:url"]', 'content', url);
        updateMetaTag('meta[property="og:locale"]', 'content', ogLocale);
        updateMetaTag('meta[property="og:image"]', 'content', ogImage);
        updateMetaTag('meta[name="twitter:image"]', 'content', ogImage);
        updateMetaTag('meta[name="twitter:title"]', 'content', title);
        updateMetaTag('meta[name="twitter:description"]', 'content', desc);
      }
    } else if (activeToolId) {
      const tool = tools.find(t => t.id === activeToolId);
      if (tool) {
        const titleName = getToolName(tool, lang);
        const desc = getToolDescription(tool, lang);
        const fullTitle = `${titleName} — ${t('seo.toolTitleSuffix')} | StackKit DevStudio`;
        const fullDesc = `${desc}. ${t('seo.toolDescSuffix')}`;
        const canonicalUrl = `https://stackkit.com.br/${lang}/${tool.id}`;
        const toolOgImage = `https://stackkit.com.br/og/${lang}/${tool.id}.png`;

        document.title = fullTitle;
        updateMetaTag('meta[name="description"]', 'content', fullDesc);
        updateMetaTag('link[rel="canonical"]', 'href', canonicalUrl);
        updateAlternateLinks(tool.id);
        updateMetaTag('meta[property="og:title"]', 'content', fullTitle);
        updateMetaTag('meta[property="og:description"]', 'content', fullDesc);
        updateMetaTag('meta[property="og:url"]', 'content', canonicalUrl);
        updateMetaTag('meta[property="og:locale"]', 'content', ogLocale);
        updateMetaTag('meta[property="og:image"]', 'content', toolOgImage);
        updateMetaTag('meta[name="twitter:image"]', 'content', toolOgImage);
        updateMetaTag('meta[name="twitter:title"]', 'content', fullTitle);
        updateMetaTag('meta[name="twitter:description"]', 'content', fullDesc);
      }
    } else {
      const defaultTitle = t('seo.defaultTitle');
      const defaultDesc = t('seo.defaultDesc');
      const homeUrl = `https://stackkit.com.br/${lang}`;
      const defaultOgImage = `https://stackkit.com.br/og/${lang}/default.png`;

      document.title = defaultTitle;
      updateMetaTag('meta[name="description"]', 'content', defaultDesc);
      updateMetaTag('link[rel="canonical"]', 'href', homeUrl);
      updateAlternateLinks('');
      updateMetaTag('meta[property="og:title"]', 'content', defaultTitle);
      updateMetaTag('meta[property="og:description"]', 'content', defaultDesc);
      updateMetaTag('meta[property="og:url"]', 'content', homeUrl);
      updateMetaTag('meta[property="og:locale"]', 'content', ogLocale);
      updateMetaTag('meta[property="og:image"]', 'content', defaultOgImage);
      updateMetaTag('meta[name="twitter:image"]', 'content', defaultOgImage);
      updateMetaTag('meta[name="twitter:title"]', 'content', defaultTitle);
      updateMetaTag('meta[name="twitter:description"]', 'content', defaultDesc);
    }
  }, [activeToolId, compliancePage, lang]);

  // Clean Path & Hash Router (supports /en/..., /pt/..., compliance pages, and aliases)
  useEffect(() => {
    const handleLocationChange = () => {
      const { detectedLang, slug } = parseUrlPath(window.location.pathname, window.location.hash);

      const activeLang = detectedLang || lang;
      if (detectedLang && detectedLang !== lang) {
        setLang(detectedLang);
        try {
          localStorage.setItem('stackkit_user_lang', detectedLang);
          localStorage.setItem('stackkit_lang', detectedLang);
        } catch {
          // ignore
        }
      }

      // Compliance routes
      if (['privacy-policy', 'privacidade'].includes(slug)) {
        setCompliancePage('privacy-policy');
        setActiveToolId(null);
        const expectedPath = `/${activeLang}/privacy-policy`;
        if (window.location.pathname !== expectedPath || window.location.hash) {
          window.history.replaceState(null, '', expectedPath + window.location.search);
        }
        return;
      }
      if (['terms-of-service', 'termos', 'termos-de-uso'].includes(slug)) {
        setCompliancePage('terms-of-service');
        setActiveToolId(null);
        const expectedPath = `/${activeLang}/terms-of-service`;
        if (window.location.pathname !== expectedPath || window.location.hash) {
          window.history.replaceState(null, '', expectedPath + window.location.search);
        }
        return;
      }
      if (['about', 'sobre'].includes(slug)) {
        setCompliancePage('about');
        setActiveToolId(null);
        const expectedPath = `/${activeLang}/about`;
        if (window.location.pathname !== expectedPath || window.location.hash) {
          window.history.replaceState(null, '', expectedPath + window.location.search);
        }
        return;
      }

      setCompliancePage(null);

      // Injected tool ID from static preloader
      let toolId = null;
      if (typeof window !== 'undefined' && window.__INITIAL_TOOL_ID__) {
        const found = findToolByIdOrAlias(window.__INITIAL_TOOL_ID__);
        if (found) toolId = found.id;
      }

      // Resolve from URL slug
      if (!toolId && slug && slug !== 'index.html') {
        const found = findToolByIdOrAlias(slug);
        if (found) toolId = found.id;
      }

      if (toolId) {
        setActiveToolId(toolId);
        setOpenToolIds(prev => (prev.includes(toolId) ? prev : [...prev, toolId]));
        const expectedPath = `/${activeLang}/${toolId}`;
        if (window.location.pathname !== expectedPath || window.location.hash) {
          window.history.replaceState({ toolId }, '', expectedPath + window.location.search);
        }
      } else {
        setActiveToolId(null);
        setCompliancePage(null);
        if (detectedLang) {
          const expectedPath = `/${detectedLang}`;
          if (window.location.pathname !== expectedPath && window.location.pathname !== `${expectedPath}/`) {
            window.history.replaceState(null, '', expectedPath + window.location.search);
          }
        }
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [lang]);

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
      const targetPath = `/${lang}`;
      if (window.location.pathname !== targetPath && window.location.pathname !== `/${lang}/`) {
        window.history.pushState(null, '', targetPath + window.location.search);
      }
      return;
    }

    const found = findToolByIdOrAlias(rawToolId);
    const canonicalId = found ? found.id : rawToolId;

    setActiveToolId(canonicalId);

    const targetPath = `/${lang}/${canonicalId}`;
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
          window.history.pushState(null, '', `/${lang}${window.location.search}`);
        }
      }
      return nextTabs;
    });
  };

  const toggleFavorite = (rawToolId) => {
    const canonicalId = findToolByIdOrAlias(rawToolId)?.id || rawToolId;
    const isFav = favorites.includes(canonicalId);
    setFavorites(prev => (isFav ? prev.filter(id => id !== canonicalId) : [...prev, canonicalId]));
    if (isFav) {
      addToast(t('toasts.favoriteRemoved'));
    } else {
      addToast(t('toasts.favoriteAdded'));
    }
  };

  const openRandomTool = () => {
    const rand = tools[Math.floor(Math.random() * tools.length)];
    openTool(rand.id);
    const toolName = getToolName(rand, lang);
    addToast(t('toasts.randomTool', { toolName }));
  };

  const navigateToCompliance = (pageSlug) => {
    setActiveToolId(null);
    setCompliancePage(pageSlug);
    const targetPath = `/${lang}/${pageSlug}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
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
          const targetPath = `/${lang}`;
          if (window.location.pathname !== targetPath && window.location.pathname !== `/${lang}/`) {
            window.history.pushState(null, '', targetPath);
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
            const targetPath = `/${lang}`;
            if (window.location.pathname !== targetPath && window.location.pathname !== `/${lang}/`) {
              window.history.pushState(null, '', targetPath);
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
                    {t('about.version')}
                  </div>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setAboutOpen(false)} aria-label={t('about.close')}>
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p>
                {t('about.missionText')}
              </p>
              <p>
                {t('about.standardsText')}
              </p>
              <div style={{
                padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)', fontSize: 12
              }}>
                🔒 <strong>{t('catalog.zeroStorageTitle')}:</strong> {t('catalog.zeroStorageDesc')}
              </div>
            </div>

            <div style={{ marginTop: 20, textAlign: 'right' }}>
              <button className="btn-primary" onClick={() => setAboutOpen(false)}>
                {t('about.gotIt')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
