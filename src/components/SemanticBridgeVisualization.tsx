
import React, { useState, memo } from 'react';
import { ArrowRight, Info, X } from 'lucide-react';
import { ShanarriIndicator } from '../types/types';

interface SemanticBridgeVisualizationProps {
  shanarriData: ShanarriIndicator[];
  selectedProfileId?: string;
}

interface MappingInfo {
  from: string;
  to: string;
  fromSystem: string;
  toSystem: string;
  description: string;
  example: string;
}

// Example mappings between systems
const SYSTEM_MAPPINGS: Record<string, MappingInfo[]> = {
  'shanarri-icf': [
    { from: 'SHANARRI', to: 'ICF', fromSystem: 'Välbefinnandehjul', toSystem: 'Internationell klassifikation av funktionstillstånd', description: 'SHANARRI-indikatorer mappas till ICF:s struktur av kroppsfunktioner (b), aktivitet/delaktighet (d) och omgivningsfaktorer (e).', example: 'TRYGG → b152 (Emotionella funktioner), d240 (Hantera stress)' },
  ],
  'icf-bbic': [
    { from: 'ICF', to: 'BBIC', fromSystem: 'Internationell klassifikation', toSystem: 'Barns Behov i Centrum', description: 'ICF-koder översätts till BBIC:s triangelmodell som fokuserar på barnets behov, föräldraförmåga och familj/miljö.', example: 'd1 (Lärande) → Utbildning, b152 → Känslor och beteende' },
  ],
  'bbic-ibic': [
    { from: 'BBIC', to: 'IBIC', fromSystem: 'Barns Behov i Centrum', toSystem: 'Individens Behov i Centrum', description: 'BBIC:s områden kopplas till IBIC:s livsområden som bygger på ICF för vuxna och äldre.', example: 'Hälsa → Personlig vård (d5), Utbildning → Lärande (d1)' },
  ],
  'ibic-snomed': [
    { from: 'IBIC', to: 'SNOMED CT', fromSystem: 'Individens Behov i Centrum', toSystem: 'Klinisk terminologi', description: 'IBIC:s livsområden mappas till SNOMED CT:s kliniska begrepp för hälso- och sjukvård.', example: 'Personlig vård → 384758001 (Self-care), Lärande → 224497003' },
  ],
  'snomed-ksi': [
    { from: 'SNOMED CT', to: 'KSI', fromSystem: 'Klinisk terminologi', toSystem: 'Klassifikation av Socialtjänstens Insatser', description: 'SNOMED CT-begrepp kopplas till KSI för att beskriva konkreta insatser.', example: '371609003 (Trygghetskänsla) → Target: psykosocial miljö, Action: stödsamtal' },
  ],
};

