import React from 'react';
import { BBIC_TRIANGLE, SHANARRI_DATA } from '../constants';
import { BBICTriangleArea } from '../types';

interface BBICTriangleProps {
  selectedProfileId?: string;
}

const BBICTriangle: React.FC<BBICTriangleProps> = ({ selectedProfileId }) => {
  // Get SHANARRI dimensions by ID for linking
  const getShanarriByIds = (ids: string[]) => {
    return SHANARRI_DATA.filter(dim => ids.includes(dim.id));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1F1F1F] mb-2">
          BBIC - Barns Behov i Centrum
        </h2>
        <p className="text-sm text-gray-600">
          Strukturerad bedömning av barns behov enligt Socialstyrelsen
        </p>
      </div>

      {/* Triangle Visualization */}
      <div className="relative w-full max-w-4xl mx-auto">
        {/* SVG Triangle */}
        <div className="relative w-full" style={{ paddingBottom: '75%' }}>
          <svg
            viewBox="0 0 800 600"
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Triangle Shape */}
            <defs>
              <linearGradient id="childDevGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#4CAF50', stopOpacity: 0.2 }} />
                <stop offset="100%" style={{ stopColor: '#4CAF50', stopOpacity: 0.4 }} />
              </linearGradient>
              <linearGradient id="parentingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#2196F3', stopOpacity: 0.2 }} />
                <stop offset="100%" style={{ stopColor: '#2196F3', stopOpacity: 0.4 }} />
              </linearGradient>
              <linearGradient id="familyEnvGradient" x1="0%" y1="100%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FF9800', stopOpacity: 0.2 }} />
                <stop offset="100%" style={{ stopColor: '#FF9800', stopOpacity: 0.4 }} />
              </linearGradient>
            </defs>

            {/* Main Triangle Outline */}
            <path
              d="M 400 50 L 700 550 L 100 550 Z"
              fill="none"
              stroke="#1F1F1F"
              strokeWidth="3"
            />

            {/* Left Side - Barnets utveckling (Child Development) */}
            <path
              d="M 400 50 L 100 550 L 400 350 Z"
              fill="url(#childDevGradient)"
              stroke="#4CAF50"
              strokeWidth="2"
              opacity="0.8"
            />

            {/* Right Side - Föräldrarnas förmåga (Parenting) */}
            <path
              d="M 400 50 L 700 550 L 400 350 Z"
              fill="url(#parentingGradient)"
              stroke="#2196F3"
              strokeWidth="2"
              opacity="0.8"
            />

            {/* Bottom - Familj och miljö (Family & Environment) */}
            <path
              d="M 100 550 L 700 550 L 400 350 Z"
              fill="url(#familyEnvGradient)"
              stroke="#FF9800"
              strokeWidth="2"
              opacity="0.8"
            />

            {/* Center Circle */}
            <circle cx="400" cy="300" r="80" fill="white" stroke="#1F1F1F" strokeWidth="3" />
            <text
              x="400"
              y="290"
              textAnchor="middle"
              fontSize="18"
              fontWeight="bold"
              fill="#1F1F1F"
            >
              BARNET
            </text>
            <text
              x="400"
              y="315"
              textAnchor="middle"
              fontSize="14"
              fill="#666"
            >
              I CENTRUM
            </text>

            {/* Labels for each section */}
            {/* Top Label - Barnets utveckling */}
            <text
              x="250"
              y="220"
              textAnchor="middle"
              fontSize="20"
              fontWeight="bold"
              fill="#4CAF50"
            >
              Barnets utveckling
            </text>

            {/* Right Label - Föräldrarnas förmåga */}
            <text
              x="550"
              y="220"
              textAnchor="middle"
              fontSize="20"
              fontWeight="bold"
              fill="#2196F3"
            >
              Föräldrarnas förmåga
            </text>

            {/* Bottom Label - Familj och miljö */}
            <text
              x="400"
              y="500"
              textAnchor="middle"
              fontSize="20"
              fontWeight="bold"
              fill="#FF9800"
            >
              Familj och miljö
            </text>
          </svg>
        </div>

        {/* Details below triangle */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {BBIC_TRIANGLE.map((area) => (
            <div key={area.id} className="space-y-4">
              <div
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: `${area.color}15`,
                  borderLeft: `4px solid ${area.color}`
                }}
              >
                <h3 className="font-bold text-lg mb-3" style={{ color: area.color }}>
                  {area.title}
                </h3>

                <div className="space-y-3">
                  {area.subAreas.map((subArea) => {
                    const linkedDimensions = getShanarriByIds(subArea.linkedShanarri);

                    return (
                      <div key={subArea.id} className="bg-white p-3 rounded border border-gray-200">
                        <h4 className="font-semibold text-sm text-[#1F1F1F] mb-1">
                          {subArea.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">
                          {subArea.description}
                        </p>

                        {/* Show linked SHANARRI dimensions */}
                        {linkedDimensions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {linkedDimensions.map((dim) => (
                              <span
                                key={dim.id}
                                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold text-white"
                                style={{ backgroundColor: dim.color }}
                                title={`SHANARRI: ${dim.name}`}
                              >
                                {dim.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-sm text-[#1F1F1F] mb-3">
          Koppling mellan BBIC och SHANARRI
        </h4>
        <p className="text-xs text-gray-600 mb-3">
          De färgade SHANARRI-märkena visar vilka välbefinnandedimensioner som kopplas till varje BBIC-område.
          Detta skapar en semantisk brygga mellan olika bedömningsramverk.
        </p>
        <div className="flex flex-wrap gap-2">
          {SHANARRI_DATA.map((dim) => (
            <div key={dim.id} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: dim.color }}
              ></span>
              <span className="text-xs text-gray-700">{dim.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BBICTriangle;
