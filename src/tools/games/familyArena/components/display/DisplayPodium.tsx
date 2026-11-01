import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Medal, RotateCcw } from 'lucide-react';
import { Player } from '../../types/game';
import { sounds } from '../../services/soundService';
import { useTranslation } from '../../i18n/I18nContext';
import { AvatarDisplay } from '../common/AvatarDisplay';

interface DisplayPodiumProps {
  players: Player[];
  onPlayAgain: () => void;
}

export const DisplayPodium: React.FC<DisplayPodiumProps> = ({
  players,
  onPlayAgain,
}) => {
  const { t } = useTranslation();
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const first = sorted[0];
  const second = sorted[1];
  const third = sorted[2];
  const rest = sorted.slice(3);

  useEffect(() => {
    sounds.playFanfare();

    // Burst confetti from both sides!
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 flex flex-col items-center">
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-sm font-bold mb-3">
          <Trophy className="w-4 h-4" />
          <span>{t('podiumTitle')}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {t('podiumSubtitle')}
        </h1>
      </div>

      {/* 3-Pillar Podium */}
      <div className="w-full max-w-2xl grid grid-cols-3 gap-2 sm:gap-4 items-end mb-12">
        {/* 2nd Place Pillar */}
        <div className="flex flex-col items-center">
          {second ? (
            <div className="flex flex-col items-center mb-3 animate-fadeIn">
              <div className="mb-2">
                <AvatarDisplay avatar={second.avatar} name={second.name} size="xl" />
              </div>
              <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate max-w-[90px] sm:max-w-[120px]">
                {second.name}
              </span>
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                {second.score.toLocaleString()} {t('pts')}
              </span>
            </div>
          ) : (
            <div className="h-20" />
          )}
          <div className="w-full bg-slate-300 dark:bg-slate-700/80 border-t-4 border-slate-400 rounded-t-2xl p-4 flex flex-col items-center justify-center h-44 shadow-lg">
            <span className="text-2xl sm:text-3xl font-black text-slate-700 dark:text-slate-300">2</span>
            <Medal className="w-6 h-6 text-slate-600 dark:text-slate-300 mt-1" />
          </div>
        </div>

        {/* 1st Place Pillar (Tallest) */}
        <div className="flex flex-col items-center">
          {first ? (
            <div className="flex flex-col items-center mb-3 animate-bounce-short">
              <span className="text-2xl mb-1">👑</span>
              <div className="mb-2">
                <AvatarDisplay avatar={first.avatar} name={first.name} size="2xl" />
              </div>
              <span className="font-black text-base sm:text-xl text-amber-600 dark:text-amber-300 truncate max-w-[100px] sm:max-w-[150px]">
                {first.name}
              </span>
              <span className="text-sm font-mono font-extrabold text-amber-500 dark:text-amber-400">
                {first.score.toLocaleString()} {t('pts')}
              </span>
            </div>
          ) : (
            <div className="h-24" />
          )}
          <div className="w-full bg-gradient-to-t from-amber-500 to-yellow-400 dark:from-amber-600 dark:to-yellow-500 border-t-4 border-yellow-200 rounded-t-2xl p-4 flex flex-col items-center justify-center h-60 shadow-2xl">
            <span className="text-3xl sm:text-4xl font-black text-slate-950">1</span>
            <Trophy className="w-8 h-8 text-slate-950 mt-1" />
          </div>
        </div>

        {/* 3rd Place Pillar */}
        <div className="flex flex-col items-center">
          {third ? (
            <div className="flex flex-col items-center mb-3 animate-fadeIn">
              <div className="mb-2">
                <AvatarDisplay avatar={third.avatar} name={third.name} size="xl" />
              </div>
              <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate max-w-[90px] sm:max-w-[120px]">
                {third.name}
              </span>
              <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-500">
                {third.score.toLocaleString()} {t('pts')}
              </span>
            </div>
          ) : (
            <div className="h-16" />
          )}
          <div className="w-full bg-amber-200 dark:bg-amber-900/80 border-t-4 border-amber-400 dark:border-amber-700 rounded-t-2xl p-4 flex flex-col items-center justify-center h-32 shadow-lg">
            <span className="text-2xl sm:text-3xl font-black text-amber-800 dark:text-amber-500">3</span>
            <Medal className="w-6 h-6 text-amber-700 dark:text-amber-500 mt-1" />
          </div>
        </div>
      </div>

      {/* Other Players List */}
      {rest.length > 0 && (
        <div className="w-full max-w-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-8 shadow-md">
          <h4 className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 mb-3 tracking-wider">
            {t('honorableRunnersUp')}
          </h4>
          <div className="space-y-2">
            {rest.map((p, idx) => (
              <div
                key={p.id}
                className="flex items-center justify-between py-2 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-slate-400">#{idx + 4}</span>
                  <AvatarDisplay avatar={p.avatar} name={p.name} size="sm" />
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{p.name}</span>
                </div>
                <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300">
                  {p.score.toLocaleString()} {t('pts')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action: Play Again */}
      <button
        onClick={onPlayAgain}
        className="px-8 py-3.5 rounded-2xl font-bold text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-600/20 active:scale-95 transition flex items-center space-x-2"
      >
        <RotateCcw className="w-5 h-5" />
        <span>{t('playAgainBtn')}</span>
      </button>
    </div>
  );
};
