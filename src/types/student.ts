export interface SkillCategory {
  id: string;
  name: string;
  count: number;
  averageScore: number;
}

export interface SkillAssessed {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Cloud & DevOps' | 'AI & Data' | 'System Design' | 'Soft Skills';
  score: number; // 0-100
  level: 'Novice' | 'Intermediate' | 'Advanced' | 'Expert';
  verifiedBy: string;
  verificationBadge: string;
  lastAssessed: string;
  assessmentType: 'AI Adaptive' | 'Peer Review' | 'Industry Lab' | 'Proctored Coding';
  growth: number; // percentage change, e.g. +12
  endorsements: number;
  industryDemand: 'Very High' | 'High' | 'Moderate';
  relatedProjects: string[];
}

export type ApplicationStatus = 'Applied' | 'Shortlisted' | 'Assessment' | 'Interview' | 'Selected' | 'Rejected';

// Backwards compatibility alias
export type ApplicationStage = ApplicationStatus | 'Screening' | 'Technical Assessment' | 'System Design Interview' | 'Culture & HR' | 'Offer Received';

export interface ApplicationTimelineItem {
  id: string;
  stage: ApplicationStatus;
  title: string;
  date: string;
  description: string;
  completed: boolean;
  current?: boolean;
}

export interface ActiveApplication {
  id: string;
  company: string;
  companyLogo: string;
  roleTitle: string;
  location: string;
  workType: 'Remote' | 'Hybrid' | 'On-site';
  employmentType: 'Full-time' | 'Internship' | 'Micro-Internship' | 'Co-op' | 'Part-time';
  appliedDate: string;
  currentStage: ApplicationStatus;
  stageStep: number; // 1 to 5
  totalSteps: number;
  matchScore: number; // 0-100
  stipendOrSalary: string;
  nextStepDeadline?: string;
  nextStepTitle?: string;
  recruiterContact?: {
    name: string;
    role: string;
    email: string;
    phone?: string;
  };
  notes: string;
  status: 'active' | 'offer' | 'in-review' | 'completed' | 'urgent' | 'rejected';
  timelineHistory?: ApplicationTimelineItem[];
  rejectionReason?: string;
  feedback?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issuerLogo: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  verificationUrl: string;
  skills: string[];
  gradeScore?: string;
  badgeLevel: 'Gold' | 'Platinum' | 'Silver' | 'Verified';
  status: 'active' | 'expiring-soon' | 'verified';
  certificateImage?: string;
  blockchainHash?: string;
}

export type OpportunityType = 'Full-time' | 'Summer Internship' | 'Micro-Internship' | 'Co-op' | 'Part-time' | 'Open Source Gig';
export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  companyBanner?: string;
  industry?: string;
  location: string;
  city?: string;
  type: OpportunityType;
  mode: WorkMode;
  stipend: string;
  salaryMin?: number;
  salaryMax?: number;
  postedDate: string;
  deadline: string;
  deadlineDate?: string;
  matchScore: number;
  matchingSkills?: string[];
  missingSkills?: string[];
  skillsRequired: string[];
  description: string;
  responsibilities?: string[];
  requirements?: string[];
  perks?: string[];
  hiringProcess?: string[];
  openings: number;
  applicantsCount: number;
  featured?: boolean;
  isBookmarked?: boolean;
  department?: string;
  duration?: string;
  experienceLevel?: 'Intern' | 'Fresh Graduate' | '0-1 Years' | '1-2 Years';
}

export interface StudentProject {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  thumbnail: string;
  skills: string[];
  githubUrl: string;
  liveDemoUrl?: string;
  industryPartner?: string;
  mentorFeedbackScore?: number; // out of 100
  verifiedStatus: 'Industry Verified' | 'Faculty Verified' | 'In Review';
  starsCount?: number;
  metrics: {
    label: string;
    value: string;
  }[];
  completedDate: string;
}

export interface CareerReadinessScoreData {
  overallScore: number; // e.g. 87
  percentile: number; // e.g. 96
  tier: 'Tier-1 Industry Ready' | 'Enterprise Capable' | 'Foundation Building';
  monthlyChange: number; // +8.4%
  scoreBreakdown: {
    domain: string;
    score: number;
    benchmark: number;
    fullMark: number;
  }[];
  historicalTrends: {
    month: string;
    readinessScore: number;
    industryBenchmark: number;
    peerAverage: number;
  }[];
  strengths: string[];
  growthOpportunities: string[];
  targetRole: string;
  targetRoleMatch: number; // 91%
}

export interface AssessmentQuestion {
  id: number;
  category: string;
  difficulty: 'Medium' | 'Hard' | 'Advanced';
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  grade: string; // e.g., "9.42 / 10.0 CGPA (Top 1%)"
  honors?: string[];
  coursework: string[];
  activities?: string[];
  logo?: string;
}

export interface InternshipEntry {
  id: string;
  company: string;
  role: string;
  location: string;
  workType: 'Remote' | 'Hybrid' | 'On-site';
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  description: string;
  keyContributions: string[];
  technologies: string[];
  companyLogo: string;
  mentorName?: string;
  mentorTitle?: string;
  mentorRecommendation?: string;
  verifiedStatus: 'Verified by Employer' | 'Verified by SkillSetu' | 'Completed';
}

export interface AchievementEntry {
  id: string;
  title: string;
  category: 'Hackathon' | 'Competitive Programming' | 'Academic' | 'Open Source' | 'Fellowship';
  issuer: string;
  date: string;
  description: string;
  metric?: string;
  badgeText?: string;
  link?: string;
  iconName?: string;
}

export interface StudentProfileData {
  fullName: string;
  headline: string;
  tagline: string;
  bio: string;
  avatarUrl: string;
  bannerUrl?: string;
  email: string;
  phone: string;
  location: string;
  targetRole: string;
  readinessScore: number;
  openToWork: boolean;
  availableFrom: string;
  socials: {
    github: string;
    linkedin: string;
    portfolioWebsite: string;
    twitter?: string;
    leetcode?: string;
  };
  keyStats: {
    label: string;
    value: string;
    subtext: string;
  }[];
}
