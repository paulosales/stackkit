import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star, ArrowRight, CornerDownLeft } from 'lucide-react';
import { tools } from '../data/toolsData';

export default function CommandPalette({ isOpen, onClose, onSelectTool, favorites = [], lang = 'pt' }) {
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
    const nameMatch = t.name.toLowerCase().includes(q) || (t.nameEn && t.nameEn.toLowerCase().includes(q));
    const descMatch = t.description.toLowerCase().includes(q) || (t.descriptionEn && t.descriptionEn.toLowerCase().includes(q));
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
            placeholder={lang === 'pt' ? 'Busque qualquer ferramenta por nome, tag ou função...' : 'Search any tool by name, tag, or function...'}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className="btn-icon" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className="command-results-list custom-scrollbar">
          {filtered.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
              {lang === 'pt' ? 'Nenhuma ferramenta encontrada para esta busca' : 'No tools found for this query'}
            </div>
          ) : (
            filtered.map((tool, idx) => {
              const isFav = favorites.includes(tool.id);
              const isSelected = idx === selectedIndex;

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
                        {lang === 'pt' ? tool.name : (tool.nameEn || tool.name)}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {lang === 'pt' ? tool.description : (tool.descriptionEn || tool.description)}
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
            <span><kbd>↑</kbd> <kbd>↓</kbd> {lang === 'pt' ? 'para navegar' : 'to navigate'}</span>
            <span><kbd>Enter</kbd> {lang === 'pt' ? 'para abrir' : 'to open'}</span>
            <span><kbd>Esc</kbd> {lang === 'pt' ? 'para fechar' : 'to close'}</span>
          </div>
          <div>{filtered.length} {lang === 'pt' ? 'ferramentas' : 'tools'}</div>
        </div>
      </div>
    </div>
  );
}
