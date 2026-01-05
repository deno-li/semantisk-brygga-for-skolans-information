import React, { useState, useMemo, useCallback } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Info,
  Maximize2,
  Play,
  RotateCcw,
  Clock,
  Users,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Heart,
  Target,
  Shield,
  Zap,
  Star,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { Perspective } from '../types/types';
import { useWelfareData } from '../hooks/useWelfareData';

interface WellnessWheelDevelopmentProps {
  currentPerspective?: Perspective;
  selectedProfileId?: string;
}

// ============================================
// TYPES
// ============================================
interface Intervention {
  id: string;
  name: string;
  description: string;
  category: 'individual' | 'family' | 'school' | 'community';
  emoji: string;
  duration: string;
  cost: 'low' | 'medium' | 'high';
  staffRequired: number;
  effects: Record<string, InterventionEffect>;
}

interface InterventionEffect {
  immediate: number;
  shortTerm: number;
  longTerm: number;
  variability: number;
}

interface SimulationResult {
  interventionId: string;
  timeline: SimulationPoint[];
  finalScores: Record<string, number>;
  totalImprovement: number;
  riskReduction: number;
  confidenceLevel: number;
}

interface SimulationPoint {
  month: number;
  scores: Record<string, number>;
  events: string[];
}

// ============================================
// SPOKES CONFIGURATION
// ============================================
const SPOKES = [
  { id: 'safe', name: 'Trygg', color: '#005595', icon: Shield },
  { id: 'healthy', name: 'Må bra', color: '#378056', icon: Heart },
  { id: 'achieving', name: 'Utvecklas', color: '#C12143', icon: Target },
  { id: 'nurtured', name: 'Omvårdad', color: '#B00020', icon: Users },
  { id: 'active', name: 'Aktiv', color: '#E87C00', icon: Zap },
  { id: 'respected', name: 'Respekterad', color: '#9333EA', icon: Star },
  { id: 'responsible', name: 'Ansvarsfull', color: '#0284C7', icon: Award },
  { id: 'included', name: 'Delaktig', color: '#0D9488', icon: Users }
];

// ============================================
// INTERVENTIONS DATA
// ============================================
const INTERVENTIONS: Intervention[] = [
  {
    id: 'mentor-program',
    name: 'Mentorprogram',
    description: 'En dedikerad mentor träffar barnet regelbundet för stöd och vägledning',
    category: 'individual',
    emoji: '👥',
    duration: '6 månader',
    cost: 'medium',
    staffRequired: 1,
    effects: {
      safe: { immediate: 0.3, shortTerm: 0.5, longTerm: 0.7, variability: 0.2 },
      nurtured: { immediate: 0.4, shortTerm: 0.6, longTerm: 0.8, variability: 0.15 },
      respected: { immediate: 0.3, shortTerm: 0.5, longTerm: 0.6, variability: 0.2 },
      included: { immediate: 0.2, shortTerm: 0.4, longTerm: 0.5, variability: 0.25 }
    }
  },
  {
    id: 'family-therapy',
    name: 'Familjeterapi',
    description: 'Strukturerade familjesamtal med fokus på kommunikation och relationer',
    category: 'family',
    emoji: '🏠',
    duration: '3-6 månader',
    cost: 'high',
    staffRequired: 1,
    effects: {
      safe: { immediate: 0.2, shortTerm: 0.6, longTerm: 0.9, variability: 0.3 },
      nurtured: { immediate: 0.3, shortTerm: 0.7, longTerm: 1.0, variability: 0.25 },
      healthy: { immediate: 0.1, shortTerm: 0.3, longTerm: 0.5, variability: 0.2 },
      responsible: { immediate: 0.1, shortTerm: 0.3, longTerm: 0.4, variability: 0.3 }
    }
  },
  {
    id: 'social-skills-group',
    name: 'Sociala färdighetsgrupp',
    description: 'Gruppträning i sociala färdigheter och konflikthantering',
    category: 'school',
    emoji: '🤝',
    duration: '10 veckor',
    cost: 'low',
    staffRequired: 2,
    effects: {
      included: { immediate: 0.3, shortTerm: 0.6, longTerm: 0.7, variability: 0.2 },
      respected: { immediate: 0.2, shortTerm: 0.5, longTerm: 0.6, variability: 0.25 },
      responsible: { immediate: 0.2, shortTerm: 0.4, longTerm: 0.5, variability: 0.2 },
      safe: { immediate: 0.1, shortTerm: 0.3, longTerm: 0.4, variability: 0.2 }
    }
  },
  {
    id: 'sports-club',
    name: 'Idrottsföreningsaktivitet',
    description: 'Regelbundet deltagande i organiserad idrott med stöd',
    category: 'community',
    emoji: '⚽',
    duration: 'Löpande',
    cost: 'low',
    staffRequired: 0,
    effects: {
      active: { immediate: 0.5, shortTerm: 0.8, longTerm: 1.0, variability: 0.1 },
      healthy: { immediate: 0.3, shortTerm: 0.5, longTerm: 0.7, variability: 0.15 },
      included: { immediate: 0.3, shortTerm: 0.5, longTerm: 0.6, variability: 0.2 },
      respected: { immediate: 0.2, shortTerm: 0.3, longTerm: 0.4, variability: 0.25 }
    }
  },
  {
    id: 'homework-support',
    name: 'Läxhjälp',
    description: 'Strukturerad läxhjälp och studiestöd efter skolan',
    category: 'school',
    emoji: '📚',
    duration: 'Terminsvis',
    cost: 'low',
    staffRequired: 1,
    effects: {
      achieving: { immediate: 0.3, shortTerm: 0.6, longTerm: 0.8, variability: 0.2 },
      responsible: { immediate: 0.2, shortTerm: 0.4, longTerm: 0.5, variability: 0.2 },
      included: { immediate: 0.1, shortTerm: 0.2, longTerm: 0.3, variability: 0.15 }
    }
  },
  {
    id: 'parent-training',
    name: 'Föräldraträning',
    description: 'Strukturerad träning i föräldraskap och kommunikation',
    category: 'family',
    emoji: '👨‍👩‍👧',
    duration: '8-12 veckor',
    cost: 'medium',
    staffRequired: 1,
    effects: {
      nurtured: { immediate: 0.2, shortTerm: 0.5, longTerm: 0.8, variability: 0.3 },
      safe: { immediate: 0.2, shortTerm: 0.5, longTerm: 0.7, variability: 0.25 },
      responsible: { immediate: 0.1, shortTerm: 0.3, longTerm: 0.5, variability: 0.25 },
      healthy: { immediate: 0.1, shortTerm: 0.2, longTerm: 0.4, variability: 0.2 }
    }
  }
];

