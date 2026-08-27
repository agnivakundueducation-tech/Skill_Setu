import {
  InstitutionSummaryMetrics,
  SkillDemandReadinessItem,
  DepartmentSkillHeatmapRow,
  SemesterProgressionHeatmapRow,
  PlacementTierItem,
  AICurriculumRecommendation
} from '../types/institution';

export const INITIAL_INSTITUTION_METRICS: InstitutionSummaryMetrics = {
  totalStudents: 4850,
  totalStudentsGrowth: '+12.4% vs last year',
  studentsAssessed: 4120,
  assessedPercentage: 84.9,
  assessedGrowth: '+18.2% YoY',
  placementReady: 2890,
  placementReadyPercentage: 70.1,
  placementReadyGrowth: '+15.6% YoY',
  internshipsSecured: 1480,
  internshipsPercentage: 51.2,
  internshipsGrowth: '+22.4% YoY',
  placementsCompleted: 1920,
  placementsPercentage: 66.4,
  placementsGrowth: '+14.1% YoY',
  averageSalaryCTC: '₹14.8 LPA',
  highestPackage: '₹48.5 LPA'
};

export const SKILL_DEMAND_READINESS_DATA: SkillDemandReadinessItem[] = [
  {
    id: 'skill_aiml',
    skill: 'AI/ML',
    industryDemand: 94,
    studentReadiness: 62,
    gap: -32,
    gapSeverity: 'critical',
    hiringOpeningsVolume: 1240,
    averageBenchmarkScore: 88,
    topCompaniesHiring: ['Google Cloud', 'NVIDIA', 'Microsoft', 'OpenAI Partners', 'Zomato AI'],
    subskills: [
      { name: 'LLMs & Transformer Fine-tuning', readinessScore: 48, industryWeight: 95, status: 'critical_gap' },
      { name: 'PyTorch & Neural Networks', readinessScore: 68, industryWeight: 90, status: 'moderate_gap' },
      { name: 'MLOps & Model Deployment (Docker/Triton)', readinessScore: 42, industryWeight: 88, status: 'critical_gap' },
      { name: 'Vector DBs & RAG Architecture', readinessScore: 54, industryWeight: 92, status: 'critical_gap' },
      { name: 'Classical ML & Feature Engineering', readinessScore: 84, industryWeight: 80, status: 'aligned' }
    ],
    keyMissingConcepts: [
      'Production RAG Pipeline Construction with Vector Embeddings',
      'Quantization, LoRA & Parameter-Efficient Fine-Tuning',
      'Model Serving Latency Optimization and Triton Inference Server'
    ],
    suggestedAction: 'Embed 4-credit Applied GenAI & ModelOps Lab in Semester 6 with NVIDIA/HuggingFace curriculum integration.'
  },
  {
    id: 'skill_cloud',
    skill: 'Cloud',
    industryDemand: 89,
    studentReadiness: 56,
    gap: -33,
    gapSeverity: 'critical',
    hiringOpeningsVolume: 980,
    averageBenchmarkScore: 85,
    topCompaniesHiring: ['Amazon Web Services', 'Azure Engineering', 'Salesforce', 'Cisco', 'Deloitte Digital'],
    subskills: [
      { name: 'Kubernetes & Container Orchestration', readinessScore: 44, industryWeight: 92, status: 'critical_gap' },
      { name: 'Terraform & Infrastructure as Code (IaC)', readinessScore: 38, industryWeight: 86, status: 'critical_gap' },
      { name: 'Cloud Security & IAM Governance', readinessScore: 52, industryWeight: 88, status: 'critical_gap' },
      { name: 'Microservices & Distributed Caching (Redis/Kafka)', readinessScore: 64, industryWeight: 84, status: 'moderate_gap' },
      { name: 'Basic Linux & Virtual Machines (EC2/S3)', readinessScore: 82, industryWeight: 75, status: 'aligned' }
    ],
    keyMissingConcepts: [
      'Multi-cluster Kubernetes Ingress & Helm Deployments',
      'Modular Terraform state management in CI/CD pipelines',
      'Zero-Trust IAM boundary policies across Hybrid Cloud'
    ],
    suggestedAction: 'Upgrade legacy Distributed Computing course with AWS Academy Cloud-Native Systems lab track in Semester 5.'
  },
  {
    id: 'skill_cyber',
    skill: 'Cybersecurity',
    industryDemand: 86,
    studentReadiness: 48,
    gap: -38,
    gapSeverity: 'critical',
    hiringOpeningsVolume: 740,
    averageBenchmarkScore: 82,
    topCompaniesHiring: ['Palo Alto Networks', 'CrowdStrike', 'TCS CyberDefense', 'Wipro Security', 'KPMG Advisory'],
    subskills: [
      { name: 'SOC Operations & SIEM (Splunk/ELK)', readinessScore: 36, industryWeight: 90, status: 'critical_gap' },
      { name: 'Threat Hunting & Penetration Testing', readinessScore: 45, industryWeight: 88, status: 'critical_gap' },
      { name: 'DevSecOps & SAST/DAST CI/CD scanning', readinessScore: 40, industryWeight: 85, status: 'critical_gap' },
      { name: 'Cryptography & Zero Trust Architecture', readinessScore: 55, industryWeight: 80, status: 'moderate_gap' },
      { name: 'Network Protocols & OSI Security Basics', readinessScore: 78, industryWeight: 72, status: 'aligned' }
    ],
    keyMissingConcepts: [
      'Live Cyber Range simulations (Red Team vs Blue Team tactics)',
      'Automated Vulnerability Assessment and SAST/DAST toolchains in GitLab',
      'API Security & OWASP Top 10 hands-on exploits'
    ],
    suggestedAction: 'Establish an industry-backed Cyber Range & SOC Simulator Lab with CEH/CompTIA aligned micro-credentials.'
  },
  {
    id: 'skill_dsa',
    skill: 'DSA',
    industryDemand: 96,
    studentReadiness: 84,
    gap: -12,
    gapSeverity: 'minimal',
    hiringOpeningsVolume: 1650,
    averageBenchmarkScore: 90,
    topCompaniesHiring: ['Microsoft', 'Uber', 'Amazon', 'Atlassian', 'Adobe', 'Oracle'],
    subskills: [
      { name: 'Dynamic Programming & Memoization', readinessScore: 76, industryWeight: 94, status: 'moderate_gap' },
      { name: 'Graph Algorithms & Shortest Path (Dijkstra/A*)', readinessScore: 82, industryWeight: 90, status: 'aligned' },
      { name: 'Trees, Tries & Segment Trees', readinessScore: 86, industryWeight: 88, status: 'aligned' },
      { name: 'Low-Level & High-Level System Design (LLD/HLD)', readinessScore: 68, industryWeight: 92, status: 'moderate_gap' },
      { name: 'Arrays, Strings & Two-Pointer Approaches', readinessScore: 94, industryWeight: 90, status: 'aligned' }
    ],
    keyMissingConcepts: [
      'Concurrency, Multi-threaded Data Structures & Mutexes',
      'Scalable LLD Object-Oriented Design Patterns under high RPS',
      'Bit Manipulation in competitive benchmarking contests'
    ],
    suggestedAction: 'Integrate weekly timed algorithmic sprints and dedicated System Design modules starting in Semester 4.'
  },
  {
    id: 'skill_data',
    skill: 'Data Analytics',
    industryDemand: 82,
    studentReadiness: 73,
    gap: -9,
    gapSeverity: 'minimal',
    hiringOpeningsVolume: 890,
    averageBenchmarkScore: 78,
    topCompaniesHiring: ['Mu Sigma', 'Fractal Analytics', 'EY GDS', 'Target Tech', 'Swiggy Analytics'],
    subskills: [
      { name: 'Complex SQL Queries & Window Functions', readinessScore: 82, industryWeight: 90, status: 'aligned' },
      { name: 'Tableau & PowerBI Dashboarding', readinessScore: 78, industryWeight: 85, status: 'aligned' },
      { name: 'Statistical Testing & A/B Experimentation', readinessScore: 65, industryWeight: 80, status: 'moderate_gap' },
      { name: 'Data Pipeline Engineering (dbt / Snowflake)', readinessScore: 52, industryWeight: 84, status: 'critical_gap' },
      { name: 'Pandas / NumPy Exploratory Analysis', readinessScore: 88, industryWeight: 75, status: 'aligned' }
    ],
    keyMissingConcepts: [
      'Modern Data Stack (dbt, Snowflake, Airflow orchestrations)',
      'Causal Inference and Real-world A/B Testing at Scale',
      'Streaming Data Transformations with Apache Kafka/Spark'
    ],
    suggestedAction: 'Introduce real-time ETL streaming and Modern Data Stack projects in the Semester 6 Applied Analytics curriculum.'
  }
];

