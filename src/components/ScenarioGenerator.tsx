import React, { useState, useMemo, useCallback } from 'react';
import {
  Sparkles,
  Activity,
  Shield,
  TrendingUp,
  TrendingDown,
  Minus,
  RotateCcw,
  Play,
  Pause,
  Info,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Target
} from 'lucide-react';

// SHANARRI spoke configuration
const SHANARRI_SPOKES = [
  { id: 'trygg', name: 'TRYGG', nameEn: 'Safe', color: '#005595', icon: '🛡️' },
  { id: 'halsa', name: 'MÅ BRA', nameEn: 'Healthy', color: '#378056', icon: '💚' },
  { id: 'utvecklas', name: 'UTVECKLAS', nameEn: 'Achieving', color: '#C12143', icon: '📚' },
  { id: 'omvardad', name: 'OMVÅRDAD', nameEn: 'Nurtured', color: '#B00020', icon: '🤱' },
  { id: 'aktiv', name: 'AKTIV', nameEn: 'Active', color: '#E87C00', icon: '⚡' },
  { id: 'respekterad', name: 'RESPEKTERAD', nameEn: 'Respected', color: '#7B1FA2', icon: '🤝' },
  { id: 'ansvarstagande', name: 'ANSVAR', nameEn: 'Responsible', color: '#0097A7', icon: '✨' },
  { id: 'delaktig', name: 'DELAKTIG', nameEn: 'Included', color: '#FFC107', icon: '🌟' },
];

// Default baseline values (typical N1 profile)
const DEFAULT_VALUES: Record<string, number> = {
  trygg: 4,
  halsa: 4,
  utvecklas: 3,
  omvardad: 4,
  aktiv: 3,
  respekterad: 4,
  ansvarstagande: 3,
  delaktig: 4,
};

// Scenario presets
const SCENARIO_PRESETS = [
  {
    id: 'n1-universal',
    name: 'N1 Universell',
    description: 'Alla indikatorer gröna - inga insatser behövs',
    values: { trygg: 5, halsa: 5, utvecklas: 4, omvardad: 5, aktiv: 4, respekterad: 5, ansvarstagande: 4, delaktig: 5 },
    color: 'emerald'
  },
  {
    id: 'n2-support',
    name: 'N2 Stödprofil',
    description: 'Några bekymmer - riktade insatser pågår',
    values: { trygg: 4, halsa: 3, utvecklas: 2, omvardad: 4, aktiv: 3, respekterad: 3, ansvarstagande: 2, delaktig: 3 },
    color: 'amber'
  },
  {
    id: 'n3-coordinated',
    name: 'N3 Samordning',
    description: 'Komplex situation - SIP aktiverad',
    values: { trygg: 2, halsa: 2, utvecklas: 2, omvardad: 3, aktiv: 2, respekterad: 2, ansvarstagande: 1, delaktig: 2 },
    color: 'rose'
  },
  {
    id: 'learning-focus',
    name: 'Inlärningsbekymmer',
    description: 'Specifik utmaning med lärande',
    values: { trygg: 4, halsa: 4, utvecklas: 1, omvardad: 4, aktiv: 3, respekterad: 4, ansvarstagande: 2, delaktig: 3 },
    color: 'violet'
  },
  {
    id: 'social-focus',
    name: 'Social oro',
    description: 'Utmaningar med relationer och delaktighet',
    values: { trygg: 3, halsa: 4, utvecklas: 3, omvardad: 4, aktiv: 2, respekterad: 2, ansvarstagande: 3, delaktig: 1 },
    color: 'blue'
  },
];

interface ScenarioGeneratorProps {
  selectedProfileId?: string;
}

