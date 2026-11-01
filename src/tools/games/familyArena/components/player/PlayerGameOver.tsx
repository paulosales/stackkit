import React from 'react';
import { RotateCcw } from 'lucide-react';
import { AvatarDisplay } from '../common/AvatarDisplay';
import { useTranslation } from '../../i18n/I18nContext';

interface PlayerGameOverProps {
  finalScore: number;
  finalRank: number;
  totalPlayers: number;
  playerName: string;
  playerAvatar: string;
  onLeave: () => void;
}

export const PlayerGameOver: React.FC<PlayerGameOverProps> = ({
  finalScore,
  finalRank,
  totalPlayers,
  playerName,
  playerAvatar,
  onLeave,
}) => {
  const { t } = useTranslation();
  const isWinner = finalRank === 1;

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 flex flex-col justify-center min-h-[75vh] text-center">
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur transition-colors">
        {/* Trophy / Avatar */}
        <div className="mb-4 flex justify-center">
          <div
            className={`w-24 h-24 rounded-3xl border-2 flex items-center justify-center text-4xl shadow-xl overflow-hidden ${
              isWinner
                ? 'bg-amber-500/20 border-amber-400 text-amber-500 shadow-amber-500/20'
                : 'bg-indigo-500/20 border-indigo-400 text-indigo-500'
            }`}
          >
            {isWinner ? (
              '🏆'
            ) : (
              <AvatarDisplay
                avatar={playerAvatar}
                name={playerName}
                sizeClass="w-full h-full"
                textClass="text-4xl"
              />
            )}
          </div>
        </div>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
          {t('gameOverTitle')}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
          {t('youFinishedAt', { rank: finalRank, total: totalPlayers })}
        </p>

        {/* Final Ranking Card */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 mb-4">
          <div className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">
            {t('yourRankLabel')}
          </div>
          <div className="text-3xl font-black text-amber-500">
            {finalRank === 1
              ? t('rank1Champion')
              : finalRank === 2
              ? t('rank2Place')
              : finalRank === 3
              ? t('rank3Place')
              : t('rankNPlace', { rank: finalRank })}
          </div>
        </div>

        {/* Final Score */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 mb-8">
          <div className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">
            {t('finalScoreLabel')}
          </div>
          <div className="font-mono text-4xl font-black text-indigo-600 dark:text-indigo-400">
            {finalScore.toLocaleString()}
          </div>
        </div>

        <button
          onClick={onLeave}
          className="w-full py-3.5 rounded-xl font-bold text-sm bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white flex items-center justify-center space-x-2 transition active:scale-95 border border-slate-300 dark:border-slate-700"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t('playAgainBtn')}</span>
        </button>
      </div>
    </div>
  );
};
