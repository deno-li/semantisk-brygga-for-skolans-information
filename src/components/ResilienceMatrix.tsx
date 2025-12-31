import React, { memo } from 'react';
import { RESILIENCE_MATRIX } from '../data/constants';
import { AlertTriangle, Shield, ShieldAlert } from 'lucide-react';

interface ResilienceMatrixProps {
  selectedProfileId?: string;
}

const ResilienceMatrix: React.FC<ResilienceMatrixProps> = () => {
  const { adversity, vulnerability, protectiveEnvironment, resilienceScore } = RESILIENCE_MATRIX;

  const getResilienceColor = (score: number): string => {
    if (score >= 7) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    if (score >= 3) return 'text-orange-600';
    return 'text-red-600';
  };

  const getResilienceLevel = (score: number): string => {
    if (score >= 7) return 'Hög motståndskraft';
    if (score >= 5) return 'Medelhög motståndskraft';
    if (score >= 3) return 'Låg motståndskraft';
    return 'Mycket låg motståndskraft';
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStrengthColor = (strength: string): string => {
    switch (strength) {
      case 'strong': return 'bg-green-100 text-green-800 border-green-300';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'weak': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'monitoring': return 'bg-yellow-100 text-yellow-700';
      case 'active': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white mb-4 shadow-lg">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resilience Matrix</h1>
        <p className="text-gray-600">
          GIRFEC • Motgångar, sårbarheter och skyddande miljö
        </p>
      </div>

      {/* Resilience Score */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Sammanvägd resiliens</h3>
            <p className="text-sm text-gray-500">
              Beräknad motståndskraft
            </p>
          </div>
          <div className="text-center px-6 py-3 bg-emerald-50 rounded-xl">
            <div className={`text-4xl font-bold ${getResilienceColor(resilienceScore)}`}>
              {resilienceScore}/10
            </div>
            <div className={`text-sm font-medium mt-1 ${getResilienceColor(resilienceScore)}`}>
              {getResilienceLevel(resilienceScore)}
            </div>
          </div>
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Adversity (Motgångar) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Motgångar</h3>
          </div>
          <div className="space-y-3">
            {adversity.map((factor) => (
              <div key={factor.id} className="bg-red-50 rounded-lg p-3 border border-red-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm text-[#1F1F1F]">{factor.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(factor.status)}`}>
                    {factor.status === 'resolved' ? 'Löst' : factor.status === 'monitoring' ? 'Uppföljning' : 'Aktiv'}
                  </span>
                </div>
                <p className="text-xs text-gray-700 mb-2">{factor.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className={`text-xs px-2 py-1 rounded border ${getSeverityColor(factor.severity)}`}>
                    {factor.severity === 'critical' ? 'Kritisk' :
                     factor.severity === 'high' ? 'Hög' :
                     factor.severity === 'medium' ? 'Medel' : 'Låg'}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 border border-gray-300">
                    {factor.duration === 'chronic' ? 'Kronisk' : 'Akut'}
                  </span>
                </div>
                {factor.impact.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Påverkar:</p>
                    <div className="flex flex-wrap gap-1">
                      {factor.impact.map((area, idx) => (
                        <span key={idx} className="text-xs bg-white px-2 py-0.5 rounded border border-red-200">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Vulnerability (Sårbarhet) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Sårbarhet</h3>
          </div>
          <div className="space-y-3">
            {vulnerability.map((factor) => (
              <div key={factor.id} className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm text-[#1F1F1F]">{factor.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded border ${getLevelColor(factor.level)}`}>
                    {factor.level === 'high' ? 'Hög' : factor.level === 'medium' ? 'Medel' : 'Låg'}
                  </span>
                </div>
                <p className="text-xs text-gray-700 mb-2">{factor.description}</p>
                <div className="mb-2">
                  <span className="text-xs px-2 py-1 rounded bg-white border border-yellow-300">
                    {factor.type === 'individual' ? 'Individnivå' :
                     factor.type === 'family' ? 'Familjenivå' : 'Miljönivå'}
                  </span>
                </div>
                {factor.mitigationStrategies.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Åtgärder:</p>
                    <ul className="text-xs space-y-1">
                      {factor.mitigationStrategies.map((strategy, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-1">•</span>
                          <span>{strategy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Protective Environment (Skyddande miljö) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Skyddande miljö</h3>
          </div>
          <div className="space-y-3">
            {protectiveEnvironment.map((factor) => (
              <div key={factor.id} className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm text-[#1F1F1F]">{factor.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded border ${getStrengthColor(factor.strength)}`}>
                    {factor.strength === 'strong' ? 'Stark' :
                     factor.strength === 'moderate' ? 'Medel' : 'Svag'}
                  </span>
                </div>
                <p className="text-xs text-gray-700 mb-2">{factor.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-xs px-2 py-1 rounded bg-white border border-green-300">
                    {factor.type === 'individual' ? 'Individ' :
                     factor.type === 'family' ? 'Familj' : 'Samhälle'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded border ${
                    factor.sustainabilityRisk === 'high' ? 'bg-red-100 text-red-700 border-red-300' :
                    factor.sustainabilityRisk === 'medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                    'bg-green-100 text-green-700 border-green-300'
                  }`}>
                    Risk: {factor.sustainabilityRisk === 'high' ? 'Hög' :
                           factor.sustainabilityRisk === 'medium' ? 'Medel' : 'Låg'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-3">Om Resilience Matrix</h4>
        <p className="text-sm text-gray-600 mb-4">
          Resilience Matrix från GIRFEC (Getting It Right For Every Child) används vid mer komplexa situationer för att
          bedöma barnets motståndskraft. Den väger samman tre huvudområden för att ge en helhetsbild av barnets situation och resiliens:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-red-50 rounded-xl">
            <div className="font-medium text-gray-900 text-sm mb-1">Motgångar</div>
            <p className="text-xs text-gray-600">Adversity - utmaningar och svårigheter</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl">
            <div className="font-medium text-gray-900 text-sm mb-1">Sårbarheter</div>
            <p className="text-xs text-gray-600">Vulnerability - känslighet och risker</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl">
            <div className="font-medium text-gray-900 text-sm mb-1">Skyddande miljö</div>
            <p className="text-xs text-gray-600">Protective environment - stöd och resurser</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ResilienceMatrix);
