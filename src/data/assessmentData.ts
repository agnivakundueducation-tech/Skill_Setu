import {
  AssessmentFormState,
  AssessmentResult,
  AssessmentStepConfig,
  RecommendedRoleItem,
  SkillGapItem,
  DimensionScore
} from '../types/assessment';

export const ASSESSMENT_STEPS: AssessmentStepConfig[] = [
  {
    id: 'career-interests',
    stepNumber: 1,
    title: 'Career Interests & Direction',
    shortTitle: 'Interests',
    description: 'Map your core engineering interests, preferred industry domains, and development passions.',
    iconName: 'Compass'
  },
  {
    id: 'technical-skills',
    stepNumber: 2,
    title: 'Technical Proficiency & Stack',
    shortTitle: 'Technical',
    description: 'Evaluate your hands-on competencies in programming, architecture, cloud, and core CS fundamentals.',
    iconName: 'Code'
  },
  {
    id: 'soft-skills',
    stepNumber: 3,
    title: 'Soft Skills & Collaboration',
    shortTitle: 'Soft Skills',
    description: 'Assess communication, team dynamics, problem decomposition, and velocity under pressure.',
    iconName: 'Users'
  },
  {
    id: 'career-preferences',
    stepNumber: 4,
    title: 'Workplace & Career Preferences',
    shortTitle: 'Preferences',
    description: 'Define your desired workplace model, compensation goals, and growth environment.',
    iconName: 'Briefcase'
  },
  {
    id: 'summary',
    stepNumber: 5,
    title: 'Review & AI Readiness Generation',
    shortTitle: 'Summary',
    description: 'Verify your submitted responses before running the SkillSetu AI Readiness & Gap Engine.',
    iconName: 'Sparkles'
  }
];

export const INITIAL_ASSESSMENT_STATE: AssessmentFormState = {
  careerInterests: {
    primaryDomain: 'Full-Stack Software Engineering',
    industrySectors: ['SaaS & Enterprise Tools', 'AI & Machine Learning', 'FinTech & Banking'],
    excitementFactors: [
      'Architecting High-Throughput Distributed Systems',
      'Crafting Intuitive & Accessible UI Experiences',
      'AI & LLM Orchestration'
    ],
    problemSolvingPassion: 9,
    workVelocity: 'Balanced High Velocity & Architectural Rigor'
  },
  technicalSkills: {
    primaryLanguages: ['TypeScript', 'Python', 'Go', 'SQL'],
    frontendRating: 5,
    backendRating: 4,
    databaseRating: 4,
    cloudDevOpsRating: 4,
    dsaRating: 4,
    systemDesignRating: 4,
    practicalExperienceScore: 85,
    preferredArchitecture: 'Event-Driven Microservices & Cloud-Native'
  },
  softSkills: {
    communicationRating: 4,
    problemDecompositionRating: 5,
    teamCollaborationRating: 5,
    codeReviewRating: 4,
    adaptabilityRating: 5,
    conflictResolutionRating: 4,
    stressManagementScore: 8,
    leadershipStyle: 'Collaborative Driver & Quality Champion'
  },
  careerPreferences: {
    workMode: 'Hybrid (1-2 days collaborative)',
    companyStage: 'High-Growth Tech Scaleup (Series B - Pre-IPO)',
    compensationBand: '$100,000 - $135,000 / yr',
    primaryCareerDriver: 'Accelerated Technical Mentorship & High-Impact Ownership',
    weeklyUpskillingHours: 12
  }
};

/**
 * Mock AI Evaluation Engine
 * Synthesizes user responses across the 4 stages into an intelligent report.
 */