// ============================================
// CATEGORY CONFIG
// ============================================
const CATEGORY_CONFIG = {
  individual: { name: 'Individuella insatser', color: 'indigo', icon: Users, bgColor: 'bg-indigo-50' },
  family: { name: 'Familj insatser', color: 'rose', icon: Heart, bgColor: 'bg-rose-50' },
  school: { name: 'Skola insatser', color: 'amber', icon: Target, bgColor: 'bg-amber-50' },
  community: { name: 'Samhälle', color: 'emerald', icon: Users, bgColor: 'bg-emerald-50' }
};

const COST_CONFIG = {
  low: { label: 'Låg kostnad', color: 'emerald', icon: '💚' },
  medium: { label: 'Medium', color: 'amber', icon: '💛' },
  high: { label: 'Hög', color: 'rose', icon: '❤️' }
};

// ============================================
// SIMULATION LOGIC
// ============================================
const runSimulation = (
  intervention: Intervention,
  baselineScores: Record<string, number>,
  months: number = 6
): SimulationResult => {
  const timeline: SimulationPoint[] = [];
  let currentScores = { ...baselineScores };

  for (let month = 0; month <= months; month++) {
    const events: string[] = [];

    SPOKES.forEach(spoke => {
      const effect = intervention.effects[spoke.id];
      if (effect) {
        let monthlyEffect = 0;

        if (month <= 1) {
          monthlyEffect = effect.immediate;
        } else if (month <= 3) {
          monthlyEffect = effect.immediate + (effect.shortTerm - effect.immediate) * ((month - 1) / 2);
        } else {
          monthlyEffect = effect.shortTerm + (effect.longTerm - effect.shortTerm) * ((month - 3) / 3);
        }

        const variance = (Math.random() - 0.5) * 2 * effect.variability;
        monthlyEffect *= (1 + variance);

        currentScores[spoke.id] = Math.min(5, Math.max(1, currentScores[spoke.id] + monthlyEffect * 0.3));
      }
    });

    if (month === 1) events.push('Insatsen påbörjas');
    if (month === 3) events.push('Första utvärderingen');
    if (month === 6) events.push('Slututvärdering');

    timeline.push({
      month,
      scores: { ...currentScores },
      events
    });
  }

  const finalScores = timeline[timeline.length - 1].scores;
  const totalImprovement = SPOKES.reduce((sum, spoke) => {
    return sum + (finalScores[spoke.id] - baselineScores[spoke.id]);
  }, 0);

  const riskReduction = SPOKES.reduce((count, spoke) => {
    const wasAtRisk = baselineScores[spoke.id] <= 2;
    const isNowSafe = finalScores[spoke.id] > 2;
    return count + (wasAtRisk && isNowSafe ? 1 : 0);
  }, 0);

  const avgVariability = Object.values(intervention.effects).reduce(
    (sum, e) => sum + e.variability, 0
  ) / Object.values(intervention.effects).length;
  const confidenceLevel = Math.round((1 - avgVariability) * 100);

  return {
    interventionId: intervention.id,
    timeline,
    finalScores,
    totalImprovement,
    riskReduction,
    confidenceLevel
  };
};

