/**
 * JourneyTimeline Component
 * Visualizes the child's journey through support levels over time
 * Shows level changes, triggers, and key events as a vertical timeline
 */

import React, { useState } from 'react';
import {
  Activity, ArrowUp, ArrowDown, ArrowRight, Calendar, CheckCircle2,
  AlertTriangle, Info, User, Shield, Target, Clock, MessageSquare,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { JourneyLevelChange, JourneyLevel, JourneyProfile } from '../types/types';

interface JourneyTimelineProps {
  profile: JourneyProfile;
  showDetails?: boolean;
}

// Level configuration - using Partial to allow flexible level types
const LEVEL_CONFIG: Record<string, {
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  description: string;
}> = {
  universell: {
    name: 'Universell nivå',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    description: 'Alla barn, hälsofrämjande och förebyggande insatser'
  },
  stodprofil: {
    name: 'Stödprofil',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
    icon: <Shield className="w-5 h-5 text-orange-600" />,
    description: 'Riktat stöd inom en sektor'
  },
  samordning: {
    name: 'Samordning',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    icon: <Activity className="w-5 h-5 text-red-600" />,
    description: 'Samordnade insatser över sektorsgränser (SIP)'
  }
};

// Calculate journey duration
const calculateDuration = (startDate: string, endDate?: string): string => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return `${diffDays} dagar`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? 'månad' : 'månader'}`;
  } else {
    const years = Math.floor(diffDays / 365);
    const remainingMonths = Math.floor((diffDays % 365) / 30);
    return remainingMonths > 0
      ? `${years} år, ${remainingMonths} mån`
      : `${years} år`;
  }
};

const JourneyTimeline: React.FC<JourneyTimelineProps> = ({
  profile,
  showDetails = true
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const { levelHistory, currentLevel, childId } = profile;

  // Sort history by date (newest first for display, but we'll reverse for timeline)
  const sortedHistory = [...levelHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get visible history items
  const visibleHistory = showAllHistory ? sortedHistory : sortedHistory.slice(-5);

  // Helper: Get direction icon
  const getDirectionIcon = (fromLevel: JourneyLevel | null, toLevel: JourneyLevel) => {
    if (!fromLevel) {
      return <ArrowRight className="w-4 h-4 text-blue-500" />;
    }

    const levels = ['universell', 'stodprofil', 'samordning'];
    const fromIndex = levels.indexOf(fromLevel);
    const toIndex = levels.indexOf(toLevel);

    if (toIndex > fromIndex) {
      return <ArrowUp className="w-4 h-4 text-red-500" aria-label="Eskalering" />;
    } else if (toIndex < fromIndex) {
      return <ArrowDown className="w-4 h-4 text-green-500" aria-label="Nedtrappning" />;
    }
    return <ArrowRight className="w-4 h-4 text-blue-500" />;
  };

  // Helper: Get change type label
  const getChangeTypeLabel = (fromLevel: JourneyLevel | null, toLevel: JourneyLevel) => {
    if (!fromLevel) return 'Start';

    const levels = ['universell', 'stodprofil', 'samordning'];
    const fromIndex = levels.indexOf(fromLevel);
    const toIndex = levels.indexOf(toLevel);

    if (toIndex > fromIndex) return 'Eskalering';
    if (toIndex < fromIndex) return 'Nedtrappning';
    return 'Justering';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Barnets resa - Tidslinje
        </h3>
        <div className="bg-blue-50 border border-blue-200 rounded p-3 flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p>
              Visar hur stödnivån har förändrats över tid baserat på barnets behov och
              automatiska eskaleringstriggrar.
            </p>
          </div>
        </div>
      </div>

      {/* Current Level Summary */}
      <div className={`rounded-lg p-4 border-2 ${LEVEL_CONFIG[currentLevel].borderColor} ${LEVEL_CONFIG[currentLevel].bgColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {LEVEL_CONFIG[currentLevel].icon}
            <div>
              <p className={`font-semibold ${LEVEL_CONFIG[currentLevel].color}`}>
                Nuvarande nivå: {LEVEL_CONFIG[currentLevel].name}
              </p>
              <p className="text-sm text-gray-600">
                {LEVEL_CONFIG[currentLevel].description}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Sedan</p>
            <p className="font-medium text-gray-700">
              {sortedHistory[sortedHistory.length - 1]?.date || 'Okänt'}
            </p>
          </div>
        </div>
      </div>

      {/* Journey Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{levelHistory.length}</p>
          <p className="text-sm text-gray-600">Nivåförändringar</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {sortedHistory[0] ? calculateDuration(sortedHistory[0].date) : '-'}
          </p>
          <p className="text-sm text-gray-600">Total tid i systemet</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-1">Nästa uppföljning</p>
          <p className="font-bold text-blue-600">{profile.nextFollowUp || 'Ej planerad'}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300" />

        {/* Timeline items */}
        <div className="space-y-6">
          {visibleHistory.map((change, index) => {
            const isExpanded = expandedIndex === index;
            const levelConfig = LEVEL_CONFIG[change.toLevel];
            const isLatest = index === visibleHistory.length - 1;

            // Calculate duration at this level
            const nextChange = visibleHistory[index + 1];
            const duration = nextChange
              ? calculateDuration(change.date, nextChange.date)
              : calculateDuration(change.date);

            return (
              <div key={index} className="relative pl-16">
                {/* Timeline node */}
                <div
                  className={`absolute left-4 w-5 h-5 rounded-full border-2 ${
                    isLatest
                      ? `${levelConfig.bgColor} ${levelConfig.borderColor}`
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {isLatest && (
                    <div className="absolute inset-1 rounded-full bg-current animate-pulse"
                      style={{ backgroundColor: levelConfig.color.includes('green') ? '#16a34a' :
                               levelConfig.color.includes('orange') ? '#ea580c' :
                               levelConfig.color.includes('red') ? '#dc2626' : '#6b7280' }} />
                  )}
                </div>

                {/* Event card */}
                <div
                  className={`border rounded-lg overflow-hidden transition-shadow hover:shadow-md ${
                    isLatest ? levelConfig.borderColor : 'border-gray-200'
                  }`}
                >
                  {/* Header */}
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    className={`w-full px-4 py-3 flex items-center justify-between text-left ${
                      isLatest ? levelConfig.bgColor : 'bg-gray-50'
                    } hover:bg-opacity-75 transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">
                        {new Date(change.date).toLocaleDateString('sv-SE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${levelConfig.bgColor} ${levelConfig.color}`}>
                        {getDirectionIcon(change.fromLevel, change.toLevel)}
                        {getChangeTypeLabel(change.fromLevel, change.toLevel)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{duration}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Level change indicator */}
                  <div className="px-4 py-2 border-t border-gray-100 bg-white">
                    <div className="flex items-center gap-2">
                      {change.fromLevel && (
                        <>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${LEVEL_CONFIG[change.fromLevel].bgColor} ${LEVEL_CONFIG[change.fromLevel].color}`}>
                            {LEVEL_CONFIG[change.fromLevel].name}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${levelConfig.bgColor} ${levelConfig.color}`}>
                        {levelConfig.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{change.reason}</p>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && showDetails && (
                    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 space-y-3">
                      {/* Decision maker */}
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">Beslutad av</p>
                          <p className="text-sm text-gray-700">{change.decidedBy}</p>
                        </div>
                      </div>

                      {/* Trigger info */}
                      {change.triggeredBy && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-xs font-medium text-yellow-800 mb-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Automatisk trigger
                          </p>
                          <p className="text-sm text-yellow-900">{change.triggeredBy.situation}</p>
                          {change.triggeredBy.affectedSpokes && change.triggeredBy.affectedSpokes.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {change.triggeredBy.affectedSpokes.map((spoke, i) => (
                                <span key={i} className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs">
                                  {spoke}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Notes */}
                      {change.notes && (
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-gray-500">Anteckningar</p>
                            <p className="text-sm text-gray-700">{change.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Show more button */}
      {levelHistory.length > 5 && (
        <div className="text-center">
          <button
            onClick={() => setShowAllHistory(!showAllHistory)}
            className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {showAllHistory ? 'Visa färre' : `Visa alla ${levelHistory.length} händelser`}
          </button>
        </div>
      )}

      {/* Level Legend */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Nivåförklaring</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(['universell', 'stodprofil', 'samordning'] as JourneyLevel[]).map((level) => (
            <div
              key={level}
              className={`flex items-start gap-2 p-3 rounded-lg border ${LEVEL_CONFIG[level].borderColor} ${LEVEL_CONFIG[level].bgColor}`}
            >
              {LEVEL_CONFIG[level].icon}
              <div>
                <p className={`text-sm font-medium ${LEVEL_CONFIG[level].color}`}>
                  {LEVEL_CONFIG[level].name}
                </p>
                <p className="text-xs text-gray-600">{LEVEL_CONFIG[level].description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JourneyTimeline;
