import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  orderBy,
  limit as firestoreLimit
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { OpportunityRecord } from '../types/opportunity';
import {
  SkillDemand,
  SkillDemandSnapshot,
  SkillDemandVsReadiness,
  InstitutionRecommendation,
  StudentDemandSignal,
  IndustryTalentDemandSignal,
  DemandTrend,
  DemandPriority,
  MatrixQuadrant
} from '../types/demand';
import {
  DEMO_HISTORICAL_SNAPSHOTS,
  DEMO_SKILL_DEMANDS,
  DEMO_DEMAND_VS_READINESS,
  DEMO_INSTITUTION_RECOMMENDATIONS,
  DEMO_STUDENT_DEMAND_SIGNALS,
  DEMO_INDUSTRY_TALENT_SIGNALS
} from '../data/demoDemandData';
import { DEMO_OPPORTUNITIES } from '../data/demoOpportunities';

/**
 * Standard skill category mapper for consistent aggregation.
 */
function inferSkillCategory(skillName: string): string {
  const norm = skillName.toLowerCase().trim();
  if (['python', 'java', 'c++', 'c', 'typescript', 'javascript', 'go', 'rust'].includes(norm)) {
    return 'Programming';
  }
  if (['dsa', 'data structures', 'algorithms', 'problem solving', 'system design', 'oop', 'os', 'networks'].includes(norm)) {
    return 'Core CS';
  }
  if (['sql', 'database', 'mongodb', 'postgresql', 'mysql', 'redis', 'databases'].includes(norm)) {
    return 'Databases';
  }
  if (['cloud', 'cloud computing', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'devops', 'ci/cd'].includes(norm)) {
    return 'Cloud';
  }
  if (['ai/ml', 'machine learning', 'deep learning', 'nlp', 'data science', 'ai', 'computer vision', 'rag'].includes(norm)) {
    return 'Data & AI';
  }
  if (['cybersecurity', 'security', 'soc', 'network security', 'ethical hacking', 'infosec'].includes(norm)) {
    return 'Security';
  }
  if (['web development', 'react', 'node.js', 'frontend', 'html/css', 'angular', 'next.js', 'vue'].includes(norm)) {
    return 'Frontend';
  }
  if (['communication', 'teamwork', 'leadership', 'critical thinking', 'presentation', 'work ethic'].includes(norm)) {
    return 'Professional';
  }
  return 'Technical';
}

/**
 * Normalize skill name to combine synonymous aliases (e.g. "SQL" and "Database").
 */
function normalizeSkillKey(name: string): string {
  const lower = name.toLowerCase().trim();
  if (lower === 'database' || lower === 'sql' || lower === 'databases' || lower === 'relational database') {
    return 'database';
  }
  if (lower === 'cloud' || lower === 'cloud computing' || lower === 'aws' || lower === 'cloud architecture') {
    return 'cloud';
  }
  if (lower === 'ai/ml' || lower === 'machine learning' || lower === 'ai' || lower === 'artificial intelligence') {
    return 'aiml';
  }
  if (lower === 'dsa' || lower === 'data structures & algorithms' || lower === 'data structures' || lower === 'algorithms') {
    return 'dsa';
  }
  if (lower === 'problem solving' || lower === 'analytical problem solving') {
    return 'problemsolving';
  }
  if (lower === 'cybersecurity' || lower === 'security' || lower === 'infosec') {
    return 'cybersecurity';
  }
  if (lower === 'web development' || lower === 'frontend web development' || lower === 'react') {
    return 'webdev';
  }
  return lower.replace(/[^a-z0-9]/g, '');
}

/**
 * Display name canonicalization
 */
function getCanonicalDisplayName(key: string, rawName: string): string {
  switch (key) {
    case 'database':
      return 'Database / SQL';
    case 'cloud':
      return 'Cloud Computing';
    case 'aiml':
      return 'AI/ML';
    case 'dsa':
      return 'DSA';
    case 'problemsolving':
      return 'Problem Solving';
    case 'cybersecurity':
      return 'Cybersecurity';
    case 'webdev':
      return 'Web Development';
    default:
      return rawName.trim();
  }
}




/**
 * Calculate Industry Skill Demand from an array of active Opportunity records.
 * Deterministic pure mathematical aggregation - no AI hallucination.
 *
 * @param opportunities Active opportunity postings
 * @param historicalSnapshots Optional historical snapshots for trend computation
 */
