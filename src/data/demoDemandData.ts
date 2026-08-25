import {
  SkillDemand,
  SkillDemandSnapshot,
  SkillDemandVsReadiness,
  InstitutionRecommendation,
  StudentDemandSignal,
  IndustryTalentDemandSignal
} from '../types/demand';

/**
 * SkillSetu AI - Demo Demand Intelligence Dataset
 *
 * NOTE: This is clearly labeled DEMONSTRATION data derived deterministically
 * from the 8 Demo Opportunity postings (DEMO_OPPORTUNITIES) and the synthetic
 * student benchmark cohort. In Authenticated Mode, calculations are executed
 * live against actual Firestore opportunities and student assessment profiles.
 */

export const DEMO_DEMAND_SOURCE_LABEL = 'Based on 8 active demonstration opportunities';

export const DEMO_HISTORICAL_SNAPSHOTS: SkillDemandSnapshot[] = [
  {
    snapshotId: 'snap-hist-001',
    generatedAt: '2026-07-23T10:00:00.000Z', // 30 days prior snapshot
    totalOpportunities: 6,
    snapshotLabel: 'Previous Cycle (July 2026)',
    skills: {
      'python': {
        skillId: 'skill-python',
        skillName: 'Python',
        category: 'Programming',
        opportunityCount: 4,
        demandPercentage: 67,
        averageRequiredLevel: 76,
        domains: { 'Software Development': 1, 'Data Science': 1, 'AI/ML': 1, 'Cloud': 1 },
        opportunityTypes: { 'Internship': 3, 'Full-Time': 1 },
        trend: 'insufficient-data',
        priority: 'Critical'
      },
      'dsa': {
        skillId: 'skill-dsa',
        skillName: 'DSA',
        category: 'Core CS',
        opportunityCount: 2,
        demandPercentage: 33,
        averageRequiredLevel: 78,
        domains: { 'Software Development': 1, 'AI/ML': 1 },
        opportunityTypes: { 'Internship': 1, 'Full-Time': 1 },
        trend: 'insufficient-data',
        priority: 'High'
      },
      'cloud': {
        skillId: 'skill-cloud',
        skillName: 'Cloud Computing',
        category: 'Cloud',
        opportunityCount: 2,
        demandPercentage: 33,
        averageRequiredLevel: 72,
        domains: { 'Cloud': 1, 'Software Development': 1 },
        opportunityTypes: { 'Internship': 1, 'Full-Time': 1 },
        trend: 'insufficient-data',
        priority: 'High'
      },
      'aiml': {
        skillId: 'skill-aiml',
        skillName: 'AI/ML',
        category: 'Data & AI',
        opportunityCount: 1,
        demandPercentage: 17,
        averageRequiredLevel: 80,
        domains: { 'AI/ML': 1 },
        opportunityTypes: { 'Full-Time': 1 },
        trend: 'insufficient-data',
        priority: 'Moderate'
      },
      'cybersecurity': {
        skillId: 'skill-cybersecurity',
        skillName: 'Cybersecurity',
        category: 'Security',
        opportunityCount: 1,
        demandPercentage: 17,
        averageRequiredLevel: 75,
        domains: { 'Cybersecurity': 1 },
        opportunityTypes: { 'Apprenticeship': 1 },
        trend: 'insufficient-data',
        priority: 'Moderate'
      }
    }
  },
  {
    snapshotId: 'snap-hist-002',
    generatedAt: '2026-08-23T12:00:00.000Z', // Current snapshot
    totalOpportunities: 8,
    snapshotLabel: 'Current Cycle (August 2026)',
    skills: {
      'python': {
        skillId: 'skill-python',
        skillName: 'Python',
        category: 'Programming',
        opportunityCount: 6,
        demandPercentage: 75,
        averageRequiredLevel: 78,
        domains: { 'Software Development': 1, 'Data Science': 1, 'AI/ML': 1, 'Cloud': 1, 'Product Analytics': 1, 'Research': 1 },
        opportunityTypes: { 'Internship': 3, 'Full-Time': 1, 'Live Project': 1, 'Part-Time': 1 },
        trend: 'rising', // 67% -> 75% (+12% relative change)
        priority: 'Critical'
      },
      'problemsolving': {
        skillId: 'skill-problemsolving',
        skillName: 'Problem Solving',
        category: 'Core CS',
        opportunityCount: 5,
        demandPercentage: 63,
        averageRequiredLevel: 73,
        domains: { 'Cloud': 1, 'Cybersecurity': 1, 'Web Development': 1, 'Product Analytics': 1, 'Research': 1 },
        opportunityTypes: { 'Internship': 2, 'Apprenticeship': 1, 'Live Project': 1, 'Part-Time': 1 },
        trend: 'rising',
        priority: 'Critical'
      },
      'dsa': {
        skillId: 'skill-dsa',
        skillName: 'DSA',
        category: 'Core CS',
        opportunityCount: 3,
        demandPercentage: 38,
        averageRequiredLevel: 78,
        domains: { 'Software Development': 1, 'AI/ML': 1, 'Research': 1 },
        opportunityTypes: { 'Internship': 1, 'Full-Time': 1, 'Part-Time': 1 },
        trend: 'rising', // 33% -> 38% (+15%)
        priority: 'High'
      },
      'database': {
        skillId: 'skill-database',
        skillName: 'Database / SQL',
        category: 'Databases',
        opportunityCount: 3,
        demandPercentage: 38,
        averageRequiredLevel: 72,
        domains: { 'Software Development': 1, 'Data Science': 1, 'Product Analytics': 1 },
        opportunityTypes: { 'Internship': 2, 'Live Project': 1 },
        trend: 'stable',
        priority: 'High'
      },
      'aiml': {
        skillId: 'skill-aiml',
        skillName: 'AI/ML',
        category: 'Data & AI',
        opportunityCount: 2,
        demandPercentage: 25,
        averageRequiredLevel: 80,
        domains: { 'Data Science': 1, 'AI/ML': 1 },
        opportunityTypes: { 'Internship': 1, 'Full-Time': 1 },
        trend: 'rising', // 17% -> 25% (+47%)
        priority: 'Moderate'
      },
      'communication': {
        skillId: 'skill-communication',
        skillName: 'Communication',
        category: 'Professional',
        opportunityCount: 2,
        demandPercentage: 25,
        averageRequiredLevel: 70,
        domains: { 'Cybersecurity': 1, 'Web Development': 1 },
        opportunityTypes: { 'Apprenticeship': 1, 'Internship': 1 },
        trend: 'stable',
        priority: 'Moderate'
      },
      'cloud': {
        skillId: 'skill-cloud',
        skillName: 'Cloud Computing',
        category: 'Cloud',
        opportunityCount: 1, // Required in 1, preferred in 4
        demandPercentage: 50, // Effective weighted demand across postings
        averageRequiredLevel: 75,
        domains: { 'Cloud': 1, 'Software Development': 1, 'AI/ML': 1, 'Research': 1 },
        opportunityTypes: { 'Internship': 3, 'Full-Time': 1 },
        trend: 'rising',
        priority: 'Critical'
      },
      'cybersecurity': {
        skillId: 'skill-cybersecurity',
        skillName: 'Cybersecurity',
        category: 'Security',
        opportunityCount: 1,
        demandPercentage: 25,
        averageRequiredLevel: 75,
        domains: { 'Cybersecurity': 1 },
        opportunityTypes: { 'Apprenticeship': 1 },
        trend: 'rising',
        priority: 'Moderate'
      },
      'webdev': {
        skillId: 'skill-webdev',
        skillName: 'Web Development',
        category: 'Frontend',
        opportunityCount: 1,
        demandPercentage: 25,
        averageRequiredLevel: 80,
        domains: { 'Web Development': 1 },
        opportunityTypes: { 'Internship': 1 },
        trend: 'stable',
        priority: 'Moderate'
      }
    }
  }
];

