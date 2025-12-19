
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
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in h-[calc(100vh-250px)] min-h-[600px]">
      
      {/* Sidebar - Domain Selection */}
      <div className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
        <div className="font-bold text-[#1F1F1F] mb-2 px-2 uppercase text-xs tracking-wider">Välj Domän</div>
        {Object.keys(JOURNAL_DATA).map(domain => (
          <button
            key={domain}
            onClick={() => setSelectedDomain(domain)}
            className={`flex items-center gap-3 p-4 rounded-lg text-left transition-all border ${
              selectedDomain === domain 
                ? `${domainColors[domain]} shadow-sm border-current` 
                : 'bg-white hover:bg-gray-50 border-transparent text-gray-600'
            }`}
          >
            <div className={selectedDomain === domain ? 'opacity-100' : 'opacity-50'}>
              {domainIcons[domain] || <BookOpen size={20} />}
            </div>
            <span className="font-semibold text-sm">{domain}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
          <div>
             <div className="flex items-center gap-2 mb-1">
                {domainIcons[selectedDomain]}
                <h2 className="text-xl font-bold text-[#1F1F1F]">
                  Domän: {selectedDomain}
                </h2>
             </div>
             
             <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500 font-medium">
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
                  Uppdaterad: {currentData.lastUpdated}
               </div>
             </div>
          </div>
          
          <button 
            onClick={() => { setIsDrafting(!isDrafting); setFormError(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors shadow-sm shrink-0 ${
              isDrafting 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                : 'bg-[#005595] text-white hover:bg-blue-800'
            }`}
          >
            {isDrafting ? (
              <>
                <X size={16} /> Avbryt
              </>
            ) : (
              <>
                <Plus size={16} /> Ny Anteckning
                <span className="w-px h-4 bg-white/30 mx-1"></span>
                <Sparkles size={14} className="text-purple-200" />
              </>
            )}
          </button>
        </div>

        {/* Content Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          
          {/* Draft Area Overlay/Insertion */}
          {isDrafting && (
            <div className="col-span-1 md:col-span-2 bg-white rounded-lg border-2 border-[#005595] shadow-lg p-5 mb-2 animate-fade-in relative z-10">
               <div className="flex justify-between items-center mb-3">
                 <h3 className="font-bold text-[#005595] flex items-center gap-2">
                   <Edit size={18} />
                   Utkast: Ny Anteckning ({selectedDomain})
                 </h3>
               </div>
               
               {/* AI Suggestions Banner */}
               {aiSuggestions && (
                 <div className="mb-4 bg-purple-50 border border-purple-200 rounded-lg p-4 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-purple-800 text-sm flex items-center gap-2">
                          <CheckCircle size={16} /> Analys klar!
                        </h4>
                        <p className="text-xs text-purple-700 mt-1">
                          AI har identifierat {aiSuggestions.length} möjliga kodningar baserat på din text.
                        </p>
                      </div>
                      <button 
                        onClick={applySuggestions}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded shadow-sm transition-colors flex items-center gap-2"
                      >
                        <Sparkles size={14} /> Infoga koder
                      </button>
                    </div>
                 </div>
               )}

               <div className="relative">
                  {/* Rich Text Editor Container */}
                  <div className={`border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#005595] transition-all bg-white ${formError ? 'border-red-500' : 'border-gray-300'}`}>
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
                        <button onClick={() => execCmd('bold')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Fetstil"><Bold size={16}/></button>
                        <button onClick={() => execCmd('italic')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Kursiv"><Italic size={16}/></button>
                        <div className="w-px h-4 bg-gray-300 mx-1"></div>
                        <button onClick={() => execCmd('insertUnorderedList')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Punktlista"><List size={16}/></button>
                    </div>
                    
                    {/* Editable Area */}
                    <div
                        ref={editorRef}
                        contentEditable
                        className={`w-full p-4 min-h-[160px] outline-none text-sm max-h-[400px] overflow-y-auto ${formError ? 'bg-red-50' : 'bg-white'}`}
                        onInput={(e) => {
                            setDraftText(e.currentTarget.innerHTML);
                            if(e.currentTarget.innerText.trim()) setFormError(null);
                        }}
                    />
                  </div>

                  {formError && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-red-600 font-bold bg-white px-2 py-1 rounded shadow-sm border border-red-100 animate-pulse">
                      <AlertCircle size={12} /> {formError}
                    </div>
                  )}
               </div>

               <div className="flex flex-col sm:flex-row justify-between items-center bg-blue-50 p-3 rounded border border-blue-100 gap-3 mt-4">
                  <span className="text-xs text-blue-800 flex items-center gap-1">
                    <Sparkles size={14} className="shrink-0" />
                    AI kan hjälpa dig att hitta rätt kodning.
                  </span>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {saveStatus ? (
                       <div className="flex items-center gap-2 text-[#378056] font-bold text-sm px-4">
                         <CheckCircle size={16} /> {saveStatus}
                       </div>
                    ) : (
                      <>
                        <button 
                          onClick={handleSaveDraft}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm text-[#005595] bg-white border border-blue-200 hover:bg-blue-50 transition-all"
                        >
                          <Save size={16} /> Spara
                        </button>
                        <button 
                          onClick={handleAnalyzeDraft}
                          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
                            !editorRef.current?.innerText.trim() 
                             ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                             : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-md hover:scale-105' 
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
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
             <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-200 pb-2">Kontext (Miljö & Bakgrund)</h3>
             <p className="text-[#1F1F1F] leading-relaxed text-sm">{currentData.Kontext}</p>
          </div>

          {/* Funktion */}
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
             <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-200 pb-2">Funktion (Förmåga)</h3>
             <p className="text-[#1F1F1F] leading-relaxed text-sm">{currentData.Funktion}</p>
          </div>

           {/* Delaktighet */}
           <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
             <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-200 pb-2">Delaktighet</h3>
             <p className="text-[#1F1F1F] leading-relaxed text-sm">{currentData.Delaktighet}</p>
          </div>

           {/* Insats */}
           <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
             <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-200 pb-2">Insatser & Åtgärder</h3>
             <p className="text-[#1F1F1F] leading-relaxed text-sm">{currentData.Insats}</p>
          </div>

        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400">
           Data hämtad via federation (SDK)
        </div>

      </div>

    </div>
  );
};

export default memo(Journal);
