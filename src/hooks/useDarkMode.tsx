/**
 * Dark Mode Hook
 * Manages dark/light theme with system preference support
 */

import { useState, useEffect, useCallback, createContext, useContext } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface DarkModeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | null>(null);

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

// Standalone hook for components that need dark mode without provider
export const useDarkModeStandalone = () => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem('theme') as Theme) || 'system';
  });

  const [isDark, setIsDark] = useState(false);

  const applyTheme = useCallback((newTheme: Theme) => {
    const root = window.document.documentElement;
    let effectiveTheme: 'light' | 'dark';

    if (newTheme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } else {
      effectiveTheme = newTheme;
    }

    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);
    setIsDark(effectiveTheme === 'dark');
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  }, [applyTheme]);

  const toggleDarkMode = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark');
  }, [isDark, setTheme]);

  // Initial setup
  useEffect(() => {
    applyTheme(theme);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme('system');

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  return { theme, isDark, setTheme, toggleDarkMode };
};

// Provider component
import React from 'react';

export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const darkMode = useDarkModeStandalone();

  return (
    <DarkModeContext.Provider value={darkMode}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Theme toggle button component
import { Moon, Sun, Monitor } from 'lucide-react';

export const ThemeToggle: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { theme, setTheme, isDark } = useDarkMode();

  if (compact) {
    return (
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label={isDark ? 'Byt till ljust läge' : 'Byt till mörkt läge'}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-600" />
        )}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'light'
            ? 'bg-white dark:bg-gray-700 shadow-sm'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        aria-label="Ljust läge"
        title="Ljust läge"
      >
        <Sun className={`w-4 h-4 ${theme === 'light' ? 'text-yellow-500' : 'text-gray-500'}`} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'dark'
            ? 'bg-white dark:bg-gray-700 shadow-sm'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        aria-label="Mörkt läge"
        title="Mörkt läge"
      >
        <Moon className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-500' : 'text-gray-500'}`} />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-md transition-colors ${
          theme === 'system'
            ? 'bg-white dark:bg-gray-700 shadow-sm'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        aria-label="Systemets inställning"
        title="Följ systemet"
      >
        <Monitor className={`w-4 h-4 ${theme === 'system' ? 'text-green-500' : 'text-gray-500'}`} />
      </button>
    </div>
  );
};

export default DarkModeProvider;
