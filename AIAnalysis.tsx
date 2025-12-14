
import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Check, AlertCircle, Database, Copy, RefreshCw, Edit, Save, Trash2, X, Zap } from 'lucide-react';
import { AiSuggestion, View } from '../types';
import { semanticBridgeApi } from '../services/semanticBridgeApi';

interface AIAnalysisProps {
  onNavigate?: (view: View) => void;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ onNavigate }) => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AiSuggestion[] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<number, string>>({});
  const [apiSource, setApiSource] = useState<'semantic-bridge' | 'gemini' | 'demo'>('semantic-bridge');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

  useEffect(() => {
    // Check for drafted text passed from Journal component
    const draft = sessionStorage.getItem('journalDraft');
    if (draft) {
      setInputText(draft);
      sessionStorage.removeItem('journalDraft');
    }

    // Check backend availability
    const checkBackend = async () => {
      try {
        await semanticBridgeApi.healthCheck();
        setBackendStatus('available');
        setApiSource('semantic-bridge');
      } catch (error) {
        console.log('Semantic Bridge backend unavailable, falling back to Gemini');
        setBackendStatus('unavailable');
        setApiSource('gemini');
      }
    };
    checkBackend();
  }, []);

  const validateCodeFormat = (standard: string, code: string): string | null => {
    const cleanCode = code.trim().split(' ')[0]; // Extract the code part, ignoring description

    switch (standard) {
      case 'ICF':
        // Starts with b, d, e, s followed by digits
        if (!/^[bdes]\d+/.test(cleanCode)) {
          return "Fel format: ICF ska börja med b, d, e eller s (t.ex. d160).";
        }
        break;
      case 'KVÅ':
        // Two uppercase letters followed by three digits
        if (!/^[A-ZÅÄÖ]{2}\d{3}/.test(cleanCode)) {
          return "Fel format: KVÅ ska vara två bokstäver och tre siffror (t.ex. GD005).";
        }
        break;
      case 'KSI':
        // Usually 3 digits
        if (!/^\d{3}/.test(cleanCode)) {
           return "Fel format: KSI är vanligtvis 3 siffror (t.ex. 421).";
        }
        break;
      case 'BBIC':
        // No strict format, but shouldn't be empty
        if (cleanCode.length < 2) return "Ange ett giltigt BBIC-område.";
        break;
    }
    return null;
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setResults(null);
    setIsEditing(false);
    setValidationErrors({});

    try {
      // Try semantic-bridge backend first
      if (backendStatus === 'available') {
        try {
          const response = await semanticBridgeApi.analyzeText({
            text: inputText,
            standards: ['icf', 'ksi', 'bbic', 'kva']
          });

          // Transform backend response to match our AiSuggestion format
          const suggestions: AiSuggestion[] = response.icf_suggestions.map(sugg => ({
            standard: 'ICF',
            code: `${sugg.code} (${sugg.description})`,
            confidence: sugg.confidence,
            reasoning: sugg.reasoning
          }));

          // Add KSI suggestions
          response.ksi_codes?.forEach(code => {
            suggestions.push({
              standard: 'KSI',
              code: code,
              confidence: 85,
              reasoning: `Baserat på textanalys, identifierad KSI-kod: ${code}`
            });
          });

          // Add BBIC suggestions
          response.bbic_domains?.forEach(domain => {
            suggestions.push({
              standard: 'BBIC',
              code: domain,
              confidence: 80,
              reasoning: `Texten relaterar till BBIC-domänen: ${domain}`
            });
          });

          setResults(suggestions);
          setApiSource('semantic-bridge');
          setIsAnalyzing(false);
          return;
        } catch (backendError) {
          console.warn('Semantic Bridge analysis failed, falling back to Gemini:', backendError);
          // Fall through to Gemini
        }
      }

      // Fallback to Gemini if backend unavailable
      const { GoogleGenAI, Type } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `
          Du är en expert på svensk vård- och omsorgsdokumentation och terminologi.
          Analysera följande observationstext och föreslå koder för standarderna ICF (ICF-CY), BBIC, KVÅ och KSI.
          
          Text att analysera:
          "${inputText}"
          
          INSTRUKTIONER FÖR MOTIVERING (REASONING):
          För att analysen ska vara trovärdig MÅSTE du inkludera direkta citat från texten.
          Följ denna struktur för varje motivering:
          1. Ange exakt vilket citat analysen bygger på.
          2. Förklara hur citatet tolkas i förhållande till standarden.
          3. Ange varför den specifika koden valdes.

          Exempelformat: "Baserat på citatet '[CITAT FRÅN TEXT]' som indikerar [TOLKNING/PROBLEM], föreslås koden [KOD] då den omfattar [DEFINITION]."
          
          PRIORITERING PER STANDARD:
          - ICF: Prioritera d-koder (aktivitet/delaktighet) och e-koder (omgivningsfaktorer) för att fånga barnets funktion i vardagen.
          - BBIC: Koppla till barnets behov, föräldrarnas förmåga eller familj & miljö.
          - KVÅ: Åtgärdskoder inom hälso- och sjukvård (t.ex. samtal, utredning).
          - KSI: Insatskoder för socialtjänst (t.ex. bistånd, placering).

          ÖNSKAT JSON-FORMAT:
          Svaret ska vara en lista av objekt med följande struktur:
          [
            {
              "standard": "ICF" | "BBIC" | "KVÅ" | "KSI",
              "code": "Kod och beskrivning (t.ex. 'd160 Uppmärksamhet')",
              "confidence": heltal 0-100,
              "reasoning": "Motivering med citat"
            }
          ]
        `,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                standard: { 
                  type: Type.STRING, 
                  enum: ['ICF', 'BBIC', 'KVÅ', 'KSI'] 
                },
                code: { 
                  type: Type.STRING,
                  description: "Koden och dess benämning, t.ex. 'd160 Uppmärksamhet' eller '421 Kontaktfamilj'"
                },
                confidence: { 
                  type: Type.INTEGER,
                  description: "Säkerhet i bedömningen (0-100)"
                },
                reasoning: { 
                  type: Type.STRING,
                  description: "Motivering som inkluderar citat från texten."
                }
              },
              required: ['standard', 'code', 'confidence', 'reasoning']
            }
          }
        }
      });

      if (response.text) {
        setResults(JSON.parse(response.text));
        setApiSource('gemini');
      }

    } catch (error) {
      console.error("AI Analysis failed:", error);
      setApiSource('demo');
      // Fallback/Demo mode if API key is missing or call fails
      const mockSuggestions: AiSuggestion[] = [
        {
          standard: 'ICF',
          code: 'd160 (Uppmärksamhet)',
          confidence: 88,
          reasoning: `Baserat på citatet "svårt att koncentrera sig" som indikerar nedsatt mental funktion, föreslås koden d160 (Uppmärksamhet) då den avser förmågan att fokusera på uppgifter.`
        },
        {
          standard: 'BBIC',
          code: 'Skola & Lärande',
          confidence: 82,
          reasoning: `Baserat på citatet "på lektionerna" och beskrivna svårigheter med skolarbete, kopplas detta till BBIC-domänen Skola & Lärande.`
        },
        {
          standard: 'KVÅ',
          code: 'GD005 (Stödsamtal)',
          confidence: 75,
          reasoning: `Baserat på citatet "uttrycker oro" som indikerar ett behov av ventilerande samtal, föreslås åtgärdskoden GD005 (Stödsamtal).`
        }
      ];
      setResults(mockSuggestions);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleResultChange = (index: number, field: keyof AiSuggestion, value: any) => {
    if (!results) return;
    const newResults = [...results];
    newResults[index] = { ...newResults[index], [field]: value };
    setResults(newResults);

    // Validate if standard or code changes
    if (field === 'standard' || field === 'code') {
      const standardToCheck = field === 'standard' ? value : newResults[index].standard;
      const codeToCheck = field === 'code' ? value : newResults[index].code;
      
      const error = validateCodeFormat(standardToCheck, codeToCheck);
      
      setValidationErrors(prev => {
        const next = { ...prev };
        if (error) next[index] = error;
        else delete next[index];
        return next;
      });
    }
  };

  const handleDeleteResult = (index: number) => {
    if (!results) return;
    const newResults = results.filter((_, i) => i !== index);
    setResults(newResults);
    
    // Correctly shift validation errors down since array indices change
    const newErrors: Record<number, string> = {};
    Object.keys(validationErrors).forEach((key) => {
      const keyIndex = parseInt(key, 10);
      if (keyIndex < index) {
        newErrors[keyIndex] = validationErrors[keyIndex];
      } else if (keyIndex > index) {
        newErrors[keyIndex - 1] = validationErrors[keyIndex];
      }
    });
    setValidationErrors(newErrors);
  };

  const handleSaveToJournal = () => {
    if (!results || !onNavigate) return;
    
    // Block saving if there are validation errors
    if (Object.keys(validationErrors).length > 0) {
      alert("Du måste åtgärda valideringsfelen innan du kan spara.");
      return;
    }

    // Save current analysis to session storage so Journal can pick it up
    const payload = {
      originalText: inputText,
      suggestions: results
    };
    sessionStorage.setItem('journalAnalysisResult', JSON.stringify(payload));
    onNavigate('journal');
  };

  const sampleText = "Erik har visat tecken på oro vid raster. Han drar sig undan och har svårt att koncentrera sig på lektionerna efter rasten. Han uttrycker att det är 'stökigt' i korridoren.";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-white p-6 rounded-lg border border-purple-100 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1F1F1F] flex items-center gap-2">
              <Sparkles className="text-purple-600" />
              AI-Analysstöd (Kodning)
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Använd AI för att översätta pedagogiska observationer (fritext) till Socialstyrelsens klassifikationer och kodverk.
              Detta minskar administration och säkrar enhetlig dokumentation.
            </p>
          </div>
          <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full border border-purple-200 uppercase tracking-wide">
            Beta-funktion
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col h-full">
          <label className="font-bold text-gray-700 mb-2 block">
            Pedagogisk Observation / Journalanteckning
          </label>
          <div className="relative flex-grow">
            <textarea
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm leading-relaxed"
              placeholder="Skriv din observation här..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isEditing} 
            />
            {!inputText && (
              <button 
                onClick={() => setInputText(sampleText)}
                className="absolute top-4 right-4 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded transition-colors"
              >
                Klistra in exempel
              </button>
            )}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <AlertCircle size={14} />
              AI-stödet är vägledande. Professionen beslutar.
            </p>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !inputText || isEditing}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white transition-all transform hover:scale-105 active:scale-95 ${
                isAnalyzing || !inputText || isEditing
                  ? 'bg-gray-300 cursor-not-allowed transform-none' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={18} className="animate-spin" /> Analyserar...
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Analysera Text
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 h-full overflow-y-auto">
          {!results ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
              <Database size={48} className="mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-gray-600">Inväntar analys</h3>
              <p className="text-sm mt-2 max-w-xs">
                Skriv in en text till vänster och klicka på "Analysera" för att se förslag på kodning.
              </p>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Check className="text-green-600" size={20} />
                  Föreslagen Kodning
                </h3>
                {isEditing && (
                   <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100 animate-pulse">
                     Redigeringsläge
                   </span>
                )}
              </div>
              
              {results.map((item, idx) => (
                <div key={idx} className={`bg-white p-4 rounded-lg border shadow-sm transition-all group ${isEditing ? 'border-orange-200 ring-2 ring-orange-50' : 'border-gray-200 hover:shadow-md'}`}>
                  
                  {/* Top Row: Standard & Confidence */}
                  <div className="flex justify-between items-start mb-2">
                    {isEditing ? (
                      <select 
                        value={item.standard}
                        onChange={(e) => handleResultChange(idx, 'standard', e.target.value)}
                        className="text-xs font-bold uppercase tracking-wide border border-gray-300 rounded px-2 py-1 bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none"
                      >
                        <option value="ICF">ICF</option>
                        <option value="BBIC">BBIC</option>
                        <option value="KVÅ">KVÅ</option>
                        <option value="KSI">KSI</option>
                      </select>
                    ) : (
                      <div className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide border ${
                        item.standard === 'ICF' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                        item.standard === 'BBIC' ? 'bg-red-50 text-red-700 border-red-100' :
                        item.standard === 'KVÅ' ? 'bg-green-50 text-green-700 border-green-100' :
                        item.standard === 'KSI' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {item.standard}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                       {isEditing ? (
                         <div className="flex items-center gap-1">
                           <input 
                             type="range" 
                             min="0" 
                             max="100" 
                             value={item.confidence} 
                             onChange={(e) => handleResultChange(idx, 'confidence', parseInt(e.target.value))}
                             className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                           />
                           <span className="text-xs font-mono w-8 text-right">{item.confidence}%</span>
                         </div>
                       ) : (
                        <div className="flex items-center gap-1 text-xs font-semibold text-gray-400">
                          <span>{item.confidence}% säkerhet</span>
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${item.confidence}%` }}></div>
                          </div>
                        </div>
                       )}
                       
                       {isEditing && (
                         <button 
                           onClick={() => handleDeleteResult(idx)}
                           className="text-red-400 hover:text-red-600 ml-2 p-1"
                           title="Ta bort förslag"
                         >
                           <Trash2 size={14} />
                         </button>
                       )}
                    </div>
                  </div>
                  
                  {/* Middle Row: Code */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                        {isEditing ? (
                        <input 
                            type="text" 
                            value={item.code}
                            onChange={(e) => handleResultChange(idx, 'code', e.target.value)}
                            className={`w-full text-lg font-bold text-gray-900 font-mono border-b-2 outline-none bg-transparent ${
                                validationErrors[idx] ? 'border-red-500 text-red-900' : 'border-gray-200 focus:border-purple-500'
                            }`}
                        />
                        ) : (
                        <div className="text-lg font-bold text-gray-900 font-mono">{item.code}</div>
                        )}
                        
                        {!isEditing && (
                        <button className="text-gray-400 hover:text-[#005595] transition-colors" title="Kopiera">
                            <Copy size={16} />
                        </button>
                        )}
                    </div>
                    {isEditing && validationErrors[idx] && (
                        <div className="text-xs text-red-600 font-medium flex items-center gap-1">
                            <AlertCircle size={12} /> {validationErrors[idx]}
                        </div>
                    )}
                  </div>
                  
                  {/* Bottom Row: Reasoning */}
                  <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600 italic flex gap-2 items-start">
                    <span className="shrink-0 text-purple-400 mt-1">🤖</span>
                    {isEditing ? (
                      <textarea 
                        value={item.reasoning}
                        onChange={(e) => handleResultChange(idx, 'reasoning', e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                        rows={2}
                      />
                    ) : (
                      <span>"{item.reasoning}"</span>
                    )}
                  </div>
                </div>
              ))}

              <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-100 text-sm text-[#005595]">
                {isEditing ? (
                   <div className="flex flex-col gap-2">
                      <strong>Granska dina ändringar:</strong>
                      <div className="flex gap-3 mt-1">
                        <button 
                          onClick={() => {
                            if (Object.keys(validationErrors).length === 0) {
                                setIsEditing(false);
                            } else {
                                alert("Du måste åtgärda felen i rött innan du kan avsluta redigeringen.");
                            }
                          }}
                          className={`flex items-center gap-2 px-4 py-1.5 rounded font-semibold transition-colors ${
                             Object.keys(validationErrors).length > 0
                             ? 'bg-gray-400 cursor-not-allowed text-white'
                             : 'bg-[#005595] text-white hover:bg-blue-800'
                          }`}
                        >
                          <Save size={16} /> Spara ändringar
                        </button>
                      </div>
                   </div>
                ) : (
                  <>
                    <strong>Nästa steg:</strong> Vill du spara dessa koder till Journalen?
                    <div className="mt-3 flex gap-3">
                      <button 
                        onClick={handleSaveToJournal}
                        className="flex items-center gap-2 bg-[#005595] text-white px-4 py-1.5 rounded font-semibold hover:bg-blue-800 transition-colors"
                      >
                        <Save size={16} /> Spara & Gå till Journal
                      </button>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-white border border-blue-200 text-[#005595] px-4 py-1.5 rounded font-semibold hover:bg-blue-50 transition-colors"
                      >
                        <Edit size={16} /> Redigera
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AIAnalysis;
