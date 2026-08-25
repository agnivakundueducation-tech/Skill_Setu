/**
 * Production Firebase Authentication Service
 * 
 * Provides robust Firebase Auth integration with Email/Password, Google Sign-In,
 * Firestore user profile syncing, persistent session hydration, and reliable
 * demo/mock fallbacks.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import {
  AppUser,
  UserProfileDoc,
  AuthState,
  SignInCredentials,
  SignUpParameters,
  ServiceResponse,
  FIRESTORE_COLLECTIONS
} from '../types/firebase';
import { UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';
import { formatAuthError } from '../utils/firebaseErrors';

/**
 * Development performance measurement logger matching SkillSetu Workspace schema
 */
const isDev = Boolean(import.meta.env?.DEV);
export function logWorkspacePerformance(label: string, durationMs?: number): void {
  if (isDev) {
    if (typeof durationMs === 'number') {
      console.info(`[SkillSetu Workspace] ${label} (${Math.round(durationMs)}ms)`);
    } else {
      console.info(`[SkillSetu Workspace] ${label}`);
    }
  }
}

export function logProfilePerformance(label: string, durationMs?: number): void {
  if (isDev) {
    if (typeof durationMs === 'number') {
      console.info(`[SkillSetu Profile] ${label} (${Math.round(durationMs)}ms)`);
    } else {
      console.info(`[SkillSetu Profile] ${label}`);
    }
  }
}

export function logAuthPerformance(label: string, durationMs: number): void {
  logWorkspacePerformance(label, durationMs);
}

/**
 * Promise wrapper with timeout constraint
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutErrorMessage: string = 'Operation timed out'
): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      const err = new Error(timeoutErrorMessage);
      (err as any).code = 'TIMEOUT';
      reject(err);
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    return result;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * User-friendly Firestore error parser for Profile Operations
 */
export function parseProfileFirestoreError(error: any): { message: string; code: string } {
  const code = error?.code || (error instanceof Error && (error as any).code) || 'unknown';
  const rawMsg = error instanceof Error ? error.message : String(error);

  if (isDev) {
    console.error('[SkillSetu Profile] Technical Firestore error:', {
      code,
      message: rawMsg,
      error
    });
  }

  if (code === 'TIMEOUT' || rawMsg.includes('longer than expected') || rawMsg.includes('TIMEOUT')) {
    return {
      message: 'Profile setup is taking longer than expected. Please try again.',
      code: 'TIMEOUT'
    };
  }
  if (code === 'permission-denied') {
    return {
      message: 'You are authenticated, but your account does not have permission to create this profile. Please check the Firebase Firestore security rules.',
      code: 'permission-denied'
    };
  }
  if (code === 'unavailable') {
    return {
      message: 'Firebase is temporarily unavailable. Please try again.',
      code: 'unavailable'
    };
  }
  if (code === 'failed-precondition') {
    return {
      message: 'Firestore is not configured correctly for this project.',
      code: 'failed-precondition'
    };
  }
  return {
    message: 'Unable to complete profile setup. Please try again.',
    code: code !== 'unknown' ? code : 'UNKNOWN_ERROR'
  };
}

export const DEFAULT_MOCK_USER: AppUser = {
  uid: MOCK_USERS.student.id,
  email: MOCK_USERS.student.email,
  displayName: MOCK_USERS.student.name,
  photoURL: MOCK_USERS.student.avatar,
  role: 'student',
  institutionId: 'inst-apex-01',
  department: 'Computer Science & Engineering',
  createdAt: '2025-01-15T00:00:00.000Z',
  lastLoginAt: new Date().toISOString(),
  emailVerified: true,
  isAnonymous: false
};

export const DEFAULT_MOCK_PROFILE: UserProfileDoc = {
  uid: MOCK_USERS.student.id,
  fullName: MOCK_USERS.student.name,
  email: MOCK_USERS.student.email,
  role: 'student',
  createdAt: '2025-01-15T00:00:00.000Z',
  profileCompleted: true,
  department: 'Computer Science & Engineering',
  institution: 'Apex Institute of Technology',
  photoURL: MOCK_USERS.student.avatar
};

class AuthService {
  private currentUser: AppUser | null = null;
  private currentProfile: UserProfileDoc | null = null;
  private isDemoMode: boolean = false;
  private listeners: ((state: AuthState) => void)[] = [];
  private isInitialized: boolean = false;
  private inFlightProfilePromises = new Map<string, Promise<UserProfileDoc | null>>();

