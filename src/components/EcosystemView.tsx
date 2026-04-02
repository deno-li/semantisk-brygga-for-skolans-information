
import React, { memo } from 'react';
import {
  Globe, Building2, Stethoscope, GraduationCap, Heart, BarChart3,
  ExternalLink, ArrowRight, Puzzle, Shield, Network, Handshake
} from 'lucide-react';

interface BuildingBlock {
  id: string;
  name: string;
  organization: string;
  description: string;
  standards: string[];
  url: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  type: 'platform' | 'standard' | 'framework' | 'data';
}

const BUILDING_BLOCKS: BuildingBlock[] = [
  {
    id: 'inera',
    name: '1177 & Sammanhållen planering',
    organization: 'Inera',
    description: 'Nationell e-hälsoplattform som möjliggör sammanhållen planering och informationsdelning mellan vård, skola och omsorg.',
    standards: ['Nationella tjänsteplattformen', 'Journalplattformar', '1177 Vårdguiden'],
    url: 'https://www.inera.se/',
    icon: <Heart size={24} />,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    type: 'platform',
  },
  {
    id: 'skr',
    name: 'Handslaget för digitalisering',
    organization: 'SKR',
    description: 'Sveriges Kommuner och Regioners gemensamma färdriktning för digital transformation i välfärden.',
    standards: ['Gemensam digital infrastruktur', 'Interoperabilitet', 'Öppna standarder'],
    url: 'https://skr.se/digitaliseringivalfarden/handslagfordigitalisering.8420.html',
    icon: <Handshake size={24} />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    type: 'platform',
  },
  {
    id: 'socialstyrelsen',
    name: 'Klassifikationer & terminologi',
    organization: 'Socialstyrelsen',
    description: 'Nationella klassifikationssystem som möjliggör strukturerad informationsdelning mellan sektorer.',
    standards: ['ICF', 'BBIC', 'IBIC', 'KSI', 'KVÅ', 'SNOMED CT'],
    url: 'https://www.socialstyrelsen.se/utveckla-verksamhet/e-halsa/klassificering-och-koder/',
    icon: <Stethoscope size={24} />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    type: 'standard',
  },
  {
    id: 'skolverket',
    name: 'SS12000 & Gävlemodellen',
    organization: 'Skolverket',
    description: 'Svensk standard för informationsutbyte i skolväsendet samt systematiskt kvalitetsarbete baserat på Rapport 353.',
    standards: ['SS12000:2024', 'Rapport 353', 'Termindata', 'Skolformer'],
    url: 'https://www.skolverket.se/',
    icon: <GraduationCap size={24} />,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    type: 'standard',
  },
  {
    id: 'who-icf',
    name: 'ICF — Klassifikation av funktionstillstånd',
    organization: 'WHO',
    description: 'Internationell klassifikation för funktionstillstånd, funktionshinder och hälsa. Används som gemensamt kodverk för att brygga information mellan skola, vård och socialtjänst.',
    standards: ['ICF (Funktionstillstånd)', 'ICD-10/11 (Diagnoser)'],
    url: 'https://www.who.int/standards/classifications/international-classification-of-functioning-disability-and-health',
    icon: <Stethoscope size={24} />,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    type: 'standard',
  },
  {
    id: 'girfec',
    name: 'GIRFEC — Nationell policy för barnets välbefinnande',
    organization: 'Skottlands regering',
    description: 'Skottlands nationella policy med SHANARRI:s 8 välbefinnandedimensioner. I Sverige tolkad genom Connected Children vid Linnéuniversitetet, med lokala variationer som Kronobarnsmodellen (Region Kronoberg), Backa Barnet (Göteborg) och Tillsammans för varje barn (Falun).',
    standards: ['GIRFEC (Getting It Right)', 'SHANARRI (8 dimensioner)', 'Connected Children (svensk tolkning)'],
    url: 'https://www.gov.scot/policies/girfec/',
    icon: <Globe size={24} />,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    type: 'framework',
  },
  {
    id: 'scb-kolada',
    name: 'Demografisk data & benchmarking',
    organization: 'SCB / Kolada',
    description: 'Offentliga datakällor för demografisk analys, befolkningsprognoser och kommunal jämförelse.',
    standards: ['SCB PxWeb API', 'Kolada API v2', 'Kommunala nyckeltal'],
    url: 'https://www.kolada.se/',
    icon: <BarChart3 size={24} />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    type: 'data',
  },
];

interface Initiative {
  title: string;
  description: string;
  howWeSupport: string;
  icon: React.ReactNode;
  color: string;
}

const INITIATIVES: Initiative[] = [
  {
    title: 'Sammanhållen planering på 1177',
    description: 'Ineras vision om att samla planering för barn och unga på en gemensam digital plattform där vårdnadshavare, skola och vård kan samverka.',
    howWeSupport: 'Prototypen visar hur en gemensam informationsprofil kan se ut i praktiken - med välbefinnandehjulet som gemensamt språk och semantisk mappning till alla berörda sektorers kodverk (ICF, BBIC, KSI, KVÅ).',
    icon: <Heart size={20} />,
    color: 'rose',
  },
  {
    title: 'Handslaget för digitalisering',
    description: 'SKR:s överenskommelse om gemensam färdriktning för digital utveckling i kommuner och regioner med fokus på interoperabilitet och öppna standarder.',
    howWeSupport: 'Vi bygger uteslutande på befintliga öppna standarder (SS12000, ICF, SNOMED CT) och demonstrerar hur semantisk mappning kan brygga sektorsgränser utan att skapa nya informationssilos.',
    icon: <Handshake size={20} />,
    color: 'blue',
  },
  {
    title: 'GIRFEC i Sverige: Connected Children & lokala variationer',
    description: 'Connected Children vid Linnéuniversitetet är den svenska tolkningen av Skottlands GIRFEC-policy. Lokala variationer inkluderar Kronobarnsmodellen (Region Kronoberg), Backa Barnet (Göteborg) och Tillsammans för varje barn (Falun) - alla med GIRFEC som gemensam utgångspunkt.',
    howWeSupport: 'SHANARRI-hjulet i prototypen bygger på GIRFEC:s policydimensioner. WHO:s ICF-klassifikation används som ett separat kodningslager ovanpå för att möjliggöra tvärsektoriell informationsdelning.',
    icon: <Network size={20} />,
    color: 'emerald',
  },
];

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  platform: { label: 'Plattform', color: 'bg-teal-100 text-teal-700' },
  standard: { label: 'Standard', color: 'bg-blue-100 text-blue-700' },
  framework: { label: 'Ramverk', color: 'bg-emerald-100 text-emerald-700' },
  data: { label: 'Datakälla', color: 'bg-amber-100 text-amber-700' },
};

