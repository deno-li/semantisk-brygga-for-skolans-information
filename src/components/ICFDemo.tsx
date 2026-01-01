/**
 * ICF Demo Component
 * Demonstrates WHO ICF integration with Performance/Capacity and Environmental Factors
 * Uses the selected child profile from the system
 */

import React, { useState, useMemo } from 'react';
import { Activity, Shield, TrendingUp, Info, User, BookOpen, BarChart3, ArrowRight, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import ICFGapAnalysis from './ICFGapAnalysis';
import RiskProtectionBalance from './RiskProtectionBalance';
import GapTrendChart from './GapTrendChart';
import LevelIndicator from './LevelIndicator';
import { ICF_DEMO_PROFILES } from '../data/icf-demo-profiles';
import { WelfareWheelSpoke } from '../types/types';
import { GapTrend } from '../types/icf-types';

interface ICFDemoProps {
  selectedProfileId: string;
}

const ICFDemo: React.FC<ICFDemoProps> = ({ selectedProfileId }) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'gap' | 'risk' | 'trend'>('overview');
  const [selectedSpoke, setSelectedSpoke] = useState<WelfareWheelSpoke | undefined>(undefined);

  const profile = ICF_DEMO_PROFILES[selectedProfileId];

  // Get gap trends for the current profile
  const profileGapTrends = useMemo((): GapTrend[] => {
    if (!profile || !profile.gapTrends) return [];
    return Object.values(profile.gapTrends) as GapTrend[];
  }, [profile]);

  // Level-specific styling
  const getLevelGradient = (level: string) => {
    switch (level) {
      case 'N1': return 'from-emerald-500 via-emerald-600 to-emerald-700';
      case 'N2': return 'from-amber-500 via-orange-500 to-orange-600';
      case 'N3': return 'from-rose-500 via-red-500 to-red-600';
      default: return 'from-blue-600 to-blue-800';
    }
  };

  const getLevelBadgeStyle = (level: string) => {
    switch (level) {
      case 'N1': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'N2': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'N3': return 'bg-rose-100 text-rose-800 border-rose-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getLevelDescription = (level: string) => {
    switch (level) {
      case 'N1': return 'Universell';
      case 'N2': return 'Stödprofil';
      case 'N3': return 'Samordnad (SIP)';
      default: return level;
    }
  };

  // If profile doesn't have ICF data yet, show placeholder
  if (!profile || !profile.icfAssessments) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white text-2xl mb-4 shadow-lg">
            <Activity className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">WHO ICF-integration</h1>
          <p className="text-gray-600">Performance vs Capacity • Environmental Factors • Gap-analys</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Info className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">ICF-data inte tillgänglig</h2>
            <p className="text-gray-600 mb-6">
              ICF Gap-analys är implementerad för följande profiler:
            </p>

            {/* Level progression visualization */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-2 mb-6">
              <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">N2</div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm">Lisa J.</p>
                  <p className="text-xs text-gray-500">Stödprofil</p>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-gray-300 hidden md:block" />

              <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">N2</div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm">Elsa B.</p>
                  <p className="text-xs text-gray-500">Stödprofil</p>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-gray-300 hidden md:block" />

              <div className="flex items-center gap-3 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">N3</div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm">Sofia B.</p>
                  <p className="text-xs text-gray-500">Samordnad (SIP)</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Välj en av profilerna ovan för att se WHO ICF-integration.
            </p>
          </div>
        </div>

        {/* Level explanation */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Nivåer i WHO ICF-ramverket</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-xs">N1</div>
                <span className="font-medium text-emerald-900">Universell</span>
              </div>
              <p className="text-xs text-emerald-800">Enkel screening för alla barn. Endast Performance-bedömning.</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-xs">N2</div>
                <span className="font-medium text-amber-900">Stödprofil</span>
              </div>
              <p className="text-xs text-amber-800">Fördjupad analys med Performance vs Capacity och gap-analys.</p>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white font-bold text-xs">N3</div>
                <span className="font-medium text-rose-900">Samordnad</span>
              </div>
              <p className="text-xs text-rose-800">Tvärsektoriell samordning (SIP). Full ICF-integration.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { icfAssessments, environmentalFactors, riskProtectionBalance, summary, childsVoice } = profile;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Modern Header with Level-specific gradient */}
      <div className="text-center py-6">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${getLevelGradient(profile.level)} text-white text-2xl mb-4 shadow-lg`}>
          <Activity className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">WHO ICF-integration</h1>
        <p className="text-gray-600">Performance vs Capacity • Environmental Factors • Gap-analys</p>
      </div>

      {/* Info Box */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Om WHO ICF-ramverket</h3>
            <div className="text-sm text-gray-700 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="font-medium text-gray-900 text-xs uppercase tracking-wide mb-1">Performance</p>
                  <p className="text-gray-600 text-sm">Vad barnet <strong>GÖR</strong> i sin nuvarande miljö med anpassningar</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="font-medium text-gray-900 text-xs uppercase tracking-wide mb-1">Capacity</p>
                  <p className="text-gray-600 text-sm">Vad barnet <strong>KAN</strong> göra utan hjälpmedel eller stöd</p>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <p className="font-medium text-purple-900 text-xs uppercase tracking-wide mb-2">Gap-analys (Performance - Capacity)</p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Negativ: Anpassningar fungerar
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                    <AlertTriangle className="w-3 h-3" /> Positiv: Barriärer finns
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    Gap = 0: Neutral
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${getLevelGradient(profile.level)} shadow-lg`}>
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getLevelBadgeStyle(profile.level)}`}>
                {profile.level}
              </span>
            </div>
            <p className="text-sm text-gray-500">{profile.age} år • {profile.grade} • {getLevelDescription(profile.level)}</p>
          </div>
        </div>

        {/* Summary with animated progress indicator */}
        <div className="mt-5 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-amber-600" />
            <p className="font-medium text-amber-900 text-sm">Sammanfattning</p>
          </div>
          <p className="text-sm text-amber-800 mb-3">{summary.primaryConcerns.join(', ')}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/60 rounded-lg p-3">
              <p className="text-xs font-semibold text-emerald-800 mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Styrkor
              </p>
              <ul className="text-xs text-gray-700 space-y-1">
                {summary.strengths.slice(0, 3).map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              <p className="text-xs font-semibold text-blue-800 mb-2 flex items-center gap-1">
                <ArrowRight className="w-3 h-3" /> Nästa steg
              </p>
              <ul className="text-xs text-gray-700 space-y-1">
                {summary.nextSteps.slice(0, 3).map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Barnets röst */}
        {childsVoice && (
          <div className="mt-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-sm">💬</div>
              <p className="font-medium text-emerald-900 text-sm">{profile.name.split(' ')[0]}s röst</p>
            </div>
            <p className="text-sm text-emerald-800 italic mb-2">"{childsVoice.goals}"</p>
            <p className="text-xs text-emerald-700">{childsVoice.howFeeling}</p>
          </div>
        )}
      </div>

      {/* Modern Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-1.5 shadow-sm">
        <div className="flex gap-1">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              selectedTab === 'overview'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" />
              Översikt
            </div>
          </button>
          <button
            onClick={() => setSelectedTab('gap')}
            className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              selectedTab === 'gap'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Activity className="w-4 h-4" />
              Gap-analys
            </div>
          </button>
          <button
            onClick={() => setSelectedTab('risk')}
            className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              selectedTab === 'risk'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              Risk/Skydd
            </div>
          </button>
          {profileGapTrends.length > 0 && (
            <button
              onClick={() => setSelectedTab('trend')}
              className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                selectedTab === 'trend'
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Gap-trend
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div>
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Level Indicator */}
            <LevelIndicator
              level={profile.level === 'N1' ? 'universell' : profile.level === 'N2' ? 'stodprofil' : 'samordning'}
              nextReview={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()}
            />

            {/* Quick Stats with animated progress indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">{icfAssessments.length}</span>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">ICF Bedömningar</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${(icfAssessments.filter(a => a.gapInterpretation === 'facilitators-work').length / icfAssessments.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {icfAssessments.filter(a => a.gapInterpretation === 'facilitators-work').length} fungerar
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-3xl font-bold text-emerald-600">+{riskProtectionBalance.protectionScore}</span>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">Skyddsfaktorer</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((riskProtectionBalance.protectionScore / 10) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{riskProtectionBalance.facilitators.length} aktiva</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-3xl font-bold text-amber-600">{riskProtectionBalance.riskScore}</span>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">Riskfaktorer</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((riskProtectionBalance.riskScore / 5) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{riskProtectionBalance.barriers.length} hinder</span>
                </div>
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

        {selectedTab === 'trend' && profileGapTrends.length > 0 && (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-900 font-medium mb-2">Gap-trendanalys över tid</p>
              <p className="text-sm text-purple-800">
                Visar hur gap mellan Performance och Capacity har förändrats över tid.
                <strong> Negativa gap (↓)</strong> visar att anpassningar fungerar.
                <strong> Positiva gap (↑)</strong> visar att barriärer finns.
              </p>
            </div>

            <GapTrendChart
              trends={profileGapTrends}
              title={`${profile.name.split(' ')[0]}s utveckling över tid`}
              showInterventions={true}
            />

            {profileGapTrends.map((trend, index) => (
              <div key={index} className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <p className="font-medium text-gray-900 mb-2 text-sm">
                  Tolkning: {trend.domain} ({trend.icfCode})
                </p>
                <p className="text-sm text-gray-700">{trend.interpretation}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-6">
        <p className="text-xs text-gray-400">
          WHO (2002). ICF Beginner's Guide • Världshälsoorganisationen (2001). ICF
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Prototyp för demonstration av ICF-integration i svensk välfärd
        </p>
      </div>
    </div>
  );
};

export default ICFDemo;
