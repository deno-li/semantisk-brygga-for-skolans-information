
import React, { useState, memo, useMemo } from 'react';
import { Clock, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { JOURNEY_PROFILES } from '../data/journeyMockData';
import { CHILD_PROFILES } from '../data/childProfiles';
import { WelfareWheelSpokeData } from '../types/types';

interface ShanarriTimelineProps {
  selectedProfileId?: string;
}

interface HistoryPoint {
  date: string;
  value: number;
  source: string;
  measurement: string;
}

const SPOKE_COLORS: Record<string, string> = {
  trygg: '#005595',
  halsa: '#378056',
  utvecklas: '#C12143',
  omvardad: '#B00020',
  aktiv: '#E87C00',
  respekterad: '#6D8F13',
  ansvarstagande: '#00838F',
  delaktig: '#6A2A5B'
};

const SPOKE_NAMES: Record<string, string> = {
  trygg: 'TRYGG',
  halsa: 'MÅ BRA',
  utvecklas: 'UTVECKLAS',
  omvardad: 'OMVÅRDAD',
  aktiv: 'AKTIV',
  respekterad: 'RESPEKTERAD',
  ansvarstagande: 'ANSVARSTAGANDE',
  delaktig: 'DELAKTIG'
};

const ShanarriTimeline: React.FC<ShanarriTimelineProps> = ({ selectedProfileId = 'erik' }) => {
  const [expandedSpoke, setExpandedSpoke] = useState<string | null>(null);

  const journeyProfile = JOURNEY_PROFILES[selectedProfileId];
  const childProfile = CHILD_PROFILES[selectedProfileId];

  // Extract timeline data from journey profile
  const timelineData = useMemo(() => {
    if (!journeyProfile?.welfareWheel) return [];

    return journeyProfile.welfareWheel
      .filter((spoke: WelfareWheelSpokeData) => spoke.history && spoke.history.length > 0)
      .map((spoke: WelfareWheelSpokeData) => ({
        spoke: spoke.spoke,
        name: spoke.name,
        currentStatus: spoke.status,
        history: spoke.history || [],
        notes: spoke.notes
      }))
      .sort((a, b) => {
        // Sort by most recent change first
        const aLatest = a.history[a.history.length - 1]?.date || '';
        const bLatest = b.history[b.history.length - 1]?.date || '';
        return bLatest.localeCompare(aLatest);
      });
  }, [journeyProfile]);

  // Calculate trend for a spoke
  const getTrend = (history: HistoryPoint[]): 'up' | 'down' | 'stable' => {
    if (history.length < 2) return 'stable';
    const latest = history[history.length - 1].value;
    const previous = history[history.length - 2].value;
    if (latest > previous) return 'up';
    if (latest < previous) return 'down';
    return 'stable';
  };

  // Get status color based on value
  const getStatusColor = (value: number): string => {
    if (value >= 4) return 'bg-green-500';
    if (value >= 3) return 'bg-yellow-500';
    if (value >= 2) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Format date
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sv-SE', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Get source display name
  const getSourceName = (source: string): string => {
    const sourceMap: Record<string, string> = {
      'elementary-school': 'Grundskola',
      'student-health': 'Elevhälsa',
      'social-services': 'Socialtjänst',
      'bup': 'BUP',
      'high-school': 'Gymnasium'
    };
    return sourceMap[source] || source;
  };

  if (!journeyProfile) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="text-center text-gray-500">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Ingen tidslinje tillgänglig för denna profil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">SHANARRI-tidslinje</h3>
          <p className="text-sm text-gray-500">
            Historik för {childProfile?.name || 'vald profil'} •
            Senaste bedömning: {journeyProfile.lastAssessment}
          </p>
        </div>
      </div>

      {timelineData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Ingen historik tillgänglig</p>
          <p className="text-sm mt-1">Historiska mätningar visas här när de registreras</p>
        </div>
      ) : (
        <div className="space-y-3">
          {timelineData.map(({ spoke, name, currentStatus, history, notes }) => {
            const trend = getTrend(history);
            const isExpanded = expandedSpoke === spoke;

            return (
              <div
                key={spoke}
                className="border border-gray-200 rounded-xl overflow-hidden transition-all"
              >
                {/* Spoke Header */}
                <button
                  onClick={() => setExpandedSpoke(isExpanded ? null : spoke)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: SPOKE_COLORS[spoke] }}
                    />
                    <span className="font-medium text-gray-900">{name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(currentStatus)} text-white`}>
                      {currentStatus}/5
                    </span>
                    {trend === 'up' && (
                      <span className="text-green-600 flex items-center gap-1 text-xs">
                        <TrendingUp className="w-3 h-3" /> Uppåt
                      </span>
                    )}
                    {trend === 'down' && (
                      <span className="text-red-600 flex items-center gap-1 text-xs">
                        <TrendingDown className="w-3 h-3" /> Nedåt
                      </span>
                    )}
                    {trend === 'stable' && history.length >= 2 && (
                      <span className="text-gray-500 flex items-center gap-1 text-xs">
                        <Minus className="w-3 h-3" /> Stabil
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{history.length} mätningar</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Timeline */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                    {notes && (
                      <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-800">
                        <strong>Anteckning:</strong> {notes}
                      </div>
                    )}

                    <div className="mt-4 relative">
                      {/* Timeline line */}
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

                      {/* Timeline points */}
                      <div className="space-y-4">
                        {[...history].reverse().map((point, index) => (
                          <div key={index} className="flex items-start gap-4 relative">
                            {/* Timeline dot */}
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${getStatusColor(point.value)} text-white text-xs font-bold`}
                            >
                              {point.value}
                            </div>

                            {/* Content */}
                            <div className="flex-1 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900">
                                  {formatDate(point.date)}
                                </span>
                                <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded-full">
                                  {getSourceName(point.source)}
                                </span>
                              </div>
                              <div className="text-xs text-gray-600">
                                Mätmetod: {point.measurement === 'survey' ? 'Enkät' :
                                           point.measurement === 'assessment' ? 'Bedömning' :
                                           point.measurement === 'observation' ? 'Observation' : point.measurement}
                              </div>

                              {/* Change indicator */}
                              {index < history.length - 1 && (
                                <div className="mt-2 text-xs">
                                  {point.value > [...history].reverse()[index + 1]?.value ? (
                                    <span className="text-green-600 flex items-center gap-1">
                                      <TrendingUp className="w-3 h-3" />
                                      +{point.value - [...history].reverse()[index + 1].value} från föregående
                                    </span>
                                  ) : point.value < [...history].reverse()[index + 1]?.value ? (
                                    <span className="text-red-600 flex items-center gap-1">
                                      <TrendingDown className="w-3 h-3" />
                                      {point.value - [...history].reverse()[index + 1].value} från föregående
                                    </span>
                                  ) : (
                                    <span className="text-gray-500">Oförändrat</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Summary footer */}
      {timelineData.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Nästa uppföljning: <strong className="text-gray-700">{journeyProfile.nextFollowUp}</strong>
            </span>
            <span className="text-gray-500">
              Aktuell nivå: <strong className="text-gray-700 capitalize">
                {journeyProfile.currentLevel === 'universell' ? 'Universell' :
                 journeyProfile.currentLevel === 'stodprofil' ? 'Stödprofil' : 'Samordning'}
              </strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ShanarriTimeline);
