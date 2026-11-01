import Peer, { DataConnection } from 'peerjs';
import { P2PMessage } from '../types/protocol';

export const ROOM_PREFIX = 'fa-room-';

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
 * HostPeer is used by the Display device.
 * It listens for incoming WebRTC DataChannel connections from Manager and Players.
 */
export class HostPeer {
  private peer: Peer | null = null;
  private roomCode: string;
  private retryCount: number = 0;
  private retryTimer: any = null;
  private isDestroyed: boolean = false;
  private managerConn: DataConnection | null = null;
  private playerConns: Map<string, DataConnection> = new Map();

  public onMessage: (msg: P2PMessage, senderPeerId: string) => void = () => {};
  public onPlayerConnected: (connId: string) => void = () => {};
  public onPlayerDisconnected: (connId: string) => void = () => {};
  public onManagerConnected: () => void = () => {};
  public onManagerDisconnected: () => void = () => {};
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
        console.warn('Host Peer error:', err);

        // If the ID was recently taken (e.g. from page refresh before previous socket timed out)
        if (err.type === 'unavailable-id') {
          if (this.retryCount < 4) {
            this.retryCount++;
            console.log(
              `Room code "${this.roomCode}" is clearing previous connection on broker. Auto-reconnecting attempt ${this.retryCount}/4 in 1.2s...`
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
          errorMsg = `Room code "${this.roomCode}" is currently registered. Please click "New Code" to get a fresh room.`;
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
      console.warn('Host Peer initialization exception:', err);
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
      // Channel opened between Host and Client
    });

    conn.on('data', (data: any) => {
      if (this.isValidMessage(data)) {
        const msg = data as P2PMessage;
        if (msg.senderRole === 'manager') {
          if (!this.managerConn || this.managerConn.peer !== conn.peer) {
            this.managerConn = conn;
            this.onManagerConnected();
          }
        } else if (msg.senderRole === 'player') {
          if (!this.playerConns.has(conn.peer)) {
            this.playerConns.set(conn.peer, conn);
            this.onPlayerConnected(conn.peer);
          }
        }
        this.onMessage(msg, conn.peer);
      }
    });

    conn.on('close', () => {
      if (this.managerConn && this.managerConn.peer === conn.peer) {
        this.managerConn = null;
        this.onManagerDisconnected();
      }
      if (this.playerConns.has(conn.peer)) {
        this.playerConns.delete(conn.peer);
        this.onPlayerDisconnected(conn.peer);
      }
    });

    conn.on('error', (err) => {
      console.warn('Host connection error with peer:', conn.peer, err);
      if (this.playerConns.has(conn.peer)) {
        this.playerConns.delete(conn.peer);
        this.onPlayerDisconnected(conn.peer);
      }
    });
  }

  private isValidMessage(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      data.protocol === 'FAMILY_ARENA_V1' &&
      typeof data.senderRole === 'string' &&
      data.payload !== undefined
    );
  }

  public broadcastToPlayers<T>(payload: T) {
    const msg: P2PMessage<T> = {
      protocol: 'FAMILY_ARENA_V1',
      senderRole: 'display',
      senderId: this.peer ? this.peer.id : 'display',
      timestamp: Date.now(),
      payload,
    };

    this.playerConns.forEach((conn) => {
      if (conn.open) {
        try {
          conn.send(msg);
        } catch (e) {
          console.error('Broadcast send error to player', conn.peer, e);
        }
      }
    });
  }

  public sendToPlayer<T>(peerId: string, payload: T): boolean {
    const conn = this.playerConns.get(peerId);
    if (!conn || !conn.open) {
      return false;
    }

    const msg: P2PMessage<T> = {
      protocol: 'FAMILY_ARENA_V1',
      senderRole: 'display',
      senderId: this.peer ? this.peer.id : 'display',
      timestamp: Date.now(),
      payload,
    };

    try {
      conn.send(msg);
      return true;
    } catch (e) {
      console.error('Send error to player:', peerId, e);
      return false;
    }
  }

  public sendToManager<T>(payload: T): boolean {
    if (!this.managerConn || !this.managerConn.open) {
      return false;
    }

    const msg: P2PMessage<T> = {
      protocol: 'FAMILY_ARENA_V1',
      senderRole: 'display',
      senderId: this.peer ? this.peer.id : 'display',
      timestamp: Date.now(),
      payload,
    };

    try {
      this.managerConn.send(msg);
      return true;
    } catch (e) {
      console.error('Send error to manager:', e);
      return false;
    }
  }

  public getConnectedPlayersCount(): number {
    return this.playerConns.size;
  }

  public isManagerOnline(): boolean {
    return this.managerConn !== null && this.managerConn.open;
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
    if (this.managerConn) {
      try {
        this.managerConn.close();
      } catch {}
      this.managerConn = null;
    }
    this.playerConns.forEach((conn) => {
      try {
        conn.close();
      } catch {}
    });
    this.playerConns.clear();

    if (this.peer) {
      try {
        this.peer.destroy();
      } catch {}
      this.peer = null;
    }
  }
}

