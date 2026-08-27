import { LearningProgram, StudentProgramEnrollment } from '../types/learningProgram';

export const INITIAL_DEMO_LEARNING_PROGRAMS: LearningProgram[] = [
  {
    id: 'prog-apex-dist-sys',
    organizationId: 'demo-industry-apex',
    organizationName: 'Apex Cloud Systems',
    organizationLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    title: 'Cloud-Native Distributed Systems & Microservices Residency',
    description: 'An intensive enterprise accelerator designed to master gRPC streaming, consensus algorithms (Raft), distributed caching with Redis, and Kafka event pipelining before applying for full-time cloud architect roles.',
    programType: 'Training Program',
    domain: 'Cloud Architecture & Distributed Systems',
    prerequisiteSkills: ['Go (Golang)', 'Data Structures & Algorithms', 'Linux Fundamentals'],
    targetSkills: ['Distributed Systems', 'gRPC & Protocol Buffers', 'Apache Kafka', 'Microservices', 'System Design'],
    difficultyLevel: 'Advanced',
    deliveryMode: 'Hybrid',
    duration: '8 Weeks (120 Hours)',
    startDate: '2026-09-01',
    endDate: '2026-10-25',
    capacity: 60,
    enrolledCount: 42,
    completedCount: 18,
    mentorInfo: {
      name: 'Dr. Vikramaditya Sen',
      title: 'Principal Distributed Architect',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      email: 'vikram.sen@apexcloud.io',
      company: 'Apex Cloud Systems',
      bio: 'Ex-Google Cloud Infra Fellow, 14+ years architecting multi-region low-latency distributed telemetry.'
    },
    certificationInfo: {
      isOffered: true,
      certificateTitle: 'Certified Cloud Distributed Systems Engineer (CCDSE)',
      issuerName: 'Apex Cloud Engineering Institute',
      accreditationLevel: 'Specialist',
      validity: 'Lifetime (Cryptographically Anchored)'
    },
    modules: [
      {
        id: 'mod-1',
        order: 1,
        title: 'Module 1: RPC Protocols & High-Throughput gRPC Streams',
        description: 'Implement bidirectional binary protobuf contracts with connection pooling and interceptor authentication.',
        duration: '10 Hours',
        skillsCovered: ['gRPC & Protocol Buffers', 'Go (Golang)'],
        deliverable: 'Benchmark report comparing REST vs gRPC over 50,000 req/sec'
      },
      {
        id: 'mod-2',
        order: 2,
        title: 'Module 2: Event-Driven Systems with Apache Kafka & Schema Registry',
        description: 'Design idempotent producers, consumer group rebalancing, and dead-letter queues.',
        duration: '15 Hours',
        skillsCovered: ['Apache Kafka', 'Distributed Systems'],
        deliverable: 'Financial ledger pipeline with exactly-once processing'
      },
      {
        id: 'mod-3',
        order: 3,
        title: 'Module 3: Distributed State, Raft Consensus & Leader Election',
        description: 'Build a distributed key-value store state machine replicating logs with Raft.',
        duration: '20 Hours',
        skillsCovered: ['Distributed Systems', 'System Design'],
        deliverable: '3-node fault tolerant consensus cluster in Go'
      },
      {
        id: 'mod-4',
        order: 4,
        title: 'Module 4: Distributed Caching & Cache-Aside Invalidation Strategies',
        description: 'Redis cluster sharding, cache stampede prevention using probabilistic early expiration.',
        duration: '12 Hours',
        skillsCovered: ['Redis', 'Microservices'],
        deliverable: 'Sub-millisecond dynamic session caching tier'
      },
      {
        id: 'mod-5',
        order: 5,
        title: 'Module 5: Observability, OpenTelemetry Tracing & Chaos Engineering',
        description: 'Inject latency and node failure simulation with Chaos Mesh, monitoring with Jaeger and Prometheus.',
        duration: '18 Hours',
        skillsCovered: ['OpenTelemetry', 'System Design'],
        deliverable: 'Live Grafana SLA dashboard under 30% synthetic packet drop'
      },
      {
        id: 'mod-6',
        order: 6,
        title: 'Module 6: Capstone Architecture Defense & Recruiter Fast-Track',
        description: 'End-to-end multi-tenant payment gateway simulator defended before Apex Technical Fellows.',
        duration: '25 Hours',
        skillsCovered: ['Distributed Systems', 'System Design', 'Microservices'],
        deliverable: 'Production deployment repo with architectural decision records'
      }
    ],
    status: 'published',
    stipendOrGrant: 'INR 18,000 Capstone Completion Bounty',
    locationDetails: 'Apex Innovation Center (Bengaluru) & Live Hybrid Stream',
    featured: true,
    createdAt: '2026-07-15T10:00:00.000Z',
    updatedAt: '2026-08-20T14:30:00.000Z'
  },
  {
    id: 'prog-novacore-k8s-cert',
    organizationId: 'org-novacore',
    organizationName: 'NovaCore DevOps & Cloud',
    organizationLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80',
    title: 'Production Kubernetes & Multi-Cluster Platform Engineering',
    description: 'Official enterprise certification pathway covering Helm packaging, GitOps deployment with ArgoCD, Istio Service Mesh, and zero-trust container security for student engineers.',
    programType: 'Certification Course',
    domain: 'DevOps & Platform Engineering',
    prerequisiteSkills: ['Docker', 'Linux CLI', 'Basic Networking'],
    targetSkills: ['Kubernetes', 'Docker', 'CI/CD Pipelines', 'ArgoCD & GitOps', 'Istio Service Mesh'],
    difficultyLevel: 'Intermediate',
    deliveryMode: 'Online',
    duration: '6 Weeks (80 Hours)',
    startDate: '2026-09-10',
    endDate: '2026-10-20',
    capacity: 100,
    enrolledCount: 78,
    completedCount: 35,
    mentorInfo: {
      name: 'Pooja Iyer',
      title: 'Staff SRE & CNCF Ambassador',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      email: 'pooja.iyer@novacore.cloud',
      company: 'NovaCore Cloud'
    },
    certificationInfo: {
      isOffered: true,
      certificateTitle: 'Enterprise Certified Kubernetes Platform Specialist (ECKPS)',
      issuerName: 'NovaCore Engineering Academy',
      accreditationLevel: 'Associate Certified',
      validity: '3 Years'
    },
    modules: [
      {
        id: 'k8s-m1',
        order: 1,
        title: 'Module 1: Pod Scheduling, Storage Classes & StatefulSets',
        description: 'Persistent volume claims, dynamic CSI provisioning, and node affinity rules.',
        duration: '12 Hours',
        skillsCovered: ['Kubernetes', 'Docker']
      },
      {
        id: 'k8s-m2',
        order: 2,
        title: 'Module 2: Declarative GitOps Deployments with ArgoCD',
        description: 'Automated sync loops, drift detection, and canary rollouts with Argo Rollouts.',
        duration: '15 Hours',
        skillsCovered: ['ArgoCD & GitOps', 'CI/CD Pipelines']
      },
      {
        id: 'k8s-m3',
        order: 3,
        title: 'Module 3: Ingress Controllers & Istio Service Mesh Routing',
        description: 'Mutual TLS (mTLS), traffic splitting, circuit breakers, and fault injection.',
        duration: '18 Hours',
        skillsCovered: ['Istio Service Mesh', 'Kubernetes']
      },
      {
        id: 'k8s-m4',
        order: 4,
        title: 'Module 4: Enterprise Security, RBAC & Kyverno Policies',
        description: 'Enforcing Pod Security Standards, container image signing with Cosign, and network policies.',
        duration: '15 Hours',
        skillsCovered: ['Kubernetes', 'Cybersecurity']
      }
    ],
    status: 'published',
    stipendOrGrant: 'Free for Shortlisted University Candidates',
    featured: true,
    createdAt: '2026-07-20T08:00:00.000Z',
    updatedAt: '2026-08-18T12:00:00.000Z'
  },
  {
    id: 'prog-google-mlops-bootcamp',
    organizationId: 'org-google-partner',
    organizationName: 'AI Studio & Cloud Partner Labs',
    organizationLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
    title: 'Generative AI & Production LLMOps Bootcamp',
    description: 'Build robust retrieval-augmented generation (RAG) pipelines, multimodal agents using the Gemini 2.5 Flash SDK, vector indexing with pgvector, and automated hallucination evaluation frameworks.',
    programType: 'Bootcamp',
    domain: 'Artificial Intelligence & Machine Learning',
    prerequisiteSkills: ['Python', 'Basic Machine Learning', 'REST APIs'],
    targetSkills: ['Gemini API & LLMs', 'RAG & Vector Databases', 'FastAPI & Python', 'LangChain/LlamaIndex', 'Prompt Engineering'],
    difficultyLevel: 'Intermediate',
    deliveryMode: 'Online',
    duration: '4 Weeks (60 Hours)',
    startDate: '2026-09-15',
    endDate: '2026-10-15',
    capacity: 120,
    enrolledCount: 104,
    completedCount: 42,
    mentorInfo: {
      name: 'Rohan Deshmukh',
      title: 'Lead AI Research Engineer',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      email: 'rohan.ai@cloudpartner.org',
      company: 'AI Studio Partner Labs'
    },
    certificationInfo: {
      isOffered: true,
      certificateTitle: 'Certified GenAI Application Architect (CGAA)',
      issuerName: 'Google AI Partner Network',
      accreditationLevel: 'Professional Master',
      validity: 'Lifetime'
    },
    modules: [
      {
        id: 'ai-m1',
        order: 1,
        title: 'Module 1: Multimodal Prompting & Gemini Structured Outputs',
        description: 'JSON schema enforcement, tool use (function calling), and system instructions.',
        duration: '10 Hours',
        skillsCovered: ['Gemini API & LLMs', 'Prompt Engineering']
      },
      {
        id: 'ai-m2',
        order: 2,
        title: 'Module 2: Advanced Hybrid RAG & Vector Embeddings with pgvector',
        description: 'Hierarchical chunking, re-ranking with cross-encoders, and reciprocal rank fusion.',
        duration: '15 Hours',
        skillsCovered: ['RAG & Vector Databases', 'FastAPI & Python']
      },
      {
        id: 'ai-m3',
        order: 3,
        title: 'Module 3: Autonomous Multi-Agent Workflows & Memory Chains',
        description: 'Stateful workflow coordination, human-in-the-loop validation, and fallback loops.',
        duration: '18 Hours',
        skillsCovered: ['Gemini API & LLMs', 'LangChain/LlamaIndex']
      },
      {
        id: 'ai-m4',
        order: 4,
        title: 'Module 4: RAG Evaluation Metrics (Ragas) & Guardrail Defenses',
        description: 'Benchmarking context relevancy, faithfulness, and preventing prompt injections.',
        duration: '12 Hours',
        skillsCovered: ['FastAPI & Python', 'Prompt Engineering']
      }
    ],
    status: 'published',
    stipendOrGrant: 'Google Cloud Credits ($300) Included',
    featured: true,
    createdAt: '2026-08-01T11:00:00.000Z',
    updatedAt: '2026-08-22T16:00:00.000Z'
  },
  {
    id: 'prog-tcs-cyber-mentorship',
    organizationId: 'org-tata-cyber',
    organizationName: 'Tata Consultancy Services - Cyber Defense',
    organizationLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=80',
    title: '1-on-1 SOC Analyst & Threat Hunting Industry Mentorship',
    description: 'Bi-weekly 1-on-1 sessions paired with Senior Threat Analysts. Hands-on SIEM log triage (Splunk/Elastic), packet analysis with Wireshark, MITRE ATT&CK mapping, and purple-team simulation.',
    programType: 'Mentorship Program',
    domain: 'Cybersecurity & Defense',
    prerequisiteSkills: ['Computer Networks', 'Linux OS', 'Python or Bash'],
    targetSkills: ['Threat Intelligence', 'SIEM & SOC Operations', 'Wireshark & Packet Analysis', 'MITRE ATT&CK', 'Incident Response'],
    difficultyLevel: 'Advanced',
    deliveryMode: 'Online',
    duration: '10 Weeks (1-on-1)',
    startDate: '2026-09-05',
    endDate: '2026-11-15',
    capacity: 25,
    enrolledCount: 22,
    completedCount: 9,
    mentorInfo: {
      name: 'Ananya Roy',
      title: 'Principal Threat Intelligence Lead',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
      email: 'ananya.roy@tcs-cyber.com',
      company: 'TCS Cyber Defense Practice',
      bio: '12+ years heading incident response for banking critical infrastructure.'
    },
    certificationInfo: {
      isOffered: true,
      certificateTitle: 'TCS Enterprise Mentorship in SOC Defense & Incident Response',
      issuerName: 'TCS Cyber Security Practice',
      accreditationLevel: 'Specialist',
      validity: 'Lifetime'
    },
    modules: [
      {
        id: 'soc-m1',
        order: 1,
        title: 'Module 1: Enterprise Log Ingestion & SIEM Correlation Rules',
        description: 'Triage auth anomalies, brute-force indicators, and lateral movement.',
        duration: '12 Hours',
        skillsCovered: ['SIEM & SOC Operations']
      },
      {
        id: 'soc-m2',
        order: 2,
        title: 'Module 2: Network Forensics & Deep Packet Analysis',
        description: 'Extracting payload exfiltration signatures in Wireshark and Zeek.',
        duration: '14 Hours',
        skillsCovered: ['Wireshark & Packet Analysis']
      },
      {
        id: 'soc-m3',
        order: 3,
        title: 'Module 3: Threat Hunting Frameworks & MITRE ATT&CK Mapping',
        description: 'Formulate hypotheses for APT persistence techniques and beacon detection.',
        duration: '16 Hours',
        skillsCovered: ['MITRE ATT&CK', 'Threat Intelligence']
      },
      {
        id: 'soc-m4',
        order: 4,
        title: 'Module 4: Mock SOC Incident Response Simulation & Live Executive Briefing',
        description: 'Respond to simulated ransomware breach within 90-minute SLA.',
        duration: '18 Hours',
        skillsCovered: ['Incident Response', 'Threat Intelligence']
      }
    ],
    status: 'published',
    stipendOrGrant: 'Direct Fast-Track to TCS Cyber Defense Interview',
    featured: false,
    createdAt: '2026-08-05T09:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z'
  },
  {
    id: 'prog-aws-serverless-masterclass',
    organizationId: 'org-aws-solutions',
    organizationName: 'AWS Cloud Solutions Group',
    organizationLogo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=80',
    title: 'Enterprise Serverless & EventBridge Architecture Masterclass',
    description: 'Deep-dive masterclass covering AWS Lambda cold-start optimizations, DynamoDB single-table design, Step Functions orchestration, and infrastructure as code with AWS CDK.',
    programType: 'Masterclass',
    domain: 'Cloud Architecture & Distributed Systems',
    prerequisiteSkills: ['TypeScript or Python', 'Basic Cloud Computing'],
    targetSkills: ['AWS Lambda', 'DynamoDB Single-Table', 'AWS CDK & IaC', 'Serverless Architecture', 'EventBridge'],
    difficultyLevel: 'Intermediate',
    deliveryMode: 'Hybrid',
    duration: '3 Weeks (30 Hours)',
    startDate: '2026-09-20',
    endDate: '2026-10-10',
    capacity: 80,
    enrolledCount: 54,
    completedCount: 26,
    mentorInfo: {
      name: 'Aditya Verma',
      title: 'Principal Solutions Architect',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      email: 'aditya.v@aws-partner.com',
      company: 'AWS Cloud Solutions'
    },
    certificationInfo: {
      isOffered: true,
      certificateTitle: 'AWS Serverless Architect Masterclass Accreditation',
      issuerName: 'AWS Developer Network',
      accreditationLevel: 'Associate Certified',
      validity: '2 Years'
    },
    modules: [
      {
        id: 'aws-m1',
        order: 1,
        title: 'Module 1: High-Performance Lambda & Provisioned Concurrency',
        description: 'Optimizing memory sizing with AWS Lambda Power Tuning and SnapStart.',
        duration: '8 Hours',
        skillsCovered: ['AWS Lambda', 'Serverless Architecture']
      },
      {
        id: 'aws-m2',
        order: 2,
        title: 'Module 2: DynamoDB Single-Table Design Mastery',
        description: 'Partition key strategies, GSI overloading, and sparse indexes.',
        duration: '10 Hours',
        skillsCovered: ['DynamoDB Single-Table']
      },
      {
        id: 'aws-m3',
        order: 3,
        title: 'Module 3: Type-Safe Infrastructure with AWS CDK v2',
        description: 'Construct libraries, multi-environment stacks, and cdk-nag security auditing.',
        duration: '12 Hours',
        skillsCovered: ['AWS CDK & IaC', 'EventBridge']
      }
    ],
    status: 'published',
    stipendOrGrant: 'AWS Certified Voucher Discount 50%',
    createdAt: '2026-08-10T14:00:00.000Z',
    updatedAt: '2026-08-24T18:00:00.000Z'
  },
  {
    id: 'prog-fintech-react-workshop',
    organizationId: 'demo-industry-apex',
    organizationName: 'Apex Cloud Systems',
    organizationLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    title: 'High-Frequency Trading Web UI & WebSockets Workshop',
    description: 'Hands-on live engineering workshop building real-time market depth charts, canvas order books, and sub-10ms UI renders using React 19, Web Workers, and WebGL.',
    programType: 'Workshop',
    domain: 'Frontend Engineering & Real-Time Web',
    prerequisiteSkills: ['React', 'TypeScript', 'DOM Performance'],
    targetSkills: ['React 19', 'WebSockets', 'Canvas & WebGL', 'Web Workers', 'Performance Optimization'],
    difficultyLevel: 'Intermediate',
    deliveryMode: 'In-Person',
    duration: '2 Days Intensive (16 Hours)',
    startDate: '2026-09-26',
    endDate: '2026-09-27',
    capacity: 40,
    enrolledCount: 38,
    completedCount: 38,
    mentorInfo: {
      name: 'Kavita Menon',
      title: 'Lead Frontend UI Architect',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      email: 'kavita.m@apexcloud.io',
      company: 'Apex Cloud Systems'
    },
    certificationInfo: {
      isOffered: true,
      certificateTitle: 'Apex High-Performance Frontend Workshop Certificate',
      issuerName: 'Apex Cloud Systems',
      accreditationLevel: 'Enterprise Foundation',
      validity: 'Lifetime'
    },
    modules: [
      {
        id: 'ws-m1',
        order: 1,
        title: 'Session 1: High-Throughput WebSocket Streams & Binary Protocol Buffers in Browser',
        description: 'Offloading decompression to Web Workers.',
        duration: '8 Hours',
        skillsCovered: ['WebSockets', 'Web Workers']
      },
      {
        id: 'ws-m2',
        order: 2,
        title: 'Session 2: Real-time 60FPS Order Book Canvas Rendering with Zero Garbage Collection',
        description: 'Memory buffer reuse and virtualized tick streams.',
        duration: '8 Hours',
        skillsCovered: ['React 19', 'Canvas & WebGL', 'Performance Optimization']
      }
    ],
    status: 'published',
    locationDetails: 'Apex Innovation Campus, Whitefield, Bengaluru',
    createdAt: '2026-08-12T10:00:00.000Z',
    updatedAt: '2026-08-25T11:00:00.000Z'
  }
];

