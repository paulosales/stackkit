import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Users, Sparkles, QrCode, Copy, Check, Settings, Bot, Wifi, WifiOff, AlertTriangle, RotateCcw } from 'lucide-react';
import { Player, Quiz } from '../../types/game';
import { PeerConnectionStatus } from '../../services/peerService';
import { useTranslation } from '../../i18n/I18nContext';
import { AvatarDisplay } from '../common/AvatarDisplay';

interface DisplayLobbyProps {
  roomCode: string;
  loadedQuiz: Quiz | null;
  players: Player[];
  isManagerConnected: boolean;
  hostStatus?: PeerConnectionStatus;
  onRegenerateRoomCode?: () => void;
  onAddTestPlayer?: () => void;
  onStartGame?: () => void;
}

export const DisplayLobby: React.FC<DisplayLobbyProps> = ({
  roomCode,
  loadedQuiz,
  players,
  isManagerConnected,
  hostStatus,
  onRegenerateRoomCode,
  onAddTestPlayer,
  onStartGame,
}) => {
  const { t } = useTranslation();
  const [customHost, setCustomHost] = React.useState('');
  const [showHostSettings, setShowHostSettings] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Compute player join URL with explicit hostId and preservation of current route
  const baseUrl = customHost.trim() || (typeof window !== 'undefined' ? window.location.origin : '');
  const pathname = typeof window !== 'undefined' ? (window.location.pathname || '') : '/family-arena';
  let toolBasePath = '/family-arena';
  if (pathname.includes('family-arena') || pathname.includes('quiz-arena')) {
    toolBasePath = pathname.split('?')[0];
  } else if (pathname.startsWith('/pt')) {
    toolBasePath = '/pt/family-arena';
  } else if (pathname.startsWith('/en')) {
    toolBasePath = '/en/family-arena';
  }

  const hostId = hostStatus?.peerId || `fa-room-${roomCode}`;
  const playerJoinUrl = customHost.trim()
    ? `${customHost.trim().replace(/\/$/, '')}${toolBasePath}?role=player&room=${roomCode}&hostId=${hostId}`
    : `${baseUrl}${toolBasePath}?role=player&room=${roomCode}&hostId=${hostId}`;

  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
    !customHost.trim();

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Top Banner: Quiz status & Host settings */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 mb-6 shadow-xl transition-colors">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 text-2xl flex-shrink-0">
            {loadedQuiz ? '📋' : '⏳'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                {loadedQuiz ? t('presetTrivia') : t('waitingForQuiz')}
              </span>
              {loadedQuiz && (
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/30">
                  {t('readyToPlay')}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {loadedQuiz ? loadedQuiz.title : t('waitingForQuiz')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {loadedQuiz
                ? `${loadedQuiz.questions.length} ${t('questions')} • ${loadedQuiz.category}`
                : t('managerMustSendQuiz')}
            </p>
          </div>
        </div>

        {/* Manager Connection Status */}
        <div className="flex items-center space-x-3">
          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 ${isManagerConnected
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/30'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30 animate-pulse'
              }`}
          >
            <span className={`w-2 h-2 rounded-full ${isManagerConnected ? 'bg-blue-500' : 'bg-amber-500'}`} />
            <span>{isManagerConnected ? t('managerConnectedTag') : t('managerWaitingTag')}</span>
          </div>

          <button
            onClick={() => setShowHostSettings(!showHostSettings)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title={t('configLanIp')}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* WebRTC Room Status Alert if error or connecting */}
      {hostStatus?.error && (
        <div className="w-full bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-500/50 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-red-800 dark:text-red-200 text-xs">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
            <span>{hostStatus.error}</span>
          </div>
          {onRegenerateRoomCode && (
            <button
              onClick={onRegenerateRoomCode}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center space-x-1.5 shadow"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('generateNewCode')}</span>
            </button>
          )}
        </div>
      )}

      {/* Localhost Notice for Mobile Scanning */}
      {isLocalhost && (
        <div className="w-full bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/40 rounded-2xl p-4 mb-6 text-xs text-amber-800 dark:text-amber-200">
          <div className="flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">{t('mobileScanNotice')} </span>
              {t('localhostCannotResolve')}
              <div className="mt-2 flex flex-col sm:flex-row items-center gap-2">
                <span className="text-slate-600 dark:text-slate-300">{t('enterLocalIp')}</span>
                <input
                  type="text"
                  placeholder="e.g. http://192.168.1.50:5173"
                  value={customHost}
                  onChange={(e) => setCustomHost(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 w-full sm:w-64"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Host Settings Dropdown */}
      {showHostSettings && (
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-6 text-sm shadow-md">
          <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center space-x-2">
            <span>{t('lanConfigTitle')}</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            {t('lanConfigDesc')}
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder={typeof window !== 'undefined' ? window.location.origin : 'http://192.168.1.x:5173'}
              value={customHost}
              onChange={(e) => setCustomHost(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => setCustomHost('')}
              className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs text-slate-700 dark:text-slate-300 rounded-lg transition"
            >
              {t('resetDefault')}
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: QR Code Join Panel & Joined Players Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        {/* Left Column: QR Code & Room Code */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center shadow-xl transition-colors">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-2">
            <QrCode className="w-4 h-4" />
            <span>{t('scanToJoin')}</span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-xs mb-3">
            {t('orEnterRoomCode')}
          </p>

          {/* WebRTC Host Connectivity Pill */}
          <div className="mb-4">
            {hostStatus?.connected ? (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <Wifi className="w-3 h-3" />
                <span>{t('onlineAndReady')}</span>
              </span>
            ) : hostStatus?.connecting ? (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>{t('connectingToGameRoom')}</span>
              </span>
            ) : null}
          </div>

          {/* Crisp QR Code with white background padding for fast camera scanning */}
          <div className="p-4 bg-white rounded-2xl shadow-xl shadow-indigo-900/10 dark:shadow-indigo-950/50 mb-6 border-4 border-indigo-500/20">
            <QRCodeSVG
              value={playerJoinUrl}
              size={220}
              level="H"
              includeMargin={false}
              fgColor="#0f172a"
            />
          </div>

          {/* Room Code Badge */}
          <div className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 mb-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider mb-1">
              {t('roomCodeLabel')}
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400 font-mono">
              {roomCode}
            </div>
          </div>

          {/* Direct URL copy */}
          <div className="w-full flex items-center justify-between bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="truncate max-w-[200px] sm:max-w-[260px]">{playerJoinUrl}</span>
            <button
              onClick={() => copyUrl(playerJoinUrl)}
              className="ml-2 p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:text-slate-900 dark:hover:text-white text-slate-700 dark:text-slate-300 transition flex items-center space-x-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t('copied') : t('copy')}</span>
            </button>
          </div>

          {/* Pair Manager hint if not yet connected */}
          {!isManagerConnected && (
            <div className="mt-4 text-xs text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 rounded-xl p-2.5">
              💡 {t('managerMustSendQuiz')} (Room <strong>{roomCode}</strong>)
            </div>
          )}
        </div>

        {/* Right Column: Player Roster & Actions */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl transition-colors">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t('playersJoinedHeading', { count: players.length })}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {players.length === 0
                      ? t('noPlayersYet')
                      : t('playersReadyCount', { count: players.length })}
                  </p>
                </div>
              </div>

              {/* Dev Simulation Bot Button */}
              {onAddTestPlayer && (
                <button
                  onClick={onAddTestPlayer}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center space-x-1.5 transition"
                  title={t('simulateBotTitle')}
                >
                  <Bot className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{t('addTestBotBtn')}</span>
                </button>
              )}
            </div>

            {/* Players Grid */}
            {players.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <div className="text-4xl mb-3 animate-bounce">📱</div>
                <h4 className="text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  {t('noPlayersYet')}
                </h4>
                <p className="text-slate-500 text-xs max-w-sm">
                  {t('scanToJoin')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[360px] overflow-y-auto pr-1">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-3.5 flex items-center space-x-3 shadow-sm animate-fadeIn"
                  >
                    <AvatarDisplay avatar={player.avatar} name={player.name} size="md" />
                    <div className="overflow-hidden">
                      <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {player.name}
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{t('readyStatus')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lobby Footer Action */}
          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
              {loadedQuiz
                ? t('managerCanStartNotice')
                : t('managerMustSendQuiz')}
            </div>

            {loadedQuiz && onStartGame && (
              <button
                onClick={onStartGame}
                disabled={players.length === 0}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm shadow-xl transition flex items-center justify-center space-x-2 ${players.length > 0
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/30 active:scale-95'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('startGameBtn')} ({players.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
