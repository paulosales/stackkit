import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Worksheet } from '../../types';
import { ContentTab } from './ContentTab';
import { GuidelinesTab } from './GuidelinesTab';
import { TypographyTab } from './TypographyTab';
import { PageLayoutTab } from './PageLayoutTab';
import { BookOpen, Compass, Type, Layout, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  worksheet: Worksheet;
  activePageIndex: number;
  setActivePageIndex: (index: number) => void;
  onUpdateWorksheet: (updater: (prev: Worksheet) => Worksheet) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

type TabType = 'content' | 'guidelines' | 'typography' | 'layout';

export const Sidebar: React.FC<SidebarProps> = ({
  worksheet,
  activePageIndex,
  setActivePageIndex,
  onUpdateWorksheet,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('content');

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'content', label: t('calligraphy.tabs.content', 'Content'), icon: <BookOpen className="w-4 h-4" /> },
    { id: 'guidelines', label: t('calligraphy.tabs.guidelines', 'Guidelines'), icon: <Compass className="w-4 h-4" /> },
    { id: 'typography', label: t('calligraphy.tabs.typography', 'Typography'), icon: <Type className="w-4 h-4" /> },
    { id: 'layout', label: t('calligraphy.tabs.layout', 'Layout & Header'), icon: <Layout className="w-4 h-4" /> },
  ];

  if (isCollapsed) {
    return (
      <div className="bg-white dark:bg-[#131a29] border-r border-slate-200 dark:border-slate-800 w-12 flex flex-col items-center py-4 print:hidden transition-all shadow-sm font-sans">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-[#1a2336] rounded-lg transition-colors mb-4"
          title={t('calligraphy.tabs.expand', 'Expand settings sidebar')}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="flex flex-col gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                onToggleCollapse();
              }}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
              title={tab.label}
            >
              {tab.icon}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <aside className="w-80 md:w-96 bg-slate-50/70 dark:bg-[#0d121f] border-r border-slate-200 dark:border-slate-800 flex flex-col h-full min-h-0 print:hidden transition-all shrink-0 font-sans">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131a29] px-3 py-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a2336]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a2336] rounded-lg transition-colors ml-1"
          title={t('calligraphy.tabs.collapse', 'Collapse sidebar')}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'content' && (
          <ContentTab
            worksheet={worksheet}
            activePageIndex={activePageIndex}
            setActivePageIndex={setActivePageIndex}
            onUpdateWorksheet={onUpdateWorksheet}
          />
        )}

        {activeTab === 'guidelines' && (
          <GuidelinesTab
            guidelines={worksheet.guidelines}
            typography={worksheet.typography}
            onChange={(updated) =>
              onUpdateWorksheet((prev) => ({
                ...prev,
                guidelines: { ...prev.guidelines, ...updated },
              }))
            }
            onChangeTypography={(updated) =>
              onUpdateWorksheet((prev) => ({
                ...prev,
                typography: { ...prev.typography, ...updated },
              }))
            }
          />
        )}

        {activeTab === 'typography' && (
          <TypographyTab
            typography={worksheet.typography}
            guidelines={worksheet.guidelines}
            onChange={(updated) =>
              onUpdateWorksheet((prev) => ({
                ...prev,
                typography: { ...prev.typography, ...updated },
              }))
            }
          />
        )}

        {activeTab === 'layout' && (
          <PageLayoutTab
            layout={worksheet.layout}
            header={worksheet.header}
            title={worksheet.title}
            showTitle={worksheet.showTitle}
            onUpdateLayout={(updated) =>
              onUpdateWorksheet((prev) => ({
                ...prev,
                layout: { ...prev.layout, ...updated },
              }))
            }
            onUpdateHeader={(updated) =>
              onUpdateWorksheet((prev) => ({
                ...prev,
                header: { ...prev.header, ...updated },
              }))
            }
            onUpdateTitle={(title, showTitle) =>
              onUpdateWorksheet((prev) => ({
                ...prev,
                title,
                showTitle,
              }))
            }
          />
        )}
      </div>
    </aside>
  );
};
