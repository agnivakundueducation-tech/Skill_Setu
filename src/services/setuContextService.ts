/**
 * Context Builder Layer for Setu AI (Phase 15-A)
 * 
 * Securely extracts compact, role-partitioned, and privacy-scrubbed context
 * from Cloud Firestore and Platform Domain Services.
 * 
 * Rules:
 * 1. Role Isolation: Only fetch data relevant to the authenticated user's current role.
 * 2. Privacy First: Strip passwords, tokens, private credentials, and raw auth tokens.
 * 3. Size Controlled: Return structured compact summaries instead of large document arrays.
 * 4. Injection Protection: Sanitize all user-editable string fields before feeding into LLM.
 * 5. Parallel Extraction: Fetch independent collections concurrently.
 */

import { UserRole } from '../types';
import {
  StudentSetuContext,
  IndustrySetuContext,
  AcademicianSetuContext,
  InstitutionSetuContext,
  UnifiedSetuContext
} from '../types/setu';
import {
  DEMO_STUDENT_SETU_CONTEXT,
  DEMO_INDUSTRY_SETU_CONTEXT,
  DEMO_ACADEMICIAN_SETU_CONTEXT,
  DEMO_INSTITUTION_SETU_CONTEXT,
  getDemoContextForRole
} from '../data/demoSetuContext';
import { firestoreService } from './firestoreService';
import { getOpportunities } from './opportunityService';
import { getStudentApplications, getIndustryApplications } from './applicationService';
import { calculateSkillDemand, calculateDemandVsReadiness } from './demandService';
import { collaborationService } from './collaborationService';
import { interventionService } from './interventionService';
import { calculateOpportunityMatch } from './matchingService';

/**
 * Sanitizes user-generated text fields to neutralize prompt injection tokens.
 */
