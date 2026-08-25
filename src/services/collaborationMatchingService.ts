import {
  CollaborationOpportunity,
  FacultyProfile,
  CollaborationMatchResult
} from '../types/collaboration';

/**
 * Normalizes strings for robust, deterministic keyword comparison
 */
function normalizeSkill(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[._\-/\\]/g, ' ')
    .replace(/\s+/g, ' ');
}

/**
 * Checks if two skill or domain phrases are an exact or semantic alias match
 */
function isSkillMatch(facultySkill: string, reqSkill: string): { match: boolean; partial: boolean } {
  const normFaculty = normalizeSkill(facultySkill);
  const normReq = normalizeSkill(reqSkill);

  if (normFaculty === normReq) {
    return { match: true, partial: false };
  }

  // Common tech & academic aliases
  const aliasMap: Record<string, string[]> = {
    'ml': ['machine learning', 'deep learning'],
    'ai': ['artificial intelligence', 'machine learning', 'genai', 'generative ai'],
    'genai': ['generative ai', 'llms', 'large language models', 'artificial intelligence'],
    'generative ai': ['genai', 'llms', 'large language models', 'ai'],
    'nlp': ['natural language processing', 'computational linguistics'],
    'cv': ['computer vision', 'image processing'],
    'dsa': ['data structures', 'algorithms', 'data structures and algorithms'],
    'cybersecurity': ['network security', 'information security', 'cyber security', 'cryptography'],
    'cloud': ['cloud computing', 'aws', 'azure', 'gcp', 'google cloud', 'cloud architecture'],
    'cloud computing': ['cloud', 'aws', 'azure', 'gcp', 'devops'],
    'devops': ['ci cd', 'docker', 'kubernetes', 'cloud deployment', 'infrastructure as code'],
    'data science': ['data analytics', 'statistics', 'machine learning', 'big data'],
    'data analytics': ['data science', 'business intelligence', 'sql', 'power bi'],
    'iot': ['internet of things', 'embedded systems', 'sensors'],
    'vlsi': ['chip design', 'verilog', 'fpga', 'semiconductor', 'microelectronics'],
    'robotics': ['autonomous systems', 'control systems', 'mechatronics']
  };

  // Check alias mappings
  for (const [key, aliases] of Object.entries(aliasMap)) {
    const keyMatchFaculty = normFaculty === key || aliases.includes(normFaculty);
    const keyMatchReq = normReq === key || aliases.includes(normReq);
    if (keyMatchFaculty && keyMatchReq) {
      return { match: true, partial: false };
    }
  }

  // Word inclusion / partial containment
  if (
    normFaculty.length > 3 &&
    normReq.length > 3 &&
    (normFaculty.includes(normReq) || normReq.includes(normFaculty))
  ) {
    return { match: true, partial: true };
  }

  return { match: false, partial: false };
}

/**
 * Deterministic Collaboration Match Calculator for Academicians & Industry
 *
 * Weight Distribution:
 * - Expertise Match (Required & Preferred): 60%
 * - Research Interests Match: 20%
 * - Preferred Collaboration Type Match: 10%
 * - Work Mode / Location Alignment: 10%
 *
 * Proportional redistribution is applied if any factor is not applicable or not provided.
 */
