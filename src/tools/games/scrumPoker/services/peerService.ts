import Peer, { DataConnection } from 'peerjs';
import { P2PMessage, ClientToHostPayload, HostToClientPayload } from '../types';

export const ROOM_PREFIX = 'sp-room-';

export interface PeerConnectionStatus {
  connected: boolean;
  connecting: boolean;
  error: string | null;
  peerId: string | null;
}

export function generateRoomCode(): string {
  // Generate a random 5-character readable code (excluding ambiguous characters like 0/O, 1/I)
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Robust WebRTC configuration with redundant public STUN + free open TURN servers
// for seamless traversal across mobile cellular CGNAT, local Wi-Fi, and firewall routers.
export const PEER_CONFIG = {
  debug: 1,
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun.cloudflare.com:3478' },
      { urls: 'stun:openrelay.metered.ca:80' },
      {
        urls: 'turn:openrelay.metered.ca:80',
        username: 'openrelay',
        credential: 'openrelay',
      },
      {
        urls: 'turn:openrelay.metered.ca:443',
        username: 'openrelay',
        credential: 'openrelay',
      },
      {
        urls: 'turn:openrelay.metered.ca:443?transport=tcp',
        username: 'openrelay',
        credential: 'openrelay',
      },
    ],
    iceCandidatePoolSize: 10,
  },
};

/**
 * HostPeer is used by the Host/Moderator device.
 * It listens for incoming WebRTC DataChannel connections from participants.
 */
export class HostPeer {
  private peer: Peer | null = null;
  private roomCode: string;
  private retryCount: number = 0;
  private retryTimer: any = null;
  private isDestroyed: boolean = false;
  private participantConns: Map<string, DataConnection> = new Map();

  public onMessage: (msg: ClientToHostPayload, senderPeerId: string) => void = () => {};
  public onParticipantConnected: (connId: string) => void = () => {};
  public onParticipantDisconnected: (connId: string) => void = () => {};
  public onStatusChange: (status: PeerConnectionStatus) => void = () => {};

  constructor(roomCode: string) {
    this.roomCode = roomCode.toUpperCase().trim();
  }

  public init() {
    this.isDestroyed = false;
    this.onStatusChange({ connected: false, connecting: true, error: null, peerId: null });

    const hostId = `${ROOM_PREFIX}${this.roomCode}`;

    if (this.peer) {
      try {
        this.peer.destroy();
      } catch {}
      this.peer = null;
    }

    try {
      this.peer = new Peer(hostId, PEER_CONFIG);

      this.peer.on('open', (id) => {
        if (this.isDestroyed) return;
        this.retryCount = 0;
        this.onStatusChange({ connected: true, connecting: false, error: null, peerId: id });
      });

      this.peer.on('connection', (conn) => {
        if (this.isDestroyed) return;
        this.handleIncomingConnection(conn);
      });

      this.peer.on('error', (err: any) => {
        if (this.isDestroyed) return;
        console.warn('Scrum Poker Host Peer error:', err);

        // If the ID was recently taken (e.g. from page refresh before broker timed out)
        if (err.type === 'unavailable-id') {
          if (this.retryCount < 4) {
            this.retryCount++;
            console.log(
              `Room code "${this.roomCode}" clearing broker state. Auto-reconnecting attempt ${this.retryCount}/4 in 1.2s...`
            );
            if (this.retryTimer) clearTimeout(this.retryTimer);
            this.retryTimer = setTimeout(() => {
              if (!this.isDestroyed) {
                this.init();
              }
            }, 1200);
            return;
          }
        }

        let errorMsg = err.message || 'Host connection error';
        if (err.type === 'unavailable-id') {
          errorMsg = `Room code "${this.roomCode}" is currently active. Please click "New Room" to generate a fresh room.`;
        }
        this.onStatusChange({ connected: false, connecting: false, error: errorMsg, peerId: null });
      });

      this.peer.on('disconnected', () => {
        if (this.isDestroyed) return;
        if (this.peer && !this.peer.destroyed) {
          try {
            this.peer.reconnect();
          } catch {}
        }
      });
    } catch (err: any) {
      console.warn('Scrum Poker Host Peer init exception:', err);
      this.onStatusChange({
        connected: false,
        connecting: false,
        error: err.message || 'Failed to initialize Host WebRTC peer',
        peerId: null,
      });
    }
  }

