/**
 * View Mode Toggle Component
 * Switch between compact and expanded view modes
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { LayoutGrid, List, Maximize2, Minimize2 } from 'lucide-react';

type ViewMode = 'compact' | 'comfortable' | 'expanded';
type LayoutMode = 'grid' | 'list';

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  isCompact: boolean;
}

const ViewModeContext = createContext<ViewModeContextType | null>(null);

export const useViewMode = () => {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
};

export const ViewModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return 'comfortable';
    return (localStorage.getItem('viewMode') as ViewMode) || 'comfortable';
  });

  const [layoutMode, setLayoutModeState] = useState<LayoutMode>(() => {
    if (typeof window === 'undefined') return 'grid';
    return (localStorage.getItem('layoutMode') as LayoutMode) || 'grid';
  });

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem('viewMode', mode);

    // Apply/remove compact-mode class on body
    document.body.classList.remove('compact-mode', 'expanded-mode');
    if (mode === 'compact') {
      document.body.classList.add('compact-mode');
    } else if (mode === 'expanded') {
      document.body.classList.add('expanded-mode');
    }
  }, []);

  const setLayoutMode = useCallback((mode: LayoutMode) => {
    setLayoutModeState(mode);
    localStorage.setItem('layoutMode', mode);
  }, []);

  // Apply initial mode on mount
  useEffect(() => {
    document.body.classList.remove('compact-mode', 'expanded-mode');
    if (viewMode === 'compact') {
      document.body.classList.add('compact-mode');
    } else if (viewMode === 'expanded') {
      document.body.classList.add('expanded-mode');
    }
  }, []);

  const value = {
    viewMode,
    setViewMode,
    layoutMode,
    setLayoutMode,
    isCompact: viewMode === 'compact'
  };

  return (
    <ViewModeContext.Provider value={value}>
      {children}
    </ViewModeContext.Provider>
  );
};

// View Mode Toggle Button
export const ViewModeToggle: React.FC<{ showLabels?: boolean }> = ({ showLabels = false }) => {
  const { viewMode, setViewMode } = useViewMode();

  const modes: { id: ViewMode; icon: React.ReactNode; label: string }[] = [
    { id: 'compact', icon: <Minimize2 className="w-4 h-4" />, label: 'Kompakt' },
    { id: 'comfortable', icon: <LayoutGrid className="w-4 h-4" />, label: 'Normal' },
    { id: 'expanded', icon: <Maximize2 className="w-4 h-4" />, label: 'Expanderad' }
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {modes.map(mode => (
        <button
          key={mode.id}
          onClick={() => setViewMode(mode.id)}
          className={`
            flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-all
            ${viewMode === mode.id
              ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }
          `}
          title={mode.label}
          aria-label={mode.label}
        >
          {mode.icon}
          {showLabels && <span className="text-sm font-medium">{mode.label}</span>}
        </button>
      ))}
    </div>
  );
};

// Layout Mode Toggle Button
export const LayoutModeToggle: React.FC = () => {
  const { layoutMode, setLayoutMode } = useViewMode();

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <button
        onClick={() => setLayoutMode('grid')}
        className={`
          p-2 rounded-md transition-all
          ${layoutMode === 'grid'
            ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }
        `}
        title="Rutnät"
        aria-label="Visa som rutnät"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button
        onClick={() => setLayoutMode('list')}
        className={`
          p-2 rounded-md transition-all
          ${layoutMode === 'list'
            ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }
        `}
        title="Lista"
        aria-label="Visa som lista"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
};

// Combined toolbar with all view controls
export const ViewControlsToolbar: React.FC<{
  showViewMode?: boolean;
  showLayoutMode?: boolean;
  children?: React.ReactNode;
}> = ({ showViewMode = true, showLayoutMode = true, children }) => {
  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        {children}
      </div>
      <div className="flex items-center gap-2">
        {showViewMode && <ViewModeToggle />}
        {showLayoutMode && <LayoutModeToggle />}
      </div>
    </div>
  );
};

export default ViewModeProvider;
