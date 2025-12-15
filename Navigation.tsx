
import React from 'react';
import { View, Perspective } from '../types';
import { LayoutDashboard, PieChart, FileText, Users, Database, Clock, ClipboardCheck, Sparkles, BookOpen, TrendingUp, Globe, Shield, MessageSquare } from 'lucide-react';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
  currentPerspective?: Perspective;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, currentPerspective }) => {
  const tabs: { id: View; label: string; icon: React.ReactNode; hiddenForChild?: boolean }[] = [
    { id: 'overview', label: 'Översikt', icon: <LayoutDashboard size={16} /> },
    { id: 'shanarri', label: 'Välbefinnandehjul', icon: <PieChart size={16} /> },
    { id: 'survey', label: 'Min röst', icon: <MessageSquare size={16} className="text-pink-600" /> },
    { id: 'sip', label: 'Min Plan', icon: <FileText size={16} /> },

    // Items hidden for child perspective
    { id: 'lifecourse', label: 'Livsloppsperspektiv', icon: <TrendingUp size={16} className="text-[#005595]" />, hiddenForChild: true },
    { id: 'myworld', label: 'My World Triangle', icon: <Globe size={16} className="text-blue-600" />, hiddenForChild: true },
    { id: 'resilience', label: 'Resilience Matrix', icon: <Shield size={16} className="text-green-600" />, hiddenForChild: true },
    { id: 'journal', label: 'Journal (Domäner)', icon: <BookOpen size={16} />, hiddenForChild: true },
    { id: 'quality', label: 'Systematiskt Trygghetsarbete', icon: <ClipboardCheck size={16} />, hiddenForChild: true },
    { id: 'ai-analysis', label: 'AI-Analys', icon: <Sparkles size={16} className="text-purple-600" />, hiddenForChild: true },
    { id: 'timeline', label: 'Tidslinje', icon: <Clock size={16} />, hiddenForChild: true },
  ];

  const visibleTabs = currentPerspective === 'child' 
    ? tabs.filter(t => !t.hiddenForChild) 
    : tabs;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-[105px] z-40 overflow-x-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-1">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className={`flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                currentView === tab.id
                  ? 'border-[#C12143] text-[#C12143] bg-gray-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
