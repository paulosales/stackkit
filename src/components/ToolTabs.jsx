import React from 'react';
import { X, Layers, Plus } from 'lucide-react';
import { tools } from '../data/toolsData';
import DynamicIcon from './DynamicIcon';

export default function ToolTabs({ openToolIds, activeToolId, onSelectTab, onCloseTab, onOpenNew, lang = 'pt' }) {
  return (
    <div className="tool-tabs-bar custom-scrollbar">
      {/* Home / Catalog tab */}
      <div
        className={`tool-tab ${!activeToolId ? 'active' : ''}`}
        onClick={() => onSelectTab(null)}
      >
        <Layers size={14} />
        <span>{lang === 'pt' ? 'Catálogo' : 'Catalog'}</span>
      </div>

      {/* Dynamic open tool tabs */}
      {openToolIds.map(toolId => {
        const tool = tools.find(t => t.id === toolId);
        if (!tool) return null;
        const isActive = activeToolId === toolId;

        return (
          <div
            key={toolId}
            className={`tool-tab ${isActive ? 'active' : ''}`}
            onClick={() => onSelectTab(toolId)}
            title={lang === 'pt' ? tool.name : (tool.nameEn || tool.name)}
          >
            <DynamicIcon name={tool.icon} size={14} />
            <span>{lang === 'pt' ? tool.name : (tool.nameEn || tool.name)}</span>
            <button
              className="tool-tab-close"
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(toolId);
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