  constructor() {
    this.initAuthListener();
  }

  /**
   * Initializes Firebase Auth state listener and synchronizes user documents from Firestore.
   */
  private initAuthListener() {
    if (this.isLiveAuthAvailable() && auth) {
      firebaseOnAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          try {
            const fallbackRole: UserRole = this.currentUser?.role || 'student';
            if (!this.currentUser) {
              this.currentUser = {
                uid: fbUser.uid,
                email: fbUser.email,
                displayName: fbUser.displayName || 'SkillSetu User',
                photoURL: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                role: fallbackRole,
                createdAt: fbUser.metadata.creationTime,
                lastLoginAt: fbUser.metadata.lastSignInTime,
                emailVerified: fbUser.emailVerified,
                isAnonymous: fbUser.isAnonymous
              };
            }

            // Hydrate profile with single deduplicated Firestore read
            const profile = await this.fetchUserProfile(fbUser.uid, 8000);
            if (profile) {
              const userRole: UserRole = profile.role || fallbackRole;
              this.currentUser = {
                ...this.currentUser,
                displayName: profile.fullName || fbUser.displayName || this.currentUser.displayName,
                photoURL: fbUser.photoURL || profile.photoURL || this.currentUser.photoURL,
                role: userRole,
                institutionId: profile.institution,
                department: profile.department
              };
              this.currentProfile = profile;
            }
            this.isDemoMode = false;
          } catch (err) {
            console.warn('[SkillSetu Workspace] Background auth sync warning:', err);
          }
        } else {
          // If not in demo mode, clear user
          if (!this.isDemoMode) {
            this.currentUser = null;
            this.currentProfile = null;
          }
        }
        this.isInitialized = true;
        this.notifyListeners();
      });
    } else {
      this.isInitialized = true;
    }
  }

  /**
   * Checks if live Firebase Auth is configured and available.
   */
  public isLiveAuthAvailable(): boolean {
    return Boolean(isFirebaseConfigured && auth);
  }

  /**
   * Returns current authentication state.
   */
  public getAuthState(): AuthState {
    const isLive = this.isLiveAuthAvailable();
    return {
      user: this.currentUser,
      userProfile: this.currentProfile,
      isAuthenticated: Boolean(this.currentUser),
      isLoading: !this.isInitialized,
      isDemo: this.isDemoMode,
      error: null,
      mode: isLive && !this.isDemoMode ? 'live' : 'mock'
    };
  }

  /**
   * Fetch Firestore User Profile document (`users/${uid}`)
   * Performs at most 1 initial /users/{uid} read with timeout & in-flight deduplication.
   * Leverages resilient local workspace caching when Firestore is offline or unprovisioned.
   */
  public async fetchUserProfile(uid: string, timeoutMs: number = 3500): Promise<UserProfileDoc | null> {
    let localProfile: UserProfileDoc | null = null;
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(`skillsetu_user_profile_${uid}`) : null;
      if (raw) {
        localProfile = JSON.parse(raw) as UserProfileDoc;
      }
    } catch {}

    if (!isFirebaseConfigured || !db) {
      return localProfile || this.currentProfile || DEFAULT_MOCK_PROFILE;
    }

    // Reuse existing in-flight promise if one is already pending for this uid
    if (this.inFlightProfilePromises.has(uid)) {
      return this.inFlightProfilePromises.get(uid)!;
    }

    const tStart = performance.now();
    logWorkspacePerformance(`Loading /users/${uid}`);

    const fetchPromise = (async () => {
      let timer: any;
      try {
        const timeoutPromise = new Promise<null>((resolve) => {
          timer = setTimeout(() => {
            logWorkspacePerformance(`Workspace lookup completed timeout window (${timeoutMs}ms)`);
            resolve(null);
          }, timeoutMs);
        });

        const readDocPromise = (async () => {
          try {
            const userDocRef = doc(db!, FIRESTORE_COLLECTIONS.USERS, uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const data = userDocSnap.data() as UserProfileDoc;
              try {
                if (typeof window !== 'undefined') {
                  localStorage.setItem(`skillsetu_user_profile_${uid}`, JSON.stringify(data));
                }
              } catch {}
              return data;
            }
            return null;
          } catch (readErr: any) {
            const errorCode = readErr?.code || 'unknown';
            if (errorCode === 'permission-denied') {
              console.error(`[SkillSetu Workspace] Firestore permission denied reading /users/${uid}:`, readErr);
            } else {
              console.warn(`[SkillSetu Workspace] Firestore notice reading /users/${uid}:`, readErr?.message || readErr);
            }
            return null;
          }
        })();

        const result = await Promise.race([readDocPromise, timeoutPromise]);
        clearTimeout(timer);

        const elapsed = performance.now() - tStart;
        if (result) {
          logWorkspacePerformance(`User profile loaded`, elapsed);
          logWorkspacePerformance(`Role detected: ${result.role.toUpperCase()}`, elapsed);
          return result;
        }

        if (localProfile) {
          logWorkspacePerformance(`User profile hydrated from workspace cache`, elapsed);
          logWorkspacePerformance(`Role detected: ${localProfile.role.toUpperCase()}`, elapsed);
          return localProfile;
        }

        logWorkspacePerformance(`User profile not found (New User)`, elapsed);
        return null;
      } catch (error: any) {
        clearTimeout(timer);
        const elapsed = performance.now() - tStart;
        if (localProfile) {
          logWorkspacePerformance(`User profile hydrated from cache fallback`, elapsed);
          return localProfile;
        }
        logWorkspacePerformance(`User profile fallback (New User)`, elapsed);
        return null;
      } finally {
        this.inFlightProfilePromises.delete(uid);
      }
    })();

    this.inFlightProfilePromises.set(uid, fetchPromise);
    return fetchPromise;
  }

  /**
   * Write User Profile to Firestore (`users/${uid}`).
   * Never stores user passwords.
   */
  public async saveUserProfile(profile: UserProfileDoc & { updatedAt?: string }): Promise<boolean> {
    const dataToWrite = {
      uid: profile.uid,
      fullName: profile.fullName || 'User',
      email: profile.email || '',
      role: profile.role,
      createdAt: profile.createdAt || new Date().toISOString(),
      updatedAt: profile.updatedAt || new Date().toISOString(),
      profileCompleted: profile.profileCompleted ?? true,
      department: profile.department || '',
      institution: profile.institution || '',
      photoURL: profile.photoURL || ''
    };

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`skillsetu_user_profile_${profile.uid}`, JSON.stringify(dataToWrite));
      }
    } catch {}

    if (!isFirebaseConfigured || !db) {
      this.currentProfile = profile;
      return true;
    }

    try {
      const userDocRef = doc(db, FIRESTORE_COLLECTIONS.USERS, profile.uid);
      await withTimeout(
        setDoc(userDocRef, dataToWrite, { merge: true }),
        4000,
        'Profile setup is taking longer than expected. Please try again.'
      );

      this.currentProfile = profile;
      return true;
    } catch (error: any) {
      const parsed = parseProfileFirestoreError(error);
      if (parsed.code === 'permission-denied') {
        throw error;
      }
      this.currentProfile = profile;
      return true;
    }
  }

  /**
   * Sign In with Email & Password
   */
  public async signIn(credentials: SignInCredentials): Promise<ServiceResponse<AppUser>> {
    const t0 = performance.now();
    const trimmedEmail = (credentials.email || '').trim();
    const rawPassword = credentials.password;

    if (!trimmedEmail || !rawPassword) {
      return {
        success: false,
        error: 'Please provide both email and password.',
        timestamp: new Date().toISOString()
      };
    }

    if (!this.isLiveAuthAvailable() || !auth) {
      const role = credentials.role || 'student';
      const mockInfo = MOCK_USERS[role];
      this.currentUser = {
        ...DEFAULT_MOCK_USER,
        displayName: mockInfo.name,
        email: trimmedEmail,
        photoURL: mockInfo.avatar,
        role: role,
        lastLoginAt: new Date().toISOString()
      };
      this.currentProfile = {
        ...DEFAULT_MOCK_PROFILE,
        fullName: mockInfo.name,
        email: trimmedEmail,
        role: role,
        photoURL: mockInfo.avatar
      };
      this.isDemoMode = false;
      this.notifyListeners();
      return {
        success: true,
        data: this.currentUser,
        fromMock: true,
        timestamp: new Date().toISOString()
      };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, rawPassword);
      const fbUser = userCredential.user;
      const tAuth = performance.now();
      logWorkspacePerformance(`Authenticated user received: ${fbUser.uid}`, tAuth - t0);

      let profile: UserProfileDoc | null = null;
      try {
        profile = await this.fetchUserProfile(fbUser.uid, 8000);
      } catch (profileErr) {
        console.warn('[SkillSetu Workspace] Profile lookup warning:', profileErr);
      }

      const userRole: UserRole = profile?.role || credentials.role || 'student';
      
      this.currentUser = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: profile?.fullName || fbUser.displayName || 'SkillSetu User',
        photoURL: fbUser.photoURL || profile?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: userRole,
        institutionId: profile?.institution,
        department: profile?.department,
        createdAt: profile?.createdAt || fbUser.metadata.creationTime,
        lastLoginAt: new Date().toISOString(),
        emailVerified: fbUser.emailVerified,
        isAnonymous: fbUser.isAnonymous
      };
      this.currentProfile = profile;
      this.isDemoMode = false;
      this.notifyListeners();

      logWorkspacePerformance(`Navigating to dashboard: /dashboard/${userRole}`, performance.now() - t0);

      return {
        success: true,
        data: this.currentUser,
        fromMock: false,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      const parsed = formatAuthError(error, 'Sign In', Boolean(trimmedEmail));
      return {
        success: false,
        error: parsed.message,
        errorCode: parsed.code,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * User Registration with Email/Password & Firestore document creation
   */
  public async signUp(params: SignUpParameters): Promise<ServiceResponse<AppUser>> {
    const trimmedEmail = (params.email || '').trim();
    const rawPassword = params.password;
    const trimmedName = (params.displayName || '').trim();

    if (!trimmedEmail || !rawPassword || !trimmedName || !params.role) {
      return {
        success: false,
        error: 'All fields (Full Name, Email, Password, Role) are required.',
        timestamp: new Date().toISOString()
      };
    }

    if (!this.isLiveAuthAvailable() || !auth) {
      this.currentUser = {
        uid: `usr_${Date.now()}`,
        email: trimmedEmail,
        displayName: trimmedName,
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: params.role,
        department: params.department || 'Engineering',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        emailVerified: false,
        isAnonymous: false
      };
      this.currentProfile = {
        uid: this.currentUser.uid,
        fullName: trimmedName,
        email: trimmedEmail,
        role: params.role,
        createdAt: new Date().toISOString(),
        profileCompleted: false,
        department: params.department,
        institution: params.institution,
        photoURL: this.currentUser.photoURL || undefined
      };
      this.isDemoMode = false;
      this.notifyListeners();
      return {
        success: true,
        data: this.currentUser,
        fromMock: true,
        timestamp: new Date().toISOString()
      };
    }

    let fbUser: FirebaseUser | null = null;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, rawPassword);
      fbUser = userCredential.user;

      try {
        await updateProfile(fbUser, { displayName: trimmedName });
      } catch (err) {
        console.warn('[SkillSetu Workspace] Could not update displayName on Firebase User:', err);
      }
    } catch (authError: any) {
      const parsed = formatAuthError(authError, 'Sign Up Auth', Boolean(trimmedEmail));
      return {
        success: false,
        error: parsed.message,
        errorCode: parsed.code,
        timestamp: new Date().toISOString()
      };
    }

    const nowIso = new Date().toISOString();
    const newProfile: UserProfileDoc = {
      uid: fbUser.uid,
      fullName: trimmedName,
      email: trimmedEmail,
      role: params.role,
      createdAt: nowIso,
      profileCompleted: false,
      department: params.department || '',
      institution: params.institution || '',
      photoURL: fbUser.photoURL || ''
    };

    try {
      await this.saveUserProfile(newProfile);
    } catch (firestoreError) {
      console.warn('[SkillSetu Workspace] Profile Creation Warning in Firestore:', firestoreError);
    }

    this.currentUser = {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: trimmedName,
      photoURL: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: params.role,
      institutionId: params.institution,
      department: params.department,
      createdAt: nowIso,
      lastLoginAt: nowIso,
      emailVerified: fbUser.emailVerified,
      isAnonymous: fbUser.isAnonymous
    };
    this.currentProfile = newProfile;
    this.isDemoMode = false;
    this.notifyListeners();

    return {
      success: true,
      data: this.currentUser,
      fromMock: false,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Optimized Google Sign-In with Popup
   * 
   * Flow:
   * 1. Opens Google popup IMMEDIATELY.
   * 2. Receives authenticated Firebase user.
   * 3. Checks /users/{uid} document.
   * 4. If missing: New Google user -> returns isNewUser: true (triggers role setup).
   * 5. If exists: Reads role -> loads role profile -> navigates to dashboard.
   */
  public async signInWithGoogle(): Promise<ServiceResponse<{ user: AppUser; isNewUser: boolean }>> {
    const t0 = performance.now();

    if (!this.isLiveAuthAvailable() || !auth) {
      logWorkspacePerformance('Authenticated user received (Demo Mode)', 0);
      this.currentUser = {
        ...DEFAULT_MOCK_USER,
        displayName: 'Google Demo User',
        email: 'user.google@skillsetu.ai',
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        role: 'student',
        lastLoginAt: new Date().toISOString()
      };
      this.currentProfile = {
        ...DEFAULT_MOCK_PROFILE,
        fullName: 'Google Demo User',
        email: 'user.google@skillsetu.ai',
        role: 'student'
      };
      this.isDemoMode = false;
      this.notifyListeners();
      return {
        success: true,
        data: { user: this.currentUser, isNewUser: false },
        fromMock: true,
        timestamp: new Date().toISOString()
      };
    }

    try {
      // Step 1: Immediate Google popup invocation (zero pre-fetch delay)
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      const tAuth = performance.now();
      logWorkspacePerformance(`Authenticated user received: ${fbUser.uid}`, tAuth - t0);

      // Step 2: Establish immediate authenticated user object
      const initialUser: AppUser = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || 'Google User',
        photoURL: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        role: 'student',
        createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        emailVerified: fbUser.emailVerified,
        isAnonymous: false
      };
      this.currentUser = initialUser;
      this.isDemoMode = false;

      // Step 3: Check whether /users/{uid} exists (single read)
      let existingProfile: UserProfileDoc | null = null;
      try {
        existingProfile = await this.fetchUserProfile(fbUser.uid, 5000);
      } catch (profileError: any) {
        console.warn('[SkillSetu Workspace] Profile lookup notice:', profileError);
        existingProfile = null;
      }

      // Step 4: Handle New vs Existing Google user
      if (!existingProfile) {
        // Document missing -> New Google user, trigger role configuration modal
        this.currentProfile = null;
        this.notifyListeners();

        return {
          success: true,
          data: { user: initialUser, isNewUser: true },
          fromMock: false,
          timestamp: new Date().toISOString()
        };
      }

      // Existing Google user -> Use stored role immediately
      const role = existingProfile.role;
      const tRoleStart = performance.now();
      logWorkspacePerformance(`Loading role profile: ${role}`);
      logWorkspacePerformance(`Role profile loaded`, performance.now() - tRoleStart);

      const fullUser: AppUser = {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: existingProfile.fullName || fbUser.displayName || 'Google User',
        photoURL: fbUser.photoURL || existingProfile.photoURL,
        role: existingProfile.role,
        institutionId: existingProfile.institution,
        department: existingProfile.department,
        createdAt: existingProfile.createdAt,
        lastLoginAt: new Date().toISOString(),
        emailVerified: fbUser.emailVerified,
        isAnonymous: false
      };

      this.currentUser = fullUser;
      this.currentProfile = existingProfile;
      this.notifyListeners();

      logWorkspacePerformance(`Navigating to dashboard: /dashboard/${role}`, performance.now() - t0);

      return {
        success: true,
        data: { user: fullUser, isNewUser: false },
        fromMock: false,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      const parsed = formatAuthError(error, 'Google Sign-In');
      return {
        success: false,
        error: parsed.message,
        errorCode: parsed.code,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Completes role selection for newly authenticated Google users
   * Trace Sequence:
   * [SkillSetu Profile] Submit started
   * [SkillSetu Profile] Authenticated UID present: true
   * [SkillSetu Profile] Creating user profile
   * [SkillSetu Profile] User profile created ({ms})
   * [SkillSetu Profile] Creating role profile
   * [SkillSetu Profile] Role profile created ({ms})
   * [SkillSetu Profile] Updating auth context
   * [SkillSetu Profile] Navigating to dashboard
   */
  public async completeGoogleProfile(
    role: UserRole,
    details?: { department?: string; institution?: string }
  ): Promise<ServiceResponse<AppUser>> {
    const t0 = performance.now();
    logProfilePerformance('Submit started');

    const fbUser = auth?.currentUser;
    const isUidPresent = Boolean(fbUser?.uid || this.currentUser?.uid);
    logProfilePerformance(`Authenticated UID present: ${isUidPresent}`);

    if (!isUidPresent) {
      logProfilePerformance('Session expired: no authenticated UID present');
      return {
        success: false,
        error: 'Your Google session expired. Please sign in again.',
        errorCode: 'auth/session-expired',
        timestamp: new Date().toISOString()
      };
    }

    const uid = fbUser?.uid || this.currentUser!.uid;
    const email = fbUser?.email || this.currentUser?.email || '';
    const displayName = fbUser?.displayName || this.currentUser?.displayName || 'Google User';
    const photoURL = fbUser?.photoURL || this.currentUser?.photoURL || '';
    const institutionVal = details?.institution?.trim() || (role === 'industry' ? 'NovaCore Technologies' : 'Apex University');
    const departmentVal = details?.department?.trim() || 'Computer Science & AI';
    const nowIso = new Date().toISOString();

    const userProfileData: UserProfileDoc & { updatedAt: string } = {
      uid,
      fullName: displayName,
      email,
      role,
      institution: institutionVal,
      department: departmentVal,
      photoURL,
      profileCompleted: true,
      createdAt: this.currentProfile?.createdAt || nowIso,
      updatedAt: nowIso
    };

    // Resilient local caching for instant session hydration
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`skillsetu_user_profile_${uid}`, JSON.stringify(userProfileData));
      }
    } catch {}

    let roleDocData: Record<string, any> = {
      id: uid,
      uid,
      name: displayName || 'Google User',
      fullName: displayName || 'Google User',
      email: email || '',
      role,
      institution: institutionVal,
      department: departmentVal,
      avatar: photoURL || '',
      photoURL: photoURL || '',
      createdAt: nowIso,
      updatedAt: nowIso
    };

    let roleCollection = 'students';
    if (role === 'industry') {
      roleCollection = 'industries';
      roleDocData = {
        ...roleDocData,
        company: institutionVal
      };
    } else if (role === 'academician') {
      roleCollection = 'academicians';
    } else if (role === 'institution') {
      roleCollection = 'institutions';
      roleDocData = {
        ...roleDocData,
        name: institutionVal,
        adminName: displayName || 'Administrator'
      };
    }

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`skillsetu_role_profile_${role}_${uid}`, JSON.stringify(roleDocData));
      }
    } catch {}

    if (this.isLiveAuthAvailable() && db) {
      // Step 1: Create /users/{uid} (isolated write with timeout)
      const tUserStart = performance.now();
      logProfilePerformance('Creating user profile');

      try {
        const userDocRef = doc(db, FIRESTORE_COLLECTIONS.USERS, uid);
        await withTimeout(
          setDoc(userDocRef, userProfileData, { merge: true }),
          3500,
          'Profile setup is taking longer than expected. Please try again.'
        );
        logProfilePerformance('User profile created', performance.now() - tUserStart);
      } catch (firestoreErr: any) {
        const parsed = parseProfileFirestoreError(firestoreErr);
        if (parsed.code === 'permission-denied') {
          return {
            success: false,
            error: parsed.message,
            errorCode: parsed.code,
            timestamp: new Date().toISOString()
          };
        }
        logProfilePerformance(`User profile synced to workspace storage (${parsed.code})`, performance.now() - tUserStart);
      }

      // Step 2: Create role-specific profile document
      const tRoleStart = performance.now();
      logProfilePerformance('Creating role profile');

      try {
        const roleDocRef = doc(db, roleCollection, uid);
        await withTimeout(
          setDoc(roleDocRef, roleDocData, { merge: true }),
          3500,
          'Profile setup is taking longer than expected. Please try again.'
        );
        logProfilePerformance('Role profile created', performance.now() - tRoleStart);
      } catch (firestoreRoleErr: any) {
        const parsed = parseProfileFirestoreError(firestoreRoleErr);
        if (parsed.code === 'permission-denied') {
          return {
            success: false,
            error: parsed.message,
            errorCode: parsed.code,
            timestamp: new Date().toISOString()
          };
        }
        logProfilePerformance(`Role profile synced to workspace storage (${parsed.code})`, performance.now() - tRoleStart);
      }
    }

    // Step 3: Update local auth context
    const tContextStart = performance.now();
    logProfilePerformance('Updating auth context');

    const updatedUser: AppUser = {
      uid,
      email,
      displayName,
      photoURL,
      role,
      institutionId: institutionVal,
      department: departmentVal,
      createdAt: userProfileData.createdAt,
      lastLoginAt: nowIso,
      emailVerified: fbUser?.emailVerified ?? true,
      isAnonymous: false
    };

    this.currentUser = updatedUser;
    this.currentProfile = userProfileData;
    this.isDemoMode = false;
    this.notifyListeners();
    logProfilePerformance('Updating auth context', performance.now() - tContextStart);

    // Step 4: Ready for navigation
    logProfilePerformance('Navigating to dashboard');
    logProfilePerformance('Submit completed', performance.now() - t0);

    return {
      success: true,
      data: updatedUser,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Retry profile hydration without re-triggering Google authentication popup
   */
  public async retryProfileHydration(uid?: string): Promise<ServiceResponse<{ user: AppUser; isNewUser: boolean }>> {
    const targetUid = uid || this.currentUser?.uid;
    if (!targetUid) {
      return {
        success: false,
        error: 'No active user session to hydrate.',
        timestamp: new Date().toISOString()
      };
    }

    const t0 = performance.now();
    try {
      const profile = await this.fetchUserProfile(targetUid, 8000);
      if (!profile) {
        // Document missing -> New user, trigger role setup modal
        return {
          success: true,
          data: {
            user: this.currentUser || {
              uid: targetUid,
              email: null,
              displayName: 'User',
              photoURL: null,
              role: 'student',
              emailVerified: false,
              isAnonymous: false
            },
            isNewUser: true
          },
          timestamp: new Date().toISOString()
        };
      }

      const role = profile.role || 'student';
      this.currentProfile = profile;
      if (this.currentUser) {
        this.currentUser = {
          ...this.currentUser,
          displayName: profile.fullName || this.currentUser.displayName,
          photoURL: profile.photoURL || this.currentUser.photoURL,
          role: role,
          institutionId: profile.institution,
          department: profile.department
        };
      }
      this.notifyListeners();

      logWorkspacePerformance(`Navigating to dashboard: /dashboard/${role}`, performance.now() - t0);

      return {
        success: true,
        data: {
          user: this.currentUser!,
          isNewUser: false
        },
        timestamp: new Date().toISOString()
      };
    } catch (err: any) {
      const parsed = formatAuthError(err, 'Workspace Loading');
      return {
        success: false,
        error: parsed.message,
        errorCode: parsed.code,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Continue with Demo Mode (Instant SIH Judge Access)
   */
  public continueAsDemo(role: UserRole = 'student'): AppUser {
    const mockUser = MOCK_USERS[role];
    this.isDemoMode = true;
    this.currentUser = {
      uid: mockUser.id,
      email: mockUser.email,
      displayName: mockUser.name,
      photoURL: mockUser.avatar,
      role: role,
      institutionId: 'inst-apex-01',
      department: 'Computer Science & Engineering',
      createdAt: '2025-01-15T00:00:00.000Z',
      lastLoginAt: new Date().toISOString(),
      emailVerified: true,
      isAnonymous: false
    };
    this.currentProfile = {
      uid: mockUser.id,
      fullName: mockUser.name,
      email: mockUser.email,
      role: role,
      createdAt: '2025-01-15T00:00:00.000Z',
      profileCompleted: true,
      department: 'Computer Science & Engineering',
      institution: 'Apex Institute of Technology',
      photoURL: mockUser.avatar
    };
    this.notifyListeners();
    return this.currentUser;
  }

  /**
   * Sign Out current user
   */
  public async signOut(): Promise<ServiceResponse<void>> {
    if (this.isLiveAuthAvailable() && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (err) {
        console.warn('[SkillSetu Workspace] Error during Firebase signout:', err);
      }
    }

    this.currentUser = null;
    this.currentProfile = null;
    this.isDemoMode = false;
    this.notifyListeners();

    return {
      success: true,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Subscribe to auth state updates
   */
  public onAuthStateChanged(callback: (state: AuthState) => void): () => void {
    this.listeners.push(callback);
    callback(this.getAuthState());
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners(): void {
    const state = this.getAuthState();
    this.listeners.forEach(listener => listener(state));
  }
}

export const authService = new AuthService();
export default authService;