export function calculateSkillDemand(
  opportunities: OpportunityRecord[],
  historicalSnapshots?: SkillDemandSnapshot[]
): SkillDemand[] {
  const activeOpps = (opportunities || []).filter(
    (o) => o.status === 'active' || !o.status
  );

  const totalActive = activeOpps.length;
  if (totalActive === 0) {
    return [];
  }

  // Aggregation maps
  interface SkillBucket {
    key: string;
    rawName: string;
    category: string;
    opportunityCount: number;
    requiredLevelSum: number;
    requiredCount: number;
    domains: Record<string, number>;
    opportunityTypes: Record<string, number>;
    sampleRoles: Set<string>;
  }

  const buckets: Record<string, SkillBucket> = {};

  for (const opp of activeOpps) {
    const oppDomain = opp.domain || 'Software & Tech';
    const oppType = opp.opportunityType || 'Internship';
    const oppTitle = opp.title || 'Engineering Role';

    // Track unique skills per opportunity so we count each skill once per posting
    const seenSkillsInOpp = new Set<string>();

    // 1. Process Required Skills (primary weight)
    for (const req of opp.requiredSkills || []) {
      if (!req?.skillName) continue;
      const key = normalizeSkillKey(req.skillName);
      if (!buckets[key]) {
        buckets[key] = {
          key,
          rawName: req.skillName,
          category: req.category || inferSkillCategory(req.skillName),
          opportunityCount: 0,
          requiredLevelSum: 0,
          requiredCount: 0,
          domains: {},
          opportunityTypes: {},
          sampleRoles: new Set()
        };
      }

      if (!seenSkillsInOpp.has(key)) {
        seenSkillsInOpp.add(key);
        buckets[key].opportunityCount += 1;
        buckets[key].domains[oppDomain] = (buckets[key].domains[oppDomain] || 0) + 1;
        buckets[key].opportunityTypes[oppType] = (buckets[key].opportunityTypes[oppType] || 0) + 1;
        if (buckets[key].sampleRoles.size < 4) {
          buckets[key].sampleRoles.add(oppTitle);
        }
      }

      buckets[key].requiredLevelSum += req.requiredLevel || 75;
      buckets[key].requiredCount += 1;
    }

    // 2. Process Preferred Skills (contributes to coverage)
    for (const pref of opp.preferredSkills || []) {
      if (!pref?.skillName) continue;
      const key = normalizeSkillKey(pref.skillName);
      if (!buckets[key]) {
        buckets[key] = {
          key,
          rawName: pref.skillName,
          category: pref.category || inferSkillCategory(pref.skillName),
          opportunityCount: 0,
          requiredLevelSum: 0,
          requiredCount: 0,
          domains: {},
          opportunityTypes: {},
          sampleRoles: new Set()
        };
      }

      if (!seenSkillsInOpp.has(key)) {
        seenSkillsInOpp.add(key);
        buckets[key].opportunityCount += 1;
        buckets[key].domains[oppDomain] = (buckets[key].domains[oppDomain] || 0) + 1;
        buckets[key].opportunityTypes[oppType] = (buckets[key].opportunityTypes[oppType] || 0) + 1;
        if (buckets[key].sampleRoles.size < 4) {
          buckets[key].sampleRoles.add(oppTitle);
        }
      }

      buckets[key].requiredLevelSum += pref.requiredLevel || 65;
      buckets[key].requiredCount += 1;
    }
  }

  // Determine historical snapshot comparison for trend
  let previousSnapshotSkills: Record<string, SkillDemand> | null = null;
  if (historicalSnapshots && historicalSnapshots.length >= 2) {
    // Sort chronological and take the one preceding the current one
    const sorted = [...historicalSnapshots].sort(
      (a, b) => new Date(a.generatedAt).getTime() - new Date(b.generatedAt).getTime()
    );
    previousSnapshotSkills = sorted[sorted.length - 2]?.skills || null;
  }

  // Convert buckets to typed SkillDemand array
  const result: SkillDemand[] = Object.values(buckets).map((b) => {
    const demandPercentage = Math.round((b.opportunityCount / totalActive) * 100);
    const avgLevel = b.requiredCount > 0
      ? Math.round(b.requiredLevelSum / b.requiredCount)
      : 75;

    // Trend calculation
    let trend: DemandTrend = 'insufficient-data';
    if (previousSnapshotSkills) {
      const prevSkill = previousSnapshotSkills[b.key];
      if (prevSkill && prevSkill.demandPercentage > 0) {
        const diff = demandPercentage - prevSkill.demandPercentage;
        const relativeChange = (diff / prevSkill.demandPercentage) * 100;
        if (relativeChange > 10) {
          trend = 'rising';
        } else if (relativeChange < -10) {
          trend = 'declining';
        } else {
          trend = 'stable';
        }
      } else if (prevSkill) {
        trend = 'stable';
      }
    }

    // Priority classification based on demand density
    let priority: DemandPriority = 'Low';
    if (demandPercentage >= 50) priority = 'Critical';
    else if (demandPercentage >= 30) priority = 'High';
    else if (demandPercentage >= 15) priority = 'Moderate';

    return {
      skillId: `skill-${b.key}`,
      skillName: getCanonicalDisplayName(b.key, b.rawName),
      category: b.category,
      opportunityCount: b.opportunityCount,
      demandPercentage,
      averageRequiredLevel: avgLevel,
      domains: b.domains,
      opportunityTypes: b.opportunityTypes,
      trend,
      priority,
      sampleRoles: Array.from(b.sampleRoles)
    };
  });

  // Sort by highest demand percentage first
  return result.sort((a, b) => b.demandPercentage - a.demandPercentage || b.opportunityCount - a.opportunityCount);
}

