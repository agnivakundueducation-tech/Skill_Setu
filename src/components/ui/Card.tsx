import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'bordered' | 'interactive' | 'ai' | 'stat';
  isHoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  isHoverable = false,
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-200';

  const variantStyles: Record<string, string> = {
    default: 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs',
    elevated: 'bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-md shadow-slate-900/5 dark:shadow-black/40',
    glass: 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 shadow-2xs',
    bordered: 'bg-transparent border border-slate-200 dark:border-slate-800',
    interactive: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700/60 cursor-pointer',
    ai: 'bg-gradient-to-br from-indigo-50/50 via-white to-sky-50/30 dark:from-indigo-950/30 dark:via-slate-900 dark:to-sky-950/20 border border-indigo-200/70 dark:border-indigo-800/60 shadow-xs shadow-indigo-500/10',
    stat: 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors'
  };

  const hoverStyles = isHoverable ? 'hover:-translate-y-0.5 hover:shadow-md transition-all duration-200' : '';

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
  <div className={`p-6 pb-3 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = '', children, ...props }) => (
  <h3 className={`text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className = '', children, ...props }) => (
  <p className={`text-sm text-slate-500 dark:text-slate-400 mt-1 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
  <div className={`p-6 pt-3 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
  <div className={`p-6 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 mt-4 ${className}`} {...props}>
    {children}
  </div>
);
