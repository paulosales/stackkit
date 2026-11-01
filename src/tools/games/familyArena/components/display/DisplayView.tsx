import React, { useState, useEffect, useRef } from 'react';
import { Quiz, Player, AnswerSubmission, DisplayGameState, QuestionResult } from '../../types/game';
import { HostPeer, generateRoomCode, PeerConnectionStatus } from '../../services/peerService';
import { DisplayLobby } from './DisplayLobby';
import { DisplayQuestion } from './DisplayQuestion';
import { DisplayReveal } from './DisplayReveal';
import { DisplayLeaderboard } from './DisplayLeaderboard';
import { DisplayPodium } from './DisplayPodium';
import { P2PMessage, ManagerToDisplayMessage, PlayerToDisplayMessage } from '../../types/protocol';
import { sounds } from '../../services/soundService';
import { useTranslation } from '../../i18n/I18nContext';

interface DisplayViewProps {
  initialRoomCode?: string;
}

function loadInitialSessionQuiz(code: string): Quiz | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`fa_session_${code}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to parse session quiz from localStorage', e);
  }
  return null;
}

export const DisplayView: React.FC<DisplayViewProps> = ({ initialRoomCode }) => {
  const { t } = useTranslation();
  const [roomCode, setRoomCode] = useState(() => initialRoomCode || generateRoomCode());
  const initialSessionQuiz = loadInitialSessionQuiz(initialRoomCode || roomCode);

  const [status, setStatus] = useState<PeerConnectionStatus>({
    connected: false,
    connecting: true,
    error: null,
    peerId: null,
  });

  const [gameState, setGameState] = useState<DisplayGameState>(initialSessionQuiz ? 'LOBBY' : 'WAITING_FOR_QUIZ');
  const [quiz, setQuiz] = useState<Quiz | null>(initialSessionQuiz);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [isManagerConnected, setIsManagerConnected] = useState(false);

  const [players, setPlayers] = useState<Player[]>([]);
  const [currentAnswers, setCurrentAnswers] = useState<AnswerSubmission[]>([]);
  const [answeredPlayerIds, setAnsweredPlayerIds] = useState<Set<string>>(new Set());

  const hostPeerRef = useRef<HostPeer | null>(null);
  const timerRef = useRef<number | null>(null);
  const questionStartTimeRef = useRef<number>(0);

  // Synchronous refs to prevent any stale closures or race conditions during rapid answer submissions
  const currentAnswersRef = useRef<AnswerSubmission[]>([]);
  const answeredPlayerIdsRef = useRef<Set<string>>(new Set());

  // Continuously updated ref with latest component state
  const latestRef = useRef({
    gameState,
    quiz,
    currentQuestionIndex,
    timeRemaining,
    players,
  });

  latestRef.current = {
    gameState,
    quiz,
    currentQuestionIndex,
    timeRemaining,
    players,
  };

  // Sync state back to manager whenever key variables change
  const syncWithManager = (
    stateOverride?: string,
    extraAnswersCount?: number,
    playersOverride?: Player[]
  ) => {
    const { gameState: currState, quiz: currQuiz, currentQuestionIndex: currQIndex, players: currPlayers } = latestRef.current;
    const activePlayers = playersOverride || currPlayers;
    const answersCount = extraAnswersCount !== undefined ? extraAnswersCount : answeredPlayerIdsRef.current.size;

    hostPeerRef.current?.sendToManager({
      type: 'MANAGER_SYNC',
      state: stateOverride || currState,
      quizTitle: currQuiz?.title,
      questionIndex: currQIndex,
      totalQuestions: currQuiz ? currQuiz.questions.length : 0,
      connectedPlayersCount: activePlayers.length,
      answersReceivedCount: answersCount,
      players: activePlayers,
    });
  };

  // Handle messages from the Manager
  const handleManagerMessage = (payload: ManagerToDisplayMessage) => {
    switch (payload.type) {
      case 'MANAGER_HELLO':
        setIsManagerConnected(true);
        syncWithManager();
        break;

      case 'LOAD_QUIZ':
        if (payload.quiz) {
          setQuiz(payload.quiz);
          latestRef.current.quiz = payload.quiz;
          setGameState('LOBBY');
          latestRef.current.gameState = 'LOBBY';
          try {
            localStorage.setItem(`fa_session_${roomCode}`, JSON.stringify(payload.quiz));
          } catch {}
          sounds.playJoin();
          syncWithManager('LOBBY');
          // Notify players in lobby of loaded quiz
          hostPeerRef.current?.broadcastToPlayers({
            type: 'GAME_STATE_UPDATE',
            state: 'LOBBY',
            quizTitle: payload.quiz.title,
          });
          // Synchronize the quiz questions with connected players' local storage
          hostPeerRef.current?.broadcastToPlayers({
            type: 'SYNC_QUIZ',
            quiz: payload.quiz,
          });
        }
        break;

      case 'CLOSE_SESSION':
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setGameState('SESSION_CLOSED');
        latestRef.current.gameState = 'SESSION_CLOSED';
        hostPeerRef.current?.broadcastToPlayers({
          type: 'SESSION_CLOSED',
        });
        try {
          localStorage.removeItem(`fa_session_${roomCode}`);
        } catch {}
        break;

      case 'START_GAME':
        startQuizGame();
        break;

      case 'NEXT_QUESTION':
        advanceToNextQuestion();
        break;

      case 'REVEAL_ANSWER':
        revealCurrentAnswer();
        break;

      case 'SHOW_LEADERBOARD':
        showLeaderboard();
        break;

      case 'RESTART_GAME':
        resetGameToLobby();
        break;
    }
  };

  // Handle messages from Players
  const handlePlayerMessage = (payload: PlayerToDisplayMessage, peerId: string) => {
    switch (payload.type) {
      case 'PLAYER_JOIN': {
        const safeName = (payload.name || 'Contestant').trim().slice(0, 24);
        const safeAvatar = payload.avatar || '🎮';

        const newPlayer: Player = {
          id: peerId,
          name: safeName,
          avatar: safeAvatar,
          score: 0,
          streak: 0,
          connected: true,
        };

        setPlayers((prev) => {
          const filtered = prev.filter((p) => p.id !== peerId);
          const updated = [...filtered, newPlayer];
          latestRef.current.players = updated;
          syncWithManager(undefined, undefined, updated);
          return updated;
        });

        // Acknowledge to player
        hostPeerRef.current?.sendToPlayer(peerId, {
          type: 'JOIN_ACCEPTED',
          playerId: peerId,
          playerName: safeName,
          playerAvatar: safeAvatar,
          quizTitle: latestRef.current.quiz?.title,
        });

        // Synchronize quiz questions with player's local storage
        if (latestRef.current.quiz) {
          hostPeerRef.current?.sendToPlayer(peerId, {
            type: 'SYNC_QUIZ',
            quiz: latestRef.current.quiz,
          });
        }

        sounds.playJoin();
        break;
      }

      case 'SUBMIT_ANSWER': {
        const { gameState: currState, quiz: currQuiz, currentQuestionIndex: currQIndex, players: currPlayers } = latestRef.current;

        if (currState !== 'QUESTION_ACTIVE' || !currQuiz) {
          console.warn('SUBMIT_ANSWER received but question is not currently active. Phase:', currState);
          return;
        }

        if (answeredPlayerIdsRef.current.has(peerId)) {
          // Already recorded
          return;
        }

        const currentQ = currQuiz.questions[currQIndex];
        if (!currentQ) return;

        const timeTakenMs = Math.max(100, Date.now() - questionStartTimeRef.current);
        const timeRemainingSec = Math.max(0, currentQ.timeLimit - timeTakenMs / 1000);

        const submission: AnswerSubmission = {
          playerId: peerId,
          questionIndex: payload.questionIndex !== undefined ? payload.questionIndex : currQIndex,
          optionIndex: payload.optionIndex,
          timeRemainingSec,
          timeTakenMs,
        };

        // Synchronously record in refs
        currentAnswersRef.current = [
          ...currentAnswersRef.current.filter((a) => a.playerId !== peerId),
          submission,
        ];
        answeredPlayerIdsRef.current.add(peerId);

        // Update React state
        setCurrentAnswers([...currentAnswersRef.current]);
        setAnsweredPlayerIds(new Set(answeredPlayerIdsRef.current));

        // Display audio feedback
        sounds.playTick();

        const answersCount = answeredPlayerIdsRef.current.size;
        const totalP = currPlayers.length;

        // Sync with manager
        hostPeerRef.current?.sendToManager({
          type: 'ANSWER_RECEIVED',
          answersCount,
          totalPlayers: totalP,
        });

        // If all active players have answered, reveal answer automatically
        if (answersCount >= totalP && totalP > 0) {
          setTimeout(() => {
            revealCurrentAnswer();
          }, 600);
        }
        break;
      }
    }
  };

  // Handlers ref to break closure staleness inside the long-lived WebRTC useEffect
  const handlersRef = useRef({
    handleManagerMessage,
    handlePlayerMessage,
    syncWithManager,
  });

  handlersRef.current = {
    handleManagerMessage,
    handlePlayerMessage,
    syncWithManager,
  };

  useEffect(() => {
    const hostPeer = new HostPeer(roomCode);
    hostPeerRef.current = hostPeer;

    hostPeer.onStatusChange = (newStatus) => {
      setStatus(newStatus);
    };

    hostPeer.onManagerConnected = () => {
      setIsManagerConnected(true);
      sounds.playJoin();
      handlersRef.current.syncWithManager();
    };

    hostPeer.onManagerDisconnected = () => {
      setIsManagerConnected(false);
    };

    hostPeer.onPlayerDisconnected = (connId) => {
      setPlayers((prev) => {
        const updated = prev.filter((p) => p.id !== connId);
        latestRef.current.players = updated;
        handlersRef.current.syncWithManager(undefined, undefined, updated);
        return updated;
      });
      answeredPlayerIdsRef.current.delete(connId);
      setAnsweredPlayerIds(new Set(answeredPlayerIdsRef.current));
    };

    hostPeer.onMessage = (msg: P2PMessage, senderPeerId: string) => {
      if (!msg.payload || typeof msg.payload !== 'object') return;

      if (msg.senderRole === 'manager') {
        handlersRef.current.handleManagerMessage(msg.payload as ManagerToDisplayMessage);
      } else if (msg.senderRole === 'player') {
        handlersRef.current.handlePlayerMessage(msg.payload as PlayerToDisplayMessage, senderPeerId);
      }
    };

    hostPeer.init();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      hostPeer.destroy();
    };
  }, [roomCode]);

  // Game progression functions
  const startQuizGame = () => {
    const currQuiz = latestRef.current.quiz;
    if (!currQuiz || currQuiz.questions.length === 0) return;
    setCurrentQuestionIndex(0);
    latestRef.current.currentQuestionIndex = 0;
    loadQuestion(0);
  };

  const loadQuestion = (index: number) => {
    const currQuiz = latestRef.current.quiz;
    if (!currQuiz) return;
    const q = currQuiz.questions[index];
    if (!q) return;

    if (timerRef.current) clearInterval(timerRef.current);

    currentAnswersRef.current = [];
    answeredPlayerIdsRef.current = new Set();
    setCurrentAnswers([]);
    setAnsweredPlayerIds(new Set());
    setTimeRemaining(q.timeLimit);
    setGameState('QUESTION_ACTIVE');
    latestRef.current.gameState = 'QUESTION_ACTIVE';
    latestRef.current.currentQuestionIndex = index;
    latestRef.current.timeRemaining = q.timeLimit;
    questionStartTimeRef.current = Date.now();

    // Broadcast question to players (WITHOUT revealing the correct answer!)
    hostPeerRef.current?.broadcastToPlayers({
      type: 'QUESTION_START',
      questionIndex: index,
      totalQuestions: currQuiz.questions.length,
      text: q.text,
      options: q.options,
      timeLimit: q.timeLimit,
    });

    handlersRef.current.syncWithManager('QUESTION_ACTIVE', 0);

    // Start timer interval only if timeLimit is greater than 0
    if (q.timeLimit > 0) {
      let remaining = q.timeLimit;
      timerRef.current = window.setInterval(() => {
        remaining -= 1;
        setTimeRemaining(remaining);
        latestRef.current.timeRemaining = remaining;
        if (remaining <= 5 && remaining > 0) {
          sounds.playTick();
        }

        if (remaining <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          revealCurrentAnswer();
        }
      }, 1000);
    } else {
      setTimeRemaining(0);
      latestRef.current.timeRemaining = 0;
    }
  };

  const revealCurrentAnswer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const { quiz: currQuiz, currentQuestionIndex: currQIndex, players: currPlayers } = latestRef.current;
    if (!currQuiz) return;
    const q = currQuiz.questions[currQIndex];
    if (!q) return;

    sounds.playTimeUp();
    setGameState('QUESTION_REVEAL');
    latestRef.current.gameState = 'QUESTION_REVEAL';

    const answersList = currentAnswersRef.current;

    // Calculate scores and ranks
    const updatedPlayers = currPlayers.map((p) => ({ ...p }));
    const playerResults: Record<string, QuestionResult> = {};

    updatedPlayers.forEach((player) => {
      const answer = answersList.find((a) => a.playerId === player.id);
      const isCorrect = answer !== undefined && answer.optionIndex === q.correctAnswerIndex;

      let pointsAwarded = 0;
      if (isCorrect && answer) {
        if (q.timeLimit > 0) {
          // Speed bonus: full base points if under 2s, proportionally scaled down to 50%
          const speedRatio = Math.max(0, Math.min(1, answer.timeRemainingSec / q.timeLimit));
          const speedBonus = Math.round(q.points * 0.5 * speedRatio);
          const streakBonus = player.streak * 50;
          pointsAwarded = Math.round(q.points * 0.5 + speedBonus + streakBonus);
        } else {
          // No time limit: full base points + streak bonus
          const streakBonus = player.streak * 50;
          pointsAwarded = q.points + streakBonus;
        }

        player.score += pointsAwarded;
        player.streak += 1;
      } else {
        player.streak = 0;
      }

      playerResults[player.id] = {
        playerId: player.id,
        isCorrect,
        pointsAwarded,
        totalScore: player.score,
        rank: 1, // Will be computed below
        streak: player.streak,
      };
    });

    // Compute ranks
    const sorted = [...updatedPlayers].sort((a, b) => b.score - a.score);
    sorted.forEach((p, idx) => {
      if (playerResults[p.id]) {
        playerResults[p.id].rank = idx + 1;
      }
    });

    setPlayers(updatedPlayers);
    latestRef.current.players = updatedPlayers;

    // Send individualized results to each player
    updatedPlayers.forEach((p) => {
      const res = playerResults[p.id];
      if (res) {
        hostPeerRef.current?.sendToPlayer(p.id, {
          type: 'QUESTION_RESULT',
          correctOptionIndex: q.correctAnswerIndex,
          result: res,
        });
      }
    });

    handlersRef.current.syncWithManager('QUESTION_REVEAL', undefined, updatedPlayers);
  };

  const showLeaderboard = () => {
    setGameState('LEADERBOARD');
    latestRef.current.gameState = 'LEADERBOARD';
    const currQuiz = latestRef.current.quiz;
    hostPeerRef.current?.broadcastToPlayers({
      type: 'GAME_STATE_UPDATE',
      state: 'LEADERBOARD',
      questionIndex: latestRef.current.currentQuestionIndex,
      totalQuestions: currQuiz ? currQuiz.questions.length : 0,
    });
    handlersRef.current.syncWithManager('LEADERBOARD');
  };

  const advanceToNextQuestion = () => {
    const currQuiz = latestRef.current.quiz;
    if (!currQuiz) return;
    const nextIndex = latestRef.current.currentQuestionIndex + 1;
    if (nextIndex < currQuiz.questions.length) {
      setCurrentQuestionIndex(nextIndex);
      latestRef.current.currentQuestionIndex = nextIndex;
      loadQuestion(nextIndex);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('GAME_FINISHED');
    latestRef.current.gameState = 'GAME_FINISHED';

    const sorted = [...latestRef.current.players].sort((a, b) => b.score - a.score);
    sorted.forEach((p, idx) => {
      hostPeerRef.current?.sendToPlayer(p.id, {
        type: 'GAME_OVER',
        finalScore: p.score,
        finalRank: idx + 1,
        totalPlayers: sorted.length,
      });
    });

    handlersRef.current.syncWithManager('GAME_FINISHED');
  };

  const resetGameToLobby = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('LOBBY');
    latestRef.current.gameState = 'LOBBY';
    setCurrentQuestionIndex(0);
    latestRef.current.currentQuestionIndex = 0;
    currentAnswersRef.current = [];
    answeredPlayerIdsRef.current = new Set();
    setCurrentAnswers([]);
    setAnsweredPlayerIds(new Set());

    // Reset player scores for a rematch
    const resetPlayers = latestRef.current.players.map((p) => ({
      ...p,
      score: 0,
      streak: 0,
    }));
    setPlayers(resetPlayers);
    latestRef.current.players = resetPlayers;

    hostPeerRef.current?.broadcastToPlayers({
      type: 'GAME_STATE_UPDATE',
      state: 'LOBBY',
      quizTitle: latestRef.current.quiz?.title,
    });

    handlersRef.current.syncWithManager('LOBBY');
  };

  // Simulation Helper for testing without real mobile devices
  const handleAddTestBot = () => {
    const botNames = ['Bot Sparky', 'Bot Pixel', 'Bot Quantum', 'Bot Luna', 'Bot Blaze'];
    const botAvatars = ['🤖', '🦊', '⚡', '🛸', '🎯'];
    const randomIdx = Math.floor(Math.random() * botNames.length);
    const botId = `bot-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;

    const botPlayer: Player = {
      id: botId,
      name: `${botNames[randomIdx]} #${latestRef.current.players.length + 1}`,
      avatar: botAvatars[randomIdx],
      score: 0,
      streak: 0,
      connected: true,
    };

    setPlayers((prev) => {
      const updated = [...prev, botPlayer];
      latestRef.current.players = updated;
      handlersRef.current.syncWithManager(undefined, undefined, updated);
      return updated;
    });

    sounds.playJoin();
  };

  // Bot auto-answering behavior during QUESTION_ACTIVE
  useEffect(() => {
    if (gameState === 'QUESTION_ACTIVE' && quiz) {
      const botPlayers = players.filter((p) => p.id.startsWith('bot-'));
      botPlayers.forEach((bot) => {
        if (!answeredPlayerIdsRef.current.has(bot.id)) {
          const randomDelay = 1200 + Math.random() * 3500;
          setTimeout(() => {
            if (latestRef.current.gameState === 'QUESTION_ACTIVE') {
              const currQuiz = latestRef.current.quiz;
              if (!currQuiz) return;
              const q = currQuiz.questions[latestRef.current.currentQuestionIndex];
              const willBeCorrect = Math.random() < 0.75;
              const chosenOption = willBeCorrect
                ? q.correctAnswerIndex
                : Math.floor(Math.random() * q.options.length);

              handlePlayerMessage(
                {
                  type: 'SUBMIT_ANSWER',
                  questionIndex: latestRef.current.currentQuestionIndex,
                  optionIndex: chosenOption,
                  timeRemainingSec: 15,
                },
                bot.id
              );
            }
          }, randomDelay);
        }
      });
    }
  }, [gameState, currentQuestionIndex]);

  return (
    <div className="min-h-[92vh] flex flex-col justify-center items-center">
      {gameState === 'WAITING_FOR_QUIZ' || gameState === 'LOBBY' ? (
        <DisplayLobby
          roomCode={roomCode}
          loadedQuiz={quiz}
          players={players}
          isManagerConnected={isManagerConnected}
          hostStatus={status}
          onRegenerateRoomCode={() => setRoomCode(generateRoomCode())}
          onAddTestPlayer={handleAddTestBot}
          onStartGame={quiz ? startQuizGame : undefined}
        />
      ) : null}

      {gameState === 'QUESTION_ACTIVE' && quiz && (
        <DisplayQuestion
          question={quiz.questions[currentQuestionIndex]}
          questionIndex={currentQuestionIndex}
          totalQuestions={quiz.questions.length}
          timeRemaining={timeRemaining}
          totalPlayers={players.length}
          answeredPlayerIds={answeredPlayerIds}
          players={players}
        />
      )}

      {gameState === 'QUESTION_REVEAL' && quiz && (
        <DisplayReveal
          question={quiz.questions[currentQuestionIndex]}
          questionIndex={currentQuestionIndex}
          totalQuestions={quiz.questions.length}
          players={players}
          answers={currentAnswers}
          onNext={showLeaderboard}
        />
      )}

      {gameState === 'LEADERBOARD' && quiz && (
        <DisplayLeaderboard
          questionIndex={currentQuestionIndex}
          totalQuestions={quiz.questions.length}
          players={players}
          onNext={advanceToNextQuestion}
          isLastQuestion={currentQuestionIndex >= quiz.questions.length - 1}
        />
      )}

      {gameState === 'GAME_FINISHED' && (
        <DisplayPodium players={players} onPlayAgain={resetGameToLobby} />
      )}

      {gameState === 'SESSION_CLOSED' && (
        <div className="max-w-md mx-auto my-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-2xl animate-fadeIn transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-500 mx-auto flex items-center justify-center text-3xl mb-4">
            🛑
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {t('sessionClosedByManager')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            The quiz manager has ended this game session.
          </p>
          <button
            onClick={() => {
              const newCode = generateRoomCode();
              setRoomCode(newCode);
              setQuiz(null);
              setGameState('WAITING_FOR_QUIZ');
            }}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg transition active:scale-95"
          >
            Start New Room
          </button>
        </div>
      )}
    </div>
  );
};
