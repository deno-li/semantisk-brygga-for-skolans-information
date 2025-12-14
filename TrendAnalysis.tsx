import React from 'react';
import { Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Student } from '../types';
import { TrendingUp, Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  student: Student;
}

const TrendAnalysis: React.FC<Props> = ({ student }) => {
  if (!student.history || student.history.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-lg text-center">
        <Activity className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Ingen historisk data tillgänglig för trendanalys.</p>
        <p className="text-sm text-gray-500 mt-2">Lägg till fler mätningar för att se utvecklingen över tid.</p>
      </div>
    );
  }

  // Calculate average scores for line chart
  const averageScores = student.history.map(h => {
    if (!h.scores || h.scores.length === 0) return 0;
    return h.scores.reduce((a, b) => a + b, 0) / h.scores.length;
  });

  const lineData = {
    labels: student.history.map(h => h.date),
    datasets: [{
      label: `${student.profile.name} - Genomsnittligt välbefinnande`,
      data: averageScores,
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 6,
      pointHoverRadius: 8,
      pointBackgroundColor: 'rgb(59, 130, 246)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    }]
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Utveckling över tid',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Poäng: ${context.parsed.y.toFixed(1)}/5`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1
        },
        title: {
          display: true,
          text: 'Välbefinnande (1-5)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Datum'
        }
      }
    }
  };

  // Get the latest scores for radar chart
  const latestHistory = student.history[student.history.length - 1];
  const previousHistory = student.history.length > 1 ? student.history[student.history.length - 2] : null;

  const radarData = {
    labels: ['Trygghet', 'Omvårdnad', 'Hälsa', 'Aktivitet', 'Inkludering', 'Ansvar', 'Respekt', 'Utveckling'],
    datasets: [
      {
        label: 'Nuvarande',
        data: latestHistory?.scores || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
      },
      ...(previousHistory ? [{
        label: 'Tidigare',
        data: previousHistory.scores || [],
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        pointBackgroundColor: 'rgb(156, 163, 175)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(156, 163, 175)',
      }] : [])
    ]
  };

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Välbefinnandehjul - Jämförelse',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  // Calculate trend
  const trend = averageScores.length >= 2
    ? averageScores[averageScores.length - 1] - averageScores[averageScores.length - 2]
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="w-8 h-8" />
          Trendanalys - {student.profile.name}
        </h2>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          trend > 0 ? 'bg-green-100 text-green-800' :
          trend < 0 ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          <span className="font-semibold">
            {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'}
            {Math.abs(trend).toFixed(2)} poäng
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Nuvarande genomsnitt</div>
          <div className="text-3xl font-bold text-blue-600">
            {averageScores[averageScores.length - 1]?.toFixed(1) || 'N/A'}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Antal mätningar</div>
          <div className="text-3xl font-bold text-purple-600">
            {student.history.length}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Högsta poäng</div>
          <div className="text-3xl font-bold text-green-600">
            {Math.max(...averageScores).toFixed(1)}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <Line data={lineData} options={lineOptions} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="max-w-2xl mx-auto">
          <Radar data={radarData} options={radarOptions} />
        </div>
      </div>

      {latestHistory?.notes && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Senaste anteckning:</strong> {latestHistory.notes}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendAnalysis;
