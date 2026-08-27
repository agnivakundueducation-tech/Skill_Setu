import {
  InstitutionSkillGap,
  InterventionRecommendation,
  Intervention,
  InterventionEnrollment,
  CurriculumAlignmentItem,
  InstitutionalInterventionMetrics
} from '../types/intervention';

/**
 * DEMONSTRATION INSTITUTIONAL SKILL GAPS
 * Labeled explicitly as demonstration benchmark data.
 */
export const DEMO_INSTITUTION_SKILL_GAPS: InstitutionSkillGap[] = [
  {
    skillId: 'skill_cloud',
    skillName: 'Cloud Computing',
    category: 'technical',
    industryDemand: 48, // 48% of active opportunities
    averageStudentLevel: 41,
    industryRequiredLevel: 76,
    readinessGap: 35,
    affectedStudents: 312,
    totalAssessedStudents: 450,
    demandPriority: 'High',
    interventionPriority: 'CRITICAL',
    curriculumCoverage: 'Partially Covered',
    facultyReadinessScore: 58,
    explanation: 'Cloud Computing is identified as a Critical Priority because it appears in 48% of active job postings, while average student readiness is 41 against the industry threshold of 76 (gap of 35).'
  },
  {
    skillId: 'skill_docker',
    skillName: 'Docker & Kubernetes',
    category: 'technical',
    industryDemand: 42,
    averageStudentLevel: 27,
    industryRequiredLevel: 70,
    readinessGap: 43,
    affectedStudents: 368,
    totalAssessedStudents: 450,
    demandPriority: 'High',
    interventionPriority: 'HIGH',
    curriculumCoverage: 'Not Covered',
    facultyReadinessScore: 42,
    explanation: 'Docker & Kubernetes is identified as a High Priority intervention due to 42% market demand coupled with an acute readiness gap of 43 points and zero formal curriculum coverage.'
  },
  {
    skillId: 'skill_aiml',
    skillName: 'AI/ML & GenAI',
    category: 'technical',
    industryDemand: 62,
    averageStudentLevel: 45,
    industryRequiredLevel: 75,
    readinessGap: 30,
    affectedStudents: 295,
    totalAssessedStudents: 450,
    demandPriority: 'High',
    interventionPriority: 'CRITICAL',
    curriculumCoverage: 'Partially Covered',
    facultyReadinessScore: 64,
    explanation: 'AI/ML & GenAI represents the highest market volume demand (62%), with student readiness averaging 45 against required 75 (gap of 30), requiring both faculty FDP and hands-on bootcamp.'
  },
  {
    skillId: 'skill_cyber',
    skillName: 'Cybersecurity & SOC',
    category: 'technical',
    industryDemand: 38,
    averageStudentLevel: 32,
    industryRequiredLevel: 72,
    readinessGap: 40,
    affectedStudents: 240,
    totalAssessedStudents: 450,
    demandPriority: 'Moderate',
    interventionPriority: 'HIGH',
    curriculumCoverage: 'Not Covered',
    facultyReadinessScore: 35,
    explanation: 'Cybersecurity shows steady 38% demand across security analyst roles, but student readiness lags at 32 with insufficient lab infrastructure in the curriculum.'
  },
  {
    skillId: 'skill_fullstack',
    skillName: 'Full Stack & APIs',
    category: 'technical',
    industryDemand: 55,
    averageStudentLevel: 68,
    industryRequiredLevel: 75,
    readinessGap: 7,
    affectedStudents: 120,
    totalAssessedStudents: 450,
    demandPriority: 'High',
    interventionPriority: 'LOW',
    curriculumCoverage: 'Covered',
    facultyReadinessScore: 82,
    explanation: 'Full Stack Web Development has high demand (55%) but students already exhibit strong foundational readiness (68), resulting in a minor gap of only 7 points.'
  },
  {
    skillId: 'skill_dsa',
    skillName: 'DSA & Problem Solving',
    category: 'technical',
    industryDemand: 70,
    averageStudentLevel: 74,
    industryRequiredLevel: 80,
    readinessGap: 6,
    affectedStudents: 95,
    totalAssessedStudents: 450,
    demandPriority: 'High',
    interventionPriority: 'LOW',
    curriculumCoverage: 'Covered',
    facultyReadinessScore: 90,
    explanation: 'Data Structures and Algorithms is covered extensively in core syllabus; student readiness (74) closely tracks baseline industry screening requirements (80).'
  }
];

