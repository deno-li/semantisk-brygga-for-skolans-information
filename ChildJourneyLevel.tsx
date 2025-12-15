import React, { useState } from 'react';
import {
  ArrowRight, CheckCircle2, Clock, AlertCircle, TrendingUp, TrendingDown,
  Calendar, Users, FileText, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  JourneyLevel,
  JourneyProfile,
  JourneyLevelChange,
  EscalationTrigger
} from './types';
import {
  JOURNEY_LEVELS,
  LEVEL_COLORS,
  getLevelName,
  ESCALATION_RULES
} from './journeyConstants';

interface ChildJourneyLevelProps {
  journeyProfile: JourneyProfile;
  onLevelChange?: (newLevel: JourneyLevel, reason: string) => void;
}

const ChildJourneyLevel: React.FC<ChildJourneyLevelProps> = ({
  journeyProfile,
  onLevelChange
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showLevelDetails, setShowLevelDetails] = useState(false);

  const currentLevelConfig = JOURNEY_LEVELS.find(
    l => l.level === journeyProfile.currentLevel
  )!;

  const nextLevelUp =
    journeyProfile.currentLevel === 'universell'
      ? 'stodprofil'
      : journeyProfile.currentLevel === 'stodprofil'
      ? 'samordning'
      : null;

  const nextLevelDown =
    journeyProfile.currentLevel === 'samordning'
      ? 'stodprofil'
      : journeyProfile.currentLevel === 'stodprofil'
      ? 'universell'
      : null;

  const activeTriggers = journeyProfile.activeTriggers.filter(t => t.status === 'pending' || t.status === 'active');
  const hasPendingEscalation = activeTriggers.length > 0;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysSinceLastChange = () => {
    if (journeyProfile.levelHistory.length === 0) return 0;
    const lastChange = journeyProfile.levelHistory[journeyProfile.levelHistory.length - 1];
    const lastDate = new Date(lastChange.date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysSinceChange = getDaysSinceLastChange();

  return (
    <div className="space-y-6">
      {/* Huvudkort: Nuvarande nivå */}
      <div
        className="bg-white rounded-lg shadow-lg border-4 p-6"
        style={{ borderColor: LEVEL_COLORS[journeyProfile.currentLevel].border }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="px-6 py-3 rounded-lg font-bold text-lg"
                style={{
                  backgroundColor: LEVEL_COLORS[journeyProfile.currentLevel].bg,
                  color: LEVEL_COLORS[journeyProfile.currentLevel].text
                }}
              >
                Nivå: {getLevelName(journeyProfile.currentLevel)}
              </div>
              <div className="text-sm text-gray-500">
                <Clock size={16} className="inline mr-1" />
                {daysSinceChange} dagar på denna nivå
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-2">Målgrupp</div>
                <p className="text-gray-900">{currentLevelConfig.targetGroup}</p>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-2">Syfte</div>
                <p className="text-gray-900">{currentLevelConfig.purpose}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar size={16} />
                <span>Senaste bedömning: {formatDate(journeyProfile.lastAssessment)}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar size={16} />
                <span>Nästa uppföljning: {formatDate(journeyProfile.nextFollowUp)}</span>
              </div>
            </div>

            <button
              onClick={() => setShowLevelDetails(!showLevelDetails)}
              className="mt-4 text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-semibold"
            >
              {showLevelDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {showLevelDetails ? 'Dölj' : 'Visa'} detaljer om nivån
            </button>
          </div>

          {/* Höger kolumn: Status */}
          <div className="text-right">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">Uppföljningsfrekvens</div>
              <div className="font-semibold text-gray-900">{currentLevelConfig.followUpFrequency}</div>
            </div>
          </div>
        </div>

        {/* Utfällbara detaljer */}
        {showLevelDetails && (
          <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">👨‍👩‍👧 Vad syns i familjevyn (1177)</h4>
                <ul className="space-y-1">
                  {currentLevelConfig.familyView.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">👩‍🏫 Vad syns för professionen</h4>
                <ul className="space-y-1">
                  {currentLevelConfig.professionalView.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">🔒 Dataminimering</h4>
                <p className="text-sm text-purple-800">{currentLevelConfig.dataMinimization}</p>
              </div>

              <div className="bg-orange-50 p-4 rounded border border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-2">⚡ Triggers till nästa nivå</h4>
                <ul className="space-y-1">
                  {currentLevelConfig.escalationTriggers.map((trigger, idx) => (
                    <li key={idx} className="text-sm text-orange-800">• {trigger}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Aktiva eskaleringstriggrar */}
      {hasPendingEscalation && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg shadow">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-orange-500 flex-shrink-0" size={24} />
            <div className="flex-1">
              <h3 className="font-bold text-orange-900 text-lg mb-3">
                Eskalering behöver hanteras ({activeTriggers.length})
              </h3>
              <div className="space-y-3">
                {activeTriggers.map((trigger) => (
                  <div key={trigger.id} className="bg-white p-4 rounded border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-gray-900">{trigger.situation}</div>
                      <div
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: LEVEL_COLORS[trigger.toLevel].bg,
                          color: LEVEL_COLORS[trigger.toLevel].text
                        }}
                      >
                        → {getLevelName(trigger.toLevel)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{trigger.action}</p>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Påverkade ekrar: {trigger.affectedSpokes.join(', ')}</span>
                      <span>Triggad: {formatDate(trigger.triggeredDate)}</span>
                    </div>
                    {trigger.notes && (
                      <div className="mt-2 text-sm text-gray-600 italic">
                        Kommentar: {trigger.notes}
                      </div>
                    )}
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => onLevelChange?.(trigger.toLevel, trigger.situation)}
                        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 text-sm font-semibold flex items-center gap-1"
                      >
                        <TrendingUp size={16} />
                        Aktivera {getLevelName(trigger.toLevel)}
                      </button>
                      <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm font-semibold">
                        Markera som hanterad
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nivåöversikt */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-bold text-lg mb-4 text-gray-900">Nivåöversikt</h3>
        <div className="flex items-center justify-between gap-4">
          {(['universell', 'stodprofil', 'samordning'] as JourneyLevel[]).map((level, idx) => {
            const levelConfig = JOURNEY_LEVELS.find(l => l.level === level)!;
            const isCurrent = level === journeyProfile.currentLevel;
            const isCompleted = idx < (['universell', 'stodprofil', 'samordning'] as JourneyLevel[]).indexOf(journeyProfile.currentLevel);

            return (
              <React.Fragment key={level}>
                {idx > 0 && (
                  <ArrowRight className="text-gray-400 flex-shrink-0" size={24} />
                )}
                <div
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    isCurrent ? 'shadow-lg' : 'opacity-60'
                  }`}
                  style={{
                    borderColor: isCurrent ? LEVEL_COLORS[level].border : '#E5E7EB',
                    backgroundColor: isCurrent ? LEVEL_COLORS[level].bg : '#F9FAFB'
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isCompleted && <CheckCircle2 size={20} className="text-green-600" />}
                    {isCurrent && <Clock size={20} style={{ color: LEVEL_COLORS[level].text }} />}
                    <h4
                      className={`font-bold ${isCurrent ? '' : 'text-gray-700'}`}
                      style={isCurrent ? { color: LEVEL_COLORS[level].text } : {}}
                    >
                      {levelConfig.name}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600">{levelConfig.targetGroup}</p>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Nivåhistorik */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-900">Nivåhistorik</h3>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-semibold"
          >
            {showHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showHistory ? 'Dölj' : 'Visa'} historik
          </button>
        </div>

        {showHistory && (
          <div className="space-y-3">
            {journeyProfile.levelHistory.length === 0 ? (
              <p className="text-gray-500 text-sm italic">Ingen nivåhistorik ännu</p>
            ) : (
              journeyProfile.levelHistory
                .slice()
                .reverse()
                .map((change, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded border border-gray-200"
                  >
                    <div className="flex-shrink-0">
                      {change.toLevel > (change.fromLevel || 'universell') ? (
                        <TrendingUp className="text-orange-500" size={20} />
                      ) : (
                        <TrendingDown className="text-green-500" size={20} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {change.fromLevel && (
                          <span
                            className="text-xs px-2 py-1 rounded"
                            style={{
                              backgroundColor: LEVEL_COLORS[change.fromLevel].bg,
                              color: LEVEL_COLORS[change.fromLevel].text
                            }}
                          >
                            {getLevelName(change.fromLevel)}
                          </span>
                        )}
                        <ArrowRight size={16} className="text-gray-400" />
                        <span
                          className="text-xs px-2 py-1 rounded"
                          style={{
                            backgroundColor: LEVEL_COLORS[change.toLevel].bg,
                            color: LEVEL_COLORS[change.toLevel].text
                          }}
                        >
                          {getLevelName(change.toLevel)}
                        </span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {formatDate(change.date)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{change.reason}</p>
                      {change.notes && (
                        <p className="text-xs text-gray-600 mt-1 italic">{change.notes}</p>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        Beslutad av: {change.decidedBy}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildJourneyLevel;
