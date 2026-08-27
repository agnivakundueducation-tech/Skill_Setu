import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { OpportunityRecord, OpportunityStatus } from '../types/opportunity';
import { DEMO_OPPORTUNITIES } from '../data/demoOpportunities';
import { isOfflineOrNetworkError } from './firestoreService';

export interface OpportunityServiceResult<T> {
  success: boolean;
  data: T;
  fromMock?: boolean;
  error?: string;
}

const LOCAL_OPPORTUNITIES_KEY = 'skillsetu_local_opportunities_v1';

// In-memory cache for fast responsive lookups
let cachedOpportunities: OpportunityRecord[] = [];

function loadLocalOpportunities(isDemo = true): OpportunityRecord[] {
  if (typeof window === 'undefined') return isDemo ? DEMO_OPPORTUNITIES : [];
  try {
    const raw = localStorage.getItem(LOCAL_OPPORTUNITIES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore storage parse error
  }
  return isDemo ? DEMO_OPPORTUNITIES : [];
}

function saveLocalOpportunities(data: OpportunityRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_OPPORTUNITIES_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage write error
  }
}

/**
 * Fetch all active opportunities.
 * Authenticated users read live from `/opportunities`.
 * Demo mode returns strongly typed demo opportunities.
 */
export async function getOpportunities(options?: {
  status?: OpportunityStatus;
  domain?: string;
  isDemo?: boolean;
}): Promise<OpportunityServiceResult<OpportunityRecord[]>> {
  const isDemo = options?.isDemo ?? (!db);

  // If explicitly demo mode, return demo dataset
  if (isDemo) {
    let list = loadLocalOpportunities(true);
    if (options?.status) {
      list = list.filter((o) => o.status === options.status);
    }
    if (options?.domain && options.domain !== 'All') {
      list = list.filter((o) => o.domain.toLowerCase() === options.domain?.toLowerCase());
    }
    return {
      success: true,
      data: list,
      fromMock: true
    };
  }

  if (!db) {
    return {
      success: false,
      data: [],
      fromMock: false,
      error: 'Database not initialized'
    };
  }

  try {
    const oppsRef = collection(db, 'opportunities');
    let q = query(oppsRef);

    if (options?.status) {
      q = query(oppsRef, where('status', '==', options.status));
    }

    const snapshot = await getDocs(q);
    const results: OpportunityRecord[] = [];

    snapshot.forEach((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as OpportunityRecord;
        results.push({
          ...data,
          opportunityId: docSnap.id
        });
      }
    });

    // If domain filter was passed in memory
    let finalResults = results;
    if (options?.domain && options.domain !== 'All') {
      finalResults = results.filter((o) => o.domain.toLowerCase() === options.domain?.toLowerCase());
    }

    cachedOpportunities = finalResults;
    saveLocalOpportunities(finalResults);

    return {
      success: true,
      data: finalResults,
      fromMock: false
    };
  } catch (error) {
    if (isOfflineOrNetworkError(error)) {
      const fallback = cachedOpportunities.length > 0 ? cachedOpportunities : loadLocalOpportunities(isDemo);
      return {
        success: true,
        data: fallback,
        fromMock: true
      };
    }
    console.error('[OpportunityService] Firestore fetch error:', error);
    return {
      success: false,
      data: cachedOpportunities.length > 0 ? cachedOpportunities : loadLocalOpportunities(isDemo),
      fromMock: false,
      error: error instanceof Error ? error.message : 'Failed to fetch opportunities'
    };
  }
}

/**
 * Fetch a single opportunity by its unique ID
 */
export async function getOpportunityById(
  opportunityId: string,
  isDemo = false
): Promise<OpportunityServiceResult<OpportunityRecord | null>> {
  if (isDemo) {
    const local = loadLocalOpportunities(true);
    const found = local.find((o) => o.opportunityId === opportunityId) || null;
    return {
      success: true,
      data: found,
      fromMock: true
    };
  }

  if (!db) {
    return {
      success: false,
      data: null,
      fromMock: false,
      error: 'Database not initialized'
    };
  }

  try {
    const docRef = doc(db, 'opportunities', opportunityId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return {
        success: true,
        data: {
          ...(snap.data() as OpportunityRecord),
          opportunityId: snap.id
        },
        fromMock: false
      };
    }

    return {
      success: false,
      data: null,
      fromMock: false,
      error: 'Opportunity not found'
    };
  } catch (error) {
    console.warn(`[OpportunityService] Failed to get opportunity ${opportunityId}:`, error);
    return {
      success: false,
      data: null,
      fromMock: false,
      error: error instanceof Error ? error.message : 'Error fetching opportunity'
    };
  }
}

/**
 * Create a new Industry Opportunity and persist to `/opportunities/{opportunityId}`
 * Uses authenticated industry UID as `postedBy`.
 */
