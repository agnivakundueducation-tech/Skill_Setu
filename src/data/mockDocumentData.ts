/**
 * Isolated Demo Mock Documents for Student Vault (SIH PS 26044)
 * Strict isolation: Used strictly when isDemo = true. Never persisted to live Firestore.
 */

import { VaultDocument } from '../types/document';

export const INITIAL_DEMO_DOCUMENTS: VaultDocument[] = [
  {
    id: 'demo-doc-1',
    ownerId: 'demo-student-id',
    ownerName: 'Aarav Sharma',
    ownerEmail: 'aarav.sharma@skillsetu.demo',
    category: 'Resume',
    fileName: 'Aarav_Sharma_FullStack_Resume_2026.pdf',
    fileType: 'application/pdf',
    fileSize: 1240000, // 1.24 MB
    storagePath: 'demo/students/demo-student-id/resumes/Aarav_Sharma_FullStack_Resume_2026.pdf',
    downloadUrl: 'https://skillsetu.ai/resumes/aarav_sharma_verified.pdf',
    uploadedAt: '2026-08-10T11:00:00.000Z',
    verificationStatus: 'Verified',
    source: 'Student Upload',
    relatedContext: {
      type: 'portfolio',
      title: 'Career Passport Primary Master Resume',
      organization: 'SkillSetu AI Verified',
      gradeOrScore: 'ATS Score: 94/100'
    },
    verifiedAt: '2026-08-10T12:00:00.000Z',
    verifiedBy: 'SkillSetu Automated ATS Benchmark Engine',
    verificationNotes: 'Structure, keyword density, and technical taxonomy validated against enterprise standards.',
    tags: ['Primary Resume', 'ATS 94%', 'Verified', 'Full-Stack'],
    metadata: {
      atsScore: 94,
      targetRole: 'Full-Stack Software Engineer'
    }
  },
  {
    id: 'demo-doc-2',
    ownerId: 'demo-student-id',
    ownerName: 'Aarav Sharma',
    ownerEmail: 'aarav.sharma@skillsetu.demo',
    category: 'Certificates',
    fileName: 'Google_Cloud_Professional_Architect_Certificate.pdf',
    fileType: 'application/pdf',
    fileSize: 845000,
    storagePath: 'demo/students/demo-student-id/certificates/Google_Cloud_Professional_Architect.pdf',
    downloadUrl: 'https://skillsetu.ai/credentials/GCP-SETU-2026-9812A.pdf',
    uploadedAt: '2026-06-15T09:30:00.000Z',
    verificationStatus: 'Verified',
    source: 'Career Passport',
    relatedContext: {
      type: 'learning_program',
      id: 'gcp-pca-2026',
      title: 'Google Cloud Certified Professional Cloud Architect',
      organization: 'Google Cloud & Coursera',
      verificationHash: 'GCP-SETU-2026-9812A',
      gradeOrScore: 'Platinum Tier',
      skillsEndorsed: ['Cloud Architecture', 'GCP', 'Kubernetes', 'Terraform']
    },
    verifiedAt: '2026-06-15T09:35:00.000Z',
    verifiedBy: 'Google Cloud Credential Registry',
    verificationNotes: 'Cryptographic hash and accreditation validity verified against official Google Cloud ledger.',
    tags: ['Google Cloud', 'Cloud Architect', 'Platinum Tier', 'Accredited']
  },
  {
    id: 'demo-doc-3',
    ownerId: 'demo-student-id',
    ownerName: 'Aarav Sharma',
    ownerEmail: 'aarav.sharma@skillsetu.demo',
    category: 'Certificates',
    fileName: 'Apex_GenAI_Microservices_Accreditation.pdf',
    fileType: 'application/pdf',
    fileSize: 620000,
    storagePath: 'demo/students/demo-student-id/certificates/Apex_GenAI_Microservices.pdf',
    downloadUrl: 'https://skillsetu.ai/credentials/SETU-PROG-2026-A1X9.pdf',
    uploadedAt: '2026-08-20T14:15:00.000Z',
    verificationStatus: 'Verified',
    source: 'Industry Learning',
    relatedContext: {
      type: 'learning_program',
      id: 'prog-apex-genai-2026',
      title: 'Enterprise GenAI & Microservices Architecture Masterclass',
      organization: 'Apex Cloud Systems',
      verificationHash: 'SETU-PROG-2026-A1X9',
      gradeOrScore: 'Distinction (96%)',
      skillsEndorsed: ['Go', 'gRPC', 'Distributed Systems', 'LLM Agents']
    },
    verifiedAt: '2026-08-20T14:15:00.000Z',
    verifiedBy: 'Dr. Rajesh Nair (Principal Architect, Apex)',
    verificationNotes: 'Awarded with Distinction upon successful delivery of high-concurrency microservice capstone.',
    tags: ['Industry Learning', 'Distinction', 'Apex Cloud', 'Microservices']
  },
  {
    id: 'demo-doc-4',
    ownerId: 'demo-student-id',
    ownerName: 'Aarav Sharma',
    ownerEmail: 'aarav.sharma@skillsetu.demo',
    category: 'Internship Reports',
    fileName: 'Apex_Cloud_Distributed_Systems_Internship_Capstone_Report.pdf',
    fileType: 'application/pdf',
    fileSize: 3420000, // 3.42 MB
    storagePath: 'demo/students/demo-student-id/internships/demo-internship-1/report.pdf',
    downloadUrl: 'https://skillsetu.ai/reports/apex_cloud_internship_report.pdf',
    uploadedAt: '2026-08-22T16:45:00.000Z',
    verificationStatus: 'Verified',
    source: 'Internship Lifecycle',
    relatedContext: {
      type: 'internship',
      id: 'demo-internship-1',
      title: 'Full-Stack Software Engineer Intern',
      organization: 'Apex Cloud Systems',
      verificationHash: 'SETU-INT-2026-X9B2',
      gradeOrScore: 'Final Rating: 4.9/5.0'
    },
    verifiedAt: '2026-08-24T10:00:00.000Z',
    verifiedBy: 'Siddharth Rao (Engineering Director, Apex)',
    verificationNotes: 'Comprehensive technical review approved. Capstone codebase benchmarked at 99.98% uptime.',
    tags: ['Internship Capstone', 'PPO Approved', 'Technical Thesis']
  },
  {
    id: 'demo-doc-5',
    ownerId: 'demo-student-id',
    ownerName: 'Aarav Sharma',
    ownerEmail: 'aarav.sharma@skillsetu.demo',
    category: 'Academic Records',
    fileName: 'NIT_Official_Transcript_Sem1_Sem6.pdf',
    fileType: 'application/pdf',
    fileSize: 2150000, // 2.15 MB
    storagePath: 'demo/students/demo-student-id/academic/NIT_Official_Transcript.pdf',
    downloadUrl: 'https://skillsetu.ai/transcripts/aarav_sharma_nit_transcript.pdf',
    uploadedAt: '2026-07-01T08:00:00.000Z',
    verificationStatus: 'Verified',
    source: 'Institutional Record',
    relatedContext: {
      type: 'academic',
      id: 'inst-nit-2026',
      title: 'Official Academic Transcript (Semesters 1-6)',
      organization: 'National Institute of Technology (NIT)',
      gradeOrScore: '9.42 / 10.0 CGPA (Top 1%)'
    },
    verifiedAt: '2026-07-02T11:20:00.000Z',
    verifiedBy: 'Dean of Academic Affairs (NIT Karnataka)',
    verificationNotes: 'Digitally signed and sealed by Registrar Office.',
    tags: ['Transcript', 'Top 1%', 'NIT Karnataka', 'Academic']
  },
  {
    id: 'demo-doc-6',
    ownerId: 'demo-student-id',
    ownerName: 'Aarav Sharma',
    ownerEmail: 'aarav.sharma@skillsetu.demo',
    category: 'Project Evidence',
    fileName: 'SkillSetu_Distributed_Caching_Engine_Whitepaper.pdf',
    fileType: 'application/pdf',
    fileSize: 1820000,
    storagePath: 'demo/students/demo-student-id/projects/distributed_caching_whitepaper.pdf',
    downloadUrl: 'https://skillsetu.ai/whitepapers/distributed_caching.pdf',
    uploadedAt: '2026-08-05T15:30:00.000Z',
    verificationStatus: 'Verified',
    source: 'Student Upload',
    relatedContext: {
      type: 'project',
      id: 'proj-dist-cache',
      title: 'Distributed In-Memory Key-Value Store with Raft Consensus',
      organization: 'Open Source Community',
      gradeOrScore: 'GitHub 420+ Stars'
    },
    verifiedAt: '2026-08-06T14:00:00.000Z',
    verifiedBy: 'Faculty Advisor & GitHub Verifier',
    verificationNotes: 'Code repository commits and benchmark results verified.',
    tags: ['System Design', 'Raft Consensus', 'Golang', 'Open Source']
  },
  {
    id: 'demo-doc-7',
    ownerId: 'demo-student-id',
    ownerName: 'Aarav Sharma',
    ownerEmail: 'aarav.sharma@skillsetu.demo',
    category: 'Other Supporting Documents',
    fileName: 'Smart_India_Hackathon_Finalist_Certificate.pdf',
    fileType: 'application/pdf',
    fileSize: 950000,
    storagePath: 'demo/students/demo-student-id/other/SIH_Finalist_Letter.pdf',
    downloadUrl: 'https://skillsetu.ai/awards/sih2026_finalist.pdf',
    uploadedAt: '2026-08-25T17:00:00.000Z',
    verificationStatus: 'Pending Verification',
    source: 'Student Upload',
    relatedContext: {
      type: 'general',
      title: 'Smart India Hackathon 2026 Grand Finalist Letter',
      organization: 'Ministry of Education Innovation Cell / AICTE'
    },
    verificationNotes: 'Under institutional review by College Placement & Incubation Cell.',
    tags: ['SIH 2026', 'National Finalist', 'AICTE']
  }
];
