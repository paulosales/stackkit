import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DeckType,
  DECKS,
  Participant,
  ParticipantRole,
  UserRole,
  VotingState,
  VotingStats,
} from './types';
import { HostPeer, ClientPeer, PeerConnectionStatus, generateRoomCode } from './services/peerService';
import { calculateVotingStats } from './services/statsHelper';
import { soundService } from './services/soundService';
import { Header } from './components/Header';
import { RoleSelector } from './components/RoleSelector';
import { HostView } from './components/HostView';
import { ParticipantView } from './components/ParticipantView';
import { ShareModal } from './components/ShareModal';
import '../familyArena/FamilyArena.css';
import './ScrumPoker.css';

function parseInitialUrlState() {
  if (typeof window === 'undefined') {
    return { role: null as UserRole | null, roomCode: '' };
  }
  const params = new URLSearchParams(window.location.search);
  const urlRole = params.get('role');
  const urlRoom = (params.get('room') || '').toUpperCase();

  let validRole: UserRole | null = null;
  if (urlRole === 'host') validRole = 'host';
  else if (urlRole === 'voter' || urlRole === 'participant') validRole = 'participant';

  return { role: validRole, roomCode: urlRoom };
}

export const ScrumPokerApp: React.FC = () => {
  const { t } = useTranslation();
  const [initialUrl] = useState(parseInitialUrlState);
  const [userRole, setUserRole] = useState<UserRole | null>(initialUrl.role);
  const [roomCode, setRoomCode] = useState<string>(initialUrl.roomCode);

  // Participant identity if joining as voter
  const [myParticipantId, setMyParticipantId] = useState<string>(() => `p-${Date.now().toString(36)}`);
  const [myName, setMyName] = useState('');
  const [myAvatar, setMyAvatar] = useState('💻');
  const [myRole, setMyRole] = useState<ParticipantRole>('voter');

  // Shared session state
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [stats, setStats] = useState<VotingStats | null>(null);
  const [deckType, setDeckType] = useState<DeckType>('modified-fibonacci');
  const [votingState, setVotingState] = useState<VotingState>('VOTING');
  const [participants, setParticipants] = useState<Participant[]>([]);

  // Host voting configuration
  const [hostAlsoVotes, setHostAlsoVotes] = useState(true);
  const [hostVote, setHostVote] = useState<string | number | null>(null);

  // Connection status & modals
  const [connectionStatus, setConnectionStatus] = useState<PeerConnectionStatus>({
    connected: false,
    connecting: false,
    error: null,
    peerId: null,
  });
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Peer instances refs
  const hostPeerRef = useRef<HostPeer | null>(null);
  const clientPeerRef = useRef<ClientPeer | null>(null);

  // Helper: broadcast full state from host to all clients
  const broadcastRoomSync = useCallback(
    (
      overrides?: {
        pList?: Participant[];
        vState?: VotingState;
        dType?: DeckType;
        rNum?: number;
        vStats?: VotingStats | null;
      }
    ) => {
      if (!hostPeerRef.current) return;
      const targetParticipants = overrides?.pList ?? participants;
      const targetVState = overrides?.vState ?? votingState;
      const targetDeckType = overrides?.dType ?? deckType;
      const targetRoundNumber = overrides?.rNum ?? roundNumber;
      const targetStats = overrides?.vStats !== undefined ? overrides.vStats : stats;

      // If still VOTING, strip actual vote values from participants list so voters cannot peek!
      const sanitizedParticipants = targetParticipants.map((p) => {
        if (targetVState === 'VOTING') {
          return { ...p, vote: null };
        }
        return p;
      });

      hostPeerRef.current.broadcast({
        type: 'ROOM_SYNC',
        roomCode,
        roundNumber: targetRoundNumber,
        deckType: targetDeckType,
        deckCards: DECKS[targetDeckType].cards,
        votingState: targetVState,
        participants: sanitizedParticipants,
        stats: targetVState === 'REVEALED' ? targetStats : null,
      });
    },
    [participants, votingState, deckType, roundNumber, stats, roomCode]
  );

  // --------------------------------------------------------------------------
  // HOST WebRTC Lifecycle
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (userRole !== 'host' || !roomCode) return;

    const host = new HostPeer(roomCode);
    hostPeerRef.current = host;

    host.onStatusChange = (status) => {
      setConnectionStatus(status);
    };

    host.onParticipantConnected = (peerId) => {
      console.log('Participant connected:', peerId);
    };

    host.onParticipantDisconnected = (peerId) => {
      setParticipants((prev) => {
        const next = prev.filter((p) => p.id !== peerId);
        broadcastRoomSync({ pList: next });
        return next;
      });
    };

    host.onMessage = (msg, senderPeerId) => {
      if (msg.type === 'JOIN') {
        setParticipants((prev) => {
          const exists = prev.find((p) => p.id === senderPeerId);
          let next: Participant[];
          if (exists) {
            next = prev.map((p) =>
              p.id === senderPeerId ? { ...p, name: msg.name, avatar: msg.avatar, role: msg.role } : p
            );
          } else {
            next = [
              ...prev,
              {
                id: senderPeerId,
                name: msg.name,
                avatar: msg.avatar,
                role: msg.role,
                hasVoted: false,
                vote: null,
                isHost: false,
                connectedAt: Date.now(),
              },
            ];
          }
          broadcastRoomSync({ pList: next });
          return next;
        });
      } else if (msg.type === 'CAST_VOTE') {
        setParticipants((prev) => {
          const next = prev.map((p) =>
            p.id === senderPeerId ? { ...p, hasVoted: true, vote: msg.cardValue } : p
          );
          soundService.playVoteCast();
          broadcastRoomSync({ pList: next });
          return next;
        });
      } else if (msg.type === 'CLEAR_VOTE') {
        setParticipants((prev) => {
          const next = prev.map((p) =>
            p.id === senderPeerId ? { ...p, hasVoted: false, vote: null } : p
          );
          broadcastRoomSync({ pList: next });
          return next;
        });
      } else if (msg.type === 'LEAVE') {
        setParticipants((prev) => {
          const next = prev.filter((p) => p.id !== senderPeerId);
          broadcastRoomSync({ pList: next });
          return next;
        });
      }
    };

    host.init();

    return () => {
      host.destroy();
      hostPeerRef.current = null;
    };
  }, [userRole, roomCode]);

  // Sync Host's own participant entry in the table when hostAlsoVotes changes
  useEffect(() => {
    if (userRole !== 'host') return;

    setParticipants((prev) => {
      const hostExists = prev.some((p) => p.isHost);
      let next: Participant[];
      if (hostAlsoVotes && !hostExists) {
        next = [
          {
            id: 'host-user',
            name: 'Moderator',
            avatar: '👑',
            role: 'voter',
            hasVoted: hostVote !== null,
            vote: hostVote,
            isHost: true,
            connectedAt: Date.now(),
          },
          ...prev,
        ];
      } else if (!hostAlsoVotes && hostExists) {
        next = prev.filter((p) => !p.isHost);
      } else if (hostAlsoVotes && hostExists) {
        next = prev.map((p) =>
          p.isHost ? { ...p, hasVoted: hostVote !== null, vote: hostVote } : p
        );
      } else {
        next = prev;
      }
      broadcastRoomSync({ pList: next });
      return next;
    });
  }, [userRole, hostAlsoVotes, hostVote]);

  // --------------------------------------------------------------------------
  // CLIENT WebRTC Lifecycle
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (userRole !== 'participant' || !roomCode) return;

    const client = new ClientPeer(roomCode);
    clientPeerRef.current = client;

    client.onStatusChange = (status) => {
      setConnectionStatus(status);
    };

    client.onMessage = (msg) => {
      if (msg.type === 'ROOM_SYNC') {
        setDeckType(msg.deckType);
        setVotingState(msg.votingState);
        setParticipants(msg.participants);
        if (msg.roundNumber !== undefined) setRoundNumber(msg.roundNumber);
        if (msg.stats) setStats(msg.stats);
        else if (msg.votingState === 'VOTING') setStats(null);
      } else if (msg.type === 'VOTES_REVEALED') {
        setVotingState('REVEALED');
        setParticipants(msg.participants);
        setStats(msg.stats);
      } else if (msg.type === 'VOTING_RESET') {
        setVotingState('VOTING');
        setParticipants(msg.participants);
        setStats(null);
      } else if (msg.type === 'NEW_ROUND') {
        setRoundNumber(msg.roundNumber);
        setVotingState('VOTING');
        setParticipants(msg.participants);
        setStats(null);
      } else if (msg.type === 'DECK_UPDATE') {
        setDeckType(msg.deckType);
      }
    };

    client.connect();

    // Send JOIN after connecting
    const joinTimer = setTimeout(() => {
      client.send({
        type: 'JOIN',
        name: myName || 'Estimator',
        avatar: myAvatar || '💻',
        role: myRole,
      });
    }, 600);

    return () => {
      clearTimeout(joinTimer);
      client.destroy();
      clientPeerRef.current = null;
    };
  }, [userRole, roomCode, myName, myAvatar, myRole]);

  // --------------------------------------------------------------------------
  // Host Handlers
  // --------------------------------------------------------------------------
  const handleHostReveal = () => {
    const calculatedStats = calculateVotingStats(participants);
    setVotingState('REVEALED');
    setStats(calculatedStats);

    if (hostPeerRef.current) {
      hostPeerRef.current.broadcast({
        type: 'VOTES_REVEALED',
        participants,
        stats: calculatedStats,
      });
    }
  };

  const handleHostRevote = () => {
    setVotingState('VOTING');
    setHostVote(null);
    setStats(null);

    const clearedParticipants = participants.map((p) => ({
      ...p,
      hasVoted: false,
      vote: null,
    }));
    setParticipants(clearedParticipants);

    if (hostPeerRef.current) {
      hostPeerRef.current.broadcast({
        type: 'VOTING_RESET',
        participants: clearedParticipants.map((p) => ({ ...p, vote: null })),
      });
    }
  };

  const handleHostNewRound = () => {
    const nextRound = roundNumber + 1;
    setRoundNumber(nextRound);
    setVotingState('VOTING');
    setHostVote(null);
    setStats(null);

    const clearedParticipants = participants.map((p) => ({
      ...p,
      hasVoted: false,
      vote: null,
    }));
    setParticipants(clearedParticipants);

    if (hostPeerRef.current) {
      hostPeerRef.current.broadcast({
        type: 'NEW_ROUND',
        roundNumber: nextRound,
        participants: clearedParticipants.map((p) => ({ ...p, vote: null })),
      });
    }
  };

  const handleHostChangeDeck = (type: DeckType) => {
    setDeckType(type);
    if (hostPeerRef.current) {
      hostPeerRef.current.broadcast({
        type: 'DECK_UPDATE',
        deckType: type,
        deckCards: DECKS[type].cards,
      });
    }
  };

  const handleHostCastVote = (val: string | number) => {
    setHostVote(val);
  };

  const handleHostClearVote = () => {
    setHostVote(null);
  };

  // Simulated Teammates for quick test / demo
  const handleAddSimulatedTeammates = () => {
    const bots: Participant[] = [
      {
        id: `bot-1-${Date.now()}`,
        name: 'Lucas (Backend)',
        avatar: '🚀',
        role: 'voter',
        hasVoted: false,
        vote: null,
        isHost: false,
        isSimulated: true,
        connectedAt: Date.now(),
      },
      {
        id: `bot-2-${Date.now()}`,
        name: 'Sarah (Frontend)',
        avatar: '💻',
        role: 'voter',
        hasVoted: false,
        vote: null,
        isHost: false,
        isSimulated: true,
        connectedAt: Date.now(),
      },
      {
        id: `bot-3-${Date.now()}`,
        name: 'David (QA)',
        avatar: '🧪',
        role: 'voter',
        hasVoted: false,
        vote: null,
        isHost: false,
        isSimulated: true,
        connectedAt: Date.now(),
      },
    ];

    setParticipants((prev) => {
      const merged = [...prev, ...bots];
      broadcastRoomSync({ pList: merged });
      return merged;
    });

    // Simulate their votes after realistic delays
    const deck = DECKS[deckType].cards.filter((c) => typeof c === 'number');
    const pick1 = deck[Math.floor(deck.length * 0.4)] || 5;
    const pick2 = deck[Math.floor(deck.length * 0.4)] || 5; // encourage consensus
    const pick3 = deck[Math.floor(deck.length * 0.5)] || 8;

    setTimeout(() => {
      setParticipants((prev) =>
        prev.map((p) => (p.id === bots[0].id ? { ...p, hasVoted: true, vote: pick1 } : p))
      );
      soundService.playVoteCast();
    }, 1200);

    setTimeout(() => {
      setParticipants((prev) =>
        prev.map((p) => (p.id === bots[1].id ? { ...p, hasVoted: true, vote: pick2 } : p))
      );
      soundService.playVoteCast();
    }, 2200);

    setTimeout(() => {
      setParticipants((prev) =>
        prev.map((p) => (p.id === bots[2].id ? { ...p, hasVoted: true, vote: pick3 } : p))
      );
      soundService.playVoteCast();
    }, 3200);
  };

  // --------------------------------------------------------------------------
  // Participant Handlers
  // --------------------------------------------------------------------------
  const handleParticipantCastVote = (val: string | number) => {
    if (clientPeerRef.current) {
      clientPeerRef.current.send({
        type: 'CAST_VOTE',
        cardValue: val,
      });
    }
    // Optimistic local update
    setParticipants((prev) =>
      prev.map((p) => (p.id === myParticipantId ? { ...p, hasVoted: true, vote: val } : p))
    );
  };

  const handleParticipantClearVote = () => {
    if (clientPeerRef.current) {
      clientPeerRef.current.send({
        type: 'CLEAR_VOTE',
      });
    }
    setParticipants((prev) =>
      prev.map((p) => (p.id === myParticipantId ? { ...p, hasVoted: false, vote: null } : p))
    );
  };

  // --------------------------------------------------------------------------
  // Role Selector & Navigation Handlers
  // --------------------------------------------------------------------------
  const handleSelectHost = (code: string, startingDeck: DeckType) => {
    setRoomCode(code);
    setDeckType(startingDeck);
    setUserRole('host');
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState(
        null,
        '',
        `${window.location.pathname}?role=host&room=${code}`
      );
    }
  };

  const handleSelectJoin = (code: string, name: string, avatar: string, role: ParticipantRole) => {
    setRoomCode(code);
    setMyName(name);
    setMyAvatar(avatar);
    setMyRole(role);
    setUserRole('participant');
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState(
        null,
        '',
        `${window.location.pathname}?role=voter&room=${code}`
      );
    }
  };

  const handleStartSoloDemo = () => {
    const demoCode = generateRoomCode();
    setRoomCode(demoCode);
    setUserRole('host');
    setDeckType('modified-fibonacci');
    setTimeout(() => {
      handleAddSimulatedTeammates();
    }, 500);
  };

  const handleResetRole = () => {
    setUserRole(null);
    setRoomCode('');
    setParticipants([]);
    setVotingState('VOTING');
    setHostVote(null);
    setRoundNumber(1);
    setStats(null);
    if (typeof window !== 'undefined' && window.history) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  return (
    <div className="w-full min-h-[640px] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <Header
        currentRole={userRole}
        roomCode={roomCode}
        connectionStatus={connectionStatus}
        onResetRole={handleResetRole}
        t={t}
      />

      <main className="flex-1 flex flex-col">
        {!userRole && (
          <RoleSelector
            initialRoomCode={roomCode}
            onSelectHost={handleSelectHost}
            onSelectJoin={handleSelectJoin}
            onStartSoloDemo={handleStartSoloDemo}
            t={t}
          />
        )}

        {userRole === 'host' && (
          <HostView
            roomCode={roomCode}
            roundNumber={roundNumber}
            stats={stats}
            deckType={deckType}
            deckCards={DECKS[deckType].cards}
            votingState={votingState}
            participants={participants}
            hostVote={hostVote}
            hostAlsoVotes={hostAlsoVotes}
            onToggleHostVotes={setHostAlsoVotes}
            onHostCastVote={handleHostCastVote}
            onHostClearVote={handleHostClearVote}
            onChangeDeck={handleHostChangeDeck}
            onRevealCards={handleHostReveal}
            onRevote={handleHostRevote}
            onNewRound={handleHostNewRound}
            onOpenShareModal={() => setShareModalOpen(true)}
            onAddSimulatedTeammates={handleAddSimulatedTeammates}
            t={t}
          />
        )}

        {userRole === 'participant' && (
          <ParticipantView
            myParticipantId={myParticipantId}
            roomCode={roomCode}
            roundNumber={roundNumber}
            stats={stats}
            deckType={deckType}
            deckCards={DECKS[deckType].cards}
            votingState={votingState}
            participants={participants}
            onCastVote={handleParticipantCastVote}
            onClearVote={handleParticipantClearVote}
            t={t}
          />
        )}
      </main>

      {/* Share / Invite QR Modal */}
      {shareModalOpen && (
        <ShareModal
          roomCode={roomCode}
          onClose={() => setShareModalOpen(false)}
          t={t}
        />
      )}
    </div>
  );
};

