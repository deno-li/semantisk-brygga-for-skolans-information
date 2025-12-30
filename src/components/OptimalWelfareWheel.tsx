import React, { useState } from 'react';
import {
  Shield, Heart, TrendingUp, BookOpen, Home, Users, Bike, MessageSquare,
  ChevronRight, Info, AlertTriangle, CheckCircle2, UserCheck, CircleUserRound,
  X, TrendingDown, Minus, Sparkles, BarChart3
} from 'lucide-react';
import {
  WelfareWheelSpokeData,
  Perspective,
  JourneyLevel
} from '../types/types';
import {
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
  omvardad: Home,
  aktiv: Bike,
  respekterad: UserCheck,
  ansvarstagande: CircleUserRound,
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
      1: 'Behöver åtgärd',
      2: 'Behöver uppmärksamhet',
      3: 'Följ upp',
      4: 'Bra',
      5: 'Styrka'
    };
    return labels[status];
  };

  const getTrendIcon = (history: WelfareWheelSpokeData['history']) => {
    if (history.length < 2) return <Minus size={16} className="text-gray-400" />;
    const recent = history[history.length - 1].value;
    const previous = history[history.length - 2].value;
    if (recent > previous) return <TrendingUp size={16} className="text-emerald-500" />;
    if (recent < previous) return <TrendingDown size={16} className="text-red-500" />;
    return <Minus size={16} className="text-gray-400" />;
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

  // Mini sparkline component
  const MiniSparkline = ({ history }: { history: WelfareWheelSpokeData['history'] }) => {
    if (history.length < 2) return null;
    const last5 = history.slice(-5);
    const max = 5;
    const width = 60;
    const height = 20;
    const points = last5.map((p, i) => ({
      x: (i / (last5.length - 1)) * width,
      y: height - (p.value / max) * height
    }));
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
      <svg width={width} height={height} className="opacity-60">
        <path d={pathD} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Compact Status Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Level Badge */}
            <div className="flex items-center gap-3">
              <div
                className="px-4 py-2 rounded-xl font-bold text-sm shadow-sm"
                style={{
                  backgroundColor: LEVEL_COLORS[currentLevel].bg,
                  color: LEVEL_COLORS[currentLevel].text,
                  borderColor: LEVEL_COLORS[currentLevel].border
                }}
              >
                {getLevelName(currentLevel)}
              </div>
              <div className="text-sm text-gray-500">
                Genomsnitt: <span className="font-semibold text-gray-900">{stats.average}</span>/5
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-2">
              {[
                { count: stats.green, color: 'bg-emerald-500', label: 'Gröna' },
                { count: stats.yellow, color: 'bg-amber-400', label: 'Gula' },
                { count: stats.orange, color: 'bg-orange-500', label: 'Orange' },
                { count: stats.red, color: 'bg-red-500', label: 'Röda' },
              ].map((stat, i) => (
                stat.count > 0 && (
                  <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full">
                    <span className={`w-2 h-2 rounded-full ${stat.color}`} />
                    <span className="text-xs font-medium text-gray-700">{stat.count}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Escalation Warning */}
        {needsEscalation && currentLevel === 'universell' && (
          <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 flex items-center gap-3">
            <div className="p-1.5 bg-orange-100 rounded-lg">
              <AlertTriangle className="text-orange-600" size={18} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-orange-900 text-sm">Överväg eskalering</p>
              <p className="text-xs text-orange-700">
                {stats.red > 0 && `${stats.red} kritisk eker. `}
                {stats.red + stats.orange >= 2 && 'Flera områden behöver uppmärksamhet.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Spoke Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {spokeData.map((spoke) => {
          const Icon = SPOKE_ICONS[spoke.spoke];
          const statusColor = getStatusColor(spoke.status);
          const spokeColor = getSpokeColor(spoke.spoke);
          const indicatorText = getIndicatorText(spoke);
          const isSelected = selectedSpoke?.spoke === spoke.spoke;

          return (
            <button
              key={spoke.spoke}
              onClick={() => handleSpokeClick(spoke)}
              className={`
                group relative bg-white rounded-2xl border-2 p-4 text-left
                transition-all duration-300 ease-out
                hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1
                focus:outline-none focus:ring-2 focus:ring-offset-2
                ${isSelected ? 'ring-2 ring-offset-2 shadow-lg scale-[1.02]' : ''}
              `}
              style={{
                borderColor: isSelected ? spokeColor : '#e5e7eb',
                '--ring-color': spokeColor
              } as React.CSSProperties}
            >
              {/* Status indicator bar */}
              <div
                className="absolute top-0 left-4 right-4 h-1 rounded-b-full transition-all duration-300"
                style={{ backgroundColor: statusColor.bg }}
              />

              {/* Header */}
              <div className="flex items-start justify-between mt-2 mb-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: spokeColor + '15' }}
                >
                  <Icon size={22} style={{ color: spokeColor }} />
                </div>
                <div className="flex items-center gap-1.5">
                  {getTrendIcon(spoke.history)}
                  <MiniSparkline history={spoke.history} />
                </div>
              </div>

              {/* Name */}
              <h3
                className="font-bold text-base mb-1.5 transition-colors"
                style={{ color: spokeColor }}
              >
                {spoke.name}
              </h3>

              {/* Indicator text */}
              <p className="text-xs text-gray-600 line-clamp-2 mb-3 min-h-[32px]">
                {indicatorText}
              </p>

              {/* Status Badge */}
              <div
                className="flex items-center justify-between rounded-xl px-3 py-2"
                style={{ backgroundColor: statusColor.bg }}
              >
                <span className="text-lg">{statusColor.icon}</span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: statusColor.text }}
                >
                  {getStatusLabel(spoke.status)}
                </span>
              </div>

              {/* Hover arrow */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Panel (Slide-in) */}
      {selectedSpoke && (
        <div
          className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
          style={{ borderTopColor: getSpokeColor(selectedSpoke.spoke), borderTopWidth: '3px' }}
        >
          {/* Panel Header */}
          <div className="p-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: getSpokeColor(selectedSpoke.spoke) + '15' }}
                >
                  {React.createElement(SPOKE_ICONS[selectedSpoke.spoke], {
                    size: 24,
                    style: { color: getSpokeColor(selectedSpoke.spoke) }
                  })}
                </div>
                <div>
                  <h3
                    className="text-xl font-bold"
                    style={{ color: getSpokeColor(selectedSpoke.spoke) }}
                  >
                    {selectedSpoke.name}
                  </h3>
                  <p className="text-sm text-gray-500">Detaljerad vy</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSpoke(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Perspectives */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Perspektiv
                </h4>

                {[
                  { key: 'child', emoji: '👦', label: 'Barnets perspektiv', text: selectedSpoke.childIndicator, color: 'blue' },
                  { key: 'guardian', emoji: '👨‍👩‍👧', label: 'Vårdnadshavares perspektiv', text: selectedSpoke.guardianIndicator, color: 'purple' },
                  { key: 'professional', emoji: '👩‍🏫', label: 'Professionellt perspektiv', text: selectedSpoke.professionalIndicator, color: 'teal' },
                ].map((perspective) => (
                  <div
                    key={perspective.key}
                    className={`p-4 rounded-xl border transition-all ${
                      currentPerspective === perspective.key
                        ? `bg-${perspective.color}-50 border-${perspective.color}-200 ring-2 ring-${perspective.color}-100`
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold text-gray-900 mb-1.5">
                      <span>{perspective.emoji}</span>
                      <span className="text-sm">{perspective.label}</span>
                      {currentPerspective === perspective.key && (
                        <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          Aktiv
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{perspective.text}</p>
                  </div>
                ))}

                {selectedSpoke.notes && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="font-semibold text-amber-900 text-sm mb-1.5">📝 Anteckningar</div>
                    <p className="text-sm text-amber-800">{selectedSpoke.notes}</p>
                  </div>
                )}
              </div>

              {/* Right: Semantic Bridge & History */}
              <div className="space-y-4">
                {/* Toggle Semantic Details */}
                <button
                  onClick={() => setShowSemanticDetails(!showSemanticDetails)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-indigo-600" />
                    <span className="font-semibold text-indigo-900">Semantisk brygga</span>
                  </div>
                  <ChevronRight
                    size={18}
                    className={`text-indigo-600 transition-transform ${showSemanticDetails ? 'rotate-90' : ''}`}
                  />
                </button>

                {showSemanticDetails && (
                  <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                    <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                      <div className="font-semibold text-indigo-900 text-xs mb-2">ICF-domäner</div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedSpoke.icfDomains.map((icf, idx) => (
                          <span key={idx} className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-mono">
                            {icf}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                      <div className="font-semibold text-emerald-900 text-xs mb-2">KSI (Insatser)</div>
                      <div className="space-y-1">
                        {selectedSpoke.ksiTargets.map((ksi, idx) => (
                          <div key={idx} className="text-xs text-emerald-800">• {ksi}</div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                      <div className="font-semibold text-amber-900 text-xs mb-2">SS 12000</div>
                      <div className="space-y-1">
                        {selectedSpoke.ss12000Source.map((source, idx) => (
                          <div key={idx} className="text-xs text-amber-800">• {source}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* History */}
                {selectedSpoke.history.length > 0 && (
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 size={16} className="text-gray-500" />
                      <span className="font-semibold text-gray-900 text-sm">Historik</span>
                    </div>
                    <div className="space-y-2">
                      {selectedSpoke.history.slice(-5).reverse().map((point, idx) => {
                        const pointColor = getStatusColor(point.value);
                        return (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 text-xs">{point.date}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400 capitalize">{point.measurement}</span>
                              <span
                                className="px-2 py-0.5 rounded-full font-semibold text-xs"
                                style={{ backgroundColor: pointColor.bg, color: pointColor.text }}
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
        </div>
      )}
    </div>
  );
};

export default OptimalWelfareWheel;
