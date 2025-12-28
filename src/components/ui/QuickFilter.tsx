/**
 * Quick Filter Component
 * Allows filtering children by support level, status, etc.
 */

import React, { useState } from 'react';
import { Filter, X, Users, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';

export type FilterOption = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  count?: number;
};

interface QuickFilterProps {
  filters: FilterOption[];
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
  label?: string;
  multiSelect?: boolean;
}

export const QuickFilter: React.FC<QuickFilterProps> = ({
  filters,
  activeFilters,
  onFilterChange,
  label = 'Filter',
  multiSelect = true
}) => {
  const toggleFilter = (filterId: string) => {
    if (multiSelect) {
      if (activeFilters.includes(filterId)) {
        onFilterChange(activeFilters.filter(f => f !== filterId));
      } else {
        onFilterChange([...activeFilters, filterId]);
      }
    } else {
      onFilterChange(activeFilters.includes(filterId) ? [] : [filterId]);
    }
  };

  const clearFilters = () => {
    onFilterChange([]);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
        <Filter className="w-4 h-4" />
        {label}:
      </span>

      {filters.map(filter => {
        const isActive = activeFilters.includes(filter.id);
        return (
          <button
            key={filter.id}
            onClick={() => toggleFilter(filter.id)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
              transition-all duration-200
              ${isActive
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 ring-1 ring-blue-300 dark:ring-blue-700'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            {filter.icon}
            {filter.label}
            {filter.count !== undefined && (
              <span className={`
                px-1.5 py-0.5 text-xs rounded-full
                ${isActive
                  ? 'bg-blue-200 dark:bg-blue-800'
                  : 'bg-gray-200 dark:bg-gray-700'
                }
              `}>
                {filter.count}
              </span>
            )}
          </button>
        );
      })}

      {activeFilters.length > 0 && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 px-2 py-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-4 h-4" />
          Rensa
        </button>
      )}
    </div>
  );
};

// Preset filter for support levels
export const SupportLevelFilter: React.FC<{
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
  counts?: Record<string, number>;
}> = ({ activeFilters, onFilterChange, counts = {} }) => {
  const filters: FilterOption[] = [
    {
      id: 'universell',
      label: 'Universell',
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
      count: counts.universell
    },
    {
      id: 'stodprofil',
      label: 'Stödprofil',
      icon: <Activity className="w-4 h-4 text-orange-500" />,
      count: counts.stodprofil
    },
    {
      id: 'samordning',
      label: 'Samordning',
      icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
      count: counts.samordning
    }
  ];

  return (
    <QuickFilter
      filters={filters}
      activeFilters={activeFilters}
      onFilterChange={onFilterChange}
      label="Stödnivå"
    />
  );
};

// Preset filter for welfare status
export const WelfareStatusFilter: React.FC<{
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
  counts?: Record<string, number>;
}> = ({ activeFilters, onFilterChange, counts = {} }) => {
  const filters: FilterOption[] = [
    {
      id: 'critical',
      label: 'Kritiskt',
      icon: <div className="w-3 h-3 rounded-full bg-red-500" />,
      count: counts.critical
    },
    {
      id: 'attention',
      label: 'Uppmärksamhet',
      icon: <div className="w-3 h-3 rounded-full bg-yellow-500" />,
      count: counts.attention
    },
    {
      id: 'good',
      label: 'Bra',
      icon: <div className="w-3 h-3 rounded-full bg-green-500" />,
      count: counts.good
    }
  ];

  return (
    <QuickFilter
      filters={filters}
      activeFilters={activeFilters}
      onFilterChange={onFilterChange}
      label="Status"
    />
  );
};

// Search and filter bar component
interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  children?: React.ReactNode;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  children
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Sök barn..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="
            w-full pl-10 pr-4 py-2 rounded-lg
            border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors
          "
        />
        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Filter chips */}
      {children && (
        <div className="flex flex-wrap items-center gap-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default QuickFilter;
