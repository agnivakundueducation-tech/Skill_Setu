import {
  StudentProfileData,
  EducationEntry,
  InternshipEntry,
  AchievementEntry
} from '../types/student';
import { STUDENT_CERTIFICATIONS, STUDENT_PROJECTS, STUDENT_SKILLS_ASSESSED } from './studentData';

export const STUDENT_PORTFOLIO_PROFILE: StudentProfileData = {
  fullName: 'Aarav Sharma',
  headline: 'Final Year B.Tech CSE • Distributed Systems & Full-Stack Cloud Architect',
  tagline: 'Building high-throughput real-time systems, performant frontend architectures, and fault-tolerant cloud backends.',
  bio: 'Computer Science & Engineering senior at Apex Institute of Technology with proven industry experience architecting sub-10ms distributed systems and accessible enterprise web applications. 3x Hackathon Champion, open-source contributor, and certified AWS Cloud Native practitioner. Fast-tracked through 4 industry skill verifications with an 87/100 Career Readiness Index.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80',
  email: 'aarav.sharma.dev@gmail.com',
  phone: '+91 98450 78219',
  location: 'Bengaluru, India • Open to Worldwide Remote / Relocation',
  targetRole: 'Full-Stack Software Engineer & Distributed Systems Engineer',
  readinessScore: 87,
  openToWork: true,
  availableFrom: 'Immediately / October 2026 Batch',
  socials: {
    github: 'https://github.com/aaravsharma',
    linkedin: 'https://linkedin.com/in/aarav-sharma-dev',
    portfolioWebsite: 'https://aaravsharma.dev',
    twitter: 'https://twitter.com/aarav_codes',
    leetcode: 'https://leetcode.com/aarav_systems'
  },
  keyStats: [
    { label: 'Readiness Index', value: '87/100', subtext: 'Top 4% nationally' },
    { label: 'Verified Skills', value: '9 Badges', subtext: 'Cryptographically validated' },
    { label: 'GitHub Stars', value: '1,166 ★', subtext: '4 verified open-source repos' },
    { label: 'Academic CGPA', value: '9.42 / 10', subtext: 'Department Rank 2' }
  ]
};

export const STUDENT_EDUCATION: EducationEntry[] = [
  {
    id: 'edu-1',
    institution: 'Apex Institute of Technology & Engineering',
    degree: 'Bachelor of Technology (B.Tech)',
    fieldOfStudy: 'Computer Science and Engineering (Honors in Cloud & Distributed Systems)',
    location: 'Bengaluru, India',
    startDate: 'Aug 2023',
    endDate: 'May 2027 (Expected)',
    isCurrent: true,
    grade: '9.42 / 10.0 CGPA (Department Rank 2 / 240 students)',
    honors: [
      'Dean’s Academic Excellence Honor Roll (Consecutive 6 Semesters)',
      'Institute Merit Scholarship Recipient (Top 1% Class Standing)',
      'Best Capstone Innovation Award 2026'
    ],
    coursework: [
      'Distributed Operating Systems',
      'Advanced Data Structures & Algorithms',
      'Database Internals & Transactional Engines',
      'Cloud Architecture & Virtualization',
      'Computer Networks & Protocols',
      'Compiler Design & Formal Languages'
    ],
    activities: [
      'Lead Organizer, HackApex 2025 (800+ participants)',
      'Core Member, Google Developer Student Club (GDSC)',
      'Student Mentor, Peer-to-Peer Algorithm Study Circles'
    ],
    logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'edu-2',
    institution: 'Delhi Public School, R.K. Puram',
    degree: 'Higher Secondary Certificate (CBSE Class XII)',
    fieldOfStudy: 'Physics, Chemistry, Mathematics & Computer Science',
    location: 'New Delhi, India',
    startDate: 'Apr 2021',
    endDate: 'May 2023',
    isCurrent: false,
    grade: '96.8% Aggregate (Computer Science: 99/100)',
    honors: [
      'School Topper in Computer Science & Informatics',
      'National Cyber Olympiad Gold Medalist (Zonal Rank 14)'
    ],
    coursework: [
      'Object-Oriented Programming with Python',
      'Relational Database Systems (SQL)',
      'Calculus, Linear Algebra & Mechanics'
    ],
    logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80'
  }
];

