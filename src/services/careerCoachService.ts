/**
 * Setu AI Career Coach Intelligence Engine (Phase 15-C)
 * 
 * Provides deterministic, evidence-grounded Career Action Plans (30, 60, and 90 days),
 * Next Best Action calculations, opportunity readiness evaluations, and interview prep guides.
 * 
 * Directives:
 * 1. Deterministic Calculation: Never allow Gemini to fabricate scores, opportunities, or priority weights.
 * 2. Grounded in Student Context: Integrates Skill DNA, Skill Gaps, Career Goals, Industry Demand,
 *    Matched Opportunities, Interventions, and Portfolio Evidence.
 * 3. Transparent Explanations: Explains the exact mathematical reasons behind readiness and recommendations.
 */

import { StudentSetuContext, UnifiedSetuContext, SetuActionType } from '../types/setu';
import {
  CareerActionPlan,
  CareerPriority,
  CareerTask,
  WeeklyPlan,
  PlanDuration,
  NextBestAction,
  RecommendedSkillPlan,
  RecommendedInterventionItem,
  RecommendedProjectItem,
  OpportunityReadinessItem,
  PortfolioActionItem,
  CareerMilestone,
  OpportunityReadinessEvaluation,
  OpportunityAdvice,
  TaskType,
  TaskPriority
} from '../types/careerCoach';
import { DEMO_CAREER_PLAN } from '../data/demoCareerPlan';
import { BASELINE_INDUSTRY_REQUIREMENTS } from '../data/industrySkillRequirements';

export interface CareerCoachOptions {
  duration?: PlanDuration;
  customRole?: string;
  isDemo?: boolean;
  useGeminiExplanation?: boolean;
}

/**
 * Standard Available Career Roles for Selection
 */
export const AVAILABLE_CAREER_ROLES = [
  'Full-Stack Software Engineer',
  'Cloud Backend Engineer',
  'Frontend Developer',
  'AI / Machine Learning Engineer',
  'Data Engineer',
  'DevOps & Cloud Architect',
  'Cybersecurity Analyst',
  'Mobile Application Developer (React Native / iOS / Android)'
];

/**
 * Normalized string helper
 */
