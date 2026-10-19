import React from 'react';
import { X, Layers, Plus } from 'lucide-react';
import { tools, findToolByIdOrAlias } from '../data/toolsData';
import DynamicIcon from './DynamicIcon';

export default function ToolTabs({ openToolIds, activeToolId, onSelectTab, onCloseTab, onOpenNew, lang = 'pt' }) {
  // Ensure strict uniqueness and resolve canonical IDs
  const uniqueToolIds = Array.from(
    new Set(
      openToolIds.map(id => {
        const found = findToolByIdOrAlias(id);
        return found ? found.id : id;
      })
    )
  );

  const activeCanonicalId = findToolByIdOrAlias(activeToolId)?.id || activeToolId;

  return (
    <div className="tool-tabs-bar custom-scrollbar">
      {/* Home / Catalog tab */}
      <div
        className={`tool-tab ${!activeCanonicalId ? 'active' : ''}`}
        onClick={() => onSelectTab(null)}
      >
        <Layers size={14} />
        <span>{lang === 'pt' ? 'Catálogo' : 'Catalog'}</span>
      </div>

      {/* Dynamic open tool tabs (Deduplicated & Canonical) */}
      {uniqueToolIds.map(toolId => {
        const tool = findToolByIdOrAlias(toolId);
        if (!tool) return null;
        const isActive = activeCanonicalId === tool.id;

        return (
          <div
            key={tool.id}
            className={`tool-tab ${isActive ? 'active' : ''}`}
            onClick={() => onSelectTab(tool.id)}
            title={lang === 'pt' ? tool.name : (tool.nameEn || tool.name)}
          >
            <DynamicIcon name={tool.icon} size={14} />
            <span>{lang === 'pt' ? tool.name : (tool.nameEn || tool.name)}</span>
            <button
              className="tool-tab-close"
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(tool.id);
              }}
              aria-label="Fechar aba"
            >
              <X size={12} />
            </button>
          </div>
        );
      })}

      {/* New tab / search button */}
      <button
        className="btn-icon"
        style={{ width: 26, height: 26, marginLeft: 4 }}
        onClick={onOpenNew}
        title={lang === 'pt' ? 'Abrir outra ferramenta (Ctrl+K)' : 'Open new tool (Ctrl+K)'}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
