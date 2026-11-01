import React, { useState, useEffect, useRef } from 'react';
import { Library, Radio, PlusCircle, StopCircle, ExternalLink, AlertTriangle } from 'lucide-react';
import { Quiz, Player } from '../../types/game';
import { ClientPeer, PeerConnectionStatus, generateRoomCode } from '../../services/peerService';
import { getStoredQuizzes, saveQuiz, saveQuizzes, deleteQuiz } from '../../services/quizStorage';
import { ManagerLibrary } from './ManagerLibrary';
import { ManagerEditor } from './ManagerEditor';
import { ManagerRemote } from './ManagerRemote';
import { P2PMessage, DisplayToManagerMessage } from '../../types/protocol';
import { useTranslation } from '../../i18n/I18nContext';

interface ManagerViewProps {
  initialRoomCode?: string;
  initialHostId?: string;
}

export const ManagerView: React.FC<ManagerViewProps> = ({
  initialRoomCode = '',
  initialHostId = '',
}) => {
  const { t } = useTranslation();
  const [activeSessionCode, setActiveSessionCode] = useState<string | null>(() => initialRoomCode || null);
  const [hostId] = useState(initialHostId);

  const [status, setStatus] = useState<PeerConnectionStatus>({
    connected: false,
    connecting: false,
    error: null,
    peerId: null,
  });

  const [activeTab, setActiveTab] = useState<'library' | 'editor' | 'remote'>('library');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  // Synchronized state from Display
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [displayState, setDisplayState] = useState<string>('WAITING_FOR_QUIZ');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [connectedPlayersCount, setConnectedPlayersCount] = useState(0);
  const [answersReceivedCount, setAnswersReceivedCount] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);

  // Confirmation Modal state for ending session
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);

  const peerRef = useRef<ClientPeer | null>(null);

  useEffect(() => {
    setQuizzes(getStoredQuizzes());
    if (initialRoomCode) {
      connectToRoom(initialRoomCode);
    }
    return () => {
      peerRef.current?.destroy();
    };
  }, []);

  const connectToRoom = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return;

    if (peerRef.current) {
      peerRef.current.destroy();
    }

    const targetHost = hostId || undefined;
    const peer = new ClientPeer(cleanCode, 'manager', targetHost);
    peerRef.current = peer;

    peer.onStatusChange = (newStatus) => {
      setStatus(newStatus);
      if (newStatus.connected) {
        setActiveSessionCode(cleanCode);
        peer.send({ type: 'MANAGER_HELLO', managerName: 'Manager' });
      }
    };

    peer.onMessage = (msg: P2PMessage) => {
      if (msg.payload && typeof msg.payload !== 'object') return;
      const payload = msg.payload as DisplayToManagerMessage;

      if (payload.type === 'MANAGER_SYNC') {
        setDisplayState(payload.state);
        setQuestionIndex(payload.questionIndex);
        setTotalQuestions(payload.totalQuestions);
        setConnectedPlayersCount(payload.connectedPlayersCount);
        setAnswersReceivedCount(payload.answersReceivedCount);
        setPlayers(payload.players || []);
      } else if (payload.type === 'ANSWER_RECEIVED') {
        setAnswersReceivedCount(payload.answersCount);
        setConnectedPlayersCount(payload.totalPlayers);
      } else if (payload.type === 'SESSION_CLOSED') {
        handleResetSessionState();
      }
    };

    peer.connect();
  };

  // Launch a new session by combining selected quizzes and opening Display in a new tab
  const handleLaunchSession = (selectedQuizIds: string[]) => {
    const selected = quizzes.filter((q) => selectedQuizIds.includes(q.id));
    if (selected.length === 0) return;

    const combinedQuestions = selected.flatMap((q) => q.questions);
    const sessionCode = generateRoomCode();

    const sessionQuiz: Quiz = {
      id: `session-quiz-${Date.now()}`,
      title: selected.length === 1 ? selected[0].title : selected.map((q) => q.title).join(' + '),
      description: `Game Session: ${combinedQuestions.length} questions from ${selected.length} quiz sets.`,
      category: selected.length === 1 ? selected[0].category : t('combinedQuizCategory'),
      questions: combinedQuestions,
      createdAt: Date.now(),
    };

    // Store session quiz in shared browser localStorage so Display tab reads it instantly
    try {
      localStorage.setItem(`fa_session_${sessionCode}`, JSON.stringify(sessionQuiz));
    } catch (e) {
      console.warn('Failed to store session in localStorage:', e);
    }

    // Open Display in a new browser tab preserving current route
    const currentPath = typeof window !== 'undefined' ? (window.location.pathname || '') : '/family-arena';
    let toolBasePath = '/family-arena';
    if (currentPath.includes('family-arena') || currentPath.includes('quiz-arena')) {
      toolBasePath = currentPath.split('?')[0];
    } else if (currentPath.startsWith('/pt')) {
      toolBasePath = '/pt/family-arena';
    } else if (currentPath.startsWith('/en')) {
      toolBasePath = '/en/family-arena';
    }
    window.open(`${toolBasePath}?role=display&room=${sessionCode}`, '_blank');

    setActiveQuiz(sessionQuiz);
    setActiveSessionCode(sessionCode);
    setActiveTab('remote');

    // Connect this manager tab to the session
    connectToRoom(sessionCode);
  };

  const handleOpenExistingSessionDisplay = () => {
    if (activeSessionCode) {
      const currentPath = typeof window !== 'undefined' ? (window.location.pathname || '') : '/family-arena';
      let toolBasePath = '/family-arena';
      if (currentPath.includes('family-arena') || currentPath.includes('quiz-arena')) {
        toolBasePath = currentPath.split('?')[0];
      } else if (currentPath.startsWith('/pt')) {
        toolBasePath = '/pt/family-arena';
      } else if (currentPath.startsWith('/en')) {
        toolBasePath = '/en/family-arena';
      }
      window.open(`${toolBasePath}?role=display&room=${activeSessionCode}`, '_blank');
    }
  };

  const handlePromptEndSession = () => {
    setShowEndSessionModal(true);
  };

  const handleConfirmEndSession = () => {
    setShowEndSessionModal(false);

    // Send close command to Display
    peerRef.current?.send({ type: 'CLOSE_SESSION' });

    if (activeSessionCode) {
      try {
        localStorage.removeItem(`fa_session_${activeSessionCode}`);
      } catch {}
    }

    handleResetSessionState();
  };

  const handleResetSessionState = () => {
    peerRef.current?.destroy();
    peerRef.current = null;
    setActiveSessionCode(null);
    setActiveQuiz(null);
    setStatus({
      connected: false,
      connecting: false,
      error: null,
      peerId: null,
    });
    setDisplayState('WAITING_FOR_QUIZ');
    setConnectedPlayersCount(0);
    setAnswersReceivedCount(0);
    setPlayers([]);
    setActiveTab('library');
  };

  const handleStartGame = () => {
    peerRef.current?.send({ type: 'START_GAME' });
  };

  const handleNextQuestion = () => {
    peerRef.current?.send({ type: 'NEXT_QUESTION' });
  };

  const handleRevealAnswer = () => {
    peerRef.current?.send({ type: 'REVEAL_ANSWER' });
  };

  const handleShowLeaderboard = () => {
    peerRef.current?.send({ type: 'SHOW_LEADERBOARD' });
  };

  const handleRestartGame = () => {
    peerRef.current?.send({ type: 'RESTART_GAME' });
  };

  const handleSaveQuiz = (quiz: Quiz) => {
    const updated = saveQuiz(quiz);
    setQuizzes(updated);
    setEditingQuiz(null);
    setActiveTab('library');
  };

  const handleDeleteQuiz = (id: string) => {
    const updated = deleteQuiz(id);
    setQuizzes(updated);
  };

  const handleDuplicateQuiz = (quiz: Quiz) => {
    const copy: Quiz = {
      ...quiz,
      id: `quiz-custom-${Date.now()}`,
      title: `${quiz.title} (Copy)`,
      createdAt: Date.now(),
      questions: quiz.questions.map((q, i) => ({
        ...q,
        id: `q-dup-${Date.now()}-${i}`,
      })),
    };
    const updated = saveQuiz(copy);
    setQuizzes(updated);
  };

  const handleImportQuizzes = (newQuizzes: Quiz[]) => {
    const updated = saveQuizzes(newQuizzes);
    setQuizzes(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Active Session Status & Navigation Bar */}
      <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('library')}
              className={`px-3 sm:px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition ${
                activeTab === 'library'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Library className="w-4 h-4" />
              <span>{t('libraryTab')}</span>
            </button>

            <button
              onClick={() => {
                setEditingQuiz(null);
                setActiveTab('editor');
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition ${
                activeTab === 'editor'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('editorTab')}</span>
            </button>

            {activeSessionCode && (
              <button
                onClick={() => setActiveTab('remote')}
                className={`px-3 sm:px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition ${
                  activeTab === 'remote'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                <span>{t('remoteTab')}</span>
              </button>
            )}
          </div>

          {/* Session Info & End Session Button */}
          {activeSessionCode ? (
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 flex items-center space-x-1.5">
                <span className={`w-2 h-2 rounded-full ${status.connected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                <span>{t('room')}: {activeSessionCode}</span>
              </span>

              <button
                onClick={handleOpenExistingSessionDisplay}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center space-x-1"
                title={t('openDisplayInNewTab')}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('displayDevice')}</span>
              </button>

              <button
                onClick={handlePromptEndSession}
                className="px-3 py-1 rounded-lg bg-red-100 dark:bg-red-950/50 hover:bg-red-200 dark:hover:bg-red-900/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 text-xs font-bold flex items-center space-x-1 transition"
              >
                <StopCircle className="w-3.5 h-3.5" />
                <span>{t('endSessionBtn')}</span>
              </button>
            </div>
          ) : (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t('managerNoCodeNeeded')}
            </span>
          )}
        </div>
      </div>

      {/* Main Tab Body */}
      <div className="flex-1">
        {activeTab === 'library' && (
          <ManagerLibrary
            quizzes={quizzes}
            onLaunchSession={handleLaunchSession}
            onEditQuiz={(quiz) => {
              setEditingQuiz(quiz);
              setActiveTab('editor');
            }}
            onDuplicateQuiz={handleDuplicateQuiz}
            onDeleteQuiz={handleDeleteQuiz}
            onCreateNewQuiz={() => {
              setEditingQuiz(null);
              setActiveTab('editor');
            }}
            onImportQuiz={(quiz) => {
              const updated = saveQuiz(quiz);
              setQuizzes(updated);
            }}
            onImportQuizzes={handleImportQuizzes}
            activeSessionCode={activeSessionCode}
            onOpenExistingSessionDisplay={handleOpenExistingSessionDisplay}
          />
        )}

        {activeTab === 'editor' && (
          <ManagerEditor
            initialQuiz={editingQuiz}
            onSaveQuiz={handleSaveQuiz}
            onSaveAndSend={(quiz) => {
              handleSaveQuiz(quiz);
              handleLaunchSession([quiz.id]);
            }}
            onCancel={() => {
              setEditingQuiz(null);
              setActiveTab('library');
            }}
          />
        )}

        {activeTab === 'remote' && (
          <ManagerRemote
            quiz={activeQuiz}
            displayState={displayState}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            connectedPlayersCount={connectedPlayersCount}
            answersReceivedCount={answersReceivedCount}
            players={players}
            activeSessionCode={activeSessionCode}
            onStartGame={handleStartGame}
            onNextQuestion={handleNextQuestion}
            onRevealAnswer={handleRevealAnswer}
            onShowLeaderboard={handleShowLeaderboard}
            onRestartGame={handleRestartGame}
            onEndSession={handlePromptEndSession}
          />
        )}
      </div>

      {/* Confirmation Modal for Ending Game Session */}
      {showEndSessionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {t('confirmEndSessionTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              {t('confirmEndSessionDesc')}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowEndSessionModal(false)}
                className="py-3 px-4 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-300 dark:border-slate-700"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmEndSession}
                className="py-3 px-4 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/20 transition active:scale-95"
              >
                {t('confirmEndSessionAction')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
