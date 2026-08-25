import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ROLES } from '../../data/mockData';

interface RoleRouteProps {
  children: React.ReactNode;
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ children }) => {
  const { role: urlRole } = useParams<{ role?: string }>();
  const { currentRole, isDemo, setRole } = useAuth();

  const validRoles: UserRole[] = ['student', 'industry', 'academician', 'institution'];
  const targetRole = urlRole as UserRole;

  const isValidRole = targetRole && validRoles.includes(targetRole);

  useEffect(() => {
    // In demo mode, if the user navigates between role URLs, synchronize active role context
    if (isDemo && isValidRole && targetRole !== currentRole) {
      setRole(targetRole);
    }
  }, [isDemo, isValidRole, targetRole, currentRole, setRole]);

  // If role in URL is not a recognized system role, redirect to active role
  if (!isValidRole) {
    return <Navigate to={`/dashboard/${currentRole}`} replace />;
  }

  // In production authenticated mode (non-demo), enforce role boundary isolation
  if (!isDemo && targetRole !== currentRole) {
    return <Navigate to={`/dashboard/${currentRole}`} replace />;
  }

  return <>{children}</>;
};
