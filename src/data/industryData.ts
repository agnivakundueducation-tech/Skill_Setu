import {
  JobPosting,
  LiveProjectPosting,
  WorkshopPosting,
  IndustryCandidate
} from '../types/industry';

export const INITIAL_INDUSTRY_JOBS: JobPosting[] = [
  {
    id: 'job-1',
    title: 'Distributed Systems & Backend Engineer',
    type: 'job',
    department: 'Platform Engineering',
    location: 'Bengaluru, India (Hybrid)',
    workType: 'Hybrid',
    salaryOrStipend: '₹18,00,000 - ₹26,00,000 / yr + Equity',
    openSlots: 4,
    experienceLevel: 'Entry Level / 0-1 yrs',
    status: 'active',
    postedDate: 'Aug 14, 2026',
    deadline: 'Sep 30, 2026',
    description: 'Design and deploy high-throughput microservices using Go and TypeScript. Build resilient event streaming pipelines, distributed caching layers with Redis/Kafka, and manage Kubernetes clusters.',
    requiredSkills: ['Go', 'TypeScript', 'Redis Streams', 'PostgreSQL', 'Docker', 'Distributed Systems'],
    preferredSkills: ['gRPC', 'Kubernetes', 'Prometheus', 'Kafka'],
    minMatchScore: 80,
    applicantsCount: 86,
    shortlistedCount: 12,
    interviewingCount: 5,
    hiredCount: 1
  },
  {
    id: 'job-2',
    title: 'Senior Frontend & Design Systems Architect',
    type: 'job',
    department: 'Core Product Experience',
    location: 'Bengaluru, India / Remote',
    workType: 'Remote',
    salaryOrStipend: '₹20,00,000 - ₹30,00,000 / yr',
    openSlots: 2,
    experienceLevel: 'Associate / 1-3 yrs',
    status: 'active',
    postedDate: 'Aug 10, 2026',
    deadline: 'Oct 15, 2026',
    description: 'Lead modern React 19 architecture, design token synchronization, WCAG AAA accessibility, and performance optimization for our enterprise developer portal.',
    requiredSkills: ['React 19', 'TypeScript', 'Next.js', 'Tailwind CSS', 'WebSockets', 'Zustand'],
    preferredSkills: ['Storybook', 'Figma Tokens', 'GraphQL', 'Vite'],
    minMatchScore: 85,
    applicantsCount: 114,
    shortlistedCount: 16,
    interviewingCount: 6,
    hiredCount: 2
  },
  {
    id: 'job-3',
    title: 'Cloud Infrastructure & DevOps Engineer',
    type: 'job',
    department: 'Infrastructure & Reliability',
    location: 'Hyderabad, India (Hybrid)',
    workType: 'Hybrid',
    salaryOrStipend: '₹16,00,000 - ₹24,00,000 / yr',
    openSlots: 3,
    experienceLevel: 'Entry Level / 0-1 yrs',
    status: 'active',
    postedDate: 'Aug 18, 2026',
    deadline: 'Oct 01, 2026',
    description: 'Automate multi-region AWS cloud deployments, write Terraform IaC modules, maintain CI/CD pipelines in GitHub Actions, and ensure 99.99% service availability.',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux Shell'],
    preferredSkills: ['Helm', 'ArgoCD', 'Grafana', 'Security Compliance'],
    minMatchScore: 78,
    applicantsCount: 58,
    shortlistedCount: 8,
    interviewingCount: 3,
    hiredCount: 0
  },
  {
    id: 'job-4',
    title: 'AI Systems & RAG Pipeline Engineer',
    type: 'job',
    department: 'NovaCore AI Labs',
    location: 'Bengaluru, India (On-site)',
    workType: 'On-site',
    salaryOrStipend: '₹22,00,000 - ₹32,00,000 / yr',
    openSlots: 2,
    experienceLevel: 'Associate / 1-3 yrs',
    status: 'active',
    postedDate: 'Aug 05, 2026',
    deadline: 'Sep 25, 2026',
    description: 'Implement hybrid semantic retrieval with pgvector, fine-tune domain-specific LLMs, and build deterministic evaluation harnesses for enterprise clients.',
    requiredSkills: ['Python', 'FastAPI', 'pgvector', 'LangChain', 'Gemini SDK', 'Docker'],
    preferredSkills: ['LlamaIndex', 'Triton Server', 'PyTorch', 'Vector Search'],
    minMatchScore: 85,
    applicantsCount: 92,
    shortlistedCount: 14,
    interviewingCount: 4,
    hiredCount: 1
  }
];