export const STUDENT_ALL_SKILLS = [
  {
    category: 'Programming Languages',
    skills: [
      { name: 'TypeScript', level: 'Expert', experience: '3+ yrs', verified: true, score: 92 },
      { name: 'JavaScript (ESNext)', level: 'Expert', experience: '4+ yrs', verified: true, score: 95 },
      { name: 'Python', level: 'Expert', experience: '3+ yrs', verified: true, score: 91 },
      { name: 'Go (Golang)', level: 'Intermediate', experience: '1.5 yrs', verified: false, score: 82 },
      { name: 'Rust', level: 'Intermediate', experience: '1 yr', verified: false, score: 78 },
      { name: 'SQL', level: 'Advanced', experience: '3 yrs', verified: true, score: 88 }
    ]
  },
  {
    category: 'Frontend & UI Engineering',
    skills: [
      { name: 'React 19 & Server Components', level: 'Expert', experience: '3+ yrs', verified: true, score: 95 },
      { name: 'Next.js 15 & SSR', level: 'Expert', experience: '2+ yrs', verified: true, score: 92 },
      { name: 'Tailwind CSS & Design Systems', level: 'Expert', experience: '3 yrs', verified: true, score: 96 },
      { name: 'WebSockets & CRDT Sync', level: 'Advanced', experience: '2 yrs', verified: true, score: 90 },
      { name: 'State Management (Zustand/Redux)', level: 'Expert', experience: '3 yrs', verified: true, score: 94 },
      { name: 'Accessibility (WCAG 2.2 AAA)', level: 'Advanced', experience: '2 yrs', verified: true, score: 91 }
    ]
  },
  {
    category: 'Backend & Distributed Systems',
    skills: [
      { name: 'Node.js & Express / Fastify', level: 'Advanced', experience: '3 yrs', verified: true, score: 90 },
      { name: 'PostgreSQL & Drizzle ORM', level: 'Advanced', experience: '2+ yrs', verified: true, score: 88 },
      { name: 'Redis Caching & Streams', level: 'Advanced', experience: '2 yrs', verified: true, score: 89 },
      { name: 'REST & GraphQL APIs', level: 'Expert', experience: '3 yrs', verified: true, score: 93 },
      { name: 'Microservices & Event Telemetry', level: 'Advanced', experience: '2 yrs', verified: true, score: 86 },
      { name: 'gRPC & Protocol Buffers', level: 'Intermediate', experience: '1 yr', verified: false, score: 79 }
    ]
  },
  {
    category: 'Cloud, DevOps & Infrastructure',
    skills: [
      { name: 'Docker & Containerization', level: 'Advanced', experience: '2+ yrs', verified: true, score: 83 },
      { name: 'Kubernetes & Helm', level: 'Intermediate', experience: '1.5 yrs', verified: true, score: 80 },
      { name: 'AWS (ECS, S3, RDS, CloudFront)', level: 'Advanced', experience: '2 yrs', verified: true, score: 87 },
      { name: 'CI/CD (GitHub Actions)', level: 'Advanced', experience: '2 yrs', verified: true, score: 89 },
      { name: 'Prometheus & Grafana Monitoring', level: 'Intermediate', experience: '1.5 yrs', verified: false, score: 81 },
      { name: 'Linux Kernel & Shell Scripting', level: 'Advanced', experience: '3 yrs', verified: true, score: 88 }
    ]
  },
  {
    category: 'AI, Data & Search',
    skills: [
      { name: 'Vector Databases (pgvector/Pinecone)', level: 'Advanced', experience: '1.5 yrs', verified: true, score: 84 },
      { name: 'RAG Pipeline Architectures', level: 'Advanced', experience: '1.5 yrs', verified: true, score: 86 },
      { name: 'Google Gemini & LLM APIs', level: 'Advanced', experience: '1 yr', verified: true, score: 90 },
      { name: 'LangChain & LlamaIndex', level: 'Intermediate', experience: '1 yr', verified: false, score: 78 }
    ]
  }
];

