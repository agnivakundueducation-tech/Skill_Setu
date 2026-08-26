import { RoleInfo, UserRole, NavItem, MetricCardData, ActivityItem, UserProfile } from '../types';

export const ROLES: Record<UserRole, RoleInfo> = {
  student: {
    id: 'student',
    title: 'Student & Learner',
    subtitle: 'Skill Pathways & Career Readiness',
    description: 'Bridge curriculum learning with industry projects, AI-driven skill gap assessments, verified micro-credentials, and direct job opportunities.',
    badge: 'Talent Incubator',
    iconName: 'GraduationCap',
    color: {
      primary: 'indigo',
      light: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300',
      darkBg: 'border-indigo-500/20 bg-indigo-500/5',
      border: 'border-indigo-200 dark:border-indigo-800',
      accentText: 'text-indigo-600 dark:text-indigo-400',
    },
    features: [
      'AI Skill Gap & Career Readiness Matrix',
      'Real-world Industry Micro-Internships',
      'Direct Mentorship with Industry Architects',
      'Verifiable SkillSetu Knowledge Passport'
    ],
    stats: [
      { label: 'Active Students', value: '45,000+' },
      { label: 'Industry Projects', value: '1,200+' },
      { label: 'Placement Rate', value: '92%' }
    ]
  },
  industry: {
    id: 'industry',
    title: 'Industry Partner',
    subtitle: 'Talent Acquisition & Applied R&D',
    description: 'Access pre-evaluated, project-ready student cohorts, sponsor real-world problem statements, and collaborate with premier research faculties.',
    badge: 'Enterprise Hub',
    iconName: 'Building2',
    color: {
      primary: 'emerald',
      light: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
      darkBg: 'border-emerald-500/20 bg-emerald-500/5',
      border: 'border-emerald-200 dark:border-emerald-800',
      accentText: 'text-emerald-600 dark:text-emerald-400',
    },
    features: [
      'Precision Cohort Sourcing & Talent Filter',
      'Curriculum Alignment & Lab Sponsorship',
      'Hackathons & Co-Innovation Challenges',
      'Direct Academic Research Partnering'
    ],
    stats: [
      { label: 'Hiring Partners', value: '380+' },
      { label: 'Average Time-to-Hire', value: '14 Days' },
      { label: 'Skill Match Accuracy', value: '96%' }
    ]
  },
  academician: {
    id: 'academician',
    title: 'Academician & Faculty',
    subtitle: 'Pedagogy & Curriculum Co-Design',
    description: 'Empower teaching methodologies with current enterprise tech stacks, collaborate on cross-institutional research, and track student cohort outcomes.',
    badge: 'Research & Pedagogy',
    iconName: 'BookOpenCheck',
    color: {
      primary: 'sky',
      light: 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300',
      darkBg: 'border-sky-500/20 bg-sky-500/5',
      border: 'border-sky-200 dark:border-sky-800',
      accentText: 'text-sky-600 dark:text-sky-400',
    },
    features: [
      'Dynamic Syllabus Co-creation Toolkits',
      'Industry-Verified Practical Labs & Case Studies',
      'Research Grant Matching & Collaboration',
      'Cohort Competency Performance Analytics'
    ],
    stats: [
      { label: 'Faculty Members', value: '4,800+' },
      { label: 'Joint Papers & Patents', value: '620+' },
      { label: 'Resource Repositories', value: '3,400+' }
    ]
  },
  institution: {
    id: 'institution',
    title: 'Institution & University',
    subtitle: 'Institutional Governance & Accreditation',
    description: 'Institutional dashboard for outcome-based education (OBE), NIRF/NAAC readiness metrics, industry MoUs, and alumni career trajectory tracking.',
    badge: 'Accreditation & Ops',
    iconName: 'Landmark',
    color: {
      primary: 'amber',
      light: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
      darkBg: 'border-amber-500/20 bg-amber-500/5',
      border: 'border-amber-200 dark:border-amber-800',
      accentText: 'text-amber-600 dark:text-amber-400',
    },
    features: [
      'Autonomous NAAC / NIRF Metric Automation',
      'Industry MoU Lifecycle & Execution Monitor',
      'Departmental Competency Benchmark Analytics',
      'Multi-Campus Placement & Internship Oversight'
    ],
    stats: [
      { label: 'Partner Colleges', value: '180+' },
      { label: 'MoUs Operationalized', value: '890+' },
      { label: 'Accreditation Readiness', value: '98%' }
    ]
  }
};

