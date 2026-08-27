import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  height?: string | number;
  width?: string | number;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  height,
  width,
  count = 1
}) => {
  const baseClasses = 'animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg';

  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-xl';
      case 'card':
        return 'rounded-2xl border border-slate-200/60 dark:border-slate-800 p-5';
      case 'text':
      default:
        return 'rounded-md h-4';
    }
  };

  const style: React.CSSProperties = {
    height: typeof height === 'number' ? `${height}px` : height,
    width: typeof width === 'number' ? `${width}px` : width,
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${baseClasses} ${getVariantClasses()} ${className}`}
          style={style}
        />
      ))}
    </>
  );
};

export const DashboardCardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="w-16 h-5 rounded-full bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="w-24 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="w-3/4 h-3 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden animate-pulse">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between">
        <div className="w-40 h-5 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="w-24 h-5 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 flex items-center justify-between gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className={`h-4 rounded bg-slate-200 dark:bg-slate-800 ${
                  c === 0 ? 'w-1/3' : 'w-1/6'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
