import {
  CopilotMessage,
  CopilotContext,
  CopilotPromptTemplate,
  ActionCardData
} from '../types/copilot';
import { UserRole } from '../types';
import { STUDENT_READINESS_DATA, STUDENT_SKILLS_ASSESSED, STUDENT_OPPORTUNITIES } from '../data/studentData';
import { defaultGeminiService } from './geminiService';
import { askSetu } from './setuAIService';

/**
 * Standard Suggested Prompt Templates (Pinned Starters)
 */
export const COPILOT_EXAMPLE_QUESTIONS: CopilotPromptTemplate[] = [
  {
    id: 'ready_for_role',
    title: 'Role Readiness',
    prompt: 'Am I ready for this role?',
    category: 'readiness',
    icon: 'Target',
    description: 'Check your current readiness index and interview clearance likelihood.',
    highlight: true
  },
  {
    id: 'learn_next',
    title: 'Next Learning Steps',
    prompt: 'What skills should I improve first?',
    category: 'learning',
    icon: 'Sparkles',
    description: 'Get a prioritized, 3-step actionable study roadmap to close gaps.',
    highlight: true
  },
  {
    id: 'internship_suit',
    title: 'Best Opportunities',
    prompt: 'Which opportunities are best for me?',
    category: 'internship',
    icon: 'Briefcase',
    description: 'Discover the top industry roles matching your verified Skill DNA.',
    highlight: true
  },
  {
    id: 'explain_gaps',
    title: 'Skill Gap Breakdown',
    prompt: 'Explain my skill gaps.',
    category: 'skills',
    icon: 'AlertTriangle',
    description: 'Understand missing industry prerequisites and 30-day fixes.',
    highlight: true
  }
];

export const ROLE_SPECIFIC_PROMPT_TEMPLATES: Record<UserRole, CopilotPromptTemplate[]> = {
  student: [
    {
      id: 'st_improve_first',
      title: 'Top Skill Priority',
      prompt: 'What skills should I improve first?',
      category: 'skills',
      icon: 'Sparkles',
      description: 'Prioritize critical gaps based on target role requirements.',
      highlight: true
    },
    {
      id: 'st_best_opps',
      title: 'Best Opportunities',
      prompt: 'Which opportunities are best for me?',
      category: 'internship',
      icon: 'Briefcase',
      description: 'Discover top matched internships and jobs for your Skill DNA.',
      highlight: true
    },
    {
      id: 'st_readiness_low',
      title: 'Readiness Diagnostic',
      prompt: 'Why is my readiness score low?',
      category: 'readiness',
      icon: 'Target',
      description: 'Analyze competency differentials and benchmark deficits.',
      highlight: true
    },
    {
      id: 'st_roadmap',
      title: 'Career Roadmap',
      prompt: 'Build my career roadmap',
      category: 'learning',
      icon: 'Target',
      description: 'Sequence prioritized milestones toward your dream engineering track.',
      highlight: true
    },
    {
      id: 'st_interventions',
      title: 'Active Interventions',
      prompt: 'Which intervention should I join?',
      category: 'learning',
      icon: 'AlertTriangle',
      description: 'Find active cohorts and workshops to resolve critical skill gaps.',
      highlight: true
    }
  ],
  industry: [
    {
      id: 'ind_top_candidates',
      title: 'Candidate Matching',
      prompt: 'Which candidates best match my opportunity?',
      category: 'skills',
      icon: 'Target',
      description: 'Identify highest-scoring verified candidates in your applicant pipeline.',
      highlight: true
    },
    {
      id: 'ind_missing_skills',
      title: 'Applicant Skill Deficit',
      prompt: 'What skills are missing among applicants?',
      category: 'readiness',
      icon: 'AlertTriangle',
      description: 'Analyze missing prerequisites across current applicants.',
      highlight: true
    },
    {
      id: 'ind_demanded_skills',
      title: 'Demand Intelligence',
      prompt: 'What skills are most demanded?',
      category: 'skills',
      icon: 'Sparkles',
      description: 'Inspect emerging industry trends and high-priority talent competencies.',
      highlight: true
    },
    {
      id: 'ind_collabs',
      title: 'Academic Partnerships',
      prompt: 'Find relevant collaboration opportunities',
      category: 'internship',
      icon: 'Briefcase',
      description: 'Discover faculty research labs and sponsored joint projects.',
      highlight: true
    }
  ],
  academician: [
    {
      id: 'ac_collabs',
      title: 'Matching Collaborations',
      prompt: 'Which collaborations match my expertise?',
      category: 'internship',
      icon: 'Briefcase',
      description: 'Find industry sponsored research, consultancy, and lab partnerships.',
      highlight: true
    },
    {
      id: 'ac_fdp',
      title: 'Faculty Enablement',
      prompt: 'Which FDPs should I consider?',
      category: 'learning',
      icon: 'Sparkles',
      description: 'Explore accredited AI, Cloud, and deep-tech faculty programs.',
      highlight: true
    },
    {
      id: 'ac_projects',
      title: 'Industry Projects',
      prompt: 'Find relevant industry projects',
      category: 'skills',
      icon: 'Target',
      description: 'Identify practical co-innovation and capstone opportunities.',
      highlight: true
    },
    {
      id: 'ac_profile',
      title: 'Profile Enhancement',
      prompt: 'How can I improve my industry profile?',
      category: 'readiness',
      icon: 'AlertTriangle',
      description: 'Leverage your verified Faculty Passport credentials for outreach.',
      highlight: true
    }
  ],
  institution: [
    {
      id: 'inst_gaps',
      title: 'Skill Gap Heatmap',
      prompt: 'What are our biggest skill gaps?',
      category: 'skills',
      icon: 'AlertTriangle',
      description: 'Identify high-demand, low-readiness deficits across student cohorts.',
      highlight: true
    },
    {
      id: 'inst_priorities',
      title: 'Semester Priorities',
      prompt: 'Which skills should we prioritize?',
      category: 'learning',
      icon: 'Target',
      description: 'Sequence high-impact curriculum alignment sprints.',
      highlight: true
    },
    {
      id: 'inst_launch_interventions',
      title: 'Intervention Planning',
      prompt: 'What intervention should we launch?',
      category: 'internship',
      icon: 'Briefcase',
      description: 'Design targeted bootcamps to elevate student readiness index.',
      highlight: true
    },
    {
      id: 'inst_results',
      title: 'Intervention Yield',
      prompt: 'Which interventions produced the best results?',
      category: 'readiness',
      icon: 'Sparkles',
      description: 'Measure verified skill gain and completion outcomes across cohorts.',
      highlight: true
    }
  ]
};

