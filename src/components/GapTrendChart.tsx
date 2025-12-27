/**
 * GapTrendChart Component
 * Visualizes ICF Performance vs Capacity gap trends over time
 * Shows how interventions affect the gap longitudinally
 */

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Activity, Calendar, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { GapTrend, GapTrendPoint, getQualifierColor } from '../types/icf-types';

interface GapTrendChartProps {
  trends: GapTrend[];
  title?: string;
  showInterventions?: boolean;
}

const GapTrendChart: React.FC<GapTrendChartProps> = ({
  trends,
  title = 'Gap-trendanalys över tid',
  showInterventions = true
}) => {
  const [selectedTrend, setSelectedTrend] = useState<GapTrend | null>(trends[0] || null);
  const [hoveredPoint, setHoveredPoint] = useState<GapTrendPoint | null>(null);

  if (trends.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">Ingen trenddata tillgänglig.</p>
      </div>
    );
  }

  // Helper: Get trend icon
  const getTrendIcon = (trend: 'improving' | 'stable' | 'declining') => {
    switch (trend) {
      case 'improving':
        return <TrendingDown className="w-5 h-5 text-green-600" />;
      case 'declining':
        return <TrendingUp className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  // Helper: Get trend color
  const getTrendColor = (trend: 'improving' | 'stable' | 'declining') => {
    switch (trend) {
      case 'improving':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'declining':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Helper: Get trend label
  const getTrendLabel = (trend: 'improving' | 'stable' | 'declining') => {
    switch (trend) {
      case 'improving':
        return 'Förbättras';
      case 'declining':
        return 'Försämras';
      default:
        return 'Stabil';
    }
  };

  // Calculate chart dimensions
  const chartHeight = 200;
  const chartWidth = 100; // percentage
  const maxQualifier = 4;
  const minQualifier = 0;
  const range = maxQualifier - minQualifier;

  // Get Y position for qualifier value (inverted, 0 at top is best)
  const getYPosition = (value: number) => {
    return ((value - minQualifier) / range) * chartHeight;
  };

  // Render the chart for selected trend
  const renderChart = () => {
    if (!selectedTrend || selectedTrend.dataPoints.length === 0) return null;

    const points = selectedTrend.dataPoints;
    const pointSpacing = 100 / (points.length - 1 || 1);

    return (
      <div className="relative" style={{ height: chartHeight + 40 }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-10 w-12 flex flex-col justify-between text-xs text-gray-500">
          <span>0 - Ingen</span>
          <span>1 - Lätt</span>
          <span>2 - Måttlig</span>
          <span>3 - Stor</span>
          <span>4 - Total</span>
        </div>

        {/* Chart area */}
        <div className="ml-14 mr-4 relative" style={{ height: chartHeight }}>
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className="absolute left-0 right-0 border-t border-gray-200"
              style={{ top: getYPosition(level) }}
            />
          ))}

          {/* SVG for lines and points */}
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            {/* Capacity line (dashed) */}
            <path
              d={points.map((point, index) => {
                const x = `${index * pointSpacing}%`;
                const y = getYPosition(point.capacity);
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ').replace(/%/g, '%')}
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeDasharray="5,5"
              style={{ vectorEffect: 'non-scaling-stroke' }}
            />

            {/* Performance line (solid) */}
            <path
              d={points.map((point, index) => {
                const x = `${index * pointSpacing}%`;
                const y = getYPosition(point.performance);
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ').replace(/%/g, '%')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              style={{ vectorEffect: 'non-scaling-stroke' }}
            />
          </svg>

          {/* Data points */}
          {points.map((point, index) => (
            <div
              key={index}
              className="absolute transform -translate-x-1/2"
              style={{ left: `${index * pointSpacing}%` }}
            >
              {/* Capacity point */}
              <div
                className="absolute w-3 h-3 rounded-full bg-gray-400 border-2 border-white shadow cursor-pointer"
                style={{ top: getYPosition(point.capacity) - 6 }}
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
              />

              {/* Performance point */}
              <div
                className="absolute w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow cursor-pointer"
                style={{ top: getYPosition(point.performance) - 8 }}
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
              />

              {/* Gap indicator */}
              <div
                className={`absolute text-xs font-bold px-1 rounded ${
                  point.gap < 0 ? 'bg-green-100 text-green-700' :
                  point.gap > 0 ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-600'
                }`}
                style={{
                  top: (getYPosition(point.performance) + getYPosition(point.capacity)) / 2 - 10,
                  left: 10
                }}
              >
                {point.gap > 0 ? '+' : ''}{point.gap}
              </div>
            </div>
          ))}

          {/* X-axis labels (dates) */}
          <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs text-gray-500">
            {points.map((point, index) => (
              <span
                key={index}
                className="transform -rotate-45 origin-top-left"
                style={{ width: `${pointSpacing}%` }}
              >
                {new Date(point.date).toLocaleDateString('sv-SE', { month: 'short', year: '2-digit' })}
              </span>
            ))}
          </div>
        </div>

        {/* Hover tooltip */}
        {hoveredPoint && (
          <div className="absolute top-0 right-0 bg-white border border-gray-300 rounded-lg p-3 shadow-lg z-10 w-64">
            <p className="font-semibold text-sm mb-2">
              {new Date(hoveredPoint.date).toLocaleDateString('sv-SE')}
            </p>
            <div className="space-y-1 text-sm">
              <p className="flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                Capacity: {hoveredPoint.capacity}
              </p>
              <p className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                Performance: {hoveredPoint.performance}
              </p>
              <p className={`font-medium ${
                hoveredPoint.gap < 0 ? 'text-green-600' :
                hoveredPoint.gap > 0 ? 'text-orange-600' :
                'text-gray-600'
              }`}>
                Gap: {hoveredPoint.gap > 0 ? '+' : ''}{hoveredPoint.gap}
                {hoveredPoint.gap < 0 && ' (Anpassningar fungerar!)'}
                {hoveredPoint.gap > 0 && ' (Barriärer finns)'}
              </p>
            </div>
            {hoveredPoint.activeInterventions.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-1">Aktiva insatser:</p>
                <ul className="text-xs text-gray-600 space-y-0.5">
                  {hoveredPoint.activeInterventions.slice(0, 3).map((int, i) => (
                    <li key={i}>• {int}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          {title}
        </h3>
        <div className="bg-blue-50 border border-blue-200 rounded p-3 flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p>
              Visar hur <strong>Performance</strong> (blå linje) och <strong>Capacity</strong> (grå streckad)
              förändras över tid. Negativt gap = anpassningar fungerar!
            </p>
          </div>
        </div>
      </div>

      {/* Trend selector */}
      {trends.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {trends.map((trend, index) => (
            <button
              key={index}
              onClick={() => setSelectedTrend(trend)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedTrend?.icfCode === trend.icfCode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {trend.icfCode}: {trend.domain}
              {getTrendIcon(trend.trend)}
            </button>
          ))}
        </div>
      )}

      {/* Selected trend info */}
      {selectedTrend && (
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">
              {selectedTrend.icfCode}: {selectedTrend.domain}
            </h4>
            <p className="text-sm text-gray-600">
              {selectedTrend.startDate} → {selectedTrend.endDate}
            </p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getTrendColor(selectedTrend.trend)}`}>
            {getTrendIcon(selectedTrend.trend)}
            <span className="font-medium">{getTrendLabel(selectedTrend.trend)}</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-blue-500 rounded"></div>
          <span className="text-gray-700">Performance (med stöd)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-gray-400 rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #9ca3af 0, #9ca3af 4px, transparent 4px, transparent 8px)' }}></div>
          <span className="text-gray-700">Capacity (utan stöd)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs font-bold">-1</span>
          <span className="text-gray-700">Gap (Performance - Capacity)</span>
        </div>
      </div>

      {/* Chart */}
      <div className="py-4">
        {renderChart()}
      </div>

      {/* Interpretation */}
      {selectedTrend && selectedTrend.interpretation && (
        <div className={`rounded-lg p-4 border ${
          selectedTrend.trend === 'improving'
            ? 'bg-green-50 border-green-200'
            : selectedTrend.trend === 'declining'
            ? 'bg-red-50 border-red-200'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-start gap-2">
            {selectedTrend.trend === 'improving' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : selectedTrend.trend === 'declining' ? (
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-medium text-gray-900 mb-1">Tolkning</p>
              <p className="text-sm text-gray-700">{selectedTrend.interpretation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Interventions timeline */}
      {showInterventions && selectedTrend && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            Insatser över tid
          </h4>
          <div className="space-y-2">
            {selectedTrend.dataPoints.map((point, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-20 text-xs text-gray-500">
                  {new Date(point.date).toLocaleDateString('sv-SE', { month: 'short', year: 'numeric' })}
                </div>
                <div className="flex-1">
                  {point.activeInterventions.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {point.activeInterventions.map((intervention, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                          {intervention}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Inga aktiva insatser</span>
                  )}
                </div>
                <div className={`text-xs font-bold px-2 py-0.5 rounded ${
                  point.gap < 0 ? 'bg-green-100 text-green-700' :
                  point.gap > 0 ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  Gap: {point.gap > 0 ? '+' : ''}{point.gap}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GapTrendChart;