  private handleIncomingConnection(conn: DataConnection) {
    conn.on('open', () => {
      if (this.isDestroyed) return;
      this.participantConns.set(conn.peer, conn);
      this.onParticipantConnected(conn.peer);
    });

    conn.on('data', (data: any) => {
      if (this.isDestroyed) return;
      if (this.isValidMessage(data)) {
        const msg = data as P2PMessage<ClientToHostPayload>;
        this.onMessage(msg.payload, conn.peer);
      }
    });

    conn.on('close', () => {
      if (this.participantConns.has(conn.peer)) {
        this.participantConns.delete(conn.peer);
        this.onParticipantDisconnected(conn.peer);
      }
    });

    conn.on('error', (err) => {
      console.warn('Host connection error with participant:', conn.peer, err);
      if (this.participantConns.has(conn.peer)) {
        this.participantConns.delete(conn.peer);
        this.onParticipantDisconnected(conn.peer);
      }
    });
  }

  private isValidMessage(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      data.protocol === 'SCRUM_POKER_V1' &&
      data.payload !== undefined
    );
  }

  public broadcast<T extends HostToClientPayload>(payload: T) {
    const msg: P2PMessage<T> = {
      protocol: 'SCRUM_POKER_V1',
      senderRole: 'host',
      senderId: this.peer ? this.peer.id : 'host',
      timestamp: Date.now(),
      payload,
    };

    this.participantConns.forEach((conn) => {
      if (conn.open) {
        try {
          conn.send(msg);
        } catch (e) {
          console.error('Broadcast send error to participant', conn.peer, e);
        }
      }
    });
  }

  public sendToParticipant<T extends HostToClientPayload>(peerId: string, payload: T): boolean {
    const conn = this.participantConns.get(peerId);
    if (!conn || !conn.open) {
      return false;
    }

    const msg: P2PMessage<T> = {
      protocol: 'SCRUM_POKER_V1',
      senderRole: 'host',
      senderId: this.peer ? this.peer.id : 'host',
      timestamp: Date.now(),
      payload,
    };

    try {
      conn.send(msg);
      return true;
    } catch (e) {
      console.error('Send error to participant:', peerId, e);
      return false;
    }
  }

  public getConnectedParticipantsCount(): number {
    return this.participantConns.size;
  }

  public getPeerId(): string | null {
    return this.peer ? this.peer.id : null;
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    this.participantConns.forEach((conn) => {
      try {
        conn.close();
      } catch {}
    });
    this.participantConns.clear();
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch {}
      this.peer = null;
    }
  }
}

/**
 * ClientPeer is used by Participant/Voter devices.
 * Connects directly to Host over WebRTC.
 */
export class ClientPeer {
  private peer: Peer | null = null;
  private conn: DataConnection | null = null;
  private roomCode: string;
  private targetHostId: string;
  private connectionTimer: any = null;
  private isDestroyed: boolean = false;

  public onMessage: (msg: HostToClientPayload) => void = () => {};
  public onStatusChange: (status: PeerConnectionStatus) => void = () => {};

  constructor(roomCode: string, targetHostId?: string) {
    this.roomCode = roomCode.toUpperCase().trim();
    this.targetHostId = (targetHostId || `${ROOM_PREFIX}${this.roomCode}`).trim();
  }