export function getPromptTemplatesForRole(role: UserRole): CopilotPromptTemplate[] {
  return ROLE_SPECIFIC_PROMPT_TEMPLATES[role] || COPILOT_EXAMPLE_QUESTIONS;
}

/**
 * Default Active Student Context
 */
export const DEFAULT_COPILOT_CONTEXT: CopilotContext = {
  studentName: 'Alex Rivera',
  currentRole: 'Final Year B.Tech (Computer Science)',
  targetRole: STUDENT_READINESS_DATA.targetRole || 'Senior Full Stack & Distributed Systems Engineer',
  readinessScore: STUDENT_READINESS_DATA.overallScore || 87,
  percentile: STUDENT_READINESS_DATA.percentile || 96,
  topSkills: STUDENT_SKILLS_ASSESSED.slice(0, 4).map(s => ({ name: s.name, score: s.score })),
  criticalGaps: [
    { name: 'Kubernetes Custom Resource Definitions (CRDs)', gap: 24 },
    { name: 'Vector Databases & RAG Hybrid Search', gap: 28 },
    { name: 'Distributed Consensus (Raft & Paxos)', gap: 18 }
  ],
  matchedInternships: [
    { company: 'NovaCore Technologies', role: 'Full-Stack & Distributed Systems Intern', matchScore: 96 },
    { company: 'CloudScale Networks', role: 'Cloud-Native Platform & DevOps Co-Op', matchScore: 91 },
    { company: 'Apex FinTech Global', role: 'High-Throughput Backend Engineering Intern', matchScore: 88 }
  ],
  institution: 'Apex Institute of Technology & Research',
  department: 'Computer Science & Engineering'
};

/**
 * Service orchestrating Setu Copilot conversation flows
 */
