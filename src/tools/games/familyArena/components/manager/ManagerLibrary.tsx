import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Edit,
  Copy,
  Trash2,
  Download,
  Upload,
  Search,
  CheckSquare,
  Square,
  Rocket,
  ExternalLink,
  Database,
  X,
} from 'lucide-react';
import { Quiz } from '../../types/game';
import {
  exportQuizAsJSON,
  exportQuizzesAsJSON,
  importQuizzesFromJSON,
} from '../../services/quizStorage';
import { useTranslation } from '../../i18n/I18nContext';

interface ManagerLibraryProps {
  quizzes: Quiz[];
  onLaunchSession: (selectedQuizIds: string[]) => void;
  onEditQuiz: (quiz: Quiz) => void;
  onDuplicateQuiz: (quiz: Quiz) => void;
  onDeleteQuiz: (quizId: string) => void;
  onCreateNewQuiz: () => void;
  onImportQuiz?: (quiz: Quiz) => void;
  onImportQuizzes?: (quizzes: Quiz[]) => void;
  activeSessionCode?: string | null;
  onOpenExistingSessionDisplay?: () => void;
}

export const ManagerLibrary: React.FC<ManagerLibraryProps> = ({
  quizzes,
  onLaunchSession,
  onEditQuiz,
  onDuplicateQuiz,
  onDeleteQuiz,
  onCreateNewQuiz,
  onImportQuiz,
  onImportQuizzes,
  activeSessionCode,
  onOpenExistingSessionDisplay,
}) => {
  const { t, language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => language || 'All');
  const [selectedQuizIds, setSelectedQuizIds] = useState<string[]>(() => {
    const match = quizzes.find((q) => q.language === language);
    return match ? [match.id] : quizzes.length > 0 ? [quizzes[0].id] : [];
  });

  useEffect(() => {
    if (language) {
      setSelectedLanguage(language);
      const match = quizzes.find((q) => q.language === language);
      if (match) {
        setSelectedQuizIds([match.id]);
      }
    }
  }, [language]);
  const [importFeedback, setImportFeedback] = useState<{
    type: 'success' | 'warning' | 'error';
    message: string;
    errors?: string[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', ...Array.from(new Set(quizzes.map((q) => q.category).filter(Boolean)))];

  const filtered = quizzes.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesLang = selectedLanguage === 'All' || (q.language || 'en') === selectedLanguage;
    return matchesSearch && matchesCategory && matchesLang;
  });

  const toggleQuizSelection = (id: string) => {
    setSelectedQuizIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredIds = filtered.map((q) => q.id);
  const areAllFilteredSelected =
    filteredIds.length > 0 && filteredIds.every((id) => selectedQuizIds.includes(id));

  const handleToggleSelectAll = () => {
    if (areAllFilteredSelected) {
      setSelectedQuizIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedQuizIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const selectedQuizzes = quizzes.filter((q) => selectedQuizIds.includes(q.id));
  const totalSelectedQuestions = selectedQuizzes.reduce((sum, q) => sum + q.questions.length, 0);

  const downloadJSON = (jsonStr: string, filename: string) => {
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportSingle = (quiz: Quiz) => {
    const json = exportQuizAsJSON(quiz);
    const safeTitle = quiz.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    downloadJSON(json, `${safeTitle}_quiz.json`);
  };

  const handleExportSelected = () => {
    if (selectedQuizIds.length === 0) return;
    const toExport = quizzes.filter((q) => selectedQuizIds.includes(q.id));
    if (toExport.length === 1) {
      handleExportSingle(toExport[0]);
    } else {
      const json = exportQuizzesAsJSON(toExport);
      downloadJSON(json, `family_arena_quizzes_${toExport.length}_sets.json`);
    }
  };

  const handleExportAll = () => {
    if (quizzes.length === 0) return;
    const json = exportQuizzesAsJSON(quizzes);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadJSON(json, `family_arena_database_${dateStr}.json`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importQuizzesFromJSON(content);

      if (res.quizzes.length === 0) {
        setImportFeedback({
          type: 'error',
          message: res.errors.length > 0 ? res.errors.join(' ') : t('importNoValidQuizzes'),
        });
      } else {
        if (onImportQuizzes) {
          onImportQuizzes(res.quizzes);
        } else if (onImportQuiz) {
          res.quizzes.forEach((q) => onImportQuiz(q));
        }

        const totalQ = res.quizzes.reduce((s, q) => s + q.questions.length, 0);
        const feedbackMsg =
          res.quizzes.length === 1
            ? t('importSuccessSingle', { title: res.quizzes[0].title })
            : t('importSuccessMultiple', { count: res.quizzes.length, questions: totalQ });

        setImportFeedback({
          type: res.errors.length > 0 ? 'warning' : 'success',
          message: feedbackMsg,
          errors: res.errors.length > 0 ? res.errors : undefined,
        });

        // Automatically select the newly imported quiz ids
        setSelectedQuizIds((prev) => Array.from(new Set([...res.quizzes.map((q) => q.id), ...prev])));
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Active Session Alert Banner (if a session is already running) */}
      {activeSessionCode && (
        <div className="w-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center space-x-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {t('sessionRunning', { code: activeSessionCode })}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t('displayScreenOpenReady')}
              </p>
            </div>
          </div>
          {onOpenExistingSessionDisplay && (
            <button
              onClick={onOpenExistingSessionDisplay}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t('openDisplayScreenBtn')}</span>
            </button>
          )}
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('libraryTab')}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('managerNoCodeNeeded')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          {/* Import JSON / Database */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center space-x-1.5 transition cursor-pointer"
            title={t('importQuiz')}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{t('importQuiz')}</span>
          </button>

          {/* Export Selected Quizzes */}
          {selectedQuizIds.length > 0 && (
            <button
              type="button"
              onClick={handleExportSelected}
              className="px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
              title={t('exportSelected', { count: selectedQuizIds.length })}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('exportSelected', { count: selectedQuizIds.length })}</span>
            </button>
          )}

          {/* Export Full Database */}
          <button
            type="button"
            onClick={handleExportAll}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center space-x-1.5 transition cursor-pointer"
            title={t('exportAll', { count: quizzes.length })}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{t('exportDatabase')}</span>
          </button>

          {/* Create New Quiz */}
          <button
            type="button"
            onClick={onCreateNewQuiz}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white flex items-center space-x-1.5 shadow-lg shadow-indigo-600/20 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('createNewQuiz')}</span>
          </button>
        </div>
      </div>

      {/* Import Feedback Banner */}
      {importFeedback && (
        <div
          className={`w-full rounded-2xl p-4 mb-6 border flex items-start justify-between gap-3 animate-fadeIn ${
            importFeedback.type === 'error'
              ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200'
              : importFeedback.type === 'warning'
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
          }`}
        >
          <div className="text-xs space-y-1">
            <div className="font-bold flex items-center space-x-1.5">
              <span>{importFeedback.message}</span>
            </div>
            {importFeedback.errors && importFeedback.errors.length > 0 && (
              <ul className="list-disc list-inside text-[11px] opacity-80 mt-1 space-y-0.5">
                {importFeedback.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="button"
            onClick={() => setImportFeedback(null)}
            className="text-xs font-bold opacity-60 hover:opacity-100 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sticky Session Launch Callout */}
      <div className="w-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-2 border-indigo-500/30 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg backdrop-blur">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Rocket className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
              {t('launchSessionBtn')}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {t('selectedQuizzesSummary', { count: selectedQuizIds.length, questions: totalSelectedQuestions })} • {t('launchSessionNotice')}
          </p>
        </div>

        <button
          onClick={() => onLaunchSession(selectedQuizIds)}
          disabled={selectedQuizIds.length === 0}
          className={`px-6 py-3 rounded-xl font-bold text-sm text-white shadow-xl transition-all flex items-center space-x-2 flex-shrink-0 cursor-pointer ${
            selectedQuizIds.length > 0
              ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 active:scale-95 shadow-indigo-500/20'
              : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Rocket className="w-4 h-4" />
          <span>{t('launchSessionBtn')}</span>
        </button>
      </div>

      {/* Filter, Search, and Select All Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={t('searchQuizzesPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Select All Toggle Button */}
          <button
            type="button"
            onClick={handleToggleSelectAll}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 flex items-center space-x-1.5 transition whitespace-nowrap cursor-pointer"
            title={areAllFilteredSelected ? t('deselectAll') : t('selectAll')}
          >
            {areAllFilteredSelected ? (
              <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
            ) : (
              <Square className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{areAllFilteredSelected ? t('deselectAll') : t('selectAll')}</span>
          </button>
        </div>

        {/* Filters: Category & Language */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Pills */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
            {['All', 'en', 'pt', 'es'].map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedLanguage === lang
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lang === 'All' ? t('allLanguages') : lang === 'en' ? '🇺🇸 EN' : lang === 'pt' ? '🇧🇷 PT' : '🇪🇸 ES'}
              </button>
            ))}
          </div>

          {/* Category Pills */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat === 'All' ? t('allCategories') : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quiz Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((quiz) => {
          const isSelected = selectedQuizIds.includes(quiz.id);

          return (
            <div
              key={quiz.id}
              onClick={() => toggleQuizSelection(quiz.id)}
              className={`cursor-pointer rounded-2xl border p-5 flex flex-col justify-between shadow-lg transition-all ${
                isSelected
                  ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700/60">
                      {quiz.category || t('generalCategory')}
                    </span>
                    <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
                      {quiz.language === 'pt' ? '🇧🇷 PT' : quiz.language === 'es' ? '🇪🇸 ES' : '🇺🇸 EN'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span>{quiz.questions.length} {t('questions')}</span>
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
                  {quiz.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                  {quiz.description || t('noDescriptionProvided')}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800/80 text-slate-400 text-xs">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditQuiz(quiz);
                      }}
                      className="p-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title={t('edit')}
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateQuiz(quiz);
                      }}
                      className="p-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title={t('duplicate')}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportSingle(quiz);
                      }}
                      className="p-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title={t('exportQuiz')}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {quiz.id.startsWith('quiz-custom') && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(t('deleteQuizConfirm', { title: quiz.title }))) {
                          onDeleteQuiz(quiz.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 transition cursor-pointer"
                      title={t('delete')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
