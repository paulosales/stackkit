import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

function getStackKitTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'light' || attr === 'dark') return attr;
  const saved = localStorage.getItem('stackkit_theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return 'dark';
}

function syncDomThemeClasses(theme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const isDark = theme === 'dark';

  root.classList.toggle('dark', isDark);
  root.classList.toggle('light', !isDark);
  root.style.colorScheme = theme;

  const arenaRoots = document.querySelectorAll('.family-arena-root');
  arenaRoots.forEach((el) => {
    el.classList.toggle('dark', isDark);
    el.classList.toggle('light', !isDark);
  });
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getStackKitTheme);

  useEffect(() => {
    syncDomThemeClasses(theme);

    // Observe changes to StackKit's data-theme attribute on <html>
    const observer = new MutationObserver(() => {
      const current = getStackKitTheme();
      setThemeState((prev) => {
        if (prev !== current) {
          syncDomThemeClasses(current);
          return current;
        }
        return prev;
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // Also listen to storage events if theme changed in another tab
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'stackkit_theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        setThemeState(e.newValue);
        syncDomThemeClasses(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorage);
    };
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    syncDomThemeClasses(newTheme);
  };

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const defaultThemeContext: ThemeContextType = {
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  return context || defaultThemeContext;
};
