
import React, { useState } from 'react';
import { QUALITY_CYCLE, SAFETY_TREND_DATA } from '../constants';
import { CheckCircle2, Clock, ArrowRight, BarChart3, Users, ClipboardCheck, TrendingUp, RefreshCcw } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const QualitySystem: React.FC = () => {
  const [hoveredPhase, setHoveredPhase] = useState<string | null>(null);
  const [showMyYear, setShowMyYear] = useState(true);
  const [showSchoolAvg, setShowSchoolAvg] = useState(true);
  
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
    <div className="space-y-8 animate-fade-in">
      
      {/* Header with context */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between gap-6 items-start">
        <div>
          <h2 className="text-2xl font-bold text-[#1F1F1F] mb-2">Gävlemodellen & Systematiskt Kvalitetsarbete</h2>
          <p className="text-gray-600 max-w-2xl">
            Skolans arbete för trygghet och studiero följer en systematisk process (PDCA). 
            Här ser du hur Eriks individuella upplevelser bidrar till skolans utveckling och hur vi arbetar förebyggande.
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
           <div className="text-sm font-bold text-[#005595] uppercase tracking-wider mb-1">Aktuell Fas</div>
           <div className="text-xl font-bold text-[#1F1F1F] flex items-center gap-2">
             <Clock size={20} className="text-[#005595]"/>
             Analys & Åtgärd
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Cycle Visualization */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* Trend Chart Section */}
           <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg text-[#1F1F1F] flex items-center gap-2">
                   <TrendingUp className="text-[#378056]" />
                   Trend: Upplevd Trygghet (Stigslundsskolan)
                 </h3>
                 <span className="text-xs text-gray-500">Källa: Gävlemodellenkät (aggregerat)</span>
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
              <div className="mt-4 flex gap-4 text-xs justify-center">
                 <button 
                   onClick={() => setShowMyYear(!showMyYear)}
                   className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border ${
                     showMyYear 
                       ? 'bg-blue-50 border-blue-200 text-[#005595] font-semibold' 
                       : 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'
                   }`}
                 >
                    <div className={`w-3 h-3 rounded-full ${showMyYear ? 'bg-[#005595]' : 'bg-gray-400'}`}></div>
                    <span>Eriks Årskurs</span>
                 </button>
                 <button 
                   onClick={() => setShowSchoolAvg(!showSchoolAvg)}
                   className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border ${
                     showSchoolAvg 
                       ? 'bg-gray-100 border-gray-300 text-gray-700 font-semibold' 
                       : 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'
                   }`}
                 >
                    <div className="w-4 h-0 border-t-2 border-dashed border-current"></div>
                    <span>Skolsnitt</span>
                 </button>
              </div>
           </div>

           {/* The PDCA Cycle & Gävlemodellen Timeline */}
           <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
             <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                <h3 className="font-bold text-lg text-[#1F1F1F] flex items-center gap-2">
                    <RefreshCcw className="text-[#005595]" />
                    Förbättringshjul (PDCA)
                </h3>
             </div>

             <div className="flex flex-col md:flex-row items-center gap-8">
                 {/* Left: PDCA Wheel */}
                 <div className="shrink-0">
                    <PDCAWheel />
                 </div>

                 {/* Right: Linear Timeline */}
                 <div className="flex-1 w-full relative">
                    <div className="absolute left-6 top-2 bottom-6 w-1 bg-gray-300 -translate-x-1/2 -z-0 rounded-full"></div>
                    <div className="space-y-6">
                        {QUALITY_CYCLE.map((phase, index) => {
                        const isActive = phase.status === 'active';
                        const isCompleted = phase.status === 'completed';
                        const isHovered = hoveredPhase === phase.id;
                        
                        return (
                            <div 
                              key={phase.id} 
                              className={`relative flex gap-4 transition-all duration-300 cursor-pointer p-2 rounded-lg ${isHovered ? 'bg-gray-50' : ''} ${isActive || isHovered ? 'opacity-100' : 'opacity-70'}`}
                              onMouseEnter={() => setHoveredPhase(phase.id)}
                              onMouseLeave={() => setHoveredPhase(null)}
                            >
                                <div className={`z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 transition-all bg-white ${
                                isActive 
                                    ? 'bg-[#005595] text-white border-blue-100 scale-105 shadow' 
                                    : isCompleted 
                                    ? 'bg-[#378056] text-white border-green-100' 
                                    : isHovered
                                    ? 'border-[#005595] text-[#005595]'
                                    : 'text-gray-400 border-gray-200'
                                }`}>
                                {isCompleted ? <CheckCircle2 size={20} /> : <span className="font-bold text-sm">{index + 1}</span>}
                                </div>
                                <div>
                                    <h4 className={`font-bold text-sm transition-colors ${isActive || isHovered ? 'text-[#005595]' : 'text-gray-700'}`}>
                                      {phase.title}
                                    </h4>
                                    <span className="text-xs text-gray-500 block mb-1">{phase.period}</span>
                                    <div className="flex flex-wrap gap-1">
                                        {phase.activities.slice(0, 2).map(act => (
                                            <span key={act} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600 border border-gray-200">{act}</span>
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
           <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-lg text-[#1F1F1F] mb-4 flex items-center gap-2">
                 <Users size={20} className="text-[#E87C00]" />
                 Min del i systemet
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Så här bidrar Erik till skolans gemensamma kvalitetsarbete. All data anonymiseras på gruppnivå.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-[#EBF4FA] rounded border border-blue-100">
                  <CheckCircle2 size={18} className="text-[#378056] mt-0.5" />
                  <div>
                    <div className="font-bold text-sm text-[#1F1F1F]">Trygghetsenkät v.42</div>
                    <div className="text-xs text-gray-600">Genomförd 2025-10-14. Erik signalerade hög trivsel men viss oro på raster.</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center py-2 text-gray-400">
                  <ArrowRight size={16} className="rotate-90" />
                </div>

                <div className="flex items-start gap-3 p-3 bg-white rounded border border-gray-200">
                  <BarChart3 size={18} className="text-[#005595] mt-0.5" />
                  <div>
                    <div className="font-bold text-sm text-[#1F1F1F]">Klassanalys Åk 4</div>
                    <div className="text-xs text-gray-600">Resultatet visade att flera elever upplever rasten otrygg.</div>
                  </div>
                </div>

                 <div className="flex items-center justify-center py-2 text-gray-400">
                  <ArrowRight size={16} className="rotate-90" />
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 rounded border border-green-100">
                  <ClipboardCheck size={18} className="text-[#378056] mt-0.5" />
                  <div>
                    <div className="font-bold text-sm text-[#1F1F1F]">Åtgärd: Rastaktiviteter</div>
                    <div className="text-xs text-gray-600">Skolan har infört styrda rastaktiviteter och fler vuxna ute (Trygghetsvärdar).</div>
                  </div>
                </div>
              </div>
           </div>

           {/* Documentation Link */}
           <div className="bg-[#FFF4F0] rounded-lg border border-[#B00020] p-6">
              <h3 className="font-bold text-[#B00020] mb-2">Likabehandlingsplan</h3>
              <p className="text-sm text-gray-700 mb-4">
                Stigslundsskolans plan mot diskriminering och kränkande behandling gäller hela läsåret.
              </p>
              <button className="text-sm bg-white border border-[#B00020] text-[#B00020] px-4 py-2 rounded font-semibold hover:bg-[#B00020] hover:text-white transition-colors w-full">
                Läs planen (PDF)
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default QualitySystem;
