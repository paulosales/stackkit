import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Eye,
  RotateCcw,
  Share2,
  Users,
  Bot,
  Timer,
  Plus,
} from 'lucide-react';
import { Participant, VotingState, DeckType, DECKS, VotingStats } from '../types';
import { TableParticipantCard, DeckCard } from './PokerCard';
import { VotingStatsDisplay } from './VotingStats';
import { soundService } from '../services/soundService';

interface HostViewProps {
  roomCode: string;
  roundNumber: number;
  stats: VotingStats | null;
  deckType: DeckType;
  deckCards: (string | number)[];
  votingState: VotingState;
  participants: Participant[];
  hostVote: string | number | null;
  hostAlsoVotes: boolean;
  onToggleHostVotes: (enabled: boolean) => void;
  onHostCastVote: (val: string | number) => void;
  onHostClearVote: () => void;
  onChangeDeck: (type: DeckType) => void;
  onRevealCards: () => void;
  onRevote: () => void;
  onNewRound: () => void;
  onOpenShareModal: () => void;
  onAddSimulatedTeammates: () => void;
  t: (key: string, options?: any) => string;
}

export const HostView: React.FC<HostViewProps> = ({
  roomCode,
  roundNumber,
  stats,
  deckType,
  deckCards,
  votingState,
  participants,
  hostVote,
  hostAlsoVotes,
  onToggleHostVotes,
  onHostCastVote,
  onHostClearVote,
  onChangeDeck,
  onRevealCards,
  onRevote,
  onNewRound,
  onOpenShareModal,
  onAddSimulatedTeammates,
  t,
}) => {
  const isRevealed = votingState === 'REVEALED';

  // Voters statistics
  const voters = participants.filter((p) => p.role === 'voter' || p.isHost);
  const votedCount = voters.filter((p) => p.hasVoted && p.vote !== null && p.vote !== undefined).length;
  const allVoted = voters.length > 0 && votedCount === voters.length;

  // Optional countdown timer
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds !== null && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev === null || prev <= 1) {
            setTimerRunning(false);
            soundService.playReveal();
            return 0;
          }
          if (prev <= 5) {
            soundService.playTimerTick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerSeconds]);

  const handleStartTimer = (secs: number) => {
    setTimerSeconds(secs);
    setTimerRunning(true);
  };

  const handleStopTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(null);
  };

  // Trigger celebratory confetti when consensus reached on reveal
  useEffect(() => {
    if (isRevealed && stats?.hasConsensus) {
      soundService.playConsensus();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch { }
    } else if (isRevealed) {
      soundService.playReveal();
    }
  }, [isRevealed, stats?.hasConsensus]);

  const cards = deckCards && deckCards.length > 0 ? deckCards : DECKS[deckType]?.cards || DECKS['modified-fibonacci'].cards;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Top Banner: Round Info & Quick Action Buttons */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 mb-6 shadow-md transition">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
                {t('tools.scrumPoker.currentRound', { defaultValue: 'Current Round' })}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${isRevealed
                  ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-500/30'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 animate-pulse'
                  }`}
              >
                {isRevealed
                  ? t('tools.scrumPoker.status.revealed', { defaultValue: 'Cards Revealed' })
                  : t('tools.scrumPoker.status.votingProgress', {
                    defaultValue: 'Voting in Progress ({{voted}}/{{total}})',
                    voted: votedCount,
                    total: voters.length,
                  })}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
              {t('tools.scrumPoker.roundTitle', { defaultValue: 'Round #{{round}}', round: roundNumber })}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {t('tools.scrumPoker.roundDesc', {
                defaultValue: 'Vote with your team and reveal consensus when everyone is ready.',
              })}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenShareModal}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-cyan-400 hover:bg-indigo-100 text-xs font-bold flex items-center space-x-1.5 transition shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t('tools.scrumPoker.inviteTeamBtn', { defaultValue: 'Invite Team / QR' })}</span>
            </button>

            <button
              type="button"
              onClick={onNewRound}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center space-x-1.5 transition border border-slate-200 dark:border-slate-700"
            >
              <Plus className="w-3.5 h-3.5 text-blue-500" />
              <span>{t('tools.scrumPoker.newRoundBtn', { defaultValue: 'New Round' })}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Moderation controls & Timer */}
      <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-inner">
        {/* Left: Deck & Timer */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Deck selector */}
          <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5">
            <span className="text-[11px] font-semibold text-slate-500">Deck:</span>
            <select
              value={deckType}
              disabled={isRevealed}
              onChange={(e) => onChangeDeck(e.target.value as DeckType)}
              className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              {Object.values(DECKS).map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Countdown timer */}
          <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5">
            <Timer className="w-3.5 h-3.5 text-slate-400" />
            {timerSeconds !== null ? (
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-mono font-bold ${timerSeconds <= 5 ? 'text-rose-500 animate-ping' : 'text-slate-800 dark:text-slate-200'}`}>
                  {timerSeconds}s
                </span>
                <button
                  type="button"
                  onClick={handleStopTimer}
                  className="text-[11px] text-slate-400 hover:text-rose-500 font-bold"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                <button
                  type="button"
                  onClick={() => handleStartTimer(30)}
                  className="hover:text-indigo-600 dark:hover:text-cyan-400 font-semibold"
                >
                  30s
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => handleStartTimer(60)}
                  className="hover:text-indigo-600 dark:hover:text-cyan-400 font-semibold"
                >
                  60s
                </button>
              </div>
            )}
          </div>

          {/* Add simulated teammates for quick test */}
          <button
            type="button"
            onClick={onAddSimulatedTeammates}
            title={t('tools.scrumPoker.simulateTeammatesTip', { defaultValue: 'Add 3 simulated teammates to test votes' })}
            className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1 transition"
          >
            <Bot className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('tools.scrumPoker.simulateBtn', { defaultValue: '+3 Teammates' })}</span>
          </button>
        </div>

        {/* Right: Reveal / Revote / New Round Actions */}
        <div className="flex items-center space-x-2">
          {/* Host Votes Toggle */}
          <button
            type="button"
            onClick={() => onToggleHostVotes(!hostAlsoVotes)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${hostAlsoVotes
              ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-cyan-300 border-indigo-400'
              : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'
              }`}
          >
            {hostAlsoVotes ? '✓ Host Votes' : 'Host Observes'}
          </button>

          {!isRevealed ? (
            <button
              type="button"
              onClick={onRevealCards}
              disabled={voters.length === 0}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center space-x-2 transition shadow-lg ${allVoted
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30 ring-2 ring-emerald-400 animate-bounce'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/25'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Eye className="w-4 h-4" />
              <span>
                {t('tools.scrumPoker.revealCardsBtn', { defaultValue: 'Reveal Cards' })}{' '}
                ({votedCount}/{voters.length})
              </span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onRevote}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center space-x-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('tools.scrumPoker.revoteBtn', { defaultValue: 'Revote' })}</span>
              </button>

              <button
                type="button"
                onClick={onNewRound}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 transition shadow shadow-emerald-600/30"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>
                  {t('tools.scrumPoker.newRoundBtn', {
                    defaultValue: 'New Round',
                  })}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Table: Participants Cards Grid */}
      <div className="w-full sp-poker-table p-6 sm:p-8 mb-6 shadow-xl transition">
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
            <Users className="w-4 h-4 mr-1.5" />
            {t('tools.scrumPoker.tableTitle', { defaultValue: 'Planning Table' })} ({participants.length})
          </h3>

          <span className="text-xs text-slate-400">
            {isRevealed
              ? 'Results revealed'
              : `${votedCount} of ${voters.length} voted`}
          </span>
        </div>

        {participants.length === 0 ? (
          <div className="text-center py-12 text-slate-400 relative z-10">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <h4 className="font-bold text-base text-slate-700 dark:text-slate-300">
              {t('tools.scrumPoker.noParticipantsTitle', { defaultValue: 'Waiting for team members to join...' })}
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto mb-5">
              {t('tools.scrumPoker.noParticipantsDesc', {
                defaultValue:
                  'Share the room code or QR code with your team, or click "+3 Teammates" to test right now.',
              })}
            </p>
            <div className="flex justify-center space-x-3">
              <button
                type="button"
                onClick={onOpenShareModal}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t('tools.scrumPoker.showQrCodeBtn', { defaultValue: 'Show QR Code' })}</span>
              </button>
              <button
                type="button"
                onClick={onAddSimulatedTeammates}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center space-x-1.5 transition"
              >
                <Bot className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('tools.scrumPoker.addSimulatedBtn', { defaultValue: 'Add 3 Simulated Teammates' })}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10 relative z-10 py-2">
            {participants.map((p) => {
              const isCons = stats?.hasConsensus;
              const isHi = stats?.highestVoters?.includes(p.name);
              const isLo = stats?.lowestVoters?.includes(p.name);
              return (
                <TableParticipantCard
                  key={p.id}
                  participant={p}
                  votingState={votingState}
                  isConsensus={isCons}
                  isHighest={isHi}
                  isLowest={isLo}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* If Revealed: Show Full Stats Breakdown */}
      {isRevealed && stats && (
        <div className="w-full mb-6">
          <VotingStatsDisplay
            stats={stats}
            participants={participants}
            t={t}
          />
        </div>
      )}

      {/* Host's Own Voting Deck (if Host Also Votes is enabled and currently VOTING) */}
      {hostAlsoVotes && !isRevealed && (
        <div className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-6 shadow-inner">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('tools.scrumPoker.yourHostVote', { defaultValue: 'Your Vote (Host)' })}
            </span>
            {hostVote !== null && hostVote !== undefined && (
              <button
                type="button"
                onClick={onHostClearVote}
                className="text-xs font-semibold text-rose-500 hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3.5 sm:gap-4 md:gap-5 py-3">
            {cards.map((c) => (
              <DeckCard
                key={String(c)}
                value={c}
                selected={hostVote === c}
                onClick={() => {
                  soundService.playCardSelect();
                  onHostCastVote(c);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