/**
 * DEMO INTERVENTION RECOMMENDATIONS
 * Derived with deterministic reasoning and transparent numbers.
 */
export const DEMO_INTERVENTION_RECOMMENDATIONS: InterventionRecommendation[] = [
  {
    recommendationId: 'rec_cloud_bootcamp',
    skillId: 'skill_cloud',
    skillName: 'Cloud Computing',
    priority: 'CRITICAL',
    reason: 'Cloud Computing is recommended as a High Priority intervention because it appears in 48% of active opportunities, while the average student readiness is 41 against a baseline requirement of 76 (gap of 35).',
    interventionType: 'Bootcamp',
    title: 'Industry-Led Cloud Computing & Infrastructure Bootcamp',
    description: '4-week immersive training program focusing on AWS/GCP cloud architectures, container deployments, serverless APIs, and live production infrastructure management.',
    targetAudience: 'Pre-final & Final Year CS/IT students (312 affected candidates)',
    expectedSkillImprovement: '+25 to +30 Readiness Points',
    estimatedDuration: '4 Weeks (32 Total Hours)',
    industryAlignment: 'Directly maps to Cloud Engineer, DevOps Analyst, and Infrastructure roles across 48% of enterprise postings.',
    requiredResources: ['Cloud Sandboxes (AWS/GCP)', 'Linux Lab Environment', 'Industry Mentor Access'],
    suggestedIndustryExpertise: ['Cloud Architecture', 'Terraform', 'Kubernetes Orchestration'],
    recommendedAction: 'Launch an industry-led Cloud Computing bootcamp followed by a hands-on deployment project.',
    status: 'Approved',
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-05T14:30:00Z'
  },
  {
    recommendationId: 'rec_docker_module',
    skillId: 'skill_docker',
    skillName: 'Docker & Kubernetes',
    priority: 'HIGH',
    reason: 'Docker is recommended as a High Priority intervention because it appears in 42% of active opportunities, student readiness is 27 against baseline 70 (gap of 43), and the skill is currently Not Covered in the academic syllabus.',
    interventionType: 'Curriculum Module',
    title: 'Modern Containerization & Microservices Curriculum Integration',
    description: 'Embed a 3-week practical lab module into the Operating Systems / Distributed Systems laboratory syllabus covering Dockerfile design, multi-stage builds, and Minikube orchestration.',
    targetAudience: '3rd Year Undergraduate CS/IT/ECE Cohorts',
    expectedSkillImprovement: '+35 Readiness Points in DevOps fundamentals',
    estimatedDuration: 'Semester-long Lab Module (18 Practical Lab Hours)',
    industryAlignment: 'Essential prerequisite for all modern backend, cloud-native, and full-stack software development positions.',
    requiredResources: ['Docker Desktop / Podman Licenses', 'CI/CD Lab Runners'],
    suggestedIndustryExpertise: ['Container Security', 'Helm Charts', 'Microservice Design'],
    recommendedAction: 'Add Docker and Containerization fundamentals to the practical laboratory curriculum.',
    status: 'Proposed',
    createdAt: '2026-03-02T11:00:00Z',
    updatedAt: '2026-03-02T11:00:00Z'
  },
  {
    recommendationId: 'rec_aiml_project',
    skillId: 'skill_aiml',
    skillName: 'AI/ML & GenAI',
    priority: 'CRITICAL',
    reason: 'AI/ML & GenAI is recommended as a Critical Priority because 62% of frontier industry postings require applied LLMs and model optimization, while student readiness is 45 against required 75 (gap of 30).',
    interventionType: 'Live Industry Project',
    title: 'Applied GenAI & Triton Model Inference Industry Capstone',
    description: 'Co-supervised industrial project where student teams build real-time retrieval-augmented generation (RAG) pipelines and deploy quantized transformer models with industry engineers.',
    targetAudience: 'Top 30% assessed AI/ML track students (80 students)',
    expectedSkillImprovement: '+28 Points in Model Serving & RAG engineering',
    estimatedDuration: '6 Weeks (Sponsorship + Review Milestones)',
    industryAlignment: 'Meets urgent enterprise demand for GenAI Developers and Machine Learning Engineers.',
    requiredResources: ['NVIDIA GPU Compute Clusters', 'Vector Database Subscriptions'],
    suggestedIndustryExpertise: ['vLLM / Triton Serving', 'LangChain / LlamaIndex', 'Quantization (LoRA)'],
    recommendedAction: 'Sponsor a collaborative Live Industry Capstone in applied GenAI inference with enterprise co-mentors.',
    status: 'Approved',
    createdAt: '2026-03-03T09:00:00Z',
    updatedAt: '2026-03-10T16:00:00Z'
  },
  {
    recommendationId: 'rec_cyber_fdp',
    skillId: 'skill_cyber',
    skillName: 'Cybersecurity & SOC',
    priority: 'HIGH',
    reason: 'Cybersecurity is recommended as a Faculty & Curriculum Intervention because industry demand is 38%, student readiness is 32 (gap of 40), and faculty readiness is currently 35 with no dedicated SOC infrastructure.',
    interventionType: 'Faculty Development Program',
    title: 'Industry Faculty Immersion in SOC Operations & DevSecOps',
    description: '5-day intensive masterclass for CSE faculty members covering Red/Blue team simulators, SIEM telemetry with Splunk/ELK, and automated vulnerability scanning in pipelines.',
    targetAudience: '15 Faculty Members across Computer Science and Information Security',
    expectedSkillImprovement: '+30 Faculty Proficiency & Pedagogy Alignment',
    estimatedDuration: '5 Days (30 Hours Masterclass)',
    industryAlignment: 'Enables faculty to launch certified cyber range electives and student vulnerability research labs.',
    requiredResources: ['Cloud Cyber Range Environment', 'Industry Master Trainer'],
    suggestedIndustryExpertise: ['Threat Hunting', 'OWASP Top 10', 'SOC Tier-2 Analysis'],
    recommendedAction: 'Faculty members may benefit from an industry-led Cloud Infrastructure & Cybersecurity FDP.',
    status: 'Proposed',
    createdAt: '2026-03-04T14:00:00Z',
    updatedAt: '2026-03-04T14:00:00Z'
  }
];

