export interface JobPosting {
  id: string;
  title: string;
  type: 'job' | 'internship';
  department: string;
  location: string;
  workType: 'Remote' | 'Hybrid' | 'On-site';
  salaryOrStipend: string;
  duration?: string; // For internships e.g. "6 Months"
  openSlots: number;
  experienceLevel: 'Entry Level / 0-1 yrs' | 'Associate / 1-3 yrs' | 'Mid-Senior' | 'Pre-Final / Final Year';
  status: 'active' | 'paused' | 'closed';
  postedDate: string;
  deadline: string;
  description: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  minMatchScore: number;
  applicantsCount: number;
  shortlistedCount: number;
  interviewingCount: number;
  hiredCount: number;
}

export interface LiveProjectPosting {
  id: string;
  title: string;
  category: 'Distributed Systems' | 'AI & LLMs' | 'Cloud Infrastructure' | 'Frontend Architecture' | 'Cybersecurity' | 'Mobile & IoT';
  problemStatement: string;
  bountyOrGrant: string;
  duration: string;
  status: 'active' | 'in-review' | 'completed';
  postedDate: string;
  deadline: string;
  submissionsCount: number;
  shortlistedCount: number;
  deliverables: string[];
  requiredTechStack: string[];
  mentorLead: {
    name: string;
    role: string;
    avatar: string;
  };
}

export interface WorkshopPosting {
  id: string;
  title: string;
  instructor: string;
  instructorRole: string;
  instructorAvatar: string;
  date: string;
  time: string;
  duration: string;
  platform: 'Virtual (SkillSetu Live)' | 'Campus Lab (In-Person)' | 'Hybrid Masterclass';
  locationDetails?: string;
  targetAudience: string;
  registeredCount: number;
  capacity: number;
  status: 'upcoming' | 'live' | 'completed';
  prerequisites: string[];
  agenda: string[];
  certificateIssued: boolean;
}

export interface IndustryCandidate {
  id: string;
  fullName: string;
  avatarUrl: string;
  email: string;
  phone: string;
  location: string;
  targetRole: string;
  institution: string;
  degree: string;
  cgpa: string;
  graduationBatch: string;
  matchScore: number;
  matchBreakdown: {
    skillCompatibility: number;
    projectRelevance: number;
    academicStanding: number;
    assessmentScore: number;
  };
  skills: {
    name: string;
    level: string;
    verified: boolean;
    score: number;
  }[];
  projects: {
    id: string;
    title: string;
    tagline: string;
    category: string;
    starsCount?: number;
    metrics?: string;
    technologies: string[];
    githubUrl?: string;
    verified: boolean;
  }[];
  certifications: {
    id: string;
    title: string;
    issuer: string;
    badgeLevel: string;
    gradeScore?: string;
    verified: boolean;
  }[];
  appliedFor?: {
    jobId: string;
    jobTitle: string;
    jobType: 'job' | 'internship';
    appliedDate: string;
    status: 'New' | 'Under Review' | 'Shortlisted' | 'Technical Round' | 'Interview Scheduled' | 'Offered' | 'Rejected';
    notes?: string;
  };
  isShortlisted: boolean;
  notesCount?: number;
}
