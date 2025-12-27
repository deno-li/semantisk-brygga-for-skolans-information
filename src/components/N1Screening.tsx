/**
 * N1 Screening Component
 * Universal screening for all children (Performance qualifiers only)
 * Based on WHO ICF N1 level - minimal assessment for triage
 */

import React, { useState, useMemo } from 'react';
import { Activity, TrendingUp, CheckCircle2, AlertTriangle, AlertCircle, Info, User, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
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

  // Get header color based on level
  const getHeaderGradient = () => {
    switch (profileData.level) {
      case 'N1': return 'from-green-600 to-green-800';
      case 'N2': return 'from-orange-600 to-orange-800';
      case 'N3': return 'from-red-600 to-red-800';
      default: return 'from-green-600 to-green-800';
    }
  };

  const getLevelBadgeColor = () => {
    switch (profileData.level) {
      case 'N1': return 'bg-green-100 text-green-800 border-green-300';
      case 'N2': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'N3': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getHeaderGradient()} text-white rounded-lg p-6`}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">N1 Screening - Universell nivå</h1>
            <p className="text-green-100 text-lg">
              Performance-bedömning • Automatisk triage • För alla barn
            </p>
          </div>
          <Activity className="w-12 h-12 text-green-200" />
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Om N1 Screening</h3>
            <div className="text-sm text-blue-900 space-y-2">
              <p>
                <strong>N1 = Universell nivå</strong> - Enkel screening för alla barn med endast Performance-bedömning (vad barnet GÖR).
              </p>
              <p>
                <strong>Automatisk triage:</strong>
              </p>
              <ul className="list-disc ml-6 mt-1">
                <li><strong className="text-green-700">0-1 (Grön):</strong> Inga åtgärder behövs</li>
                <li><strong className="text-yellow-700">2 (Gul):</strong> Tidig uppmärksamhet, följ upp</li>
                <li><strong className="text-red-700">3-4 (Röd):</strong> Behöver N2 fördjupad analys (Performance vs Capacity)</li>
              </ul>
              <p className="mt-3">
                <strong>N1 screening tar 5-10 minuter</strong> och ger snabb överblick om barnet behöver fortsatt utredning.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <User className={`w-16 h-16 ${
            profileData.level === 'N1' ? 'text-green-600' :
            profileData.level === 'N2' ? 'text-orange-600' :
            'text-red-600'
          }`} />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
              <span className={`px-2 py-1 text-xs font-medium rounded border ${getLevelBadgeColor()}`}>
                Aktuell nivå: {profileData.level}
              </span>
            </div>
            <p className="text-gray-600">{profileData.age} år, {profileData.grade}</p>

            <div className={`mt-4 rounded p-4 border ${
              triage === 'green' ? 'bg-green-50 border-green-300' :
              triage === 'yellow' ? 'bg-yellow-50 border-yellow-300' :
              'bg-red-50 border-red-300'
            }`}>
              <p className="font-medium text-gray-900 mb-2">📋 Screening-resultat:</p>
              <p className="text-sm text-gray-700">
                {profileData.summary}
              </p>
              <div className="mt-3 flex items-center gap-2">
                {getTriageBadge(triage)}
                {profileData.level !== 'N1' && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <ArrowRight className="w-3 h-3" />
                    Redan eskalerad till {profileData.level}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screening Results */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Screening-bedömningar (Performance)</h3>
          <p className="text-sm text-gray-600">
            Klicka på varje bedömning för att se indikator-frågor och anteckningar
          </p>
        </div>

        <div className="space-y-3">
          {screeningData.map((item, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Item Header */}
              <button
                onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: getQualifierColor(item.performance) }}
                    >
                      {item.performance}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {item.code}: {item.domain}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {item.spokeName} • {getQualifierDescription(item.performance)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTriageBadge(item.triageLevel)}
                    {expandedItem === index ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              {expandedItem === index && (
                <div className="px-4 py-3 border-t border-gray-200 bg-white space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Indikator-frågor:</p>
                    <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
                      {item.indicatorQuestions.map((q, qIndex) => (
                        <li key={qIndex}>{q}</li>
                      ))}
                    </ul>
                  </div>

                  {item.notes && (
                    <div className={`p-3 rounded text-sm ${
                      item.triageLevel === 'red' ? 'bg-red-50 text-red-800' :
                      item.triageLevel === 'yellow' ? 'bg-yellow-50 text-yellow-800' :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      <strong>Anteckning:</strong> {item.notes}
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      <strong>Performance ({item.performance}):</strong> {getQualifierDescription(item.performance)} i nuvarande miljö
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Overall Summary */}
      <div className={`border rounded-lg p-6 ${
        triage === 'green' ? 'bg-green-50 border-green-300' :
        triage === 'yellow' ? 'bg-yellow-50 border-yellow-300' :
        'bg-red-50 border-red-300'
      }`}>
        <h4 className="font-semibold text-gray-900 mb-3">Sammanfattning och rekommendation</h4>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-700 font-medium">Gröna (0-1)</p>
            <p className="text-3xl font-bold text-green-600">{greenCount}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-700 font-medium">Gula (2)</p>
            <p className="text-3xl font-bold text-yellow-600">{yellowCount}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-700 font-medium">Röda (3-4)</p>
            <p className="text-3xl font-bold text-red-600">{redCount}</p>
          </div>
        </div>

        <div className="bg-white rounded p-4 border border-gray-300">
          <p className="font-medium text-gray-900 mb-2">Rekommenderad åtgärd:</p>
          {profileData.recommendation === 'stay-n1' && (
            <p className="text-sm text-gray-700">
              ✅ <strong>Inga åtgärder behövs.</strong> Fortsätt ordinarie uppföljning. Nästa N1 screening om 6-12 månader.
            </p>
          )}
          {profileData.recommendation === 'monitor' && (
            <p className="text-sm text-gray-700">
              ⚠️ <strong>Tidig uppmärksamhet.</strong> Följ upp inom 1-3 månader. Överväg riktade insatser i de gula områdena. Om inga förbättringar, gå vidare till N2 fördjupad analys.
            </p>
          )}
          {profileData.recommendation === 'proceed-n2' && (
            <p className="text-sm text-gray-700">
              🔴 <strong>N2 Fördjupad analys rekommenderas.</strong> Barnet visar stora svårigheter (3-4) i ett eller flera områden. Behöver Performance vs Capacity-bedömning för att identifiera om anpassningar kan hjälpa.
              {profileData.level !== 'N1' && (
                <span className="block mt-2 font-medium">
                  → {profileData.name} har redan eskalerat till {profileData.level} baserat på denna screening.
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* N1→N2 Progression info */}
      {triage !== 'green' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <ArrowRight className="w-5 h-5" />
            Vad händer vid N2 Fördjupad analys?
          </h4>
          <div className="text-sm text-blue-900 space-y-2">
            <p>
              Vid N2 görs en djupare bedömning där vi jämför:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li><strong>Performance:</strong> Vad barnet GÖR i nuvarande miljö med anpassningar</li>
              <li><strong>Capacity:</strong> Vad barnet KAN göra utan anpassningar</li>
              <li><strong>Gap-analys:</strong> Om gapet är negativt fungerar anpassningarna!</li>
              <li><strong>Environmental Factors:</strong> Vilka barriärer och skyddsfaktorer finns?</li>
            </ul>
            <p className="mt-3">
              N2 ger en tydligare bild av om nuvarande insatser fungerar eller om de behöver justeras.
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-700">
          <strong>N1 Screening</strong> är en enkel och snabb bedömning som ger automatisk triage-rekommendation.
        </p>
        <p className="text-xs text-gray-600 mt-2">
          Baserat på WHO ICF Beginner's Guide (2002) och praktiska riktlinjer för svensk välfärd.
        </p>
      </div>
    </div>
  );
};

export default N1Screening;
