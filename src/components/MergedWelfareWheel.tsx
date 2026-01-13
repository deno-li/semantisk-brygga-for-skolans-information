import React, { useEffect, useMemo, useState } from 'react';
import { Layers, PieChart, Sparkles, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { JourneyProfile, Perspective } from '../types/types';
import WelfareWheel from './WelfareWheel';
import OptimalWelfareWheel from './OptimalWelfareWheel';

interface MergedWelfareWheelProps {
  currentPerspective: Perspective;
  selectedProfileId: string;
  journeyProfile?: JourneyProfile | null;
}

type WheelView = 'shanarri' | 'optimal';

const MergedWelfareWheel: React.FC<MergedWelfareWheelProps> = ({
  currentPerspective,
  selectedProfileId,
  journeyProfile
}) => {
  const [activeView, setActiveView] = useState<WheelView>('shanarri');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isChild = currentPerspective === 'child';
  const optimalAvailable = Boolean(journeyProfile);

  const options = useMemo(
    () => [
      {
        id: 'shanarri' as const,
        label: 'SHANARRI',
        fullLabel: 'Pedagogiskt hjul',
        description: 'Välbefinnandehjul med semantisk brygga till nationella standarder.',
        icon: <PieChart size={18} />,
        color: 'from-blue-500 to-indigo-600',
        stats: { label: '8 dimensioner', icon: <Sparkles size={14} /> }
      },
      {
        id: 'optimal' as const,
        label: 'Barnets resa',
        fullLabel: 'Matrismodell',
        description: 'Nivåbaserad uppföljning med historik och indikatorer per eker.',
        icon: <Layers size={18} />,
        color: 'from-emerald-500 to-teal-600',
        stats: { label: 'Nivå & trend', icon: <TrendingUp size={14} /> }
      }
    ],
    []
  );

  useEffect(() => {
    if (isChild && activeView !== 'shanarri') {
      setActiveView('shanarri');
    }
  }, [activeView, isChild]);

  const handleViewChange = (view: WheelView) => {
    if (view === activeView) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveView(view);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  };

  const shouldShowOptimal = !isChild;
  const activeOption = options.find(o => o.id === activeView);

  // Calculate summary stats from journeyProfile if available
  const journeyStats = useMemo(() => {
    if (!journeyProfile?.welfareWheel) return null;
    const spokes = journeyProfile.welfareWheel;
    const avgStatus = spokes.reduce((sum, s) => sum + s.status, 0) / spokes.length;
    const greenCount = spokes.filter(s => s.status >= 4).length;
    const needsAttention = spokes.filter(s => s.status <= 2).length;
    return { avgStatus, greenCount, needsAttention, total: spokes.length };
  }, [journeyProfile]);

  return (
    <div className="space-y-6">
      {/* Header Card with Gradient */}
      <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm">
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-60" />

        <div className="relative p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            {/* Title Section */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${activeOption?.color} text-white shadow-lg`}>
                  {activeOption?.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Välbefinnandehjul</h2>
                  <p className="text-sm text-gray-500 font-medium">
                    {activeOption?.fullLabel}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3 max-w-xl leading-relaxed">
                {activeOption?.description}
              </p>
            </div>

            {/* Segmented Control - Only for non-child */}
            {shouldShowOptimal && (
              <div className="flex flex-col items-end gap-3">
                {/* Toggle Pills */}
                <div className="inline-flex p-1 bg-gray-100 rounded-xl shadow-inner">
                  {options.map((option) => {
                    const isActive = activeView === option.id;
                    const isDisabled = option.id === 'optimal' && !optimalAvailable;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => !isDisabled && handleViewChange(option.id)}
                        disabled={isDisabled}
                        className={`
                          relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold
                          transition-all duration-200 ease-out
                          ${isActive
                            ? 'bg-white text-gray-900 shadow-md'
                            : 'text-gray-500 hover:text-gray-700'
                          }
                          ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                          {option.icon}
                        </span>
                        <span className="hidden sm:inline">{option.label}</span>
                        {isActive && (
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Mini Stats Preview */}
                {journeyStats && activeView === 'shanarri' && (
                  <button
                    onClick={() => handleViewChange('optimal')}
                    className="group flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500 hover:text-emerald-600 transition-colors"
                  >
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                      {journeyStats.greenCount}/{journeyStats.total} gröna
                    </span>
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Info Cards - Only for professionals */}
          {shouldShowOptimal && (
            <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-gray-100">
              {options.map((option) => {
                const isActive = activeView === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleViewChange(option.id)}
                    disabled={option.id === 'optimal' && !optimalAvailable}
                    className={`
                      flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200
                      ${isActive
                        ? 'bg-gradient-to-r ' + option.color + ' text-white shadow-lg scale-[1.02]'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }
                      ${option.id === 'optimal' && !optimalAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
                      {option.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{option.label}</div>
                      <div className={`text-xs flex items-center gap-1 ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                        {option.stats.icon}
                        {option.stats.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Content Area with Animation */}
      <div
        className={`transition-all duration-200 ease-out ${
          isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
        }`}
      >
        {activeView === 'shanarri' && (
          <WelfareWheel
            currentPerspective={currentPerspective}
            selectedProfileId={selectedProfileId}
          />
        )}

        {activeView === 'optimal' && shouldShowOptimal && (
          <div>
            {journeyProfile ? (
              <OptimalWelfareWheel
                currentPerspective={currentPerspective}
                currentLevel={journeyProfile.currentLevel}
                spokeData={journeyProfile.welfareWheel}
                onSpokeClick={() => {}}
              />
            ) : (
              <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Users size={28} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Ingen journeyprofil
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Det finns ingen uppsatt journeyprofil för detta barn.
                  Välj en annan profil för att se Barnets resa-hjulet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MergedWelfareWheel;
