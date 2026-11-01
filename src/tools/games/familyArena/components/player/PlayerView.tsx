import React, { useState, useEffect, useRef } from 'react';
import { ClientPeer, PeerConnectionStatus } from '../../services/peerService';
import { PlayerJoin } from './PlayerJoin';
import { PlayerLobby } from './PlayerLobby';
import { PlayerAnswering } from './PlayerAnswering';
import { PlayerResult } from './PlayerResult';
import { PlayerGameOver } from './PlayerGameOver';
import { P2PMessage, DisplayToPlayerMessage } from '../../types/protocol';
import { QuestionResult } from '../../types/game';
import { saveQuiz } from '../../services/quizStorage';
import { useTranslation } from '../../i18n/I18nContext';

interface PlayerViewProps {
  initialRoomCode?: string;
  initialHostId?: string;
  onExit: () => void;
}

export const PlayerView: React.FC<PlayerViewProps> = ({
  initialRoomCode = '',
  initialHostId = '',
  onExit,
}) => {
  const { t } = useTranslation();
  const [joined, setJoined] = useState(false);
  const [roomCode, setRoomCode] = useState(initialRoomCode.toUpperCase());
  const [hostId] = useState(initialHostId);
  const [playerName, setPlayerName] = useState('');
  const [playerAvatar, setPlayerAvatar] = useState('🚀');
  const [quizTitle, setQuizTitle] = useState<string | undefined>(undefined);

  const [status, setStatus] = useState<PeerConnectionStatus>({
    connected: false,
    connecting: false,
    error: null,
    peerId: null,
  });

  // Current display phase seen by player
  const [playerPhase, setPlayerPhase] = useState<
    'LOBBY' | 'QUESTION' | 'RESULT' | 'LEADERBOARD' | 'GAME_OVER'
  >('LOBBY');

  // Active question data
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [timeLimit, setTimeLimit] = useState(20);

  // Result data
  const [lastResult, setLastResult] = useState<QuestionResult | null>(null);
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);

  // Game over data
  const [finalScore, setFinalScore] = useState(0);
  const [finalRank, setFinalRank] = useState(1);
  const [totalContestants, setTotalContestants] = useState(1);

  const peerRef = useRef<ClientPeer | null>(null);

  const joinRetryTimerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (joinRetryTimerRef.current) clearInterval(joinRetryTimerRef.current);
      peerRef.current?.destroy();
    };
  }, []);

  const handleJoin = (code: string, name: string, avatar: string) => {
    setRoomCode(code);
    setPlayerName(name);
    setPlayerAvatar(avatar);

    if (joinRetryTimerRef.current) {
      clearInterval(joinRetryTimerRef.current);
      joinRetryTimerRef.current = null;
    }

    if (peerRef.current) {
      peerRef.current.destroy();
    }

    const targetHost = hostId || undefined;
    const peer = new ClientPeer(code, 'player', targetHost);
    peerRef.current = peer;

    const sendJoinMessage = () => {
      peer.send({
        type: 'PLAYER_JOIN',
        name,
        avatar,
      });
    };

    peer.onStatusChange = (newStatus) => {
      setStatus(newStatus);
      if (newStatus.connected) {
        sendJoinMessage();
      }
    };

    // Retry sending PLAYER_JOIN every 1.5s until JOIN_ACCEPTED is received
    joinRetryTimerRef.current = setInterval(() => {
      sendJoinMessage();
    }, 1500);

    peer.onMessage = (msg: P2PMessage) => {
      if (!msg.payload || typeof msg.payload !== 'object') return;
      const payload = msg.payload as DisplayToPlayerMessage;

      switch (payload.type) {
        case 'JOIN_ACCEPTED':
          if (joinRetryTimerRef.current) {
            clearInterval(joinRetryTimerRef.current);
            joinRetryTimerRef.current = null;
          }
          setJoined(true);
          setQuizTitle(payload.quizTitle);
          setPlayerPhase('LOBBY');
          break;

        case 'JOIN_REJECTED':
          setStatus((prev) => ({
            ...prev,
            connected: false,
            error: payload.reason || t('joinRejectedByDisplay'),
          }));
          break;

        case 'QUESTION_START':
          setCurrentQuestionIndex(payload.questionIndex);
          setTotalQuestions(payload.totalQuestions);
          setQuestionText(payload.text);
          setOptions(payload.options);
          setTimeLimit(payload.timeLimit);
          setPlayerPhase('QUESTION');
          break;

        case 'QUESTION_RESULT':
          setCorrectOptionIndex(payload.correctOptionIndex);
          setLastResult(payload.result);
          setPlayerPhase('RESULT');
          break;

        case 'GAME_STATE_UPDATE':
          if (payload.state === 'LOBBY') {
            setPlayerPhase('LOBBY');
          } else if (payload.state === 'LEADERBOARD') {
            setPlayerPhase('LEADERBOARD');
          } else if (payload.state === 'GAME_FINISHED') {
            setPlayerPhase('GAME_OVER');
          }
          break;

        case 'SYNC_QUIZ':
          if (payload.quiz) {
            saveQuiz(payload.quiz);
          }
          break;

        case 'SESSION_CLOSED':
          if (joinRetryTimerRef.current) {
            clearInterval(joinRetryTimerRef.current);
            joinRetryTimerRef.current = null;
          }
          setStatus({
            connected: false,
            connecting: false,
            error: payload.reason || t('sessionClosedByManager'),
            peerId: null,
          });
          setJoined(false);
          break;

        case 'GAME_OVER':
          setFinalScore(payload.finalScore);
          setFinalRank(payload.finalRank);
          setTotalContestants(payload.totalPlayers);
          setPlayerPhase('GAME_OVER');
          break;
      }
    };

    peer.connect();
  };

  const handleSubmitAnswer = (optionIndex: number, qIdx?: number) => {
    const finalQuestionIndex = qIdx !== undefined ? qIdx : currentQuestionIndex;
    peerRef.current?.send({
      type: 'SUBMIT_ANSWER',
      questionIndex: finalQuestionIndex,
      optionIndex,
      timeRemainingSec: 0,
    });
  };

  const handleCancelJoin = () => {
    if (joinRetryTimerRef.current) {
      clearInterval(joinRetryTimerRef.current);
      joinRetryTimerRef.current = null;
    }
    peerRef.current?.destroy();
    peerRef.current = null;
    setStatus({
      connected: false,
      connecting: false,
      error: null,
      peerId: null,
    });
  };

  if (!joined) {
    return (
      <PlayerJoin
        initialRoomCode={roomCode}
        onJoin={handleJoin}
        isConnecting={status.connecting}
        error={status.error}
        onCancel={handleCancelJoin}
      />
    );
  }

  if (playerPhase === 'LOBBY') {
    return (
      <PlayerLobby
        playerName={playerName}
        playerAvatar={playerAvatar}
        roomCode={roomCode}
        quizTitle={quizTitle}
      />
    );
  }

  if (playerPhase === 'QUESTION') {
    return (
      <PlayerAnswering
        questionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        questionText={questionText}
        options={options}
        timeLimit={timeLimit}
        onSubmitAnswer={handleSubmitAnswer}
      />
    );
  }

  if (playerPhase === 'RESULT' && lastResult) {
    return (
      <PlayerResult
        result={lastResult}
        correctOptionIndex={correctOptionIndex}
      />
    );
  }

  if (playerPhase === 'LEADERBOARD') {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-8 flex flex-col justify-center min-h-[75vh] text-center">
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur transition-colors">
          <div className="text-4xl mb-3">📊</div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            {t('leaderboardHeading')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            {t('lookAtBigScreen')}
          </p>
          <div className="inline-flex items-center space-x-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>{t('readyToPlay')}</span>
          </div>
        </div>
      </div>
    );
  }

  if (playerPhase === 'GAME_OVER') {
    return (
      <PlayerGameOver
        finalScore={finalScore}
        finalRank={finalRank}
        totalPlayers={totalContestants}
        playerName={playerName}
        playerAvatar={playerAvatar}
        onLeave={onExit}
      />
    );
  }

  return null;
};

