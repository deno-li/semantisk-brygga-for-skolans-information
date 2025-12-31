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
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500">Ingen gap-analys tillgänglig. Bedömningar saknas.</p>
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
    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Info className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
          <p className="text-sm text-purple-800 font-medium mb-2">WHO ICF Gap-analys</p>
          <p className="text-sm text-gray-700">
            <strong className="text-purple-700">Performance</strong> = vad barnet GÖR i nuvarande miljö med anpassningar.{' '}
            <strong className="text-purple-700">Capacity</strong> = vad barnet KAN utan anpassningar.{' '}
            <strong className="text-purple-700">Gap</strong> = Performance - Capacity visar om anpassningar fungerar.
          </p>
        </div>
      </div>

      {/* Assessments */}
      <div className="space-y-4">
        {assessments.map((assessment, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            {/* Domain Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {assessment.code}: {assessment.domain}
                </h4>
                {showMetadata && (
                  <p className="text-xs text-gray-500 mt-1">
                    Bedömd: {assessment.assessedDate} | Av: {assessment.assessedBy} | Kontext: {assessment.context}
                  </p>
                )}
              </div>
              {getGapIcon(assessment.gapInterpretation)}
            </div>

            {/* Performance vs Capacity Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Capacity */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">
                  Capacity (utan stöd)
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
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
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  {getGapArrow(assessment.gap)}
                  <p className="text-xs font-medium mt-1 text-gray-600">
                    GAP: {assessment.gap}
                  </p>
                </div>
              </div>

              {/* Performance */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">
                  Performance (med stöd)
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
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
              className={`rounded-xl p-4 ${
                assessment.gapInterpretation === 'facilitators-work'
                  ? 'bg-emerald-50 border border-emerald-200'
                  : assessment.gapInterpretation === 'barriers-exist'
                  ? 'bg-amber-50 border border-amber-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <p className="text-sm font-medium text-gray-900">
                {getInterpretationText(assessment.gapInterpretation, assessment.gap)}
              </p>
              {assessment.notes && (
                <p className="text-xs text-gray-600 mt-2">
                  <strong>Anteckningar:</strong> {assessment.notes}
                </p>
              )}
            </div>

            {/* Source & Time */}
            {showMetadata && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <p>
                    <span className="font-medium">Källa:</span> {assessment.source}
                  </p>
                  <p>
                    <span className="font-medium">Tidsspann:</span> {assessment.timeSpan}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Overall Summary */}
      {assessments.length > 1 && (
        <div className="bg-gray-50 rounded-xl p-5">
          <h4 className="font-semibold text-gray-900 mb-4">Sammanfattning</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-white rounded-xl">
              <p className="text-xs text-gray-500 font-medium mb-1">Anpassningar fungerar</p>
              <p className="text-2xl font-bold text-emerald-600">
                {assessments.filter(a => a.gapInterpretation === 'facilitators-work').length}
              </p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl">
              <p className="text-xs text-gray-500 font-medium mb-1">Barriärer finns</p>
              <p className="text-2xl font-bold text-amber-600">
                {assessments.filter(a => a.gapInterpretation === 'barriers-exist').length}
              </p>
            </div>
            <div className="text-center p-3 bg-white rounded-xl">
              <p className="text-xs text-gray-500 font-medium mb-1">Neutrala</p>
              <p className="text-2xl font-bold text-gray-500">
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