export const DEMO_SKILL_DEMANDS: SkillDemand[] = Object.values(DEMO_HISTORICAL_SNAPSHOTS[1].skills).sort(
  (a, b) => b.demandPercentage - a.demandPercentage
);

export const DEMO_DEMAND_VS_READINESS: SkillDemandVsReadiness[] = [
  {
    skillId: 'skill-python',
    skillName: 'Python',
    category: 'Programming',
    demandPercentage: 75,
    opportunityCount: 6,
    averageRequiredLevel: 78,
    averageStudentReadiness: 72,
    gap: 6,
    gapSeverity: 'minimal',
    matrixQuadrant: 'maintain',
    priority: 'High',
    explanation: 'Python appears in 75% of active opportunities (6/8). Cohort average readiness is strong at 72 (Target: 78), indicating high talent alignment.',
    trend: 'rising'
  },
  {
    skillId: 'skill-cloud',
    skillName: 'Cloud Computing',
    category: 'Cloud',
    demandPercentage: 50,
    opportunityCount: 4,
    averageRequiredLevel: 75,
    averageStudentReadiness: 41,
    gap: 34,
    gapSeverity: 'critical',
    matrixQuadrant: 'urgent_development',
    priority: 'Critical',
    explanation: 'Cloud Computing is marked Critical Priority: requested in 50% of active postings with an industry requirement of 75, while cohort readiness is 41 (Gap: 34 pts).',
    trend: 'rising'
  },
  {
    skillId: 'skill-aiml',
    skillName: 'AI/ML',
    category: 'Data & AI',
    demandPercentage: 40,
    opportunityCount: 3,
    averageRequiredLevel: 80,
    averageStudentReadiness: 52,
    gap: 28,
    gapSeverity: 'critical',
    matrixQuadrant: 'urgent_development',
    priority: 'Critical',
    explanation: 'AI/ML appears across 40% of postings with high baseline requirement (80), while average student readiness is 52 (Gap: 28 pts).',
    trend: 'rising'
  },
  {
    skillId: 'skill-problemsolving',
    skillName: 'Problem Solving',
    category: 'Core CS',
    demandPercentage: 63,
    opportunityCount: 5,
    averageRequiredLevel: 73,
    averageStudentReadiness: 68,
    gap: 5,
    gapSeverity: 'minimal',
    matrixQuadrant: 'maintain',
    priority: 'High',
    explanation: 'Problem Solving is universally valued (63% demand). Student average readiness of 68 closely tracks industry requirement (73).',
    trend: 'rising'
  },
  {
    skillId: 'skill-dsa',
    skillName: 'DSA',
    category: 'Core CS',
    demandPercentage: 38,
    opportunityCount: 3,
    averageRequiredLevel: 78,
    averageStudentReadiness: 64,
    gap: 14,
    gapSeverity: 'moderate',
    matrixQuadrant: 'urgent_development',
    priority: 'High',
    explanation: 'DSA is required in 38% of roles with 78 benchmark level. Student cohort averages 64, requiring moderate algorithmic reinforcement.',
    trend: 'rising'
  },
  {
    skillId: 'skill-database',
    skillName: 'Database / SQL',
    category: 'Databases',
    demandPercentage: 38,
    opportunityCount: 3,
    averageRequiredLevel: 72,
    averageStudentReadiness: 70,
    gap: 2,
    gapSeverity: 'minimal',
    matrixQuadrant: 'maintain',
    priority: 'Moderate',
    explanation: 'Database & SQL demand (38%) is well matched with high cohort readiness (70 vs 72 required).',
    trend: 'stable'
  },
  {
    skillId: 'skill-cybersecurity',
    skillName: 'Cybersecurity',
    category: 'Security',
    demandPercentage: 25,
    opportunityCount: 2,
    averageRequiredLevel: 75,
    averageStudentReadiness: 45,
    gap: 30,
    gapSeverity: 'critical',
    matrixQuadrant: 'urgent_development',
    priority: 'High',
    explanation: 'Cybersecurity has 25% targeted demand with a 30-point cohort gap (45 vs 75), requiring dedicated security lab pathways.',
    trend: 'rising'
  },
  {
    skillId: 'skill-webdev',
    skillName: 'Web Development',
    category: 'Frontend',
    demandPercentage: 25,
    opportunityCount: 2,
    averageRequiredLevel: 80,
    averageStudentReadiness: 76,
    gap: 4,
    gapSeverity: 'minimal',
    matrixQuadrant: 'opportunity_expansion',
    priority: 'Moderate',
    explanation: 'Strong student web development readiness (76). High potential to expand partnerships for frontend and fullstack developer recruitment.',
    trend: 'stable'
  }
];

