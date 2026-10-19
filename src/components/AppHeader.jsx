import React from 'react';
import { 
  Menu, Search, Dices, Star, Share2, Sparkles,
  ExternalLink, Info
} from 'lucide-react';
import { tools, categories } from '../data/toolsData';

export default function AppHeader({
  activeToolId,
  activeCategory,
  onGoHome,
  onSelectCategory,
  onOpenCommandPalette,
  onRandomTool,
  onToggleMobile,
  onShowAbout,
  lang = 'pt'
}) {
  const activeTool = tools.find(t => t.id === activeToolId);
  const category = activeTool ? categories.find(c => c.id === activeTool.categoryId) : categories.find(c => c.id === activeCategory);

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="btn-icon mobile-only" onClick={onToggleMobile} aria-label="Abrir menu">
          <Menu size={18} />
        </button>

        {/* Breadcrumbs */}
        <div className="header-breadcrumbs">
          <span className="breadcrumb-home" onClick={onGoHome}>StackKit</span>
          <span className="breadcrumb-sep">/</span>
          {category && category.id !== 'all' ? (
            <>
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectCategory(category.id)}
              >
                {lang === 'pt' ? category.name : category.nameEn}
              </span>
              {activeTool && <span className="breadcrumb-sep">/</span>}
            </>
          ) : (
            <>
              <span onClick={onGoHome} style={{ cursor: 'pointer' }}>
                {lang === 'pt' ? 'Catálogo' : 'Catalog'}
              </span>
              {activeTool && <span className="breadcrumb-sep">/</span>}
            </>
          )}

          {activeTool && (
            <span className="breadcrumb-current">
              {lang === 'pt' ? activeTool.name : (activeTool.nameEn || activeTool.name)}
            </span>
          )}
        </div>
      </div>

      <div className="header-right">
        {/* Random Tool Discovery */}
        <button
          className="header-control-btn"
          onClick={onRandomTool}
          title={lang === 'pt' ? 'Abrir ferramenta aleatória' : 'Open random tool'}
        >
          <Dices size={15} />
          <span className="desktop-only">{lang === 'pt' ? 'Aleatória' : 'Random'}</span>
        </button>

        {/* Command Palette Trigger */}
        <button
          className="header-control-btn"
          onClick={onOpenCommandPalette}
          title={lang === 'pt' ? 'Buscar ferramenta (Ctrl+K)' : 'Search tools (Ctrl+K)'}
        >
          <Search size={15} />
          <span className="desktop-only">{lang === 'pt' ? 'Buscar' : 'Search'}</span>
          <kbd className="desktop-only">Ctrl K</kbd>
        </button>

        {/* About Dialog Button */}
        <button
          className="btn-icon"
          onClick={onShowAbout}
          title={lang === 'pt' ? 'Sobre o StackKit' : 'About StackKit'}
          aria-label="Sobre"
        >
          <Info size={18} />
        </button>
      </div>
    </header>
  );
}
