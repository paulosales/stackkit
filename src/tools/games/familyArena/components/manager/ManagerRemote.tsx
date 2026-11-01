import React from 'react';
import { Play, FastForward, CheckCircle2, Trophy, RotateCcw, Users, StopCircle } from 'lucide-react';
import { Quiz, Player } from '../../types/game';
import { useTranslation } from '../../i18n/I18nContext';
import { QuestionMarkdown } from '../common/QuestionMarkdown';

interface ManagerRemoteProps {
  quiz: Quiz | null;
  displayState: string;
  questionIndex: number;
  totalQuestions: number;
  connectedPlayersCount: number;
  answersReceivedCount: number;
  players: Player[];
  activeSessionCode?: string | null;
  onStartGame: () => void;
  onNextQuestion: () => void;
  onRevealAnswer: () => void;
  onShowLeaderboard: () => void;
  onRestartGame: () => void;
  onEndSession?: () => void;
}

export const ManagerRemote: React.FC<ManagerRemoteProps> = ({
  quiz,
  displayState,
  questionIndex,
  totalQuestions,
  connectedPlayersCount,
  answersReceivedCount,
  activeSessionCode,
  onStartGame,
  onNextQuestion,
  onRevealAnswer,
  onShowLeaderboard,
  onRestartGame,
  onEndSession,
}) => {
  const { t } = useTranslation();
  const currentQuestion = quiz?.questions[questionIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Remote Status Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl mb-6 transition-colors">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              {t('displayPhase')}
            </div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{displayState.replace(/_/g, ' ')}</span>
            </div>
            {activeSessionCode && (
              <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">
                {t('room')}: {activeSessionCode}
              </div>
            )}
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500 dark:text-slate-400">{t('contestantsLabel')}</div>
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-end space-x-1">
              <Users className="w-4 h-4" />
              <span>{connectedPlayersCount}</span>
            </div>
          </div>
        </div>

        {/* Live telemetry row */}
        {displayState === 'QUESTION_ACTIVE' && (
          <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 mb-4 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('playerAnswersLabel')}</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {answersReceivedCount} / {connectedPlayersCount} {t('answeredProgress', { answered: answersReceivedCount, total: connectedPlayersCount })}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${
                    connectedPlayersCount > 0
                      ? Math.min(100, (answersReceivedCount / connectedPlayersCount) * 100)
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Question Preview for Manager */}
        {currentQuestion && displayState !== 'LOBBY' && displayState !== 'GAME_FINISHED' && (
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50 mb-6">
            <div className="flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-1">
              <span>{t('question')} {questionIndex + 1} {t('of')} {totalQuestions}</span>
              <span>{currentQuestion.timeLimit}s</span>
            </div>
            <div className="mb-3">
              <QuestionMarkdown content={currentQuestion.text} size="compact" align="left" />
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{t('correctAnswerLabel')}: </span>
              <span>{currentQuestion.options[currentQuestion.correctAnswerIndex]}</span>
            </div>
          </div>
        )}

        {/* Primary Remote Action Buttons depending on Game State */}
        <div className="space-y-3">
          {displayState === 'WAITING_FOR_QUIZ' || displayState === 'LOBBY' ? (
            <button
              onClick={onStartGame}
              disabled={!quiz || connectedPlayersCount === 0}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-base shadow-xl flex items-center justify-center space-x-2 transition active:scale-95 text-white ${
                quiz && connectedPlayersCount > 0
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20'
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{t('startGameBtn')}</span>
            </button>
          ) : null}

          {displayState === 'QUESTION_ACTIVE' ? (
            <button
              onClick={onRevealAnswer}
              className="w-full py-4 px-6 rounded-2xl font-bold text-base bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 transition active:scale-95"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{t('revealAnswerBtn')}</span>
            </button>
          ) : null}

          {displayState === 'QUESTION_REVEAL' ? (
            <button
              onClick={onShowLeaderboard}
              className="w-full py-4 px-6 rounded-2xl font-bold text-base bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 flex items-center justify-center space-x-2 transition active:scale-95"
            >
              <Trophy className="w-5 h-5" />
              <span>{t('showLeaderboardBtn')}</span>
            </button>
          ) : null}

          {displayState === 'LEADERBOARD' ? (
            <button
              onClick={onNextQuestion}
              className="w-full py-4 px-6 rounded-2xl font-bold text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-600/20 flex items-center justify-center space-x-2 transition active:scale-95"
            >
              <FastForward className="w-5 h-5" />
              <span>{t('nextQuestionBtn')}</span>
            </button>
          ) : null}

          {displayState === 'GAME_FINISHED' ? (
            <button
              onClick={onRestartGame}
              className="w-full py-4 px-6 rounded-2xl font-bold text-base bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/20 flex items-center justify-center space-x-2 transition active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{t('rematchBtn')}</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* End Session Button with Confirmation */}
      {onEndSession && (
        <div className="w-full text-center">
          <button
            onClick={onEndSession}
            className="w-full py-3 px-4 rounded-2xl border border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 font-bold text-xs flex items-center justify-center space-x-2 transition active:scale-95 shadow-sm"
          >
            <StopCircle className="w-4 h-4" />
            <span>{t('endSessionBtn')}</span>
          </button>
        </div>
      )}
    </div>
  );
};
