export type ApplicationLifecycleStatus =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview'
  | 'Selected'
  | 'Rejected'
  | 'Withdrawn';

export interface ApplicationRecord {
  applicationId: string;
  opportunityId: string;
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  studentInstitution?: string;
  studentDegree?: string;
  studentAvatar?: string;
  companyName: string;
  opportunityTitle: string;
  status: ApplicationLifecycleStatus;
  matchScoreAtApplication: number; // Stored snapshot at application time
  requiredSkillMatch?: number;
  preferredSkillMatch?: number;
  matchedSkills: string[];
  skillGaps: string[];
  resumeURL: string;
  coverLetter?: string;
  appliedAt: string;
  updatedAt: string;
  recruiterNotes?: string;
  postedBy?: string; // Industry UID of the opportunity creator
  location?: string;
  workMode?: string;
  stipend?: string;
  opportunityType?: string;
}

export interface ApplicationTimelineEvent {
  status: ApplicationLifecycleStatus;
  label: string;
  date: string;
  completed: boolean;
  current: boolean;
  notes?: string;
}
