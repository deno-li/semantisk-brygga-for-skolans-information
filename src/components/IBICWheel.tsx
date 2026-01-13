/**
 * IBIC Wheel Component
 * Visualizes IBIC (Individens Behov i Centrum) life areas as a wheel
 * Based on Socialstyrelsen's IBIC framework and ICF life domains
 */

import React from 'react';
import { IBIC_LIFE_AREAS } from '../data/constants';
import { User, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useProfileData } from '../hooks/useProfileData';

interface IBICWheelProps {
  selectedProfileId?: string;
}

const IBICWheel: React.FC<IBICWheelProps> = ({ selectedProfileId }) => {
  // Get profile-specific SHANARRI data which includes IBIC mappings
  const { shanarriData, childProfile } = useProfileData(selectedProfileId || 'erik');

  // Get SHANARRI dimensions by ID for linking
  const getShanarriByIds = (ids: string[]) => {
    return shanarriData.filter(dim => ids.includes(dim.id));
  };

  // Get status icon
  const getStatusIcon = (status: number) => {
    if (status >= 3) return <CheckCircle2 className="w-3 h-3" />;
    return <AlertCircle className="w-3 h-3" />;
  };

  // Calculate position on wheel for each segment
  const getSegmentPath = (index: number, total: number, innerRadius: number, outerRadius: number) => {
    const angleStart = (index * 360 / total) - 90;
    const angleEnd = ((index + 1) * 360 / total) - 90;
    const startRad = (angleStart * Math.PI) / 180;
    const endRad = (angleEnd * Math.PI) / 180;

    const x1 = 200 + outerRadius * Math.cos(startRad);
    const y1 = 200 + outerRadius * Math.sin(startRad);
    const x2 = 200 + outerRadius * Math.cos(endRad);
    const y2 = 200 + outerRadius * Math.sin(endRad);
    const x3 = 200 + innerRadius * Math.cos(endRad);
    const y3 = 200 + innerRadius * Math.sin(endRad);
    const x4 = 200 + innerRadius * Math.cos(startRad);
    const y4 = 200 + innerRadius * Math.sin(startRad);

    const largeArc = (angleEnd - angleStart) > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  // Get text position for labels
  const getTextPosition = (index: number, total: number, radius: number) => {
    const angle = ((index + 0.5) * 360 / total) - 90;
    const rad = (angle * Math.PI) / 180;
    return {
      x: 200 + radius * Math.cos(rad),
      y: 200 + radius * Math.sin(rad)
    };
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white mb-3 shadow-lg">
          <User className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          IBIC - Individens Behov i Centrum
        </h2>
        <p className="text-sm text-gray-600">
          Strukturerad bedömning av behov enligt ICF:s livsområden
        </p>
        {childProfile && (
          <p className="text-xs text-gray-500 mt-1">
            Visar data för: <span className="font-semibold text-gray-700">{childProfile.name}</span>
          </p>
        )}
      </div>

      {/* Wheel Visualization */}
      <div className="relative w-full max-w-xl mx-auto">
        <svg viewBox="0 0 400 400" className="w-full h-auto">
          {/* Background circle */}
          <circle cx="200" cy="200" r="180" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />

          {/* Wheel segments */}
          {IBIC_LIFE_AREAS.map((area, index) => (
            <g key={area.id}>
              <path
                d={getSegmentPath(index, IBIC_LIFE_AREAS.length, 60, 170)}
                fill={`${area.color}20`}
                stroke={area.color}
                strokeWidth="2"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
              {/* ICF chapter label */}
              <text
                x={getTextPosition(index, IBIC_LIFE_AREAS.length, 115).x}
                y={getTextPosition(index, IBIC_LIFE_AREAS.length, 115).y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fontWeight="bold"
                fill={area.color}
              >
                {area.icfChapter}
              </text>
            </g>
          ))}

          {/* Center circle */}
          <circle cx="200" cy="200" r="55" fill="white" stroke="#1F1F1F" strokeWidth="3" />
          <text
            x="200"
            y="192"
            textAnchor="middle"
            fontSize="15"
            fontWeight="bold"
            fill="#1F1F1F"
          >
            INDIVIDEN
          </text>
          <text
            x="200"
            y="210"
            textAnchor="middle"
            fontSize="12"
            fill="#666"
          >
            I CENTRUM
          </text>
        </svg>
      </div>

      {/* Life Areas Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {IBIC_LIFE_AREAS.map((area) => {
          const linkedDimensions = getShanarriByIds(area.linkedShanarri);

          return (
            <div
              key={area.id}
              className="p-4 rounded-xl border bg-white hover:shadow-md transition-shadow"
              style={{
                borderColor: `${area.color}40`,
                backgroundColor: `${area.color}05`
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-white font-bold text-sm"
                  style={{ backgroundColor: area.color }}
                >
                  {area.icfChapter}
                </span>
                <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
                  {area.title}
                </h3>
              </div>

              <p className="text-xs text-gray-600 mb-3">
                {area.description}
              </p>

              {/* Examples */}
              <div className="flex flex-wrap gap-1 mb-2">
                {area.examples.slice(0, 3).map((example, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600"
                  >
                    {example}
                  </span>
                ))}
              </div>

              {/* Linked SHANARRI dimensions with status */}
              {linkedDimensions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-100">
                  {linkedDimensions.map((dim) => (
                    <span
                      key={dim.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold text-white"
                      style={{ backgroundColor: dim.color }}
                      title={`${dim.name}: Nivå ${dim.status}/5 - ${dim.ibic || 'IBIC-koppling'}`}
                    >
                      {getStatusIcon(dim.status)}
                      {dim.name}
                      <span className="bg-white/30 px-1 rounded">{dim.status}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm text-orange-900 mb-2">
              Koppling mellan IBIC och SHANARRI
            </h4>
            <p className="text-xs text-gray-700 mb-3">
              IBIC använder ICF:s aktivitets- och delaktighetsdomäner (d1-d9) för att strukturera bedömningen.
              Siffrorna visar nuvarande statusnivå för {childProfile?.name || 'vald profil'}.
            </p>
            <div className="flex flex-wrap gap-2">
              {shanarriData.map((dim) => (
                <div key={dim.id} className="flex items-center gap-1.5">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold text-white"
                    style={{ backgroundColor: dim.color }}
                  >
                    {dim.name}
                    <span className="bg-white/30 px-1 rounded">{dim.status}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IBICWheel;