export const STUDENT_INTERNSHIPS: InternshipEntry[] = [
  {
    id: 'intern-1',
    company: 'NovaCore Technologies',
    role: 'Distributed Systems & Full Stack Engineering Intern',
    location: 'Bengaluru, India (Hybrid)',
    workType: 'Hybrid',
    startDate: 'May 2026',
    endDate: 'Jul 2026',
    isCurrent: false,
    description: 'Worked with the Core Platform Infrastructure team to design real-time data synchronization layers and automated telemetry dashboards for enterprise tenants.',
    keyContributions: [
      'Engineered an async batching queue in Go and Redis Streams that reduced microservice inter-node network overhead by 34%.',
      'Built a live multi-cluster health dashboard in React 19 and Tailwind CSS displaying 500+ telemetry nodes under 16ms render budget.',
      'Implemented automated integration tests with Docker and GitHub Actions, achieving 94% test suite coverage on the ingress proxy.'
    ],
    technologies: ['Go', 'TypeScript', 'React 19', 'Redis Streams', 'Docker', 'Kubernetes', 'Tailwind CSS'],
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    mentorName: 'Priya Sundaram',
    mentorTitle: 'Principal Platform Architect, NovaCore',
    mentorRecommendation: '“Aarav operates at the level of an experienced engineer. His grasp of concurrency and distributed caching solved a critical latency bottleneck for our tier-1 telemetry services.”',
    verifiedStatus: 'Verified by Employer'
  },
  {
    id: 'intern-2',
    company: 'CloudScale Infrastructure Labs',
    role: 'Full Stack Platform Developer Co-op',
    location: 'Hyderabad, India (Remote)',
    workType: 'Remote',
    startDate: 'Jan 2026',
    endDate: 'Apr 2026',
    isCurrent: false,
    description: 'Developed cloud resource provisioning workflows, audit logs, and IAM permission matrices for multi-tenant enterprise customers.',
    keyContributions: [
      'Migrated legacy REST endpoints to typed GraphQL queries with Drizzle ORM, cutting server payload sizes by 42%.',
      'Developed optimistic UI mutations and local cache persistence in Zustand, eliminating screen flicker on high-latency connections.',
      'Authored comprehensive OpenAPI 3.1 documentation and interactive testing sandbox used by 12 partner development teams.'
    ],
    technologies: ['TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL', 'Drizzle ORM', 'AWS ECS', 'Jest'],
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&auto=format&fit=crop&q=80',
    mentorName: 'Vikram Joshi',
    mentorTitle: 'Engineering VP, CloudScale',
    mentorRecommendation: '“Exceptional coding velocity and rigorous architectural thinking. Highly recommended for any fast-paced systems or full-stack engineering team.”',
    verifiedStatus: 'Verified by Employer'
  },
  {
    id: 'intern-3',
    company: 'SkillSetu AI Open Research Initiative',
    role: 'AI Infrastructure & RAG Engineering Fellow',
    location: 'Bengaluru, India (Remote)',
    workType: 'Remote',
    startDate: 'Oct 2025',
    endDate: 'Dec 2025',
    isCurrent: false,
    description: 'Researched deterministic skill extraction and semantic embedding retrieval pipelines across 50,000+ technical syllabus documents.',
    keyContributions: [
      'Architected hybrid BM25 lexical + dense vector search pipeline delivering 94.2% top-3 retrieval precision.',
      'Reduced PDF chunking and embedding latency from 4.2s to 380ms through parallel multiprocessing pools.',
      'Co-authored technical whitepaper on deterministic competency matching and calibration algorithms.'
    ],
    technologies: ['Python', 'FastAPI', 'pgvector', 'Gemini SDK', 'Docker', 'D3.js'],
    companyLogo: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=120&auto=format&fit=crop&q=80',
    mentorName: 'Dr. Rajesh Nair',
    mentorTitle: 'Chief AI Scientist, SkillSetu AI',
    mentorRecommendation: '“Aarav combines theoretical rigor in vector mathematics with outstanding full-stack execution prowess.”',
    verifiedStatus: 'Verified by SkillSetu'
  }
];

