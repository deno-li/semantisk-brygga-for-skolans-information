/**
 * N1 Screening Component
 * Universal screening for all children (Performance qualifiers only)
 * Based on WHO ICF N1 level - minimal assessment for triage
 */

import React, { useState } from 'react';
import { Activity, TrendingUp, CheckCircle2, AlertTriangle, AlertCircle, Info, User } from 'lucide-react';
import { ICFQualifierValue } from '../types/icf-types';
import { WelfareWheelSpoke } from '../types/types';

// N1 Screening Assessment (Performance only, no Capacity)
interface N1ScreeningItem {
  spoke: WelfareWheelSpoke;
  spokeName: string;
  code: string;
  domain: string;
  performance: ICFQualifierValue;
  indicatorQuestions: string[];
  triageLevel: 'green' | 'yellow' | 'red';
}

// Erik A., 15 år - Universell nivå exempel
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
    spoke: 'larande',
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
    spoke: 'larande',
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

const N1Screening: React.FC = () => {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

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

  // Calculate overall triage recommendation
  const overallTriage = (): 'green' | 'yellow' | 'red' => {
    const redCount = ERIK_N1_SCREENING.filter(item => item.triageLevel === 'red').length;
    const yellowCount = ERIK_N1_SCREENING.filter(item => item.triageLevel === 'yellow').length;

    if (redCount > 0) return 'red';
    if (yellowCount >= 2) return 'yellow';
    return 'green';
  };

  const triage = overallTriage();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg p-6">
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
          <User className="w-16 h-16 text-green-600" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">Erik A.</h2>
            <p className="text-gray-600">15 år, Åk 9 • Nivå: N1 (Universell screening)</p>

            <div className="mt-4 bg-green-50 border border-green-300 rounded p-4">
              <p className="font-medium text-green-900 mb-2">📋 Screening-resultat:</p>
              <p className="text-sm text-green-900">
                Erik visar inga svårigheter i de screenade områdena. Alla indikatorer är gröna (0-1).
              </p>
              <div className="mt-3">
                {getTriageBadge(triage)}
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
            Klicka på varje bedömning för att se indikator-frågor
          </p>
        </div>

        <div className="space-y-3">
          {ERIK_N1_SCREENING.map((item, index) => (
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
                  {getTriageBadge(item.triageLevel)}
                </div>
              </button>

              {/* Expanded Content */}
              {expandedItem === index && (
                <div className="px-4 py-3 border-t border-gray-200 bg-white">
                  <p className="text-sm font-medium text-gray-900 mb-2">Indikator-frågor:</p>
                  <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
                    {item.indicatorQuestions.map((q, qIndex) => (
                      <li key={qIndex}>{q}</li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      <strong>Performance (0):</strong> {getQualifierDescription(item.performance)} i nuvarande miljö
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
            <p className="text-3xl font-bold text-green-600">
              {ERIK_N1_SCREENING.filter(i => i.triageLevel === 'green').length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-700 font-medium">Gula (2)</p>
            <p className="text-3xl font-bold text-yellow-600">
              {ERIK_N1_SCREENING.filter(i => i.triageLevel === 'yellow').length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-700 font-medium">Röda (3-4)</p>
            <p className="text-3xl font-bold text-red-600">
              {ERIK_N1_SCREENING.filter(i => i.triageLevel === 'red').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded p-4 border border-gray-300">
          <p className="font-medium text-gray-900 mb-2">Rekommenderad åtgärd:</p>
          {triage === 'green' && (
            <p className="text-sm text-gray-700">
              ✅ <strong>Inga åtgärder behövs.</strong> Fortsätt ordinarie uppföljning. Nästa N1 screening om 6-12 månader.
            </p>
          )}
          {triage === 'yellow' && (
            <p className="text-sm text-gray-700">
              ⚠️ <strong>Tidig uppmärksamhet.</strong> Följ upp inom 1-3 månader. Överväg riktade insatser i de gula områdena. Om inga förbättringar, gå vidare till N2 fördjupad analys.
            </p>
          )}
          {triage === 'red' && (
            <p className="text-sm text-gray-700">
              🔴 <strong>N2 Fördjupad analys rekommenderas.</strong> Barnet visar stora svårigheter (3-4) i ett eller flera områden. Behöver Performance vs Capacity-bedömning för att identifiera om anpassningar kan hjälpa.
            </p>
          )}
        </div>
      </div>

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
