export type OpportunityType = 'Internship' | 'Full-Time' | 'Apprenticeship' | 'Live Project' | 'Part-Time';
export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';
export type SkillImportance = 'required' | 'preferred';
export type OpportunityStatus = 'active' | 'paused' | 'closed';

export interface RequiredSkill {
  skillId: string;
  skillName: string;
  requiredLevel: number; // 0 - 100
  importance: SkillImportance;
  category?: string;
}

export interface OpportunityRecord {
  opportunityId: string;
  title: string;
  companyName: string;
  companyLogo: string;
  companyBanner?: string;
  opportunityType: OpportunityType;
  description: string;
  location: string;
  city?: string;
  workMode: WorkMode;
  duration: string;
  stipend: string;
  salaryMin?: number;
  salaryMax?: number;
  applicationDeadline: string;
  requiredSkills: RequiredSkill[];
  preferredSkills: RequiredSkill[];
  eligibility: string;
  experienceLevel: string;
  domain: string;
  postedBy: string; // Industry User UID
  institutionVisibility: string[] | 'All';
  status: OpportunityStatus;
  openSlots?: number;
  applicantsCount?: number;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OpportunityFilterParams {
  searchQuery?: string;
  minMatchScore?: number;
  domain?: string;
  opportunityType?: string;
  workMode?: string;
  location?: string;
  skillCategory?: string;
  sortBy?: 'match' | 'recent' | 'deadline' | 'applicants';
}
