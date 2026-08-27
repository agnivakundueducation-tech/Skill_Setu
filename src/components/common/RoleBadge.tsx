import React from 'react';
import { UserRole } from '../../types';
import { Badge } from '../ui/Badge';
import { GraduationCap, Building2, BookOpenCheck, Landmark } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md', showIcon = true }) => {
  const roleConfig: Record<
    UserRole,
    { label: string; variant: 'primary' | 'emerald' | 'sky' | 'amber'; icon: React.ReactNode; customClasses: string }
  > = {
    student: {
      label: 'Student',
      variant: 'primary',
      icon: <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />,
      customClasses: 'bg-indigo-50/90 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/80 shadow-2xs'
    },
    industry: {
      label: 'Industry Partner',
      variant: 'emerald',
      icon: <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
      customClasses: 'bg-emerald-50/90 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs'
    },
    academician: {
      label: 'Academician',
      variant: 'sky',
      icon: <BookOpenCheck className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />,
      customClasses: 'bg-sky-50/90 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 border-sky-200/80 dark:border-sky-800/80 shadow-2xs'
    },
    institution: {
      label: 'Institution',
      variant: 'amber',
      icon: <Landmark className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
      customClasses: 'bg-amber-50/90 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/80 shadow-2xs'
    }
  };

  const config = roleConfig[role] || roleConfig.student;

  return (
    <Badge variant={config.variant} size={size} className={`gap-1.5 font-semibold ${config.customClasses}`}>
      {showIcon && config.icon}
      {config.label}
    </Badge>
  );
};
