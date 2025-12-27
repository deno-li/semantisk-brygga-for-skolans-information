/**
 * LongitudinalWelfareChart Component
 * Visualizes SHANARRI wellbeing spokes over time
 * Shows trends across multiple measurement points
 */

import React, { useState, useMemo } from 'react';
import {
  Activity, TrendingUp, TrendingDown, Minus, Calendar, Info,
  CheckCircle2, AlertTriangle, BarChart3, LineChart
} from 'lucide-react';
import { WelfareWheelSpokeData, WheelHistoryPoint } from '../types/types';

interface LongitudinalWelfareChartProps {
  welfareWheel: WelfareWheelSpokeData[];
  title?: string;
  showComparison?: boolean;
}

// Spoke color mapping
const SPOKE_COLORS: Record<string, string> = {
  trygg: '#22c55e',     // green
  halsa: '#3b82f6',     // blue
  utvecklas: '#f59e0b', // amber
  larande: '#8b5cf6',   // violet
  hemmet: '#ec4899',    // pink
  relationer: '#14b8a6',// teal
  aktiv: '#f97316',     // orange
  delaktig: '#6366f1'   // indigo
};

// Status color mapping
const STATUS_COLORS: Record<number, { bg: string; text: string; label: string }> = {
  1: { bg: '#fee2e2', text: '#b91c1c', label: 'Kritiskt' },
  2: { bg: '#ffedd5', text: '#c2410c', label: 'Oroande' },
  3: { bg: '#fef3c7', text: '#b45309', label: 'Uppmärksamhet' },
  4: { bg: '#d1fae5', text: '#047857', label: 'Bra' },
  5: { bg: '#dcfce7', text: '#15803d', label: 'Utmärkt' }
};

