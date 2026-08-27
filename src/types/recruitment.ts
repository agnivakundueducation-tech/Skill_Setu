export type InterviewType = 'Technical' | 'HR' | 'Managerial' | 'Panel';

export type InterviewStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';

export type InterviewEvaluationRecommendation = 'Strong Hire' | 'Hire' | 'Hold' | 'Reject';

export interface InterviewEvaluation {
  evaluationId: string;
  interviewId: string;
  applicationId: string;
  candidateId: string;
  interviewerId: string;
  interviewerName: string;
  technicalCompetency: number; // 1 to 5 scale
  problemSolving: number; // 1 to 5 scale
  communication: number; // 1 to 5 scale
  roleFit: number; // 1 to 5 scale
  overallRecommendation: InterviewEvaluationRecommendation;
  comments: string;
  submittedAt: string;
}

export interface InterviewRecord {
  interviewId: string;
  applicationId: string;
  candidateId: string; // studentId
  studentName?: string;
  studentEmail?: string;
  studentAvatar?: string;
  companyName: string;
  opportunityTitle: string;
  opportunityId?: string;
  recruiterId: string;
  recruiterName: string;
  interviewType: InterviewType;
  scheduledAt: string; // ISO datetime
  durationMinutes: number;
  meetingLinkOrLocation: string;
  status: InterviewStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  evaluation?: InterviewEvaluation;
}

export type OfferStatus = 'Pending' | 'Accepted' | 'Declined' | 'Expired' | 'Withdrawn';

export interface OfferRecord {
  offerId: string;
  applicationId: string;
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  studentAvatar?: string;
  organization: string; // companyName
  role: string; // opportunityTitle
  opportunityId?: string;
  employmentType: 'Full-time' | 'Internship' | 'Contract' | string;
  compensation: string;
  location: string;
  workMode: 'On-site' | 'Hybrid' | 'Remote';
  joiningDate: string;
  offerDate: string;
  responseDeadline: string;
  status: OfferStatus;
  notes?: string;
  decidedAt?: string;
  issuedBy: string; // recruiter UID
  issuedByName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlacementOutcomeRecord {
  placementId: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  studentAvatar?: string;
  institutionId?: string;
  institutionName?: string;
  organization: string;
  role: string;
  employmentType: string;
  compensation?: string;
  placementDate: string;
  joiningDate?: string;
  applicationId: string;
  offerId: string;
  verificationStatus: 'Verified';
  verifiedBy: string;
  cryptographicHash: string;
  createdAt: string;
}

export interface InstitutionPlacementMetrics {
  totalApplicants: number;
  shortlistedCandidates: number;
  interviewsScheduled: number;
  interviewsCompleted: number;
  offersIssued: number;
  offersAccepted: number;
  placedStudents: number;
  placementRate: number; // percentage e.g. 84.5
}

export interface IndustryRecruitmentMetrics {
  totalApplications: number;
  shortlisted: number;
  interviews: number;
  offers: number;
  acceptedOffers: number;
  hired: number;
}
