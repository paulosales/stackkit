import React from 'react';
import { Trophy, Flame, ArrowRight } from 'lucide-react';
import { Player } from '../../types/game';
import { useTranslation } from '../../i18n/I18nContext';
import { AvatarDisplay } from '../common/AvatarDisplay';

interface DisplayLeaderboardProps {
  players: Player[];
  questionIndex: number;
  totalQuestions: number;
  onNext: () => void;
  isLastQuestion: boolean;
}

export const DisplayLeaderboard: React.FC<DisplayLeaderboardProps> = ({
  players,
  questionIndex,
  totalQuestions,
  onNext,
  isLastQuestion,
}) => {
  const { t } = useTranslation();
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col justify-between min-h-[85vh]">
      {/* Header */}
      <div className="w-full flex items-center justify-between bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 shadow-xl mb-6 transition-colors">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500 dark:text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('leaderboardHeading')}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('question')} {questionIndex + 1} {t('of')} {totalQuestions}
            </p>
          </div>
        </div>

        <button
          onClick={onNext}
          className="px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/20 transition active:scale-95 flex items-center space-x-2"
        >
          <span>{isLastQuestion ? t('continueBtn') : t('nextQuestionBtn')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Leaderboard Cards List */}
      <div className="w-full space-y-3 mb-8">
        {sorted.map((player, index) => {
          const rank = index + 1;
          const isTop3 = rank <= 3;
          const rankBadgeColor =
            rank === 1
              ? 'bg-amber-500 text-slate-950 font-black'
              : rank === 2
              ? 'bg-slate-300 text-slate-950 font-black'
              : rank === 3
              ? 'bg-amber-700 text-white font-black'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 font-bold';

          return (
            <div
              key={player.id}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                isTop3
                  ? 'bg-white dark:bg-slate-900/95 border-amber-400/50 dark:border-slate-700 shadow-md scale-[1.01]'
                  : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80'
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${rankBadgeColor}`}>
                  {rank}
                </span>
                <AvatarDisplay avatar={player.avatar} name={player.name} size="md" />
                <div>
                  <div className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    {player.name}
                  </div>
                  {player.streak > 1 && (
                    <div className="flex items-center space-x-1 text-xs text-amber-500 dark:text-amber-400 font-semibold">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{t('streakTag', { streak: player.streak })}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {player.score.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t('pts')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
