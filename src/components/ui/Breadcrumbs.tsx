/**
 * Breadcrumbs Component
 * Shows navigation path through ICF workflow (N1 → N2 → N3)
 */

import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { View } from '../../types/types';

interface BreadcrumbItem {
  id: View;
  label: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

// Define the ICF workflow hierarchy
const ICF_FLOW: BreadcrumbItem[] = [
  { id: 'overview', label: 'Översikt' },
  { id: 'icf-n1', label: 'N1 Screening' },
  { id: 'icf-n2', label: 'N2 Fördjupad' },
  { id: 'icf-n3', label: 'N3 Samordnad' }
];

// Map views to their workflow position
const VIEW_WORKFLOW_MAP: Record<string, BreadcrumbItem[]> = {
  'overview': [ICF_FLOW[0]],
  'icf-demo': [ICF_FLOW[0], { id: 'icf-demo', label: 'ICF Demo' }],
  'icf-n1': [ICF_FLOW[0], ICF_FLOW[1]],
  'icf-n2': [ICF_FLOW[0], ICF_FLOW[1], ICF_FLOW[2]],
  'icf-n3': [ICF_FLOW[0], ICF_FLOW[1], ICF_FLOW[2], ICF_FLOW[3]],
  'journey-level': [ICF_FLOW[0], { id: 'journey-level', label: 'Nivåhantering' }],
  'optimal-wheel': [ICF_FLOW[0], { id: 'optimal-wheel', label: 'Välbefinnandehjul' }],
  'matrix-overview': [ICF_FLOW[0], { id: 'matrix-overview', label: 'Matrisöversikt' }],
  'shanarri': [ICF_FLOW[0], { id: 'shanarri', label: 'SHANARRI' }],
  'sip': [ICF_FLOW[0], { id: 'sip', label: 'Min Plan' }],
  'survey': [ICF_FLOW[0], { id: 'survey', label: 'Min röst' }],
  'lifecourse': [ICF_FLOW[0], { id: 'lifecourse', label: 'Livsloppsperspektiv' }],
  'quality': [ICF_FLOW[0], { id: 'quality', label: 'Trygghetsarbete' }],
  'ai-analysis': [ICF_FLOW[0], { id: 'ai-analysis', label: 'AI-Analys' }],
  'timeline': [ICF_FLOW[0], { id: 'timeline', label: 'Tidslinje' }],
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentView, onNavigate }) => {
  const breadcrumbs = VIEW_WORKFLOW_MAP[currentView] || [ICF_FLOW[0]];

  // Don't show breadcrumbs on overview
  if (currentView === 'overview') {
    return null;
  }

  return (
    <nav
      aria-label="Brödsmulor"
      className="flex items-center gap-1 text-sm mb-4 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <button
        onClick={() => onNavigate('overview')}
        className="flex items-center gap-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        aria-label="Gå till översikt"
      >
        <Home className="w-4 h-4" />
      </button>

      {breadcrumbs.slice(1).map((item, index) => {
        const isLast = index === breadcrumbs.length - 2;
        const isClickable = !isLast;

        return (
          <React.Fragment key={item.id}>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {isClickable ? (
              <button
                onClick={() => onNavigate(item.id)}
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

// ICF Workflow Progress Indicator
export const ICFWorkflowProgress: React.FC<{
  currentStep: 'n1' | 'n2' | 'n3';
  onNavigate: (view: View) => void;
}> = ({ currentStep, onNavigate }) => {
  const steps = [
    { id: 'icf-n1' as View, label: 'N1', fullLabel: 'Screening', step: 'n1' },
    { id: 'icf-n2' as View, label: 'N2', fullLabel: 'Fördjupad', step: 'n2' },
    { id: 'icf-n3' as View, label: 'N3', fullLabel: 'Samordnad', step: 'n3' }
  ];

  const currentIndex = steps.findIndex(s => s.step === currentStep);

  return (
    <div className="flex items-center justify-center gap-2 py-3">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isUpcoming = index > currentIndex;

        return (
          <React.Fragment key={step.id}>
            {index > 0 && (
              <div
                className={`h-0.5 w-12 transition-colors ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            )}
            <button
              onClick={() => onNavigate(step.id)}
              disabled={isUpcoming}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all
                ${isCurrent ? 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500' : ''}
                ${isCompleted ? 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20' : ''}
                ${isUpcoming ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${isCurrent ? 'bg-blue-500 text-white' : ''}
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${isUpcoming ? 'bg-gray-200 dark:bg-gray-700 text-gray-400' : ''}
                `}
              >
                {step.label}
              </div>
              <span className="text-xs font-medium">{step.fullLabel}</span>
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
