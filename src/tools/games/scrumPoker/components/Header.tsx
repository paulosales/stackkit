import React, { useState } from 'react';
import { Copy, Check, Volume2, VolumeX, LogOut, Wifi, WifiOff, Layers, Users } from 'lucide-react';
import { UserRole } from '../types';
import { PeerConnectionStatus } from '../services/peerService';
import { soundService } from '../services/soundService';

interface HeaderProps {
  currentRole: UserRole | null;
  roomCode: string;
  connectionStatus?: PeerConnectionStatus;
  onResetRole: () => void;
  t: (key: string, options?: any) => string;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  roomCode,
  connectionStatus,
  onResetRole,
  t,
}) => {
  const [copied, setCopied] = useState(false);
  const [isMuted, setIsMuted] = useState(() => soundService.isMuted());

  const handleCopyCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSound = () => {
    const nextMuted = soundService.toggleMute();
    setIsMuted(nextMuted);
  };

  return (
    <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between transition-colors sticky top-0 z-30">
      {/* Brand & Title */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center">
            {t('tools.scrumPoker.title', { defaultValue: 'Scrum Poker' })}
            <span className="ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20">
              P2P WebRTC
            </span>
          </h1>
          {currentRole && (
            <span className="text-xs text-slate-500 dark:text-slate-400 capitalize flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block"></span>
              {currentRole === 'host'
                ? t('tools.scrumPoker.roles.host', { defaultValue: 'Host / Moderator' })
                : t('tools.scrumPoker.roles.participant', { defaultValue: 'Participant' })}
            </span>
          )}
        </div>
      </div>

      {/* Center/Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {roomCode && (
          <button
            type="button"
            onClick={handleCopyCode}
            title={t('tools.scrumPoker.copyCodeTitle', { defaultValue: 'Click to copy Room Code' })}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
          >
            <span className="text-slate-400 text-[10px] uppercase font-sans">Room</span>
            <span>{roomCode}</span>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        )}

        {/* Connection status indicator */}
        {connectionStatus && (
          <div
            className={`hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
              connectionStatus.connected
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : connectionStatus.connecting
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-500/30'
            }`}
          >
            {connectionStatus.connected ? (
              <>
                <Wifi className="w-3 h-3" />
                <span>Online</span>
              </>
            ) : connectionStatus.connecting ? (
              <>
                <Wifi className="w-3 h-3 animate-pulse" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" />
                <span>Offline</span>
              </>
            )}
          </div>
        )}

        {/* Sound Mute Toggle */}
        <button
          type="button"
          onClick={toggleSound}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Leave Room Button */}
        {currentRole && (
          <button
            type="button"
            onClick={onResetRole}
            title={t('tools.scrumPoker.leaveRoom', { defaultValue: 'Leave Session' })}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('tools.scrumPoker.exit', { defaultValue: 'Exit' })}</span>
          </button>
        )}
      </div>
    </header>
  );
};