const ScenarioGenerator: React.FC<ScenarioGeneratorProps> = () => {
  const [spokeValues, setSpokeValues] = useState<Record<string, number>>(DEFAULT_VALUES);
  const [baselineValues, setBaselineValues] = useState<Record<string, number>>(DEFAULT_VALUES);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Calculate derived metrics
  const metrics = useMemo(() => {
    const values = Object.values(spokeValues);
    const average = values.reduce((a, b) => a + b, 0) / values.length;

    // ICF Gap simulation (lower values = larger gaps)
    const gapScore = values.filter(v => v <= 2).length;
    const facilitatorScore = values.filter(v => v >= 4).length;

    // Risk/Protection balance
    const riskFactors = values.filter(v => v <= 2).length * 2;
    const protectionFactors = values.filter(v => v >= 4).length * 2;
    const balance = protectionFactors - riskFactors;

    // Resilience score (1-10)
    const resilience = Math.max(1, Math.min(10, Math.round(average * 2)));

    // Determine recommended level
    let recommendedLevel: 'N1' | 'N2' | 'N3' = 'N1';
    if (values.some(v => v <= 1) || values.filter(v => v <= 2).length >= 3) {
      recommendedLevel = 'N3';
    } else if (values.some(v => v <= 2) || values.filter(v => v <= 3).length >= 3) {
      recommendedLevel = 'N2';
    }

    // Calculate change from baseline
    const totalChange = Object.keys(spokeValues).reduce((acc, key) => {
      return acc + (spokeValues[key] - baselineValues[key]);
    }, 0);

    return {
      average,
      gapScore,
      facilitatorScore,
      riskFactors,
      protectionFactors,
      balance,
      resilience,
      recommendedLevel,
      totalChange,
    };
  }, [spokeValues, baselineValues]);

  // Handle slider change
  const handleSpokeChange = useCallback((spokeId: string, value: number) => {
    setSpokeValues(prev => ({ ...prev, [spokeId]: value }));
    setSelectedPreset(null);
  }, []);

  // Apply preset
  const applyPreset = useCallback((preset: typeof SCENARIO_PRESETS[0]) => {
    setBaselineValues(spokeValues);
    setSelectedPreset(preset.id);

    if (isAnimating) {
      // Animate transition
      const steps = 20;
      const stepDuration = 30;
      let step = 0;

      const animate = () => {
        step++;
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic

        setSpokeValues(prev => {
          const newValues: Record<string, number> = {};
          Object.keys(prev).forEach(key => {
            const start = prev[key];
            const end = preset.values[key];
            newValues[key] = Math.round(start + (end - start) * eased);
          });
          return newValues;
        });

        if (step < steps) {
          requestAnimationFrame(animate);
        } else {
          setSpokeValues(preset.values);
        }
      };

      requestAnimationFrame(animate);
    } else {
      setSpokeValues(preset.values);
    }
  }, [spokeValues, isAnimating]);

  // Reset to default
  const resetValues = useCallback(() => {
    setBaselineValues(spokeValues);
    setSpokeValues(DEFAULT_VALUES);
    setSelectedPreset(null);
  }, [spokeValues]);

  // Get color based on value
  const getValueColor = (value: number) => {
    if (value >= 4) return 'text-emerald-600';
    if (value >= 3) return 'text-amber-600';
    if (value >= 2) return 'text-orange-600';
    return 'text-red-600';
  };

  const getValueBg = (value: number) => {
    if (value >= 4) return 'bg-gradient-to-r from-emerald-400 to-teal-500';
    if (value >= 3) return 'bg-gradient-to-r from-amber-400 to-orange-500';
    if (value >= 2) return 'bg-gradient-to-r from-orange-400 to-red-500';
    return 'bg-gradient-to-r from-red-500 to-rose-600';
  };

  const getLevelGradient = () => {
    switch (metrics.recommendedLevel) {
      case 'N1': return 'from-emerald-400 via-teal-500 to-cyan-600';
      case 'N2': return 'from-amber-400 via-orange-500 to-rose-500';
      case 'N3': return 'from-rose-400 via-pink-500 to-purple-600';
    }
  };

  const getLevelBgGradient = () => {
    switch (metrics.recommendedLevel) {
      case 'N1': return 'from-emerald-50/80 via-teal-50/60 to-cyan-50/40';
      case 'N2': return 'from-amber-50/80 via-orange-50/60 to-rose-50/40';
      case 'N3': return 'from-rose-50/80 via-pink-50/60 to-purple-50/40';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getLevelBgGradient()}`}>
      <div className="max-w-6xl mx-auto space-y-8 py-8 px-4">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-20 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-violet-200/20 to-purple-200/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-200/20 to-blue-200/20 blur-3xl" />
        </div>

        {/* Header */}
        <div className="text-center py-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${getLevelGradient()} text-white mb-6 shadow-2xl shadow-violet-200/50 transform hover:scale-105 transition-transform duration-300`}>
            <Sparkles className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3 tracking-tight">
            Scenariogenerator
          </h1>
          <p className="text-gray-500 text-lg font-light tracking-wide">
            "Tänk om..." • Interaktiv simulering • SHANARRI × ICF × Resilience
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-200/50">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Hur det fungerar</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  Dra i reglagen för att justera SHANARRI-ekrarna och se hur det påverkar:
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-2xl text-xs font-medium border border-blue-100 shadow-sm">
                    <Activity className="w-4 h-4" /> ICF Gap-analys
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-2xl text-xs font-medium border border-emerald-100 shadow-sm">
                    <Shield className="w-4 h-4" /> Risk/Skydd-balans
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded-2xl text-xs font-medium border border-purple-100 shadow-sm">
                    <Target className="w-4 h-4" /> Resilience Matrix
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-2xl text-xs font-medium border border-amber-100 shadow-sm">
                    <Zap className="w-4 h-4" /> Rekommenderad nivå
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preset Scenarios */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 text-lg">Snabbval: Scenarion</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isAnimating
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isAnimating ? 'Animering på' : 'Animering av'}
              </button>
              <button
                onClick={resetValues}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Återställ
              </button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {SCENARIO_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left hover:shadow-lg hover:-translate-y-1 ${
                  selectedPreset === preset.id
                    ? `border-${preset.color}-400 bg-${preset.color}-50 shadow-md`
                    : 'border-gray-100 bg-white/50 hover:border-gray-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-${preset.color}-400 to-${preset.color}-500 flex items-center justify-center mb-3 shadow-lg`}>
                  <span className="text-white text-lg font-bold">
                    {preset.id.startsWith('n') ? preset.name.slice(0, 2) : preset.name.charAt(0)}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{preset.name}</h4>
                <p className="text-xs text-gray-500 line-clamp-2">{preset.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left: SHANARRI Sliders */}
          <div className="col-span-7 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50">
            <h3 className="font-bold text-gray-900 text-lg mb-6">SHANARRI-ekrar</h3>

            <div className="space-y-5">
              {SHANARRI_SPOKES.map((spoke) => {
                const value = spokeValues[spoke.id];
                const baseValue = baselineValues[spoke.id];
                const change = value - baseValue;

                return (
                  <div key={spoke.id} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg transition-transform group-hover:scale-110"
                          style={{ background: `linear-gradient(135deg, ${spoke.color}, ${spoke.color}dd)` }}
                        >
                          {spoke.icon}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">{spoke.name}</span>
                          <span className="text-xs text-gray-400 ml-2">({spoke.nameEn})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {change !== 0 && (
                          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
                            change > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {change > 0 ? '+' : ''}{change}
                          </span>
                        )}
                        <span className={`text-2xl font-bold ${getValueColor(value)}`}>
                          {value}
                        </span>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 h-3 rounded-full bg-gray-100" />
                      <div
                        className={`absolute h-3 rounded-full transition-all duration-300 ${getValueBg(value)}`}
                        style={{ width: `${(value / 5) * 100}%` }}
                      />
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={value}
                        onChange={(e) => handleSpokeChange(spoke.id, parseInt(e.target.value))}
                        className="relative w-full h-3 appearance-none bg-transparent cursor-pointer z-10
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:w-6
                          [&::-webkit-slider-thumb]:h-6
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:bg-white
                          [&::-webkit-slider-thumb]:shadow-lg
                          [&::-webkit-slider-thumb]:border-2
                          [&::-webkit-slider-thumb]:border-gray-300
                          [&::-webkit-slider-thumb]:cursor-grab
                          [&::-webkit-slider-thumb]:active:cursor-grabbing
                          [&::-webkit-slider-thumb]:transition-transform
                          [&::-webkit-slider-thumb]:hover:scale-125"
                      />
                    </div>

                    <div className="flex justify-between mt-1 px-1">
                      <span className="text-[10px] text-red-400 font-medium">Kritisk</span>
                      <span className="text-[10px] text-amber-400 font-medium">Bekymmer</span>
                      <span className="text-[10px] text-gray-400 font-medium">OK</span>
                      <span className="text-[10px] text-emerald-400 font-medium">Bra</span>
                      <span className="text-[10px] text-teal-400 font-medium">Utmärkt</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Derived Metrics */}
          <div className="col-span-5 space-y-6">
            {/* Recommended Level */}
            <div className={`bg-gradient-to-br ${getLevelGradient()} rounded-3xl p-8 shadow-xl text-white`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg opacity-90">Rekommenderad nivå</h3>
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
              </div>
              <div className="text-6xl font-black mb-2">{metrics.recommendedLevel}</div>
              <p className="text-white/80 text-sm">
                {metrics.recommendedLevel === 'N1' && 'Universell nivå - Inga riktade insatser'}
                {metrics.recommendedLevel === 'N2' && 'Stödprofil - Riktade insatser behövs'}
                {metrics.recommendedLevel === 'N3' && 'Samordning - SIP rekommenderas'}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* ICF Gap */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-5 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">ICF Gap</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">{metrics.gapScore}</span>
                    <span className="text-sm text-gray-500 ml-1">gap</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-emerald-600">{metrics.facilitatorScore}</span>
                    <span className="text-xs text-gray-500 block">facilitatorer</span>
                  </div>
                </div>
              </div>

              {/* Risk/Protection */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-5 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 text-sm">Balans</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-3xl font-bold ${
                    metrics.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {metrics.balance >= 0 ? '+' : ''}{metrics.balance}
                  </span>
                  {metrics.balance >= 2 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : metrics.balance <= -2 ? (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  ) : (
                    <Minus className="w-5 h-5 text-amber-500" />
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Risk: {metrics.riskFactors} | Skydd: {metrics.protectionFactors}
                </div>
              </div>

              {/* Resilience Score */}
              <div className="col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-5 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">Resilience Score</span>
                  </div>
                  <span className={`text-4xl font-black ${
                    metrics.resilience >= 7 ? 'text-emerald-600' :
                    metrics.resilience >= 5 ? 'text-amber-600' :
                    metrics.resilience >= 3 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {metrics.resilience}/10
                  </span>
                </div>

                {/* Resilience bar */}
                <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`absolute h-full rounded-full transition-all duration-500 ${
                      metrics.resilience >= 7 ? 'bg-gradient-to-r from-emerald-400 to-teal-500' :
                      metrics.resilience >= 5 ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                      metrics.resilience >= 3 ? 'bg-gradient-to-r from-orange-400 to-red-500' :
                      'bg-gradient-to-r from-red-500 to-rose-600'
                    }`}
                    style={{ width: `${metrics.resilience * 10}%` }}
                  />
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  {metrics.resilience >= 7 ? 'Hög motståndskraft - Goda skyddsfaktorer' :
                   metrics.resilience >= 5 ? 'Medelhög motståndskraft - Balanserad situation' :
                   metrics.resilience >= 3 ? 'Låg motståndskraft - Förstärk skyddsfaktorer' :
                   'Mycket låg motståndskraft - Akuta insatser behövs'}
                </p>
              </div>
            </div>

            {/* Average Score */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Genomsnitt SHANARRI</span>
                <span className={`text-2xl font-bold ${getValueColor(Math.round(metrics.average))}`}>
                  {metrics.average.toFixed(1)}
                </span>
              </div>
              <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getValueBg(Math.round(metrics.average))}`}
                  style={{ width: `${(metrics.average / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Insights */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-5 shadow-lg hover:shadow-xl transition-all text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">Insikter & rekommendationer</span>
                </div>
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
              </div>

              {showDetails && (
                <div className="mt-4 space-y-3">
                  {metrics.gapScore > 0 && (
                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                      <p className="text-sm text-red-700">
                        {metrics.gapScore} ekrar visar stora gap (≤2). Dessa områden behöver prioriteras.
                      </p>
                    </div>
                  )}

                  {metrics.balance < 0 && (
                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                      <p className="text-sm text-amber-700">
                        Riskfaktorer dominerar. Fokusera på att stärka skyddsfaktorer.
                      </p>
                    </div>
                  )}

                  {metrics.facilitatorScore >= 5 && (
                    <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                      <p className="text-sm text-emerald-700">
                        {metrics.facilitatorScore} starka ekrar (≥4). Bygg vidare på dessa styrkor.
                      </p>
                    </div>
                  )}

                  {metrics.totalChange !== 0 && (
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                      {metrics.totalChange > 0 ? (
                        <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-blue-500 mt-0.5" />
                      )}
                      <p className="text-sm text-blue-700">
                        Total förändring från baseline: {metrics.totalChange > 0 ? '+' : ''}{metrics.totalChange} poäng
                      </p>
                    </div>
                  )}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-sm text-gray-400 font-light tracking-wide">
            Scenariogenerator • SHANARRI × ICF × Resilience Matrix • Interaktiv "tänk om..."-simulering
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScenarioGenerator;