class CopilotService {
  /**
   * Generates initial greeting message
   */
  public getInitialGreeting(context: CopilotContext = DEFAULT_COPILOT_CONTEXT): CopilotMessage {
    return {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Hello **${context.studentName.split(' ')[0]}**! I am **Setu Copilot**, your AI career navigator and competency intelligence assistant.

I have synchronized with your platform profile, verified skills, and target role: **${context.targetRole}** (Current Readiness: **${context.readinessScore}%** • **Top ${100 - context.percentile}%**).

How can I assist your career progression today? You can select any example prompt below or ask me any custom question.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: [
        'Am I ready for this role?',
        'What should I learn next?',
        'Which internship suits me?',
        'Explain my skill gaps.'
      ]
    };
  }

  /**
   * Main responder: Evaluates user query, tries Gemini API, and falls back to deterministic expert engine
   */
  public async processUserMessage(
    userMessage: string,
    history: CopilotMessage[] = [],
    context: CopilotContext = DEFAULT_COPILOT_CONTEXT
  ): Promise<CopilotMessage> {
    const trimmed = userMessage.trim().toLowerCase();
    const messageId = `msg-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Check for standard 4 questions or variations
    if (this.isRoleReadinessQuery(trimmed)) {
      return this.generateRoleReadinessResponse(messageId, timestamp, context);
    }

    if (this.isWhatShouldILearnNextQuery(trimmed)) {
      return this.generateWhatToLearnNextResponse(messageId, timestamp, context);
    }

    if (this.isInternshipSuitQuery(trimmed)) {
      return this.generateInternshipSuitResponse(messageId, timestamp, context);
    }

    if (this.isSkillGapsQuery(trimmed)) {
      return this.generateSkillGapsResponse(messageId, timestamp, context);
    }

    // 2. Try Gemini Live API if available
    try {
      if (defaultGeminiService.isLiveApiAvailable()) {
        const fullMessages: CopilotMessage[] = [
          ...history,
          { id: 'user-temp', role: 'user', content: userMessage, timestamp }
        ];
        const apiResponseText = await defaultGeminiService.generateChatResponse(fullMessages, context);
        return {
          id: messageId,
          role: 'assistant',
          content: apiResponseText,
          timestamp,
          suggestedFollowUps: [
            'What should I learn next?',
            'Which internship suits me?',
            'Explain my skill gaps.'
          ]
        };
      }
    } catch (e) {
      // Continue to smart semantic fallback
    }

    // 3. Smart Semantic Fallback for other queries
    return this.generateSmartContextualResponse(userMessage, messageId, timestamp, context);
  }

  // --- QUERY MATCHERS ---

  private isRoleReadinessQuery(q: string): boolean {
    return (
      q.includes('ready for this role') ||
      q.includes('am i ready') ||
      q.includes('readiness score') ||
      q.includes('role readiness') ||
      q.includes('clear interview') ||
      q.includes('fit for this role')
    );
  }

  private isWhatShouldILearnNextQuery(q: string): boolean {
    return (
      q.includes('what should i learn') ||
      q.includes('learn next') ||
      q.includes('what to study') ||
      q.includes('roadmap') ||
      q.includes('next steps') ||
      q.includes('recommended topic')
    );
  }

  private isInternshipSuitQuery(q: string): boolean {
    return (
      q.includes('which internship suits me') ||
      q.includes('which internship') ||
      q.includes('best internship') ||
      q.includes('internship match') ||
      q.includes('recommended jobs') ||
      q.includes('opportunities for me')
    );
  }

  private isSkillGapsQuery(q: string): boolean {
    return (
      q.includes('explain my skill gaps') ||
      q.includes('skill gap') ||
      q.includes('my gaps') ||
      q.includes('what am i missing') ||
      q.includes('weakness') ||
      q.includes('deficiencies')
    );
  }

  // --- HIGH FIDELITY MOCK REASONING RESPONSES ---

  private generateRoleReadinessResponse(
    id: string,
    timestamp: string,
    context: CopilotContext
  ): CopilotMessage {
    const card: ActionCardData = {
      type: 'role_readiness',
      title: `${context.targetRole}`,
      subtitle: `Calculated against Tier-1 Product Engineering hiring benchmarks`,
      metrics: [
        { label: 'Overall Readiness', value: `${context.readinessScore}%`, color: 'emerald' },
        { label: 'Target Match', value: '92%', color: 'indigo' },
        { label: 'Percentile', value: `Top ${100 - context.percentile}%`, color: 'amber' }
      ],
      tags: ['React 19 Expert', 'API Architecture', 'Distributed Systems'],
      primaryAction: {
        label: 'Take Adaptive Mock Interview',
        actionType: 'start_assessment',
        payload: 'senior-fullstack-mock'
      }
    };

    const content = `### 🎯 Role Readiness Evaluation: **${context.targetRole}**

Based on your validated assessments, digital portfolio, and verified GitHub repositories, **you are in the 96th percentile (${context.readinessScore}% Overall Readiness)**, qualifying you for **Tier-1 Super Dream** engineering brackets!

#### 🌟 Key Competitive Advantages:
1. **Frontend & UI Systems Architecture (94% / 95th Percentile)**:
   - Deep mastery of React 19 concurrent patterns, server components, and Tailwind design systems.
2. **Backend Services & API High-Throughput (90%)**:
   - Proven implementation of REST/GraphQL, caching tiers (Redis), and distributed SQL.
3. **Clean Code & Collaboration (91%)**:
   - High test coverage metrics and CI/CD automation in recent projects.

#### ⚠️ Remaining Gaps to Guarantee Offer Clearance:
* **Kubernetes Custom Controllers & CRDs**: Industry benchmark requires 85%, your current score is **68%** (-17% Delta).
* **Distributed Consensus (Raft/Paxos)**: Need practical experience in cluster leader election and replication failure recovery.

**Verdict**: You are **Interview Ready** for 92% of high-growth tech companies. Closing the 2 infrastructure gaps above will unlock top-bracket offers (> ₹25-45 LPA).`;

    return {
      id,
      role: 'assistant',
      content,
      timestamp,
      actionCard: card,
      suggestedFollowUps: [
        'What should I learn next to fix Kubernetes?',
        'Which internship suits me?',
        'Explain my skill gaps in detail.'
      ]
    };
  }

  private generateWhatToLearnNextResponse(
    id: string,
    timestamp: string,
    context: CopilotContext
  ): CopilotMessage {
    const card: ActionCardData = {
      type: 'learning_path',
      title: 'Prioritized 4-Week Skill Sprint',
      subtitle: 'Structured by highest ROI for upcoming campus placements',
      metrics: [
        { label: 'Milestone 1', value: 'Kubernetes CRDs', color: 'indigo' },
        { label: 'Milestone 2', value: 'Vector DBs / RAG', color: 'amber' },
        { label: 'Milestone 3', value: 'Raft Consensus', color: 'emerald' }
      ],
      tags: ['2 Weeks / Module', 'Hands-on Labs', 'Industry Verified'],
      primaryAction: {
        label: 'Add Sprint to Career Roadmap',
        actionType: 'navigate',
        payload: '/dashboard/student/roadmap'
      }
    };

    const content = `### 📚 Personalized Learning Recommendations (Next 30 Days)

To maximize your market value and clear Tier-1 interviews, here is your customized, high-ROI learning sequence:

#### 1. **Kubernetes Operators & Custom Resource Definitions (Week 1–2)**
* **Why**: High-demand prerequisite for modern platform & distributed systems roles.
* **Core Topics**: Helm chart templating, controller runtime in Go/Node, Ingress routing, and autoscaling.
* **Hands-on Challenge**: Build an automated database provisioning operator that handles replica spin-up on demand.

#### 2. **Vector Embeddings, Hybrid Search & RAG Architecture (Week 3)**
* **Why**: 94% of top tier tech teams are integrating GenAI vector indexing into core platforms.
* **Core Topics**: Pinecone/Milvus vector index math, chunking strategies, hybrid BM25 + dense search, and LangChain orchestration.
* **Project Idea**: Connect an enterprise knowledge base with chunk caching and re-ranking.

#### 3. **Distributed Consensus & Event Sourcing (Week 4)**
* **Why**: The differentiator in system design rounds for Senior Engineer levels.
* **Core Topics**: Raft protocol state transitions, split-brain mitigation, and Kafka event stream partition ordering.

Would you like me to generate a 14-day study timetable or launch a practice quiz on Kubernetes?`;

    return {
      id,
      role: 'assistant',
      content,
      timestamp,
      actionCard: card,
      suggestedFollowUps: [
        'Generate a 14-day study timetable',
        'Am I ready for this role?',
        'Which internship suits me?'
      ]
    };
  }

  private generateInternshipSuitResponse(
    id: string,
    timestamp: string,
    context: CopilotContext
  ): CopilotMessage {
    const card: ActionCardData = {
      type: 'internship_match',
      title: 'Top Matched Industry Opportunities',
      subtitle: 'Based on your 95% React score, API skills, and verified projects',
      metrics: [
        { label: 'NovaCore Tech', value: '96% Match', color: 'emerald' },
        { label: 'CloudScale', value: '91% Match', color: 'indigo' },
        { label: 'Stipend Range', value: '₹45k - ₹75k/mo', color: 'amber' }
      ],
      tags: ['Fast-track Interview', 'PPO Track', 'Remote / Hybrid'],
      primaryAction: {
        label: 'View Matched Opportunities ATS',
        actionType: 'navigate',
        payload: '/dashboard/student/opportunities'
      }
    };

    const content = `### 💼 Top Recommended Internships for **${context.studentName}**

I matched your verified skills and portfolio against active partner openings. Here are your top 3 highest-compatibility roles:

---

#### 🥇 **1. NovaCore Technologies — Full-Stack & Distributed Systems Intern**
* **Compatibility Match**: **96% (Tier-1 Match)**
* **Stipend**: **₹65,000 / month** + Fast-track Pre-Placement Offer (PPO) at ₹24 LPA
* **Why it fits you**:
  - Requires React 19, TypeScript, GraphQL, and microservices architecture—all of which you have verified scores >90%.
  - Your portfolio project (*Distributed Observability Pipeline*) directly matches their tech stack.

---

#### 🥈 **2. CloudScale Networks — Cloud-Native Platform & DevOps Co-Op**
* **Compatibility Match**: **91%**
* **Stipend**: **₹55,000 / month**
* **Why it fits you**:
  - Perfect launchpad to close your Kubernetes and cloud infrastructure gap while earning industry credits.

---

#### 🥉 **3. Apex FinTech Global — High-Throughput Backend Co-Op**
* **Compatibility Match**: **88%**
* **Stipend**: **₹75,000 / month**
* **Why it fits you**: Focuses on distributed caching (Redis) and low-latency database queries.

You are eligible for direct 1-click application with your SkillSetu Verified Profile!`;

    return {
      id,
      role: 'assistant',
      content,
      timestamp,
      actionCard: card,
      suggestedFollowUps: [
        'How do I tailor my portfolio for NovaCore?',
        'Am I ready for this role?',
        'Explain my skill gaps.'
      ]
    };
  }

  private generateSkillGapsResponse(
    id: string,
    timestamp: string,
    context: CopilotContext
  ): CopilotMessage {
    const card: ActionCardData = {
      type: 'skill_gap',
      title: 'Identified Skill Gaps vs Industry Baseline',
      subtitle: 'Calculated across 4,800+ hiring requirements',
      metrics: [
        { label: 'Cloud / K8s', value: '-24% Gap', color: 'rose' },
        { label: 'Vector AI/ML', value: '-28% Gap', color: 'rose' },
        { label: 'System Design', value: '-12% Gap', color: 'amber' }
      ],
      tags: ['Critical Deficit', 'Action Plan Ready', 'NAAC Criterion 2'],
      primaryAction: {
        label: 'Open Interactive Skill Gap Visualizer',
        actionType: 'navigate',
        payload: '/dashboard/student/skill-gap'
      }
    };

    const content = `### 🔍 Detailed Skill Gap Diagnostic Report

Your platform assessment reveals an impressive overall profile, but there are **3 key technical deltas** between your current score and Tier-1 Senior Engineer hiring requirements:

| Skill Domain | Your Score | Target Benchmark | Gap Delta | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **Vector DBs & RAG Pipelines** | 58% | 86% | **-28%** | 🔴 Critical |
| **Kubernetes Operators / CRDs** | 62% | 86% | **-24%** | 🔴 Critical |
| **Distributed Consensus (Raft)** | 74% | 86% | **-12%** | 🟡 Moderate |
| **System Architecture** | 86% | 88% | **-2%** | 🟢 Minor |

---

#### 💡 Root Cause Analysis & 30-Day Fix:
1. **Vector DBs (-28% Gap)**:
   - *Issue*: You have solid algorithmic fundamentals, but lack production exposure to vector cosine similarity indexing, embedding dimensional reduction, and metadata filtering.
   - *Fix*: Complete the 4-hour *Milvus & LangChain Workshop* in the platform learning hub.
2. **Kubernetes Controllers (-24% Gap)**:
   - *Issue*: You know Docker and basic Pod deployment, but need hands-on experience with CRDs, Helm templating, and StatefulSets.
   - *Fix*: Spin up the interactive Minikube Cloud Sandbox in the Lab tab.`;

    return {
      id,
      role: 'assistant',
      content,
      timestamp,
      actionCard: card,
      suggestedFollowUps: [
        'What should I learn next?',
        'Am I ready for this role?',
        'Which internship suits me?'
      ]
    };
  }

  private generateSmartContextualResponse(
    query: string,
    id: string,
    timestamp: string,
    context: CopilotContext
  ): CopilotMessage {
    const q = query.toLowerCase();

    if (q.includes('resume') || q.includes('cv') || q.includes('portfolio')) {
      return {
        id,
        role: 'assistant',
        content: `### 📄 Resume & Portfolio Optimization Advice

Your verified digital portfolio on SkillSetu AI is currently scored at **94/100 (Recruiter Ready)**!

**Top 3 Enhancements to Add:**
1. **Highlight Live Demo Links**: Ensure your *Distributed Observability Platform* has a 1-click live preview URL and benchmark throughput figures (e.g. *Handles 15,000 req/sec*).
2. **Add Verified Skill Badges**: Your **React 19 Master** and **API Architecture** credentials from NovaCore provide instant trust for hiring managers.
3. **Quantify Outcomes**: State specific speedups (e.g. *Reduced query latency by 42% via Redis cluster caching*).`,
        timestamp,
        suggestedFollowUps: [
          'Am I ready for this role?',
          'Which internship suits me?',
          'What should I learn next?'
        ]
      };
    }

    if (q.includes('interview') || q.includes('mock') || q.includes('questions')) {
      return {
        id,
        role: 'assistant',
        content: `### 🎙️ Technical Interview Preparation for **${context.targetRole}**

Here is what Tier-1 tech recruiters will test you on during technical rounds:

1. **System Design (45 mins)**:
   - *Question*: "Design a real-time collaborative code editor with optimistic locking and conflict resolution."
   - *Key Focus*: Operational Transformation (OT) vs CRDTs, WebSocket scale, and Redis pub/sub.
2. **Coding & Data Structures (45 mins)**:
   - Dynamic Programming, Graph shortest path (Dijkstra/A*), and sliding window rate limiting.
3. **Architecture Deep-Dive (30 mins)**:
   - Explain how you handle cache stampedes, circuit breaking, and zero-downtime rolling deploys.

Would you like to start an interactive AI Mock Assessment session right now?`,
        timestamp,
        suggestedFollowUps: [
          'Am I ready for this role?',
          'Explain my skill gaps.',
          'What should I learn next?'
        ]
      };
    }

    // Default friendly response
    return {
      id,
      role: 'assistant',
      content: `I understand you are asking about **"${query}"**.

As your **Setu Copilot**, I analyze your profile across **4,800+ industry hiring data points** and verified academic competencies.

Here are the most impactful actions you can take right now:
* **Evaluate Role Fit**: Type *"Am I ready for this role?"* to get a breakdown of your 87% readiness index.
* **Explore Next Steps**: Type *"What should I learn next?"* for a sequenced 4-week study plan.
* **Browse Matches**: Type *"Which internship suits me?"* to review curated high-stipend openings.
* **Diagnose Weaknesses**: Type *"Explain my skill gaps."* to audit missing competencies.`,
      timestamp,
      suggestedFollowUps: [
        'Am I ready for this role?',
        'What should I learn next?',
        'Which internship suits me?',
        'Explain my skill gaps.'
      ]
    };
  }
}

export const copilotService = new CopilotService();
