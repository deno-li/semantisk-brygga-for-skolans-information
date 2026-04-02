
import React, { memo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3, ArrowRight, RefreshCcw, Target, TrendingUp, Shield, CheckCircle2, Link } from 'lucide-react';

interface ClimateMapping {
  skolklimat: string;
  skolklimatEn: string;
  shanarri: string;
  shanarriEn: string;
  skolklimatColor: string;
  shanarriColor: string;
  description: string;
  skolklimatScore: number;
  shanarriScore: number;
}

const CLIMATE_MAPPINGS: ClimateMapping[] = [
  {
    skolklimat: 'Trygghet',
    skolklimatEn: 'Safety Score',
    shanarri: 'TRYGG',
    shanarriEn: 'Safe',
    skolklimatColor: '#005595',
    shanarriColor: '#005595',
    description: 'Elevens upplevelse av fysisk och emotionell trygghet i skolmiljön kopplas direkt till SHANARRI:s trygghetsdimension.',
    skolklimatScore: 7.8,
    shanarriScore: 4.2,
  },
  {
    skolklimat: 'Respekt',
    skolklimatEn: 'Respect Score',
    shanarri: 'RESPEKTERAD',
    shanarriEn: 'Respected',
    skolklimatColor: '#6366f1',
    shanarriColor: '#6366f1',
    description: 'Ömsesidig respekt i skolmiljön speglar barnets känsla av att vara respekterad och lyssnad till.',
    skolklimatScore: 7.2,
    shanarriScore: 3.8,
  },
  {
    skolklimat: 'Deltagande',
    skolklimatEn: 'Participation Score',
    shanarri: 'DELAKTIG',
    shanarriEn: 'Included',
    skolklimatColor: '#8b5cf6',
    shanarriColor: '#8b5cf6',
    description: 'Elevens engagemang och delaktighet i skolaktiviteter kopplas till känslan av inkludering.',
    skolklimatScore: 6.9,
    shanarriScore: 3.5,
  },
  {
    skolklimat: 'Välbefinnande',
    skolklimatEn: 'Wellbeing Score',
    shanarri: 'MÅ BRA',
    shanarriEn: 'Healthy',
    skolklimatColor: '#378056',
    shanarriColor: '#378056',
    description: 'Övergripande mentalt och emotionellt välmående mäts på skolnivå och kopplas till barnets hälsodimension.',
    skolklimatScore: 7.5,
    shanarriScore: 4.0,
  },
  {
    skolklimat: 'Lärarsupport',
    skolklimatEn: 'Teacher Support',
    shanarri: 'OMVÅRDAD',
    shanarriEn: 'Nurtured',
    skolklimatColor: '#B00020',
    shanarriColor: '#B00020',
    description: 'Upplevd tillgänglighet och stöd från lärare kopplas till barnets känsla av att vara omvårdad.',
    skolklimatScore: 7.1,
    shanarriScore: 4.1,
  },
];

const radarData = CLIMATE_MAPPINGS.map((m) => ({
  dimension: m.skolklimat,
  'Skolklimatindex (0-10)': m.skolklimatScore,
  'SHANARRI (0-5, skalat)': m.shanarriScore * 2,
}));

const PDCA_PHASES = [
  { id: 'plan', label: 'PLANERA', color: '#005595', description: 'Analysera skolklimatdata och SHANARRI-resultat, identifiera förbättringsområden' },
  { id: 'do', label: 'GÖRA', color: '#378056', description: 'Genomföra riktade insatser baserat på identifierade gap mellan skolklimat och välbefinnande' },
  { id: 'check', label: 'UTVÄRDERA', color: '#E87C00', description: 'Följa upp med nya mätningar, jämföra index och SHANARRI-poäng' },
  { id: 'act', label: 'AGERA', color: '#B00020', description: 'Standardisera fungerande insatser, justera vid behov, ny cykel' },
];

const SchoolClimateIntegration: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-50">
            <BarChart3 size={28} className="text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Skolklimat & Välbefinnande: Gävlemodellen + SHANARRI
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-3xl">
              Skolklimatindex (baserat på Skolverkets Rapport 353 och Gävlemodellen) mäter 5 dimensioner
              på <strong>skolnivå</strong>. SHANARRI-hjulet mäter 8 dimensioner på <strong>individnivå</strong>.
              Genom att koppla ihop dessa system kan vi se hur skolans klimat påverkar det enskilda barnets välbefinnande.
            </p>
          </div>
        </div>
      </div>

      {/* Mapping Cards */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Link size={20} className="text-gray-500" />
          Dimensionskopplingar
        </h3>
        <div className="space-y-3">
          {CLIMATE_MAPPINGS.map((mapping) => (
            <div key={mapping.skolklimat} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold text-white"
                      style={{ backgroundColor: mapping.skolklimatColor }}
                    >
                      {mapping.skolklimat}
                    </span>
                    <ArrowRight size={16} className="text-gray-300" />
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold text-white"
                      style={{ backgroundColor: mapping.shanarriColor }}
                    >
                      {mapping.shanarri}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{mapping.description}</p>
                </div>
                <div className="flex gap-4 shrink-0">
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: mapping.skolklimatColor }}>
                      {mapping.skolklimatScore}
                    </div>
                    <div className="text-xs text-gray-400">Skolklimat (0-10)</div>
                  </div>
                  <div className="w-px bg-gray-200" />
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: mapping.shanarriColor }}>
                      {mapping.shanarriScore}
                    </div>
                    <div className="text-xs text-gray-400">SHANARRI (0-5)</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dual Radar Chart */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Target size={20} className="text-gray-500" />
          Jämförande radar: Skolklimat vs SHANARRI
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          SHANARRI-poängen (0-5) har skalats till 0-10 för visuell jämförbarhet.
          Demodata baserat på typisk grundskola F-3.
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fontSize: 12, fill: '#374151' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 10]}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
            />
            <Radar
              name="Skolklimatindex (0-10)"
              dataKey="Skolklimatindex (0-10)"
              stroke="#005595"
              fill="#005595"
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Radar
              name="SHANARRI (0-5, skalat)"
              dataKey="SHANARRI (0-5, skalat)"
              stroke="#378056"
              fill="#378056"
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* PDCA Integration */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <RefreshCcw size={20} className="text-gray-500" />
          Gävlemodellens kvalitetscykel (PDCA)
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Systematiskt kvalitetsarbete med skolklimat och SHANARRI som gemensamma indikatorer.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {PDCA_PHASES.map((phase, index) => (
            <div key={phase.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm relative">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm mb-3"
                style={{ backgroundColor: phase.color }}
              >
                {index + 1}
              </div>
              <h4 className="font-bold text-gray-900 mb-1" style={{ color: phase.color }}>
                {phase.label}
              </h4>
              <p className="text-sm text-gray-600">{phase.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insight */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
        <div className="flex items-start gap-3">
          <CheckCircle2 size={20} className="text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-bold text-emerald-900 mb-1">Varför koppla skolklimat till SHANARRI?</h4>
            <p className="text-sm text-emerald-800 leading-relaxed">
              Skolklimatindex ger en <strong>aggregerad bild</strong> på skolnivå (n &ge; 5 elever, GDPR-säkert).
              SHANARRI ger en <strong>individuell bild</strong> av barnets välbefinnande. Tillsammans ger de
              en helhetsbild: Hur påverkar skolans klimat just detta barns välbefinnande?
              Gävlemodellens PDCA-cykel säkerställer att insikterna leder till systematiska förbättringar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SchoolClimateIntegration);
