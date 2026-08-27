import { ShowcaseStep } from '../types/showcase';

export const SIH_SHOWCASE_STEPS: ShowcaseStep[] = [
  {
    stepNumber: 1,
    id: 'industry-demand',
    role: 'industry',
    roleTitle: 'Industry Partner',
    title: 'Industry Demand Signal',
    subtitle: 'Market Skill Prerequisites & Technical Specifications',
    entityName: 'NovaCore Technologies & CloudScale Networks',
    route: '/dashboard/industry',
    targetTab: 'overview',
    contextExplanation: 'Industry requirements become the input for institutional skill-gap analysis and dynamic workforce calibration.',
    whyItMatters: 'Without structured industry demand signals, academic curricula lag industry standards. SkillSetu extracts structured skill weightings (Cloud Architecture, Docker, Kubernetes, Distributed Systems) directly from enterprise job postings.',
    copilotPrompt: 'What skills are most demanded by industry partners?',
    metrics: [
      { label: 'Demand Index', value: '94%', badge: 'High Demand' },
      { label: 'Top Skill Signal', value: 'Cloud & Distributed Systems' },
      { label: 'Active Industry Postings', value: '18 Openings' }
    ],
    keyTakeaway: 'Live job requirements establish the dynamic benchmark for all downstream academic calibration.',
    actionLabel: 'Inspect Industry Demand'
  },
  {
    stepNumber: 2,
    id: 'institution-skill-gap',
    role: 'institution',
    roleTitle: 'Higher Education Institution',
    title: 'Institutional Readiness & Skill Gap Calibration',
    subtitle: 'Comparing Student Readiness vs Market Demand',
    entityName: 'Apex Institute of Technology & Research (NIT Campus)',
    route: '/dashboard/institution',
    targetTab: 'demand_readiness',
    contextExplanation: 'SkillSetu compares live industry demand with student assessment readiness to identify actionable institutional gaps.',
    whyItMatters: 'Aggregated student assessment data reveals a critical bottleneck: while foundational CS theory is strong, practical Cloud/DevOps competencies show a 35-point deficit requiring targeted intervention.',
    copilotPrompt: 'Explain this skill gap and its impact on placement.',
    metrics: [
      { label: 'Assessed Students', value: '4,120 of 4,800', badge: '85.8%' },
      { label: 'Cloud Systems Gap', value: '-35% Deficit', badge: 'Critical' },
      { label: 'Curriculum Deficits', value: '3 Gaps Identified' }
    ],
    keyTakeaway: 'Objective evidence highlights curriculum blindspots months before placement season begins.',
    actionLabel: 'Analyze Skill Gap Heatmap'
  },
  {
    stepNumber: 3,
    id: 'institution-intervention',
    role: 'institution',
    roleTitle: 'Higher Education Institution',
    title: 'AI-Synthesized Skill Intervention',
    subtitle: 'Targeted Hands-On Bootcamp & Curriculum Modernization',
    entityName: 'Cloud & Distributed Systems Accelerator (INT-2026-001)',
    route: '/dashboard/institution',
    targetTab: 'intervention_center',
    contextExplanation: 'Institutions approve AI-synthesized bootcamps and workshops to rapidly close identified competency gaps.',
    whyItMatters: 'Rather than waiting years for textbook revisions, institutions launch structured 6-week micro-interventions with industry co-mentorship to elevate cohort readiness before placement season.',
    copilotPrompt: 'What intervention should we launch to close this gap?',
    metrics: [
      { label: 'Target Cohort Size', value: '120 Students' },
      { label: 'Measured Skill Delta', value: '+28% Gain', badge: 'Pre/Post Verified' },
      { label: 'Industry Co-Sponsor', value: 'NovaCore Technologies' }
    ],
    keyTakeaway: 'Rapid micro-interventions close the gap in weeks with measurable, audited skill gains.',
    actionLabel: 'Review Active Intervention'
  },
  {
    stepNumber: 4,
    id: 'faculty-mentor',
    role: 'academician',
    roleTitle: 'Faculty Member / Academician',
    title: 'Faculty Enablement & Industry Co-Mentorship',
    subtitle: 'Matching Academic Expertise to Intervention Tracks',
    entityName: 'Dr. Priya Sharma & Dr. K. Raman (Distributed Systems)',
    route: '/dashboard/academician',
    targetTab: 'marketplace',
    contextExplanation: 'Faculty expertise is systematically matched to intervention requirements and joint research projects.',
    whyItMatters: 'Faculty members participate in industry immersion programs (FDPs) and co-lead student interventions, ensuring sustainable pedagogical upgrades recognized by NAAC/NBA accreditation criteria.',
    copilotPrompt: 'Why was this faculty member selected for this intervention?',
    metrics: [
      { label: 'Faculty Passport Score', value: '92 / 100', badge: 'Tier-1 Verified' },
      { label: 'Certified FDPs', value: '4 Programs' },
      { label: 'Active Linkages', value: '2 Joint Projects' }
    ],
    keyTakeaway: 'Empowering faculty with industry exposure elevates teaching quality across entire departments.',
    actionLabel: 'View Faculty Hub & Collaborations'
  },
  {
    stepNumber: 5,
    id: 'student-skill-dna',
    role: 'student',
    roleTitle: 'Student Candidate',
    title: 'Student Competency & Skill DNA',
    subtitle: 'Multidimensional Evidence-Based Competency Profile',
    entityName: 'Alex Rivera (Final Year B.Tech CSE)',
    route: '/dashboard/student/skill-dna',
    targetTab: 'overview',
    contextExplanation: 'Student Skill DNA provides the verified evidence used for deterministic opportunity matching and career roadmaps.',
    whyItMatters: 'Instead of unverified resume bullet points, SkillSetu computes a verifiable Skill DNA radar across code verification, assessment milestones, and hands-on lab artifacts.',
    copilotPrompt: "Why is this student's readiness score at 87/100?",
    metrics: [
      { label: 'Readiness Index', value: '87 / 100', badge: 'Tier-1 Ready' },
      { label: 'National Percentile', value: 'Top 4%', badge: '96th %ile' },
      { label: 'Assessed Competencies', value: '12 Skills Verified' }
    ],
    keyTakeaway: 'Cryptographically verifiable Skill DNA replaces subjective self-reported resumes.',
    actionLabel: 'Inspect Student Skill DNA'
  },
  {
    stepNumber: 6,
    id: 'opportunity-match',
    role: 'student',
    roleTitle: 'Student Candidate',
    title: 'Deterministic Opportunity Compatibility',
    subtitle: 'Explainable Multi-Vector Competency Matching',
    entityName: 'NovaCore Technologies — Full-Stack & Distributed Systems Intern',
    route: '/dashboard/student/opportunities',
    targetTab: 'matched',
    contextExplanation: 'Explainable matching algorithms calculate deterministic candidate-opportunity compatibility scores.',
    whyItMatters: 'Matches are mathematically grounded in weighted core skills, project verification, and certification alignment with clear explanations of why a student qualifies.',
    copilotPrompt: 'Why is this student a good match for this role?',
    metrics: [
      { label: 'Match Compatibility Index', value: '96%', badge: 'Tier-1 Match' },
      { label: 'Skill Prerequisites Met', value: '8 of 8 Skills' },
      { label: 'Deterministic Score', value: 'Explainable Engine' }
    ],
    keyTakeaway: 'Matching is 100% explainable and deterministic, eliminating hiring guesswork and bias.',
    actionLabel: 'Explore Opportunity Match'
  },
  {
    stepNumber: 7,
    id: 'application-submission',
    role: 'student',
    roleTitle: 'Student Candidate',
    title: 'Application Submission & Candidate Journey',
    subtitle: 'Cryptographically Verified Application Package',
    entityName: 'NovaCore Application #APP-8842',
    route: '/dashboard/student/applications',
    targetTab: 'active',
    contextExplanation: 'Students submit verified credentials and track their multi-stage application progression in real time.',
    whyItMatters: 'Applications include verifiable evidence artifacts, eliminating manual screening overhead and accelerating recruiter evaluation.',
    copilotPrompt: 'Explain this recruitment application status and next steps.',
    metrics: [
      { label: 'Application Status', value: 'Technical Interview', badge: 'Active Pipeline' },
      { label: 'Pre-Screening Score', value: '94 / 100' },
      { label: 'Verified Code Repo', value: 'GitHub Synced' }
    ],
    keyTakeaway: 'Direct verification streamlines candidate screening and shortlists top performers instantly.',
    actionLabel: 'Track Application Lifecycle'
  },
  {
    stepNumber: 8,
    id: 'recruitment-pipeline',
    role: 'industry',
    roleTitle: 'Industry Recruiter',
    title: 'Recruiter ATS Pipeline & Evaluation',
    subtitle: 'Evidence-Based Candidate Progression',
    entityName: 'NovaCore Recruitment ATS Pipeline',
    route: '/dashboard/industry',
    targetTab: 'applications',
    contextExplanation: 'Recruiters receive explainable candidate recommendations with direct access to verified project code and test results.',
    whyItMatters: 'Hiring managers filter and advance talent based on verified skill competencies rather than keyword-stuffed resumes, cutting hiring cycles by 60%.',
    copilotPrompt: 'Explain this recruitment recommendation for Alex Rivera.',
    metrics: [
      { label: 'Rank in Candidate Pool', value: '#1 of 48', badge: 'Top Recommended' },
      { label: 'Verified Match Score', value: '96%' },
      { label: 'Evaluation Phase', value: 'Offer Generation' }
    ],
    keyTakeaway: 'Recruiters save hundreds of screening hours with pre-verified competency evidence.',
    actionLabel: 'Open Recruiter ATS Pipeline'
  },
  {
    stepNumber: 9,
    id: 'career-passport',
    role: 'student',
    roleTitle: 'Student / Graduate',
    title: 'Career Passport & Closed Loop Verification',
    subtitle: 'Verifiable Academic & Industry Credentials',
    entityName: 'SkillSetu Verified Career Passport #SKU-2026-AR',
    route: '/dashboard/student/portfolio',
    targetTab: 'profile',
    contextExplanation: 'SkillSetu closed the loop: from market demand signal to institutional intervention, faculty mentorship, student skill acquisition, deterministic matching, and verified placement outcome.',
    whyItMatters: 'Every learning milestone, project artifact, and assessment score culminates in a tamper-proof digital Career Passport ready for lifelong career progression.',
    copilotPrompt: 'Summarize the complete SkillSetu lifecycle.',
    metrics: [
      { label: 'Passport Sections', value: '8 Verified Categories', badge: 'Complete' },
      { label: 'Cryptographic Status', value: 'Synced & Validated' },
      { label: 'Closed Loop Attainment', value: '100% Accomplished', badge: 'Success' }
    ],
    keyTakeaway: 'SkillSetu connects all stakeholders into a unified, transparent, closed-loop talent ecosystem.',
    actionLabel: 'View Verified Career Passport'
  }
];