export function generateMockAssessmentResult(formState: AssessmentFormState): AssessmentResult {
  const { careerInterests, technicalSkills, softSkills, careerPreferences } = formState;

  // 1. Calculate weighted domain scores (0-100)
  const techScores = [
    technicalSkills.frontendRating * 20,
    technicalSkills.backendRating * 20,
    technicalSkills.databaseRating * 20,
    technicalSkills.cloudDevOpsRating * 20,
    technicalSkills.dsaRating * 20,
    technicalSkills.systemDesignRating * 20
  ];
  const techAvg = techScores.reduce((a, b) => a + b, 0) / techScores.length;

  const softScores = [
    softSkills.communicationRating * 20,
    softSkills.problemDecompositionRating * 20,
    softSkills.teamCollaborationRating * 20,
    softSkills.codeReviewRating * 20,
    softSkills.adaptabilityRating * 20,
    softSkills.conflictResolutionRating * 20
  ];
  const softAvg = softScores.reduce((a, b) => a + b, 0) / softScores.length;

  const practicalScore = technicalSkills.practicalExperienceScore;
  const passionScore = careerInterests.problemSolvingPassion * 10;
  const stressScore = softSkills.stressManagementScore * 10;
  const learningCommitmentBonus = Math.min(10, Math.round((careerPreferences.weeklyUpskillingHours / 20) * 10));

  // Weighted overall calculation
  const rawScore = Math.round(
    techAvg * 0.40 +
    softAvg * 0.25 +
    practicalScore * 0.15 +
    passionScore * 0.10 +
    stressScore * 0.05 +
    learningCommitmentBonus * 0.5
  );

  const readinessScore = Math.min(99, Math.max(52, rawScore));
  const percentileRank = Math.min(99, Math.max(65, Math.round(readinessScore * 1.08)));

  let tierLabel: AssessmentResult['tierLabel'] = 'Enterprise Capable';
  if (readinessScore >= 88) {
    tierLabel = 'Tier-1 Industry Ready';
  } else if (readinessScore >= 75) {
    tierLabel = 'Enterprise Capable';
  } else if (readinessScore >= 65) {
    tierLabel = 'High-Growth Contender';
  } else {
    tierLabel = 'Foundation Building';
  }

  // 2. Dimension breakdown
  const dimensionScores: DimensionScore[] = [
    { domain: 'System Design & Arch', score: technicalSkills.systemDesignRating * 20, benchmark: 78 },
    { domain: 'Frontend & UI Craft', score: technicalSkills.frontendRating * 20, benchmark: 75 },
    { domain: 'Backend & APIs', score: technicalSkills.backendRating * 20, benchmark: 80 },
    { domain: 'Cloud & Kubernetes', score: technicalSkills.cloudDevOpsRating * 20, benchmark: 70 },
    { domain: 'Algorithmic Rigor', score: technicalSkills.dsaRating * 20, benchmark: 72 },
    { domain: 'Soft Skills & Comms', score: Math.round(softAvg), benchmark: 76 }
  ];

  // 3. Dynamic Strengths derivation
  const strengths: AssessmentResult['strengths'] = [];

  if (technicalSkills.frontendRating >= 4 || technicalSkills.primaryLanguages.includes('TypeScript')) {
    strengths.push({
      title: 'Modern Frontend & Component Architecture',
      description: 'Exceptional mastery of React 19 concurrent features, TypeScript type-safety, and fluid design systems.',
      badge: 'Top 5% Percentile',
      scoreVal: technicalSkills.frontendRating * 20
    });
  }

  if (softSkills.problemDecompositionRating >= 4) {
    strengths.push({
      title: 'First-Principles Problem Decomposition',
      description: 'Ability to unpack ambiguous product requirements into modular, scalable engineering specifications.',
      badge: 'Tier-1 Trait',
      scoreVal: softSkills.problemDecompositionRating * 20
    });
  }

  if (technicalSkills.systemDesignRating >= 4 || technicalSkills.backendRating >= 4) {
    strengths.push({
      title: 'Resilient Backend & API Infrastructure',
      description: `Solid understanding of ${technicalSkills.preferredArchitecture} and high-throughput data processing.`,
      badge: 'Enterprise Benchmark',
      scoreVal: Math.max(technicalSkills.backendRating, technicalSkills.systemDesignRating) * 20
    });
  }

  if (softSkills.teamCollaborationRating >= 4) {
    strengths.push({
      title: 'Cross-Functional Engineering Culture',
      description: 'High collaborative empathy with strong code review etiquette and constructive technical dialogue.',
      badge: 'Leadership Ready',
      scoreVal: softSkills.teamCollaborationRating * 20
    });
  }

  // Ensure minimum 3 strengths
  if (strengths.length < 3) {
    strengths.push({
      title: 'Continuous Upskilling Discipline',
      description: `Dedicated ${careerPreferences.weeklyUpskillingHours} hrs/week commitment to deliberate practice and engineering labs.`,
      badge: 'High Velocity'
    });
  }

  // 4. Dynamic Weaknesses / Growth Areas
  const weaknesses: AssessmentResult['weaknesses'] = [];

  if (technicalSkills.cloudDevOpsRating <= 4) {
    weaknesses.push({
      title: 'Automated CI/CD & Production Observability',
      description: 'Hands-on experience with Terraform IaC and multi-region Kubernetes clusters can be strengthened further.',
      impact: 'High',
      remedy: 'Deploy a microservices cluster on Google Cloud GKE using GitHub Actions and OpenTelemetry monitoring.'
    });
  }

  if (technicalSkills.dsaRating <= 4) {
    weaknesses.push({
      title: 'Advanced Graph & Dynamic Programming Scalability',
      description: 'Occasional hesitation in real-time whiteboard complexity optimization under 45-minute live technical rounds.',
      impact: 'Medium',
      remedy: 'Complete 15 focused pattern-based LeetCode medium/hard simulations on graph cycles and interval scheduling.'
    });
  }

  if (softSkills.stressManagementScore < 9) {
    weaknesses.push({
      title: 'Incident Response & Production Triage Pacing',
      description: 'Managing high-severity production fire drills under tight SLA timeframes.',
      impact: 'Medium',
      remedy: 'Participate in chaos engineering game days and practice post-mortem RCA documentation.'
    });
  }

  // 5. Actionable Skill Gaps
  const skillGaps: SkillGapItem[] = [
    {
      skill: 'Kubernetes Operator & Helm Multi-Cluster Deployment',
      category: 'Cloud',
      currentLevel: 'Intermediate (Docker/Compose)',
      targetLevel: 'Production Level (K8s/GKE)',
      gapSeverity: 'Moderate',
      recommendedAction: 'Complete hands-on container orchestration lab with automated rollbacks.',
      suggestedModule: 'Cloud-Native DevOps Mastery'
    },
    {
      skill: 'Distributed Caching & Vector Search Optimization',
      category: 'Architecture',
      currentLevel: 'Basic Redis / SQL queries',
      targetLevel: 'Advanced (Redis Clusters + pgvector / Pinecone)',
      gapSeverity: 'Critical',
      recommendedAction: 'Implement high-throughput caching and similarity indexing in a real project.',
      suggestedModule: 'Vector DBs & Distributed Systems'
    },
    {
      skill: 'Live Whiteboard System Architecture Articulation',
      category: 'Technical',
      currentLevel: 'Self-guided Design',
      targetLevel: 'Staff-Level Structural Clarity',
      gapSeverity: 'Moderate',
      recommendedAction: 'Practice 3 mock system design interviews focusing on capacity planning and CAP theorem trade-offs.',
      suggestedModule: 'Enterprise System Design Studio'
    },
    {
      skill: 'Cross-Department Technical Storytelling',
      category: 'Soft Skills',
      currentLevel: 'Peer-to-peer discussions',
      targetLevel: 'Executive & Product Stakeholder alignment',
      gapSeverity: 'Minor',
      recommendedAction: 'Deliver a recorded 5-minute technical demo explaining latency metrics in business terms.',
      suggestedModule: 'Engineering Leadership & Communication'
    }
  ];

  // 6. Recommended Roles Tailored to Selections
  const recommendedRoles: RecommendedRoleItem[] = [
    {
      id: 'role-1',
      title: 'Full-Stack Software Engineer (Product Infrastructure)',
      matchScore: Math.min(97, readinessScore + 5),
      marketDemand: 'Extremely High',
      salaryRange: '$95,000 - $130,000 / yr',
      description: 'Build core customer-facing web applications with React 19, TypeScript, and high-performance Node/Go APIs.',
      keyMatchingSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'System Design'],
      growthPotential: 'Fast track to Senior/Staff Product Engineer'
    },
    {
      id: 'role-2',
      title: 'Distributed Systems & Cloud Platform Engineer',
      matchScore: Math.max(78, readinessScore - 4),
      marketDemand: 'High',
      salaryRange: '$110,000 - $145,000 / yr',
      description: 'Architect scalable event-driven messaging pipelines, caching tiers, and resilient cloud services.',
      keyMatchingSkills: ['Go / Python', 'Kafka / Redis', 'Docker / K8s', 'API Gateways'],
      growthPotential: 'Infrastructure Architect path'
    },
    {
      id: 'role-3',
      title: 'AI Application & GenAI Integration Engineer',
      matchScore: Math.max(75, readinessScore - 6),
      marketDemand: 'Extremely High',
      salaryRange: '$115,000 - $150,000 / yr',
      description: 'Integrate LLMs, vector search, and intelligent retrieval workflows into production enterprise software.',
      keyMatchingSkills: ['Python', 'TypeScript', 'Vector Databases', 'Prompt Optimization', 'FastAPI'],
      growthPotential: 'AI Solutions Tech Lead path'
    },
    {
      id: 'role-4',
      title: 'Frontend Platform & Design Systems Architect',
      matchScore: Math.max(82, readinessScore - 2),
      marketDemand: 'High',
      salaryRange: '$100,000 - $135,000 / yr',
      description: 'Lead web performance optimizations, reusable UI component libraries, and accessibility standards.',
      keyMatchingSkills: ['React 19', 'Design Systems', 'Web Vitals', 'TypeScript', 'Tailwind'],
      growthPotential: 'Principal Frontend Architect'
    }
  ];

  // Sort by match score descending
  recommendedRoles.sort((a, b) => b.matchScore - a.matchScore);

  const executiveSummary = `Candidate demonstrates a commanding technical acumen with an overall Career Readiness Score of ${readinessScore}/100, placing them in the ${percentileRank}th percentile of engineering graduates. Their strong proficiency in modern frontend frameworks and modular API architecture provides an immediate foundation for high-velocity software engineering roles. Addressing key gaps in multi-cluster Kubernetes deployment and vector search indexers will solidify their profile for top-tier enterprise offers.`;

  return {
    completedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readinessScore,
    percentileRank,
    tierLabel,
    executiveSummary,
    dimensionScores,
    strengths,
    weaknesses,
    skillGaps,
    recommendedRoles,
    recommendedLearningTrack: {
      title: 'Enterprise Full-Stack & Cloud Architecture Sprint',
      duration: '4 Weeks (10 hrs/week)',
      modulesCount: 6,
      description: 'Targeted capstone labs covering distributed caching, Kafka event streaming, and production GKE deployment.'
    }
  };
}
