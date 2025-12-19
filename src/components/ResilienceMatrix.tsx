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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#005595] to-[#003D6B] text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Resilience Matrix (GIRFEC)</h2>
        <p className="text-sm opacity-90">
          Bedömning av motståndskraft baserat på motgångar, sårbarheter och skyddande miljö
        </p>
      </div>

      {/* Resilience Score */}
      <div className="bg-white rounded-lg border-2 border-[#005595] p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1F1F1F] mb-1">Sammanvägd resiliens</h3>
            <p className="text-sm text-gray-600">
              Beräknad motståndskraft baserat på alla faktorer
            </p>
          </div>
          <div className="text-center">
            <div className={`text-5xl font-bold ${getResilienceColor(resilienceScore)}`}>
              {resilienceScore}/10
            </div>
            <div className={`text-sm font-semibold mt-1 ${getResilienceColor(resilienceScore)}`}>
              {getResilienceLevel(resilienceScore)}
            </div>
          </div>
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Adversity (Motgångar) */}
        <div className="bg-white rounded-lg border-2 border-red-200 p-6 shadow-sm">
          <h3 className="font-bold text-[#1F1F1F] flex items-center gap-2 text-lg mb-4">
            <AlertTriangle size={20} className="text-red-600" />
            Motgångar (Adversity)
          </h3>
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
        <div className="bg-white rounded-lg border-2 border-yellow-200 p-6 shadow-sm">
          <h3 className="font-bold text-[#1F1F1F] flex items-center gap-2 text-lg mb-4">
            <ShieldAlert size={20} className="text-yellow-600" />
            Sårbarhet (Vulnerability)
          </h3>
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
        <div className="bg-white rounded-lg border-2 border-green-200 p-6 shadow-sm">
          <h3 className="font-bold text-[#1F1F1F] flex items-center gap-2 text-lg mb-4">
            <Shield size={20} className="text-green-600" />
            Skyddande miljö (Protective Environment)
          </h3>
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
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-semibold text-sm text-[#1F1F1F] mb-2">Om Resilience Matrix</h4>
        <p className="text-xs text-gray-700">
          Resilience Matrix från GIRFEC (Getting It Right For Every Child) används vid mer komplexa situationer för att
          bedöma barnets motståndskraft. Den väger samman <strong>motgångar</strong> (adversity), <strong>sårbarheter</strong> (vulnerability)
          och <strong>skyddande miljöfaktorer</strong> (protective environment) för att ge en helhetsbild av barnets situation och resiliens.
        </p>
      </div>
    </div>
  );
};

export default memo(ResilienceMatrix);
