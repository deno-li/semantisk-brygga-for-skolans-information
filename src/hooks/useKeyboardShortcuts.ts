/**
 * Keyboard Shortcuts Hook
 * Provides keyboard navigation for power users
 */

import { useEffect, useCallback, useState } from 'react';
import { View } from '../types/types';

interface ShortcutAction {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  description: string;
  action: () => void;
}

interface UseKeyboardShortcutsOptions {
  onNavigate?: (view: View) => void;
  onToggleDarkMode?: () => void;
  onToggleCompactMode?: () => void;
  onShowHelp?: () => void;
  enabled?: boolean;
}

export const useKeyboardShortcuts = ({
  onNavigate,
  onToggleDarkMode,
  onToggleCompactMode,
  onShowHelp,
  enabled = true
}: UseKeyboardShortcutsOptions) => {
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  const shortcuts: ShortcutAction[] = [
    // Navigation shortcuts
    { key: 'h', alt: true, description: 'Gå till översikt', action: () => onNavigate?.('overview') },
    { key: '1', alt: true, description: 'N1 Screening', action: () => onNavigate?.('icf-n1') },
    { key: '2', alt: true, description: 'N2 Fördjupad', action: () => onNavigate?.('icf-n2') },
    { key: '3', alt: true, description: 'N3 Samordnad', action: () => onNavigate?.('icf-n3') },
    { key: 'w', alt: true, description: 'Välbefinnandehjul', action: () => onNavigate?.('shanarri') },
    { key: 'p', alt: true, description: 'Min Plan', action: () => onNavigate?.('sip') },
    { key: 't', alt: true, description: 'Tidslinje', action: () => onNavigate?.('timeline') },
    { key: 'a', alt: true, description: 'AI-Analys', action: () => onNavigate?.('ai-analysis') },

    // UI shortcuts
    { key: 'd', alt: true, description: 'Växla mörkt läge', action: () => onToggleDarkMode?.() },
    { key: 'c', alt: true, description: 'Växla kompakt vy', action: () => onToggleCompactMode?.() },
    { key: '?', shift: true, description: 'Visa kortkommandon', action: () => setShowShortcutsHelp(prev => !prev) },
    { key: 'Escape', description: 'Stäng dialoger', action: () => setShowShortcutsHelp(false) },
  ];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in input fields
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    for (const shortcut of shortcuts) {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase() ||
                       event.key === shortcut.key;
      const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
      const altMatch = shortcut.alt ? event.altKey : !event.altKey;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;

      if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
        event.preventDefault();
        shortcut.action();
        return;
      }
    }
  }, [enabled, shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    shortcuts,
    showShortcutsHelp,
    setShowShortcutsHelp
  };
};

// Keyboard shortcut help modal component
import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: ShortcutAction[];
}

export const ShortcutsHelpModal: React.FC<ShortcutsHelpModalProps> = ({
  isOpen,
  onClose,
  shortcuts
}) => {
  if (!isOpen) return null;

  const formatShortcut = (shortcut: ShortcutAction): string => {
    const parts: string[] = [];
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.alt) parts.push('Alt');
    if (shortcut.shift) parts.push('Shift');
    parts.push(shortcut.key.toUpperCase());
    return parts.join(' + ');
  };

  const navigationShortcuts = shortcuts.filter(s =>
    ['h', '1', '2', '3', 'w', 'p', 't', 'a'].includes(s.key.toLowerCase())
  );
  const uiShortcuts = shortcuts.filter(s =>
    ['d', 'c', '?', 'Escape'].includes(s.key)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Keyboard className="w-5 h-5" />
            Tangentbordsgenvägar
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Stäng"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Navigering
            </h3>
            <div className="space-y-2">
              {navigationShortcuts.map(shortcut => (
                <div key={shortcut.key} className="flex items-center justify-between py-1">
                  <span className="text-gray-700 dark:text-gray-300">{shortcut.description}</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono text-gray-600 dark:text-gray-400">
                    {formatShortcut(shortcut)}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          {/* UI Controls */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Gränssnitt
            </h3>
            <div className="space-y-2">
              {uiShortcuts.map(shortcut => (
                <div key={shortcut.key} className="flex items-center justify-between py-1">
                  <span className="text-gray-700 dark:text-gray-300">{shortcut.description}</span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono text-gray-600 dark:text-gray-400">
                    {formatShortcut(shortcut)}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Tryck <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">?</kbd> för att visa/dölja denna hjälp
          </p>
        </div>
      </div>
    </div>
  );
};

export default useKeyboardShortcuts;