export const DEMO_INSTITUTION_RECOMMENDATIONS: InstitutionRecommendation[] = [
  {
    id: 'rec-001',
    skillName: 'Cloud Computing',
    title: 'Increase Cloud Computing Training Capacity & Hands-on Labs',
    type: 'curriculum_expansion',
    priority: 'Critical',
    reason: 'Cloud Computing is marked Critical Priority because it appears in 50% of active opportunities while average student readiness is 41 against a baseline requirement of 75 (Gap: 34 points).',
    recommendedAction: 'Introduce a 4-credit mandatory Cloud Native Architectures lab module in Semester 6 covering container orchestration (Docker/Kubernetes) and microservices.',
    metricSnapshot: {
      demandPercentage: 50,
      studentReadiness: 41,
      requiredLevel: 75,
      gap: 34,
      opportunityCount: 4
    },
    suggestedTimeline: 'Upcoming Academic Term',
    targetDepartment: 'Computer Science & Information Technology'
  },
  {
    id: 'rec-002',
    skillName: 'AI/ML',
    title: 'Integrate Applied Model Deployment & Vector DB Capstone Projects',
    type: 'advanced_projects',
    priority: 'Critical',
    reason: 'AI/ML demand is rising (+47% growth across postings) and required in 40% of active roles, while average student cohort readiness is 52 against industry threshold of 80 (Gap: 28 points).',
    recommendedAction: 'Mandate industry-partnered applied ML capstones focusing on practical RAG architectures, model serving latency, and feature engineering.',
    metricSnapshot: {
      demandPercentage: 40,
      studentReadiness: 52,
      requiredLevel: 80,
      gap: 28,
      opportunityCount: 3
    },
    suggestedTimeline: 'Semester 7 Elective Track',
    targetDepartment: 'AI, Data Science & CS'
  },
  {
    id: 'rec-003',
    skillName: 'Cybersecurity',
    title: 'Establish SOC Operations & Defensive Security Workshop Pathway',
    type: 'industry_workshop',
    priority: 'High',
    reason: 'Cybersecurity is required in specialized postings with 75 required score, but current cohort readiness averages 45 (Gap: 30 points).',
    recommendedAction: 'Organize 6-week hands-on Security Operations Center (SOC) bootcamps and sponsor certified ethical hacking credentials.',
    metricSnapshot: {
      demandPercentage: 25,
      studentReadiness: 45,
      requiredLevel: 75,
      gap: 30,
      opportunityCount: 2
    },
    suggestedTimeline: 'Mid-Semester Intensive Workshop',
    targetDepartment: 'Information Security & Networks'
  },
  {
    id: 'rec-004',
    skillName: 'Web Development',
    title: 'Expand Industry Hiring Drives for Full-Stack Web Development',
    type: 'placement_drive',
    priority: 'Moderate',
    reason: 'Students demonstrate high proficiency (76 readiness vs 80 required), indicating a ready candidate pool with minimal gap (4 points).',
    recommendedAction: 'Host targeted on-campus recruitment hackathons and connect top students with high-growth startup partners.',
    metricSnapshot: {
      demandPercentage: 25,
      studentReadiness: 76,
      requiredLevel: 80,
      gap: 4,
      opportunityCount: 2
    },
    suggestedTimeline: 'Immediate Placement Season',
    targetDepartment: 'All Engineering Departments'
  }
];

