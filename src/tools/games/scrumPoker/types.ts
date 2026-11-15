export type DeckType =
  | 'fibonacci'
  | 'modified-fibonacci'
  | 'tshirt'
  | 'powers-of-two'
  | 'sequential';

export interface DeckDefinition {
  id: DeckType;
  name: string;
  namePt: string;
  nameEs: string;
  cards: (string | number)[];
}

export const DECKS: Record<DeckType, DeckDefinition> = {
  fibonacci: {
    id: 'fibonacci',
    name: 'Fibonacci Standard',
    namePt: 'Fibonacci Padrão',
    nameEs: 'Fibonacci Estándar',
    cards: [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '?', '☕'],
  },
  'modified-fibonacci': {
    id: 'modified-fibonacci',
    name: 'Modified Fibonacci (Scrum)',
    namePt: 'Fibonacci Modificado (Scrum)',
    nameEs: 'Fibonacci Modificado (Scrum)',
    cards: [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, '?', '☕'],
  },
  tshirt: {
    id: 'tshirt',
    name: 'T-Shirt Sizes',
    namePt: 'Tamanhos de Camiseta (T-Shirt)',
    nameEs: 'Tallas de Camiseta (T-Shirt)',
    cards: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?', '☕'],
  },
  'powers-of-two': {
    id: 'powers-of-two',
    name: 'Powers of 2',
    namePt: 'Potências de 2',
    nameEs: 'Potencias de 2',
    cards: [0, 1, 2, 4, 8, 16, 32, 64, '?', '☕'],
  },
  sequential: {
    id: 'sequential',
    name: 'Sequential (1-10)',
    namePt: 'Sequencial (1-10)',
    nameEs: 'Secuencial (1-10)',
    cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '?', '☕'],
  },
};

export type ParticipantRole = 'voter' | 'spectator';

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  role: ParticipantRole;
  hasVoted: boolean;
  vote: string | number | null;
  isHost: boolean;
  isSimulated?: boolean;
  connectedAt: number;
}

export interface VotingStats {
  totalVoters: number;
  totalVotes: number;
  average: number | null;
  median: number | null;
  mode: string | number | null;
  min: number | null;
  max: number | null;
  agreementPercentage: number;
  hasConsensus: boolean;
  distribution: Record<string, number>;
  highestVoters: string[];
  lowestVoters: string[];
}

export type VotingState = 'VOTING' | 'REVEALED';

export type UserRole = 'host' | 'participant';

// ----------------------------------------------------
// Peer-to-Peer Protocol Messages
// ----------------------------------------------------
export interface P2PMessage<T = any> {
  protocol: 'SCRUM_POKER_V1';
  senderRole: 'host' | 'participant';
  senderId: string;
  timestamp: number;
  payload: T;
}

export type ClientToHostPayload =
  | {
    type: 'JOIN';
    name: string;
    avatar: string;
    role: ParticipantRole;
  }
  | {
    type: 'CAST_VOTE';
    cardValue: string | number;
  }
  | {
    type: 'CLEAR_VOTE';
  }
  | {
    type: 'HEARTBEAT';
  }
  | {
    type: 'LEAVE';
  };

export type HostToClientPayload =
  | {
    type: 'ROOM_SYNC';
    roomCode: string;
    roundNumber?: number;
    deckType: DeckType;
    deckCards: (string | number)[];
    votingState: VotingState;
    participants: Participant[];
    stats?: VotingStats | null;
    timerSecondsRemaining?: number | null;
    isTimerActive?: boolean;
  }
  | {
    type: 'VOTES_REVEALED';
    participants: Participant[];
    stats: VotingStats;
  }
  | {
    type: 'VOTING_RESET';
    participants: Participant[];
  }
  | {
    type: 'NEW_ROUND';
    roundNumber: number;
    participants: Participant[];
  }
  | {
    type: 'DECK_UPDATE';
    deckType: DeckType;
    deckCards: (string | number)[];
  }
  | {
    type: 'TIMER_TICK';
    secondsRemaining: number | null;
    isActive: boolean;
  }
  | {
    type: 'KICK';
    reason?: string;
  }
  | {
    type: 'SESSION_CLOSED';
  };

