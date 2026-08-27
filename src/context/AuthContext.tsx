import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { UserRole, UserProfile } from '../types';
import { AppUser, UserProfileDoc, SignInCredentials, SignUpParameters, ServiceResponse } from '../types/firebase';
import { authService, DEFAULT_MOCK_USER } from '../services/authService';
import { MOCK_USERS, ROLES } from '../data/mockData';

export interface AuthContextType {
  // Primary identity
  currentRole: UserRole;
  user: UserProfile; // Backwards-compatible normalized representation
  appUser: AppUser | null;
  userProfile: UserProfileDoc | null;
  
  // State flags
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemo: boolean;
  error: string | null;

  // Actions
  signIn: (credentials: SignInCredentials) => Promise<ServiceResponse<AppUser>>;
  signUp: (params: SignUpParameters) => Promise<ServiceResponse<AppUser>>;
  signInWithGoogle: () => Promise<ServiceResponse<{ user: AppUser; isNewUser: boolean }>>;
  completeGoogleProfile: (role: UserRole, details?: { department?: string; institution?: string }) => Promise<ServiceResponse<AppUser>>;
  retryProfileHydration: () => Promise<ServiceResponse<{ user: AppUser; isNewUser: boolean }>>;
  signOut: () => Promise<void>;
  logout: () => void;
  setRole: (role: UserRole) => void;
  continueAsDemo: (role?: UserRole) => void;
  login: (role: UserRole, email?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState(() => authService.getAuthState());
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    // If initially authenticated, use user's verified role
    const initialAuth = authService.getAuthState();
    if (initialAuth.isAuthenticated && initialAuth.user?.role) {
      return initialAuth.user.role;
    }
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('skillsetu-role') as UserRole | null;
      if (saved && ROLES[saved]) {
        return saved;
      }
    }
    return 'student';
  });

  // Track Firebase auth lifecycle - authenticated profile role is the single source of truth
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((state) => {
      setAuthState(state);
      if (state.isAuthenticated && state.user?.role) {
        setActiveRole(state.user.role);
        localStorage.setItem('skillsetu-role', state.user.role);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync role to localStorage
  useEffect(() => {
    if (activeRole) {
      localStorage.setItem('skillsetu-role', activeRole);
    }
  }, [activeRole]);

  // Sync auth state to localStorage
  useEffect(() => {
    localStorage.setItem('skillsetu-auth', String(authState.isAuthenticated));
    localStorage.setItem('skillsetu-demo', String(authState.isDemo));
  }, [authState.isAuthenticated, authState.isDemo]);

  // Derived immutable role for authenticated sessions
  const currentRole: UserRole = useMemo(() => {
    if (authState.isAuthenticated && authState.user?.role) {
      return authState.user.role;
    }
    return activeRole;
  }, [authState.isAuthenticated, authState.user?.role, activeRole]);

  // Construct UI-compatible UserProfile
  const user: UserProfile = useMemo(() => {
    const fallbackMock = MOCK_USERS[currentRole] || MOCK_USERS.student;
    if (!authState.isAuthenticated || !authState.user) {
      return fallbackMock;
    }

    return {
      id: authState.user.uid,
      name: authState.user.displayName || fallbackMock.name,
      email: authState.user.email || fallbackMock.email,
      role: currentRole,
      avatar: authState.user.photoURL || fallbackMock.avatar,
      organization: authState.userProfile?.institution || authState.user.department || fallbackMock.organization,
      status: 'active',
      completionRate: authState.userProfile?.profileCompleted ? 100 : (fallbackMock.completionRate || 80)
    };
  }, [authState.isAuthenticated, authState.user, authState.userProfile, currentRole]);

  const signIn = useCallback(async (credentials: SignInCredentials) => {
    const res = await authService.signIn(credentials);
    if (res.success && res.data) {
      setActiveRole(res.data.role);
    }
    return res;
  }, []);

  const signUp = useCallback(async (params: SignUpParameters) => {
    const res = await authService.signUp(params);
    if (res.success && res.data) {
      setActiveRole(res.data.role);
    }
    return res;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const res = await authService.signInWithGoogle();
    if (res.success && res.data && !res.data.isNewUser) {
      setActiveRole(res.data.user.role);
    }
    return res;
  }, []);

  const completeGoogleProfile = useCallback(async (role: UserRole, details?: { department?: string; institution?: string }) => {
    const res = await authService.completeGoogleProfile(role, details);
    if (res.success && res.data) {
      setActiveRole(res.data.role);
    }
    return res;
  }, []);

  const retryProfileHydration = useCallback(async () => {
    const res = await authService.retryProfileHydration();
    if (res.success && res.data && !res.data.isNewUser && res.data.user?.role) {
      setActiveRole(res.data.user.role);
    }
    return res;
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    localStorage.removeItem('skillsetu-auth');
    localStorage.removeItem('skillsetu-demo');
    localStorage.removeItem('skillsetu-role');
  }, []);

  const logout = useCallback(() => {
    signOut();
  }, [signOut]);

  // Guarded setRole: Cannot mutate role during an authenticated session
  const setRole = useCallback((role: UserRole) => {
    if (authState.isAuthenticated && authState.user?.role) {
      if (authState.user.role !== role) {
        console.warn(
          `[AuthSecurity] Role mutation to "${role}" blocked. Active session is locked to "${authState.user.role}".`
        );
        return;
      }
    }
    setActiveRole(role);
    localStorage.setItem('skillsetu-role', role);
  }, [authState.isAuthenticated, authState.user?.role]);

  const continueAsDemo = useCallback((role: UserRole = 'student') => {
    setActiveRole(role);
    authService.continueAsDemo(role);
    localStorage.setItem('skillsetu-auth', 'true');
    localStorage.setItem('skillsetu-demo', 'true');
    localStorage.setItem('skillsetu-role', role);
  }, []);

  const login = useCallback((role: UserRole, email?: string) => {
    continueAsDemo(role);
  }, [continueAsDemo]);

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        user,
        appUser: authState.user,
        userProfile: authState.userProfile,
        isAuthenticated: authState.isAuthenticated,
        isLoading: authState.isLoading,
        isDemo: authState.isDemo,
        error: authState.error,
        signIn,
        signUp,
        signInWithGoogle,
        completeGoogleProfile,
        retryProfileHydration,
        signOut,
        logout,
        setRole,
        continueAsDemo,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