/**
 * DEMO INTERVENTIONS (Full Lifecycle Records)
 */
export const DEMO_INTERVENTIONS: Intervention[] = [
  {
    interventionId: 'int_cloud_bootcamp_2026',
    institutionId: 'inst_nit',
    institutionName: 'National Institute of Technology',
    skillId: 'skill_cloud',
    skillName: 'Cloud Computing',
    recommendationId: 'rec_cloud_bootcamp',
    interventionType: 'Bootcamp',
    title: 'Industry-Led Cloud Computing & Infrastructure Bootcamp',
    description: '4-week hands-on bootcamp covering AWS/GCP architecture, Terraform automation, and Docker container deployment.',
    partnerIndustryId: 'ind_novacore',
    partnerIndustryName: 'NovaCore Technologies Inc.',
    assignedMentorsCount: 3,
    industryResponsibilities: 'Provide 3 senior cloud architects for weekly live code reviews, architecture critiques, and mock interview assessments.',
    startDate: '2026-02-01',
    endDate: '2026-03-01',
    capacity: 50,
    enrolledCount: 48,
    completedCount: 42,
    status: 'Evaluated',
    preAvgScore: 41,
    postAvgScore: 67,
    measuredImprovement: 26,
    outcomesSummary: '42 students completed the bootcamp. Average readiness increased from 41 to 67 (+26 delta). 8 students received direct summer internship offers from NovaCore Technologies.',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-03-02T16:00:00Z'
  },
  {
    interventionId: 'int_genai_capstone_2026',
    institutionId: 'inst_nit',
    institutionName: 'National Institute of Technology',
    skillId: 'skill_aiml',
    skillName: 'AI/ML & GenAI',
    recommendationId: 'rec_aiml_project',
    interventionType: 'Live Industry Project',
    title: 'Applied GenAI & Triton Model Inference Industry Capstone',
    description: 'Student engineering teams building production RAG pipelines and deploying quantized transformer models under enterprise guidance.',
    partnerIndustryId: 'ind_novacore',
    partnerIndustryName: 'NovaCore Technologies Inc.',
    assignedMentorsCount: 2,
    industryResponsibilities: 'Provide GPU compute credits and bi-weekly milestone evaluations on latency and accuracy metrics.',
    startDate: '2026-03-15',
    endDate: '2026-04-30',
    capacity: 40,
    enrolledCount: 36,
    completedCount: 0,
    status: 'Active',
    preAvgScore: 45,
    createdAt: '2026-03-05T10:00:00Z',
    updatedAt: '2026-03-15T08:00:00Z'
  },
  {
    interventionId: 'int_cyber_workshop_2026',
    institutionId: 'inst_nit',
    institutionName: 'National Institute of Technology',
    skillId: 'skill_cyber',
    skillName: 'Cybersecurity & SOC',
    interventionType: 'Industry Workshop',
    title: 'Industry-Led SOC Threat Hunting & Vulnerability Workshop',
    description: 'Hands-on Red/Blue simulator lab with real-time attack detection and SIEM log analysis.',
    partnerIndustryId: 'ind_cyberguard',
    partnerIndustryName: 'CyberGuard Systems',
    assignedMentorsCount: 2,
    industryResponsibilities: 'Deliver 16 hours of live cyber range exercises and provide automated grading sandboxes.',
    startDate: '2026-04-10',
    endDate: '2026-04-20',
    capacity: 60,
    enrolledCount: 45,
    completedCount: 0,
    status: 'Scheduled',
    preAvgScore: 32,
    createdAt: '2026-03-10T12:00:00Z',
    updatedAt: '2026-03-18T11:00:00Z'
  },
  {
    interventionId: 'int_cloud_fdp_2026',
    institutionId: 'inst_nit',
    institutionName: 'National Institute of Technology',
    skillId: 'skill_cloud',
    skillName: 'Cloud Computing',
    interventionType: 'Faculty Development Program',
    title: 'Cloud Infrastructure & Kubernetes Faculty Development Program',
    description: '5-day faculty upskilling masterclass aligned with enterprise cloud-native syllabus requirements.',
    partnerIndustryId: 'ind_novacore',
    partnerIndustryName: 'NovaCore Technologies Inc.',
    assignedMentorsCount: 2,
    industryResponsibilities: 'Conduct curriculum co-design sessions and train 15 faculty members on distributed cloud labs.',
    startDate: '2026-05-05',
    endDate: '2026-05-10',
    capacity: 20,
    enrolledCount: 16,
    completedCount: 0,
    status: 'Approved',
    createdAt: '2026-03-12T15:00:00Z',
    updatedAt: '2026-03-12T15:00:00Z'
  }
];

