
import React, { memo } from 'react';
import { Database, ArrowRight, Shield, Bot, Lock, Unlock, Eye, Server, Layers, Globe, BarChart3 } from 'lucide-react';
import { SHANARRI_DATA } from '../data/shanarriData';

interface MedallionLayer {
  id: string;
  name: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  details: string[];
}

const MEDALLION_LAYERS: MedallionLayer[] = [
  {
    id: 'source',
    name: 'Källsystem',
    label: 'Operativa system',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    description: 'Skoladministrativa system som levererar data via API:er',
    details: ['Edlevo (Tieto)', 'Skola24 (SS12000 Export API)', 'Unikum', 'Dexter'],
  },
  {
    id: 'bronze',
    name: 'Bronze',
    label: 'Rå data',
    color: 'text-amber-800',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    description: 'Oförändrad API-data lagrad i Delta Lake med fullständig historik',
    details: ['22+ Edlevo-endpoints', '9 Skola24-endpoints', 'Statiska referensdata', 'Ingestion-metadata & watermarks'],
  },
  {
    id: 'silver',
    name: 'Silver',
    label: 'SS12000-konformerad',
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-300',
    description: 'Data konformerad till SS12000:2024 med SCD Type 2 historik',
    details: ['16 SS12000-entiteter', 'SCD Type 2 (person/organisation)', 'Fullständig lineage från Bronze', 'DQ-validering (35 regler)'],
  },
  {
    id: 'gold',
    name: 'Gold',
    label: 'Stjärnschema',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-400',
    description: 'Analysklart stjärnschema optimerat för Power BI och AI-agenter',
    details: ['20 dimensioner', '9 faktatables', 'GDPR-aggregering', 'Redo för Power BI & AI'],
  },
];

interface AIAgent {
  name: string;
  zone: string;
  zoneColor: string;
  tools: string[];
  sources: string[];
}

const AI_AGENTS: AIAgent[] = [
  {
    name: 'Skolklimatanalytiker',
    zone: 'Zon 2',
    zoneColor: 'bg-blue-100 text-blue-700',
    tools: ['Trendanalys', 'Jämförelse', 'Kränkningsindex'],
    sources: ['Gävlemodellen (Gold)'],
  },
  {
    name: 'Nationell benchmark',
    zone: 'Zon 3',
    zoneColor: 'bg-green-100 text-green-700',
    tools: ['Kolada API', 'Lärarbehörighet', 'Nyckeltal'],
    sources: ['Kolada v2'],
  },
  {
    name: 'Korsdomänanalytiker',
    zone: 'Zon 2+3',
    zoneColor: 'bg-purple-100 text-purple-700',
    tools: ['Korrelation', 'Riskbedömning', 'Skolprofil'],
    sources: ['Gold + Kolada'],
  },
  {
    name: 'Demografi & planering',
    zone: 'Zon 3',
    zoneColor: 'bg-green-100 text-green-700',
    tools: ['Befolkningsprognos', 'Kapacitetsanalys'],
    sources: ['SCB PxWeb API'],
  },
  {
    name: 'Internationell benchmark',
    zone: 'Zon 3',
    zoneColor: 'bg-green-100 text-green-700',
    tools: ['PISA-jämförelse', 'EU-indikatorer'],
    sources: ['OECD SDMX', 'Eurostat'],
  },
];

