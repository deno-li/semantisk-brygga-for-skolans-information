
import React, { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { SHANARRI_DATA } from '../constants';
import { Info, Tag, Database, Activity, Search, X, Smile, ThumbsUp, Heart, BookOpen, User, CheckCircle2, ExternalLink } from 'lucide-react';
import { ShanarriIndicator, Perspective } from '../types';

interface WelfareWheelProps {
  currentPerspective?: Perspective;
}

const childFriendlyTexts: Record<string, { meaning: string; action: string }> = {
  'safe': {
    meaning: "Att du känner dig lugn och trygg i skolan och hemma, utan bråk eller rädsla.",
    action: "Vi vuxna håller koll på rasterna och ser till att ingen är dum mot dig. Vi pratar direkt om något händer."
  },
  'nurtured': {
    meaning: "Att du har vuxna som bryr sig om dig, ger dig mat, kärlek och ett tryggt hem.",
    action: "Socialtjänsten och skolan pratar med din familj för att se till att allt funkar bra hemma."
  },
  'healthy': {
    meaning: "Att din kropp mår bra, att du äter, sover och rör på dig så att du orkar med skolan.",
    action: "Skolsköterskan kollar din syn och hörsel, och vi ser till att maten i skolan är bra och nyttig."
  },
  'active': {
    meaning: "Att du gör roliga saker på fritiden, som sport, lek eller hobbyer.",
    action: "Vi kan hjälpa dig att hitta en aktivitet du gillar, som fotboll eller musikskola, och se till att du kan ta dig dit."
  },
  'included': {
    meaning: "Att du har kompisar, känner dig välkommen och får vara med i gemenskapen.",
    action: "Lärarna jobbar med gruppövningar så att alla ska känna sig välkomna. Vi hjälper till om det blir ensamt."
  },
  'responsible': {
    meaning: "Att du lär dig ta ansvar för dina läxor, tider och hur du är mot andra.",
    action: "Vi hjälper dig med scheman och påminnelser så det blir lättare att komma ihåg och göra rätt."
  },
  'respected': {
    meaning: "Att vi vuxna lyssnar på vad du tycker och tänker, och tar det på allvar.",
    action: "Din mentor bokar tid för att prata med dig om hur du vill ha det i skolan. Din röst är viktig!"
  },
  'achieving': {
    meaning: "Att du lär dig nya saker, utvecklas och klarar skolans mål.",
    action: "Vi ger dig extra stöd i de ämnen som känns svåra, till exempel med en speciallärare eller inlästa böcker."
  }
};

const WelfareWheel: React.FC<WelfareWheelProps> = ({ currentPerspective }) => {
  const isChild = currentPerspective === 'child';
  const [activeChart, setActiveChart] = useState<'radar' | 'wheel'>('wheel');
  const [selectedIndicator, setSelectedIndicator] = useState<ShanarriIndicator | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Logic
  const filteredData = SHANARRI_DATA.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.nameEn.toLowerCase().includes(query) ||
      item.notes.toLowerCase().includes(query) ||
      item.icf.toLowerCase().includes(query)
    );
  });

  const hasData = filteredData.length > 0;

  // Custom Wheel Logic (SVG)
  const WheelChart = () => {
    const size = 400;
    const cx = size / 2;
    const cy = size / 2;
    const outerR = size / 2 - 20;
    const innerR = size / 6;
    const n = filteredData.length;

    if (!hasData) return null;

    return (
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full max-w-[400px] mx-auto animate-fade-in select-none">
        {filteredData.map((dim, i) => {
          const startAngle = (i * 360) / n - 90;
          const endAngle = ((i + 1) * 360) / n - 90;
          
          // Convert degrees to radians
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;

          // Coordinates
          const x1 = cx + Math.cos(startRad) * innerR;
          const y1 = cy + Math.sin(startRad) * innerR;
          const x2 = cx + Math.cos(startRad) * outerR;
          const y2 = cy + Math.sin(startRad) * outerR;
          const x3 = cx + Math.cos(endRad) * outerR;
          const y3 = cy + Math.sin(endRad) * outerR;
          const x4 = cx + Math.cos(endRad) * innerR;
          const y4 = cy + Math.sin(endRad) * innerR;

          // SVG Path Command
          const path = `M ${x1} ${y1} L ${x2} ${y2} A ${outerR} ${outerR} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerR} ${innerR} 0 0 0 ${x1} ${y1}`;
          
          // Color Logic based on status
          const isSelected = selectedIndicator?.id === dim.id;
          const baseOpacity = dim.status >= 3 ? 0.9 : 0.6;
          const opacity = isSelected ? 1 : (selectedIndicator ? 0.3 : baseOpacity);
          
          // Status Dot
          const midAngle = ((i + 0.5) * 360) / n - 90;
          const midRad = (midAngle * Math.PI) / 180;
          const statusR = outerR - 25;
          const statusX = cx + Math.cos(midRad) * statusR;
          const statusY = cy + Math.sin(midRad) * statusR;
          const statusColor = dim.status >= 4 ? '#22c55e' : dim.status >= 3 ? '#eab308' : '#ef4444';

          // Text Label Position
          const labelR = outerR - 60;
          const labelX = cx + Math.cos(midRad) * labelR;
          const labelY = cy + Math.sin(midRad) * labelR;

          return (
            <g 
              key={dim.id} 
              className={`cursor-pointer transition-transform duration-300 ease-out`}
              onClick={() => setSelectedIndicator(dim)}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            >
              <path 
                d={path} 
                fill={dim.color} 
                fillOpacity={opacity} 
                stroke="white" 
                strokeWidth={isSelected ? "4" : "2"}
                className={`transition-all duration-300 ${isSelected && isChild ? 'animate-child-pulse' : 'hover:opacity-100'}`}
              />
              <circle cx={statusX} cy={statusY} r="12" fill="white" fillOpacity="0.9" />
              <circle cx={statusX} cy={statusY} r="8" fill={statusColor} />
              
              <text 
                 x={labelX} 
                 y={labelY} 
                 textAnchor="middle" 
                 dominantBaseline="middle"
                 fill="white" 
                 fontSize="10" 
                 fontWeight="bold"
                 style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.3)' }}
                 pointerEvents="none"
              >
                {dim.name}
              </text>
            </g>
          );
        })}
        {/* Center Hub */}
        <circle 
          cx={cx} cy={cy} r={innerR - 5} 
          fill="white" stroke="#e5e7eb" strokeWidth="2" 
          className="cursor-pointer hover:fill-gray-50"
          onClick={() => setSelectedIndicator(null)}
        />
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1e3a8a" pointerEvents="none">BARNETS</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1e3a8a" pointerEvents="none">BÄSTA</text>
      </svg>
    );
  };

  const childText = selectedIndicator ? childFriendlyTexts[selectedIndicator.id] : null;

  return (
    <div className={`rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in ${isChild ? 'bg-orange-50/30' : 'bg-white'}`}>
      <style>{`
        @keyframes child-pulse {
          0% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.08); filter: brightness(1.25) drop-shadow(0 0 10px rgba(0,0,0,0.2)); }
          100% { transform: scale(1); filter: brightness(1); }
        }
        .animate-child-pulse {
          animation: child-pulse 1.5s infinite ease-in-out;
          transform-box: fill-box;
          transform-origin: center;
          z-index: 10;
        }
      `}</style>

      <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            🎯 {isChild ? "Ditt Välbefinnande" : "Välbefinnandehjul (Gävlemodellen)"}
          </h2>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            {isChild 
              ? "Klicka på en tårtbit för att se vad skolan och de vuxna gör för att hjälpa dig." 
              : "Detta hjul är det pedagogiska gränssnittet. Klicka på en tårtbit för att se hur elevens upplevelse mappas mot tekniska standarder (ICF, BBIC, KSI)."}
          </p>
        </div>
        
        {!isChild && (
          <div className="flex flex-col sm:flex-row gap-3 xl:items-center">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Sök indikator..." 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                    }}
                    className="pl-9 pr-8 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#005595] focus:ring-1 focus:ring-[#005595] w-full"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  )}
              </div>

              {/* Chart Toggles */}
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg shrink-0">
                <button
                  onClick={() => setActiveChart('wheel')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeChart === 'wheel' ? 'bg-[#005595] text-white shadow' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Hjuldiagram
                </button>
                <button
                  onClick={() => setActiveChart('radar')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeChart === 'radar' ? 'bg-[#005595] text-white shadow' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Spindeldiagram
                </button>
              </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Area */}
        <div className="h-[450px] flex items-center justify-center bg-gray-50 rounded-xl relative overflow-hidden border border-gray-100">
          {!hasData ? (
             <div className="text-center text-gray-400">
                <Search size={48} className="mx-auto mb-2 opacity-20" />
                <p>Inga indikatorer matchar "{searchQuery}"</p>
             </div>
          ) : activeChart === 'radar' && !isChild ? (
             <ResponsiveContainer width="100%" height="100%">
               <RadarChart cx="50%" cy="50%" outerRadius="80%" data={filteredData}>
                 <PolarGrid />
                 <PolarAngleAxis dataKey="name" tick={{ fontSize: 12, fill: '#4b5563' }} />
                 <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} />
                 <Radar
                   name="Status"
                   dataKey="status"
                   stroke="#005595"
                   fill="#005595"
                   fillOpacity={0.4}
                 />
                 <Tooltip />
               </RadarChart>
             </ResponsiveContainer>
          ) : (
            <WheelChart />
          )}
          
          {/* Helper Text */}
          {!selectedIndicator && activeChart === 'wheel' && hasData && (
            <div className="absolute bottom-4 text-xs text-gray-400 italic">
              {isChild ? "Klicka på en färg för att läsa mer" : "Klicka på en del för att se kodning"}
            </div>
          )}
        </div>

        {/* Details & Coding Panel */}
        <div className="flex flex-col h-full">
          {selectedIndicator ? (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full flex flex-col animate-fade-in">
              {/* Header */}
              <div className="p-5 border-b border-gray-100" style={{ borderTop: `4px solid ${selectedIndicator.color}` }}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold text-gray-800">{selectedIndicator.name}</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    selectedIndicator.status >= 4 ? 'bg-green-100 text-green-700' :
                    selectedIndicator.status === 3 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {isChild 
                      ? (selectedIndicator.status >= 4 ? 'Går bra! 😃' : 'Vi jobbar på det 💪')
                      : `Nivå ${selectedIndicator.status}/5`
                    }
                  </div>
                </div>
                {!isChild && <p className="text-gray-600 italic">"{selectedIndicator.notes}"</p>}
                {!isChild && <div className="mt-2 text-xs text-gray-400">Källa: {selectedIndicator.source}</div>}
              </div>

              {isChild ? (
                /* CHILD FRIENDLY PANEL */
                <div className="p-6 flex-1 bg-gradient-to-b from-white to-orange-50/30 overflow-y-auto">
                   <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm">
                         <h4 className="font-bold text-[#005595] mb-2 flex items-center gap-2">
                           <Smile size={20} /> Vad betyder det här?
                         </h4>
                         <p className="text-gray-700 text-sm leading-relaxed">
                           {childText ? childText.meaning : "Det här handlar om hur du har det i skolan och på fritiden."}
                         </p>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg border border-green-100 shadow-sm">
                         <h4 className="font-bold text-[#378056] mb-2 flex items-center gap-2">
                           <ThumbsUp size={20} /> Vad gör skolan?
                         </h4>
                         <ul className="text-sm text-gray-700 space-y-2">
                           <li className="flex items-start gap-2">
                             <CheckCircle2 size={16} className="text-green-600 mt-0.5 shrink-0"/>
                             <span>{childText ? childText.action : "Vi pratar med dig för att se till att du trivs."}</span>
                           </li>
                           {selectedIndicator.status < 4 && (
                              <li className="flex items-start gap-2">
                                <CheckCircle2 size={16} className="text-green-600 mt-0.5 shrink-0"/>
                                <span>Vi har satt in extra stöd (se din Plan).</span>
                              </li>
                           )}
                         </ul>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-4 justify-center">
                        <Heart size={12} fill="#e5e7eb" /> Du är viktig för oss!
                      </div>
                   </div>
                </div>
              ) : (
                /* PROFESSIONAL / STANDARD PANEL */
                <div className="p-5 flex-1 overflow-y-auto bg-gray-50">
                  <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Database size={16} />
                    Semantisk Mappning (Interoperabilitet)
                  </h4>
                  
                  {/* Visual Bridge Container */}
                  <div className="flex flex-col items-center space-y-2">
                    
                    {/* 1. Pedagogical Level */}
                    <div className="w-full bg-white p-3 rounded border border-gray-200 shadow-sm text-center relative">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pedagogiskt Gränssnitt</div>
                      <div className="font-bold text-[#1F1F1F] flex items-center justify-center gap-2">
                         <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedIndicator.color }}></div>
                         {selectedIndicator.name}
                      </div>
                      {/* Connection Line */}
                      <div className="absolute left-1/2 -bottom-3 w-0.5 h-3 bg-gray-300"></div>
                    </div>

                    {/* Arrow */}
                    <div className="text-gray-300">▼</div>

                    {/* 2. The Bridge (ICF) - Emphasized */}
                    <div className="w-full bg-gradient-to-r from-[#6A2A5B] to-[#4A1A3B] p-4 rounded-lg shadow-md text-white relative z-10 ring-4 ring-purple-50 group hover:ring-purple-200 transition-all">
                       <div className="flex justify-between items-start mb-2">
                         <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded uppercase tracking-wider">Navet / Semantisk Brygga</span>
                         <a 
                            href="https://klassifikationer.socialstyrelsen.se/ICF/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-purple-200 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                            title="Öppna Socialstyrelsens Klassifikationsdatabas (ICF)"
                         >
                           <ExternalLink size={16} />
                         </a>
                       </div>
                       <div className="text-center py-2">
                         <div className="text-2xl font-mono font-bold tracking-tight drop-shadow-md text-white">
                            {selectedIndicator.icf}
                         </div>
                         <div className="text-xs text-purple-200 mt-1 font-medium flex items-center justify-center gap-1">
                            ICF Funktionstillstånd
                            <ExternalLink size={10} className="opacity-50" />
                         </div>
                       </div>
                       {/* Connection Line */}
                       <div className="absolute left-1/2 -bottom-3 w-0.5 h-3 bg-[#6A2A5B]"></div>
                    </div>

                    {/* Arrow Branching */}
                    <div className="text-[#6A2A5B]">▼</div>

                    {/* 3. Technical Standards */}
                    <div className="grid grid-cols-2 gap-3 w-full">
                      {/* BBIC */}
                      <div className="bg-white p-2.5 rounded border-l-4 border-red-500 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-[10px] font-bold text-gray-400 mb-0.5 uppercase">Socialtjänst (BBIC)</div>
                        <div className="font-medium text-sm text-gray-800 leading-tight">{selectedIndicator.bbic}</div>
                      </div>

                      {/* KSI */}
                       <div className="bg-white p-2.5 rounded border-l-4 border-gray-500 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-[10px] font-bold text-gray-400 mb-0.5 uppercase">KSI (Klassifikation)</div>
                        <div className="font-mono text-sm text-gray-800 leading-tight">{selectedIndicator.ksi}</div>
                      </div>

                      {/* IBIC */}
                      <div className="bg-white p-2.5 rounded border-l-4 border-orange-500 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-[10px] font-bold text-gray-400 mb-0.5 uppercase">Omsorg (IBIC)</div>
                        <div className="font-medium text-sm text-gray-800 leading-tight">{selectedIndicator.ibic}</div>
                      </div>

                      {/* KVÅ */}
                      <div className="bg-white p-2.5 rounded border-l-4 border-green-600 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-[10px] font-bold text-gray-400 mb-0.5 uppercase">Vård (KVÅ/ICD)</div>
                        <div className="font-mono text-sm text-gray-800 leading-tight">{selectedIndicator.kva}</div>
                        {selectedIndicator.icd && (
                          <div className="font-mono text-xs text-red-600 mt-1 bg-red-50 px-1 rounded inline-block">{selectedIndicator.icd}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 rounded-lg text-gray-400">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <Tag size={32} className="opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-gray-600">Ingen dimension vald</h3>
              <p className="text-sm mt-2 max-w-xs">
                {isChild 
                 ? "Klicka på en färg i hjulet för att se vad det betyder."
                 : "Klicka på en del av hjulet för att se hur den pedagogiska modellen kopplas till tekniska kodverk."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelfareWheel;