export const DEMO_STUDENT_DEMAND_SIGNALS: StudentDemandSignal[] = [
  {
    skillName: 'Python',
    category: 'Programming',
    demandPercentage: 75,
    demandLevel: 'Critical',
    opportunityCount: 6,
    yourScore: 78,
    requiredLevel: 78,
    gap: 0,
    isGap: false,
    priority: 'High',
    topRoles: ['Full-Stack Engineer', 'Data Scientist', 'AI/ML Associate', 'Analytics Fellow']
  },
  {
    skillName: 'Cloud Computing',
    category: 'Cloud',
    demandPercentage: 50,
    demandLevel: 'Critical',
    opportunityCount: 4,
    yourScore: 51,
    requiredLevel: 75,
    gap: 24,
    isGap: true,
    priority: 'Critical',
    topRoles: ['Cloud & DevOps Intern', 'Full-Stack Engineer', 'AI Research Intern']
  },
  {
    skillName: 'AI/ML',
    category: 'Data & AI',
    demandPercentage: 40,
    demandLevel: 'High',
    opportunityCount: 3,
    yourScore: 62,
    requiredLevel: 80,
    gap: 18,
    isGap: true,
    priority: 'Critical',
    topRoles: ['Applied AI Engineer', 'Data Science Intern', 'Systems & AI Researcher']
  },
  {
    skillName: 'DSA',
    category: 'Core CS',
    demandPercentage: 38,
    demandLevel: 'High',
    opportunityCount: 3,
    yourScore: 74,
    requiredLevel: 78,
    gap: 4,
    isGap: false,
    priority: 'High',
    topRoles: ['Full-Stack Engineer', 'AI Engineer Associate', 'Systems Researcher']
  },
  {
    skillName: 'Database / SQL',
    category: 'Databases',
    demandPercentage: 38,
    demandLevel: 'High',
    opportunityCount: 3,
    yourScore: 76,
    requiredLevel: 72,
    gap: 0,
    isGap: false,
    priority: 'Moderate',
    topRoles: ['Data Science Intern', 'Product Analytics Fellow', 'Full-Stack Developer']
  },
  {
    skillName: 'Cybersecurity',
    category: 'Security',
    demandPercentage: 25,
    demandLevel: 'Moderate',
    opportunityCount: 2,
    yourScore: 48,
    requiredLevel: 75,
    gap: 27,
    isGap: true,
    priority: 'High',
    topRoles: ['Cybersecurity Apprentice', 'Cloud & Security Operations']
  }
];