const IntegrationMap: React.FC = () => {
  const centerX = 300;
  const centerY = 250;
  const radius = 180;

  const nodes = BUILDING_BLOCKS.map((block, i) => {
    const angle = (i * 2 * Math.PI) / BUILDING_BLOCKS.length - Math.PI / 2;
    return {
      ...block,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  const typeColorMap: Record<string, string> = {
    platform: '#0d9488',
    standard: '#2563eb',
    framework: '#059669',
    data: '#d97706',
  };

  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 600 500" className="w-full max-w-2xl">
        {/* Connection lines */}
        {nodes.map((node) => (
          <line
            key={`line-${node.id}`}
            x1={centerX}
            y1={centerY}
            x2={node.x}
            y2={node.y}
            stroke={typeColorMap[node.type]}
            strokeWidth="2"
            strokeDasharray="6 4"
            opacity="0.4"
          />
        ))}

        {/* Center node */}
        <circle cx={centerX} cy={centerY} r="50" fill="#1F1F1F" />
        <text x={centerX} y={centerY - 10} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
          Semantisk
        </text>
        <text x={centerX} y={centerY + 5} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
          Brygga
        </text>
        <text x={centerX} y={centerY + 20} textAnchor="middle" fill="#9ca3af" fontSize="8">
          Prototyp
        </text>

        {/* Outer nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="35"
              fill="white"
              stroke={typeColorMap[node.type]}
              strokeWidth="2.5"
            />
            <text
              x={node.x}
              y={node.y - 5}
              textAnchor="middle"
              fill="#1F1F1F"
              fontSize="8"
              fontWeight="bold"
            >
              {node.organization}
            </text>
            <text
              x={node.x}
              y={node.y + 8}
              textAnchor="middle"
              fill="#6b7280"
              fontSize="7"
            >
              {node.type === 'platform' ? 'Plattform' : node.type === 'standard' ? 'Standard' : node.type === 'framework' ? 'Ramverk' : 'Data'}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

const EcosystemView: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-teal-50">
            <Puzzle size={28} className="text-teal-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Ekosystem: Befintliga byggstenar
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-3xl">
              Den här prototypen uppfinner inte nya standarder. Den visar hur <strong>befintliga</strong> nationella
              och internationella standarder, plattformar och ramverk kan kopplas samman genom en semantisk brygga -
              ett gemensamt informationslager som översätter mellan sektorernas kodverk.
            </p>
          </div>
        </div>
      </div>

      {/* Building Blocks Grid */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 size={20} className="text-gray-500" />
          Byggstenar vi använder
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BUILDING_BLOCKS.map((block) => {
            const typeInfo = TYPE_LABELS[block.type];
            return (
              <div
                key={block.id}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${block.bgColor}`}>
                    <span className={block.color}>{block.icon}</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${typeInfo.color}`}>
                    {typeInfo.label}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{block.name}</h4>
                <p className="text-xs text-gray-500 font-medium mb-2">{block.organization}</p>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{block.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {block.standards.map((std) => (
                    <span
                      key={std}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md"
                    >
                      {std}
                    </span>
                  ))}
                </div>
                <a
                  href={block.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors"
                >
                  Läs mer <ExternalLink size={12} />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Integration Map */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Network size={20} className="text-gray-500" />
          Integrationskarta
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Prototypen fungerar som en semantisk brygga mellan befintliga standarder och plattformar.
        </p>
        <IntegrationMap />
        <div className="flex justify-center gap-6 mt-6">
          {Object.entries(TYPE_LABELS).map(([type, info]) => (
            <div key={type} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${info.color.split(' ')[0]}`} />
              <span className="text-xs text-gray-600">{info.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Initiatives Section */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield size={20} className="text-gray-500" />
          Hur vi stödjer nationella initiativ
        </h3>
        <div className="space-y-4">
          {INITIATIVES.map((initiative) => (
            <div
              key={initiative.title}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl bg-${initiative.color}-50 shrink-0`}>
                  <span className={`text-${initiative.color}-600`}>{initiative.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">{initiative.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{initiative.description}</p>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      <ArrowRight size={12} />
                      Hur prototypen stödjer detta
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{initiative.howWeSupport}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom note */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100">
        <p className="text-sm text-teal-800 leading-relaxed">
          <strong>Privat initiativ</strong> - Denna prototyp är utvecklad av en kvalitetsutvecklare inom offentlig sektor
          för att visualisera hur befintliga standarder och plattformar kan kopplas samman. Den är öppen för användning,
          forskning och vidareutveckling under MIT (kod) och CC BY 4.0 (dokumentation).
        </p>
      </div>
    </div>
  );
};

export default memo(EcosystemView);
