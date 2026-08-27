/**
 * Skill Calculation & Intelligence Service
 * 
 * Deterministic, reproducible calculations for Skill DNA, Skill Gaps, and Career Readiness.
 * Free of artificial randomness or unprompted AI hallucinations.
 */

import { AssessmentFormState, AssessmentResult } from '../types/assessment';
import {
  BASELINE_INDUSTRY_REQUIREMENTS,
  IndustrySkillRequirement,
  getIndustryRequirementForSkill
} from '../data/industrySkillRequirements';
import { SkillDnaItem, SkillDnaOverallMetrics } from '../types/skillDna';
import { SkillGapItem, PriorityLevel, GapStatus } from '../types/skillGap';

export type SkillPriority = 'low' | 'medium' | 'high' | 'critical';

export interface PersistedSkillItem {
  skillId: string;
  skillName: string;
  category: 'technical' | 'professional';
  subcategory: string;
  currentLevel: number;
  industryRequiredLevel: number;
  gap: number;
  verificationScore: number;
  evidenceCount: number;
  priority: SkillPriority;
  updatedAt: string;
  iconName?: string;
  description?: string;
  keyCompetencies?: string[];
}

export interface PersistedSkillProfile {
  uid: string;
  skills: Record<string, PersistedSkillItem>;
  overallReadiness: number;
  technicalAverage: number;
  professionalAverage: number;
  totalSkillsCount: number;
  criticalGapsCount: number;
  tierLabel: string;
  lastAssessedAt: string;
  updatedAt: string;
}

export interface StudentFirestoreProfile {
  uid: string;
  fullName: string;
  email: string;
  institution: string;
  department: string;
  degree?: string;
  graduationYear?: string;
  careerGoal?: string;
  careerInterests?: string[];
  readinessScore: number;
  profileCompletion: number;
  updatedAt: string;
}

export interface StudentAssessmentRecord {
  assessmentId: string;
  uid: string;
  careerGoal: string;
  careerInterests: AssessmentFormState['careerInterests'];
  technicalResponses: AssessmentFormState['technicalSkills'];
  softSkillResponses: AssessmentFormState['softSkills'];
  aptitudeResponses?: AssessmentFormState['aptitude'];
  careerPreferences?: AssessmentFormState['careerPreferences'];
  readinessScore: number;
  percentileRank: number;
  tierLabel: string;
  strengths: AssessmentResult['strengths'];
  weaknesses: AssessmentResult['weaknesses'];
  skillGaps: AssessmentResult['skillGaps'];
  recommendedRoles: AssessmentResult['recommendedRoles'];
  completedAt: string;
}

/**
 * Calculates priority based on strict Phase 14C-A gap rules:
 * gap = industryRequiredLevel - currentLevel
 * If gap <= 0: priority = "low"
 * If gap is between 1 and 15: priority = "medium"
 * If gap is between 16 and 30: priority = "high"
 * If gap > 30: priority = "critical"
 */
export function calculateSkillPriority(gap: number): SkillPriority {
  if (gap <= 0) return 'low';
  if (gap <= 15) return 'medium';
  if (gap <= 30) return 'high';
  return 'critical';
}

/**
 * Map SkillPriority to UI PriorityLevel
 */
export function mapToUiPriority(priority: SkillPriority): PriorityLevel {
  switch (priority) {
    case 'critical':
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
    default:
      return 'Low';
  }
}

/**
 * Map gap status indicator color
 */
export function getGapStatus(gap: number): { status: GapStatus; indicatorColor: 'red' | 'yellow' | 'green' } {
  if (gap <= 0) {
    return { status: 'aligned', indicatorColor: 'green' };
  }
  if (gap <= 15) {
    return { status: 'moderate', indicatorColor: 'yellow' };
  }
  return { status: 'critical', indicatorColor: 'red' };
}

/**
 * Deterministic Career Readiness Score calculation
 * Synthesizes tech, soft, practical experience, problem solving, and learning commitment.
 */
