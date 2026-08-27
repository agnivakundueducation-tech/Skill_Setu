import { OpportunityRecord, RequiredSkill } from '../types/opportunity';
import { Opportunity } from '../types/student';
import { PersistedSkillProfile } from './skillService';
import { STUDENT_ASSESSED_SKILLS_MAP, resolveSkillData } from '../utils/deterministicScoring';

export interface SkillMatchDetail {
  skillId?: string;
  skillName: string;
  studentLevel: number;
  requiredLevel: number;
  importance: 'required' | 'preferred';
  status: 'strong' | 'matched' | 'partial' | 'missing';
  difference: number;
}

export interface ExplainableMatchResult {
  overallMatch: number; // 0 - 100
  requiredSkillMatch: number; // 0 - 100
  preferredSkillMatch: number; // 0 - 100
  eligibilityMatch: number; // 0 - 100
  matchedSkills: SkillMatchDetail[];
  partialMatchSkills: SkillMatchDetail[];
  missingSkills: SkillMatchDetail[];
  matchedCount: number;
  partialCount: number;
  missingCount: number;
  strengths: string[];
  skillGaps: string[];
  eligibilityStatus: string;
  explanation: string;
  recommendation: string;
  hasSkillProfile: boolean;
  hasRequirements: boolean;
  formulaWeights: {
    requiredWeight: number;
    preferredWeight: number;
    eligibilityWeight: number;
  };
}

/**
 * Baseline Centralized Weighting Matrix
 * Required Skills: 70%
 * Preferred Skills: 20%
 * Eligibility: 10%
 */
export const MATCHING_WEIGHTS = {
  REQUIRED_SKILLS: 0.70,
  PREFERRED_SKILLS: 0.20,
  ELIGIBILITY: 0.10
};

/**
 * Normalizes a skill key for consistent lookup
 */
function normalizeSkillKey(name: string): string {
  return (name || '').trim().toLowerCase().replace(/[.\s\-_/]/g, '');
}

/**
 * Retrieves the student's evaluated score for a given skill name
 */
export function getStudentSkillScore(
  skillName: string,
  studentProfile?: PersistedSkillProfile | null,
  overrides?: Record<string, number>,
  isDemo = false
): number {
  if (overrides && overrides[skillName] !== undefined) {
    return overrides[skillName];
  }

  const normTarget = normalizeSkillKey(skillName);

  // Check persisted Firestore skill profile first
  if (studentProfile?.skills && Object.keys(studentProfile.skills).length > 0) {
    for (const [key, item] of Object.entries(studentProfile.skills)) {
      const skillItem = item as any;
      if (
        normalizeSkillKey(key) === normTarget ||
        (skillItem?.skillName && normalizeSkillKey(skillItem.skillName) === normTarget) ||
        (skillItem?.name && normalizeSkillKey(skillItem.name) === normTarget)
      ) {
        return Math.round(skillItem.currentLevel ?? skillItem.currentScore ?? skillItem.score ?? 0);
      }
    }
    // Real authenticated user with an assessed profile: unlisted skill score is 0
    return 0;
  }

  // If in Demo mode and no live profile, fallback to verified demo assessed score map
  if (isDemo) {
    if (STUDENT_ASSESSED_SKILLS_MAP[skillName.toLowerCase()]) {
      return STUDENT_ASSESSED_SKILLS_MAP[skillName.toLowerCase()].score;
    }
    const resolved = resolveSkillData(skillName);
    return resolved.score;
  }

  // Authenticated user with no assessed skills has 0 verified level
  return 0;
}

/**
 * Pure Deterministic Matching Engine
 * Compares student Skill DNA with Opportunity Requirements.
 * No probabilistic or non-deterministic models are used.
 */
