
import React, { useState, useEffect } from 'react';
import { SHANARRI_DATA, TIMELINE_DATA, QUALITY_CYCLE, NEWS_FEED_DATA, CHILD_PROFILE } from '../constants';
import { ArrowUpRight, Calendar, AlertCircle, CheckCircle2, ClipboardCheck, ArrowRight, Info, MessageCircle, Newspaper, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Perspective, View } from '../types';

interface DashboardProps {
  currentPerspective: Perspective;
  onNavigate: (view: View) => void;
}

// Global cache to persist images across navigation
const imageCache: Record<string, string> = {};

const Dashboard: React.FC<DashboardProps> = ({ currentPerspective, onNavigate }) => {
  const needsAttention = SHANARRI_DATA.filter(d => d.status < 3).length;
  const nextMeeting = TIMELINE_DATA[0];
  const currentQualityPhase = QUALITY_CYCLE.find(q => q.status === 'active') || QUALITY_CYCLE[0];
  
  const isChild = currentPerspective === 'child';
  // Define "Youth" as 13+ years old.
  const isYouth = isChild && CHILD_PROFILE.age >= 13;
  
  // Use a cache key based on perspective and age group to serve the correct image
  const cacheKey = isChild ? (isYouth ? 'youth' : 'child') : 'standard';
  
  const [heroImage, setHeroImage] = useState<string | null>(imageCache[cacheKey] || null);
  const [loadingImage, setLoadingImage] = useState<boolean>(!imageCache[cacheKey]);

  useEffect(() => {
    const generateIllustration = async () => {
        // If we already have a cached image for this perspective, use it.
        if (imageCache[cacheKey]) {
            setHeroImage(imageCache[cacheKey]);
            setLoadingImage(false);
            return;
        }

        setLoadingImage(true);
        try {
            // Dynamic import to optimize bundle size
            const { GoogleGenAI } = await import("@google/genai");
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Build Prompt Logic based on Age Group
            let prompt = "";
            if (!isChild) {
               // Professional / Guardian / Standard View
               prompt = "A sophisticated, warm abstract vector illustration representing a child's journey through the welfare system. Connecting symbols of education, health, and care in a harmonious flow. Soft blue and orange tones, clean flat design.";
            } else if (isYouth) {
               // Youth View (13+) - Cool, modern, less childish
               prompt = "A cool, modern digital art illustration suitable for a teenager. A concept of 'My Journey' visualized as a stylized road map or a futuristic interface towards personal goals. Vibrant colors, distinct lines, empowering and energetic. Not childish, no cartoons. Lo-fi or vector art style.";
            } else {
               // Young Child View (<13) - Playful, Storybook
               prompt = "A warm, inviting, watercolor storybook illustration of a happy child adventurer standing on a golden path in a magical, safe forest. The path leads to a friendly school and a cozy house. Soft pastel colors, very cute and comforting.";
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [{ text: prompt }]
                }
            });

            if (response.candidates?.[0]?.content?.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        const imageData = `data:image/png;base64,${part.inlineData.data}`;
                        // Save to cache and state
                        imageCache[cacheKey] = imageData;
                        setHeroImage(imageData);
                        break;
                    }
                }
            }
        } catch (error) {
            console.error("Failed to generate image:", error);
        } finally {
            setLoadingImage(false);
        }
    };

    generateIllustration();
  }, [isChild, isYouth, cacheKey]); 

  // Simplified Mini Wheel for Dashboard
  const MiniWellBeingWheel = () => {
    const size = 160;
    const cx = size / 2;
    const cy = size / 2;
    const outerR = size / 2 - 10;
    const innerR = size / 5;
    const n = SHANARRI_DATA.length;

    return (
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full max-h-[160px]">
        {SHANARRI_DATA.map((dim, i) => {
          const startAngle = (i * 360) / n - 90;
          const endAngle = ((i + 1) * 360) / n - 90;
          
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;

          const x1 = cx + Math.cos(startRad) * innerR;
          const y1 = cy + Math.sin(startRad) * innerR;
          const x2 = cx + Math.cos(startRad) * outerR;
          const y2 = cy + Math.sin(startRad) * outerR;
          const x3 = cx + Math.cos(endRad) * outerR;
          const y3 = cy + Math.sin(endRad) * outerR;
          const x4 = cx + Math.cos(endRad) * innerR;
          const y4 = cy + Math.sin(endRad) * innerR;

          const path = `M ${x1} ${y1} L ${x2} ${y2} A ${outerR} ${outerR} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerR} ${innerR} 0 0 0 ${x1} ${y1}`;
          const color = dim.status >= 4 ? '#22c55e' : dim.status >= 3 ? '#eab308' : '#ef4444';

          return (
             <path key={dim.id} d={path} fill={color} stroke="white" strokeWidth="1.5" />
          );
        })}
        <circle cx={cx} cy={cy} r={innerR} fill="white" />
      </svg>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in text-[#1F1F1F]">
      
      {/* Intro Section - Adapted for Child/Youth */}
      <div>
        {isChild ? (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl border border-orange-100">
             <h2 className="text-2xl font-bold mb-2 text-[#E87C00]">Hej {CHILD_PROFILE.name.split(' ')[0]}! 👋</h2>
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

      {/* AI Generated Illustration Section - Compact Version */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative min-h-[150px] flex flex-col md:flex-row">
        <div className="p-5 md:w-1/3 flex flex-col justify-center relative z-10 bg-white">
            <h3 className="text-lg font-bold text-[#1F1F1F] mb-1 flex items-center gap-2">
                <ImageIcon className="text-[#005595]" size={20} />
                {isChild ? "Min Resa i Bilder" : "Visualisering: Barnets Resa"}
            </h3>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                {isChild 
                  ? "En bild skapad bara för dig, som visar din väg framåt mot målen." 
                  : "AI-genererad illustration som symboliserar samverkan och trygghet i barnets livslopp."}
            </p>
            <div className="flex items-center gap-2 text-[10px] text-gray-400 bg-gray-50 p-1.5 rounded w-fit">
                <Sparkles size={10} />
                Skapad med Gemini AI
            </div>
        </div>
        
        {/* Optimized Image Container */}
        <div className="md:w-2/3 bg-gray-50 relative min-h-[150px] overflow-hidden group">
            {/* Placeholder Background with Blur - Shows while loading or behind transparent parts */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${heroImage ? 'opacity-0' : 'opacity-100'} 
                ${isChild ? 'bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100' : 'bg-gradient-to-br from-[#EBF4FA] via-white to-blue-50'}`}
            >
                {loadingImage && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <div className={`mb-3 p-3 rounded-full bg-white/80 shadow-sm backdrop-blur-sm ${isChild ? 'text-orange-500' : 'text-[#005595]'}`}>
                            <Loader2 size={24} className="animate-spin" />
                         </div>
                         <span className={`text-xs font-medium tracking-wide animate-pulse ${isChild ? 'text-orange-600' : 'text-[#005595]'}`}>
                            {isYouth ? "Genererar design..." : (isChild ? "Målar din bild..." : "Genererar visualisering...")}
                         </span>
                    </div>
                )}
            </div>

            {/* Generated Image - Fades in */}
            {heroImage && (
                <img 
                    src={heroImage} 
                    alt="AI Generated Illustration" 
                    className="w-full h-full object-cover animate-fade-in absolute inset-0"
                />
            )}

            {/* Error State */}
            {!loadingImage && !heroImage && (
                 <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs bg-gray-100">
                    <ImageIcon className="opacity-20 mr-2" />
                    Bild kunde inte skapas
                </div>
            )}
        </div>
      </div>

      {/* KPI Cards - Context Aware */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div 
          onClick={() => onNavigate('sip')}
          className={`bg-white p-5 rounded-lg border hover:border-[#005595] transition-all cursor-pointer group ${isChild ? 'border-orange-200 hover:border-orange-400' : 'border-gray-300'}`}
        >
          <div className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-2">
            {isChild ? "Min Plan" : "Aktiva Planer"}
          </div>
          <div className={`text-3xl font-bold transition-colors ${isChild ? 'text-[#E87C00]' : 'text-[#005595] group-hover:text-[#B00020]'}`}>
            1 <span className="text-sm font-normal text-gray-500">{isChild ? "SIP-plan" : "SIP"}</span>
          </div>
        </div>
        <div className={`bg-white p-5 rounded-lg border hover:border-[#005595] transition-colors group ${isChild ? 'border-orange-200 hover:border-orange-400' : 'border-gray-300'}`}>
          <div className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-2">
            {isChild ? "Vuxna runt mig" : "Kontaktpersoner"}
          </div>
          <div className={`text-3xl font-bold transition-colors ${isChild ? 'text-[#E87C00]' : 'text-[#005595] group-hover:text-[#B00020]'}`}>
            5
          </div>
        </div>
        <div 
          onClick={() => onNavigate('shanarri')}
          className={`bg-white p-5 rounded-lg border hover:border-[#005595] transition-all cursor-pointer group ${isChild ? 'border-orange-200 hover:border-orange-400' : 'border-gray-300'}`}
        >
          <div className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-2">
            {isChild ? "Mitt Mående" : "Välbefinnande"}
          </div>
          <div className="text-3xl font-bold text-[#378056]">7/8 <span className="text-sm font-normal text-gray-500">Bra!</span></div>
        </div>
        <div className={`bg-white p-5 rounded-lg border hover:border-[#005595] transition-colors group ${isChild ? 'border-orange-200 hover:border-orange-400' : 'border-gray-300'}`}>
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Mini Well-being Wheel Widget - CLICKABLE */}
             <div 
               onClick={() => onNavigate('shanarri')}
               className={`bg-white rounded-lg border p-6 shadow-sm flex flex-col items-center text-center cursor-pointer transition-all hover:shadow-md ${isChild ? 'border-orange-200 hover:border-orange-400' : 'border-gray-300 hover:border-[#005595]'}`}
             >
                <h3 className="font-bold text-[#1F1F1F] mb-4 text-sm uppercase tracking-wide flex items-center gap-1">
                  Välbefinnandehjul <ArrowUpRight size={14} className="opacity-50"/>
                </h3>
                <div className="w-32 h-32 mb-4 hover:scale-105 transition-transform">
                  <MiniWellBeingWheel />
                </div>
                <p className="text-xs text-gray-500">
                  {needsAttention > 0 
                    ? `${needsAttention} områden behöver stöd` 
                    : "Balanserat välbefinnande"}
                </p>
             </div>

             {/* Active SIP Card */}
             <div className={`col-span-2 bg-white rounded-lg border-2 overflow-hidden shadow-sm flex flex-col ${isChild ? 'border-[#E87C00]' : 'border-[#005595]'}`}>
              <div className={`px-4 py-3 flex justify-between items-center text-white ${isChild ? 'bg-[#E87C00]' : 'bg-[#005595]'}`}>
                 <h3 className="font-bold flex items-center gap-2 text-sm">
                   <div className={`w-2 h-2 rounded-full animate-pulse ${isChild ? 'bg-white' : 'bg-green-400'}`}></div>
                   {isChild ? "Min Plan (SIP)" : "Aktiv SIP"}
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
                    "{isChild ? "Målet är att jag ska bli bättre på att läsa och känna mig lugn i skolan." : "Erik ska uppnå åldersadekvat läsförmåga och känna trygghet i sin skolsituation senast juni 2026."}"
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
             className={`bg-white rounded-lg border p-6 shadow-sm transition-all cursor-pointer group ${isChild ? 'border-orange-200 hover:border-[#E87C00]' : 'border-gray-300 hover:border-[#005595]'}`}
            >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-[#1F1F1F] flex items-center gap-2">
                  <ClipboardCheck size={20} className={isChild ? "text-[#E87C00]" : "text-[#005595]"} />
                  {isChild ? "Du svarade, vi lyssnade!" : "Gävlemodellen & Systematiskt Kvalitetsarbete"}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {isChild 
                    ? "Tack för att du var med i trygghetsenkäten. Just nu jobbar skolan med dina förslag." 
                    : <><span className="text-gray-500">Vi befinner oss i fas:</span> <strong className="text-[#005595]">{currentQualityPhase.title}</strong></>
                  }
                </p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${isChild ? 'bg-orange-100 text-[#E87C00]' : 'bg-blue-100 text-[#005595]'}`}>
                {isChild ? "Pågår nu" : "Läsår 24/25"}
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
            <div className="bg-[#FFF4F0] rounded-lg border border-[#B00020]">
               <div className="px-6 py-4 border-b border-[#B00020]/20">
                 <h3 className="font-bold text-[#B00020] flex items-center gap-2">
                   <AlertCircle size={20} />
                   {isChild ? "Saker vi behöver fixa" : "Områden som kräver uppmärksamhet"}
                 </h3>
               </div>
               <div className="divide-y divide-[#B00020]/10">
                 {SHANARRI_DATA.filter(d => d.status < 3).map(item => (
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Next Event */}
          <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
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
          <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
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
          <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
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

export default Dashboard;
