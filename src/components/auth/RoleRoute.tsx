import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface RoleRouteProps {
  children: React.ReactNode;
}

const VALID_ROLES: UserRole[] = ['student', 'industry', 'academician', 'institution'];

export const RoleRoute: React.FC<RoleRouteProps> = ({ children }) => {
  const { role: urlRole } = useParams<{ role?: string }>();
  const { currentRole, appUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // The authenticated user's verified role is the authoritative source
  const authenticatedRole: UserRole = (appUser?.role as UserRole) || currentRole || 'student';
  const targetRole = urlRole as UserRole;
  const isValidUrlRole = targetRole && VALID_ROLES.includes(targetRole);

  // If URL role is invalid or does NOT strictly match the authenticated user's role,
  // redirect immediately to the user's authorized role portal.
  if (!isValidUrlRole || targetRole !== authenticatedRole) {
    return <Navigate to={`/dashboard/${authenticatedRole}`} replace />;
  }

  return <>{children}</>;
};
