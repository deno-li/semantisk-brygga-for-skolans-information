/**
 * N3 Coordinated Plan Component
 * Cross-sectoral coordination for children with complex needs
 * Based on WHO ICF N3 level - SIP-like coordinated planning across school, social services, and healthcare
 */

import React, { useState } from 'react';
import {
  Activity, Shield, Users, FileText, Target, Calendar,
  CheckCircle2, AlertCircle, Info, User, Building2, Heart,
  GraduationCap, Home, Clock, ArrowRight, MessageSquare,
  Layers, TrendingUp
} from 'lucide-react';
import { ICF_DEMO_PROFILES } from '../data/icf-demo-profiles';
import ICFGapAnalysis from './ICFGapAnalysis';
import RiskProtectionBalance from './RiskProtectionBalance';

interface N3CoordinatedPlanProps {
  selectedProfileId: string;
}

// Sofia B. - N3 Example Profile with cross-sectoral coordination
const SOFIA_N3_PROFILE = {
  name: 'Sofia B.',
  age: 16,
  grade: 'TE 1 (Gymnasiet)',
  schoolYear: '2024/2025',
  level: 'N3' as const,

  // Background
  background: {
    diagnosis: 'F90.0 ADHD, F41.1 Generaliserat ångestsyndrom',
    history: 'Skolfrånvaro >50% under VT-24. Ångest och panikattacker. Svårt med sociala situationer. Bor växelvis hos mamma och pappa (separerade 2022).',
    currentSituation: 'Börjat gymnasiet HT-24 med intensivt stöd. Fortfarande låg närvaro (~60%) men positiv trend. Deltar i samtal med kurator 2ggr/vecka och har kontakt med BUP.'
  },

  // Cross-sectoral coordination team
  coordinationTeam: [
    {
      sector: 'elementary-school' as const,
      role: 'Mentor & SYV',
      name: 'Maria Lindström',
      organization: 'NTI Gymnasiet',
      contact: 'maria.lindstrom@nti.se',
      responsibilities: [
        'Daglig kontakt och uppföljning av närvaro',
        'Anpassad studieplan',
        'Koordinering med ämneslärare'
      ]
    },
    {
      sector: 'student-health' as const,
      role: 'Kurator',
      name: 'Erik Johansson',
      organization: 'Elevhälsan NTI',
      contact: 'erik.johansson@nti.se',
      responsibilities: [
        'Stödsamtal 2ggr/vecka',
        'Ångesthantering och coping-strategier',
        'Samordning med BUP'
      ]
    },
    {
      sector: 'bup' as const,
      role: 'Behandlande psykolog',
      name: 'Dr. Anna Svensson',
      organization: 'BUP Mottagning',
      contact: 'anna.svensson@region.se',
      responsibilities: [
        'KBT-behandling varannan vecka',
        'Medicinuppföljning (SSRI)',
        'Bedömning av funktionsnivå'
      ]
    },
    {
      sector: 'social-services' as const,
      role: 'Socialsekreterare',
      name: 'Karin Andersson',
      organization: 'Socialtjänsten',
      contact: 'karin.andersson@kommun.se',
      responsibilities: [
        'Stöd kring familjesituation',
        'Kontaktperson',
        'Samordningsansvar (SIP-koordinator)'
      ]
    }
  ],

  // ICF Assessments for Sofia (N3 level - more comprehensive)
  icfAssessments: [
    {
      code: 'd820',
      domain: 'Skolutbildning',
      capacity: { value: 2, description: 'Måttliga svårigheter' },
      performance: { value: 3, description: 'Stora svårigheter' },
      gap: 1,
      gapInterpretation: 'barriers-exist' as const,
      assessedDate: '2025-01-20',
      assessedBy: 'elementary-school' as const,
      timeSpan: 'Senaste 4 veckorna',
      context: 'school' as const,
      source: 'observation' as const,
      notes: 'Sofia har kapacitet men ångest hindrar närvaro. Gap visar att barriärer (ångest, miljö) är starkare än anpassningar.'
    },
    {
      code: 'd240',
      domain: 'Hantera stress och psykologiska krav',
      capacity: { value: 3, description: 'Stora svårigheter' },
      performance: { value: 2, description: 'Måttliga svårigheter' },
      gap: -1,
      gapInterpretation: 'facilitators-work' as const,
      assessedDate: '2025-01-20',
      assessedBy: 'bup' as const,
      timeSpan: 'Senaste 2 veckorna',
      context: 'healthcare' as const,
      source: 'assessment' as const,
      notes: 'KBT och SSRI har positiv effekt. Sofia hanterar stress bättre med dessa insatser.'
    },
    {
      code: 'd720',
      domain: 'Komplexa mellanmänskliga interaktioner',
      capacity: { value: 2, description: 'Måttliga svårigheter' },
      performance: { value: 2, description: 'Måttliga svårigheter' },
      gap: 0,
      gapInterpretation: 'neutral' as const,
      assessedDate: '2025-01-20',
      assessedBy: 'student-health' as const,
      timeSpan: 'Senaste 4 veckorna',
      context: 'school' as const,
      source: 'observation' as const,
      notes: 'Sociala situationer är utmanande men Sofia arbetar aktivt med detta i terapi.'
    },
    {
      code: 'b152',
      domain: 'Känslofunktioner',
      capacity: { value: 3, description: 'Stora svårigheter' },
      performance: { value: 2, description: 'Måttliga svårigheter' },
      gap: -1,
      gapInterpretation: 'facilitators-work' as const,
      assessedDate: '2025-01-20',
      assessedBy: 'bup' as const,
      timeSpan: 'Senaste 2 veckorna',
      context: 'healthcare' as const,
      source: 'assessment' as const,
      notes: 'Ångest och känsloreglering förbättras med behandling.'
    }
  ],

  // Environmental Factors
  environmentalFactors: [
    // FACILITATORS
    {
      code: 'e580',
      domain: 'BUP - KBT och medicinering',
      type: 'facilitator' as const,
      level: 2,
      description: 'KBT varannan vecka + SSRI har tydlig positiv effekt på ångest',
      relatedSpokes: ['halsa', 'trygg'] as const[],
      identifiedDate: '2024-09-01',
      identifiedBy: 'bup' as const,
      context: 'healthcare' as const,
      status: 'active' as const
    },
    {
      code: 'e330',
      domain: 'Kurator - Stödsamtal',
      type: 'facilitator' as const,
      level: 2,
      description: 'Stödsamtal 2ggr/vecka ger trygghet och coping-strategier',
      relatedSpokes: ['trygg', 'larande'] as const[],
      identifiedDate: '2024-09-01',
      identifiedBy: 'student-health' as const,
      context: 'school' as const,
      status: 'active' as const
    },
    {
      code: 'e355',
      domain: 'Kontaktperson från socialtjänst',
      type: 'facilitator' as const,
      level: 1,
      description: 'Stöd kring vardagsstruktur och familjesituation',
      relatedSpokes: ['hemmet', 'trygg'] as const[],
      identifiedDate: '2024-11-01',
      identifiedBy: 'social-services' as const,
      context: 'home' as const,
      status: 'active' as const
    },
    {
      code: 'e585',
      domain: 'Anpassad studieplan',
      type: 'facilitator' as const,
      level: 1,
      description: 'Reducerad kursbelastning och flexibla deadlines',
      relatedSpokes: ['larande'] as const[],
      identifiedDate: '2024-09-01',
      identifiedBy: 'elementary-school' as const,
      context: 'school' as const,
      status: 'active' as const
    },
    // BARRIERS
    {
      code: 'e310',
      domain: 'Familjesituation (separation)',
      type: 'barrier' as const,
      level: 1,
      description: 'Växelvis boende och föräldrakonflikt skapar osäkerhet',
      relatedSpokes: ['hemmet', 'trygg'] as const[],
      identifiedDate: '2022-06-01',
      identifiedBy: 'social-services' as const,
      context: 'home' as const,
      status: 'monitoring' as const
    },
    {
      code: 'e460',
      domain: 'Samhälleliga attityder',
      type: 'barrier' as const,
      level: 1,
      description: 'Stigma kring psykisk ohälsa och skolfrånvaro',
      relatedSpokes: ['delaktig', 'relationer'] as const[],
      identifiedDate: '2024-03-01',
      identifiedBy: 'student-health' as const,
      context: 'school' as const,
      status: 'monitoring' as const
    }
  ],

  // Coordinated goals (SIP-style)
  coordinatedGoals: [
    {
      id: 'goal-1',
      text: 'Öka skolnärvaro från 60% till 80% inom 3 månader',
      targetDate: '2025-04-30',
      icfTarget: 'd820.2 → d820.1',
      relatedSpokes: ['larande'] as const[],
      responsible: 'elementary-school' as const,
      supporting: ['student-health', 'bup'] as const[],
      status: 'in-progress' as const,
      progress: 40,
      actions: [
        'Daglig incheckning med mentor (skola)',
        'Ångesthanteringsstrategier före skoldagen (kurator)',
        'Justering av medicinering vid behov (BUP)'
      ]
    },
    {
      id: 'goal-2',
      text: 'Minska ångestnivå och panikattacker med 50%',
      targetDate: '2025-06-30',
      icfTarget: 'b152.3 → b152.1',
      relatedSpokes: ['halsa', 'trygg'] as const[],
      responsible: 'bup' as const,
      supporting: ['student-health'] as const[],
      status: 'in-progress' as const,
      progress: 60,
      actions: [
        'KBT varannan vecka (BUP)',
        'SSRI-behandling (BUP)',
        'Coping-strategier i vardagen (kurator)'
      ]
    },
    {
      id: 'goal-3',
      text: 'Stabilisera familjesituation och minska konflikter',
      targetDate: '2025-05-31',
      icfTarget: 'e310: .1 → +0',
      relatedSpokes: ['hemmet', 'trygg'] as const[],
      responsible: 'social-services' as const,
      supporting: [] as const[],
      status: 'in-progress' as const,
      progress: 30,
      actions: [
        'Stöd till föräldrar via kontaktperson',
        'Strukturstöd för växelvist boende',
        'Familjesamtal vid behov'
      ]
    }
  ],

  // Risk/Protection balance
  riskProtectionBalance: {
    barriers: [
      { code: 'e310', domain: 'Familjesituation', level: 1 },
      { code: 'e460', domain: 'Stigma', level: 1 }
    ],
    facilitators: [
      { code: 'e580', domain: 'BUP-behandling', level: 2 },
      { code: 'e330', domain: 'Kurator', level: 2 },
      { code: 'e355', domain: 'Kontaktperson', level: 1 },
      { code: 'e585', domain: 'Anpassad studieplan', level: 1 }
    ],
    riskScore: 2,
    protectionScore: 6,
    balance: 4,
    interpretation: 'protection-dominates' as const
  },

  // Sofia's voice
  childsVoice: {
    goals: 'Jag vill kunna gå till skolan utan att få panik. Och jag vill ha vänner att äta lunch med.',
    howFeeling: 'Det är jobbigt att vara så orolig hela tiden. Men det blir lite bättre nu. Samtalen med kuratorn hjälper och medicinerna gör att jag sover bättre.',
    whatHelps: 'När jag får ta det lugnt och inte behöver svara på frågor framför hela klassen. Och när jag kan gå ut en stund om det blir för mycket.',
    worries: 'Att alla ska tycka jag är konstig för att jag inte kan vara i skolan som alla andra.'
  },

  // Meeting schedule
  meetings: [
    {
      date: '2025-01-15',
      type: 'SIP-uppföljning',
      participants: ['Skola', 'BUP', 'Socialtjänst', 'Sofia', 'Föräldrar'],
      status: 'completed' as const,
      summary: 'Positiv trend i närvaro. Fortsatt fokus på ångesthantering.'
    },
    {
      date: '2025-03-15',
      type: 'SIP-uppföljning',
      participants: ['Skola', 'BUP', 'Socialtjänst', 'Sofia', 'Föräldrar'],
      status: 'planned' as const
    },
    {
      date: '2025-05-15',
      type: 'SIP-utvärdering',
      participants: ['Skola', 'BUP', 'Socialtjänst', 'Sofia', 'Föräldrar'],
      status: 'planned' as const
    }
  ]
};

