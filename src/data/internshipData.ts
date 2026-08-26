import { InternshipRecord } from '../types/internship';

export const INITIAL_DEMO_INTERNSHIPS: InternshipRecord[] = [
  {
    id: 'internship-demo-01',
    applicationId: 'demo-app-1',
    opportunityId: 'demo-opp-1',
    studentId: 'demo-student-id',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@skillsetu.demo',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    studentInstitution: 'Apex Institute of Technology & Research',
    studentDegree: 'B.Tech Computer Science & Engineering',
    companyName: 'Apex Cloud Systems',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    roleTitle: 'Full-Stack Software Engineer Intern',
    department: 'Cloud Infrastructure & Developer Tools',
    workMode: 'Hybrid',
    location: 'Bengaluru, Karnataka, India',
    stipend: '₹45,000 / month',
    startDate: '2026-06-01',
    endDate: '2026-11-30',
    status: 'Active',
    mentor: {
      id: 'mentor-apex-01',
      name: 'Vikramaditya Sen',
      title: 'Principal Staff Engineer',
      email: 'vikram.sen@apexcloud.io',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      department: 'Distributed Systems'
    },
    progressPercentage: 65,
    milestones: [
      {
        id: 'ms-01',
        title: 'Sprint 1-2: Microservices Environment & Auth Middleware Setup',
        description: 'Set up local multi-tenant developer sandbox, implement JWT verification middleware, and pass latency benchmarks under 15ms.',
        dueDate: '2026-06-30',
        status: 'Approved',
        deliverableUrl: 'https://github.com/apex-cloud/auth-service/pull/104',
        submittedAt: '2026-06-28T16:45:00.000Z',
        completedAt: '2026-06-29T11:20:00.000Z',
        mentorFeedback: 'Exceeded expectations. Benchmark testing confirmed P99 latency of 11.4ms with zero memory leaks.',
        score: 95
      },
      {
        id: 'ms-02',
        title: 'Sprint 3-4: Resilient Event Streaming Pipeline with Apache Kafka',
        description: 'Design idempotent consumer group for real-time telemetry processing handling 10k messages/second with dead-letter queue recovery.',
        dueDate: '2026-07-31',
        status: 'Approved',
        deliverableUrl: 'https://github.com/apex-cloud/telemetry-pipeline/pull/42',
        submittedAt: '2026-07-29T14:10:00.000Z',
        completedAt: '2026-07-30T17:00:00.000Z',
        mentorFeedback: 'Great architectural decoupling. Implemented robust backoff retry mechanisms seamlessly.',
        score: 92
      },
      {
        id: 'ms-03',
        title: 'Sprint 5-6: Observability Dashboard & Grafana Telemetry Metrics',
        description: 'Instrument Prometheus counters and OpenTelemetry traces across core services; create executive SLA monitoring dashboards.',
        dueDate: '2026-09-15',
        status: 'Submitted',
        deliverableUrl: 'https://github.com/apex-cloud/observability-ops/pull/18',
        submittedAt: '2026-08-22T18:30:00.000Z',
        mentorFeedback: 'Under review by lead SRE team. Initial review looks very solid.',
        score: 88
      },
      {
        id: 'ms-04',
        title: 'Sprint 7-8: Production Canary Rollout & Final Capstone Architecture',
        description: 'Execute automated progressive canary deployments with automated rollback triggers and deliver comprehensive technical documentation.',
        dueDate: '2026-11-15',
        status: 'In Progress',
        deliverableUrl: 'https://github.com/apex-cloud/canary-orchestrator'
      }
    ],
    weeklyLogs: [
      {
        id: 'log-01',
        weekNumber: 1,
        startDate: '2026-06-01',
        endDate: '2026-06-07',
        workSummary: 'Completed company security compliance, onboarded into the Cloud Platform team, set up Dockerized dev environment, and analyzed service dependency topology.',
        skillsPracticed: ['Docker', 'Linux CLI', 'Git Submodules', 'OAuth2/OIDC'],
        challengesFaced: 'Encountered local DNS resolution conflicts in WSL2 container bridge network.',
        nextWeekPlan: 'Draft JWT auth middleware spec and benchmark baseline request handler.',
        submittedAt: '2026-06-07T18:00:00.000Z',
        status: 'Reviewed',
        mentorRemarks: 'Great proactive debugging on the network configuration issue. On track.',
        mentorReviewedAt: '2026-06-08T09:30:00.000Z'
      },
      {
        id: 'log-02',
        weekNumber: 6,
        startDate: '2026-07-06',
        endDate: '2026-07-12',
        workSummary: 'Implemented Kafka consumer group partitions with custom deserializers. Wrote unit tests covering corner case malformed payloads.',
        skillsPracticed: ['Apache Kafka', 'Go/TypeScript', 'Unit Testing', 'Concurrency'],
        challengesFaced: 'Managing partition rebalancing during sudden node shutdown simulations.',
        nextWeekPlan: 'Integrate schema registry validation and start stress testing with Locust.',
        submittedAt: '2026-07-12T17:30:00.000Z',
        status: 'Reviewed',
        mentorRemarks: 'Very clean test coverage. Consider adding a circuit breaker for upstream Redis cache.',
        mentorReviewedAt: '2026-07-13T10:15:00.000Z'
      },
      {
        id: 'log-03',
        weekNumber: 12,
        startDate: '2026-08-17',
        endDate: '2026-08-23',
        workSummary: 'Created Prometheus custom metrics exporter for gRPC endpoints and wired Grafana alerting thresholds for P95 latency spikes.',
        skillsPracticed: ['Prometheus', 'Grafana', 'OpenTelemetry', 'gRPC'],
        challengesFaced: 'High metric cardinality causing memory pressure in Prometheus scraper.',
        nextWeekPlan: 'Refactor label dimensions to aggregate by cluster region rather than raw client IP.',
        submittedAt: '2026-08-23T19:00:00.000Z',
        status: 'Submitted'
      }
    ],
    mentorFeedbacks: [
      {
        id: 'fb-01',
        date: '2026-06-30',
        stage: 'Milestone Check',
        mentorName: 'Vikramaditya Sen',
        mentorRole: 'Principal Staff Engineer',
        technicalRating: 5,
        softSkillsRating: 4,
        initiativeRating: 5,
        summaryComments: 'Aarav has integrated exceptionally fast into our distributed systems team. His understanding of asynchronous paradigms and clean API design is well above junior level.',
        strengthsObserved: [
          'High technical curiosity and fast ramp-up on unfamiliar tech stacks',
          'Self-directed debugging and comprehensive unit testing habits',
          'Clear, concise documentation in PR descriptions'
        ],
        areasForImprovement: [
          'Can participate more actively in architectural RFC discussions with cross-functional teams'
        ]
      },
      {
        id: 'fb-02',
        date: '2026-08-05',
        stage: 'Mid-Term Review',
        mentorName: 'Vikramaditya Sen',
        mentorRole: 'Principal Staff Engineer',
        technicalRating: 5,
        softSkillsRating: 5,
        initiativeRating: 5,
        summaryComments: 'Outstanding mid-term trajectory. Delivered the streaming pipeline 4 days ahead of schedule. Demonstrates clear engineering leadership potential.',
        strengthsObserved: [
          'Zero defect escape rate in production staging',
          'Collaborative pairing with junior team members',
          'Strong performance under simulated outage drills'
        ],
        areasForImprovement: [
          'Continue deepening knowledge on cloud cost optimization and egress traffic patterns'
        ]
      }
    ],
    finalReportDocument: {
      id: 'doc-report-01',
      fileName: 'Aarav_Sharma_MidTerm_Telemetry_Report.pdf',
      fileSize: 2458000,
      fileType: 'application/pdf',
      downloadUrl: 'https://skillsetu.demo/reports/aarav_telemetry_report_verified.pdf',
      uploadedAt: '2026-08-20T14:15:00.000Z',
      storageProvider: 'Firebase Storage'
    },
    postedBy: 'demo-industry-apex',
    createdAt: '2026-05-25T10:00:00.000Z',
    updatedAt: '2026-08-23T19:00:00.000Z'
  },
  {
    id: 'internship-demo-02',
    applicationId: 'demo-app-completed-01',
    opportunityId: 'opp-novacore-01',
    studentId: 'demo-student-id',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@skillsetu.demo',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    studentInstitution: 'Apex Institute of Technology & Research',
    studentDegree: 'B.Tech Computer Science & Engineering',
    companyName: 'NovaCore Technologies Inc.',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80',
    roleTitle: 'AI Systems & Backend Engineering Intern',
    department: 'Applied Machine Learning & Distributed Inference',
    workMode: 'Remote',
    location: 'Bengaluru / Hybrid',
    stipend: '₹40,000 / month',
    startDate: '2025-12-01',
    endDate: '2026-05-15',
    status: 'Completed',
    mentor: {
      id: 'mentor-nova-01',
      name: 'Dr. Radhika Nair',
      title: 'VP of AI Research & Platform Systems',
      email: 'r.nair@novacore.tech',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      department: 'Core AI Platform'
    },
    progressPercentage: 100,
    milestones: [
      {
        id: 'ms-nova-01',
        title: 'Phase 1: High-Throughput Vector Embedding Ingestion Pipeline',
        description: 'Engineered batch embeddings pipeline using FAISS and Milvus cluster with QPS >= 2,500.',
        dueDate: '2026-01-15',
        status: 'Approved',
        deliverableUrl: 'https://github.com/novacore-ai/vector-indexer/releases/tag/v1.0.0',
        submittedAt: '2026-01-14T10:00:00.000Z',
        completedAt: '2026-01-15T15:30:00.000Z',
        mentorFeedback: 'Excellent performance optimization; achieved 3,100 QPS with quantized vectors.',
        score: 98
      },
      {
        id: 'ms-nova-02',
        title: 'Phase 2: RAG Context Synthesis & Hallucination Guardrails Engine',
        description: 'Implemented semantic chunking, dynamic re-ranking with cross-encoders, and automated hallucination scoring.',
        dueDate: '2026-03-10',
        status: 'Approved',
        deliverableUrl: 'https://github.com/novacore-ai/guardrail-service/pull/88',
        submittedAt: '2026-03-08T18:20:00.000Z',
        completedAt: '2026-03-09T14:00:00.000Z',
        mentorFeedback: 'Reduced enterprise customer hallucination rate from 4.2% down to 0.3%.',
        score: 96
      },
      {
        id: 'ms-nova-03',
        title: 'Phase 3: Production Deployment, Load Testing & Whitepaper Delivery',
        description: 'Orchestrated Kubernetes autoscaling inference deployment and co-authored internal technical paper on token streaming optimization.',
        dueDate: '2026-05-10',
        status: 'Approved',
        deliverableUrl: 'https://github.com/novacore-ai/inference-engine-k8s',
        submittedAt: '2026-05-08T12:00:00.000Z',
        completedAt: '2026-05-10T16:00:00.000Z',
        mentorFeedback: 'Phenomenal execution from conception to production release.',
        score: 99
      }
    ],
    weeklyLogs: [
      {
        id: 'log-nova-01',
        weekNumber: 1,
        startDate: '2025-12-01',
        endDate: '2025-12-07',
        workSummary: 'Evaluated open-source vector databases (Milvus, Qdrant, FAISS) for high-dimensional semantic search.',
        skillsPracticed: ['Vector Databases', 'Python', 'Benchmarking'],
        challengesFaced: 'High index build latency on large dataset embeddings.',
        nextWeekPlan: 'Implement HNSW indexing with scalar quantization.',
        submittedAt: '2025-12-07T18:00:00.000Z',
        status: 'Reviewed',
        mentorRemarks: 'Rigorous benchmarking methodology. Proceed with HNSW.',
        mentorReviewedAt: '2025-12-08T10:00:00.000Z'
      },
      {
        id: 'log-nova-20',
        weekNumber: 20,
        startDate: '2026-05-01',
        endDate: '2026-05-08',
        workSummary: 'Finalized automated CI/CD pipeline, load testing with 5,000 concurrent streaming connections, and published final internship capstone report.',
        skillsPracticed: ['CI/CD', 'Kubernetes', 'Locust Load Testing', 'Technical Writing'],
        challengesFaced: 'Pod connection drops during rolling cluster upgrades.',
        nextWeekPlan: 'Present capstone demonstration to VP of Engineering and leadership team.',
        submittedAt: '2026-05-08T18:00:00.000Z',
        status: 'Reviewed',
        mentorRemarks: 'Flawless capstone delivery. Pre-placement offer recommendation submitted.',
        mentorReviewedAt: '2026-05-09T11:00:00.000Z'
      }
    ],
    mentorFeedbacks: [
      {
        id: 'fb-nova-01',
        date: '2026-05-12',
        stage: 'Sprint Review',
        mentorName: 'Dr. Radhika Nair',
        mentorRole: 'VP of AI Research & Platform Systems',
        technicalRating: 5,
        softSkillsRating: 5,
        initiativeRating: 5,
        summaryComments: 'Aarav is an elite tier software engineer. His contributions to our production RAG pipeline have directly impacted our enterprise AI offerings.',
        strengthsObserved: [
          'World-class algorithmic comprehension and vector mathematics',
          'Production-grade code quality with comprehensive automated testing',
          'Executive presentation and technical writing eloquence'
        ],
        areasForImprovement: [
          'Ready for full-time autonomy as an SDE-1 / AI Systems Engineer'
        ]
      }
    ],
    finalEvaluation: {
      id: 'eval-nova-01',
      evaluatedAt: '2026-05-14T15:00:00.000Z',
      evaluatedBy: 'Dr. Radhika Nair',
      evaluatorRole: 'VP of AI Research & Platform Systems',
      overallRating: 5,
      technicalProficiencyScore: 98,
      domainKnowledgeScore: 95,
      collaborationScore: 96,
      problemSolvingScore: 99,
      recommendationForPPO: true,
      ppoDetails: 'Full-Time SDE-1 (AI Platform Systems) Offer Extended with CTC ₹28,50,000 + Stock Options.',
      detailedSummary: 'Aarav completed a 24-week rigorous engineering internship at NovaCore Technologies with distinction. He architected our semantic caching and low-latency token streaming engine, demonstrating mastery of distributed systems, vector search, and scalable backend infrastructure.',
      skillsVerified: [
        {
          skillId: 'tech-ai-ml',
          skillName: 'AI & Machine Learning Systems',
          verifiedLevel: 96,
          evidenceTag: 'Architected NovaCore Enterprise RAG & Vector Pipeline (3.1k QPS)'
        },
        {
          skillId: 'tech-backend',
          skillName: 'Backend & Microservices',
          verifiedLevel: 95,
          evidenceTag: 'Built high-throughput gRPC services with sub-10ms response times'
        },
        {
          skillId: 'tech-cloud',
          skillName: 'Cloud Infrastructure & Kubernetes',
          verifiedLevel: 92,
          evidenceTag: 'Orchestrated production autoscaling clusters with zero-downtime rollouts'
        },
        {
          skillId: 'tech-dsa',
          skillName: 'Algorithms & Data Structures',
          verifiedLevel: 98,
          evidenceTag: 'Optimized vector similarity search with HNSW and quantization'
        }
      ]
    },
    completionRecord: {
      certificateId: 'SETU-CERT-2026-NC-09842',
      issueDate: '2026-05-15',
      issuedBy: 'NovaCore Technologies Inc. & SkillSetu National Credential Registry',
      companyName: 'NovaCore Technologies Inc.',
      signatoryName: 'Dr. Radhika Nair & Sanjeev Kapoor (CTO)',
      signatoryTitle: 'VP of AI Research & Chief Technology Officer',
      verificationHash: 'SETU-INT-2026-N8X1-VERIFIED',
      verificationUrl: 'https://skillsetu.ai/verify/SETU-INT-2026-N8X1-VERIFIED',
      status: 'Verified',
      honorsTag: 'Distinction',
      skillsEndorsed: [
        'AI/ML Systems Engineering',
        'Distributed Vector Search',
        'High-Throughput gRPC Microservices',
        'Kubernetes Cloud Orchestration',
        'Production RAG Guardrails'
      ]
    },
    finalReportDocument: {
      id: 'doc-report-nova',
      fileName: 'NovaCore_AI_Systems_Final_Capstone_Report.pdf',
      fileSize: 4120000,
      fileType: 'application/pdf',
      downloadUrl: 'https://skillsetu.demo/reports/novacore_final_capstone_report.pdf',
      uploadedAt: '2026-05-10T18:00:00.000Z',
      storageProvider: 'Firebase Storage'
    },
    postedBy: 'ind_novacore',
    createdAt: '2025-11-20T10:00:00.000Z',
    updatedAt: '2026-05-15T18:00:00.000Z'
  },
  {
    id: 'internship-demo-03',
    applicationId: 'app-cand-02-intern',
    opportunityId: 'opp-novacore-02',
    studentId: 'cand-02-priya',
    studentName: 'Priya Patel',
    studentEmail: 'priya.patel@apex.edu',
    studentAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    studentInstitution: 'Apex Institute of Technology & Research',
    studentDegree: 'B.Tech Information Technology',
    companyName: 'NovaCore Technologies Inc.',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80',
    roleTitle: 'Frontend Platform & Web Performance Intern',
    department: 'Design Engineering & Core UI',
    workMode: 'Hybrid',
    location: 'Bengaluru, Karnataka, India',
    stipend: '₹38,000 / month',
    startDate: '2026-06-01',
    endDate: '2026-11-30',
    status: 'Active',
    mentor: {
      id: 'mentor-nova-02',
      name: 'Aditya Mathur',
      title: 'Staff UI Architect',
      email: 'a.mathur@novacore.tech',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      department: 'Frontend Systems'
    },
    progressPercentage: 55,
    milestones: [
      {
        id: 'ms-priya-01',
        title: 'Sprint 1-2: Core Web Vitals Audit & Asset Pipeline Optimization',
        description: 'Profile LCP and INP across enterprise dashboards, achieving score >= 90.',
        dueDate: '2026-06-30',
        status: 'Approved',
        deliverableUrl: 'https://github.com/novacore-ai/ui-core/pull/220',
        submittedAt: '2026-06-28T12:00:00.000Z',
        completedAt: '2026-06-29T14:30:00.000Z',
        mentorFeedback: 'LCP improved by 42% on low-bandwidth connections.',
        score: 94
      },
      {
        id: 'ms-priya-02',
        title: 'Sprint 3-4: Accessible High-Performance Canvas Visualizer',
        description: 'Build WCAG 2.2 compliant interactive workflow visualizer using WebGL canvas and SVG fallbacks.',
        dueDate: '2026-08-15',
        status: 'Approved',
        deliverableUrl: 'https://github.com/novacore-ai/ui-core/pull/245',
        submittedAt: '2026-08-12T15:00:00.000Z',
        completedAt: '2026-08-14T11:00:00.000Z',
        mentorFeedback: 'Flawless 60 FPS rendering on 10k nodes graph.',
        score: 91
      },
      {
        id: 'ms-priya-03',
        title: 'Sprint 5-6: Dynamic Real-Time Collaborative Canvas State Sync',
        description: 'Integrate CRDTs and WebSockets for multiplayer board editing.',
        dueDate: '2026-09-30',
        status: 'In Progress'
      }
    ],
    weeklyLogs: [
      {
        id: 'log-priya-01',
        weekNumber: 1,
        startDate: '2026-06-01',
        endDate: '2026-06-07',
        workSummary: 'Analyzed webpack/vite bundle sizes and identified 3 redundant charting vendor dependencies.',
        skillsPracticed: ['Vite', 'Tree Shaking', 'React Profiler'],
        challengesFaced: 'Complex transitive dependencies pulling heavy lodash builds.',
        nextWeekPlan: 'Replace heavy libraries with native ESM primitives.',
        submittedAt: '2026-06-07T17:00:00.000Z',
        status: 'Reviewed',
        mentorRemarks: 'Great initial audit findings.',
        mentorReviewedAt: '2026-06-08T09:00:00.000Z'
      }
    ],
    mentorFeedbacks: [
      {
        id: 'fb-priya-01',
        date: '2026-07-02',
        stage: 'Milestone Check',
        mentorName: 'Aditya Mathur',
        mentorRole: 'Staff UI Architect',
        technicalRating: 5,
        softSkillsRating: 5,
        initiativeRating: 4,
        summaryComments: 'Priya is highly detail-oriented with a strong instinct for frontend performance and accessibility standards.',
        strengthsObserved: [
          'Deep mastery of modern CSS and web animation performance',
          'Excellent cross-browser testing rigor'
        ],
        areasForImprovement: [
          'Expand familiarity with WebSocket reconnection backoff strategies'
        ]
      }
    ],
    postedBy: 'ind_novacore',
    createdAt: '2026-05-28T10:00:00.000Z',
    updatedAt: '2026-08-20T14:00:00.000Z'
  }
];
