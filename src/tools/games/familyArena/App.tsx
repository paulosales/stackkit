import React, { useState, useEffect } from 'react';
import { DeviceRole } from './types/game';
import { Header } from './components/common/Header';
import { RoleSelector } from './components/role-selector/RoleSelector';
import { DisplayView } from './components/display/DisplayView';
import { ManagerView } from './components/manager/ManagerView';
import { PlayerView } from './components/player/PlayerView';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { I18nProvider } from './i18n/I18nContext';
import './FamilyArena.css';

function parseInitialArenaUrlState() {
  if (typeof window === 'undefined') {
    return { role: null as DeviceRole | null, roomCode: '', hostId: '' };
  }
  const params = new URLSearchParams(window.location.search);
  const urlRole = params.get('role') as DeviceRole | null;
  const urlRoom = (params.get('room') || '').toUpperCase();
  const urlHostId = params.get('hostId') || '';

  const validRole = (urlRole && ['display', 'manager', 'player'].includes(urlRole)) ? urlRole : null;
  return { role: validRole, roomCode: urlRoom, hostId: urlHostId };
}

export const AppContent: React.FC = () => {
  const [initialState] = useState(parseInitialArenaUrlState);
  const [role, setRole] = useState<DeviceRole | null>(initialState.role);
  const [roomCode, setRoomCode] = useState<string>(initialState.roomCode);
  const [hostId, setHostId] = useState<string>(initialState.hostId);

  // Auto-detect role, room, and hostId from URL query parameters (e.g. from QR Code scan or history back/forward)
  useEffect(() => {
    const handleUrlChange = () => {
      const parsed = parseInitialArenaUrlState();
      if (parsed.role) setRole(parsed.role);
      if (parsed.roomCode) setRoomCode(parsed.roomCode);
      if (parsed.hostId) setHostId(parsed.hostId);
    };

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const handleSelectRole = (selectedRole: DeviceRole, code?: string) => {
    setRole(selectedRole);
    if (code) {
      setRoomCode(code.toUpperCase());
    }
  };

  const handleResetRole = () => {
    setRole(null);
    setRoomCode('');
    setHostId('');
    // Clear URL query parameters without full page reload
    if (typeof window !== 'undefined' && window.history) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  return (
    <div className="w-full min-h-[640px] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <Header
        currentRole={role}
        onResetRole={handleResetRole}
        roomCode={roomCode}
      />

      <main className="flex-1 flex flex-col">
        {!role && (
          <RoleSelector
            onSelectRole={handleSelectRole}
            initialRoomCode={roomCode}
          />
        )}

        {role === 'display' && <DisplayView initialRoomCode={roomCode} />}

        {role === 'manager' && (
          <ManagerView initialRoomCode={roomCode} initialHostId={hostId} />
        )}

        {role === 'player' && (
          <PlayerView
            initialRoomCode={roomCode}
            initialHostId={hostId}
            onExit={handleResetRole}
          />
        )}
      </main>
    </div>
  );
};

const ThemedArenaContainer: React.FC = () => {
  const { theme } = useTheme();
  return (
    <div className={`family-arena-root ${theme === 'dark' ? 'dark' : ''}`} data-theme={theme}>
      <AppContent />
    </div>
  );
};

export interface FamilyArenaProps {
  lang?: 'en' | 'pt' | 'es';
  onCopy?: (msg: string) => void;
}

export const App: React.FC<FamilyArenaProps> = ({ lang = 'en' }) => {
  return (
    <ThemeProvider>
      <I18nProvider initialLanguage={lang}>
        <ThemedArenaContainer />
      </I18nProvider>
    </ThemeProvider>
  );
};

export default App;
