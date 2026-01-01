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

  // Get level-specific gradient
  const getLevelGradient = (level: string) => {
    switch (level) {
      case 'N1': return 'from-emerald-500 via-emerald-600 to-emerald-700';
      case 'N2': return 'from-amber-500 via-orange-500 to-orange-600';
      case 'N3': return 'from-rose-500 via-red-500 to-red-600';
      default: return 'from-rose-500 to-red-600';
    }
  };

  // If profile doesn't have ICF data, show placeholder
  if (!profile || !profile.icfAssessments) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white text-2xl mb-4 shadow-lg">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">N3 Samordnad plan</h1>
          <p className="text-gray-600">Tvärsektoriell koordinering • SIP • Team-baserad planering</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8 text-rose-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">ICF-data inte tillgänglig</h2>
          <p className="text-gray-600 mb-4">
            N3 Samordnad plan kräver ICF-bedömningar för att visa koordineringsdata.
          </p>
          <p className="text-sm text-gray-500">
            Alla profiler med ICF-data kan visas här.
          </p>
        </div>
      </div>
    );
  }

  // Check if profile has full N3 coordination data
  const hasCoordinationData = profile.level === 'N3' && profile.coordinationTeam && profile.coordinatedGoals;

  // For non-N3 profiles, show simplified view with ICF data
  if (!hasCoordinationData) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${getLevelGradient(profile.level)} text-white text-2xl mb-4 shadow-lg`}>
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">N3 Samordnad plan</h1>
          <p className="text-gray-600">
            {profile.level === 'N1' ? 'Universell nivå' : profile.level === 'N2' ? 'Stödprofil' : 'Samordnad nivå'} • ICF-översikt
          </p>
        </div>

        {/* Info about N3 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Om N3 Samordnad plan</h3>
              <p className="text-sm text-gray-600 mb-3">
                <strong>{profile.name}</strong> är för närvarande på nivå <strong>{profile.level}</strong>.
                {profile.level === 'N1' && ' Inga behov av samordnade insatser identifierade.'}
                {profile.level === 'N2' && ' Vid behov kan N3 aktiveras för tvärsektoriell samordning.'}
              </p>
              <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600">
                <p><strong>N3 aktiveras när:</strong></p>
                <ul className="list-disc ml-4 mt-1 space-y-1">
                  <li>Barnet behöver insatser från flera huvudmän (skola, socialtjänst, vård)</li>
                  <li>En samordnad individuell plan (SIP) behövs</li>
                  <li>Komplexa behov kräver koordinerat team</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${getLevelGradient(profile.level)}`}>
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-sm text-gray-500">{profile.age} år • {profile.grade} • Nivå {profile.level}</p>
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

        {/* Gap Trend if available */}
        {profileGapTrends.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Longitudinell trend</h3>
            <GapTrendChart trends={profileGapTrends} />
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-400">
            N3 Samordnad Plan • WHO ICF-integration
          </p>
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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white text-2xl mb-4 shadow-lg">
          <Layers className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">N3 Samordnad plan</h1>
        <p className="text-gray-600">SIP • Tvärsektoriell samverkan • Skola, Vård, Socialtjänst</p>
      </div>

      {/* Info Box */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Om N3 Samordnad plan</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong className="text-gray-900">N3 = Samordningsnivå</strong> - För barn med komplexa behov som kräver samordnade insatser över huvudmannagränser.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-full text-xs font-medium">SIP-plan</span>
                <span className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-full text-xs font-medium">ICF-mål</span>
                <span className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-full text-xs font-medium">Koordineringsteam</span>
                <span className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-full text-xs font-medium">Barnets röst</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-5 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                N3
              </span>
            </div>
            <p className="text-sm text-gray-500">{profile.age} år • {profile.grade}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-medium text-gray-900 mb-1 text-sm">Diagnos</p>
            <p className="text-xs text-gray-600">{profile.background.diagnosis}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-medium text-gray-900 mb-1 text-sm">Aktuell situation</p>
            <p className="text-xs text-gray-600">{profile.background.currentSituation}</p>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <p className="font-medium text-gray-900 text-sm">Sofias röst</p>
          </div>
          <p className="text-sm text-gray-700 italic">"{profile.childsVoice.goals}"</p>
          <p className="text-xs text-gray-500 mt-2">{profile.childsVoice.howFeeling}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
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
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
              selectedTab === tab.id
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:bg-red-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        <div className="p-6">
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-gray-900">4</p>
                  <p className="text-xs text-gray-500">Sektorer</p>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-xl">
                  <Target className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-gray-900">{profile.coordinatedGoals.length}</p>
                  <p className="text-xs text-gray-500">Mål</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <Shield className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-emerald-600">+{profile.riskProtectionBalance.balance}</p>
                  <p className="text-xs text-gray-500">Balans</p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <Calendar className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-gray-900">15 mar</p>
                  <p className="text-xs text-gray-500">SIP-möte</p>
                </div>
              </div>

              {/* Goal Progress */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Måluppfyllnad</h4>
                <div className="space-y-3">
                  {profile.coordinatedGoals.map((goal) => (
                    <div key={goal.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{goal.text}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {goal.icfTarget} • {goal.targetDate}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getSectorColor(goal.responsible)}`}>
                          {getSectorIcon(goal.responsible)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium text-gray-700">{goal.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              goal.progress >= 70 ? 'bg-emerald-500' :
                              goal.progress >= 40 ? 'bg-amber-500' : 'bg-red-400'
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
                <h4 className="font-semibold text-gray-900 mb-4">SIP-möten</h4>
                <div className="space-y-2">
                  {profile.meetings.map((meeting, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        meeting.status === 'completed'
                          ? 'bg-emerald-50'
                          : 'bg-gray-50'
                      }`}
                    >
                      <Calendar className={`w-4 h-4 ${
                        meeting.status === 'completed' ? 'text-emerald-600' : 'text-gray-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">{meeting.type}</p>
                        <p className="text-xs text-gray-500">{meeting.date}</p>
                      </div>
                      {meeting.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
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

      {/* Evaluation */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-amber-600" />
          <h4 className="font-semibold text-gray-900">Utvärdering och prognos</h4>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-emerald-50 rounded-xl p-4">
            <p className="font-medium text-gray-900 mb-2 text-sm">Positiva faktorer</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start gap-1"><span className="text-emerald-500">+</span> Balans positiv (+4)</li>
              <li className="flex items-start gap-1"><span className="text-emerald-500">+</span> Behandling visar effekt</li>
              <li className="flex items-start gap-1"><span className="text-emerald-500">+</span> Närvaro ökat till 60%</li>
              <li className="flex items-start gap-1"><span className="text-emerald-500">+</span> Sofia är motiverad</li>
            </ul>
          </div>
          <div className="bg-amber-50 rounded-xl p-4">
            <p className="font-medium text-gray-900 mb-2 text-sm">Utmaningar kvar</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start gap-1"><span className="text-amber-500">-</span> Närvaro under mål</li>
              <li className="flex items-start gap-1"><span className="text-amber-500">-</span> Familjesituation</li>
              <li className="flex items-start gap-1"><span className="text-amber-500">-</span> Social situation</li>
            </ul>
          </div>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4">
          <p className="text-sm text-emerald-800">
            <strong>Rekommendation:</strong> Fortsätt N3. Vid närvaro &gt;80% kan N2 övervägas.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-400">
          N3 Samordnad plan (SIP) • WHO ICF • SoL 2 kap. 7§, HSL
        </p>
      </div>
    </div>
  );
};

export default N3CoordinatedPlan;
