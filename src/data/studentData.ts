import {
  CareerReadinessScoreData,
  SkillAssessed,
  ActiveApplication,
  Certification,
  Opportunity,
  StudentProject,
  AssessmentQuestion
} from '../types/student';

export const STUDENT_READINESS_DATA: CareerReadinessScoreData = {
  overallScore: 87,
  percentile: 96,
  tier: 'Tier-1 Industry Ready',
  monthlyChange: 8.4,
  targetRole: 'Senior Full Stack & Distributed Systems Engineer',
  targetRoleMatch: 92,
  scoreBreakdown: [
    { domain: 'System Architecture', score: 86, benchmark: 75, fullMark: 100 },
    { domain: 'Frontend & UI Craft', score: 94, benchmark: 78, fullMark: 100 },
    { domain: 'Backend & APIs', score: 90, benchmark: 76, fullMark: 100 },
    { domain: 'Cloud & Kubernetes', score: 82, benchmark: 68, fullMark: 100 },
    { domain: 'Algorithmic Problem Solving', score: 88, benchmark: 72, fullMark: 100 },
    { domain: 'Engineering Collaboration', score: 91, benchmark: 80, fullMark: 100 }
  ],
  historicalTrends: [
    { month: 'Mar', readinessScore: 68, industryBenchmark: 70, peerAverage: 62 },
    { month: 'Apr', readinessScore: 72, industryBenchmark: 70, peerAverage: 64 },
    { month: 'May', readinessScore: 76, industryBenchmark: 72, peerAverage: 65 },
    { month: 'Jun', readinessScore: 81, industryBenchmark: 74, peerAverage: 68 },
    { month: 'Jul', readinessScore: 84, industryBenchmark: 75, peerAverage: 70 },
    { month: 'Aug', readinessScore: 87, industryBenchmark: 76, peerAverage: 71 }
  ],
  strengths: [
    'Modern React & State Architecture (Top 3% percentile)',
    'High-throughput REST & GraphQL API Design',
    'Real-time WebSocket & Distributed Cache Patterns',
    'Clean Code & CI/CD Pipeline Automation'
  ],
  growthOpportunities: [
    'Deepen Kubernetes Custom Resource Definitions (CRDs)',
    'Distributed Consensus Algorithms (Raft & Paxos)',
    'Vector Embeddings & Hybrid Search Optimization'
  ]
};

export const STUDENT_SKILLS_ASSESSED: SkillAssessed[] = [
  {
    id: 'sk-1',
    name: 'React 19 & Next.js Architecture',
    category: 'Frontend',
    score: 95,
    level: 'Expert',
    verifiedBy: 'NovaCore Technologies & Meta OSS',
    verificationBadge: 'Verified Master',
    lastAssessed: 'Aug 18, 2026',
    assessmentType: 'AI Adaptive',
    growth: 14,
    endorsements: 34,
    industryDemand: 'Very High',
    relatedProjects: ['Nexus Realtime Workspace', 'Pulse Analytics Dashboard']
  },
  {
    id: 'sk-2',
    name: 'TypeScript & Type-Level Programming',
    category: 'Frontend',
    score: 92,
    level: 'Expert',
    verifiedBy: 'SkillSetu AI Engine',
    verificationBadge: 'Verified Pro',
    lastAssessed: 'Aug 14, 2026',
    assessmentType: 'Proctored Coding',
    growth: 8,
    endorsements: 28,
    industryDemand: 'Very High',
    relatedProjects: ['Nexus Realtime Workspace', 'Distributed Cache Engine']
  },
  {
    id: 'sk-3',
    name: 'Node.js & High-Throughput APIs',
    category: 'Backend',
    score: 90,
    level: 'Advanced',
    verifiedBy: 'CloudScale Labs',
    verificationBadge: 'Verified Pro',
    lastAssessed: 'Aug 10, 2026',
    assessmentType: 'Industry Lab',
    growth: 12,
    endorsements: 22,
    industryDemand: 'Very High',
    relatedProjects: ['Microservices Gateway', 'Event Telemetry Pipeline']
  },
  {
    id: 'sk-4',
    name: 'PostgreSQL & Drizzle ORM',
    category: 'Backend',
    score: 88,
    level: 'Advanced',
    verifiedBy: 'DataBridge Inc.',
    verificationBadge: 'Verified Pro',
    lastAssessed: 'Jul 28, 2026',
    assessmentType: 'AI Adaptive',
    growth: 10,
    endorsements: 19,
    industryDemand: 'High',
    relatedProjects: ['Multi-tenant SaaS Engine']
  },
  {
    id: 'sk-5',
    name: 'Docker & Kubernetes Orchestration',
    category: 'Cloud & DevOps',
    score: 83,
    level: 'Advanced',
    verifiedBy: 'Apex University Faculty',
    verificationBadge: 'Verified Associate',
    lastAssessed: 'Aug 04, 2026',
    assessmentType: 'Industry Lab',
    growth: 16,
    endorsements: 15,
    industryDemand: 'Very High',
    relatedProjects: ['Cloud Infrastructure Sandbox']
  },
  {
    id: 'sk-6',
    name: 'Distributed Systems & Concurrency',
    category: 'System Design',
    score: 86,
    level: 'Advanced',
    verifiedBy: 'NovaCore Architecture Board',
    verificationBadge: 'Verified Pro',
    lastAssessed: 'Aug 02, 2026',
    assessmentType: 'Proctored Coding',
    growth: 9,
    endorsements: 31,
    industryDemand: 'Very High',
    relatedProjects: ['Distributed Cache Engine']
  },
  {
    id: 'sk-7',
    name: 'Vector Databases & LLM Prompting',
    category: 'AI & Data',
    score: 84,
    level: 'Intermediate',
    verifiedBy: 'SkillSetu AI Lab',
    verificationBadge: 'Verified Associate',
    lastAssessed: 'Aug 16, 2026',
    assessmentType: 'AI Adaptive',
    growth: 22,
    endorsements: 17,
    industryDemand: 'Very High',
    relatedProjects: ['Enterprise Knowledge RAG Engine']
  },
  {
    id: 'sk-8',
    name: 'CI/CD & GitHub Actions',
    category: 'Cloud & DevOps',
    score: 89,
    level: 'Advanced',
    verifiedBy: 'SkillSetu AI Engine',
    verificationBadge: 'Verified Pro',
    lastAssessed: 'Jul 20, 2026',
    assessmentType: 'Peer Review',
    growth: 7,
    endorsements: 20,
    industryDemand: 'High',
    relatedProjects: ['Nexus Realtime Workspace']
  },
  {
    id: 'sk-9',
    name: 'Agile Leadership & Peer Code Review',
    category: 'Soft Skills',
    score: 91,
    level: 'Expert',
    verifiedBy: 'Dr. Rajesh Nair & Apex Faculty',
    verificationBadge: 'Verified Leader',
    lastAssessed: 'Aug 12, 2026',
    assessmentType: 'Peer Review',
    growth: 5,
    endorsements: 42,
    industryDemand: 'High',
    relatedProjects: ['Team Capstone Cohort 2026']
  }
];

export const STUDENT_ACTIVE_APPLICATIONS: ActiveApplication[] = [
  {
    id: 'app-1',
    company: 'NovaCore Technologies',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    roleTitle: 'Software Engineer - Full Stack & Systems',
    location: 'Bengaluru, India (Hybrid)',
    workType: 'Hybrid',
    employmentType: 'Internship',
    appliedDate: 'Aug 04, 2026',
    currentStage: 'Interview',
    stageStep: 4,
    totalSteps: 5,
    matchScore: 96,
    stipendOrSalary: '₹85,000 / month + Pre-Placement Offer (₹28 LPA)',
    nextStepDeadline: 'Aug 24, 2026 • 03:30 PM',
    nextStepTitle: 'Virtual Architecture & Systems Round with Principal Architect',
    recruiterContact: {
      name: 'Priya Sundaram',
      role: 'Head of Engineering Talent',
      email: 'priya.s@novacore-tech.io',
      phone: '+91 98450 11234'
    },
    notes: 'Cleared technical coding round with 100% test case pass rate. Highly impressed with Kafka & Redis cache benchmark demo.',
    status: 'urgent',
    timelineHistory: [
      { id: 't-1', stage: 'Applied', title: 'Application Submitted', date: 'Aug 04, 2026', description: 'Submitted resume, GitHub profile and verified SkillSetu credentials', completed: true },
      { id: 't-2', stage: 'Shortlisted', title: 'Shortlisted by Campus Talent Team', date: 'Aug 09, 2026', description: 'Profile verified with 96% match score on Distributed Systems benchmark', completed: true },
      { id: 't-3', stage: 'Assessment', title: 'Proctored Systems Coding Assessment', date: 'Aug 15, 2026', description: 'Scored 100% on async queues and concurrency problem set', completed: true },
      { id: 't-4', stage: 'Interview', title: 'Virtual Architecture & Systems Round', date: 'Aug 24, 2026', description: 'Deep dive into microservices telemetry and distributed caching', completed: false, current: true },
      { id: 't-5', stage: 'Selected', title: 'Offer Letter Release', date: 'Pending', description: 'Final committee evaluation and compensation confirmation', completed: false }
    ]
  },
  {
    id: 'app-2',
    company: 'CloudScale Infrastructure',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80',
    roleTitle: 'Full Stack Platform Developer',
    location: 'Hyderabad, India (Remote)',
    workType: 'Remote',
    employmentType: 'Full-time',
    appliedDate: 'Jul 29, 2026',
    currentStage: 'Selected',
    stageStep: 5,
    totalSteps: 5,
    matchScore: 98,
    stipendOrSalary: '₹24,00,000 / annum CTC + RSUs',
    nextStepDeadline: 'Aug 30, 2026',
    nextStepTitle: 'Offer Letter Acceptance & Digital Onboarding Signature',
    recruiterContact: {
      name: 'Vikram Joshi',
      role: 'Talent Acquisition Partner',
      email: 'v.joshi@cloudscale.net',
      phone: '+91 91234 56780'
    },
    notes: 'Official Offer Released! Verified Skills badge fast-tracked through hiring pipeline in 9 calendar days.',
    status: 'offer',
    timelineHistory: [
      { id: 't-1', stage: 'Applied', title: 'Applied via SkillSetu FastTrack', date: 'Jul 29, 2026', description: 'Application submitted with Verified React & Cloud Specialization badges', completed: true },
      { id: 't-2', stage: 'Shortlisted', title: 'Direct Profile Shortlisting', date: 'Aug 02, 2026', description: 'Hiring manager skipped initial screening based on 98% skill match', completed: true },
      { id: 't-3', stage: 'Assessment', title: 'Platform Architecture Exercise', date: 'Aug 06, 2026', description: 'Submitted resilient multi-tenant dashboard project with 94/100 grade', completed: true },
      { id: 't-4', stage: 'Interview', title: 'Final VP & Culture Alignment Round', date: 'Aug 12, 2026', description: 'Passed unanimous hiring committee review', completed: true },
      { id: 't-5', stage: 'Selected', title: 'Offer Letter Released ($24 LPA CTC)', date: 'Aug 18, 2026', description: 'Official employment contract released with join date of Oct 01, 2026', completed: true, current: true }
    ]
  },
  {
    id: 'app-3',
    company: 'DataBridge AI & Analytics',
    companyLogo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=120&auto=format&fit=crop&q=80',
    roleTitle: 'AI Solutions & RAG Engineer Micro-Intern',
    location: 'Singapore (Remote)',
    workType: 'Remote',
    employmentType: 'Micro-Internship',
    appliedDate: 'Aug 12, 2026',
    currentStage: 'Assessment',
    stageStep: 3,
    totalSteps: 5,
    matchScore: 91,
    stipendOrSalary: '$1,800 USD stipend (8 Weeks)',
    nextStepDeadline: 'Aug 23, 2026 • 11:59 PM',
    nextStepTitle: 'Vector Search Benchmark & RAG Pipeline Submission',
    recruiterContact: {
      name: 'Marcus Chen',
      role: 'AI Tech Lead',
      email: 'm.chen@databridge.ai'
    },
    notes: 'Submitted initial proposal for indexing 100k unstructured PDF docs with sub-second semantic retrieval.',
    status: 'active',
    timelineHistory: [
      { id: 't-1', stage: 'Applied', title: 'Micro-Internship Application', date: 'Aug 12, 2026', description: 'Submitted GitHub repository of VektorFlow hybrid RAG project', completed: true },
      { id: 't-2', stage: 'Shortlisted', title: 'AI Engineering Review', date: 'Aug 16, 2026', description: 'Shortlisted among top 5 candidates for 8-week international sprint', completed: true },
      { id: 't-3', stage: 'Assessment', title: 'Vector Indexing Benchmark Task', date: 'Aug 23, 2026', description: 'Task: Index 10k legal tokens in pgvector and submit latency report', completed: false, current: true },
      { id: 't-4', stage: 'Interview', title: 'Technical Lead Walkthrough', date: 'Pending', description: 'Live code review of benchmark implementation', completed: false },
      { id: 't-5', stage: 'Selected', title: 'Grant Allocation & Project Kickoff', date: 'Pending', description: 'Fellowship disbursement & repository access', completed: false }
    ]
  },
  {
    id: 'app-4',
    company: 'Apex FinTech Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&auto=format&fit=crop&q=80',
    roleTitle: 'Backend Security & High-Frequency API Dev',
    location: 'Mumbai, India (On-site)',
    workType: 'On-site',
    employmentType: 'Full-time',
    appliedDate: 'Aug 08, 2026',
    currentStage: 'Shortlisted',
    stageStep: 2,
    totalSteps: 5,
    matchScore: 89,
    stipendOrSalary: '₹22,00,000 / annum CTC',
    nextStepDeadline: 'Aug 26, 2026',
    nextStepTitle: 'Profile Review by Risk Engineering Director & Assessment Invite',
    recruiterContact: {
      name: 'Ananya Deshmukh',
      role: 'University Relations Lead',
      email: 'ananya.d@apexfintech.com'
    },
    notes: 'Shortlisted among top 20 candidates out of 450 campus applicants.',
    status: 'in-review',
    timelineHistory: [
      { id: 't-1', stage: 'Applied', title: 'Campus Drive Application', date: 'Aug 08, 2026', description: 'Applied for Full-time High-Frequency Security Engineer position', completed: true },
      { id: 't-2', stage: 'Shortlisted', title: 'First Stage University Shortlist', date: 'Aug 14, 2026', description: 'Top 20 selected out of 450 applicants on campus', completed: true, current: true },
      { id: 't-3', stage: 'Assessment', title: 'Cryptographic Protocols & SQL Test', date: 'Aug 26, 2026', description: '60-minute proctored transaction consistency challenge', completed: false },
      { id: 't-4', stage: 'Interview', title: 'Risk Engineering Technical Panel', date: 'Pending', description: 'System design for financial ledger idempotency', completed: false },
      { id: 't-5', stage: 'Selected', title: 'Pre-Placement Offer Release', date: 'Pending', description: 'Final background verification & compensation package', completed: false }
    ]
  },
  {
    id: 'app-5',
    company: 'SkyGrid Cloud Systems',
    companyLogo: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=120&auto=format&fit=crop&q=80',
    roleTitle: 'Cloud DevOps & SRE Engineering Intern',
    location: 'Pune, India (Hybrid)',
    workType: 'Hybrid',
    employmentType: 'Internship',
    appliedDate: 'Aug 18, 2026',
    currentStage: 'Applied',
    stageStep: 1,
    totalSteps: 5,
    matchScore: 89,
    stipendOrSalary: '₹70,00,000 / month + PPO',
    nextStepDeadline: 'Aug 27, 2026',
    nextStepTitle: 'Automated Resume & GitHub Infrastructure Verification',
    recruiterContact: {
      name: 'Nikhil Kulkarni',
      role: 'DevOps Hiring Partner',
      email: 'nikhil@skygridcloud.io'
    },
    notes: 'Submitted CloudMesh proxy project showcasing Helm charts and Prometheus telemetry.',
    status: 'active',
    timelineHistory: [
      { id: 't-1', stage: 'Applied', title: 'Application Received & In Queue', date: 'Aug 18, 2026', description: 'Submitted application with AWS and Docker certifications', completed: true, current: true },
      { id: 't-2', stage: 'Shortlisted', title: 'Infrastructure Lead Review', date: 'Pending', description: 'Reviewing automated deployment pipelines on GitHub', completed: false },
      { id: 't-3', stage: 'Assessment', title: 'Kubernetes Cluster Debugging Lab', date: 'Pending', description: 'Hands-on crashloopbackoff mitigation scenario', completed: false },
      { id: 't-4', stage: 'Interview', title: 'SRE Team Pairing Session', date: 'Pending', description: 'Live troubleshooting and chaos engineering discussion', completed: false },
      { id: 't-5', stage: 'Selected', title: 'Internship Onboarding', date: 'Pending', description: 'Access provisioning and team welcome', completed: false }
    ]
  },
  {
    id: 'app-6',
    company: 'HyperScale AI Labs',
    companyLogo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=120&auto=format&fit=crop&q=80',
    roleTitle: 'Frontend UI/UX Performance Architect Intern',
    location: 'Bengaluru, India (Hybrid)',
    workType: 'Hybrid',
    employmentType: 'Internship',
    appliedDate: 'Aug 01, 2026',
    currentStage: 'Shortlisted',
    stageStep: 2,
    totalSteps: 5,
    matchScore: 95,
    stipendOrSalary: '₹75,000 / month + PPO',
    nextStepDeadline: 'Aug 29, 2026',
    nextStepTitle: 'Initial Recruiter Fitment & Canvas Architecture Screen',
    recruiterContact: {
      name: 'Rohit Verma',
      role: 'Talent Scout',
      email: 'rohit@hyperscale.ai'
    },
    notes: 'Portfolio review highlighted 60 FPS Canvas rendering capability with zero frame drops.',
    status: 'in-review',
    timelineHistory: [
      { id: 't-1', stage: 'Applied', title: 'Application Submitted', date: 'Aug 01, 2026', description: 'Submitted Aura UI accessible design system showcase', completed: true },
      { id: 't-2', stage: 'Shortlisted', title: 'Design & Code Review Passed', date: 'Aug 11, 2026', description: 'Aura UI accessibility audit scored AAA by design staff', completed: true, current: true },
      { id: 't-3', stage: 'Assessment', title: 'Component Crafting Challenge', date: 'Aug 29, 2026', description: 'Building interactive graph visualizer under 16ms render budget', completed: false },
      { id: 't-4', stage: 'Interview', title: 'Principal UI Architect Discussion', date: 'Pending', description: 'Web performance optimization and DOM paint deep-dive', completed: false },
      { id: 't-5', stage: 'Selected', title: 'Internship Agreement', date: 'Pending', description: 'PPO contract release', completed: false }
    ]
  },
  {
    id: 'app-7',
    company: 'Pulse Health & Fitness',
    companyLogo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=120&auto=format&fit=crop&q=80',
    roleTitle: 'Mobile App Developer (React Native / iOS)',
    location: 'Bengaluru, India (On-site)',
    workType: 'On-site',
    employmentType: 'Full-time',
    appliedDate: 'Aug 06, 2026',
    currentStage: 'Interview',
    stageStep: 4,
    totalSteps: 5,
    matchScore: 87,
    stipendOrSalary: '₹18,00,000 / annum CTC',
    nextStepDeadline: 'Aug 27, 2026 • 11:00 AM',
    nextStepTitle: 'Live Mobile Coding & Offline-First Sync Architecture Round',
    recruiterContact: {
      name: 'Simran Kaur',
      role: 'Engineering Recruiter',
      email: 'simran.k@pulsehealth.app'
    },
    notes: 'Completed take-home mobile task with offline SQLite synchronization and smooth Reanimated gestures.',
    status: 'urgent',
    timelineHistory: [
      { id: 't-1', stage: 'Applied', title: 'Job Application Received', date: 'Aug 06, 2026', description: 'Applied for React Native Mobile Developer position', completed: true },
      { id: 't-2', stage: 'Shortlisted', title: 'Mobile Portfolio Screen Cleared', date: 'Aug 10, 2026', description: 'Demonstrated proficiency in TypeScript & component animations', completed: true },
      { id: 't-3', stage: 'Assessment', title: 'Offline Workout Tracker Take-Home', date: 'Aug 17, 2026', description: 'Delivered fully functional prototype with 100% test coverage', completed: true },
      { id: 't-4', stage: 'Interview', title: 'Live Coding & Lead Engineer Pairing', date: 'Aug 27, 2026', description: 'Interactive pairing on Bluetooth biometric data streams', completed: false, current: true },
      { id: 't-5', stage: 'Selected', title: 'Offer Letter', date: 'Pending', description: 'Final CTC rollout and fitness perks bundle', completed: false }
    ]
  },
  {
    id: 'app-8',
    company: 'Aura Creative Suite',
    companyLogo: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=120&auto=format&fit=crop&q=80',
    roleTitle: 'Product Design & UX Engineering Intern',
    location: 'San Francisco, CA (Remote)',
    workType: 'Remote',
    employmentType: 'Internship',
    appliedDate: 'Jul 20, 2026',
    currentStage: 'Selected',
    stageStep: 5,
    totalSteps: 5,
    matchScore: 93,
    stipendOrSalary: '$4,500 / month USD ($54,000 annualized)',
    nextStepDeadline: 'Sep 01, 2026',
    nextStepTitle: 'Sign Remote Consulting Agreement & Equipment Delivery Confirmation',
    recruiterContact: {
      name: 'Elena Rostova',
      role: 'Head of Product Operations',
      email: 'elena@auracreative.io'
    },
    notes: 'Selected for international remote summer cohort! MacBook Pro hardware package dispatched.',
    status: 'offer',
    timelineHistory: [
      { id: 't-1', stage: 'Applied', title: 'Global Remote Internship Application', date: 'Jul 20, 2026', description: 'Submitted Figma tokens integration case study', completed: true },
      { id: 't-2', stage: 'Shortlisted', title: 'Design Leadership Review', date: 'Jul 26, 2026', description: 'Top 3% design system submission internationally', completed: true },
      { id: 't-3', stage: 'Assessment', title: 'Design Token Interactive Prototype', date: 'Aug 03, 2026', description: 'Built fluid light/dark theme switcher with zero layout shift', completed: true },
      { id: 't-4', stage: 'Interview', title: 'Founders & Design Director Chat', date: 'Aug 10, 2026', description: 'Discussed creative tooling ergonomics and micro-interactions', completed: true },
      { id: 't-5', stage: 'Selected', title: 'Offer Letter Accepted & Signed', date: 'Aug 17, 2026', description: 'Internship confirmed at $4,500/mo starting September 2026', completed: true, current: true }
    ]
  },
  {
    id: 'app-9',
    company: 'DecentralScale Labs',
    companyLogo: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&auto=format&fit=crop&q=80',
    roleTitle: 'Blockchain & Smart Contract Developer Intern',
    location: 'London, UK (Remote)',
    workType: 'Remote',
    employmentType: 'Internship',
    appliedDate: 'Aug 19, 2026',
    currentStage: 'Applied',
    stageStep: 1,
    totalSteps: 5,
    matchScore: 84,
    stipendOrSalary: '£2,500 / month',
    nextStepDeadline: 'Aug 31, 2026',
    nextStepTitle: 'Smart Contract Test Suite & EVM Security Verification',
    recruiterContact: {
      name: 'Arthur Pendelton',
      role: 'Web3 Protocol Lead',
      email: 'arthur@decentralscale.io'
    },
    notes: 'Submitted Foundry test repository for token staking smart contract.',
    status: 'active',
    timelineHistory: [
      { id: 't-1', stage: 'Applied', title: 'Web3 Grant & Internship Application', date: 'Aug 19, 2026', description: 'Applied via verified developer credential portal', completed: true, current: true },
      { id: 't-2', stage: 'Shortlisted', title: 'Smart Contract Audit Check', date: 'Pending', description: 'Automated Slither & Mythril vulnerability scan', completed: false },
      { id: 't-3', stage: 'Assessment', title: 'Gas Optimization Challenge', date: 'Pending', description: 'Reduce contract gas consumption by >20%', completed: false },
      { id: 't-4', stage: 'Interview', title: 'Protocol Core Team Sync', date: 'Pending', description: 'Zero-knowledge proofs and EVM architecture', completed: false },
      { id: 't-5', stage: 'Selected', title: 'Grant Release', date: 'Pending', description: 'Token allocation & onboarding', completed: false }
    ]
  },
  {
    id: 'app-10',
    company: 'TeraByte Systems Inc.',
    companyLogo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&auto=format&fit=crop&q=80',
    roleTitle: 'High-Scale Database & Storage Engine Engineer',
    location: 'Seattle, WA (Remote)',
    workType: 'Remote',
    employmentType: 'Full-time',
    appliedDate: 'Jul 15, 2026',
    currentStage: 'Rejected',
    stageStep: 3,
    totalSteps: 5,
    matchScore: 78,
    stipendOrSalary: '$110,000 / year + Equity',
    nextStepDeadline: 'Nov 15, 2026',
    nextStepTitle: 'Skill Gap Identified: LSM Trees & C++ Kernel Storage (Re-apply in 90 days)',
    recruiterContact: {
      name: 'David Vance',
      role: 'Core Systems Recruiter',
      email: 'd.vance@terabyte-systems.com'
    },
    notes: 'Strong candidate in distributed theory, but role requires 2+ years C++ storage kernel production experience. Recommended completing SkillSetu Storage Engine Track.',
    rejectionReason: 'Storage engine team required senior-level C++ RocksDB internals experience not yet demonstrated in portfolio.',
    feedback: 'Excellent grasp of Raft consensus and networking. We encourage re-applying after completing a low-level NVMe storage project.',
    status: 'rejected',
    timelineHistory: [
      { id: 't-1', stage: 'Applied', title: 'Application Submitted', date: 'Jul 15, 2026', description: 'Applied for US Core Systems engineering role', completed: true },
      { id: 't-2', stage: 'Shortlisted', title: 'Systems Theory Screen Cleared', date: 'Jul 22, 2026', description: 'Scored 92% on distributed algorithms quiz', completed: true },
      { id: 't-3', stage: 'Assessment', title: 'Low-Level Storage Engine Coding Challenge', date: 'Jul 29, 2026', description: 'Submitted LSM compaction prototype in Rust/C++', completed: true },
      { id: 't-4', stage: 'Rejected', title: 'Position Filled by Senior Candidate', date: 'Aug 05, 2026', description: 'Constructive feedback provided; fast-track reapplication token issued', completed: true, current: true }
    ]
  }
];

