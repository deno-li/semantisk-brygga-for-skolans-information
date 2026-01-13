import React, { useState } from 'react';
import { SHANARRI_DATA } from '../data/constants';
import { MessageSquare, Send, Sparkles, ArrowRight, Check } from 'lucide-react';

const EMOJI_SCALE = [
  { value: 1, emoji: '😢', label: 'Dåligt', color: 'red' },
  { value: 2, emoji: '😕', label: 'Inte så bra', color: 'orange' },
  { value: 3, emoji: '😐', label: 'Okej', color: 'amber' },
  { value: 4, emoji: '😊', label: 'Bra', color: 'lime' },
  { value: 5, emoji: '🤩', label: 'Jättebra!', color: 'emerald' },
];

const WellbeingSurvey: React.FC = () => {
  const [responses, setResponses] = useState<{ [key: string]: number | null }>({});
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleRating = (dimensionId: string, rating: number) => {
    setResponses({ ...responses, [dimensionId]: rating });
  };

  const handleComment = (dimensionId: string, comment: string) => {
    setComments({ ...comments, [dimensionId]: comment });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const answeredCount = Object.keys(responses).filter(k => responses[k] !== null && responses[k] !== undefined).length;
  const allAnswered = answeredCount === SHANARRI_DATA.length;

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 text-white text-4xl mb-6 shadow-lg">
            ✓
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Tack för dina svar!</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Dina åsikter är viktiga. Dina svar hjälper oss att förstå hur du mår.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Dina svar</h3>
          <div className="grid gap-3">
            {SHANARRI_DATA.map((dimension) => {
              const rating = responses[dimension.id];
              const comment = comments[dimension.id];
              const emojiData = EMOJI_SCALE.find(e => e.value === rating);
              if (!emojiData) return null;

              return (
                <div
                  key={dimension.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-gray-50"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: dimension.color + '20' }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: dimension.color }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{dimension.name}</div>
                    {comment && (
                      <p className="text-sm text-gray-500 mt-0.5 truncate">"{comment}"</p>
                    )}
                  </div>
                  <div className="text-2xl">{emojiData.emoji}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
          <p className="text-sm text-gray-700">
            <strong className="text-blue-700">Vad händer nu?</strong> Dina svar blir en del av ditt välbefinnandehjul.
            Om du vill prata mer om något, prata med din mentor.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 text-white text-3xl mb-4 shadow-lg">
          🎤
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Din röst</h1>
        <p className="text-gray-600">Berätta hur du mår - det finns inga fel svar!</p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {answeredCount} av {SHANARRI_DATA.length} besvarade
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((answeredCount / SHANARRI_DATA.length) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500"
            style={{ width: `${(answeredCount / SHANARRI_DATA.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {SHANARRI_DATA.map((dimension, index) => {
          const currentRating = responses[dimension.id];
          const isAnswered = currentRating !== null && currentRating !== undefined;

          return (
            <div
              key={dimension.id}
              className={`bg-white rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                isAnswered ? 'border-emerald-200' : 'border-gray-200'
              }`}
            >
              {/* Question header */}
              <div
                className="p-4 flex items-center gap-3"
                style={{ backgroundColor: dimension.color + '08' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ backgroundColor: dimension.color + '20' }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: dimension.color }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{dimension.name}</h3>
                  <p className="text-xs text-gray-500">{dimension.notes}</p>
                </div>
                {isAnswered && (
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Check size={14} className="text-emerald-600" />
                  </div>
                )}
              </div>

              {/* Emoji rating */}
              <div className="p-4 pt-2">
                <p className="text-sm text-gray-600 mb-3">Hur mår du?</p>
                <div className="flex justify-between gap-2">
                  {EMOJI_SCALE.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => handleRating(dimension.id, item.value)}
                      className={`flex-1 py-3 rounded-xl transition-all duration-200 ${
                        currentRating === item.value
                          ? 'bg-gradient-to-b from-gray-100 to-gray-50 ring-2 ring-gray-900 scale-105 shadow-md'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-3xl transition-transform ${
                          currentRating === item.value ? 'scale-110' : ''
                        }`}>
                          {item.emoji}
                        </span>
                        <span className={`text-[10px] font-medium ${
                          currentRating === item.value ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {item.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment field - shows when answered */}
              {isAnswered && (
                <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <MessageSquare size={14} />
                    <span>Vill du berätta mer? (frivilligt)</span>
                  </div>
                  <textarea
                    value={comments[dimension.id] || ''}
                    onChange={(e) => handleComment(dimension.id, e.target.value)}
                    placeholder="Skriv här om du vill..."
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    rows={2}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit button */}
      <div className="sticky bottom-4">
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
            allAnswered
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {allAnswered ? (
            <>
              <Sparkles size={20} />
              Skicka mina svar
            </>
          ) : (
            <>
              Svara på alla frågor först
              <span className="text-sm">({SHANARRI_DATA.length - answeredCount} kvar)</span>
            </>
          )}
        </button>
      </div>

      {/* Privacy notice */}
      <div className="text-center pb-4">
        <p className="text-xs text-gray-400">
          🔒 Dina svar är trygga och används bara för att hjälpa dig
        </p>
      </div>
    </div>
  );
};

export default WellbeingSurvey;
