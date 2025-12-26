/**
 * ICF Suggestions Display Component
 * Displays AI-generated ICF suggestions with Performance/Capacity qualifiers,
 * Environmental Factors, and Welfare Wheel mapping
 * Phase 4: AI-Powered ICF Coding
 */

import React from 'react';
import { CheckCircle2, AlertCircle, Info, TrendingUp, ArrowDown, ArrowUp, Minus } from 'lucide-react';
import {
  ICFAnalysisResult,
  ICFCodeSuggestion,
  EnvironmentalFactorSuggestion,
  getQualifierDescription,
  getQualifierColor
} from '../types/icf-types';
import { WelfareWheelSpoke } from '../types/types';

interface ICFSuggestionsDisplayProps {
  suggestions: ICFAnalysisResult;
  onApplySuggestion?: (suggestion: ICFCodeSuggestion) => void;
  onApplyEnvironmentalFactor?: (factor: EnvironmentalFactorSuggestion) => void;
}

const ICFSuggestionsDisplay: React.FC<ICFSuggestionsDisplayProps> = ({ 
  suggestions, 
  onApplySuggestion,
  onApplyEnvironmentalFactor 
}) => {
  // Helper: Get balance color
  const getBalanceColor = (balance: number): string => {
    if (balance > 0) return 'text-green-600';
    if (balance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // Helper: Get gap icon
  const getGapIcon = (interpretation: string) => {
    switch (interpretation) {
      case 'facilitators-work':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'barriers-exist':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  // Helper: Get gap color
  const getGapColor = (gap: number): string => {
    if (gap < 0) return 'text-green-600';
    if (gap > 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // Helper: QualifierBar component
  const QualifierBar: React.FC<{ value: number }> = ({ value }) => (
    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full rounded-full transition-all"
        style={{ 
          width: `${(value / 4) * 100}%`,
          backgroundColor: getQualifierColor(value as import('../types/icf-types').ICFQualifierValue)
        }}
      />
    </div>
  );

  // Helper: Get Swedish spoke name
  const getSpokeNameSwedish = (spoke: WelfareWheelSpoke): string => {
    const names: Record<WelfareWheelSpoke, string> = {
      'halsa': 'Hälsa',
      'larande': 'Lärande',
      'relationer': 'Relationer',
      'hemmet': 'Hemmet',
      'trygg': 'Trygghet',
      'utvecklas': 'Utvecklas',
      'delaktig': 'Delaktighet',
      'aktiv': 'Aktiv'
    };
    return names[spoke] || spoke;
  };

  // Helper: Get status badge color
  const getStatusBadgeColor = (status: number): string => {
    if (status >= 4) return 'bg-green-100 text-green-800 border-green-300';
    if (status === 3) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const StatusBadge: React.FC<{ status: number }> = ({ status }) => (
    <div className={`px-3 py-1 rounded border font-semibold text-sm ${getStatusBadgeColor(status)}`}>
      Status: {status}/5
    </div>
  );

  // Helper: Environmental Factor Card
  const EnvironmentalFactorCard: React.FC<{
    factor: EnvironmentalFactorSuggestion;
    onApply?: (factor: EnvironmentalFactorSuggestion) => void;
  }> = ({ factor, onApply }) => (
    <div 
      className={`p-3 rounded border mb-2 ${
        factor.type === 'facilitator' 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-semibold text-gray-900">
            {factor.code}: {factor.domain}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Nivå: {factor.type === 'barrier' ? '.' : '+'}{factor.suggested_level}
          </div>
        </div>
        {onApply && (
          <button 
            className="text-xs px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            onClick={() => onApply(factor)}
          >
            ✅ Använd
          </button>
        )}
      </div>
      <p className="text-sm text-gray-700">{factor.reasoning}</p>
      {factor.related_spokes.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {factor.related_spokes.map((spoke, idx) => (
            <span 
              key={idx}
              className="text-xs px-2 py-0.5 bg-white border border-gray-300 rounded"
            >
              {getSpokeNameSwedish(spoke)}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-xl">🧠</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">AI-analys sammanfattning</h3>
            <p className="text-gray-700 leading-relaxed">{suggestions.summary}</p>
            <div className="mt-4 flex gap-6 text-sm">
              <div>
                <span className="font-semibold text-gray-700">Rekommenderad nivå:</span>{' '}
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-semibold">
                  {suggestions.recommended_level}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Risk/Skydd-balans:</span>{' '}
                <span className={`font-bold ${getBalanceColor(suggestions.risk_protection_balance.balance)}`}>
                  {suggestions.risk_protection_balance.balance > 0 ? '+' : ''}
                  {suggestions.risk_protection_balance.balance} (
                  {suggestions.risk_protection_balance.interpretation === 'protection-dominates' && 'Skydd dominerar'}
                  {suggestions.risk_protection_balance.interpretation === 'balanced' && 'Balanserat'}
                  {suggestions.risk_protection_balance.interpretation === 'risk-dominates' && 'Risk dominerar'}
                  )
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ICF Code Suggestions */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          📋 Föreslagna ICF-koder
          <span className="text-xs font-normal text-gray-500">
            ({suggestions.icf_suggestions.length} förslag)
          </span>
        </h3>
        <div className="space-y-4">
          {suggestions.icf_suggestions.map((icf, idx) => (
            <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{icf.code} - {icf.domain}</h4>
                  <div className="text-sm text-gray-600 mt-1">
                    Konfidenspoäng: {(icf.confidence * 100).toFixed(0)}%
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden inline-block ml-2 align-middle">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${icf.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                {onApplySuggestion && (
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold text-sm"
                    onClick={() => onApplySuggestion(icf)}
                  >
                    ✅ Använd
                  </button>
                )}
              </div>

              {/* Performance vs Capacity */}
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    Performance (med stöd)
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-8 h-8 rounded flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: getQualifierColor(icf.performance_qualifier.value) }}
                    >
                      {icf.performance_qualifier.value}
                    </div>
                    <span className="font-semibold text-gray-900">
                      {icf.performance_qualifier.description}
                    </span>
                  </div>
                  <QualifierBar value={icf.performance_qualifier.value} />
                  <p className="text-xs text-gray-600 mt-2 italic">
                    {icf.performance_qualifier.reasoning}
                  </p>
                </div>
                
                <div className="bg-gray-50 border border-gray-300 rounded p-3">
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    Capacity (utan stöd)
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-8 h-8 rounded flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: getQualifierColor(icf.capacity_qualifier.value) }}
                    >
                      {icf.capacity_qualifier.value}
                    </div>
                    <span className="font-semibold text-gray-900">
                      {icf.capacity_qualifier.description}
                    </span>
                  </div>
                  <QualifierBar value={icf.capacity_qualifier.value} />
                  <p className="text-xs text-gray-600 mt-2 italic">
                    {icf.capacity_qualifier.reasoning}
                  </p>
                </div>
              </div>

              {/* Gap Analysis */}
              <div className={`p-3 rounded border ${
                icf.gap_interpretation === 'facilitators-work' 
                  ? 'bg-green-50 border-green-300'
                  : icf.gap_interpretation === 'barriers-exist'
                  ? 'bg-red-50 border-red-300'
                  : 'bg-gray-50 border-gray-300'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {getGapIcon(icf.gap_interpretation)}
                  <span className="font-semibold text-gray-900">
                    Gap: <span className={getGapColor(icf.gap)}>{icf.gap}</span>
                  </span>
                  <span className="ml-2">
                    {icf.gap_interpretation === 'facilitators-work' && '✅ Anpassningar fungerar'}
                    {icf.gap_interpretation === 'neutral' && '➖ Neutral'}
                    {icf.gap_interpretation === 'barriers-exist' && '⚠️ Barriers finns'}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{icf.gap_explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Environmental Factors */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🌍 Miljöfaktorer</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Facilitators */}
          <div>
            <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Underlättare (Facilitators)
            </h4>
            {suggestions.environmental_factors
              .filter(f => f.type === 'facilitator')
              .map((factor, idx) => (
                <EnvironmentalFactorCard 
                  key={idx} 
                  factor={factor} 
                  onApply={onApplyEnvironmentalFactor} 
                />
              ))}
            {suggestions.environmental_factors.filter(f => f.type === 'facilitator').length === 0 && (
              <p className="text-sm text-gray-500 italic">Inga facilitators identifierade</p>
            )}
          </div>

          {/* Barriers */}
          <div>
            <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Barriärer (Barriers)
            </h4>
            {suggestions.environmental_factors
              .filter(f => f.type === 'barrier')
              .map((factor, idx) => (
                <EnvironmentalFactorCard 
                  key={idx} 
                  factor={factor} 
                  onApply={onApplyEnvironmentalFactor} 
                />
              ))}
            {suggestions.environmental_factors.filter(f => f.type === 'barrier').length === 0 && (
              <p className="text-sm text-gray-500 italic">Inga barriers identifierade</p>
            )}
          </div>
        </div>
      </div>

      {/* Welfare Wheel Mapping */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 Välbefinnandehjul-placering</h3>
        <div className="space-y-2">
          {suggestions.welfare_wheel_mapping.map((spoke, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <span className="font-semibold text-gray-900">
                  {getSpokeNameSwedish(spoke.spoke)}
                </span>
                <span className="text-sm text-gray-600 ml-3">
                  Konfidenspoäng: {(spoke.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <StatusBadge status={spoke.suggested_status} />
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Om AI-förslagen:</p>
            <p>
              Dessa förslag är AI-genererade och bör granskas av professionella. 
              Använd "Använd"-knapparna för att applicera förslag till ICF-bedömningsformuläret. 
              Du kan redigera alla värden innan slutlig sparning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ICFSuggestionsDisplay;