export const STUDENT_CERTIFICATIONS: Certification[] = [
  {
    id: 'cert-1',
    title: 'Certified Distributed Systems Architect (CDSA)',
    issuer: 'NovaCore Enterprise Academy',
    issuerLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    issueDate: 'Aug 2026',
    expiryDate: 'Aug 2028',
    credentialId: 'NC-CDSA-2026-98214',
    verificationUrl: 'https://verify.skillsetu.ai/cert/NC-CDSA-98214',
    skills: ['Distributed Consensus', 'Event Sourcing', 'Kafka', 'Redis Caching', 'Kubernetes'],
    gradeScore: '96.5% (Distinction)',
    badgeLevel: 'Platinum',
    status: 'verified',
    blockchainHash: '0x8f2c3d9a1e0b5f6a8e7d2c1b9a0f3e4d5c6b7a8'
  },
  {
    id: 'cert-2',
    title: 'Full Stack Cloud Native Specialization',
    issuer: 'Apex Institute of Technology & AWS',
    issuerLogo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=120&auto=format&fit=crop&q=80',
    issueDate: 'Jul 2026',
    expiryDate: 'Jul 2029',
    credentialId: 'AIT-AWS-FS-2026-4412',
    verificationUrl: 'https://verify.skillsetu.ai/cert/AIT-AWS-4412',
    skills: ['AWS ECS/EKS', 'PostgreSQL', 'Docker', 'Terraform', 'CI/CD Pipelines'],
    gradeScore: '94.0%',
    badgeLevel: 'Gold',
    status: 'verified',
    blockchainHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0'
  },
  {
    id: 'cert-3',
    title: 'Enterprise React & Modern TypeScript Master',
    issuer: 'SkillSetu AI Global Accreditation',
    issuerLogo: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=120&auto=format&fit=crop&q=80',
    issueDate: 'Jun 2026',
    expiryDate: 'Lifetime Valid',
    credentialId: 'SS-REACT-TS-2026-1049',
    verificationUrl: 'https://verify.skillsetu.ai/cert/SS-REACT-1049',
    skills: ['React 19', 'Server Components', 'TypeScript Generic Programming', 'Zustand', 'Tailwind CSS'],
    gradeScore: '98.2% (Top 1%)',
    badgeLevel: 'Platinum',
    status: 'verified',
    blockchainHash: '0x99a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a'
  },
  {
    id: 'cert-4',
    title: 'Generative AI & Vector Embeddings Engineering',
    issuer: 'DataBridge AI Research Lab',
    issuerLogo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=120&auto=format&fit=crop&q=80',
    issueDate: 'May 2026',
    expiryDate: 'May 2028',
    credentialId: 'DB-GENAI-2026-8834',
    verificationUrl: 'https://verify.skillsetu.ai/cert/DB-GENAI-8834',
    skills: ['RAG Pipelines', 'Vector Indexing', 'Embeddings', 'LangChain', 'OpenAI / Gemini SDK'],
    gradeScore: '91.8%',
    badgeLevel: 'Gold',
    status: 'verified',
    blockchainHash: '0x3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2'
  }
];