/**
 * Compare Industry Skill Demand against Student Cohort / Individual Readiness.
 * Generates 4-Quadrant Priority Matrix classifications and explainable gaps.
 */




export function calculateDemandVsReadiness(
  skillsDemand: SkillDemand[],
  studentReadinessMap: Record<string, number> = {}
): SkillDemandVsReadiness[] {
  // Default benchmark readiness values for standard domains when unassessed
  const defaultBenchmark: Record<string, number> = {
    'python': 72,
    'dsa': 64,
    'database': 70,
    'aiml': 52,
    'cloud': 41,
    'cybersecurity': 45,
    'webdev': 76,
    'problemsolving': 68,
    'communication': 70
  };

  return skillsDemand.map((dem) => {
    const key = normalizeSkillKey(dem.skillName);
    
    // Resolve student cohort readiness from provided map or benchmark
    let studentScore = studentReadinessMap[key];
    if (studentScore === undefined) {
      // Check loose match
      const matchedEntry = Object.entries(studentReadinessMap).find(
        ([k]) => normalizeSkillKey(k) === key
      );
      studentScore = matchedEntry ? matchedEntry[1] : (defaultBenchmark[key] || 60);
    }
    const readiness = Math.min(100, Math.max(0, Math.round(studentScore)));

    const required = dem.averageRequiredLevel;
    const gap = Math.max(0, required - readiness);

    let gapSeverity: 'critical' | 'moderate' | 'minimal' = 'minimal';
    if (gap >= 20) gapSeverity = 'critical';
    else if (gap >= 10) gapSeverity = 'moderate';

    // 4-Quadrant Matrix Classification
    // High Demand threshold is 35% of postings
    const isHighDemand = dem.demandPercentage >= 35;
    const isHighReadiness = readiness >= 65 && gap <= 15;

    let matrixQuadrant: MatrixQuadrant;
    let priority: DemandPriority = dem.priority;
    let explanation = '';

    if (isHighDemand && !isHighReadiness) {
      // HIGH DEMAND / LOW READINESS -> Urgent Skill Development
      matrixQuadrant = 'urgent_development';
      priority = gap >= 25 ? 'Critical' : 'High';
      explanation = `${dem.skillName} is marked ${priority} Priority: required in ${dem.demandPercentage}% of active opportunities with an average requirement of ${required}, while cohort readiness is ${readiness} (Competency Gap: ${gap} points).`;
    } else if (isHighDemand && isHighReadiness) {
      // HIGH DEMAND / HIGH READINESS -> Maintain
      matrixQuadrant = 'maintain';
      priority = 'High';
      explanation = `${dem.skillName} shows robust industry demand (${dem.demandPercentage}%) and student cohort readiness is well aligned (${readiness} vs ${required} required benchmark).`;
    } else if (!isHighDemand && isHighReadiness) {
      // LOW DEMAND / HIGH READINESS -> Opportunity Expansion
      matrixQuadrant = 'opportunity_expansion';
      priority = 'Moderate';
      explanation = `Students exhibit strong proficiency in ${dem.skillName} (${readiness}), but active platform demand is currently ${dem.demandPercentage}%. Explore targeted recruitment partnerships.`;
    } else {
      // LOW DEMAND / LOW READINESS -> Lower Priority
      matrixQuadrant = 'lower_priority';
      priority = 'Low';
      explanation = `${dem.skillName} currently has lower demand (${dem.demandPercentage}%) with cohort readiness of ${readiness}. Monitor future industry hiring signals.`;
    }

    return {
      skillId: dem.skillId,
      skillName: dem.skillName,
      category: dem.category,
      demandPercentage: dem.demandPercentage,
      opportunityCount: dem.opportunityCount,
      averageRequiredLevel: required,
      averageStudentReadiness: readiness,
      gap,
      gapSeverity,
      matrixQuadrant,
      priority,
      explanation,
      trend: dem.trend
    };
  });
}

