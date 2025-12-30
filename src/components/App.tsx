
import React, { useState, Suspense, lazy } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import Loading from './Loading';
import ErrorBoundary from './ErrorBoundary';
import { Perspective, View, UserContext, JourneyLevel } from '../types/types';
import { getProfileById, getProfileMetadata, getSupportLevelColor, CHILD_PROFILES } from '../data/childProfiles';
import { ShieldCheck, GraduationCap } from 'lucide-react';
import { JOURNEY_PROFILES } from '../data/journeyMockData';

// Lazy load view components to split code and improve initial load performance
const Dashboard = lazy(() => import('./Dashboard'));
const MergedWelfareWheel = lazy(() => import('./MergedWelfareWheel'));
const WellbeingSurvey = lazy(() => import('./WellbeingSurvey'));
const DataProfile = lazy(() => import('./DataProfile'));
const QualitySystem = lazy(() => import('./QualitySystem'));
const AIAnalysis = lazy(() => import('./AIAnalysis'));
const Journal = lazy(() => import('./Journal'));
const LifeCourseView = lazy(() => import('./LifeCourseView'));
const MyWorldTriangle = lazy(() => import('./MyWorldTriangle'));
const ResilienceMatrix = lazy(() => import('./ResilienceMatrix'));
const AnnualQualityWheel = lazy(() => import('./AnnualQualityWheel'));

// Barnets Resa Matris - Nya komponenter
const ChildJourneyLevel = lazy(() => import('./ChildJourneyLevel'));
const MatrixOverview = lazy(() => import('./MatrixOverview'));

// WHO ICF Integration
const ICFDemo = lazy(() => import('./ICFDemo'));
const N1Screening = lazy(() => import('./N1Screening'));
const N2DeepDive = lazy(() => import('./N2DeepDive'));
const N3CoordinatedPlan = lazy(() => import('./N3CoordinatedPlan'));

const App: React.FC = () => {
  const [currentPerspective, setCurrentPerspective] = useState<Perspective>('guardian');
  const [currentView, setCurrentView] = useState<View>('overview');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('erik');

  // Derive UserContext based on Perspective
  const getUserContext = (perspective: Perspective): UserContext => {
    switch(perspective) {
      case 'guardian':
        return { name: "Vårdnadshavare", role: "Vårdnadshavare", roleBadge: "Privatperson", avatar: "👩" };
      case 'child':
        return { name: "Barn", role: "Barn", roleBadge: "Barnet", avatar: "👦" };
      case 'professional':
        return { name: "Tjänsteperson", role: "Pedagog", roleBadge: "Tjänsteperson", avatar: "👩‍🏫" };
    }
  };

  const userContext = getUserContext(currentPerspective);
  const currentProfile = getProfileById(selectedProfileId);
  const profileMetadata = getProfileMetadata(selectedProfileId);
  const journeyProfile = JOURNEY_PROFILES[selectedProfileId];

  const handleLevelChange = (newLevel: JourneyLevel, reason: string) => {
    // I en riktig implementation skulle vi uppdatera databasen här
    alert(`Nivåändring till ${newLevel} registrerad!\n\nAnledning: ${reason}\n\nDetta skulle i en riktig implementation uppdatera profilen och skicka notiser till alla involverade.`);
  };

  // Render View Content
  const renderView = () => {
    switch (currentView) {
      case 'overview': return <Dashboard currentPerspective={currentPerspective} onNavigate={setCurrentView} selectedProfileId={selectedProfileId} />;
      case 'journal': return <Journal onNavigateToAI={() => setCurrentView('ai-analysis')} />;
      case 'quality': return <QualitySystem />;
      case 'shanarri':
        return (
          <MergedWelfareWheel
            currentPerspective={currentPerspective}
            selectedProfileId={selectedProfileId}
            journeyProfile={journeyProfile}
          />
        );
      case 'survey': return <WellbeingSurvey />;
      case 'ai-analysis': return <AIAnalysis onNavigate={setCurrentView} />;
      case 'dataprofile': return <DataProfile selectedProfileId={selectedProfileId} />;
      case 'lifecourse': return <LifeCourseView selectedProfileId={selectedProfileId} />;
      case 'myworld': return <MyWorldTriangle selectedProfileId={selectedProfileId} />;
      case 'resilience': return <ResilienceMatrix selectedProfileId={selectedProfileId} />;
      case 'qualitywheel': return <AnnualQualityWheel />;

      // Barnets Resa Matris - Nya vyer
      case 'journey-level':
        return journeyProfile ? (
          <ChildJourneyLevel
            journeyProfile={journeyProfile}
            onLevelChange={handleLevelChange}
          />
        ) : <div>Ingen journeyprofil hittades</div>;

      case 'matrix-overview':
        return <MatrixOverview />;

      // WHO ICF Demo
      case 'icf-demo':
        return <ICFDemo selectedProfileId={selectedProfileId} />;

      case 'icf-n1':
        return <N1Screening selectedProfileId={selectedProfileId} />;

      case 'icf-n2':
        return <N2DeepDive selectedProfileId={selectedProfileId} />;

      case 'icf-n3':
        return <N3CoordinatedPlan selectedProfileId={selectedProfileId} />;

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
        selectedProfileId={selectedProfileId}
        onProfileChange={setSelectedProfileId}
      />

      {/* Child Profile Banner - Livsloppskontext */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="flex items-center gap-6">
               <div
                 className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shadow-sm border-2"
                 style={{
                   backgroundColor: profileMetadata.colorScheme.background,
                   borderColor: getSupportLevelColor(profileMetadata.supportLevel),
                   color: getSupportLevelColor(profileMetadata.supportLevel)
                 }}
               >
                 {profileMetadata.emoji}
               </div>
               <div>
                 <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Livsloppsjournal</div>
                 <h2 className="text-3xl font-bold text-[#1F1F1F]">{currentProfile.name}</h2>
                 <div className="flex items-center gap-4 text-sm text-gray-700 mt-2 font-medium">
                    <span className="bg-gray-100 px-2 py-1 rounded">Demo-ID: {currentProfile.ssn}</span>
                    <span>{currentProfile.age} år</span>
                    <span className="flex items-center gap-1 text-[#005595]"><GraduationCap size={16}/> {currentProfile.school}, {currentProfile.grade}</span>
                 </div>
               </div>
             </div>

             {currentProfile.sipActive && (
               <div className="flex flex-col items-end">
                 <div className="flex items-center gap-2 bg-[#EBF4FA] px-4 py-2 rounded border border-[#005595] text-[#005595] text-sm font-bold shadow-sm mb-2">
                    <ShieldCheck size={18} />
                    Aktiv plan/SIP
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
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            {renderView()}
          </Suspense>
        </ErrorBoundary>
      </main>

      <footer className="bg-[#1F1F1F] text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
           <div>
             <h4 className="font-bold mb-4 text-lg">En prototyp för gemensam informationsprofil</h4>
             <p className="text-gray-400 leading-relaxed">
               Utvecklad för att demonstrera ett kompletterande perspektiv för Kronobarnsmodellen och utvecklingsinitiativet "Barnets rätt till information". 
               Syftet är att visa hur informationsdelning och samverkan mellan skola, vård och omsorg kan visualiseras genom semantisk brygga ICF som mappar skolans information till Socialstyrelsens informationsstruktur och mängder.
             </p>
           </div>
           
           <div>
             <h4 className="font-bold mb-4 text-lg">Kontakt</h4>
             <p className="text-gray-400">
               Ansvarig för prototyp: Privat initiativ<br/>
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
