import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X, Star, ArrowRight, CornerDownLeft } from 'lucide-react';
import { tools, getToolName, getToolDescription } from '../data/toolsData';

export default function CommandPalette({ isOpen, onClose, onSelectTool, favorites = [], lang = 'pt' }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || lang;
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filtered = tools.filter(t => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const nameMatch = t.name.toLowerCase().includes(q) || (t.nameEn && t.nameEn.toLowerCase().includes(q)) || (t.nameEs && t.nameEs.toLowerCase().includes(q));
    const descMatch = t.description.toLowerCase().includes(q) || (t.descriptionEn && t.descriptionEn.toLowerCase().includes(q)) || (t.descriptionEs && t.descriptionEs.toLowerCase().includes(q));
    const tagMatch = t.tags && t.tags.some(tag => tag.toLowerCase().includes(q));
    return nameMatch || descMatch || tagMatch;
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onSelectTool(filtered[selectedIndex].id);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="command-palette-backdrop" onClick={onClose}>
      <div className="command-palette" onClick={e => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div className="command-search-header">
          <Search size={20} className="text-muted" />
          <input
            ref={inputRef}
            type="text"
            className="command-search-input"
            placeholder={t('command.placeholder')}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className="btn-icon" onClick={onClose} aria-label={t('command.close')}>
            <X size={18} />
          </button>
        </div>

        <div className="command-results-list custom-scrollbar">
          {filtered.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
              {t('command.noResults')} &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((tool, idx) => {
              const isFav = favorites.includes(tool.id);
              const isSelected = idx === selectedIndex;
              const toolTitle = getToolName(tool, currentLang);
              const toolDesc = getToolDescription(tool, currentLang);

              return (
                <div
                  key={tool.id}
                  className={`command-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    onSelectTool(tool.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="command-item-left">
                    <span className="badge badge-cyan" style={{ fontSize: 10 }}>{tool.categoryId}</span>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {toolTitle}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {toolDesc}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {isFav && <Star size={14} fill="var(--accent-amber)" color="var(--accent-amber)" />}
                    {isSelected && <CornerDownLeft size={14} className="text-muted" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="command-footer">
          <div style={{ display: 'flex', gap: 12 }}>
            <span><kbd>↑</kbd> <kbd>↓</kbd> {t('command.navigate')}</span>
            <span><kbd>Enter</kbd> {t('command.open')}</span>
            <span><kbd>Esc</kbd> {t('command.close')}</span>
          </div>
          <div>{filtered.length} {t('sidebar.allTools')}</div>
        </div>
      </div>
    </div>
  );
}
