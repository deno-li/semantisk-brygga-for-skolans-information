/**
 * Risk/Protection Balance Component
 * Visualizes Environmental Factors as barriers and facilitators
 * Based on WHO ICF Environmental Factors classification
 */

import React, { useMemo } from 'react';
import { Shield, AlertTriangle, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { EnvironmentalFactor, interpretBalance, getBarrierDescription, getFacilitatorDescription } from '../types/icf-types';
import { WelfareWheelSpoke } from '../types/types';

interface RiskProtectionBalanceProps {
  environmentalFactors: EnvironmentalFactor[];
  title?: string;
  showBySpoke?: boolean;
  selectedSpoke?: WelfareWheelSpoke;
}

const RiskProtectionBalance: React.FC<RiskProtectionBalanceProps> = ({
  environmentalFactors,
  title = 'Risk/Skydd-balans (Environmental Factors)',
  showBySpoke = true,
  selectedSpoke
}) => {
  // Filter by spoke if specified
  const filteredFactors = useMemo(() => {
    if (!selectedSpoke) return environmentalFactors;
    return environmentalFactors.filter(ef =>
      ef.relatedSpokes.includes(selectedSpoke)
    );
  }, [environmentalFactors, selectedSpoke]);

  // Separate barriers and facilitators
  const barriers = useMemo(
    () => filteredFactors.filter(ef => ef.type === 'barrier'),
    [filteredFactors]
  );

  const facilitators = useMemo(
    () => filteredFactors.filter(ef => ef.type === 'facilitator'),
    [filteredFactors]
  );

  // Calculate scores
  const riskScore = useMemo(
    () => barriers.reduce((sum, b) => sum + (b.level as number), 0),
    [barriers]
  );

  const protectionScore = useMemo(
    () => facilitators.reduce((sum, f) => sum + (f.level as number), 0),
    [facilitators]
  );

  const balance = protectionScore - riskScore;
  const interpretation = interpretBalance(balance);

  // Get balance color
  const getBalanceColor = () => {
    if (interpretation === 'protection-dominates') return 'text-green-600';
    if (interpretation === 'risk-dominates') return 'text-red-600';
    return 'text-yellow-600';
  };

  // Get balance background
  const getBalanceBg = () => {
    if (interpretation === 'protection-dominates') return 'bg-green-50 border-green-300';
    if (interpretation === 'risk-dominates') return 'bg-red-50 border-red-300';
    return 'bg-yellow-50 border-yellow-300';
  };

  // Get interpretation text
  const getInterpretationText = () => {
    if (interpretation === 'protection-dominates') {
      return 'Skyddsfaktorer DOMINERAR. God prognos med fortsatt stöd.';
    }
    if (interpretation === 'risk-dominates') {
      return 'Riskfaktorer DOMINERAR. Behöver förstärka skyddsfaktorer.';
    }
    return 'BALANSERAD situation. Risk och skydd i jämvikt.';
  };

  // Group by spoke for detailed view
  const factorsBySpoke = useMemo(() => {
    const grouped: Record<string, EnvironmentalFactor[]> = {};
    filteredFactors.forEach(ef => {
      ef.relatedSpokes.forEach(spoke => {
        if (!grouped[spoke]) grouped[spoke] = [];
        grouped[spoke].push(ef);
      });
    });
    return grouped;
  }, [filteredFactors]);

  if (filteredFactors.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">Inga Environmental Factors registrerade.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="bg-blue-50 border border-blue-200 rounded p-3 flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium">WHO ICF Environmental Factors:</p>
            <p className="mt-1">
              <strong>Barriers (.1-.4)</strong> = Hinder i miljön som begränsar delaktighet.{' '}
              <strong>Facilitators (+1-+4)</strong> = Möjliggörare som förbättrar delaktighet.{' '}
              <strong>Balans</strong> = Skydd - Risk.
            </p>
          </div>
        </div>
      </div>

      {/* Overall Balance */}
      <div className={`border rounded-lg p-5 ${getBalanceBg()}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          {/* Risk Score */}
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-gray-700 font-medium">RISKFAKTORER (Barriers)</p>
            <p className="text-4xl font-bold text-red-600">{riskScore}</p>
            <p className="text-xs text-gray-600 mt-1">{barriers.length} barriers</p>
          </div>

          {/* Balance */}
          <div className="text-center">
            <div className={`text-5xl font-bold ${getBalanceColor()}`}>
              {balance >= 0 ? '+' : ''}{balance}
            </div>
            <p className="text-sm text-gray-700 font-medium mt-2">BALANS</p>
            <p className="text-xs text-gray-600">Skydd - Risk</p>
          </div>

          {/* Protection Score */}
          <div className="text-center">
            <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-700 font-medium">SKYDDSFAKTORER (Facilitators)</p>
            <p className="text-4xl font-bold text-green-600">{protectionScore}</p>
            <p className="text-xs text-gray-600 mt-1">{facilitators.length} facilitators</p>
          </div>
        </div>

        {/* Interpretation */}
        <div className="border-t pt-4 mt-4">
          <p className={`text-center font-semibold text-lg ${getBalanceColor()}`}>
            {getInterpretationText()}
          </p>
        </div>
      </div>

      {/* Visual Bar Chart */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Visualisering</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* Barriers */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">BARRIERS (Hinder)</p>
            <div className="space-y-2">
              {barriers.length === 0 ? (
                <p className="text-xs text-gray-500 italic">Inga barriers</p>
              ) : (
                barriers.map((barrier, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded h-8 overflow-hidden">
                      <div
                        className="bg-red-500 h-full flex items-center justify-end px-2 text-white text-xs font-semibold transition-all"
                        style={{ width: `${(barrier.level / 4) * 100}%` }}
                      >
                        .{barrier.level}
                      </div>
                    </div>
                    <div className="w-40 text-xs text-gray-700 truncate" title={barrier.domain}>
                      {barrier.code}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Facilitators */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">FACILITATORS (Möjliggörare)</p>
            <div className="space-y-2">
              {facilitators.length === 0 ? (
                <p className="text-xs text-gray-500 italic">Inga facilitators</p>
              ) : (
                facilitators.map((facilitator, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded h-8 overflow-hidden">
                      <div
                        className="bg-green-500 h-full flex items-center justify-end px-2 text-white text-xs font-semibold transition-all"
                        style={{ width: `${(facilitator.level / 4) * 100}%` }}
                      >
                        +{facilitator.level}
                      </div>
                    </div>
                    <div className="w-40 text-xs text-gray-700 truncate" title={facilitator.domain}>
                      {facilitator.code}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed List */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Detaljer</h4>

        {/* Barriers */}
        {barriers.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <h5 className="font-medium text-red-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Riskfaktorer (Barriers)
            </h5>
            <div className="space-y-2">
              {barriers.map((barrier, index) => (
                <div key={index} className="bg-white border border-red-200 rounded p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {barrier.code}: {barrier.domain}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">{barrier.description}</p>
                      <p className="text-xs text-gray-600 mt-2">
                        <strong>Nivå:</strong> .{barrier.level} ({getBarrierDescription(barrier.level)}) |{' '}
                        <strong>Identifierad:</strong> {barrier.identifiedDate} |{' '}
                        <strong>Status:</strong> {barrier.status}
                      </p>
                    </div>
                    <div
                      className="ml-4 w-12 h-12 rounded flex items-center justify-center text-white font-bold bg-red-500"
                    >
                      .{barrier.level}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Facilitators */}
        {facilitators.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <h5 className="font-medium text-green-900 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Skyddsfaktorer (Facilitators)
            </h5>
            <div className="space-y-2">
              {facilitators.map((facilitator, index) => (
                <div key={index} className="bg-white border border-green-200 rounded p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {facilitator.code}: {facilitator.domain}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">{facilitator.description}</p>
                      <p className="text-xs text-gray-600 mt-2">
                        <strong>Nivå:</strong> +{facilitator.level} ({getFacilitatorDescription(facilitator.level)}) |{' '}
                        <strong>Identifierad:</strong> {facilitator.identifiedDate} |{' '}
                        <strong>Status:</strong> {facilitator.status}
                      </p>
                    </div>
                    <div
                      className="ml-4 w-12 h-12 rounded flex items-center justify-center text-white font-bold bg-green-500"
                    >
                      +{facilitator.level}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* By Spoke (if enabled) */}
      {showBySpoke && !selectedSpoke && Object.keys(factorsBySpoke).length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Per eker</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(factorsBySpoke).map(([spoke, factors]) => {
              const spokeBarriers = factors.filter(f => f.type === 'barrier');
              const spokeFacilitators = factors.filter(f => f.type === 'facilitator');
              const spokeRisk = spokeBarriers.reduce((sum, b) => sum + (b.level as number), 0);
              const spokeProtection = spokeFacilitators.reduce((sum, f) => sum + (f.level as number), 0);
              const spokeBalance = spokeProtection - spokeRisk;

              return (
                <div key={spoke} className="border border-gray-300 rounded p-3">
                  <p className="font-medium text-gray-900 mb-2">{spoke.toUpperCase()}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-red-600">Risk: {spokeRisk}</span>
                    <span
                      className={`font-semibold ${
                        spokeBalance >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {spokeBalance >= 0 ? '+' : ''}{spokeBalance}
                    </span>
                    <span className="text-green-600">Skydd: {spokeProtection}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskProtectionBalance;
