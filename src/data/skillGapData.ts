import { SkillGapItem, CareerPathRole, SkillGapOverviewStats, PriorityLevel, GapStatus } from '../types/skillGap';

// Standard Target Career Benchmark Roles
export const TARGET_CAREER_ROLES: CareerPathRole[] = [
  {
    id: 'fullstack',
    title: 'Full-Stack Software Engineer (Tier-1)',
    description: 'Modern web architectures, distributed backends, cloud deployments, and resilient database modeling.',
    avgSalary: '$135,000 / ₹28 LPA',
    industryDemand: 'Very High',
    skillRequirements: {
      'tech-cloud': 80,
      'tech-security': 78,
      'tech-aiml': 75,
      'tech-devops': 75,
      'tech-sysdesign': 82,
      'tech-database': 80,
      'tech-dsa': 75,
      'tech-web': 85,
      'tech-programming': 80,
      'prof-comm': 85,
      'prof-leadership': 75,
      'prof-teamwork': 80,
      'prof-problemsolving': 85
    }
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps Platform Engineer',
    description: 'Infrastructure as Code, multi-cloud resilience, Kubernetes orchestration, and zero-trust security.',
    avgSalary: '$145,000 / ₹32 LPA',
    industryDemand: 'Very High',
    skillRequirements: {
      'tech-cloud': 92,
      'tech-security': 88,
      'tech-aiml': 65,
      'tech-devops': 90,
      'tech-sysdesign': 88,
      'tech-database': 82,
      'tech-dsa': 70,
      'tech-web': 70,
      'tech-programming': 82,
      'prof-comm': 80,
      'prof-leadership': 75,
      'prof-teamwork': 85,
      'prof-problemsolving': 88
    }
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI / Machine Learning Engineer',
    description: 'Generative AI architectures, vector databases, LLM orchestration, model serving, and data pipelines.',
    avgSalary: '$155,000 / ₹35 LPA',
    industryDemand: 'Very High',
    skillRequirements: {
      'tech-cloud': 82,
      'tech-security': 75,
      'tech-aiml': 92,
      'tech-devops': 78,
      'tech-sysdesign': 85,
      'tech-database': 85,
      'tech-dsa': 85,
      'tech-web': 72,
      'tech-programming': 90,
      'prof-comm': 80,
      'prof-leadership': 75,
      'prof-teamwork': 80,
      'prof-problemsolving': 90
    }
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity & Application Security Specialist',
    description: 'Threat modeling, cloud workload protection, cryptography, DevSecOps pipelines, and compliance audit.',
    avgSalary: '$140,000 / ₹30 LPA',
    industryDemand: 'High',
    skillRequirements: {
      'tech-cloud': 85,
      'tech-security': 94,
      'tech-aiml': 70,
      'tech-devops': 82,
      'tech-sysdesign': 85,
      'tech-database': 80,
      'tech-dsa': 75,
      'tech-web': 78,
      'tech-programming': 82,
      'prof-comm': 85,
      'prof-leadership': 80,
      'prof-teamwork': 80,
      'prof-problemsolving': 90
    }
  }
];

// Helper to determine priority and color based on gap
export const calculateGapAttributes = (current: number, required: number): {
  gap: number;
  priority: PriorityLevel;
  status: GapStatus;
  indicatorColor: 'red' | 'yellow' | 'green';
} => {
  const gap = Math.max(0, required - current);

  if (gap >= 25) {
    return {
      gap,
      priority: 'High',
      status: 'critical',
      indicatorColor: 'red'
    };
  } else if (gap >= 10) {
    return {
      gap,
      priority: 'Medium',
      status: 'moderate',
      indicatorColor: 'yellow'
    };
  } else {
    return {
      gap,
      priority: 'Low',
      status: 'aligned',
      indicatorColor: 'green'
    };
  }
};

