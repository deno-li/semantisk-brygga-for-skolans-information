import React, { useState, memo, useMemo } from 'react';
import { MY_WORLD_ASSESSMENTS } from '../data/constants';
import { User, Users, Globe, Star, AlertCircle } from 'lucide-react';
import BBICTriangle from './BBICTriangle';

interface MyWorldTriangleProps {
  selectedProfileId?: string;
}

const MyWorldTriangle: React.FC<MyWorldTriangleProps> = ({ selectedProfileId }) => {
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);

  const getDimensionIcon = (dimension: string) => {
    switch (dimension) {
      case 'how-i-develop': return <User size={24} className="text-blue-600" />;
      case 'what-i-need': return <Users size={24} className="text-purple-600" />;
      case 'my-wider-world': return <Globe size={24} className="text-green-600" />;
      default: return null;
    }
  };

  const getDimensionColor = (dimension: string): string => {
    switch (dimension) {
      case 'how-i-develop': return 'border-blue-400 bg-blue-50';
      case 'what-i-need': return 'border-purple-400 bg-purple-50';
      case 'my-wider-world': return 'border-green-400 bg-green-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const getDimensionName = (dimension: string): string => {
    switch (dimension) {
      case 'how-i-develop': return 'Hur jag växer och utvecklas';
      case 'what-i-need': return 'Vad jag behöver från andra';
      case 'my-wider-world': return 'Min omvärld';
      default: return dimension;
    }
  };

  const getRatingColor = (rating: number): string => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    if (rating >= 2) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  const selectedAssessment = selectedDimension
    ? MY_WORLD_ASSESSMENTS.find(a => a.dimension === selectedDimension)
    : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white mb-4 shadow-lg">
          <Globe className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My World Triangle</h1>
        <p className="text-gray-600">
          GIRFEC/BBIC/IBIC • Helhetsbedömning i tre dimensioner
        </p>
      </div>

      {/* Triangle Overview */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MY_WORLD_ASSESSMENTS.map((assessment) => (
            <button
              key={assessment.dimension}
              onClick={() => setSelectedDimension(assessment.dimension)}
              className={`p-5 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${
                getDimensionColor(assessment.dimension)
              } ${selectedDimension === assessment.dimension ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  assessment.dimension === 'how-i-develop' ? 'bg-blue-100' :
                  assessment.dimension === 'what-i-need' ? 'bg-purple-100' : 'bg-green-100'
                }`}>
                  {getDimensionIcon(assessment.dimension)}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {getDimensionName(assessment.dimension)}
                </h3>
                <div className="flex items-center gap-0.5">
                  {getRatingStars(assessment.overallRating)}
                </div>
                <div className={`text-2xl font-bold ${getRatingColor(assessment.overallRating)}`}>
                  {assessment.overallRating}/5
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(assessment.lastAssessed).toLocaleDateString('sv-SE')}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detailed View */}
      {selectedAssessment && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                selectedAssessment.dimension === 'how-i-develop' ? 'bg-blue-100' :
                selectedAssessment.dimension === 'what-i-need' ? 'bg-purple-100' : 'bg-green-100'
              }`}>
                {getDimensionIcon(selectedAssessment.dimension)}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {getDimensionName(selectedAssessment.dimension)}
              </h3>
            </div>
            <button
              onClick={() => setSelectedDimension(null)}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Stäng
            </button>
          </div>

          {/* Overall Notes */}
          {selectedAssessment.notes && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Sammanfattning:</strong> {selectedAssessment.notes}
              </p>
            </div>
          )}

          {/* Aspects */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Delområden</h4>
            {selectedAssessment.aspects.map((aspect) => (
              <div key={aspect.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h5 className="font-semibold text-[#1F1F1F] mb-1">{aspect.name}</h5>
                    <p className="text-sm text-gray-600 mb-2">{aspect.description}</p>
                  </div>
                  <div className="flex flex-col items-end ml-4">
                    <div className="flex items-center gap-1 mb-1">
                      {getRatingStars(aspect.rating)}
                    </div>
                    <span className={`text-xl font-bold ${getRatingColor(aspect.rating)}`}>
                      {aspect.rating}/5
                    </span>
                  </div>
                </div>

                {/* BBIC and ICF Codes */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {aspect.bbicCode && (
                    <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800 border border-purple-300">
                      BBIC: {aspect.bbicCode}
                    </span>
                  )}
                  {aspect.icfCodes && aspect.icfCodes.length > 0 && (
                    aspect.icfCodes.map((code, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 border border-blue-300">
                        ICF: {code}
                      </span>
                    ))
                  )}
                </div>

                {/* Concerns */}
                {aspect.concerns && aspect.concerns.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      <AlertCircle size={16} className="text-orange-600" />
                      Bekymmer:
                    </p>
                    <ul className="text-sm space-y-1">
                      {aspect.concerns.map((concern, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2 text-orange-600">•</span>
                          <span className="text-gray-700">{concern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Strengths */}
                {aspect.strengths && aspect.strengths.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      <Star size={16} className="text-green-600 fill-green-600" />
                      Styrkor:
                    </p>
                    <ul className="text-sm space-y-1">
                      {aspect.strengths.map((strength, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2 text-green-600">•</span>
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* SHANARRI Links */}
                {aspect.shanarriLinks && aspect.shanarriLinks.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <p className="text-xs text-gray-600 mb-1">Kopplat till SHANARRI-dimensioner:</p>
                    <div className="flex flex-wrap gap-1">
                      {aspect.shanarriLinks.map((link, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 rounded bg-white border border-gray-300">
                          {link}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-3">Om My World Triangle</h4>
        <p className="text-sm text-gray-600 mb-4">
          My World Triangle från GIRFEC kompletterar BBIC & IBIC med en strukturerad bedömning i tre huvuddimensioner:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-blue-50 rounded-xl">
            <div className="font-medium text-gray-900 text-sm mb-1">Hur jag växer</div>
            <p className="text-xs text-gray-600">Lärande, relationer, hälsa</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-xl">
            <div className="font-medium text-gray-900 text-sm mb-1">Vad jag behöver</div>
            <p className="text-xs text-gray-600">Omsorg, stöd, stimulans</p>
          </div>
          <div className="p-3 bg-green-50 rounded-xl">
            <div className="font-medium text-gray-900 text-sm mb-1">Min omvärld</div>
            <p className="text-xs text-gray-600">Skola, fritid, miljö</p>
          </div>
        </div>
      </div>

      {/* BBIC Triangle Visualization */}
      <BBICTriangle selectedProfileId={selectedProfileId} />
    </div>
  );
};

export default memo(MyWorldTriangle);