export const MOCK_USERS: Record<UserRole, UserProfile> = {
  student: {
    id: 'usr_std_01',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@skillsetu.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    organization: 'Apex Institute of Technology',
    status: 'active',
    completionRate: 78
  },
  industry: {
    id: 'usr_ind_01',
    name: 'Elena Vance',
    email: 'elena.vance@novacore-tech.io',
    role: 'industry',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    organization: 'NovaCore Technologies Inc.',
    status: 'active',
    completionRate: 92
  },
  academician: {
    id: 'usr_aca_01',
    name: 'Dr. Rajesh Nair',
    email: 'r.nair@national-univ.ac.in',
    role: 'academician',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    organization: 'Department of Computer Science & AI',
    status: 'active',
    completionRate: 85
  },
  institution: {
    id: 'usr_ins_01',
    name: 'Dean Margaret Chen',
    email: 'chancellor.office@apexgroup.edu',
    role: 'institution',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    organization: 'Apex University Directorate',
    status: 'active',
    completionRate: 95
  }
};

export const ROLE_NAV_ITEMS: Record<UserRole, NavItem[]> = {
  student: [
    { label: 'Dashboard', path: '/dashboard/student', icon: 'LayoutDashboard' },
    { label: 'Career Coach', path: '/dashboard/student/career-coach', icon: 'Compass', badge: '30-90 Day Plan' },
    { label: 'Setu Copilot', path: '/dashboard/student/copilot', icon: 'Sparkles', badge: 'AI Copilot' },
    { label: 'AI Career Roadmap', path: '/dashboard/student/career-roadmap', icon: 'MapPin', badge: '78% → 98%' },
    { label: 'Industry Learning', path: '/dashboard/student/learning-programs', icon: 'GraduationCap', badge: 'Certificates' },
    { label: 'Skill Assessment', path: '/dashboard/student/assessment', icon: 'Target', badge: 'AI Ready' },
    { label: 'Skill DNA', path: '/dashboard/student/skill-dna', icon: 'Dna', badge: 'Top 5%' },
    { label: 'Skill Gap Analysis', path: '/dashboard/student/skill-gap', icon: 'GitCompare', badge: 'Action Plan' },
    { label: 'Opportunities', path: '/dashboard/student/opportunities', icon: 'Compass', badge: '14 Matched' },
    { label: 'Internships Hub', path: '/dashboard/student/internships', icon: 'Award', badge: 'Lifecycle' },
    { label: 'Applications', path: '/dashboard/student/applications', icon: 'Send', badge: '6 Active' },
    { label: 'Document Vault', path: '/dashboard/student/vault', icon: 'FolderArchive', badge: 'Secure' },
    { label: 'Portfolio', path: '/dashboard/student/portfolio', icon: 'Briefcase' }
  ],
  industry: [
    { label: 'Overview Dashboard', path: '/dashboard/industry', icon: 'LayoutDashboard' },
    { label: 'Faculty Collaborations', path: '/dashboard/industry/collaborations', icon: 'Building2', badge: 'Hub' },
    { label: 'Talent Search Engine', path: '/dashboard/industry/talent', icon: 'Search', badge: 'Top 5%' },
    { label: 'Problem Statements', path: '/dashboard/industry/challenges', icon: 'FileCode2', badge: '3 Active' },
    { label: 'Campus MoUs & Labs', path: '/dashboard/industry/mous', icon: 'Building' },
    { label: 'Research Grants', path: '/dashboard/industry/research', icon: 'FlaskConical' },
    { label: 'Candidate Pipeline', path: '/dashboard/industry/pipeline', icon: 'UserCheck' },
    { label: 'Enterprise Settings', path: '/dashboard/industry/settings', icon: 'Settings' }
  ],
  academician: [
    { label: 'Collaboration Hub', path: '/dashboard/academician', icon: 'Building2', badge: '14D-A' },
    { label: 'Curriculum Co-Design', path: '/dashboard/academician/curriculum', icon: 'BookOpen', badge: 'v2.4' },
    { label: 'Cohort Assessment', path: '/dashboard/academician/cohorts', icon: 'LineChart' },
    { label: 'Industry Lab Sync', path: '/dashboard/academician/labs', icon: 'Cpu' },
    { label: 'Joint Publications', path: '/dashboard/academician/research', icon: 'FileSpreadsheet' },
    { label: 'Faculty Passport', path: '/dashboard/academician/passport', icon: 'ShieldCheck', badge: 'Verified' },
    { label: 'Student Mentoring', path: '/dashboard/academician/mentoring', icon: 'GraduationCap' },
    { label: 'Faculty Settings', path: '/dashboard/academician/settings', icon: 'Settings' }
  ],
  institution: [
    { label: 'Overview Dashboard', path: '/dashboard/institution', icon: 'LayoutDashboard' },
    { label: 'Faculty & Industry R&D', path: '/dashboard/institution/collaborations', icon: 'Building2', badge: 'Immersion' },
    { label: 'OBE & NAAC Analytics', path: '/dashboard/institution/accreditation', icon: 'ShieldCheck', badge: 'Audit Ready' },
    { label: 'Department Rankings', path: '/dashboard/institution/departments', icon: 'BarChart3' },
    { label: 'Industry Partnerships', path: '/dashboard/institution/partnerships', icon: 'Handshake' },
    { label: 'Campus Placements', path: '/dashboard/institution/placements', icon: 'TrendingUp' },
    { label: 'Faculty Performance', path: '/dashboard/institution/faculty', icon: 'Users2' },
    { label: 'Admin Governance', path: '/dashboard/institution/governance', icon: 'Settings' }
  ]
};