export const STUDENT_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Software Engineer - Full Stack & Systems',
    company: 'NovaCore Technologies',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    industry: 'Cloud Infrastructure & High-Performance Computing',
    location: 'Bengaluru, India (Hybrid)',
    city: 'Bengaluru',
    type: 'Summer Internship',
    mode: 'Hybrid',
    stipend: '₹85,000 / month + PPO (₹28 LPA)',
    salaryMin: 85000,
    salaryMax: 95000,
    postedDate: '2 days ago',
    deadline: 'Aug 28, 2026',
    deadlineDate: '2026-08-28',
    matchScore: 84,
    matchingSkills: ['Python', 'React', 'SQL'],
    missingSkills: ['Docker'],
    skillsRequired: ['Python', 'React', 'SQL', 'DSA', 'Docker'],
    description: 'Work alongside core infrastructure architects to design high-availability distributed pipelines handling over 500k RPS with sub-10ms P99 latency guarantees.',
    responsibilities: [
      'Design and deploy asynchronous event-driven microservices using Python, React, and SQL database pipelines.',
      'Contribute to internal telemetry dashboards with React and performant SQL query optimization.',
      'Containerize distributed applications and collaborate with DevOps engineers.'
    ],
    requirements: [
      'Strong foundations in Python, React, SQL, and Data Structures & Algorithms (DSA).',
      'Familiarity with containerization paradigms (Docker/OCI) and scalable API design.',
      'Enrolled in B.Tech/M.Tech Computer Science, IT or related STEM degree (2026/2027 grad).'
    ],
    perks: [
      'Pre-Placement Offer (PPO) opportunity up to ₹28 LPA CTC',
      'One-on-one mentorship by Principal System Architects',
      'MacBook Pro M3 Max workstation provided',
      'Monthly wellness & broadband stipend'
    ],
    hiringProcess: ['SkillSetu Verified Fast-Track Screen', 'Algorithmic Problem Solving (60 mins)', 'System Architecture & Fitment', 'Offer Letter'],
    openings: 4,
    applicantsCount: 64,
    featured: true,
    duration: '6 Months (Jul - Dec 2026)',
    experienceLevel: 'Intern'
  },
  {
    id: 'opp-2',
    title: 'Full Stack Platform Developer (Early Career)',
    company: 'CloudScale Infrastructure',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    industry: 'Enterprise SaaS & Cloud Management',
    location: 'Hyderabad, India (Remote)',
    city: 'Hyderabad',
    type: 'Full-time',
    mode: 'Remote',
    stipend: '₹24,00,000 / annum CTC + RSUs',
    salaryMin: 200000,
    salaryMax: 220000,
    postedDate: '3 days ago',
    deadline: 'Aug 30, 2026',
    deadlineDate: '2026-08-30',
    matchScore: 96,
    matchingSkills: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    missingSkills: ['GraphQL'],
    skillsRequired: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'GraphQL'],
    description: 'Build enterprise cloud management dashboards, microservices integrations, and telemetry visualization tools for 1,200+ global enterprises.',
    responsibilities: [
      'Architect resilient REST and GraphQL APIs serving hundreds of thousands of daily active users.',
      'Develop scalable React web applications with state-of-the-art caching, optimistic updates, and clean modular UI.',
      'Participate in CI/CD pipeline automation and database schema migration workflows using Drizzle ORM.'
    ],
    requirements: [
      'Proficiency in TypeScript, Node.js runtime, and relational database modeling with PostgreSQL.',
      'Experience building responsive client interfaces with modern CSS tooling (Tailwind).',
      'Passion for scalable software design and robust test-driven development (TDD).'
    ],
    perks: [
      '100% Remote flexibility with home-office setup grant (₹50,000)',
      'Annual equity grant (RSUs) with fast vesting',
      'Comprehensive family medical and term insurance',
      'Annual learning & conference budget ($1,500 USD)'
    ],
    hiringProcess: ['Verified Profile Review', 'Take-Home Project / Live Coding', 'Engineering Leadership Round', 'HR & Offer'],
    openings: 5,
    applicantsCount: 112,
    featured: true,
    duration: 'Permanent Full-time',
    experienceLevel: 'Fresh Graduate'
  },
  {
    id: 'opp-3',
    title: 'AI Solutions & RAG Micro-Internship',
    company: 'DataBridge AI & Analytics',
    companyLogo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    industry: 'Generative AI & Enterprise Knowledge Systems',
    location: 'Singapore (Remote)',
    city: 'Singapore',
    type: 'Micro-Internship',
    mode: 'Remote',
    stipend: '$1,800 USD stipend (8 Weeks)',
    salaryMin: 1800,
    salaryMax: 1800,
    postedDate: '1 day ago',
    deadline: 'Aug 25, 2026',
    deadlineDate: '2026-08-25',
    matchScore: 94,
    matchingSkills: ['Python', 'Vector DBs', 'TypeScript', 'API Integration'],
    missingSkills: ['LangChain / LlamaIndex'],
    skillsRequired: ['Python', 'Vector DBs', 'TypeScript', 'API Integration', 'LLMs'],
    description: 'Collaborate with global AI researchers to implement domain-specific semantic retrieval and structured knowledge distillation pipelines.',
    responsibilities: [
      'Implement hybrid lexical and dense vector search pipelines utilizing pgvector and Pinecone.',
      'Benchmark chunking strategies and semantic reranking algorithms across 100k+ technical documents.',
      'Create streamlined client demonstration prototypes in React and Next.js.'
    ],
    requirements: [
      'Understanding of modern LLM architectures, embeddings, and prompting techniques.',
      'Familiarity with Python (FastAPI/PyTorch) and Node/TypeScript.',
      'Ability to deliver measurable milestones in an agile 8-week sprint structure.'
    ],
    perks: [
      'Co-authorship opportunities on enterprise AI whitepapers',
      'Direct recommendation letter from Chief AI Scientist',
      'Flexible working hours (15-20 hours/week)',
      'Potential extension to 6-month graduate fellowship'
    ],
    hiringProcess: ['Skill DNA & GitHub Evaluation', '30-min Technical Discussion', 'Instant Onboarding'],
    openings: 2,
    applicantsCount: 48,
    featured: false,
    duration: '8 Weeks (Aug - Oct 2026)',
    experienceLevel: 'Intern'
  },
  {
    id: 'opp-4',
    title: 'High-Frequency FinTech Systems Engineer',
    company: 'Apex FinTech Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80',
    industry: 'Quantitative Trading & Algorithmic FinTech',
    location: 'Mumbai, India (On-site)',
    city: 'Mumbai',
    type: 'Full-time',
    mode: 'On-site',
    stipend: '₹22,00,000 / annum CTC',
    salaryMin: 180000,
    salaryMax: 200000,
    postedDate: '5 days ago',
    deadline: 'Sep 05, 2026',
    deadlineDate: '2026-09-05',
    matchScore: 91,
    matchingSkills: ['Distributed Cache', 'WebSockets', 'System Design'],
    missingSkills: ['C++', 'Go'],
    skillsRequired: ['C++', 'Go', 'Distributed Cache', 'WebSockets', 'System Design'],
    description: 'Engineer sub-millisecond order routing gateways and fault-tolerant event streams with zero-loss auditability for multi-asset trading desks.',
    responsibilities: [
      'Optimize core trading socket connections and FIX protocol message parsers for minimal latency.',
      'Construct high-throughput memory-mapped ring buffers and lockless data structures.',
      'Participate in disaster recovery drills and high-availability failover simulations.'
    ],
    requirements: [
      'Strong foundations in C++ (17/20) or Go concurrency primitives (Goroutines/Channels).',
      'Knowledge of network protocols (TCP/UDP, WebSockets) and memory allocation optimizations.',
      'Competitive programming ranking or verified algorithmic certification is a strong plus.'
    ],
    perks: [
      'Competitive year-end performance bonus (up to 30% CTC)',
      'Subsidized luxury housing near Bandra Kurla Complex (BKC)',
      'Daily gourmet meals and wellness gym membership',
      'Sponsored international financial engineering certifications'
    ],
    hiringProcess: ['Proctored Coding Assessment', 'Low-Level System Design Round', 'Trading Desk Partner Round'],
    openings: 4,
    applicantsCount: 88,
    featured: false,
    duration: 'Permanent Full-time',
    experienceLevel: '0-1 Years'
  },
  {
    id: 'opp-5',
    title: 'Open Source Fellow: Rust Kernel Optimizations',
    company: 'VectorSphere Open Source',
    companyLogo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    industry: 'Open Source Systems & WebAssembly',
    location: 'Global (Remote)',
    city: 'Remote Global',
    type: 'Open Source Gig',
    mode: 'Remote',
    stipend: '$3,000 USD Fellowship Grant',
    salaryMin: 3000,
    salaryMax: 3000,
    postedDate: '4 days ago',
    deadline: 'Sep 10, 2026',
    deadlineDate: '2026-09-10',
    matchScore: 92,
    matchingSkills: ['Rust', 'CI/CD', 'Memory Profiling'],
    missingSkills: ['WebAssembly'],
    skillsRequired: ['Rust', 'WebAssembly', 'Memory Profiling', 'CI/CD'],
    description: 'Contribute directly to an Apache-licensed vector indexing engine deployed across Fortune 500 edge nodes and browser WebAssembly runtimes.',
    responsibilities: [
      'Identify memory allocation bottlenecks in SIMD vector quantization kernels.',
      'Compile compute-heavy Rust algorithms to WebAssembly for client-side vector search.',
      'Author technical RFCs, benchmarks, and community documentation.'
    ],
    requirements: [
      'Proficiency in Rust, ownership semantics, lifetimes, and unsafe code auditing.',
      'Experience with GitHub collaborative PR workflows and automated GitHub Actions testing.',
      'Demonstrated passion for open source software and developer tooling.'
    ],
    perks: [
      '$3,000 USD non-dilutive fellowship grant paid monthly',
      'Global public attribution in release notes and GitHub repo',
      'Direct 1-on-1 mentorship with core maintainers',
      'Sponsored attendance to RustConf 2026'
    ],
    hiringProcess: ['GitHub PR / Contribution Review', '30-min Technical Sync', 'Grant Disbursement'],
    openings: 2,
    applicantsCount: 35,
    featured: true,
    duration: '3 Months (Flexible)',
    experienceLevel: 'Intern'
  },
  {
    id: 'opp-6',
    title: 'Frontend UI/UX Performance Architect Intern',
    company: 'HyperScale AI Labs',
    companyLogo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    industry: 'Interactive Web & Creative AI Interfaces',
    location: 'Bengaluru, India (Hybrid)',
    city: 'Bengaluru',
    type: 'Summer Internship',
    mode: 'Hybrid',
    stipend: '₹75,000 / month + PPO',
    salaryMin: 75000,
    salaryMax: 80000,
    postedDate: '6 days ago',
    deadline: 'Sep 02, 2026',
    deadlineDate: '2026-09-02',
    matchScore: 95,
    matchingSkills: ['React 19', 'Tailwind CSS', 'State Engines', 'Accessibility'],
    missingSkills: ['WebGL / Three.js'],
    skillsRequired: ['React 19', 'Tailwind CSS', 'WebGL', 'State Engines', 'Accessibility'],
    description: 'Design responsive canvas workspaces and real-time visualization dashboards with sub-16ms (60 FPS) frame budget and WCAG AAA accessibility.',
    responsibilities: [
      'Develop dynamic canvas rendering modules and data flow pipelines for large-scale graph visualizations.',
      'Eliminate DOM layout thrashing and optimize memoization across complex React components.',
      'Collaborate with UI designers in Figma to build accessible tokens and micro-interactions.'
    ],
    requirements: [
      'Strong grasp of modern React 19, custom hooks, and Tailwind CSS utility architecture.',
      'Eye for design details, typography rhythm, and smooth micro-animations.',
      'Understanding of browser rendering lifecycle (Reflow, Repaint, Compositing).'
    ],
    perks: [
      'Full-time PPO conversion based on intern project demo',
      'Ergonomic workstation setup + monitor allowance',
      'Flexible work hours with 2 remote days per week',
      'Access to bleeding-edge AI models & developer previews'
    ],
    hiringProcess: ['Portfolio / Code Review', 'Component Crafting Challenge (Live)', 'Team Culture Round'],
    openings: 3,
    applicantsCount: 79,
    featured: false,
    duration: '6 Months',
    experienceLevel: 'Intern'
  },
  {
    id: 'opp-7',
    title: 'Cloud DevOps & SRE Engineering Intern',
    company: 'SkyGrid Cloud Systems',
    companyLogo: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    industry: 'Cloud Infrastructure & SRE',
    location: 'Pune, India (Hybrid)',
    city: 'Pune',
    type: 'Summer Internship',
    mode: 'Hybrid',
    stipend: '₹70,000 / month + PPO',
    salaryMin: 70000,
    salaryMax: 75000,
    postedDate: '1 day ago',
    deadline: 'Sep 12, 2026',
    deadlineDate: '2026-09-12',
    matchScore: 89,
    matchingSkills: ['Docker', 'Kubernetes', 'CI/CD'],
    missingSkills: ['Terraform', 'Prometheus / Grafana'],
    skillsRequired: ['Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Prometheus'],
    description: 'Help manage multi-region Kubernetes clusters, create automated Terraform infrastructure-as-code scripts, and configure Prometheus alerting.',
    responsibilities: [
      'Automate deployment pipelines using GitHub Actions, Helm charts, and ArgoCD.',
      'Monitor cluster health, SLOs, and write runbooks for automated incident mitigation.',
      'Conduct cloud cost optimization audits across AWS and GCP environments.'
    ],
    requirements: [
      'Hands-on experience with Linux command line, shell scripting, and Docker containers.',
      'Basic knowledge of Kubernetes architecture (Pods, Deployments, Services, Ingress).',
      'Curiosity for high-availability systems and fault-tolerant architectures.'
    ],
    perks: [
      'PPO opportunity at ₹20 LPA CTC upon graduation',
      'Free AWS Certified Solutions Architect exam voucher',
      'Relocation assistance & corporate housing allowance',
      'Fun team offsites in Goa & Himachal'
    ],
    hiringProcess: ['Automated DevOps Quiz', 'Hands-on Debugging Lab', 'Managerial Fitment'],
    openings: 3,
    applicantsCount: 52,
    featured: false,
    duration: '6 Months',
    experienceLevel: 'Intern'
  },
  {
    id: 'opp-8',
    title: 'Mobile App Developer (React Native / iOS)',
    company: 'Pulse Health & Fitness',
    companyLogo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80',
    industry: 'Digital Health & Consumer Tech',
    location: 'Bengaluru, India (On-site)',
    city: 'Bengaluru',
    type: 'Full-time',
    mode: 'On-site',
    stipend: '₹18,00,000 / annum CTC',
    salaryMin: 150000,
    salaryMax: 165000,
    postedDate: '4 days ago',
    deadline: 'Sep 15, 2026',
    deadlineDate: '2026-09-15',
    matchScore: 87,
    matchingSkills: ['TypeScript', 'React 19', 'State Engines'],
    missingSkills: ['React Native', 'Swift / iOS'],
    skillsRequired: ['React Native', 'TypeScript', 'iOS / Swift', 'Tailwind CSS', 'GraphQL'],
    description: 'Craft beautiful, buttery-smooth mobile experiences for 3 million active users tracking workouts, biometric telemetry, and nutrition.',
    responsibilities: [
      'Build native device integrations with Apple HealthKit and Google Health Connect.',
      'Implement offline-first data caching with WatermelonDB and SQLite sync.',
      'Ensure 60 FPS scroll performance and fluid layout transitions.'
    ],
    requirements: [
      'Strong React Native or React web fundamentals with TypeScript.',
      'Experience with component animation libraries (Reanimated, Framer Motion).',
      'Published app on App Store / Play Store is a huge advantage.'
    ],
    perks: [
      'Free premium gym membership and personalized fitness coaching',
      'Annual smartwatch / wearable gadget reimbursement',
      'Catered healthy lunches and barista coffee bar on-site',
      'Stock options with high upside potential'
    ],
    hiringProcess: ['Portfolio / App Demo Review', 'Live Mobile Coding Session', 'Product & Culture Interview'],
    openings: 2,
    applicantsCount: 61,
    featured: false,
    duration: 'Permanent Full-time',
    experienceLevel: 'Fresh Graduate'
  },
  {
    id: 'opp-9',
    title: 'Data Science & Analytics Intern',
    company: 'Quantum Insights Inc.',
    companyLogo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    industry: 'Predictive Analytics & Enterprise BI',
    location: 'Gurugram, India (Hybrid)',
    city: 'Gurugram',
    type: 'Summer Internship',
    mode: 'Hybrid',
    stipend: '₹60,000 / month',
    salaryMin: 60000,
    salaryMax: 65000,
    postedDate: '3 days ago',
    deadline: 'Sep 08, 2026',
    deadlineDate: '2026-09-08',
    matchScore: 85,
    matchingSkills: ['Python', 'PostgreSQL', 'Data Visualization'],
    missingSkills: ['Pandas / Scikit-Learn', 'Tableau / PowerBI'],
    skillsRequired: ['Python', 'SQL', 'Pandas', 'Data Visualization', 'Machine Learning'],
    description: 'Analyze complex multi-million row behavioral datasets, build predictive churn models, and author automated executive KPI dashboards.',
    responsibilities: [
      'Perform exploratory data analysis (EDA) on transactional datasets in PostgreSQL and Snowflake.',
      'Train, evaluate, and tune regression and classification models using Scikit-Learn.',
      'Translate raw metrics into actionable visual dashboards using D3 and React.'
    ],
    requirements: [
      'Strong mathematical and statistical intuition (Probability, Linear Algebra, Hypothesis Testing).',
      'Proficiency in SQL querying and Python data libraries (Pandas, NumPy, Matplotlib).',
      'Clear communication skills for presenting findings to business stakeholders.'
    ],
    perks: [
      'Mentorship from Senior Data Scientists and Harvard alumni',
      'Direct exposure to Fortune 100 enterprise datasets',
      'Hybrid work flexibility with modern cyber-city office',
      'Possibility of pre-placement offer'
    ],
    hiringProcess: ['Data Analysis Assignment', 'Technical Presentation Round', 'Final Discussion'],
    openings: 3,
    applicantsCount: 94,
    featured: false,
    duration: '4 Months',
    experienceLevel: 'Intern'
  },
  {
    id: 'opp-10',
    title: 'Cybersecurity Analyst & Threat Hunting Co-op',
    company: 'Sentinel Defense Cyber',
    companyLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    industry: 'Cybersecurity & Defense Intelligence',
    location: 'Hyderabad, India (On-site)',
    city: 'Hyderabad',
    type: 'Co-op',
    mode: 'On-site',
    stipend: '₹65,000 / month',
    salaryMin: 65000,
    salaryMax: 70000,
    postedDate: '5 days ago',
    deadline: 'Sep 18, 2026',
    deadlineDate: '2026-09-18',
    matchScore: 82,
    matchingSkills: ['Linux', 'Networking', 'Python'],
    missingSkills: ['SIEM / Splunk', 'Penetration Testing'],
    skillsRequired: ['Network Security', 'Linux', 'Python', 'SIEM', 'Threat Analysis'],
    description: 'Assist the Security Operations Center (SOC) in monitoring real-time intrusion alerts, auditing code for OWASP Top 10 vulnerabilities, and conducting vulnerability scans.',
    responsibilities: [
      'Triage and investigate automated SIEM telemetry security alerts.',
      'Execute static and dynamic application security testing (SAST/DAST) in CI/CD pipelines.',
      'Author incident response reports and security remediation guidelines.'
    ],
    requirements: [
      'Understanding of networking protocols (DNS, TLS, HTTP/HTTPS, SSH, Firewalls).',
      'Familiarity with common vulnerability classes (SQLi, XSS, CSRF, SSRF, IDOR).',
      'Certifications like CEH, Security+, or active participation in CTFs is valued.'
    ],
    perks: [
      'State-of-the-art SOC lab environment and hardware tokens',
      'Company-sponsored CEH / OSCP training and exam vouchers',
      'Fast-track placement in Cyber Defense practice upon graduation',
      'Health insurance and daily meals included'
    ],
    hiringProcess: ['Security Fundamentals Quiz', 'Hands-on Vulnerability Lab', 'Director Interview'],
    openings: 2,
    applicantsCount: 42,
    featured: false,
    duration: '6 Months Co-op',
    experienceLevel: 'Intern'
  },
  {
    id: 'opp-11',
    title: 'QA & Automated Testing Engineer (SDET)',
    company: 'TestFlow Automation',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    industry: 'Software Quality & DevTools',
    location: 'Chennai, India (Hybrid)',
    city: 'Chennai',
    type: 'Full-time',
    mode: 'Hybrid',
    stipend: '₹14,00,000 / annum CTC',
    salaryMin: 110000,
    salaryMax: 120000,
    postedDate: '3 days ago',
    deadline: 'Sep 22, 2026',
    deadlineDate: '2026-09-22',
    matchScore: 90,
    matchingSkills: ['TypeScript', 'Node.js', 'CI/CD'],
    missingSkills: ['Playwright / Cypress', 'Load Testing (k6)'],
    skillsRequired: ['TypeScript', 'Playwright', 'Jest', 'CI/CD', 'API Testing'],
    description: 'Design comprehensive end-to-end automated testing suites, synthetic monitoring scripts, and load testing harnesses for enterprise web platforms.',
    responsibilities: [
      'Develop robust Playwright and Jest test suites covering critical user checkout workflows.',
      'Integrate automated smoke and regression test triggers in GitHub Actions pipelines.',
      'Benchmark API endpoint performance and latency under high concurrent load with k6.'
    ],
    requirements: [
      'Solid programming proficiency in TypeScript or JavaScript.',
      'Experience writing unit, integration, or browser automated tests.',
      'Analytical mindset with sharp attention to edge cases and race conditions.'
    ],
    perks: [
      'Comprehensive medical insurance for employee and parents',
      'Flexible working hours with work-from-home options',
      'Dedicated annual upskilling budget of ₹80,000',
      'Quarterly team celebrations and hackathons'
    ],
    hiringProcess: ['Automated Coding Screen', 'Test Case Design & Automation Round', 'HR Discussion'],
    openings: 3,
    applicantsCount: 57,
    featured: false,
    duration: 'Permanent Full-time',
    experienceLevel: 'Fresh Graduate'
  },
  {
    id: 'opp-12',
    title: 'Blockchain & Smart Contract Developer Intern',
    company: 'DecentralScale Labs',
    companyLogo: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&auto=format&fit=crop&q=80',
    industry: 'Web3, Cryptography & Decentralized Finance',
    location: 'London, UK (Remote)',
    city: 'London',
    type: 'Summer Internship',
    mode: 'Remote',
    stipend: '£2,500 / month',
    salaryMin: 2500,
    salaryMax: 2800,
    postedDate: '2 days ago',
    deadline: 'Sep 25, 2026',
    deadlineDate: '2026-09-25',
    matchScore: 84,
    matchingSkills: ['TypeScript', 'API Integration', 'Distributed Systems'],
    missingSkills: ['Solidity', 'Ethers.js / Viem'],
    skillsRequired: ['Solidity', 'TypeScript', 'Ethers.js', 'Smart Contract Auditing', 'Hardhat'],
    description: 'Build secure, gas-optimized smart contracts on Ethereum and Layer-2 rollups with automated invariant testing and zero-knowledge proofs.',
    responsibilities: [
      'Write and deploy Solidity contracts with comprehensive Foundry and Hardhat test suites.',
      'Integrate frontend dApps using Viem, Wagmi, and Next.js with sub-second wallet sync.',
      'Audit contracts for common vulnerabilities (Reentrancy, Frontrunning, Overflow).'
    ],
    requirements: [
      'Understanding of EVM mechanics, gas optimization, and cryptographic primitives.',
      'Familiarity with Solidity and TypeScript web frontend integration.',
      'Enthusiasm for decentralized finance, governance, and verifiable computing.'
    ],
    perks: [
      'Payment in GBP or USD stablecoins directly to your preferred account',
      'Token grant allocations in upcoming protocol decentralization',
      'Remote-first international engineering culture',
      'Sponsored travel to ETHCC or Devcon 2026'
    ],
    hiringProcess: ['Smart Contract Code Review', 'Live Gas Optimization Task', 'Founder Sync'],
    openings: 2,
    applicantsCount: 38,
    featured: true,
    duration: '3-6 Months',
    experienceLevel: 'Intern'
  },
  {
    id: 'opp-13',
    title: 'Embedded Systems & IoT Firmware Engineer',
    company: 'NeuroGrid Robotics',
    companyLogo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    industry: 'Robotics & Hardware Automation',
    location: 'Bengaluru, India (On-site)',
    city: 'Bengaluru',
    type: 'Full-time',
    mode: 'On-site',
    stipend: '₹16,00,000 / annum CTC',
    salaryMin: 130000,
    salaryMax: 140000,
    postedDate: '4 days ago',
    deadline: 'Sep 28, 2026',
    deadlineDate: '2026-09-28',
    matchScore: 80,
    matchingSkills: ['C++', 'Linux', 'Problem Solving'],
    missingSkills: ['Embedded C', 'RTOS / FreeRTOS', 'SPI / I2C'],
    skillsRequired: ['C/C++', 'RTOS', 'Microcontrollers', 'I2C/SPI', 'IoT Protocols'],
    description: 'Develop real-time sensor fusion firmware on ARM Cortex-M microcontrollers for autonomous industrial robotic rovers and drones.',
    responsibilities: [
      'Write bare-metal and FreeRTOS firmware drivers for IMUs, LiDAR, and optical encoders.',
      'Optimize power consumption and memory footprint on resource-constrained microcontrollers.',
      'Implement secure OTA (over-the-air) firmware updates over MQTT and BLE.'
    ],
    requirements: [
      'Strong programming skills in C and modern C++.',
      'Knowledge of embedded peripherals (UART, SPI, I2C, CAN, DMA).',
      'B.Tech/M.Tech in Electronics, Electrical, Robotics, or Computer Engineering.'
    ],
    perks: [
      'Access to advanced robotics testing arena and hardware lab on campus',
      'Patent filing bonuses and intellectual property royalties',
      'Daily cafeteria meals and transport shuttle service',
      'Comprehensive medical insurance coverage'
    ],
    hiringProcess: ['Hardware / C Assessment', 'Lab Firmware Debugging Session', 'Executive Round'],
    openings: 2,
    applicantsCount: 31,
    featured: false,
    duration: 'Permanent Full-time',
    experienceLevel: 'Fresh Graduate'
  },
  {
    id: 'opp-14',
    title: 'Product Design & UX Engineering Intern',
    company: 'Aura Creative Suite',
    companyLogo: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&auto=format&fit=crop&q=80',
    industry: 'Design Tooling & Creator Economy',
    location: 'San Francisco, CA (Remote)',
    city: 'San Francisco',
    type: 'Summer Internship',
    mode: 'Remote',
    stipend: '$4,500 / month',
    salaryMin: 4500,
    salaryMax: 5000,
    postedDate: '2 days ago',
    deadline: 'Sep 14, 2026',
    deadlineDate: '2026-09-14',
    matchScore: 93,
    matchingSkills: ['React 19', 'Tailwind CSS', 'Accessibility'],
    missingSkills: ['Figma Tokens', 'Motion / Design Systems'],
    skillsRequired: ['Figma', 'React 19', 'Tailwind CSS', 'Design Systems', 'Micro-interactions'],
    description: 'Bridge the gap between world-class product design and production code by creating atomic component systems and fluid interactive canvas prototypes.',
    responsibilities: [
      'Build reusable, themeable UI components in React with strict token synchronization from Figma.',
      'Conduct user testing sessions to iterate on navigation ergonomics and cognitive load.',
      'Author interactive documentation, guidelines, and accessibility audits.'
    ],
    requirements: [
      'Strong portfolio showcasing both visual design craft in Figma and live coded components.',
      'Deep understanding of typography, color harmony, spatial grids, and WCAG standards.',
      'Proficiency in React, HTML5, and modern CSS/Tailwind.'
    ],
    perks: [
      'High monthly stipend ($4,500 USD) with global remote onboarding',
      'Latest Apple M3 Max MacBook + high-res 4K monitor setup allowance',
      'Direct collaboration with former Apple and Airbnb design leads',
      'Potential for full-time sponsorship and relocation visa'
    ],
    hiringProcess: ['Portfolio Walkthrough', 'Live Component Redesign Pairing', 'Design Team Meet & Greet'],
    openings: 2,
    applicantsCount: 84,
    featured: true,
    duration: '4-6 Months',
    experienceLevel: 'Intern'
  },
  {
    id: 'opp-15',
    title: 'Machine Learning Research Engineer (NLP & Audio)',
    company: 'Vocalis AI Laboratories',
    companyLogo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    industry: 'Speech AI & Generative Audio',
    location: 'Bengaluru, India (Hybrid)',
    city: 'Bengaluru',
    type: 'Full-time',
    mode: 'Hybrid',
    stipend: '₹26,00,000 / annum CTC',
    salaryMin: 220000,
    salaryMax: 240000,
    postedDate: '5 days ago',
    deadline: 'Sep 30, 2026',
    deadlineDate: '2026-09-30',
    matchScore: 86,
    matchingSkills: ['Python', 'Vector DBs', 'Problem Solving'],
    missingSkills: ['PyTorch', 'Transformers / HuggingFace', 'CUDA'],
    skillsRequired: ['Python', 'PyTorch', 'HuggingFace', 'Transformers', 'Audio Processing'],
    description: 'Fine-tune multi-lingual speech recognition and real-time voice synthesis models running sub-100ms streaming inference on edge and cloud GPUs.',
    responsibilities: [
      'Train diffusion and autoregressive acoustic models on massive multi-lingual audio corpuses.',
      'Optimize model quantization (INT8, FP8) using TensorRT-LLM and ONNX runtime.',
      'Deploy low-latency streaming inference pipelines over gRPC and WebRTC.'
    ],
    requirements: [
      'Strong knowledge of deep learning architectures (Transformers, Conformer, Diffusion).',
      'Extensive experience with PyTorch, CUDA, and distributed GPU training (DDP/FSDP).',
      'Publications in NeurIPS, ICASSP, ACL, or Interspeech is a strong plus.'
    ],
    perks: [
      'Access to dedicated cluster of 128x NVIDIA H100 GPUs for research runs',
      'Substantial equity stock options with top-tier VC backing',
      'Unlimited book, research paper, and conference reimbursement',
      'Comprehensive wellness package and international health coverage'
    ],
    hiringProcess: ['ML Paper & Code Review', 'Deep Learning Architecture Deep Dive', 'Founder / CTO Sync'],
    openings: 2,
    applicantsCount: 45,
    featured: true,
    duration: 'Permanent Full-time',
    experienceLevel: '0-1 Years'
  },
  {
    id: 'opp-16',
    title: 'Site Reliability & Cloud Security Co-op',
    company: 'Apex Cloud Defense',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    industry: 'Enterprise Security & Resilience',
    location: 'Noida, India (Hybrid)',
    city: 'Noida',
    type: 'Co-op',
    mode: 'Hybrid',
    stipend: '₹55,000 / month',
    salaryMin: 55000,
    salaryMax: 60000,
    postedDate: '3 days ago',
    deadline: 'Oct 05, 2026',
    deadlineDate: '2026-10-05',
    matchScore: 88,
    matchingSkills: ['Docker', 'Kubernetes', 'CI/CD'],
    missingSkills: ['AWS IAM & KMS', 'Vault / Zero Trust'],
    skillsRequired: ['Kubernetes', 'AWS', 'Zero Trust', 'HashiCorp Vault', 'CI/CD'],
    description: 'Implement Zero-Trust access controls, secrets management with HashiCorp Vault, and automated compliance auditing across multi-tenant cloud systems.',
    responsibilities: [
      'Enforce least-privilege IAM policies and ephemeral credentials for all microservices.',
      'Build automated compliance scanning rules for CIS benchmarks and SOC2 Type II.',
      'Participate in chaos engineering experiments and automated disaster recovery tests.'
    ],
    requirements: [
      'Good understanding of cloud security principles, encryption, and certificate management.',
      'Experience with Docker, Kubernetes RBAC, and Infrastructure-as-Code.',
      'Enrolled in University Computer Science / Cybersecurity degree program.'
    ],
    perks: [
      'Pre-Placement Offer (PPO) conversion based on semester co-op performance',
      'Free corporate cafeteria and gym access in Sector 62 tech park',
      'Company laptop and flexible hybrid schedule (3 days remote)',
      'Mentorship from Senior Cloud Security Architects'
    ],
    hiringProcess: ['Technical Security MCQ', 'Infrastructure Configuration Scenario', 'HR Sync'],
    openings: 4,
    applicantsCount: 49,
    featured: false,
    duration: '6 Months (Jul - Dec 2026)',
    experienceLevel: 'Intern'
  },
  {
    id: 'opp-17',
    title: 'E-Commerce Platform & Checkout Backend Intern',
    company: 'OmniCart Retail Tech',
    companyLogo: 'https://images.unsplash.com/photo-1556742049-0a67e5572263?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80',
    industry: 'E-Commerce & High-Volume Payments',
    location: 'Bengaluru, India (Hybrid)',
    city: 'Bengaluru',
    type: 'Summer Internship',
    mode: 'Hybrid',
    stipend: '₹70,000 / month + PPO',
    salaryMin: 70000,
    salaryMax: 75000,
    postedDate: '1 day ago',
    deadline: 'Sep 06, 2026',
    deadlineDate: '2026-09-06',
    matchScore: 94,
    matchingSkills: ['TypeScript', 'Node.js', 'PostgreSQL', 'Distributed Cache'],
    missingSkills: ['Payment Gateways (Stripe/Razorpay)'],
    skillsRequired: ['TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Payment Gateways'],
    description: 'Work on high-concurrency shopping cart reservation systems, flash sale inventory locks, and international payment orchestration services.',
    responsibilities: [
      'Build idempotent payment webhook handlers with zero double-charge risk.',
      'Optimize Redis distributed locking (Redlock) for flash sale inventory allocation.',
      'Write database indexing migration scripts for queries handling 100M+ orders.'
    ],
    requirements: [
      'Strong understanding of database transactions (ACID properties, isolation levels).',
      'Proficiency in Node.js, TypeScript, and SQL queries with PostgreSQL.',
      'Eager to learn high-volume distributed system design patterns.'
    ],
    perks: [
      'PPO package at ₹22 LPA CTC for top performers',
      'Employee discount vouchers across 500+ partner e-commerce brands',
      'Modern open-office workspace in Koramangala, Bengaluru',
      'Regular tech brown-bag talks and knowledge sharing sessions'
    ],
    hiringProcess: ['Data Structures & SQL Challenge', 'Concurrency System Design Round', 'Hiring Manager Chat'],
    openings: 5,
    applicantsCount: 104,
    featured: false,
    duration: '6 Months',
    experienceLevel: 'Intern'
  },
  {
    id: 'opp-18',
    title: 'EdTech Full-Stack & Gamification Developer',
    company: 'MindSpark Learning',
    companyLogo: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
    industry: 'EdTech & Gamified Learning',
    location: 'Pune, India (Remote)',
    city: 'Pune',
    type: 'Full-time',
    mode: 'Remote',
    stipend: '₹15,00,000 / annum CTC',
    salaryMin: 125000,
    salaryMax: 135000,
    postedDate: '4 days ago',
    deadline: 'Sep 20, 2026',
    deadlineDate: '2026-09-20',
    matchScore: 92,
    matchingSkills: ['React 19', 'TypeScript', 'Node.js', 'Tailwind CSS'],
    missingSkills: ['WebSockets Gamification Engine'],
    skillsRequired: ['React 19', 'TypeScript', 'Node.js', 'Tailwind CSS', 'WebSockets'],
    description: 'Build interactive coding classrooms, live multiplayer coding battles, and automated instant test runner environments for 500k students.',
    responsibilities: [
      'Create responsive sandbox coding playgrounds with Monaco Editor and live execution preview.',
      'Implement real-time multiplayer leaderboard sync with WebSockets and Redis Pub/Sub.',
      'Craft delightful achievement animations, streak badges, and social learning feeds.'
    ],
    requirements: [
      'Solid command over React, TypeScript, and modern component state patterns.',
      'Experience with responsive styling in Tailwind CSS and micro-interactions.',
      'Passion for education, gamification, and making learning intuitive and fun.'
    ],
    perks: [
      '100% Remote work from anywhere in India',
      'Free access to all company learning tracks and masterclasses',
      'Generous annual leave policy (30 paid days + birthday off)',
      'Home workstation budget of ₹40,000'
    ],
    hiringProcess: ['Interactive Component Take-Home', 'Full-Stack Architecture Interview', 'Culture & Values Fit'],
    openings: 3,
    applicantsCount: 71,
    featured: false,
    duration: 'Permanent Full-time',
    experienceLevel: 'Fresh Graduate'
  },
  {
    id: 'opp-19',
    title: 'ClimateTech & Smart Energy IoT Analytics Intern',
    company: 'TerraGrid Sustainability',
    companyLogo: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&auto=format&fit=crop&q=80',
    industry: 'ClimateTech & Renewable Energy Grid',
    location: 'Berlin, Germany (Remote)',
    city: 'Berlin',
    type: 'Summer Internship',
    mode: 'Remote',
    stipend: '€2,200 / month',
    salaryMin: 2200,
    salaryMax: 2400,
    postedDate: '3 days ago',
    deadline: 'Sep 24, 2026',
    deadlineDate: '2026-09-24',
    matchScore: 88,
    matchingSkills: ['Python', 'PostgreSQL', 'Data Visualization', 'TypeScript'],
    missingSkills: ['Time-Series DBs (TimescaleDB / InfluxDB)'],
    skillsRequired: ['Python', 'Time-Series DB', 'TypeScript', 'D3.js', 'IoT Telemetry'],
    description: 'Process time-series energy metrics from 10,000+ smart solar microgrids across Europe to forecast renewable output and balance grid loads.',
    responsibilities: [
      'Develop continuous time-series aggregation pipelines in TimescaleDB and Python.',
      'Build responsive energy production mapping charts and heatmaps using React and D3.',
      'Train solar irradiance regression models to predict peak generation windows.'
    ],
    requirements: [
      'Experience working with time-series data, SQL queries, and Python analytics.',
      'Knowledge of frontend charting libraries (D3, Recharts, or Chart.js).',
      'Strong alignment with climate action, renewable energy, and sustainable tech.'
    ],
    perks: [
      'Competitive European stipend (€2,200/month) paid with zero transfer deductions',
      'Direct contribution to carbon reduction metrics across 12 European countries',
      'Flexible working schedule across European and Asian timezones',
      'Letter of recommendation and international industry network'
    ],
    hiringProcess: ['Time-Series Data Task', 'Technical Code Walkthrough', 'Final Founder Conversation'],
    openings: 2,
    applicantsCount: 53,
    featured: false,
    duration: '4-6 Months',
    experienceLevel: 'Intern'
  },
  {
    id: 'opp-20',
    title: 'Autonomous Vehicle Simulation & Perception Engineer',
    company: 'Apex Mobility AI',
    companyLogo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&auto=format&fit=crop&q=80',
    industry: 'Autonomous Vehicles & Computer Vision',
    location: 'Austin, TX (Remote)',
    city: 'Austin',
    type: 'Summer Internship',
    mode: 'Remote',
    stipend: '$5,000 / month',
    salaryMin: 5000,
    salaryMax: 5500,
    postedDate: '5 days ago',
    deadline: 'Oct 01, 2026',
    deadlineDate: '2026-10-01',
    matchScore: 83,
    matchingSkills: ['C++', 'Python', 'Problem Solving'],
    missingSkills: ['ROS / ROS2', 'OpenCV / Point Clouds', 'CUDA'],
    skillsRequired: ['C++', 'Python', 'ROS2', 'Computer Vision', 'Simulation'],
    description: 'Simulate urban traffic scenarios and benchmark 3D bounding box object detection models in Carla and Gazebo for level-4 autonomous shuttle fleets.',
    responsibilities: [
      'Generate synthetic sensor scenarios with randomized weather and pedestrian trajectories.',
      'Benchmark perception pipeline latency and frame rates on NVIDIA Jetson edge compute modules.',
      'Analyze edge cases where LiDAR-camera sensor fusion confidence drops below safe limits.'
    ],
    requirements: [
      'Strong programming capability in C++ (14/17) and Python.',
      'Foundations in 3D geometry, transformations, and computer vision.',
      'Familiarity with Robot Operating System (ROS / ROS2) is strongly desired.'
    ],
    perks: [
      'Generous $5,000 USD monthly compensation with US payroll support',
      'Access to state-of-the-art simulation clusters and vehicle teleoperation data',
      'Opportunity to publish research papers with autonomous vehicle scientists',
      'Fast-track full-time sponsorship interview after graduation'
    ],
    hiringProcess: ['Algorithmic Screen', 'ROS2 & Computer Vision Technical Round', 'Team Lead Sync'],
    openings: 2,
    applicantsCount: 66,
    featured: true,
    duration: '3-6 Months',
    experienceLevel: 'Intern'
  },
  {
    id: 'opp-21',
    title: 'Developer Relations & Technical Content Engineer',
    company: 'DevRelX Global Network',
    companyLogo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    industry: 'Developer Ecosystem & Cloud APIs',
    location: 'Remote (Worldwide)',
    city: 'Worldwide',
    type: 'Part-time',
    mode: 'Remote',
    stipend: '$2,000 / month (Part-time)',
    salaryMin: 2000,
    salaryMax: 2200,
    postedDate: '2 days ago',
    deadline: 'Sep 16, 2026',
    deadlineDate: '2026-09-16',
    matchScore: 95,
    matchingSkills: ['TypeScript', 'React 19', 'Node.js', 'Technical Writing'],
    missingSkills: [],
    skillsRequired: ['TypeScript', 'React 19', 'API Docs', 'Technical Writing', 'Demo Apps'],
    description: 'Build open-source sample repositories, interactive tutorial playgrounds, and author in-depth technical blogs explaining modern full-stack architectures.',
    responsibilities: [
      'Create production-grade starter templates in Next.js, Vite, and Tailwind for developer showcases.',
      'Write clear, concise API reference guides and interactive code sandboxes.',
      'Engage with open-source contributors on Discord, GitHub Discussions, and Twitter/X.'
    ],
    requirements: [
      'Superb written communication in English with ability to explain complex concepts simply.',
      'Hands-on full stack coding experience with TypeScript, React, and REST APIs.',
      'Active developer profile (GitHub, Dev.to, Medium, or personal blog).'
    ],
    perks: [
      'Ultra-flexible part-time commitment (15-20 hours per week)',
      'Global public visibility across 250k+ newsletter subscribers',
      'Sponsored speaking trips to major developer conferences',
      'Hardware and streaming microphone equipment bundle provided'
    ],
    hiringProcess: ['Sample Tutorial Review', 'Live Technical Explainer Call', 'Onboarding'],
    openings: 3,
    applicantsCount: 41,
    featured: false,
    duration: '6 Months (Part-time)',
    experienceLevel: 'Intern'
  },
  {
    id: 'opp-22',
    title: 'High-Scale Database & Storage Engine Engineer',
    company: 'TeraByte Systems Inc.',
    companyLogo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=800&auto=format&fit=crop&q=80',
    industry: 'Database Systems & Storage Kernels',
    location: 'Seattle, WA (Remote)',
    city: 'Seattle',
    type: 'Full-time',
    mode: 'Remote',
    stipend: '$110,000 / year + Equity',
    salaryMin: 110000,
    salaryMax: 120000,
    postedDate: '6 days ago',
    deadline: 'Oct 10, 2026',
    deadlineDate: '2026-10-10',
    matchScore: 89,
    matchingSkills: ['Distributed Systems', 'PostgreSQL', 'Problem Solving'],
    missingSkills: ['LSM Trees / RocksDB', 'C++ / Rust Storage Engine'],
    skillsRequired: ['C++', 'Rust', 'LSM Trees', 'Distributed Storage', 'Operating Systems'],
    description: 'Design multi-tiered storage engines, Write-Ahead Logging (WAL) subsystems, and distributed compaction schedulers capable of sustaining billions of daily writes.',
    responsibilities: [
      'Optimize LSM-tree write amplification and SSTable compaction performance on NVMe SSDs.',
      'Implement distributed Raft consensus replication with automated leader election and split-brain resolution.',
      'Write deterministic crash-recovery fuzzers to verify storage integrity.'
    ],
    requirements: [
      'Deep understanding of operating systems, file systems, page caches, and IO multiplexing.',
      'Proficiency in systems programming with C++ (17/20) or Rust.',
      'Strong grasp of algorithmic complexity and distributed consistency guarantees.'
    ],
    perks: [
      'Competitive US base salary with equity stock grant',
      '100% remote working flexibility across any US/Global timezone',
      'Annual home ergonomics & computer hardware refresh ($3,000 USD)',
      'Comprehensive international health, dental, and vision insurance'
    ],
    hiringProcess: ['Systems Coding Challenge', 'Storage Engine Architecture Design', 'Engineering VP Interview'],
    openings: 2,
    applicantsCount: 39,
    featured: true,
    duration: 'Permanent Full-time',
    experienceLevel: '0-1 Years'
  },
  {
    id: 'opp-23',
    title: 'Enterprise FinTech Security & Compliance Intern',
    company: 'GlobalPay Security Labs',
    companyLogo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    industry: 'Financial Security & PCI-DSS Compliance',
    location: 'Mumbai, India (Hybrid)',
    city: 'Mumbai',
    type: 'Summer Internship',
    mode: 'Hybrid',
    stipend: '₹65,000 / month + PPO',
    salaryMin: 65000,
    salaryMax: 70000,
    postedDate: '4 days ago',
    deadline: 'Sep 19, 2026',
    deadlineDate: '2026-09-19',
    matchScore: 87,
    matchingSkills: ['Node.js', 'PostgreSQL', 'Network Security'],
    missingSkills: ['PCI-DSS Auditing', 'HSM / Key Management'],
    skillsRequired: ['Node.js', 'PostgreSQL', 'Cryptography', 'API Security', 'PCI-DSS'],
    description: 'Audit microservice tokenization vaults, evaluate symmetric AES-256 and asymmetric RSA key rotation protocols, and assist in automated PCI-DSS compliance verification.',
    responsibilities: [
      'Design secure envelope encryption layers for sensitive credit card and banking PAN storage.',
      'Automate dependency vulnerability scanning and automated patch verification.',
      'Conduct threat modeling workshops for upcoming international payment gateway integrations.'
    ],
    requirements: [
      'Strong fundamentals in backend development with Node.js/TypeScript or Java.',
      'Basic knowledge of applied cryptography (Hashing, HMAC, AES, RSA, TLS Handshake).',
      'High integrity, ethics, and passion for software security engineering.'
    ],
    perks: [
      'Pre-Placement Offer (PPO) package up to ₹19 LPA CTC upon graduation',
      'Corporate mentorship from Chief Information Security Officer (CISO)',
      'Subsidized transportation and corporate credit card for office expenses',
      'Sponsored certification voucher (AWS Security Specialty / CompTIA Security+)'
    ],
    hiringProcess: ['Security & Crypto Assessment', 'API Security Architecture Round', 'HR Fitment'],
    openings: 3,
    applicantsCount: 47,
    featured: false,
    duration: '6 Months',
    experienceLevel: 'Intern'
  },
  {
    id: 'opp-24',
    title: 'Cloud Data Pipeline & ETL Infrastructure Intern',
    company: 'DataStream Nexus',
    companyLogo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=120&auto=format&fit=crop&q=80',
    companyBanner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    industry: 'Big Data & Cloud Data Warehousing',
    location: 'Hyderabad, India (Hybrid)',
    city: 'Hyderabad',
    type: 'Summer Internship',
    mode: 'Hybrid',
    stipend: '₹75,000 / month + PPO',
    salaryMin: 75000,
    salaryMax: 80000,
    postedDate: '1 day ago',
    deadline: 'Sep 09, 2026',
    deadlineDate: '2026-09-09',
    matchScore: 93,
    matchingSkills: ['Python', 'PostgreSQL', 'Docker', 'Distributed Systems'],
    missingSkills: ['Apache Spark / Airflow'],
    skillsRequired: ['Python', 'SQL', 'Apache Spark', 'Airflow', 'Kafka', 'PostgreSQL'],
    description: 'Construct real-time streaming ETL pipelines ingesting 100+ million daily telemetry events into Apache Iceberg and Snowflake data lakes.',
    responsibilities: [
      'Build DAG workflows in Apache Airflow for automated daily data transformations and quality checks.',
      'Optimize PySpark batch jobs to reduce cloud cluster runtime and cost by 35%.',
      'Write data contract validation schemas to prevent upstream pipeline schema breaks.'
    ],
    requirements: [
      'Strong SQL querying skills and Python programming proficiency.',
      'Understanding of distributed computing concepts (MapReduce, Partitioning, Sharding).',
      'Curiosity for big data architectures and cloud storage formats (Parquet, Iceberg).'
    ],
    perks: [
      'PPO conversion opportunity with ₹21 LPA starting compensation',
      'Access to modern Snowflake, Databricks, and AWS enterprise sandbox',
      'Hybrid work flexibility in HITEC City, Hyderabad',
      'Comprehensive medical insurance and wellness stipends'
    ],
    hiringProcess: ['Data Engineering Coding & SQL Challenge', 'Data Architecture Scenario Interview', 'Final Discussion'],
    openings: 4,
    applicantsCount: 78,
    featured: false,
    duration: '6 Months',
    experienceLevel: 'Intern'
  }
];

