import React from 'react';
import { Tv, CheckCircle2 } from 'lucide-react';
import { AvatarDisplay } from '../common/AvatarDisplay';
import { useTranslation } from '../../i18n/I18nContext';

interface PlayerLobbyProps {
  playerName: string;
  playerAvatar: string;
  roomCode: string;
  quizTitle?: string;
}

export const PlayerLobby: React.FC<PlayerLobbyProps> = ({
  playerName,
  playerAvatar,
  roomCode,
  quizTitle,
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[75vh] text-center">
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl w-full flex flex-col items-center transition-colors">
        {/* Big Avatar */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center shadow-xl shadow-emerald-500/10 overflow-hidden">
            <AvatarDisplay
              avatar={playerAvatar}
              name={playerName}
              sizeClass="w-full h-full"
              textClass="text-5xl"
            />
          </div>
          <CheckCircle2 className="w-7 h-7 text-emerald-500 bg-white dark:bg-slate-900 rounded-full absolute -top-2 -right-2" />
        </div>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{playerName}</h2>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-indigo-600 dark:text-indigo-400 font-mono font-bold mb-6">
          <span>{t('room')}:</span>
          <span>{roomCode}</span>
        </div>

        <div className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 mb-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-indigo-600 dark:text-indigo-400 text-sm font-bold mb-2">
            <Tv className="w-5 h-5 animate-pulse" />
            <span>{t('youreInLobby')}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('lookAtBigScreen')}
          </p>
          {quizTitle && (
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400">
              Quiz: <strong className="text-slate-900 dark:text-white">{quizTitle}</strong>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>{t('readyToPlay')}</span>
        </div>
      </div>
    </div>
  );
};
