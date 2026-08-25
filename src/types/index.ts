export type UserRole = 'student' | 'industry' | 'academician' | 'institution';
export * from './opportunity';
export * from './application';
export * from './demand';
export * from './collaboration';
export * from './intervention';

export interface RoleInfo {
  id: UserRole;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  iconName: string;
  color: {
    primary: string;
    light: string;
    darkBg: string;
    border: string;
    accentText: string;
  };
  features: string[];
  stats: {
    label: string;
    value: string;
  }[];
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: string;
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'info';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  organization?: string;
  status: 'active' | 'offline' | 'busy';
  completionRate?: number;
}

export interface MetricCardData {
  id: string;
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  description?: string;
  icon: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  status: 'completed' | 'in-progress' | 'pending' | 'urgent';
  tag: string;
}

export * from './firebase';

