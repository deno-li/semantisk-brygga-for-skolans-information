
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Perspective } from '../types/types';
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
  ChevronDown
} from 'lucide-react';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
  currentPerspective?: Perspective;
}

interface TabItem {
  id: View;
  label: string;
  icon: React.ReactNode;
  hiddenForChild?: boolean;
  badge?: string;
  group: string;
  color?: string;
}

interface TabGroup {
  id: string;
  label: string;
  color: string;
  gradient: string;
}

const TAB_GROUPS: TabGroup[] = [
  { id: 'main', label: 'Start', color: 'gray', gradient: 'from-gray-500 to-gray-600' },
  { id: 'views', label: 'Barnets vy', color: 'blue', gradient: 'from-blue-500 to-indigo-600' },
  { id: 'icf', label: 'ICF-verktyg', color: 'emerald', gradient: 'from-emerald-500 to-teal-600' },
  { id: 'matris', label: 'Barnets resa', color: 'purple', gradient: 'from-purple-500 to-pink-600' },
  { id: 'analysis', label: 'Analys', color: 'amber', gradient: 'from-amber-500 to-orange-600' },
];

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, currentPerspective }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Översikt', icon: <LayoutDashboard size={16} />, group: 'main' },

    // Barnets vy
    { id: 'shanarri', label: 'Välbefinnandehjul', icon: <PieChart size={16} />, group: 'views', color: 'blue' },
    { id: 'survey', label: 'Min röst', icon: <MessageSquare size={16} />, group: 'views', color: 'pink' },
    { id: 'sip', label: 'Min Plan', icon: <FileText size={16} />, group: 'views', color: 'indigo' },

    // WHO ICF Integration
    { id: 'icf-demo', label: 'ICF Gap-analys', icon: <Activity size={16} />, badge: '🆕', hiddenForChild: true, group: 'icf', color: 'blue' },
    { id: 'icf-n1', label: 'N1 Screening', icon: <Activity size={16} />, badge: '🆕', hiddenForChild: true, group: 'icf', color: 'green' },
    { id: 'icf-n2', label: 'N2 Fördjupad', icon: <Activity size={16} />, badge: '🆕', hiddenForChild: true, group: 'icf', color: 'orange' },
    { id: 'icf-n3', label: 'N3 Samordnad', icon: <Activity size={16} />, badge: '🆕', hiddenForChild: true, group: 'icf', color: 'red' },

    // Barnets Resa Matris
    { id: 'journey-level', label: 'Nivåhantering', icon: <Layers size={16} />, badge: '⭐', hiddenForChild: true, group: 'matris', color: 'purple' },
    { id: 'matrix-overview', label: 'Matrisöversikt', icon: <BookOpenCheck size={16} />, badge: '⭐', hiddenForChild: true, group: 'matris', color: 'pink' },

    // Analys
    { id: 'lifecourse', label: 'Livslopp', icon: <TrendingUp size={16} />, hiddenForChild: true, group: 'analysis', color: 'blue' },
    { id: 'myworld', label: 'My World', icon: <Globe size={16} />, hiddenForChild: true, group: 'analysis', color: 'cyan' },
    { id: 'resilience', label: 'Resiliens', icon: <Shield size={16} />, hiddenForChild: true, group: 'analysis', color: 'green' },
    { id: 'journal', label: 'Journal', icon: <BookOpen size={16} />, hiddenForChild: true, group: 'analysis', color: 'amber' },
    { id: 'quality', label: 'Trygghet', icon: <ClipboardCheck size={16} />, hiddenForChild: true, group: 'analysis', color: 'teal' },
    { id: 'ai-analysis', label: 'AI-Analys', icon: <Sparkles size={16} />, hiddenForChild: true, group: 'analysis', color: 'violet' },
    { id: 'timeline', label: 'Tidslinje', icon: <Clock size={16} />, hiddenForChild: true, group: 'analysis', color: 'slate' },
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
  }, [currentView]);

  // Check scroll state
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [visibleTabs]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 300);
    }
  };

  const getTabColorClasses = (tab: TabItem, isActive: boolean) => {
    const colorMap: Record<string, { active: string; hover: string }> = {
      blue: { active: 'bg-blue-100 text-blue-700 ring-blue-200', hover: 'hover:bg-blue-50 hover:text-blue-600' },
      pink: { active: 'bg-pink-100 text-pink-700 ring-pink-200', hover: 'hover:bg-pink-50 hover:text-pink-600' },
      indigo: { active: 'bg-indigo-100 text-indigo-700 ring-indigo-200', hover: 'hover:bg-indigo-50 hover:text-indigo-600' },
      green: { active: 'bg-emerald-100 text-emerald-700 ring-emerald-200', hover: 'hover:bg-emerald-50 hover:text-emerald-600' },
      orange: { active: 'bg-orange-100 text-orange-700 ring-orange-200', hover: 'hover:bg-orange-50 hover:text-orange-600' },
      red: { active: 'bg-red-100 text-red-700 ring-red-200', hover: 'hover:bg-red-50 hover:text-red-600' },
      purple: { active: 'bg-purple-100 text-purple-700 ring-purple-200', hover: 'hover:bg-purple-50 hover:text-purple-600' },
      cyan: { active: 'bg-cyan-100 text-cyan-700 ring-cyan-200', hover: 'hover:bg-cyan-50 hover:text-cyan-600' },
      amber: { active: 'bg-amber-100 text-amber-700 ring-amber-200', hover: 'hover:bg-amber-50 hover:text-amber-600' },
      teal: { active: 'bg-teal-100 text-teal-700 ring-teal-200', hover: 'hover:bg-teal-50 hover:text-teal-600' },
      violet: { active: 'bg-violet-100 text-violet-700 ring-violet-200', hover: 'hover:bg-violet-50 hover:text-violet-600' },
      slate: { active: 'bg-slate-100 text-slate-700 ring-slate-200', hover: 'hover:bg-slate-50 hover:text-slate-600' },
      gray: { active: 'bg-gray-100 text-gray-700 ring-gray-200', hover: 'hover:bg-gray-50 hover:text-gray-600' },
    };
    const color = tab.color || 'gray';
    return colorMap[color] || colorMap.gray;
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-[105px] z-40 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 relative">
          {/* Scroll buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white shadow-lg rounded-full border border-gray-200 hover:bg-gray-50 transition-all"
              aria-label="Scrolla vänster"
            >
              <ChevronLeft size={18} className="text-gray-600" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white shadow-lg rounded-full border border-gray-200 hover:bg-gray-50 transition-all"
              aria-label="Scrolla höger"
            >
              <ChevronRight size={18} className="text-gray-600" />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {TAB_GROUPS.filter(g => groupedTabs[g.id]).map((group, groupIndex) => (
              <React.Fragment key={group.id}>
                {/* Group separator */}
                {groupIndex > 0 && (
                  <div className="h-6 w-px bg-gray-200 mx-1 flex-shrink-0" />
                )}

                {/* Group tabs */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {groupedTabs[group.id]?.map((tab) => {
                    const isActive = currentView === tab.id;
                    const colors = getTabColorClasses(tab, isActive);

                    return (
                      <button
                        key={tab.id}
                        onClick={() => onViewChange(tab.id)}
                        className={`
                          group relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                          whitespace-nowrap transition-all duration-200
                          ${isActive
                            ? `${colors.active} ring-1 shadow-sm`
                            : `text-gray-600 ${colors.hover}`
                          }
                        `}
                      >
                        <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                          {tab.icon}
                        </span>
                        <span>{tab.label}</span>
                        {tab.badge && (
                          <span className="text-[10px] -mt-2 -mr-1">{tab.badge}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-[105px] z-40 md:hidden">
        <div className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Current view indicator */}
            {(() => {
              const currentTab = visibleTabs.find(t => t.id === currentView);
              const colors = currentTab ? getTabColorClasses(currentTab, true) : { active: 'bg-gray-100' };
              return (
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${colors.active}`}>
                  {currentTab?.icon}
                  <span className="font-semibold text-sm">{currentTab?.label}</span>
                </div>
              );
            })()}
          </div>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className={`p-2 rounded-xl transition-all ${
              showMobileMenu
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label="Öppna meny"
          >
            {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {showMobileMenu && (
          <div className="absolute left-0 right-0 bg-white border-b border-gray-200 shadow-xl max-h-[70vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
            <div className="p-3 space-y-3">
              {TAB_GROUPS.filter(g => groupedTabs[g.id]).map((group) => (
                <div key={group.id} className="space-y-1">
                  {/* Group header */}
                  <button
                    onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${group.gradient}`} />
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {group.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({groupedTabs[group.id]?.length})
                      </span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform ${
                        expandedGroup === group.id || activeGroup === group.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Group items - expanded by default if active group */}
                  {(expandedGroup === group.id || activeGroup === group.id || expandedGroup === null) && (
                    <div className="grid grid-cols-2 gap-1.5 pl-2">
                      {groupedTabs[group.id]?.map((tab) => {
                        const isActive = currentView === tab.id;
                        const colors = getTabColorClasses(tab, isActive);

                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              onViewChange(tab.id);
                              setShowMobileMenu(false);
                            }}
                            className={`
                              flex items-center gap-2 px-3 py-2.5 rounded-xl text-left
                              transition-all duration-200
                              ${isActive
                                ? `${colors.active} ring-1 shadow-sm`
                                : `text-gray-700 hover:bg-gray-100`
                              }
                            `}
                          >
                            <span className={isActive ? 'scale-110' : ''}>{tab.icon}</span>
                            <span className="font-medium text-sm truncate">{tab.label}</span>
                            {tab.badge && (
                              <span className="text-[10px] ml-auto">{tab.badge}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;
