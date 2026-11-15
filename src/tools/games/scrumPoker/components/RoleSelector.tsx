import React, { useState } from 'react';
import { Layers, Users, Play, Sparkles, ArrowRight, ShieldCheck, Laptop, Smartphone, Eye } from 'lucide-react';
import { DeckType, DECKS, ParticipantRole, UserRole } from '../types';
import { generateRoomCode } from '../services/peerService';

interface RoleSelectorProps {
  initialRoomCode?: string;
  onSelectHost: (roomCode: string, deckType: DeckType) => void;
  onSelectJoin: (roomCode: string, name: string, avatar: string, role: ParticipantRole) => void;
  onStartSoloDemo: () => void;
  t: (key: string, options?: any) => string;
}

const AVATARS = ['💻', '🚀', '🦊', '🧙‍♂️', '⚡', '☕', '🎨', '🧪', '🛡️', '🤖', '🦁', '🎯'];

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  initialRoomCode = '',
  onSelectHost,
  onSelectJoin,
  onStartSoloDemo,
  t,
}) => {
  // Join form state
  const [joinCode, setJoinCode] = useState(initialRoomCode.toUpperCase());
  const [playerName, setPlayerName] = useState(() => {
    try {
      return localStorage.getItem('scrum_poker_name') || '';
    } catch {
      return '';
    }
  });
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    try {
      return localStorage.getItem('scrum_poker_avatar') || '💻';
    } catch {
      return '💻';
    }
  });
  const [joinRole, setJoinRole] = useState<ParticipantRole>('voter');

  // Host form state
  const [hostDeck, setHostDeck] = useState<DeckType>('modified-fibonacci');

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = joinCode.trim().toUpperCase();
    const cleanName = playerName.trim() || 'Estimator';
    if (!cleanCode) return;

    try {
      localStorage.setItem('scrum_poker_name', cleanName);
      localStorage.setItem('scrum_poker_avatar', selectedAvatar);
    } catch {}

    onSelectJoin(cleanCode, cleanName, selectedAvatar, joinRole);
  };

  const handleHostCreate = () => {
    const freshCode = generateRoomCode();
    onSelectHost(freshCode, hostDeck);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-cyan-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('tools.scrumPoker.heroBadge', { defaultValue: 'Zero-Server Peer-to-Peer Planning' })}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          {t('tools.scrumPoker.heroTitle', { defaultValue: 'Real-Time Scrum Planning Poker' })}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          {t('tools.scrumPoker.heroSubtitle', {
            defaultValue:
              'Estimate user stories with your agile team across mobile & desktop. 100% private, zero-server WebRTC via direct peer connections.',
          })}
        </p>
      </div>

      {/* Main 2 Cards: Host vs Join */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Host Card */}
        <div className="group relative bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 hover:border-blue-500/60 dark:hover:border-blue-500/60 transition-all duration-300 shadow-lg hover:shadow-blue-500/10 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t('tools.scrumPoker.hostCardTitle', { defaultValue: 'Host a Session' })}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold">
                {t('tools.scrumPoker.roles.host', { defaultValue: 'Host / Moderator' })}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mb-4 leading-relaxed">
              {t('tools.scrumPoker.hostCardDesc', {
                defaultValue:
                  'Create a new session, project onto a team screen, run rounds in real time, and reveal estimates.',
              })}
            </p>

            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 mb-6">
              <li className="flex items-center space-x-2">
                <span className="text-blue-500 font-bold">✓</span>
                <span>{t('tools.scrumPoker.features.rounds', { defaultValue: 'Instant round-by-round estimation' })}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-blue-500 font-bold">✓</span>
                <span>{t('tools.scrumPoker.features.realtime', { defaultValue: 'Real-time voting board & instant 3D card reveal' })}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-blue-500 font-bold">✓</span>
                <span>{t('tools.scrumPoker.features.stats', { defaultValue: 'Consensus analytics, agreement % & statistics' })}</span>
              </li>
            </ul>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {t('tools.scrumPoker.selectDeck', { defaultValue: 'Starting Card Deck' })}
              </label>
              <select
                value={hostDeck}
                onChange={(e) => setHostDeck(e.target.value as DeckType)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(DECKS).map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.cards.slice(0, 5).join(', ')}...)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleHostCreate}
            className="w-full py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-600/20 transition active:scale-95 flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('tools.scrumPoker.createRoomBtn', { defaultValue: 'Create Room & Host' })}</span>
          </button>
        </div>

        {/* Join Card */}
        <div className="group relative bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all duration-300 shadow-lg hover:shadow-emerald-500/10 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5 group-hover:scale-105 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t('tools.scrumPoker.joinCardTitle', { defaultValue: 'Join Session' })}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                {t('tools.scrumPoker.roles.participant', { defaultValue: 'Estimator Pad' })}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mb-4 leading-relaxed">
              {t('tools.scrumPoker.joinCardDesc', {
                defaultValue:
                  'Connect with your phone or laptop by entering the 5-letter Room Code from the host.',
              })}
            </p>

            <form onSubmit={handleJoinSubmit} className="space-y-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('tools.scrumPoker.roomCodeLabel', { defaultValue: 'Room Code (5 letters)' })}
                </label>
                <input
                  type="text"
                  maxLength={5}
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="e.g. 7KW9X"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-base font-mono font-bold tracking-widest text-slate-900 dark:text-white uppercase placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('tools.scrumPoker.yourNameLabel', { defaultValue: 'Your Name' })}
                </label>
                <input
                  type="text"
                  maxLength={24}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder={t('tools.scrumPoker.namePlaceholder', { defaultValue: 'e.g. Alex (Frontend)' })}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('tools.scrumPoker.avatarLabel', { defaultValue: 'Avatar' })}
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setSelectedAvatar(av)}
                      className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center border transition ${
                        selectedAvatar === av
                          ? 'bg-cyan-100 dark:bg-cyan-950/80 border-cyan-500 ring-2 ring-cyan-400/50 scale-110'
                          : 'bg-slate-100 dark:bg-slate-800/60 border-transparent hover:border-slate-300'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-1">
                <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="joinRole"
                    checked={joinRole === 'voter'}
                    onChange={() => setJoinRole('voter')}
                    className="text-cyan-500 focus:ring-cyan-400"
                  />
                  <span>{t('tools.scrumPoker.voterRole', { defaultValue: 'Voter (Estimator)' })}</span>
                </label>
                <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="radio"
                    name="joinRole"
                    checked={joinRole === 'spectator'}
                    onChange={() => setJoinRole('spectator')}
                    className="text-cyan-500 focus:ring-cyan-400"
                  />
                  <span>{t('tools.scrumPoker.spectatorRole', { defaultValue: 'Observer / Spectator' })}</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!joinCode.trim()}
                className="w-full mt-2 py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/20 transition active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{t('tools.scrumPoker.joinRoomBtn', { defaultValue: 'Join Session' })}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Demo / Quick Solo Test Option */}
      <div className="w-full max-w-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center justify-center sm:justify-start">
            <Sparkles className="w-4 h-4 text-amber-500 mr-1.5" />
            {t('tools.scrumPoker.soloDemoTitle', { defaultValue: 'Want to try it right away?' })}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {t('tools.scrumPoker.soloDemoDesc', {
              defaultValue: 'Launch an instant interactive session with simulated teammates.',
            })}
          </p>
        </div>
        <button
          type="button"
          onClick={onStartSoloDemo}
          className="px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-amber-400 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm transition flex-shrink-0"
        >
          {t('tools.scrumPoker.soloDemoBtn', { defaultValue: 'Launch Solo Demo' })}
        </button>
      </div>
    </div>
  );
};

