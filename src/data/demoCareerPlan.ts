/**
 * Demonstration Career Plan for SkillSetu AI (Phase 15-C)
 * 
 * Clearly labeled demonstration data providing verified benchmarks
 * when previewing the Setu Career Coach in offline or demo modes.
 */

import { CareerActionPlan } from '../types/careerCoach';

export const DEMO_CAREER_PLAN: CareerActionPlan = {
  planId: 'plan-demo-alex-chen-2026',
  generatedAt: new Date().toISOString(),
  isDemo: true,
  targetRole: 'Full-Stack Software Engineer',
  readinessScore: 78,
  readinessTier: 'Tier-2 Developing Competence',
  readinessPercentile: 84,
  readinessExplanation: 'Your current readiness is 78%. The primary contributors to the 22-point gap are Kubernetes Orchestration (-24% deficit) and Distributed Caching & Redis (-20% deficit), while your foundational competencies in Python, React, and SQL remain strong.',
  overallSummary: 'Grounded 30-to-90-day trajectory targeted toward Full-Stack Engineering roles. Focuses first on closing critical infrastructure deficits (Kubernetes, Redis), building a verifiable microservices portfolio project, and advancing to Tier-1 placement readiness.',
  strongSkills: ['Python & Fast Data Structures', 'React / Frontend Architecture', 'SQL Relational Queries'],
  skillsToMaintain: ['TypeScript & Type Systems', 'RESTful API Design'],
  emergingSkills: ['Microservices Architecture', 'Event-Driven Systems (Kafka)'],
  priorities: [
    {
      skill: 'Kubernetes Orchestration',
      currentLevel: 58,
      requiredLevel: 82,
      gap: 24,
      industryDemand: 92,
      demandTrend: '+18% YoY',
      priority: 'critical',
      reason: '92% of tier-1 full-stack and cloud roles require container orchestration with Kubernetes manifests and helm charts.',
      priorityScore: 94
    },
    {
      skill: 'Distributed Caching & Redis',
      currentLevel: 62,
      requiredLevel: 82,
      gap: 20,
      industryDemand: 86,
      demandTrend: '+14% YoY',
      priority: 'high',
      reason: 'High-throughput system design benchmarks demand in-memory caching strategies and session state persistence.',
      priorityScore: 85
    },
    {
      skill: 'Cloud Architecture (AWS / GCP)',
      currentLevel: 68,
      requiredLevel: 85,
      gap: 17,
      industryDemand: 94,
      demandTrend: '+22% YoY',
      priority: 'high',
      reason: 'Cloud-native deployment pipelines and serverless server management are standard for modern web engineering.',
      priorityScore: 83
    },
    {
      skill: 'CI/CD Automation',
      currentLevel: 70,
      requiredLevel: 80,
      gap: 10,
      industryDemand: 78,
      demandTrend: '+9% YoY',
      priority: 'medium',
      reason: 'GitHub Actions and automated test pipelines enhance production code delivery confidence.',
      priorityScore: 68
    }
  ],
  duration: 30,
  weeklyPlan: [
    {
      weekNumber: 1,
      title: 'Week 1: Foundational Infrastructure Competencies',
      theme: 'Foundation',
      focusSummary: 'Master Kubernetes core objects (Pods, Deployments, Services, ConfigMaps) and Redis data structures.',
      tasks: [
        {
          taskId: 'task-w1-1',
          title: 'Complete Kubernetes Manifests & Pod Lifecycle',
          description: 'Deploy multi-container pods, write declarative YAML manifests, and configure ClusterIP/NodePort networking.',
          skill: 'Kubernetes Orchestration',
          estimatedHours: 6,
          type: 'Learning',
          priority: 'critical',
          completed: false,
          currentLevel: 58,
          targetLevel: 68,
          linkedResource: {
            label: 'View Skill Gap',
            actionType: 'VIEW_SKILL_GAP',
            target: '/dashboard/student/skill-gap'
          }
        },
        {
          taskId: 'task-w1-2',
          title: 'Implement Redis Caching Layer in Node/Express',
          description: 'Integrate Redis client for query result caching, TTL management, and rate-limiting patterns.',
          skill: 'Distributed Caching & Redis',
          estimatedHours: 5,
          type: 'Practice',
          priority: 'high',
          completed: false,
          currentLevel: 62,
          targetLevel: 72,
          linkedResource: {
            label: 'View Skill Gap',
            actionType: 'VIEW_SKILL_GAP',
            target: '/dashboard/student/skill-gap'
          }
        },
        {
          taskId: 'task-w1-3',
          title: 'Enroll in Cloud Infrastructure Bootcamp Intervention',
          description: 'Join the institutional hands-on cohort focusing on real-world Docker and Kubernetes deployments.',
          skill: 'Cloud Architecture (AWS / GCP)',
          estimatedHours: 4,
          type: 'Learning',
          priority: 'high',
          completed: false,
          linkedResource: {
            label: 'View Intervention',
            actionType: 'VIEW_INTERVENTIONS',
            target: '/dashboard/student/interventions'
          }
        }
      ]
    },
    {
      weekNumber: 2,
      title: 'Week 2: Advanced Integration & Microservices',
      theme: 'Practice',
      focusSummary: 'Connect distributed components, implement JWT authentication across services, and configure ingress controllers.',
      tasks: [
        {
          taskId: 'task-w2-1',
          title: 'Build Distributed Ingress & Service Routing',
          description: 'Set up NGINX Ingress Controller in minikube/k8s to route traffic between frontend and backend pods.',
          skill: 'Kubernetes Orchestration',
          estimatedHours: 6,
          type: 'Practice',
          priority: 'critical',
          completed: false,
          currentLevel: 68,
          targetLevel: 76,
          linkedResource: {
            label: 'View Skill Gap',
            actionType: 'VIEW_SKILL_GAP',
            target: '/dashboard/student/skill-gap'
          }
        },
        {
          taskId: 'task-w2-2',
          title: 'Implement Cache Invalidation & Pub/Sub Channels',
          description: 'Construct event-based cache invalidation workflows using Redis Pub/Sub with PostgreSQL data synchronization.',
          skill: 'Distributed Caching & Redis',
          estimatedHours: 5,
          type: 'Practice',
          priority: 'high',
          completed: false,
          currentLevel: 72,
          targetLevel: 78
        },
        {
          taskId: 'task-w2-3',
          title: 'Benchmark System Latency with Apache Bench / k6',
          description: 'Simulate concurrent loads to prove a 5x latency reduction with Redis caching enabled.',
          skill: 'Cloud Architecture (AWS / GCP)',
          estimatedHours: 3,
          type: 'Practice',
          priority: 'medium',
          completed: false
        }
      ]
    },
    {
      weekNumber: 3,
      title: 'Week 3: Production-Grade Project Development',
      theme: 'Project',
      focusSummary: 'Synthesize skills into an end-to-end full-stack application featuring microservices, Redis caching, and CI/CD.',
      tasks: [
        {
          taskId: 'task-w3-1',
          title: 'Develop Scalable E-Commerce / Analytics Microservices',
          description: 'Implement a multi-service architecture with React frontend, Go/Node backend, Redis cache, and Postgres DB.',
          skill: 'Full-Stack Software Engineering',
          estimatedHours: 10,
          type: 'Project',
          priority: 'critical',
          completed: false,
          linkedResource: {
            label: 'View Portfolio',
            actionType: 'VIEW_PORTFOLIO',
            target: '/dashboard/student/portfolio'
          }
        },
        {
          taskId: 'task-w3-2',
          title: 'Automate GitHub Actions CI/CD Pipeline',
          description: 'Write automated build, test, and container image publishing workflow to Docker Hub.',
          skill: 'CI/CD Automation',
          estimatedHours: 4,
          type: 'Project',
          priority: 'high',
          completed: false
        }
      ]
    },
    {
      weekNumber: 4,
      title: 'Week 4: Portfolio Verification & Targeted Applications',
      theme: 'Portfolio + Applications',
      focusSummary: 'Publish live demo, document architectural decisions, verify portfolio evidence, and submit top opportunity matches.',
      tasks: [
        {
          taskId: 'task-w4-1',
          title: 'Publish Architecture Diagram & Live Demo in Portfolio',
          description: 'Add system architecture diagram, live deployment URL, and GitHub README to your SkillSetu Portfolio.',
          skill: 'Portfolio Evidence',
          estimatedHours: 4,
          type: 'Portfolio',
          priority: 'critical',
          completed: false,
          linkedResource: {
            label: 'Update Portfolio',
            actionType: 'VIEW_PORTFOLIO',
            target: '/dashboard/student/portfolio'
          }
        },
        {
          taskId: 'task-w4-2',
          title: 'Apply to High-Match Opportunity: Full-Stack Engineer Intern',
          description: 'Submit verified application to InfoTech Solutions with your updated portfolio and 88% match score.',
          skill: 'Application Submission',
          estimatedHours: 2,
          type: 'Application',
          priority: 'high',
          completed: false,
          linkedResource: {
            label: 'View Opportunity',
            actionType: 'VIEW_OPPORTUNITIES',
            target: '/dashboard/student/opportunities'
          }
        },
        {
          taskId: 'task-w4-3',
          title: 'Complete Mock Technical Interview for Full-Stack Systems',
          description: 'Review system design concepts: database sharding, caching strategies, and REST API contract design.',
          skill: 'System Design & Interview Prep',
          estimatedHours: 4,
          type: 'Interview Preparation',
          priority: 'high',
          completed: false
        }
      ]
    }
  ],
  recommendedSkills: [
    {
      skillName: 'Kubernetes Orchestration',
      currentLevel: 58,
      targetLevel: 82,
      gap: 24,
      category: 'technical',
      estimatedWeeksToClose: 4,
      primaryAction: 'Complete container deployment modules and hands-on cluster projects.'
    },
    {
      skillName: 'Distributed Caching & Redis',
      currentLevel: 62,
      targetLevel: 82,
      gap: 20,
      category: 'technical',
      estimatedWeeksToClose: 3,
      primaryAction: 'Implement in-memory caching and session clustering in backend services.'
    },
    {
      skillName: 'Cloud Architecture (AWS / GCP)',
      currentLevel: 68,
      targetLevel: 85,
      gap: 17,
      category: 'technical',
      estimatedWeeksToClose: 4,
      primaryAction: 'Enroll in Cloud Infrastructure Bootcamp intervention.'
    }
  ],
  recommendedInterventions: [
    {
      interventionId: 'int-001',
      title: 'Cloud Infrastructure & DevOps Accelerator',
      skillName: 'Cloud Architecture (AWS / GCP)',
      type: 'Hands-on Bootcamp',
      provider: 'Cloud Native Computing Foundation & Apex Institute',
      duration: '4 Weeks (8 Modules)',
      enrolled: true
    },
    {
      interventionId: 'int-002',
      title: 'Advanced Microservices & Distributed Caching Masterclass',
      skillName: 'Distributed Caching & Redis',
      type: 'Industry Masterclass',
      provider: 'Enterprise Cloud Alliance',
      duration: '2 Weeks (4 Labs)',
      enrolled: false
    }
  ],
  recommendedProjects: [
    {
      title: 'Resilient Microservices E-Commerce Platform',
      skill: 'Kubernetes & Redis',
      description: 'Build a containerized shop with catalog, cart, and payment services, utilizing Redis for real-time inventory caching and session state.',
      expectedOutcome: 'Live deployed cluster with zero-downtime rolling updates and benchmarked latency reduction.',
      difficulty: 'Advanced',
      portfolioRelevance: 'Directly proves capability for 88% of Tier-1 Full-Stack job requirements.'
    },
    {
      title: 'High-Throughput Rate-Limiting Proxy',
      skill: 'Distributed Caching & Redis',
      description: 'Develop an API gateway middleware utilizing sliding-window Redis counters to prevent DDoS and enforce tier quotas.',
      expectedOutcome: 'Published open-source npm/Go package with 95%+ unit test coverage.',
      difficulty: 'Intermediate',
      portfolioRelevance: 'Demonstrates distributed systems and backend hardening competencies.'
    }
  ],
  recommendedOpportunities: [
    {
      opportunityId: 'opp-001',
      title: 'Full-Stack Developer Intern',
      company: 'InfoTech Global Labs',
      matchScore: 88,
      requiredSkills: ['React', 'Node.js', 'SQL', 'Redis', 'Docker'],
      readinessStatus: 'READY',
      rationale: 'Your Skill DNA strongly satisfies 4 out of 5 required skills (88% match). Your strong React and Node foundations make you an immediate interview candidate.',
      missingKeySkills: ['Redis (Partial)']
    },
    {
      opportunityId: 'opp-002',
      title: 'Cloud Platform Engineer Intern',
      company: 'DataFlow Cloud Systems',
      matchScore: 76,
      requiredSkills: ['Kubernetes', 'AWS/GCP', 'Python', 'CI/CD', 'Linux'],
      readinessStatus: 'REASONABLE_TO_APPLY',
      rationale: 'Solid match (76%) based on Python and Linux strengths. Complete the Week 1-2 Kubernetes milestones to maximize interview conversion.',
      missingKeySkills: ['Kubernetes Orchestration', 'AWS/GCP']
    },
    {
      opportunityId: 'opp-003',
      title: 'Distributed Systems Software Engineer',
      company: 'Nexus Distributed Networks',
      matchScore: 64,
      requiredSkills: ['Go/Rust', 'Distributed Caching', 'Kubernetes', 'gRPC'],
      readinessStatus: 'IMPROVE_FIRST',
      rationale: 'Match is currently 64%. Focus on completing the microservices project and Redis certification before applying to this senior internship.',
      missingKeySkills: ['gRPC', 'Distributed Caching']
    }
  ],
  portfolioActions: [
    {
      skill: 'Kubernetes Orchestration',
      existingEvidenceCount: 0,
      missingEvidence: '0 verified projects with Kubernetes deployment manifests.',
      recommendation: 'Add one production-style repository with Helm charts, Ingress YAML, and documented health probes.',
      suggestedProjectTitle: 'Resilient Microservices E-Commerce Platform'
    },
    {
      skill: 'Distributed Caching & Redis',
      existingEvidenceCount: 1,
      missingEvidence: '1 basic Redis key-value project, lacking clustered invalidation evidence.',
      recommendation: 'Add a benchmark report demonstrating cache hit rates and throughput improvements under load.',
      suggestedProjectTitle: 'High-Throughput Rate-Limiting Proxy'
    }
  ],
  milestones: [
    {
      milestoneId: 'ms-1',
      title: 'Close Kubernetes Gap to ≥ 70%',
      targetWeek: 2,
      completed: false,
      impact: '+7% increase in Overall Career Readiness'
    },
    {
      milestoneId: 'ms-2',
      title: 'Complete Cloud Infrastructure Bootcamp Cohort',
      targetWeek: 3,
      completed: false,
      impact: 'Verified Institutional Credential added to Profile'
    },
    {
      milestoneId: 'ms-3',
      title: 'Publish Microservices Architecture Project',
      targetWeek: 4,
      completed: false,
      impact: 'Unlocks 90%+ Match Score on Full-Stack Tier-1 Roles'
    }
  ],
  nextBestAction: {
    title: 'Enroll in Cloud Infrastructure & DevOps Accelerator',
    reason: 'Your largest skill gap is Kubernetes (-24% deficit), and an approved institutional intervention cohort is active right now with available seats.',
    category: 'intervention',
    actionLabel: 'Enroll in Intervention',
    actionType: 'VIEW_INTERVENTIONS',
    targetRoute: '/dashboard/student/interventions',
    urgency: 'Immediate',
    badge: 'Recommended Intervention'
  },
  aiExplanation: 'Your deterministic Career Action Plan is calibrated to elevate your readiness from 78% to 92%+ within 30 to 60 days. By attacking your largest infrastructure deficits through the active institutional bootcamp and deploying a verifiable microservices project, you position yourself as a top-tier candidate for InfoTech and DataFlow opportunities.'
};