export const INITIAL_DEMO_STUDENT_PROGRAM_ENROLLMENTS: StudentProgramEnrollment[] = [
  {
    id: 'enr-student-01-apex-dist',
    programId: 'prog-apex-dist-sys',
    studentId: 'demo-student-id',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@skillsetu.demo',
    studentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    institutionId: 'inst_nit',
    institutionName: 'National Institute of Technology',
    organizationId: 'demo-industry-apex',
    organizationName: 'Apex Cloud Systems',
    organizationLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    programTitle: 'Cloud-Native Distributed Systems & Microservices Residency',
    programType: 'Training Program',
    domain: 'Cloud Architecture & Distributed Systems',
    targetSkills: ['Distributed Systems', 'gRPC & Protocol Buffers', 'Apache Kafka', 'Microservices', 'System Design'],
    enrollmentDate: '2026-07-28',
    status: 'In Progress',
    completedModuleIds: ['mod-1', 'mod-2', 'mod-3', 'mod-4'],
    totalModulesCount: 6,
    progressPercentage: 67, // 4/6 = 67%
    lastActiveDate: '2026-08-24',
    mentorFeedback: {
      mentorName: 'Dr. Vikramaditya Sen',
      mentorTitle: 'Principal Distributed Architect, Apex Cloud Systems',
      feedbackText: 'Aarav has shown exceptional grasp of Raft consensus state replication in Go. His benchmark report for Module 1 was thorough and well-instrumented with p99 latency metrics.',
      technicalRating: 5,
      practicalRating: 4,
      submittedDate: '2026-08-20',
      status: 'submitted'
    },
    notes: 'Actively working on Module 5: Observability & OpenTelemetry chaos testing.'
  },
  {
    id: 'enr-student-02-k8s-cert',
    programId: 'prog-novacore-k8s-cert',
    studentId: 'demo-student-id',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@skillsetu.demo',
    studentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    institutionId: 'inst_nit',
    institutionName: 'National Institute of Technology',
    organizationId: 'org-novacore',
    organizationName: 'NovaCore DevOps & Cloud',
    organizationLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80',
    programTitle: 'Production Kubernetes & Multi-Cluster Platform Engineering',
    programType: 'Certification Course',
    domain: 'DevOps & Platform Engineering',
    targetSkills: ['Kubernetes', 'Docker', 'CI/CD Pipelines', 'ArgoCD & GitOps', 'Istio Service Mesh'],
    enrollmentDate: '2026-07-10',
    status: 'Completed',
    completedModuleIds: ['k8s-m1', 'k8s-m2', 'k8s-m3', 'k8s-m4'],
    totalModulesCount: 4,
    progressPercentage: 100, // 4/4 = 100%
    lastActiveDate: '2026-08-15',
    mentorFeedback: {
      mentorName: 'Pooja Iyer',
      mentorTitle: 'Staff SRE & CNCF Ambassador',
      feedbackText: 'Completed all multi-cluster labs ahead of schedule. Excellent demonstration of declarative GitOps using ArgoCD with canary progressive rollouts.',
      technicalRating: 5,
      practicalRating: 5,
      submittedDate: '2026-08-16',
      status: 'submitted'
    },
    completionRecord: {
      completedDate: '2026-08-16',
      achievedSkills: ['Kubernetes', 'Docker', 'CI/CD Pipelines', 'ArgoCD & GitOps', 'Istio Service Mesh'],
      certificateIssued: true,
      certificateId: 'CERT-NC-K8S-2026-8841',
      certificateNumber: 'NC-ECKPS-992174',
      verificationStatus: 'verified',
      signatoryName: 'Pooja Iyer',
      signatoryTitle: 'Lead Platform Mentor & CNCF Ambassador',
      gradeOrDistinction: 'Distinction',
      verificationHash: 'sha256-e9f73b8a1c6e2d4f8b0a9c7e3f1a5b8d2c4e6a8b0d2f4e6a8b0c2d4e6f8a0b2c'
    },
    notes: 'Official Enterprise Credential issued and linked to Career Passport.'
  },
  {
    id: 'enr-student-03-mlops',
    programId: 'prog-google-mlops-bootcamp',
    studentId: 'student-rohit-02',
    studentName: 'Rohit Verma',
    studentEmail: 'rohit.v@nit.ac.in',
    institutionId: 'inst_nit',
    institutionName: 'National Institute of Technology',
    organizationId: 'org-google-partner',
    organizationName: 'AI Studio & Cloud Partner Labs',
    programTitle: 'Generative AI & Production LLMOps Bootcamp',
    programType: 'Bootcamp',
    domain: 'Artificial Intelligence & Machine Learning',
    targetSkills: ['Gemini API & LLMs', 'RAG & Vector Databases', 'FastAPI & Python'],
    enrollmentDate: '2026-08-10',
    status: 'In Progress',
    completedModuleIds: ['ai-m1', 'ai-m2'],
    totalModulesCount: 4,
    progressPercentage: 50,
    lastActiveDate: '2026-08-22'
  },
  {
    id: 'enr-student-04-cyber',
    programId: 'prog-tcs-cyber-mentorship',
    studentId: 'student-sneha-03',
    studentName: 'Sneha Patel',
    studentEmail: 'sneha.p@nit.ac.in',
    institutionId: 'inst_nit',
    institutionName: 'National Institute of Technology',
    organizationId: 'org-tata-cyber',
    organizationName: 'Tata Consultancy Services - Cyber Defense',
    programTitle: '1-on-1 SOC Analyst & Threat Hunting Industry Mentorship',
    programType: 'Mentorship Program',
    domain: 'Cybersecurity & Defense',
    targetSkills: ['Threat Intelligence', 'SIEM & SOC Operations', 'Incident Response'],
    enrollmentDate: '2026-08-01',
    status: 'In Progress',
    completedModuleIds: ['soc-m1', 'soc-m2', 'soc-m3'],
    totalModulesCount: 4,
    progressPercentage: 75,
    lastActiveDate: '2026-08-25',
    mentorFeedback: {
      mentorName: 'Ananya Roy',
      mentorTitle: 'Principal Threat Intelligence Lead',
      feedbackText: 'Strong analytical mindset in correlating Zeek network conn logs with Windows Sysmon event IDs.',
      technicalRating: 5,
      practicalRating: 4,
      submittedDate: '2026-08-23',
      status: 'submitted'
    }
  }
];
