import React from 'react';

export const NearbySkeleton: React.FC = () => {
  return (
    <div className="space-y-4 w-full">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center animate-pulse"
        >
          <div className="flex gap-4 items-start w-full md:w-auto">
            {/* Avatar skeleton */}
            <div className="w-16 h-16 bg-slate-200 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-2 text-right">
              {/* Name skeleton */}
              <div className="h-5 bg-slate-200 rounded-lg w-32" />
              {/* Rating skeleton */}
              <div className="h-3.5 bg-slate-200 rounded-lg w-24" />
              {/* Info row skeleton */}
              <div className="flex gap-2 justify-end md:justify-start">
                <div className="h-3.5 bg-slate-200 rounded-lg w-16" />
                <div className="h-3.5 bg-slate-200 rounded-lg w-16" />
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto space-y-2 flex flex-col items-end shrink-0">
            {/* Action buttons skeleton */}
            <div className="h-10 bg-slate-200 rounded-xl w-full md:w-28" />
            <div className="h-10 bg-slate-200 rounded-xl w-full md:w-28" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default NearbySkeleton;
