import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Star, ArrowUpRight, Flame, Sparkles, Shield, Zap, Terminal } from 'lucide-react';
import { tools, categories, getToolName, getToolDescription, getCategoryName } from '../data/toolsData';
import DynamicIcon from './DynamicIcon';

export default function CatalogView({
  activeCategory,
  onSelectCategory,
  onSelectTool,
  favorites = [],
  onToggleFavorite,
  lang = 'pt',
  onNavigateCompliance
}) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || lang;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = tools.filter(tool => {
    // Category match
    if (activeCategory !== 'all' && tool.categoryId !== activeCategory) {
      return false;
    }
    // Search query match
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = tool.name.toLowerCase().includes(q) || (tool.nameEn && tool.nameEn.toLowerCase().includes(q)) || (tool.nameEs && tool.nameEs.toLowerCase().includes(q));
    const descMatch = tool.description.toLowerCase().includes(q) || (tool.descriptionEn && tool.descriptionEn.toLowerCase().includes(q)) || (tool.descriptionEs && tool.descriptionEs.toLowerCase().includes(q));
    const tagMatch = tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(q));
    return nameMatch || descMatch || tagMatch;
  });

  const popularTools = tools.filter(t => t.popular);

  return (
    <div className="catalog-container">
      {/* Hero Header */}
      <section className="catalog-hero">
        <div className="catalog-badge-pill">
          <Sparkles size={14} />
          <span>{t('catalog.badge')}</span>
          <span>·</span>
          <span>{tools.length} {t('sidebar.allTools')}</span>
        </div>

        <h1 className="catalog-hero-title">
          {t('catalog.heroTitle')}
        </h1>

        <p className="catalog-hero-desc">
          {t('catalog.heroSubtitle')}
        </p>

        {/* Big Search Bar */}
        <div className="catalog-search-wrap">
          <Search size={18} className="catalog-search-icon" />
          <input
            type="search"
            className="catalog-search-input"
            placeholder={t('catalog.searchPlaceholder')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <kbd className="catalog-search-kbd">Ctrl K</kbd>
        </div>
      </section>

      {/* Category Pills */}
      <section className="category-chips-list">
        {categories.map(cat => {
          const count = cat.id === 'all' ? tools.length : tools.filter(t => t.categoryId === cat.id).length;
          const isActive = activeCategory === cat.id;
          const catName = t(`categories.${cat.id}`, { defaultValue: getCategoryName(cat, currentLang) });

          return (
            <button
              key={cat.id}
              className={`category-chip ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <DynamicIcon name={cat.icon} size={15} />
              <span>{catName}</span>
              <span className="category-chip-count">{count}</span>
            </button>
          );
        })}
      </section>

      {/* Popular Spotlight Strip (shown when looking at "All" without search filter) */}
      {activeCategory === 'all' && !searchQuery && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Flame size={18} color="#f97316" />
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>
              {t('catalog.popularTitle')}
            </h2>
            <span className="badge badge-amber">{popularTools.length}</span>
          </div>

          <div className="tools-grid">
            {popularTools.map(tool => {
              const isFav = favorites.includes(tool.id);
              const toolTitle = getToolName(tool, currentLang);
              const toolDesc = getToolDescription(tool, currentLang);

              return (
                <div
                  key={`popular-${tool.id}`}
                  className="tool-card"
                  onClick={() => onSelectTool(tool.id)}
                >
                  <div className="tool-card-top">
                    <div className="tool-card-icon-frame">
                      <DynamicIcon name={tool.icon} size={22} />
                    </div>
                    <button
                      className={`tool-card-star ${isFav ? 'favorited' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(tool.id);
                      }}
                      title={isFav ? t('tool.removeFromFavorites') : t('tool.addToFavorites')}
                    >
                      <Star size={16} fill={isFav ? 'var(--accent-amber)' : 'none'} />
                    </button>
                  </div>

                  <div className="tool-card-info">
                    <div className="tool-card-title">
                      {toolTitle}
                    </div>
                    <div className="tool-card-desc">
                      {toolDesc}
                    </div>
                  </div>

                  <div className="tool-card-footer">
                    <span className="tool-card-category-label">
                      {tool.categoryId.toUpperCase()}
                    </span>
                    <span className="tool-card-action-hint">
                      {t('catalog.openStudio')} <ArrowUpRight size={13} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Main Tools Catalog Grid */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>
            {activeCategory === 'all'
              ? t('sidebar.allTools')
              : (() => {
                  const cat = categories.find(c => c.id === activeCategory);
                  return cat ? t(`categories.${cat.id}`, { defaultValue: getCategoryName(cat, currentLang) }) : '';
                })()}
          </h2>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {filteredTools.length} {t('sidebar.allTools')}
          </span>
        </div>

        {filteredTools.length === 0 ? (
          <div style={{
            padding: '48px 24px',
            textAlign: 'center',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)'
          }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
              {t('command.noResults')}
            </p>
            <p style={{ fontSize: 13 }}>
              {t('command.placeholder')}
            </p>
          </div>
        ) : (
          <div className="tools-grid">
            {filteredTools.map(tool => {
              const isFav = favorites.includes(tool.id);
              const toolTitle = getToolName(tool, currentLang);
              const toolDesc = getToolDescription(tool, currentLang);

              return (
                <div
                  key={tool.id}
                  className="tool-card"
                  onClick={() => onSelectTool(tool.id)}
                >
                  <div className="tool-card-top">
                    <div className="tool-card-icon-frame">
                      <DynamicIcon name={tool.icon} size={22} />
                    </div>
                    <button
                      className={`tool-card-star ${isFav ? 'favorited' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(tool.id);
                      }}
                      title={isFav ? t('tool.removeFromFavorites') : t('tool.addToFavorites')}
                    >
                      <Star size={16} fill={isFav ? 'var(--accent-amber)' : 'none'} />
                    </button>
                  </div>

                  <div className="tool-card-info">
                    <div className="tool-card-title">
                      {toolTitle}
                    </div>
                    <div className="tool-card-desc">
                      {toolDesc}
                    </div>
                  </div>

                  <div className="tool-card-footer">
                    <span className="tool-card-category-label">
                      {tool.categoryId.toUpperCase()}
                    </span>
                    <span className="tool-card-action-hint">
                      {t('catalog.openStudio')} <ArrowUpRight size={13} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Feature & Privacy Highlights Banner */}
      <section style={{
        marginTop: 32,
        padding: '28px',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 24
      }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-md)',
            background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Shield size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
              {t('catalog.zeroStorageTitle')}
            </h3>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {t('catalog.zeroStorageDesc')}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Zap size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
              {t('catalog.performanceTitle')}
            </h3>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {t('catalog.performanceDesc')}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-md)',
            background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Terminal size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
              {t('catalog.designedForDevsTitle')}
            </h3>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {t('catalog.designedForDevsDesc')}
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Publisher Overview & Specifications */}
      <section className="editorial-card" style={{ marginTop: 32 }}>
        <div className="editorial-badge">
          <span>{t('catalog.docsTitle')}</span>
        </div>
        <h2 className="editorial-title" style={{ fontSize: 20 }}>
          StackKit DevStudio
        </h2>
        <p className="editorial-overview" style={{ marginBottom: 16 }}>
          {t('catalog.docsP1')} {t('catalog.docsP2')}
        </p>

        <div className="editorial-card-grid" style={{ marginTop: 20 }}>
          <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: 'var(--accent-cyan)' }}>
              {t('catalog.openStandardsTitle')}
            </h4>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              {t('catalog.openStandardsDesc')}
            </p>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: 'var(--accent-emerald)' }}>
              {t('catalog.securityTitle')}
            </h4>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              {t('catalog.securityDesc')}
            </p>
          </div>
        </div>
      </section>

      {/* Footer Info with Compliance Links */}
      <footer style={{
        marginTop: 24,
        paddingTop: 24,
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 12,
        color: 'var(--text-muted)',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div>
          {t('catalog.footerCopyright')}
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a
            href={`/${currentLang}/privacy-policy`}
            onClick={(e) => {
              e.preventDefault();
              if (onNavigateCompliance) onNavigateCompliance('privacy-policy');
            }}
            style={{ color: 'var(--accent-cyan)', textDecoration: 'none', cursor: 'pointer' }}
          >
            {t('catalog.privacyPolicy')}
          </a>
          <span>·</span>
          <a
            href={`/${currentLang}/terms-of-service`}
            onClick={(e) => {
              e.preventDefault();
              if (onNavigateCompliance) onNavigateCompliance('terms-of-service');
            }}
            style={{ color: 'var(--accent-cyan)', textDecoration: 'none', cursor: 'pointer' }}
          >
            {t('catalog.termsOfService')}
          </a>
          <span>·</span>
          <a
            href={`/${currentLang}/about`}
            onClick={(e) => {
              e.preventDefault();
              if (onNavigateCompliance) onNavigateCompliance('about');
            }}
            style={{ color: 'var(--accent-cyan)', textDecoration: 'none', cursor: 'pointer' }}
          >
            {t('catalog.aboutUs')}
          </a>
        </div>
      </footer>
    </div>
  );
}