export const ROLE_METRICS: Record<UserRole, MetricCardData[]> = {
  student: [
    {
      id: 'm1',
      title: 'Skill Quotient (SQ)',
      value: '865 / 1000',
      change: '+14.2%',
      changeType: 'increase',
      description: 'Top 8th percentile across Computer Engineering',
      icon: 'Zap'
    },
    {
      id: 'm2',
      title: 'Active Industry Challenges',
      value: '3 Projects',
      change: '1 Due in 4d',
      changeType: 'neutral',
      description: 'NovaCore & CloudScale Labs',
      icon: 'FolderGit2'
    },
    {
      id: 'm3',
      title: 'Verified Badges',
      value: '18 Issued',
      change: '+3 this month',
      changeType: 'increase',
      description: 'Zero Knowledge blockchain verified',
      icon: 'BadgeCheck'
    },
    {
      id: 'm4',
      title: 'Interview Invites',
      value: '6 Shortlists',
      change: '+2 new',
      changeType: 'increase',
      description: 'High compatibility match (>92%)',
      icon: 'MailCheck'
    }
  ],
  industry: [
    {
      id: 'm1',
      title: 'Active Talent Pool',
      value: '14,280',
      change: '+18.5%',
      changeType: 'increase',
      description: 'Filtered by verified practical skills',
      icon: 'Users'
    },
    {
      id: 'm2',
      title: 'Live Challenges Running',
      value: '8 Statements',
      change: '142 Submissions',
      changeType: 'neutral',
      description: 'Distributed across 12 Partner Universities',
      icon: 'Lightbulb'
    },
    {
      id: 'm3',
      title: 'Skill Match Accuracy',
      value: '96.4%',
      change: '+3.1%',
      changeType: 'increase',
      description: 'AI contextual matching model',
      icon: 'CheckCircle2'
    },
    {
      id: 'm4',
      title: 'Avg. Sourcing Velocity',
      value: '9.4 Days',
      change: '-4.2 days faster',
      changeType: 'increase',
      description: 'Compared to standard hiring cycles',
      icon: 'Timer'
    }
  ],
  academician: [
    {
      id: 'm1',
      title: 'Active Cohort Students',
      value: '240 Enrolled',
      change: '88% Engagement',
      changeType: 'increase',
      description: 'AI & Distributed Systems specialization',
      icon: 'GraduationCap'
    },
    {
      id: 'm2',
      title: 'Curriculum Industry Sync',
      value: '94% Aligned',
      change: '+12% after Q3 update',
      changeType: 'increase',
      description: 'Benchmarked with IEEE & Industry standards',
      icon: 'BookCheck'
    },
    {
      id: 'm3',
      title: 'Active Research Grants',
      value: '$145,000',
      change: '2 Approved',
      changeType: 'increase',
      description: 'Jointly funded by NovaCore & Gov Science',
      icon: 'PiggyBank'
    },
    {
      id: 'm4',
      title: 'Verified Lab Outcomes',
      value: '92.8%',
      change: '+4.8%',
      changeType: 'increase',
      description: 'Practical repository benchmark pass rate',
      icon: 'Terminal'
    }
  ],
  institution: [
    {
      id: 'm1',
      title: 'Total Enrolled Cohorts',
      value: '18,450',
      change: '+6.4% YoY',
      changeType: 'increase',
      description: 'Across 6 Engineering & Tech faculties',
      icon: 'Landmark'
    },
    {
      id: 'm2',
      title: 'NAAC / NBA OBE Score',
      value: '3.82 / 4.0',
      change: 'A++ Projected',
      changeType: 'increase',
      description: 'Continuous automated criteria tracking',
      icon: 'ShieldCheck'
    },
    {
      id: 'm3',
      title: 'Active Industry MoUs',
      value: '42 Executing',
      change: '100% active milestone',
      changeType: 'increase',
      description: '14 Tier-1 tech conglomerates',
      icon: 'Handshake'
    },
    {
      id: 'm4',
      title: 'Overall Placement Yield',
      value: '94.2%',
      change: '+8.1% vs last year',
      changeType: 'increase',
      description: 'Avg CTC benchmark increased by 22%',
      icon: 'TrendingUp'
    }
  ]
};

