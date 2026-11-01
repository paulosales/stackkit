export type DeviceRole = 'display' | 'manager' | 'player';

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[]; // 2 to 4 options
  correctAnswerIndex: number;
  timeLimit: number; // in seconds (e.g., 20)
  points: number; // base points (e.g., 1000)
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  language?: string; // 'en' | 'pt' | 'es'
  questions: QuizQuestion[];
  createdAt: number;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  connected: boolean;
}

export interface AnswerSubmission {
  playerId: string;
  questionIndex: number;
  optionIndex: number;
  timeRemainingSec: number;
  timeTakenMs: number;
}

export interface QuestionResult {
  playerId: string;
  isCorrect: boolean;
  pointsAwarded: number;
  totalScore: number;
  rank: number;
  streak: number;
}

export type DisplayGameState =
  | 'WAITING_FOR_QUIZ'     // Waiting for Manager to send a quiz
  | 'LOBBY'                // Quiz loaded, showing QR code and joined players
  | 'QUESTION_PREVIEW'     // 3-2-1 get ready countdown
  | 'QUESTION_ACTIVE'      // Question visible, timer running, players answering
  | 'QUESTION_REVEAL'      // Time up or manager revealed: show correct answer & stats
  | 'LEADERBOARD'          // Intermediate leaderboard ranking
  | 'GAME_FINISHED'        // Final podium (1st, 2nd, 3rd) and celebration
  | 'SESSION_CLOSED';      // Manager closed the active game session

