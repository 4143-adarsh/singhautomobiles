import React from 'react';

export function Spinner({ size = 'md' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin`}></div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-video"></div>
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 rounded w-3/4"></div>
        <div className="skeleton h-4 rounded w-1/2"></div>
        <div className="flex gap-2">
          <div className="skeleton h-6 w-16 rounded"></div>
          <div className="skeleton h-6 w-16 rounded"></div>
          <div className="skeleton h-6 w-20 rounded"></div>
        </div>
      </div>
    </div>
  );
}
