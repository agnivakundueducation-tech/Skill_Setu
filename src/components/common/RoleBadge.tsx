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
    { label: string; variant: 'primary' | 'emerald' | 'sky' | 'amber'; icon: React.ReactNode }
  > = {
    student: {
      label: 'Student',
      variant: 'primary',
      icon: <GraduationCap className="w-3.5 h-3.5" />
    },
    industry: {
      label: 'Industry Partner',
      variant: 'emerald',
      icon: <Building2 className="w-3.5 h-3.5" />
    },
    academician: {
      label: 'Academician',
      variant: 'sky',
      icon: <BookOpenCheck className="w-3.5 h-3.5" />
    },
    institution: {
      label: 'Institution',
      variant: 'amber',
      icon: <Landmark className="w-3.5 h-3.5" />
    }
  };

  const config = roleConfig[role] || roleConfig.student;

  return (
    <Badge variant={config.variant} size={size} className="gap-1.5 font-medium">
      {showIcon && config.icon}
      {config.label}
    </Badge>
  );
};
