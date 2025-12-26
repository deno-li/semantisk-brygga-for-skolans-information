/**
 * Level Indicator Component
 * Displays current journey level (N1/N2/N3) with visual badge
 * Shows triggered spokes and next review date
 */

import React from 'react';
import { Calendar, TrendingUp, Info } from 'lucide-react';
import { JourneyLevel, WelfareWheelSpoke } from '../types/types';
import { LEVEL_COLORS, getLevelName } from '../data/journeyConstants';

interface LevelIndicatorProps {
  level: JourneyLevel;
  triggeredSpokes?: Array<{
    spoke: WelfareWheelSpoke;
    status: number;
    reason?: string;
  }>;
  nextReview?: string;
  compact?: boolean;
  showHistory?: boolean;
  onShowHistory?: () => void;
}

const LevelIndicator: React.FC<LevelIndicatorProps> = ({
  level,
  triggeredSpokes = [],
  nextReview,
  compact = false,
  showHistory = false,
  onShowHistory
}) => {
  const levelColors = LEVEL_COLORS[level];
  const levelName = getLevelName(level);

  // Get level description
  const getLevelDescription = () => {
    switch (level) {
      case 'universell':
        return 'Universell nivå - Alla barn';
      case 'stodprofil':
        return 'Stödprofil - Fördjupad analys';
      case 'samordning':
        return 'Samordningsprofil - Samordnade insatser';
      default:
        return '';
    }
  };

  // Get level emoji
  const getLevelEmoji = () => {
    switch (level) {
      case 'universell':
        return '🔵';
      case 'stodprofil':
        return '🟡';
      case 'samordning':
        return '🔴';
      default:
        return '⚪';
    }
  };

  // Compact version for smaller spaces
  if (compact) {
    return (
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
        style={{
          backgroundColor: levelColors.bg,
          color: levelColors.text,
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: levelColors.border
        }}
      >
        <span>{getLevelEmoji()}</span>
        <span>{levelName}</span>
      </div>
    );
  }

  // Full version with details
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold shadow-sm"
            style={{
              backgroundColor: levelColors.bg,
              color: levelColors.text,
              borderWidth: '3px',
              borderStyle: 'solid',
              borderColor: levelColors.border
            }}
          >
            {getLevelEmoji()}
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
              Aktuell nivå
            </div>
            <h3
              className="text-2xl font-bold"
              style={{ color: levelColors.text }}
            >
              {levelName}
            </h3>
            <p className="text-sm text-gray-700 mt-1">{getLevelDescription()}</p>
          </div>
        </div>
        {showHistory && onShowHistory && (
          <button
            onClick={onShowHistory}
            className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded border border-blue-300 transition-colors"
          >
            Visa historik
          </button>
        )}
      </div>

      {/* Triggered Spokes */}
      {triggeredSpokes.length > 0 && (
        <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded">
          <div className="flex items-start gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-orange-900 text-sm">
                Triggrade ekrar ({triggeredSpokes.length})
              </p>
              <p className="text-xs text-orange-800 mt-1">
                Följande ekrar har indikerat behov av denna nivå:
              </p>
            </div>
          </div>
          <ul className="space-y-1.5 mt-3">
            {triggeredSpokes.map((trigger, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-sm text-orange-900 bg-white px-3 py-2 rounded border border-orange-200"
              >
                <span className="font-medium capitalize">{trigger.spoke}</span>
                <span className="text-xs text-orange-700">
                  (status {trigger.status})
                </span>
                {trigger.reason && (
                  <span className="text-xs text-gray-600 ml-auto">
                    {trigger.reason}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next Review Date */}
      {nextReview && (
        <div className="flex items-center gap-2 text-sm text-gray-700 p-3 bg-blue-50 border border-blue-200 rounded">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-blue-900">Nästa uppföljning:</span>
          <span className="text-blue-800">
            {new Date(nextReview).toLocaleDateString('sv-SE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      )}

      {/* Info footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600">
            Nivån uppdateras automatiskt baserat på välbefinnandehjulets status och eskaleringsregler.
            Nivån kan också ändras manuellt av behörig personal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LevelIndicator;