export const BASE_SKILL_GAPS: SkillGapItem[] = [
  // 1. Cloud Computing (High Priority / Red Example)
  {
    id: 'tech-cloud',
    name: 'Cloud Computing',
    category: 'technical',
    subcategory: 'Infrastructure & Containerization',
    iconName: 'Cloud',
    currentLevel: 45,
    requiredLevel: 80,
    gap: 35,
    priority: 'High',
    status: 'critical',
    indicatorColor: 'red',
    recommendation: 'Complete Cloud Foundations Certification.',
    detailedActionPlan: [
      'Enroll in AWS Certified Cloud Practitioner or Google Cloud Associate Cloud Engineer roadmap.',
      'Deploy containerized microservices on AWS ECS/EKS with IAM least-privilege security.',
      'Configure automated Terraform provisioning for multi-region VPC and CloudFront CDN.'
    ],
    recommendedResources: [
      {
        id: 'res-cloud-1',
        title: 'AWS Certified Cloud Practitioner & Associate Prep',
        provider: 'AWS Training & Certification',
        duration: '18 hours',
        level: 'Intermediate',
        type: 'certification',
        isIndustryStandard: true
      },
      {
        id: 'res-cloud-2',
        title: 'Google Cloud Platform (GCP) Fundamentals: Core Infrastructure',
        provider: 'Google Cloud Skills Boost',
        duration: '12 hours',
        level: 'Beginner',
        type: 'course',
        isIndustryStandard: true
      },
      {
        id: 'res-cloud-3',
        title: 'Docker & Kubernetes Hands-On Production Cluster Lab',
        provider: 'SkillSetu Virtual Sandbox',
        duration: '6 hours',
        level: 'Intermediate',
        type: 'hands-on-lab'
      }
    ],
    recommendedProject: {
      title: 'Serverless Event-Driven Video Transcoder on AWS/GCP',
      description: 'Build a serverless pipeline using S3 event triggers, Lambda/Cloud Functions, and SQS/SNS for media encoding.',
      estimatedHours: '16 hours',
      outcome: 'Closes Cloud Infrastructure & Serverless Architecture gap by ~20 points.',
      deliverable: 'Live CloudFormation/Terraform IaC repo + demo URL'
    },
    marketDemandScore: 96,
    hiringImpact: 'Mandatory for 88% of Tier-1 backend & full-stack job listings.',
    assessmentSkillName: 'Cloud Architecture & Kubernetes'
  },

  // 2. Cybersecurity & Trust Architecture (High Priority / Red)
  {
    id: 'tech-security',
    name: 'Cybersecurity',
    category: 'technical',
    subcategory: 'AppSec & Zero Trust',
    iconName: 'ShieldCheck',
    currentLevel: 52,
    requiredLevel: 78,
    gap: 26,
    priority: 'High',
    status: 'critical',
    indicatorColor: 'red',
    recommendation: 'Complete Hands-on OWASP Top 10 & Threat Modeling Lab.',
    detailedActionPlan: [
      'Audit existing repositories with Snyk, SonarQube, and OWASP ZAP for vulnerability triage.',
      'Implement JWT token revocation with Redis blocklists and encrypted HTTP-only session cookies.',
      'Earn CompTIA Security+ or Certified DevSecOps Professional (CDP) badge.'
    ],
    recommendedResources: [
      {
        id: 'res-sec-1',
        title: 'OWASP Application Security Verification Standard (ASVS) Masterclass',
        provider: 'SkillSetu Security Guild',
        duration: '14 hours',
        level: 'Intermediate',
        type: 'certification',
        isIndustryStandard: true
      },
      {
        id: 'res-sec-2',
        title: 'Practical DevSecOps: CI/CD Pipeline Hardening',
        provider: 'Linux Foundation',
        duration: '10 hours',
        level: 'Advanced',
        type: 'hands-on-lab'
      }
    ],
    recommendedProject: {
      title: 'Zero-Trust OAuth2/OIDC Enterprise Auth Gateway',
      description: 'Implement mutual TLS, PKCE authentication flows, RBAC authorization middleware, and automated rate limiting.',
      estimatedHours: '20 hours',
      outcome: 'Closes Cybersecurity & Auth Verification gap by ~18 points.',
      deliverable: 'Audited Node/Go gateway with 100% security test coverage'
    },
    marketDemandScore: 92,
    hiringImpact: 'High urgency for fintech, enterprise SaaS, and healthtech roles.',
    assessmentSkillName: 'Application Security & DevSecOps'
  },

  // 3. AI & Machine Learning (Medium Priority / Yellow)
  {
    id: 'tech-aiml',
    name: 'AI & Machine Learning',
    category: 'technical',
    subcategory: 'Applied GenAI & Data Intelligence',
    iconName: 'Brain',
    currentLevel: 64,
    requiredLevel: 85,
    gap: 21,
    priority: 'Medium',
    status: 'moderate',
    indicatorColor: 'yellow',
    recommendation: 'Implement End-to-End LLM RAG Pipeline with Vector Search.',
    detailedActionPlan: [
      'Master prompt engineering, structured JSON output generation, and function calling with Gemini 2.5/Flash.',
      'Build a semantic retrieval pipeline using Pinecone/Pgvector with hybrid keyword-dense embedding search.',
      'Evaluate model hallucinations with Ragas benchmarks and latency tracking.'
    ],
    recommendedResources: [
      {
        id: 'res-ai-1',
        title: 'DeepLearning.AI: Building Systems with LLMs & Agents',
        provider: 'DeepLearning.AI',
        duration: '15 hours',
        level: 'Intermediate',
        type: 'course',
        isIndustryStandard: true
      },
      {
        id: 'res-ai-2',
        title: 'Gemini 2.5 Flash SDK Integration & Prototyping Workshop',
        provider: 'Google for Developers',
        duration: '8 hours',
        level: 'Intermediate',
        type: 'hands-on-lab'
      }
    ],
    recommendedProject: {
      title: 'Autonomous Code Review & Security Audit Agent',
      description: 'Develop a multi-agent system that analyzes GitHub Pull Requests, predicts syntax defects, and generates security patches.',
      estimatedHours: '18 hours',
      outcome: 'Closes Applied AI and Agentic Workflow gap by ~15 points.',
      deliverable: 'Deployed GitHub App with live webhook processing'
    },
    marketDemandScore: 98,
    hiringImpact: 'Top differentiator for high-growth tech firms and AI startups.',
    assessmentSkillName: 'Generative AI & LLM Systems'
  },

  // 4. DevOps & CI/CD Pipelines (Medium Priority / Yellow)
  {
    id: 'tech-devops',
    name: 'DevOps & CI/CD',
    category: 'technical',
    subcategory: 'Automation & Observability',
    iconName: 'Zap',
    currentLevel: 58,
    requiredLevel: 75,
    gap: 17,
    priority: 'Medium',
    status: 'moderate',
    indicatorColor: 'yellow',
    recommendation: 'Build Automated Docker & GitHub Actions Multi-stage Deploy Workflow.',
    detailedActionPlan: [
      'Write multi-stage Dockerfiles optimizing image size under 50MB using Alpine/Distroless.',
      'Create GitHub Actions matrix workflows for linting, testing, security scanning, and blue-green deployment.',
      'Setup Prometheus metrics and Grafana dashboard alerts for latency anomalies.'
    ],
    recommendedResources: [
      {
        id: 'res-devops-1',
        title: 'GitOps & Continuous Delivery with ArgoCD & GitHub Actions',
        provider: 'Cloud Native Computing Foundation',
        duration: '12 hours',
        level: 'Intermediate',
        type: 'certification'
      }
    ],
    recommendedProject: {
      title: 'Zero-Downtime Blue-Green Deployment Pipeline with Canary Releases',
      description: 'Setup continuous delivery pipeline deploying to Kubernetes with automatic rollback on 5xx spike.',
      estimatedHours: '14 hours',
      outcome: 'Closes DevOps deployment gap by ~12 points.',
      deliverable: 'Reproducible CI/CD pipeline template with docs'
    },
    marketDemandScore: 89,
    hiringImpact: 'Required for fast-paced agile engineering teams.',
    assessmentSkillName: 'DevOps & Automation'
  },

  // 5. System Design & Distributed Systems (Medium Priority / Yellow)
  {
    id: 'tech-sysdesign',
    name: 'System Design',
    category: 'technical',
    subcategory: 'High-Scale Architecture',
    iconName: 'Layers',
    currentLevel: 66,
    requiredLevel: 82,
    gap: 16,
    priority: 'Medium',
    status: 'moderate',
    indicatorColor: 'yellow',
    recommendation: 'Complete Distributed Caching & Event-Driven Architecture Case Study.',
    detailedActionPlan: [
      'Study CAP theorem tradeoffs, consistent hashing, database sharding, and write-through caching.',
      'Design high-throughput message brokers using Kafka/RabbitMQ with idempotent consumers.',
      'Participate in mock system design interviews on Excalidraw focusing on scale to 10M DAU.'
    ],
    recommendedResources: [
      {
        id: 'res-sys-1',
        title: 'System Design for Large-Scale Applications',
        provider: 'SkillSetu Masterclass',
        duration: '20 hours',
        level: 'Advanced',
        type: 'course',
        isIndustryStandard: true
      }
    ],
    recommendedProject: {
      title: 'Distributed Rate Limiter & URL Shortener Handling 50k RPS',
      description: 'Build a distributed Redis token-bucket rate limiter with sliding window logs and Cassandra persistence.',
      estimatedHours: '15 hours',
      outcome: 'Closes System Architecture gap by ~14 points.',
      deliverable: 'Architecture diagram + benchmark load test report'
    },
    marketDemandScore: 94,
    hiringImpact: 'Crucial for SDE-2 and Tier-1 product company evaluations.',
    assessmentSkillName: 'System Architecture & Scalability'
  },

  // 6. Leadership & Mentorship (Medium Priority / Yellow - Professional)
  {
    id: 'prof-leadership',
    name: 'Leadership & Initiative',
    category: 'professional',
    subcategory: 'Mentorship & Project Ownership',
    iconName: 'Award',
    currentLevel: 55,
    requiredLevel: 75,
    gap: 20,
    priority: 'Medium',
    status: 'moderate',
    indicatorColor: 'yellow',
    recommendation: 'Lead a Campus Hackathon Sprint or Open Source Community working group.',
    detailedActionPlan: [
      'Step up as technical lead for a collegiate open-source or hackathon team of 4-6 members.',
      'Write technical RFCs and lead architecture alignment syncs with faculty or industry mentors.',
      'Conduct 1-on-1 code reviews and onboarding sessions for junior student developers.'
    ],
    recommendedResources: [
      {
        id: 'res-lead-1',
        title: 'Engineering Leadership & Technical Decision Making',
        provider: 'Harvard Division of Continuing Education',
        duration: '10 hours',
        level: 'Intermediate',
        type: 'course'
      }
    ],
    marketDemandScore: 82,
    hiringImpact: 'Distinguishes potential fast-track engineering leads.',
    assessmentSkillName: 'Leadership & Mentorship'
  },

  // 7. Communication & Stakeholder Management (Medium Priority / Yellow - Professional)
  {
    id: 'prof-comm',
    name: 'Communication',
    category: 'professional',
    subcategory: 'Technical Writing & Stakeholder Sync',
    iconName: 'MessageSquare',
    currentLevel: 68,
    requiredLevel: 85,
    gap: 17,
    priority: 'Medium',
    status: 'moderate',
    indicatorColor: 'yellow',
    recommendation: 'Participate in Cross-Functional Technical Architecture Review Presentations.',
    detailedActionPlan: [
      'Publish 2 in-depth technical engineering blog posts breaking down architectural tradeoffs.',
      'Practice executive summary presentations explaining technical debt ROI to business stakeholders.',
      'Complete peer review exercises providing constructive code refactoring feedback.'
    ],
    recommendedResources: [
      {
        id: 'res-comm-1',
        title: 'Effective Technical Communication for Software Engineers',
        provider: 'SkillSetu Career Hub',
        duration: '8 hours',
        level: 'Beginner',
        type: 'course'
      }
    ],
    marketDemandScore: 88,
    hiringImpact: 'Vital for remote collaboration and global distributed teams.',
    assessmentSkillName: 'Technical Communication'
  },

  // 8. Database & Data Modeling (Low Priority / Green - Aligned)
  {
    id: 'tech-database',
    name: 'Database & SQL Systems',
    category: 'technical',
    subcategory: 'Relational & NoSQL Stores',
    iconName: 'Database',
    currentLevel: 78,
    requiredLevel: 80,
    gap: 2,
    priority: 'Low',
    status: 'aligned',
    indicatorColor: 'green',
    recommendation: 'Practice Advanced PostgreSQL Index Tuning & Query Plan Profiling.',
    detailedActionPlan: [
      'Analyze EXPLAIN ANALYZE execution plans to eliminate sequential scans on large datasets.',
      'Implement partitioned tables and transactional concurrency with isolation levels.'
    ],
    recommendedResources: [
      {
        id: 'res-db-1',
        title: 'PostgreSQL High Performance Query Optimization',
        provider: 'PostgreSQL Global Development Group',
        duration: '8 hours',
        level: 'Advanced',
        type: 'course'
      }
    ],
    marketDemandScore: 90,
    hiringImpact: 'Well aligned with industry threshold (98% match).',
    assessmentSkillName: 'Database Design & SQL Optimization'
  },

  // 9. Data Structures & Algorithms (Low Priority / Green - Exceeds)
  {
    id: 'tech-dsa',
    name: 'Data Structures & Algorithms',
    category: 'technical',
    subcategory: 'Algorithmic Optimization',
    iconName: 'Boxes',
    currentLevel: 88,
    requiredLevel: 75,
    gap: 0,
    priority: 'Low',
    status: 'aligned',
    indicatorColor: 'green',
    recommendation: 'Maintain Competitive Coding streak & lead peer mentoring.',
    detailedActionPlan: [
      'Solve 2 weekly LeetCode Hard / Codeforces Div 2 problems on dynamic programming & graphs.',
      'Mentor 3 junior peers on algorithmic complexity and recursion tree visualization.'
    ],
    recommendedResources: [
      {
        id: 'res-dsa-1',
        title: 'Competitive Programming Masterclass',
        provider: 'SkillSetu Algorithms Guild',
        duration: '16 hours',
        level: 'Advanced',
        type: 'course'
      }
    ],
    marketDemandScore: 95,
    hiringImpact: 'Exceeds target hiring threshold by +13 points.',
    assessmentSkillName: 'DSA & Algorithmic Optimization'
  },

  // 10. Web Development & React (Low Priority / Green - Exceeds)
  {
    id: 'tech-web',
    name: 'Web Development',
    category: 'technical',
    subcategory: 'Frontend & Full-Stack Interfaces',
    iconName: 'Globe',
    currentLevel: 92,
    requiredLevel: 85,
    gap: 0,
    priority: 'Low',
    status: 'aligned',
    indicatorColor: 'green',
    recommendation: 'Publish Full-Stack Open Source micro-framework or UI kit.',
    detailedActionPlan: [
      'Contribute to popular open-source React/Vite ecosystem packages.',
      'Explore React Server Components, Streaming SSR, and WebAssembly integration.'
    ],
    recommendedResources: [
      {
        id: 'res-web-1',
        title: 'Advanced React Architecture & Performance Optimization',
        provider: 'Meta Open Source / SkillSetu',
        duration: '12 hours',
        level: 'Advanced',
        type: 'certification'
      }
    ],
    marketDemandScore: 94,
    hiringImpact: 'Exceeds benchmark by +7 points (Top 4% of cohort).',
    assessmentSkillName: 'Modern Web Architecture'
  },

  // 11. Programming & Architecture (Low Priority / Green - Exceeds)
  {
    id: 'tech-programming',
    name: 'Programming & Languages',
    category: 'technical',
    subcategory: 'Core Polyglot & Clean Code',
    iconName: 'Code2',
    currentLevel: 94,
    requiredLevel: 80,
    gap: 0,
    priority: 'Low',
    status: 'aligned',
    indicatorColor: 'green',
    recommendation: 'Explore Rust memory safety and kernel-level network optimizations.',
    detailedActionPlan: [
      'Build a high-performance network proxy in Rust using Tokio async runtime.',
      'Author architectural blueprints for clean domain-driven design (DDD).'
    ],
    recommendedResources: [
      {
        id: 'res-prog-1',
        title: 'Rust Systems Programming & Concurrency',
        provider: 'Rust Foundation',
        duration: '16 hours',
        level: 'Advanced',
        type: 'course'
      }
    ],
    marketDemandScore: 98,
    hiringImpact: 'Exceeds benchmark by +14 points (Master Level).',
    assessmentSkillName: 'Programming Paradigms & Clean Code'
  },

  // 12. Teamwork & Collaboration (Low Priority / Green - Exceeds)
  {
    id: 'prof-teamwork',
    name: 'Teamwork & Collaboration',
    category: 'professional',
    subcategory: 'Agile & Cross-Functional Synergy',
    iconName: 'Users',
    currentLevel: 86,
    requiredLevel: 80,
    gap: 0,
    priority: 'Low',
    status: 'aligned',
    indicatorColor: 'green',
    recommendation: 'Facilitate Agile sprint retrospectives and team code review guidelines.',
    detailedActionPlan: [
      'Champion asynchronous documentation habits using PR templates and architectural decision records (ADRs).',
      'Encourage psychological safety and pair programming sessions across the cohort.'
    ],
    recommendedResources: [
      {
        id: 'res-team-1',
        title: 'Agile Team Dynamics & High Performance Squads',
        provider: 'Atlassian University',
        duration: '6 hours',
        level: 'Intermediate',
        type: 'course'
      }
    ],
    marketDemandScore: 86,
    hiringImpact: 'Exceeds benchmark by +6 points.',
    assessmentSkillName: 'Agile Teamwork & Collaboration'
  },

  // 13. Problem Solving & Critical Thinking (Low Priority / Green - Exceeds)
  {
    id: 'prof-problemsolving',
    name: 'Problem Solving',
    category: 'professional',
    subcategory: 'First-Principles & Root-Cause Analysis',
    iconName: 'Brain',
    currentLevel: 90,
    requiredLevel: 85,
    gap: 0,
    priority: 'Low',
    status: 'aligned',
    indicatorColor: 'green',
    recommendation: 'Tackle Complex System Failure root-cause investigations & post-mortems.',
    detailedActionPlan: [
      'Write blameless post-mortem incident reports for unexpected production edge cases.',
      'Formulate first-principles optimization hypotheses for bottlenecked services.'
    ],
    recommendedResources: [
      {
        id: 'res-prob-1',
        title: 'First Principles Thinking in Software Engineering',
        provider: 'SkillSetu Insights',
        duration: '6 hours',
        level: 'Advanced',
        type: 'course'
      }
    ],
    marketDemandScore: 92,
    hiringImpact: 'Exceeds benchmark by +5 points.',
    assessmentSkillName: 'Problem Solving & Critical Thinking'
  }
];

