
import React, { useState, memo } from 'react';
import { ENHANCED_CHILD_PROFILE, LONGITUDINAL_DATA, TRANSITIONS, CHILD_PROFILE } from '../data/constants';
import { Calendar, TrendingUp, Shield, ShieldAlert, CheckCircle2, Clock, ArrowRight, Users, MapPin } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, AreaChart } from 'recharts';

interface LifeCourseViewProps {
  selectedProfileId?: string;
}

interface ChartDataEntry {
  age: number;
  date: string;
  phase: string;
  supportLevel: number;
  [key: string]: string | number;
}

const LifeCourseView: React.FC<LifeCourseViewProps> = () => {
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);

  // Memoize chart data transformation for better performance
  const chartData = useMemo(() => {
    return LONGITUDINAL_DATA.map(dataPoint => {
      const entry: ChartDataEntry = {
        age: dataPoint.age,
        date: dataPoint.date,
        phase: dataPoint.phase === 'early-childhood' ? 'BVC/MVC' :
               dataPoint.phase === 'preschool' ? 'Förskola' :
               dataPoint.phase === 'elementary-school' ? 'Grundskola' :
               dataPoint.phase === 'high-school' ? 'Gymnasiet' :
               'Ung vuxen',
        supportLevel: dataPoint.supportLevel === 'universal' ? 1 :
                      dataPoint.supportLevel === 'early-attention' ? 2 :
                      dataPoint.supportLevel === 'enhanced-support' ? 3 : 4,
      };

      // Add all dimensions
      Object.keys(dataPoint.dimensions).forEach(dimId => {
        entry[dimId] = dataPoint.dimensions[dimId].value;
      });

      return entry;
    });
  }, []);

  // Memoize dimension names extraction
  const dimensionNames = useMemo(() => {
    return LONGITUDINAL_DATA[0] ? Object.keys(LONGITUDINAL_DATA[0].dimensions) : [];
  }, []);

  // Color mapping for dimensions
  const dimensionColors: Record<string, string> = {
    'safe': '#005595',
    'healthy': '#378056',
    'achieving': '#C12143',
    'nurtured': '#B00020',
    'active': '#E87C00',
    'respected': '#6D8F13',
    'responsible': '#00838F',
    'included': '#6A2A5B'
  };

  // Get dimension label
  const getDimensionLabel = (dimId: string): string => {
    const labels: Record<string, string> = {
      'safe': 'Trygghet',
      'healthy': 'Må bra',
      'achieving': 'Utvecklas',
      'nurtured': 'Omsorg',
      'active': 'Fritid',
      'respected': 'Respekteras',
      'responsible': 'Ansvar',
      'included': 'Tillhörighet'
    };
    return labels[dimId] || dimId;
  };

  // Phase timeline component
  const PhaseTimeline = () => {
    const phases = [
      { id: 'early-childhood', label: 'BVC/MVC', age: '0-5 år', color: '#B0D4F1' },
      { id: 'preschool', label: 'Förskola', age: '1-6 år', color: '#8FBEE8' },
      { id: 'elementary-school', label: 'Grundskola', age: '7-15 år', color: '#005595' },
      { id: 'high-school', label: 'Gymnasiet', age: '16-19 år', color: '#003D6B' },
      { id: 'young-adult', label: 'Ung vuxen', age: '20-25 år', color: '#002A4B' }
    ];

    const currentPhaseIndex = phases.findIndex(p => p.id === ENHANCED_CHILD_PROFILE.currentPhase);

    return (
      <div className="relative">
        <div className="flex items-center justify-between">
          {phases.map((phase, index) => {
            const isCompleted = index < currentPhaseIndex;
            const isCurrent = index === currentPhaseIndex;
            const isUpcoming = index > currentPhaseIndex;

            return (
              <div key={phase.id} className="flex-1 flex flex-col items-center relative">
                {/* Connector line */}
                {index < phases.length - 1 && (
                  <div className={`absolute top-6 left-1/2 w-full h-0.5 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} style={{ zIndex: 0 }}></div>
                )}

                {/* Phase circle */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all relative z-10 ${
                    isCurrent ? `bg-white border-[${phase.color}] shadow-lg scale-110` :
                    isCompleted ? 'bg-green-500 border-green-100 text-white' :
                    'bg-white border-gray-300 text-gray-400'
                  }`}
                  style={isCurrent ? { borderColor: phase.color } : {}}
                >
                  {isCompleted ? <CheckCircle2 size={24} /> :
                   isCurrent ? <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: phase.color }}></div> :
                   <Clock size={20} />}
                </div>

                {/* Phase label */}
                <div className="mt-3 text-center">
                  <div className={`text-sm font-bold ${isCurrent ? 'text-[#005595]' : 'text-gray-700'}`}>
                    {phase.label}
                  </div>
                  <div className="text-xs text-gray-500">{phase.age}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Support level badge
  const getSupportLevelBadge = (level: number) => {
    const levels = [
      { label: 'Grön - Universell', color: 'bg-green-100 text-green-700 border-green-200' },
      { label: 'Gul - Tidig uppmärksamhet', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      { label: 'Orange - Förstärkt stöd', color: 'bg-orange-100 text-orange-700 border-orange-200' },
      { label: 'Röd - Intensivt stöd', color: 'bg-red-100 text-red-700 border-red-200' }
    ];
    return levels[level - 1] || levels[0];
  };

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-[#1F1F1F] mb-2 flex items-center gap-2">
          <TrendingUp size={28} className="text-[#005595]" />
          Livsloppsperspektiv
        </h2>
        <p className="text-gray-600">
          {CHILD_PROFILE.name}s välbefinnande och utveckling genom hela livsloppet - från BVC till nutid
        </p>
      </div>

      {/* Phase Timeline */}
      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-[#1F1F1F] mb-6">Livsfaser</h3>
        <PhaseTimeline />
      </div>

      {/* Longitudinal Data Chart */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#1F1F1F] mb-2">Välbefinnande över tid</h3>
            <p className="text-sm text-gray-600">
              Klicka på en dimension i legenden för att fokusera
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Datapunkter</div>
            <div className="text-2xl font-bold text-[#005595]">{LONGITUDINAL_DATA.length}</div>
          </div>
        </div>

        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="age"
                label={{ value: 'Ålder (år)', position: 'insideBottom', offset: -5 }}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis
                domain={[0, 5]}
                ticks={[1, 2, 3, 4, 5]}
                label={{ value: 'Nivå (1-5)', angle: -90, position: 'insideLeft' }}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Legend
                onClick={(e) => setSelectedDimension(selectedDimension === e.dataKey ? null : e.dataKey as string)}
                wrapperStyle={{ cursor: 'pointer' }}
              />

              {dimensionNames.map(dimId => (
                <Line
                  key={dimId}
                  type="monotone"
                  dataKey={dimId}
                  name={getDimensionLabel(dimId)}
                  stroke={dimensionColors[dimId] || '#999'}
                  strokeWidth={selectedDimension === null || selectedDimension === dimId ? 3 : 1}
                  opacity={selectedDimension === null || selectedDimension === dimId ? 1 : 0.2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Timeline with Risk/Protective Factors */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-[#1F1F1F] mb-6">Detaljerad tidslinje</h3>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

          <div className="space-y-8">
            {LONGITUDINAL_DATA.map((dataPoint, index) => {
              const supportBadge = getSupportLevelBadge(
                dataPoint.supportLevel === 'universal' ? 1 :
                dataPoint.supportLevel === 'early-attention' ? 2 :
                dataPoint.supportLevel === 'enhanced-support' ? 3 : 4
              );

              return (
                <div key={index} className="relative pl-20">
                  {/* Timeline dot */}
                  <div className="absolute left-5 w-6 h-6 rounded-full bg-[#005595] border-4 border-white shadow-md flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>

                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-bold text-[#1F1F1F]">{dataPoint.age} år</div>
                        <div className="text-sm text-gray-600">{dataPoint.date}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs px-3 py-1 rounded-full font-bold border ${supportBadge.color}`}>
                          {supportBadge.label}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          <MapPin size={12} className="inline" /> {dataPoint.sector}
                        </div>
                      </div>
                    </div>

                    {/* Risk & Protective Factors counts */}
                    <div className="flex gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <ShieldAlert size={16} className="text-red-500" />
                        <span className="text-gray-700">
                          <strong>{dataPoint.riskFactors.length}</strong> riskfaktorer
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Shield size={16} className="text-green-500" />
                        <span className="text-gray-700">
                          <strong>{dataPoint.protectiveFactors.length}</strong> skyddsfaktorer
                        </span>
                      </div>
                    </div>

                    {/* Dimension values mini-grid */}
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(dataPoint.dimensions).map(([dimId, dimData]) => (
                        <div key={dimId} className="bg-white rounded px-2 py-1 border border-gray-200">
                          <div className="text-xs text-gray-600">{getDimensionLabel(dimId)}</div>
                          <div className={`text-sm font-bold ${
                            dimData.value >= 4 ? 'text-green-600' :
                            dimData.value >= 3 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {dimData.value}/5
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Transitions */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-[#1F1F1F] mb-6 flex items-center gap-2">
          <ArrowRight size={24} className="text-[#005595]" />
          Övergångar mellan livsfaser
        </h3>

        <div className="space-y-4">
          {TRANSITIONS.map((transition) => {
            const isCompleted = transition.status === 'completed';
            const isInProgress = transition.status === 'in-progress';
            const isPlanned = transition.status === 'planned';

            return (
              <div
                key={transition.id}
                className={`p-4 rounded-lg border-2 ${
                  isCompleted ? 'bg-green-50 border-green-200' :
                  isInProgress ? 'bg-blue-50 border-blue-200' :
                  'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {isCompleted && <CheckCircle2 size={20} className="text-green-600" />}
                      {isInProgress && <Clock size={20} className="text-blue-600 animate-pulse" />}
                      {isPlanned && <Calendar size={20} className="text-gray-500" />}
                      <h4 className="font-bold text-[#1F1F1F]">
                        {transition.fromSector} → {transition.toSector}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Planerad: {transition.plannedDate}
                      {transition.completedDate && ` | Genomförd: ${transition.completedDate}`}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                    isCompleted ? 'bg-green-100 text-green-700' :
                    isInProgress ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {isCompleted ? 'Genomförd' : isInProgress ? 'Pågår' : 'Planerad'}
                  </span>
                </div>

                {transition.transitionMeeting && (
                  <div className="bg-white rounded p-3 border border-gray-200 mt-3">
                    <div className="text-xs font-bold text-gray-700 mb-2">Överlämningsmöte:</div>
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Datum:</strong> {transition.transitionMeeting.date}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Deltagare:</strong> {transition.transitionMeeting.participants.join(', ')}
                    </div>
                    <div className="text-xs text-gray-600 italic">
                      "{transition.transitionMeeting.notes}"
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>Information delad: {transition.informationShared ? 'Ja' : 'Nej'}</span>
                  </div>
                  {transition.followUpDate && (
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>Uppföljning: {transition.followUpDate}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(LifeCourseView);
