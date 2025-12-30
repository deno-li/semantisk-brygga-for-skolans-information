
import React, { useState, useMemo } from 'react';
import { TIMELINE_DATA, QUALITY_CYCLE, ENHANCED_CHILD_PROFILE } from '../data/constants';
import {
  ArrowRight,
  Calendar,
  AlertCircle,
  CheckCircle2,
  FileText,
  Users,
  Heart,
  Shield,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Clock,
  MessageSquare
} from 'lucide-react';
import { Perspective, View } from '../types/types';
import { useProfileData } from '../hooks/useProfileData';
import { JOURNEY_PROFILES } from '../data/journeyMockData';

interface DashboardProps {
  currentPerspective: Perspective;
  onNavigate: (view: View) => void;
  selectedProfileId?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ currentPerspective, onNavigate, selectedProfileId = 'erik' }) => {
  const { shanarriData, childProfile, needsAttention } = useProfileData(selectedProfileId);
  const journeyProfile = useMemo(() => JOURNEY_PROFILES[selectedProfileId], [selectedProfileId]);

  const isChild = currentPerspective === 'child';
  const greenCount = shanarriData.filter(d => d.status >= 4).length;
  const yellowCount = shanarriData.filter(d => d.status === 3).length;

  // Quick action cards data
  const quickActions = isChild ? [
    { id: 'sip', icon: FileText, label: 'Min Plan', desc: 'Se vad vi jobbar med', color: 'orange' },
    { id: 'survey', icon: MessageSquare, label: 'Min röst', desc: 'Berätta hur du mår', color: 'pink' },
    { id: 'shanarri', icon: Heart, label: 'Välbefinnande', desc: 'Hur mår du?', color: 'rose' },
  ] : [
    { id: 'sip', icon: FileText, label: 'Aktiv plan', desc: '1 pågående SIP', color: 'blue' },
    { id: 'shanarri', icon: Heart, label: 'Välbefinnande', desc: `${greenCount}/8 bra`, color: 'emerald' },
    { id: 'journal', icon: Clock, label: 'Journal', desc: 'Senaste noteringar', color: 'violet' },
    { id: 'ai-analysis', icon: Sparkles, label: 'AI-analys', desc: 'Insikter & mönster', color: 'amber' },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
      orange: { bg: 'bg-orange-50', border: 'border-orange-200 hover:border-orange-400', text: 'text-orange-700', icon: 'text-orange-500' },
      pink: { bg: 'bg-pink-50', border: 'border-pink-200 hover:border-pink-400', text: 'text-pink-700', icon: 'text-pink-500' },
      rose: { bg: 'bg-rose-50', border: 'border-rose-200 hover:border-rose-400', text: 'text-rose-700', icon: 'text-rose-500' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200 hover:border-blue-400', text: 'text-blue-700', icon: 'text-blue-500' },
      emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200 hover:border-emerald-400', text: 'text-emerald-700', icon: 'text-emerald-500' },
      violet: { bg: 'bg-violet-50', border: 'border-violet-200 hover:border-violet-400', text: 'text-violet-700', icon: 'text-violet-500' },
      amber: { bg: 'bg-amber-50', border: 'border-amber-200 hover:border-amber-400', text: 'text-amber-700', icon: 'text-amber-500' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome Section */}
      <section className="text-center py-6">
        {isChild ? (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 text-white text-3xl mb-4 shadow-lg">
              👋
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Hej {childProfile.name.split(' ')[0]}!
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Här kan du se din plan och hur det går för dig.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Översikt för {childProfile.name}
            </h1>
            <p className="text-gray-600">
              {childProfile.age} år • {childProfile.grade} • {childProfile.school}
            </p>
          </>
        )}
      </section>

      {/* Main Welfare Wheel Card */}
      <section>
        <button
          onClick={() => onNavigate('shanarri')}
          className="w-full group"
        >
          <div className="relative bg-white rounded-3xl border-2 border-gray-100 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50" />

            <div className="relative p-8 flex flex-col md:flex-row items-center gap-8">
              {/* Wheel visualization */}
              <div className="w-48 h-48 flex-shrink-0">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
                  {shanarriData.map((dim, i) => {
                    const n = shanarriData.length;
                    const startAngle = (i * 360) / n - 90;
                    const endAngle = ((i + 1) * 360) / n - 90;
                    const midAngle = (startAngle + endAngle) / 2;
                    const outerR = 95;
                    const innerR = 40;

                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;
                    const cx = 100, cy = 100;

                    const x1 = cx + Math.cos(startRad) * innerR;
                    const y1 = cy + Math.sin(startRad) * innerR;
                    const x2 = cx + Math.cos(startRad) * outerR;
                    const y2 = cy + Math.sin(startRad) * outerR;
                    const x3 = cx + Math.cos(endRad) * outerR;
                    const y3 = cy + Math.sin(endRad) * outerR;
                    const x4 = cx + Math.cos(endRad) * innerR;
                    const y4 = cy + Math.sin(endRad) * innerR;

                    const path = `M ${x1} ${y1} L ${x2} ${y2} A ${outerR} ${outerR} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerR} ${innerR} 0 0 0 ${x1} ${y1}`;

                    return (
                      <path
                        key={dim.id}
                        d={path}
                        fill={dim.color}
                        stroke="white"
                        strokeWidth="2"
                        className="transition-opacity group-hover:opacity-90"
                      />
                    );
                  })}
                  <circle cx="100" cy="100" r="38" fill="white" stroke="#e5e7eb" strokeWidth="2" />
                  <text x="100" y="96" textAnchor="middle" className="fill-gray-900 text-[10px] font-bold">
                    BARNETS
                  </text>
                  <text x="100" y="108" textAnchor="middle" className="fill-gray-900 text-[10px] font-bold">
                    BÄSTA
                  </text>
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {isChild ? 'Ditt välbefinnandehjul' : 'Välbefinnandehjul'}
                </h2>
                <p className="text-gray-600 mb-4">
                  {isChild
                    ? 'Se hur det går för dig inom olika områden i livet.'
                    : 'SHANARRI-modellen visar välbefinnande inom 8 dimensioner.'}
                </p>

                {!isChild && (
                  <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                      <CheckCircle2 size={14} />
                      {greenCount} bra
                    </span>
                    {yellowCount > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                        {yellowCount} OK
                      </span>
                    )}
                    {needsAttention > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        <AlertCircle size={14} />
                        {needsAttention} att följa upp
                      </span>
                    )}
                  </div>
                )}

                <div className="inline-flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                  Utforska hjulet
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </button>
      </section>

      {/* Quick Actions Grid */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {isChild ? 'Snabbval' : 'Snabbåtkomst'}
        </h2>
        <div className={`grid gap-4 ${isChild ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
          {quickActions.map((action) => {
            const colors = getColorClasses(action.color);
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onNavigate(action.id as View)}
                className={`group p-5 rounded-2xl border-2 ${colors.border} ${colors.bg} text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
              >
                <Icon size={24} className={`${colors.icon} mb-3`} />
                <div className={`font-semibold ${colors.text}`}>{action.label}</div>
                <div className="text-sm text-gray-600 mt-0.5">{action.desc}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Status Section - Only for professionals */}
      {!isChild && (
        <section className="grid md:grid-cols-2 gap-6">
          {/* Active Plan Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Aktiv plan (SIP)</h3>
                  <p className="text-sm text-gray-500">Uppdaterad 15 dec 2024</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Aktiv
              </span>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-700 italic">
                "{childProfile.sipGoal?.professional || 'Erik ska uppnå åldersadekvat läsförmåga och känna trygghet i sin skolsituation.'}"
              </p>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-gray-600">
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  4 insatser
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-blue-500" />
                  Nästa: 15 jan
                </span>
              </div>
              <button
                onClick={() => onNavigate('sip')}
                className="text-blue-600 font-medium hover:underline flex items-center gap-1"
              >
                Öppna <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Team Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                  <Users size={20} className="text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Team runt {childProfile.name.split(' ')[0]}</h3>
                  <p className="text-sm text-gray-500">5 involverade</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { role: 'Mentor', name: 'Anna Karlsson', org: 'Stigslundsskolan' },
                { role: 'Kurator', name: 'Erik Svensson', org: 'Stigslundsskolan' },
                { role: 'Socialtjänst', name: 'Maria Lindberg', org: 'Gävle kommun' },
              ].map((person, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{person.name}</div>
                    <div className="text-xs text-gray-500">{person.role} • {person.org}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Attention Alert - if needed */}
      {needsAttention > 0 && !isChild && (
        <section>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">
                  {needsAttention} område{needsAttention > 1 ? 'n' : ''} behöver uppmärksamhet
                </h3>
                <p className="text-sm text-red-700 mb-3">
                  Vissa välbefinnandeområden visar låga värden och kan behöva uppföljning.
                </p>
                <button
                  onClick={() => onNavigate('shanarri')}
                  className="text-sm font-medium text-red-700 hover:text-red-900 flex items-center gap-1"
                >
                  Visa detaljer <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Child-friendly bottom section */}
      {isChild && (
        <section className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Shield size={24} className="text-orange-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Dina rättigheter</h3>
              <p className="text-sm text-gray-600">
                Du har rätt att veta vad som skrivs om dig och vara med och bestämma.
              </p>
            </div>
            <ChevronRight size={20} className="text-orange-400" />
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
