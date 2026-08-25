/**
 * Pure Deterministic Scoring Engine for Skill Compatibility & Match Scores.
 * No AI or probabilistic models are used — all calculations are 100% mathematical,
 * reproducible, and rule-based.
 */

import { Opportunity } from '../types/student';

export type SkillMatchStatus = 'matched' | 'partial' | 'missing';

export interface SkillMatchItem {
  name: string;
  status: SkillMatchStatus;
  symbol: '✓' | '△' | '✕';
  candidateScore: number;
  thresholdScore: number;
  weightPercent: number;
  potentialGainPercent: number;
  explanation: string;
  category: string;
  level: string;
}

export interface DeterministicMatchResult {
  matchScore: number;
  rawScore: number;
  matchedSkills: SkillMatchItem[];
  partialSkills: SkillMatchItem[];
  missingSkills: SkillMatchItem[];
  explanations: string[];
  totalSkillsCount: number;
  matchedCount: number;
  partialCount: number;
  missingCount: number;
  potentialMaxScore: number;
}

// Student verified assessed score repository (0 - 100)
export const STUDENT_ASSESSED_SKILLS_MAP: Record<string, { score: number; category: string; level: string }> = {
  // Fully Matched (Score >= 75)
  'python': { score: 90, category: 'Programming Languages', level: 'Expert (Verified Master)' },
  'react': { score: 95, category: 'Frontend Engineering', level: 'Expert (Top 3% percentile)' },
  'react 19': { score: 95, category: 'Frontend Engineering', level: 'Expert (Top 3% percentile)' },
  'sql': { score: 88, category: 'Data & Databases', level: 'Advanced (Verified Pro)' },
  'postgresql': { score: 88, category: 'Data & Databases', level: 'Advanced (Verified Pro)' },
  'typescript': { score: 92, category: 'Frontend Engineering', level: 'Expert (Verified Pro)' },
  'javascript': { score: 92, category: 'Frontend Engineering', level: 'Expert (Verified Pro)' },
  'node.js': { score: 90, category: 'Backend Systems', level: 'Advanced (Verified Pro)' },
  'next.js': { score: 92, category: 'Frontend Engineering', level: 'Expert (Verified Pro)' },
  'rest apis': { score: 92, category: 'Backend Systems', level: 'Expert' },
  'api design': { score: 90, category: 'Backend Systems', level: 'Advanced' },
  'ci/cd': { score: 89, category: 'Cloud & DevOps', level: 'Advanced (Verified Pro)' },
  'git': { score: 90, category: 'Engineering Practices', level: 'Expert' },
  'github actions': { score: 89, category: 'Cloud & DevOps', level: 'Advanced' },
  'tailwind css': { score: 94, category: 'Frontend Engineering', level: 'Expert' },
  'html/css': { score: 94, category: 'Frontend Engineering', level: 'Expert' },
  'distributed systems': { score: 86, category: 'System Architecture', level: 'Advanced (Verified Pro)' },
  'system architecture': { score: 86, category: 'System Architecture', level: 'Advanced' },
  'vector dbs': { score: 84, category: 'AI & Data Platforms', level: 'Intermediate' },
  'problem solving': { score: 88, category: 'Core CS', level: 'Advanced' },
  'agile leadership': { score: 91, category: 'Professional Skills', level: 'Expert' },
  'design systems': { score: 80, category: 'Frontend & UI', level: 'Advanced' },

  // Partial Skills (40 <= Score < 75)
  'dsa': { score: 62, category: 'Core CS & Algorithms', level: 'Intermediate (In-Progress)' },
  'data structures': { score: 65, category: 'Core CS & Algorithms', level: 'Intermediate' },
  'algorithms': { score: 65, category: 'Core CS & Algorithms', level: 'Intermediate' },
  'redis': { score: 64, category: 'Databases & Caching', level: 'Intermediate' },
  'caching': { score: 64, category: 'Databases & Caching', level: 'Intermediate' },
  'graphql': { score: 60, category: 'API Architecture', level: 'Foundational' },
  'kubernetes': { score: 68, category: 'Cloud & DevOps', level: 'Intermediate' },
  'microservices': { score: 70, category: 'System Architecture', level: 'Intermediate' },
  'zero trust': { score: 50, category: 'Security & Cloud', level: 'Foundational' },
  'huggingface': { score: 55, category: 'AI & Machine Learning', level: 'Foundational' },
  'transformers': { score: 52, category: 'AI & Machine Learning', level: 'Foundational' },
  'pytorch': { score: 50, category: 'AI & Machine Learning', level: 'Foundational' },
  'aws': { score: 60, category: 'Cloud Platforms', level: 'Intermediate' },
  'figma': { score: 65, category: 'UI & Design', level: 'Intermediate' },
  'micro-interactions': { score: 60, category: 'UI & Motion', level: 'Foundational' },
  'websockets': { score: 72, category: 'Realtime Networking', level: 'Intermediate' },

  // Missing Skills (Score < 40 or Unassessed)
  'docker': { score: 20, category: 'Cloud & DevOps', level: 'Needs Assessment' },
  'rust': { score: 0, category: 'Systems Programming', level: 'Unassessed' },
  'go': { score: 10, category: 'Backend Systems', level: 'Unassessed' },
  'golang': { score: 10, category: 'Backend Systems', level: 'Unassessed' },
  'kafka': { score: 15, category: 'Event Streaming', level: 'Unassessed' },
  'apache kafka': { score: 15, category: 'Event Streaming', level: 'Unassessed' },
  'hashicorp vault': { score: 0, category: 'Security & Secrets', level: 'Unassessed' },
  'audio processing': { score: 10, category: 'Signal & Audio AI', level: 'Unassessed' },
  'cuda': { score: 0, category: 'GPU Acceleration', level: 'Unassessed' },
  'solidity': { score: 0, category: 'Blockchain & Smart Contracts', level: 'Unassessed' },
  'terraform': { score: 0, category: 'Infrastructure as Code', level: 'Unassessed' },
  'webrtc': { score: 10, category: 'Realtime Streaming', level: 'Unassessed' },
  'grpc': { score: 25, category: 'Networking & RPC', level: 'Foundational' },
  'figma tokens': { score: 20, category: 'Design Systems', level: 'Unassessed' }
};