export const INITIAL_INDUSTRY_INTERNSHIPS: JobPosting[] = [
  {
    id: 'intern-1',
    title: 'Distributed Systems & Platform Engineering Intern',
    type: 'internship',
    department: 'Core Infrastructure',
    location: 'Bengaluru, India (Hybrid)',
    workType: 'Hybrid',
    salaryOrStipend: '₹45,000 / month + PPO Opportunity',
    duration: '6 Months (Full-Time)',
    openSlots: 6,
    experienceLevel: 'Pre-Final / Final Year',
    status: 'active',
    postedDate: 'Aug 12, 2026',
    deadline: 'Sep 20, 2026',
    description: 'Work directly alongside principal engineers building real-time event streaming and sub-10ms network synchronization engines. PPO conversion based on capstone milestones.',
    requiredSkills: ['Go', 'TypeScript', 'Redis Streams', 'Docker', 'Data Structures'],
    preferredSkills: ['Kubernetes Basics', 'Microservices', 'PostgreSQL'],
    minMatchScore: 75,
    applicantsCount: 142,
    shortlistedCount: 18,
    interviewingCount: 8,
    hiredCount: 2
  },
  {
    id: 'intern-2',
    title: 'Cloud Native & Full-Stack Developer Intern',
    type: 'internship',
    department: 'Cloud Platform Engineering',
    location: 'Hyderabad / Remote',
    workType: 'Remote',
    salaryOrStipend: '₹40,000 / month + Mentorship',
    duration: '6 Months',
    openSlots: 5,
    experienceLevel: 'Pre-Final / Final Year',
    status: 'active',
    postedDate: 'Aug 16, 2026',
    deadline: 'Oct 05, 2026',
    description: 'Build responsive internal tooling, automated cloud telemetry visualizers, and type-safe APIs using Next.js 15, React 19, and Node.js.',
    requiredSkills: ['React 19', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
    preferredSkills: ['GraphQL', 'AWS ECS', 'Jest / Vitest'],
    minMatchScore: 75,
    applicantsCount: 168,
    shortlistedCount: 22,
    interviewingCount: 9,
    hiredCount: 3
  },
  {
    id: 'intern-3',
    title: 'AI Research & Vector Retrieval Fellow',
    type: 'internship',
    department: 'Applied AI & Search',
    location: 'Bengaluru, India (Remote)',
    workType: 'Remote',
    salaryOrStipend: '₹50,000 / month + Research Grant',
    duration: '3 Months (Extendable)',
    openSlots: 3,
    experienceLevel: 'Pre-Final / Final Year',
    status: 'active',
    postedDate: 'Aug 08, 2026',
    deadline: 'Sep 15, 2026',
    description: 'Conduct applied benchmarking on dense vector embeddings, hybrid lexical-semantic chunking, and latency optimizations on multi-modal document corpora.',
    requiredSkills: ['Python', 'pgvector', 'FastAPI', 'Linear Algebra', 'Gemini API'],
    preferredSkills: ['HuggingFace', 'Docker', 'D3.js Visualization'],
    minMatchScore: 82,
    applicantsCount: 95,
    shortlistedCount: 15,
    interviewingCount: 6,
    hiredCount: 1
  }
];

export const INITIAL_INDUSTRY_CANDIDATES: IndustryCandidate[] = [
  {
    id: 'cand-1',
    fullName: 'Aarav Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'aarav.sharma.dev@gmail.com',
    phone: '+91 98450 78219',
    location: 'Bengaluru, India',
    targetRole: 'Distributed Systems & Full-Stack Engineer',
    institution: 'Apex Institute of Technology & Engineering',
    degree: 'B.Tech Computer Science (Honors in Distributed Systems)',
    cgpa: '9.42 / 10.0 (Dept Rank 2)',
    graduationBatch: 'Class of 2027 (Final Year)',
    matchScore: 96,
    matchBreakdown: {
      skillCompatibility: 98,
      projectRelevance: 95,
      academicStanding: 94,
      assessmentScore: 96
    },
    skills: [
      { name: 'TypeScript', level: 'Expert', verified: true, score: 92 },
      { name: 'Go (Golang)', level: 'Advanced', verified: true, score: 86 },
      { name: 'React 19', level: 'Expert', verified: true, score: 95 },
      { name: 'Redis Streams', level: 'Advanced', verified: true, score: 89 },
      { name: 'Docker & K8s', level: 'Advanced', verified: true, score: 83 },
      { name: 'pgvector / RAG', level: 'Advanced', verified: true, score: 86 }
    ],
    projects: [
      {
        id: 'p1',
        title: 'Nexus Realtime Workspace',
        tagline: 'CRDT-based sub-10ms distributed collaborative editor',
        category: 'Distributed Systems',
        starsCount: 520,
        metrics: 'Sub-10ms sync, 10k ops/sec, 96% test coverage',
        technologies: ['TypeScript', 'Go', 'CRDTs', 'WebSockets', 'Redis', 'Docker'],
        githubUrl: 'https://github.com/aaravsharma/nexus-realtime',
        verified: true
      },
      {
        id: 'p2',
        title: 'Aura UI Design System',
        tagline: 'Accessible React 19 component library with design tokens',
        category: 'Frontend Engineering',
        starsCount: 420,
        metrics: 'WCAG AAA compliant, 100% TypeScript typed, 420+ stars',
        technologies: ['React 19', 'Tailwind CSS', 'TypeScript', 'Vite'],
        githubUrl: 'https://github.com/aaravsharma/aura-ui',
        verified: true
      },
      {
        id: 'p3',
        title: 'SyllabusBridge AI Engine',
        tagline: 'SIH 2025 Grand Finale 1st place winner gap analyzer',
        category: 'AI & Data Systems',
        starsCount: 226,
        metrics: '94.2% top-3 retrieval precision, 1st out of 1,200 teams',
        technologies: ['Python', 'FastAPI', 'pgvector', 'Gemini SDK'],
        githubUrl: 'https://github.com/aaravsharma/syllabus-bridge',
        verified: true
      }
    ],
    certifications: [
      {
        id: 'c1',
        title: 'SkillSetu Verified Tier-1 Distributed Systems Architect',
        issuer: 'SkillSetu & NovaCore Labs',
        badgeLevel: 'Platinum',
        gradeScore: '98 / 100 Distinction',
        verified: true
      },
      {
        id: 'c2',
        title: 'AWS Certified Cloud Practitioner & Developer',
        issuer: 'Amazon Web Services',
        badgeLevel: 'Platinum',
        gradeScore: '940 / 1000',
        verified: true
      },
      {
        id: 'c3',
        title: 'Meta Certified React Native & Web Architecture',
        issuer: 'Meta / Coursera',
        badgeLevel: 'Gold',
        gradeScore: '96%',
        verified: true
      }
    ],
    appliedFor: {
      jobId: 'job-1',
      jobTitle: 'Distributed Systems & Backend Engineer',
      jobType: 'job',
      appliedDate: 'Aug 18, 2026',
      status: 'Shortlisted',
      notes: 'Exceptional systems background. SIH winner with 2,048 LeetCode rating and strong Go/Redis projects.'
    },
    isShortlisted: true,
    notesCount: 3
  },
  {
    id: 'cand-2',
    fullName: 'Ananya Deshmukh',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    email: 'ananya.deshmukh@nitk.edu.in',
    phone: '+91 97234 11092',
    location: 'Bengaluru / Pune, India',
    targetRole: 'Senior Frontend & Design Systems Architect',
    institution: 'National Institute of Technology Karnataka (NITK)',
    degree: 'B.Tech Information Technology',
    cgpa: '9.28 / 10.0',
    graduationBatch: 'Class of 2026',
    matchScore: 93,
    matchBreakdown: {
      skillCompatibility: 96,
      projectRelevance: 92,
      academicStanding: 91,
      assessmentScore: 94
    },
    skills: [
      { name: 'React 19', level: 'Expert', verified: true, score: 96 },
      { name: 'Next.js 15', level: 'Expert', verified: true, score: 94 },
      { name: 'TypeScript', level: 'Expert', verified: true, score: 92 },
      { name: 'Tailwind CSS', level: 'Expert', verified: true, score: 98 },
      { name: 'WebSockets & CRDT', level: 'Advanced', verified: true, score: 88 },
      { name: 'GraphQL / Apollo', level: 'Advanced', verified: true, score: 85 }
    ],
    projects: [
      {
        id: 'p-an1',
        title: 'Chroma Design Matrix',
        tagline: 'Multi-brand design system with automated token export',
        category: 'Frontend Engineering',
        starsCount: 380,
        metrics: 'Used in 4 production SaaS products',
        technologies: ['React 19', 'TypeScript', 'Tailwind', 'Storybook'],
        githubUrl: 'https://github.com/ananya/chroma-design',
        verified: true
      },
      {
        id: 'p-an2',
        title: 'Pulse Realtime Telemetry UI',
        tagline: 'Sub-frame 60fps canvas visualizer for 100k IoT metrics',
        category: 'Frontend Architecture',
        starsCount: 290,
        metrics: '0 dropped frames at 60fps under high load',
        technologies: ['React', 'WebGL', 'TypeScript', 'Web Workers'],
        githubUrl: 'https://github.com/ananya/pulse-telemetry',
        verified: true
      }
    ],
    certifications: [
      {
        id: 'c-an1',
        title: 'SkillSetu Advanced Frontend Design Systems Master',
        issuer: 'SkillSetu AI Academy',
        badgeLevel: 'Platinum',
        gradeScore: '96 / 100',
        verified: true
      },
      {
        id: 'c-an2',
        title: 'Google UX & Frontend Architecture Professional',
        issuer: 'Google Career Certificates',
        badgeLevel: 'Gold',
        gradeScore: '99%',
        verified: true
      }
    ],
    appliedFor: {
      jobId: 'job-2',
      jobTitle: 'Senior Frontend & Design Systems Architect',
      jobType: 'job',
      appliedDate: 'Aug 15, 2026',
      status: 'Shortlisted',
      notes: 'Strong design token and performance background. Built high-traffic WebGL telemetry dashboard.'
    },
    isShortlisted: true,
    notesCount: 2
  },
  {
    id: 'cand-3',
    fullName: 'Rohan Kulkarni',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    email: 'rohan.kulkarni@iitb.ac.in',
    phone: '+91 99102 44321',
    location: 'Mumbai / Bengaluru, India',
    targetRole: 'Cloud Infrastructure & DevOps Engineer',
    institution: 'Indian Institute of Technology, Bombay (IIT Bombay)',
    degree: 'B.Tech Electrical & Computer Engineering',
    cgpa: '8.95 / 10.0',
    graduationBatch: 'Class of 2027',
    matchScore: 91,
    matchBreakdown: {
      skillCompatibility: 92,
      projectRelevance: 90,
      academicStanding: 90,
      assessmentScore: 92
    },
    skills: [
      { name: 'AWS & Cloud Architecture', level: 'Expert', verified: true, score: 92 },
      { name: 'Kubernetes & Helm', level: 'Advanced', verified: true, score: 88 },
      { name: 'Terraform IaC', level: 'Advanced', verified: true, score: 86 },
      { name: 'Docker', level: 'Expert', verified: true, score: 94 },
      { name: 'Linux Kernel & Shell', level: 'Advanced', verified: true, score: 90 },
      { name: 'Python Automation', level: 'Advanced', verified: true, score: 87 }
    ],
    projects: [
      {
        id: 'p-rk1',
        title: 'KubeSelfHeal Operator',
        tagline: 'Autonomous Kubernetes pod reconciliation based on metrics',
        category: 'Cloud Infrastructure',
        starsCount: 310,
        metrics: '99.99% automated node recovery in bench tests',
        technologies: ['Go', 'Kubernetes Operator SDK', 'Prometheus', 'Docker'],
        githubUrl: 'https://github.com/rohan/kube-self-heal',
        verified: true
      },
      {
        id: 'p-rk2',
        title: 'TerraCloud Multi-Region Blueprint',
        tagline: 'Zero-downtime blue/green infrastructure on AWS',
        category: 'DevOps & Cloud',
        starsCount: 195,
        metrics: 'Spins up audited SOC2 VPC in under 4 minutes',
        technologies: ['Terraform', 'AWS ECS', 'CloudFront', 'GitHub Actions'],
        githubUrl: 'https://github.com/rohan/terracloud-blueprint',
        verified: true
      }
    ],
    certifications: [
      {
        id: 'c-rk1',
        title: 'Certified Kubernetes Administrator (CKA)',
        issuer: 'Cloud Native Computing Foundation (CNCF)',
        badgeLevel: 'Platinum',
        gradeScore: '92%',
        verified: true
      },
      {
        id: 'c-rk2',
        title: 'AWS Certified Solutions Architect Associate',
        issuer: 'Amazon Web Services',
        badgeLevel: 'Platinum',
        gradeScore: '890 / 1000',
        verified: true
      }
    ],
    appliedFor: {
      jobId: 'job-3',
      jobTitle: 'Cloud Infrastructure & DevOps Engineer',
      jobType: 'job',
      appliedDate: 'Aug 19, 2026',
      status: 'Shortlisted',
      notes: 'CKA certified with real Go Kubernetes operator development experience.'
    },
    isShortlisted: true,
    notesCount: 2
  },
  {
    id: 'cand-4',
    fullName: 'Meera Krishnan',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    email: 'meera.krishnan@iisc.ac.in',
    phone: '+91 94451 88200',
    location: 'Bengaluru, India',
    targetRole: 'AI Systems & RAG Pipeline Engineer',
    institution: 'Indian Institute of Science (IISc) / Apex College',
    degree: 'M.Tech Artificial Intelligence',
    cgpa: '9.65 / 10.0 (Gold Medalist)',
    graduationBatch: 'Class of 2026',
    matchScore: 95,
    matchBreakdown: {
      skillCompatibility: 96,
      projectRelevance: 97,
      academicStanding: 98,
      assessmentScore: 94
    },
    skills: [
      { name: 'Python & PyTorch', level: 'Expert', verified: true, score: 96 },
      { name: 'pgvector & Vector DBs', level: 'Expert', verified: true, score: 95 },
      { name: 'FastAPI Microservices', level: 'Expert', verified: true, score: 93 },
      { name: 'LLM Fine-Tuning & LoRA', level: 'Advanced', verified: true, score: 90 },
      { name: 'Docker & Triton', level: 'Advanced', verified: true, score: 86 },
      { name: 'LangChain & LlamaIndex', level: 'Expert', verified: true, score: 94 }
    ],
    projects: [
      {
        id: 'p-mk1',
        title: 'VeriRAG: Deterministic Evaluation Engine',
        tagline: 'Factuality scoring and hallucination suppression for enterprise LLMs',
        category: 'AI & LLMs',
        starsCount: 640,
        metrics: '98.6% factual consistency across 20k queries',
        technologies: ['Python', 'FastAPI', 'pgvector', 'Gemini 1.5 Flash', 'PyTorch'],
        githubUrl: 'https://github.com/meera/verirag',
        verified: true
      },
      {
        id: 'p-mk2',
        title: 'DocStream Multi-Modal Parser',
        tagline: 'Sub-second structured table and chart extraction from complex PDFs',
        category: 'AI & Search',
        starsCount: 410,
        metrics: '350ms processing per 50-page complex PDF document',
        technologies: ['Python', 'Vision Models', 'Ray Multiprocessing', 'Docker'],
        githubUrl: 'https://github.com/meera/docstream-parser',
        verified: true
      }
    ],
    certifications: [
      {
        id: 'c-mk1',
        title: 'SkillSetu Advanced Generative AI & Vector Architect',
        issuer: 'SkillSetu & Google Cloud Partner',
        badgeLevel: 'Platinum',
        gradeScore: '99 / 100 (Top Percentile)',
        verified: true
      },
      {
        id: 'c-mk2',
        title: 'TensorFlow & Deep Learning Specialization',
        issuer: 'DeepLearning.AI',
        badgeLevel: 'Platinum',
        gradeScore: '100% Perfect Score',
        verified: true
      }
    ],
    appliedFor: {
      jobId: 'job-4',
      jobTitle: 'AI Systems & RAG Pipeline Engineer',
      jobType: 'job',
      appliedDate: 'Aug 12, 2026',
      status: 'Shortlisted',
      notes: 'Published AI researcher with top-tier RAG open-source repositories.'
    },
    isShortlisted: true,
    notesCount: 4
  },
  {
    id: 'cand-5',
    fullName: 'Devansh Verma',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'devansh.verma@dtu.ac.in',
    phone: '+91 98112 33490',
    location: 'Delhi NCR / Remote',
    targetRole: 'Distributed Systems & Platform Engineering Intern',
    institution: 'Delhi Technological University (DTU)',
    degree: 'B.Tech Software Engineering',
    cgpa: '8.82 / 10.0',
    graduationBatch: 'Class of 2027',
    matchScore: 88,
    matchBreakdown: {
      skillCompatibility: 89,
      projectRelevance: 87,
      academicStanding: 86,
      assessmentScore: 90
    },
    skills: [
      { name: 'Go (Golang)', level: 'Advanced', verified: true, score: 85 },
      { name: 'TypeScript & Node.js', level: 'Advanced', verified: true, score: 88 },
      { name: 'PostgreSQL', level: 'Advanced', verified: true, score: 86 },
      { name: 'Redis Streams', level: 'Intermediate', verified: true, score: 80 },
      { name: 'Docker', level: 'Advanced', verified: true, score: 84 }
    ],
    projects: [
      {
        id: 'p-dv1',
        title: 'FastCache Distributed Memory Key-Value',
        tagline: 'Raft consensus backed distributed key-value store in Go',
        category: 'Distributed Systems',
        starsCount: 180,
        metrics: 'Handles 40,000 req/sec with raft consensus',
        technologies: ['Go', 'Raft Algorithm', 'gRPC', 'Docker'],
        githubUrl: 'https://github.com/devansh/fastcache-raft',
        verified: true
      }
    ],
    certifications: [
      {
        id: 'c-dv1',
        title: 'SkillSetu Backend & Microservices Foundations',
        issuer: 'SkillSetu AI Academy',
        badgeLevel: 'Gold',
        gradeScore: '89 / 100',
        verified: true
      }
    ],
    appliedFor: {
      jobId: 'intern-1',
      jobTitle: 'Distributed Systems & Platform Engineering Intern',
      jobType: 'internship',
      appliedDate: 'Aug 19, 2026',
      status: 'Shortlisted',
      notes: 'Strong understanding of Raft consensus protocol and concurrency in Go.'
    },
    isShortlisted: true,
    notesCount: 1
  },
  {
    id: 'cand-6',
    fullName: 'Sneha Roy',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    email: 'sneha.roy@iiitd.ac.in',
    phone: '+91 99710 55662',
    location: 'Bengaluru / Remote',
    targetRole: 'Cloud Native & Full-Stack Developer Intern',
    institution: 'IIIT Delhi',
    degree: 'B.Tech Computer Science & Applied Mathematics',
    cgpa: '9.15 / 10.0',
    graduationBatch: 'Class of 2027',
    matchScore: 89,
    matchBreakdown: {
      skillCompatibility: 91,
      projectRelevance: 88,
      academicStanding: 90,
      assessmentScore: 88
    },
    skills: [
      { name: 'React 19', level: 'Advanced', verified: true, score: 91 },
      { name: 'TypeScript', level: 'Advanced', verified: true, score: 89 },
      { name: 'Node.js & Express', level: 'Advanced', verified: true, score: 87 },
      { name: 'PostgreSQL', level: 'Advanced', verified: true, score: 85 },
      { name: 'Tailwind CSS', level: 'Expert', verified: true, score: 94 }
    ],
    projects: [
      {
        id: 'p-sr1',
        title: 'EcoRoute Carbon Telemetry Platform',
        tagline: 'Real-time corporate carbon footprint tracker with predictive analytics',
        category: 'Full Stack & Cloud',
        starsCount: 145,
        metrics: 'Real-time charts, sub-100ms response time',
        technologies: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind'],
        githubUrl: 'https://github.com/sneha/ecoroute-telemetry',
        verified: true
      }
    ],
    certifications: [
      {
        id: 'c-sr1',
        title: 'SkillSetu Full-Stack Web Architecture Certificate',
        issuer: 'SkillSetu AI Academy',
        badgeLevel: 'Gold',
        gradeScore: '91 / 100',
        verified: true
      }
    ],
    appliedFor: {
      jobId: 'intern-2',
      jobTitle: 'Cloud Native & Full-Stack Developer Intern',
      jobType: 'internship',
      appliedDate: 'Aug 17, 2026',
      status: 'Under Review',
      notes: 'Clean code architecture and responsive UI designs.'
    },
    isShortlisted: false,
    notesCount: 0
  },
  {
    id: 'cand-7',
    fullName: 'Tanmay Bhattacharya',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'tanmay.b@jadavpur.edu',
    phone: '+91 98300 77123',
    location: 'Kolkata / Bengaluru, India',
    targetRole: 'AI Research & Vector Retrieval Fellow',
    institution: 'Jadavpur University',
    degree: 'B.Tech Information Technology',
    cgpa: '9.31 / 10.0',
    graduationBatch: 'Class of 2026',
    matchScore: 92,
    matchBreakdown: {
      skillCompatibility: 94,
      projectRelevance: 91,
      academicStanding: 93,
      assessmentScore: 90
    },
    skills: [
      { name: 'Python', level: 'Expert', verified: true, score: 94 },
      { name: 'FastAPI', level: 'Advanced', verified: true, score: 90 },
      { name: 'pgvector / Qdrant', level: 'Advanced', verified: true, score: 92 },
      { name: 'Gemini SDK', level: 'Advanced', verified: true, score: 91 },
      { name: 'Docker', level: 'Advanced', verified: true, score: 85 }
    ],
    projects: [
      {
        id: 'p-tb1',
        title: 'DenseLex: Hybrid Semantic Search Engine',
        tagline: 'Combined reciprocal rank fusion (RRF) on BM25 and dense embeddings',
        category: 'AI & Search',
        starsCount: 275,
        metrics: '35% higher MRR score compared to pure dense search',
        technologies: ['Python', 'FastAPI', 'pgvector', 'D3.js', 'Docker'],
        githubUrl: 'https://github.com/tanmay/dense-lex-search',
        verified: true
      }
    ],
    certifications: [
      {
        id: 'c-tb1',
        title: 'Deep Learning & Natural Language Processing Specialist',
        issuer: 'Stanford Online / Coursera',
        badgeLevel: 'Platinum',
        gradeScore: '97%',
        verified: true
      }
    ],
    appliedFor: {
      jobId: 'intern-3',
      jobTitle: 'AI Research & Vector Retrieval Fellow',
      jobType: 'internship',
      appliedDate: 'Aug 14, 2026',
      status: 'Shortlisted',
      notes: 'Strong grasp of Reciprocal Rank Fusion and hybrid retrieval mathematics.'
    },
    isShortlisted: true,
    notesCount: 2
  }
];

export const INITIAL_INDUSTRY_PROJECTS: LiveProjectPosting[] = [
  {
    id: 'proj-1',
    title: 'High-Throughput Sub-10ms Edge WebSocket Protocol Bridge',
    category: 'Distributed Systems',
    problemStatement: 'Design and benchmark a distributed WebSocket ingress gateway that terminates 50,000 concurrent client sessions, broadcasts delta CRDT payloads with sub-10ms latency, and survives node failovers.',
    bountyOrGrant: '₹1,50,000 Cash Grant + Direct PPO Interviews',
    duration: '4 Weeks (Milestone-based)',
    status: 'active',
    postedDate: 'Aug 01, 2026',
    deadline: 'Sep 30, 2026',
    submissionsCount: 28,
    shortlistedCount: 4,
    deliverables: [
      'Docker Compose / Helm chart with 3 worker nodes and Redis Cluster',
      'Locust / k6 benchmark report evaluating p99 latency under 50k sessions',
      'Automated chaos monkey test script validating partition recovery in < 2 seconds'
    ],
    requiredTechStack: ['Go', 'WebSockets', 'Redis Streams', 'Docker', 'Prometheus'],
    mentorLead: {
      name: 'Elena Vance',
      role: 'Principal Platform Architect, NovaCore',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'proj-2',
    title: 'Enterprise Multi-Tenant IAM & RBAC Policy Matrix Engine',
    category: 'Cybersecurity',
    problemStatement: 'Implement a zero-trust attribute-based access control (ABAC) evaluation engine using Open Policy Agent (OPA) or Rego, capable of evaluating 10,000 permission queries per second.',
    bountyOrGrant: '₹1,00,000 Bounty + Production Deployment',
    duration: '3 Weeks',
    status: 'active',
    postedDate: 'Aug 10, 2026',
    deadline: 'Oct 05, 2026',
    submissionsCount: 19,
    shortlistedCount: 3,
    deliverables: [
      'Open Policy Agent (OPA) policy rules with JWT validation',
      'TypeScript and Go client SDKs with in-memory caching',
      'Comprehensive fuzz testing suite testing edge escalation vectors'
    ],
    requiredTechStack: ['Go', 'TypeScript', 'OPA/Rego', 'Docker', 'JWT'],
    mentorLead: {
      name: 'Vikram Joshi',
      role: 'Head of Cloud Security, CloudScale Labs',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'proj-3',
    title: 'Automated Syllabus-to-Industry Competency Vector Calibration',
    category: 'AI & LLMs',
    problemStatement: 'Build a multi-modal document parser and vector alignment pipeline that maps 1,000+ university syllabus PDFs into standardized skill taxonomies with confidence scores.',
    bountyOrGrant: '₹1,20,000 Innovation Grant + Publication Co-authorship',
    duration: '6 Weeks',
    status: 'active',
    postedDate: 'Aug 05, 2026',
    deadline: 'Sep 28, 2026',
    submissionsCount: 34,
    shortlistedCount: 6,
    deliverables: [
      'FastAPI backend with pgvector hybrid search and embedding worker pool',
      'Interactive D3.js competency taxonomy visualizer in React 19',
      'Empirical calibration benchmark report comparing Gemini embeddings with open models'
    ],
    requiredTechStack: ['Python', 'FastAPI', 'pgvector', 'Gemini SDK', 'D3.js', 'React 19'],
    mentorLead: {
      name: 'Dr. Rajesh Nair',
      role: 'Chief AI Scientist, SkillSetu AI Research',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
    }
  }
];

export const INITIAL_INDUSTRY_WORKSHOPS: WorkshopPosting[] = [
  {
    id: 'ws-1',
    title: 'Architecting Sub-10ms Distributed Microservices with Go & Redis Streams',
    instructor: 'Elena Vance',
    instructorRole: 'Principal Platform Architect, NovaCore Technologies',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    date: 'Aug 29, 2026',
    time: '4:00 PM - 6:30 PM IST',
    duration: '2.5 Hours Masterclass',
    platform: 'Virtual (SkillSetu Live)',
    targetAudience: 'Pre-final & Final Year B.Tech Students, Backend Engineers',
    registeredCount: 480,
    capacity: 600,
    status: 'upcoming',
    prerequisites: ['Basic Go / C++ syntax', 'Familiarity with concurrency and channels', 'Docker installed'],
    agenda: [
      'Concurrency primitives: Mutex vs Channels in Go',
      'Designing consumer groups and backpressure in Redis Streams',
      'Handling node partitions and idempotency keys',
      'Live Hands-on Code-along: Deploying an async queue cluster'
    ],
    certificateIssued: true
  },
  {
    id: 'ws-2',
    title: 'Mastering RAG Architectures: Hybrid Dense-Lexical Search & Factuality Benchmarks',
    instructor: 'Dr. Rajesh Nair',
    instructorRole: 'Chief AI Scientist, SkillSetu AI Research',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    date: 'Sep 05, 2026',
    time: '5:00 PM - 7:30 PM IST',
    duration: '2.5 Hours Hands-on Lab',
    platform: 'Virtual (SkillSetu Live)',
    targetAudience: 'AI/ML Enthusiasts, Data Science Seniors, Research Scholars',
    registeredCount: 520,
    capacity: 750,
    status: 'upcoming',
    prerequisites: ['Python 3.11', 'Basic understanding of vector embeddings', 'Google Gemini API key'],
    agenda: [
      'Pitfalls of naive vector search in production enterprise RAG',
      'Implementing Reciprocal Rank Fusion (RRF) with pgvector and BM25',
      'Building automated hallucination scoring harnesses',
      'Live deployment of a multi-document technical parser'
    ],
    certificateIssued: true
  },
  {
    id: 'ws-3',
    title: 'Production Kubernetes: Writing Custom Go Operators and Helm Blueprints',
    instructor: 'Rohan Kulkarni & Platform Team',
    instructorRole: 'Cloud Infrastructure Leads, CloudScale Labs',
    instructorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    date: 'Sep 12, 2026',
    time: '2:00 PM - 5:00 PM IST',
    duration: '3.0 Hours Workshop & Sandbox Lab',
    platform: 'Hybrid Masterclass',
    locationDetails: 'Apex Innovation Auditorium + Virtual Stream',
    targetAudience: 'DevOps aspirants, Cloud Native developers',
    registeredCount: 310,
    capacity: 400,
    status: 'upcoming',
    prerequisites: ['Linux terminal proficiency', 'Basic Docker container knowledge', 'Minikube / Kind'],
    agenda: [
      'Understanding Kubernetes Custom Resource Definitions (CRDs)',
      'Writing a controller loop with controller-runtime in Go',
      'Automating self-healing rollouts and canary ingress',
      'Live lab verification on Cloud sandbox'
    ],
    certificateIssued: true
  }
];