// ============================================
// CUSTOM RADAR DOT COMPONENT
// ============================================
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  const spoke = SPOKES.find(s => s.name === payload.name);
  const color = spoke?.color || '#666';

  return (
    <circle
      cx={cx}
      cy={cy}
      r={8}
      fill={color}
      stroke="white"
      strokeWidth={3}
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
    />
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const WellnessWheelDevelopment: React.FC<WellnessWheelDevelopmentProps> = ({
  currentPerspective,
  selectedProfileId = 'erik'
}) => {
  const isChild = currentPerspective === 'child';
  const { filteredData, hasData } = useWelfareData(selectedProfileId, '');

  // State for time selection
  const [selectedDate, setSelectedDate] = useState('2024-01');
  const [isFirstAssessment, setIsFirstAssessment] = useState(true);

  // State for intervention simulator
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([]);
  const [baselineScores, setBaselineScores] = useState<Record<string, number>>({
    safe: 2, healthy: 3, achieving: 2, nurtured: 3,
    active: 2, respected: 2, responsible: 2, included: 2
  });
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('school');
  const [showResults, setShowResults] = useState(false);
  const [simulationMonths, setSimulationMonths] = useState(6);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!filteredData.length) return { average: 0, improved: 0, worsened: 0, stable: 0 };

    const average = filteredData.reduce((sum, d) => sum + d.status, 0) / filteredData.length;
    // For demo purposes, simulate changes
    const improved = filteredData.filter(d => d.status >= 4).length;
    const worsened = filteredData.filter(d => d.status <= 2).length;
    const stable = filteredData.length - improved - worsened;

    return { average: Math.round(average * 10) / 10, improved, worsened, stable };
  }, [filteredData]);

  // Radar chart data with colors
  const radarData = useMemo(() => {
    return filteredData.map(d => ({
      name: d.name,
      status: d.status,
      fullMark: 5,
      color: d.color
    }));
  }, [filteredData]);

  // Intervention handlers
  const toggleIntervention = (id: string) => {
    setSelectedInterventions(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
    setShowResults(false);
  };

  const runAllSimulations = useCallback(() => {
    setIsSimulating(true);
    setShowResults(false);

    setTimeout(() => {
      const results = selectedInterventions.map(id => {
        const intervention = INTERVENTIONS.find(i => i.id === id)!;
        return runSimulation(intervention, baselineScores, simulationMonths);
      });

      setSimulationResults(results);
      setIsSimulating(false);
      setShowResults(true);
    }, 1500);
  }, [selectedInterventions, baselineScores, simulationMonths]);

  const handleReset = () => {
    setSelectedInterventions([]);
    setSimulationResults([]);
    setShowResults(false);
  };

  // Calculate combined projection
  const combinedProjection = useMemo(() => {
    if (simulationResults.length === 0) return null;

    const combined: Record<string, number> = { ...baselineScores };

    simulationResults.forEach(result => {
      SPOKES.forEach(spoke => {
        const improvement = result.finalScores[spoke.id] - baselineScores[spoke.id];
        combined[spoke.id] = Math.min(5, combined[spoke.id] + improvement * 0.7);
      });
    });

    return combined;
  }, [simulationResults, baselineScores]);

  const dateOptions = [
    { value: '2024-01', label: 'Januari 2024' },
    { value: '2024-04', label: 'April 2024' },
    { value: '2024-08', label: 'Augusti 2024' },
    { value: '2024-12', label: 'December 2024' },
  ];

  return (
    <div className="space-y-6">
      {/* Välbefinnandeutveckling - Main Spider Chart Card */}
      <div className="bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-white/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Välbefinnandeutveckling</h2>
                <p className="text-sm text-gray-500">Barnets utveckling över tid</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setIsFirstAssessment(e.target.value === '2024-01');
                  }}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {dateOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {isFirstAssessment && (
                <span className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  <Info size={12} />
                  Första bedömningen
                </span>
              )}

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Maximize2 className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Radar Chart Area */}
        <div className="p-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Radar Chart */}
            <div className="flex-1 h-[400px] w-full max-w-[500px]">
              {hasData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid
                      gridType="polygon"
                      stroke="#e5e7eb"
                    />
                    <PolarAngleAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }}
                      tickLine={false}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 5]}
                      tick={false}
                      axisLine={false}
                    />
                    <Radar
                      name="Status"
                      dataKey="status"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                      dot={<CustomDot />}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value: number) => [`Nivå ${value}/5`, 'Status']}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <p>Ingen data tillgänglig</p>
                </div>
              )}

              {/* Center label */}
              <div className="relative -mt-[220px] flex justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{stats.average}</div>
                  <div className="text-xs text-gray-500">medel</div>
                </div>
              </div>
              <div className="h-[170px]" /> {/* Spacer */}
            </div>
          </div>
        </div>

        {/* Statistics Footer */}
        <div className="px-8 pb-8">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.average}</div>
              <div className="text-xs text-gray-500 mt-1">Medelvärde</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-100 text-center">
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-2xl font-bold text-green-700">{stats.improved}</span>
              </div>
              <div className="text-xs text-green-600 mt-1">Förbättrade</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border border-red-100 text-center">
              <div className="flex items-center justify-center gap-1">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-2xl font-bold text-red-700">{stats.worsened}</span>
              </div>
              <div className="text-xs text-red-600 mt-1">Försämrade</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
              <div className="flex items-center justify-center gap-1">
                <Minus className="w-4 h-4 text-gray-500" />
                <span className="text-2xl font-bold text-gray-700">{stats.stable}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Stabila</div>
            </div>
          </div>
        </div>
      </div>

      {/* Insatssimulator Card */}
      {!isChild && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Insatssimulator</h2>
                  <p className="text-sm text-gray-500">Testa olika insatser och se förväntade resultat</p>
                </div>
              </div>

              {selectedInterventions.length > 0 && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Återställ
                </button>
              )}
            </div>
          </div>

          {/* Baseline Editor */}
          <div className="p-6 bg-gray-50 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              Nuvarande läge (baseline)
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {SPOKES.map(spoke => (
                <div key={spoke.id} className="text-center">
                  <div
                    className="w-full h-2 rounded-full mb-2"
                    style={{ backgroundColor: spoke.color + '30' }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(baselineScores[spoke.id] / 5) * 100}%`,
                        backgroundColor: spoke.color
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={baselineScores[spoke.id]}
                    onChange={(e) => setBaselineScores(prev => ({
                      ...prev,
                      [spoke.id]: parseFloat(e.target.value)
                    }))}
                    className="w-full accent-indigo-500"
                  />
                  <p className="text-xs text-gray-600 mt-1">{spoke.name}</p>
                  <p className="text-sm font-bold" style={{ color: spoke.color }}>
                    {baselineScores[spoke.id]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Simulation Period Selector */}
          <div className="px-6 py-4 bg-white border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Simuleringsperiod:</span>
                <select
                  value={simulationMonths}
                  onChange={(e) => setSimulationMonths(Number(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value={3}>3 månader</option>
                  <option value={6}>6 månader</option>
                  <option value={9}>9 månader</option>
                  <option value={12}>12 månader</option>
                </select>
              </div>

              {selectedInterventions.length > 0 && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{selectedInterventions.length}</span> insatser valda
                </div>
              )}
            </div>
          </div>

          {/* Intervention Categories */}
          <div className="p-6 space-y-3">
            {Object.entries(CATEGORY_CONFIG).map(([category, config]) => {
              const categoryInterventions = INTERVENTIONS.filter(i => i.category === category);
              const isExpanded = expandedCategory === category;
              const Icon = config.icon;

              if (categoryInterventions.length === 0) return null;

              return (
                <div key={category} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : category)}
                    className={`w-full flex items-center justify-between p-4 transition-colors ${
                      isExpanded ? config.bgColor : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 text-${config.color}-600`} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">{config.name}</h3>
                        <p className="text-sm text-gray-500">{categoryInterventions.length} insatser tillgängliga</p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-4 border-t border-gray-100 space-y-3">
                      {categoryInterventions.map(intervention => {
                        const isSelected = selectedInterventions.includes(intervention.id);

                        return (
                          <button
                            key={intervention.id}
                            onClick={() => toggleIntervention(intervention.id)}
                            className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                              isSelected
                                ? 'border-indigo-400 bg-indigo-50'
                                : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                            }`}
                          >
                            <span className="text-3xl">{intervention.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className={`font-semibold ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                                  {intervention.name}
                                </h4>
                                {isSelected && (
                                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{intervention.description}</p>

                              <div className="flex flex-wrap items-center gap-2 mt-3">
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                                  <Clock className="w-3 h-3 inline mr-1" />
                                  {intervention.duration}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full bg-${COST_CONFIG[intervention.cost].color}-100 text-${COST_CONFIG[intervention.cost].color}-700`}>
                                  {COST_CONFIG[intervention.cost].icon} {COST_CONFIG[intervention.cost].label}
                                </span>
                                {intervention.staffRequired > 0 && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                    <Users className="w-3 h-3 inline mr-1" />
                                    {intervention.staffRequired} personal
                                  </span>
                                )}
                              </div>

                              {/* Effect preview */}
                              <div className="flex flex-wrap gap-1 mt-3">
                                {Object.entries(intervention.effects).map(([spoke, effect]) => (
                                  <span
                                    key={spoke}
                                    className="text-xs px-2 py-0.5 rounded-full"
                                    style={{
                                      backgroundColor: SPOKES.find(s => s.id === spoke)?.color + '20',
                                      color: SPOKES.find(s => s.id === spoke)?.color
                                    }}
                                  >
                                    {SPOKES.find(s => s.id === spoke)?.name} +{(effect.longTerm * 100).toFixed(0)}%
                                  </span>
                                ))}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Run Simulation Button */}
          {selectedInterventions.length > 0 && !showResults && (
            <div className="px-6 pb-6">
              <button
                onClick={runAllSimulations}
                disabled={isSimulating}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Simulerar...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Kör simulering
                  </>
                )}
              </button>
            </div>
          )}

          {/* Simulation Results */}
          {showResults && simulationResults.length > 0 && (
            <div className="p-6 border-t border-gray-100 space-y-6">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  Simuleringsresultat
                </h3>

                {/* Combined projection */}
                {combinedProjection && (
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <h4 className="font-medium text-gray-700 mb-3">Projekterad utveckling efter {simulationMonths} månader:</h4>
                    <div className="grid grid-cols-4 gap-3">
                      {SPOKES.map(spoke => {
                        const baseline = baselineScores[spoke.id];
                        const projected = combinedProjection[spoke.id];
                        const change = projected - baseline;

                        return (
                          <div key={spoke.id} className="text-center p-3 rounded-lg bg-gray-50">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: spoke.color }}
                              />
                              <span className="text-xs font-medium text-gray-600">{spoke.name}</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-lg font-bold text-gray-400">{baseline.toFixed(1)}</span>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                              <span className="text-lg font-bold" style={{ color: spoke.color }}>
                                {projected.toFixed(1)}
                              </span>
                            </div>
                            {change !== 0 && (
                              <div className={`text-xs mt-1 ${change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {change > 0 ? '+' : ''}{change.toFixed(1)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Individual results */}
                <div className="space-y-3">
                  {simulationResults.map(result => {
                    const intervention = INTERVENTIONS.find(i => i.id === result.interventionId)!;

                    return (
                      <div key={result.interventionId} className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{intervention.emoji}</span>
                            <div>
                              <h4 className="font-semibold text-gray-900">{intervention.name}</h4>
                              <p className="text-sm text-gray-500">Konfidensgrad: {result.confidenceLevel}%</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              {result.totalImprovement > 0 ? (
                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Minus className="w-4 h-4 text-gray-400" />
                              )}
                              <span className={`font-bold ${
                                result.totalImprovement > 0 ? 'text-emerald-600' : 'text-gray-600'
                              }`}>
                                +{result.totalImprovement.toFixed(1)} totalt
                              </span>
                            </div>
                            {result.riskReduction > 0 && (
                              <p className="text-xs text-emerald-600">
                                {result.riskReduction} riskområden lösta
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-500" />
                  Rekommendationer
                </h3>
                <div className="space-y-3">
                  {simulationResults.some(r => r.confidenceLevel < 70) && (
                    <div className="flex items-start gap-3 p-3 bg-amber-100 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-900">Variabel effekt</p>
                        <p className="text-sm text-amber-700">
                          Vissa insatser har varierande effekt. Regelbunden uppföljning rekommenderas.
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3 p-3 bg-blue-100 rounded-lg">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Simuleringsnotering</p>
                      <p className="text-sm text-blue-700">
                        Resultaten baseras på forskning och statistik. Verkliga utfall kan variera beroende på individuella faktorer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WellnessWheelDevelopment;