export const DEPARTMENT_HEATMAP_DATA: DepartmentSkillHeatmapRow[] = [
  {
    departmentCode: 'CSE',
    departmentName: 'Computer Science & Engineering',
    studentCount: 1680,
    assessedCount: 1540,
    placementReadyCount: 1220,
    scores: {
      'AI/ML': 74,
      'Cloud': 68,
      'Cybersecurity': 58,
      'DSA': 91,
      'Data Analytics': 81
    },
    overallAverage: 74.4
  },
  {
    departmentCode: 'AIDS',
    departmentName: 'AI & Data Science',
    studentCount: 940,
    assessedCount: 880,
    placementReadyCount: 690,
    scores: {
      'AI/ML': 88,
      'Cloud': 62,
      'Cybersecurity': 46,
      'DSA': 84,
      'Data Analytics': 92
    },
    overallAverage: 74.4
  },
  {
    departmentCode: 'IT',
    departmentName: 'Information Technology',
    studentCount: 820,
    assessedCount: 710,
    placementReadyCount: 510,
    scores: {
      'AI/ML': 60,
      'Cloud': 72,
      'Cybersecurity': 62,
      'DSA': 82,
      'Data Analytics': 76
    },
    overallAverage: 70.4
  },
  {
    departmentCode: 'ECE',
    departmentName: 'Electronics & Communication',
    studentCount: 790,
    assessedCount: 590,
    placementReadyCount: 310,
    scores: {
      'AI/ML': 48,
      'Cloud': 39,
      'Cybersecurity': 36,
      'DSA': 74,
      'Data Analytics': 56
    },
    overallAverage: 50.6
  },
  {
    departmentCode: 'EEE',
    departmentName: 'Electrical & Electronics',
    studentCount: 620,
    assessedCount: 400,
    placementReadyCount: 160,
    scores: {
      'AI/ML': 38,
      'Cloud': 32,
      'Cybersecurity': 28,
      'DSA': 62,
      'Data Analytics': 49
    },
    overallAverage: 41.8
  }
];