export function calculateCareerReadiness(formState: AssessmentFormState): {
  readinessScore: number;
  percentileRank: number;
  tierLabel: string;
  techAvg: number;
  softAvg: number;
} {
  const { careerInterests, technicalSkills, softSkills, careerPreferences } = formState;

  const techScores = [
    (technicalSkills.frontendRating || 3) * 20,
    (technicalSkills.backendRating || 3) * 20,
    (technicalSkills.databaseRating || 3) * 20,
    (technicalSkills.cloudDevOpsRating || 3) * 20,
    (technicalSkills.dsaRating || 3) * 20,
    (technicalSkills.systemDesignRating || 3) * 20
  ];
  const techAvg = Math.round(techScores.reduce((a, b) => a + b, 0) / techScores.length);

  const softScores = [
    (softSkills.communicationRating || 3) * 20,
    (softSkills.problemDecompositionRating || 3) * 20,
    (softSkills.teamCollaborationRating || 3) * 20,
    (softSkills.codeReviewRating || 3) * 20,
    (softSkills.adaptabilityRating || 3) * 20,
    (softSkills.conflictResolutionRating || 3) * 20
  ];
  const softAvg = Math.round(softScores.reduce((a, b) => a + b, 0) / softScores.length);

  const practicalScore = technicalSkills.practicalExperienceScore || 70;
  const passionScore = (careerInterests.problemSolvingPassion || 8) * 10;
  const stressScore = (softSkills.stressManagementScore || 7) * 10;
  const learningCommitmentBonus = Math.min(10, Math.round(((careerPreferences.weeklyUpskillingHours || 10) / 20) * 10));

  const rawScore = Math.round(
    techAvg * 0.40 +
    softAvg * 0.25 +
    practicalScore * 0.15 +
    passionScore * 0.10 +
    stressScore * 0.05 +
    learningCommitmentBonus * 0.5
  );

  const readinessScore = Math.min(99, Math.max(50, rawScore));
  const percentileRank = Math.min(99, Math.max(60, Math.round(readinessScore * 1.08)));

  let tierLabel = 'Enterprise Capable';
  if (readinessScore >= 88) {
    tierLabel = 'Tier-1 Industry Ready';
  } else if (readinessScore >= 75) {
    tierLabel = 'Enterprise Capable';
  } else if (readinessScore >= 65) {
    tierLabel = 'High-Growth Contender';
  } else {
    tierLabel = 'Foundation Building';
  }

  return { readinessScore, percentileRank, tierLabel, techAvg, softAvg };
}

/**
 * Deterministically computes a complete PersistedSkillProfile from Assessment Responses
 */
