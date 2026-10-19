import React from 'react';
import { 
  ChevronLeft, ChevronRight, Search, Star, Layers,
  Sun, Moon, Globe, Code2, Sparkles
} from 'lucide-react';
import { categories, tools } from '../data/toolsData';
import DynamicIcon from './DynamicIcon';

export default function Sidebar({
  activeToolId,
  activeCategory,
  onSelectCategory,
  onSelectTool,
  onGoHome,
  collapsed,
  onToggleCollapse,
  favorites = [],
  onOpenCommandPalette,
  theme,
  onToggleTheme,
  lang,
  onToggleLang,
  mobileOpen,
  onCloseMobile
}) {
  const favoritedTools = tools.filter(t => favorites.includes(t.id) || (t.aliasIds && t.aliasIds.some(a => favorites.includes(a))));

  return (
    <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-container" onClick={onGoHome} title="StackKit Home">
          <div className="brand-logo-icon">
            <Code2 size={20} />
          </div>
          {!collapsed && (
            <div className="brand-text">
              <span className="brand-title">Stack<span>Kit</span></span>
              <span className="brand-subtitle">Dev Studio</span>
            </div>
          )}
        </div>
        <button
          className="sidebar-collapse-btn"
          onClick={onToggleCollapse}
          title={collapsed ? 'Expandir Menu' : 'Recolher Menu'}
          aria-label="Toggle Sidebar"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Quick Search Button */}
      <div className="sidebar-search-box">
        <button className="sidebar-search-btn" onClick={onOpenCommandPalette}>
          <div className="sidebar-search-btn-left">
            <Search size={15} />
            {!collapsed && <span>{lang === 'pt' ? 'Buscar...' : 'Search...'}</span>}
          </div>
          {!collapsed && <kbd>⌘K</kbd>}
        </button>
      </div>

      {/* Navigation list */}
      <nav className="sidebar-nav custom-scrollbar">
        {/* Explore Hub link */}
        <ul className="sidebar-menu-list">
          <li
            className={`sidebar-menu-item ${!activeToolId && activeCategory === 'all' ? 'active' : ''}`}
            onClick={onGoHome}
            title={lang === 'pt' ? 'Catálogo Geral' : 'All Tools'}
          >
            <div className="sidebar-menu-item-icon">
              <Layers size={18} />
            </div>
            {!collapsed && (
              <>
                <span className="sidebar-menu-item-label">{lang === 'pt' ? 'Todas as Ferramentas' : 'All Tools'}</span>
                <span className="sidebar-menu-item-badge">{tools.length}</span>
              </>
            )}
          </li>
        </ul>

        {/* Favorites section (if any) */}
        {favoritedTools.length > 0 && (
          <div>
            {!collapsed && (
              <div className="sidebar-section-title">
                <span>{lang === 'pt' ? 'Favoritos' : 'Favorites'}</span>
                <Star size={12} fill="var(--accent-amber)" color="var(--accent-amber)" />
              </div>
            )}
            <ul className="sidebar-menu-list">
              {favoritedTools.map(tool => (
                <li
                  key={tool.id}
                  className={`sidebar-menu-item ${activeToolId === tool.id ? 'active' : ''}`}
                  onClick={() => onSelectTool(tool.id)}
                  title={tool.name}
                >
                  <div className="sidebar-menu-item-icon" style={{ color: 'var(--accent-amber)' }}>
                    <DynamicIcon name={tool.icon} size={16} />
                  </div>
                  {!collapsed && (
                    <span className="sidebar-menu-item-label">{lang === 'pt' ? tool.name : (tool.nameEn || tool.name)}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Categories */}
        <div>
          {!collapsed && (
            <div className="sidebar-section-title">
              <span>{lang === 'pt' ? 'Categorias' : 'Categories'}</span>
            </div>
          )}
          <ul className="sidebar-menu-list">
            {categories.filter(c => c.id !== 'all').map(cat => {
              const count = tools.filter(t => t.categoryId === cat.id).length;
              const isCatActive = !activeToolId && activeCategory === cat.id;

              return (
                <li
                  key={cat.id}
                  className={`sidebar-menu-item ${isCatActive ? 'active' : ''}`}
                  onClick={() => onSelectCategory(cat.id)}
                  title={lang === 'pt' ? cat.name : cat.nameEn}
                >
                  <div className="sidebar-menu-item-icon">
                    <DynamicIcon name={cat.icon} size={17} />
                  </div>
                  {!collapsed && (
                    <>
                      <span className="sidebar-menu-item-label">{lang === 'pt' ? cat.name : cat.nameEn}</span>
                      <span className="sidebar-menu-item-badge">{count}</span>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <button
          className="header-control-btn"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          {!collapsed && <span>{theme === 'dark' ? 'Claro' : 'Escuro'}</span>}
        </button>

        <button
          className="header-control-btn"
          onClick={onToggleLang}
          title={lang === 'pt' ? 'Switch to English' : 'Mudar para Português'}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <Globe size={15} />
          {!collapsed && <span>{lang === 'pt' ? 'PT' : 'EN'}</span>}
        </button>
      </div>
    </aside>
  );
}
