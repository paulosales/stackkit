import React, { useState, useEffect, useRef } from 'react';
import { Worksheet, SavedWorksheetMeta } from '../types';
import {
  getSavedWorksheetsList,
  getSavedWorksheetById,
  saveWorksheetToLibrary,
  deleteSavedWorksheet,
  exportWorksheetToJson,
  importWorksheetFromJson,
} from '../utils/storage';
import {
  X,
  FolderHeart,
  Save,
  Download,
  Upload,
  Trash2,
  ExternalLink,
  Clock,
  Layers,
  Check,
} from 'lucide-react';

interface SavedSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWorksheet: Worksheet;
  onLoadWorksheet: (worksheet: Worksheet) => void;
  theme?: 'dark' | 'light';
}

export const SavedSheetsModal: React.FC<SavedSheetsModalProps> = ({
  isOpen,
  onClose,
  currentWorksheet,
  onLoadWorksheet,
  theme = 'dark',
}) => {
  const [savedList, setSavedList] = useState<SavedWorksheetMeta[]>([]);
  const [sheetTitleInput, setSheetTitleInput] = useState(currentWorksheet.title || 'My Practice Sheet');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSavedList(getSavedWorksheetsList());
      setSheetTitleInput(currentWorksheet.title || 'My Practice Sheet');
      setSaveSuccessMsg('');
    }
  }, [isOpen, currentWorksheet]);

  if (!isOpen) return null;

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSheet: Worksheet = {
      ...currentWorksheet,
      title: sheetTitleInput.trim() || 'Untitled Sheet',
      updatedAt: Date.now(),
    };
    saveWorksheetToLibrary(updatedSheet);
    setSavedList(getSavedWorksheetsList());
    setSaveSuccessMsg('Worksheet saved successfully into browser local storage!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleLoad = (id: string) => {
    const sheet = getSavedWorksheetById(id);
    if (sheet) {
      onLoadWorksheet(sheet);
      onClose();
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteSavedWorksheet(id);
      setSavedList(getSavedWorksheetsList());
    }
  };

  const handleExport = (id: string) => {
    const sheet = getSavedWorksheetById(id);
    if (sheet) {
      exportWorksheetToJson(sheet);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const importedSheet = importWorksheetFromJson(content);
        if (importedSheet) {
          saveWorksheetToLibrary(importedSheet);
          setSavedList(getSavedWorksheetsList());
          onLoadWorksheet(importedSheet);
          setSaveSuccessMsg('Imported sheet successfully!');
          setTimeout(() => setSaveSuccessMsg(''), 3000);
        } else {
          alert('Could not import worksheet: invalid file structure.');
        }
      } catch (err) {
        alert('Failed to parse the uploaded file.');
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className={`calligraphy-root ${theme === 'dark' ? 'dark' : 'light'} fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn`}
      data-theme={theme}
    >
      <div className="bg-white dark:bg-[#131a29] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#0f1523]/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <FolderHeart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">My Saved Worksheets</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Stored safely in your browser's Local Storage. No server required.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a2336] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Save Current Worksheet Section */}
          <form
            onSubmit={handleSaveCurrent}
            className="bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 rounded-xl p-4 space-y-3"
          >
            <label className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
              <Save className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Save Current Sheet to Local Storage
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={sheetTitleInput}
                onChange={(e) => setSheetTitleInput(e.target.value)}
                placeholder="Give your sheet a title..."
                className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white dark:bg-[#1a2336] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Save className="w-3.5 h-3.5" /> Save Sheet
              </button>
            </div>
            {saveSuccessMsg && (
              <div className="text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1 animate-fadeIn">
                <Check className="w-3.5 h-3.5" /> {saveSuccessMsg}
              </div>
            )}
          </form>

          {/* Saved Worksheets List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Your Saved Sheets ({savedList.length})
              </h4>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-white dark:bg-[#1a2336] border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 px-2.5 py-1 rounded-lg transition-colors font-medium shadow-sm"
                  title="Import previously exported JSON file"
                >
                  <Upload className="w-3 h-3" /> Import JSON
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json,application/json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </div>
            </div>

            {savedList.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-50 dark:bg-[#0f1523]/60 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                <FolderHeart className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">No saved worksheets yet.</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Type a title above and click "Save Sheet" to keep your customized practice worksheets!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {savedList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 bg-white dark:bg-[#0f1523] hover:bg-slate-50/50 dark:hover:bg-[#1a2336]/60 transition-all flex items-center justify-between gap-3 shadow-xs group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-slate-800 dark:text-slate-100 text-xs truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-400 flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1 italic">
                        "{item.previewSnippet}"
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleLoad(item.id)}
                        className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        title="Load worksheet into editor"
                      >
                        <ExternalLink className="w-3 h-3" /> Open
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExport(item.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a2336] rounded-lg transition-colors"
                        title="Export JSON backup"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                        title="Delete worksheet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0f1523]/80 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-[#1a2336] rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