export function computeSkillProfileFromAssessment(
  uid: string,
  formState: AssessmentFormState
): PersistedSkillProfile {
  const { careerInterests, technicalSkills, softSkills } = formState;
  const nowIso = new Date().toISOString();

  // 1. Calculate technical levels (0-100)
  const fe = (technicalSkills.frontendRating || 3) * 20;
  const be = (technicalSkills.backendRating || 3) * 20;
  const dsaVal = (technicalSkills.dsaRating || 3) * 20;
  const dbVal = (technicalSkills.databaseRating || 3) * 20;
  const cloudVal = (technicalSkills.cloudDevOpsRating || 3) * 20;
  const sysVal = (technicalSkills.systemDesignRating || 3) * 20;
  const pracVal = technicalSkills.practicalExperienceScore || 70;

  const progCurrent = Math.min(100, Math.max(40, Math.round(((fe + be) / 2) * 0.95)));
  const dsaCurrent = Math.min(100, Math.max(40, Math.round(dsaVal * 0.95)));
  const dbCurrent = Math.min(100, Math.max(40, Math.round(dbVal * 0.95)));
  const webCurrent = Math.min(100, Math.max(40, Math.round(((fe * 0.6) + (pracVal * 0.4)))));
  const cloudCurrent = Math.min(100, Math.max(40, Math.round(cloudVal * 0.92)));

  const hasAimlInterest = careerInterests.industrySectors?.some((s) => s.toLowerCase().includes('ai') || s.toLowerCase().includes('machine learning'));
  const aimlCurrent = hasAimlInterest
    ? Math.min(100, Math.max(50, Math.round((sysVal * 0.6 + pracVal * 0.4))))
    : Math.min(100, Math.max(40, Math.round(sysVal * 0.85)));

  const secCurrent = Math.min(100, Math.max(40, Math.round((cloudVal * 0.5 + sysVal * 0.5))));

  // 2. Calculate professional levels (0-100)
  const commVal = (softSkills.communicationRating || 3) * 20;
  const probVal = (softSkills.problemDecompositionRating || 3) * 20;
  const teamVal = (softSkills.teamCollaborationRating || 3) * 20;
  const reviewVal = (softSkills.codeReviewRating || 3) * 20;
  const adaptVal = (softSkills.adaptabilityRating || 3) * 20;
  const conflictVal = (softSkills.conflictResolutionRating || 3) * 20;

  const commCurrent = Math.min(100, Math.max(45, Math.round(commVal * 0.95)));
  const teamCurrent = Math.min(100, Math.max(45, Math.round(((teamVal + reviewVal) / 2) * 0.95)));
  const leadCurrent = Math.min(100, Math.max(40, Math.round(((conflictVal + adaptVal) / 2) * 0.92)));
  const probCurrent = Math.min(100, Math.max(45, Math.round(((probVal + adaptVal) / 2) * 0.96)));
  const aptitudeCurrent = formState.aptitude?.totalScore !== undefined
    ? Math.min(100, Math.max(40, formState.aptitude.totalScore))
    : 80;

  const skillsMap: Record<string, PersistedSkillItem> = {};

  const definitions: Array<{ id: string; current: number; competencies: string[] }> = [
    {
      id: 'tech-programming',
      current: progCurrent,
      competencies: ['Type-Level TypeScript & Generics', 'Python Async & Data Structures', 'Clean Architecture & Idioms']
    },
    {
      id: 'tech-dsa',
      current: dsaCurrent,
      competencies: ['Graph Theory & Traversals', 'Dynamic Programming', 'Space-Time Optimization']
    },
    {
      id: 'tech-database',
      current: dbCurrent,
      competencies: ['Relational Schema Design', 'Indexing & Query Plans', 'NoSQL & Caching Patterns']
    },
    {
      id: 'tech-web',
      current: webCurrent,
      competencies: ['State Management & Hydration', 'Responsive CSS / Tailwind', 'Web Performance & Accessibility']
    },
    {
      id: 'tech-cloud',
      current: cloudCurrent,
      competencies: ['Docker & Container Workflows', 'CI/CD Pipelines', 'Cloud Deployments & Serverless']
    },
    {
      id: 'tech-aiml',
      current: aimlCurrent,
      competencies: ['Prompt Engineering & LLM APIs', 'Vector Embeddings', 'Model Evaluation & Data Prep']
    },
    {
      id: 'tech-security',
      current: secCurrent,
      competencies: ['OWASP Top 10 Mitigation', 'Zero-Trust Authentication', 'Secrets Management']
    },
    {
      id: 'prof-comm',
      current: commCurrent,
      competencies: ['Technical Documentation', 'Cross-Functional Presentation', 'Constructive PR Review Notes']
    },
    {
      id: 'prof-teamwork',
      current: teamCurrent,
      competencies: ['Collaborative Coding', 'Asynchronous Agility', 'Active Empathy & Knowledge Sharing']
    },
    {
      id: 'prof-leadership',
      current: leadCurrent,
      competencies: ['Initiative & Ownership', 'Peer Mentorship', 'Conflict Resolution']
    },
    {
      id: 'prof-problemsolving',
      current: probCurrent,
      competencies: ['Systematic Root-Cause Diagnosis', 'Decomposition of Ambiguous Issues', 'Trade-off Analysis']
    },
    {
      id: 'prof-aptitude',
      current: aptitudeCurrent,
      competencies: ['Quantitative Problem Solving', 'Logical Deduction & Pattern Recognition', 'Verbal Reasoning & Technical Comprehension']
    }
  ];

  let criticalCount = 0;
  const techScoresList: number[] = [];
  const profScoresList: number[] = [];

  definitions.forEach((def) => {
    const baseline = BASELINE_INDUSTRY_REQUIREMENTS[def.id];
    const requiredLevel = baseline ? baseline.requiredLevel : 75;
    const rawGap = requiredLevel - def.current;
    const priority = calculateSkillPriority(rawGap);

    if (priority === 'critical') {
      criticalCount++;
    }

    if (baseline?.category === 'technical') {
      techScoresList.push(def.current);
    } else {
      profScoresList.push(def.current);
    }

    skillsMap[def.id] = {
      skillId: def.id,
      skillName: baseline ? baseline.skillName : def.id,
      category: baseline ? baseline.category : 'technical',
      subcategory: baseline ? baseline.subcategory : 'General',
      currentLevel: def.current,
      industryRequiredLevel: requiredLevel,
      gap: rawGap,
      verificationScore: 0, // Explicitly 0 / assessment-based until proctored verification evidence is added
      evidenceCount: 0, // Clean baseline without artificial verification evidence
      priority,
      updatedAt: nowIso,
      iconName: baseline ? baseline.iconName : 'Code',
      description: baseline ? baseline.description : '',
      keyCompetencies: def.competencies
    };
  });

  const readiness = calculateCareerReadiness(formState);
  const techAverage = techScoresList.length > 0
    ? Math.round(techScoresList.reduce((a, b) => a + b, 0) / techScoresList.length)
    : 70;
  const professionalAverage = profScoresList.length > 0
    ? Math.round(profScoresList.reduce((a, b) => a + b, 0) / profScoresList.length)
    : 70;

  return {
    uid,
    skills: skillsMap,
    overallReadiness: readiness.readinessScore,
    technicalAverage: techAverage,
    professionalAverage: professionalAverage,
    totalSkillsCount: definitions.length,
    criticalGapsCount: criticalCount,
    tierLabel: readiness.tierLabel,
    lastAssessedAt: nowIso,
    updatedAt: nowIso
  };
}

