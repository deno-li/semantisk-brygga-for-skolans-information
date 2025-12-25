/**
 * N2 Deep Dive Component
 * Targeted analysis with Performance vs Capacity and Environmental Factors
 * Based on WHO ICF N2 level - for children identified in N1 screening or with known concerns
 */

import React, { useState } from 'react';
import { Activity, Shield, TrendingUp, Info, User, Target } from 'lucide-react';
import ICFGapAnalysis from './ICFGapAnalysis';
import RiskProtectionBalance from './RiskProtectionBalance';
import { LISA_PROFILE } from '../data/icf-demo-profiles';

const N2DeepDive: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'gap' | 'risk' | 'both'>('both');

  const { icfAssessments, environmentalFactors, riskProtectionBalance, summary, childsVoice } = LISA_PROFILE;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">N2 Fördjupad analys - Riktad nivå</h1>
            <p className="text-orange-100 text-lg">
              Performance vs Capacity • Gap-analys • Environmental Factors
            </p>
          </div>
          <Activity className="w-12 h-12 text-orange-200" />
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Om N2 Fördjupad analys</h3>
            <div className="text-sm text-blue-900 space-y-2">
              <p>
                <strong>N2 = Riktad nivå</strong> - För barn som identifierats i N1 screening (Performance 2-4) eller har kända bekymmer.
              </p>
              <p>
                <strong>N2-bedömning inkluderar:</strong>
              </p>
              <ul className="list-disc ml-6 mt-1">
                <li><strong>Performance vs Capacity:</strong> Jämför vad barnet GÖR (med stöd) mot vad barnet KAN (utan stöd)</li>
                <li><strong>Gap-analys:</strong> Performance - Capacity visar om anpassningar fungerar</li>
                <li><strong>Environmental Factors:</strong> Identifierar barriers (.1-.4) och facilitators (+1-+4)</li>
                <li><strong>Risk/Skydd-balans:</strong> Kvantifierar hinder och möjliggörare per eker</li>
              </ul>
              <p className="mt-3">
                <strong>N2 analys tar 30-60 minuter</strong> och ger djup förståelse för barnets behov och om pågående insatser fungerar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <User className="w-16 h-16 text-orange-600" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{LISA_PROFILE.name}</h2>
            <p className="text-gray-600">{LISA_PROFILE.age} år, {LISA_PROFILE.grade} • Nivå: {LISA_PROFILE.level} (Fördjupad analys)</p>

            <div className="mt-4 bg-yellow-50 border border-yellow-300 rounded p-4">
              <p className="font-medium text-yellow-900 mb-2">📖 Primära bekymmer:</p>
              <p className="text-sm text-yellow-900">{summary.primaryConcerns.join(', ')}</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-yellow-900 mb-1">Styrkor:</p>
                  <ul className="text-xs text-yellow-800 space-y-0.5">
                    {summary.strengths.map((s, i) => (
                      <li key={i}>✓ {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-yellow-900 mb-1">Nästa steg:</p>
                  <ul className="text-xs text-yellow-800 space-y-0.5">
                    {summary.nextSteps.slice(0, 3).map((s, i) => (
                      <li key={i}>→ {s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Barnets röst */}
            <div className="mt-4 bg-green-50 border border-green-300 rounded p-4">
              <p className="font-medium text-green-900 mb-2">💬 Lisas röst:</p>
              <p className="text-sm text-green-900 italic">"{childsVoice.goals}"</p>
              <p className="text-xs text-green-800 mt-2">{childsVoice.howFeeling}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-300 rounded-lg p-6 text-center">
          <Activity className="w-10 h-10 text-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">ICF-bedömningar</p>
          <p className="text-3xl font-bold text-gray-900">{icfAssessments.length}</p>
          <p className="text-xs text-gray-600 mt-1">
            {icfAssessments.filter(a => a.gapInterpretation === 'facilitators-work').length} med fungerande anpassningar
          </p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6 text-center">
          <Shield className="w-10 h-10 text-green-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">Skyddsfaktorer</p>
          <p className="text-3xl font-bold text-green-600">+{riskProtectionBalance.protectionScore}</p>
          <p className="text-xs text-gray-600 mt-1">
            {riskProtectionBalance.facilitators.length} facilitators
          </p>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6 text-center">
          <TrendingUp className="w-10 h-10 text-orange-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">Riskfaktorer</p>
          <p className="text-3xl font-bold text-orange-600">{riskProtectionBalance.riskScore}</p>
          <p className="text-xs text-gray-600 mt-1">
            {riskProtectionBalance.barriers.length} barriers
          </p>
        </div>
      </div>

      {/* View Selector */}
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">Välj vy:</p>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedView('both')}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                selectedView === 'both'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Target className="w-4 h-4 inline mr-1" />
              Översikt
            </button>
            <button
              onClick={() => setSelectedView('gap')}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                selectedView === 'gap'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Activity className="w-4 h-4 inline mr-1" />
              Gap-analys
            </button>
            <button
              onClick={() => setSelectedView('risk')}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                selectedView === 'risk'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Shield className="w-4 h-4 inline mr-1" />
              Risk/Skydd
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {selectedView === 'both' && (
          <div className="space-y-6">
            <ICFGapAnalysis assessments={icfAssessments} showMetadata={false} />
            <RiskProtectionBalance
              environmentalFactors={environmentalFactors}
              showBySpoke={true}
            />
          </div>
        )}

        {selectedView === 'gap' && (
          <ICFGapAnalysis assessments={icfAssessments} showMetadata={true} />
        )}

        {selectedView === 'risk' && (
          <RiskProtectionBalance
            environmentalFactors={environmentalFactors}
            showBySpoke={true}
          />
        )}
      </div>

      {/* Action Plan */}
      <div className="bg-blue-50 border border-blue-300 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">📋 Handlingsplan baserat på N2-analys</h4>
        <div className="space-y-3">
          <div className="bg-white rounded p-4 border border-blue-200">
            <p className="font-medium text-gray-900 mb-2">1. Fortsätt fungerande anpassningar</p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              {summary.nextSteps
                .filter(s => s.includes('Fortsätt'))
                .map((step, i) => (
                  <li key={i}>• {step}</li>
                ))}
            </ul>
          </div>

          <div className="bg-white rounded p-4 border border-blue-200">
            <p className="font-medium text-gray-900 mb-2">2. Nya insatser att överväga</p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              {summary.nextSteps
                .filter(s => s.includes('Överväg') || s.includes('Förstärk'))
                .map((step, i) => (
                  <li key={i}>• {step}</li>
                ))}
            </ul>
          </div>

          <div className="bg-white rounded p-4 border border-blue-200">
            <p className="font-medium text-gray-900 mb-2">3. Uppföljning</p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              {summary.nextSteps
                .filter(s => s.includes('Uppföljning') || s.includes('Sträva'))
                .map((step, i) => (
                  <li key={i}>• {step}</li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* N3 Recommendation */}
      {riskProtectionBalance.balance < 0 && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-6">
          <h4 className="font-semibold text-red-900 mb-2">⚠️ Rekommendation: N3 Samordnad plan</h4>
          <p className="text-sm text-red-900">
            Risk/Skydd-balansen är negativ ({riskProtectionBalance.balance}), vilket indikerar att barriärer är
            starkare än skyddsfaktorer. Överväg att eskalera till <strong>N3 Samordnad plan</strong> med
            samverkan mellan skola, socialtjänst och vård för att stärka skyddsfaktorerna och minska barriärerna.
          </p>
        </div>
      )}

      {summary.interventionsWorking && (
        <div className="bg-green-50 border border-green-300 rounded-lg p-6">
          <h4 className="font-semibold text-green-900 mb-2">✅ Positiv utveckling</h4>
          <p className="text-sm text-green-900">
            Nuvarande anpassningar fungerar! Gap-analysen visar att Performance är bättre än Capacity i flera områden,
            vilket betyder att anpassningarna (bildstöd, lugnrum, stödsamtal) har tydlig positiv effekt. Fortsätt med
            dessa insatser och utvärdera regelbundet.
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-700">
          <strong>N2 Fördjupad analys</strong> ger djup förståelse för barnets funktionsförmåga och om anpassningar fungerar.
        </p>
        <p className="text-xs text-gray-600 mt-2">
          Baserat på WHO ICF Beginner's Guide (2002) • Performance vs Capacity • Environmental Factors
        </p>
      </div>
    </div>
  );
};

export default N2DeepDive;
