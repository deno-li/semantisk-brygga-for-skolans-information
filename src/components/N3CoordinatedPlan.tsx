/**
 * N3 Coordinated Plan Component
 * Cross-sectoral coordination for children with complex needs
 * Based on WHO ICF N3 level - SIP-like coordinated planning across school, social services, and healthcare
 */

import React, { useState, useMemo } from 'react';
import {
  Activity, Shield, Users, FileText, Target, Calendar,
  CheckCircle2, AlertCircle, Info, User, Building2, Heart,
  GraduationCap, Home, Clock, ArrowRight, MessageSquare,
  Layers, TrendingUp, BarChart3
} from 'lucide-react';
import { ICF_DEMO_PROFILES } from '../data/icf-demo-profiles';
import ICFGapAnalysis from './ICFGapAnalysis';
import RiskProtectionBalance from './RiskProtectionBalance';
import GapTrendChart from './GapTrendChart';
import { ActorSector, WelfareWheelSpoke } from '../types/types';
import { GapTrend } from '../types/icf-types';

interface N3CoordinatedPlanProps {
  selectedProfileId: string;
}

interface CoordinatedGoal {
  id: string;
  text: string;
  targetDate: string;
  icfTarget: string;
  relatedSpokes: WelfareWheelSpoke[];
  responsible: ActorSector;
  supporting: ActorSector[];
  status: 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  actions: string[];
}