export function calculateCollaborationMatch(
  academician: FacultyProfile | null | undefined,
  collaboration: CollaborationOpportunity
): CollaborationMatchResult {
  // Default fallback if academician is not logged in or profile is empty
  if (!academician) {
    return {
      overallMatch: 50,
      matchedExpertise: [],
      partialExpertise: [],
      missingExpertise: collaboration.requiredExpertise || [],
      researchAlignment: [],
      collaborationTypeMatch: false,
      workModeMatch: true,
      explanation: 'Sign in with your verified faculty profile to see personalized match telemetry.',
      breakdown: {
        expertiseScore: 50,
        researchScore: 50,
        typeScore: 50,
        modeScore: 50,
        weights: { expertise: 60, research: 20, type: 10, mode: 10 }
      }
    };
  }

  const facultySkills = [
    ...(academician.expertise || []),
    ...(academician.skills || [])
  ];
  const researchInterests = academician.researchInterests || [];
  const preferredTypes = academician.preferredCollaborationTypes || [];

  const requiredExpertise = collaboration.requiredExpertise || [];
  const preferredExpertise = collaboration.preferredExpertise || [];
  const allCollabSkills = [...requiredExpertise, ...preferredExpertise];

  // 1. Evaluate Expertise Match (60% baseline)
  const matchedExpertise: string[] = [];
  const partialExpertise: string[] = [];
  const missingExpertise: string[] = [];

  let requiredMatchedCount = 0;
  let preferredMatchedCount = 0;

  for (const req of requiredExpertise) {
    let bestMatch: { match: boolean; partial: boolean } = { match: false, partial: false };
    for (const fSkill of facultySkills) {
      const res = isSkillMatch(fSkill, req);
      if (res.match) {
        bestMatch = res;
        if (!res.partial) break;
      }
    }

    if (bestMatch.match) {
      if (bestMatch.partial) {
        partialExpertise.push(req);
        requiredMatchedCount += 0.7;
      } else {
        matchedExpertise.push(req);
        requiredMatchedCount += 1.0;
      }
    } else {
      missingExpertise.push(req);
    }
  }

  for (const pref of preferredExpertise) {
    let bestMatch: { match: boolean; partial: boolean } = { match: false, partial: false };
    for (const fSkill of facultySkills) {
      const res = isSkillMatch(fSkill, pref);
      if (res.match) {
        bestMatch = res;
        if (!res.partial) break;
      }
    }

    if (bestMatch.match) {
      if (bestMatch.partial) {
        if (!partialExpertise.includes(pref)) partialExpertise.push(pref);
        preferredMatchedCount += 0.7;
      } else {
        if (!matchedExpertise.includes(pref)) matchedExpertise.push(pref);
        preferredMatchedCount += 1.0;
      }
    }
  }

  const requiredScore = requiredExpertise.length > 0
    ? (requiredMatchedCount / requiredExpertise.length) * 100
    : 100;

  const preferredScore = preferredExpertise.length > 0
    ? (preferredMatchedCount / preferredExpertise.length) * 100
    : 100;

  // Weight required expertise 75% and preferred 25% within expertise category
  const expertiseScore = preferredExpertise.length > 0
    ? Math.round(requiredScore * 0.75 + preferredScore * 0.25)
    : Math.round(requiredScore);

  // 2. Evaluate Research Interest Alignment (20% baseline)
  const researchAlignment: string[] = [];
  let researchScore = 50;

  if (researchInterests.length > 0) {
    const combinedCollabText = [
      collaboration.title,
      collaboration.description,
      collaboration.targetAudience,
      ...(collaboration.topics || []),
      ...(collaboration.requiredExpertise || []),
      ...(collaboration.preferredExpertise || [])
    ].join(' ').toLowerCase();

    let matchedResearchCount = 0;
    for (const ri of researchInterests) {
      const normRi = normalizeSkill(ri);
      if (normRi.length > 2 && combinedCollabText.includes(normRi)) {
        researchAlignment.push(ri);
        matchedResearchCount++;
      } else {
        // Check word tokens
        const tokens = normRi.split(' ').filter(t => t.length > 3);
        const hasToken = tokens.some(t => combinedCollabText.includes(t));
        if (hasToken) {
          researchAlignment.push(ri);
          matchedResearchCount += 0.6;
        }
      }
    }

    researchScore = researchInterests.length > 0
      ? Math.min(100, Math.round((matchedResearchCount / Math.min(researchInterests.length, 3)) * 100))
      : 50;
  }

  // 3. Evaluate Preferred Collaboration Type (10% baseline)
  let typeScore = 75;
  let collaborationTypeMatch = false;

  if (preferredTypes.length > 0) {
    collaborationTypeMatch = preferredTypes.includes(collaboration.collaborationType);
    typeScore = collaborationTypeMatch ? 100 : 40;
  } else {
    // Neutral default if not specified
    typeScore = 75;
  }

  // 4. Evaluate Work Mode & Location (10% baseline)
  let modeScore = 80;
  let workModeMatch = true;

  if (collaboration.workMode === 'Remote') {
    modeScore = 100;
    workModeMatch = true;
  } else {
    const facultyLoc = normalizeSkill(academician.location || '');
    const collabLoc = normalizeSkill(collaboration.location || '');
    if (facultyLoc && collabLoc && (facultyLoc.includes(collabLoc) || collabLoc.includes(facultyLoc))) {
      modeScore = 100;
      workModeMatch = true;
    } else if (collaboration.workMode === 'Hybrid') {
      modeScore = 75;
      workModeMatch = true;
    } else {
      modeScore = 55;
      workModeMatch = false;
    }
  }

  // 5. Weight Calculation & Normalization (Deterministic calculation)
  const weights = {
    expertise: 60,
    research: researchInterests.length > 0 ? 20 : 0,
    type: preferredTypes.length > 0 ? 10 : 5,
    mode: 10
  };

  const totalWeight = weights.expertise + weights.research + weights.type + weights.mode;
  const rawScore =
    (expertiseScore * weights.expertise +
      researchScore * weights.research +
      typeScore * weights.type +
      modeScore * weights.mode) / totalWeight;

  const overallMatch = Math.min(99, Math.max(25, Math.round(rawScore)));

  // 6. Formulate Clear, Transparent Explanation
  let explanation = '';
  if (overallMatch >= 85) {
    explanation = `Outstanding alignment with your faculty domain profile. You match ${matchedExpertise.length} of ${requiredExpertise.length} required competencies${researchAlignment.length > 0 ? ` and your research in ${researchAlignment.slice(0, 2).join(', ')} directly aligns with this project` : ''}.`;
  } else if (overallMatch >= 70) {
    explanation = `Solid pedagogical and technical match. You fulfill key requirements in ${matchedExpertise.slice(0, 3).join(', ')}${missingExpertise.length > 0 ? `, with slight divergence in ${missingExpertise.slice(0, 2).join(', ')}` : ''}.`;
  } else if (overallMatch >= 50) {
    explanation = `Moderate match. You possess foundational competencies, but specific expertise in ${missingExpertise.slice(0, 2).join(', ')} is strongly prioritized by the industry partner.`;
  } else {
    explanation = `Limited direct alignment. The primary requirements (${missingExpertise.slice(0, 3).join(', ')}) sit outside your core recorded domains.`;
  }

  return {
    overallMatch,
    matchedExpertise,
    partialExpertise,
    missingExpertise,
    researchAlignment,
    collaborationTypeMatch,
    workModeMatch,
    explanation,
    breakdown: {
      expertiseScore,
      researchScore,
      typeScore,
      modeScore,
      weights: {
        expertise: Math.round((weights.expertise / totalWeight) * 100),
        research: Math.round((weights.research / totalWeight) * 100),
        type: Math.round((weights.type / totalWeight) * 100),
        mode: Math.round((weights.mode / totalWeight) * 100)
      }
    }
  };
}
