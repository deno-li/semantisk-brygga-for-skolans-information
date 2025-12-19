import React, { useState } from 'react';
import {
  Shield, Heart, TrendingUp, BookOpen, Home, Users, Bike, MessageSquare,
  ChevronRight, Info, AlertTriangle, CheckCircle2
} from 'lucide-react';
import {
  WelfareWheelSpokeData,
  Perspective,
  JourneyLevel
} from '../types/types';
import {
  WELFARE_WHEEL_SPOKES,
  getStatusColor,
  getSpokeColor,
  getLevelName,
  LEVEL_COLORS
} from '../data/journeyConstants';

interface OptimalWelfareWheelProps {
  currentPerspective: Perspective;
  currentLevel: JourneyLevel;
  spokeData: WelfareWheelSpokeData[];
  onSpokeClick?: (spoke: WelfareWheelSpokeData) => void;
}

const SPOKE_ICONS = {
  trygg: Shield,
  halsa: Heart,
  utvecklas: TrendingUp,
  larande: BookOpen,
  hemmet: Home,
  relationer: Users,
  aktiv: Bike,
  delaktig: MessageSquare
};

const OptimalWelfareWheel: React.FC<OptimalWelfareWheelProps> = ({
  currentPerspective,
  currentLevel,
  spokeData,
  onSpokeClick
}) => {
  const [selectedSpoke, setSelectedSpoke] = useState<WelfareWheelSpokeData | null>(null);
  const [showSemanticDetails, setShowSemanticDetails] = useState(false);

  const getIndicatorText = (spoke: WelfareWheelSpokeData): string => {
    switch (currentPerspective) {
      case 'child':
        return spoke.childIndicator;
      case 'guardian':
        return spoke.guardianIndicator;
      case 'professional':
        return spoke.professionalIndicator;
      default:
        return spoke.childIndicator;
    }
  };

  const getStatusLabel = (status: 1 | 2 | 3 | 4 | 5): string => {
    const labels = {
      1: 'Mycket låg/Behöver åtgärd',
      2: 'Låg/Behöver uppmärksamhet',
      3: 'Medel/Följ upp',
      4: 'Bra/Fortsätt så',
      5: 'Mycket bra/Styrka'
    };
    return labels[status];
  };

  const getTrendArrow = (history: WelfareWheelSpokeData['history']): string => {
    if (history.length < 2) return '→';
    const recent = history[history.length - 1].value;
    const previous = history[history.length - 2].value;
    if (recent > previous) return '↗️';
    if (recent < previous) return '↘️';
    return '→';
  };

  const handleSpokeClick = (spoke: WelfareWheelSpokeData) => {
    setSelectedSpoke(spoke);
    if (onSpokeClick) {
      onSpokeClick(spoke);
    }
  };

  // Beräkna översiktsstatistik
  const stats = {
    red: spokeData.filter(s => s.status === 1).length,
    orange: spokeData.filter(s => s.status === 2).length,
    yellow: spokeData.filter(s => s.status === 3).length,
    green: spokeData.filter(s => s.status >= 4).length,
    average: (spokeData.reduce((sum, s) => sum + s.status, 0) / spokeData.length).toFixed(1)
  };

  const needsEscalation = stats.red >= 1 || (stats.red + stats.orange >= 2);

  return (
    <div className="space-y-6">
      {/* Rubrik med nivåindikator */}
      <div className="bg-white p-6 rounded-lg shadow-sm border-2" style={{ borderColor: LEVEL_COLORS[currentLevel].border }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Välbefinnandehjul</h2>
            <p className="text-sm text-gray-600 mt-1">
              Visar från {currentPerspective === 'child' ? 'barnets' : currentPerspective === 'guardian' ? 'vårdnadshavares' : 'professionell'} perspektiv
            </p>
          </div>
          <div className="text-right">
            <div
              className="inline-block px-4 py-2 rounded-lg font-bold text-sm"
              style={{
                backgroundColor: LEVEL_COLORS[currentLevel].bg,
                color: LEVEL_COLORS[currentLevel].text
              }}
            >
              {getLevelName(currentLevel)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Genomsnitt: {stats.average} av 5
            </div>
          </div>
        </div>

        {/* Varning om eskalering behövs */}
        {needsEscalation && currentLevel === 'universell' && (
          <div className="mt-4 bg-orange-50 border-l-4 border-orange-500 p-4">
            <div className="flex items-center">
              <AlertTriangle className="text-orange-500 mr-3" size={20} />
              <div>
                <p className="font-semibold text-orange-900">Eskalering kan behövas</p>
                <p className="text-sm text-orange-700">
                  {stats.red > 0 && `${stats.red} röd eker identifierad. `}
                  {stats.red + stats.orange >= 2 && 'Flera ekrar visar låga värden. '}
                  Överväg att aktivera stödprofil.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Snabb översikt */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          <div className="bg-red-50 p-3 rounded border border-red-200">
            <div className="text-2xl font-bold text-red-700">{stats.red}</div>
            <div className="text-xs text-red-600">Röda ekrar</div>
          </div>
          <div className="bg-orange-50 p-3 rounded border border-orange-200">
            <div className="text-2xl font-bold text-orange-700">{stats.orange}</div>
            <div className="text-xs text-orange-600">Orange ekrar</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-700">{stats.yellow}</div>
            <div className="text-xs text-yellow-600">Gula ekrar</div>
          </div>
          <div className="bg-green-50 p-3 rounded border border-green-200">
            <div className="text-2xl font-bold text-green-700">{stats.green}</div>
            <div className="text-xs text-green-600">Gröna ekrar</div>
          </div>
        </div>
      </div>

      {/* De 8 ekrarna */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {spokeData.map((spoke) => {
          const Icon = SPOKE_ICONS[spoke.spoke];
          const statusColor = getStatusColor(spoke.status);
          const indicatorText = getIndicatorText(spoke);
          const trend = getTrendArrow(spoke.history);

          return (
            <div
              key={spoke.spoke}
              className="bg-white rounded-lg shadow-sm border-2 hover:shadow-md transition-all cursor-pointer"
              style={{ borderColor: getSpokeColor(spoke.spoke) }}
              onClick={() => handleSpokeClick(spoke)}
            >
              <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: getSpokeColor(spoke.spoke) + '20' }}
                  >
                    <Icon size={24} style={{ color: getSpokeColor(spoke.spoke) }} />
                  </div>
                  <div className="text-2xl">{trend}</div>
                </div>

                {/* Namn */}
                <h3 className="font-bold text-lg mb-2" style={{ color: getSpokeColor(spoke.spoke) }}>
                  {spoke.name}
                </h3>

                {/* Indikator */}
                <p className="text-sm text-gray-700 mb-3 min-h-[40px]">
                  {indicatorText}
                </p>

                {/* Status */}
                <div
                  className="rounded-lg p-3 text-center"
                  style={{
                    backgroundColor: statusColor.bg,
                    color: statusColor.text
                  }}
                >
                  <div className="text-3xl font-bold mb-1">{statusColor.icon}</div>
                  <div className="text-xs font-semibold">{getStatusLabel(spoke.status)}</div>
                </div>

                {/* Historik mini */}
                {spoke.history.length > 0 && (
                  <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                    <span>Senaste: {spoke.history[spoke.history.length - 1].date}</span>
                    <ChevronRight size={16} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detaljerad vy av vald eker */}
      {selectedSpoke && (
        <div className="bg-white p-6 rounded-lg shadow-lg border-2" style={{ borderColor: getSpokeColor(selectedSpoke.spoke) }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold" style={{ color: getSpokeColor(selectedSpoke.spoke) }}>
              Detaljer: {selectedSpoke.name}
            </h3>
            <button
              onClick={() => setSelectedSpoke(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vänster kolumn: Indikatorer per perspektiv */}
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                <div className="font-semibold text-blue-900 mb-2">👦 Barnets perspektiv</div>
                <p className="text-sm text-blue-800">{selectedSpoke.childIndicator}</p>
              </div>

              <div className="bg-purple-50 p-4 rounded border border-purple-200">
                <div className="font-semibold text-purple-900 mb-2">👨‍👩‍👧 Vårdnadshavares perspektiv</div>
                <p className="text-sm text-purple-800">{selectedSpoke.guardianIndicator}</p>
              </div>

              <div className="bg-teal-50 p-4 rounded border border-teal-200">
                <div className="font-semibold text-teal-900 mb-2">👩‍🏫 Professionellt perspektiv</div>
                <p className="text-sm text-teal-800">{selectedSpoke.professionalIndicator}</p>
              </div>

              {/* Anteckningar */}
              {selectedSpoke.notes && (
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <div className="font-semibold text-gray-900 mb-2">📝 Anteckningar</div>
                  <p className="text-sm text-gray-700">{selectedSpoke.notes}</p>
                </div>
              )}
            </div>

            {/* Höger kolumn: Semantisk mappning & Källor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">Semantisk brygga</h4>
                <button
                  onClick={() => setShowSemanticDetails(!showSemanticDetails)}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Info size={14} />
                  {showSemanticDetails ? 'Dölj' : 'Visa'} detaljer
                </button>
              </div>

              {showSemanticDetails && (
                <>
                  <div className="bg-indigo-50 p-3 rounded border border-indigo-200">
                    <div className="font-semibold text-indigo-900 text-sm mb-2">ICF-domäner</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedSpoke.icfDomains.map((icf, idx) => (
                        <span key={idx} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-mono">
                          {icf}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 rounded border border-green-200">
                    <div className="font-semibold text-green-900 text-sm mb-2">KSI (Insatser)</div>
                    <div className="space-y-1">
                      {selectedSpoke.ksiTargets.map((ksi, idx) => (
                        <div key={idx} className="text-xs text-green-800">• {ksi}</div>
                      ))}
                    </div>
                  </div>

                  {selectedSpoke.snomedCT && (
                    <div className="bg-pink-50 p-3 rounded border border-pink-200">
                      <div className="font-semibold text-pink-900 text-sm mb-2">SNOMED CT</div>
                      <p className="text-xs text-pink-800">{selectedSpoke.snomedCT}</p>
                    </div>
                  )}

                  <div className="bg-amber-50 p-3 rounded border border-amber-200">
                    <div className="font-semibold text-amber-900 text-sm mb-2">SS 12000 (Skolans data)</div>
                    <div className="space-y-1">
                      {selectedSpoke.ss12000Source.map((source, idx) => (
                        <div key={idx} className="text-xs text-amber-800">• {source}</div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Historisk trend */}
              {selectedSpoke.history.length > 0 && (
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <div className="font-semibold text-gray-900 mb-3">📊 Historisk trend</div>
                  <div className="space-y-2">
                    {selectedSpoke.history.slice(-5).reverse().map((point, idx) => {
                      const pointColor = getStatusColor(point.value);
                      return (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{point.date}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 capitalize">{point.measurement}</span>
                            <span
                              className="px-3 py-1 rounded font-semibold text-xs"
                              style={{
                                backgroundColor: pointColor.bg,
                                color: pointColor.text
                              }}
                            >
                              {pointColor.icon} {point.value}/5
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimalWelfareWheel;