const N3CoordinatedPlan: React.FC<N3CoordinatedPlanProps> = ({ selectedProfileId }) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'team' | 'goals' | 'icf' | 'trend'>('overview');

  // Get profile from shared ICF_DEMO_PROFILES
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
      default: return 'from-rose-400 via-pink-500 to-purple-600';
    }
  };

  // Get level-specific background gradient
  const getLevelBgGradient = (level: string) => {
    switch (level) {
      case 'N1': return 'from-emerald-50/80 via-teal-50/60 to-cyan-50/40';
      case 'N2': return 'from-amber-50/80 via-orange-50/60 to-rose-50/40';
      case 'N3': return 'from-rose-50/80 via-pink-50/60 to-purple-50/40';
      default: return 'from-rose-50/80 via-pink-50/60 to-purple-50/40';
    }
  };

  // If profile doesn't have ICF data, show placeholder
  if (!profile || !profile.icfAssessments) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50/80 via-pink-50/60 to-purple-50/40">
        <div className="max-w-5xl mx-auto space-y-8 py-8 px-4">
          {/* Decorative background */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-20 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-rose-200/20 to-pink-200/20 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-pink-200/20 to-purple-200/20 blur-3xl" />
          </div>

          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 text-white mb-6 shadow-2xl shadow-rose-200/50 transform hover:scale-105 transition-transform duration-300">
              <Users className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3 tracking-tight">
              N3 Samordnad plan
            </h1>
            <p className="text-gray-500 text-lg font-light tracking-wide">
              Tvärsektoriell koordinering • SIP • Team-baserad planering
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-10 shadow-xl shadow-gray-100/50 text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-rose-200/50">
              <Info className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">ICF-data inte tillgänglig</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              N3 Samordnad plan kräver ICF-bedömningar för att visa koordineringsdata.
            </p>
            <p className="text-sm text-gray-400">
              Alla profiler med ICF-data kan visas här.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if profile has full N3 coordination data
  const hasCoordinationData = profile.level === 'N3' && profile.coordinationTeam && profile.coordinatedGoals;

  // For non-N3 profiles, show simplified view with ICF data
  if (!hasCoordinationData) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${getLevelBgGradient(profile.level)}`}>
        <div className="max-w-5xl mx-auto space-y-8 py-8 px-4">
          {/* Decorative background elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-20 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-rose-200/20 to-pink-200/20 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-pink-200/20 to-purple-200/20 blur-3xl" />
          </div>

          {/* Header */}
          <div className="text-center py-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${getLevelGradient(profile.level)} text-white mb-6 shadow-2xl shadow-rose-200/50 transform hover:scale-105 transition-transform duration-300`}>
              <Users className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3 tracking-tight">
              N3 Samordnad plan
            </h1>
            <p className="text-gray-500 text-lg font-light tracking-wide">
              {profile.level === 'N1' ? 'Universell nivå' : profile.level === 'N2' ? 'Stödprofil' : 'Samordnad nivå'} • ICF-översikt
            </p>
          </div>

          {/* Info about N3 - Glass morphism */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200/50">
                <Info className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Om N3 Samordnad plan</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  <strong>{profile.name}</strong> är för närvarande på nivå <strong>{profile.level}</strong>.
                  {profile.level === 'N1' && ' Inga behov av samordnade insatser identifierade.'}
                  {profile.level === 'N2' && ' Vid behov kan N3 aktiveras för tvärsektoriell samordning.'}
                </p>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border border-gray-100">
                  <p className="font-semibold text-gray-900 mb-2 text-sm">N3 aktiveras när:</p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start gap-2"><span className="text-rose-500 font-bold">•</span> Barnet behöver insatser från flera huvudmän (skola, socialtjänst, vård)</li>
                    <li className="flex items-start gap-2"><span className="text-rose-500 font-bold">•</span> En samordnad individuell plan (SIP) behövs</li>
                    <li className="flex items-start gap-2"><span className="text-rose-500 font-bold">•</span> Komplexa behov kräver koordinerat team</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Card - Glass morphism */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-6">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center bg-gradient-to-br ${getLevelGradient(profile.level)} shadow-xl`}>
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-gray-500 font-medium mt-1">{profile.age} år • {profile.grade} • Nivå {profile.level}</p>
              </div>
            </div>
          </div>

          {/* ICF Data */}
          <ICFGapAnalysis assessments={profile.icfAssessments} />

          {/* Risk Protection */}
          {profile.riskProtectionBalance && (
            <RiskProtectionBalance
              environmentalFactors={profile.environmentalFactors}
            />
          )}

          {/* Gap Trend if available - Glass morphism */}
          {profileGapTrends.length > 0 && (
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50">
              <h3 className="font-bold text-gray-900 mb-5 text-lg">Longitudinell trend</h3>
              <GapTrendChart trends={profileGapTrends} />
            </div>
          )}

          {/* Footer */}
          <div className="text-center py-6">
            <p className="text-sm text-gray-400 font-light tracking-wide">
              N3 Samordnad Plan • WHO ICF-integration
            </p>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-br from-rose-50/80 via-pink-50/60 to-purple-50/40">
      <div className="max-w-5xl mx-auto space-y-8 py-8 px-4">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-20 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-rose-200/20 to-pink-200/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-pink-200/20 to-purple-200/20 blur-3xl" />
        </div>

        {/* Header */}
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 text-white mb-6 shadow-2xl shadow-rose-200/50 transform hover:scale-105 transition-transform duration-300">
            <Layers className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3 tracking-tight">
            N3 Samordnad plan
          </h1>
          <p className="text-gray-500 text-lg font-light tracking-wide">
            SIP • Tvärsektoriell samverkan • Skola, Vård, Socialtjänst
          </p>
        </div>

        {/* Info Box - Glass morphism */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-200/50">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Om N3 Samordnad plan</h3>
              <div className="text-sm text-gray-600 space-y-3">
                <p>
                  <strong className="text-gray-900">N3 = Samordningsnivå</strong> - För barn med komplexa behov som kräver samordnade insatser över huvudmannagränser.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <span className="px-4 py-2 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 rounded-2xl text-xs font-medium border border-rose-100 shadow-sm">SIP-plan</span>
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 rounded-2xl text-xs font-medium border border-purple-100 shadow-sm">ICF-mål</span>
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-2xl text-xs font-medium border border-blue-100 shadow-sm">Koordineringsteam</span>
                  <span className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-2xl text-xs font-medium border border-emerald-100 shadow-sm">Barnets röst</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Card - Glass morphism */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 flex items-center justify-center shadow-xl">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                <span className="px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg">
                  N3
                </span>
              </div>
              <p className="text-gray-500 font-medium">{profile.age} år • {profile.grade}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-5 border border-gray-100">
              <p className="font-semibold text-gray-900 mb-2">Diagnos</p>
              <p className="text-sm text-gray-600 leading-relaxed">{profile.background.diagnosis}</p>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-5 border border-gray-100">
              <p className="font-semibold text-gray-900 mb-2">Aktuell situation</p>
              <p className="text-sm text-gray-600 leading-relaxed">{profile.background.currentSituation}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-2xl p-5 border border-emerald-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <p className="font-semibold text-gray-900">Sofias röst</p>
            </div>
            <p className="text-sm text-gray-700 italic leading-relaxed">"{profile.childsVoice.goals}"</p>
            <p className="text-xs text-gray-500 mt-3">{profile.childsVoice.howFeeling}</p>
          </div>
        </div>

        {/* Tab Navigation - Modern tabs */}
        <div className="flex gap-3 flex-wrap">
          {[
            { id: 'overview', label: 'Översikt', icon: <Target className="w-4 h-4" /> },
            { id: 'team', label: 'Team', icon: <Users className="w-4 h-4" /> },
            { id: 'goals', label: 'Mål', icon: <FileText className="w-4 h-4" /> },
            { id: 'icf', label: 'ICF', icon: <Activity className="w-4 h-4" /> },
            { id: 'trend', label: 'Gap-trend', icon: <BarChart3 className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-2xl transition-all duration-300 ${
                selectedTab === tab.id
                  ? 'bg-gradient-to-r from-rose-400 via-pink-500 to-purple-600 text-white shadow-lg shadow-rose-200/50 transform scale-105'
                  : 'bg-white/70 backdrop-blur-sm border border-white/50 text-gray-600 hover:border-rose-200 hover:bg-rose-50/50 hover:shadow-md'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content - Glass morphism */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl shadow-gray-100/50 overflow-hidden">

          <div className="p-8">
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-200/50">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">Sektorer</p>
                </div>
                <div className="text-center p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-200/50">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{profile.coordinatedGoals.length}</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">Mål</p>
                </div>
                <div className="text-center p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-200/50">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">+{profile.riskProtectionBalance.balance}</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">Balans</p>
                </div>
                <div className="text-center p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-200/50">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">15 mar</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">SIP-möte</p>
                </div>
              </div>

              {/* Goal Progress */}
              <div>
                <h4 className="font-bold text-gray-900 mb-5 text-lg">Måluppfyllnad</h4>
                <div className="space-y-4">
                  {profile.coordinatedGoals.map((goal) => (
                    <div key={goal.id} className="bg-white/60 backdrop-blur-sm border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{goal.text}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {goal.icfTarget} • {goal.targetDate}
                          </p>
                        </div>
                        <span className={`px-3 py-2 rounded-xl text-xs font-medium ${getSectorColor(goal.responsible)}`}>
                          {getSectorIcon(goal.responsible)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-500 font-medium">Progress</span>
                          <span className="font-bold text-gray-700">{goal.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-700 ${
                              goal.progress >= 70 ? 'bg-gradient-to-r from-emerald-400 to-teal-500' :
                              goal.progress >= 40 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-red-400 to-rose-500'
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
              <div>
                <h4 className="font-bold text-gray-900 mb-5 text-lg">SIP-möten</h4>
                <div className="space-y-3">
                  {profile.meetings.map((meeting, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 hover:shadow-md ${
                        meeting.status === 'completed'
                          ? 'bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border-emerald-100'
                          : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-100'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        meeting.status === 'completed'
                          ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-200/50'
                          : 'bg-gray-200'
                      }`}>
                        <Calendar className={`w-5 h-5 ${
                          meeting.status === 'completed' ? 'text-white' : 'text-gray-500'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{meeting.type}</p>
                        <p className="text-sm text-gray-500">{meeting.date}</p>
                      </div>
                      {meeting.status === 'completed' ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Clock className="w-6 h-6 text-gray-400 flex-shrink-0" />
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

          {/* Gap Trend Tab */}
          {selectedTab === 'trend' && (
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-4">
                <p className="text-sm text-purple-800 font-medium mb-2">Gap-trendanalys över tid</p>
                <p className="text-sm text-gray-700">
                  Visar hur gap mellan Performance och Capacity har förändrats över tid.
                  Negativa gap (↓) visar att anpassningar fungerar. Positiva gap (↑) visar att barriärer finns.
                </p>
              </div>

              <GapTrendChart
                trends={profileGapTrends}
                title="Sofias utveckling över tid"
                showInterventions={true}
              />

              {profileGapTrends.length > 0 && profileGapTrends[0].interpretation && (
                <div className="bg-emerald-50 rounded-xl p-4">
                  <p className="font-medium text-gray-900 mb-2 text-sm">Tolkning</p>
                  <p className="text-sm text-gray-700">{profileGapTrends[0].interpretation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

        {/* Evaluation - Glass morphism */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200/50">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 text-lg">Utvärdering och prognos</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 rounded-2xl p-5 border border-emerald-100">
              <p className="font-semibold text-gray-900 mb-3">Positiva faktorer</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">+</span> Balans positiv (+4)</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">+</span> Behandling visar effekt</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">+</span> Närvaro ökat till 60%</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500 font-bold">+</span> Sofia är motiverad</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 rounded-2xl p-5 border border-amber-100">
              <p className="font-semibold text-gray-900 mb-3">Utmaningar kvar</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2"><span className="text-amber-500 font-bold">-</span> Närvaro under mål</li>
                <li className="flex items-start gap-2"><span className="text-amber-500 font-bold">-</span> Familjesituation</li>
                <li className="flex items-start gap-2"><span className="text-amber-500 font-bold">-</span> Social situation</li>
              </ul>
            </div>
          </div>
          <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-2xl p-5 border border-emerald-100">
            <p className="text-sm text-emerald-800 leading-relaxed">
              <strong>Rekommendation:</strong> Fortsätt N3. Vid närvaro &gt;80% kan N2 övervägas.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-sm text-gray-400 font-light tracking-wide">
            N3 Samordnad plan (SIP) • WHO ICF • SoL 2 kap. 7§, HSL
          </p>
        </div>
      </div>
    </div>
  );
};

export default N3CoordinatedPlan;