export async function createOpportunity(
  opportunityData: Omit<OpportunityRecord, 'opportunityId' | 'createdAt' | 'updatedAt'> & {
    opportunityId?: string;
  },
  isDemo = false
): Promise<OpportunityServiceResult<OpportunityRecord>> {
  const currentUid = auth?.currentUser?.uid || 'demo-industry-user';
  const oppId = opportunityData.opportunityId || `opp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const nowIso = new Date().toISOString();

  const fullRecord: OpportunityRecord = {
    ...opportunityData,
    opportunityId: oppId,
    postedBy: currentUid,
    status: opportunityData.status || 'active',
    createdAt: nowIso,
    updatedAt: nowIso
  };

  if (isDemo || !db) {
    const current = loadLocalOpportunities();
    const updated = [fullRecord, ...current];
    saveLocalOpportunities(updated);
    return {
      success: true,
      data: fullRecord,
      fromMock: true
    };
  }

  try {
    const docRef = doc(db, 'opportunities', oppId);
    await setDoc(docRef, fullRecord);

    // Update local cache
    const current = loadLocalOpportunities();
    const updated = [fullRecord, ...current.filter((o) => o.opportunityId !== oppId)];
    saveLocalOpportunities(updated);

    return {
      success: true,
      data: fullRecord,
      fromMock: false
    };
  } catch (error) {
    console.error('[OpportunityService] Error creating opportunity:', error);
    return {
      success: false,
      data: fullRecord,
      fromMock: false,
      error: error instanceof Error ? error.message : 'Failed to create opportunity in Firestore'
    };
  }
}

/**
 * Update an existing opportunity document.
 * Must belong to the current authenticated industry user.
 */
export async function updateOpportunity(
  opportunityId: string,
  updates: Partial<OpportunityRecord>,
  isDemo = false
): Promise<OpportunityServiceResult<boolean>> {
  const nowIso = new Date().toISOString();

  if (isDemo || !db) {
    const current = loadLocalOpportunities();
    const updated = current.map((o) =>
      o.opportunityId === opportunityId ? { ...o, ...updates, updatedAt: nowIso } : o
    );
    saveLocalOpportunities(updated);
    return {
      success: true,
      data: true,
      fromMock: true
    };
  }

  try {
    const docRef = doc(db, 'opportunities', opportunityId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: nowIso
    });

    const current = loadLocalOpportunities();
    const updated = current.map((o) =>
      o.opportunityId === opportunityId ? { ...o, ...updates, updatedAt: nowIso } : o
    );
    saveLocalOpportunities(updated);

    return {
      success: true,
      data: true,
      fromMock: false
    };
  } catch (error) {
    console.error('[OpportunityService] Update opportunity error:', error);
    return {
      success: false,
      data: false,
      fromMock: false,
      error: error instanceof Error ? error.message : 'Failed to update opportunity in Firestore'
    };
  }
}

/**
 * Delete an opportunity.
 */
export async function deleteOpportunity(
  opportunityId: string,
  isDemo = false
): Promise<OpportunityServiceResult<boolean>> {
  if (isDemo || !db) {
    const current = loadLocalOpportunities();
    const filtered = current.filter((o) => o.opportunityId !== opportunityId);
    saveLocalOpportunities(filtered);
    return {
      success: true,
      data: true,
      fromMock: true
    };
  }

  try {
    const docRef = doc(db, 'opportunities', opportunityId);
    await deleteDoc(docRef);

    const current = loadLocalOpportunities();
    const filtered = current.filter((o) => o.opportunityId !== opportunityId);
    saveLocalOpportunities(filtered);

    return {
      success: true,
      data: true,
      fromMock: false
    };
  } catch (error) {
    console.error('[OpportunityService] Delete opportunity error:', error);
    return {
      success: false,
      data: false,
      fromMock: false,
      error: error instanceof Error ? error.message : 'Failed to delete opportunity from Firestore'
    };
  }
}

/**
 * Get opportunities posted by a specific industry user
 */
export async function getIndustryOpportunities(
  postedByUid: string,
  isDemo = false
): Promise<OpportunityServiceResult<OpportunityRecord[]>> {
  if (isDemo || !db) {
    const list = loadLocalOpportunities();
    const myOpps = list.filter((o) => o.postedBy === postedByUid || o.postedBy.startsWith('demo-industry'));
    return {
      success: true,
      data: myOpps,
      fromMock: true
    };
  }

  try {
    const oppsRef = collection(db, 'opportunities');
    const q = query(oppsRef, where('postedBy', '==', postedByUid));
    const snapshot = await getDocs(q);

    const results: OpportunityRecord[] = [];
    snapshot.forEach((docSnap) => {
      if (docSnap.exists()) {
        results.push({
          ...(docSnap.data() as OpportunityRecord),
          opportunityId: docSnap.id
        });
      }
    });

    return {
      success: true,
      data: results,
      fromMock: false
    };
  } catch (error) {
    console.error(`[OpportunityService] getIndustryOpportunities error:`, error);
    return {
      success: false,
      data: [],
      fromMock: false,
      error: error instanceof Error ? error.message : 'Failed to fetch industry opportunities from Firestore'
    };
  }
}
