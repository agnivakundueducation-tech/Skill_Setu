import {
  InstitutionSkillGap,
  InterventionRecommendation,
  InterventionPriority,
  InterventionType,
  CurriculumCoverage,
  CurriculumAlignmentItem
} from '../types/intervention';
import { DEMO_INSTITUTION_SKILL_GAPS, DEMO_INTERVENTION_RECOMMENDATIONS, DEMO_CURRICULUM_ALIGNMENTS } from '../data/demoInterventions';

export interface CalculateSkillGapsInput {
  skills?: Array<{
    skillId: string;
    skillName: string;
    category?: 'technical' | 'professional' | 'domain';
    industryDemand?: number; // 0 - 100 percentage
    averageStudentLevel?: number; // 0 - 100
    industryRequiredLevel?: number; // 0 - 100
    affectedStudents?: number;
    totalAssessedStudents?: number;
    curriculumCoverage?: CurriculumCoverage;
    facultyReadinessScore?: number;
  }>;
  customCurriculumCoverage?: Record<string, CurriculumCoverage>;
}

/**
 * Deterministically calculates institutional skill gaps.
 * Uses real student assessment data, industry benchmarks, and opportunity demand.
 */
export function calculateInstitutionSkillGaps(
  input?: CalculateSkillGapsInput,
  isDemo = false
): InstitutionSkillGap[] {
  // If custom skill data is provided, calculate dynamically; otherwise return demo baseline only when in demo mode
  if (!input?.skills || input.skills.length === 0) {
    if (!isDemo) {
      return [];
    }
    // Apply any customized curriculum coverage mappings to baseline data
    if (input?.customCurriculumCoverage) {
      return DEMO_INSTITUTION_SKILL_GAPS.map((gap) => ({
        ...gap,
        curriculumCoverage: input.customCurriculumCoverage?.[gap.skillId] || gap.curriculumCoverage
      }));
    }
    return DEMO_INSTITUTION_SKILL_GAPS;
  }

  return input.skills.map((skill) => {
    const industryDemand = Math.round(skill.industryDemand ?? 50);
    const averageStudentLevel = Math.round(skill.averageStudentLevel ?? 50);
    const industryRequiredLevel = Math.round(skill.industryRequiredLevel ?? 75);
    const readinessGap = Math.max(0, industryRequiredLevel - averageStudentLevel);
    const totalAssessed = skill.totalAssessedStudents ?? 450;
    const affectedStudents = skill.affectedStudents ?? Math.round(totalAssessed * (readinessGap > 15 ? 0.65 : 0.25));
    const curriculumCoverage = input.customCurriculumCoverage?.[skill.skillId] ?? skill.curriculumCoverage ?? 'Partially Covered';
    const facultyReadiness = skill.facultyReadinessScore ?? 60;

    // Deterministic Priority Rules
    let demandPriority: 'High' | 'Moderate' | 'Low' | 'Emerging' = 'Moderate';
    if (industryDemand >= 50) demandPriority = 'High';
    else if (industryDemand >= 30) demandPriority = 'Moderate';
    else demandPriority = 'Low';

    let interventionPriority: InterventionPriority = 'LOW';
    if (industryDemand >= 45 && readinessGap >= 28) {
      interventionPriority = 'CRITICAL';
    } else if ((industryDemand >= 35 && readinessGap >= 20) || readinessGap >= 35) {
      interventionPriority = 'HIGH';
    } else if (industryDemand >= 25 && readinessGap >= 12) {
      interventionPriority = 'MEDIUM';
    } else {
      interventionPriority = 'LOW';
    }

    const explanation = `${skill.skillName} exhibits ${industryDemand}% industry demand against an average student readiness of ${averageStudentLevel} vs the required ${industryRequiredLevel} (gap of ${readinessGap} points across ${affectedStudents} affected students).`;

    return {
      skillId: skill.skillId,
      skillName: skill.skillName,
      category: skill.category || 'technical',
      industryDemand,
      averageStudentLevel,
      industryRequiredLevel,
      readinessGap,
      affectedStudents,
      totalAssessedStudents: totalAssessed,
      demandPriority,
      interventionPriority,
      curriculumCoverage,
      facultyReadinessScore: facultyReadiness,
      explanation
    };
  });
}

/**
 * Deterministically generates explainable intervention recommendations based on institutional skill gaps.
 */
