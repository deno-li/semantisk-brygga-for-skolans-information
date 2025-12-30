import React, { useEffect, useMemo, useState } from 'react';
import { Layers, PieChart } from 'lucide-react';
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
  const isChild = currentPerspective === 'child';
  const optimalAvailable = Boolean(journeyProfile);

  const options = useMemo(
    () => [
      {
        id: 'shanarri' as const,
        label: 'SHANARRI (pedagogiskt hjul)',
        description: 'Pedagogiskt välbefinnandehjul med semantisk brygga.',
        icon: <PieChart size={16} />
      },
      {
        id: 'optimal' as const,
        label: 'Barnets resa (matris)',
        description: 'Nivåmodell med indikatorer och historik per eker.',
        icon: <Layers size={16} />
      }
    ],
    []
  );

  useEffect(() => {
    if (isChild && activeView !== 'shanarri') {
      setActiveView('shanarri');
    }
  }, [activeView, isChild]);

  const shouldShowOptimal = !isChild;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Välbefinnandehjul</h2>
            <p className="text-sm text-gray-600 mt-1 max-w-2xl">
              Samlar både SHANARRI-hjulet och Barnets resa i en gemensam vy för att ge
              en helhetsbild av välbefinnandet.
            </p>
          </div>

          {shouldShowOptimal && (
            <div className="flex flex-col sm:flex-row gap-2">
              {options.map((option) => {
                const isActive = activeView === option.id;
                const isDisabled = option.id === 'optimal' && !optimalAvailable;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setActiveView(option.id)}
                    disabled={isDisabled}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      isActive
                        ? 'bg-[#005595] text-white border-[#005595] shadow'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#005595] hover:text-[#005595]'
                    } ${
                      isDisabled
                        ? 'opacity-50 cursor-not-allowed hover:border-gray-200 hover:text-gray-400'
                        : ''
                    }`}
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {shouldShowOptimal && (
          <div className="mt-4 flex flex-col gap-2 text-xs text-gray-500">
            {options.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 font-semibold text-gray-700">
                  {option.icon}
                  {option.label}
                </span>
                <span>{option.description}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeView === 'shanarri' && (
        <WelfareWheel currentPerspective={currentPerspective} selectedProfileId={selectedProfileId} />
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
            <div className="bg-white border border-dashed border-gray-300 rounded-lg p-6 text-center text-sm text-gray-500">
              Ingen uppsatt journeyprofil hittades för barnet. Välj en annan profil för att se
              Barnets resa-hjulet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MergedWelfareWheel;
