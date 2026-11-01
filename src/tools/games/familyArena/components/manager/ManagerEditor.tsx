import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  CheckCircle2,
  Save,
  Send,
  AlertCircle,
  ChevronDown,
  Bold,
  Italic,
  Code,
  Image as ImageIcon,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Quiz, QuizQuestion } from '../../types/game';
import { validateQuiz } from '../../services/quizStorage';
import { useTranslation } from '../../i18n/I18nContext';
import { QuestionMarkdown } from '../common/QuestionMarkdown';

interface ManagerEditorProps {
  initialQuiz?: Quiz | null;
  onSaveQuiz: (quiz: Quiz) => void;
  onSaveAndSend?: (quiz: Quiz) => void;
  onCancel: () => void;
}

export const ManagerEditor: React.FC<ManagerEditorProps> = ({
  initialQuiz,
  onSaveQuiz,
  onSaveAndSend,
  onCancel,
}) => {
  const { t, language: currentUiLang } = useTranslation();
  const [title, setTitle] = useState(initialQuiz?.title || '');
  const [description, setDescription] = useState(initialQuiz?.description || '');
  const [category, setCategory] = useState(initialQuiz?.category || 'Custom');
  const [quizLanguage, setQuizLanguage] = useState<string>(
    initialQuiz?.language || currentUiLang || 'en'
  );

  const [questions, setQuestions] = useState<QuizQuestion[]>(
    initialQuiz?.questions || [
      {
        id: 'q-new-1',
        text: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        timeLimit: 20,
        points: 1000,
      },
    ]
  );

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [previewQuestionIndices, setPreviewQuestionIndices] = useState<Set<number>>(new Set());

  const togglePreview = (idx: number) => {
    setPreviewQuestionIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const insertMarkdownTag = (
    qIdx: number,
    before: string,
    after: string = '',
    placeholder: string = ''
  ) => {
    const current = questions[qIdx].text || '';
    const addition = before + placeholder + after;
    const newText = current ? `${current} ${addition}` : addition;
    handleQuestionTextChange(qIdx, newText);
  };

  const insertImageTag = (qIdx: number) => {
    const current = questions[qIdx].text || '';
    const imgTag = `\n![Image description](https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600)\n`;
    handleQuestionTextChange(qIdx, current ? `${current.trimEnd()}${imgTag}` : imgTag.trim());
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q-new-${Date.now()}`,
        text: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        timeLimit: 20,
        points: 1000,
      },
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) {
      alert(t('mustHaveOneQuestionAlert'));
      return;
    }
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleQuestionTextChange = (idx: number, text: string) => {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], text };
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx: number, optIdx: number, text: string) => {
    const updated = [...questions];
    const newOptions = [...updated[qIdx].options];
    newOptions[optIdx] = text;
    updated[qIdx] = { ...updated[qIdx], options: newOptions };
    setQuestions(updated);
  };

  const handleSetCorrect = (qIdx: number, optIdx: number) => {
    const updated = [...questions];
    updated[qIdx] = { ...updated[qIdx], correctAnswerIndex: optIdx };
    setQuestions(updated);
  };

  const handleTimeLimitChange = (qIdx: number, timeLimit: number) => {
    const updated = [...questions];
    updated[qIdx] = { ...updated[qIdx], timeLimit };
    setQuestions(updated);
  };

  const buildQuizObject = (): Quiz => {
    return {
      id: initialQuiz?.id || `quiz-custom-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      language: quizLanguage || 'en',
      createdAt: initialQuiz?.createdAt || Date.now(),
      questions: questions.map((q, i) => ({
        ...q,
        id: q.id || `q-${i + 1}`,
        text: q.text.trim(),
        options: q.options.map((o) => o.trim()),
      })),
    };
  };

  const handleSave = (andSend: boolean = false) => {
    const quiz = buildQuizObject();
    const result = validateQuiz(quiz);
    if (!result.valid) {
      setValidationErrors(result.errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setValidationErrors([]);
    onSaveQuiz(quiz);
    if (andSend && onSaveAndSend) {
      onSaveAndSend(quiz);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {initialQuiz ? t('edit') : t('createNewQuiz')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('authorQuestionsDesc')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
          >
            {t('cancel')}
          </button>
          <button
            onClick={() => handleSave(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center space-x-1.5 shadow"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{t('saveQuizBtn')}</span>
          </button>
          {onSaveAndSend && (
            <button
              onClick={() => handleSave(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center space-x-1.5 shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t('loadQuizToDisplay')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/40 text-red-800 dark:text-red-300 text-xs">
          <div className="flex items-center space-x-2 font-bold mb-2 text-sm text-red-700 dark:text-red-200">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>{t('pleaseResolveIssues')}</span>
          </div>
          <ul className="list-disc list-inside space-y-1">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Quiz Metadata */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-8 space-y-4 shadow-sm">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t('quizTitleLabel')} *
          </label>
          <input
            type="text"
            placeholder={t('scienceMarvelsPlaceholder')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t('quizCategoryLabel')}
            </label>
            <input
              type="text"
              placeholder={t('categoriesPlaceholder')}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t('quizLanguageLabel')}
            </label>
            <div className="relative">
              <select
                value={quizLanguage}
                onChange={(e) => setQuizLanguage(e.target.value)}
                className="w-full appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 pr-10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 cursor-pointer font-normal"
              >
                <option value="en">🇺🇸 English (en)</option>
                <option value="pt">🇧🇷 Português (pt)</option>
                <option value="es">🇪🇸 Español (es)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t('quizDescriptionLabel')}
            </label>
            <input
              type="text"
              placeholder={t('galaxiesPlaceholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6 mb-8">
        {questions.map((q, qIdx) => (
          <div
            key={q.id || qIdx}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400">
                {t('question')} #{qIdx + 1}
              </span>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <span>{t('timeLimitLabel')}:</span>
                  <select
                    value={q.timeLimit}
                    onChange={(e) => handleTimeLimitChange(qIdx, Number(e.target.value))}
                    className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
                  >
                    <option value={0}>{t('noTimeLimit')}</option>
                    <option value={10}>10s</option>
                    <option value={15}>15s</option>
                    <option value={20}>{t('defaultTimeLimit')}</option>
                    <option value={30}>30s</option>
                    <option value={45}>45s</option>
                    <option value={60}>60s</option>
                    <option value={90}>90s</option>
                    <option value={120}>120s</option>
                  </select>
                </div>

                <button
                  onClick={() => handleRemoveQuestion(qIdx)}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 transition"
                  title={t('removeQuestion')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Question Text with Markdown Toolbar & Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t('questionPromptLabel')} *
                </label>

                {/* Markdown Quick Toolbar */}
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => insertMarkdownTag(qIdx, '**', '**', 'bold')}
                    title={t('insertBoldTooltip')}
                    className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownTag(qIdx, '*', '*', 'italic')}
                    title={t('insertItalicTooltip')}
                    className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownTag(qIdx, '`', '`', 'code')}
                    title={t('insertCodeTooltip')}
                    className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertImageTag(qIdx)}
                    title={t('insertImageTooltip')}
                    className="p-1 rounded-md text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                  </button>

                  <div className="w-[1px] h-3.5 bg-slate-200 dark:bg-slate-700 mx-1" />

                  <button
                    type="button"
                    onClick={() => togglePreview(qIdx)}
                    className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg text-xs font-semibold border transition ${
                      previewQuestionIndices.has(qIdx)
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {previewQuestionIndices.has(qIdx) ? (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>{t('edit')}</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>{t('preview')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {previewQuestionIndices.has(qIdx) ? (
                <div className="w-full bg-slate-50 dark:bg-slate-800/60 border border-indigo-200 dark:border-indigo-900/50 rounded-xl p-3.5 min-h-[72px] flex flex-col justify-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 mb-1">
                    {t('preview')}
                  </div>
                  {q.text ? (
                    <QuestionMarkdown content={q.text} size="compact" align="left" />
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      {t('previewEmptyPrompt')}
                    </span>
                  )}
                </div>
              ) : (
                <textarea
                  rows={2}
                  placeholder={t('typeQuestionPlaceholder')}
                  value={q.text}
                  onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-sans"
                />
              )}

              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {t('markdownHint')}
              </p>
            </div>

            {/* 4 Options */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t('answerOptionsLabel')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((opt, optIdx) => {
                  const isCorrect = q.correctAnswerIndex === optIdx;
                  return (
                    <div
                      key={optIdx}
                      className={`flex items-center space-x-2 rounded-xl p-2.5 border transition-all ${
                        isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-500/60 ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSetCorrect(qIdx, optIdx)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 transition ${
                          isCorrect
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-300'
                        }`}
                        title={t('markAsCorrect')}
                      >
                        {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : String.fromCharCode(65 + optIdx)}
                      </button>

                      <input
                        type="text"
                        placeholder={t('optionPlaceholder', { opt: String.fromCharCode(65 + optIdx) })}
                        value={opt}
                        onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                        className="w-full bg-transparent border-0 text-sm text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Question Button */}
      <button
        type="button"
        onClick={handleAddQuestion}
        className="w-full py-3.5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center space-x-2 transition bg-indigo-50/50 dark:bg-indigo-950/20"
      >
        <Plus className="w-4 h-4" />
        <span>{t('addQuestionBtn')}</span>
      </button>
    </div>
  );
};