export const DEMO_INDUSTRY_TALENT_SIGNALS: IndustryTalentDemandSignal = {
  totalActivePostingsAnalyzed: 8,
  mostDemandedSkills: [
    { skillName: 'Python', category: 'Programming', opportunityCount: 6, demandPercentage: 75, avgRequiredLevel: 78 },
    { skillName: 'Problem Solving', category: 'Core CS', opportunityCount: 5, demandPercentage: 63, avgRequiredLevel: 73 },
    { skillName: 'Cloud Computing', category: 'Cloud', opportunityCount: 4, demandPercentage: 50, avgRequiredLevel: 75 },
    { skillName: 'AI/ML', category: 'Data & AI', opportunityCount: 3, demandPercentage: 40, avgRequiredLevel: 80 },
    { skillName: 'DSA', category: 'Core CS', opportunityCount: 3, demandPercentage: 38, avgRequiredLevel: 78 },
    { skillName: 'Database / SQL', category: 'Databases', opportunityCount: 3, demandPercentage: 38, avgRequiredLevel: 72 }
  ],
  platformCandidateReadiness: [
    { skillName: 'Python', avgReadiness: 72, benchmarkRequired: 78, talentAvailabilityLevel: 'High' },
    { skillName: 'Problem Solving', avgReadiness: 68, benchmarkRequired: 73, talentAvailabilityLevel: 'High' },
    { skillName: 'Database / SQL', avgReadiness: 70, benchmarkRequired: 72, talentAvailabilityLevel: 'High' },
    { skillName: 'Web Development', avgReadiness: 76, benchmarkRequired: 80, talentAvailabilityLevel: 'High' },
    { skillName: 'DSA', avgReadiness: 64, benchmarkRequired: 78, talentAvailabilityLevel: 'Moderate' },
    { skillName: 'AI/ML', avgReadiness: 52, benchmarkRequired: 80, talentAvailabilityLevel: 'Scarce' },
    { skillName: 'Cloud Computing', avgReadiness: 41, benchmarkRequired: 75, talentAvailabilityLevel: 'Scarce' },
    { skillName: 'Cybersecurity', avgReadiness: 45, benchmarkRequired: 75, talentAvailabilityLevel: 'Scarce' }
  ],
  largestCandidateGaps: [
    { skillName: 'Cloud Computing', demandPercentage: 50, avgRequired: 75, avgCandidateLevel: 41, talentDeficit: 34 },
    { skillName: 'Cybersecurity', demandPercentage: 25, avgRequired: 75, avgCandidateLevel: 45, talentDeficit: 30 },
    { skillName: 'AI/ML', demandPercentage: 40, avgRequired: 80, avgCandidateLevel: 52, talentDeficit: 28 },
    { skillName: 'DSA', demandPercentage: 38, avgRequired: 78, avgCandidateLevel: 64, talentDeficit: 14 }
  ]
};