export const CLOSED_LOOP_NODES = [
  {
    step: 1,
    role: 'Industry',
    title: 'Market Demand',
    desc: 'Extracts real-time skill requirements from job openings.'
  },
  {
    step: 2,
    role: 'Institution',
    title: 'Skill Gap Matrix',
    desc: 'Benchmarks cohort readiness against industry demand.'
  },
  {
    step: 3,
    role: 'Institution',
    title: 'Intervention',
    desc: 'Launches targeted bootcamps & curriculum updates.'
  },
  {
    step: 4,
    role: 'Academician',
    title: 'Faculty Mentorship',
    desc: 'Empowers faculty with industry immersion & FDPs.'
  },
  {
    step: 5,
    role: 'Student',
    title: 'Skill DNA',
    desc: 'Constructs verified evidence-backed skill profiles.'
  },
  {
    step: 6,
    role: 'System',
    title: 'Deterministic Match',
    desc: 'Calculates explainable candidate-opportunity compatibility.'
  },
  {
    step: 7,
    role: 'Student',
    title: 'Verified Application',
    desc: 'Submits tamper-proof credentials directly to recruiters.'
  },
  {
    step: 8,
    role: 'Industry',
    title: 'Hiring & Offer',
    desc: 'Advances qualified talent through transparent pipeline.'
  },
  {
    step: 9,
    role: 'Outcome',
    title: 'Career Passport',
    desc: 'Records validated credentials in a lifelong portfolio.'
  }
];
