import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  RotateCcw,
  Info,
  Sparkles
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
interface TimePoint {
  date: string;
  label: string;
  spokeValues: Record<string, number>;
  event?: string;
  eventType?: 'positive' | 'negative' | 'neutral';
}

interface WheelTimelineProps {
  timePoints: TimePoint[];
  title?: string;
  childName?: string;
}

// ============================================
// SPOKE CONFIGURATION
// ============================================
const SPOKES = [
  { id: 'safe', name: 'Trygg', color: '#005595' },
  { id: 'healthy', name: 'Må bra', color: '#378056' },
  { id: 'achieving', name: 'Utvecklas', color: '#C12143' },
  { id: 'nurtured', name: 'Omvårdad', color: '#B00020' },
  { id: 'active', name: 'Aktiv', color: '#E87C00' },
  { id: 'respected', name: 'Respekterad', color: '#9333EA' },
  { id: 'responsible', name: 'Ansvarsfull', color: '#0284C7' },
  { id: 'included', name: 'Delaktig', color: '#0D9488' }
];

// ============================================
// DEMO DATA
// ============================================
const DEMO_TIMELINE: TimePoint[] = [
  {
    date: '2024-01',
    label: 'Januari 2024',
    spokeValues: { safe: 3, healthy: 3, achieving: 2, nurtured: 4, active: 2, respected: 3, responsible: 2, included: 3 },
    event: 'Första bedömningen',
    eventType: 'neutral'
  },
  {
    date: '2024-02',
    label: 'Februari 2024',
    spokeValues: { safe: 3, healthy: 3, achieving: 3, nurtured: 4, active: 3, respected: 3, responsible: 3, included: 3 },
    event: 'Börjar på fritids',
    eventType: 'positive'
  },
  {
    date: '2024-03',
    label: 'Mars 2024',
    spokeValues: { safe: 4, healthy: 4, achieving: 3, nurtured: 4, active: 4, respected: 4, responsible: 3, included: 4 },
    event: 'Stor framgång i skolan',
    eventType: 'positive'
  },
  {
    date: '2024-04',
    label: 'April 2024',
    spokeValues: { safe: 4, healthy: 3, achieving: 3, nurtured: 4, active: 4, respected: 4, responsible: 4, included: 4 }
  },
  {
    date: '2024-05',
    label: 'Maj 2024',
    spokeValues: { safe: 3, healthy: 3, achieving: 2, nurtured: 3, active: 3, respected: 3, responsible: 3, included: 3 },
    event: 'Utmanande period',
    eventType: 'negative'
  },
  {
    date: '2024-06',
    label: 'Juni 2024',
    spokeValues: { safe: 4, healthy: 4, achieving: 3, nurtured: 4, active: 5, respected: 4, responsible: 4, included: 4 },
    event: 'Sommarlov börjar!',
    eventType: 'positive'
  },
  {
    date: '2024-08',
    label: 'Augusti 2024',
    spokeValues: { safe: 4, healthy: 4, achieving: 4, nurtured: 5, active: 4, respected: 4, responsible: 4, included: 5 },
    event: 'Ny termin, nya kompisar',
    eventType: 'positive'
  },
  {
    date: '2024-09',
    label: 'September 2024',
    spokeValues: { safe: 5, healthy: 4, achieving: 4, nurtured: 5, active: 4, respected: 5, responsible: 4, included: 5 },
    event: 'Stabilisering',
    eventType: 'neutral'
  },
  {
    date: '2024-10',
    label: 'Oktober 2024',
    spokeValues: { safe: 5, healthy: 5, achieving: 4, nurtured: 5, active: 5, respected: 5, responsible: 5, included: 5 },
    event: 'Alla områden förbättrade!',
    eventType: 'positive'
  }
];