function getStackKitTheme(): 'dark' | 'light' {
  if (typeof document === 'undefined') return 'dark';
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'light' || attr === 'dark') return attr;
  try {
    const saved = localStorage.getItem('stackkit_theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { }
  return 'dark';
}

function syncDomThemeClasses(theme: 'dark' | 'light') {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const isDark = theme === 'dark';

  root.classList.toggle('dark', isDark);
  root.classList.toggle('light', !isDark);
  root.style.colorScheme = theme;

  const roots = document.querySelectorAll('.scrum-poker-root, .family-arena-root');
  roots.forEach((el) => {
    el.classList.toggle('dark', isDark);
    el.classList.toggle('light', !isDark);
    el.setAttribute('data-theme', theme);
  });
}

export default function ThemedPokerContainer() {
  const [theme, setTheme] = useState<'dark' | 'light'>(getStackKitTheme);

  useEffect(() => {
    const applyCurrentTheme = () => {
      const current = getStackKitTheme();
      setTheme(current);
      syncDomThemeClasses(current);
    };

    applyCurrentTheme();

    const observer = new MutationObserver(() => {
      applyCurrentTheme();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'stackkit_theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        applyCurrentTheme();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return (
    <div className={`family-arena-root scrum-poker-root ${theme === 'dark' ? 'dark' : 'light'}`} data-theme={theme}>
      <ScrumPokerApp />
    </div>
  );
}
