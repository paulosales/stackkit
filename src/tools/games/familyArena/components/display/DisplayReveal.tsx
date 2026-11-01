import React from 'react';
import { CheckCircle, XCircle, Zap, ArrowRight, Clock } from 'lucide-react';
import { QuizQuestion, Player, AnswerSubmission } from '../../types/game';
import { useTranslation } from '../../i18n/I18nContext';
import { AvatarDisplay } from '../common/AvatarDisplay';
import { QuestionMarkdown } from '../common/QuestionMarkdown';

interface DisplayRevealProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  players: Player[];
  answers: AnswerSubmission[];
  onNext: () => void;
}

const OPTION_STYLES = [
  { bg: 'bg-red-600', border: 'border-red-500', symbol: '▲', label: 'A' },
  { bg: 'bg-blue-600', border: 'border-blue-500', symbol: '◆', label: 'B' },
  { bg: 'bg-amber-500', border: 'border-amber-400', symbol: '●', label: 'C' },
  { bg: 'bg-emerald-600', border: 'border-emerald-500', symbol: '■', label: 'D' },
];

export const DisplayReveal: React.FC<DisplayRevealProps> = ({
  question,
  questionIndex,
  totalQuestions,
  players,
  answers,
  onNext,
}) => {
  const { t } = useTranslation();
  // Count how many players chose each option
  const optionCounts = [0, 0, 0, 0];
  let fastestCorrect: { player: Player; timeTaken: number } | null = null;

  for (const ans of answers) {
    if (ans.optionIndex >= 0 && ans.optionIndex < 4) {
      optionCounts[ans.optionIndex]++;
    }
    if (ans.optionIndex === question.correctAnswerIndex) {
      const p = players.find((x) => x.id === ans.playerId);
      if (p) {
        if (!fastestCorrect || ans.timeTakenMs < fastestCorrect.timeTaken) {
          fastestCorrect = { player: p, timeTaken: ans.timeTakenMs };
        }
      }
    }
  }

  const totalAnswered = answers.length;
  const correctCount = optionCounts[question.correctAnswerIndex] || 0;
  const unansweredPlayers = players.filter((p) => !answers.some((a) => a.playerId === p.id));
  const percentCorrect = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-between min-h-[85vh]">
      {/* Header */}
      <div className="w-full flex items-center justify-between bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 shadow-xl mb-6 transition-colors">
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold text-sm sm:text-base border border-purple-500/30">
            {t('resultsHeading', { current: questionIndex + 1, total: totalQuestions })}
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            {t('playersCorrectSummary', { correct: correctCount, total: totalAnswered, percent: percentCorrect })}
          </span>
        </div>

        <button
          onClick={onNext}
          className="px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/20 transition active:scale-95 flex items-center space-x-2"
        >
          <span>{t('continueBtn')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Question Text */}
      <div className="w-full bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 mb-6 shadow-2xl text-center transition-colors">
        <QuestionMarkdown content={question.text} size="medium" />
      </div>

      {/* Answer Distribution Cards with Bar Heights and Player Avatars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {question.options.map((opt, idx) => {
          const isCorrect = idx === question.correctAnswerIndex;
          const count = optionCounts[idx];
          const pct = totalAnswered > 0 ? Math.round((count / totalAnswered) * 100) : 0;
          const style = OPTION_STYLES[idx % OPTION_STYLES.length];
          const optionAnswers = answers.filter((a) => a.optionIndex === idx);

          return (
            <div
              key={idx}
              className={`relative rounded-3xl p-5 border-2 transition-all flex flex-col justify-between min-h-[250px] shadow-xl ${
                isCorrect
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-4 ring-emerald-500/20 scale-[1.02]'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 opacity-75'
              }`}
            >
              <div>
                {/* Top: Icon + Correct/Incorrect status badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center font-bold text-sm text-white`}>
                    {style.symbol}
                  </span>

                  {isCorrect ? (
                    <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{t('correctBadge')}</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-slate-400 text-xs font-medium">
                      <XCircle className="w-3 h-3" />
                    </span>
                  )}
                </div>

                {/* Option Text */}
                <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-3">
                  {opt}
                </div>

                {/* List of Players who chose this option */}
                {optionAnswers.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {optionAnswers.map((ans) => {
                      const p = players.find((pl) => pl.id === ans.playerId);
                      if (!p) return null;
                      return (
                        <span
                          key={p.id}
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm transition-all ${
                            isCorrect
                              ? 'bg-emerald-100 dark:bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40'
                              : 'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}
                          title={`${p.name} (${(ans.timeTakenMs / 1000).toFixed(1)}s)`}
                        >
                          <AvatarDisplay avatar={p.avatar} name={p.name} size="xs" />
                          <span className="truncate max-w-[80px]">{p.name}</span>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Vote Count & Visual Bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className={isCorrect ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'}>
                    {count} {count === 1 ? t('voteSingle') : t('votePlural')}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">{pct}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isCorrect ? 'bg-emerald-500' : 'bg-slate-400 dark:bg-slate-600'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Players who ran out of time */}
      {unansweredPlayers.length > 0 && (
        <div className="w-full flex items-center justify-center space-x-2 text-xs text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-4 mb-4">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>{t('ranOutOfTime')}</span>
          <div className="flex items-center space-x-2">
            {unansweredPlayers.map((p) => (
              <span key={p.id} className="text-slate-800 dark:text-slate-300 font-medium flex items-center space-x-1">
                <AvatarDisplay avatar={p.avatar} name={p.name} size="xs" />
                <span>{p.name}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Fastest Player Shoutout */}
      {fastestCorrect && (
        <div className="w-full bg-amber-50 dark:bg-gradient-to-r dark:from-amber-500/10 dark:via-yellow-500/10 dark:to-amber-500/10 border border-amber-300 dark:border-amber-500/30 rounded-2xl p-4 flex items-center justify-center space-x-3 text-amber-800 dark:text-amber-300 shadow-md">
          <Zap className="w-5 h-5 text-amber-500 dark:text-yellow-400 animate-bounce" />
          <span className="text-sm font-semibold flex items-center space-x-1.5">
            <span>{t('lightningFast')}</span>
            <AvatarDisplay avatar={fastestCorrect.player.avatar} name={fastestCorrect.player.name} size="xs" />
            <strong className="text-slate-900 dark:text-white">{fastestCorrect.player.name}</strong>
            <span>{t('wasQuickest')}</span>
            <strong className="text-amber-700 dark:text-yellow-400">{(fastestCorrect.timeTaken / 1000).toFixed(2)}s</strong>!
          </span>
        </div>
      )}
    </div>
  );
};