export const SEMESTER_PROGRESSION_HEATMAP_DATA: SemesterProgressionHeatmapRow[] = [
  {
    semester: 'Sem 3 (Year 2)',
    cohortYear: '2027 Cohort',
    studentCount: 1250,
    stageLabel: 'Foundations & Core Algorithms',
    scores: {
      'AI/ML': 34,
      'Cloud': 28,
      'Cybersecurity': 22,
      'DSA': 72,
      'Data Analytics': 48
    },
    placementReadinessRate: 24.5
  },
  {
    semester: 'Sem 4 (Year 2)',
    cohortYear: '2027 Cohort',
    studentCount: 1240,
    stageLabel: 'Advanced DSA & Systems Core',
    scores: {
      'AI/ML': 46,
      'Cloud': 42,
      'Cybersecurity': 35,
      'DSA': 82,
      'Data Analytics': 61
    },
    placementReadinessRate: 42.0
  },
  {
    semester: 'Sem 5 (Year 3)',
    cohortYear: '2026 Cohort',
    studentCount: 1180,
    stageLabel: 'Applied Specializations & Labs',
    scores: {
      'AI/ML': 64,
      'Cloud': 58,
      'Cybersecurity': 49,
      'DSA': 88,
      'Data Analytics': 74
    },
    placementReadinessRate: 64.8
  },
  {
    semester: 'Sem 6 (Year 3)',
    cohortYear: '2026 Cohort',
    studentCount: 1160,
    stageLabel: 'Pre-Internship & Full Stack',
    scores: {
      'AI/ML': 72,
      'Cloud': 67,
      'Cybersecurity': 56,
      'DSA': 92,
      'Data Analytics': 81
    },
    placementReadinessRate: 78.4
  },
  {
    semester: 'Sem 7 (Year 4)',
    cohortYear: '2025 Cohort',
    studentCount: 1120,
    stageLabel: 'Placement Drives & Capstones',
    scores: {
      'AI/ML': 81,
      'Cloud': 76,
      'Cybersecurity': 64,
      'DSA': 95,
      'Data Analytics': 86
    },
    placementReadinessRate: 89.2
  },
  {
    semester: 'Sem 8 (Year 4)',
    cohortYear: '2025 Cohort',
    studentCount: 1090,
    stageLabel: 'Full-time Industry Deployment',
    scores: {
      'AI/ML': 86,
      'Cloud': 81,
      'Cybersecurity': 70,
      'DSA': 96,
      'Data Analytics': 89
    },
    placementReadinessRate: 94.6
  }
];

