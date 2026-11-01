import React from 'react';
import { Sparkles, Smartphone, ShieldCheck, Gamepad2 } from 'lucide-react';
import { DeviceRole } from '../../types/game';
import { useTranslation } from '../../i18n/I18nContext';

interface RoleSelectorProps {
  onSelectRole: (role: DeviceRole, roomCode?: string) => void;
  initialRoomCode?: string;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  onSelectRole,
  initialRoomCode = '',
}) => {
  const { t } = useTranslation();
  const [playerRoomCode, setPlayerRoomCode] = React.useState(initialRoomCode);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center">
      {/* Subtitle / Instructions */}
      <div className="text-center mb-8 max-w-2xl">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          {t('roleSelectorDesc')}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
          {t('webrtcSubtitle')}
        </p>
      </div>

      {/* Role Cards Grid (2 Columns: Manager, Player) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-10">
        {/* 1. Manager Device Card (Host / Controller) */}
        <div className="group relative bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 hover:border-blue-500/60 dark:hover:border-blue-500/60 transition-all duration-300 shadow-lg hover:shadow-blue-500/10 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('quizManager')}</h3>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold">
                {t('hostRemoteBadge')}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mb-4 leading-relaxed">
              {t('quizManagerDesc')}
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 mb-6">
              <li className="flex items-center space-x-2">
                <span className="text-blue-500">✓</span>
                <span>{t('featureCombineQuizzes')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-blue-500">✓</span>
                <span>{t('featureLaunchDisplay')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-blue-500">✓</span>
                <span>{t('featureRemoteController')}</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onSelectRole('manager')}
            className="w-full py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-600/20 transition active:scale-95 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('launchAsManager')}</span>
          </button>
        </div>

        {/* 2. Player Device Card (Contestant Pad) */}
        <div className="group relative bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all duration-300 shadow-lg hover:shadow-emerald-500/10 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5 group-hover:scale-105 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('playerDevice')}</h3>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                {t('contestantBadge')}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mb-4 leading-relaxed">
              {t('playerDeviceDesc')}
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                {t('roomCodeLabel')}
              </label>
              <input
                type="text"
                placeholder={t('roomCodePlaceholder')}
                value={playerRoomCode}
                onChange={(e) => setPlayerRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm uppercase font-mono tracking-wider text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            onClick={() => onSelectRole('player', playerRoomCode)}
            className="w-full py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/20 transition active:scale-95 flex items-center justify-center space-x-2"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>{t('joinAsPlayer')}</span>
          </button>
        </div>
      </div>

      {/* Architecture feature callout */}
      <div className="w-full max-w-3xl bg-slate-100 dark:bg-slate-900/60 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-start space-x-3 text-xs text-slate-600 dark:text-slate-400 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{t('webrtcNoticeTitle')} </span>
          {t('webrtcNoticeDesc')}
        </div>
      </div>
    </div>
  );
};
