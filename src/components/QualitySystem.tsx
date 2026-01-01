
import React, { useState, memo, useMemo } from 'react';
import { QUALITY_CYCLE, SAFETY_TREND_DATA, QUALITY_INDICATORS } from '../data/constants';
import { CHILD_PROFILES } from '../data/childProfiles';
import { CheckCircle2, Clock, ArrowRight, BarChart3, Users, ClipboardCheck, TrendingUp, RefreshCcw, Target, Activity, Award, AlertTriangle, User } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { QualityIndicator } from '../types/types';

interface QualitySystemProps {
  selectedProfileId?: string;
}

const getProgressRatio = (indicator: QualityIndicator) => {
  const safeTarget = indicator.target <= 0 ? 0 : indicator.target;
  if (safeTarget === 0) return 0;
  const safeCurrent = Math.max(0, indicator.current);
  return safeCurrent / safeTarget;
};

const getGapPercent = (indicator: QualityIndicator) =>
  indicator.target <= 0 ? 0 : Math.max(0, Math.round((1 - getProgressRatio(indicator)) * 100));

const QualitySystem: React.FC<QualitySystemProps> = ({ selectedProfileId = 'erik' }) => {
  const childProfile = CHILD_PROFILES[selectedProfileId];
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);
  const [showMyYear, setShowMyYear] = useState(true);
  const [showSchoolAvg, setShowSchoolAvg] = useState(true);
  const improvementAreas = useMemo(
    () =>
      QUALITY_INDICATORS
        .filter(qi => qi.target > 0 && qi.current < qi.target)
        .sort((a, b) => getProgressRatio(a) - getProgressRatio(b)),
    [QUALITY_INDICATORS]
  );
  
  // Custom PDCA Wheel Component
  const PDCAWheel = () => {
    const size = 260;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 20;
    const thickness = 50;
    
    // Segments: Plan (Top Right), Do (Bottom Right), Check (Bottom Left), Act (Top Left)
    const segments = [
      { id: 'plan', label: 'PLANERA', color: '#005595', path: `M ${cx} ${cy-r} A ${r} ${r} 0 0 1 ${cx+r} ${cy} L ${cx+r-thickness} ${cy} A ${r-thickness} ${r-thickness} 0 0 0 ${cx} ${cy-r+thickness} Z` },
      { id: 'map', label: 'GÖRA', color: '#378056', path: `M ${cx+r} ${cy} A ${r} ${r} 0 0 1 ${cx} ${cy+r} L ${cx} ${cy+r-thickness} A ${r-thickness} ${r-thickness} 0 0 0 ${cx+r-thickness} ${cy} Z` },
      { id: 'analyze', label: 'UTVÄRDERA', color: '#E87C00', path: `M ${cx} ${cy+r} A ${r} ${r} 0 0 1 ${cx-r} ${cy} L ${cx-r+thickness} ${cy} A ${r-thickness} ${r-thickness} 0 0 0 ${cx} ${cy+r-thickness} Z` },
      { id: 'evaluate', label: 'AGERA', color: '#B00020', path: `M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx} ${cy-r} L ${cx} ${cy-r+thickness} A ${r-thickness} ${r-thickness} 0 0 0 ${cx-r+thickness} ${cy} Z` }
    ];

    // Find active phase index to highlight
    const activeIndex = QUALITY_CYCLE.findIndex(q => q.status === 'active');

    return (
      <div className="relative flex justify-center items-center py-4">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
             <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
               <feGaussianBlur stdDeviation="3" result="blur" />
               <feComposite in="SourceGraphic" in2="blur" operator="over" />
             </filter>
          </defs>

          {segments.map((seg, i) => {
            const isPhaseActive = QUALITY_CYCLE[i]?.status === 'active';
            const isHovered = hoveredPhase === seg.id;
            const highlight = isPhaseActive || isHovered;

            return (
              <g 
                key={seg.id} 
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredPhase(seg.id)}
                onMouseLeave={() => setHoveredPhase(null)}
                style={{ filter: highlight ? 'url(#glow)' : 'none' }}
              >
                <path 
                  d={seg.path} 
                  fill={seg.color} 
                  fillOpacity={highlight ? 1 : 0.6} 
                  stroke="white" 
                  strokeWidth="2" 
                  className="transition-all duration-300"
                  transform={highlight ? "scale(1.02)" : "scale(1)"}
                  style={{ transformOrigin: `${cx}px ${cy}px` }}
                />
                <text 
                  x={i === 0 ? cx + 60 : i === 1 ? cx + 60 : i === 2 ? cx - 60 : cx - 60} 
                  y={i === 0 ? cy - 60 : i === 1 ? cy + 60 : i === 2 ? cy + 60 : cy - 60}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="11"
                  fontWeight="bold"
                  style={{ 
                    pointerEvents: 'none',
                    textShadow: '0px 1px 3px rgba(0,0,0,0.5)'
                  }}
                >
                  {seg.label}
                </text>
              </g>
            );
          })}
          
          {/* Flow Arrows (Visual Only) */}
          <g opacity="0.4" fill="#666">
             {/* Top Right to Bottom Right */}
             <path d={`M ${cx + r + 8} ${cy - 10} Q ${cx + r + 12} ${cy} ${cx + r + 8} ${cy + 10} L ${cx + r + 4} ${cy + 6} M ${cx + r + 8} ${cy + 10} L ${cx + r + 12} ${cy + 6}`} stroke="#666" strokeWidth="2" fill="none" />
             {/* Bottom Right to Bottom Left */}
             <path d={`M ${cx + 10} ${cy + r + 8} Q ${cx} ${cy + r + 12} ${cx - 10} ${cy + r + 8} L ${cx - 6} ${cy + r + 4} M ${cx - 10} ${cy + r + 8} L ${cx - 6} ${cy + r + 12}`} stroke="#666" strokeWidth="2" fill="none" />
             {/* Bottom Left to Top Left */}
             <path d={`M ${cx - r - 8} ${cy + 10} Q ${cx - r - 12} ${cy} ${cx - r - 8} ${cy - 10} L ${cx - r - 4} ${cy - 6} M ${cx - r - 8} ${cy - 10} L ${cx - r - 12} ${cy - 6}`} stroke="#666" strokeWidth="2" fill="none" />
             {/* Top Left to Top Right */}
             <path d={`M ${cx - 10} ${cy - r - 8} Q ${cx} ${cy - r - 12} ${cx + 10} ${cy - r - 8} L ${cx + 6} ${cy - r - 4} M ${cx + 10} ${cy - r - 8} L ${cx + 6} ${cy - r - 12}`} stroke="#666" strokeWidth="2" fill="none" />
          </g>

          {/* Center Text */}
          <circle cx={cx} cy={cy} r={r-thickness-5} fill="white" stroke="#e5e7eb" />
          <text x={cx} y={cy-5} textAnchor="middle" fontWeight="bold" fontSize="14" fill="#1F1F1F">SKA</text>
          <text x={cx} y={cy+10} textAnchor="middle" fontSize="10" fill="#6b7280">Systematiskt</text>
          <text x={cx} y={cy+20} textAnchor="middle" fontSize="10" fill="#6b7280">Kvalitetsarbete</text>
        </svg>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white mb-4 shadow-lg">
          <ClipboardCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trygghet & Kvalitetsarbete</h1>
        <p className="text-gray-600">
          Gävlemodellen • Systematiskt trygghetsarbete enligt PDCA
        </p>
      </div>

      {/* Current Phase Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-6 items-start">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Systematiskt kvalitetsarbete</h2>
            <p className="text-sm text-gray-600">
              Skolans arbete för trygghet och studiero följer en systematisk process (PDCA).
              Här ser du hur Eriks individuella upplevelser bidrar till skolans utveckling och hur vi arbetar förebyggande.
            </p>
          </div>
          <div className="bg-teal-50 px-5 py-4 rounded-xl border border-teal-100">
             <div className="text-xs font-medium text-teal-600 uppercase tracking-wide mb-1">Aktuell Fas</div>
             <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
               <Clock size={18} className="text-teal-600"/>
               Analys & Åtgärd
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Cycle Visualization */}
        <div className="lg:col-span-2 space-y-6">

           {/* Trend Chart Section */}
           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                     <TrendingUp className="w-5 h-5 text-emerald-600" />
                   </div>
                   <h3 className="font-semibold text-gray-900">Trend: Upplevd Trygghet</h3>
                 </div>
                 <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">Gävlemodellenkät</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SAFETY_TREND_DATA}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#005595" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#005595" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                    <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                      formatter={(value: number) => [value, 'Trygghetsindex']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#005595" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorScore)" 
                      name="Eriks Årskurs"
                      hide={!showMyYear}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="schoolAvg" 
                      stroke="#9ca3af" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      fill="none" 
                      name="Skolsnitt"
                      hide={!showSchoolAvg}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex gap-3 text-xs justify-center">
                 <button
                   onClick={() => setShowMyYear(!showMyYear)}
                   className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                     showMyYear
                       ? 'bg-blue-50 text-blue-700 font-medium'
                       : 'bg-gray-50 text-gray-400'
                   }`}
                 >
                    <div className={`w-2.5 h-2.5 rounded-full ${showMyYear ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    <span>Eriks Årskurs</span>
                 </button>
                 <button
                   onClick={() => setShowSchoolAvg(!showSchoolAvg)}
                   className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                     showSchoolAvg
                       ? 'bg-gray-100 text-gray-700 font-medium'
                       : 'bg-gray-50 text-gray-400'
                   }`}
                 >
                    <div className="w-4 h-0 border-t-2 border-dashed border-current"></div>
                    <span>Skolsnitt</span>
                 </button>
              </div>
           </div>

           {/* The PDCA Cycle & Gävlemodellen Timeline */}
           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
             <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                 <RefreshCcw className="w-5 h-5 text-blue-600" />
               </div>
               <h3 className="font-semibold text-gray-900">Förbättringshjul (PDCA)</h3>
             </div>

             <div className="flex flex-col md:flex-row items-center gap-8">
                 {/* Left: PDCA Wheel */}
                 <div className="shrink-0">
                    <PDCAWheel />
                 </div>

                 {/* Right: Linear Timeline */}
                 <div className="flex-1 w-full relative">
                    <div className="absolute left-6 top-2 bottom-6 w-0.5 bg-gray-200 -translate-x-1/2 -z-0 rounded-full"></div>
                    <div className="space-y-5">
                        {QUALITY_CYCLE.map((phase, index) => {
                        const isActive = phase.status === 'active';
                        const isCompleted = phase.status === 'completed';
                        const isHovered = hoveredPhase === phase.id;

                        return (
                            <div
                              key={phase.id}
                              className={`relative flex gap-4 transition-all duration-300 cursor-pointer p-2 rounded-xl ${isHovered ? 'bg-gray-50' : ''} ${isActive || isHovered ? 'opacity-100' : 'opacity-70'}`}
                              onMouseEnter={() => setHoveredPhase(phase.id)}
                              onMouseLeave={() => setHoveredPhase(null)}
                            >
                                <div className={`z-10 w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                                isActive
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : isCompleted
                                    ? 'bg-emerald-500 text-white'
                                    : isHovered
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-100 text-gray-400'
                                }`}>
                                {isCompleted ? <CheckCircle2 size={18} /> : <span className="font-semibold text-sm">{index + 1}</span>}
                                </div>
                                <div>
                                    <h4 className={`font-semibold text-sm transition-colors ${isActive || isHovered ? 'text-blue-600' : 'text-gray-700'}`}>
                                      {phase.title}
                                    </h4>
                                    <span className="text-xs text-gray-500 block mb-1">{phase.period}</span>
                                    <div className="flex flex-wrap gap-1">
                                        {phase.activities.slice(0, 2).map(act => (
                                            <span key={act} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-md text-gray-600">{act}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                        })}
                    </div>
                 </div>
             </div>
           </div>
        </div>

        {/* Individual Contribution Side Panel */}
        <div className="space-y-6">
           {/* My Contribution */}
           <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Min del i systemet</h3>
              </div>
              <p className="text-sm text-gray-600 mb-5">
                Så här bidrar Erik till skolans gemensamma kvalitetsarbete.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                  <CheckCircle2 size={16} className="text-emerald-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm text-gray-900">Trygghetsenkät v.42</div>
                    <div className="text-xs text-gray-600 mt-0.5">Genomförd 2025-10-14. Hög trivsel men viss oro på raster.</div>
                  </div>
                </div>

                <div className="flex items-center justify-center py-1 text-gray-300">
                  <ArrowRight size={14} className="rotate-90" />
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <BarChart3 size={16} className="text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm text-gray-900">Klassanalys Åk 4</div>
                    <div className="text-xs text-gray-600 mt-0.5">Flera elever upplever rasten otrygg.</div>
                  </div>
                </div>

                 <div className="flex items-center justify-center py-1 text-gray-300">
                  <ArrowRight size={14} className="rotate-90" />
                </div>

                <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl">
                  <ClipboardCheck size={16} className="text-emerald-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm text-gray-900">Åtgärd: Rastaktiviteter</div>
                    <div className="text-xs text-gray-600 mt-0.5">Styrda aktiviteter och fler vuxna (Trygghetsvärdar).</div>
                  </div>
                </div>
              </div>
           </div>

           {/* Documentation Link */}
           <div className="bg-red-50 rounded-2xl border border-red-200 p-5">
              <h3 className="font-semibold text-red-700 mb-2">Likabehandlingsplan</h3>
              <p className="text-sm text-gray-600 mb-4">
                Stigslundsskolans plan mot diskriminering och kränkande behandling.
              </p>
              <button className="text-sm bg-white border border-red-200 text-red-700 px-4 py-2.5 rounded-xl font-medium hover:bg-red-600 hover:text-white hover:border-red-600 transition-all w-full">
                Läs planen (PDF)
              </button>
           </div>
        </div>

      </div>

      {/* Gävlemodellens Kvalitetsindikatorer */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Kvalitetsindikatorer</h2>
              <p className="text-sm text-gray-500">Gävlemodellens hörnstenar</p>
            </div>
          </div>
          <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
            Uppdaterad: Nov 2025
          </span>
        </div>

        {/* Tabs for indicator types */}
        <div className="flex gap-1 mb-6 p-1 bg-gray-100 rounded-xl w-fit">
          <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg">
            Alla
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
            Process
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
            Resultat
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
            Långsiktig
          </button>
        </div>

        {/* Quality Indicators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUALITY_INDICATORS.map((indicator) => {
            const progress = getProgressRatio(indicator) * 100;
            const meetsTarget = indicator.current >= indicator.target;
            const isNearTarget = progress >= 85 && progress < 100;

            return (
              <div
                key={indicator.id}
                className={`bg-white rounded-xl border p-4 hover:shadow-md transition-all ${
                  meetsTarget ? 'border-emerald-200 bg-emerald-50/50' :
                  isNearTarget ? 'border-amber-200 bg-amber-50/50' :
                  'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                        indicator.type === 'process' ? 'bg-blue-100 text-blue-700' :
                        indicator.type === 'result' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {indicator.type === 'process' ? 'Process' :
                         indicator.type === 'result' ? 'Resultat' :
                         'Långsiktig'}
                      </span>
                      {indicator.gavleModelPillar && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                          {indicator.gavleModelPillar === 'mapping' ? '🗺️' :
                           indicator.gavleModelPillar === 'collaboration' ? '🤝' :
                           indicator.gavleModelPillar === 'followup' ? '📊' :
                           '🚀'}
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-sm text-gray-900 leading-tight">
                      {indicator.name}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                  {indicator.description}
                </p>

                {/* Progress visualization */}
                <div className="mb-3">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="text-xl font-bold text-gray-900">
                      {indicator.current}{indicator.unit}
                    </span>
                    <span className="text-xs text-gray-500">
                      Mål: {indicator.target}{indicator.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        meetsTarget ? 'bg-emerald-500' :
                        isNearTarget ? 'bg-amber-500' :
                        'bg-orange-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Trend indicator */}
                <div className="flex items-center justify-between text-xs">
                  <div className={`flex items-center gap-1 font-medium ${
                    indicator.trend === 'improving' ? 'text-emerald-600' :
                    indicator.trend === 'stable' ? 'text-gray-500' :
                    'text-red-600'
                  }`}>
                    {indicator.trend === 'improving' ? (
                      <>
                        <TrendingUp size={12} />
                        <span>Förbättras</span>
                      </>
                    ) : indicator.trend === 'stable' ? (
                      <>
                        <Activity size={12} />
                        <span>Stabil</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp size={12} className="rotate-180" />
                        <span>Försämras</span>
                      </>
                    )}
                  </div>
                  {meetsTarget && (
                    <div className="flex items-center gap-1 text-emerald-600">
                      <Award size={12} />
                      <span className="font-medium">Uppnått</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {QUALITY_INDICATORS.filter(qi => qi.current >= qi.target).length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Uppnådda mål</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {QUALITY_INDICATORS.filter(qi => qi.trend === 'improving').length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Förbättras</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-500">
              {QUALITY_INDICATORS.filter(qi => qi.trend === 'stable').length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Stabila</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(QUALITY_INDICATORS.reduce((sum, qi) => sum + (qi.current / qi.target) * 100, 0) / QUALITY_INDICATORS.length)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">Snittuppfyllelse</div>
          </div>
        </div>

        {/* Improvement focus */}
        {improvementAreas.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 text-sm font-medium text-red-600 mb-3">
              <AlertTriangle size={14} />
              Identifierade förbättringsområden
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {improvementAreas.map((indicator) => {
                const gapPercent = getGapPercent(indicator);
                return (
                  <div
                    key={indicator.id}
                    className="bg-red-50 border border-red-200 rounded-xl p-3"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium text-sm text-gray-900 leading-tight">
                        {indicator.name}
                      </h4>
                      <span className="text-xs font-medium text-red-600 bg-white border border-red-200 rounded-md px-2 py-0.5">
                        {gapPercent}% kvar
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-2">
                      {indicator.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Nu: {indicator.current}{indicator.unit}</span>
                      <span>Mål: {indicator.target}{indicator.unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(QualitySystem);
