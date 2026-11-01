import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Menu, Search, Dices, Star, Share2, Sparkles,
  ExternalLink, Info
} from 'lucide-react';
import { tools, categories, getToolName, getCategoryName } from '../data/toolsData';

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
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || lang;
  const activeTool = tools.find(t => t.id === activeToolId);
  const category = activeTool ? categories.find(c => c.id === activeTool.categoryId) : categories.find(c => c.id === activeCategory);

  const categoryName = category ? t(`categories.${category.id}`, { defaultValue: getCategoryName(category, currentLang) }) : '';
  const toolName = activeTool ? getToolName(activeTool, currentLang) : '';

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="btn-icon mobile-only" onClick={onToggleMobile} aria-label={t('header.menu')}>
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
                {categoryName}
              </span>
              {activeTool && <span className="breadcrumb-sep">/</span>}
            </>
          ) : (
            <>
              <span onClick={onGoHome} style={{ cursor: 'pointer' }}>
                {t('header.catalog')}
              </span>
              {activeTool && <span className="breadcrumb-sep">/</span>}
            </>
          )}

          {activeTool && (
            <span className="breadcrumb-current">
              {toolName}
            </span>
          )}
        </div>
      </div>

      <div className="header-right">
        {/* Random Tool Discovery */}
        <button
          className="header-control-btn"
          onClick={onRandomTool}
          title={t('header.randomTool')}
        >
          <Dices size={15} />
          <span className="desktop-only">{t('header.randomTool')}</span>
        </button>

        {/* Command Palette Trigger */}
        <button
          className="header-control-btn"
          onClick={onOpenCommandPalette}
          title={t('header.search')}
        >
          <Search size={15} />
          <span className="desktop-only">{t('command.open')}</span>
          <kbd className="desktop-only">Ctrl K</kbd>
        </button>

        {/* About Dialog Button */}
        <button
          className="btn-icon"
          onClick={onShowAbout}
          title={t('header.about')}
          aria-label={t('header.about')}
        >
          <Info size={18} />
        </button>
      </div>
    </header>
  );
}
