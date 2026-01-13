import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="text-center py-6">
        <div className="w-16 h-16 rounded-2xl bg-gray-200 mx-auto mb-4" />
        <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-2" />
        <div className="h-4 w-64 bg-gray-100 rounded mx-auto" />
      </div>

      {/* Main card skeleton */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-48 h-48 rounded-full bg-gray-100" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-100 rounded" />
            <div className="h-4 w-3/4 bg-gray-100 rounded" />
            <div className="flex gap-2 pt-2">
              <div className="h-8 w-20 bg-gray-100 rounded-full" />
              <div className="h-8 w-16 bg-gray-100 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="w-8 h-8 rounded-lg bg-gray-100 mb-3" />
            <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
            <div className="h-6 w-12 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      <div className="flex items-center justify-center gap-2 py-4">
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};

export default Loading;
