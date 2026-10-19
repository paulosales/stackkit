import React, { useState } from 'react';
import { Search, Star, ArrowUpRight, Flame, Sparkles, Shield, Zap, Terminal } from 'lucide-react';
import { tools, categories } from '../data/toolsData';
import DynamicIcon from './DynamicIcon';

export default function CatalogView({
  activeCategory,
  onSelectCategory,
  onSelectTool,
  favorites = [],
  onToggleFavorite,
  lang = 'pt'
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = tools.filter(tool => {
    // Category match
    if (activeCategory !== 'all' && tool.categoryId !== activeCategory) {
      return false;
    }
    // Search query match
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = tool.name.toLowerCase().includes(q) || (tool.nameEn && tool.nameEn.toLowerCase().includes(q));
    const descMatch = tool.description.toLowerCase().includes(q) || (tool.descriptionEn && tool.descriptionEn.toLowerCase().includes(q));
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
          <span>{lang === 'pt' ? 'Suíte Completa para Desenvolvedores' : 'Complete Developer Suite'}</span>
          <span>·</span>
          <span>{tools.length} {lang === 'pt' ? 'Ferramentas' : 'Tools'}</span>
        </div>

        <h1 className="catalog-hero-title">
          {lang === 'pt' ? 'Ferramentas Ágeis para Desenvolvedores' : 'Productive Tools for Developers'}
        </h1>

        <p className="catalog-hero-desc">
          {lang === 'pt'
            ? 'Gere documentos válidos, formate dados, converta arquivos, inspecione tokens JWT e teste expressões regulares. 100% executado localmente no seu navegador para total privacidade e velocidade.'
            : 'Generate valid documents, format code, convert files, inspect JWT tokens and test regular expressions. 100% processed client-side for absolute privacy and lightning speed.'}
        </p>

        {/* Big Search Bar */}
        <div className="catalog-search-wrap">
          <Search size={18} className="catalog-search-icon" />
          <input
            type="search"
            className="catalog-search-input"
            placeholder={lang === 'pt' ? 'Busque uma ferramenta por nome, sigla ou finalidade...' : 'Search a tool by name, tag, or purpose...'}
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

          return (
            <button
              key={cat.id}
              className={`category-chip ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <DynamicIcon name={cat.icon} size={15} />
              <span>{lang === 'pt' ? cat.name : cat.nameEn}</span>
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
              {lang === 'pt' ? 'Mais Utilizadas' : 'Most Popular'}
            </h2>
            <span className="badge badge-amber">{popularTools.length}</span>
          </div>

          <div className="tools-grid">
            {popularTools.map(tool => {
              const isFav = favorites.includes(tool.id);
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
                      title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                      <Star size={16} fill={isFav ? 'var(--accent-amber)' : 'none'} />
                    </button>
                  </div>

                  <div className="tool-card-info">
                    <div className="tool-card-title">
                      {lang === 'pt' ? tool.name : (tool.nameEn || tool.name)}
                    </div>
                    <div className="tool-card-desc">
                      {lang === 'pt' ? tool.description : (tool.descriptionEn || tool.description)}
                    </div>
                  </div>

                  <div className="tool-card-footer">
                    <span className="tool-card-category-label">
                      {tool.categoryId.toUpperCase()}
                    </span>
                    <span className="tool-card-action-hint">
                      {lang === 'pt' ? 'Abrir' : 'Open'} <ArrowUpRight size={13} />
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
              ? (lang === 'pt' ? 'Todas as Ferramentas' : 'All Tools')
              : categories.find(c => c.id === activeCategory)?.name || ''}
          </h2>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {filteredTools.length} {lang === 'pt' ? 'encontradas' : 'found'}
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
              {lang === 'pt' ? 'Nenhuma ferramenta encontrada' : 'No tools matched your query'}
            </p>
            <p style={{ fontSize: 13 }}>
              {lang === 'pt' ? 'Tente buscar por outro termo ou selecione outra categoria.' : 'Try another search term or pick a different category.'}
            </p>
          </div>
        ) : (
          <div className="tools-grid">
            {filteredTools.map(tool => {
              const isFav = favorites.includes(tool.id);

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
                      title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                      <Star size={16} fill={isFav ? 'var(--accent-amber)' : 'none'} />
                    </button>
                  </div>

                  <div className="tool-card-info">
                    <div className="tool-card-title">
                      {lang === 'pt' ? tool.name : (tool.nameEn || tool.name)}
                    </div>
                    <div className="tool-card-desc">
                      {lang === 'pt' ? tool.description : (tool.descriptionEn || tool.description)}
                    </div>
                  </div>

                  <div className="tool-card-footer">
                    <span className="tool-card-category-label">
                      {tool.categoryId.toUpperCase()}
                    </span>
                    <span className="tool-card-action-hint">
                      {lang === 'pt' ? 'Abrir estúdio' : 'Launch studio'} <ArrowUpRight size={13} />
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
              {lang === 'pt' ? 'Privacidade Garantida' : 'Zero Server Storage'}
            </h3>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {lang === 'pt'
                ? 'Todos os cálculos, hashes e validações rodam no seu próprio navegador. Seus dados nunca saem da sua máquina.'
                : 'All algorithms, hashes, and formatting run locally in your browser. Sensitive data never touches a remote server.'}
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
              {lang === 'pt' ? 'Performance Instantânea' : 'Instant Performance'}
            </h3>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {lang === 'pt'
                ? 'Construído em React com Vite moderno. Sem latência de rede, respostas em tempo real para testes rápidos.'
                : 'Built with Vite and modern React. Zero network latency, instant responses for rapid developer workflows.'}
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
              {lang === 'pt' ? 'Desenvolvido para Devs' : 'Engineered for Devs'}
            </h3>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {lang === 'pt'
                ? 'Atalhos de teclado (Ctrl+K), abas de trabalho, suporte completo a padrões brasileiros e internacionais.'
                : 'Keyboard navigation (Ctrl+K), multi-tab workspace, full support for Brazilian standards and global formats.'}
            </p>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <footer style={{
        marginTop: 20,
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
          © 2026 StackKit DevStudio · Inspirado na utilidade do GeraDev com layout Studio Moderno
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <span>Privacidade</span>
          <span>·</span>
          <span>Open Source</span>
          <span>·</span>
          <span>Totalmente Offline</span>
        </div>
      </footer>
    </div>
  );
}