export const STUDENT_PROJECTS: StudentProject[] = [
  {
    id: 'proj-1',
    title: 'Nexus: Distributed Collaborative Workspace',
    tagline: 'Real-time collaborative workspace with CRDTs, WebSockets & sub-10ms operational transforms',
    description: 'Architected a multi-tenant real-time canvas with zero data loss, conflict-free replicated data types (CRDTs), and optimistic UI synchronization for up to 50 concurrent editors.',
    category: 'Distributed Systems & Frontend',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    skills: ['React 19', 'TypeScript', 'WebSockets', 'Redis Streams', 'Tailwind CSS', 'Docker'],
    githubUrl: 'https://github.com/aaravsharma/nexus-realtime-engine',
    liveDemoUrl: 'https://nexus-realtime-demo.io',
    industryPartner: 'NovaCore Technologies Sponsor',
    mentorFeedbackScore: 98,
    verifiedStatus: 'Industry Verified',
    starsCount: 342,
    metrics: [
      { label: 'Latency', value: '< 8ms' },
      { label: 'Concurrent Users', value: '50+' },
      { label: 'Test Coverage', value: '96%' }
    ],
    completedDate: 'Aug 2026'
  },
  {
    id: 'proj-2',
    title: 'VektorFlow: Hybrid Vector RAG Pipeline',
    tagline: 'Enterprise document semantic search with hybrid lexical & dense embedding reranking',
    description: 'Developed an end-to-end RAG indexing engine capable of parsing 500+ page technical manuals with chunk optimization, sub-second latency, and citation lineage.',
    category: 'AI & Knowledge Systems',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    skills: ['Python', 'FastAPI', 'PostgreSQL pgvector', 'Gemini SDK', 'Docker', 'Drizzle ORM'],
    githubUrl: 'https://github.com/aaravsharma/vektorflow-hybrid-rag',
    liveDemoUrl: 'https://vektorflow-demo.io',
    industryPartner: 'DataBridge AI Labs',
    mentorFeedbackScore: 94,
    verifiedStatus: 'Industry Verified',
    starsCount: 189,
    metrics: [
      { label: 'Retrieval Accuracy', value: '94.2%' },
      { label: 'Latency', value: '180ms' },
      { label: 'Documents Indexed', value: '10,000+' }
    ],
    completedDate: 'Jul 2026'
  },
  {
    id: 'proj-3',
    title: 'CloudMesh: Microservices Ingress & Rate Limiter',
    tagline: 'High-throughput token bucket rate limiter & reverse proxy in Rust & Go',
    description: 'Built a lightweight reverse proxy with adaptive rate limiting, distributed token bucket algorithm, distributed telemetry tracing, and automatic circuit breaking.',
    category: 'Cloud & Infrastructure',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    skills: ['Rust', 'Go', 'Docker', 'Prometheus', 'Grafana', 'Kubernetes'],
    githubUrl: 'https://github.com/aaravsharma/cloudmesh-ingress-proxy',
    mentorFeedbackScore: 92,
    verifiedStatus: 'Faculty Verified',
    starsCount: 215,
    metrics: [
      { label: 'Throughput', value: '120k RPS' },
      { label: 'Memory Footprint', value: '18 MB' },
      { label: 'P99 Latency', value: '1.2ms' }
    ],
    completedDate: 'Jun 2026'
  },
  {
    id: 'proj-4',
    title: 'Aura UI: Accessible Design System & Component Matrix',
    tagline: 'WCAG 2.2 AAA compliant React component framework with zero-runtime CSS tokens',
    description: 'Authored an open-source design library featuring 40+ atomic components, full keyboard navigability, contrast validators, and comprehensive documentation.',
    category: 'UI/UX Engineering',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    skills: ['TypeScript', 'React 19', 'Tailwind CSS', 'Radix UI', 'Storybook', 'Vite'],
    githubUrl: 'https://github.com/aaravsharma/aura-ui-system',
    liveDemoUrl: 'https://aura-ui-docs.io',
    mentorFeedbackScore: 96,
    verifiedStatus: 'Industry Verified',
    starsCount: 420,
    metrics: [
      { label: 'WCAG Rating', value: 'AAA' },
      { label: 'Bundle Size', value: '6.4 KB' },
      { label: 'Components', value: '42' }
    ],
    completedDate: 'May 2026'
  }
];

