import { CareerRoadmapData, RoadmapPhase } from '../types/careerRoadmap';

export const DEFAULT_SOFTWARE_ENGINEER_ROADMAP: CareerRoadmapData = {
  careerGoal: 'Software Engineer',
  goalDescription: 'Targeting Tier-1 & High-Growth tech companies for full-time Software Engineer (SDE-1) & Graduate Roles.',
  currentReadiness: 78,
  projectedFinalReadiness: 98,
  totalPhases: 5,
  estimatedTotalWeeks: '14-16 Weeks',
  lastUpdated: 'Updated today by SkillSetu AI Advisor',
  phases: [
    // PHASE 1: Improve DSA
    {
      id: 'phase-1',
      phaseNumber: 1,
      title: 'Improve DSA',
      subtitle: 'Algorithmic Problem Solving & Data Structures Mastery',
      description: 'Strengthen core data structures, graph traversals, dynamic programming patterns, and time-space complexity optimization to pass standard SDE coding rounds.',
      status: 'in-progress',
      estimatedReadinessIncrease: 5,
      resultingReadiness: 83,
      durationWeeks: '3-4 Weeks',
      iconName: 'Boxes',
      skillsCovered: ['Data Structures', 'Algorithms', 'Dynamic Programming', 'Graph Theory', 'Time-Space Complexity'],
      tasks: [
        {
          id: 'task-1-1',
          title: 'Master 14 Core Coding Patterns',
          description: 'Two Pointers, Sliding Window, Fast & Slow Pointers, Monotonic Stack, and Binary Search templates.',
          completed: true,
          resourceTitle: 'SkillSetu DSA Core Patterns Guide',
          duration: '6 hours'
        },
        {
          id: 'task-1-2',
          title: 'Solve 40 Curated Medium/Hard Questions',
          description: 'Focus on Graphs (BFS/DFS, Topological Sort) and 1D/2D Dynamic Programming on LeetCode/Codeforces.',
          completed: false,
          resourceTitle: 'Curated 75 SDE Problem Set',
          duration: '15 hours'
        },
        {
          id: 'task-1-3',
          title: 'Complete 2 Timed Mock Technical Coding Rounds',
          description: 'Simulate 45-minute live technical screens with automated test case evaluation and complexity profiling.',
          completed: false,
          resourceTitle: 'SkillSetu Proctored Coding Sandbox',
          duration: '2 hours'
        }
      ],
      certificationsOrLabs: [
        {
          title: 'Advanced Algorithmic Thinking Certification',
          provider: 'SkillSetu Algorithms Guild',
          level: 'Advanced'
        }
      ],
      hiringImpact: 'Satisfies standard technical screening criteria for 95% of top tech employers.'
    },

    // PHASE 2: Build React Project
    {
      id: 'phase-2',
      phaseNumber: 2,
      title: 'Build React Project',
      subtitle: 'Modern Component Architecture & Client State Engineering',
      description: 'Develop a responsive, high-performance web application utilizing modern React 19, TypeScript, state management, and seamless API integrations.',
      status: 'upcoming',
      estimatedReadinessIncrease: 4,
      resultingReadiness: 87,
      durationWeeks: '3 Weeks',
      iconName: 'Globe',
      skillsCovered: ['React 19', 'TypeScript', 'Tailwind CSS', 'State Management', 'REST/GraphQL APIs', 'Performance Optimization'],
      tasks: [
        {
          id: 'task-2-1',
          title: 'Architect Component Hierarchy & Custom Hooks',
          description: 'Implement reusable UI components, accessible design systems, and debounce/memoization hooks.',
          completed: false,
          resourceTitle: 'Production React & TypeScript Architecture',
          duration: '8 hours'
        },
        {
          id: 'task-2-2',
          title: 'Integrate Real-time API / State Layer',
          description: 'Connect frontend to RESTful or WebSocket backend with client caching, optimistic UI updates, and error boundaries.',
          completed: false,
          resourceTitle: 'State Management & Async Data Handling',
          duration: '10 hours'
        },
        {
          id: 'task-2-3',
          title: 'Lighthouse Performance & Accessibility Audit',
          description: 'Optimize bundle size, asset loading, and ensure 90+ Lighthouse score across Desktop & Mobile.',
          completed: false,
          resourceTitle: 'Web Vitals & Performance Masterclass',
          duration: '4 hours'
        }
      ],
      recommendedProjects: [
        {
          title: 'Real-time Collaborative Task & Whiteboard Platform',
          description: 'Multi-user reactive workspace featuring dynamic drag-and-drop, WebSocket sync, and responsive Dark/Light themes.',
          deliverable: 'Live Vercel/Netlify Deployment + GitHub Source'
        }
      ],
      hiringImpact: 'Provides concrete visual proof of frontend craftsmanship and modern web standards.'
    },

    // PHASE 3: Learn Cloud Deployment
    {
      id: 'phase-3',
      phaseNumber: 3,
      title: 'Learn Cloud Deployment',
      subtitle: 'Containerization, CI/CD Pipelines & Cloud Infrastructure',
      description: 'Gain hands-on proficiency in containerizing applications with Docker, deploying to AWS/GCP, configuring CI/CD automation, and managing cloud environments.',
      status: 'upcoming',
      estimatedReadinessIncrease: 4,
      resultingReadiness: 91,
      durationWeeks: '2-3 Weeks',
      iconName: 'Cloud',
      skillsCovered: ['Docker', 'AWS / Google Cloud', 'CI/CD Pipelines', 'GitHub Actions', 'Serverless Functions', 'Environment Security'],
      tasks: [
        {
          id: 'task-3-1',
          title: 'Containerize Full-Stack App with Docker',
          description: 'Write multi-stage Dockerfiles optimizing image size under 60MB and compose local multi-service networks.',
          completed: false,
          resourceTitle: 'Docker & Microservices Sandbox Lab',
          duration: '6 hours'
        },
        {
          id: 'task-3-2',
          title: 'Configure GitHub Actions CI/CD Pipeline',
          description: 'Automate linting, unit testing, automated Docker image build, and seamless deployment upon main branch merge.',
          completed: false,
          resourceTitle: 'Continuous Integration with GitHub Actions',
          duration: '5 hours'
        },
        {
          id: 'task-3-3',
          title: 'Deploy to Cloud Container Service (ECS / Cloud Run / AWS)',
          description: 'Provision cloud compute, setup custom domain routing, SSL termination, and secure environment secret injection.',
          completed: false,
          resourceTitle: 'Cloud Deployment & DevOps Blueprint',
          duration: '6 hours'
        }
      ],
      certificationsOrLabs: [
        {
          title: 'AWS Certified Cloud Practitioner or GCP Associate Cloud Engineer',
          provider: 'Cloud Native Provider',
          level: 'Intermediate'
        }
      ],
      hiringImpact: 'Closes the critical infrastructure gap (+35 pts) identified in your skill benchmark.'
    },

    // PHASE 4: Industry Project
    {
      id: 'phase-4',
      phaseNumber: 4,
      title: 'Industry Project',
      subtitle: 'Full-Stack Production System & Enterprise Problem Statement',
      description: 'Collaborate on a real-world enterprise problem statement featuring distributed database modeling, authentication, rate limiting, and technical documentation.',
      status: 'upcoming',
      estimatedReadinessIncrease: 4,
      resultingReadiness: 95,
      durationWeeks: '3-4 Weeks',
      iconName: 'Briefcase',
      skillsCovered: ['System Architecture', 'PostgreSQL / NoSQL', 'Authentication (OAuth/JWT)', 'Rate Limiting', 'Automated Testing', 'Technical RFCs'],
      tasks: [
        {
          id: 'task-4-1',
          title: 'Implement Resilient Backend & Database Architecture',
          description: 'Design relational schemas with indexes, transactional concurrency, connection pooling, and Redis caching.',
          completed: false,
          resourceTitle: 'High-Scale Backend System Design',
          duration: '12 hours'
        },
        {
          id: 'task-4-2',
          title: 'Write Comprehensive Unit & Integration Tests',
          description: 'Achieve >85% code coverage with Jest/Vitest and Supertest across API endpoints and edge cases.',
          completed: false,
          resourceTitle: 'Test-Driven Development (TDD) Guild',
          duration: '8 hours'
        },
        {
          id: 'task-4-3',
          title: 'Publish Architecture RFC & System Design Doc',
          description: 'Document system tradeoffs, API contracts, latency benchmarks, and disaster recovery procedures in a clear README.',
          completed: false,
          resourceTitle: 'Engineering RFC & System Documentation',
          duration: '4 hours'
        }
      ],
      recommendedProjects: [
        {
          title: 'Enterprise FinTech Payment Gateway & Microservice Dispatcher',
          description: 'Idempotent transaction processor with sliding-window rate limiting, webhook reconciliation, and zero-downtime deploy.',
          deliverable: 'Audited Production Repository + Architecture Specs'
        }
      ],
      hiringImpact: 'Directly validates Tier-1 engineering problem solving and system maturity.'
    },

    // PHASE 5: Apply for Internship
    {
      id: 'phase-5',
      phaseNumber: 5,
      title: 'Apply for Internship',
      subtitle: 'Portfolio Showcase, Resume Optimization & Direct Placement',
      description: 'Finalize your verified SkillSetu profile, apply with AI-customized resumes to matched partner employers, and ace behavioral & technical interviews.',
      status: 'upcoming',
      estimatedReadinessIncrease: 3,
      resultingReadiness: 98,
      durationWeeks: '2 Weeks',
      iconName: 'Award',
      skillsCovered: ['ATS Resume Optimization', 'Portfolio Showcase', 'Behavioral STAR Method', 'System Design Interviewing', 'Direct Referral'],
      tasks: [
        {
          id: 'task-5-1',
          title: 'Publish Verified SkillSetu Portfolio & Skill DNA Badge',
          description: 'Showcase verified coding scores, project deliverables, and GitHub proof to partner recruiters.',
          completed: false,
          resourceTitle: 'SkillSetu Digital Credential Hub',
          duration: '2 hours'
        },
        {
          id: 'task-5-2',
          title: 'Optimize Resume for ATS & Target Software Roles',
          description: 'Highlight measurable metrics (e.g., latency reduction, test coverage, RPS handled) using Action-Verb framing.',
          completed: false,
          resourceTitle: 'Tech Resume Review & Scoring Tool',
          duration: '3 hours'
        },
        {
          id: 'task-5-3',
          title: 'Submit 10+ Direct Applications to Matched Industry Openings',
          description: 'Apply directly through SkillSetu verified recruiter channel with high match index (90%+ match).',
          completed: false,
          resourceTitle: 'SkillSetu Curated Opportunity Engine',
          duration: '5 hours'
        }
      ],
      hiringImpact: 'Completes transition to Job-Ready status with 98% industry match score.'
    }
  ]
};

// Alternative Career Goal Presets for customization
export const CAREER_GOAL_PRESETS: { id: string; name: string; readiness: number; description: string }[] = [
  {
    id: 'swe',
    name: 'Software Engineer',
    readiness: 78,
    description: 'Core Software Engineering, Data Structures, Web Systems & Cloud Deployment'
  },
  {
    id: 'fullstack',
    name: 'Full-Stack Developer',
    readiness: 74,
    description: 'End-to-End Modern Web Architecture, Distributed Backends & Databases'
  },
  {
    id: 'cloud-devops',
    name: 'Cloud & DevOps Engineer',
    readiness: 66,
    description: 'Infrastructure as Code, Kubernetes, CI/CD Pipelines & Cloud Reliability'
  },
  {
    id: 'ai-ml',
    name: 'AI / Machine Learning Engineer',
    readiness: 70,
    description: 'LLM Orchestration, Vector Search, Data Pipelines & Model Deployment'
  }
];
