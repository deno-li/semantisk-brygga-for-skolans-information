
import React, { useState, useMemo, useCallback, memo } from 'react';
import { TIMELINE_DATA, QUALITY_CYCLE, NEWS_FEED_DATA, ENHANCED_CHILD_PROFILE } from '../data/constants';
import { ArrowUpRight, Calendar, AlertCircle, CheckCircle2, ClipboardCheck, ArrowRight, Info, MessageCircle, Newspaper, Image as ImageIcon, Shield, ShieldAlert, TrendingUp, Users } from 'lucide-react';
import { Perspective, View } from '../types/types';
import MiniWellBeingWheel from './MiniWellBeingWheel';
import { useProfileData } from '../hooks/useProfileData';

interface DashboardProps {
  currentPerspective: Perspective;
  onNavigate: (view: View) => void;
  selectedProfileId?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ currentPerspective, onNavigate, selectedProfileId = 'erik' }) => {
  // Use custom hook to fetch profile data
  const { shanarriData, riskFactors, protectiveFactors, childProfile, needsAttention } = useProfileData(selectedProfileId);
  
  const nextMeeting = useMemo(() => TIMELINE_DATA[0], []);
  const currentQualityPhase = useMemo(() => QUALITY_CYCLE.find(q => q.status === 'active') || QUALITY_CYCLE[0], []);

  const isChild = currentPerspective === 'child';
  const isYouth = useMemo(() => isChild && childProfile.age >= 13, [isChild, childProfile.age]); 

  return (
    <div className="space-y-8 animate-fade-in text-[#1F1F1F]">
      
      {/* Intro Section - Adapted for Child/Youth */}
      <div>
        {isChild ? (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl border border-orange-100">
             <h2 className="text-2xl font-bold mb-2 text-[#E87C00]">Hej {childProfile.name.split(' ')[0]}! 👋</h2>
             <p className="text-gray-700 max-w-2xl">
               Här är din egen sida. Du har rätt att veta vad som skrivs om dig och vara med och bestämma. 
               Här kan du se din plan och vilka vuxna som stöttar dig.
             </p>
             <div className="mt-4 flex gap-2">
                <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-xs font-bold text-orange-600 shadow-sm border border-orange-100">
                  <Info size={14}/> Din rätt till information
                </span>
                <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-xs font-bold text-orange-600 shadow-sm border border-orange-100">
                  <MessageCircle size={14}/> Tyck till
                </span>
             </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2">Översikt</h2>
            <p className="text-gray-600">Samlad lägesbild över insatser och välbefinnande.</p>
          </>
        )}
      </div>

      {/* Well-being Wheel Overview Section */}
      <div
        onClick={() => onNavigate('shanarri')}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative min-h-[280px] flex flex-col md:flex-row hover:border-[#005595] hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="p-6 md:w-1/3 flex flex-col justify-center relative z-10 bg-white">
            <h3 className="text-lg font-bold text-[#1F1F1F] mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#005595]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2 L12 12 L17 17"/>
                </svg>
                {isChild ? "Ditt Välbefinnandehjul" : "Välbefinnandehjul"}
            </h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {isChild
                  ? "Klicka för att se mer."
                  : "SHANARRI-modellen visar barnets välbefinnande inom 8 dimensioner. Klicka för att utforska."}
            </p>
            {!isChild && (
              <div className="flex items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-semibold">
                  {shanarriData.filter(d => d.status >= 4).length} Bra
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs font-semibold">
                  {shanarriData.filter(d => d.status === 3).length} OK
                </span>
                {needsAttention > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-semibold">
                    {needsAttention} Behöver stöd
                  </span>
                )}
              </div>
            )}
            <div className="mt-4 flex items-center gap-2 text-[#005595] text-sm font-semibold group-hover:gap-3 transition-all">
              Se fullständigt hjul <ArrowRight size={16} />
            </div>
        </div>

        {/* Interactive Well-being Wheel */}
        <div className="md:w-2/3 bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 relative min-h-[280px] overflow-hidden flex items-center justify-center p-8">
            <div className="relative w-full max-w-[380px]">
              {(() => {
                const size = 380;
                const cx = size / 2;
                const cy = size / 2;
                const outerR = size / 2 - 20; // Outer radius for main wheel
                const innerR = size / 6; // Inner circle radius
                const textR = (outerR + innerR) / 2; // Position for text
                const indicatorR = outerR - 25; // Position for status indicators
                const n = shanarriData.length;

                return (
                  <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full drop-shadow-lg">
                    {shanarriData.map((dim, i) => {
                      const startAngle = (i * 360) / n - 90;
                      const endAngle = ((i + 1) * 360) / n - 90;
                      const midAngle = (startAngle + endAngle) / 2;

                      const startRad = (startAngle * Math.PI) / 180;
                      const endRad = (endAngle * Math.PI) / 180;

                      // Wheel segment coordinates
                      const x1 = cx + Math.cos(startRad) * innerR;
                      const y1 = cy + Math.sin(startRad) * innerR;
                      const x2 = cx + Math.cos(startRad) * outerR;
                      const y2 = cy + Math.sin(startRad) * outerR;
                      const x3 = cx + Math.cos(endRad) * outerR;
                      const y3 = cy + Math.sin(endRad) * outerR;
                      const x4 = cx + Math.cos(endRad) * innerR;
                      const y4 = cy + Math.sin(endRad) * innerR;

                      const path = `M ${x1} ${y1} L ${x2} ${y2} A ${outerR} ${outerR} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerR} ${innerR} 0 0 0 ${x1} ${y1}`;

                      // Text positioning
                      const textAngleRad = (midAngle * Math.PI) / 180;
                      const textX = cx + Math.cos(textAngleRad) * textR;
                      const textY = cy + Math.sin(textAngleRad) * textR;

                      // Status indicator positioning
                      const indicatorAngleRad = (midAngle * Math.PI) / 180;
                      const indicatorX = cx + Math.cos(indicatorAngleRad) * indicatorR;
                      const indicatorY = cy + Math.sin(indicatorAngleRad) * indicatorR;

                      // Status color based on value
                      const statusColor = dim.status >= 4 ? '#10b981' : dim.status === 3 ? '#fbbf24' : '#ef4444';

                      return (
                        <g key={dim.id}>
                          {/* Wheel segment */}
                          <path
                            d={path}
                            fill={dim.color}
                            stroke="white"
                            strokeWidth="3"
                            opacity="0.9"
                            className="transition-all group-hover:opacity-100"
                          />

                          {/* Dimension name */}
                          <text
                            x={textX}
                            y={textY}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="white"
                            fontSize="11"
                            fontWeight="700"
                            className="pointer-events-none uppercase tracking-wide"
                            transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                          >
                            {dim.name}
                          </text>

                          {/* Status indicator circle */}
                          <circle
                            cx={indicatorX}
                            cy={indicatorY}
                            r="8"
                            fill={statusColor}
                            stroke="white"
                            strokeWidth="2"
                            className="transition-all"
                          />
                        </g>
                      );
                    })}

                    {/* Center circle */}
                    <circle cx={cx} cy={cy} r={innerR} fill="white" stroke="#005595" strokeWidth="3"/>

                    {/* Center text */}
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#005595"
                      fontSize="14"
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      <tspan x={cx} dy="-8">BARNETS</tspan>
                      <tspan x={cx} dy="16">BÄSTA</tspan>
                    </text>
                  </svg>
                );
              })()}
            </div>
        </div>
      </div>

      {/* KPI Cards - Context Aware */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div
          onClick={() => onNavigate('sip')}
          className={`bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:border-[#005595] hover:shadow-md transition-all cursor-pointer group ${isChild ? 'hover:border-orange-400' : ''}`}
        >
          <div className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-2">
            {isChild ? "Min Plan" : "Aktiva Planer"}
          </div>
          <div className={`text-3xl font-bold transition-colors ${isChild ? 'text-[#E87C00]' : 'text-[#005595] group-hover:text-[#B00020]'}`}>
            1 <span className="text-sm font-normal text-gray-500">{isChild ? "Barnets plan / SIP" : "Barnets plan / SIP"}</span>
          </div>
        </div>
        <div className={`bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:border-[#005595] hover:shadow-md transition-all group ${isChild ? 'hover:border-orange-400' : ''}`}>
          <div className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-2">
            {isChild ? "Vuxna runt mig" : "Kontaktpersoner"}
          </div>
          <div className={`text-3xl font-bold transition-colors ${isChild ? 'text-[#E87C00]' : 'text-[#005595] group-hover:text-[#B00020]'}`}>
            5
          </div>
        </div>
        {!isChild && (
          <div
            onClick={() => onNavigate('shanarri')}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:border-[#005595] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-2">
              Välbefinnande
            </div>
            <div className="text-3xl font-bold text-[#378056]">7/8 <span className="text-sm font-normal text-gray-500">Bra!</span></div>
          </div>
        )}
        <div className={`bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:border-[#005595] hover:shadow-md transition-all group ${isChild ? 'hover:border-orange-400' : ''}`}>
          <div className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-2">
            {isChild ? "Vem får se?" : "Samtycken"}
          </div>
          <div className={`text-3xl font-bold transition-colors ${isChild ? 'text-[#E87C00]' : 'text-[#005595] group-hover:text-[#B00020]'}`}>
            3 <span className="text-sm font-normal text-gray-500">{isChild ? "Personer" : "Aktiva"}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 gap-6">
             {/* Active SIP Card */}
             <div className={`bg-white rounded-xl border overflow-hidden shadow-sm flex flex-col ${isChild ? 'border-orange-200' : 'border-blue-200'}`}>
              <div className={`px-4 py-3 flex justify-between items-center text-white ${isChild ? 'bg-[#E87C00]' : 'bg-[#005595]'}`}>
                 <h3 className="font-bold flex items-center gap-2 text-sm">
                   <div className={`w-2 h-2 rounded-full animate-pulse ${isChild ? 'bg-white' : 'bg-green-400'}`}></div>
                   {isChild ? "Min Plan" : "Aktiv"}
                 </h3>
                 <button
                   onClick={() => onNavigate('sip')}
                   className="text-xs bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded text-white font-semibold transition-colors"
                 >
                   {isChild ? "Läs" : "Öppna"}
                 </button>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className={`border-l-4 p-3 mb-4 ${isChild ? 'bg-orange-50 border-[#E87C00]' : 'bg-[#EBF4FA] border-[#005595]'}`}>
                  <p className="text-[#1F1F1F] font-medium text-sm italic">
                    "{isChild ? (childProfile.sipGoal?.child || "Målet är att jag ska bli bättre på att läsa och känna mig lugn i skolan.") : (childProfile.sipGoal?.professional || "Erik ska uppnå åldersadekvat läsförmåga och känna trygghet i sin skolsituation senast juni 2026.")}"
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                     <CheckCircle2 size={14} className="text-[#378056]"/>
                     <span className="font-semibold text-[#1F1F1F]">
                       {isChild ? "4 saker pågår" : "4 Insatser"}
                     </span>
                  </div>
                  <div className="flex items-center gap-1">
                     <Calendar size={14} className={isChild ? "text-[#E87C00]" : "text-[#005595]"}/>
                     <span>{isChild ? "Nästa:" : "Uppföljn:"} <strong className="text-[#1F1F1F]">15 Jan</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

           {/* Gävlemodellen Quick Status - Child Adapted */}
           <div
             onClick={() => onNavigate('quality')}
             className={`bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group ${isChild ? 'hover:border-orange-400' : 'hover:border-[#005595]'}`}
            >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-[#1F1F1F] flex items-center gap-2">
                  <ClipboardCheck size={20} className={isChild ? "text-[#E87C00]" : "text-[#005595]"} />
                  {isChild ? "Du svarade, vi lyssnade!" : "Gävlemodellen & Systematiskt trygghetsarbete"}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {isChild 
                    ? "Tack för att du var med i trygghetsenkäten. Just nu jobbar skolan med dina förslag." 
                    : <><span className="text-gray-500">Vi befinner oss i fas:</span> <strong className="text-[#005595]">{currentQualityPhase.title}</strong></>
                  }
                </p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${isChild ? 'bg-orange-100 text-[#E87C00]' : 'bg-blue-100 text-[#005595]'}`}>
                {isChild ? "Pågår nu" : "Läsår 25/26"}
              </span>
            </div>
            
            <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
               <div className={`h-2 rounded-full w-[65%] ${isChild ? 'bg-[#E87C00]' : 'bg-[#005595]'}`}></div>
            </div>

            <div className="flex items-center gap-4 text-sm">
               <div className="flex items-center gap-1.5 text-gray-700">
                 <CheckCircle2 size={16} className="text-[#378056]" />
                 <span>{isChild ? "Du har svarat" : "Enkät genomförd"}</span>
               </div>
               <div className="flex items-center gap-1.5 text-gray-700">
                 <ArrowRight size={16} className={isChild ? "text-[#E87C00]" : "text-[#005595]"} />
                 <span>{isChild ? "Skolan planerar aktiviteter" : "Analys pågår (Stigslundsskolan)"}</span>
               </div>
            </div>
          </div>

          {/* Attention Items */}
          {needsAttention > 0 && (
            <div className="bg-[#FFF4F0] rounded-xl border border-[#B00020] shadow-sm">
               <div className="px-6 py-4 border-b border-[#B00020]/20">
                 <h3 className="font-bold text-[#B00020] flex items-center gap-2">
                   <AlertCircle size={20} />
                   {isChild ? "Saker vi behöver fixa" : "Områden som kräver uppmärksamhet"}
                 </h3>
               </div>
               <div className="divide-y divide-[#B00020]/10">
                 {shanarriData.filter(d => d.status < 3).map(item => (
                   <div key={item.id} className="flex items-start gap-4 p-4 hover:bg-white/50 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-[#B00020] mt-2 shrink-0"></div>
                      <div className="flex-1">
                        <div className="font-bold text-[#1F1F1F] text-lg">{item.name} ({item.status}/5)</div>
                        <p className="text-gray-700 mt-1">{item.notes}</p>
                        <button 
                          onClick={() => onNavigate('sip')}
                          className="text-[#005595] mt-3 font-semibold text-sm hover:underline flex items-center gap-1"
                        >
                          {isChild ? "Läs vad vi ska göra" : "Se åtgärdsprogram"} <ArrowUpRight size={14}/>
                        </button>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* Support Level & Risk/Protective Factors - Professional View Only */}
          {!isChild && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Support Level Card */}
              <div className="bg-white rounded-xl border border-orange-200 p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-[#1F1F1F] flex items-center gap-2 text-lg">
                      <TrendingUp size={20} className="text-orange-500" />
                      Stödnivå
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Livsloppsperspektiv</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                    Nivå 3
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[#1F1F1F]">
                      {ENHANCED_CHILD_PROFILE.supportLevel === 'universal' && 'Universell'}
                      {ENHANCED_CHILD_PROFILE.supportLevel === 'early-attention' && 'Tidig uppmärksamhet'}
                      {ENHANCED_CHILD_PROFILE.supportLevel === 'enhanced-support' && 'Förstärkt stöd'}
                      {ENHANCED_CHILD_PROFILE.supportLevel === 'intensive-support' && 'Intensivt stöd'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        ENHANCED_CHILD_PROFILE.supportLevel === 'universal' ? 'w-[25%] bg-green-500' :
                        ENHANCED_CHILD_PROFILE.supportLevel === 'early-attention' ? 'w-[50%] bg-yellow-500' :
                        ENHANCED_CHILD_PROFILE.supportLevel === 'enhanced-support' ? 'w-[75%] bg-orange-500' :
                        'w-[100%] bg-red-500'
                      }`}
                    ></div>
                  </div>
                </div>

                {ENHANCED_CHILD_PROFILE.activeTriggers && ENHANCED_CHILD_PROFILE.activeTriggers.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="text-xs font-bold text-orange-700 mb-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      Aktiv trigger från {ENHANCED_CHILD_PROFILE.activeTriggers[0].triggeredDate}
                    </div>
                    <p className="text-xs text-gray-700">
                      {ENHANCED_CHILD_PROFILE.activeTriggers[0].reason}
                    </p>
                  </div>
                )}

                <div className="mt-4 text-xs text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-gray-400" />
                    <span><strong>Primär:</strong> {ENHANCED_CHILD_PROFILE.primarySector === 'elementary-school' ? 'Grundskola' : ENHANCED_CHILD_PROFILE.primarySector}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-gray-400" />
                    <span><strong>Sekundär:</strong> {ENHANCED_CHILD_PROFILE.secondarySectors.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Current Phase Card */}
              <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm">
                <h3 className="font-bold text-[#1F1F1F] flex items-center gap-2 text-lg mb-4">
                  <Calendar size={20} className="text-[#005595]" />
                  Livsfas
                </h3>

                <div className="mb-4">
                  <div className="text-2xl font-bold text-[#005595] mb-1">
                    {ENHANCED_CHILD_PROFILE.currentPhase === 'early-childhood' && 'Tidig barndom'}
                    {ENHANCED_CHILD_PROFILE.currentPhase === 'preschool' && 'Förskola'}
                    {ENHANCED_CHILD_PROFILE.currentPhase === 'elementary-school' && 'Grundskola'}
                    {ENHANCED_CHILD_PROFILE.currentPhase === 'high-school' && 'Gymnasiet'}
                    {ENHANCED_CHILD_PROFILE.currentPhase === 'young-adult' && 'Ung vuxen'}
                  </div>
                  <p className="text-sm text-gray-600">
                    {childProfile.age} år, {childProfile.grade}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-gray-500 uppercase font-semibold mb-2">Genomgångna faser:</div>
                  <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                    <CheckCircle2 size={14} />
                    <span>BVC/MVC (0-5 år)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                    <CheckCircle2 size={14} />
                    <span>Förskola (1-6 år)</span>
                  </div>
                  <div className="text-xs text-gray-500 uppercase font-semibold mt-3 mb-2">Nuvarande fas:</div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#005595] bg-blue-50 px-2 py-1.5 rounded border border-blue-200">
                    <div className="w-2 h-2 rounded-full bg-[#005595] animate-pulse"></div>
                    <span>Grundskola (Åk 9, 15 år)</span>
                  </div>
                  <div className="text-xs text-gray-500 uppercase font-semibold mt-3 mb-2">Nästa steg:</div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                    <ArrowRight size={14} />
                    <span>Gymnasiet (hösten 2026)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Risk & Protective Factors - Professional View Only */}
          {!isChild && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Risk Factors */}
              <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
                <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                  <h3 className="text-lg font-bold text-red-700 flex items-center gap-2">
                    <ShieldAlert size={20} />
                    Riskfaktorer ({riskFactors.filter(rf => rf.status === 'active' || rf.status === 'monitoring').length})
                  </h3>
                </div>
                <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                  {riskFactors.filter(rf => rf.status === 'active' || rf.status === 'monitoring').map(risk => (
                    <div key={risk.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-semibold text-[#1F1F1F] text-sm">{risk.name}</div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          risk.severity === 'low' ? 'bg-yellow-100 text-yellow-700' :
                          risk.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                          risk.severity === 'high' ? 'bg-red-100 text-red-700' :
                          'bg-red-200 text-red-900'
                        }`}>
                          {risk.severity === 'low' ? 'Låg' : risk.severity === 'medium' ? 'Medel' : risk.severity === 'high' ? 'Hög' : 'Kritisk'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{risk.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="px-2 py-0.5 bg-gray-100 rounded">
                          {risk.category === 'individual' ? 'Individ' : risk.category === 'family' ? 'Familj' : 'Miljö'}
                        </span>
                        <span>•</span>
                        <span>ID: {risk.identifiedDate}</span>
                      </div>
                      {risk.mitigationActions && risk.mitigationActions.length > 0 && (
                        <div className="mt-2 text-xs">
                          <div className="font-semibold text-gray-700 mb-1">Åtgärder:</div>
                          <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                            {risk.mitigationActions.slice(0, 2).map((action, idx) => (
                              <li key={idx}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Protective Factors */}
              <div className="bg-white rounded-xl border border-green-200 shadow-sm overflow-hidden">
                <div className="bg-green-50 px-6 py-4 border-b border-green-100">
                  <h3 className="text-lg font-bold text-green-700 flex items-center gap-2">
                    <Shield size={20} />
                    Skyddsfaktorer ({protectiveFactors.length})
                  </h3>
                </div>
                <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                  {protectiveFactors.map(protective => (
                    <div key={protective.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-semibold text-[#1F1F1F] text-sm">{protective.name}</div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          protective.strength === 'weak' ? 'bg-green-50 text-green-600' :
                          protective.strength === 'moderate' ? 'bg-green-100 text-green-700' :
                          'bg-green-200 text-green-800'
                        }`}>
                          {protective.strength === 'weak' ? 'Svag' : protective.strength === 'moderate' ? 'Måttlig' : 'Stark'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{protective.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="px-2 py-0.5 bg-gray-100 rounded">
                          {protective.category === 'individual' ? 'Individ' : protective.category === 'family' ? 'Familj' : 'Miljö'}
                        </span>
                        <span>•</span>
                        <span>ID: {protective.identifiedDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Next Event */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-[#1F1F1F] mb-4 text-lg">📅 {isChild ? "Händer snart" : "Nästa händelse"}</h3>
            <div className="flex gap-4 items-start">
               <div className={`rounded-lg px-4 py-3 text-center min-w-[70px] border ${isChild ? 'bg-orange-50 text-[#E87C00] border-orange-100' : 'bg-[#EBF4FA] text-[#005595] border-blue-100'}`}>
                 <div className="text-xs font-bold uppercase tracking-wider">Dec</div>
                 <div className="text-2xl font-bold">12</div>
               </div>
               <div>
                 <div className="font-bold text-[#1F1F1F] text-lg leading-tight mb-1">{nextMeeting.title}</div>
                 <div className="text-sm text-gray-600 mb-2">Skola • Föräldrar • Mentor</div>
                 <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                   Kl 14:00 - 15:00
                 </span>
               </div>
            </div>
          </div>

          {/* Quick Contacts */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
             <h3 className="font-bold text-[#1F1F1F] mb-4 text-lg">📞 {isChild ? "Dina vuxna" : "Snabbkontakt"}</h3>
             <div className="space-y-4">
               <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                 <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border ${isChild ? 'bg-orange-50 text-[#E87C00] border-orange-100' : 'bg-[#EBF4FA] text-[#005595] border-blue-100'}`}>LS</div>
                   <div>
                     <div className="font-bold text-[#1F1F1F]">Lisa Svensson</div>
                     <div className="text-xs text-gray-500 font-semibold uppercase">Mentor</div>
                   </div>
                 </div>
                 <button className="text-sm text-[#005595] font-semibold hover:underline">
                   {isChild ? "Skriv meddelande" : "Meddelande"}
                 </button>
               </div>
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-green-50 text-[#378056] flex items-center justify-center text-sm font-bold border border-green-100">ME</div>
                   <div>
                     <div className="font-bold text-[#1F1F1F]">Maria Ek</div>
                     <div className="text-xs text-gray-500 font-semibold uppercase">Skolsköterska</div>
                   </div>
                 </div>
                 <button className="text-sm text-[#005595] font-semibold hover:underline">
                   {isChild ? "Skriv meddelande" : "Meddelande"}
                 </button>
               </div>
             </div>
          </div>

          {/* Latest News Feed */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-[#1F1F1F] mb-4 text-lg flex items-center gap-2">
              <Newspaper size={20} className={isChild ? "text-[#E87C00]" : "text-[#005595]"} />
              {isChild ? "Nyheter för dig" : "Senaste Nytt"}
            </h3>
            <div className="space-y-4">
              {NEWS_FEED_DATA.map(news => (
                <div key={news.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm text-[#1F1F1F]">{news.title}</h4>
                    <span className="text-[10px] text-gray-500 whitespace-nowrap">{news.date}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{news.snippet}</p>
                  <div className="flex justify-between items-center">
                       <span className="text-[10px] font-semibold text-gray-400 uppercase">{news.source}</span>
                       <button className="text-xs font-semibold text-[#005595] hover:underline flex items-center gap-1">
                         Läs mer <ArrowUpRight size={12} />
                       </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Dashboard);
