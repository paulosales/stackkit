import React from 'react';
import { Clock, Users, CheckCircle2, Infinity as InfinityIcon } from 'lucide-react';
import { QuizQuestion, Player } from '../../types/game';
import { useTranslation } from '../../i18n/I18nContext';
import { AvatarDisplay } from '../common/AvatarDisplay';
import { QuestionMarkdown } from '../common/QuestionMarkdown';

interface DisplayQuestionProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  timeRemaining: number;
  totalPlayers: number;
  answeredPlayerIds: Set<string>;
  players: Player[];
}

const OPTION_STYLES = [
  {
    bg: 'bg-red-600/90 hover:bg-red-600',
    border: 'border-red-500/80',
    iconBg: 'bg-red-700',
    symbol: '▲',
    label: 'A',
  },
  {
    bg: 'bg-blue-600/90 hover:bg-blue-600',
    border: 'border-blue-500/80',
    iconBg: 'bg-blue-700',
    symbol: '◆',
    label: 'B',
  },
  {
    bg: 'bg-amber-500/90 hover:bg-amber-500',
    border: 'border-amber-400/80',
    iconBg: 'bg-amber-600',
    symbol: '●',
    label: 'C',
  },
  {
    bg: 'bg-emerald-600/90 hover:bg-emerald-600',
    border: 'border-emerald-500/80',
    iconBg: 'bg-emerald-700',
    symbol: '■',
    label: 'D',
  },
];

export const DisplayQuestion: React.FC<DisplayQuestionProps> = ({
  question,
  questionIndex,
  totalQuestions,
  timeRemaining,
  totalPlayers,
  answeredPlayerIds,
  players,
}) => {
  const { t } = useTranslation();
  const hasNoLimit = question.timeLimit <= 0;
  const progressPercent = hasNoLimit ? 100 : Math.max(0, Math.min(100, (timeRemaining / question.timeLimit) * 100));
  const isUrgent = !hasNoLimit && timeRemaining <= 5 && timeRemaining > 0;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-between min-h-[85vh]">
      {/* Header bar: Question Counter & Timer */}
      <div className="w-full flex items-center justify-between bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 shadow-xl mb-6 transition-colors">
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold text-sm sm:text-base border border-indigo-500/30">
            {t('question')} {questionIndex + 1} / {totalQuestions}
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">
            {t('worthPoints', { points: question.points })}
          </span>
        </div>

        {/* Big Countdown Timer or No Limit Badge */}
        <div className="flex items-center space-x-3">
          <div
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-2xl border font-mono font-black text-2xl sm:text-3xl transition-colors ${
              isUrgent
                ? 'bg-red-500/20 border-red-500 text-red-600 dark:text-red-400 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white'
            }`}
          >
            {hasNoLimit ? (
              <div className="flex items-center space-x-1.5 text-sm sm:text-base font-bold font-sans text-indigo-600 dark:text-indigo-400">
                <InfinityIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>{t('noTimeLimit')}</span>
              </div>
            ) : (
              <>
                <Clock className={`w-5 h-5 sm:w-6 sm:h-6 ${isUrgent ? 'text-red-500 animate-spin' : 'text-slate-400'}`} />
                <span>{timeRemaining}{t('seconds')}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 mb-6 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            isUrgent ? 'bg-red-500' : 'bg-gradient-to-r from-indigo-500 to-pink-500'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="w-full bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 mb-8 shadow-2xl text-center flex flex-col justify-center min-h-[180px] transition-colors">
        <QuestionMarkdown content={question.text} size="large" />
      </div>

      {/* 4 Answer Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
        {question.options.map((optionText, idx) => {
          const style = OPTION_STYLES[idx % OPTION_STYLES.length];
          return (
            <div
              key={idx}
              className={`relative rounded-2xl p-5 sm:p-6 border-2 ${style.border} ${style.bg} text-white shadow-xl flex items-center space-x-4 transition-transform`}
            >
              <div
                className={`w-12 h-12 rounded-xl ${style.iconBg} flex items-center justify-center font-black text-xl shadow flex-shrink-0`}
              >
                <span>{style.symbol}</span>
              </div>
              <div className="text-lg sm:text-xl font-bold leading-snug break-words flex-1">
                {optionText}
              </div>
            </div>
          );
        })}
      </div>

      {/* Answered Players Progress Bar & Avatar Pills */}
      <div className="w-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg transition-colors">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {t('answeredProgress', { answered: answeredPlayerIds.size, total: totalPlayers })}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {t('answersLockedInNotice')}
            </div>
          </div>
        </div>

        {/* Avatars and names of players with live answered status */}
        <div className="flex flex-wrap items-center gap-2 max-w-full">
          {players.map((p) => {
            const hasAnswered = answeredPlayerIds.has(p.id);
            return (
              <div
                key={p.id}
                title={`${p.name} ${hasAnswered ? t('answerLockedInTooltip') : t('thinkingTooltip')}`}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  hasAnswered
                    ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 shadow-md shadow-emerald-500/10 scale-105'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400'
                }`}
              >
                <AvatarDisplay avatar={p.avatar} name={p.name} size="xs" />
                <span className="truncate max-w-[100px]">{p.name}</span>
                {hasAnswered ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 ml-0.5" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-600 animate-pulse ml-0.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
