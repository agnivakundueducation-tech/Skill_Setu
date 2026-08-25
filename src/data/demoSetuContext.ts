import {
  StudentSetuContext,
  IndustrySetuContext,
  AcademicianSetuContext,
  InstitutionSetuContext,
  UnifiedSetuContext
} from '../types/setu';

export const DEMO_STUDENT_SETU_CONTEXT: StudentSetuContext = {
  identity: {
    role: 'student',
    name: 'Aarav Sharma',
    institution: 'Apex Institute of Technology & Research',
    department: 'Computer Science & Engineering',
    degree: 'B.Tech Computer Science (Honors in Cloud & Distributed Systems)',
    graduationYear: '2027',
    cgpa: '9.42 / 10.0'
  },
  career: {
    targetRole: 'Senior Full Stack & Distributed Systems Engineer',
    careerInterests: ['Distributed Systems', 'Cloud Native Platforms', 'Real-Time APIs', 'AI Infrastructure'],
    preferredWorkMode: 'Hybrid / Remote',
    preferredLocation: 'Bengaluru, India / Open to Relocation',
    openToWork: true
  },
  skillIntelligence: {
    readinessScore: 87,
    percentile: 96,
    tier: 'Tier-1 Industry Ready',
    topSkills: [
      { name: 'React 19 & Next.js Architecture', score: 95, level: 'Expert', demand: 'Very High' },
      { name: 'Node.js & High-Throughput APIs', score: 90, level: 'Advanced', demand: 'High' },
      { name: 'Algorithmic Problem Solving & DSA', score: 88, level: 'Advanced', demand: 'Very High' },
      { name: 'Distributed Caching & Redis', score: 86, level: 'Advanced', demand: 'High' },
      { name: 'Python & Data Workflows', score: 72, level: 'Intermediate', demand: 'Very High' }
    ],
    criticalGaps: [
      { name: 'Kubernetes Custom Resource Definitions (CRDs)', currentLevel: 58, requiredLevel: 82, gap: 24, priority: 'High' },
      { name: 'Vector Databases & RAG Hybrid Search', currentLevel: 52, requiredLevel: 80, gap: 28, priority: 'High' },
      { name: 'Distributed Consensus (Raft & Paxos)', currentLevel: 62, requiredLevel: 80, gap: 18, priority: 'Medium' }
    ]
  },
  assessment: {
    hasCompletedAssessment: true,
    latestAssessmentDate: '2026-08-18',
    strengths: [
      'Modern React & State Architecture (Top 3% percentile)',
      'High-throughput REST & GraphQL API Design',
      'Real-time WebSocket & Distributed Cache Patterns',
      'Clean Code & CI/CD Pipeline Automation'
    ],
    weaknesses: [
      'Kubernetes Custom Resource Definitions (CRDs)',
      'Vector Embeddings & Hybrid Search Optimization',
      'Distributed Consensus Algorithms (Raft & Paxos)'
    ],
    recommendedRoles: [
      'Full Stack Software Engineer',
      'Cloud Platform Engineer',
      'Backend Distributed Systems Engineer'
    ]
  },
  opportunities: {
    topMatched: [
      {
        opportunityId: 'opp_nova_dist',
        title: 'Full-Stack & Distributed Systems Intern',
        company: 'NovaCore Technologies',
        domain: 'Cloud Infrastructure & Enterprise Systems',
        requiredSkills: ['React', 'TypeScript', 'Node.js', 'Distributed Systems', 'PostgreSQL'],
        matchScore: 96,
        deadline: '2026-09-15',
        type: 'Internship'
      },
      {
        opportunityId: 'opp_cloudscale_devops',
        title: 'Cloud-Native Platform & DevOps Co-Op',
        company: 'CloudScale Networks',
        domain: 'DevOps & Site Reliability Engineering',
        requiredSkills: ['Kubernetes', 'Docker', 'Go', 'Linux Internals', 'CI/CD'],
        matchScore: 91,
        deadline: '2026-09-30',
        type: 'Co-Op'
      },
      {
        opportunityId: 'opp_apex_backend',
        title: 'High-Throughput Backend Engineering Intern',
        company: 'Apex FinTech Global',
        domain: 'Financial Technology & Low-Latency Engines',
        requiredSkills: ['Node.js', 'Redis', 'Kafka', 'System Design', 'SQL'],
        matchScore: 88,
        deadline: '2026-09-20',
        type: 'Internship'
      }
    ]
  },
  applications: {
    totalActive: 3,
    recentApplications: [
      {
        applicationId: 'app-001',
        opportunityTitle: 'Full-Stack Software Engineer Intern',
        company: 'NovaCore Technologies',
        matchScore: 96,
        status: 'Interview Scheduled',
        appliedAt: '2026-08-10'
      },
      {
        applicationId: 'app-002',
        opportunityTitle: 'Cloud-Native Platform & DevOps Co-Op',
        company: 'CloudScale Networks',
        matchScore: 91,
        status: 'Shortlisted',
        appliedAt: '2026-08-12'
      },
      {
        applicationId: 'app-003',
        opportunityTitle: 'High-Throughput Backend Engineering Intern',
        company: 'Apex FinTech Global',
        matchScore: 88,
        status: 'Under Review',
        appliedAt: '2026-08-14'
      }
    ]
  },
  industryDemand: {
    topDemandedSkills: [
      { name: 'Kubernetes & Container Orchestration', demandPercentage: 88, trend: 'Surging (+14%)' },
      { name: 'Vector Databases & LLM Application RAG', demandPercentage: 84, trend: 'Emerging (+22%)' },
      { name: 'Distributed Systems Architecture', demandPercentage: 82, trend: 'High & Stable' },
      { name: 'React 19 & Next.js Full Stack', demandPercentage: 79, trend: 'High' }
    ]
  },
  interventions: {
    enrolled: [
      {
        interventionId: 'int_k8s_crds',
        title: 'Kubernetes Operator Pattern & CRD Masterclass',
        skillName: 'Kubernetes CRDs',
        status: 'In_Progress',
        preSkillLevel: 58,
        postSkillLevel: 76,
        measuredImprovement: 18
      }
    ],
    recommended: [
      {
        interventionId: 'int_rag_vectors',
        title: 'Applied Vector Search & RAG Architecture Sprint',
        skillName: 'Vector Databases & RAG Hybrid Search',
        type: 'Industry Workshop',
        targetCohort: 'Students targeting AI Infrastructure'
      }
    ]
  },
  portfolio: {
    projectsCount: 4,
    topProjects: [
      {
        title: 'HyperStream: Real-time Distributed Event Broker',
        techStack: ['TypeScript', 'Node.js', 'Redis', 'WebSockets', 'Docker'],
        highlight: 'Sub-8ms latency across 50,000 concurrent simulated client connections.'
      },
      {
        title: 'SkillSetu AI Engine & Student Intelligence Platform',
        techStack: ['React 19', 'Tailwind CSS', 'Vite', 'Firebase', 'Gemini API'],
        highlight: 'Deterministic career readiness forecasting and closed-loop gap analysis.'
      }
    ],
    certifications: [
      { title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', verified: true },
      { title: 'Meta Certified Frontend Developer', issuer: 'Meta', verified: true }
    ],
    internships: [
      { company: 'NovaCore Technologies', role: 'Full Stack Engineering Intern', duration: 'Jun 2025 - Aug 2025' }
    ],
    achievements: [
      '1st Place - Apex National Hackathon 2026 (out of 420 engineering teams)',
      'Dean’s Academic Excellence Honor Roll (Consecutive 6 Semesters)',
      '1,166+ GitHub stars across open-source systems repositories'
    ]
  }
};

export const DEMO_INDUSTRY_SETU_CONTEXT: IndustrySetuContext = {
  organization: {
    role: 'industry',
    companyName: 'NovaCore Technologies Inc.',
    industryDomain: 'Cloud Infrastructure & Enterprise Systems',
    location: 'Bengaluru & San Francisco (Global Engineering Center)',
    description: 'Pioneering next-generation high-throughput distributed database engines and edge intelligence runtimes.',
    verifiedPartner: true
  },
  opportunities: {
    totalPosted: 4,
    activeCount: 3,
    postedOpportunities: [
      {
        opportunityId: 'opp_nova_dist',
        title: 'Full-Stack & Distributed Systems Intern',
        type: 'Internship',
        requiredSkills: ['React', 'TypeScript', 'Node.js', 'Distributed Systems', 'PostgreSQL'],
        preferredSkills: ['Redis', 'Docker', 'Kafka'],
        status: 'Active',
        applicantsCount: 42,
        deadline: '2026-09-15'
      },
      {
        opportunityId: 'opp_nova_ai',
        title: 'AI Pipeline & Vector Infrastructure Co-Op',
        type: 'Co-Op',
        requiredSkills: ['Python', 'Vector DBs', 'FastAPI', 'PyTorch', 'Docker'],
        preferredSkills: ['Kubernetes', 'LangChain', 'RAG'],
        status: 'Active',
        applicantsCount: 28,
        deadline: '2026-09-30'
      },
      {
        opportunityId: 'opp_nova_swe',
        title: 'Associate Cloud Software Engineer',
        type: 'Full-Time',
        requiredSkills: ['Go', 'Distributed Systems', 'gRPC', 'Kubernetes', 'Linux'],
        preferredSkills: ['eBPF', 'Prometheus', 'Raft'],
        status: 'Active',
        applicantsCount: 65,
        deadline: '2026-10-15'
      }
    ]
  },
  applicantsSummary: {
    totalApplicantsAcrossJobs: 135,
    topMatches: [
      {
        opportunityTitle: 'Full-Stack & Distributed Systems Intern',
        candidateName: 'Aarav Sharma',
        institution: 'Apex Institute of Technology',
        matchScore: 96,
        matchedSkills: ['React 19', 'TypeScript', 'Node.js', 'Distributed Systems', 'PostgreSQL'],
        skillGaps: ['Kubernetes CRDs (Minor)'],
        status: 'Interview Scheduled'
      },
      {
        opportunityTitle: 'Full-Stack & Distributed Systems Intern',
        candidateName: 'Diya Patel',
        institution: 'National Institute of Technology (NIT)',
        matchScore: 91,
        matchedSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
        skillGaps: ['Distributed Caching'],
        status: 'Shortlisted'
      },
      {
        opportunityTitle: 'AI Pipeline & Vector Infrastructure Co-Op',
        candidateName: 'Rohan Verma',
        institution: 'Indian Institute of Technology (IIT)',
        matchScore: 89,
        matchedSkills: ['Python', 'FastAPI', 'PyTorch', 'Vector DBs'],
        skillGaps: ['Kubernetes Production Tuning'],
        status: 'Under Review'
      }
    ]
  },
  demandIntelligence: {
    domainSkillPriorities: [
      { skill: 'Distributed Systems & High-Throughput APIs', marketDemand: 92, priority: 'Critical' },
      { skill: 'Vector Databases & RAG Hybrid Search', marketDemand: 88, priority: 'Critical' },
      { skill: 'Kubernetes Cloud Orchestration', marketDemand: 84, priority: 'High' },
      { skill: 'TypeScript & Modern Full Stack UI', marketDemand: 79, priority: 'High' }
    ]
  },
  collaborations: {
    activeCollaborationsCount: 2,
    collaborationsList: [
      {
        collaborationId: 'collab_nova_distributed_lab',
        title: 'Distributed Consensus & Edge Caching Research Cell',
        type: 'Joint Research Lab',
        partnerInstitution: 'Apex Institute of Technology & Research',
        status: 'Active',
        expertiseRequirements: ['Distributed Systems', 'Raft Consensus', 'High-throughput Networking']
      },
      {
        collaborationId: 'collab_nova_fdp_cloud',
        title: 'Faculty Enablement in Cloud Native & Kubernetes Architecture',
        type: 'Faculty Development Program (FDP)',
        partnerInstitution: 'National Institute of Technology (NIT)',
        status: 'Active',
        expertiseRequirements: ['Kubernetes', 'Cloud Native', 'Curriculum Design']
      }
    ]
  },
  interventions: {
    mentoringInterventions: [
      {
        interventionId: 'int_k8s_crds',
        title: 'Kubernetes Operator Pattern & CRD Masterclass',
        institutionName: 'Apex Institute of Technology',
        skillName: 'Kubernetes CRDs',
        mentorName: 'Vikram Sengupta (Principal Architect, NovaCore)',
        enrolledCount: 38
      }
    ]
  }
};

export const DEMO_ACADEMICIAN_SETU_CONTEXT: AcademicianSetuContext = {
  profile: {
    role: 'academician',
    facultyName: 'Dr. Priya Ramachandran',
    institution: 'Apex Institute of Technology & Research',
    department: 'Computer Science & Engineering',
    designation: 'Professor & Lead, Distributed Computing Research Group',
    expertise: ['Distributed Systems', 'Fault-Tolerant Consensus', 'Cloud-Native Computing', 'Applied Machine Learning'],
    researchInterests: ['High-Throughput Stream Processing', 'Sub-millisecond Distributed Caching', 'Vector Embeddings in Relational Storage'],
    passportScore: 94
  },
  collaborations: {
    recommended: [
      {
        collaborationId: 'collab_edge_consensus',
        title: 'Next-Gen Edge AI & Distributed Storage Architecture',
        company: 'NovaCore Technologies',
        type: 'Joint Research Grant',
        matchScore: 96,
        requiredExpertise: ['Distributed Systems', 'Edge Computing', 'Fault Tolerance']
      },
      {
        collaborationId: 'collab_cloud_security',
        title: 'Confidential Computing & Zero-Trust Cloud Sandbox',
        company: 'CloudScale Networks',
        type: 'Industry Sponsored Project',
        matchScore: 91,
        requiredExpertise: ['Cloud Architecture', 'Security Protocols', 'Containerization']
      }
    ],
    appliedOrActive: [
      {
        collaborationId: 'collab_nova_distributed_lab',
        title: 'Distributed Consensus & Edge Caching Research Cell',
        company: 'NovaCore Technologies',
        type: 'Joint Research Lab',
        status: 'Active',
        appliedAt: '2026-07-15'
      }
    ],
    completedCount: 4
  },
  fdp: {
    availablePrograms: [
      {
        id: 'fdp_cloud_k8s',
        title: 'Advanced Kubernetes Internals & Custom Operators for Educators',
        provider: 'Cloud Native Computing Foundation (CNCF) & NovaCore',
        domain: 'Cloud Native',
        duration: '2 Weeks (Interactive Immersion)'
      },
      {
        id: 'fdp_genai_rag',
        title: 'Enterprise RAG Architecture & Vector Indexing Pedagogies',
        provider: 'Google Cloud & Industry Consortium',
        domain: 'Artificial Intelligence',
        duration: '10 Days'
      }
    ],
    appliedPrograms: [
      {
        id: 'fdp_cloud_k8s',
        title: 'Advanced Kubernetes Internals & Custom Operators for Educators',
        status: 'Enrolled & Verified'
      }
    ],
    completedCount: 6
  },
  mentorship: {
    activeMentorships: [
      {
        programTitle: 'Capstone Innovation Accelerator: Distributed Systems Cohort',
        cohort: 'Final Year CSE 2026 Batch',
        studentsCount: 24
      }
    ]
  },
  research: {
    industrySponsoredProjects: [
      {
        title: 'Sub-5ms Event Streaming Architecture on NVMe Over Fabrics',
        sponsorCompany: 'NovaCore Technologies',
        status: 'Active - Milestone 2 in Progress'
      }
    ]
  }
};

export const DEMO_INSTITUTION_SETU_CONTEXT: InstitutionSetuContext = {
  institution: {
    role: 'institution',
    institutionName: 'Apex Institute of Technology & Research',
    departments: ['Computer Science & Engineering', 'Data Science & AI', 'Information Technology', 'Electronics & Communication'],
    accreditationStatus: 'NAAC A++ Accredited • NBA Tier-1 OBE Aligned',
    totalStudents: 2840
  },
  studentIntelligence: {
    studentsRepresentedCount: 2840,
    averageReadinessScore: 74.2,
    readinessTierDistribution: [
      { tier: 'Tier-1 Industry Ready (>80)', percentage: 38 },
      { tier: 'Tier-2 Developing Competence (60-79)', percentage: 46 },
      { tier: 'Tier-3 Foundational (<60)', percentage: 16 }
    ],
    criticalSkillGaps: [
      { skill: 'Vector Databases & RAG Hybrid Search', studentAvgLevel: 42, industryRequirement: 80, gap: 38 },
      { skill: 'Kubernetes Custom Resource Definitions (CRDs)', studentAvgLevel: 48, industryRequirement: 82, gap: 34 },
      { skill: 'Distributed Consensus (Raft & Paxos)', studentAvgLevel: 51, industryRequirement: 80, gap: 29 },
      { skill: 'Rust Systems Programming', studentAvgLevel: 36, industryRequirement: 74, gap: 38 }
    ],
    curriculumGaps: [
      { skill: 'Vector Databases & RAG Search', coverage: 'Not Covered', priority: 'Critical' },
      { skill: 'Kubernetes & Cloud Native Operators', coverage: 'Partially Covered', priority: 'Critical' },
      { skill: 'Distributed Systems & Consensus', coverage: 'Partially Covered', priority: 'High' }
    ]
  },
  industryDemand: {
    topDemandedSkills: [
      { skill: 'Kubernetes & Container Orchestration', demandIndex: 88, trend: 'High Growth (+14%)' },
      { skill: 'Vector Databases & RAG Architecture', demandIndex: 84, trend: 'Surging (+22%)' },
      { skill: 'Distributed Systems & Microservices', demandIndex: 82, trend: 'Consistent High' },
      { skill: 'Full-Stack TypeScript & React 19', demandIndex: 79, trend: 'High' }
    ],
    quadrantOverview: {
      highDemandLowReadiness: ['Vector Databases & RAG Search', 'Kubernetes CRDs', 'Rust Microservices'],
      highDemandHighReadiness: ['React 19 & Next.js', 'REST API Architecture', 'DSA & Problem Solving']
    }
  },
  interventions: {
    proposedCount: 2,
    approvedCount: 3,
    activeCount: 4,
    completedCount: 8,
    programs: [
      {
        interventionId: 'int_k8s_crds',
        title: 'Kubernetes Operator Pattern & CRD Masterclass',
        skillName: 'Kubernetes CRDs',
        type: 'Industry Workshop',
        status: 'Active',
        enrolledCount: 65,
        measuredImprovement: 18.4
      },
      {
        interventionId: 'int_rag_vectors',
        title: 'Applied Vector Search & RAG Architecture Sprint',
        skillName: 'Vector Databases & RAG Hybrid Search',
        type: 'Curriculum BootCamp',
        status: 'Active',
        enrolledCount: 78,
        measuredImprovement: 21.2
      },
      {
        interventionId: 'int_distributed_caching',
        title: 'Low-Latency Cache Invalidation & Redis Clusters',
        skillName: 'Distributed Caching',
        type: 'Flipped Classroom Lab',
        status: 'Completed',
        enrolledCount: 92,
        measuredImprovement: 19.6
      }
    ]
  },
  impact: {
    averageMeasuredSkillGain: 18.8,
    overallCompletionRate: 91.4,
    partnerEnterprisesCount: 14,
    verifiedPlacementsCount: 312
  }
};

export function getDemoContextForRole(role: 'student' | 'industry' | 'academician' | 'institution'): UnifiedSetuContext {
  const generatedAt = new Date().toISOString();
  switch (role) {
    case 'student':
      return {
        role: 'student',
        uid: 'demo_student_aarav',
        isDemo: true,
        generatedAt,
        dataCompletenessScore: 98,
        student: DEMO_STUDENT_SETU_CONTEXT,
        flags: ['DEMO_INTELLIGENCE', 'OBE_VERIFIED']
      };
    case 'industry':
      return {
        role: 'industry',
        uid: 'demo_industry_novacore',
        isDemo: true,
        generatedAt,
        dataCompletenessScore: 95,
        industry: DEMO_INDUSTRY_SETU_CONTEXT,
        flags: ['DEMO_INTELLIGENCE', 'PARTNER_VERIFIED']
      };
    case 'academician':
      return {
        role: 'academician',
        uid: 'demo_faculty_priya',
        isDemo: true,
        generatedAt,
        dataCompletenessScore: 96,
        academician: DEMO_ACADEMICIAN_SETU_CONTEXT,
        flags: ['DEMO_INTELLIGENCE', 'PASSPORT_VERIFIED']
      };
    case 'institution':
    default:
      return {
        role: 'institution',
        uid: 'demo_institution_apex',
        isDemo: true,
        generatedAt,
        dataCompletenessScore: 97,
        institution: DEMO_INSTITUTION_SETU_CONTEXT,
        flags: ['DEMO_INTELLIGENCE', 'NAAC_TIER1_CALIBRATED']
      };
  }
}