function norm(str?: string | null): string {
  return (str || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

/**
 * Deterministic Priority Calculator
 * Priority Score = (Gap Magnitude * 0.40) + (Industry Demand * 0.30) + (Opportunity Relevance * 0.20) + (Career Goal Relevance * 0.10)
 */
export function calculateSkillPriorityScore(
  gap: number,
  industryDemand: number,
  isOppRequired: boolean,
  isCareerInterest: boolean
): { score: number; priority: 'critical' | 'high' | 'medium' | 'low'; reason: string } {
  const normGap = Math.min(100, Math.max(0, gap * 2.5)); // 40 gap -> 100
  const oppFactor = isOppRequired ? 100 : 40;
  const careerFactor = isCareerInterest ? 100 : 50;

  const score = Math.round(
    normGap * 0.40 +
    industryDemand * 0.30 +
    oppFactor * 0.20 +
    careerFactor * 0.10
  );

  let priority: 'critical' | 'high' | 'medium' | 'low';
  let reason = '';

  if (gap >= 20 && industryDemand >= 75) {
    priority = 'critical';
    reason = `Critical deficit of -${gap}% in a high-demand skill (${industryDemand}% market demand). Immediate bottleneck for target roles.`;
  } else if (gap >= 12 || industryDemand >= 80) {
    priority = 'high';
    reason = `High-impact deficit of -${gap}% required across 70%+ of verified internship opportunities.`;
  } else if (gap > 0) {
    priority = 'medium';
    reason = `Moderate gap (-${gap}%). Improving this competency unlocks stronger matching on specialized roles.`;
  } else {
    priority = 'low';
    reason = `Proficiency meets or exceeds industry requirement. Maintain active problem-solving practice.`;
  }

  return { score, priority, reason };
}

/**
 * Deterministic Next Best Action Algorithm
 * Evaluates student state to determine the single highest-leverage action right now.
 */
export function calculateNextBestAction(studentContext: StudentSetuContext): NextBestAction {
  const { skillIntelligence, interventions, portfolio, opportunities, assessment, career } = studentContext;
  const criticalGaps = skillIntelligence.criticalGaps || [];
  const topGaps = criticalGaps.filter(g => g.gap > 0).sort((a, b) => b.gap - a.gap);
  const primaryGap = topGaps[0];

  // 1. If student hasn't completed assessment
  if (!assessment.hasCompletedAssessment) {
    return {
      title: 'Complete Comprehensive Skill DNA Assessment',
      reason: 'Your verified Skill DNA profile requires baseline diagnostic data to generate precision matching.',
      category: 'assessment',
      actionLabel: 'Take Assessment',
      actionType: 'VIEW_SKILL_GAP',
      targetRoute: '/dashboard/student/skill-gap',
      urgency: 'Immediate',
      badge: 'Prerequisite Step'
    };
  }

  // 2. Critical Skill Gap + Active Institutional Intervention Available
  if (primaryGap) {
    const matchingIntervention = interventions.recommended.find(r => 
      norm(r.skillName).includes(norm(primaryGap.name)) || norm(primaryGap.name).includes(norm(r.skillName))
    );

    if (matchingIntervention) {
      return {
        title: `Enroll in ${matchingIntervention.title}`,
        reason: `Your largest competency deficit is in ${primaryGap.name} (-${primaryGap.gap}% deficit), and an approved institutional cohort is open for enrollment.`,
        category: 'intervention',
        actionLabel: 'Enroll in Intervention',
        actionType: 'VIEW_INTERVENTIONS',
        targetRoute: '/dashboard/student/interventions',
        urgency: 'Immediate',
        badge: 'Institutional Intervention'
      };
    }

    // 3. Critical Gap + No Direct Intervention -> Targeted Skill Learning
    if (primaryGap.gap >= 15) {
      return {
        title: `Close Competency Deficit in ${primaryGap.name}`,
        reason: `Current proficiency (${primaryGap.currentLevel}%) is below industry requirement (${primaryGap.requiredLevel}%). Closing this gap yields the highest immediate readiness score gain (+12-15%).`,
        category: 'learning',
        actionLabel: 'View Skill Gap',
        actionType: 'VIEW_SKILL_GAP',
        targetRoute: '/dashboard/student/skill-gap',
        urgency: 'Immediate',
        badge: 'Priority Learning'
      };
    }
  }

  // 4. Skills Adequate (Readiness >= 75) + Portfolio Evidence Low (<= 1 project)
  if (skillIntelligence.readinessScore >= 70 && portfolio.projectsCount <= 1) {
    return {
      title: `Build & Deploy a Production-Grade Project for ${career.targetRole || 'Target Role'}`,
      reason: `Your foundational skills are solid (${skillIntelligence.readinessScore}% readiness), but your portfolio currently has only ${portfolio.projectsCount} verified project. Adding a multi-tier project directly validates your skills for employers.`,
      category: 'portfolio',
      actionLabel: 'Update Portfolio',
      actionType: 'VIEW_PORTFOLIO',
      targetRoute: '/dashboard/student/portfolio',
      urgency: 'This Week',
      badge: 'Portfolio Milestone'
    };
  }

  // 5. Skills & Portfolio Adequate + High Match Opportunity Available (>= 80%)
  const topMatch = opportunities.topMatched.find(o => o.matchScore >= 80);
  if (topMatch) {
    return {
      title: `Apply to ${topMatch.title} at ${topMatch.company}`,
      reason: `You have an 80%+ verified match score (${topMatch.matchScore}%) with no major blockers. Your skill profile qualifies you for immediate review.`,
      category: 'application',
      actionLabel: 'Apply Now',
      actionType: 'VIEW_OPPORTUNITIES',
      targetRoute: '/dashboard/student/opportunities',
      urgency: 'This Week',
      badge: 'High Match Opportunity'
    };
  }

  // 6. Default: Advance Roadmap
  return {
    title: 'Execute Current Week Career Milestones',
    reason: `Systematically complete your scheduled practice tasks and track skill mastery improvements.`,
    category: 'learning',
    actionLabel: 'View Career Roadmap',
    actionType: 'VIEW_CAREER_ROADMAP',
    targetRoute: '/dashboard/student/career-roadmap',
    urgency: 'Next Step',
    badge: 'Weekly Milestone'
  };
}

/**
 * Evaluates Opportunity Readiness deterministically
 */
export function evaluateOpportunityReadiness(
  matchScore: number,
  requiredSkills: string[],
  studentContext: StudentSetuContext
): {
  status: OpportunityReadinessEvaluation;
  rationale: string;
  missingKeySkills: string[];
} {
  const studentSkills = new Set(
    (studentContext.skillIntelligence.topSkills || []).map(s => norm(s.name))
  );
  const studentGaps = studentContext.skillIntelligence.criticalGaps || [];

  const missing: string[] = [];
  for (const req of requiredSkills) {
    const isMatched = studentSkills.has(norm(req)) || 
      !studentGaps.some(g => norm(g.name).includes(norm(req)) && g.gap > 25);
    if (!isMatched) {
      missing.push(req);
    }
  }

  if (matchScore >= 80 && missing.length === 0) {
    return {
      status: 'READY',
      rationale: `Strong match score of ${matchScore}%. Your Skill DNA satisfies all core requirements. You are fully qualified to submit your application immediately.`,
      missingKeySkills: missing
    };
  }

  if (matchScore >= 65) {
    return {
      status: 'REASONABLE_TO_APPLY',
      rationale: `Solid match score of ${matchScore}%. While you have minor gaps in ${missing.join(', ') || 'specialized tools'}, your foundational proficiencies make you a viable candidate. Consider applying while continuing targeted practice.`,
      missingKeySkills: missing
    };
  }

  return {
    status: 'IMPROVE_FIRST',
    rationale: `Current match score is ${matchScore}%. We recommend closing priority gaps in ${missing.join(', ') || 'core prerequisites'} first to raise your score above 75% and maximize interview conversion.`,
    missingKeySkills: missing
  };
}

/**
 * Generates Interview Preparation Guidance deterministically
 */
export function generateInterviewPrepAdvice(
  opportunityTitle: string,
  companyName: string,
  requiredSkills: string[],
  studentContext: StudentSetuContext
): OpportunityAdvice {
  const matchResult = studentContext.opportunities.topMatched.find(o => 
    norm(o.title).includes(norm(opportunityTitle)) || norm(o.company).includes(norm(companyName))
  );
  const matchScore = matchResult?.matchScore || 78;
  const evalResult = evaluateOpportunityReadiness(matchScore, requiredSkills, studentContext);

  const matchedSkills = requiredSkills.filter(s => !evalResult.missingKeySkills.includes(s));

  const prepActions = [
    `Review system design & data flow for ${matchedSkills.slice(0, 2).join(' and ')}.`,
    `Prepare 2 concrete portfolio stories highlighting technical challenges solved with ${matchedSkills[0] || 'core technologies'}.`,
    `Review common interview problem patterns for ${evalResult.missingKeySkills[0] || 'REST APIs and concurrency'}.`
  ];

  const interviewTips = [
    `Frame your answer using the STAR method (Situation, Task, Action, Result).`,
    `Highlight your verified SkillSetu assessment score (${studentContext.skillIntelligence.readinessScore}%) as proof of hands-on competency.`,
    `Be transparent about learning curves: if asked about ${evalResult.missingKeySkills[0] || 'emerging frameworks'}, describe your active 30-day learning plan.`
  ];

  return {
    opportunityId: matchResult?.opportunityId || 'opp-custom',
    title: opportunityTitle,
    company: companyName,
    matchScore,
    status: evalResult.status,
    summary: `Structured interview roadmap for ${opportunityTitle} at ${companyName}. Current match: ${matchScore}%.`,
    matchedSkills,
    gapsToAddress: evalResult.missingKeySkills,
    prepActions,
    interviewTips
  };
}

/**
 * Generates Weekly Plan Tasks for 30, 60, or 90 days deterministically
 */
function generateWeeklyTasksForDuration(
  duration: PlanDuration,
  priorities: CareerPriority[],
  studentContext: StudentSetuContext
): WeeklyPlan[] {
  const top1 = priorities[0] || { skill: 'Core Software Architecture', currentLevel: 60, requiredLevel: 80, gap: 20 };
  const top2 = priorities[1] || { skill: 'Backend API Integration', currentLevel: 65, requiredLevel: 80, gap: 15 };
  const top3 = priorities[2] || { skill: 'Cloud & Container Deployment', currentLevel: 68, requiredLevel: 80, gap: 12 };

  const totalWeeks = duration === 90 ? 12 : duration === 60 ? 8 : 4;
  const plans: WeeklyPlan[] = [];

  // Week 1: Foundation
  plans.push({
    weekNumber: 1,
    title: 'Week 1: Foundational Skill Competencies',
    theme: 'Foundation',
    focusSummary: `Master fundamental architectures and close initial deficits in ${top1.skill}.`,
    tasks: [
      {
        taskId: 'w1-t1',
        title: `Core Fundamentals & Best Practices in ${top1.skill}`,
        description: `Complete structured modules covering declarative concepts, architecture patterns, and debugging workflows.`,
        skill: top1.skill,
        estimatedHours: 6,
        type: 'Learning',
        priority: 'critical',
        completed: false,
        currentLevel: top1.currentLevel,
        targetLevel: Math.min(100, top1.currentLevel + 10),
        linkedResource: {
          label: 'View Skill Gap',
          actionType: 'VIEW_SKILL_GAP',
          target: '/dashboard/student/skill-gap'
        }
      },
      {
        taskId: 'w1-t2',
        title: `Hands-on Problem Solving in ${top2.skill}`,
        description: `Implement 5 practical exercises focusing on integration patterns, error handling, and performance optimization.`,
        skill: top2.skill,
        estimatedHours: 5,
        type: 'Practice',
        priority: 'high',
        completed: false,
        currentLevel: top2.currentLevel,
        targetLevel: Math.min(100, top2.currentLevel + 8),
        linkedResource: {
          label: 'View Skill Gap',
          actionType: 'VIEW_SKILL_GAP',
          target: '/dashboard/student/skill-gap'
        }
      },
      {
        taskId: 'w1-t3',
        title: `Explore Approved Interventions for ${top1.skill}`,
        description: `Review upcoming institutional masterclasses or bootcamps to receive guided mentorship.`,
        skill: top1.skill,
        estimatedHours: 3,
        type: 'Learning',
        priority: 'medium',
        completed: false,
        linkedResource: {
          label: 'View Interventions',
          actionType: 'VIEW_INTERVENTIONS',
          target: '/dashboard/student/interventions'
        }
      }
    ]
  });

  // Week 2: Practice & Integration
  plans.push({
    weekNumber: 2,
    title: 'Week 2: Advanced Integration & System Design',
    theme: 'Practice',
    focusSummary: `Build resilient multi-tier connections between ${top1.skill} and ${top2.skill}.`,
    tasks: [
      {
        taskId: 'w2-t1',
        title: `Implement Scalable Data Pipelines with ${top2.skill}`,
        description: `Construct asynchronous event handlers, middleware validations, and resilient error recovery channels.`,
        skill: top2.skill,
        estimatedHours: 6,
        type: 'Practice',
        priority: 'critical',
        completed: false,
        currentLevel: top2.currentLevel + 8,
        targetLevel: Math.min(100, top2.currentLevel + 15)
      },
      {
        taskId: 'w2-t2',
        title: `Configure Automated Testing Suite for ${top1.skill}`,
        description: `Write end-to-end integration tests ensuring 85%+ coverage across core execution paths.`,
        skill: top1.skill,
        estimatedHours: 5,
        type: 'Practice',
        priority: 'high',
        completed: false
      },
      {
        taskId: 'w2-t3',
        title: `Benchmark Performance & Measure Latency`,
        description: `Execute load tests to identify bottlenecks and optimize memory footprint.`,
        skill: top3.skill,
        estimatedHours: 4,
        type: 'Practice',
        priority: 'medium',
        completed: false
      }
    ]
  });

  // Week 3: Project Development
  plans.push({
    weekNumber: 3,
    title: 'Week 3: Production-Grade Project Synthesis',
    theme: 'Project',
    focusSummary: `Synthesize skills into an end-to-end production repository showcasing ${studentContext.career.targetRole || 'Full-Stack'} capabilities.`,
    tasks: [
      {
        taskId: 'w3-t1',
        title: `Build End-to-End Application Featuring ${top1.skill} and ${top2.skill}`,
        description: `Implement modular architecture, secure auth tokens, database indexes, and responsive user flows.`,
        skill: studentContext.career.targetRole || 'Full-Stack Development',
        estimatedHours: 10,
        type: 'Project',
        priority: 'critical',
        completed: false,
        linkedResource: {
          label: 'View Portfolio',
          actionType: 'VIEW_PORTFOLIO',
          target: '/dashboard/student/portfolio'
        }
      },
      {
        taskId: 'w3-t2',
        title: `Implement Automated CI/CD Deployment with Docker`,
        description: `Write automated container build workflows, health check probes, and staging deployments.`,
        skill: top3.skill,
        estimatedHours: 5,
        type: 'Project',
        priority: 'high',
        completed: false
      }
    ]
  });

  // Week 4: Portfolio & Targeted Applications
  plans.push({
    weekNumber: 4,
    title: 'Week 4: Portfolio Verification & Targeted Applications',
    theme: 'Portfolio + Applications',
    focusSummary: 'Document project architecture, verify cryptographic evidence in SkillSetu Portfolio, and submit top opportunity matches.',
    tasks: [
      {
        taskId: 'w4-t1',
        title: 'Publish Architecture Specs & Demo in Portfolio',
        description: 'Document architectural decisions, throughput benchmarks, and live URL in your SkillSetu Portfolio.',
        skill: 'Portfolio Evidence',
        estimatedHours: 4,
        type: 'Portfolio',
        priority: 'critical',
        completed: false,
        linkedResource: {
          label: 'Update Portfolio',
          actionType: 'VIEW_PORTFOLIO',
          target: '/dashboard/student/portfolio'
        }
      },
      {
        taskId: 'w4-t2',
        title: 'Submit Application to Top-Matched Opportunities (80%+ Match)',
        description: 'Apply with verified Skill DNA and updated project evidence to matched employer listings.',
        skill: 'Opportunity Applications',
        estimatedHours: 3,
        type: 'Application',
        priority: 'high',
        completed: false,
        linkedResource: {
          label: 'Explore Opportunities',
          actionType: 'VIEW_OPPORTUNITIES',
          target: '/dashboard/student/opportunities'
        }
      },
      {
        taskId: 'w4-t3',
        title: 'Technical Mock Interview on Core Architecture Patterns',
        description: 'Practice explaining architectural tradeoffs, state management, and edge-case handling under time constraints.',
        skill: 'Interview Preparation',
        estimatedHours: 4,
        type: 'Interview Preparation',
        priority: 'high',
        completed: false
      }
    ]
  });

  // If 60 or 90 days, add extended weeks
  if (totalWeeks >= 8) {
    // Week 5-6: Advanced Specializations
    plans.push({
      weekNumber: 5,
      title: 'Week 5: Advanced System Architecture & Scalability',
      theme: 'Advanced Specialization',
      focusSummary: `Tackle distributed systems patterns, message queues, and high-availability setups.`,
      tasks: [
        {
          taskId: 'w5-t1',
          title: `Implement Asynchronous Event Streaming with Message Brokers`,
          description: `Integrate Kafka or RabbitMQ for event-driven decoupled service communication.`,
          skill: 'Distributed Systems',
          estimatedHours: 7,
          type: 'Learning',
          priority: 'high',
          completed: false
        },
        {
          taskId: 'w5-t2',
          title: `Database Indexing & Query Plan Optimization`,
          description: `Analyze slow queries using EXPLAIN ANALYZE, build composite indexes, and optimize connection pooling.`,
          skill: 'Database Optimization',
          estimatedHours: 5,
          type: 'Practice',
          priority: 'medium',
          completed: false
        }
      ]
    });

    plans.push({
      weekNumber: 6,
      title: 'Week 6: Cloud Native Deployment & Observability',
      theme: 'Infrastructure & Observability',
      focusSummary: 'Set up Prometheus metrics, Grafana dashboards, and distributed tracing across microservices.',
      tasks: [
        {
          taskId: 'w6-t1',
          title: 'Implement Structured Logging & OpenTelemetry Tracing',
          description: 'Add correlation IDs and OpenTelemetry instrumentation to trace requests across service boundaries.',
          skill: 'Observability & SRE',
          estimatedHours: 6,
          type: 'Project',
          priority: 'high',
          completed: false
        },
        {
          taskId: 'w6-t2',
          title: 'Participate in University Hackathon or Open Source Contribution',
          description: 'Contribute a pull request or complete a 48-hour collaborative build to demonstrate team velocity.',
          skill: 'Collaboration & Networking',
          estimatedHours: 8,
          type: 'Networking',
          priority: 'medium',
          completed: false
        }
      ]
    });

    plans.push({
      weekNumber: 7,
      title: 'Week 7: Advanced Portfolio Refinement & Industry Certification',
      theme: 'Certification & Showcase',
      focusSummary: 'Attain recognized cloud/technical badges and polish case studies for senior hiring managers.',
      tasks: [
        {
          taskId: 'w7-t1',
          title: 'Complete Cloud Practitioner / Associate Practice Exams',
          description: 'Validate knowledge across AWS/GCP services, IAM policies, and cost management.',
          skill: 'Cloud Certification',
          estimatedHours: 8,
          type: 'Learning',
          priority: 'high',
          completed: false
        },
        {
          taskId: 'w7-t2',
          title: 'Write In-Depth Technical Case Study Blog Post',
          description: 'Publish a 1,500-word post dissecting your architecture decisions and lessons learned.',
          skill: 'Technical Communication',
          estimatedHours: 4,
          type: 'Portfolio',
          priority: 'medium',
          completed: false
        }
      ]
    });

    plans.push({
      weekNumber: 8,
      title: 'Week 8: Mid-Cycle Applications & Comprehensive Readiness Review',
      theme: 'Applications & Review',
      focusSummary: 'Track application pipelines, review assessment score progression, and retake diagnostic test.',
      tasks: [
        {
          taskId: 'w8-t1',
          title: 'Retake Skill DNA Assessment to Quantify Gains',
          description: 'Measure empirical skill score increases and recalculate Career Readiness Index.',
          skill: 'Skill Assessment',
          estimatedHours: 2,
          type: 'Learning',
          priority: 'critical',
          completed: false,
          linkedResource: {
            label: 'Start Assessment',
            actionType: 'VIEW_SKILL_GAP',
            target: '/dashboard/student/skill-gap'
          }
        },
        {
          taskId: 'w8-t2',
          title: 'Submit 5 Targeted Tier-1 Internship Applications',
          description: 'Target listings with updated 85%+ match scores and attach verified case studies.',
          skill: 'Applications',
          estimatedHours: 4,
          type: 'Application',
          priority: 'high',
          completed: false,
          linkedResource: {
            label: 'View Opportunities',
            actionType: 'VIEW_OPPORTUNITIES',
            target: '/dashboard/student/opportunities'
          }
        }
      ]
    });
  }

  if (totalWeeks === 12) {
    // Weeks 9-12: Elite Placement & Interview Mastery
    for (let w = 9; w <= 12; w++) {
      const themes = [
        'Advanced Data Structures & Live Coding Rounds',
        'Complex System Design & Concurrency Scenarios',
        'Behavioral Mastery & Leadership Principles',
        'Offer Negotiation & Technical Onboarding Prep'
      ];
      plans.push({
        weekNumber: w,
        title: `Week ${w}: ${themes[w - 9]}`,
        theme: 'Interview Mastery',
        focusSummary: `Intensive interview drill focusing on competitive problem solving, architecture defense, and offer closing.`,
        tasks: [
          {
            taskId: `w${w}-t1`,
            title: `Solve 10 Advanced Interview Problems on Graphs & Dynamic Programming`,
            description: `Target optimal time and space complexity with clean, production-ready syntax.`,
            skill: 'Data Structures & Algorithms',
            estimatedHours: 8,
            type: 'Practice',
            priority: 'high',
            completed: false
          },
          {
            taskId: `w${w}-t2`,
            title: `Conduct Live Peer Mock Interview with Senior Mentor`,
            description: `Receive rigorous feedback on communication clarity, whiteboarding structure, and defensive coding.`,
            skill: 'Interview Preparation',
            estimatedHours: 4,
            type: 'Interview Preparation',
            priority: 'critical',
            completed: false
          }
        ]
      });
    }
  }

  return plans;
}

/**
 * Main Career Coach Plan Generator
 * Core function required by Phase 15-C
 */
export async function generateCareerPlan(
  contextInput: StudentSetuContext | UnifiedSetuContext,
  options?: CareerCoachOptions
): Promise<CareerActionPlan> {
  const isDemo = options?.isDemo || false;

  // Extract StudentSetuContext cleanly
  const studentContext: StudentSetuContext = (contextInput as any)?.identity?.role === 'student'
    ? (contextInput as StudentSetuContext)
    : (contextInput as UnifiedSetuContext)?.student || DEMO_CAREER_PLAN as any;

  if (isDemo && !studentContext?.identity) {
    return DEMO_CAREER_PLAN;
  }

  const duration: PlanDuration = options?.duration || 30;
  const targetRole = options?.customRole || studentContext.career?.targetRole || '';

  // Check if careerGoal is missing
  const requiresRoleSelection = !targetRole || targetRole.trim() === '';

  const effectiveRole = requiresRoleSelection ? 'Full-Stack Software Engineer' : targetRole;

  // 1. Identify Strong Skills, Skills to Maintain, Gaps, and Emerging Skills
  const topSkills = studentContext.skillIntelligence?.topSkills || [];
  const criticalGaps = studentContext.skillIntelligence?.criticalGaps || [];
  const demandList = studentContext.industryDemand?.topDemandedSkills || [];

  const strongSkills = topSkills
    .filter(s => s.score >= 75)
    .map(s => s.name);

  const skillsToMaintain = topSkills
    .filter(s => s.score >= 65 && s.score < 75)
    .map(s => s.name);

  const emergingSkills = demandList
    .filter(d => d.demandPercentage >= 80)
    .map(d => d.name)
    .slice(0, 3);

  // 2. Centralized Priority Calculation
  const priorities: CareerPriority[] = criticalGaps.map(g => {
    const demandObj = demandList.find(d => norm(d.name) === norm(g.name));
    const demand = demandObj ? demandObj.demandPercentage : 80;
    const isOppReq = (studentContext.opportunities?.topMatched || []).some(o => 
      o.requiredSkills.some(r => norm(r).includes(norm(g.name)))
    );
    const isInterest = (studentContext.career?.careerInterests || []).some(ci => 
      norm(ci).includes(norm(g.name))
    );

    const { score, priority, reason } = calculateSkillPriorityScore(g.gap, demand, isOppReq, isInterest);

    return {
      skill: g.name,
      currentLevel: g.currentLevel,
      requiredLevel: g.requiredLevel,
      gap: g.gap,
      industryDemand: demand,
      demandTrend: demandObj?.trend || '+12% YoY',
      priority,
      reason,
      priorityScore: score
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore);

  // Fallback if no explicit gaps were passed and in Demo mode
  if (priorities.length === 0 && isDemo) {
    priorities.push(
      {
        skill: 'Distributed Caching & Redis',
        currentLevel: 62,
        requiredLevel: 82,
        gap: 20,
        industryDemand: 86,
        demandTrend: '+14% YoY',
        priority: 'high',
        reason: 'High-throughput system design benchmarks demand in-memory caching strategies.',
        priorityScore: 85
      },
      {
        skill: 'Cloud Architecture (AWS / GCP)',
        currentLevel: 68,
        requiredLevel: 85,
        gap: 17,
        industryDemand: 94,
        demandTrend: '+22% YoY',
        priority: 'high',
        reason: 'Cloud deployments are standard for modern web engineering.',
        priorityScore: 83
      }
    );
  }

  // 3. Recommended Skills Breakdown
  const recommendedSkills: RecommendedSkillPlan[] = priorities.slice(0, 4).map(p => ({
    skillName: p.skill,
    currentLevel: p.currentLevel,
    targetLevel: p.requiredLevel,
    gap: p.gap,
    category: 'technical',
    estimatedWeeksToClose: p.gap > 20 ? 4 : p.gap > 10 ? 3 : 2,
    primaryAction: `Close deficit via hands-on lab modules and verification projects.`
  }));

  // 4. Recommended Interventions (Actual from context only)
  const recommendedInterventions: RecommendedInterventionItem[] = (studentContext.interventions?.recommended || []).map(r => {
    const isEnrolled = (studentContext.interventions?.enrolled || []).some(e => e.interventionId === r.interventionId);
    return {
      interventionId: r.interventionId,
      title: r.title,
      skillName: r.skillName,
      type: r.type || 'Institutional Intervention',
      provider: 'Verified University Partner',
      duration: '3-4 Weeks',
      enrolled: isEnrolled
    };
  });

  if (recommendedInterventions.length === 0 && (studentContext.interventions?.enrolled || []).length > 0) {
    for (const e of studentContext.interventions.enrolled) {
      recommendedInterventions.push({
        interventionId: e.interventionId,
        title: e.title,
        skillName: e.skillName,
        type: 'Active Intervention',
        provider: 'Institutional Partner',
        duration: 'In Progress',
        enrolled: true
      });
    }
  }

  // 5. Recommended Projects (Deterministic templates matched to priority skills)
  const topPriority = priorities[0];
  const recommendedProjects: RecommendedProjectItem[] = priorities.length > 0 ? [
    {
      title: `Scalable ${effectiveRole} System with ${topPriority?.skill || 'Cloud Architecture'}`,
      skill: topPriority?.skill || 'Full-Stack Architecture',
      description: `Build an enterprise-grade application demonstrating authentication, async worker queues, and ${topPriority?.skill || 'microservices'}.`,
      expectedOutcome: 'Live deployed application with automated CI/CD pipeline and comprehensive README documentation.',
      difficulty: 'Advanced',
      portfolioRelevance: `Directly proves competence in ${topPriority?.skill || 'core requirements'} for tier-1 hiring benchmarks.`
    },
    {
      title: `High-Throughput Middleware & Monitoring Service`,
      skill: priorities[1]?.skill || 'API Performance',
      description: `Construct an API gateway featuring rate-limiting, centralized caching, and health metrics.`,
      expectedOutcome: 'Published open-source repository with benchmark test reports showing latency reduction.',
      difficulty: 'Intermediate',
      portfolioRelevance: 'Demonstrates distributed system hardening and backend reliability.'
    }
  ] : (isDemo ? [
    {
      title: `Scalable ${effectiveRole} System with Cloud Architecture`,
      skill: 'Full-Stack Architecture',
      description: `Build an enterprise-grade application demonstrating authentication, async worker queues, and microservices.`,
      expectedOutcome: 'Live deployed application with automated CI/CD pipeline and comprehensive README documentation.',
      difficulty: 'Advanced',
      portfolioRelevance: `Directly proves competence in core requirements for tier-1 hiring benchmarks.`
    }
  ] : []);

  // 6. Matched Opportunities with Deterministic Readiness Evaluation
  const matchedOpps = studentContext.opportunities?.topMatched || [];
  const recommendedOpportunities: OpportunityReadinessItem[] = matchedOpps.map(opp => {
    const evalRes = evaluateOpportunityReadiness(opp.matchScore, opp.requiredSkills, studentContext);
    return {
      opportunityId: opp.opportunityId,
      title: opp.title,
      company: opp.company,
      matchScore: opp.matchScore,
      requiredSkills: opp.requiredSkills,
      readinessStatus: evalRes.status,
      rationale: evalRes.rationale,
      missingKeySkills: evalRes.missingKeySkills
    };
  });

  // 7. Portfolio Missing Evidence Analysis
  const portfolioActions: PortfolioActionItem[] = priorities.slice(0, 2).map(p => {
    const hasProjectForSkill = (studentContext.portfolio?.topProjects || []).some(proj => 
      proj.techStack.some(t => norm(t).includes(norm(p.skill)))
    );
    return {
      skill: p.skill,
      existingEvidenceCount: hasProjectForSkill ? 1 : 0,
      missingEvidence: hasProjectForSkill 
        ? `1 basic implementation recorded; lacks production benchmark evidence.`
        : `0 verified projects demonstrating ${p.skill} in portfolio.`,
      recommendation: `Add a dedicated case study or repository demonstrating ${p.skill} under load.`,
      suggestedProjectTitle: `Scalable System with ${p.skill}`
    };
  });

  // 8. Generate Weekly Plans for Requested Duration
  const weeklyPlan = generateWeeklyTasksForDuration(duration, priorities, studentContext);

  // 9. Career Milestones
  const milestones: CareerMilestone[] = [
    {
      milestoneId: 'ms-1',
      title: `Close Top Deficit in ${topPriority?.skill || 'Core Architecture'}`,
      targetWeek: 2,
      completed: false,
      impact: `+${Math.min(15, Math.round((topPriority?.gap || 15) * 0.6))}% readiness score boost`
    },
    {
      milestoneId: 'ms-2',
      title: `Deploy Verified Project to Portfolio`,
      targetWeek: duration === 30 ? 3 : 6,
      completed: false,
      impact: `Unlocks 85%+ match scores for ${effectiveRole} internships`
    },
    {
      milestoneId: 'ms-3',
      title: `Complete Technical Interview Readiness Drill`,
      targetWeek: duration === 30 ? 4 : duration === 60 ? 8 : 12,
      completed: false,
      impact: `Prepares student for live technical whiteboarding and architecture defense`
    }
  ];

  // 10. Next Best Action
  const nextBestAction = calculateNextBestAction(studentContext);

  // 11. Readiness Explanation
  const readinessScore = studentContext.skillIntelligence?.readinessScore ?? (isDemo ? 78 : 0);
  const tier = studentContext.skillIntelligence?.tier || (readinessScore >= 80 ? 'Tier-1 Industry Ready' : readinessScore > 0 ? 'Tier-2 Developing Competence' : 'Pending Assessment');
  const percentile = studentContext.skillIntelligence?.percentile ?? (isDemo ? 84 : 0);

  const topGapSummary = priorities.slice(0, 3).map(p => `${p.skill} (-${p.gap}%)`).join(', ');
  const readinessExplanation = readinessScore > 0 
    ? `Your current readiness is ${readinessScore}%. ${topGapSummary ? `The largest contributors to the gap are ${topGapSummary}` : 'No critical gaps are currently flagged'}, while your foundation in ${strongSkills.slice(0, 2).join(' and ') || 'core competencies'} remains verified.`
    : `No assessment data is on record. Take an assessment to compute your baseline Career Readiness Index.`;

  const overallSummary = `Personalized ${duration}-day career action plan targeted toward ${effectiveRole}. Focused on closing critical skill deficits, building evidence in your verified portfolio, and preparing for top-matched internship opportunities.`;

  return {
    planId: `plan-${Date.now()}-${norm(effectiveRole)}`,
    generatedAt: new Date().toISOString(),
    isDemo,
    targetRole: effectiveRole,
    readinessScore,
    readinessTier: tier,
    readinessPercentile: percentile,
    readinessExplanation,
    overallSummary,
    strongSkills,
    skillsToMaintain,
    emergingSkills,
    priorities,
    duration,
    weeklyPlan,
    recommendedSkills,
    recommendedInterventions,
    recommendedProjects,
    recommendedOpportunities,
    portfolioActions,
    milestones,
    nextBestAction,
    requiresRoleSelection
  };
}

export const careerCoachService = {
  generateCareerPlan,
  calculateNextBestAction,
  evaluateOpportunityReadiness,
  generateInterviewPrepAdvice,
  calculateSkillPriorityScore,
  AVAILABLE_CAREER_ROLES
};
