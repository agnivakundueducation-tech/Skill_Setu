import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-slate-100">
        <div className="flex flex-col items-center max-w-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 mb-6 animate-pulse">
            <Sparkles className="w-7 h-7" />
          </div>
          
          <h2 className="text-xl font-bold tracking-tight text-white mb-2">
            SkillSetu AI
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Authenticating enterprise session & resolving permissions...
          </p>

          <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
            <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-sky-400 animate-pulse rounded-full" />
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secure Firebase Session</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
