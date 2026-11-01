import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, Trophy, Flame } from 'lucide-react';
import { QuestionResult } from '../../types/game';
import { sounds } from '../../services/soundService';
import { useTranslation } from '../../i18n/I18nContext';

interface PlayerResultProps {
  result: QuestionResult;
  correctOptionIndex: number;
}

export const PlayerResult: React.FC<PlayerResultProps> = ({
  result,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (result.isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playIncorrect();
    }
  }, [result]);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 flex flex-col justify-center min-h-[75vh] text-center">
      <div
        className={`rounded-3xl p-8 border-2 shadow-2xl backdrop-blur transition-all ${
          result.isCorrect
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/50 shadow-emerald-900/10'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/50 shadow-rose-900/10'
        }`}
      >
        {/* Status Icon */}
        <div className="mb-4 flex justify-center">
          {result.isCorrect ? (
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-12 h-12" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-3xl bg-rose-500/20 border-2 border-rose-500/40 flex items-center justify-center text-rose-500">
              <XCircle className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-1">
          {result.isCorrect ? t('correctBanner') : t('incorrectBanner')}
        </h2>
        <div className="font-mono text-xl font-bold mb-6">
          {result.isCorrect ? (
            <span className="text-emerald-600 dark:text-emerald-400">
              {t('pointsEarned', { pts: result.pointsAwarded })}
            </span>
          ) : (
            <span className="text-slate-500 dark:text-slate-400">+0 {t('pts')}</span>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5">
            <div className="flex items-center justify-center space-x-1 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('yourRankLabel')}</span>
            </div>
            <div className="font-black text-2xl text-slate-900 dark:text-white">
              #{result.rank}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5">
            <div className="flex items-center justify-center space-x-1 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>{t('streakLabel')}</span>
            </div>
            <div className="font-black text-2xl text-orange-500">
              {result.streak}x
            </div>
          </div>
        </div>

        {/* Total Score Banner */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
          <div className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 mb-0.5">
            {t('yourScoreLabel')}
          </div>
          <div className="font-mono text-3xl font-black text-indigo-600 dark:text-indigo-400">
            {result.totalScore.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
