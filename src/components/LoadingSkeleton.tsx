import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Current weather card skeleton */}
      <div className="h-64 bg-slate-800/60 rounded-2xl border border-slate-700/50 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-slate-700/60 rounded-md" />
            <div className="h-4 w-32 bg-slate-700/40 rounded-md" />
          </div>
          <div className="h-8 w-28 bg-slate-700/40 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 flex items-center space-x-6">
            <div className="w-20 h-20 bg-slate-700/60 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-12 w-32 bg-slate-700/60 rounded-md" />
              <div className="h-4 w-44 bg-slate-700/40 rounded-md" />
            </div>
          </div>
          <div className="md:col-span-5 h-24 bg-slate-700/30 rounded-xl" />
        </div>
      </div>

      {/* Intelligence skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-7 h-44 bg-slate-800/60 rounded-xl border border-slate-700/40" />
        <div className="md:col-span-5 h-44 bg-slate-800/60 rounded-xl border border-slate-700/40" />
      </div>

      {/* 3 cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="h-32 bg-slate-800/50 rounded-xl border border-slate-700/40" />
        <div className="h-32 bg-slate-800/50 rounded-xl border border-slate-700/40" />
        <div className="h-32 bg-slate-800/50 rounded-xl border border-slate-700/40" />
      </div>

      {/* 7-Day skeleton */}
      <div className="h-72 bg-slate-800/60 rounded-2xl border border-slate-700/50" />
    </div>
  );
};
