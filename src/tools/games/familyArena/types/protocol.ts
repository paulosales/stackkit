import { Quiz, Player, QuestionResult } from './game';

// ----------------------------------------------------
// Manager -> Display Messages
// ----------------------------------------------------
export type ManagerToDisplayMessage =
  | { type: 'MANAGER_HELLO'; managerName: string }
  | { type: 'LOAD_QUIZ'; quiz: Quiz }
  | { type: 'START_GAME' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'REVEAL_ANSWER' }
  | { type: 'SHOW_LEADERBOARD' }
  | { type: 'END_GAME' }
  | { type: 'CLOSE_SESSION' }
  | { type: 'RESTART_GAME' };

// ----------------------------------------------------
// Display -> Manager Messages
// ----------------------------------------------------
export type DisplayToManagerMessage =
  | {
      type: 'MANAGER_SYNC';
      state: string;
      quizTitle?: string;
      questionIndex: number;
      totalQuestions: number;
      connectedPlayersCount: number;
      answersReceivedCount: number;
      players: Player[];
    }
  | {
      type: 'ANSWER_RECEIVED';
      answersCount: number;
      totalPlayers: number;
    }
  | {
      type: 'SESSION_CLOSED';
    };

// ----------------------------------------------------
// Player -> Display Messages
// ----------------------------------------------------
export type PlayerToDisplayMessage =
  | {
      type: 'PLAYER_JOIN';
      name: string;
      avatar: string;
    }
  | {
      type: 'SUBMIT_ANSWER';
      questionIndex: number;
      optionIndex: number;
      timeRemainingSec: number;
    }
  | {
      type: 'PLAYER_HEARTBEAT';
    };

// ----------------------------------------------------
// Display -> Player Messages
// ----------------------------------------------------
export type DisplayToPlayerMessage =
  | {
      type: 'JOIN_ACCEPTED';
      playerId: string;
      playerName: string;
      playerAvatar: string;
      quizTitle?: string;
    }
  | {
      type: 'JOIN_REJECTED';
      reason: string;
    }
  | {
      type: 'SYNC_QUIZ';
      quiz: Quiz;
    }
  | {
      type: 'GAME_STATE_UPDATE';
      state: 'LOBBY' | 'QUESTION_PREVIEW' | 'LEADERBOARD' | 'GAME_FINISHED';
      message?: string;
      quizTitle?: string;
      questionIndex?: number;
      totalQuestions?: number;
    }
  | {
      type: 'QUESTION_START';
      questionIndex: number;
      totalQuestions: number;
      text: string;
      options: string[]; // Options without revealing which is correct!
      timeLimit: number;
    }
  | {
      type: 'QUESTION_RESULT';
      correctOptionIndex: number;
      result: QuestionResult;
    }
  | {
      type: 'SESSION_CLOSED';
      reason?: string;
    }
  | {
      type: 'GAME_OVER';
      finalScore: number;
      finalRank: number;
      totalPlayers: number;
    };

// Envelope for all P2P WebRTC data
export interface P2PMessage<T = unknown> {
  protocol: 'FAMILY_ARENA_V1';
  senderRole: 'display' | 'manager' | 'player';
  senderId: string;
  timestamp: number;
  payload: T;
}
