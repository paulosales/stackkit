import React from 'react';
import { Check, Clock, Coffee, HelpCircle, Sparkles, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import { Participant, VotingState } from '../types';

interface TableParticipantCardProps {
  participant: Participant;
  votingState: VotingState;
  isLowest?: boolean;
  isHighest?: boolean;
  isConsensus?: boolean;
}

function getCardSuit(val: string | number): { symbol: string; colorClass: string } {
  if (val === '?' || val === '☕') {
    return { symbol: '★', colorClass: 'text-amber-500' };
  }
  const s = String(val);
  if (['0', '1', 'XS', '34', '55'].includes(s)) {
    return { symbol: '♠', colorClass: 'text-slate-800 dark:text-slate-200' };
  }
  if (['2', '0.5', 'S', '40', '89'].includes(s)) {
    return { symbol: '♦', colorClass: 'text-rose-500' };
  }
  if (['3', '5', 'M', '100'].includes(s)) {
    return { symbol: '♣', colorClass: 'text-slate-800 dark:text-slate-200' };
  }
  return { symbol: '♥', colorClass: 'text-rose-500' };
}

function getNumberFontSize(val: string | number, isTableCard: boolean): string {
  const s = String(val);
  if (s.length >= 3) {
    // 3 digits (e.g. "100", "0.5", "XXL")
    return isTableCard ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl';
  }
  if (s.length === 2) {
    // 2 digits (e.g. "13", "20", "21", "34", "40", "55", "89", "XS", "XL")
    return isTableCard ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl';
  }
  // 1 digit (e.g. "0", "1", "2", "3", "5", "8", "S", "M", "L")
  return isTableCard ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl';
}

export const TableParticipantCard: React.FC<TableParticipantCardProps> = ({
  participant,
  votingState,
  isLowest,
  isHighest,
  isConsensus,
}) => {
  const isRevealed = votingState === 'REVEALED';
  const hasVoted = participant.hasVoted && participant.vote !== null && participant.vote !== undefined;
  const suit = participant.vote !== null && participant.vote !== undefined ? getCardSuit(participant.vote) : { symbol: '♠', colorClass: '' };
  const centerFontSize = participant.vote !== null && participant.vote !== undefined ? getNumberFontSize(participant.vote, true) : 'text-4xl';
  const cornerFontSize = participant.vote !== null && String(participant.vote).length >= 3 ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:text-xs';

  // Spectator Card
  if (participant.role === 'spectator') {
    return (
      <div className="flex flex-col items-center">
        <div className="sp-card-scene mb-2">
          <div className="w-full h-full rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-md flex flex-col items-center justify-center p-3 text-center">
            <span className="text-3xl mb-1.5 filter drop-shadow-sm">{participant.avatar}</span>
            <span className="font-bold text-xs truncate max-w-[100px] text-slate-800 dark:text-slate-200">
              {participant.name}
            </span>
            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 mt-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 flex items-center space-x-1">
              <Eye className="w-2.5 h-2.5" />
              <span>Spectator</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="sp-card-scene mb-2">
        <div className={`sp-card-3d ${isRevealed && hasVoted ? 'flipped' : ''}`}>
          {/* Card Back / Unrevealed State */}
          <div className="sp-card-face sp-card-back">
            {hasVoted ? (
              // Voted State: Authentic Luxury Playing Card Back
              <div className="w-full h-full rounded-xl sp-card-back-frame p-1 flex flex-col items-center justify-between relative overflow-hidden">
                <div className="w-full h-full rounded-lg sp-card-pattern p-2 flex flex-col items-center justify-between relative shadow-inner">
                  {/* Top Suits */}
                  <div className="w-full flex justify-between text-[11px] font-mono font-bold text-indigo-300/80 dark:text-cyan-300/80 select-none">
                    <span>♠</span>
                    <span>♦</span>
                  </div>

                  {/* Center Casino Chip / Token Medallion */}
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full sp-card-chip flex items-center justify-center shadow-lg relative my-auto">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-inner">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3] animate-bounce" />
                    </div>
                  </div>

                  {/* Bottom Suits */}
                  <div className="w-full flex justify-between text-[11px] font-mono font-bold text-indigo-300/80 dark:text-cyan-300/80 select-none">
                    <span>♣</span>
                    <span>♥</span>
                  </div>
                </div>
              </div>
            ) : (
              // Thinking State: Frosted glass card with animated pulse
              <div className="w-full h-full rounded-xl border-2 border-dashed border-amber-400/50 dark:border-amber-500/40 bg-gradient-to-b from-amber-500/5 to-amber-500/10 dark:from-amber-500/10 dark:to-amber-500/20 flex flex-col items-center justify-center p-3 text-center sp-pulse-thinking relative overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-2 shadow-sm">
                  <Clock className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <span className="text-xs font-bold text-amber-800 dark:text-amber-200">
                  Thinking...
                </span>
                <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 font-mono mt-0.5">
                  deciding card
                </span>
              </div>
            )}
          </div>

          {/* Card Front / Revealed State */}
          <div
            className={`sp-card-face sp-card-front relative overflow-hidden ${isConsensus
              ? 'sp-card-consensus border-emerald-500 ring-2 ring-emerald-400/60'
              : isHighest && !isLowest
                ? 'sp-card-highest border-purple-500 ring-1 ring-purple-400/50'
                : isLowest && !isHighest
                  ? 'sp-card-lowest border-cyan-500 ring-1 ring-cyan-400/50'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
          >
            {/* Fine Inner Border Line */}
            <div className="absolute inset-1.5 sm:inset-2 rounded-[10px] border border-slate-200/80 dark:border-slate-800/80 pointer-events-none" />

            {/* Dead-Center Big Value & Art (Exactly centered horizontally and vertically) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-10 select-none pointer-events-none w-full px-2 text-center">
              {participant.vote === '☕' ? (
                <div className="flex flex-col items-center justify-center">
                  <Coffee className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 filter drop-shadow" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-orange-500 mt-1">Coffee</span>
                </div>
              ) : participant.vote === '?' ? (
                <div className="flex flex-col items-center justify-center">
                  <HelpCircle className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500 filter drop-shadow" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500 mt-1">Unsure</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span
                    className={`font-black ${centerFontSize} tracking-tight leading-none filter drop-shadow-sm text-center inline-block ${isConsensus
                      ? 'text-emerald-500'
                      : isHighest && !isLowest
                        ? 'text-purple-600 dark:text-purple-400'
                        : isLowest && !isHighest
                          ? 'text-cyan-600 dark:text-cyan-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                  >
                    {participant.vote}
                  </span>
                  <span className={`text-xs sm:text-sm font-semibold ${suit.colorClass} mt-1.5 opacity-80 text-center`}>
                    {suit.symbol}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Participant Info Banner */}
      <div className="flex items-center space-x-1.5 max-w-[130px] select-none">
        <span className="text-base filter drop-shadow-sm">{participant.avatar}</span>
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
          {participant.name}
          {participant.isHost && ' 👑'}
        </span>
      </div>

      {/* Badges on reveal */}
      {isRevealed && hasVoted && (
        <div className="mt-1 flex items-center space-x-1">
          {isConsensus ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 flex items-center shadow-sm">
              <Sparkles className="w-2.5 h-2.5 mr-1 text-emerald-500 animate-spin" />
              Consensus
            </span>
          ) : isHighest && !isLowest ? (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 flex items-center border border-purple-500/30">
              <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> High
            </span>
          ) : isLowest && !isHighest ? (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 flex items-center border border-cyan-500/30">
              <TrendingDown className="w-2.5 h-2.5 mr-0.5" /> Low
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
};

interface DeckCardProps {
  value: string | number;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export const DeckCard: React.FC<DeckCardProps> = ({
  value,
  selected,
  disabled = false,
  onClick,
}) => {
  const suit = getCardSuit(value);
  const centerFontSize = getNumberFontSize(value, false);
  const cornerFontSize = String(value).length >= 3 ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:text-xs';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`sp-deck-card relative overflow-hidden ${selected ? 'selected' : ''}`}
    >
      {/* Decorative fine inner border line */}
      <div className="absolute inset-1 sm:inset-1.5 rounded-[9px] border border-slate-200/70 dark:border-slate-800/80 pointer-events-none" />

      {/* Dead-Center value & symbol (mathematically centered with absolute translation) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-10 select-none pointer-events-none w-full px-2 text-center">
        {value === '☕' ? (
          <Coffee className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 filter drop-shadow-sm" />
        ) : value === '?' ? (
          <HelpCircle className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500 filter drop-shadow-sm" />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <span
              className={`font-black ${centerFontSize} tracking-tight leading-none filter drop-shadow-sm text-center inline-block ${selected
                ? 'text-indigo-600 dark:text-cyan-400'
                : 'text-slate-900 dark:text-white'
                }`}
            >
              {value}
            </span>
            <span className={`text-[10px] sm:text-xs font-semibold ${suit.colorClass} mt-1 opacity-80 text-center`}>
              {suit.symbol}
            </span>
          </div>
        )}
      </div>

      {/* Floating selected checkmark badge */}
      {selected && (
        <div className="sp-deck-card-check">
          <Check className="w-3.5 h-3.5 stroke-[3] text-white" />
        </div>
      )}
    </button>
  );
};