export const PLACEMENT_TIERS_DATA: PlacementTierItem[] = [
  {
    id: 'tier_dream',
    tier: 'Tier 1 (Super Dream / Product)',
    title: 'Top Product Engineering & AI Labs',
    packageRange: '₹22 - 48 LPA',
    studentCount: 680,
    percentage: 23.5,
    color: 'emerald',
    keyRequirements: ['DSA LeetCode Hard rating > 1850', 'Distributed Cloud / MLOps Repo', 'System Design LLD/HLD']
  },
  {
    id: 'tier_core',
    tier: 'Tier 2 (Dream Core)',
    title: 'Enterprise Fintech & SaaS Giants',
    packageRange: '₹12 - 21 LPA',
    studentCount: 1420,
    percentage: 49.1,
    color: 'indigo',
    keyRequirements: ['Strong DSA medium rating', 'Full-stack React/Node/Java Microservices', 'SQL & Cloud fundamentals']
  },
  {
    id: 'tier_mass',
    tier: 'Tier 3 (Core Tech & Consulting)',
    title: 'Global Tech Consultancies & IT Services',
    packageRange: '₹6 - 11 LPA',
    studentCount: 790,
    percentage: 27.4,
    color: 'sky',
    keyRequirements: ['Aptitude & Logical Reasoning', 'OOP Concepts & Core Java/Python', 'Basic Web/Data Projects']
  }
];

