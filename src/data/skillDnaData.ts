import { SkillDnaItem, SkillDnaOverallMetrics, EvidenceArtifact } from '../types/skillDna';
import { AssessmentFormState, AssessmentResult } from '../types/assessment';

export const BASELINE_SKILL_DNA_ITEMS: SkillDnaItem[] = [
  // ===================== TECHNICAL SKILLS (7 Required) =====================
  {
    id: 'tech-programming',
    name: 'Programming',
    category: 'technical',
    subcategory: 'Languages & Core Paradigms',
    iconName: 'Code2',
    currentScore: 94,
    verificationScore: 96,
    evidenceCount: 5,
    industryBenchmark: 78,
    percentile: 98,
    level: 'Master',
    growthChange: 12,
    description: 'Advanced polyglot development across TypeScript, Python, Go, and modern JavaScript with strict type-safety and memory profiling.',
    keyCompetencies: [
      'Type-Level TypeScript & Generics',
      'Python Concurrent Asyncio & Typing',
      'Go Goroutines & Channel Patterns',
      'Clean Architecture & Functional Idioms'
    ],
    evidenceList: [
      {
        id: 'ev-prog-1',
        title: 'Nexus Realtime Engine (5,400+ LOC TypeScript)',
        type: 'project',
        date: 'Aug 18, 2026',
        verifiedBy: 'NovaCore Architecture Board',
        verificationBadge: 'Verified Project',
        proofUrl: 'https://github.com/aaravsharma/nexus-realtime-engine',
        description: 'Multi-tenant CRDT collaborative workspace with zero-latency operational transforms and strict type contracts.',
        scoreOrMetric: '98% Pass Rate (450 Unit Tests)'
      },
      {
        id: 'ev-prog-2',
        title: 'Proctored Language & Typing Assessment',
        type: 'code_benchmark',
        date: 'Aug 14, 2026',
        verifiedBy: 'SkillSetu AI Engine',
        verificationBadge: 'Proctored Distinction',
        description: 'Evaluated on advanced generic recursion, distributed worker pools, and memory footprint constraints.',
        scoreOrMetric: '100% Correct / 96.8 ms P99'
      },
      {
        id: 'ev-prog-3',
        title: 'Aura UI Design System (42 Components)',
        type: 'project',
        date: 'Jul 28, 2026',
        verifiedBy: 'SkillSetu Open Source Guild',
        verificationBadge: 'Gold Verified',
        proofUrl: 'https://github.com/aaravsharma/aura-ui-system',
        description: 'WCAG AAA compliant component library published to NPM with zero runtime overhead.',
        scoreOrMetric: '420 GitHub Stars'
      },
      {
        id: 'ev-prog-4',
        title: 'Enterprise React & Modern TypeScript Master',
        type: 'certification',
        date: 'Jun 2026',
        verifiedBy: 'SkillSetu AI Global Accreditation',
        verificationBadge: 'Platinum Credential',
        proofUrl: 'https://verify.skillsetu.ai/cert/SS-REACT-1049',
        description: 'Comprehensive 4-part proctored verification covering server actions, compiler optimizations, and generic constraints.',
        scoreOrMetric: 'Grade: 98.2% (Top 1%)'
      },
      {
        id: 'ev-prog-5',
        title: 'CloudMesh Ingress Proxy (Rust & Go)',
        type: 'project',
        date: 'Jun 2026',
        verifiedBy: 'Faculty Review Board',
        verificationBadge: 'Faculty Signed',
        proofUrl: 'https://github.com/aaravsharma/cloudmesh-ingress-proxy',
        description: 'Sub-millisecond token bucket rate limiter and reverse proxy with distributed tracing.',
        scoreOrMetric: '120k RPS Throughput'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'tech-dsa',
    name: 'DSA',
    category: 'technical',
    subcategory: 'Data Structures & Algorithms',
    iconName: 'Boxes',
    currentScore: 88,
    verificationScore: 91,
    evidenceCount: 4,
    industryBenchmark: 74,
    percentile: 94,
    level: 'Expert',
    growthChange: 9,
    description: 'Rigorous algorithmic complexity analysis, graph traversals, dynamic programming, and space-time optimization.',
    keyCompetencies: [
      'Graph Theory (Dijkstra, Tarjan, Topological Sort)',
      'Dynamic Programming & Memoization',
      'Advanced Tree Structures (Segment Trees, Tries)',
      'Asymptotic Complexity Optimization (O(N log N) Bounds)'
    ],
    evidenceList: [
      {
        id: 'ev-dsa-1',
        title: 'Proctored Algorithmic Tier-1 Benchmark',
        type: 'code_benchmark',
        date: 'Aug 16, 2026',
        verifiedBy: 'SkillSetu Proctored Sandbox',
        verificationBadge: 'Proctored Tier-1',
        description: 'Cleared 4 competitive problem sets spanning dynamic programming on trees and distributed lock graphs.',
        scoreOrMetric: '4/4 Test Cases Passed in 48 Mins'
      },
      {
        id: 'ev-dsa-2',
        title: 'CRDT Graph Sync Algorithm Implementation',
        type: 'project',
        date: 'Aug 04, 2026',
        verifiedBy: 'NovaCore Technologies Mentors',
        verificationBadge: 'Industry Verified',
        description: 'Designed custom State-based CRDT resolution vector clock for real-time document tree mutations.',
        scoreOrMetric: 'Zero Conflict Drift @ 10k Ops/sec'
      },
      {
        id: 'ev-dsa-3',
        title: 'Competitive Algorithm Practice Ledger (350+ Problems)',
        type: 'assessment',
        date: 'Jul 2026',
        verifiedBy: 'SkillSetu Continuous Evaluator',
        verificationBadge: 'Verified Track',
        description: 'Verified solve record across LeetCode Hard and Codeforces Division 2 challenges.',
        scoreOrMetric: 'Top 4.2% Rating Equivalent'
      },
      {
        id: 'ev-dsa-4',
        title: 'Token Bucket & Sliding Window Log Implementation',
        type: 'project',
        date: 'Jun 2026',
        verifiedBy: 'Apex Institute Technical Faculty',
        verificationBadge: 'Faculty Verified',
        description: 'Implemented atomic memory sliding window counters in Go for sub-millisecond rate limiter.',
        scoreOrMetric: 'O(1) Memory Overhead per IP'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'tech-database',
    name: 'Database',
    category: 'technical',
    subcategory: 'Relational, NoSQL & Distributed Storage',
    iconName: 'Database',
    currentScore: 89,
    verificationScore: 92,
    evidenceCount: 4,
    industryBenchmark: 75,
    percentile: 95,
    level: 'Expert',
    growthChange: 11,
    description: 'PostgreSQL, Drizzle ORM, Redis caching strategies, transaction isolation levels, connection pooling, and pgvector.',
    keyCompetencies: [
      'PostgreSQL Index Tuning & EXPLAIN ANALYZE',
      'Write-Through & Cache-Aside Redis Patterns',
      'Drizzle ORM & Schema Migrations',
      'ACID Guarantees & Concurrency Locks'
    ],
    evidenceList: [
      {
        id: 'ev-db-1',
        title: 'PostgreSQL & pgvector Hybrid Search Pipeline',
        type: 'project',
        date: 'Jul 2026',
        verifiedBy: 'DataBridge AI Labs',
        verificationBadge: 'Verified Pro',
        description: 'Engineered multi-tenant database partitioning with HNSW vector indexes for 100k embedding vectors.',
        scoreOrMetric: 'P95 Query Latency < 12ms'
      },
      {
        id: 'ev-db-2',
        title: 'Distributed Redis Stream Cache Replication',
        type: 'code_benchmark',
        date: 'Aug 02, 2026',
        verifiedBy: 'NovaCore Architecture Board',
        verificationBadge: 'Industry Verified',
        description: 'Implemented atomic cache warming and circuit-breaking read replicas under synthetic 50k RPS load.',
        scoreOrMetric: '99.98% Cache Hit Ratio'
      },
      {
        id: 'ev-db-3',
        title: 'Full Stack Cloud Native Specialization (Database Track)',
        type: 'certification',
        date: 'Jul 2026',
        verifiedBy: 'Apex Institute & AWS',
        verificationBadge: 'Gold Credential',
        proofUrl: 'https://verify.skillsetu.ai/cert/AIT-AWS-4412',
        description: 'Practical evaluation covering PostgreSQL replication, read replicas, and Aurora failover configuration.',
        scoreOrMetric: 'Grade: 94.0%'
      },
      {
        id: 'ev-db-4',
        title: 'Database Schema Optimization Audit',
        type: 'peer_review',
        date: 'Jun 2026',
        verifiedBy: 'Dr. Rajesh Nair',
        verificationBadge: 'Faculty Endorsed',
        description: 'Refactored 14 unindexed JOIN queries in campus portal to composite B-Trees.',
        scoreOrMetric: '92% I/O Reduction'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'tech-web-development',
    name: 'Web Development',
    category: 'technical',
    subcategory: 'Full-Stack & Frontend Architecture',
    iconName: 'Globe',
    currentScore: 95,
    verificationScore: 98,
    evidenceCount: 6,
    industryBenchmark: 79,
    percentile: 99,
    level: 'Master',
    growthChange: 15,
    description: 'React 19 Server Components, Next.js, Node.js API gateways, Tailwind CSS, WebSockets, and sub-16ms responsive UI performance.',
    keyCompetencies: [
      'React 19 Concurrent Features & useActionState',
      'Responsive Fluid Design & Tailwind CSS',
      'WebSocket Real-Time Bidirectional Streams',
      'REST & GraphQL High-Throughput Gateways'
    ],
    evidenceList: [
      {
        id: 'ev-web-1',
        title: 'Nexus Realtime Collaborative Canvas',
        type: 'project',
        date: 'Aug 2026',
        verifiedBy: 'NovaCore Technologies Sponsor',
        verificationBadge: 'Industry Verified',
        proofUrl: 'https://nexus-realtime-demo.io',
        description: '60 FPS canvas with sub-10ms UI sync, offline optimistic updates, and multi-cursor presence.',
        scoreOrMetric: 'Top Score (98/100)'
      },
      {
        id: 'ev-web-2',
        title: 'Aura Accessible Design System (WCAG AAA)',
        type: 'project',
        date: 'May 2026',
        verifiedBy: 'SkillSetu AI Design Review',
        verificationBadge: 'Master Verified',
        proofUrl: 'https://aura-ui-docs.io',
        description: 'Zero-runtime CSS token architecture with 42 accessible atomic components.',
        scoreOrMetric: '100 Lighthouse Performance'
      },
      {
        id: 'ev-web-3',
        title: 'Enterprise React & Modern TypeScript Master Certification',
        type: 'certification',
        date: 'Jun 2026',
        verifiedBy: 'SkillSetu Global Board',
        verificationBadge: 'Platinum Badge',
        proofUrl: 'https://verify.skillsetu.ai/cert/SS-REACT-1049',
        description: 'Official verified qualification covering Server Actions, Suspense streaming, and micro-frontend federation.',
        scoreOrMetric: 'Top 1% Global Percentile'
      },
      {
        id: 'ev-web-4',
        title: 'Node.js Microservices Gateway Benchmark',
        type: 'code_benchmark',
        date: 'Aug 10, 2026',
        verifiedBy: 'CloudScale Labs',
        verificationBadge: 'Verified Pro',
        description: 'Tested asynchronous non-blocking event loop under heavy load and memory leak stress testing.',
        scoreOrMetric: 'Zero Memory Leaks @ 10M Reqs'
      },
      {
        id: 'ev-web-5',
        title: 'Web Performance Optimization Sprint',
        type: 'peer_review',
        date: 'Jul 2026',
        verifiedBy: 'HyperScale AI Labs Mentors',
        verificationBadge: 'Peer Endorsed',
        description: 'Reduced LCP from 2.8s to 0.6s on high-density data dashboards using virtualized DOM and web workers.',
        scoreOrMetric: '78% Faster Initial Paint'
      },
      {
        id: 'ev-web-6',
        title: 'API Gateway & GraphQL Federation Capstone',
        type: 'project',
        date: 'Apr 2026',
        verifiedBy: 'Apex Institute Technical Committee',
        verificationBadge: 'Faculty Signed',
        description: 'Built federated GraphQL schema resolving across 4 microservices with batching dataloaders.',
        scoreOrMetric: 'N+1 Query Elimination (100%)'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'tech-cloud',
    name: 'Cloud',
    category: 'technical',
    subcategory: 'DevOps, Containers & Infrastructure',
    iconName: 'Cloud',
    currentScore: 82,
    verificationScore: 86,
    evidenceCount: 3,
    industryBenchmark: 70,
    percentile: 88,
    level: 'Advanced',
    growthChange: 14,
    description: 'Docker multi-stage builds, Kubernetes pod orchestration, CI/CD pipeline automation with GitHub Actions, and AWS ECS/S3 deployments.',
    keyCompetencies: [
      'Docker Containerization & Image Optimization',
      'Kubernetes Deployments, Ingress & Services',
      'GitHub Actions CI/CD with Zero-Downtime Blue/Green',
      'AWS Cloud Infrastructure & IAM Governance'
    ],
    evidenceList: [
      {
        id: 'ev-cld-1',
        title: 'Full Stack Cloud Native Specialization',
        type: 'certification',
        date: 'Jul 2026',
        verifiedBy: 'Apex Institute of Technology & AWS',
        verificationBadge: 'Gold Credential',
        proofUrl: 'https://verify.skillsetu.ai/cert/AIT-AWS-4412',
        description: 'End-to-end cloud architect certification covering Terraform IaC, EKS clusters, and VPC security groups.',
        scoreOrMetric: 'Grade: 94.0%'
      },
      {
        id: 'ev-cld-2',
        title: 'Automated CI/CD Deployment Pipeline for Nexus',
        type: 'project',
        date: 'Aug 2026',
        verifiedBy: 'NovaCore DevOps Engineers',
        verificationBadge: 'Industry Verified',
        description: 'Constructed multi-stage GitHub Actions with automated linting, test parallelization, and container registry publishing.',
        scoreOrMetric: 'Average Pipeline Run: 2m 14s'
      },
      {
        id: 'ev-cld-3',
        title: 'Kubernetes Cluster Provisioning Lab',
        type: 'assessment',
        date: 'Aug 04, 2026',
        verifiedBy: 'SkillSetu AI Lab Proctor',
        verificationBadge: 'Verified Associate',
        description: 'Configured Horizontal Pod Autoscalers (HPA), custom metrics server, and rolling update health probes.',
        scoreOrMetric: '100% High Availability Test'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'tech-aiml',
    name: 'AI/ML',
    category: 'technical',
    subcategory: 'Generative AI, Embeddings & RAG',
    iconName: 'Brain',
    currentScore: 84,
    verificationScore: 87,
    evidenceCount: 4,
    industryBenchmark: 68,
    percentile: 91,
    level: 'Advanced',
    growthChange: 20,
    description: 'Vector embeddings, semantic search, hybrid RAG pipelines, LLM prompt engineering, Gemini SDK integration, and document chunking.',
    keyCompetencies: [
      'Retrieval-Augmented Generation (RAG) Architecture',
      'Vector Databases (pgvector, Chroma, Qdrant)',
      'Prompt Engineering & Structured JSON Output Guardrails',
      'Context Window Optimization & Embeddings Reranking'
    ],
    evidenceList: [
      {
        id: 'ev-ai-1',
        title: 'VektorFlow: Hybrid Vector RAG Pipeline',
        type: 'project',
        date: 'Jul 2026',
        verifiedBy: 'DataBridge AI Research Lab',
        verificationBadge: 'Industry Verified',
        proofUrl: 'https://github.com/aaravsharma/vektorflow-hybrid-rag',
        description: 'End-to-end RAG system indexing 10,000+ technical PDF documents with sub-second semantic retrieval.',
        scoreOrMetric: '94.2% Retrieval Precision'
      },
      {
        id: 'ev-ai-2',
        title: 'Generative AI & Vector Embeddings Credential',
        type: 'certification',
        date: 'May 2026',
        verifiedBy: 'DataBridge AI Research Lab',
        verificationBadge: 'Gold Credential',
        proofUrl: 'https://verify.skillsetu.ai/cert/DB-GENAI-8834',
        description: 'Hands-on validation of vector quantization, Cosine similarity search, and multi-agent workflows.',
        scoreOrMetric: 'Score: 91.8%'
      },
      {
        id: 'ev-ai-3',
        title: 'AI Solutions & RAG Micro-Internship Benchmark',
        type: 'code_benchmark',
        date: 'Aug 12, 2026',
        verifiedBy: 'Marcus Chen, AI Lead',
        verificationBadge: 'Verified Pro',
        description: 'Demonstrated semantic reranking and token efficiency reducing API overhead by 40%.',
        scoreOrMetric: 'Benchmarked @ 180ms Latency'
      },
      {
        id: 'ev-ai-4',
        title: 'LLM Function Calling & Agentic Evaluation',
        type: 'assessment',
        date: 'Aug 16, 2026',
        verifiedBy: 'SkillSetu AI Engine',
        verificationBadge: 'AI Verified',
        description: 'Assessed on structured schema validation, fallback recovery, and multi-turn prompt grounding.',
        scoreOrMetric: '96% Execution Accuracy'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'tech-cybersecurity',
    name: 'Cybersecurity',
    category: 'technical',
    subcategory: 'Application Security & Identity',
    iconName: 'ShieldCheck',
    currentScore: 79,
    verificationScore: 83,
    evidenceCount: 3,
    industryBenchmark: 70,
    percentile: 84,
    level: 'Advanced',
    growthChange: 10,
    description: 'OAuth 2.0 / OIDC protocols, JWT token rotation, CORS & CSP policies, OWASP Top 10 mitigation, and encrypted data in transit.',
    keyCompetencies: [
      'JWT Authentication & Secure HttpOnly Refresh Tokens',
      'OWASP Top 10 Web Vulnerability Prevention',
      'Role-Based Access Control (RBAC) & Tenant Isolation',
      'Cryptographic Hashing (Argon2, bcrypt, SHA-256)'
    ],
    evidenceList: [
      {
        id: 'ev-sec-1',
        title: 'Multi-Tenant Auth & Role Isolation Engine',
        type: 'project',
        date: 'Jul 2026',
        verifiedBy: 'Apex FinTech Solutions Review',
        verificationBadge: 'Industry Verified',
        description: 'Implemented zero-trust token verification with replay attack detection and rate limiting.',
        scoreOrMetric: 'Zero Vulnerabilities Detected'
      },
      {
        id: 'ev-sec-2',
        title: 'OWASP Security Audit & Vulnerability Assessment',
        type: 'assessment',
        date: 'Aug 08, 2026',
        verifiedBy: 'SkillSetu Security Sentinel',
        verificationBadge: 'Verified Audit',
        description: 'Simulated penetration testing against SQL injection, XSS vector payloads, and CSRF token tampering.',
        scoreOrMetric: '100% Mitigation Score'
      },
      {
        id: 'ev-sec-3',
        title: 'Backend Security & High-Frequency API Fitment',
        type: 'peer_review',
        date: 'Aug 2026',
        verifiedBy: 'Ananya Deshmukh, Lead Architect',
        verificationBadge: 'Enterprise Verified',
        description: 'Validated secure key lifecycle management and HMAC request signing across microservice hops.',
        scoreOrMetric: 'Enterprise Grade Clearance'
      }
    ],
    verificationStatus: 'verified'
  },

  // ===================== PROFESSIONAL SKILLS (4 Required) =====================
  {
    id: 'prof-communication',
    name: 'Communication',
    category: 'professional',
    subcategory: 'Technical Writing & Cross-Functional Dialogue',
    iconName: 'MessageSquare',
    currentScore: 90,
    verificationScore: 93,
    evidenceCount: 4,
    industryBenchmark: 76,
    percentile: 96,
    level: 'Expert',
    growthChange: 8,
    description: 'Clear architectural documentation, RFC writing, constructive pull request feedback, and articulate stakeholder presentations.',
    keyCompetencies: [
      'Technical RFC & Architecture Design Docs',
      'Asynchronous Pull Request Communication',
      'Cross-Functional Collaboration with Design & Product',
      'Structured Presentation of Complex Engineering Concepts'
    ],
    evidenceList: [
      {
        id: 'ev-comm-1',
        title: 'Nexus Realtime Architecture RFC (18 Pages)',
        type: 'peer_review',
        date: 'Aug 2026',
        verifiedBy: 'NovaCore Architecture Board',
        verificationBadge: 'Peer Endorsed',
        description: 'Authored comprehensive system specification detailing failover protocols and CRDT state transitions.',
        scoreOrMetric: 'Approved with Unanimous Commendation'
      },
      {
        id: 'ev-comm-2',
        title: 'Aura UI Interactive Documentation & Guides',
        type: 'project',
        date: 'May 2026',
        verifiedBy: 'Open Source Community Reviewers',
        verificationBadge: 'Community Verified',
        description: 'Wrote zero-jargon setup guides and accessibility manuals read by 2,000+ developers.',
        scoreOrMetric: '4.9/5 Clarity Rating'
      },
      {
        id: 'ev-comm-3',
        title: 'Adaptive Assessment: Technical Communication & RFCs',
        type: 'assessment',
        date: 'Aug 14, 2026',
        verifiedBy: 'SkillSetu Soft Skills Matrix',
        verificationBadge: 'AI Verified',
        description: 'Evaluated scenario-based responses for explaining microservice latency bottlenecks to non-technical leads.',
        scoreOrMetric: '94% Empathy & Precision Score'
      },
      {
        id: 'ev-comm-4',
        title: 'Campus Hackathon Technical Pitch (1st Place)',
        type: 'peer_review',
        date: 'Feb 2026',
        verifiedBy: 'Apex University Jury',
        verificationBadge: 'Distinction Award',
        description: 'Delivered 5-minute technical demo explaining distributed vector search to enterprise judges.',
        scoreOrMetric: '1st Place / 60 Teams'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'prof-teamwork',
    name: 'Teamwork',
    category: 'professional',
    subcategory: 'Agile Collaboration & Code Review Culture',
    iconName: 'Users',
    currentScore: 92,
    verificationScore: 95,
    evidenceCount: 5,
    industryBenchmark: 78,
    percentile: 97,
    level: 'Master',
    growthChange: 7,
    description: 'High collaborative empathy, active sprint participation, constructive and empathetic code reviews, and pair programming.',
    keyCompetencies: [
      'Empathetic & Actionable Code Reviews',
      'Agile Sprint Ceremonies & Retrospective Contributions',
      'Pair Programming & Collaborative Problem Solving',
      'Knowledge Sharing & Internal Tech Talks'
    ],
    evidenceList: [
      {
        id: 'ev-team-1',
        title: 'Team Capstone Cohort 2026 (5 Engineers)',
        type: 'peer_review',
        date: 'Aug 12, 2026',
        verifiedBy: 'Dr. Rajesh Nair & Apex Faculty',
        verificationBadge: 'Verified Leader',
        description: 'Led weekly sprint syncs, coordinated CI pipelines, and mentored 2 junior developers through Git workflows.',
        scoreOrMetric: '42 Peer Endorsements (100% Positive)'
      },
      {
        id: 'ev-team-2',
        title: 'Open Source Contribution Review Record (140+ PRs)',
        type: 'project',
        date: 'Jul 2026',
        verifiedBy: 'VectorSphere Maintainers',
        verificationBadge: 'OSS Verified',
        description: 'Reviewed and merged pull requests with actionable line-by-line suggestions and automated test harnesses.',
        scoreOrMetric: 'Top Contributor Badge'
      },
      {
        id: 'ev-team-3',
        title: 'Cross-Functional Product Design Sprint',
        type: 'peer_review',
        date: 'Jun 2026',
        verifiedBy: 'HyperScale AI Product Team',
        verificationBadge: 'Mentor Signed',
        description: 'Partnered with UI designers to co-create token variables bridging Figma and Tailwind.',
        scoreOrMetric: '100% On-Time Delivery'
      },
      {
        id: 'ev-team-4',
        title: 'Agile Collaboration & Conflict Resolution Benchmark',
        type: 'assessment',
        date: 'Aug 18, 2026',
        verifiedBy: 'SkillSetu Team Evaluator',
        verificationBadge: 'AI Verified',
        description: 'Scenario evaluation for navigating merge conflicts, shifting sprint priorities, and asynchronous consensus.',
        scoreOrMetric: '95% Alignment Index'
      },
      {
        id: 'ev-team-5',
        title: 'Internal Tech Talk: Understanding CRDTs in Practice',
        type: 'peer_review',
        date: 'Apr 2026',
        verifiedBy: 'Developer Student Club',
        verificationBadge: 'Community Endorsed',
        description: 'Organized and hosted 45-minute interactive coding session for 85 student engineers.',
        scoreOrMetric: '98% Attendee Approval'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'prof-leadership',
    name: 'Leadership',
    category: 'professional',
    subcategory: 'Technical Ownership & Mentorship',
    iconName: 'Award',
    currentScore: 85,
    verificationScore: 89,
    evidenceCount: 3,
    industryBenchmark: 72,
    percentile: 91,
    level: 'Advanced',
    growthChange: 11,
    description: 'Autonomous technical ownership, driving architectural standards, mentoring peers, and prioritizing technical debt.',
    keyCompetencies: [
      'Architectural Decision-Making (ADRs)',
      'Mentoring Peers on Code Quality & Testing',
      'Project Scope Estimation & Risk Mitigation',
      'Championing Engineering Excellence & DX'
    ],
    evidenceList: [
      {
        id: 'ev-lead-1',
        title: 'Lead Architect: Apex University Placement Portal',
        type: 'project',
        date: 'Jul 2026',
        verifiedBy: 'University Administration',
        verificationBadge: 'Leadership Verified',
        description: 'Directed 4 student developers to build modern recruiter dashboard used by 1,200+ candidates.',
        scoreOrMetric: 'Delivered 2 Weeks Ahead of Schedule'
      },
      {
        id: 'ev-lead-2',
        title: 'Mentorship Track: 6 Cohort Mentees',
        type: 'peer_review',
        date: 'Aug 2026',
        verifiedBy: 'SkillSetu Mentorship Guild',
        verificationBadge: 'Verified Mentor',
        description: 'Provided weekly 1-on-1 resume reviews, mock algorithm interviews, and Git pairing.',
        scoreOrMetric: '100% Mentee Placement Rate'
      },
      {
        id: 'ev-lead-3',
        title: 'Strategic Engineering Leadership Evaluation',
        type: 'assessment',
        date: 'Aug 14, 2026',
        verifiedBy: 'SkillSetu Leadership Index',
        verificationBadge: 'AI Verified',
        description: 'Assessed on long-term maintainability prioritization, trade-off management, and team morale support.',
        scoreOrMetric: 'Score: 89/100'
      }
    ],
    verificationStatus: 'verified'
  },
  {
    id: 'prof-problem-solving',
    name: 'Problem Solving',
    category: 'professional',
    subcategory: 'First-Principles Thinking & Debugging',
    iconName: 'Zap',
    currentScore: 94,
    verificationScore: 97,
    evidenceCount: 6,
    industryBenchmark: 80,
    percentile: 99,
    level: 'Master',
    growthChange: 14,
    description: 'Rapid root-cause isolation, debugging complex distributed failures, performance bottleneck profiling, and analytical rigor.',
    keyCompetencies: [
      'First-Principles Problem Decomposition',
      'Distributed Tracing & Memory Heap Profiling',
      'Systematic Hypothesis-Driven Debugging',
      'Resilient Fallback Design & Fault Tolerance'
    ],
    evidenceList: [
      {
        id: 'ev-prob-1',
        title: 'Sub-Millisecond Memory Profiling & Leak Isolation',
        type: 'code_benchmark',
        date: 'Aug 04, 2026',
        verifiedBy: 'NovaCore Architecture Board',
        verificationBadge: 'Industry Verified',
        description: 'Diagnosed high-frequency event loop block in WebSocket gateway using Chrome DevTools memory heap snapshots.',
        scoreOrMetric: 'Resolved 34% Latency Spike'
      },
      {
        id: 'ev-prob-2',
        title: 'Certified Distributed Systems Architect (CDSA)',
        type: 'certification',
        date: 'Aug 2026',
        verifiedBy: 'NovaCore Enterprise Academy',
        verificationBadge: 'Platinum Distinction',
        proofUrl: 'https://verify.skillsetu.ai/cert/NC-CDSA-98214',
        description: 'Comprehensive evaluation on raft consensus edge cases, network partitioning recovery, and write-ahead log replay.',
        scoreOrMetric: '96.5% Distinction'
      },
      {
        id: 'ev-prob-3',
        title: 'Proctored Adaptive Problem Decomposition Test',
        type: 'assessment',
        date: 'Aug 16, 2026',
        verifiedBy: 'SkillSetu AI Engine',
        verificationBadge: 'Proctored Top 1%',
        description: 'Unpacked complex distributed banking reconciliation problem into 4 asynchronous idempotent pipelines.',
        scoreOrMetric: '100% Accuracy in 32 Mins'
      },
      {
        id: 'ev-prob-4',
        title: 'Rust VectorSphere Memory Profiling PR #142',
        type: 'project',
        date: 'Jul 2026',
        verifiedBy: 'Stefan Meyer, Maintainer',
        verificationBadge: 'OSS Verified',
        description: 'Optimized vector byte buffer deserialization reducing CPU cycle consumption by 34%.',
        scoreOrMetric: 'Merged to Main Branch'
      },
      {
        id: 'ev-prob-5',
        title: 'High-Stress System Recovery Simulation',
        type: 'code_benchmark',
        date: 'Jun 2026',
        verifiedBy: 'CloudScale Reliability Team',
        verificationBadge: 'Reliability Star',
        description: 'Simulated 50% node crash during active transaction commit; restored full consistency with zero data loss.',
        scoreOrMetric: 'RTO < 4.2s / RPO = 0'
      },
      {
        id: 'ev-prob-6',
        title: 'Live Coding & First-Principles Architecture Challenge',
        type: 'assessment',
        date: 'May 2026',
        verifiedBy: 'Apex FinTech Technical Board',
        verificationBadge: 'Distinction Clearance',
        description: 'Designed in-memory thread-safe LRU cache with eviction notifications and constant time lookup.',
        scoreOrMetric: 'Score: 98/100'
      }
    ],
    verificationStatus: 'verified'
  }
];

export const BASELINE_SKILL_DNA_METRICS: SkillDnaOverallMetrics = {
  overallVerifiedScore: 91,
  overallCurrentScore: 89,
  verificationConfidence: 96,
  totalEvidenceCount: 47,
  technicalAverage: 90,
  professionalAverage: 93,
  topPercentile: 97,
  tier: 'Tier-1 Industry Ready',
  lastUpdated: 'Aug 21, 2026 • AI Verified Sync'
};

/**
 * Dynamically merge baseline data with any completed assessment results from localStorage or state
 */
export function getComputedSkillDnaData(
  savedAssessmentResult?: AssessmentResult | null,
  savedDraft?: AssessmentFormState | null
): { items: SkillDnaItem[]; metrics: SkillDnaOverallMetrics } {
  // Try reading from localStorage if not passed
  let assessmentResult = savedAssessmentResult;
  let assessmentDraft = savedDraft;

  if (!assessmentResult) {
    try {
      const stored = localStorage.getItem('skillsetu_assessment_result_v1');
      if (stored) {
        assessmentResult = JSON.parse(stored);
      }
    } catch (e) {
      // Ignore
    }
  }

  if (!assessmentDraft) {
    try {
      const storedDraft = localStorage.getItem('skillsetu_assessment_draft_v1');
      if (storedDraft) {
        assessmentDraft = JSON.parse(storedDraft);
      }
    } catch (e) {
      // Ignore
    }
  }

  // Clone baseline
  const items = BASELINE_SKILL_DNA_ITEMS.map((item) => ({
    ...item,
    evidenceList: [...item.evidenceList]
  }));

  // If user completed assessment, dynamically adjust scores
  if (assessmentDraft) {
    const { technicalSkills, softSkills, careerInterests } = assessmentDraft;

    // Technical skills adjustments
    if (technicalSkills) {
      const prog = items.find((i) => i.id === 'tech-programming');
      if (prog && technicalSkills.frontendRating && technicalSkills.backendRating) {
        const avg = ((technicalSkills.frontendRating + technicalSkills.backendRating) / 2) * 20;
        prog.currentScore = Math.min(100, Math.max(60, Math.round(avg * 0.95)));
        prog.verificationScore = Math.min(100, Math.max(65, Math.round(avg * 0.98)));
      }

      const dsa = items.find((i) => i.id === 'tech-dsa');
      if (dsa && technicalSkills.dsaRating) {
        const val = technicalSkills.dsaRating * 20;
        dsa.currentScore = Math.min(100, Math.max(55, Math.round(val * 0.92)));
        dsa.verificationScore = Math.min(100, Math.max(60, Math.round(val * 0.95)));
      }

      const db = items.find((i) => i.id === 'tech-database');
      if (db && technicalSkills.databaseRating) {
        const val = technicalSkills.databaseRating * 20;
        db.currentScore = Math.min(100, Math.max(55, Math.round(val * 0.92)));
        db.verificationScore = Math.min(100, Math.max(60, Math.round(val * 0.96)));
      }

      const web = items.find((i) => i.id === 'tech-web-development');
      if (web && technicalSkills.frontendRating) {
        const val = technicalSkills.frontendRating * 20;
        web.currentScore = Math.min(100, Math.max(60, Math.round(val * 0.96)));
        web.verificationScore = Math.min(100, Math.max(65, Math.round(val * 0.99)));
      }

      const cloud = items.find((i) => i.id === 'tech-cloud');
      if (cloud && technicalSkills.cloudDevOpsRating) {
        const val = technicalSkills.cloudDevOpsRating * 20;
        cloud.currentScore = Math.min(100, Math.max(50, Math.round(val * 0.90)));
        cloud.verificationScore = Math.min(100, Math.max(55, Math.round(val * 0.94)));
      }

      const aiml = items.find((i) => i.id === 'tech-aiml');
      if (aiml && careerInterests?.industrySectors?.includes('AI & Machine Learning')) {
        aiml.currentScore = Math.max(aiml.currentScore, 86);
        aiml.verificationScore = Math.max(aiml.verificationScore, 89);
      }
    }

    // Professional skills adjustments
    if (softSkills) {
      const comm = items.find((i) => i.id === 'prof-communication');
      if (comm && softSkills.communicationRating) {
        const val = softSkills.communicationRating * 20;
        comm.currentScore = Math.min(100, Math.max(60, Math.round(val * 0.94)));
        comm.verificationScore = Math.min(100, Math.max(65, Math.round(val * 0.97)));
      }

      const team = items.find((i) => i.id === 'prof-teamwork');
      if (team && softSkills.teamCollaborationRating) {
        const val = softSkills.teamCollaborationRating * 20;
        team.currentScore = Math.min(100, Math.max(60, Math.round(val * 0.95)));
        team.verificationScore = Math.min(100, Math.max(65, Math.round(val * 0.98)));
      }

      const prob = items.find((i) => i.id === 'prof-problem-solving');
      if (prob && softSkills.problemDecompositionRating) {
        const val = softSkills.problemDecompositionRating * 20;
        prob.currentScore = Math.min(100, Math.max(60, Math.round(val * 0.96)));
        prob.verificationScore = Math.min(100, Math.max(65, Math.round(val * 0.99)));
      }
    }
  }

  // Calculate overall metrics
  const techItems = items.filter((i) => i.category === 'technical');
  const profItems = items.filter((i) => i.category === 'professional');

  const techAvg = Math.round(techItems.reduce((acc, i) => acc + i.verificationScore, 0) / techItems.length);
  const profAvg = Math.round(profItems.reduce((acc, i) => acc + i.verificationScore, 0) / profItems.length);

  const overallVerified = Math.round(techAvg * 0.65 + profAvg * 0.35);
  const overallCurrent = Math.round(
    items.reduce((acc, i) => acc + i.currentScore, 0) / items.length
  );
  const totalEvidence = items.reduce((acc, i) => acc + i.evidenceCount, 0);

  const metrics: SkillDnaOverallMetrics = {
    overallVerifiedScore: assessmentResult ? assessmentResult.readinessScore : overallVerified,
    overallCurrentScore: overallCurrent,
    verificationConfidence: Math.min(99, Math.round((overallVerified / Math.max(1, overallCurrent)) * 95)),
    totalEvidenceCount: totalEvidence,
    technicalAverage: techAvg,
    professionalAverage: profAvg,
    topPercentile: assessmentResult ? assessmentResult.percentileRank : Math.min(99, Math.round(overallVerified * 1.07)),
    tier: assessmentResult ? assessmentResult.tierLabel : (overallVerified >= 88 ? 'Tier-1 Industry Ready' : 'Enterprise Capable'),
    lastUpdated: assessmentResult ? `Assessment Sync (${assessmentResult.completedAt})` : 'Aug 21, 2026 • AI Cryptographic Sync'
  };

  return { items, metrics };
}