// Helper to compute dynamically updated items based on target role
export const getSkillGapItemsForRole = (roleId: string): SkillGapItem[] => {
  const role = TARGET_CAREER_ROLES.find((r) => r.id === roleId) || TARGET_CAREER_ROLES[0];

  // Try to load any student custom assessment overrides from localStorage if present
  let assessmentScores: Record<string, number> = {};
  try {
    const saved = localStorage.getItem('skillsetu_assessment_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.overallScore) {
        // Can subtly adjust scores if assessment was completed
      }
    }
  } catch (e) {
    // ignore
  }

  return BASE_SKILL_GAPS.map((item) => {
    const requiredLevel = role.skillRequirements[item.id] || item.requiredLevel;
    const currentLevel = assessmentScores[item.id] !== undefined ? assessmentScores[item.id] : item.currentLevel;
    const { gap, priority, status, indicatorColor } = calculateGapAttributes(currentLevel, requiredLevel);

    return {
      ...item,
      currentLevel,
      requiredLevel,
      gap,
      priority,
      status,
      indicatorColor
    };
  });
};

// Summary statistics helper
export const calculateSkillGapStats = (items: SkillGapItem[]): SkillGapOverviewStats => {
  const totalSkills = items.length;
  const criticalGapsCount = items.filter((i) => i.status === 'critical').length;
  const moderateGapsCount = items.filter((i) => i.status === 'moderate').length;
  const alignedCount = items.filter((i) => i.status === 'aligned').length;

  const totalCurrent = items.reduce((acc, curr) => acc + curr.currentLevel, 0);
  const totalRequired = items.reduce((acc, curr) => acc + curr.requiredLevel, 0);

  const averageCurrentLevel = Math.round(totalCurrent / totalSkills);
  const averageRequiredLevel = Math.round(totalRequired / totalSkills);

  const totalGap = items.reduce((acc, curr) => acc + curr.gap, 0);
  const overallGapIndex = Math.round(totalGap / totalSkills);

  // Top priority skill (highest gap)
  const sortedByGap = [...items].sort((a, b) => b.gap - a.gap);
  const topPrioritySkill = sortedByGap[0]?.name || 'Cloud Computing';

  // Overall career readiness percentage
  const readinessPercentage = Math.min(100, Math.round((totalCurrent / totalRequired) * 100));

  return {
    totalSkills,
    criticalGapsCount,
    moderateGapsCount,
    alignedCount,
    averageCurrentLevel,
    averageRequiredLevel,
    overallGapIndex,
    topPrioritySkill,
    readinessPercentage
  };
};
