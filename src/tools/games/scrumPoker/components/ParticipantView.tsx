import React from 'react';
import { Check, Clock } from 'lucide-react';
import { Participant, VotingState, DeckType, DECKS, VotingStats } from '../types';
import { DeckCard, TableParticipantCard } from './PokerCard';
import { VotingStatsDisplay } from './VotingStats';
import { soundService } from '../services/soundService';

interface ParticipantViewProps {
  myParticipantId: string;
  roomCode: string;
  roundNumber: number;
  stats: VotingStats | null;
  deckType: DeckType;
  deckCards: (string | number)[];
  votingState: VotingState;
  participants: Participant[];
  onCastVote: (val: string | number) => void;
  onClearVote: () => void;
  t: (key: string, options?: any) => string;
}

export const ParticipantView: React.FC<ParticipantViewProps> = ({
  myParticipantId,
  roomCode,
  roundNumber,
  stats,
  deckType,
  deckCards,
  votingState,
  participants,
  onCastVote,
  onClearVote,
  t,
}) => {
  const me = participants.find((p) => p.id === myParticipantId);
  const myVote = me?.vote;
  const hasVoted = me?.hasVoted && myVote !== null && myVote !== undefined;
  const isSpectator = me?.role === 'spectator';
  const isRevealed = votingState === 'REVEALED';

  const handleSelectCard = (val: string | number) => {
    if (isSpectator || isRevealed) return;
    soundService.playCardSelect();
    onCastVote(val);
  };

  const handleClear = () => {
    if (isSpectator || isRevealed) return;
    onClearVote();
  };

  const cards = deckCards && deckCards.length > 0 ? deckCards : DECKS[deckType]?.cards || DECKS['modified-fibonacci'].cards;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Active Round Card */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 mb-6 shadow-md transition">
        <div className="flex items-center justify-between mb-2">
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
              : t('tools.scrumPoker.status.voting', { defaultValue: 'Voting in Progress' })}
          </span>
        </div>

        <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
          {t('tools.scrumPoker.roundTitle', { defaultValue: 'Round #{{round}}', round: roundNumber })}
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          {t('tools.scrumPoker.roundDescParticipant', {
            defaultValue: 'Select a card representing your estimate for this round.',
          })}
        </p>
      </div>

      {/* Participant Voting Status Banner */}
      {!isSpectator && !isRevealed && (
        <div className="w-full mb-6">
          {hasVoted ? (
            <div className="w-full p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 block">
                    {t('tools.scrumPoker.votedBanner', { defaultValue: 'Your card is placed!' })}
                  </span>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">
                    {t('tools.scrumPoker.votedSub', { defaultValue: 'Selected: {{val}} • Tap any card to change', val: myVote })}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-semibold text-slate-500 hover:text-rose-500 underline"
              >
                {t('tools.scrumPoker.clearVote', { defaultValue: 'Clear' })}
              </button>
            </div>
          ) : (
            <div className="w-full p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium text-center shadow-sm">
              {t('tools.scrumPoker.chooseCardPrompt', { defaultValue: '👇 Pick a card below representing your estimate' })}
            </div>
          )}
        </div>
      )}

      {isSpectator && (
        <div className="w-full mb-6 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 text-center">
          🍿 {t('tools.scrumPoker.spectatorBanner', { defaultValue: 'You joined as an Observer. You can watch the votes in real time!' })}
        </div>
      )}

      {/* Card Deck Picker (Active during VOTING) */}
      {!isRevealed && !isSpectator && (
        <div className="w-full mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('tools.scrumPoker.cardDeckTitle', { defaultValue: 'Your Deck' })}
            </span>
            <span className="text-xs text-slate-400">
              {cards.length} cards
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-3.5 sm:gap-4 md:gap-5 py-3">
            {cards.map((c) => (
              <DeckCard
                key={String(c)}
                value={c}
                selected={myVote === c}
                onClick={() => handleSelectCard(c)}
              />
            ))}
          </div>
        </div>
      )}

      {/* When Revealed: Show Team Results & Stats */}
      {isRevealed && (
        <div className="w-full space-y-6">
          {/* Revealed Cards Grid */}
          <div className="sp-poker-table p-6 shadow-inner">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center mb-6 relative z-10">
              {t('tools.scrumPoker.teamVotesTitle', { defaultValue: 'Team Estimates' })}
            </h3>
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10 relative z-10 py-2">
              {participants.map((p) => {
                const isCons = stats?.hasConsensus;
                const isHi = stats?.highestVoters?.includes(p.name);
                const isLo = stats?.lowestVoters?.includes(p.name);
                return (
                  <TableParticipantCard
                    key={p.id}
                    participant={p}
                    votingState="REVEALED"
                    isConsensus={isCons}
                    isHighest={isHi}
                    isLowest={isLo}
                  />
                );
              })}
            </div>
          </div>

          {/* Stats Component */}
          {stats && (
            <VotingStatsDisplay
              stats={stats}
              participants={participants}
              t={t}
            />
          )}

          <div className="text-center py-4 text-xs text-slate-500">
            ⏳ {t('tools.scrumPoker.waitingForHost', { defaultValue: 'Waiting for host to start next round...' })}
          </div>
        </div>
      )}

      {/* Participants who are currently in the room */}
      {!isRevealed && (
        <div className="w-full mt-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 text-center">
            {t('tools.scrumPoker.roomParticipants', { defaultValue: 'In the Room' })} ({participants.length})
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {participants.map((p) => (
              <div
                key={p.id}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${p.hasVoted
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
              >
                <span>{p.avatar}</span>
                <span>{p.name}</span>
                {p.hasVoted ? (
                  <Check className="w-3 h-3 text-emerald-500 stroke-[3]" />
                ) : (
                  <Clock className="w-3 h-3 text-amber-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
