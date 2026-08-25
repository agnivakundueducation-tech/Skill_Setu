import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES, MOCK_USERS } from '../data/mockData';
import { UserRole } from '../types';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { DynamicIcon } from '../components/common/IconRenderer';
import { GoogleRoleModal } from '../components/auth/GoogleRoleModal';
import { formatAuthError } from '../utils/firebaseErrors';
import {
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  User,
  KeyRound,
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  AlertCircle,
  Zap,
  Building,
  GraduationCap,
  Loader2,
  RefreshCw
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, signInWithGoogle, completeGoogleProfile, retryProfileHydration, continueAsDemo, appUser } = useAuth();

  // Auth Mode: 'signin' | 'signup'
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up State
  const [signUpFullName, setSignUpFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<UserRole>('student');
  const [signUpInstitution, setSignUpInstitution] = useState('');
  const [signUpDepartment, setSignUpDepartment] = useState('');

  // Demo selection state
  const [demoRole, setDemoRole] = useState<UserRole>('student');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [googleButtonState, setGoogleButtonState] = useState<'idle' | 'connecting' | 'signed_in'>('idle');
  const [profileTimeoutWarning, setProfileTimeoutWarning] = useState<boolean>(false);
  const [isRetryingProfile, setIsRetryingProfile] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [diagnosticCode, setDiagnosticCode] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showGoogleRoleModal, setShowGoogleRoleModal] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const roleOptions: UserRole[] = ['student', 'industry', 'academician', 'institution'];

  // Handle Demo Quick Fill
  const handleSelectDemoPersona = (role: UserRole) => {
    setDemoRole(role);
    setSignInEmail(MOCK_USERS[role].email);
    setSignInPassword('SkillSetuDemo2025!');
  };

  // Handle Email/Password Sign In
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setDiagnosticCode(null);
    setSuccessMessage(null);
    setProfileTimeoutWarning(false);

    if (!signInEmail.trim() || !signInPassword) {
      setErrorMessage('Please provide both your email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signIn({
        email: signInEmail.trim(),
        password: signInPassword,
        role: demoRole
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to sign in. Please check your credentials.');
        if (res.errorCode) {
          setDiagnosticCode(res.errorCode);
        }
        setIsLoading(false);
        return;
      }

      const role = res.data?.role || demoRole;
      const destination = (location.state as any)?.from?.pathname || `/dashboard/${role}`;
      navigate(destination);
    } catch (err) {
      const parsed = formatAuthError(err, 'Sign In Form', Boolean(signInEmail.trim()));
      setErrorMessage(parsed.message);
      setDiagnosticCode(parsed.code);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle User Registration
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setDiagnosticCode(null);
    setSuccessMessage(null);
    setProfileTimeoutWarning(false);

    // Validation 1: Required fields
    if (!signUpFullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!signUpEmail.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    // Validation 2: Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signUpEmail.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    // Validation 3: Password strength
    if (signUpPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    // Validation 4: Password confirmation
    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signUp({
        displayName: signUpFullName.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword,
        role: signUpRole,
        institution: signUpInstitution.trim(),
        department: signUpDepartment.trim()
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Registration failed. Please try again.');
        if (res.errorCode) {
          setDiagnosticCode(res.errorCode);
        }
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Account created successfully! Redirecting to workspace...');
      setTimeout(() => {
        navigate(`/dashboard/${signUpRole}`);
      }, 700);
    } catch (err) {
      const parsed = formatAuthError(err, 'Sign Up Form', Boolean(signUpEmail.trim()));
      setErrorMessage(parsed.message);
      setDiagnosticCode(parsed.code);
      setIsLoading(false);
    }
  };

  // Handle Google Sign In with immediate popup and dedicated loading state
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setDiagnosticCode(null);
    setProfileTimeoutWarning(false);
    setGoogleButtonState('connecting');

    try {
      const res = await signInWithGoogle();
      if (!res.success) {
        setGoogleButtonState('idle');
        setErrorMessage(res.error || 'Google Sign-In failed.');
        if (res.errorCode) {
          setDiagnosticCode(res.errorCode);
        }
        return;
      }

      setGoogleButtonState('signed_in');

      if (res.data?.isNewUser) {
        // Show role selection modal for newly registered Google user
        setShowGoogleRoleModal(true);
      } else {
        const userRole = res.data?.user.role || 'student';
        const destination = (location.state as any)?.from?.pathname || `/dashboard/${userRole}`;
        setTimeout(() => {
          navigate(destination);
        }, 300);
      }
    } catch (err) {
      setGoogleButtonState('idle');
      const parsed = formatAuthError(err, 'Google Sign In');
      setErrorMessage(parsed.message);
      setDiagnosticCode(parsed.code);
    }
  };

  // Retry profile hydration without reopening Google popup
  const handleRetryProfile = async () => {
    setIsRetryingProfile(true);
    setErrorMessage(null);
    setDiagnosticCode(null);
    try {
      const res = await retryProfileHydration();
      if (res.success && res.data) {
        setProfileTimeoutWarning(false);
        if (res.data.isNewUser) {
          setShowGoogleRoleModal(true);
        } else {
          setGoogleButtonState('signed_in');
          const userRole = res.data.user?.role || 'student';
          navigate(`/dashboard/${userRole}`);
        }
      } else {
        setErrorMessage(res.error || 'Could not load workspace profile. Please try again.');
        if (res.errorCode) {
          setDiagnosticCode(res.errorCode);
        }
      }
    } catch (err) {
      const parsed = formatAuthError(err, 'Workspace Loading');
      setErrorMessage(parsed.message);
      setDiagnosticCode(parsed.code);
    } finally {
      setIsRetryingProfile(false);
    }
  };

  // Handle Google Role Confirmation
  const handleGoogleRoleConfirm = async (role: UserRole, details: { institution: string; department: string }) => {
    setIsLoading(true);
    try {
      const res = await completeGoogleProfile(role, details);
      if (!res.success) {
        throw new Error(res.error || 'Failed to update Google user role.');
      }
      setShowGoogleRoleModal(false);
      navigate(`/dashboard/${role}`);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Instant Demo Entry
  const handleInstantDemo = (role: UserRole = demoRole) => {
    continueAsDemo(role);
    navigate(`/dashboard/${role}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between">
      {/* Top Header */}
      <header className="p-4 sm:p-6 flex items-center justify-between max-w-7xl w-full mx-auto">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white tracking-tight text-base">
            SkillSetu AI
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={ChevronLeft}
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg">
          {/* Quick Demo Access Header for SIH Evaluators */}
          <div className="mb-4 p-3 bg-gradient-to-r from-indigo-900/10 via-sky-900/10 to-indigo-900/10 dark:from-indigo-950/50 dark:via-sky-950/30 dark:to-indigo-950/50 rounded-2xl border border-indigo-200/80 dark:border-indigo-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  SIH Evaluator Demo Access
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Explore full platform with pre-populated multi-role data
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant="accent"
              onClick={() => handleInstantDemo(demoRole)}
              className="shrink-0 text-xs shadow-xs"
            >
              Instant Demo
            </Button>
          </div>

          {/* Persona Tab Switcher */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2 text-center">
              Select Demo Persona / Autofill
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              {roleOptions.map((r) => {
                const info = ROLES[r];
                const isSelected = demoRole === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleSelectDemoPersona(r)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <DynamicIcon name={info.iconName} className="w-3.5 h-3.5" />
                    <span className="truncate w-full text-center text-[10px] sm:text-xs">
                      {info.title.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Card variant="elevated" className="border border-slate-200/80 dark:border-slate-800 shadow-xl">
            {/* Tab switch: Sign In vs Register */}
            <div className="flex border-b border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-3.5 text-center text-xs sm:text-sm font-semibold transition-colors border-b-2 ${
                  authMode === 'signin'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/20'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Enterprise Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-3.5 text-center text-xs sm:text-sm font-semibold transition-colors border-b-2 ${
                  authMode === 'signup'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/20'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Register New Account
              </button>
            </div>

            <CardHeader className="text-center pb-2 pt-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2">
                <Lock className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg sm:text-xl">
                {authMode === 'signin' ? 'Firebase Authentication' : 'Create Ecosystem Account'}
              </CardTitle>
              <CardDescription>
                {authMode === 'signin'
                  ? `Access your verified ${ROLES[demoRole].title} portal`
                  : 'Join SkillSetu AI with your institutional or enterprise identity'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Alert Messages */}
              {profileTimeoutWarning && (
                <div className="mb-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-800 dark:text-amber-300 flex flex-col gap-2.5 animate-in fade-in">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span className="font-medium">
                      Firebase Authentication confirmed. Resolving your workspace profile...
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-amber-200/60 dark:border-amber-800/60">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleRetryProfile}
                      isLoading={isRetryingProfile}
                      leftIcon={RefreshCw}
                      className="text-xs py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      Retry Workspace Loading
                    </Button>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 text-xs text-rose-700 dark:text-rose-300 flex flex-col gap-2.5 animate-in fade-in">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                    <div className="flex-1">
                      <p className="font-medium text-rose-800 dark:text-rose-200">{errorMessage}</p>
                      {diagnosticCode && (
                        <div className="mt-1 text-[11px] font-mono text-rose-600 dark:text-rose-400/90 bg-rose-100/70 dark:bg-rose-900/40 px-2 py-0.5 rounded-md w-fit border border-rose-200/80 dark:border-rose-800/60">
                          Diagnostic code: {diagnosticCode}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-rose-200/60 dark:border-rose-800/60 text-[11px]">
                    <span className="text-slate-600 dark:text-slate-400">Want to bypass login?</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleInstantDemo(demoRole)}
                      leftIcon={Zap}
                      className="text-xs py-1 px-2.5 h-7 border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-200 hover:bg-rose-100/60 dark:hover:bg-rose-900/30"
                    >
                      Instant Demo Mode
                    </Button>
                  </div>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-xs text-emerald-600 dark:text-emerald-400 flex items-start gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {authMode === 'signin' ? (
                /* Sign In Form */
                <form onSubmit={handleSignInSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="name@organization.edu"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setSignInPassword('SkillSetuDemo2025!')}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Autofill Demo Pass
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                      />
                      <span>Keep me signed in</span>
                    </label>
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" /> Firebase Auth
                    </span>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isLoading}
                    rightIcon={ArrowRight}
                    className="w-full mt-2"
                  >
                    Sign In to {ROLES[demoRole].title}
                  </Button>
                </form>
              ) : (
                /* Sign Up Form */
                <form onSubmit={handleSignUpSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={signUpFullName}
                        onChange={(e) => setSignUpFullName(e.target.value)}
                        placeholder="Dr. Rajesh Nair / Priya Sharma"
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="name@university.edu"
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Role Selector Grid */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Select Role *
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {roleOptions.map((r) => {
                        const info = ROLES[r];
                        const isSelected = signUpRole === r;
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setSignUpRole(r)}
                            className={`p-2 rounded-xl border text-center transition-all ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span className="text-xs">{info.title.split(' ')[0]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          placeholder="Min 6 chars"
                          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          value={signUpConfirmPassword}
                          onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                          placeholder="Repeat password"
                          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Institution / Company
                      </label>
                      <input
                        type="text"
                        value={signUpInstitution}
                        onChange={(e) => setSignUpInstitution(e.target.value)}
                        placeholder="e.g. Apex University"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        value={signUpDepartment}
                        onChange={(e) => setSignUpDepartment(e.target.value)}
                        placeholder="e.g. Computer Science"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isLoading}
                    rightIcon={ArrowRight}
                    className="w-full mt-2"
                  >
                    Create {ROLES[signUpRole].title} Account
                  </Button>
                </form>
              )}

              {/* Single Sign-On divider */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <span className="relative px-3 bg-white dark:bg-slate-900 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  Or authenticate with
                </span>
              </div>

              {/* Google Sign-In & SSO */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleButtonState === 'connecting'}
                  className={`w-full flex items-center justify-center gap-2.5 p-2.5 rounded-xl border transition-all text-xs font-semibold shadow-2xs ${
                    googleButtonState === 'connecting'
                      ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 cursor-wait'
                      : googleButtonState === 'signed_in'
                      ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {googleButtonState === 'connecting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                      <span>Connecting to Google...</span>
                    </>
                  ) : googleButtonState === 'signed_in' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Signed in ✓</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Continue with Google Sign-In</span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleInstantDemo('institution')}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <Building className="w-3.5 h-3.5 text-indigo-500" />
                    <span>University SSO</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInstantDemo('industry')}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Enterprise SAML</span>
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="justify-center text-xs text-slate-500 dark:text-slate-400 pt-2 pb-4">
              <span>Explore all ecosystem portals:</span>
              <Link to="/roles" className="ml-1 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Browse Role Hub
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Google Role Selection Modal */}
      <GoogleRoleModal
        isOpen={showGoogleRoleModal}
        userName={appUser?.displayName || undefined}
        onSelectRole={handleGoogleRoleConfirm}
        isLoading={isLoading}
      />

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-slate-400 dark:text-slate-600">
        SkillSetu AI • Zero Knowledge Foundation & Firebase Cloud Architecture
      </footer>
    </div>
  );
};