/**
 * Normalizes a skill string for deterministic key lookup
 */
export function normalizeSkillName(skill: string): string {
  return skill.trim().toLowerCase();
}

/**
 * Resolves candidate score and classification for a given skill name
 */
export function resolveSkillData(skillName: string): {
  score: number;
  category: string;
  level: string;
} {
  const normalized = normalizeSkillName(skillName);

  // Direct lookup
  if (STUDENT_ASSESSED_SKILLS_MAP[normalized]) {
    return STUDENT_ASSESSED_SKILLS_MAP[normalized];
  }

  // Alias / Substring lookup
  for (const [key, data] of Object.entries(STUDENT_ASSESSED_SKILLS_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return data;
    }
  }

  // Default fallback for completely unassessed skills
  return {
    score: 0,
    category: 'Specialized Domain',
    level: 'Unassessed'
  };
}

/**
 * Computes deterministic match score, skill categorization (Matched, Partial, Missing),
 * and deterministic impact explanations without any AI or random variations.
 */
import { PersistedSkillProfile } from '../services/skillService';

export function calculateDeterministicOpportunityMatch(
  opportunity: Opportunity,
  simulatedSkillsOverride?: Record<string, number>,
  studentProfile?: PersistedSkillProfile | null,
  isDemo = false
): DeterministicMatchResult {
  // Extract required skills from skillsRequired or requiredSkills without inventing fake skills
  let requiredSkills = opportunity.skillsRequired && opportunity.skillsRequired.length > 0
    ? opportunity.skillsRequired
    : (opportunity as any).requiredSkills && (opportunity as any).requiredSkills.length > 0
      ? (opportunity as any).requiredSkills.map((s: any) => s.skillName)
      : [];

  const totalCount = requiredSkills.length;
  if (totalCount === 0) {
    return {
      matchScore: 0,
      rawScore: 0,
      matchedSkills: [],
      partialSkills: [],
      missingSkills: [],
      explanations: ['Insufficient requirements specified for this opportunity.'],
      totalSkillsCount: 0,
      matchedCount: 0,
      partialCount: 0,
      missingCount: 0,
      potentialMaxScore: 0
    };
  }

  // Deterministic weight per skill in percentage
  const weightPerSkill = 100 / totalCount;

  const matchedSkills: SkillMatchItem[] = [];
  const partialSkills: SkillMatchItem[] = [];
  const missingSkills: SkillMatchItem[] = [];

  let accumulatedWeightedScore = 0;

  // Helper to extract student's score
  const getSkillLevel = (skillName: string): number => {
    if (simulatedSkillsOverride && simulatedSkillsOverride[skillName] !== undefined) {
      return simulatedSkillsOverride[skillName];
    }
    const norm = skillName.trim().toLowerCase().replace(/[.\s\-_/]/g, '');

    // Check student profile from Firestore
    if (studentProfile?.skills && Object.keys(studentProfile.skills).length > 0) {
      for (const [key, item] of Object.entries(studentProfile.skills)) {
        const itemObj = item as any;
        const itemNorm = (itemObj?.name || itemObj?.skillName || key).trim().toLowerCase().replace(/[.\s\-_/]/g, '');
        if (itemNorm === norm) {
          return Math.round(itemObj.currentLevel ?? itemObj.currentScore ?? itemObj.score ?? 0);
        }
      }
      return 0; // Skill not in verified profile for authenticated user
    }

    // Demo Mode fallback
    if (isDemo) {
      const rawData = resolveSkillData(skillName);
      return rawData.score;
    }

    // Unassessed authenticated user
    return 0;
  };

  requiredSkills.forEach((skill) => {
    const rawData = resolveSkillData(skill);
    const effectiveScore = getSkillLevel(skill);

    let status: SkillMatchStatus;
    let symbol: '✓' | '△' | '✕';
    let potentialGainPercent = 0;
    let explanation = '';

    if (effectiveScore >= 75) {
      status = 'matched';
      symbol = '✓';
      accumulatedWeightedScore += 1.0 * weightPerSkill;
      potentialGainPercent = 0;
      explanation = `Verified competency in ${skill} (${effectiveScore}/100) contributes full ${Math.round(weightPerSkill)}% to compatibility.`;
      matchedSkills.push({
        name: skill,
        status,
        symbol,
        candidateScore: effectiveScore,
        thresholdScore: 75,
        weightPercent: Math.round(weightPerSkill),
        potentialGainPercent: 0,
        explanation,
        category: rawData.category,
        level: rawData.level
      });
    } else if (effectiveScore >= 40 && effectiveScore > 0) {
      status = 'partial';
      symbol = '△';
      accumulatedWeightedScore += 0.5 * weightPerSkill;
      potentialGainPercent = Math.round(0.5 * weightPerSkill);
      if (potentialGainPercent < 4) potentialGainPercent = 6;
      explanation = `Improving ${skill} skills could increase compatibility by ${potentialGainPercent}%.`;
      partialSkills.push({
        name: skill,
        status,
        symbol,
        candidateScore: effectiveScore,
        thresholdScore: 75,
        weightPercent: Math.round(weightPerSkill),
        potentialGainPercent,
        explanation,
        category: rawData.category,
        level: rawData.level
      });
    } else {
      status = 'missing';
      symbol = '✕';
      accumulatedWeightedScore += 0.0 * weightPerSkill;
      potentialGainPercent = Math.round(1.0 * weightPerSkill);
      if (potentialGainPercent < 8) potentialGainPercent = 12;
      explanation = effectiveScore > 0 
        ? `Improving ${skill} skills could increase compatibility by ${potentialGainPercent}%.`
        : `Completing verified assessment in ${skill} could increase compatibility by ${potentialGainPercent}%.`;
      missingSkills.push({
        name: skill,
        status,
        symbol,
        candidateScore: effectiveScore,
        thresholdScore: 75,
        weightPercent: Math.round(weightPerSkill),
        potentialGainPercent,
        explanation,
        category: rawData.category,
        level: rawData.level
      });
    }
  });

  // Calculate clean deterministic score (rounded to integer, clamped between 0 and 100)
  const finalMatchScore = Math.min(100, Math.max(0, Math.round(accumulatedWeightedScore)));

  // Generate deterministic explanations list
  const explanations: string[] = [];

  // Add Missing skills explanations first (highest impact)
  missingSkills.forEach((item) => {
    explanations.push(item.explanation);
  });

  // Add Partial skills explanations
  partialSkills.forEach((item) => {
    explanations.push(item.explanation);
  });

  if (missingSkills.length === 0 && partialSkills.length === 0) {
    explanations.push('Your verified skill portfolio satisfies 100% of all required core competencies.');
  }

  return {
    matchScore: finalMatchScore,
    rawScore: accumulatedWeightedScore,
    matchedSkills,
    partialSkills,
    missingSkills,
    explanations,
    totalSkillsCount: totalCount,
    matchedCount: matchedSkills.length,
    partialCount: partialSkills.length,
    missingCount: missingSkills.length,
    potentialMaxScore: 100
  };
}
