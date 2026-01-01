/**
 * N2 Deep Dive Component
 * Targeted analysis with Performance vs Capacity and Environmental Factors
 * Based on WHO ICF N2 level - for children identified in N1 screening or with known concerns
 */

import React, { useState, useMemo } from 'react';
import { Activity, Shield, TrendingUp, Info, User, Target, BarChart3 } from 'lucide-react';
import ICFGapAnalysis from './ICFGapAnalysis';
import RiskProtectionBalance from './RiskProtectionBalance';
import GapTrendChart from './GapTrendChart';
import { ICF_DEMO_PROFILES, LISA_GAP_TREND_LEARNING, ELSA_GAP_TREND_READING } from '../data/icf-demo-profiles';
import { GapTrend } from '../types/icf-types';

interface N2DeepDiveProps {
  selectedProfileId: string;
}

const N2DeepDive: React.FC<N2DeepDiveProps> = ({ selectedProfileId }) => {
  const [selectedView, setSelectedView] = useState<'gap' | 'risk' | 'both' | 'trend'>('both');

  const profile = ICF_DEMO_PROFILES[selectedProfileId];

  // Get gap trends for the current profile
  const profileGapTrends = useMemo((): GapTrend[] => {
    if (!profile || !profile.gapTrends) return [];
    return Object.values(profile.gapTrends) as GapTrend[];
  }, [profile]);

  // If profile doesn't have N2 ICF data yet, show placeholder
  if (!profile || !profile.icfAssessments || profile.level !== 'N2') {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-8 text-center">
          <Info className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-yellow-900 mb-2">N2 Fördjupad analys inte tillgänglig</h2>
          <p className="text-yellow-800">
            N2 Fördjupad analys är för närvarande implementerad för <strong>Lisa J.</strong> och <strong>Elsa Bergström</strong>.
          </p>
          <p className="text-sm text-yellow-700 mt-2">
            Välj Lisa eller Elsa från profil-menyn för att se N2-nivå med Performance vs Capacity gap-analys.
          </p>
        </div>
      </div>
    );
  }

  const { icfAssessments, environmentalFactors, riskProtectionBalance, summary, childsVoice } = profile;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white text-2xl mb-4 shadow-lg">
          <Activity className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">N2 Fördjupad analys</h1>
        <p className="text-gray-600">Riktad nivå • Performance vs Capacity • Gap-analys</p>
      </div>

      {/* Info Box */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Om N2 Fördjupad analys</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong className="text-gray-900">N2 = Riktad nivå</strong> - För barn som identifierats i N1 screening eller har kända bekymmer.
              </p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="p-2 bg-gray-50 rounded-lg text-xs">
                  <span className="font-medium text-gray-900">Performance vs Capacity</span>
                  <span className="text-gray-500 block">Jämför GÖR mot KAN</span>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg text-xs">
                  <span className="font-medium text-gray-900">Gap-analys</span>
                  <span className="text-gray-500 block">Fungerar anpassningar?</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                N2 analys tar 30-60 minuter och ger djup förståelse för barnets behov.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-5 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center">
            <User className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                {profile.level}
              </span>
            </div>
            <p className="text-sm text-gray-500">{profile.age} år • {profile.grade}</p>
          </div>
        </div>

        <div className="bg-amber-50 rounded-xl p-4 mb-4">
          <p className="font-medium text-gray-900 mb-2 text-sm">Primära bekymmer</p>
          <p className="text-sm text-gray-700">{summary.primaryConcerns.join(', ')}</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-medium text-gray-700 mb-1">Styrkor</p>
              <ul className="text-xs text-gray-600 space-y-0.5">
                {summary.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-emerald-500">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-700 mb-1">Nästa steg</p>
              <ul className="text-xs text-gray-600 space-y-0.5">
                {summary.nextSteps.slice(0, 3).map((s, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-amber-500">→</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {childsVoice && (
          <div className="bg-emerald-50 rounded-xl p-4">
            <p className="font-medium text-gray-900 mb-2 text-sm">{profile.name.split(' ')[0]}s röst</p>
            <p className="text-sm text-gray-700 italic">"{childsVoice.goals}"</p>
            <p className="text-xs text-gray-500 mt-2">{childsVoice.howFeeling}</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-3">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{icfAssessments.length}</p>
          <p className="text-xs text-gray-500">ICF-bedömningar</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-3">
            <Shield className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">+{riskProtectionBalance.protectionScore}</p>
          <p className="text-xs text-gray-500">Skyddsfaktorer</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{riskProtectionBalance.riskScore}</p>
          <p className="text-xs text-gray-500">Riskfaktorer</p>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'both', label: 'Översikt', icon: <Target className="w-4 h-4" /> },
          { id: 'gap', label: 'Gap-analys', icon: <Activity className="w-4 h-4" /> },
          { id: 'risk', label: 'Risk/Skydd', icon: <Shield className="w-4 h-4" /> },
          { id: 'trend', label: 'Gap-trend', icon: <BarChart3 className="w-4 h-4" /> }
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => setSelectedView(view.id as typeof selectedView)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
              selectedView === view.id
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50'
            }`}
          >
            {view.icon}
            {view.label}
          </button>
        ))}
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

        {selectedView === 'trend' && (
          <GapTrendChart
            trends={profileGapTrends}
            title="Gap-trendanalys över tid"
            showInterventions={true}
          />
        )}
      </div>

      {/* Action Plan */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-4">Handlingsplan</h4>
        <div className="space-y-3">
          <div className="bg-emerald-50 rounded-xl p-4">
            <p className="font-medium text-gray-900 mb-2 text-sm">Fortsätt fungerande anpassningar</p>
            <ul className="text-sm text-gray-600 space-y-1">
              {summary.nextSteps
                .filter(s => s.includes('Fortsätt'))
                .map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500">✓</span> {step}
                  </li>
                ))}
            </ul>
          </div>

          <div className="bg-amber-50 rounded-xl p-4">
            <p className="font-medium text-gray-900 mb-2 text-sm">Nya insatser att överväga</p>
            <ul className="text-sm text-gray-600 space-y-1">
              {summary.nextSteps
                .filter(s => s.includes('Överväg') || s.includes('Förstärk'))
                .map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500">→</span> {step}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {riskProtectionBalance.balance < 0 && (
        <div className="bg-red-50 rounded-2xl border border-red-200 p-5">
          <p className="font-medium text-red-800 mb-1 text-sm">Rekommendation: N3 Samordnad plan</p>
          <p className="text-sm text-red-700">
            Risk/Skydd-balansen är negativ. Överväg samverkan mellan skola, socialtjänst och vård.
          </p>
        </div>
      )}

      {summary.interventionsWorking && (
        <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5">
          <p className="font-medium text-emerald-800 mb-1 text-sm">Positiv utveckling</p>
          <p className="text-sm text-emerald-700">
            Nuvarande anpassningar fungerar! Gap-analysen visar att Performance är bättre än Capacity.
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-400">
          N2 Fördjupad analys • WHO ICF • Performance vs Capacity
        </p>
      </div>
    </div>
  );
};

export default N2DeepDive;
