/**
 * Comprehensive Firebase Error Handling & Code Mapping Utility
 * 
 * Maps Firebase Auth and Firestore error codes to clean, human-readable
 * user messages while preserving detailed technical diagnostic logs in console.
 */

export interface ParsedFirebaseError {
  code: string;
  message: string;
  userMessage: string;
  diagnosticCode?: string;
  originalError: unknown;
}

/**
 * Extracts error code from Firebase Error object, string or message
 */
export function extractFirebaseErrorCode(error: unknown): string {
  if (!error) return 'unknown';

  if (typeof error === 'object' && error !== null) {
    const errObj = error as Record<string, unknown>;
    if (typeof errObj.code === 'string' && errObj.code.trim() !== '') {
      return errObj.code.trim();
    }
  }

  const rawMsg = error instanceof Error ? error.message : String(error);
  const match = rawMsg.match(/\((auth\/[a-zA-Z0-9-_]+)\)/) || 
                rawMsg.match(/(auth\/[a-zA-Z0-9-_]+)/) ||
                rawMsg.match(/(firestore\/[a-zA-Z0-9-_]+)/);
  
  if (match && match[1]) {
    return match[1];
  }

  if (rawMsg.toLowerCase().includes('permission-denied') || rawMsg.toLowerCase().includes('insufficient permissions')) {
    return 'permission-denied';
  }

  return 'unknown';
}

/**
 * Maps known Firebase Auth & Firestore codes to friendly user messages
 */
export function getFriendlyErrorMessage(code: string, rawMessage?: string): { message: string; code: string } {
  switch (code) {
    case 'auth/internal-error':
      return {
        message: 'An internal authentication service error occurred. Please try again or continue using Instant Demo Mode.',
        code
      };

    case 'auth/configuration-not-found':
      return {
        message: 'Firebase Authentication has not been configured for this project yet. Use Instant Demo Mode to continue.',
        code
      };

    case 'auth/cors-unsupported':
      return {
        message: 'Browser environment restricted popup authentication. Use Instant Demo Mode to continue seamlessly.',
        code
      };

    case 'auth/account-exists-with-different-credential':
      return {
        message: 'An account already exists with this email using a different login method. Please sign in with email/password.',
        code
      };

    case 'auth/timeout':
      return {
        message: 'Authentication request timed out. Please verify your connection and try again.',
        code
      };

    case 'auth/operation-not-allowed':
      return {
        message: 'Email/password authentication is not enabled in Firebase Console.',
        code
      };

    case 'auth/invalid-credential':
      return {
        message: 'The email or password is incorrect, or this account does not have a valid password credential.',
        code
      };
    
    case 'auth/user-not-found':
      return {
        message: 'No account exists with this email.',
        code
      };

    case 'auth/wrong-password':
      return {
        message: 'The password is incorrect.',
        code
      };

    case 'auth/email-already-in-use':
      return {
        message: 'An account already exists with this email.',
        code
      };

    case 'auth/weak-password':
      return {
        message: 'Please choose a stronger password (at least 6 characters).',
        code
      };

    case 'auth/invalid-email':
      return {
        message: 'Please enter a valid email address.',
        code
      };

    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid':
      return {
        message: 'Firebase configuration is invalid.',
        code
      };

    case 'auth/app-not-authorized':
      return {
        message: 'This application is not authorized to use the configured Firebase project.',
        code
      };

    case 'auth/unauthorized-domain':
      return {
        message: 'This domain is not authorized in Firebase Authentication.',
        code
      };

    case 'auth/network-request-failed':
      return {
        message: 'Firebase could not be reached. Check the network connection.',
        code
      };

    case 'auth/popup-blocked':
      return {
        message: 'Your browser blocked the Google sign-in popup. Please allow popups and try again.',
        code
      };

    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return {
        message: 'Google sign-in was cancelled.',
        code
      };

    case 'auth/too-many-requests':
      return {
        message: 'Access temporarily disabled due to multiple failed attempts. Please try again later.',
        code
      };

    case 'auth/user-disabled':
      return {
        message: 'This account has been disabled by an administrator.',
        code
      };

    case 'auth/requires-recent-login':
      return {
        message: 'Please log in again to continue.',
        code
      };

    case 'permission-denied':
    case 'firestore/permission-denied':
      return {
        message: 'Insufficient database permissions in Firestore rules.',
        code
      };

    case 'firestore/unavailable':
      return {
        message: 'Firestore database is temporarily unavailable. Please try again shortly.',
        code
      };

    default:
      if (rawMessage && !rawMessage.toLowerCase().startsWith('firebase:') && rawMessage.trim().toLowerCase() !== 'error' && rawMessage.length > 5) {
        return {
          message: rawMessage,
          code: code !== 'unknown' ? code : 'auth/unknown'
        };
      }
      return {
        message: 'Authentication failed. Please try again.',
        code: code !== 'unknown' ? code : 'auth/unknown'
      };
  }
}

/**
 * Format any error into a user-friendly message object with diagnostic code, logging to console.error
 */
export function formatAuthError(error: unknown, context: string = 'Authentication', emailProvided?: boolean): { message: string; code: string } {
  const code = extractFirebaseErrorCode(error);
  const rawMsg = error instanceof Error ? error.message : String(error);
  const name = error instanceof Error ? error.name : (typeof error === 'object' && error !== null && 'name' in error ? String((error as any).name) : 'FirebaseError');

  if (context.toLowerCase().includes('auth') || code.startsWith('auth/')) {
    console.error(`[SkillSetu Auth] Authentication failed`, {
      code: code !== 'unknown' ? code : (error as any)?.code || 'unknown',
      message: rawMsg,
      name: name,
      emailProvided: Boolean(emailProvided)
    });
  } else {
    console.warn(`[SkillSetu Workspace] ${context} note:`, {
      code: code !== 'unknown' ? code : (error as any)?.code || 'unknown',
      message: rawMsg,
      name: name
    });
  }

  return getFriendlyErrorMessage(code, rawMsg);
}
