import React, { useState, useEffect } from 'react';
import { tools, categories, findToolByIdOrAlias } from './data/toolsData';
import Sidebar from './components/Sidebar';
import AppHeader from './components/AppHeader';
import ToolTabs from './components/ToolTabs';
import CommandPalette from './components/CommandPalette';
import ToastContainer from './components/ToastContainer';
import CatalogView from './components/CatalogView';
import ToolLayout from './components/ToolLayout';
import { X, Check, Shield, Zap, Terminal, Code2 } from 'lucide-react';
import './App.css';

export default function App() {
  const [activeToolId, setActiveToolId] = useState(null);
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

  const [lang, setLang] = useState(() => {
    return localStorage.getItem('stackkit_lang') || 'pt';
  });

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

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('stackkit_theme', theme);
  }, [theme]);

  // Sync lang
  useEffect(() => {
    localStorage.setItem('stackkit_lang', lang);
  }, [lang]);

  // Sync favorites
  useEffect(() => {
    localStorage.setItem('stackkit_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Sync sidebar
  useEffect(() => {
    localStorage.setItem('stackkit_sidebar_collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Dynamic SEO metadata updates
  useEffect(() => {
    if (activeToolId) {
      const tool = tools.find(t => t.id === activeToolId);
      if (tool) {
        document.title = `${tool.nameEn} — Free Online Developer Tool | StackKit DevStudio`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute(
            'content',
            `${tool.descriptionEn}. Free, private, client-side tool with instant results.`
          );
        }
      }
    } else {
      document.title = 'StackKit DevStudio — 40+ Free Developer Tools, World Clock & Color Palette Generator';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'All-in-one developer workstation with 40+ free client-side utilities: World Time Buddy, Coolors palette generator, QR Code generator, JSON/SQL formatters, Base64/JWT encoders.'
        );
      }
    }
  }, [activeToolId]);

  // English & Alias Hash Router
  useEffect(() => {
    const handleHash = () => {
      const rawHash = window.location.hash.replace('#', '').trim();
      if (rawHash) {
        const found = findToolByIdOrAlias(rawHash);
        if (found) {
          // If the URL has an alias, replace with canonical English slug
          if (rawHash !== found.id) {
            window.location.replace(`#${found.id}`);
          }
          openTool(found.id);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
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

  // Tool Opening & Tabs Management (Guaranteed ZERO Duplication)
  const openTool = (rawToolId) => {
    if (!rawToolId) {
      setActiveToolId(null);
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      return;
    }

    const found = findToolByIdOrAlias(rawToolId);
    const canonicalId = found ? found.id : rawToolId;

    setActiveToolId(canonicalId);

    if (window.location.hash !== `#${canonicalId}`) {
      window.location.hash = canonicalId;
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
          setActiveToolId(nextTool);
          window.location.hash = nextTool;
        } else {
          setActiveToolId(null);
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
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

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <Sidebar
        activeToolId={activeToolId}
        activeCategory={activeCategory}
        onSelectCategory={(catId) => {
          setActiveCategory(catId);
          setActiveToolId(null);
          setMobileOpen(false);
        }}
        onSelectTool={openTool}
        onGoHome={() => {
          setActiveCategory('all');
          setActiveToolId(null);
          setMobileOpen(false);
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
        favorites={favorites}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        lang={lang}
        onToggleLang={() => setLang(l => l === 'pt' ? 'en' : 'pt')}
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
            setActiveCategory('all');
            setActiveToolId(null);
          }}
          onSelectCategory={(catId) => {
            setActiveCategory(catId);
            setActiveToolId(null);
          }}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onRandomTool={openRandomTool}
          onToggleMobile={() => setMobileOpen(prev => !prev)}
          onShowAbout={() => setAboutOpen(true)}
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
          {activeToolId ? (
            <ToolLayout
              toolId={activeToolId}
              onGoBack={() => openTool(null)}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onToast={addToast}
              lang={lang}
            />
          ) : (
            <CatalogView
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              onSelectTool={openTool}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              lang={lang}
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
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Versão 2.1.0 · React 19 & Vite</div>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setAboutOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p>
                O <strong>StackKit DevStudio</strong> foi desenvolvido para oferecer a experiência mais rápida, completa e elegante para desenvolvedores e equipes globais.
              </p>
              <p>
                Apresenta 40 ferramentas essenciais, incluindo gerador de paleta de cores (estilo Coolors), conversor de fuso horário mundial (World Time Buddy), geradores de QR Code/senhas/hashes, formatadores e codificadores, com execução 100% no seu navegador.
              </p>
              <div style={{
                padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)', fontSize: 12
              }}>
                🔒 <strong>100% Client-Side & Privado:</strong> Seus dados, textos e códigos nunca saem do seu computador.
              </div>
            </div>

            <div style={{ marginTop: 20, textAlign: 'right' }}>
              <button className="btn-primary" onClick={() => setAboutOpen(false)}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
