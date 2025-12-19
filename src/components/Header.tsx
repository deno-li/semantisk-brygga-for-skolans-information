
import React, { useState, useRef, useEffect } from 'react';
import { Perspective, UserContext, View } from '../types/types';
import { ChevronDown, Search, X, FileText, ArrowRight, Users } from 'lucide-react';
import { JOURNAL_DATA, DOCUMENTS_DATA, SHANARRI_DATA, NEWS_FEED_DATA } from '../data/constants';
import { CHILD_PROFILES, getProfileMetadata, getSupportLevelColor } from '../data/childProfiles';

interface HeaderProps {
  currentPerspective: Perspective;
  onPerspectiveChange: (p: Perspective) => void;
  userContext: UserContext;
  onNavigate: (view: View) => void;
  selectedProfileId: string;
  onProfileChange: (profileId: string) => void;
}

interface SearchResult {
  type: string;
  title: string;
  subtitle?: string;
  view: View;
}

const Header: React.FC<HeaderProps> = ({
  currentPerspective,
  onPerspectiveChange,
  userContext,
  onNavigate,
  selectedProfileId,
  onProfileChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setShowResults(true);
    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search Documents
    DOCUMENTS_DATA.forEach(section => {
      section.items.forEach(doc => {
        if (doc.title.toLowerCase().includes(lowerQuery)) {
          results.push({ type: 'Hantera samtycke', title: doc.title, subtitle: section.category, view: 'documents' });
        }
      });
    });

    // Search Journal
    Object.entries(JOURNAL_DATA).forEach(([domain, data]) => {
      Object.entries(data).forEach(([category, content]) => {
        if (content.toLowerCase().includes(lowerQuery) || category.toLowerCase().includes(lowerQuery) || domain.toLowerCase().includes(lowerQuery)) {
           results.push({ type: 'Journal', title: domain, subtitle: category, view: 'journal' });
        }
      });
    });

    // Search Indicators
    SHANARRI_DATA.forEach(ind => {
      if (ind.name.toLowerCase().includes(lowerQuery) || ind.notes.toLowerCase().includes(lowerQuery)) {
        results.push({ type: 'Indikator', title: ind.name, subtitle: 'Välbefinnande', view: 'shanarri' });
      }
    });
    
    // Search News
    NEWS_FEED_DATA.forEach(news => {
      if (news.title.toLowerCase().includes(lowerQuery) || news.snippet.toLowerCase().includes(lowerQuery)) {
         results.push({ type: 'Nyhet', title: news.title, subtitle: news.source, view: 'overview' });
      }
    });

    setSearchResults(results);
  };

  const handleResultClick = (result: SearchResult) => {
    onNavigate(result.view);
    setShowResults(false);
    setSearchQuery('');
  };

  return (
    <header className="bg-white border-b-4 border-[#B00020] sticky top-0 z-50">
      {/* Utility Bar (Mocking the 1177 top bar) */}
      <div className="bg-[#F3F3F3] border-b border-gray-200 py-1 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-end gap-6 text-xs text-[#005595] font-semibold">
          <span className="cursor-pointer hover:underline">Om 1177</span>
          <span className="cursor-pointer hover:underline">Hjälp & Kontakt</span>
          <span className="cursor-pointer hover:underline">Region Gävleborg</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Logo Area */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 bg-[#B00020] flex items-center justify-center text-white font-bold text-xl rounded-sm shrink-0">
              1177
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-[#1F1F1F] leading-none"> Välbefinnandehjul för Sammanhållen planering i 1177 </h1>
              <span className="text-sm text-gray-600 mt-1">Gemensam informationsprofil för barnets hela resa (Livsloppsvy)</span>
            </div>
          </div>

          {/* Search Bar - Global Search */}
          <div className="flex-1 max-w-lg relative" ref={searchRef}>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Sök journal, dokument, händelser..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#005595] focus:border-transparent text-sm bg-gray-50 focus:bg-white transition-all"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => { if(searchQuery.length >= 2) setShowResults(true); }}
                />
                {searchQuery && (
                   <button 
                     onClick={() => { setSearchQuery(''); setSearchResults([]); setShowResults(false); }}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                   >
                     <X size={16} />
                   </button>
                )}
             </div>

             {/* Search Dropdown */}
             {showResults && (
               <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden max-h-[400px] overflow-y-auto animate-fade-in z-50">
                  {searchResults.length > 0 ? (
                    <div className="py-2">
                       <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100 mb-1">
                         Sökresultat ({searchResults.length})
                       </div>
                       {searchResults.map((result, idx) => (
                         <button
                           key={idx}
                           onClick={() => handleResultClick(result)}
                           className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 flex items-start gap-3 group"
                         >
                            <div className={`p-2 rounded bg-gray-100 text-gray-500 group-hover:bg-[#005595] group-hover:text-white transition-colors`}>
                               <FileText size={16} />
                            </div>
                            <div className="flex-1">
                               <div className="font-semibold text-sm text-gray-800 flex justify-between">
                                 {result.title}
                                 <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 group-hover:bg-white/80">{result.type}</span>
                               </div>
                               {result.subtitle && <div className="text-xs text-gray-500 mt-0.5">{result.subtitle}</div>}
                            </div>
                            <ArrowRight size={14} className="text-gray-300 group-hover:text-[#005595] self-center" />
                         </button>
                       ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      Inga resultat hittades för "{searchQuery}"
                    </div>
                  )}
               </div>
             )}
          </div>

          {/* Profile Selector */}
          <div className="relative shrink-0" ref={profileRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-[#005595] transition-all text-sm font-semibold text-[#1F1F1F] shadow-sm"
            >
              <Users size={18} className="text-[#005595]" />
              <span className="hidden sm:inline">{CHILD_PROFILES[selectedProfileId].name}</span>
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getSupportLevelColor(getProfileMetadata(selectedProfileId).supportLevel) }}
              />
              <ChevronDown size={16} className={`transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden min-w-[280px] z-50 animate-fade-in">
                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                  Välj barnprofil
                </div>
                <div className="py-1">
                  {Object.keys(CHILD_PROFILES).map((profileId) => {
                    const profile = CHILD_PROFILES[profileId];
                    const metadata = getProfileMetadata(profileId);
                    const isSelected = profileId === selectedProfileId;

                    return (
                      <button
                        key={profileId}
                        onClick={() => {
                          onProfileChange(profileId);
                          setShowProfileDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-l-4 flex items-center gap-3 ${
                          isSelected ? 'bg-blue-50' : ''
                        }`}
                        style={{
                          borderLeftColor: isSelected ? getSupportLevelColor(metadata.supportLevel) : 'transparent'
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 shrink-0"
                          style={{
                            backgroundColor: metadata.colorScheme.background,
                            borderColor: getSupportLevelColor(metadata.supportLevel),
                            color: getSupportLevelColor(metadata.supportLevel)
                          }}
                        >
                          {metadata.emoji}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-gray-800">{profile.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                            <span>{profile.age} år</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span>{profile.grade}</span>
                            {profile.sipActive && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                <span className="text-[#005595] font-semibold">Aktiv plan</span>
                              </>
                            )}
                          </div>
                          <div className="text-xs mt-1 px-2 py-0.5 rounded inline-block"
                            style={{
                              backgroundColor: metadata.colorScheme.background,
                              color: getSupportLevelColor(metadata.supportLevel)
                            }}
                          >
                            {metadata.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Perspective/Role Switcher */}
          <div className="flex flex-col sm:flex-row gap-3 items-center shrink-0">
             <div className="flex bg-[#F3F3F3] p-1 rounded-full border border-gray-200">
                <button
                  onClick={() => onPerspectiveChange('guardian')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    currentPerspective === 'guardian' 
                      ? 'bg-[#005595] text-white shadow-sm' 
                      : 'text-[#1F1F1F] hover:bg-gray-200'
                  }`}
                >
                  Vårdnadshavare
                </button>
                <button
                  onClick={() => onPerspectiveChange('child')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    currentPerspective === 'child' 
                      ? 'bg-[#E87C00] text-white shadow-sm' 
                      : 'text-[#1F1F1F] hover:bg-gray-200'
                  }`}
                >
                  Barn
                </button>
                <button
                  onClick={() => onPerspectiveChange('professional')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    currentPerspective === 'professional' 
                      ? 'bg-[#378056] text-white shadow-sm' 
                      : 'text-[#1F1F1F] hover:bg-gray-200'
                  }`}
                >
                  Profession
                </button>
             </div>
          </div>

        </div>
      </div>

      {/* User Context Strip - Styled like logged in user bar */}
      <div className="bg-[#EBF4FA] border-t border-b border-blue-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
           <div className="flex items-center gap-2 text-sm text-[#1F1F1F]">
             <span className="font-semibold">Inloggad som:</span>
             <span className="flex items-center gap-1">
               {userContext.avatar}
               {userContext.name} 
             </span>
             <span className="hidden md:inline-flex text-[#005595] bg-white px-2 py-0.5 rounded border border-blue-200 text-xs font-bold uppercase ml-2">
               {userContext.roleBadge}
             </span>
           </div>
           <button className="text-[#005595] font-semibold text-sm hover:underline flex items-center gap-1">
             Logga ut <ChevronDown size={14}/>
           </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