export const ROLE_ACTIVITIES: Record<UserRole, ActivityItem[]> = {
  student: [
    {
      id: 'act1',
      title: 'Completed CloudScale Distributed Systems Sandbox',
      subtitle: 'Verified score 94/100 · Credential minted to profile',
      timestamp: '2 hours ago',
      status: 'completed',
      tag: 'Micro-Internship'
    },
    {
      id: 'act2',
      title: 'AI Assessment: React & State Management Gap Analysis',
      subtitle: 'Suggested next step: Advanced Zustand & Server Components',
      timestamp: 'Yesterday',
      status: 'in-progress',
      tag: 'Skill Gap'
    },
    {
      id: 'act3',
      title: 'Mentor 1:1 Session booked with Dr. Rajesh Nair',
      subtitle: 'Topic: Transitioning Research into Industry Production Models',
      timestamp: 'Aug 24, 04:30 PM',
      status: 'pending',
      tag: 'Mentorship'
    }
  ],
  industry: [
    {
      id: 'act1',
      title: 'New High-Match Cohort Available (88 candidates)',
      subtitle: 'Specialized in Rust, WebAssembly, and High-Performance Backend',
      timestamp: '30 mins ago',
      status: 'urgent',
      tag: 'Cohort Alert'
    },
    {
      id: 'act2',
      title: 'Challenge Evaluation: Autonomous Robotics Challenge v2',
      subtitle: '42 submissions ready for engineering review',
      timestamp: '3 hours ago',
      status: 'in-progress',
      tag: 'Hackathon'
    },
    {
      id: 'act3',
      title: 'Academic MoU signed with Apex University Directorate',
      subtitle: 'Sponsorship of Next-Gen AI Cloud Computing Lab approved',
      timestamp: 'Yesterday',
      status: 'completed',
      tag: 'MoU'
    }
  ],
  academician: [
    {
      id: 'act1',
      title: 'Curriculum Module: Applied Vector Databases Approved',
      subtitle: 'Synced with NovaCore Enterprise curriculum review panel',
      timestamp: '1 hour ago',
      status: 'completed',
      tag: 'Curriculum'
    },
    {
      id: 'act2',
      title: 'Cohort Mid-Term Practical Evaluation Underway',
      subtitle: '185/240 students completed dynamic code analysis benchmark',
      timestamp: '4 hours ago',
      status: 'in-progress',
      tag: 'Assessment'
    },
    {
      id: 'act3',
      title: 'Joint Research Proposal submitted to DST-Lockheed Board',
      subtitle: 'Autonomous Swarm Optimization with Industry telemetry',
      timestamp: '2 days ago',
      status: 'pending',
      tag: 'Research'
    }
  ],
  institution: [
    {
      id: 'act1',
      title: 'NAAC Criterion 2.6 & 5.1 Outcome Audit Report Generated',
      subtitle: 'Outcome Based Education target alignment: 98.2%',
      timestamp: 'Just now',
      status: 'completed',
      tag: 'Accreditation'
    },
    {
      id: 'act2',
      title: 'Annual Industry-Academia Conclave 2026 Scheduled',
      subtitle: '48 corporate partners confirmed participation',
      timestamp: '5 hours ago',
      status: 'in-progress',
      tag: 'Event'
    },
    {
      id: 'act3',
      title: 'Campus-wide Placement Drive: Phase 1 Finalized',
      subtitle: '780 conditional offers released across Tier-1 recruiters',
      timestamp: 'Yesterday',
      status: 'completed',
      tag: 'Placements'
    }
  ]
};