export function sanitizeContextField(input?: string | null): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/```[a-z]*\n/gi, '')
    .replace(/<\/?(?:system|instruction|prompt|platform_data)\b[^>]*>/gi, '')
    .replace(/(?:ignore\s+all\s+(?:previous|prior)\s+instructions|system\s*:\s*you\s+are)/gi, '[REDACTED_INPUT_DIRECTIVE]')
    .trim()
    .slice(0, 300); // Cap field length
}

/**
 * Builds compact student context for an authenticated student
 */
export async function buildStudentContext(uid?: string, isDemo?: boolean): Promise<StudentSetuContext> {
  if (isDemo || !uid) {
    return DEMO_STUDENT_SETU_CONTEXT;
  }

  try {
    // Parallel retrieval of independent datasets
    const [
      studentProfileRes,
      skillProfileRes,
      assessmentHistoryRes,
      opportunitiesRes,
      applicationsRes,
      enrollmentsRes,
      recommendationsRes
    ] = await Promise.all([
      firestoreService.getStudentProfile(uid).catch(() => null),
      firestoreService.getSkillProfile(uid).catch(() => null),
      firestoreService.getAssessmentHistory(uid).catch(() => null),
      getOpportunities({ isDemo: false }).catch(() => ({ success: true, data: [] })),
      getStudentApplications(uid, false).catch(() => ({ success: true, data: [] })),
      interventionService.getStudentEnrollments(uid, false).catch(() => ({ success: true, data: [] })),
      interventionService.getRecommendations(undefined, false).catch(() => ({ success: true, data: [] }))
    ]);

    const studentProfile = studentProfileRes?.data;
    const skillProfile = skillProfileRes?.data;
    const assessments = assessmentHistoryRes?.data || [];
    const latestAssessment = assessments[0];
    const allOpportunities = opportunitiesRes.data || [];
    const applications = applicationsRes.data || [];
    const enrollments = enrollmentsRes.data || [];
    const recommendations = recommendationsRes.data || [];

    // Calculate match scores for top opportunities based on real data
    const matchedOpportunities = allOpportunities.slice(0, 5).map(opp => {
      const match = calculateOpportunityMatch(opp, skillProfile as any);
      return {
        opportunityId: opp.opportunityId,
        title: sanitizeContextField(opp.title),
        company: sanitizeContextField(opp.companyName),
        domain: sanitizeContextField(opp.domain || 'Technology & Engineering'),
        requiredSkills: (opp.requiredSkills || []).map(s => sanitizeContextField(s.skillName)),
        matchScore: match.overallMatch,
        deadline: opp.deadline || 'Open',
        type: opp.opportunityType || 'Internship'
      };
    });

    const calculatedDemands = calculateSkillDemand(allOpportunities);
    const readinessScore = skillProfile?.overallReadinessScore ?? studentProfile?.readinessScore ?? 0;
    const hasAssessedSkills = (skillProfile?.skills && skillProfile.skills.length > 0) || assessments.length > 0;

    const realTopSkills = skillProfile?.skills
      ? skillProfile.skills.slice(0, 5).map(s => ({
          name: sanitizeContextField(s.name),
          category: sanitizeContextField(s.category || 'Core Engineering'),
          score: s.score,
          verified: s.verified
        }))
      : [];

    const realCriticalGaps = skillProfile?.targetRoleGaps
      ? skillProfile.targetRoleGaps.slice(0, 4).map(g => ({
          name: sanitizeContextField(g.skillName),
          currentLevel: g.currentLevel,
          requiredLevel: g.requiredLevel,
          gap: g.gap,
          priority: g.priority
        }))
      : [];

    return {
      identity: {
        role: 'student',
        name: sanitizeContextField(studentProfile?.fullName || 'Student'),
        institution: sanitizeContextField(studentProfile?.institution || 'Institution Profile Pending'),
        department: sanitizeContextField(studentProfile?.department || 'Department Pending'),
        degree: sanitizeContextField(studentProfile?.degree || 'Degree Pending'),
        graduationYear: studentProfile?.graduationYear || '',
        cgpa: studentProfile?.cgpa ? `${studentProfile.cgpa}` : ''
      },
      career: {
        targetRole: sanitizeContextField(studentProfile?.careerGoal || ''),
        careerInterests: (studentProfile?.careerInterests || []).map(sanitizeContextField),
        preferredWorkMode: sanitizeContextField(studentProfile?.preferredWorkMode || 'Hybrid'),
        preferredLocation: sanitizeContextField(studentProfile?.location || ''),
        openToWork: studentProfile?.openToWork ?? true
      },
      skillIntelligence: {
        readinessScore: readinessScore,
        percentile: readinessScore > 0 ? Math.min(99, Math.max(10, Math.round(readinessScore * 0.95))) : 0,
        tier: readinessScore >= 80 ? 'Tier-1 Industry Ready' : (readinessScore >= 60 ? 'Tier-2 Developing Competence' : (hasAssessedSkills ? 'Tier-3 Foundational' : 'Assessment Pending')),
        topSkills: realTopSkills,
        criticalGaps: realCriticalGaps
      },
      assessment: {
        hasCompletedAssessment: assessments.length > 0,
        latestAssessmentDate: latestAssessment?.completedAt ? new Date(latestAssessment.completedAt).toISOString().split('T')[0] : '',
        strengths: latestAssessment?.strengths || [],
        weaknesses: latestAssessment?.growthAreas || [],
        recommendedRoles: latestAssessment?.suggestedRoles || []
      },
      opportunities: {
        topMatched: matchedOpportunities
      },
      applications: {
        totalActive: applications.length,
        recentApplications: applications.slice(0, 5).map(app => ({
          applicationId: app.applicationId,
          opportunityTitle: sanitizeContextField(app.opportunityTitle),
          company: sanitizeContextField(app.companyName),
          matchScore: app.matchScoreAtApplication || 0,
          status: app.status || 'Under Review',
          appliedAt: app.appliedAt ? new Date(app.appliedAt).toISOString().split('T')[0] : 'Recent'
        }))
      },
      industryDemand: {
        topDemandedSkills: calculatedDemands.slice(0, 5).map(d => ({
          name: sanitizeContextField(d.skillName),
          demandPercentage: d.demandPercentage || 0,
          trend: d.trend || 'Active Demand'
        }))
      },
      interventions: {
        enrolled: enrollments.slice(0, 4).map(e => ({
          interventionId: e.interventionId,
          title: sanitizeContextField(e.interventionTitle),
          skillName: sanitizeContextField(e.skillName),
          status: e.status,
          completionStatus: e.completionStatus,
          preSkillLevel: e.preSkillLevel || 0,
          postSkillLevel: e.postSkillLevel,
          measuredImprovement: e.improvement
        })),
        recommended: recommendations.slice(0, 3).map(r => ({
          interventionId: r.skillName.toLowerCase().replace(/\s+/g, '-'),
          title: sanitizeContextField(r.recommendedAction),
          skillName: sanitizeContextField(r.skillName),
          type: r.suggestedInterventionType,
          targetCohort: 'Skill Enhancement'
        }))
      },
      portfolio: {
        projectsCount: studentProfile?.projects?.length || 0,
        topProjects: (studentProfile?.projects || []).slice(0, 3).map(p => ({
          title: sanitizeContextField(p.title),
          techStack: (p.technologies || []).map(sanitizeContextField),
          highlight: sanitizeContextField(p.description)
        })),
        certifications: (studentProfile?.certifications || []).slice(0, 4).map(c => ({
          title: sanitizeContextField(c.title),
          issuer: sanitizeContextField(c.issuer),
          verified: Boolean(c.credentialId)
        })),
        internships: (studentProfile?.internships || []).slice(0, 3).map(i => ({
          company: sanitizeContextField(i.company),
          role: sanitizeContextField(i.role),
          duration: `${i.startDate || ''} - ${i.endDate || 'Present'}`
        })),
        achievements: (studentProfile?.achievements || []).slice(0, 3).map(a => sanitizeContextField(a.title))
      }
    };
  } catch (err) {
    console.warn('Error building student context from live services:', err);
    // Return blank authenticated student context, NEVER demo data
    return {
      identity: {
        role: 'student',
        name: 'Student',
        institution: '',
        department: '',
        degree: '',
        graduationYear: '',
        cgpa: ''
      },
      career: {
        targetRole: '',
        careerInterests: [],
        preferredWorkMode: 'Hybrid',
        preferredLocation: '',
        openToWork: true
      },
      skillIntelligence: {
        readinessScore: 0,
        percentile: 0,
        tier: 'Assessment Pending',
        topSkills: [],
        criticalGaps: []
      },
      assessment: {
        hasCompletedAssessment: false,
        latestAssessmentDate: '',
        strengths: [],
        weaknesses: [],
        recommendedRoles: []
      },
      opportunities: {
        topMatched: []
      },
      applications: {
        totalActive: 0,
        recentApplications: []
      },
      industryDemand: {
        topDemandedSkills: []
      },
      interventions: {
        enrolled: [],
        recommended: []
      },
      portfolio: {
        projectsCount: 0,
        topProjects: [],
        certifications: [],
        internships: [],
        achievements: []
      }
    };
  }
}

/**
 * Builds compact industry context for an authenticated recruiter/industry partner
 */
export async function buildIndustryContext(uid?: string, isDemo?: boolean): Promise<IndustrySetuContext> {
  if (isDemo || !uid) {
    return DEMO_INDUSTRY_SETU_CONTEXT;
  }

  try {
    const [
      postedOppsRes,
      applicationsRes,
      collaborationsRes,
      interventionsRes
    ] = await Promise.all([
      getOpportunities({ isDemo: false }).catch(() => ({ success: true, data: [] })),
      getIndustryApplications(uid, false).catch(() => ({ success: true, data: [] })),
      collaborationService.getCollaborations({ isDemo: false, industryId: uid }).catch(() => ({ success: true, data: [] })),
      interventionService.getInterventions({ isDemo: false }).catch(() => ({ success: true, data: [] }))
    ]);

    const allOpportunities = postedOppsRes.data || [];
    const myOpps = allOpportunities.filter(o => o.postedBy === uid);
    const applications = applicationsRes.data || [];
    const collaborations = collaborationsRes.data || [];
    const interventions = interventionsRes.data || [];
    const calculatedDemands = calculateSkillDemand(allOpportunities);

    return {
      organization: {
        role: 'industry',
        companyName: sanitizeContextField(myOpps[0]?.companyName || 'Enterprise Partner Profile'),
        industryDomain: sanitizeContextField(myOpps[0]?.domain || 'Technology & Engineering'),
        location: sanitizeContextField(myOpps[0]?.location || ''),
        description: sanitizeContextField(myOpps[0]?.aboutCompany || ''),
        verifiedPartner: true
      },
      opportunities: {
        totalPosted: myOpps.length,
        activeCount: myOpps.filter(o => o.status === 'Active').length,
        postedOpportunities: myOpps.slice(0, 5).map(o => ({
          opportunityId: o.opportunityId,
          title: sanitizeContextField(o.title),
          type: o.opportunityType,
          requiredSkills: (o.requiredSkills || []).map(s => sanitizeContextField(s.skillName)),
          preferredSkills: (o.preferredSkills || []).map(s => sanitizeContextField(s.skillName)),
          status: o.status,
          applicantsCount: o.applicantsCount || 0,
          deadline: o.deadline || 'Open'
        }))
      },
      applicantsSummary: {
        totalApplicantsAcrossJobs: applications.length,
        topMatches: applications.slice(0, 5).map(app => ({
          opportunityTitle: sanitizeContextField(app.opportunityTitle),
          candidateName: sanitizeContextField(app.studentName),
          institution: sanitizeContextField(app.studentInstitution || 'Verified Institution'),
          matchScore: app.matchScoreAtApplication || 0,
          matchedSkills: (app.matchedSkills || []).map(sanitizeContextField),
          skillGaps: (app.skillGaps || []).map(sanitizeContextField),
          status: app.status
        }))
      },
      demandIntelligence: {
        domainSkillPriorities: calculatedDemands.slice(0, 4).map(d => ({
          skill: sanitizeContextField(d.skillName),
          marketDemand: d.demandPercentage || 0,
          priority: d.priority || 'Moderate'
        }))
      },
      collaborations: {
        activeCollaborationsCount: collaborations.filter(c => c.status === 'Active').length,
        collaborationsList: collaborations.slice(0, 4).map(c => ({
          collaborationId: c.collaborationId,
          title: sanitizeContextField(c.title),
          type: c.type,
          partnerInstitution: sanitizeContextField(c.partnerInstitutionName || ''),
          status: c.status,
          expertiseRequirements: (c.requiredSkills || []).map(sanitizeContextField)
        }))
      },
      interventions: {
        mentoringInterventions: interventions.slice(0, 3).map(i => ({
          interventionId: i.interventionId,
          title: sanitizeContextField(i.title),
          institutionName: sanitizeContextField(i.institutionName),
          skillName: sanitizeContextField(i.skillName),
          mentorName: sanitizeContextField(i.industryMentorName),
          enrolledCount: i.enrolledCount || 0
        }))
      }
    };
  } catch (err) {
    console.warn('Error building industry context from live services:', err);
    return {
      organization: {
        role: 'industry',
        companyName: 'Enterprise Partner Profile',
        industryDomain: '',
        location: '',
        description: '',
        verifiedPartner: true
      },
      opportunities: {
        totalPosted: 0,
        activeCount: 0,
        postedOpportunities: []
      },
      applicantsSummary: {
        totalApplicantsAcrossJobs: 0,
        topMatches: []
      },
      demandIntelligence: {
        domainSkillPriorities: []
      },
      collaborations: {
        activeCollaborationsCount: 0,
        collaborationsList: []
      },
      interventions: {
        mentoringInterventions: []
      }
    };
  }
}

/**
 * Builds compact academician context for an authenticated faculty member
 */
export async function buildAcademicianContext(uid?: string, isDemo?: boolean): Promise<AcademicianSetuContext> {
  if (isDemo || !uid) {
    return DEMO_ACADEMICIAN_SETU_CONTEXT;
  }

  try {
    const [collaborationsRes, facultyProfileRes] = await Promise.all([
      collaborationService.getCollaborations({ isDemo: false }).catch(() => ({ success: true, data: [] })),
      collaborationService.getAcademicianProfile(uid, false).catch(() => ({ success: true, data: null as any }))
    ]);

    const collaborations = collaborationsRes.data || [];
    const faculty = facultyProfileRes?.data;

    return {
      profile: {
        role: 'academician',
        facultyName: sanitizeContextField(faculty?.fullName || 'Faculty Member'),
        institution: sanitizeContextField(faculty?.institution || 'Institution Profile Pending'),
        department: sanitizeContextField(faculty?.department || 'Department Pending'),
        designation: sanitizeContextField(faculty?.designation || 'Faculty'),
        expertise: (faculty?.expertiseTags || []).map(sanitizeContextField),
        researchInterests: (faculty?.researchAreas || []).map(sanitizeContextField),
        passportScore: faculty?.passportScore || 0
      },
      collaborations: {
        recommended: collaborations.filter(c => c.status === 'Open').slice(0, 4).map(c => ({
          collaborationId: c.collaborationId,
          title: sanitizeContextField(c.title),
          company: sanitizeContextField(c.companyName),
          type: c.type,
          matchScore: 85,
          requiredExpertise: (c.requiredSkills || []).map(sanitizeContextField)
        })),
        appliedOrActive: collaborations.filter(c => c.status === 'Active').slice(0, 3).map(c => ({
          collaborationId: c.collaborationId,
          title: sanitizeContextField(c.title),
          company: sanitizeContextField(c.companyName),
          type: c.type,
          status: c.status,
          appliedAt: c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : 'Recent'
        })),
        completedCount: 0
      },
      fdp: {
        availablePrograms: [],
        appliedPrograms: [],
        completedCount: 0
      },
      mentorship: {
        activeMentorships: []
      },
      research: {
        industrySponsoredProjects: []
      }
    };
  } catch (err) {
    console.warn('Error building academician context from live services:', err);
    return {
      profile: {
        role: 'academician',
        facultyName: 'Faculty Member',
        institution: '',
        department: '',
        designation: '',
        expertise: [],
        researchInterests: [],
        passportScore: 0
      },
      collaborations: {
        recommended: [],
        appliedOrActive: [],
        completedCount: 0
      },
      fdp: {
        availablePrograms: [],
        appliedPrograms: [],
        completedCount: 0
      },
      mentorship: {
        activeMentorships: []
      },
      research: {
        industrySponsoredProjects: []
      }
    };
  }
}

/**
 * Builds compact aggregate institutional context for university leaders and HoDs
 */
export async function buildInstitutionContext(uid?: string, isDemo?: boolean): Promise<InstitutionSetuContext> {
  if (isDemo || !uid) {
    return DEMO_INSTITUTION_SETU_CONTEXT;
  }

  try {
    const [
      interventionsRes,
      opportunitiesRes
    ] = await Promise.all([
      interventionService.getInterventions({ isDemo: false, institutionId: uid }).catch(() => ({ success: true, data: [] })),
      getOpportunities({ isDemo: false }).catch(() => ({ success: true, data: [] }))
    ]);

    const interventions = interventionsRes.data || [];
    const allOpportunities = opportunitiesRes.data || [];
    const demandSignals = calculateSkillDemand(allOpportunities);
    const matrix = calculateDemandVsReadiness(demandSignals);

    const highDemandLowReadiness = matrix
      .filter(m => m.matrixQuadrant === 'urgent_development')
      .map(m => sanitizeContextField(m.skillName));

    const highDemandHighReadiness = matrix
      .filter(m => m.matrixQuadrant === 'maintain')
      .map(m => sanitizeContextField(m.skillName));

    return {
      institution: {
        role: 'institution',
        institutionName: 'Institutional Command Center',
        departments: [],
        accreditationStatus: 'NAAC / NBA Aligned System',
        totalStudents: 0
      },
      studentIntelligence: {
        studentsRepresentedCount: 0,
        averageReadinessScore: 0,
        readinessTierDistribution: [],
        criticalSkillGaps: [],
        curriculumGaps: []
      },
      industryDemand: {
        topDemandedSkills: demandSignals.slice(0, 5).map(d => ({
          skill: sanitizeContextField(d.skillName),
          demandIndex: d.demandPercentage || 0,
          trend: d.trend || 'Active Demand'
        })),
        quadrantOverview: {
          highDemandLowReadiness,
          highDemandHighReadiness
        }
      },
      interventions: {
        proposedCount: interventions.filter(i => i.status === 'Proposed').length,
        approvedCount: interventions.filter(i => i.status === 'Approved').length,
        activeCount: interventions.filter(i => i.status === 'Active').length,
        completedCount: interventions.filter(i => i.status === 'Completed' || i.status === 'Evaluated').length,
        programs: interventions.slice(0, 5).map(i => ({
          interventionId: i.interventionId,
          title: sanitizeContextField(i.title),
          skillName: sanitizeContextField(i.skillName),
          type: i.type,
          status: i.status,
          enrolledCount: i.enrolledCount || 0,
          measuredImprovement: i.measuredImprovement
        }))
      },
      impact: {
        averageMeasuredSkillGain: 0,
        overallCompletionRate: 0,
        partnerEnterprisesCount: 0,
        verifiedPlacementsCount: 0
      }
    };
  } catch (err) {
    console.warn('Error building institution context from live services:', err);
    return {
      institution: {
        role: 'institution',
        institutionName: 'Institutional Command Center',
        departments: [],
        accreditationStatus: '',
        totalStudents: 0
      },
      studentIntelligence: {
        studentsRepresentedCount: 0,
        averageReadinessScore: 0,
        readinessTierDistribution: [],
        criticalSkillGaps: [],
        curriculumGaps: []
      },
      industryDemand: {
        topDemandedSkills: [],
        quadrantOverview: {
          highDemandLowReadiness: [],
          highDemandHighReadiness: []
        }
      },
      interventions: {
        proposedCount: 0,
        approvedCount: 0,
        activeCount: 0,
        completedCount: 0,
        programs: []
      },
      impact: {
        averageMeasuredSkillGain: 0,
        overallCompletionRate: 0,
        partnerEnterprisesCount: 0,
        verifiedPlacementsCount: 0
      }
    };
  }
}

/**
 * Unified Context Builder Dispatcher
 */
export async function buildContextForRole(
  role: UserRole,
  uid?: string,
  isDemo?: boolean
): Promise<UnifiedSetuContext> {
  const generatedAt = new Date().toISOString();

  if (isDemo) {
    return getDemoContextForRole(role);
  }

  switch (role) {
    case 'student': {
      const studentCtx = await buildStudentContext(uid, isDemo);
      const hasData = studentCtx.skillIntelligence.readinessScore > 0 || studentCtx.identity.name !== 'Student';
      return {
        role: 'student',
        uid,
        isDemo: Boolean(isDemo),
        generatedAt,
        dataCompletenessScore: hasData ? (studentCtx.skillIntelligence.readinessScore > 0 ? 85 : 45) : 10,
        student: studentCtx,
        flags: ['STUDENT_DNA_ACTIVE']
      };
    }
    case 'industry': {
      const industryCtx = await buildIndustryContext(uid, isDemo);
      return {
        role: 'industry',
        uid,
        isDemo: Boolean(isDemo),
        generatedAt,
        dataCompletenessScore: industryCtx.opportunities.totalPosted > 0 ? 80 : 20,
        industry: industryCtx,
        flags: ['RECRUITER_MATCH_ACTIVE']
      };
    }
    case 'academician': {
      const academicianCtx = await buildAcademicianContext(uid, isDemo);
      return {
        role: 'academician',
        uid,
        isDemo: Boolean(isDemo),
        generatedAt,
        dataCompletenessScore: academicianCtx.profile.facultyName !== 'Faculty Member' ? 75 : 15,
        academician: academicianCtx,
        flags: ['FACULTY_PASSPORT_ACTIVE']
      };
    }
    case 'institution':
    default: {
      const instCtx = await buildInstitutionContext(uid, isDemo);
      return {
        role: 'institution',
        uid,
        isDemo: Boolean(isDemo),
        generatedAt,
        dataCompletenessScore: instCtx.interventions.programs.length > 0 ? 70 : 15,
        institution: instCtx,
        flags: ['INSTITUTION_OBE_ACTIVE']
      };
    }
  }
}
