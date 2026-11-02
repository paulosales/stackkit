import React, { useState } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { sounds } from '../../services/soundService';
import { useTranslation } from '../../i18n/I18nContext';
import { QuestionMarkdown } from '../common/QuestionMarkdown';

interface PlayerAnsweringProps {
  questionIndex: number;
  totalQuestions: number;
  questionText: string;
  options: string[];
  timeLimit: number;
  onSubmitAnswer: (optionIndex: number, questionIndex?: number) => void;
}

const BUTTON_THEMES = [
  {
    bg: 'bg-red-600 active:bg-red-700',
    border: 'border-red-500',
    symbol: '▲',
    label: 'A',
  },
  {
    bg: 'bg-blue-600 active:bg-blue-700',
    border: 'border-blue-500',
    symbol: '◆',
    label: 'B',
  },
  {
    bg: 'bg-amber-500 active:bg-amber-600',
    border: 'border-amber-400',
    symbol: '●',
    label: 'C',
  },
  {
    bg: 'bg-emerald-600 active:bg-emerald-700',
    border: 'border-emerald-500',
    symbol: '■',
    label: 'D',
  },
];

export const PlayerAnswering: React.FC<PlayerAnsweringProps> = ({
  questionIndex,
  totalQuestions,
  questionText,
  options,
  timeLimit,
  onSubmitAnswer,
}) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return; // Answer already locked in!
    setSelectedOption(idx);
    sounds.playTick();

    // Haptic feedback for mobile devices
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(40);
    }

    onSubmitAnswer(idx, questionIndex);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-4 flex flex-col justify-between min-h-[85vh]">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 mb-4 shadow-sm transition-colors">
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
          {t('question')} {questionIndex + 1} / {totalQuestions}
        </span>
        <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
          {timeLimit <= 0 ? (
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{t('noTimeLimit')}</span>
          ) : (
            <>
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLimit}{t('seconds')}</span>
            </>
          )}
        </div>
      </div>

      {/* Question prompt card */}
      <div className="w-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 mb-4 shadow-md text-center transition-colors">
        <QuestionMarkdown content={questionText} size="player" align="center" />
      </div>

      {/* Answering State Banner */}
      {selectedOption !== null ? (
        <div className="w-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/40 rounded-2xl p-4 mb-4 text-center animate-fadeIn shadow-sm">
          <div className="flex items-center justify-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-1">
            <CheckCircle2 className="w-5 h-5" />
            <span>{t('yourAnswerLockedIn')}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {t('lookAtBigScreen')}
          </p>
        </div>
      ) : null}

      {/* 4 Large Tactile Mobile Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-1">
        {options.map((optText, idx) => {
          const theme = BUTTON_THEMES[idx % BUTTON_THEMES.length];
          const isSelected = selectedOption === idx;
          const isLocked = selectedOption !== null;

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isLocked}
              className={`w-full min-h-[115px] sm:min-h-[140px] rounded-3xl p-4 sm:p-5 text-white font-bold transition-all flex flex-col justify-between shadow-xl select-none ${
                theme.bg
              } ${
                isSelected
                  ? 'ring-4 ring-white scale-[1.02] shadow-2xl'
                  : isLocked
                  ? 'opacity-40 grayscale-[40%]'
                  : 'hover:scale-[1.01] active:scale-95'
              }`}
            >
              {/* Top row with Symbol & Letter label */}
              <div className="flex items-center justify-between w-full text-white/90">
                <span className="text-xl sm:text-2xl drop-shadow font-black">{theme.symbol}</span>
                <span className="text-xs sm:text-sm font-black uppercase px-2.5 py-0.5 rounded-full bg-black/25 font-mono shadow-inner">
                  {theme.label}
                </span>
              </div>

              {/* Centered Option Text */}
              <div className="flex-1 flex items-center justify-center text-center px-2 py-1 my-auto">
                <span className="text-lg sm:text-2xl font-black leading-snug break-words drop-shadow">
                  {optText}
                </span>
              </div>

              {/* Invisible bottom spacer matching top row so text is perfectly centered */}
              <div className="h-5 sm:h-6 invisible select-none pointer-events-none" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
