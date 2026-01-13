/**
 * N1 Screening Component
 * Universal screening for all children (Performance qualifiers only)
 * Based on WHO ICF N1 level - minimal assessment for triage
 */

import React, { useState, useMemo } from 'react';
import { Activity, TrendingUp, CheckCircle2, AlertTriangle, AlertCircle, Info, User, ArrowRight, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { ICFQualifierValue } from '../types/icf-types';
import { WelfareWheelSpoke } from '../types/types';
import { ICF_DEMO_PROFILES } from '../data/icf-demo-profiles';

interface N1ScreeningProps {
  selectedProfileId: string;
}

// N1 Screening Assessment (Performance only, no Capacity)
interface N1ScreeningItem {
  spoke: WelfareWheelSpoke;
  spokeName: string;
  code: string;
  domain: string;
  performance: ICFQualifierValue;
  indicatorQuestions: string[];
  triageLevel: 'green' | 'yellow' | 'red';
  notes?: string;
}

// Profile-specific N1 screening data
interface N1ProfileData {
  name: string;
  age: number;
  grade: string;
  level: 'N1' | 'N2' | 'N3';
  screening: N1ScreeningItem[];
  summary: string;
  recommendation: 'stay-n1' | 'proceed-n2' | 'monitor';
}

// Erik A., 15 år - Universell nivå (all green)
const ERIK_N1_SCREENING: N1ScreeningItem[] = [
  {
    spoke: 'halsa',
    spokeName: 'Hälsa',
    code: 'b134',
    domain: 'Sömnfunktioner',
    performance: 0,
    indicatorQuestions: [
      'Sover barnet tillräckligt för sin ålder?',
      'Är barnet utvilad på morgonen?'
    ],
    triageLevel: 'green'
  },
  {
    spoke: 'halsa',
    spokeName: 'Hälsa',
    code: 'b152',
    domain: 'Känslofunktioner',
    performance: 1,
    indicatorQuestions: [
      'Kan barnet reglera känslor (glädje, ilska, sorg)?',
      'Har barnet god känslomässig balans?'
    ],
    triageLevel: 'green'
  },
  {
    spoke: 'trygg',
    spokeName: 'Trygghet',
    code: 'd240',
    domain: 'Hantera stress',
    performance: 1,
    indicatorQuestions: [
      'Kan barnet hantera stress och förändringar?',
      'Återhämtar sig barnet efter svåra situationer?'
    ],
    triageLevel: 'green'
  },
  {
    spoke: 'trygg',
    spokeName: 'Trygghet',
    code: 'e310',
    domain: 'Närmaste familjen',
    performance: 0,
    indicatorQuestions: [
      'Ger familjen trygghet och omsorg?',
      'Finns stabila vuxna i barnets närhet?'
    ],
    triageLevel: 'green'
  },
  {
    spoke: 'ansvarstagande',
    spokeName: 'Lärande',
    code: 'd140',
    domain: 'Lära sig läsa',
    performance: 0,
    indicatorQuestions: [
      'Klarar barnet läsning för sin ålder?',
      'Förstår barnet vad hen läser?'
    ],
    triageLevel: 'green'
  },
  {
    spoke: 'ansvarstagande',
    spokeName: 'Lärande',
    code: 'd820',
    domain: 'Skolutbildning',
    performance: 0,
    indicatorQuestions: [
      'Deltar barnet i skolan regelbundet?',
      'Närvarar barnet för sin ålder? (>90%)'
    ],
    triageLevel: 'green'
  }
];

// Lisa J., 12 år - Stödprofil (mixed, needs N2)
const LISA_N1_SCREENING: N1ScreeningItem[] = [
  {
    spoke: 'halsa',
    spokeName: 'Hälsa',
    code: 'b134',
    domain: 'Sömnfunktioner',
    performance: 2,
    indicatorQuestions: [
      'Sover barnet tillräckligt för sin ålder?',
      'Är barnet utvilad på morgonen?'
    ],
    triageLevel: 'yellow',
    notes: 'Lisa har svårt att somna och vaknar flera gånger per natt'
  },
  {
    spoke: 'halsa',
    spokeName: 'Hälsa',
    code: 'b152',
    domain: 'Känslofunktioner',
    performance: 2,
    indicatorQuestions: [
      'Kan barnet reglera känslor (glädje, ilska, sorg)?',
      'Har barnet god känslomässig balans?'
    ],
    triageLevel: 'yellow',
    notes: 'Oro och frustration i skolsituationer'
  },
  {
    spoke: 'trygg',
    spokeName: 'Trygghet',
    code: 'd240',
    domain: 'Hantera stress',
    performance: 2,
    indicatorQuestions: [
      'Kan barnet hantera stress och förändringar?',
      'Återhämtar sig barnet efter svåra situationer?'
    ],
    triageLevel: 'yellow',
    notes: 'Behöver lugnrum vid överstimulering'
  },
  {
    spoke: 'trygg',
    spokeName: 'Trygghet',
    code: 'e310',
    domain: 'Närmaste familjen',
    performance: 0,
    indicatorQuestions: [
      'Ger familjen trygghet och omsorg?',
      'Finns stabila vuxna i barnets närhet?'
    ],
    triageLevel: 'green',
    notes: 'Starkt familjestöd, engagerade föräldrar'
  },
  {
    spoke: 'ansvarstagande',
    spokeName: 'Lärande',
    code: 'd140',
    domain: 'Lära sig läsa',
    performance: 3,
    indicatorQuestions: [
      'Klarar barnet läsning för sin ålder?',
      'Förstår barnet vad hen läser?'
    ],
    triageLevel: 'red',
    notes: 'Stora svårigheter med läsning - behöver fördjupad analys'
  },
  {
    spoke: 'ansvarstagande',
    spokeName: 'Lärande',
    code: 'd150',
    domain: 'Lära sig skriva',
    performance: 3,
    indicatorQuestions: [
      'Klarar barnet skrivning för sin ålder?',
      'Kan barnet uttrycka sig skriftligt?'
    ],
    triageLevel: 'red',
    notes: 'Stora svårigheter med skrivning'
  },
  {
    spoke: 'respekterad',
    spokeName: 'Relationer',
    code: 'd710',
    domain: 'Grundläggande mellanmänskliga interaktioner',
    performance: 2,
    indicatorQuestions: [
      'Har barnet kamrater att umgås med?',
      'Deltar barnet i sociala aktiviteter?'
    ],
    triageLevel: 'yellow',
    notes: 'Svårt att hitta kamrater, social träning påbörjad'
  }
];

// Elsa Bergström, 10 år - Stödprofil (dyslexi)
const ELSA_N1_SCREENING: N1ScreeningItem[] = [
  {
    spoke: 'halsa',
    spokeName: 'Hälsa',
    code: 'b134',
    domain: 'Sömnfunktioner',
    performance: 1,
    indicatorQuestions: [
      'Sover barnet tillräckligt för sin ålder?',
      'Är barnet utvilad på morgonen?'
    ],
    triageLevel: 'green'
  },
  {
    spoke: 'halsa',
    spokeName: 'Hälsa',
    code: 'b152',
    domain: 'Känslofunktioner',
    performance: 2,
    indicatorQuestions: [
      'Kan barnet reglera känslor (glädje, ilska, sorg)?',
      'Har barnet god känslomässig balans?'
    ],
    triageLevel: 'yellow',
    notes: 'Viss frustration relaterad till läsutmaningar'
  },
  {
    spoke: 'trygg',
    spokeName: 'Trygghet',
    code: 'd240',
    domain: 'Hantera stress',
    performance: 2,
    indicatorQuestions: [
      'Kan barnet hantera stress och förändringar?',
      'Återhämtar sig barnet efter svåra situationer?'
    ],
    triageLevel: 'yellow',
    notes: 'Hög ljudnivå i klassrummet stressar'
  },
  {
    spoke: 'trygg',
    spokeName: 'Trygghet',
    code: 'e310',
    domain: 'Närmaste familjen',
    performance: 0,
    indicatorQuestions: [
      'Ger familjen trygghet och omsorg?',
      'Finns stabila vuxna i barnets närhet?'
    ],
    triageLevel: 'green',
    notes: 'Stöttande föräldrar som följer upp läxor'
  },
  {
    spoke: 'ansvarstagande',
    spokeName: 'Lärande',
    code: 'd140',
    domain: 'Lära sig läsa',
    performance: 3,
    indicatorQuestions: [
      'Klarar barnet läsning för sin ålder?',
      'Förstår barnet vad hen läser?'
    ],
    triageLevel: 'red',
    notes: 'Dyslexi - stora svårigheter utan anpassningar'
  },
  {
    spoke: 'ansvarstagande',
    spokeName: 'Lärande',
    code: 'd160',
    domain: 'Fokusera uppmärksamhet',
    performance: 2,
    indicatorQuestions: [
      'Kan barnet fokusera på uppgifter?',
      'Behåller barnet uppmärksamheten under lektioner?'
    ],
    triageLevel: 'yellow',
    notes: 'Kan koncentrera sig med strukturerat stöd'
  },
  {
    spoke: 'ansvarstagande',
    spokeName: 'Lärande',
    code: 'd350',
    domain: 'Konversation',
    performance: 1,
    indicatorQuestions: [
      'Kan barnet delta i samtal?',
      'Uttrycker sig barnet muntligt?'
    ],
    triageLevel: 'green',
    notes: 'God muntlig förmåga'
  }
];

// Omar H., 11 år - Tidig uppmärksamhet
const OMAR_N1_SCREENING: N1ScreeningItem[] = [
  {
    spoke: 'halsa',
    spokeName: 'Hälsa',
    code: 'b134',
    domain: 'Sömnfunktioner',
    performance: 0,
    indicatorQuestions: [
      'Sover barnet tillräckligt för sin ålder?',
      'Är barnet utvilad på morgonen?'
    ],
    triageLevel: 'green'
  },
  {
    spoke: 'halsa',
    spokeName: 'Hälsa',
    code: 'b152',
    domain: 'Känslofunktioner',
    performance: 1,
    indicatorQuestions: [
      'Kan barnet reglera känslor (glädje, ilska, sorg)?',
      'Har barnet god känslomässig balans?'
    ],
    triageLevel: 'green'
  },
  {
    spoke: 'trygg',
    spokeName: 'Trygghet',
    code: 'd240',
    domain: 'Hantera stress',
    performance: 2,
    indicatorQuestions: [
      'Kan barnet hantera stress och förändringar?',
      'Återhämtar sig barnet efter svåra situationer?'
    ],
    triageLevel: 'yellow',
    notes: 'Viss oro i vissa situationer, särskilt vid språkliga krav'
  },
  {
    spoke: 'trygg',
    spokeName: 'Trygghet',
    code: 'e310',
    domain: 'Närmaste familjen',
    performance: 0,
    indicatorQuestions: [
      'Ger familjen trygghet och omsorg?',
      'Finns stabila vuxna i barnets närhet?'
    ],
    triageLevel: 'green'
  },
  {
    spoke: 'ansvarstagande',
    spokeName: 'Lärande',
    code: 'd140',
    domain: 'Lära sig läsa',
    performance: 2,
    indicatorQuestions: [
      'Klarar barnet läsning för sin ålder?',
      'Förstår barnet vad hen läser?'
    ],
    triageLevel: 'yellow',
    notes: 'Språksvårigheter påverkar läsning på svenska'
  },
  {
    spoke: 'ansvarstagande',
    spokeName: 'Lärande',
    code: 'd820',
    domain: 'Skolutbildning',
    performance: 1,
    indicatorQuestions: [
      'Deltar barnet i skolan regelbundet?',
      'Närvarar barnet för sin ålder? (>90%)'
    ],
    triageLevel: 'green'
  },
  {
    spoke: 'respekterad',
    spokeName: 'Relationer',
    code: 'd710',
    domain: 'Grundläggande mellanmänskliga interaktioner',
    performance: 2,
    indicatorQuestions: [
      'Har barnet kamrater att umgås med?',
      'Deltar barnet i sociala aktiviteter?'
    ],
    triageLevel: 'yellow',
    notes: 'Viss social osäkerhet, men har ett par nära kamrater'
  }
];

// Sofia B., 16 år - Samordningsnivå (shows historical N1 that led to escalation)
const SOFIA_N1_SCREENING: N1ScreeningItem[] = [
  {
    spoke: 'halsa',
    spokeName: 'Hälsa',
    code: 'b134',
    domain: 'Sömnfunktioner',
    performance: 3,
    indicatorQuestions: [
      'Sover barnet tillräckligt för sin ålder?',
      'Är barnet utvilad på morgonen?'
    ],
    triageLevel: 'red',
    notes: 'Svåra sömnproblem, kopplade till ångest'
  },
  {
    spoke: 'halsa',
    spokeName: 'Hälsa',
    code: 'b152',
    domain: 'Känslofunktioner',
    performance: 3,
    indicatorQuestions: [
      'Kan barnet reglera känslor (glädje, ilska, sorg)?',
      'Har barnet god känslomässig balans?'
    ],
    triageLevel: 'red',
    notes: 'Generaliserat ångestsyndrom, panikattacker'
  },
  {
    spoke: 'trygg',
    spokeName: 'Trygghet',
    code: 'd240',
    domain: 'Hantera stress',
    performance: 3,
    indicatorQuestions: [
      'Kan barnet hantera stress och förändringar?',
      'Återhämtar sig barnet efter svåra situationer?'
    ],
    triageLevel: 'red',
    notes: 'Stora svårigheter med stresshantering'
  },
  {
    spoke: 'trygg',
    spokeName: 'Trygghet',
    code: 'e310',
    domain: 'Närmaste familjen',
    performance: 2,
    indicatorQuestions: [
      'Ger familjen trygghet och omsorg?',
      'Finns stabila vuxna i barnets närhet?'
    ],
    triageLevel: 'yellow',
    notes: 'Föräldrar separerade, växelvis boende skapar osäkerhet'
  },
  {
    spoke: 'ansvarstagande',
    spokeName: 'Lärande',
    code: 'd820',
    domain: 'Skolutbildning',
    performance: 3,
    indicatorQuestions: [
      'Deltar barnet i skolan regelbundet?',
      'Närvarar barnet för sin ålder? (>90%)'
    ],
    triageLevel: 'red',
    notes: 'Hög skolfrånvaro (>50%)'
  },
  {
    spoke: 'respekterad',
    spokeName: 'Relationer',
    code: 'd720',
    domain: 'Komplexa mellanmänskliga interaktioner',
    performance: 2,
    indicatorQuestions: [
      'Har barnet sociala relationer?',
      'Deltar barnet i gruppaktiviteter?'
    ],
    triageLevel: 'yellow',
    notes: 'Social isolering, få kamrater'
  }
];

// Profile data mapping
const N1_PROFILE_DATA: Record<string, N1ProfileData> = {
  erik: {
    name: 'Erik A.',
    age: 15,
    grade: 'Åk 9',
    level: 'N1',
    screening: ERIK_N1_SCREENING,
    summary: 'Erik visar inga svårigheter i de screenade områdena. Alla indikatorer är gröna (0-1).',
    recommendation: 'stay-n1'
  },
  lisa: {
    name: 'Lisa J.',
    age: 12,
    grade: 'Åk 6',
    level: 'N2',
    screening: LISA_N1_SCREENING,
    summary: 'Lisa visar stora svårigheter med läsning och skrivning (röd), samt gula indikatorer för sömn, känslor och relationer. N2 fördjupad analys påbörjad.',
    recommendation: 'proceed-n2'
  },
  elsa: {
    name: 'Elsa Bergström',
    age: 10,
    grade: 'Åk 4',
    level: 'N2',
    screening: ELSA_N1_SCREENING,
    summary: 'Elsa har dyslexi med stora svårigheter med läsning. Ljudböcker och bildstöd används som anpassningar. N2 fördjupad analys pågår.',
    recommendation: 'proceed-n2'
  },
  omar: {
    name: 'Omar H.',
    age: 11,
    grade: 'Åk 5',
    level: 'N1',
    screening: OMAR_N1_SCREENING,
    summary: 'Omar visar gula indikatorer i några områden relaterade till språksvårigheter. Tidig uppmärksamhet rekommenderas.',
    recommendation: 'monitor'
  },
  sofia: {
    name: 'Sofia B.',
    age: 16,
    grade: 'TE 1',
    level: 'N3',
    screening: SOFIA_N1_SCREENING,
    summary: 'Sofia visade flera röda indikatorer vid N1 screening, vilket ledde till eskalering först till N2 och sedan till N3 samordnad plan.',
    recommendation: 'proceed-n2'
  }
};

const N1Screening: React.FC<N1ScreeningProps> = ({ selectedProfileId }) => {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  // Get profile data
  const profileData = N1_PROFILE_DATA[selectedProfileId];

  // If no profile data exists
  if (!profileData) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-8 text-center">
          <Info className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-blue-900 mb-2">N1 Screening</h2>
          <p className="text-blue-800">
            Ingen N1 screening-data tillgänglig för denna profil.
          </p>
        </div>
      </div>
    );
  }

  const screeningData = profileData.screening;

  // Helper: Get color for qualifier value
  const getQualifierColor = (value: ICFQualifierValue): string => {
    switch (value) {
      case 0: return '#10b981'; // green-500
      case 1: return '#84cc16'; // lime-500
      case 2: return '#f59e0b'; // amber-500
      case 3: return '#f97316'; // orange-500
      case 4: return '#ef4444'; // red-500
      default: return '#6b7280'; // gray-500
    }
  };

  // Helper: Get triage badge
  const getTriageBadge = (level: 'green' | 'yellow' | 'red') => {
    switch (level) {
      case 'green':
        return (
          <div className="flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded text-xs font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Inga åtgärder
          </div>
        );
      case 'yellow':
        return (
          <div className="flex items-center gap-1 text-yellow-700 bg-yellow-100 px-2 py-1 rounded text-xs font-medium">
            <AlertTriangle className="w-4 h-4" />
            Tidig uppmärksamhet
          </div>
        );
      case 'red':
        return (
          <div className="flex items-center gap-1 text-red-700 bg-red-100 px-2 py-1 rounded text-xs font-medium">
            <AlertCircle className="w-4 h-4" />
            N2 Fördjupad analys
          </div>
        );
    }
  };

  // Helper: Get qualifier description
  const getQualifierDescription = (value: ICFQualifierValue): string => {
    switch (value) {
      case 0: return 'Inga svårigheter';
      case 1: return 'Lätta svårigheter';
      case 2: return 'Måttliga svårigheter';
      case 3: return 'Stora svårigheter';
      case 4: return 'Fullständiga svårigheter';
      default: return 'Ej specificerat';
    }
  };

  // Calculate counts
  const greenCount = screeningData.filter(i => i.triageLevel === 'green').length;
  const yellowCount = screeningData.filter(i => i.triageLevel === 'yellow').length;
  const redCount = screeningData.filter(i => i.triageLevel === 'red').length;

  // Calculate overall triage recommendation
  const overallTriage = (): 'green' | 'yellow' | 'red' => {
    if (redCount > 0) return 'red';
    if (yellowCount >= 2) return 'yellow';
    return 'green';
  };

  const triage = overallTriage();

  // Get header color based on level - modern gradients
  const getHeaderGradient = () => {
    switch (profileData.level) {
      case 'N1': return 'from-emerald-400 via-teal-500 to-cyan-600';
      case 'N2': return 'from-amber-400 via-orange-500 to-rose-500';
      case 'N3': return 'from-rose-400 via-pink-500 to-purple-600';
      default: return 'from-emerald-400 via-teal-500 to-cyan-600';
    }
  };

  const getLevelBgGradient = () => {
    switch (profileData.level) {
      case 'N1': return 'from-emerald-50/80 via-teal-50/60 to-cyan-50/40';
      case 'N2': return 'from-amber-50/80 via-orange-50/60 to-rose-50/40';
      case 'N3': return 'from-rose-50/80 via-pink-50/60 to-purple-50/40';
      default: return 'from-emerald-50/80 via-teal-50/60 to-cyan-50/40';
    }
  };

  const getLevelBadgeColor = () => {
    switch (profileData.level) {
      case 'N1': return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200';
      case 'N2': return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200';
      case 'N3': return 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-200';
      default: return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getLevelBgGradient()}`}>
      <div className="max-w-5xl mx-auto space-y-8 py-8 px-4">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-20 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-200/20 to-cyan-200/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-teal-200/20 to-emerald-200/20 blur-3xl" />
        </div>

        {/* Header */}
        <div className="text-center py-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${getHeaderGradient()} text-white mb-6 shadow-2xl shadow-emerald-200/50 transform hover:scale-105 transition-transform duration-300`}>
            <Activity className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3 tracking-tight">
            N1 Screening
          </h1>
          <p className="text-gray-500 text-lg font-light tracking-wide">
            Universell nivå • Performance-bedömning • Automatisk triage
          </p>
        </div>

        {/* Info Box - Glass morphism */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200/50">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Om N1 Screening</h3>
              <div className="text-sm text-gray-600 space-y-3">
                <p>
                  <strong className="text-gray-900">N1 = Universell nivå</strong> - Enkel screening för alla barn med endast Performance-bedömning (vad barnet GÖR).
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-2xl text-xs font-medium border border-emerald-100 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" /> 0-1: Inga åtgärder
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-2xl text-xs font-medium border border-amber-100 shadow-sm">
                    <AlertTriangle className="w-4 h-4" /> 2: Tidig uppmärksamhet
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-rose-50 text-red-700 rounded-2xl text-xs font-medium border border-red-100 shadow-sm">
                    <AlertCircle className="w-4 h-4" /> 3-4: N2 fördjupad analys
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-4 italic">
                  N1 screening tar 5-10 minuter och ger snabb överblick om barnet behöver fortsatt utredning.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Card - Glass morphism */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center bg-gradient-to-br ${getHeaderGradient()} shadow-xl`}>
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
                <span className={`px-3 py-1.5 text-xs font-bold rounded-xl ${getLevelBadgeColor()}`}>
                  {profileData.level}
                </span>
              </div>
              <p className="text-gray-500 font-medium">{profileData.age} år • {profileData.grade}</p>
            </div>
          </div>

          <div className={`mt-6 rounded-2xl p-5 border ${
            triage === 'green' ? 'bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border-emerald-100' :
            triage === 'yellow' ? 'bg-gradient-to-r from-amber-50/80 to-orange-50/80 border-amber-100' :
            'bg-gradient-to-r from-red-50/80 to-rose-50/80 border-red-100'
          }`}>
            <p className="text-sm text-gray-700 leading-relaxed">{profileData.summary}</p>
            <div className="mt-4 flex items-center gap-3">
              {getTriageBadge(triage)}
              {profileData.level !== 'N1' && (
                <span className="flex items-center gap-2 text-xs text-gray-500 bg-white/50 px-3 py-1.5 rounded-xl">
                  <ArrowRight className="w-3 h-3" />
                  Eskalerad till {profileData.level}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Screening Results - Glass morphism */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Screening-bedömningar</h3>
            <p className="text-sm text-gray-500">
              Klicka på varje bedömning för att se detaljer
            </p>
          </div>

          <div className="space-y-4">
            {screeningData.map((item, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                  className="w-full px-5 py-4 hover:bg-gray-50/50 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg"
                        style={{ backgroundColor: getQualifierColor(item.performance) }}
                      >
                        {item.performance}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {item.code}: {item.domain}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.spokeName} • {getQualifierDescription(item.performance)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getTriageBadge(item.triageLevel)}
                      {expandedItem === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>

                {expandedItem === index && (
                  <div className="px-5 py-5 border-t border-gray-100 bg-gradient-to-b from-gray-50/50 to-white/50 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Indikator-frågor:</p>
                      <ul className="space-y-2">
                        {item.indicatorQuestions.map((q, qIndex) => (
                          <li key={qIndex} className="flex items-start gap-3 text-sm text-gray-600">
                            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 mt-1.5 flex-shrink-0" />
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {item.notes && (
                      <div className={`p-4 rounded-xl text-sm border ${
                        item.triageLevel === 'red' ? 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-100' :
                        item.triageLevel === 'yellow' ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-100' :
                        'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-600 border-gray-100'
                      }`}>
                        <strong>Anteckning:</strong> {item.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Overall Summary - Glass morphism */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-200/50">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 text-lg">Sammanfattning</h4>
          </div>
          <div className="grid grid-cols-3 gap-5 mb-6">
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">Gröna (0-1)</p>
                <p className="text-3xl font-bold text-emerald-600">{greenCount}</p>
              </div>
              <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700"
                  style={{ width: `${(greenCount / screeningData.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide">Gula (2)</p>
                <p className="text-3xl font-bold text-amber-600">{yellowCount}</p>
              </div>
              <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700"
                  style={{ width: `${(yellowCount / screeningData.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="p-5 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border border-red-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-red-600 font-semibold uppercase tracking-wide">Röda (3-4)</p>
                <p className="text-3xl font-bold text-red-600">{redCount}</p>
              </div>
              <div className="h-2 bg-red-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-400 to-rose-500 rounded-full transition-all duration-700"
                  style={{ width: `${(redCount / screeningData.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className={`rounded-2xl p-5 border ${
            triage === 'green' ? 'bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border-emerald-100' :
            triage === 'yellow' ? 'bg-gradient-to-r from-amber-50/80 to-orange-50/80 border-amber-100' :
            'bg-gradient-to-r from-red-50/80 to-rose-50/80 border-red-100'
          }`}>
            <p className="font-semibold text-gray-900 mb-2">Rekommenderad åtgärd</p>
            {profileData.recommendation === 'stay-n1' && (
              <p className="text-sm text-gray-700 leading-relaxed">
                Inga åtgärder behövs. Fortsätt ordinarie uppföljning. Nästa N1 screening om 6-12 månader.
              </p>
            )}
            {profileData.recommendation === 'monitor' && (
              <p className="text-sm text-gray-700 leading-relaxed">
                Tidig uppmärksamhet. Följ upp inom 1-3 månader. Överväg riktade insatser i de gula områdena.
              </p>
            )}
            {profileData.recommendation === 'proceed-n2' && (
              <p className="text-sm text-gray-700 leading-relaxed">
                N2 Fördjupad analys rekommenderas. Barnet visar stora svårigheter i ett eller flera områden.
                {profileData.level !== 'N1' && (
                  <span className="block mt-2 text-xs font-medium text-gray-500 bg-white/50 inline-block px-3 py-1 rounded-lg">
                    {profileData.name} har redan eskalerat till {profileData.level}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* N1→N2 Progression info - Glass morphism */}
        {triage !== 'green' && (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200/50">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-3 text-lg">Nästa steg: N2 Fördjupad analys</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Vid N2 görs en djupare bedömning där vi jämför:
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                    <span className="font-semibold text-gray-900 block mb-1">Performance</span>
                    <span className="text-gray-500 text-sm">Vad barnet GÖR</span>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                    <span className="font-semibold text-gray-900 block mb-1">Capacity</span>
                    <span className="text-gray-500 text-sm">Vad barnet KAN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-sm text-gray-400 font-light tracking-wide">
            N1 Screening • Baserat på WHO ICF • Automatisk triage-rekommendation
          </p>
        </div>
      </div>
    </div>
  );
};

export default N1Screening;
