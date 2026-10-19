import React, { useState, useEffect } from 'react';
import { tools, categories } from './data/toolsData';
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
      return saved ? JSON.parse(saved) : ['gerador-de-cpf', 'formatar-json', 'gerador-pix', 'jwt-encode-decode'];
    } catch {
      return ['gerador-de-cpf', 'formatar-json', 'gerador-pix', 'jwt-encode-decode'];
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

  // Hash router
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash && tools.some(t => t.id === hash)) {
        openTool(hash);
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

  // Tool Opening & Tabs Management
  const openTool = (toolId) => {
    if (!toolId) {
      setActiveToolId(null);
      window.location.hash = '';
      return;
    }
    setActiveToolId(toolId);
    window.location.hash = toolId;
    if (!openToolIds.includes(toolId)) {
      setOpenToolIds(prev => [...prev, toolId]);
    }
    setMobileOpen(false);
  };

  const closeTab = (toolId) => {
    const newTabs = openToolIds.filter(id => id !== toolId);
    setOpenToolIds(newTabs);
    if (activeToolId === toolId) {
      if (newTabs.length > 0) {
        openTool(newTabs[newTabs.length - 1]);
      } else {
        openTool(null);
      }
    }
  };

  const toggleFavorite = (toolId) => {
    setFavorites(prev => {
      const isFav = prev.includes(toolId);
      const next = isFav ? prev.filter(id => id !== toolId) : [...prev, toolId];
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
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Versão 2.0.0 · React 19 & Vite</div>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setAboutOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p>
                O <strong>StackKit DevStudio</strong> foi desenvolvido para oferecer a experiência mais rápida, completa e elegante para o dia a dia de desenvolvedores e estudantes de tecnologia.
              </p>
              <p>
                Inspirado nas funcionalidades do <strong>GeraDev</strong>, implementa uma arquitetura moderna baseada em um estúdio com barra de abas multi-tarefas, paleta de comandos rápida (<kbd>Ctrl+K</kbd>), tema escuro/claro e 37 ferramentas 100% processadas no seu navegador.
              </p>
              <div style={{
                padding: 12, borderRadius: 'var(--radius-md)', background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)', fontSize: 12
              }}>
                🔒 <strong>Zero Telemetria de Dados:</strong> Nenhuma informação digitada ou gerada (senhas, CPFs, tokens JWT, payloads) é enviada para servidores.
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