export const MOCK_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    category: 'React & State Architecture',
    difficulty: 'Advanced',
    question: 'In React, what is the primary purpose of a controlled input?',
    options: [
      'Keep the input value in React state',
      'Store the value only in the DOM',
      'Prevent all re-renders',
      'Make the input read-only',
    ],
    correctAnswer: 0,
    explanation: 'A controlled input derives its displayed value from React state and updates that state through an event handler.'
  },
  {
    id: 2,
    category: 'React & State Architecture',
    difficulty: 'Advanced',
    question: 'Which hook is best suited for memoizing an expensive computed value?',
    options: [
      'useMemo',
      'useRef',
      'useId',
      'useContext',
    ],
    correctAnswer: 0,
    explanation: 'useMemo can cache a computed value between renders when its dependencies have not changed.'
  },
  {
    id: 3,
    category: 'React & State Architecture',
    difficulty: 'Hard',
    question: 'What does useCallback primarily memoize?',
    options: [
      'A function reference',
      'A DOM node',
      'A CSS class',
      'A Promise result',
    ],
    correctAnswer: 0,
    explanation: 'useCallback returns a memoized function reference until one of its dependencies changes.'
  },
  {
    id: 4,
    category: 'React & State Architecture',
    difficulty: 'Advanced',
    question: 'What is the main benefit of React.memo?',
    options: [
      'It can skip a child render when its props are unchanged',
      'It makes every component a Server Component',
      'It stores state globally',
      'It removes the need for keys',
    ],
    correctAnswer: 0,
    explanation: 'React.memo can prevent a component from re-rendering when its props compare equal.'
  },
  {
    id: 5,
    category: 'React & State Architecture',
    difficulty: 'Advanced',
    question: 'Why are stable keys important when rendering lists in React?',
    options: [
      'They help React match items across renders',
      'They make API requests faster',
      'They encrypt component state',
      'They prevent TypeScript errors',
    ],
    correctAnswer: 0,
    explanation: 'Keys give React stable identity for list items so it can correctly reconcile insertions, deletions, and moves.'
  },
  {
    id: 6,
    category: 'React & State Architecture',
    difficulty: 'Hard',
    question: 'What does lifting state up mean?',
    options: [
      'Moving shared state to the closest common ancestor',
      'Moving all state into Redux',
      'Saving state in localStorage',
      'Putting state inside CSS',
    ],
    correctAnswer: 0,
    explanation: 'State is lifted to the nearest common parent when multiple components need to coordinate the same data.'
  },
  {
    id: 7,
    category: 'React & State Architecture',
    difficulty: 'Advanced',
    question: 'Which hook is designed to hold a mutable value without causing a re-render when it changes?',
    options: [
      'useRef',
      'useState',
      'useMemo',
      'useReducer',
    ],
    correctAnswer: 0,
    explanation: 'The current property of a ref can change without triggering a component re-render.'
  },
  {
    id: 8,
    category: 'React & State Architecture',
    difficulty: 'Advanced',
    question: 'What is a major advantage of useReducer over multiple useState calls for complex state?',
    options: [
      'It centralizes state transitions as actions',
      'It automatically persists state',
      'It eliminates all renders',
      'It makes state immutable by the browser',
    ],
    correctAnswer: 0,
    explanation: 'useReducer is useful when state transitions are related and can be expressed clearly as actions handled by one reducer.'
  },
  {
    id: 9,
    category: 'React & State Architecture',
    difficulty: 'Hard',
    question: 'What does React Context primarily provide?',
    options: [
      'A way to pass values through a component tree without prop drilling',
      'A database connection',
      'A replacement for HTTP',
      'Automatic server-side rendering',
    ],
    correctAnswer: 0,
    explanation: 'Context lets descendants consume shared values without explicitly passing them through every intermediate component.'
  },
  {
    id: 10,
    category: 'React & State Architecture',
    difficulty: 'Advanced',
    question: 'What is the purpose of startTransition?',
    options: [
      'Mark non-urgent updates so urgent interactions can stay responsive',
      'Force synchronous rendering',
      'Disable suspense',
      'Persist state to disk',
    ],
    correctAnswer: 0,
    explanation: 'Transitions let React treat certain updates as non-urgent, improving responsiveness during expensive renders.'
  },
  {
    id: 11,
    category: 'React & State Architecture',
    difficulty: 'Advanced',
    question: 'What does useDeferredValue help with?',
    options: [
      'Deferring a non-critical value so urgent UI can update first',
      'Fetching data from SQL automatically',
      'Creating stable IDs',
      'Replacing event handlers',
    ],
    correctAnswer: 0,
    explanation: 'useDeferredValue allows a lagging version of a value to be rendered later while urgent updates remain responsive.'
  },
  {
    id: 12,
    category: 'React & State Architecture',
    difficulty: 'Hard',
    question: 'In React, what does state batching mean?',
    options: [
      'Multiple state updates can be processed together before a render',
      'Only one state variable can exist',
      'State is always stored in a database',
      'Every setState causes an immediate DOM update',
    ],
    correctAnswer: 0,
    explanation: 'React batches compatible state updates to reduce unnecessary rendering work.'
  },
  {
    id: 13,
    category: 'React & State Architecture',
    difficulty: 'Advanced',
    question: 'Why should React state generally be treated as immutable?',
    options: [
      'Immutable updates make change detection and reasoning about state predictable',
      'React cannot store objects',
      'Mutation always crashes JavaScript',
      'It prevents garbage collection',
    ],
    correctAnswer: 0,
    explanation: 'Creating new state references makes updates explicit and works well with React reconciliation and memoization.'
  },
  {
    id: 14,
    category: 'React & State Architecture',
    difficulty: 'Advanced',
    question: 'What is a common cause of an infinite useEffect loop?',
    options: [
      'The effect updates a dependency that changes on every render',
      'The component has a key',
      'The effect returns undefined',
      'The dependency array is present',
    ],
    correctAnswer: 0,
    explanation: 'If an effect changes a value that is recreated or updated every render, it can repeatedly trigger itself.'
  },
  {
    id: 15,
    category: 'React & State Architecture',
    difficulty: 'Hard',
    question: 'What does the cleanup function returned from useEffect do?',
    options: [
      'Cleans up subscriptions, timers, or other external resources',
      'Undo every React state update',
      'Delete the component source code',
      'Prevent the first effect run',
    ],
    correctAnswer: 0,
    explanation: 'Effect cleanup runs before a changed effect is re-run and when the component unmounts, making it suitable for external resource cleanup.'
  },
  {
    id: 16,
    category: 'React & State Architecture',
    difficulty: 'Advanced',
    question: 'Which pattern is most appropriate for synchronizing React with an external store?',
    options: [
      'useSyncExternalStore',
      'useId',
      'useMemo only',
      'createElement',
    ],
    correctAnswer: 0,
    explanation: 'useSyncExternalStore provides a supported way to subscribe to external stores while remaining compatible with concurrent rendering.'
  },
  {
    id: 17,
    category: 'React & State Architecture',
    difficulty: 'Advanced',
    question: 'What is Suspense primarily used for?',
    options: [
      'Showing a fallback while supported content is not ready',
      'Catching every JavaScript error',
      'Replacing CSS loading states',
      'Persisting authentication',
    ],
    correctAnswer: 0,
    explanation: 'Suspense lets React display fallback UI while a supported child is waiting, such as during lazy loading.'
  },
  {
    id: 18,
    category: 'React & State Architecture',
    difficulty: 'Hard',
    question: 'What is the role of an Error Boundary?',
    options: [
      'Catch rendering errors in descendant components and show fallback UI',
      'Catch every network error automatically',
      'Validate TypeScript types at runtime',
      'Prevent all exceptions',
    ],
    correctAnswer: 0,
    explanation: 'Error boundaries isolate rendering errors in a subtree and can render fallback UI instead of crashing the entire interface.'
  },
  {
    id: 19,
    category: 'React & State Architecture',
    difficulty: 'Advanced',
    question: 'What does lazy loading with React.lazy generally achieve?',
    options: [
      'Load component code on demand',
      'Move all state to the server',
      'Disable bundling',
      'Make components globally available',
    ],
    correctAnswer: 0,
    explanation: 'React.lazy can defer loading a component module until it is rendered, reducing initial JavaScript work.'
  },
  {
    id: 20,
    category: 'React & State Architecture',
    difficulty: 'Advanced',
    question: 'Why is derived state often better computed during render instead of stored separately?',
    options: [
      'It avoids duplicated sources of truth',
      'It makes components class-based',
      'It prevents all renders',
      'It disables memoization',
    ],
    correctAnswer: 0,
    explanation: 'If a value can be calculated from existing props or state, deriving it avoids synchronization bugs caused by duplicated state.'
  },
  {
    id: 21,
    category: 'React & State Architecture',
    difficulty: 'Hard',
    question: 'What is hydration in a React application?',
    options: [
      'Attaching React behavior to server-rendered HTML',
      'Encrypting browser storage',
      'Converting CSS to JavaScript',
      'Creating a database schema',
    ],
    correctAnswer: 0,
    explanation: 'Hydration attaches event handlers and React behavior to HTML that was already rendered on the server.'
  },
  {
    id: 22,
    category: 'React & State Architecture',
    difficulty: 'Advanced',
    question: 'Which statement about refs is correct?',
    options: [
      'Refs can access DOM nodes or persist mutable values across renders',
      'Refs automatically trigger renders',
      'Refs replace all state',
      'Refs are only valid in class components',
    ],
    correctAnswer: 0,
    explanation: 'Refs are commonly used for DOM access and for mutable values that should survive renders without triggering a new render.'
  },
  {
    id: 23,
    category: 'React & State Architecture',
    difficulty: 'Advanced',
    question: 'What is the main architectural benefit of colocating state?',
    options: [
      'Keep state close to the components that actually use it',
      'Force every component to share one global object',
      'Avoid all props',
      'Make every update asynchronous',
    ],
    correctAnswer: 0,
    explanation: 'Colocation reduces unnecessary global state and keeps ownership near the UI that depends on the data.'
  },
  {
    id: 24,
    category: 'React & State Architecture',
    difficulty: 'Hard',
    question: 'What problem can a stale closure cause in React?',
    options: [
      'An event or effect can read an older value than expected',
      'It corrupts the JSX parser',
      'It changes CSS specificity',
      'It disables TypeScript',
    ],
    correctAnswer: 0,
    explanation: 'Closures capture values from the render in which they were created, so callbacks can observe stale values if dependencies are mishandled.'
  },
  {
    id: 25,
    category: 'React & State Architecture',
    difficulty: 'Advanced',
    question: 'Which approach is safest for updating state based on the previous state?',
    options: [
      'Use the functional updater form',
      'Read the state from localStorage',
      'Mutate the current state object',
      'Use a timeout',
    ],
    correctAnswer: 0,
    explanation: 'Functional state updates receive the latest pending state and avoid relying on a potentially stale captured value.'
  },
  {
    id: 26,
    category: 'React & State Architecture',
    difficulty: 'Advanced',
    question: 'What is useActionState in modern React designed to simplify?',
    options: [
      'Managing state associated with an async action, including pending and returned state',
      'Creating CSS modules',
      'Replacing every context provider',
      'Rendering SVG paths',
    ],
    correctAnswer: 0,
    explanation: 'useActionState associates an action with state and exposes pending status, previous state, and the action function.'
  },
  {
    id: 27,
    category: 'React & State Architecture',
    difficulty: 'Hard',
    question: 'What does useOptimistic enable?',
    options: [
      'Temporarily show an expected result before an async action completes',
      'Make every request synchronous',
      'Disable server rendering',
      'Persist data without a server',
    ],
    correctAnswer: 0,
    explanation: 'useOptimistic supports optimistic UI by presenting an anticipated state while an action is in progress.'
  },
  {
    id: 28,
    category: 'React & State Architecture',
    difficulty: 'Advanced',
    question: 'Why should a component avoid setting state unconditionally during render?',
    options: [
      'It can trigger repeated renders or an infinite loop',
      'React requires class components',
      'It prevents JSX compilation',
      'It only affects CSS',
    ],
    correctAnswer: 0,
    explanation: 'An unconditional state update during render schedules another render, potentially creating an infinite loop.'
  },
  {
    id: 29,
    category: 'React & State Architecture',
    difficulty: 'Advanced',
    question: 'What is prop drilling?',
    options: [
      'Passing data through intermediate components that do not need it',
      'Fetching props from a database',
      'Using props inside CSS',
      'Passing state from child to parent automatically',
    ],
    correctAnswer: 0,
    explanation: 'Prop drilling occurs when values are passed through several layers solely to reach a deeply nested consumer.'
  },
  {
    id: 30,
    category: 'React & State Architecture',
    difficulty: 'Hard',
    question: 'For a large React application, which boundary is usually a good place for shared server data caching?',
    options: [
      'A dedicated data-fetching/cache layer',
      'Every button component',
      'Only CSS files',
      'The browser title element',
    ],
    correctAnswer: 0,
    explanation: 'Separating server-data fetching and caching from presentation components improves reuse, consistency, and control over invalidation.'
  },
  {
    id: 31,
    category: 'Distributed Systems & Caching',
    difficulty: 'Advanced',
    question: 'What is the main purpose of a cache in a distributed application?',
    options: [
      'Reduce latency and backend load for frequently accessed data',
      'Guarantee zero network failures',
      'Replace all persistent storage',
      'Encrypt every request',
    ],
    correctAnswer: 0,
    explanation: 'Caching serves reusable data faster and reduces repeated work against slower backing systems.'
  },
  {
    id: 32,
    category: 'Distributed Systems & Caching',
    difficulty: 'Advanced',
    question: 'What does cache-aside mean?',
    options: [
      'The application reads the cache first and loads missing data from the database',
      'The database always writes to the cache first',
      'Only the cache is persistent',
      'Clients never access the cache',
    ],
    correctAnswer: 0,
    explanation: 'In cache-aside, the application checks the cache, fetches from the backing store on a miss, and then populates the cache.'
  },
  {
    id: 33,
    category: 'Distributed Systems & Caching',
    difficulty: 'Hard',
    question: 'What is a key trade-off of write-through caching?',
    options: [
      'Writes can have higher latency because cache and backing store are updated together',
      'It guarantees no storage is needed',
      'Reads become impossible',
      'TTL cannot be used',
    ],
    correctAnswer: 0,
    explanation: 'Write-through keeps cache and persistent storage synchronized on writes but can add write latency.'
  },
  {
    id: 34,
    category: 'Distributed Systems & Caching',
    difficulty: 'Advanced',
    question: 'What is cache stampede?',
    options: [
      'Many clients simultaneously recompute or fetch the same expired item',
      'A cache is encrypted twice',
      'A database loses its schema',
      'A server changes IP addresses',
    ],
    correctAnswer: 0,
    explanation: 'A stampede occurs when many requests miss the cache at once and overload the backing service.'
  },
  {
    id: 35,
    category: 'Distributed Systems & Caching',
    difficulty: 'Advanced',
    question: 'Which technique can reduce cache stampede risk?',
    options: [
      'Request coalescing or single-flight',
      'Infinite retries',
      'Disabling all caching',
      'Removing database indexes',
    ],
    correctAnswer: 0,
    explanation: 'Single-flight allows one request to refresh a missing item while other callers wait for the same result.'
  },
  {
    id: 36,
    category: 'Distributed Systems & Caching',
    difficulty: 'Hard',
    question: 'What does TTL stand for in caching?',
    options: [
      'Time To Live',
      'Total Transfer Limit',
      'Thread Transaction Lock',
      'Temporary Table Length',
    ],
    correctAnswer: 0,
    explanation: 'TTL defines how long a cached entry remains valid before expiration.'
  },
  {
    id: 37,
    category: 'Distributed Systems & Caching',
    difficulty: 'Advanced',
    question: 'What is cache invalidation?',
    options: [
      'Removing or updating cached data when the underlying value changes',
      'Compressing database tables',
      'Restarting a browser',
      'Changing a DNS record',
    ],
    correctAnswer: 0,
    explanation: 'Invalidation prevents stale cached entries from being served after the source data changes.'
  },
  {
    id: 38,
    category: 'Distributed Systems & Caching',
    difficulty: 'Advanced',
    question: 'What does a cache hit mean?',
    options: [
      'The requested data is found in the cache',
      'The database query failed',
      'The server returned HTTP 500',
      'The cache was deleted',
    ],
    correctAnswer: 0,
    explanation: 'A cache hit means the requested key exists and can be served without consulting the backing store.'
  },
  {
    id: 39,
    category: 'Distributed Systems & Caching',
    difficulty: 'Hard',
    question: 'What does a cache miss mean?',
    options: [
      'The requested key is not available in the cache',
      'The cache server is always down',
      'A database transaction committed',
      'A request has no HTTP method',
    ],
    correctAnswer: 0,
    explanation: 'A miss occurs when the requested item is absent or expired in the cache.'
  },
  {
    id: 40,
    category: 'Distributed Systems & Caching',
    difficulty: 'Advanced',
    question: 'Which eviction policy removes the least recently used entries first?',
    options: [
      'LRU',
      'FIFO only',
      'Round Robin',
      'CRC',
    ],
    correctAnswer: 0,
    explanation: 'Least Recently Used eviction discards entries that have not been accessed for the longest time.'
  },
  {
    id: 41,
    category: 'Distributed Systems & Caching',
    difficulty: 'Advanced',
    question: 'What is the purpose of consistent hashing?',
    options: [
      'Reduce key remapping when nodes are added or removed',
      'Encrypt cache keys',
      'Guarantee exactly-once delivery',
      'Eliminate replication',
    ],
    correctAnswer: 0,
    explanation: 'Consistent hashing maps keys to nodes while limiting how many keys move when the cluster membership changes.'
  },
  {
    id: 42,
    category: 'Distributed Systems & Caching',
    difficulty: 'Hard',
    question: 'Why is replication used in distributed caches?',
    options: [
      'To improve availability and tolerate node failures',
      'To make all writes free',
      'To eliminate network latency',
      'To avoid serialization',
    ],
    correctAnswer: 0,
    explanation: 'Replicas provide alternate copies of data so the cache can continue operating when a node fails.'
  },
  {
    id: 43,
    category: 'Distributed Systems & Caching',
    difficulty: 'Advanced',
    question: 'What is a distributed lock commonly used for?',
    options: [
      'Coordinate access to a shared resource across multiple processes or nodes',
      'Speed up CSS rendering',
      'Replace authentication',
      'Store images permanently',
    ],
    correctAnswer: 0,
    explanation: 'A distributed lock helps prevent conflicting concurrent operations across independent processes.'
  },
  {
    id: 44,
    category: 'Distributed Systems & Caching',
    difficulty: 'Advanced',
    question: 'What is the CAP theorem about?',
    options: [
      'Trade-offs among consistency, availability, and partition tolerance during network partitions',
      'CPU, API, and process scheduling',
      'Caching, authentication, and persistence',
      'Compilation, allocation, and paging',
    ],
    correctAnswer: 0,
    explanation: 'CAP states that during a network partition, a distributed system must trade off strong consistency and availability.'
  },
  {
    id: 45,
    category: 'Distributed Systems & Caching',
    difficulty: 'Hard',
    question: 'What is eventual consistency?',
    options: [
      'Replicas may temporarily differ but converge if updates stop',
      'Every read always returns the newest value globally',
      'Data is never replicated',
      'Transactions are always serializable',
    ],
    correctAnswer: 0,
    explanation: 'Eventual consistency permits temporary divergence while requiring replicas to converge over time.'
  },
  {
    id: 46,
    category: 'Distributed Systems & Caching',
    difficulty: 'Advanced',
    question: 'What is idempotency in a distributed API?',
    options: [
      'Repeating the same operation has the same intended effect as performing it once',
      'Every request must use a new server',
      'Every operation is cached forever',
      'A request must be encrypted twice',
    ],
    correctAnswer: 0,
    explanation: 'An idempotent operation can safely be retried without producing additional unintended effects.'
  },
  {
    id: 47,
    category: 'Distributed Systems & Caching',
    difficulty: 'Advanced',
    question: 'Why are retries dangerous when used without limits?',
    options: [
      'They can amplify load on an already failing dependency',
      'They guarantee stronger consistency',
      'They eliminate timeouts',
      'They prevent duplicate requests',
    ],
    correctAnswer: 0,
    explanation: 'Unbounded retries can create retry storms and make an overloaded dependency fail even more severely.'
  },
  {
    id: 48,
    category: 'Distributed Systems & Caching',
    difficulty: 'Hard',
    question: 'What does exponential backoff do?',
    options: [
      'Increases retry delays after repeated failures',
      'Increases request rate after failures',
      'Deletes failed records',
      'Disables circuit breakers',
    ],
    correctAnswer: 0,
    explanation: 'Exponential backoff spaces retries progressively farther apart, reducing pressure on a failing service.'
  },
  {
    id: 49,
    category: 'Distributed Systems & Caching',
    difficulty: 'Advanced',
    question: 'What is the purpose of a circuit breaker?',
    options: [
      'Fail fast when a dependency is unhealthy and allow recovery without continuous pressure',
      'Guarantee zero latency',
      'Persist every HTTP request',
      'Replace DNS',
    ],
    correctAnswer: 0,
    explanation: 'Circuit breakers stop repeated calls to an unhealthy dependency and can provide fallback behavior.'
  },
  {
    id: 50,
    category: 'Distributed Systems & Caching',
    difficulty: 'Advanced',
    question: 'What is a message queue useful for?',
    options: [
      'Decoupling producers and consumers and buffering asynchronous work',
      'Replacing all databases',
      'Rendering UI components',
      'Preventing every network partition',
    ],
    correctAnswer: 0,
    explanation: 'Queues smooth bursts and let producers and consumers operate at different rates.'
  },
  {
    id: 51,
    category: 'Distributed Systems & Caching',
    difficulty: 'Hard',
    question: 'What is backpressure?',
    options: [
      'A mechanism for slowing producers when consumers cannot keep up',
      'A cache eviction algorithm',
      'A DNS strategy',
      'A database index type',
    ],
    correctAnswer: 0,
    explanation: 'Backpressure prevents downstream systems from being overwhelmed by excessive upstream production.'
  },
  {
    id: 52,
    category: 'Distributed Systems & Caching',
    difficulty: 'Advanced',
    question: 'What is a load balancer primarily responsible for?',
    options: [
      'Distributing requests across healthy service instances',
      'Persisting user profiles',
      'Compiling code',
      'Encrypting database backups',
    ],
    correctAnswer: 0,
    explanation: 'Load balancers distribute traffic and can remove unhealthy instances from service.'
  },
  {
    id: 53,
    category: 'Distributed Systems & Caching',
    difficulty: 'Advanced',
    question: 'What is service discovery?',
    options: [
      'Finding available service instances dynamically in a distributed environment',
      'Finding JavaScript variables',
      'Locating CSS classes',
      'Discovering user passwords',
    ],
    correctAnswer: 0,
    explanation: 'Service discovery provides clients or infrastructure with the current network locations of service instances.'
  },
  {
    id: 54,
    category: 'Distributed Systems & Caching',
    difficulty: 'Hard',
    question: 'Why are health checks used by orchestrators and load balancers?',
    options: [
      'To determine whether an instance should receive traffic',
      'To increase database size',
      'To generate frontend routes',
      'To assign user roles',
    ],
    correctAnswer: 0,
    explanation: 'Health checks help route traffic only to instances that are considered ready and healthy.'
  },
  {
    id: 55,
    category: 'Distributed Systems & Caching',
    difficulty: 'Advanced',
    question: 'What is a hot key problem?',
    options: [
      'One extremely popular key overloads a particular cache node',
      'A cache key is encrypted',
      'A database key is missing',
      'A request uses HTTP hot reload',
    ],
    correctAnswer: 0,
    explanation: 'A hot key creates disproportionate traffic for one key and can overload its responsible node.'
  },
  {
    id: 56,
    category: 'Distributed Systems & Caching',
    difficulty: 'Advanced',
    question: 'Which strategy can help mitigate a hot key?',
    options: [
      'Replicate the hot value across multiple cache nodes',
      'Delete the hot value immediately',
      'Disable all reads',
      'Use infinite TTL for every key',
    ],
    correctAnswer: 0,
    explanation: 'Replicating a very popular value across nodes can spread read load.'
  },
  {
    id: 57,
    category: 'Distributed Systems & Caching',
    difficulty: 'Hard',
    question: 'What is read repair in some eventually consistent systems?',
    options: [
      'Updating stale replicas when inconsistent data is detected during reads',
      'Repairing a broken network cable',
      'Rebuilding a UI component',
      'Resetting passwords',
    ],
    correctAnswer: 0,
    explanation: 'Read repair can reconcile stale replicas when a read reveals divergent versions.'
  },
  {
    id: 58,
    category: 'Distributed Systems & Caching',
    difficulty: 'Advanced',
    question: 'What is quorum-based replication intended to provide?',
    options: [
      'A threshold of replicas participating in reads or writes to balance consistency and availability',
      'Zero-copy rendering',
      'Unlimited storage',
      'Automatic schema migrations',
    ],
    correctAnswer: 0,
    explanation: 'Quorum rules require enough replicas to acknowledge operations, creating tunable consistency trade-offs.'
  },
  {
    id: 59,
    category: 'Distributed Systems & Caching',
    difficulty: 'Advanced',
    question: 'Why should distributed operations often carry correlation IDs?',
    options: [
      'To trace one request across multiple services',
      'To increase CPU frequency',
      'To encrypt cache values',
      'To select CSS themes',
    ],
    correctAnswer: 0,
    explanation: 'A correlation ID links logs and traces across service boundaries for debugging and observability.'
  },
  {
    id: 60,
    category: 'Distributed Systems & Caching',
    difficulty: 'Hard',
    question: 'What is a common reason to use Redis Pub/Sub?',
    options: [
      'Distribute transient messages or notifications among subscribers',
      'Provide relational joins',
      'Compile TypeScript',
      'Store source code permanently',
    ],
    correctAnswer: 0,
    explanation: 'Redis Pub/Sub is useful for transient publish/subscribe messaging where durable replay is not required.'
  },
  {
    id: 61,
    category: 'TypeScript & Type Inference',
    difficulty: 'Advanced',
    question: 'What does TypeScript add to JavaScript primarily?',
    options: [
      'Static type checking and richer developer tooling',
      'A new browser runtime',
      'Automatic database hosting',
      'A replacement for HTML',
    ],
    correctAnswer: 0,
    explanation: 'TypeScript adds a static type system and tooling that catches many errors before runtime.'
  },
  {
    id: 62,
    category: 'TypeScript & Type Inference',
    difficulty: 'Advanced',
    question: 'What is type inference?',
    options: [
      'The compiler determines a type from available code without an explicit annotation',
      'The browser guesses CSS',
      'The runtime converts strings to SQL',
      'A type is stored in localStorage',
    ],
    correctAnswer: 0,
    explanation: 'TypeScript can infer types from initializers, return values, control flow, and other context.'
  },
  {
    id: 63,
    category: 'TypeScript & Type Inference',
    difficulty: 'Hard',
    question: 'What is the type of `const x = 42` in TypeScript?',
    options: [
      '42 as a literal type in suitable const inference contexts',
      'string',
      'boolean',
      'never',
    ],
    correctAnswer: 0,
    explanation: 'A const variable initialized with a literal can retain the literal type 42 rather than widening to number.'
  },
  {
    id: 64,
    category: 'TypeScript & Type Inference',
    difficulty: 'Advanced',
    question: 'What does `unknown` represent?',
    options: [
      'A value of an unknown type that must be narrowed before most operations',
      'A value that can be used anywhere without checks',
      'Only null values',
      'Only function values',
    ],
    correctAnswer: 0,
    explanation: 'unknown is type-safe for uncertain data because operations generally require narrowing first.'
  },
  {
    id: 65,
    category: 'TypeScript & Type Inference',
    difficulty: 'Advanced',
    question: 'How does `any` differ from `unknown`?',
    options: [
      'any disables many type checks, while unknown requires narrowing',
      'unknown disables all checks',
      'They are always identical',
      'any can only hold strings',
    ],
    correctAnswer: 0,
    explanation: 'any opts out of static checking in many situations, whereas unknown preserves safety until the value is narrowed.'
  },
  {
    id: 66,
    category: 'TypeScript & Type Inference',
    difficulty: 'Hard',
    question: 'What is a union type?',
    options: [
      'A type that can be one of several alternatives',
      'A type that must satisfy every interface simultaneously',
      'A database relation',
      'A runtime class',
    ],
    correctAnswer: 0,
    explanation: 'A union such as string | number means a value may be either string or number.'
  },
  {
    id: 67,
    category: 'TypeScript & Type Inference',
    difficulty: 'Advanced',
    question: 'What is an intersection type?',
    options: [
      'A type combining requirements from multiple types',
      'A list of possible values',
      'A nullable primitive',
      'A union of arrays',
    ],
    correctAnswer: 0,
    explanation: 'An intersection such as A & B requires a value to satisfy both type structures.'
  },
  {
    id: 68,
    category: 'TypeScript & Type Inference',
    difficulty: 'Advanced',
    question: 'What does `keyof` produce?',
    options: [
      'A union of property keys of a type',
      'The runtime values of an object',
      'A list of array elements',
      'A Promise type',
    ],
    correctAnswer: 0,
    explanation: 'keyof T produces the permitted property keys of T as a type.'
  },
  {
    id: 69,
    category: 'TypeScript & Type Inference',
    difficulty: 'Hard',
    question: 'What does `typeof` do in a TypeScript type position?',
    options: [
      'It can obtain the type of an existing value',
      'It converts a value to a string',
      'It creates a class',
      'It executes a function',
    ],
    correctAnswer: 0,
    explanation: 'Type queries using typeof let a type be derived from an existing value declaration.'
  },
  {
    id: 70,
    category: 'TypeScript & Type Inference',
    difficulty: 'Advanced',
    question: 'What is a generic function useful for?',
    options: [
      'Writing reusable logic while preserving relationships between input and output types',
      'Disabling type checking',
      'Making all values strings',
      'Replacing interfaces at runtime',
    ],
    correctAnswer: 0,
    explanation: 'Generics let a function operate over many types while preserving useful type relationships.'
  },
  {
    id: 71,
    category: 'TypeScript & Type Inference',
    difficulty: 'Advanced',
    question: 'What does a generic constraint such as `T extends HasId` mean?',
    options: [
      'T must satisfy the HasId constraint',
      'T must be a subclass at runtime',
      'T must equal HasId exactly',
      'T must be a primitive',
    ],
    correctAnswer: 0,
    explanation: 'The constraint limits the types that may be supplied for T to those compatible with HasId.'
  },
  {
    id: 72,
    category: 'TypeScript & Type Inference',
    difficulty: 'Hard',
    question: 'What is a discriminated union?',
    options: [
      'A union whose members share a literal discriminant property that enables narrowing',
      'A union of only arrays',
      'A runtime database union',
      'A generic without constraints',
    ],
    correctAnswer: 0,
    explanation: 'A shared literal property such as kind lets TypeScript narrow a union member safely in control flow.'
  },
  {
    id: 73,
    category: 'TypeScript & Type Inference',
    difficulty: 'Advanced',
    question: 'What does the `never` type represent?',
    options: [
      'Values that cannot occur or functions that never successfully return',
      'Any possible value',
      'Only undefined',
      'Only null',
    ],
    correctAnswer: 0,
    explanation: 'never represents impossible values and code paths such as a function that always throws.'
  },
  {
    id: 74,
    category: 'TypeScript & Type Inference',
    difficulty: 'Advanced',
    question: 'What is the purpose of a type predicate like `value is Foo`?',
    options: [
      'Tell TypeScript that a boolean-returning function narrows a value to Foo',
      'Convert Foo at runtime',
      'Create a Foo object',
      'Serialize JSON',
    ],
    correctAnswer: 0,
    explanation: 'A user-defined type guard can provide control-flow narrowing through a type predicate.'
  },
  {
    id: 75,
    category: 'TypeScript & Type Inference',
    difficulty: 'Hard',
    question: 'What does optional property syntax `name?: string` mean?',
    options: [
      'The property may be absent',
      'The property must always be present',
      'The property is read-only',
      'The property can only be null',
    ],
    correctAnswer: 0,
    explanation: 'An optional property may be omitted from an object; its accessed type also reflects possible undefined under strict settings.'
  },
  {
    id: 76,
    category: 'TypeScript & Type Inference',
    difficulty: 'Advanced',
    question: 'What does `readonly` on a property mean?',
    options: [
      'TypeScript prevents assignment through that property reference',
      'The property is private at runtime',
      'The property is encrypted',
      'The property is automatically immutable everywhere',
    ],
    correctAnswer: 0,
    explanation: 'readonly is a compile-time restriction against assigning through that property; it is not runtime deep immutability.'
  },
  {
    id: 77,
    category: 'TypeScript & Type Inference',
    difficulty: 'Advanced',
    question: 'What is a mapped type used for?',
    options: [
      'Transforming properties of an existing type into a new type',
      'Iterating over arrays at runtime',
      'Calling APIs',
      'Compiling CSS',
    ],
    correctAnswer: 0,
    explanation: 'Mapped types iterate over keys in a type and transform their property modifiers or value types.'
  },
  {
    id: 78,
    category: 'TypeScript & Type Inference',
    difficulty: 'Hard',
    question: 'What is a conditional type?',
    options: [
      'A type expression that selects a result based on a type relationship',
      'A runtime if statement',
      'A React hook',
      'A database constraint',
    ],
    correctAnswer: 0,
    explanation: 'Conditional types use a type relation such as T extends U ? X : Y to select types.'
  },
  {
    id: 79,
    category: 'TypeScript & Type Inference',
    difficulty: 'Advanced',
    question: 'What is distributive behavior in conditional types?',
    options: [
      'A conditional type can distribute over members of a union when its checked type is a naked type parameter',
      'It always converts unions to intersections',
      'It only works at runtime',
      'It disables generics',
    ],
    correctAnswer: 0,
    explanation: 'A conditional type written over a naked type parameter distributes across union members.'
  },
  {
    id: 80,
    category: 'TypeScript & Type Inference',
    difficulty: 'Advanced',
    question: 'What does `Partial<T>` generally do?',
    options: [
      'Makes all properties of T optional',
      'Makes all properties required',
      'Removes all methods',
      'Converts T to a union',
    ],
    correctAnswer: 0,
    explanation: 'Partial maps every property of T to an optional property.'
  },
  {
    id: 81,
    category: 'TypeScript & Type Inference',
    difficulty: 'Hard',
    question: 'What does `Required<T>` generally do?',
    options: [
      'Makes optional properties required',
      'Makes every property readonly',
      'Removes keys',
      'Converts values to unknown',
    ],
    correctAnswer: 0,
    explanation: 'Required removes optional modifiers from properties in T.'
  },
  {
    id: 82,
    category: 'TypeScript & Type Inference',
    difficulty: 'Advanced',
    question: 'What does `Pick<T, K>` do?',
    options: [
      'Creates a type containing selected keys K from T',
      'Deletes K at runtime',
      'Creates a Promise',
      'Makes every property optional',
    ],
    correctAnswer: 0,
    explanation: 'Pick constructs a type by selecting a subset of properties from T.'
  },
  {
    id: 83,
    category: 'TypeScript & Type Inference',
    difficulty: 'Advanced',
    question: 'What does `Omit<T, K>` do?',
    options: [
      'Creates a type excluding selected keys K',
      'Adds new runtime fields',
      'Makes all keys readonly',
      'Converts keys to numbers',
    ],
    correctAnswer: 0,
    explanation: 'Omit constructs a type by removing specified properties from T.'
  },
  {
    id: 84,
    category: 'TypeScript & Type Inference',
    difficulty: 'Hard',
    question: 'What is a function overload signature useful for?',
    options: [
      'Describing multiple allowed call shapes for one implementation',
      'Creating multiple runtime functions automatically',
      'Avoiding all generics',
      'Calling functions without arguments',
    ],
    correctAnswer: 0,
    explanation: 'Overloads expose several valid call signatures while one implementation handles the runtime behavior.'
  },
  {
    id: 85,
    category: 'TypeScript & Type Inference',
    difficulty: 'Advanced',
    question: 'What does strictNullChecks improve?',
    options: [
      'It distinguishes null and undefined from other types',
      'It disables null values entirely at runtime',
      'It converts null to false',
      'It removes optional properties',
    ],
    correctAnswer: 0,
    explanation: 'strictNullChecks makes null and undefined explicit parts of types where appropriate, catching many nullability bugs.'
  },
  {
    id: 86,
    category: 'TypeScript & Type Inference',
    difficulty: 'Advanced',
    question: 'What is structural typing?',
    options: [
      'Compatibility is based on the shape of types rather than explicit nominal declarations',
      'Types must share a class name',
      'Only inheritance determines compatibility',
      'Objects cannot implement interfaces',
    ],
    correctAnswer: 0,
    explanation: 'TypeScript generally compares compatible members structurally, so differently named types can still be assignable.'
  },
  {
    id: 87,
    category: 'TypeScript & Type Inference',
    difficulty: 'Hard',
    question: 'What does `as const` generally do?',
    options: [
      'Preserves literal types and applies readonly semantics to the inferred structure',
      'Converts an object to a class',
      'Makes values nullable',
      'Disables all checks',
    ],
    correctAnswer: 0,
    explanation: 'as const narrows literals and marks the resulting object properties and array elements as readonly.'
  },
  {
    id: 88,
    category: 'TypeScript & Type Inference',
    difficulty: 'Advanced',
    question: 'What is a type assertion?',
    options: [
      'A compile-time instruction that a value should be treated as a specified type',
      'A runtime conversion that validates data',
      'A database cast that always checks input',
      'A way to create a new object',
    ],
    correctAnswer: 0,
    explanation: 'Type assertions affect static typing only; they do not validate or transform the runtime value.'
  },
  {
    id: 89,
    category: 'TypeScript & Type Inference',
    difficulty: 'Advanced',
    question: 'Why is `satisfies` useful in modern TypeScript?',
    options: [
      'It checks a value against a target type while preserving a more specific inferred type',
      'It converts the value at runtime',
      'It removes all inference',
      'It creates a class',
    ],
    correctAnswer: 0,
    explanation: 'satisfies validates assignability without forcing the expression to lose its more precise inferred type.'
  },
  {
    id: 90,
    category: 'TypeScript & Type Inference',
    difficulty: 'Hard',
    question: 'What does `ReadonlyArray<T>` prevent?',
    options: [
      'Mutation methods that change the array through that type',
      'Reading array elements',
      'Iteration',
      'Using generic types',
    ],
    correctAnswer: 0,
    explanation: 'ReadonlyArray exposes array access without allowing mutating methods such as push through that reference.'
  },
  {
    id: 91,
    category: 'System Design & Scalability',
    difficulty: 'Advanced',
    question: 'What is horizontal scaling?',
    options: [
      'Adding more service instances or machines',
      'Increasing RAM on one machine only',
      'Reducing database rows',
      'Removing load balancers',
    ],
    correctAnswer: 0,
    explanation: 'Horizontal scaling increases capacity by adding instances, allowing traffic to be distributed across them.'
  },
  {
    id: 92,
    category: 'System Design & Scalability',
    difficulty: 'Advanced',
    question: 'What is vertical scaling?',
    options: [
      'Increasing resources of an existing machine',
      'Adding more replicas',
      'Sharding every table',
      'Adding more DNS records',
    ],
    correctAnswer: 0,
    explanation: 'Vertical scaling increases CPU, memory, or other resources on a single machine.'
  },
  {
    id: 93,
    category: 'System Design & Scalability',
    difficulty: 'Hard',
    question: 'What is a stateless service?',
    options: [
      'A service that does not rely on local instance memory to retain client session state between requests',
      'A service without a database',
      'A service that cannot fail',
      'A service with no configuration',
    ],
    correctAnswer: 0,
    explanation: 'Stateless services keep request-independent state outside the instance, making them easier to scale and replace.'
  },
  {
    id: 94,
    category: 'System Design & Scalability',
    difficulty: 'Advanced',
    question: 'Why is statelessness useful behind a load balancer?',
    options: [
      'Any healthy instance can handle a request',
      'Only one server can handle a user',
      'Sessions never expire',
      'It removes network traffic',
    ],
    correctAnswer: 0,
    explanation: 'Without local session affinity requirements, requests can be distributed freely among healthy instances.'
  },
  {
    id: 95,
    category: 'System Design & Scalability',
    difficulty: 'Advanced',
    question: 'What is database sharding?',
    options: [
      'Partitioning data across multiple database nodes',
      'Compressing one table',
      'Caching query results',
      'Encrypting rows',
    ],
    correctAnswer: 0,
    explanation: 'Sharding distributes subsets of data across database nodes to scale storage or throughput.'
  },
  {
    id: 96,
    category: 'System Design & Scalability',
    difficulty: 'Hard',
    question: 'What is database replication?',
    options: [
      'Maintaining copies of data on multiple database nodes',
      'Splitting one query into SQL keywords',
      'Deleting duplicate rows',
      'Replacing indexes with caches',
    ],
    correctAnswer: 0,
    explanation: 'Replication keeps additional copies of database data for availability, read scaling, or disaster recovery.'
  },
  {
    id: 97,
    category: 'System Design & Scalability',
    difficulty: 'Advanced',
    question: 'What is a read replica commonly used for?',
    options: [
      'Offloading read traffic from the primary database',
      'Handling all writes without coordination',
      'Replacing backups',
      'Generating frontend code',
    ],
    correctAnswer: 0,
    explanation: 'Read replicas can serve eligible read workloads and reduce pressure on the primary.'
  },
  {
    id: 98,
    category: 'System Design & Scalability',
    difficulty: 'Advanced',
    question: 'What is a database index?',
    options: [
      'A data structure that can accelerate selected queries',
      'A backup copy of the whole database',
      'A network socket',
      'A cache invalidation event',
    ],
    correctAnswer: 0,
    explanation: 'Indexes provide an alternate access path that can make lookups and sorting faster at storage and write cost.'
  },
  {
    id: 99,
    category: 'System Design & Scalability',
    difficulty: 'Hard',
    question: 'What is the N+1 query problem?',
    options: [
      'One query loads a list and then an additional query is issued for each item',
      'N servers share one IP',
      'A cache has N replicas',
      'A request has N headers',
    ],
    correctAnswer: 0,
    explanation: 'N+1 occurs when fetching a collection causes one extra query per item, often creating unnecessary database traffic.'
  },
  {
    id: 100,
    category: 'System Design & Scalability',
    difficulty: 'Advanced',
    question: 'What is an API gateway?',
    options: [
      'A centralized entry point that can route, authenticate, rate-limit, or transform API traffic',
      'A database index',
      'A browser extension',
      'A message queue consumer only',
    ],
    correctAnswer: 0,
    explanation: 'API gateways commonly provide cross-cutting edge concerns and route client requests to backend services.'
  },
  {
    id: 101,
    category: 'System Design & Scalability',
    difficulty: 'Advanced',
    question: 'What is rate limiting?',
    options: [
      'Restricting how much traffic a client or identity can send in a time window',
      'Increasing request concurrency without limit',
      'Caching every response forever',
      'Disabling authentication',
    ],
    correctAnswer: 0,
    explanation: 'Rate limits protect services and enforce fair-use or capacity policies.'
  },
  {
    id: 102,
    category: 'System Design & Scalability',
    difficulty: 'Hard',
    question: 'What is a token bucket algorithm commonly used for?',
    options: [
      'Rate limiting with controlled bursts',
      'Database replication',
      'Image compression',
      'Service discovery',
    ],
    correctAnswer: 0,
    explanation: 'Token bucket allows requests when tokens are available and can permit bounded bursts while enforcing an average rate.'
  },
  {
    id: 103,
    category: 'System Design & Scalability',
    difficulty: 'Advanced',
    question: 'What is a CDN?',
    options: [
      'A geographically distributed network that serves content closer to users',
      'A database transaction manager',
      'A local development server',
      'A message broker',
    ],
    correctAnswer: 0,
    explanation: 'A content delivery network caches and serves content from edge locations closer to end users.'
  },
  {
    id: 104,
    category: 'System Design & Scalability',
    difficulty: 'Advanced',
    question: 'Why use asynchronous processing for long-running work?',
    options: [
      'It prevents the request path from waiting for work that can complete later',
      'It guarantees exactly-once execution',
      'It removes the need for queues',
      'It makes every task CPU-free',
    ],
    correctAnswer: 0,
    explanation: 'Asynchronous jobs keep interactive request paths responsive and allow work to be retried or scaled independently.'
  },
  {
    id: 105,
    category: 'System Design & Scalability',
    difficulty: 'Hard',
    question: 'What is eventual consistency often acceptable for?',
    options: [
      'Non-critical replicated views where temporary staleness is acceptable',
      'Bank balance settlement requiring strict correctness',
      'Every security decision',
      'Unique username creation without constraints',
    ],
    correctAnswer: 0,
    explanation: 'Eventual consistency fits workloads where brief stale reads do not violate core correctness requirements.'
  },
  {
    id: 106,
    category: 'System Design & Scalability',
    difficulty: 'Advanced',
    question: 'What is a strong consistency guarantee?',
    options: [
      'A read reflects the latest committed value according to the system guarantee',
      'Every read comes from a cache',
      'All replicas are eventually deleted',
      'Writes never block',
    ],
    correctAnswer: 0,
    explanation: 'Strong consistency provides a well-defined guarantee that reads do not return arbitrarily stale committed data.'
  },
  {
    id: 107,
    category: 'System Design & Scalability',
    difficulty: 'Advanced',
    question: 'What is a single point of failure?',
    options: [
      'A component whose failure can bring down a critical system path',
      'A component with many replicas',
      'A successful health check',
      'A cached value',
    ],
    correctAnswer: 0,
    explanation: 'A single point of failure lacks sufficient redundancy and can cause a system outage when it fails.'
  },
  {
    id: 108,
    category: 'System Design & Scalability',
    difficulty: 'Hard',
    question: 'What is fault tolerance?',
    options: [
      'The ability to continue operating despite certain component failures',
      'The ability to avoid all bugs',
      'A faster compiler',
      'A database schema',
    ],
    correctAnswer: 0,
    explanation: 'Fault-tolerant designs use redundancy, isolation, retries, or fallbacks to keep operating under defined failures.'
  },
  {
    id: 109,
    category: 'System Design & Scalability',
    difficulty: 'Advanced',
    question: 'What is graceful degradation?',
    options: [
      'Providing reduced functionality instead of total failure when dependencies are unavailable',
      'Deleting all optional features permanently',
      'Increasing latency intentionally',
      'Disabling monitoring',
    ],
    correctAnswer: 0,
    explanation: 'Graceful degradation preserves core user value when non-critical components fail.'
  },
  {
    id: 110,
    category: 'System Design & Scalability',
    difficulty: 'Advanced',
    question: 'What is the bulkhead pattern?',
    options: [
      'Isolating resources so one failing workload cannot exhaust capacity for others',
      'Compressing network packets',
      'Joining database tables',
      'Caching every API response',
    ],
    correctAnswer: 0,
    explanation: 'Bulkheads partition resources such as connection pools or worker limits to contain failures.'
  },
  {
    id: 111,
    category: 'System Design & Scalability',
    difficulty: 'Hard',
    question: 'What is a service-level objective (SLO)?',
    options: [
      'A target for a reliability or performance metric',
      'A programming language',
      'A database column',
      'A DNS entry',
    ],
    correctAnswer: 0,
    explanation: 'An SLO defines a target level for a measurable service characteristic such as availability or latency.'
  },
  {
    id: 112,
    category: 'System Design & Scalability',
    difficulty: 'Advanced',
    question: 'What does p99 latency mean?',
    options: [
      '99% of measured requests are at or below that latency value',
      'The average of 99 requests',
      'The slowest request is exactly that value',
      '1% of requests are successful',
    ],
    correctAnswer: 0,
    explanation: 'The p99 percentile marks a latency threshold below which 99% of observations fall.'
  },
  {
    id: 113,
    category: 'System Design & Scalability',
    difficulty: 'Advanced',
    question: 'What is observability?',
    options: [
      'The ability to understand system behavior from telemetry such as logs, metrics, and traces',
      'A frontend animation technique',
      'A database backup method',
      'A type of load balancer',
    ],
    correctAnswer: 0,
    explanation: 'Observability combines telemetry to help engineers infer internal system behavior and diagnose problems.'
  },
  {
    id: 114,
    category: 'System Design & Scalability',
    difficulty: 'Hard',
    question: 'What is distributed tracing useful for?',
    options: [
      'Following a request across multiple services and timing each span',
      'Caching HTML files',
      'Creating database indexes',
      'Encrypting passwords',
    ],
    correctAnswer: 0,
    explanation: 'Distributed traces connect spans across service boundaries, making latency and failure paths visible.'
  },
  {
    id: 115,
    category: 'System Design & Scalability',
    difficulty: 'Advanced',
    question: 'What is blue-green deployment?',
    options: [
      'Maintaining two production environments and switching traffic between them',
      'Deploying only on Fridays',
      'Using two databases without replication',
      'Running two CSS themes',
    ],
    correctAnswer: 0,
    explanation: 'Blue-green deployment reduces release risk by keeping a separate environment ready for traffic before switching.'
  },
  {
    id: 116,
    category: 'System Design & Scalability',
    difficulty: 'Advanced',
    question: 'What is canary deployment?',
    options: [
      'Gradually releasing a change to a small subset of traffic before wider rollout',
      'Deploying to every user at once',
      'Running only on local machines',
      'Disabling monitoring during releases',
    ],
    correctAnswer: 0,
    explanation: 'Canary releases expose a new version to limited traffic so issues can be detected before broad rollout.'
  },
  {
    id: 117,
    category: 'System Design & Scalability',
    difficulty: 'Hard',
    question: 'What is a rolling deployment?',
    options: [
      'Replacing instances incrementally rather than all at once',
      'Deleting all old instances immediately',
      'Deploying only database migrations',
      'Deploying without health checks',
    ],
    correctAnswer: 0,
    explanation: 'Rolling deployments update subsets of instances while keeping the service available.'
  },
  {
    id: 118,
    category: 'System Design & Scalability',
    difficulty: 'Advanced',
    question: 'Why are timeouts important in service-to-service calls?',
    options: [
      'They prevent a caller from waiting indefinitely for a slow dependency',
      'They guarantee a successful response',
      'They replace authentication',
      'They remove all retries',
    ],
    correctAnswer: 0,
    explanation: 'Timeouts bound resource usage and latency when dependencies become slow or unreachable.'
  },
  {
    id: 119,
    category: 'System Design & Scalability',
    difficulty: 'Advanced',
    question: 'What is a fallback in a resilient service?',
    options: [
      'An alternate response or behavior used when the preferred dependency fails',
      'A second password',
      'A database primary key',
      'A compiler warning',
    ],
    correctAnswer: 0,
    explanation: 'Fallbacks provide a degraded but useful response when the normal path is unavailable.'
  },
  {
    id: 120,
    category: 'System Design & Scalability',
    difficulty: 'Hard',
    question: 'What is CQRS?',
    options: [
      'Separating command/write models from query/read models',
      'A cache eviction policy',
      'A DNS protocol',
      'A frontend styling system',
    ],
    correctAnswer: 0,
    explanation: 'Command Query Responsibility Segregation separates write operations from read models so each can be optimized independently.'
  }
];
