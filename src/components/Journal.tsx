
import React, { useState, useEffect, useRef, memo } from 'react';
import { JOURNAL_DATA } from '../data/constants';
import { BookOpen, Plus, Sparkles, User, GraduationCap, Stethoscope, Building2, Home, X, Edit, Clock, MapPin, CheckCircle, Save, AlertCircle, Bold, Italic, List } from 'lucide-react';
import { AiSuggestion } from '../types/types';

interface JournalProps {
  onNavigateToAI: () => void;
}

const Journal: React.FC<JournalProps> = ({ onNavigateToAI }) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('Skola');
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftText, setDraftText] = useState(''); // Stores HTML content
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[] | null>(null);
  
  // Validation and Status States
  const [formError, setFormError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if we are returning from AI Analysis with data
    const storedAnalysis = sessionStorage.getItem('journalAnalysisResult');
    if (storedAnalysis) {
      try {
        const { originalText, suggestions } = JSON.parse(storedAnalysis);
        // Convert plain text back to basic HTML for editor if needed
        setDraftText(originalText.replace(/\n/g, '<br>'));
        setAiSuggestions(suggestions);
        setIsDrafting(true); 
      } catch (e) {
        console.error("Failed to parse analysis result", e);
      }
      sessionStorage.removeItem('journalAnalysisResult');
    }
  }, []);

  // Sync draftText state to editor innerHTML when draftText updates (e.g. initial load or apply suggestions)
  useEffect(() => {
    if (isDrafting && editorRef.current && draftText !== editorRef.current.innerHTML) {
       // Only update if significantly different to avoid cursor jumping issues during normal typing
       // For this simple implementation, we assume external updates happen mainly when not typing
       if (editorRef.current.innerHTML === '' || draftText.includes('AI-FÖRESLAGEN')) {
          editorRef.current.innerHTML = draftText;
       }
    }
  }, [isDrafting, draftText]);

  const execCmd = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
        setDraftText(editorRef.current.innerHTML);
        editorRef.current.focus();
    }
  };

  const handleAnalyzeDraft = () => {
    // Extract plain text for AI analysis
    const plainText = editorRef.current?.innerText || "";
    
    if (!plainText.trim()) {
      setFormError('Du måste skriva en observation för att kunna göra en analys.');
      return;
    }
    setFormError(null);
    sessionStorage.setItem('journalDraft', plainText);
    onNavigateToAI();
  };

  const handleSaveDraft = () => {
    const plainText = editorRef.current?.innerText || "";
    if (!plainText.trim()) {
      setFormError('Anteckningen kan inte vara tom.');
      return;
    }
    setFormError(null);

    setSaveStatus('Sparar...');
    setTimeout(() => {
        setSaveStatus('Anteckning sparad!');
        setTimeout(() => {
            setSaveStatus(null);
            setIsDrafting(false);
            setDraftText('');
            if (editorRef.current) editorRef.current.innerHTML = '';
            setAiSuggestions(null);
        }, 1000);
    }, 600);
  };

  const applySuggestions = () => {
    if (!aiSuggestions) return;

    const formattedListItems = aiSuggestions.map(s => 
      `<li><strong>${s.standard}:</strong> ${s.code} <span style="color:#666; font-size:0.9em;">(${s.confidence}%)</span></li>`
    ).join('');

    const formattedBlock = `<br><div style="border-top: 2px dashed #ccc; margin-top: 10px; padding-top: 10px;"><strong>--- AI-FÖRESLAGEN KODNING ---</strong><ul style="list-style-type: disc; margin-left: 20px;">${formattedListItems}</ul></div><br>`;
    
    const newHtml = (editorRef.current?.innerHTML || '') + formattedBlock;
    setDraftText(newHtml);
    if (editorRef.current) {
        editorRef.current.innerHTML = newHtml;
        // Scroll to bottom
        editorRef.current.scrollTop = editorRef.current.scrollHeight;
    }
    setAiSuggestions(null);
  };

  const domainIcons: Record<string, React.ReactNode> = {
    'Skola': <GraduationCap size={20} />,
    'Socialtjänst': <Building2 size={20} />,
    'Hälso- och sjukvård': <Stethoscope size={20} />,
    'Omsorg': <Home size={20} />,
    'Barn och vårdnadshavare': <User size={20} />
  };

  const domainColors: Record<string, string> = {
    'Skola': 'border-l-blue-500 text-blue-700 bg-blue-50',
    'Socialtjänst': 'border-l-red-500 text-red-700 bg-red-50',
    'Hälso- och sjukvård': 'border-l-green-500 text-green-700 bg-green-50',
    'Omsorg': 'border-l-orange-500 text-orange-700 bg-orange-50',
    'Barn och vårdnadshavare': 'border-l-yellow-500 text-yellow-700 bg-yellow-50'
  };

  const currentData = JOURNAL_DATA[selectedDomain];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white mb-4 shadow-lg">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Journal</h1>
        <p className="text-gray-600">
          Dokumentation och observationer från olika domäner
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

      {/* Sidebar - Domain Selection */}
      <div className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="font-semibold text-gray-900 mb-3 text-sm">Välj Domän</div>
          <div className="space-y-2">
            {Object.keys(JOURNAL_DATA).map(domain => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                  selectedDomain === domain
                    ? `${domainColors[domain]} shadow-sm`
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                }`}
              >
                <div className={selectedDomain === domain ? 'opacity-100' : 'opacity-50'}>
                  {domainIcons[domain] || <BookOpen size={18} />}
                </div>
                <span className="font-medium text-sm">{domain}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-start">
          <div>
             <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedDomain === 'Skola' ? 'bg-blue-100' :
                  selectedDomain === 'Socialtjänst' ? 'bg-red-100' :
                  selectedDomain === 'Hälso- och sjukvård' ? 'bg-green-100' :
                  selectedDomain === 'Omsorg' ? 'bg-orange-100' : 'bg-yellow-100'
                }`}>
                  {domainIcons[selectedDomain]}
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedDomain}
                </h2>
             </div>

             <div className="flex flex-wrap gap-4 text-xs text-gray-500">
               <div className="flex items-center gap-1.5">
                  <Building2 size={14} className="text-gray-400" />
                  {currentData.unit}
               </div>
               <div className="flex items-center gap-1.5">
                  <User size={14} className="text-gray-400" />
                  {currentData.contact}
               </div>
               <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-gray-400" />
                  {currentData.lastUpdated}
               </div>
             </div>
          </div>

          <button
            onClick={() => { setIsDrafting(!isDrafting); setFormError(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all shrink-0 ${
              isDrafting
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-md'
            }`}
          >
            {isDrafting ? (
              <>
                <X size={16} /> Avbryt
              </>
            ) : (
              <>
                <Plus size={16} /> Ny Anteckning
                <Sparkles size={14} className="opacity-80" />
              </>
            )}
          </button>
        </div>

        {/* Content Grid */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 relative flex-1">

          {/* Draft Area Overlay/Insertion */}
          {isDrafting && (
            <div className="col-span-1 md:col-span-2 bg-amber-50 rounded-xl border border-amber-200 p-5 mb-2 animate-fade-in relative z-10">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                   <Edit size={18} className="text-amber-600" />
                   Ny Anteckning – {selectedDomain}
                 </h3>
               </div>
               
               {/* AI Suggestions Banner */}
               {aiSuggestions && (
                 <div className="mb-4 bg-violet-50 border border-violet-200 rounded-xl p-4 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-violet-800 text-sm flex items-center gap-2">
                          <CheckCircle size={16} /> Analys klar!
                        </h4>
                        <p className="text-xs text-violet-600 mt-1">
                          AI har identifierat {aiSuggestions.length} möjliga kodningar baserat på din text.
                        </p>
                      </div>
                      <button
                        onClick={applySuggestions}
                        className="bg-gradient-to-r from-violet-500 to-purple-600 hover:shadow-md text-white text-xs font-medium px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                      >
                        <Sparkles size={14} /> Infoga koder
                      </button>
                    </div>
                 </div>
               )}

               <div className="relative">
                  {/* Rich Text Editor Container */}
                  <div className={`border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-400 transition-all bg-white ${formError ? 'border-red-400' : 'border-gray-200'}`}>
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 p-2 border-b border-gray-100 bg-gray-50">
                        <button onClick={() => execCmd('bold')} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600" title="Fetstil"><Bold size={16}/></button>
                        <button onClick={() => execCmd('italic')} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600" title="Kursiv"><Italic size={16}/></button>
                        <div className="w-px h-4 bg-gray-200 mx-1"></div>
                        <button onClick={() => execCmd('insertUnorderedList')} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600" title="Punktlista"><List size={16}/></button>
                    </div>

                    {/* Editable Area */}
                    <div
                        ref={editorRef}
                        contentEditable
                        className={`w-full p-4 min-h-[140px] outline-none text-sm max-h-[300px] overflow-y-auto ${formError ? 'bg-red-50' : 'bg-white'}`}
                        onInput={(e) => {
                            setDraftText(e.currentTarget.innerHTML);
                            if(e.currentTarget.innerText.trim()) setFormError(null);
                        }}
                    />
                  </div>

                  {formError && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-red-600 font-medium bg-white px-2 py-1 rounded-lg shadow-sm border border-red-100">
                      <AlertCircle size={12} /> {formError}
                    </div>
                  )}
               </div>

               <div className="flex flex-col sm:flex-row justify-between items-center bg-white rounded-xl p-3 border border-gray-200 gap-3 mt-4">
                  <span className="text-xs text-gray-600 flex items-center gap-1.5">
                    <Sparkles size={14} className="shrink-0 text-violet-500" />
                    AI kan hjälpa dig att hitta rätt kodning
                  </span>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {saveStatus ? (
                       <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm px-4">
                         <CheckCircle size={16} /> {saveStatus}
                       </div>
                    ) : (
                      <>
                        <button
                          onClick={handleSaveDraft}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
                        >
                          <Save size={16} /> Spara
                        </button>
                        <button
                          onClick={handleAnalyzeDraft}
                          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                            !editorRef.current?.innerText.trim()
                             ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                             : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:shadow-md'
                          }`}
                        >
                          <Sparkles size={16} /> Analysera & Koda
                        </button>
                      </>
                    )}
                  </div>
               </div>
            </div>
          )}
          
          {/* Kontext */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
             <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Kontext</h3>
             <p className="text-gray-700 leading-relaxed text-sm">{currentData.Kontext}</p>
          </div>

          {/* Funktion */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
             <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Funktion</h3>
             <p className="text-gray-700 leading-relaxed text-sm">{currentData.Funktion}</p>
          </div>

           {/* Delaktighet */}
           <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
             <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Delaktighet</h3>
             <p className="text-gray-700 leading-relaxed text-sm">{currentData.Delaktighet}</p>
          </div>

           {/* Insats */}
           <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
             <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Insatser & Åtgärder</h3>
             <p className="text-gray-700 leading-relaxed text-sm">{currentData.Insats}</p>
          </div>

        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400">
           Data hämtad via federation (SDK)
        </div>

      </div>

      </div>
    </div>
  );
};

export default memo(Journal);
