import React from 'react';
import { Student } from '../types';
import { Users, TrendingUp, AlertTriangle } from 'lucide-react';

interface Props {
  students: Student[];
}

const MultiStudentComparison: React.FC<Props> = ({ students }) => {
  if (!students || students.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 shadow-lg text-center">
        <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Inga elever att jämföra. Lägg till elever för att se jämförelsen.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-8 h-8" />
          Jämförelse av flera elever
        </h2>
        <div className="text-sm text-gray-600">
          {students.length} elev{students.length !== 1 ? 'er' : ''} valda
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map(student => {
          const totalIndicators = Object.values(student.dimensions).flat().length;
          const dimensionCount = Object.keys(student.dimensions).length;

          return (
            <div key={student.id} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {student.profile.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{student.profile.name}</h3>
                  <p className="text-sm text-gray-600">
                    {student.profile.age} år • {student.profile.grade}
                  </p>
                  {student.profile.sipActive && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-semibold">
                      Aktiv SIP
                    </span>
                  )}
                </div>
              </div>

              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold mb-4 ${
                student.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                student.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {student.riskLevel === 'high' && <AlertTriangle className="w-4 h-4" />}
                {student.riskLevel === 'medium' && <TrendingUp className="w-4 h-4" />}
                {student.riskLevel === 'high' ? 'Hög risk' :
                 student.riskLevel === 'medium' ? 'Viss risk' :
                 'Låg risk'}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{totalIndicators}</div>
                  <div className="text-xs text-gray-600">Indikatorer</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{dimensionCount}</div>
                  <div className="text-xs text-gray-600">Dimensioner</div>
                </div>
              </div>

              {student.history && student.history.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Senaste mätning</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {student.history[student.history.length - 1]?.date || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-600">Antal mätningar</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {student.history.length}
                    </span>
                  </div>
                </div>
              )}

              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-sm">
                Visa detaljer
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h3 className="font-bold text-lg mb-4">Sammanfattande statistik</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-3xl font-bold text-red-600">
              {students.filter(s => s.riskLevel === 'high').length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Hög risk</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600">
              {students.filter(s => s.riskLevel === 'medium').length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Viss risk</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">
              {students.filter(s => s.riskLevel === 'low').length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Låg risk</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">
              {students.filter(s => s.profile.sipActive).length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Aktiv SIP</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStudentComparison;
