
import React, { useState, useRef, useEffect } from 'react';
import { Perspective, UserContext, View } from '../types/types';
import {
  ChevronDown,
  Search,
  X,
  FileText,
  ArrowRight,
  Users,
  UserCircle,
  Baby,
  Briefcase,
  LogOut,
  Sparkles
} from 'lucide-react';
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

const PERSPECTIVE_CONFIG = {
  guardian: {
    label: 'Vårdnadshavare',
    shortLabel: 'Vårdnadshavare',
    icon: UserCircle,
    color: 'blue',
    bgActive: 'bg-blue-600',
    bgHover: 'hover:bg-blue-50',
    textActive: 'text-white',
    ring: 'ring-blue-200',
  },
  child: {
    label: 'Barn',
    shortLabel: 'Barn',
    icon: Baby,
    color: 'orange',
    bgActive: 'bg-orange-500',
    bgHover: 'hover:bg-orange-50',
    textActive: 'text-white',
    ring: 'ring-orange-200',
  },
  professional: {
    label: 'Profession',
    shortLabel: 'Profession',
    icon: Briefcase,
    color: 'emerald',
    bgActive: 'bg-emerald-600',
    bgHover: 'hover:bg-emerald-50',
    textActive: 'text-white',
    ring: 'ring-emerald-200',
  },
};

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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setIsSearchFocused(false);
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
          results.push({ type: 'Dokument', title: doc.title, subtitle: section.category, view: 'overview' });
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

    setSearchResults(results.slice(0, 8));
  };

  const handleResultClick = (result: SearchResult) => {
    onNavigate(result.view);
    setShowResults(false);
    setSearchQuery('');
  };

  const currentProfile = CHILD_PROFILES[selectedProfileId];
  const currentMetadata = getProfileMetadata(selectedProfileId);
  const currentPerspectiveConfig = PERSPECTIVE_CONFIG[currentPerspective];

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      {/* Top gradient line */}
      <div className="h-1 bg-gradient-to-r from-red-600 via-red-500 to-rose-600" />

      {/* Utility Bar */}
      <div className="bg-gray-50 border-b border-gray-100 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Sparkles size={12} className="text-amber-500" />
            <span>Prototyp för sammanhållen planering</span>
          </div>
          <div className="flex gap-4 text-xs font-medium">
            <span className="text-gray-500 cursor-pointer hover:text-blue-600 transition-colors">Om 1177</span>
            <span className="text-gray-500 cursor-pointer hover:text-blue-600 transition-colors">Hjälp</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

          {/* Logo Area */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white font-bold text-lg rounded-lg shadow-md">
                1177
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-[8px] text-white">✓</span>
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Välbefinnandehjul
              </h1>
              <span className="text-xs text-gray-500 font-medium">
                Sammanhållen planering
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative" ref={searchRef}>
            <div className={`relative transition-all duration-200 ${isSearchFocused ? 'scale-[1.02]' : ''}`}>
              <Search
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                  isSearchFocused ? 'text-blue-500' : 'text-gray-400'
                }`}
                size={18}
              />
              <input
                type="text"
                placeholder="Sök journal, dokument, händelser..."
                className={`
                  w-full pl-10 pr-10 py-2.5 rounded-xl text-sm
                  border-2 transition-all duration-200
                  ${isSearchFocused
                    ? 'border-blue-500 bg-white shadow-lg shadow-blue-100'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }
                  focus:outline-none
                `}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => {
                  setIsSearchFocused(true);
                  if (searchQuery.length >= 2) setShowResults(true);
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setSearchResults([]); setShowResults(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={14} className="text-gray-400" />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[400px] overflow-y-auto z-50 animate-in slide-in-from-top-2 duration-200">
                {searchResults.length > 0 ? (
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {searchResults.length} resultat
                    </div>
                    {searchResults.map((result, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleResultClick(result)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3 group"
                      >
                        <div className="p-2 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          <FileText size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">{result.title}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                            <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-semibold uppercase">
                              {result.type}
                            </span>
                            {result.subtitle && <span>{result.subtitle}</span>}
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-gray-300 group-hover:text-blue-500 self-center transition-colors" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <div className="text-gray-400 mb-1">Inga resultat</div>
                    <div className="text-xs text-gray-400">Prova ett annat sökord</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Selector */}
          <div className="relative shrink-0" ref={profileRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl
                border-2 transition-all duration-200
                ${showProfileDropdown
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }
              `}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm border-2"
                style={{
                  backgroundColor: currentMetadata.colorScheme.background,
                  borderColor: getSupportLevelColor(currentMetadata.supportLevel),
                }}
              >
                {currentMetadata.emoji}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-semibold text-gray-900 leading-tight">{currentProfile.name}</div>
                <div className="text-xs text-gray-500">{currentProfile.age} år</div>
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden min-w-[300px] z-50 animate-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Välj profil</div>
                </div>
                <div className="py-2 max-h-[300px] overflow-y-auto">
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
                        className={`
                          w-full text-left px-4 py-3 transition-all duration-200
                          flex items-center gap-3
                          ${isSelected
                            ? 'bg-blue-50 border-l-4 border-l-blue-500'
                            : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                          }
                        `}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border-2 shrink-0 shadow-sm"
                          style={{
                            backgroundColor: metadata.colorScheme.background,
                            borderColor: getSupportLevelColor(metadata.supportLevel),
                          }}
                        >
                          {metadata.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-gray-900">{profile.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                            <span>{profile.age} år</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span>{profile.grade}</span>
                          </div>
                        </div>
                        {profile.sipActive && (
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            Aktiv plan
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Perspective Switcher */}
          <div className="shrink-0">
            <div className="inline-flex p-1 bg-gray-100 rounded-xl">
              {(Object.keys(PERSPECTIVE_CONFIG) as Perspective[]).map((perspective) => {
                const config = PERSPECTIVE_CONFIG[perspective];
                const Icon = config.icon;
                const isActive = currentPerspective === perspective;

                return (
                  <button
                    key={perspective}
                    onClick={() => onPerspectiveChange(perspective)}
                    className={`
                      flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold
                      transition-all duration-200
                      ${isActive
                        ? `${config.bgActive} ${config.textActive} shadow-md`
                        : `text-gray-600 ${config.bgHover}`
                      }
                    `}
                  >
                    <Icon size={16} className={isActive ? '' : 'opacity-70'} />
                    <span className="hidden sm:inline">{config.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* User Context Strip */}
      <div className={`
        border-t transition-colors
        ${currentPerspective === 'guardian' ? 'bg-blue-50 border-blue-100' : ''}
        ${currentPerspective === 'child' ? 'bg-orange-50 border-orange-100' : ''}
        ${currentPerspective === 'professional' ? 'bg-emerald-50 border-emerald-100' : ''}
      `}>
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex justify-between items-center">
          <div className="flex items-center gap-3 text-sm">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-lg
              ${currentPerspective === 'guardian' ? 'bg-blue-100' : ''}
              ${currentPerspective === 'child' ? 'bg-orange-100' : ''}
              ${currentPerspective === 'professional' ? 'bg-emerald-100' : ''}
            `}>
              {userContext.avatar}
            </div>
            <div>
              <span className="font-medium text-gray-900">{userContext.name}</span>
              <span className={`
                ml-2 text-xs font-bold uppercase px-2 py-0.5 rounded-full
                ${currentPerspective === 'guardian' ? 'bg-blue-100 text-blue-700' : ''}
                ${currentPerspective === 'child' ? 'bg-orange-100 text-orange-700' : ''}
                ${currentPerspective === 'professional' ? 'bg-emerald-100 text-emerald-700' : ''}
              `}>
                {userContext.roleBadge}
              </span>
            </div>
          </div>
          <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <LogOut size={14} />
            <span className="hidden sm:inline font-medium">Logga ut</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
