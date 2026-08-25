/**
 * DEMO / BASELINE Industry Skill Requirements
 * 
 * NOTE: These values represent demo and baseline industry benchmark requirements
 * for technology roles. They are calibrated for standard software engineering
 * readiness benchmarks and do NOT represent official national government/industry statistics.
 * 
 * Configured as a centralized baseline that can dynamically synchronize with real-time
 * industry demand telemetry in future phases.
 */

export interface IndustrySkillRequirement {
  skillId: string;
  skillName: string;
  category: 'technical' | 'professional';
  subcategory: string;
  requiredLevel: number; // 0 - 100
  marketDemand: 'Very High' | 'High' | 'Moderate';
  description: string;
  iconName: string;
}

export const BASELINE_INDUSTRY_REQUIREMENTS: Record<string, IndustrySkillRequirement> = {
  'tech-programming': {
    skillId: 'tech-programming',
    skillName: 'Programming',
    category: 'technical',
    subcategory: 'Languages & Core Paradigms',
    requiredLevel: 85,
    marketDemand: 'Very High',
    description: 'Polyglot coding proficiency, strict typing, clean design patterns, and memory safety.',
    iconName: 'Code2'
  },
  'tech-dsa': {
    skillId: 'tech-dsa',
    skillName: 'Data Structures & Algorithms',
    category: 'technical',
    subcategory: 'Core Algorithms & Optimization',
    requiredLevel: 82,
    marketDemand: 'Very High',
    description: 'Algorithmic space-time complexity analysis, graph traversals, and dynamic programming.',
    iconName: 'Boxes'
  },
  'tech-database': {
    skillId: 'tech-database',
    skillName: 'Database',
    category: 'technical',
    subcategory: 'Data Modeling & Query Optimization',
    requiredLevel: 78,
    marketDemand: 'High',
    description: 'Relational & NoSQL architecture, indexing strategies, transactions, and caching.',
    iconName: 'Database'
  },
  'tech-web': {
    skillId: 'tech-web',
    skillName: 'Web Development',
    category: 'technical',
    subcategory: 'Frontend & Full-Stack Systems',
    requiredLevel: 80,
    marketDemand: 'Very High',
    description: 'Modern component architectures, state hydration, accessibility (WCAG), and responsive UX.',
    iconName: 'Layout'
  },
  'tech-cloud': {
    skillId: 'tech-cloud',
    skillName: 'Cloud Computing',
    category: 'technical',
    subcategory: 'Cloud Infrastructure & DevOps',
    requiredLevel: 76,
    marketDemand: 'Very High',
    description: 'Containerization, serverless architectures, CI/CD automation, and cloud deployments.',
    iconName: 'Cloud'
  },
  'tech-aiml': {
    skillId: 'tech-aiml',
    skillName: 'AI/ML',
    category: 'technical',
    subcategory: 'Machine Learning & LLM Systems',
    requiredLevel: 80,
    marketDemand: 'Very High',
    description: 'Generative AI workflows, embeddings, vector indexing, prompt engineering, and model evaluation.',
    iconName: 'Brain'
  },
  'tech-security': {
    skillId: 'tech-security',
    skillName: 'Cybersecurity',
    category: 'technical',
    subcategory: 'Application & Cloud Security',
    requiredLevel: 70,
    marketDemand: 'High',
    description: 'Zero-trust security principles, OWASP Top 10 mitigation, auth protocols, and safe secrets management.',
    iconName: 'ShieldAlert'
  },
  'prof-comm': {
    skillId: 'prof-comm',
    skillName: 'Communication',
    category: 'professional',
    subcategory: 'Technical Writing & Articulation',
    requiredLevel: 75,
    marketDemand: 'Very High',
    description: 'Clear architectural documentation, concise PR descriptions, and cross-functional sync.',
    iconName: 'MessageSquare'
  },
  'prof-teamwork': {
    skillId: 'prof-teamwork',
    skillName: 'Teamwork',
    category: 'professional',
    subcategory: 'Collaborative Engineering & Peer Reviews',
    requiredLevel: 78,
    marketDemand: 'Very High',
    description: 'Constructive code reviews, pair programming, asynchronous agility, and team ownership.',
    iconName: 'Users'
  },
  'prof-leadership': {
    skillId: 'prof-leadership',
    skillName: 'Leadership',
    category: 'professional',
    subcategory: 'Initiative & Mentorship',
    requiredLevel: 70,
    marketDemand: 'Moderate',
    description: 'Technical initiative, mentoring peers, driving project milestones, and taking architectural ownership.',
    iconName: 'Compass'
  },
  'prof-problemsolving': {
    skillId: 'prof-problemsolving',
    skillName: 'Problem Solving',
    category: 'professional',
    subcategory: 'Analytical Decomposition & Root-Cause',
    requiredLevel: 82,
    marketDemand: 'Very High',
    description: 'Structured root-cause diagnosis, debugging complex incidents, and systematic problem decomposition.',
    iconName: 'Lightbulb'
  }
};

/**
 * Quick lookup helper by skill id or canonical name
 */
export function getIndustryRequirementForSkill(skillKeyOrId: string): number {
  if (BASELINE_INDUSTRY_REQUIREMENTS[skillKeyOrId]) {
    return BASELINE_INDUSTRY_REQUIREMENTS[skillKeyOrId].requiredLevel;
  }
  const match = Object.values(BASELINE_INDUSTRY_REQUIREMENTS).find(
    (req) => req.skillName.toLowerCase() === skillKeyOrId.toLowerCase() || req.skillId.toLowerCase() === skillKeyOrId.toLowerCase()
  );
  return match ? match.requiredLevel : 75;
}