/**
 * Generate Deterministic Institutional Recommendations based on actual demand vs readiness data.
 * Pure mathematical reasoning with transparent metrics.
 */
export function generateInstitutionRecommendations(
  demandVsReadiness: SkillDemandVsReadiness[]
): InstitutionRecommendation[] {
  const recommendations: InstitutionRecommendation[] = [];

  for (const item of demandVsReadiness) {
    if (item.matrixQuadrant === 'urgent_development') {
      if (item.gap >= 20) {
        recommendations.push({
          id: `rec-urgent-${item.skillId}`,
          skillName: item.skillName,
          title: `Increase ${item.skillName} Training Capacity & Lab Modules`,
          type: 'curriculum_expansion',
          priority: 'Critical',
          reason: `${item.skillName} is marked Critical Priority because it appears in ${item.demandPercentage}% of active opportunities while average student readiness is ${item.averageStudentReadiness} against a baseline requirement of ${item.averageRequiredLevel} (Gap: ${item.gap} points).`,
          recommendedAction: `Introduce a dedicated hands-on practical lab module in the upcoming semester covering core production concepts in ${item.skillName} to bridge the ${item.gap}-point deficit.`,
          metricSnapshot: {
            demandPercentage: item.demandPercentage,
            studentReadiness: item.averageStudentReadiness,
            requiredLevel: item.averageRequiredLevel,
            gap: item.gap,
            opportunityCount: item.opportunityCount
          },
          suggestedTimeline: 'Immediate Upcoming Term',
          targetDepartment: item.category === 'Data & AI' ? 'Computer Science & AI/ML' : 'Engineering Departments'
        });
      } else {
        recommendations.push({
          id: `rec-adv-${item.skillId}`,
          skillName: item.skillName,
          title: `Introduce Advanced ${item.skillName} Industry-Guided Capstone Projects`,
          type: 'advanced_projects',
          priority: 'High',
          reason: `${item.skillName} demand is high (${item.demandPercentage}%) with a moderate student gap of ${item.gap} points (${item.averageStudentReadiness} vs ${item.averageRequiredLevel}).`,
          recommendedAction: `Mandate industry-partnered capstone projects requiring practical, real-world implementations in ${item.skillName}.`,
          metricSnapshot: {
            demandPercentage: item.demandPercentage,
            studentReadiness: item.averageStudentReadiness,
            requiredLevel: item.averageRequiredLevel,
            gap: item.gap,
            opportunityCount: item.opportunityCount
          },
          suggestedTimeline: 'Pre-final / Final Year Elective',
          targetDepartment: 'Computer Science & IT'
        });
      }
    } else if (item.trend === 'rising' && item.demandPercentage >= 25) {
      recommendations.push({
        id: `rec-trend-${item.skillId}`,
        skillName: item.skillName,
        title: `Establish ${item.skillName} Industry Workshop & Certification Pathway`,
        type: 'industry_workshop',
        priority: 'High',
        reason: `${item.skillName} exhibits rising industry demand across recent opportunity cycles (currently ${item.demandPercentage}% active requirement).`,
        recommendedAction: `Partner with accredited industry leaders to conduct masterclasses and sponsor certified credentials in ${item.skillName}.`,
        metricSnapshot: {
          demandPercentage: item.demandPercentage,
          studentReadiness: item.averageStudentReadiness,
          requiredLevel: item.averageRequiredLevel,
          gap: item.gap,
          opportunityCount: item.opportunityCount
        },
        suggestedTimeline: 'Mid-Semester Bootcamp',
        targetDepartment: 'All Engineering Disciplines'
      });
    } else if (item.matrixQuadrant === 'opportunity_expansion') {
      recommendations.push({
        id: `rec-exp-${item.skillId}`,
        skillName: item.skillName,
        title: `Expand Industry Hiring Outreach for ${item.skillName}`,
        type: 'placement_drive',
        priority: 'Moderate',
        reason: `Students demonstrate high proficiency in ${item.skillName} (${item.averageStudentReadiness} readiness vs ${item.averageRequiredLevel} required) with a minimal gap of only ${item.gap} points.`,
        recommendedAction: `Host specialized campus recruitment drives and engage startup partners specifically hiring for ${item.skillName} competencies.`,
        metricSnapshot: {
          demandPercentage: item.demandPercentage,
          studentReadiness: item.averageStudentReadiness,
          requiredLevel: item.averageRequiredLevel,
          gap: item.gap,
          opportunityCount: item.opportunityCount
        },
        suggestedTimeline: 'Upcoming Placement Season',
        targetDepartment: 'Placement Cell & Career Services'
      });
    }
  }

  // Sort by priority (Critical -> High -> Moderate -> Low)
  const priorityOrder: Record<DemandPriority, number> = {
    Critical: 1,
    High: 2,
    Moderate: 3,
    Low: 4
  };

  return recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

/**
 * Generate a new Skill Demand Snapshot and persist to Firestore or local storage.
 * Triggered by an authorized institutional / admin workflow.
 */
export async function generateDemandSnapshot(
  opportunities: OpportunityRecord[],
  isDemo: boolean = false,
  userUid: string = 'institutional-user'
): Promise<{ success: boolean; data?: SkillDemandSnapshot; error?: string }> {
  try {
    const historicalRes = await getHistoricalSnapshots(isDemo);
    const existingSnapshots = historicalRes.data || [];

    const calculatedDemand = calculateSkillDemand(opportunities, existingSnapshots);

    const skillsMap: Record<string, SkillDemand> = {};
    for (const d of calculatedDemand) {
      const key = normalizeSkillKey(d.skillName);
      skillsMap[key] = d;
    }

    const snapshotId = `snap_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newSnapshot: SkillDemandSnapshot = {
      snapshotId,
      generatedAt: new Date().toISOString(),
      totalOpportunities: opportunities.filter((o) => o.status === 'active' || !o.status).length,
      skills: skillsMap,
      generatedBy: userUid,
      snapshotLabel: `Snapshot ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
    };

    if (isDemo) {
      // Save in localStorage for demo mode persistence
      try {
        const raw = localStorage.getItem('skillsetu_demo_demand_snapshots');
        const list: SkillDemandSnapshot[] = raw ? JSON.parse(raw) : DEMO_HISTORICAL_SNAPSHOTS;
        list.push(newSnapshot);
        localStorage.setItem('skillsetu_demo_demand_snapshots', JSON.stringify(list));
      } catch (err) {
        console.warn('Could not save demo snapshot to localStorage', err);
      }
      return { success: true, data: newSnapshot };
    }

    // Authenticated Firestore Mode
    const snapRef = doc(db, 'skillDemandSnapshots', snapshotId);
    await setDoc(snapRef, newSnapshot);
    return { success: true, data: newSnapshot };
  } catch (error: any) {
    console.error('[demandService] Failed to generate demand snapshot:', error);
    return { success: false, error: error?.message || 'Failed to generate demand snapshot' };
  }
}