interface GDPRZone {
  zone: number;
  name: string;
  access: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const GDPR_ZONES: GDPRZone[] = [
  {
    zone: 1,
    name: 'Känslig',
    access: 'Ingen AI-åtkomst',
    description: 'Individdata (elever, personal). Enbart on-premise Power BI med rollbaserad åtkomst.',
    icon: <Lock size={18} />,
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
  },
  {
    zone: 2,
    name: 'Aggregerad',
    access: 'AI-åtkomst med GDPR',
    description: 'Skolnivå-aggregat, n>=5 regel. Gävlemodellens index och trender.',
    icon: <Eye size={18} />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
  },
  {
    zone: 3,
    name: 'Öppen',
    access: 'Full åtkomst',
    description: 'Publika data: Kolada, SCB, OECD, Eurostat. Fritt tillgängligt via API:er.',
    icon: <Unlock size={18} />,
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
  },
];

const DataArchitectureView: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-cyan-50">
            <Database size={28} className="text-cyan-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Dataarkitektur: Semantisk brygga i praktiken
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-3xl">
              Medallion-arkitekturen (Bronze → Silver → Gold) transformerar rå operativ data från skolsystemen
              till standardiserad, analysbar information. Silver-lagret fungerar som den semantiska bryggan -
              det är här SS12000-konformering sker och sektorsöverbrygning möjliggörs.
            </p>
          </div>
        </div>
      </div>

      {/* Medallion Architecture */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Layers size={20} className="text-gray-500" />
          Medallion-arkitektur
        </h3>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {MEDALLION_LAYERS.map((layer, index) => (
              <div key={layer.id} className="relative p-5">
                {index > 0 && (
                  <div className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight size={20} className="text-gray-300" />
                  </div>
                )}
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${layer.bgColor} border ${layer.borderColor} mb-3`}>
                  <span className={`text-sm font-bold ${layer.color}`}>{layer.name}</span>
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{layer.label}</p>
                <p className="text-sm text-gray-600 mb-3">{layer.description}</p>
                <ul className="space-y-1.5">
                  {layer.details.map((detail) => (
                    <li key={detail} className="text-xs text-gray-500 flex items-start gap-1.5">
                      <span className="text-gray-300 mt-0.5">-</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GDPR Zones */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield size={20} className="text-gray-500" />
          GDPR-zonmodell för AI-åtkomst
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GDPR_ZONES.map((zone) => (
            <div key={zone.zone} className={`rounded-xl p-5 border ${zone.bgColor}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className={zone.color}>{zone.icon}</span>
                <div>
                  <span className="text-sm font-bold text-gray-900">Zon {zone.zone}: {zone.name}</span>
                  <p className="text-xs text-gray-500">{zone.access}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{zone.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Agents */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Bot size={20} className="text-gray-500" />
          Multi-agent AI-analys
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Fem specialiserade AI-agenter analyserar data inom sina tilldelade GDPR-zoner. En orkestrerare
          klassificerar frågor och dirigerar till rätt agent.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_AGENTS.map((agent) => (
            <div key={agent.name} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-900 text-sm">{agent.name}</h4>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${agent.zoneColor}`}>
                  {agent.zone}
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Verktyg</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.tools.map((tool) => (
                      <span key={tool} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Datakällor</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.sources.map((source) => (
                      <span key={source} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Standard Mapping Table */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Globe size={20} className="text-gray-500" />
          Semantisk mappning: SHANARRI → Nationella kodverk
        </h3>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">SHANARRI</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">ICF</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">BBIC</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">IBIC</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">KSI</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">KVÅ</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">SNOMED CT</th>
              </tr>
            </thead>
            <tbody>
              {SHANARRI_DATA.map((indicator) => (
                <tr key={indicator.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: indicator.color }}
                      />
                      <span className="font-semibold text-gray-900">{indicator.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{indicator.nameEn}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-[160px] truncate" title={indicator.icf}>
                    {indicator.icf.split('|')[0].trim().substring(0, 60)}...
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{indicator.bbic}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-[120px] truncate" title={indicator.ibic}>
                    {indicator.ibic}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-[120px] truncate" title={indicator.ksi}>
                    {indicator.ksi.split('|')[0].trim().substring(0, 40)}...
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{indicator.kva}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{indicator.snomed || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2 italic">
          Mappningen baseras på Socialstyrelsens klassifikationer och WHO:s ICF. Varje SHANARRI-dimension
          kopplas till motsvarande kodverk för att möjliggöra tvärsektoriell informationsdelning.
        </p>
      </div>
    </div>
  );
};

export default memo(DataArchitectureView);