export function generateInterventionRecommendations(
  skillGaps: InstitutionSkillGap[],
  isDemo = false
): InterventionRecommendation[] {
  if (!skillGaps || skillGaps.length === 0) {
    return isDemo ? DEMO_INTERVENTION_RECOMMENDATIONS : [];
  }

  const recommendations: InterventionRecommendation[] = [];

  for (const gap of skillGaps) {
    // Skip low priority gaps where students are well aligned unless emerging
    if (gap.interventionPriority === 'LOW' && gap.readinessGap <= 10) {
      continue;
    }

    const {
      skillId,
      skillName,
      industryDemand,
      averageStudentLevel,
      industryRequiredLevel,
      readinessGap,
      interventionPriority,
      curriculumCoverage,
      facultyReadinessScore = 60
    } = gap;

    let interventionType: InterventionType = 'Industry Workshop';
    let title = `${skillName} Industry Skill Accelerator`;
    let description = `Targeted program designed to bridge the ${readinessGap}-point readiness gap in ${skillName}.`;
    let recommendedAction = `Launch an industry-led ${skillName} workshop followed by hands-on student projects.`;
    let targetAudience = `Students enrolled in technology disciplines with readiness below ${industryRequiredLevel}`;
    let expectedImprovement = `+${Math.min(35, Math.round(readinessGap * 0.75))} Readiness Points`;
    let duration = '4 Weeks (24-32 Hours)';
    let industryAlignment = `Directly addresses requirements across ${industryDemand}% of industry postings.`;
    let requiredResources = ['Lab Computing Infrastructure', 'Industry Expert Co-Mentors'];
    let suggestedExpertise = [skillName, 'System Architecture', 'Industry Best Practices'];

    // Rule 1: High Demand + Large Gap (>= 28)
    if (industryDemand >= 45 && readinessGap >= 28) {
      interventionType = 'Bootcamp';
      title = `Industry-Led ${skillName} Intensive Bootcamp`;
      description = `Immersive 4-week cohort training covering real-world workflows, architecture design, and enterprise tooling in ${skillName}.`;
      recommendedAction = `Launch an industry-led ${skillName} bootcamp followed by a hands-on deployment project.`;
      duration = '4 Weeks (32 Total Hours)';
      requiredResources = ['Cloud/Local Sandboxes', 'CI/CD Lab Environment', 'Industry Mentor Access'];
    }
    // Rule 2: Faculty Expertise Gap (< 50) + High/Moderate Industry Demand
    else if (facultyReadinessScore < 50 && industryDemand >= 35) {
      interventionType = 'Faculty Development Program';
      title = `${skillName} Faculty Development & Industrial Immersion Program`;
      description = `5-day intensive masterclass for department faculty to align syllabus delivery with cutting-edge industry practices in ${skillName}.`;
      recommendedAction = `Faculty members may benefit from an industry-led ${skillName} FDP and industrial sabbatical.`;
      targetAudience = 'Department Faculty & Lab Instructors';
      expectedImprovement = '+30 Faculty Pedagogy & Practical Alignment';
      duration = '5 Days (30 Hours Masterclass)';
      requiredResources = ['Faculty Lab Access', 'Industry Master Trainer'];
    }
    // Rule 3: Foundational Student Gap (< 35 readiness) + Not Covered in Curriculum
    else if (curriculumCoverage === 'Not Covered' && averageStudentLevel < 40) {
      interventionType = 'Curriculum Module';
      title = `Integrated ${skillName} Core Practical Curriculum Module`;
      description = `Embed a dedicated laboratory track and coursework module for ${skillName} into the core semester syllabus.`;
      recommendedAction = `Add ${skillName} fundamentals and practical lab exercises to the academic curriculum.`;
      targetAudience = 'All 2nd and 3rd Year Department Cohorts';
      expectedImprovement = `+${Math.round(readinessGap * 0.8)} Points across entire student cohort`;
      duration = 'Full Semester Lab Module (18 Lab Hours)';
      requiredResources = ['Syllabus Board of Studies Approval', 'Open-source Tooling Sandbox'];
    }
    // Rule 4: Moderate/Reasonable Technical Level (50-65) but lacking practical industry exposure
    else if (averageStudentLevel >= 50 && averageStudentLevel <= 68 && readinessGap >= 12) {
      interventionType = 'Live Industry Project';
      title = `Enterprise ${skillName} Live Capstone Project`;
      description = `Student engineering teams develop production-grade deliverables under active weekly supervision from industry architects.`;
      recommendedAction = `Partner with industry mentors to host live capstones in ${skillName}.`;
      targetAudience = 'Pre-final & Final Year Students with foundational knowledge';
      expectedImprovement = '+20-25 Practical Implementation Score';
      duration = '6 Weeks (Milestone-based Reviews)';
      requiredResources = ['Project Repositories', 'Bi-weekly Industry Code Reviewers'];
    }
    // Rule 5: Emerging / Specialized Industry Skill
    else {
      interventionType = 'Industry Workshop';
      title = `Mastering ${skillName}: Industry Best Practices Workshop`;
      description = `Interactive 2-day technical workshop with live demonstrations, code walkthroughs, and architecture case studies.`;
      recommendedAction = `Host an industry-led ${skillName} weekend workshop with live code demonstrations.`;
      duration = '2 Days (16 Hours)';
      requiredResources = ['Seminar Hall / Lab', 'Industry Guest Speaker'];
    }

    // Explainable Reason with Visible Underlying Numbers
    const reason = `${skillName} is recommended as a ${interventionPriority === 'CRITICAL' ? 'Critical' : interventionPriority === 'HIGH' ? 'High' : 'Moderate'} Priority intervention because it appears in ${industryDemand}% of active opportunities, while the average student readiness is ${averageStudentLevel} against a baseline requirement of ${industryRequiredLevel} (gap of ${readinessGap}).`;

    recommendations.push({
      recommendationId: `rec_${skillId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      skillId,
      skillName,
      priority: interventionPriority,
      reason,
      interventionType,
      title,
      description,
      targetAudience,
      expectedSkillImprovement: expectedImprovement,
      estimatedDuration: duration,
      industryAlignment,
      requiredResources,
      suggestedIndustryExpertise: suggestedExpertise,
      recommendedAction,
      status: 'Proposed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  return recommendations;
}

/**
 * Returns curriculum alignment matrix with configurable status.
 */
export function getCurriculumAlignmentMatrix(
  customCoverage?: Record<string, CurriculumCoverage>,
  isDemo = false
): CurriculumAlignmentItem[] {
  if (!isDemo) {
    return [];
  }
  return DEMO_CURRICULUM_ALIGNMENTS.map((item) => ({
    ...item,
    curriculumCoverage: customCoverage?.[item.skillId] || item.curriculumCoverage
  }));
}
