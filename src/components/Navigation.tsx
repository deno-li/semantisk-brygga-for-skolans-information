
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Perspective } from '../types/types';
import { ICF_DEMO_PROFILES } from '../data/icf-demo-profiles';
import {
  LayoutDashboard,
  PieChart,
  FileText,
  Clock,
  ClipboardCheck,
  Sparkles,
  BookOpen,
  TrendingUp,
  Globe,
  Shield,
  MessageSquare,
  Layers,
  BookOpenCheck,
  Activity,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ChevronDown,
  CheckCircle2,
  BookMarked,
  Trophy,
  PlayCircle,
  Beaker,
  Home,
  Heart,
  Palette,
  Stethoscope,
  Lightbulb,
  Map,
  BarChart3,
  Star,
  Compass
} from 'lucide-react';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
  currentPerspective?: Perspective;
  selectedProfileId?: string;
}

interface TabItem {
  id: View;
  label: string;
  description?: string;
  icon: React.ReactNode;
  hiddenForChild?: boolean;
  badge?: string;
  group: string;
  color?: string;
  isNew?: boolean;
}

interface TabGroup {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const TAB_GROUPS: TabGroup[] = [
  {
    id: 'main',
    label: 'Start',
    description: 'Översikt och snabbåtkomst',
    icon: <Home size={18} />,
    color: 'gray',
    gradient: 'from-gray-500 to-gray-600'
  },
  {
    id: 'views',
    label: 'Barnets vy',
    description: 'Anpassat för barnet',
    icon: <Heart size={18} />,
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'creative',
    label: 'Kreativt',
    description: 'Interaktiva upplevelser',
    icon: <Palette size={18} />,
    color: 'rose',
    gradient: 'from-rose-500 to-pink-600'
  },
  {
    id: 'icf',
    label: 'ICF-verktyg',
    description: 'WHO ICF-klassificering',
    icon: <Stethoscope size={18} />,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'scenario',
    label: 'Scenarion',
    description: 'Utforska möjligheter',
    icon: <Lightbulb size={18} />,
    color: 'violet',
    gradient: 'from-violet-500 to-purple-600'
  },
  {
    id: 'matris',
    label: 'Barnets resa',
    description: 'Nivåhantering och matris',
    icon: <Map size={18} />,
    color: 'purple',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    id: 'analysis',
    label: 'Analys',
    description: 'Fördjupad analys',
    icon: <BarChart3 size={18} />,
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600'
  },
];

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, currentPerspective, selectedProfileId }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current profile data for dynamic badges
  const profile = selectedProfileId ? ICF_DEMO_PROFILES[selectedProfileId] : null;
  const profileLevel = profile?.level;
  const hasIcfData = profile && 'icfAssessments' in profile && profile.icfAssessments;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine badges based on profile data
  const getIcfBadge = (tabId: string): string | undefined => {
    if (!profileLevel) return undefined;
    switch (tabId) {
      case 'icf-demo':
      case 'icf-n2':
      case 'icf-n3':
        return hasIcfData ? '✓' : undefined;
      case 'icf-n1':
        return '✓';
      default:
        return undefined;
    }
  };

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Översikt', description: 'Barnets samlade bild', icon: <LayoutDashboard size={16} />, group: 'main' },

    // Barnets vy
    { id: 'shanarri', label: 'Välbefinnandehjul', description: 'SHANARRI-bedömning', icon: <PieChart size={16} />, group: 'views', color: 'blue' },
    { id: 'survey', label: 'Min röst', description: 'Barnets egen berättelse', icon: <MessageSquare size={16} />, group: 'views', color: 'pink' },
    { id: 'sip', label: 'Min Plan', description: 'Samordnad planering', icon: <FileText size={16} />, group: 'views', color: 'indigo' },

    // Creative & Interactive Features
    { id: 'storytelling', label: 'Berättelser', description: 'Lär genom berättelser', icon: <BookMarked size={16} />, badge: '📖', group: 'creative', color: 'rose', isNew: true },
    { id: 'gamification', label: 'Prestationer', description: 'Uppdrag och belöningar', icon: <Trophy size={16} />, badge: '🏆', group: 'creative', color: 'amber', isNew: true },
    { id: 'wheel-animation', label: 'Tidslinje', description: 'Animerad utveckling', icon: <PlayCircle size={16} />, badge: '▶️', group: 'creative', color: 'indigo', isNew: true },
    { id: 'intervention-sim', label: 'Simulator', description: 'Testa insatser', icon: <Beaker size={16} />, badge: '🧪', hiddenForChild: true, group: 'creative', color: 'purple', isNew: true },

    // WHO ICF Integration
    { id: 'icf-demo', label: 'ICF Gap-analys', description: 'Performance vs Capacity', icon: <Activity size={16} />, badge: getIcfBadge('icf-demo'), hiddenForChild: true, group: 'icf', color: 'blue' },
    { id: 'icf-n1', label: 'N1 Screening', description: 'Universell screening', icon: <Activity size={16} />, badge: getIcfBadge('icf-n1'), hiddenForChild: true, group: 'icf', color: 'green' },
    { id: 'icf-n2', label: 'N2 Fördjupad', description: 'Riktad analys', icon: <Activity size={16} />, badge: getIcfBadge('icf-n2'), hiddenForChild: true, group: 'icf', color: 'orange' },
    { id: 'icf-n3', label: 'N3 Samordnad', description: 'SIP-nivå', icon: <Activity size={16} />, badge: getIcfBadge('icf-n3'), hiddenForChild: true, group: 'icf', color: 'red' },

    // Scenario Generator
    { id: 'scenario-generator', label: 'Scenarioskiss', description: 'Tänk om...', icon: <Sparkles size={16} />, badge: '✨', hiddenForChild: true, group: 'scenario', color: 'violet' },

    // Barnets Resa Matris
    { id: 'journey-level', label: 'Nivåhantering', description: 'N1, N2, N3 nivåer', icon: <Layers size={16} />, hiddenForChild: true, group: 'matris', color: 'purple' },
    { id: 'matrix-overview', label: 'Matrisöversikt', description: 'Samlad matrisvy', icon: <BookOpenCheck size={16} />, hiddenForChild: true, group: 'matris', color: 'pink' },

    // Analys
    { id: 'lifecourse', label: 'Livslopp', description: 'Utveckling över tid', icon: <TrendingUp size={16} />, hiddenForChild: true, group: 'analysis', color: 'blue' },
    { id: 'myworld', label: 'My World', description: 'Triangelmodellen', icon: <Globe size={16} />, hiddenForChild: true, group: 'analysis', color: 'cyan' },
    { id: 'resilience', label: 'Resiliens', description: 'Skyddsfaktorer', icon: <Shield size={16} />, hiddenForChild: true, group: 'analysis', color: 'green' },
    { id: 'journal', label: 'Journal', description: 'Dokumentation', icon: <BookOpen size={16} />, hiddenForChild: true, group: 'analysis', color: 'amber' },
    { id: 'quality', label: 'Trygghet', description: 'Kvalitetssystem', icon: <ClipboardCheck size={16} />, hiddenForChild: true, group: 'analysis', color: 'teal' },
    { id: 'ai-analysis', label: 'AI-Analys', description: 'Semantisk kodning', icon: <Sparkles size={16} />, hiddenForChild: true, group: 'analysis', color: 'violet' },
    { id: 'timeline', label: 'Tidslinje', description: 'Händelser', icon: <Clock size={16} />, hiddenForChild: true, group: 'analysis', color: 'slate' },
  ];

  const visibleTabs = currentPerspective === 'child'
    ? tabs.filter(t => !t.hiddenForChild)
    : tabs;

  const groupedTabs = useMemo(() => {
    const groups: Record<string, TabItem[]> = {};
    visibleTabs.forEach(tab => {
      if (!groups[tab.group]) groups[tab.group] = [];
      groups[tab.group].push(tab);
    });
    return groups;
  }, [visibleTabs]);

  const activeGroup = useMemo(() => {
    const tab = tabs.find(t => t.id === currentView);
    return tab?.group || 'main';
  }, [currentView, tabs]);

  const currentTab = visibleTabs.find(t => t.id === currentView);

  const getTabColorClasses = (tab: TabItem, isActive: boolean) => {
    const colorMap: Record<string, { active: string; hover: string; bg: string }> = {
      blue: { active: 'bg-blue-100 text-blue-700', hover: 'hover:bg-blue-50 hover:text-blue-600', bg: 'bg-blue-500' },
      pink: { active: 'bg-pink-100 text-pink-700', hover: 'hover:bg-pink-50 hover:text-pink-600', bg: 'bg-pink-500' },
      indigo: { active: 'bg-indigo-100 text-indigo-700', hover: 'hover:bg-indigo-50 hover:text-indigo-600', bg: 'bg-indigo-500' },
      green: { active: 'bg-emerald-100 text-emerald-700', hover: 'hover:bg-emerald-50 hover:text-emerald-600', bg: 'bg-emerald-500' },
      orange: { active: 'bg-orange-100 text-orange-700', hover: 'hover:bg-orange-50 hover:text-orange-600', bg: 'bg-orange-500' },
      red: { active: 'bg-red-100 text-red-700', hover: 'hover:bg-red-50 hover:text-red-600', bg: 'bg-red-500' },
      purple: { active: 'bg-purple-100 text-purple-700', hover: 'hover:bg-purple-50 hover:text-purple-600', bg: 'bg-purple-500' },
      cyan: { active: 'bg-cyan-100 text-cyan-700', hover: 'hover:bg-cyan-50 hover:text-cyan-600', bg: 'bg-cyan-500' },
      amber: { active: 'bg-amber-100 text-amber-700', hover: 'hover:bg-amber-50 hover:text-amber-600', bg: 'bg-amber-500' },
      teal: { active: 'bg-teal-100 text-teal-700', hover: 'hover:bg-teal-50 hover:text-teal-600', bg: 'bg-teal-500' },
      violet: { active: 'bg-violet-100 text-violet-700', hover: 'hover:bg-violet-50 hover:text-violet-600', bg: 'bg-violet-500' },
      slate: { active: 'bg-slate-100 text-slate-700', hover: 'hover:bg-slate-50 hover:text-slate-600', bg: 'bg-slate-500' },
      gray: { active: 'bg-gray-100 text-gray-700', hover: 'hover:bg-gray-50 hover:text-gray-600', bg: 'bg-gray-500' },
      rose: { active: 'bg-rose-100 text-rose-700', hover: 'hover:bg-rose-50 hover:text-rose-600', bg: 'bg-rose-500' },
    };
    const color = tab.color || 'gray';
    return colorMap[color] || colorMap.gray;
  };

  const getGroupColorClasses = (group: TabGroup) => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      gray: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
      rose: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
      emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
      violet: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
      amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
    };
    return colorMap[group.color] || colorMap.gray;
  };

  return (
    <>
      {/* Desktop Navigation - Mega Menu Style */}
      <nav className="bg-white border-b border-gray-100 sticky top-[105px] z-40 hidden md:block" ref={dropdownRef}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 py-2">
            {/* Home button */}
            <button
              onClick={() => onViewChange('overview')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                currentView === 'overview'
                  ? 'bg-gray-100 text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Home size={18} />
              <span>Översikt</span>
            </button>

            <div className="w-px h-6 bg-gray-200 mx-2" />

            {/* Category dropdowns */}
            {TAB_GROUPS.filter(g => g.id !== 'main' && groupedTabs[g.id]).map((group) => {
              const isActive = activeGroup === group.id;
              const isOpen = activeDropdown === group.id;
              const groupColors = getGroupColorClasses(group);
              const groupTabs = groupedTabs[group.id] || [];

              return (
                <div key={group.id} className="relative">
                  <button
                    onClick={() => setActiveDropdown(isOpen ? null : group.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                      isActive
                        ? `${groupColors.bg} ${groupColors.text}`
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } ${isOpen ? 'ring-2 ring-offset-1 ring-gray-300' : ''}`}
                  >
                    {group.icon}
                    <span>{group.label}</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                    {groupTabs.some(t => t.isNew) && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                    )}
                  </button>

                  {/* Dropdown panel */}
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                      {/* Group header */}
                      <div className={`px-4 py-3 border-b ${groupColors.border} bg-gradient-to-r ${group.gradient} text-white`}>
                        <div className="flex items-center gap-2">
                          {group.icon}
                          <div>
                            <h3 className="font-semibold">{group.label}</h3>
                            <p className="text-xs opacity-90">{group.description}</p>
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="p-2 max-h-[400px] overflow-y-auto">
                        {groupTabs.map((tab) => {
                          const isTabActive = currentView === tab.id;
                          const colors = getTabColorClasses(tab, isTabActive);

                          return (
                            <button
                              key={tab.id}
                              onClick={() => {
                                onViewChange(tab.id);
                                setActiveDropdown(null);
                              }}
                              className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                                isTabActive
                                  ? `${colors.active} shadow-sm`
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className={`p-2 rounded-lg ${isTabActive ? 'bg-white/50' : 'bg-gray-100'}`}>
                                {tab.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={`font-medium ${isTabActive ? '' : 'text-gray-900'}`}>
                                    {tab.label}
                                  </span>
                                  {tab.badge && (
                                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                                      tab.badge === '✓'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-gray-100'
                                    }`}>
                                      {tab.badge}
                                    </span>
                                  )}
                                  {tab.isNew && (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-rose-500 text-white rounded-full font-medium">
                                      NY
                                    </span>
                                  )}
                                </div>
                                {tab.description && (
                                  <p className="text-xs text-gray-500 mt-0.5">{tab.description}</p>
                                )}
                              </div>
                              {isTabActive && (
                                <CheckCircle2 size={16} className="text-current opacity-70 mt-1" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Current view breadcrumb */}
            {currentTab && currentView !== 'overview' && (
              <>
                <div className="flex-1" />
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Compass size={14} />
                  <span>
                    {TAB_GROUPS.find(g => g.id === activeGroup)?.label}
                  </span>
                  <ChevronRight size={14} />
                  <span className="font-medium text-gray-900">{currentTab.label}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom Sheet Style */}
      <nav className="bg-white border-b border-gray-100 sticky top-[105px] z-40 md:hidden">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Current view indicator */}
          <div className="flex items-center gap-3">
            {currentTab && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                getTabColorClasses(currentTab, true).active
              }`}>
                {currentTab.icon}
                <div>
                  <span className="font-medium text-sm block">{currentTab.label}</span>
                  {currentTab.description && (
                    <span className="text-xs opacity-70">{currentTab.description}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              showMobileMenu
                ? 'bg-gray-900 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            aria-label="Öppna meny"
          >
            {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile full-screen menu */}
        {showMobileMenu && (
          <div className="fixed inset-0 top-[105px] bg-white z-50 overflow-y-auto animate-in fade-in duration-200">
            <div className="p-4 space-y-4 pb-24">
              {/* Quick access - Home */}
              <button
                onClick={() => {
                  onViewChange('overview');
                  setShowMobileMenu(false);
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  currentView === 'overview'
                    ? 'bg-gray-100 shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white">
                  <Home size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Översikt</h3>
                  <p className="text-sm text-gray-500">Barnets samlade bild</p>
                </div>
                {currentView === 'overview' && (
                  <CheckCircle2 size={20} className="ml-auto text-gray-600" />
                )}
              </button>

              {/* Category sections */}
              {TAB_GROUPS.filter(g => g.id !== 'main' && groupedTabs[g.id]).map((group) => {
                const isExpanded = expandedGroup === group.id || activeGroup === group.id;
                const groupTabs = groupedTabs[group.id] || [];
                const hasNewItems = groupTabs.some(t => t.isNew);

                return (
                  <div key={group.id} className="space-y-2">
                    {/* Group header */}
                    <button
                      onClick={() => setExpandedGroup(isExpanded && expandedGroup === group.id ? null : group.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                        activeGroup === group.id
                          ? `bg-gradient-to-r ${group.gradient} text-white shadow-lg`
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        activeGroup === group.id
                          ? 'bg-white/20'
                          : `bg-gradient-to-br ${group.gradient} text-white`
                      }`}>
                        {group.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${activeGroup === group.id ? 'text-white' : 'text-gray-900'}`}>
                            {group.label}
                          </h3>
                          {hasNewItems && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                              activeGroup === group.id
                                ? 'bg-white/20 text-white'
                                : 'bg-rose-500 text-white'
                            }`}>
                              NY
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${activeGroup === group.id ? 'text-white/80' : 'text-gray-500'}`}>
                          {group.description}
                        </p>
                      </div>
                      <ChevronDown
                        size={20}
                        className={`transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        } ${activeGroup === group.id ? 'text-white' : 'text-gray-400'}`}
                      />
                    </button>

                    {/* Group items */}
                    {isExpanded && (
                      <div className="grid grid-cols-1 gap-2 pl-4 animate-in slide-in-from-top-2 duration-200">
                        {groupTabs.map((tab) => {
                          const isTabActive = currentView === tab.id;
                          const colors = getTabColorClasses(tab, isTabActive);

                          return (
                            <button
                              key={tab.id}
                              onClick={() => {
                                onViewChange(tab.id);
                                setShowMobileMenu(false);
                              }}
                              className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                                isTabActive
                                  ? `${colors.active} shadow-sm`
                                  : 'bg-white border border-gray-100 hover:border-gray-200'
                              }`}
                            >
                              <div className={`p-2 rounded-lg ${
                                isTabActive ? 'bg-white/50' : 'bg-gray-50'
                              }`}>
                                {tab.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={`font-medium text-sm ${isTabActive ? '' : 'text-gray-900'}`}>
                                    {tab.label}
                                  </span>
                                  {tab.badge && (
                                    <span className={`text-xs ${
                                      tab.badge === '✓'
                                        ? 'text-emerald-600'
                                        : ''
                                    }`}>
                                      {tab.badge}
                                    </span>
                                  )}
                                  {tab.isNew && (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-rose-500 text-white rounded-full">
                                      NY
                                    </span>
                                  )}
                                </div>
                                {tab.description && (
                                  <p className="text-xs text-gray-500">{tab.description}</p>
                                )}
                              </div>
                              {isTabActive && (
                                <CheckCircle2 size={16} className="text-current opacity-70" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;