// ============================================
// WHEEL TIMELINE ANIMATION COMPONENT
// ============================================
export const WheelTimelineAnimation: React.FC<WheelTimelineProps> = ({
  timePoints = DEMO_TIMELINE,
  title = 'Välbefinnandeutveckling',
  childName = 'Barnet'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const currentPoint = timePoints[currentIndex];
  const previousPoint = currentIndex > 0 ? timePoints[currentIndex - 1] : null;

  // Initialize animated values
  useEffect(() => {
    if (currentPoint) {
      setAnimatedValues(currentPoint.spokeValues);
    }
  }, []);

  // Animate value changes
  useEffect(() => {
    if (!currentPoint) return;

    const targetValues = currentPoint.spokeValues;
    const startValues = { ...animatedValues };
    const duration = 800 / playbackSpeed;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out-cubic)
      const eased = 1 - Math.pow(1 - progress, 3);

      const newValues: Record<string, number> = {};
      SPOKES.forEach(spoke => {
        const start = startValues[spoke.id] || 0;
        const target = targetValues[spoke.id] || 0;
        newValues[spoke.id] = start + (target - start) * eased;
      });

      setAnimatedValues(newValues);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentIndex, playbackSpeed]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= timePoints.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, timePoints.length, playbackSpeed]);

  // Calculate changes from previous point
  const changes = useMemo(() => {
    if (!previousPoint || !currentPoint) return {};

    const result: Record<string, number> = {};
    SPOKES.forEach(spoke => {
      const prev = previousPoint.spokeValues[spoke.id] || 0;
      const curr = currentPoint.spokeValues[spoke.id] || 0;
      result[spoke.id] = curr - prev;
    });
    return result;
  }, [previousPoint, currentPoint]);

  // Calculate overall statistics
  const stats = useMemo(() => {
    if (!currentPoint) return { average: 0, improved: 0, declined: 0, stable: 0 };

    const values = Object.values(currentPoint.spokeValues);
    const average = values.reduce((a, b) => a + b, 0) / values.length;

    let improved = 0, declined = 0, stable = 0;
    if (previousPoint) {
      SPOKES.forEach(spoke => {
        const change = changes[spoke.id] || 0;
        if (change > 0) improved++;
        else if (change < 0) declined++;
        else stable++;
      });
    }

    return { average, improved, declined, stable };
  }, [currentPoint, previousPoint, changes]);

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
    setIsPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(timePoints.length - 1, prev + 1));
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  // SVG Wheel rendering
  const renderWheel = () => {
    const size = isFullscreen ? 400 : 280;
    const center = size / 2;
    const maxRadius = size / 2 - 40;
    const innerRadius = 40;
    const segmentAngle = (2 * Math.PI) / SPOKES.length;

    return (
      <svg width={size} height={size} className="mx-auto">
        {/* Background circles */}
        {[1, 2, 3, 4, 5].map(level => (
          <circle
            key={level}
            cx={center}
            cy={center}
            r={innerRadius + ((maxRadius - innerRadius) * level) / 5}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
        ))}

        {/* Spoke lines */}
        {SPOKES.map((spoke, i) => {
          const angle = i * segmentAngle - Math.PI / 2;
          const x2 = center + maxRadius * Math.cos(angle);
          const y2 = center + maxRadius * Math.sin(angle);

          return (
            <line
              key={spoke.id}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}

        {/* Filled area */}
        <path
          d={SPOKES.map((spoke, i) => {
            const angle = i * segmentAngle - Math.PI / 2;
            const value = animatedValues[spoke.id] || 0;
            const radius = innerRadius + ((maxRadius - innerRadius) * value) / 5;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ') + ' Z'}
          fill="url(#wheelGradient)"
          stroke="url(#wheelStroke)"
          strokeWidth="3"
          opacity="0.8"
          className="transition-all duration-300"
        />

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="wheelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#A855F7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="wheelStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>

        {/* Spoke points with animations */}
        {SPOKES.map((spoke, i) => {
          const angle = i * segmentAngle - Math.PI / 2;
          const value = animatedValues[spoke.id] || 0;
          const radius = innerRadius + ((maxRadius - innerRadius) * value) / 5;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          const change = changes[spoke.id] || 0;

          return (
            <g key={spoke.id}>
              {/* Point */}
              <circle
                cx={x}
                cy={y}
                r={isFullscreen ? 10 : 8}
                fill={spoke.color}
                stroke="white"
                strokeWidth="2"
                className="transition-all duration-300 drop-shadow-md"
              />

              {/* Change indicator */}
              {change !== 0 && (
                <g transform={`translate(${x + 12}, ${y - 12})`}>
                  <circle
                    r="10"
                    fill={change > 0 ? '#10B981' : '#EF4444'}
                    className="animate-pulse"
                  />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {change > 0 ? '+' : ''}{change}
                  </text>
                </g>
              )}

              {/* Labels */}
              <text
                x={center + (maxRadius + 25) * Math.cos(angle)}
                y={center + (maxRadius + 25) * Math.sin(angle)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={isFullscreen ? "12" : "10"}
                fill="#374151"
                fontWeight="500"
              >
                {spoke.name}
              </text>
            </g>
          );
        })}

        {/* Center label */}
        <text
          x={center}
          y={center - 8}
          textAnchor="middle"
          fontSize={isFullscreen ? "14" : "12"}
          fontWeight="bold"
          fill="#1F2937"
        >
          {stats.average.toFixed(1)}
        </text>
        <text
          x={center}
          y={center + 8}
          textAnchor="middle"
          fontSize={isFullscreen ? "10" : "8"}
          fill="#6B7280"
        >
          medel
        </text>
      </svg>
    );
  };

  // Timeline rendering
  const renderTimeline = () => (
    <div className="relative mt-6">
      {/* Timeline track */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / timePoints.length) * 100}%` }}
        />
      </div>

      {/* Timeline points */}
      <div className="flex justify-between mt-2">
        {timePoints.map((point, index) => {
          const isActive = index === currentIndex;
          const isPast = index < currentIndex;

          return (
            <button
              key={point.date}
              onClick={() => {
                setCurrentIndex(index);
                setIsPlaying(false);
              }}
              className={`relative group flex flex-col items-center transition-all ${
                isActive ? 'scale-110' : 'hover:scale-105'
              }`}
            >
              {/* Point */}
              <div
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  isActive
                    ? 'bg-indigo-500 border-indigo-600 ring-4 ring-indigo-200'
                    : isPast
                    ? 'bg-indigo-400 border-indigo-500'
                    : 'bg-gray-300 border-gray-400'
                }`}
              />

              {/* Event indicator */}
              {point.event && (
                <div className={`absolute -top-6 w-3 h-3 rounded-full ${
                  point.eventType === 'positive' ? 'bg-emerald-400' :
                  point.eventType === 'negative' ? 'bg-red-400' :
                  'bg-blue-400'
                }`} />
              )}

              {/* Date label */}
              <span className={`text-xs mt-1 ${
                isActive ? 'text-indigo-600 font-semibold' : 'text-gray-500'
              }`}>
                {point.date.split('-')[1]}/{point.date.split('-')[0].slice(2)}
              </span>

              {/* Tooltip */}
              <div className={`absolute -top-16 left-1/2 -translate-x-1/2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                point.event ? '-top-20' : '-top-12'
              }`}>
                {point.label}
                {point.event && (
                  <div className={`mt-1 ${
                    point.eventType === 'positive' ? 'text-emerald-400' :
                    point.eventType === 'negative' ? 'text-red-400' :
                    'text-blue-400'
                  }`}>
                    {point.event}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  // Statistics panel
  const renderStats = () => (
    <div className="grid grid-cols-4 gap-3 mt-4">
      <div className="bg-white rounded-xl p-3 text-center border border-gray-200">
        <div className="text-2xl font-bold text-indigo-600">{stats.average.toFixed(1)}</div>
        <div className="text-xs text-gray-500">Medelvärde</div>
      </div>
      <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-200">
        <div className="flex items-center justify-center gap-1">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className="text-2xl font-bold text-emerald-600">{stats.improved}</span>
        </div>
        <div className="text-xs text-emerald-700">Förbättrade</div>
      </div>
      <div className="bg-red-50 rounded-xl p-3 text-center border border-red-200">
        <div className="flex items-center justify-center gap-1">
          <TrendingDown className="w-4 h-4 text-red-500" />
          <span className="text-2xl font-bold text-red-600">{stats.declined}</span>
        </div>
        <div className="text-xs text-red-700">Försämrade</div>
      </div>
      <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-200">
        <div className="flex items-center justify-center gap-1">
          <Minus className="w-4 h-4 text-gray-500" />
          <span className="text-2xl font-bold text-gray-600">{stats.stable}</span>
        </div>
        <div className="text-xs text-gray-700">Stabila</div>
      </div>
    </div>
  );

  // Spoke detail list
  const renderSpokeDetails = () => (
    <div className="mt-4 space-y-2">
      {SPOKES.map(spoke => {
        const value = animatedValues[spoke.id] || 0;
        const change = changes[spoke.id] || 0;

        return (
          <div
            key={spoke.id}
            className="flex items-center gap-3 p-2 rounded-lg bg-white border border-gray-100"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: spoke.color }}
            />
            <span className="flex-1 text-sm font-medium text-gray-700">{spoke.name}</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(value / 5) * 100}%`,
                    backgroundColor: spoke.color
                  }}
                />
              </div>
              <span className="w-8 text-right text-sm font-bold text-gray-900">
                {value.toFixed(1)}
              </span>
              {change !== 0 && (
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                  change > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {change > 0 ? '+' : ''}{change}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl shadow-xl overflow-hidden ${
        isFullscreen ? 'fixed inset-4 z-50' : ''
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/50 bg-white/30 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-600">{childName}s utveckling över tid</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-white/50 hover:bg-white/80 transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5 text-gray-600" />
              ) : (
                <Maximize2 className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Current date and event */}
        {currentPoint && (
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">{currentPoint.label}</span>
            </div>
            {currentPoint.event && (
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                currentPoint.eventType === 'positive' ? 'bg-emerald-100 text-emerald-700' :
                currentPoint.eventType === 'negative' ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                <Info className="w-4 h-4" />
                {currentPoint.event}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className={`p-6 ${isFullscreen ? 'grid grid-cols-2 gap-8' : ''}`}>
        {/* Wheel */}
        <div className="flex flex-col items-center">
          {renderWheel()}
          {renderStats()}
        </div>

        {/* Details (shown in fullscreen or below wheel) */}
        <div className={isFullscreen ? '' : 'mt-6'}>
          {renderSpokeDetails()}
        </div>
      </div>

      {/* Timeline */}
      <div className="px-6 pb-2">
        {renderTimeline()}
      </div>

      {/* Playback controls */}
      <div className="p-6 bg-white/30 backdrop-blur border-t border-white/50">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-white hover:bg-gray-50 transition-colors shadow-sm"
            title="Börja om"
          >
            <RotateCcw className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="p-2 rounded-xl bg-white hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <SkipBack className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 transition-opacity shadow-lg"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === timePoints.length - 1}
            className="p-2 rounded-xl bg-white hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <SkipForward className="w-5 h-5 text-gray-600" />
          </button>

          {/* Speed control */}
          <div className="flex items-center gap-2 ml-4 px-3 py-2 bg-white rounded-xl shadow-sm">
            <Clock className="w-4 h-4 text-gray-500" />
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="text-sm text-gray-700 bg-transparent border-none focus:outline-none"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
            </select>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="text-center mt-4 text-sm text-gray-500">
          {currentIndex + 1} av {timePoints.length} tidpunkter
        </div>
      </div>
    </div>
  );
};

export default WheelTimelineAnimation;