/**
 * Retrieve Historical Demand Snapshots for longitudinal comparisons.
 */
export async function getHistoricalSnapshots(
  isDemo: boolean = false
): Promise<{ success: boolean; data: SkillDemandSnapshot[] }> {
  if (isDemo) {
    try {
      const raw = localStorage.getItem('skillsetu_demo_demand_snapshots');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return { success: true, data: parsed };
        }
      }
    } catch {
      // Fallback
    }
    return { success: true, data: DEMO_HISTORICAL_SNAPSHOTS };
  }

  try {
    const q = query(
      collection(db, 'skillDemandSnapshots'),
      orderBy('generatedAt', 'desc'),
      firestoreLimit(10)
    );
    const snap = await getDocs(q);
    const list: SkillDemandSnapshot[] = [];
    snap.forEach((d) => {
      list.push(d.data() as SkillDemandSnapshot);
    });

    if (list.length === 0) {
      // Return empty array in authenticated mode if none yet created
      return { success: true, data: [] };
    }

    // Sort chronologically ascending for trend matching
    list.sort((a, b) => new Date(a.generatedAt).getTime() - new Date(b.generatedAt).getTime());
    return { success: true, data: list };
  } catch (error: any) {
    console.warn('[demandService] Could not fetch Firestore snapshots:', error);
    return { success: true, data: [] };
  }
}

/**
 * Generate lightweight Student-Facing Demand Signals.
 * Shows top in-demand skills on the platform, the student's current verified score,
 * typical industry requirement, and improvement suggestions.
 */