export function calculateOpportunityMatch(
  opportunity: OpportunityRecord | Opportunity,
  studentProfile?: PersistedSkillProfile | null,
  options?: {
    isEligible?: boolean;
    overrides?: Record<string, number>;
    isDemo?: boolean;
  }
): ExplainableMatchResult {
  const isDemo = options?.isDemo ?? false;
  const hasProfileSkills = Boolean(
    studentProfile?.skills && Object.keys(studentProfile.skills).length > 0
  );
  const hasSkillProfile = isDemo || hasProfileSkills;

  // Extract skills from OpportunityRecord or Opportunity UI interface
  let reqSkills: RequiredSkill[] = [];
  let prefSkills: RequiredSkill[] = [];

  if ((opportunity as OpportunityRecord).requiredSkills && (opportunity as OpportunityRecord).requiredSkills.length > 0) {
    reqSkills = (opportunity as OpportunityRecord).requiredSkills;
  } else if ((opportunity as Opportunity).skillsRequired && (opportunity as Opportunity).skillsRequired.length > 0) {
    reqSkills = (opportunity as Opportunity).skillsRequired.map((name, idx) => ({
      skillId: `req-${idx}-${normalizeSkillKey(name)}`,
      skillName: name,
      requiredLevel: 75,
      importance: 'required' as const
    }));
  }

  if ((opportunity as OpportunityRecord).preferredSkills && (opportunity as OpportunityRecord).preferredSkills.length > 0) {
    prefSkills = (opportunity as OpportunityRecord).preferredSkills;
  }

  const reqCount = reqSkills.length;
  const prefCount = prefSkills.length;

  // Handle Missing Requirements (Item 12)
  if (reqCount === 0 && prefCount === 0) {
    return {
      overallMatch: 0,
      requiredSkillMatch: 0,
      preferredSkillMatch: 0,
      eligibilityMatch: 0,
      matchedSkills: [],
      partialMatchSkills: [],
      missingSkills: [],
      matchedCount: 0,
      partialCount: 0,
      missingCount: 0,
      strengths: [],
      skillGaps: [],
      eligibilityStatus: 'Insufficient Requirements',
      explanation: 'Insufficient skill requirements specified for this opportunity.',
      recommendation: 'This listing does not specify explicit required competencies for algorithmic evaluation.',
      hasSkillProfile,
      hasRequirements: false,
      formulaWeights: {
        requiredWeight: 0,
        preferredWeight: 0,
        eligibilityWeight: 0
      }
    };
  }

  // Handle Authenticated User with No Skill Assessment (Item 8, 11)
  if (!hasSkillProfile) {
    const missingSkills: SkillMatchDetail[] = reqSkills.map((skill) => ({
      skillId: skill.skillId,
      skillName: skill.skillName,
      studentLevel: 0,
      requiredLevel: skill.requiredLevel,
      importance: 'required' as const,
      status: 'missing' as const,
      difference: -skill.requiredLevel
    }));

    return {
      overallMatch: 0,
      requiredSkillMatch: 0,
      preferredSkillMatch: 0,
      eligibilityMatch: 0,
      matchedSkills: [],
      partialMatchSkills: [],
      missingSkills,
      matchedCount: 0,
      partialCount: 0,
      missingCount: missingSkills.length,
      strengths: [],
      skillGaps: missingSkills.map((s) => `${s.skillName} (Assessment Required, Target: ${s.requiredLevel})`),
      eligibilityStatus: 'Assessment Required',
      explanation: 'Complete your Skill Assessment to calculate opportunity matches.',
      recommendation: 'Take the verified diagnostic assessment to evaluate your compatibility with this role.',
      hasSkillProfile: false,
      hasRequirements: true,
      formulaWeights: {
        requiredWeight: MATCHING_WEIGHTS.REQUIRED_SKILLS,
        preferredWeight: MATCHING_WEIGHTS.PREFERRED_SKILLS,
        eligibilityWeight: MATCHING_WEIGHTS.ELIGIBILITY
      }
    };
  }

  const matchedSkills: SkillMatchDetail[] = [];
  const partialMatchSkills: SkillMatchDetail[] = [];
  const missingSkills: SkillMatchDetail[] = [];
  const strengths: string[] = [];
  const skillGaps: string[] = [];

  // 1. Evaluate Required Skills
  let reqTotalCredit = 0;

  reqSkills.forEach((skill) => {
    const studentLevel = getStudentSkillScore(skill.skillName, studentProfile, options?.overrides, isDemo);
    const requiredLevel = skill.requiredLevel;
    const diff = studentLevel - requiredLevel;

    if (studentLevel >= requiredLevel) {
      const isStrong = studentLevel > requiredLevel;
      const detail: SkillMatchDetail = {
        skillId: skill.skillId,
        skillName: skill.skillName,
        studentLevel,
        requiredLevel,
        importance: 'required',
        status: isStrong ? 'strong' : 'matched',
        difference: diff
      };
      matchedSkills.push(detail);
      reqTotalCredit += 1.0;
      strengths.push(`${skill.skillName} (${studentLevel}/${requiredLevel})`);
    } else if (studentLevel >= requiredLevel - 15 && studentLevel > 0) {
      // Partial match: credit scaled linearly within the 15-point window
      const partialRatio = Math.max(0.4, studentLevel / requiredLevel);
      const detail: SkillMatchDetail = {
        skillId: skill.skillId,
        skillName: skill.skillName,
        studentLevel,
        requiredLevel,
        importance: 'required',
        status: 'partial',
        difference: diff
      };
      partialMatchSkills.push(detail);
      reqTotalCredit += partialRatio;
      skillGaps.push(`${skill.skillName} (Current: ${studentLevel}, Target: ${requiredLevel})`);
    } else {
      // Skill Gap
      const detail: SkillMatchDetail = {
        skillId: skill.skillId,
        skillName: skill.skillName,
        studentLevel,
        requiredLevel,
        importance: 'required',
        status: 'missing',
        difference: diff
      };
      missingSkills.push(detail);
      skillGaps.push(`${skill.skillName} (${studentLevel > 0 ? `Current: ${studentLevel}` : 'Not demonstrated'}, Target: ${requiredLevel})`);
    }
  });

  const requiredSkillMatch = reqCount > 0 ? Math.round((reqTotalCredit / reqCount) * 100) : 100;

  // 2. Evaluate Preferred Skills
  let prefTotalCredit = 0;

  prefSkills.forEach((skill) => {
    const studentLevel = getStudentSkillScore(skill.skillName, studentProfile, options?.overrides, isDemo);
    const requiredLevel = skill.requiredLevel;
    const diff = studentLevel - requiredLevel;

    if (studentLevel >= requiredLevel) {
      const isStrong = studentLevel > requiredLevel;
      const detail: SkillMatchDetail = {
        skillId: skill.skillId,
        skillName: skill.skillName,
        studentLevel,
        requiredLevel,
        importance: 'preferred',
        status: isStrong ? 'strong' : 'matched',
        difference: diff
      };
      matchedSkills.push(detail);
      prefTotalCredit += 1.0;
    } else if (studentLevel >= requiredLevel - 15 && studentLevel > 0) {
      const partialRatio = Math.max(0.4, studentLevel / requiredLevel);
      const detail: SkillMatchDetail = {
        skillId: skill.skillId,
        skillName: skill.skillName,
        studentLevel,
        requiredLevel,
        importance: 'preferred',
        status: 'partial',
        difference: diff
      };
      partialMatchSkills.push(detail);
      prefTotalCredit += partialRatio;
    } else {
      const detail: SkillMatchDetail = {
        skillId: skill.skillId,
        skillName: skill.skillName,
        studentLevel,
        requiredLevel,
        importance: 'preferred',
        status: 'missing',
        difference: diff
      };
      missingSkills.push(detail);
    }
  });

  const preferredSkillMatch = prefCount > 0 ? Math.round((prefTotalCredit / prefCount) * 100) : 100;

  // 3. Evaluate Eligibility
  const isEligible = options?.isEligible !== undefined ? options.isEligible : true;
  const eligibilityMatch = isEligible ? 100 : 0;
  const eligibilityStatus = isEligible ? 'Eligible' : 'Check Requirements';

  // 4. Calculate Overall Match with Proportional Distribution
  let reqWeight = MATCHING_WEIGHTS.REQUIRED_SKILLS;
  let prefWeight = MATCHING_WEIGHTS.PREFERRED_SKILLS;
  let eligWeight = MATCHING_WEIGHTS.ELIGIBILITY;

  if (prefCount === 0) {
    reqWeight += prefWeight;
    prefWeight = 0;
  }

  const overallScoreRaw =
    (requiredSkillMatch * reqWeight) +
    (preferredSkillMatch * prefWeight) +
    (eligibilityMatch * eligWeight);

  const overallMatch = Math.min(100, Math.max(0, Math.round(overallScoreRaw)));

  // 5. Generate Transparent Natural Explanations & Recommendations
  const strongMatchesCount = matchedSkills.filter((s) => s.importance === 'required').length;
  const explanation = `Your profile matches ${requiredSkillMatch}% of the required skills (${strongMatchesCount} of ${reqCount} core competencies fully demonstrated).`;

  let recommendation = '';
  if (missingSkills.length > 0 || partialMatchSkills.length > 0) {
    const focusSkills = [...missingSkills, ...partialMatchSkills]
      .slice(0, 3)
      .map((s) => s.skillName)
      .join(' and ');
    recommendation = `Strengthen ${focusSkills} through verified projects or guided practice to maximize your alignment.`;
  } else {
    recommendation = 'You have strong direct alignment with all required technical and professional competencies.';
  }

  return {
    overallMatch,
    requiredSkillMatch,
    preferredSkillMatch,
    eligibilityMatch,
    matchedSkills,
    partialMatchSkills,
    missingSkills,
    matchedCount: matchedSkills.length,
    partialCount: partialMatchSkills.length,
    missingCount: missingSkills.length,
    strengths,
    skillGaps,
    eligibilityStatus,
    explanation,
    recommendation,
    hasSkillProfile: true,
    hasRequirements: true,
    formulaWeights: {
      requiredWeight: reqWeight,
      preferredWeight: prefWeight,
      eligibilityWeight: eligWeight
    }
  };
}