export const INITIAL_AI_RECOMMENDATIONS: AICurriculumRecommendation[] = [
  {
    id: 'rec_01',
    title: 'Introduce Applied GenAI, LLMOps & Vector DBs Lab (Sem 6)',
    category: 'curriculum',
    targetSkill: 'AI/ML',
    urgency: 'critical',
    projectedGapReduction: '+24% Readiness (Gap drops from -32% to -8%)',
    summary: 'Restructure 4th-year Machine Learning elective into a mandatory hands-on GenAI Engineering & ModelOps laboratory module.',
    detailedProposal: 'Current syllabus over-emphasizes statistical legacy classification algorithms (SVM, KNN, Decision Trees) while industry hiring requires Transformer architecture, RAG workflows, LangChain/LlamaIndex, and fine-tuning with LoRA. Replacing 2 theoretical modules with hands-on PyTorch and Triton model deployment labs will directly elevate candidate conversion for Top AI roles.',
    affectedSemesters: ['Semester 5', 'Semester 6'],
    creditsChange: '+3 Credits Lab / -2 Credits Legacy Theory',
    suggestedIndustryPartners: ['NVIDIA Deep Learning Institute', 'Google Cloud Education', 'Hugging Face Academic'],
    labModulesToEmbed: [
      'Lab 1: RAG System building with Pinecone/Qdrant Vector Databases',
      'Lab 2: Quantized Fine-tuning (QLoRA) on Open-Source Models (Llama/Mistral)',
      'Lab 3: High-throughput Model Serving with FastAPI, Docker & vLLM'
    ],
    facultyUpskillingPlan: '3-week faculty immersion in PyTorch 2.0 & LLM Architecture sponsored by NVIDIA DLI partner program.',
    status: 'approved',
    naacNbaCriteriaAlignment: 'Criterion 1: Curricular Aspects & Criterion 2: Teaching-Learning Evaluation (Industry Outcome OBE-04)'
  },
  {
    id: 'rec_02',
    title: 'Deploy Cloud-Native DevOps & Kubernetes Infrastructure Simulator (Sem 5)',
    category: 'labs',
    targetSkill: 'Cloud',
    urgency: 'critical',
    projectedGapReduction: '+26% Readiness (Gap drops from -33% to -7%)',
    summary: 'Replace traditional VM-based operating systems labs with Container Orchestration, Terraform, and Multi-Cloud CI/CD pipelines.',
    detailedProposal: 'Industry hiring partners (Amazon, Salesforce, Cisco) report that 68% of candidates fail technical screening due to lack of Kubernetes and Infrastructure-as-Code (Terraform) exposure. We propose an institutional Cloud sandbox where each student provisions and maintains containerized microservices behind real API Gateways.',
    affectedSemesters: ['Semester 5'],
    creditsChange: '3-Credit Dedicated Cloud-Native Course + 2-Credit Practical Sandbox',
    suggestedIndustryPartners: ['AWS Academy', 'CNCF Academic Initiative', 'Red Hat University'],
    labModulesToEmbed: [
      'Lab 1: Docker multi-stage builds & Kubernetes Pod lifecycle management',
      'Lab 2: Infrastructure as Code with Terraform & AWS LocalStack',
      'Lab 3: GitOps deployment workflows with ArgoCD and Prometheus monitoring'
    ],
    facultyUpskillingPlan: 'AWS Certified Solutions Architect & Certified Kubernetes Administrator (CKA) certification sponsorship for 8 core faculty.',
    status: 'under_review',
    naacNbaCriteriaAlignment: 'Criterion 6: Governance, Leadership and Management & Industry MoU metrics'
  },
  {
    id: 'rec_03',
    title: 'Establish Institutional Cyber Range & SOC Blue-Team Defense Clinic',
    category: 'industry_partner',
    targetSkill: 'Cybersecurity',
    urgency: 'critical',
    projectedGapReduction: '+30% Readiness (Gap drops from -38% to -8%)',
    summary: 'Launch an active Cyber Threat Hunting & DevSecOps clinic co-designed with Tier-1 Security firms.',
    detailedProposal: 'Student cybersecurity proficiency currently stands at 48% readiness against an 86% market demand. Partnering with Palo Alto Networks and TCS CyberDefense to establish an institutional virtual Cyber Range will give students direct incident response, SIEM triage, and secure code auditing experience.',
    affectedSemesters: ['Semester 6', 'Semester 7'],
    creditsChange: '4-Credit Specialization Elective Track with Capstone Defense',
    suggestedIndustryPartners: ['Palo Alto Cybersecurity Academy', 'CrowdStrike University', 'Fortinet Academic Program'],
    labModulesToEmbed: [
      'Lab 1: SIEM Log Analysis & Real-time Threat Triage using Elastic/Splunk',
      'Lab 2: SAST/DAST vulnerability scanning in automated GitLab pipelines',
      'Lab 3: OWASP Top 10 hands-on defense simulations in sandboxed environments'
    ],
    facultyUpskillingPlan: 'Sponsor CompTIA Security+ and CEH Master trainer workshops for department cybersecurity leads.',
    status: 'proposed',
    naacNbaCriteriaAlignment: 'Criterion 3: Research, Innovations and Extension & Industry Laboratory Setup'
  },
  {
    id: 'rec_04',
    title: 'Mandatory Competitive Problem Solving & System Design Sprint (Sem 4-5)',
    category: 'curriculum',
    targetSkill: 'DSA',
    urgency: 'high',
    projectedGapReduction: '+10% Readiness (Gap drops from -12% to -2%)',
    summary: 'Institutionalize weekly proctored algorithmic coding sprints and Low-Level Object-Oriented System Design modules.',
    detailedProposal: 'While basic DSA scores are healthy (84%), Tier-1 product companies reject candidates at the High-Level / Low-Level System Design (LLD/HLD) round and advanced dynamic programming. Introducing weekly graded hackathons integrated directly into student semester grade cards will push student average benchmark to 94%+.',
    affectedSemesters: ['Semester 4', 'Semester 5'],
    creditsChange: '2-Credit Continuous Evaluation Problem-Solving Track',
    suggestedIndustryPartners: ['CodeChef Institutional Campus Chapter', 'LeetCode Enterprise', 'GeeksforGeeks Institutional'],
    labModulesToEmbed: [
      'Sprint 1: Concurrency, Thread Safety & Custom Cache/Mutex Implementations',
      'Sprint 2: Scalable LLD: Design an In-Memory File System / Rate Limiter',
      'Sprint 3: Advanced Graph & Dynamic Programming Contest Simulations'
    ],
    facultyUpskillingPlan: 'Internal train-the-trainer workshops led by alumni working in Tier-1 product tech firms.',
    status: 'implemented',
    naacNbaCriteriaAlignment: 'Criterion 2: Teaching-Learning & Student Assessment Performance (OBE-02)'
  },
  {
    id: 'rec_05',
    title: 'Modern Data Stack & Real-time Analytics Pipeline Integration (Sem 6)',
    category: 'electives',
    targetSkill: 'Data Analytics',
    urgency: 'medium',
    projectedGapReduction: '+8% Readiness (Achieves +100% Industry Alignment)',
    summary: 'Shift curriculum from static CSV/Excel analysis to distributed data streaming (Kafka), dbt transformations, and Snowflake data warehouses.',
    detailedProposal: 'Current data analytics courses focus on static pandas scripts. Integrating Snowflake, dbt (data build tool), and Apache Airflow DAG orchestrations will equip graduates for modern Data Engineering and Business Intelligence roles with immediate Day-1 productivity.',
    affectedSemesters: ['Semester 6'],
    creditsChange: '3-Credit Applied Data Engineering Elective',
    suggestedIndustryPartners: ['Snowflake University Alliance', 'Databricks Academic Program', 'dbt Labs'],
    labModulesToEmbed: [
      'Lab 1: End-to-End ETL Pipeline with Apache Airflow & PostgreSQL',
      'Lab 2: Transformation modeling and testing using dbt and Snowflake',
      'Lab 3: Executive Storytelling & Interactive BI with Tableau/PowerBI'
    ],
    facultyUpskillingPlan: 'Databricks Certified Data Engineer faculty enablement program.',
    status: 'proposed',
    naacNbaCriteriaAlignment: 'Criterion 1: Curricular Flexibility & Industry Electives'
  }
];
