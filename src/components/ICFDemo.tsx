/**
 * ICF Demo Component
 * Demonstrates WHO ICF integration with Performance/Capacity and Environmental Factors
 * Uses Elsa's profile from the guide as example
 */

import React, { useState } from 'react';
import { Activity, Shield, TrendingUp, Info, User, BookOpen } from 'lucide-react';
import ICFGapAnalysis from './ICFGapAnalysis';
import RiskProtectionBalance from './RiskProtectionBalance';
import { ELSA_PROFILE } from '../data/icf-demo-profiles';
import { WelfareWheelSpoke } from '../types/types';

const ICFDemo: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'gap' | 'risk'>('overview');
  const [selectedSpoke, setSelectedSpoke] = useState<WelfareWheelSpoke | undefined>(undefined);

  const { icfAssessments, environmentalFactors, riskProtectionBalance, summary, childsVoice } = ELSA_PROFILE;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">ICF-integration enligt WHO</h1>
            <p className="text-blue-100 text-lg">
              Performance vs Capacity • Environmental Factors • Gap-analys
            </p>
          </div>
          <Activity className="w-12 h-12 text-blue-200" />
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Om WHO ICF-ramverket</h3>
            <div className="text-sm text-blue-900 space-y-2">
              <p>
                <strong>Performance</strong> = vad barnet GÖR i sin nuvarande miljö med anpassningar (t.ex. bildstöd, lugnrum).
              </p>
              <p>
                <strong>Capacity</strong> = vad barnet KAN göra i standardmiljö utan hjälpmedel eller personligt stöd.
              </p>
              <p>
                <strong>Gap-analys</strong> (Performance - Capacity) visar om anpassningar fungerar:
              </p>
              <ul className="list-disc ml-6 mt-1">
                <li><strong>Negativ gap:</strong> Anpassningar FUNGERAR (Performance bättre än Capacity)</li>
                <li><strong>Positiv gap:</strong> Barriärer finns (Performance sämre än Capacity)</li>
                <li><strong>Gap = 0:</strong> Neutral (Performance = Capacity)</li>
              </ul>
              <p className="mt-3">
                <strong>Environmental Factors</strong> (e-koder) kvantifierar hinder och möjliggörare:
              </p>
              <ul className="list-disc ml-6 mt-1">
                <li><strong>Barriers (.1-.4):</strong> Hinder i miljön som begränsar delaktighet</li>
                <li><strong>Facilitators (+1-+4):</strong> Möjliggörare som förbättrar delaktighet</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <User className="w-16 h-16 text-blue-600" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{ELSA_PROFILE.name}</h2>
            <p className="text-gray-600">{ELSA_PROFILE.age} år, {ELSA_PROFILE.grade} • Nivå: {ELSA_PROFILE.level}</p>

            <div className="mt-4 bg-yellow-50 border border-yellow-300 rounded p-4">
              <p className="font-medium text-yellow-900 mb-2">📖 Sammanfattning:</p>
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
                    {summary.nextSteps.map((s, i) => (
                      <li key={i}>→ {s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Barnets röst */}
            <div className="mt-4 bg-green-50 border border-green-300 rounded p-4">
              <p className="font-medium text-green-900 mb-2">💬 Elsas röst:</p>
              <p className="text-sm text-green-900 italic">"{childsVoice.goals}"</p>
              <p className="text-xs text-green-800 mt-2">{childsVoice.howFeeling}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-300">
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedTab === 'overview'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Översikt
            </div>
          </button>
          <button
            onClick={() => setSelectedTab('gap')}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedTab === 'gap'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Gap-analys
            </div>
          </button>
          <button
            onClick={() => setSelectedTab('risk')}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedTab === 'risk'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Risk/Skydd-balans
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-300 rounded-lg p-6 text-center">
                <Activity className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">ICF Assessments</p>
                <p className="text-3xl font-bold text-gray-900">{icfAssessments.length}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {icfAssessments.filter(a => a.gapInterpretation === 'facilitators-work').length} med fungerar anpassningar
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

            {/* Both components in overview */}
            <ICFGapAnalysis assessments={icfAssessments} />
            <RiskProtectionBalance
              environmentalFactors={environmentalFactors}
              showBySpoke={true}
            />
          </div>
        )}

        {selectedTab === 'gap' && (
          <ICFGapAnalysis assessments={icfAssessments} showMetadata={true} />
        )}

        {selectedTab === 'risk' && (
          <RiskProtectionBalance
            environmentalFactors={environmentalFactors}
            showBySpoke={true}
            selectedSpoke={selectedSpoke}
          />
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-700">
          <strong>Referenser:</strong> WHO (2002). ICF Beginner's Guide • Världshälsoorganisationen (2001). ICF: International Classification of Functioning, Disability and Health
        </p>
        <p className="text-xs text-gray-600 mt-2">
          Detta är en prototyp för demonstration. Baserad på exempel från praktiska guiden för ICF-integration i svensk välfärd.
        </p>
      </div>
    </div>
  );
};

export default ICFDemo;