/**
 * DEMO STUDENT INTERVENTION ENROLLMENTS (Measurable Skill Improvement)
 */
export const DEMO_INTERVENTION_ENROLLMENTS: InterventionEnrollment[] = [
  {
    enrollmentId: 'enr_stu_01_cloud',
    interventionId: 'int_cloud_bootcamp_2026',
    interventionTitle: 'Industry-Led Cloud Computing & Infrastructure Bootcamp',
    interventionType: 'Bootcamp',
    skillName: 'Cloud Computing',
    studentId: 'student_001',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@nit.ac.in',
    institutionId: 'inst_nit',
    status: 'Completed',
    enrolledAt: '2026-01-20T10:00:00Z',
    completionStatus: 'Distinction',
    completedAt: '2026-03-01T15:00:00Z',
    preSkillLevel: 41,
    postSkillLevel: 67,
    improvement: 26,
    assessmentDate: '2026-03-01',
    outcomeScore: 92,
    feedback: 'Exceptional hands-on clarity. Building actual multi-tier deployments helped me bridge theoretical knowledge to industry standards.'
  },
  {
    enrollmentId: 'enr_stu_01_genai',
    interventionId: 'int_genai_capstone_2026',
    interventionTitle: 'Applied GenAI & Triton Model Inference Industry Capstone',
    interventionType: 'Live Industry Project',
    skillName: 'AI/ML & GenAI',
    studentId: 'student_001',
    studentName: 'Aarav Sharma',
    studentEmail: 'aarav.sharma@nit.ac.in',
    institutionId: 'inst_nit',
    status: 'In Progress',
    enrolledAt: '2026-03-10T11:00:00Z',
    completionStatus: 'Pending',
    preSkillLevel: 45
  },
  {
    enrollmentId: 'enr_stu_02_cloud',
    interventionId: 'int_cloud_bootcamp_2026',
    interventionTitle: 'Industry-Led Cloud Computing & Infrastructure Bootcamp',
    interventionType: 'Bootcamp',
    skillName: 'Cloud Computing',
    studentId: 'student_002',
    studentName: 'Priya Patel',
    studentEmail: 'priya.patel@nit.ac.in',
    institutionId: 'inst_nit',
    status: 'Completed',
    enrolledAt: '2026-01-22T09:30:00Z',
    completionStatus: 'Passed',
    completedAt: '2026-03-01T15:00:00Z',
    preSkillLevel: 38,
    postSkillLevel: 64,
    improvement: 26,
    assessmentDate: '2026-03-01',
    outcomeScore: 86,
    feedback: 'Loved the code review sessions with NovaCore architects.'
  }
];