export function getStudentDemandSignals(
  opportunities: OpportunityRecord[],
  studentSkillScores: Record<string, number> = {},
  isDemo: boolean = false
): StudentDemandSignal[] {
  if (isDemo && (!opportunities || opportunities.length === 0)) {
    return DEMO_STUDENT_DEMAND_SIGNALS;
  }

  const demandList = calculateSkillDemand(opportunities);
  if (demandList.length === 0) {
    return DEMO_STUDENT_DEMAND_SIGNALS;
  }

  return demandList.slice(0, 6).map((dem) => {
    const key = normalizeSkillKey(dem.skillName);
    let userScore = studentSkillScores[key];
    if (userScore === undefined) {
      const matched = Object.entries(studentSkillScores).find(
        ([k]) => normalizeSkillKey(k) === key
      );
      userScore = matched ? matched[1] : 50;
    }
    const score = Math.round(userScore);
    const req = dem.averageRequiredLevel;
    const gap = Math.max(0, req - score);
    const isGap = score < req;

    let demandLevel: 'Critical' | 'High' | 'Moderate' | 'Emerging' = 'Emerging';
    if (dem.demandPercentage >= 50) demandLevel = 'Critical';
    else if (dem.demandPercentage >= 30) demandLevel = 'High';
    else if (dem.demandPercentage >= 15) demandLevel = 'Moderate';

    return {
      skillName: dem.skillName,
      category: dem.category,
      demandPercentage: dem.demandPercentage,
      demandLevel,
      opportunityCount: dem.opportunityCount,
      yourScore: score,
      requiredLevel: req,
      gap,
      isGap,
      priority: dem.priority,
      topRoles: dem.sampleRoles && dem.sampleRoles.length > 0
        ? dem.sampleRoles
        : ['Software Engineer', 'Technical Specialist']
    };
  });
}

/**
 * Generate aggregated, privacy-preserving Industry Talent Demand Signals.
 * Aggregates anonymized cohort benchmarks and platform-wide talent availability.
 */
export function getIndustryTalentDemandSignal(
  opportunities: OpportunityRecord[],
  studentCohortAvg: Record<string, number> = {},
  isDemo: boolean = false
): IndustryTalentDemandSignal {
  if (isDemo && (!opportunities || opportunities.length === 0)) {
    return DEMO_INDUSTRY_TALENT_SIGNALS;
  }

  const demandList = calculateSkillDemand(opportunities);
  const totalActive = (opportunities || []).filter((o) => o.status === 'active' || !o.status).length;

  if (demandList.length === 0) {
    return DEMO_INDUSTRY_TALENT_SIGNALS;
  }

  const mostDemandedSkills = demandList.slice(0, 6).map((d) => ({
    skillName: d.skillName,
    category: d.category,
    opportunityCount: d.opportunityCount,
    demandPercentage: d.demandPercentage,
    avgRequiredLevel: d.averageRequiredLevel
  }));

  const platformCandidateReadiness = demandList.map((d) => {
    const key = normalizeSkillKey(d.skillName);
    const avg = studentCohortAvg[key] || (key === 'python' ? 72 : key === 'database' ? 70 : key === 'cloud' ? 41 : 60);
    let level: 'High' | 'Moderate' | 'Scarce' = 'Moderate';
    if (avg >= 70) level = 'High';
    else if (avg < 55) level = 'Scarce';

    return {
      skillName: d.skillName,
      avgReadiness: avg,
      benchmarkRequired: d.averageRequiredLevel,
      talentAvailabilityLevel: level
    };
  });

  const largestCandidateGaps = demandList
    .map((d) => {
      const key = normalizeSkillKey(d.skillName);
      const avgCandidate = studentCohortAvg[key] || (key === 'cloud' ? 41 : key === 'cybersecurity' ? 45 : key === 'aiml' ? 52 : 60);
      const talentDeficit = Math.max(0, d.averageRequiredLevel - avgCandidate);
      return {
        skillName: d.skillName,
        demandPercentage: d.demandPercentage,
        avgRequired: d.averageRequiredLevel,
        avgCandidateLevel: avgCandidate,
        talentDeficit
      };
    })
    .filter((g) => g.talentDeficit >= 10)
    .sort((a, b) => b.talentDeficit - a.talentDeficit)
    .slice(0, 5);

  return {
    totalActivePostingsAnalyzed: totalActive,
    mostDemandedSkills,
    platformCandidateReadiness,
    largestCandidateGaps
  };
}
