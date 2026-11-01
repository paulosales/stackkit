import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Layers, Plus } from 'lucide-react';
import { tools, findToolByIdOrAlias, getToolName } from '../data/toolsData';
import DynamicIcon from './DynamicIcon';

export default function ToolTabs({ openToolIds, activeToolId, onSelectTab, onCloseTab, onOpenNew, lang = 'pt' }) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || lang;

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
        <span>{t('tabs.catalog')}</span>
      </div>

      {/* Dynamic open tool tabs (Deduplicated & Canonical) */}
      {uniqueToolIds.map(toolId => {
        const tool = findToolByIdOrAlias(toolId);
        if (!tool) return null;
        const isActive = activeCanonicalId === tool.id;
        const toolName = getToolName(tool, currentLang);

        return (
          <div
            key={tool.id}
            className={`tool-tab ${isActive ? 'active' : ''}`}
            onClick={() => onSelectTab(tool.id)}
            title={toolName}
          >
            <DynamicIcon name={tool.icon} size={14} />
            <span>{toolName}</span>
            <button
              className="tool-tab-close"
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(tool.id);
              }}
              aria-label={t('tabs.closeTab')}
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
        title={t('header.search')}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