export const STUDENT_ACHIEVEMENTS: AchievementEntry[] = [
  {
    id: 'ach-1',
    title: '1st Place Winner — Smart India Hackathon (SIH 2025)',
    category: 'Hackathon',
    issuer: 'Ministry of Education & AICTE, Government of India',
    date: 'Dec 2025',
    description: 'Led a 6-member engineering team to build "SyllabusBridge", an automated AI-assisted curriculum gap analyzer for higher education institutions. Awarded ₹1,00,000 cash prize among 1,200+ competing teams.',
    metric: '1st out of 1,200+ teams',
    badgeText: 'Grand Finale Winner',
    iconName: 'Trophy'
  },
  {
    id: 'ach-2',
    title: 'Knight Rank (Rating 2,048) — LeetCode Global',
    category: 'Competitive Programming',
    issuer: 'LeetCode',
    date: 'Aug 2026',
    description: 'Solved over 750+ algorithmic challenges spanning Dynamic Programming, Graph Theory, Trie trees, and Binary Lifting. Consistent top 1.8% percentile globally in weekly contests.',
    metric: 'Top 1.8% Worldwide',
    badgeText: 'Rating: 2048',
    iconName: 'Award',
    link: 'https://leetcode.com/aarav_systems'
  },
  {
    id: 'ach-3',
    title: 'Best Capstone Engineering Innovation Award',
    category: 'Academic',
    issuer: 'Apex Institute of Technology & Industry Advisory Board',
    date: 'May 2026',
    description: 'Recognized for "Nexus Realtime Workspace", evaluating operational transformation against Conflict-Free Replicated Data Types (CRDTs) under real-world flaky network simulations.',
    metric: 'Grade: 98/100',
    badgeText: 'Distinction Capstone',
    iconName: 'Medal'
  },
  {
    id: 'ach-4',
    title: 'Active Open Source Contributor & Maintainer',
    category: 'Open Source',
    issuer: 'GitHub & Open Source Community',
    date: '2024 - Present',
    description: 'Authored Aura UI (420+ GitHub stars) and contributed patches to Next.js documentation, Vite plugins, and Lucide React icons. Over 1,200+ contributions logged on GitHub in the past 12 months.',
    metric: '1,166 Total Stars',
    badgeText: 'OSS Contributor',
    iconName: 'GitMerge',
    link: 'https://github.com/aaravsharma'
  },
  {
    id: 'ach-5',
    title: 'Research Paper Publication on High-Throughput WebSockets',
    category: 'Academic',
    issuer: 'IEEE International Conference on Cloud Networking (CloudNet)',
    date: 'Jan 2026',
    description: 'Published paper titled "Empirical Evaluation of Sub-10ms CRDT Delta Synchronization on Edge WebSockets". Indexed in IEEE Xplore digital library.',
    metric: 'IEEE Xplore Indexed',
    badgeText: 'Published Author',
    iconName: 'BookOpen',
    link: 'https://doi.org/10.1109/cloudnet.2026.104928'
  },
  {
    id: 'ach-6',
    title: 'AWS Certified Cloud Practitioner & Developer Associate',
    category: 'Fellowship',
    issuer: 'Amazon Web Services (AWS)',
    date: 'Jul 2026',
    description: 'Demonstrated mastery in cloud architectures, VPC networking, IAM security, ECS container orchestration, and serverless compute primitives.',
    metric: 'Score: 940 / 1000',
    badgeText: 'AWS Certified',
    iconName: 'CloudCheck'
  }
];

export { STUDENT_CERTIFICATIONS, STUDENT_PROJECTS, STUDENT_SKILLS_ASSESSED };
