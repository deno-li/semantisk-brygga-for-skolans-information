
import React, { useState, Suspense, lazy } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Loading from './components/Loading';
import { Perspective, View, UserContext } from './types';
import { CHILD_PROFILE } from './constants';
import { ShieldCheck, GraduationCap } from 'lucide-react';

// Lazy load view components to split code and improve initial load performance
const Dashboard = lazy(() => import('./components/Dashboard'));
const WelfareWheel = lazy(() => import('./components/WelfareWheel'));
const DataProfile = lazy(() => import('./components/DataProfile'));
const QualitySystem = lazy(() => import('./components/QualitySystem'));
const Documents = lazy(() => import('./components/Documents'));
const AIAnalysis = lazy(() => import('./components/AIAnalysis'));
const Journal = lazy(() => import('./components/Journal'));
const MultiStudentComparison = lazy(() => import('./components/MultiStudentComparison'));
const TrendAnalysis = lazy(() => import('./components/TrendAnalysis'));

const App: React.FC = () => {
  const [currentPerspective, setCurrentPerspective] = useState<Perspective>('guardian');
  const [currentView, setCurrentView] = useState<View>('overview');

  // Derive UserContext based on Perspective
  const getUserContext = (perspective: Perspective): UserContext => {
    switch(perspective) {
      case 'guardian':
        return { name: "Anna Andersson", role: "Vårdnadshavare", roleBadge: "Privatperson", avatar: "👩" };
      case 'child':
        return { name: "Erik Andersson", role: "Barn (13+)", roleBadge: "Barnet", avatar: "👦" };
      case 'professional':
        return { name: "Lisa Svensson", role: "Pedagog", roleBadge: "Tjänsteperson", avatar: "👩‍🏫" };
    }
  };

  const userContext = getUserContext(currentPerspective);

  // Mock student data for demonstration
  const mockStudents = [
    {
      id: '1',
      profile: CHILD_PROFILE,
      dimensions: {},
      timeline: [],
      history: [
        { date: '2025-09', scores: [4, 4, 4, 4, 3, 4, 4, 4], notes: 'Bra start på terminen' },
        { date: '2025-10', scores: [4, 4, 4, 4, 3, 4, 4, 5], notes: 'Fortsatt positiv utveckling' },
        { date: '2025-11', scores: [4, 4, 4, 4, 4, 4, 4, 5], notes: 'Mycket god utveckling' },
        { date: '2025-12', scores: [4, 4, 4, 4, 4, 4, 5, 5], notes: 'Fortsätter väl' }
      ],
      riskLevel: 'low' as const
    }
  ];

  // Render View Content
  const renderView = () => {
    switch (currentView) {
      case 'overview': return <Dashboard currentPerspective={currentPerspective} onNavigate={setCurrentView} />;
      case 'journal': return <Journal onNavigateToAI={() => setCurrentView('ai-analysis')} />;
      case 'quality': return <QualitySystem />;
      case 'shanarri': return <WelfareWheel currentPerspective={currentPerspective} />;
      case 'ai-analysis': return <AIAnalysis onNavigate={setCurrentView} />;
      case 'dataprofile': return <DataProfile />;
      case 'documents': return <Documents />;
      case 'comparison': return <MultiStudentComparison students={mockStudents} />;
      case 'trends': return <TrendAnalysis student={mockStudents[0]} />;
      default: return (
        <div className="p-12 text-center text-gray-500 bg-white rounded-lg border-2 border-dashed border-gray-300">
           <div className="mb-4 text-4xl">🚧</div>
           <h3 className="text-lg font-bold text-[#1F1F1F]">Vyn "{currentView}" är under utveckling</h3>
           <p className="text-sm mt-2">Denna del av prototypen är inte implementerad än.</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3] text-[#1F1F1F] font-sans flex flex-col">
      <Header 
        currentPerspective={currentPerspective} 
        onPerspectiveChange={setCurrentPerspective}
        userContext={userContext}
        onNavigate={setCurrentView}
      />

      {/* Child Profile Banner - Livsloppskontext */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="flex items-center gap-6">
               <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shadow-sm border-2 ${currentPerspective === 'child' ? 'bg-orange-50 border-[#E87C00] text-[#E87C00]' : 'bg-[#EBF4FA] border-[#005595] text-[#005595]'}`}>
                 EA
               </div>
               <div>
                 <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Livsloppsjournal</div>
                 <h2 className="text-3xl font-bold text-[#1F1F1F]">{CHILD_PROFILE.name}</h2>
                 <div className="flex items-center gap-4 text-sm text-gray-700 mt-2 font-medium">
                    <span className="bg-gray-100 px-2 py-1 rounded">{CHILD_PROFILE.ssn}</span>
                    <span>{CHILD_PROFILE.age} år</span>
                    <span className="flex items-center gap-1 text-[#005595]"><GraduationCap size={16}/> {CHILD_PROFILE.school}, {CHILD_PROFILE.grade}</span>
                 </div>
               </div>
             </div>
             
             {CHILD_PROFILE.sipActive && (
               <div className="flex flex-col items-end">
                 <div className="flex items-center gap-2 bg-[#EBF4FA] px-4 py-2 rounded border border-[#005595] text-[#005595] text-sm font-bold shadow-sm mb-2">
                    <ShieldCheck size={18} />
                    Aktiv SIP
                 </div>
                 <div className="text-xs text-gray-500">Uppdaterad: 2025-11-28</div>
               </div>
             )}
          </div>
        </div>
      </div>

      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        currentPerspective={currentPerspective}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full">
        <Suspense fallback={<Loading />}>
          {renderView()}
        </Suspense>
      </main>

      <footer className="bg-[#1F1F1F] text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
           <div>
             <h4 className="font-bold mb-4 text-lg">Om prototypen</h4>
             <p className="text-gray-400 leading-relaxed">
               Utvecklad för att demonstrera ett koncept för "Barnets rätt till information" med ett livsloppsperspektiv.
               Syftet är att visa hur samverkan mellan skola, vård och omsorg kan visualiseras för barnets bästa, med fokus på semantisk interoperabilitet och delaktighet.
             </p>
           </div>
           
           <div>
             <h4 className="font-bold mb-4 text-lg">Kontakt</h4>
             <p className="text-gray-400">
               Ansvarig för prototyp: Privat initiativ / Konceptutvecklare<br/>
               <span className="text-white mt-2 block font-semibold">
                 Stödjer initiativet <a href="https://skr.se/digitaliseringivalfarden/handslagfordigitalisering.8420.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-300">"Handslaget för digitalisering"</a>
               </span>
             </p>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
