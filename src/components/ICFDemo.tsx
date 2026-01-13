/**
 * ICF Demo Component
 * Demonstrates WHO ICF integration with Performance/Capacity and Environmental Factors
 * Uses the selected child profile from the system
 */

import React, { useState, useMemo } from 'react';
import { Activity, Shield, TrendingUp, Info, User, BookOpen, BarChart3, ArrowRight, CheckCircle2, AlertTriangle, Sparkles, Star } from 'lucide-react';
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
      case 'N1': return 'from-emerald-400 via-teal-500 to-cyan-600';
      case 'N2': return 'from-amber-400 via-orange-500 to-rose-500';
      case 'N3': return 'from-rose-400 via-pink-500 to-purple-600';
      default: return 'from-blue-400 via-indigo-500 to-purple-600';
    }
  };

  const getLevelBgGradient = (level: string) => {
    switch (level) {
      case 'N1': return 'from-emerald-50/80 via-teal-50/60 to-cyan-50/40';
      case 'N2': return 'from-amber-50/80 via-orange-50/60 to-rose-50/40';
      case 'N3': return 'from-rose-50/80 via-pink-50/60 to-purple-50/40';
      default: return 'from-blue-50/80 via-indigo-50/60 to-purple-50/40';
    }
  };

  const getLevelBadgeStyle = (level: string) => {
    switch (level) {
      case 'N1': return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-200';
      case 'N2': return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-200';
      case 'N3': return 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-200';
      default: return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-200';
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
      <div className="max-w-5xl mx-auto space-y-8 px-4">
        {/* Elegant Header */}
        <div className="relative text-center py-12">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl -z-10" />
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white mb-6 shadow-2xl shadow-indigo-200 transform hover:scale-105 transition-transform duration-300">
            <Activity className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
            WHO ICF-integration
          </h1>
          <p className="text-gray-500 text-lg font-light tracking-wide">
            Performance vs Capacity • Environmental Factors • Gap-analys
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-10 shadow-xl shadow-gray-100/50">
          <div className="text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-100">
              <Info className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">ICF-data inte tillgänglig</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              ICF Gap-analys är implementerad för följande profiler:
            </p>

            {/* Modern profile cards */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
              {[
                { name: 'Lisa J.', level: 'N2', desc: 'Stödprofil', gradient: 'from-amber-400 to-orange-500' },
                { name: 'Elsa B.', level: 'N2', desc: 'Stödprofil', gradient: 'from-amber-400 to-orange-500' },
                { name: 'Sofia B.', level: 'N3', desc: 'Samordnad', gradient: 'from-rose-400 to-pink-500' }
              ].map((p, i) => (
                <div key={i} className="group flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-white font-bold shadow-lg`}>
                    {p.level}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{p.name}</p>
                    <p className="text-sm text-gray-400">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Level explanation with glass effect */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            Nivåer i WHO ICF-ramverket
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { level: 'N1', name: 'Universell', desc: 'Enkel screening för alla barn. Endast Performance-bedömning.', gradient: 'from-emerald-400 to-teal-500', bg: 'from-emerald-50 to-teal-50' },
              { level: 'N2', name: 'Stödprofil', desc: 'Fördjupad analys med Performance vs Capacity och gap-analys.', gradient: 'from-amber-400 to-orange-500', bg: 'from-amber-50 to-orange-50' },
              { level: 'N3', name: 'Samordnad', desc: 'Tvärsektoriell samordning (SIP). Full ICF-integration.', gradient: 'from-rose-400 to-pink-500', bg: 'from-rose-50 to-pink-50' }
            ].map((item, i) => (
              <div key={i} className={`p-6 rounded-2xl bg-gradient-to-br ${item.bg} border border-white/50 hover:shadow-lg transition-all duration-300`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                    {item.level}
                  </div>
                  <span className="font-semibold text-gray-900">{item.name}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { icfAssessments, environmentalFactors, riskProtectionBalance, summary, childsVoice } = profile;

  return (
    <div className="max-w-5xl mx-auto space-y-8 px-4">
      {/* Elegant Header with gradient background */}
      <div className={`relative text-center py-12 rounded-3xl bg-gradient-to-br ${getLevelBgGradient(profile.level)}`}>
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${getLevelGradient(profile.level)} text-white mb-6 shadow-2xl transform hover:scale-105 transition-transform duration-300`}>
          <Activity className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
          WHO ICF-integration
        </h1>
        <p className="text-gray-500 text-lg font-light tracking-wide">
          Performance vs Capacity • Environmental Factors • Gap-analys
        </p>
      </div>

      {/* Info Box with glass effect */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-100/50">
            <Info className="w-7 h-7 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Om WHO ICF-ramverket</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-100">
                <p className="font-semibold text-gray-900 text-sm mb-1">Performance</p>
                <p className="text-gray-600 text-sm">Vad barnet <strong className="text-blue-600">GÖR</strong> i sin miljö med anpassningar</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border border-gray-100">
                <p className="font-semibold text-gray-900 text-sm mb-1">Capacity</p>
                <p className="text-gray-600 text-sm">Vad barnet <strong className="text-purple-600">KAN</strong> utan hjälpmedel eller stöd</p>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100/50">
              <p className="font-semibold text-indigo-900 text-sm mb-3">Gap-analys</p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 text-emerald-700 rounded-full text-xs font-medium shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Negativ = Fungerar
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 text-amber-700 rounded-full text-xs font-medium shadow-sm">
                  <AlertTriangle className="w-3.5 h-3.5" /> Positiv = Barriär
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 text-gray-600 rounded-full text-xs font-medium shadow-sm">
                  Noll = Neutral
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Card with elegant design */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50 overflow-hidden relative">
        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${getLevelGradient(profile.level)} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2`} />

        <div className="flex items-center gap-6 relative">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center bg-gradient-to-br ${getLevelGradient(profile.level)} shadow-2xl`}>
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
              <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-lg ${getLevelBadgeStyle(profile.level)}`}>
                {profile.level}
              </span>
            </div>
            <p className="text-gray-500">{profile.age} år • {profile.grade} • {getLevelDescription(profile.level)}</p>
          </div>
        </div>

        {/* Summary section */}
        <div className={`mt-8 bg-gradient-to-br ${getLevelBgGradient(profile.level)} rounded-2xl p-6 border border-white/50`}>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-gray-600" />
            <p className="font-semibold text-gray-900">Sammanfattning</p>
          </div>
          {summary.primaryConcerns.length > 0 && (
            <p className="text-gray-700 mb-4">{summary.primaryConcerns.join(', ')}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/60 backdrop-blur rounded-xl p-4 border border-white/50">
              <p className="text-sm font-semibold text-emerald-700 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Styrkor
              </p>
              <ul className="space-y-2">
                {summary.strengths.slice(0, 3).map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/60 backdrop-blur rounded-xl p-4 border border-white/50">
              <p className="text-sm font-semibold text-blue-700 mb-3 flex items-center gap-1.5">
                <ArrowRight className="w-4 h-4" /> Nästa steg
              </p>
              <ul className="space-y-2">
                {summary.nextSteps.slice(0, 3).map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Child's voice */}
        {childsVoice && (
          <div className="mt-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-md">💬</div>
              <p className="font-semibold text-emerald-900">{profile.name.split(' ')[0]}s röst</p>
            </div>
            <p className="text-emerald-800 italic leading-relaxed">"{childsVoice.goals}"</p>
            <p className="text-sm text-emerald-700 mt-3">{childsVoice.howFeeling}</p>
          </div>
        )}
      </div>

      {/* Modern Glass Tabs */}
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-2 shadow-lg shadow-gray-100/50 border border-white/50">
        <div className="flex gap-2">
          {[
            { id: 'overview', label: 'Översikt', icon: BookOpen },
            { id: 'gap', label: 'Gap-analys', icon: Activity },
            { id: 'risk', label: 'Risk/Skydd', icon: Shield },
            ...(profileGapTrends.length > 0 ? [{ id: 'trend', label: 'Gap-trend', icon: BarChart3 }] : [])
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
              className={`flex-1 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                selectedTab === tab.id
                  ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Level Indicator */}
            <LevelIndicator
              level={profile.level === 'N1' ? 'universell' : profile.level === 'N2' ? 'stodprofil' : 'samordning'}
              nextReview={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()}
            />

            {/* Elegant Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Activity,
                  label: 'ICF Bedömningar',
                  value: icfAssessments.length,
                  sub: `${icfAssessments.filter(a => a.gapInterpretation === 'facilitators-work').length} fungerar`,
                  color: 'blue',
                  progress: (icfAssessments.filter(a => a.gapInterpretation === 'facilitators-work').length / icfAssessments.length) * 100
                },
                {
                  icon: Shield,
                  label: 'Skyddsfaktorer',
                  value: `+${riskProtectionBalance.protectionScore}`,
                  sub: `${riskProtectionBalance.facilitators.length} aktiva`,
                  color: 'emerald',
                  progress: Math.min((riskProtectionBalance.protectionScore / 10) * 100, 100)
                },
                {
                  icon: TrendingUp,
                  label: 'Riskfaktorer',
                  value: riskProtectionBalance.riskScore,
                  sub: `${riskProtectionBalance.barriers.length} hinder`,
                  color: 'amber',
                  progress: Math.min((riskProtectionBalance.riskScore / 5) * 100, 100)
                }
              ].map((stat, i) => (
                <div key={i} className="group bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-50 flex items-center justify-center shadow-lg shadow-${stat.color}-100/50 group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <span className={`text-4xl font-bold text-${stat.color}-600`}>{stat.value}</span>
                  </div>
                  <p className="font-semibold text-gray-900 mb-2">{stat.label}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-600 rounded-full transition-all duration-700`}
                        style={{ width: `${stat.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{stat.sub}</span>
                  </div>
                </div>
              ))}
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
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100/50">
              <p className="font-semibold text-indigo-900 mb-2">Gap-trendanalys över tid</p>
              <p className="text-indigo-700">
                Visar hur gap mellan Performance och Capacity har förändrats.
                <strong className="text-emerald-600"> Negativa gap (↓)</strong> = anpassningar fungerar.
                <strong className="text-amber-600"> Positiva gap (↑)</strong> = barriärer finns.
              </p>
            </div>

            <GapTrendChart
              trends={profileGapTrends}
              title={`${profile.name.split(' ')[0]}s utveckling över tid`}
              showInterventions={true}
            />

            {profileGapTrends.map((trend, index) => (
              <div key={index} className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100/50">
                <p className="font-semibold text-gray-900 mb-2">
                  {trend.domain} ({trend.icfCode})
                </p>
                <p className="text-gray-700 leading-relaxed">{trend.interpretation}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Elegant Footer */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500" />
          <p className="text-xs text-gray-400">
            WHO ICF Beginner's Guide • Prototyp för ICF-integration
          </p>
        </div>
      </div>
    </div>
  );
};

export default ICFDemo;