/**
 * Transforms PersistedSkillProfile into SkillDnaItem[] and SkillDnaOverallMetrics for UI rendering
 */
export function formatPersistedProfileToSkillDna(profile: PersistedSkillProfile): {
  items: SkillDnaItem[];
  metrics: SkillDnaOverallMetrics;
} {
  const items: SkillDnaItem[] = Object.values(profile.skills).map((skill) => {
    let levelLabel: SkillDnaItem['level'] = 'Intermediate';
    if (skill.currentLevel >= 90) levelLabel = 'Master';
    else if (skill.currentLevel >= 80) levelLabel = 'Expert';
    else if (skill.currentLevel >= 70) levelLabel = 'Advanced';
    else if (skill.currentLevel >= 55) levelLabel = 'Intermediate';
    else levelLabel = 'Novice';

    const evidenceList: SkillDnaItem['evidenceList'] = [];
    if (skill.skillId === 'prof-aptitude' && skill.currentLevel > 0) {
      evidenceList.push({
        id: 'ev-aptitude-assessment',
        title: 'Cognitive & Aptitude Standardized Evaluation',
        type: 'assessment',
        date: new Date(profile.updatedAt).toISOString().split('T')[0],
        verifiedBy: 'SkillSetu Deterministic Assessment Engine',
        verificationBadge: 'Standardized Assessment',
        description: 'Multi-category assessment evaluating Quantitative Aptitude, Logical Reasoning, and Verbal Comprehension.',
        scoreOrMetric: `${skill.currentLevel}% Score`
      });
    }

    const effectiveEvidenceCount = skill.evidenceCount + evidenceList.length;

    return {
      id: skill.skillId,
      name: skill.skillName,
      category: skill.category,
      subcategory: skill.subcategory,
      iconName: skill.iconName || 'Code',
      currentScore: skill.currentLevel,
      verificationScore: skill.verificationScore, // 0 for assessment-based
      evidenceCount: effectiveEvidenceCount,
      industryBenchmark: skill.industryRequiredLevel,
      percentile: Math.min(99, Math.max(50, Math.round(skill.currentLevel * 1.06))),
      level: levelLabel,
      growthChange: Math.max(0, Math.round((skill.currentLevel - 60) * 0.3)),
      description: skill.description || `${skill.skillName} capability benchmarked against industry standard (${skill.industryRequiredLevel}%).`,
      keyCompetencies: skill.keyCompetencies || [],
      evidenceList,
      verificationStatus: effectiveEvidenceCount > 0 ? 'verified' : 'in_review'
    };
  });

  const techItems = items.filter((i) => i.category === 'technical');
  const profItems = items.filter((i) => i.category === 'professional');

  const techAvg = techItems.length > 0
    ? Math.round(techItems.reduce((a, b) => a + b.currentScore, 0) / techItems.length)
    : profile.technicalAverage || 75;

  const profAvg = profItems.length > 0
    ? Math.round(profItems.reduce((a, b) => a + b.currentScore, 0) / profItems.length)
    : profile.professionalAverage || 75;

  const metrics: SkillDnaOverallMetrics = {
    overallVerifiedScore: profile.overallReadiness,
    overallCurrentScore: Math.round((techAvg + profAvg) / 2),
    verificationConfidence: 85,
    totalEvidenceCount: items.reduce((acc, i) => acc + i.evidenceCount, 0),
    technicalAverage: techAvg,
    professionalAverage: profAvg,
    topPercentile: Math.min(99, Math.round(profile.overallReadiness * 1.08)),
    tier: profile.tierLabel || 'Enterprise Capable',
    lastUpdated: `Firestore Sync (${new Date(profile.updatedAt).toLocaleDateString()})`
  };

  return { items, metrics };
}