/**
 * DEMO CURRICULUM ALIGNMENT CONFIGURATION
 */
export const DEMO_CURRICULUM_ALIGNMENTS: CurriculumAlignmentItem[] = [
  {
    skillId: 'skill_cloud',
    skillName: 'Cloud Computing',
    industryDemand: 48,
    studentReadiness: 41,
    curriculumCoverage: 'Partially Covered',
    priority: 'CRITICAL',
    recommendedAction: 'Upgrade legacy Distributed Computing elective to modern AWS/GCP cloud-native lab.'
  },
  {
    skillId: 'skill_docker',
    skillName: 'Docker & Containerization',
    industryDemand: 42,
    studentReadiness: 27,
    curriculumCoverage: 'Not Covered',
    priority: 'HIGH',
    recommendedAction: 'Add Docker and Containerization fundamentals to the practical laboratory curriculum.'
  },
  {
    skillId: 'skill_aiml',
    skillName: 'Applied GenAI & LLMs',
    industryDemand: 62,
    studentReadiness: 45,
    curriculumCoverage: 'Partially Covered',
    priority: 'CRITICAL',
    recommendedAction: 'Introduce 4-credit MLOps and transformer fine-tuning curriculum module in Semester 6.'
  },
  {
    skillId: 'skill_cyber',
    skillName: 'Cybersecurity & SOC Ops',
    industryDemand: 38,
    studentReadiness: 32,
    curriculumCoverage: 'Not Covered',
    priority: 'HIGH',
    recommendedAction: 'Establish an industry-backed Cyber Range & SOC Simulator Lab with CEH micro-credentials.'
  },
  {
    skillId: 'skill_fullstack',
    skillName: 'Full Stack & APIs',
    industryDemand: 55,
    studentReadiness: 68,
    curriculumCoverage: 'Covered',
    priority: 'LOW',
    recommendedAction: 'Maintain current syllabus while adding GraphQL/gRPC mini-projects.'
  },
  {
    skillId: 'skill_dsa',
    skillName: 'Data Structures & Algorithms',
    industryDemand: 70,
    studentReadiness: 74,
    curriculumCoverage: 'Covered',
    priority: 'LOW',
    recommendedAction: 'Current core syllabus meets requirements; maintain periodic competitive programming hackathons.'
  }
];

/**
 * DEMO AGGREGATED INTERVENTION METRICS
 */
export const DEMO_INTERVENTION_METRICS: InstitutionalInterventionMetrics = {
  industryAlignedSkills: 18,
  criticalSkillGaps: 4,
  activeInterventions: 3,
  studentsEnrolled: 129,
  averageSkillImprovement: 26, // +26 score
  industryParticipation: 8, // 8 industry partners providing mentors/labs
  completedInterventions: 6
};
