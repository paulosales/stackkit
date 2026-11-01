import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ChevronLeft, ChevronRight, Search, Star, Layers,
  Sun, Moon, Globe, Code2, Sparkles
} from 'lucide-react';
import { categories, tools, getToolName, getCategoryName } from '../data/toolsData';
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
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || lang || 'pt';
  const favoritedTools = tools.filter(t => favorites.includes(t.id) || (t.aliasIds && t.aliasIds.some(a => favorites.includes(a))));

  return (
    <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-container" onClick={onGoHome} title="StackKit Home">
          {!collapsed && (
            <div className="brand-logo-icon">
              <Code2 size={20} />
            </div>
          )}
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
          title={collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
          aria-label={collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Quick Search Button */}
      <div className="sidebar-search-box">
        <button className="sidebar-search-btn" onClick={onOpenCommandPalette}>
          <div className="sidebar-search-btn-left">
            <Search size={15} />
            {!collapsed && <span>{t('sidebar.search')}</span>}
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
            title={t('sidebar.catalog')}
          >
            <div className="sidebar-menu-item-icon">
              <Layers size={18} />
            </div>
            {!collapsed && (
              <>
                <span className="sidebar-menu-item-label">{t('sidebar.allTools')}</span>
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
                <span>{t('sidebar.favorites')}</span>
                <Star size={12} fill="var(--accent-amber)" color="var(--accent-amber)" />
              </div>
            )}
            <ul className="sidebar-menu-list">
              {favoritedTools.map(tool => {
                const toolName = getToolName(tool, currentLang);
                return (
                  <li
                    key={tool.id}
                    className={`sidebar-menu-item ${activeToolId === tool.id ? 'active' : ''}`}
                    onClick={() => onSelectTool(tool.id)}
                    title={toolName}
                  >
                    <div className="sidebar-menu-item-icon" style={{ color: 'var(--accent-amber)' }}>
                      <DynamicIcon name={tool.icon} size={16} />
                    </div>
                    {!collapsed && (
                      <span className="sidebar-menu-item-label">{toolName}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Categories */}
        <div>
          {!collapsed && (
            <div className="sidebar-section-title">
              <span>{t('sidebar.categories')}</span>
            </div>
          )}
          <ul className="sidebar-menu-list">
            {categories.filter(c => c.id !== 'all').map(cat => {
              const count = tools.filter(t => t.categoryId === cat.id).length;
              const isCatActive = !activeToolId && activeCategory === cat.id;
              const catName = t(`categories.${cat.id}`, { defaultValue: getCategoryName(cat, currentLang) });

              return (
                <li
                  key={cat.id}
                  className={`sidebar-menu-item ${isCatActive ? 'active' : ''}`}
                  onClick={() => onSelectCategory(cat.id)}
                  title={catName}
                >
                  <div className="sidebar-menu-item-icon">
                    <DynamicIcon name={cat.icon} size={17} />
                  </div>
                  {!collapsed && (
                    <>
                      <span className="sidebar-menu-item-label">{catName}</span>
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
      <div className={`sidebar-footer ${collapsed ? 'collapsed' : ''}`}>
        <button
          className="header-control-btn"
          onClick={onToggleTheme}
          title={theme === 'dark' ? t('sidebar.theme.switchToLight') : t('sidebar.theme.switchToDark')}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          {!collapsed && <span>{theme === 'dark' ? t('sidebar.theme.light') : t('sidebar.theme.dark')}</span>}
        </button>

        <button
          className="header-control-btn"
          onClick={onToggleLang}
          title={t(`sidebar.lang.switchTo_${currentLang === 'pt' ? 'en' : currentLang === 'en' ? 'es' : 'pt'}`)}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Globe size={15} />
          {!collapsed && <span>{currentLang.toUpperCase()}</span>}
        </button>
      </div>
    </aside>
  );
}
