import React, { useState } from 'react';
import { SHANARRI_DATA } from './constants';
import { MessageSquare, Send, Star, ThumbsUp, ThumbsDown, Meh } from 'lucide-react';

const WellbeingSurvey: React.FC = () => {
  const [responses, setResponses] = useState<{ [key: string]: number | null }>({});
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const handleRating = (dimensionId: string, rating: number) => {
    setResponses({ ...responses, [dimensionId]: rating });
  };

  const handleComment = (dimensionId: string, comment: string) => {
    setComments({ ...comments, [dimensionId]: comment });
  };

  const handleSubmit = () => {
    // I produktion skulle detta skicka data till backend
    setSubmitted(true);
  };

  const getEmoji = (rating: number | null) => {
    if (rating === null) return <Meh size={32} className="text-gray-400" />;
    if (rating >= 4) return <ThumbsUp size={32} className="text-green-500" />;
    if (rating >= 3) return <Meh size={32} className="text-yellow-500" />;
    return <ThumbsDown size={32} className="text-red-500" />;
  };

  const allAnswered = SHANARRI_DATA.every(dim => responses[dim.id] !== undefined && responses[dim.id] !== null);

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Tack för dina svar!</h2>
          <p className="text-lg opacity-90">
            Dina åsikter är viktiga för oss. Dina svar hjälper oss att förstå hur du mår och vad du behöver.
          </p>
        </div>

        <div className="bg-white rounded-lg border-2 border-[#005595] p-6">
          <h3 className="font-bold text-lg text-[#1F1F1F] mb-4">Dina svar:</h3>
          <div className="space-y-3">
            {SHANARRI_DATA.map((dimension) => {
              const rating = responses[dimension.id];
              const comment = comments[dimension.id];
              if (rating === null || rating === undefined) return null;

              return (
                <div key={dimension.id} className="bg-gray-50 rounded p-3 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{dimension.name}</span>
                    <div className="flex items-center gap-2">
                      {getEmoji(rating)}
                      <span className="font-bold">{rating}/5</span>
                    </div>
                  </div>
                  {comment && (
                    <p className="text-sm text-gray-700 italic">"{comment}"</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-gray-700">
            <strong>Vad händer nu?</strong> Dina svar blir en del av ditt välbefinnandehjul och hjälper dina mentorer och
            vårdnadshavare att förstå hur du mår. Om du vill prata mer om något, tveka inte att prata med din mentor eller skolkurator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#005595] to-[#003D6B] text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">Din röst är viktig! 🎤</h2>
        <p className="text-sm opacity-90">
          Berätta hur du mår och vad du tycker. Det finns inga rätt eller fel svar - vi vill bara höra vad DU tycker.
        </p>
      </div>

      {/* Info box */}
      <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-300">
        <p className="text-sm text-gray-800">
          <strong>💡 Tips:</strong> Svara ärligt! Dina svar är viktiga för att vi ska kunna hjälpa dig på bästa sätt.
          Alla svar är anonyma och behandlas konfidentiellt.
        </p>
      </div>

      {/* Survey questions */}
      <div className="space-y-6">
        {SHANARRI_DATA.map((dimension) => {
          const currentRating = responses[dimension.id];

          return (
            <div key={dimension.id} className="bg-white rounded-lg border-2 border-gray-200 p-6 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: dimension.color + '20', color: dimension.color }}
                >
                  <span className="text-2xl font-bold">{dimension.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-[#1F1F1F] mb-1">{dimension.name}</h3>
                  <p className="text-sm text-gray-600">{dimension.notes}</p>
                </div>
              </div>

              {/* Rating scale */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Hur mår du inom detta område?</p>
                <div className="flex gap-2 justify-between">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRating(dimension.id, rating)}
                      className={`flex-1 py-3 px-2 rounded-lg border-2 transition-all ${
                        currentRating === rating
                          ? 'border-[#005595] bg-[#005595] text-white scale-105 shadow-md'
                          : 'border-gray-300 hover:border-[#005595] hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Star
                          size={24}
                          className={currentRating === rating ? 'fill-white' : 'fill-none'}
                        />
                        <span className="text-xs font-semibold">{rating}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>😞 Behöver stöd</span>
                  <span>😐 OK</span>
                  <span>😊 Jättebra!</span>
                </div>
              </div>

              {/* Comment field */}
              {currentRating !== null && currentRating !== undefined && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MessageSquare size={16} />
                    Vill du berätta mer? (frivilligt)
                  </label>
                  <textarea
                    value={comments[dimension.id] || ''}
                    onChange={(e) => handleComment(dimension.id, e.target.value)}
                    placeholder="Skriv vad du vill här... Till exempel vad som är bra eller vad som skulle kunna bli bättre."
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#005595] focus:outline-none text-sm"
                    rows={3}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit button */}
      <div className="sticky bottom-4 bg-white rounded-lg border-2 border-[#005595] p-4 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {allAnswered ? '✅ Alla frågor besvarade!' : `📝 ${Object.keys(responses).filter(k => responses[k] !== null && responses[k] !== undefined).length} av ${SHANARRI_DATA.length} frågor besvarade`}
            </p>
            <p className="text-xs text-gray-600">
              {allAnswered ? 'Du kan skicka in dina svar nu' : 'Svara på alla frågor för att kunna skicka in'}
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-all ${
              allAnswered
                ? 'bg-[#005595] hover:bg-[#003D6B] cursor-pointer shadow-md hover:shadow-lg'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
            Skicka in
          </button>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-sm text-[#1F1F1F] mb-2">🔒 Integritet och sekretess</h4>
        <p className="text-xs text-gray-700">
          Dina svar behandlas konfidentiellt och enligt GDPR. De används endast för att hjälpa dig att må bättre.
          Din mentor, skolkurator eller andra som arbetar med ditt välbefinnande kan se dina svar, men de används alltid för ditt bästa.
        </p>
      </div>
    </div>
  );
};

export default WellbeingSurvey;
