/**
 * ICF Gap Analysis Component
 * Visualizes Performance vs Capacity and shows if adaptations are working
 * Based on WHO ICF Beginner's Guide (2002)
 */

import React from 'react';
import { ArrowDown, ArrowUp, Minus, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { ICFAssessment, getQualifierDescription, getQualifierColor, interpretGap } from '../types/icf-types';

interface ICFGapAnalysisProps {
  assessments: ICFAssessment[];
  title?: string;
  showMetadata?: boolean;
}

const ICFGapAnalysis: React.FC<ICFGapAnalysisProps> = ({
  assessments,
  title = 'ICF Gap-analys: Performance vs Capacity',
  showMetadata = true
}) => {
  if (assessments.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">Ingen gap-analys tillgänglig. Bedömningar saknas.</p>
      </div>
    );
  }

  // Helper: Get icon for gap interpretation
  const getGapIcon = (interpretation: string) => {
    switch (interpretation) {
      case 'facilitators-work':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'barriers-exist':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  // Helper: Get interpretation text
  const getInterpretationText = (interpretation: string, gap: number) => {
    switch (interpretation) {
      case 'facilitators-work':
        return `Anpassningar FUNGERAR (Gap: ${gap}). Performance bättre än Capacity!`;
      case 'barriers-exist':
        return `Barriärer finns (Gap: +${gap}). Performance sämre än Capacity.`;
      default:
        return `Neutral (Gap: 0). Performance = Capacity.`;
    }
  };

  // Helper: Get gap arrow
  const getGapArrow = (gap: number) => {
    if (gap < 0) return <ArrowDown className="w-6 h-6 text-green-600" />;
    if (gap > 0) return <ArrowUp className="w-6 h-6 text-orange-600" />;
    return <Minus className="w-6 h-6 text-gray-600" />;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="bg-blue-50 border border-blue-200 rounded p-3 flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium">WHO ICF Gap-analys:</p>
            <p className="mt-1">
              <strong>Performance</strong> = vad barnet GÖR i nuvarande miljö med anpassningar.{' '}
              <strong>Capacity</strong> = vad barnet KAN utan anpassningar.{' '}
              <strong>Gap</strong> = Performance - Capacity visar om anpassningar fungerar.
            </p>
          </div>
        </div>
      </div>

      {/* Assessments */}
      <div className="space-y-4">
        {assessments.map((assessment, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            {/* Domain Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {assessment.code}: {assessment.domain}
                </h4>
                {showMetadata && (
                  <p className="text-xs text-gray-600 mt-1">
                    Bedömd: {assessment.assessedDate} | Av: {assessment.assessedBy} | Kontext: {assessment.context}
                  </p>
                )}
              </div>
              {getGapIcon(assessment.gapInterpretation)}
            </div>

            {/* Performance vs Capacity Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              {/* Capacity */}
              <div className="bg-gray-50 border border-gray-300 rounded p-3">
                <p className="text-xs text-gray-600 mb-1 font-medium">
                  CAPACITY (utan stöd)
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: getQualifierColor(assessment.capacity.value) }}
                  >
                    {assessment.capacity.value === 9 ? '?' : assessment.capacity.value}
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {assessment.capacity.description}
                  </p>
                </div>
              </div>

              {/* Gap Arrow */}
              <div className="flex items-center justify-center">
                <div className="text-center">
                  {getGapArrow(assessment.gap)}
                  <p className="text-xs font-semibold mt-1 text-gray-700">
                    GAP: {assessment.gap}
                  </p>
                </div>
              </div>

              {/* Performance */}
              <div className="bg-green-50 border border-green-300 rounded p-3">
                <p className="text-xs text-gray-600 mb-1 font-medium">
                  PERFORMANCE (med stöd)
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-10 h-10 rounded flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: getQualifierColor(assessment.performance.value) }}
                  >
                    {assessment.performance.value === 9 ? '?' : assessment.performance.value}
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {assessment.performance.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Interpretation */}
            <div
              className={`rounded p-3 ${
                assessment.gapInterpretation === 'facilitators-work'
                  ? 'bg-green-50 border border-green-300'
                  : assessment.gapInterpretation === 'barriers-exist'
                  ? 'bg-orange-50 border border-orange-300'
                  : 'bg-gray-50 border border-gray-300'
              }`}
            >
              <p className="text-sm font-medium">
                {getInterpretationText(assessment.gapInterpretation, assessment.gap)}
              </p>
              {assessment.notes && (
                <p className="text-xs text-gray-700 mt-2">
                  <strong>Anteckningar:</strong> {assessment.notes}
                </p>
              )}
            </div>

            {/* Source & Time */}
            {showMetadata && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <p>
                    <strong>Källa:</strong> {assessment.source}
                  </p>
                  <p>
                    <strong>Tidsspann:</strong> {assessment.timeSpan}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Overall Summary */}
      {assessments.length > 1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Sammanfattning</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-700 font-medium">Anpassningar fungerar:</p>
              <p className="text-2xl font-bold text-green-600">
                {assessments.filter(a => a.gapInterpretation === 'facilitators-work').length}
              </p>
            </div>
            <div>
              <p className="text-gray-700 font-medium">Barriärer finns:</p>
              <p className="text-2xl font-bold text-orange-600">
                {assessments.filter(a => a.gapInterpretation === 'barriers-exist').length}
              </p>
            </div>
            <div>
              <p className="text-gray-700 font-medium">Neutrala:</p>
              <p className="text-2xl font-bold text-gray-600">
                {assessments.filter(a => a.gapInterpretation === 'neutral').length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ICFGapAnalysis;