  public connect() {
    this.isDestroyed = false;
    this.onStatusChange({ connected: false, connecting: true, error: null, peerId: null });

    // Explicitly generate a client ID locally to bypass slow /peerjs/id HTTP request
    const myClientId = `sp-c-voter-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;

    try {
      this.peer = new Peer(myClientId, PEER_CONFIG);

      // Timeout guard: if connection to host does not complete in 15 seconds, report error
      if (this.connectionTimer) clearTimeout(this.connectionTimer);
      this.connectionTimer = setTimeout(() => {
        if (!this.conn || !this.conn.open) {
          this.onStatusChange({
            connected: false,
            connecting: false,
            error: `Could not connect to Scrum Poker room "${this.roomCode}". Please ensure the Host screen is open and check your internet connection.`,
            peerId: null,
          });
          this.destroy();
        }
      }, 15000);

      this.peer.on('open', (myId) => {
        if (this.isDestroyed) return;
        const conn = this.peer!.connect(this.targetHostId, {
          reliable: true,
        });

        conn.on('open', () => {
          if (this.isDestroyed) return;
          if (this.connectionTimer) {
            clearTimeout(this.connectionTimer);
            this.connectionTimer = null;
          }
          this.conn = conn;
          this.onStatusChange({ connected: true, connecting: false, error: null, peerId: myId });
        });

        conn.on('data', (data: any) => {
          if (this.isDestroyed) return;
          if (this.isValidMessage(data)) {
            const msg = data as P2PMessage<HostToClientPayload>;
            this.onMessage(msg.payload);
          }
        });

        conn.on('close', () => {
          if (this.isDestroyed) return;
          if (this.connectionTimer) {
            clearTimeout(this.connectionTimer);
            this.connectionTimer = null;
          }
          this.conn = null;
          this.onStatusChange({
            connected: false,
            connecting: false,
            error: 'Connection to Scrum Poker Host was closed.',
            peerId: myId,
          });
        });

        conn.on('error', (err) => {
          if (this.isDestroyed) return;
          if (this.connectionTimer) {
            clearTimeout(this.connectionTimer);
            this.connectionTimer = null;
          }
          console.warn('Client DataChannel error:', err);
          this.onStatusChange({
            connected: false,
            connecting: false,
            error: `Could not connect to room "${this.roomCode}". Please verify the room code.`,
            peerId: myId,
          });
        });
      });

      this.peer.on('error', (err: any) => {
        if (this.isDestroyed) return;
        if (this.connectionTimer) {
          clearTimeout(this.connectionTimer);
          this.connectionTimer = null;
        }
        console.warn('Scrum Poker Client peer error:', err);
        let errorMsg = err.message || 'Peer connection failure.';
        if (err.type === 'peer-unavailable') {
          errorMsg = `Room "${this.roomCode}" was not found. Please ensure the Host is active.`;
        }
        this.onStatusChange({
          connected: false,
          connecting: false,
          error: errorMsg,
          peerId: null,
        });
      });
    } catch (err: any) {
      console.warn('Scrum Poker Client connect error:', err);
      if (this.connectionTimer) {
        clearTimeout(this.connectionTimer);
        this.connectionTimer = null;
      }
      this.onStatusChange({
        connected: false,
        connecting: false,
        error: err.message || 'Client connection failure.',
        peerId: null,
      });
    }
  }

  private isValidMessage(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      data.protocol === 'SCRUM_POKER_V1' &&
      data.payload !== undefined
    );
  }

  public send<T extends ClientToHostPayload>(payload: T): boolean {
    if (!this.conn || this.isDestroyed) {
      console.warn('Cannot send: connection is not initialized');
      return false;
    }
    const msg: P2PMessage<T> = {
      protocol: 'SCRUM_POKER_V1',
      senderRole: 'participant',
      senderId: this.peer ? this.peer.id : 'participant',
      timestamp: Date.now(),
      payload,
    };

    const doSend = () => {
      try {
        this.conn!.send(msg);
        return true;
      } catch (e) {
        console.error('Send error:', e);
        return false;
      }
    };

    if (this.conn.open) {
      return doSend();
    } else {
      this.conn.once('open', doSend);
      return true;
    }
  }

  public getPeerId(): string | null {
    return this.peer ? this.peer.id : null;
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.connectionTimer) {
      clearTimeout(this.connectionTimer);
      this.connectionTimer = null;
    }
    if (this.conn) {
      try {
        this.conn.close();
      } catch {}
      this.conn = null;
    }
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch {}
      this.peer = null;
    }
  }
}

