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

  // Get level-specific gradient - modern
  const getLevelGradient = (level: string) => {
    switch (level) {
      case 'N1': return 'from-emerald-400 via-teal-500 to-cyan-600';
      case 'N2': return 'from-amber-400 via-orange-500 to-rose-500';
      case 'N3': return 'from-rose-400 via-pink-500 to-purple-600';
      default: return 'from-amber-400 via-orange-500 to-rose-500';
    }
  };

  // Get level-specific background gradient
  const getLevelBgGradient = (level: string) => {
    switch (level) {
      case 'N1': return 'from-emerald-50/80 via-teal-50/60 to-cyan-50/40';
      case 'N2': return 'from-amber-50/80 via-orange-50/60 to-rose-50/40';
      case 'N3': return 'from-rose-50/80 via-pink-50/60 to-purple-50/40';
      default: return 'from-amber-50/80 via-orange-50/60 to-rose-50/40';
    }
  };

  // If profile doesn't have ICF data, show placeholder
  if (!profile || !profile.icfAssessments) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-rose-50/40">
        <div className="max-w-5xl mx-auto space-y-8 py-8 px-4">
          {/* Decorative background */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-20 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-amber-200/20 to-orange-200/20 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-orange-200/20 to-rose-200/20 blur-3xl" />
          </div>

          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white mb-6 shadow-2xl shadow-amber-200/50 transform hover:scale-105 transition-transform duration-300">
              <Activity className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3 tracking-tight">
              N2 Fördjupad analys
            </h1>
            <p className="text-gray-500 text-lg font-light tracking-wide">
              Riktad nivå • Performance vs Capacity • Gap-analys
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-10 shadow-xl shadow-gray-100/50 text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-200/50">
              <Info className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">ICF-data inte tillgänglig</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              N2 Fördjupad analys kräver ICF-bedömningar med Performance vs Capacity.
            </p>
            <p className="text-sm text-gray-400">
              Alla profiler med ICF-data kan visas här.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { icfAssessments, environmentalFactors, riskProtectionBalance, summary, childsVoice } = profile;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getLevelBgGradient(profile.level)}`}>
      <div className="max-w-5xl mx-auto space-y-8 py-8 px-4">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-20 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-amber-200/20 to-orange-200/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-orange-200/20 to-rose-200/20 blur-3xl" />
        </div>

        {/* Header */}
        <div className="text-center py-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${getLevelGradient(profile.level)} text-white mb-6 shadow-2xl shadow-amber-200/50 transform hover:scale-105 transition-transform duration-300`}>
            <Activity className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3 tracking-tight">
            N2 Fördjupad analys
          </h1>
          <p className="text-gray-500 text-lg font-light tracking-wide">
            {profile.level === 'N1' ? 'Tidig uppmärksamhet' : profile.level === 'N3' ? 'Samordnad nivå' : 'Riktad nivå'} • Performance vs Capacity • Gap-analys
          </p>
        </div>

        {/* Info Box - Glass morphism */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-200/50">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Om N2 Fördjupad analys</h3>
              <div className="text-sm text-gray-600 space-y-3">
                <p>
                  <strong className="text-gray-900">N2 = Riktad nivå</strong> - För barn som identifierats i N1 screening eller har kända bekymmer.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                    <span className="font-semibold text-gray-900 block mb-1">Performance vs Capacity</span>
                    <span className="text-gray-500 text-sm">Jämför GÖR mot KAN</span>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                    <span className="font-semibold text-gray-900 block mb-1">Gap-analys</span>
                    <span className="text-gray-500 text-sm">Fungerar anpassningar?</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4 italic">
                  N2 analys tar 30-60 minuter och ger djup förståelse för barnets behov.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Card - Glass morphism */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-6 mb-6">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center bg-gradient-to-br ${getLevelGradient(profile.level)} shadow-xl`}>
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                <span className={`px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r ${getLevelGradient(profile.level)} text-white shadow-lg`}>
                  {profile.level}
                </span>
              </div>
              <p className="text-gray-500 font-medium">{profile.age} år • {profile.grade}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 rounded-2xl p-5 border border-amber-100 mb-5">
            <p className="font-semibold text-gray-900 mb-3">Primära bekymmer</p>
            <p className="text-sm text-gray-700 leading-relaxed">{summary.primaryConcerns.join(', ')}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-white/60 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Styrkor</p>
                <ul className="text-sm text-gray-600 space-y-1.5">
                  {summary.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/60 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Nästa steg</p>
                <ul className="text-sm text-gray-600 space-y-1.5">
                  {summary.nextSteps.slice(0, 3).map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">→</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {childsVoice && (
            <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-2xl p-5 border border-emerald-100">
              <p className="font-semibold text-gray-900 mb-2">{profile.name.split(' ')[0]}s röst</p>
              <p className="text-sm text-gray-700 italic leading-relaxed">"{childsVoice.goals}"</p>
              <p className="text-xs text-gray-500 mt-3">{childsVoice.howFeeling}</p>
            </div>
          )}
        </div>

        {/* Quick Stats - Glass morphism */}
        <div className="grid grid-cols-3 gap-5">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-6 text-center shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200/50">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{icfAssessments.length}</p>
            <p className="text-sm text-gray-500 font-medium mt-1">ICF-bedömningar</p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-6 text-center shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200/50">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <p className="text-3xl font-bold text-emerald-600">+{riskProtectionBalance.protectionScore}</p>
            <p className="text-sm text-gray-500 font-medium mt-1">Skyddsfaktorer</p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-6 text-center shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-200/50">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <p className="text-3xl font-bold text-amber-600">{riskProtectionBalance.riskScore}</p>
            <p className="text-sm text-gray-500 font-medium mt-1">Riskfaktorer</p>
          </div>
        </div>

        {/* View Selector - Modern tabs */}
        <div className="flex gap-3 flex-wrap">
          {[
            { id: 'both', label: 'Översikt', icon: <Target className="w-4 h-4" /> },
            { id: 'gap', label: 'Gap-analys', icon: <Activity className="w-4 h-4" /> },
            { id: 'risk', label: 'Risk/Skydd', icon: <Shield className="w-4 h-4" /> },
            { id: 'trend', label: 'Gap-trend', icon: <BarChart3 className="w-4 h-4" /> }
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setSelectedView(view.id as typeof selectedView)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-2xl transition-all duration-300 ${
                selectedView === view.id
                  ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white shadow-lg shadow-amber-200/50 transform scale-105'
                  : 'bg-white/70 backdrop-blur-sm border border-white/50 text-gray-600 hover:border-amber-200 hover:bg-amber-50/50 hover:shadow-md'
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

        {/* Action Plan - Glass morphism */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50">
          <h4 className="font-bold text-gray-900 mb-5 text-lg">Handlingsplan</h4>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-2xl p-5 border border-emerald-100">
              <p className="font-semibold text-gray-900 mb-3">Fortsätt fungerande anpassningar</p>
              <ul className="text-sm text-gray-600 space-y-2">
                {summary.nextSteps
                  .filter(s => s.includes('Fortsätt'))
                  .map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-emerald-500 font-bold">✓</span> {step}
                    </li>
                  ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 rounded-2xl p-5 border border-amber-100">
              <p className="font-semibold text-gray-900 mb-3">Nya insatser att överväga</p>
              <ul className="text-sm text-gray-600 space-y-2">
                {summary.nextSteps
                  .filter(s => s.includes('Överväg') || s.includes('Förstärk'))
                  .map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-amber-500 font-bold">→</span> {step}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {riskProtectionBalance.balance < 0 && (
          <div className="bg-gradient-to-r from-red-50/80 to-rose-50/80 rounded-3xl border border-red-200 p-6 shadow-lg">
            <p className="font-semibold text-red-800 mb-2">Rekommendation: N3 Samordnad plan</p>
            <p className="text-sm text-red-700 leading-relaxed">
              Risk/Skydd-balansen är negativ. Överväg samverkan mellan skola, socialtjänst och vård.
            </p>
          </div>
        )}

        {summary.interventionsWorking && (
          <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-3xl border border-emerald-200 p-6 shadow-lg">
            <p className="font-semibold text-emerald-800 mb-2">Positiv utveckling</p>
            <p className="text-sm text-emerald-700 leading-relaxed">
              Nuvarande anpassningar fungerar! Gap-analysen visar att Performance är bättre än Capacity.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-sm text-gray-400 font-light tracking-wide">
            N2 Fördjupad analys • WHO ICF • Performance vs Capacity
          </p>
        </div>
      </div>
    </div>
  );
};

export default N2DeepDive;