/**
 * ClientPeer is used by the Manager and Player devices.
 * It connects directly to the Display device Host Peer over WebRTC.
 */
export class ClientPeer {
  private peer: Peer | null = null;
  private conn: DataConnection | null = null;
  private roomCode: string;
  private targetHostId: string;
  private role: 'manager' | 'player';
  private connectionTimer: any = null;
  private isDestroyed: boolean = false;

  public onMessage: (msg: P2PMessage) => void = () => {};
  public onStatusChange: (status: PeerConnectionStatus) => void = () => {};

  constructor(roomCode: string, role: 'manager' | 'player', targetHostId?: string) {
    this.roomCode = roomCode.toUpperCase().trim();
    this.role = role;
    this.targetHostId = (targetHostId || `${ROOM_PREFIX}${this.roomCode}`).trim();
  }

  public connect() {
    this.isDestroyed = false;
    this.onStatusChange({ connected: false, connecting: true, error: null, peerId: null });

    // Explicitly generate a client ID locally to bypass the slow /peerjs/id HTTP request
    const myClientId = `fa-c-${this.role}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;

    try {
      this.peer = new Peer(myClientId, PEER_CONFIG);

      // Timeout guard: if connection to host does not complete in 15 seconds, report error
      if (this.connectionTimer) clearTimeout(this.connectionTimer);
      this.connectionTimer = setTimeout(() => {
        if (!this.conn || !this.conn.open) {
          this.onStatusChange({
            connected: false,
            connecting: false,
            error: `Could not connect to Display room "${this.roomCode}". Please verify that the Display screen is open with this code and your devices have an internet connection.`,
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
            this.onMessage(data as P2PMessage);
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
            error: 'Connection to Display was closed.',
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
            error: `Could not connect to Display room "${this.roomCode}". Please check the room code.`,
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
        console.warn('Client peer error:', err);
        let errorMsg = err.message || 'Peer connection failure.';
        if (err.type === 'peer-unavailable') {
          errorMsg = `Room "${this.roomCode}" was not found. Please ensure the Display screen is open with this code.`;
        }
        this.onStatusChange({
          connected: false,
          connecting: false,
          error: errorMsg,
          peerId: null,
        });
      });
    } catch (err: any) {
      console.warn('Client peer connect error:', err);
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
      data.protocol === 'FAMILY_ARENA_V1' &&
      data.payload !== undefined
    );
  }

  public send<T>(payload: T): boolean {
    if (!this.conn || this.isDestroyed) {
      console.warn('Cannot send: connection is not initialized');
      return false;
    }
    const msg: P2PMessage<T> = {
      protocol: 'FAMILY_ARENA_V1',
      senderRole: this.role,
      senderId: this.peer ? this.peer.id : 'unknown',
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
