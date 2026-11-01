import React from 'react';
import { Volume2, VolumeX, ArrowLeft, Wifi, WifiOff } from 'lucide-react';
import { DeviceRole } from '../../types/game';
import { sounds } from '../../services/soundService';
import { useTranslation } from '../../i18n/I18nContext';

interface HeaderProps {
  currentRole: DeviceRole | null;
  onResetRole: () => void;
  roomCode?: string;
  isConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onResetRole,
  roomCode,
  isConnected,
}) => {
  const { t } = useTranslation();
  const [muted, setMuted] = React.useState(sounds.getMuted());

  const handleToggleMute = () => {
    const newMuted = sounds.toggleMute();
    setMuted(newMuted);
  };

  const getRoleBadge = () => {
    if (!currentRole) return null;
    switch (currentRole) {
      case 'display':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
            🖥️ {t('displayDevice')}
          </span>
        );
      case 'manager':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30">
            👑 {t('quizManager')}
          </span>
        );
      case 'player':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            🎮 {t('playerDevice')}
          </span>
        );
    }
  };

  return (
    <header className="w-full bg-white/90 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50 transition-colors">
      <div className="flex items-center space-x-3">
        {currentRole && (
          <button
            onClick={() => {
              if (window.confirm(t('confirmEndSessionDesc'))) {
                onResetRole();
              }
            }}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={t('back')}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center space-x-2">
          <span className="text-xl">🎯</span>
          <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {t('appName')}
          </h1>
        </div>
        {getRoleBadge()}
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        {roomCode && (
          <div className="flex items-center space-x-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-300 dark:border-slate-700/60 font-mono text-xs">
            <span className="text-slate-500 dark:text-slate-400">{t('room')}:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{roomCode}</span>
          </div>
        )}

        {isConnected !== undefined && (
          <div
            className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-md ${
              isConnected
                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/40'
                : 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/40'
            }`}
            title={isConnected ? t('online') : t('loading')}
          >
            {isConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isConnected ? t('online') : t('loading')}</span>
          </div>
        )}


        {/* Audio Mute Button */}
        <button
          onClick={handleToggleMute}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          title={muted ? t('unmute') : t('mute')}
          aria-label={t('toggleSound')}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