const N3CoordinatedPlan: React.FC<N3CoordinatedPlanProps> = ({ selectedProfileId }) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'team' | 'goals' | 'icf'>('overview');

  // Only show full N3 for Sofia
  if (selectedProfileId !== 'sofia') {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-300 rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-900 mb-2">N3 Samordnad plan</h2>
          <p className="text-red-800">
            N3 Samordnad plan är för närvarande endast implementerad för <strong>Sofia B.</strong>
          </p>
          <p className="text-sm text-red-700 mt-2">
            Välj Sofia B. från profil-menyn för att se N3 samordnad plan med tvärsektoriell koordinering.
          </p>
          <p className="text-xs text-red-600 mt-4">
            N3 är för barn som behöver samordnade insatser över huvudmannagränser (SIP).
          </p>
        </div>
      </div>
    );
  }

  const profile = SOFIA_N3_PROFILE;

  // Get sector icon
  const getSectorIcon = (sector: string) => {
    switch (sector) {
      case 'elementary-school':
      case 'high-school':
        return <GraduationCap className="w-5 h-5" />;
      case 'student-health':
        return <Heart className="w-5 h-5" />;
      case 'bup':
      case 'healthcare':
        return <Activity className="w-5 h-5" />;
      case 'social-services':
        return <Users className="w-5 h-5" />;
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

  // Get sector color
  const getSectorColor = (sector: string) => {
    switch (sector) {
      case 'elementary-school':
      case 'high-school':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'student-health':
        return 'bg-pink-100 text-pink-800 border-pink-300';
      case 'bup':
      case 'healthcare':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'social-services':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">N3 Samordnad plan - SIP</h1>
            <p className="text-red-100 text-lg">
              Tvärsektoriell samverkan - Skola, Vård, Socialtjänst
            </p>
          </div>
          <Layers className="w-12 h-12 text-red-200" />
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Om N3 Samordnad plan</h3>
            <div className="text-sm text-blue-900 space-y-2">
              <p>
                <strong>N3 = Samordningsnivå</strong> - För barn med komplexa behov som kräver samordnade insatser
                över huvudmannagränser (skola, socialtjänst, hälso- och sjukvård).
              </p>
              <p>
                <strong>N3 inkluderar:</strong>
              </p>
              <ul className="list-disc ml-6 mt-1">
                <li><strong>SIP-liknande plan:</strong> Gemensamma mål och ansvarsfördelning</li>
                <li><strong>ICF-baserade mål:</strong> Specifika targets per domän (t.ex. d820.2→d820.1)</li>
                <li><strong>Koordineringsteam:</strong> Representanter från alla involverade sektorer</li>
                <li><strong>Regelbunden uppföljning:</strong> SIP-möten var 3:e månad</li>
                <li><strong>Barnets röst:</strong> Dokumenterad delaktighet</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <User className="w-16 h-16 text-red-600" />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium border border-red-300">
                N3 Samordning
              </span>
            </div>
            <p className="text-gray-600">{profile.age} år, {profile.grade}</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <p className="font-medium text-gray-900 mb-2">Diagnos:</p>
                <p className="text-sm text-gray-700">{profile.background.diagnosis}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <p className="font-medium text-gray-900 mb-2">Aktuell situation:</p>
                <p className="text-sm text-gray-700">{profile.background.currentSituation}</p>
              </div>
            </div>

            {/* Sofia's voice */}
            <div className="mt-4 bg-green-50 border border-green-300 rounded p-4">
              <p className="font-medium text-green-900 mb-2">
                <MessageSquare className="w-4 h-4 inline mr-1" />
                Sofias röst:
              </p>
              <p className="text-sm text-green-900 italic">"{profile.childsVoice.goals}"</p>
              <p className="text-xs text-green-800 mt-2">{profile.childsVoice.howFeeling}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'overview', label: 'Översikt', icon: <Target className="w-4 h-4" /> },
            { id: 'team', label: 'Koordineringsteam', icon: <Users className="w-4 h-4" /> },
            { id: 'goals', label: 'Samordnade mål', icon: <FileText className="w-4 h-4" /> },
            { id: 'icf', label: 'ICF & Gap-analys', icon: <Activity className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === tab.id
                  ? 'border-red-600 text-red-600 bg-red-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Involverade sektorer</p>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Samordnade mål</p>
                  <p className="text-2xl font-bold text-gray-900">{profile.coordinatedGoals.length}</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                  <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Risk/Skydd-balans</p>
                  <p className="text-2xl font-bold text-green-600">+{profile.riskProtectionBalance.balance}</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Nästa SIP-möte</p>
                  <p className="text-lg font-bold text-gray-900">2025-03-15</p>
                </div>
              </div>

              {/* Goal Progress */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Måluppfyllnad</h4>
                <div className="space-y-4">
                  {profile.coordinatedGoals.map((goal) => (
                    <div key={goal.id} className="border border-gray-200 rounded p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{goal.text}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            ICF Target: {goal.icfTarget} | Deadline: {goal.targetDate}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSectorColor(goal.responsible)}`}>
                          {getSectorIcon(goal.responsible)}
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{goal.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              goal.progress >= 70 ? 'bg-green-500' :
                              goal.progress >= 40 ? 'bg-yellow-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Meetings */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">SIP-möten</h4>
                <div className="space-y-3">
                  {profile.meetings.map((meeting, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-4 p-4 rounded border ${
                        meeting.status === 'completed'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <Calendar className={`w-5 h-5 ${
                        meeting.status === 'completed' ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{meeting.type}</p>
                        <p className="text-sm text-gray-600">{meeting.date}</p>
                        {meeting.summary && (
                          <p className="text-xs text-gray-500 mt-1">{meeting.summary}</p>
                        )}
                      </div>
                      {meeting.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Team Tab */}
          {selectedTab === 'team' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Koordineringsteamet består av representanter från alla involverade sektorer som
                samarbetar kring Sofias plan.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.coordinationTeam.map((member, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-5 ${getSectorColor(member.sector)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-full">
                        {getSectorIcon(member.sector)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{member.name}</p>
                        <p className="text-sm font-medium">{member.role}</p>
                        <p className="text-xs text-gray-600">{member.organization}</p>

                        <div className="mt-3">
                          <p className="text-xs font-semibold mb-1">Ansvar:</p>
                          <ul className="text-xs space-y-1">
                            {member.responsibilities.map((resp, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                {resp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Goals Tab */}
          {selectedTab === 'goals' && (
            <div className="space-y-6">
              <p className="text-sm text-gray-600">
                Samordnade mål som är gemensamt beslutade vid SIP-möte. Varje mål har en
                huvudansvarig sektor och stödjande sektorer.
              </p>

              {profile.coordinatedGoals.map((goal) => (
                <div key={goal.id} className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className={`p-4 ${getSectorColor(goal.responsible)}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{goal.text}</h4>
                        <p className="text-sm mt-1">
                          ICF Target: <code className="bg-white px-2 py-0.5 rounded">{goal.icfTarget}</code>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium">Deadline</p>
                        <p className="text-sm font-bold">{goal.targetDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">Ansvarig:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getSectorColor(goal.responsible)}`}>
                          {getSectorIcon(goal.responsible)}
                          {goal.responsible === 'elementary-school' ? 'Skola' :
                           goal.responsible === 'bup' ? 'BUP' :
                           goal.responsible === 'social-services' ? 'Socialtjänst' : goal.responsible}
                        </span>
                      </div>
                      {goal.supporting.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500">Stödjer:</span>
                          {goal.supporting.map((sector, i) => (
                            <span key={i} className={`px-2 py-1 rounded text-xs ${getSectorColor(sector)}`}>
                              {sector === 'student-health' ? 'Elevhälsa' :
                               sector === 'bup' ? 'BUP' : sector}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            goal.progress >= 70 ? 'bg-green-500' :
                            goal.progress >= 40 ? 'bg-yellow-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">Aktiva insatser:</p>
                      <ul className="space-y-1">
                        {goal.actions.map((action, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ICF Tab */}
          {selectedTab === 'icf' && (
            <div className="space-y-6">
              <ICFGapAnalysis assessments={profile.icfAssessments} showMetadata={true} />

              <RiskProtectionBalance
                environmentalFactors={profile.environmentalFactors}
                showBySpoke={true}
              />
            </div>
          )}
        </div>
      </div>

      {/* Escalation/De-escalation Recommendation */}
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6">
        <h4 className="font-semibold text-yellow-900 mb-2">
          <TrendingUp className="w-5 h-5 inline mr-2" />
          Utvärdering och prognos
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-white rounded p-4 border border-yellow-200">
            <p className="font-medium text-gray-900 mb-2">Positiva faktorer:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>+ Risk/Skydd-balans är positiv (+4)</li>
              <li>+ KBT och medicinering visar effekt (gap: -1)</li>
              <li>+ Närvaro har ökat från 50% till 60%</li>
              <li>+ Sofia är delaktig och motiverad</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4 border border-yellow-200">
            <p className="font-medium text-gray-900 mb-2">Utmaningar kvar:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>- Skolnärvaro fortfarande under mål (60% vs 80%)</li>
              <li>- Familjesituation behöver fortsatt stöd</li>
              <li>- Social situation i skolan kräver arbete</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded">
          <p className="text-sm text-green-900">
            <strong>Rekommendation:</strong> Fortsätt N3-samordning. Vid måluppfyllnad (närvaro &gt;80%)
            inom 3 månader kan nedtrappning till N2 övervägas. Nästa utvärdering: 2025-03-15.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-700">
          <strong>N3 Samordnad plan (SIP)</strong> ger tvärsektoriell samverkan för barn med komplexa behov.
        </p>
        <p className="text-xs text-gray-600 mt-2">
          Baserat på WHO ICF-ramverk - Performance vs Capacity - Environmental Factors - Lagstiftning: SoL 2 kap. 7§, HSL
        </p>
      </div>
    </div>
  );
};

export default N3CoordinatedPlan;
