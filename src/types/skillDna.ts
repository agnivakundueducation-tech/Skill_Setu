export type SkillType = 'technical' | 'professional';

export interface EvidenceArtifact {
  id: string;
  title: string;
  type: 'project' | 'certification' | 'assessment' | 'peer_review' | 'code_benchmark';
  date: string;
  verifiedBy: string;
  verificationBadge: string;
  proofUrl?: string;
  description: string;
  scoreOrMetric?: string;
}

export interface SkillDnaItem {
  id: string;
  name: string;
  category: SkillType;
  subcategory?: string;
  iconName: string;
  currentScore: number; // 0-100 (self/live active assessment)
  verificationScore: number; // 0-100 (AI / proctored verified score)
  evidenceCount: number;
  industryBenchmark: number; // 0-100 (target threshold)
  percentile: number; // e.g. 96th percentile
  level: 'Novice' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';
  growthChange: number; // e.g. +8%
  description: string;
  keyCompetencies: string[];
  evidenceList: EvidenceArtifact[];
  verificationStatus: 'verified' | 'in_review' | 'needs_reverification';
}

export interface SkillDnaOverallMetrics {
  overallVerifiedScore: number;
  overallCurrentScore: number;
  verificationConfidence: number; // percentage
  totalEvidenceCount: number;
  technicalAverage: number;
  professionalAverage: number;
  topPercentile: number;
  tier: string;
  lastUpdated: string;
}
