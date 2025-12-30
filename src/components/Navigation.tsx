
import React, { useState, useRef, useEffect } from 'react';
import { View, Perspective } from '../types/types';
import {
  LayoutDashboard,
  PieChart,
  FileText,
  Users,
  Database,
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
  X
} from 'lucide-react';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
  currentPerspective?: Perspective;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, currentPerspective }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const tabs: { id: View; label: string; icon: React.ReactNode; hiddenForChild?: boolean; badge?: string; group?: string }[] = [
    { id: 'overview', label: 'Översikt', icon: <LayoutDashboard size={16} />, group: 'main' },

    // WHO ICF Integration (NY!)
    { id: 'icf-demo', label: 'ICF Gap-analys', icon: <Activity size={16} className="text-blue-600" />, badge: '🆕', hiddenForChild: true, group: 'icf' },
    { id: 'icf-n1', label: 'N1 Screening', icon: <Activity size={16} className="text-green-600" />, badge: '🆕', hiddenForChild: true, group: 'icf' },
    { id: 'icf-n2', label: 'N2 Fördjupad', icon: <Activity size={16} className="text-orange-600" />, badge: '🆕', hiddenForChild: true, group: 'icf' },
    { id: 'icf-n3', label: 'N3 Samordnad', icon: <Activity size={16} className="text-red-600" />, badge: '🆕', hiddenForChild: true, group: 'icf' },

    // Barnets Resa Matris - NYA vyer (markerade med badge)
    { id: 'journey-level', label: 'Nivåhantering', icon: <Layers size={16} />, badge: '⭐', hiddenForChild: true, group: 'matris' },
    { id: 'matrix-overview', label: 'Matrisöversikt', icon: <BookOpenCheck size={16} />, badge: '⭐', hiddenForChild: true, group: 'matris' },

    // Ursprungliga vyer
    { id: 'shanarri', label: 'Välbefinnandehjul', icon: <PieChart size={16} />, group: 'views' },
    { id: 'survey', label: 'Min röst', icon: <MessageSquare size={16} className="text-pink-600" />, group: 'views' },
    { id: 'sip', label: 'Min Plan', icon: <FileText size={16} />, group: 'views' },

    // Items hidden for child perspective
    { id: 'lifecourse', label: 'Livslopp', icon: <TrendingUp size={16} className="text-[#005595]" />, hiddenForChild: true, group: 'analysis' },
    { id: 'myworld', label: 'My World', icon: <Globe size={16} className="text-blue-600" />, hiddenForChild: true, group: 'analysis' },
    { id: 'resilience', label: 'Resiliens', icon: <Shield size={16} className="text-green-600" />, hiddenForChild: true, group: 'analysis' },
    { id: 'journal', label: 'Journal', icon: <BookOpen size={16} />, hiddenForChild: true, group: 'analysis' },
    { id: 'quality', label: 'Trygghet', icon: <ClipboardCheck size={16} />, hiddenForChild: true, group: 'analysis' },
    { id: 'ai-analysis', label: 'AI-Analys', icon: <Sparkles size={16} className="text-purple-600" />, hiddenForChild: true, group: 'analysis' },
    { id: 'timeline', label: 'Tidslinje', icon: <Clock size={16} />, hiddenForChild: true, group: 'analysis' },
  ];

  const visibleTabs = currentPerspective === 'child'
    ? tabs.filter(t => !t.hiddenForChild)
    : tabs;

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

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-[105px] z-40 hidden md:block transition-colors">
        <div className="max-w-7xl mx-auto px-4 relative">
          {/* Scroll buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white dark:bg-gray-900 shadow-md rounded-r-lg border border-l-0 border-gray-200 dark:border-gray-700"
              aria-label="Scrolla vänster"
            >
              <ChevronLeft size={20} className="text-gray-500" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white dark:bg-gray-900 shadow-md rounded-l-lg border border-r-0 border-gray-200 dark:border-gray-700"
              aria-label="Scrolla höger"
            >
              <ChevronRight size={20} className="text-gray-500" />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex space-x-1 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onViewChange(tab.id)}
                className={`
                  flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 whitespace-nowrap
                  transition-all duration-200
                  ${currentView === tab.id
                    ? 'border-[#C12143] text-[#C12143] bg-gray-50 dark:bg-gray-800'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                {tab.icon}
                <span className="hide-mobile">{tab.label}</span>
                {tab.badge && <span className="text-xs">{tab.badge}</span>}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-[105px] z-40 md:hidden">
        <div className="px-4 py-2 flex items-center justify-between">
          <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            {visibleTabs.find(t => t.id === currentView)?.icon}
            {visibleTabs.find(t => t.id === currentView)?.label}
          </span>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Öppna meny"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {showMobileMenu && (
          <div className="absolute left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg max-h-[60vh] overflow-y-auto animate-fade-in">
            <div className="p-2 space-y-1">
              {visibleTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    onViewChange(tab.id);
                    setShowMobileMenu(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left
                    transition-colors
                    ${currentView === tab.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                  {tab.badge && <span className="text-xs ml-auto">{tab.badge}</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;