const SYSTEM_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'SHANARRI': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  'ICF': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
  'BBIC': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  'IBIC': { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
  'SNOMED CT': { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300' },
  'KSI': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
};

const SemanticBridgeVisualization: React.FC<SemanticBridgeVisualizationProps> = ({
  shanarriData
}) => {
  const [selectedMapping, setSelectedMapping] = useState<string | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<ShanarriIndicator | null>(null);

  const systems = ['SHANARRI', 'ICF', 'BBIC', 'IBIC', 'SNOMED CT', 'KSI'];

  const getSystemValue = (indicator: ShanarriIndicator, system: string): string => {
    switch (system) {
      case 'SHANARRI': return indicator.name;
      case 'ICF': return indicator.icf;
      case 'BBIC': return indicator.bbic;
      case 'IBIC': return indicator.ibic;
      case 'SNOMED CT': return indicator.snomed || '-';
      case 'KSI': return indicator.ksi;
      default: return '-';
    }
  };

  const getMappingKey = (index: number): string => {
    const keys = ['shanarri-icf', 'icf-bbic', 'bbic-ibic', 'ibic-snomed', 'snomed-ksi'];
    return keys[index] || '';
  };

  const handleArrowClick = (mappingKey: string) => {
    setSelectedMapping(selectedMapping === mappingKey ? null : mappingKey);
  };

  const handleIndicatorClick = (indicator: ShanarriIndicator) => {
    setSelectedIndicator(selectedIndicator?.id === indicator.id ? null : indicator);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Info className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Interaktiv semantisk brygga</h3>
          <p className="text-sm text-gray-500">Klicka på pilarna för att se hur data mappas mellan system</p>
        </div>
      </div>

      {/* Interactive Bridge Diagram */}
      <div className="overflow-x-auto">
        <div className="flex items-center justify-between min-w-[800px] gap-2 py-4">
          {systems.map((system, index) => (
            <React.Fragment key={system}>
              {/* System Node */}
              <div
                className={`flex-1 min-w-[100px] max-w-[150px] p-3 rounded-xl border-2 ${SYSTEM_COLORS[system].bg} ${SYSTEM_COLORS[system].border} cursor-pointer hover:shadow-md transition-all`}
              >
                <div className={`text-xs font-bold ${SYSTEM_COLORS[system].text} uppercase tracking-wide mb-1`}>
                  {system}
                </div>
                <div className="text-[10px] text-gray-600 leading-tight">
                  {system === 'SHANARRI' && 'Välbefinnande'}
                  {system === 'ICF' && 'Funktion'}
                  {system === 'BBIC' && 'Barnets behov'}
                  {system === 'IBIC' && 'Individ'}
                  {system === 'SNOMED CT' && 'Klinisk'}
                  {system === 'KSI' && 'Insatser'}
                </div>
              </div>

              {/* Arrow between systems */}
              {index < systems.length - 1 && (
                <button
                  onClick={() => handleArrowClick(getMappingKey(index))}
                  className={`p-2 rounded-full transition-all ${
                    selectedMapping === getMappingKey(index)
                      ? 'bg-blue-500 text-white shadow-lg scale-110'
                      : 'bg-gray-100 text-gray-400 hover:bg-blue-100 hover:text-blue-500'
                  }`}
                  title="Klicka för att se mappning"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mapping Info Panel */}
      {selectedMapping && SYSTEM_MAPPINGS[selectedMapping] && (
        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200 animate-fade-in">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">
                {SYSTEM_MAPPINGS[selectedMapping][0].from} → {SYSTEM_MAPPINGS[selectedMapping][0].to}
              </h4>
              <p className="text-sm text-blue-700 mb-2">
                {SYSTEM_MAPPINGS[selectedMapping][0].description}
              </p>
              <div className="text-xs text-blue-600 bg-blue-100 px-3 py-1.5 rounded-lg inline-block">
                <strong>Exempel:</strong> {SYSTEM_MAPPINGS[selectedMapping][0].example}
              </div>
            </div>
            <button
              onClick={() => setSelectedMapping(null)}
              className="text-blue-400 hover:text-blue-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Indicator Flow Example */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Välj en SHANARRI-indikator för att se hela dataflödet:
        </h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {shanarriData.slice(0, 4).map((indicator) => (
            <button
              key={indicator.id}
              onClick={() => handleIndicatorClick(indicator)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedIndicator?.id === indicator.id
                  ? 'text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: selectedIndicator?.id === indicator.id ? indicator.color : undefined
              }}
            >
              {indicator.name}
            </button>
          ))}
        </div>

        {/* Selected Indicator Flow */}
        {selectedIndicator && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-1 mb-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedIndicator.color }}
              />
              <span className="font-semibold text-gray-900">{selectedIndicator.name}</span>
              <span className="text-gray-500 text-sm">- Dataflöde genom klassifikationssystem</span>
            </div>

            <div className="overflow-x-auto">
              <div className="flex items-stretch gap-2 min-w-[700px]">
                {systems.map((system, index) => (
                  <React.Fragment key={system}>
                    <div
                      className={`flex-1 p-2 rounded-lg border ${SYSTEM_COLORS[system].border} ${SYSTEM_COLORS[system].bg}`}
                    >
                      <div className={`text-[10px] font-bold ${SYSTEM_COLORS[system].text} uppercase mb-1`}>
                        {system}
                      </div>
                      <div className="text-xs text-gray-700 break-words leading-relaxed">
                        {getSystemValue(selectedIndicator, system)}
                      </div>
                    </div>
                    {index < systems.length - 1 && (
                      <div className="flex items-center text-gray-300">
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(SemanticBridgeVisualization);