/**
 * Transforms PersistedSkillProfile into SkillGapItem[] for UI rendering
 */
export function formatPersistedProfileToSkillGaps(profile: PersistedSkillProfile): SkillGapItem[] {
  return Object.values(profile.skills).map((skill) => {
    const rawGap = skill.industryRequiredLevel - skill.currentLevel;
    const clampedGap = Math.max(0, rawGap);
    const { status, indicatorColor } = getGapStatus(rawGap);
    const priority = mapToUiPriority(skill.priority);

    let recommendation = `Target level: ${skill.industryRequiredLevel}%. Practice key project modules to bridge the gap.`;
    if (status === 'critical') {
      recommendation = `Priority focus area: Complete targeted hands-on labs and foundational modules.`;
    } else if (status === 'aligned') {
      recommendation = `Aligned with industry baseline! Maintain readiness with capstone applications.`;
    }

    return {
      id: skill.skillId,
      name: skill.skillName,
      category: skill.category,
      subcategory: skill.subcategory,
      iconName: skill.iconName || 'Code',
      currentLevel: skill.currentLevel,
      requiredLevel: skill.industryRequiredLevel,
      gap: clampedGap, // Clamped to never be negative in UI
      priority,
      status,
      indicatorColor,
      recommendation,
      detailedActionPlan: [
        `Review foundational concepts in ${skill.skillName}`,
        `Build a hands-on project demonstrating ${skill.skillName}`,
        `Complete a skill benchmark verification`
      ],
      recommendedResources: [
        {
          id: `res-${skill.skillId}`,
          title: `${skill.skillName} Industry Accelerator`,
          provider: 'SkillSetu Curriculum',
          duration: '3 Weeks',
          level: skill.currentLevel > 70 ? 'Advanced' : 'Intermediate',
          type: 'hands-on-lab',
          isIndustryStandard: true
        }
      ],
      marketDemandScore: skill.category === 'technical' ? 88 : 82,
      hiringImpact: status === 'critical' ? 'High Impact' : 'Standard Metric'
    };
  });
}