const LongitudinalWelfareChart: React.FC<LongitudinalWelfareChartProps> = ({
  welfareWheel,
  title = 'Välbefinnandetrend över tid',
  showComparison = true
}) => {
  const [viewMode, setViewMode] = useState<'line' | 'comparison'>('line');
  const [selectedSpokes, setSelectedSpokes] = useState<string[]>(
    welfareWheel.filter(s => s.history && s.history.length > 0).map(s => s.spoke)
  );

  // Get all unique dates across all spokes
  const allDates = useMemo(() => {
    const dateSet = new Set<string>();
    welfareWheel.forEach(spoke => {
      spoke.history?.forEach(point => dateSet.add(point.date));
    });
    return Array.from(dateSet).sort();
  }, [welfareWheel]);

  // Calculate trends for each spoke
  const spokeTrends = useMemo(() => {
    return welfareWheel.map(spoke => {
      if (!spoke.history || spoke.history.length < 2) {
        return { spoke: spoke.spoke, trend: 'stable' as const, change: 0 };
      }

      const sortedHistory = [...spoke.history].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const firstValue = sortedHistory[0].value;
      const lastValue = sortedHistory[sortedHistory.length - 1].value;
      const change = lastValue - firstValue;

      return {
        spoke: spoke.spoke,
        trend: change > 0 ? 'improving' as const : change < 0 ? 'declining' as const : 'stable' as const,
        change
      };
    });
  }, [welfareWheel]);

  // Toggle spoke selection
  const toggleSpoke = (spoke: string) => {
    setSelectedSpokes(prev =>
      prev.includes(spoke)
        ? prev.filter(s => s !== spoke)
        : [...prev, spoke]
    );
  };

  // Chart dimensions
  const chartHeight = 250;
  const chartPadding = { top: 20, right: 20, bottom: 40, left: 40 };

  // Get Y position for status value (inverted - 5 at top, 1 at bottom)
  const getYPosition = (value: number) => {
    const range = 5 - 1; // 5 is best, 1 is worst
    return chartPadding.top + ((5 - value) / range) * (chartHeight - chartPadding.top - chartPadding.bottom);
  };

  // Render line chart
  const renderLineChart = () => {
    if (allDates.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>Ingen historisk data tillgänglig för att visa trender.</p>
        </div>
      );
    }

    const pointSpacing = (100 - 10) / (allDates.length - 1 || 1);

    return (
      <div className="relative" style={{ height: chartHeight }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-10 w-10 flex flex-col justify-between text-xs text-gray-500">
          {[5, 4, 3, 2, 1].map(level => (
            <div key={level} className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: STATUS_COLORS[level].bg }} />
              <span>{level}</span>
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="ml-12 relative h-full">
          {/* Grid lines */}
          {[1, 2, 3, 4, 5].map(level => (
            <div
              key={level}
              className="absolute left-0 right-0 border-t border-gray-200"
              style={{ top: getYPosition(level) }}
            />
          ))}

          {/* SVG for lines */}
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            {/* Lines for each selected spoke */}
            {welfareWheel
              .filter(spoke => selectedSpokes.includes(spoke.spoke) && spoke.history && spoke.history.length > 0)
              .map((spoke) => {
                const sortedHistory = [...(spoke.history || [])].sort(
                  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                );

                return (
                  <g key={spoke.spoke}>
                    {/* Line */}
                    <path
                      d={sortedHistory.map((point, index) => {
                        const dateIndex = allDates.indexOf(point.date);
                        const x = `${5 + dateIndex * pointSpacing}%`;
                        const y = getYPosition(point.value);
                        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ').replace(/%/g, '%')}
                      fill="none"
                      stroke={SPOKE_COLORS[spoke.spoke]}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ vectorEffect: 'non-scaling-stroke' }}
                    />

                    {/* Data points */}
                    {sortedHistory.map((point, index) => {
                      const dateIndex = allDates.indexOf(point.date);
                      return (
                        <circle
                          key={index}
                          cx={`${5 + dateIndex * pointSpacing}%`}
                          cy={getYPosition(point.value)}
                          r="6"
                          fill={SPOKE_COLORS[spoke.spoke]}
                          stroke="white"
                          strokeWidth="2"
                          className="cursor-pointer hover:r-8"
                        >
                          <title>
                            {spoke.name}: {point.value} ({new Date(point.date).toLocaleDateString('sv-SE')})
                          </title>
                        </circle>
                      );
                    })}
                  </g>
                );
              })}
          </svg>

          {/* X-axis labels (dates) */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 transform translate-y-6">
            {allDates.map((date, index) => (
              <span
                key={index}
                className="transform -rotate-45 origin-top-left whitespace-nowrap"
                style={{ marginLeft: `${5 + index * pointSpacing}%` }}
              >
                {new Date(date).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' })}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render comparison view (current vs previous)
  const renderComparisonView = () => {
    return (
      <div className="space-y-3">
        {welfareWheel.map(spoke => {
          const history = spoke.history || [];
          const sortedHistory = [...history].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          const currentValue = spoke.status;
          const previousValue = sortedHistory[0]?.value || currentValue;
          const change = currentValue - previousValue;
          const trendInfo = spokeTrends.find(t => t.spoke === spoke.spoke);

          return (
            <div
              key={spoke.spoke}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              {/* Spoke indicator */}
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: SPOKE_COLORS[spoke.spoke] }}
              />

              {/* Spoke name */}
              <div className="w-32 flex-shrink-0">
                <p className="font-medium text-gray-900 text-sm">{spoke.name}</p>
              </div>

              {/* Previous value */}
              <div className="w-16 text-center">
                <div
                  className="inline-block px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: STATUS_COLORS[previousValue]?.bg || '#f3f4f6',
                    color: STATUS_COLORS[previousValue]?.text || '#374151'
                  }}
                >
                  {previousValue}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Tidigare</p>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0">
                {change > 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : change < 0 ? (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                ) : (
                  <Minus className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {/* Current value */}
              <div className="w-16 text-center">
                <div
                  className="inline-block px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: STATUS_COLORS[currentValue]?.bg || '#f3f4f6',
                    color: STATUS_COLORS[currentValue]?.text || '#374151'
                  }}
                >
                  {currentValue}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Nu</p>
              </div>

              {/* Change indicator */}
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${(currentValue / 5) * 100}%`,
                      backgroundColor: SPOKE_COLORS[spoke.spoke]
                    }}
                  />
                </div>
              </div>

              {/* Trend label */}
              <div className={`text-xs font-medium px-2 py-1 rounded ${
                change > 0 ? 'bg-green-100 text-green-700' :
                change < 0 ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {change > 0 ? `+${change}` : change < 0 ? change : '±0'}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Calculate overall trend
  const overallTrend = useMemo(() => {
    const improving = spokeTrends.filter(t => t.trend === 'improving').length;
    const declining = spokeTrends.filter(t => t.trend === 'declining').length;

    if (improving > declining) return 'improving';
    if (declining > improving) return 'declining';
    return 'stable';
  }, [spokeTrends]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          {title}
        </h3>
        <div className="bg-blue-50 border border-blue-200 rounded p-3 flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p>
              Visar hur välbefinnandeekrarnas status har förändrats över tid.
              Klicka på en eker i legenden för att visa/dölja den.
            </p>
          </div>
        </div>
      </div>

      {/* View mode toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('line')}
            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${
              viewMode === 'line'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <LineChart className="w-4 h-4" />
            Linjediagram
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${
              viewMode === 'comparison'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Jämförelse
          </button>
        </div>

        {/* Overall trend indicator */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
          overallTrend === 'improving' ? 'bg-green-50 border-green-200 text-green-700' :
          overallTrend === 'declining' ? 'bg-red-50 border-red-200 text-red-700' :
          'bg-gray-50 border-gray-200 text-gray-700'
        }`}>
          {overallTrend === 'improving' ? (
            <TrendingUp className="w-4 h-4" />
          ) : overallTrend === 'declining' ? (
            <TrendingDown className="w-4 h-4" />
          ) : (
            <Minus className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {overallTrend === 'improving' ? 'Övergripande förbättring' :
             overallTrend === 'declining' ? 'Övergripande försämring' :
             'Stabil utveckling'}
          </span>
        </div>
      </div>

      {/* Legend / Spoke selector (only for line view) */}
      {viewMode === 'line' && (
        <div className="flex flex-wrap gap-2">
          {welfareWheel.map(spoke => {
            const hasData = spoke.history && spoke.history.length > 0;
            const isSelected = selectedSpokes.includes(spoke.spoke);

            return (
              <button
                key={spoke.spoke}
                onClick={() => hasData && toggleSpoke(spoke.spoke)}
                disabled={!hasData}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  !hasData
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isSelected
                    ? 'text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={isSelected ? { backgroundColor: SPOKE_COLORS[spoke.spoke] } : undefined}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: isSelected ? 'white' : SPOKE_COLORS[spoke.spoke] }}
                />
                {spoke.name}
                {!hasData && <span className="text-xs">(ingen data)</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* Chart */}
      <div className="py-4">
        {viewMode === 'line' ? renderLineChart() : renderComparisonView()}
      </div>

      {/* Trend summary */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Trendsammanfattning
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold text-green-700">
                {spokeTrends.filter(t => t.trend === 'improving').length}
              </span>
            </div>
            <p className="text-sm text-green-700">Förbättras</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Minus className="w-5 h-5 text-gray-600" />
              <span className="text-2xl font-bold text-gray-700">
                {spokeTrends.filter(t => t.trend === 'stable').length}
              </span>
            </div>
            <p className="text-sm text-gray-600">Stabila</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <span className="text-2xl font-bold text-red-700">
                {spokeTrends.filter(t => t.trend === 'declining').length}
              </span>
            </div>
            <p className="text-sm text-red-700">Försämras</p>
          </div>
        </div>
      </div>

      {/* Status legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
        <span className="font-medium">Statusnivåer:</span>
        {[5, 4, 3, 2, 1].map(level => (
          <div key={level} className="flex items-center gap-1">
            <span
              className="w-4 h-4 rounded"
              style={{ backgroundColor: STATUS_COLORS[level].bg }}
            />
            <span>{level} = {STATUS_COLORS[level].label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LongitudinalWelfareChart;
