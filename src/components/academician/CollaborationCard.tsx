import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  CollaborationOpportunity,
  FacultyProfile,
  CollaborationMatchResult
} from '../../types/collaboration';
import { calculateCollaborationMatch } from '../../services/collaborationMatchingService';
import {
  Building2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  BookOpen,
  Cpu,
  FileCode2,
  FlaskConical,
  Award,
  Lightbulb
} from 'lucide-react';

interface CollaborationCardProps {
  collaboration: CollaborationOpportunity;
  facultyProfile: FacultyProfile | null;
  onSelect: (collaboration: CollaborationOpportunity, matchResult: CollaborationMatchResult) => void;
  onApplyDirectly?: (collaboration: CollaborationOpportunity, matchResult: CollaborationMatchResult) => void;
  isApplied?: boolean;
  appliedStatus?: string;
}

export const CollaborationCard: React.FC<CollaborationCardProps> = ({
  collaboration,
  facultyProfile,
  onSelect,
  onApplyDirectly,
  isApplied = false,
  appliedStatus
}) => {
  const matchResult = calculateCollaborationMatch(facultyProfile, collaboration);
  const { overallMatch, matchedExpertise, missingExpertise } = matchResult;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Faculty Internship':
        return <Badge variant="primary" size="sm">Faculty Internship</Badge>;
      case 'Research Collaboration':
        return <Badge variant="indigo" size="sm">Research Collaboration</Badge>;
      case 'FDP':
        return <Badge variant="sky" size="sm">FDP Program</Badge>;
      case 'Live Project':
        return <Badge variant="emerald" size="sm">Live Project</Badge>;
      case 'Consultancy':
        return <Badge variant="purple" size="sm">Consultancy</Badge>;
      case 'Guest Lecture':
        return <Badge variant="amber" size="sm">Guest Lecture</Badge>;
      case 'Mentorship':
        return <Badge variant="info" size="sm">Mentorship</Badge>;
      case 'Innovation Challenge':
        return <Badge variant="danger" size="sm">Innovation Challenge</Badge>;
      case 'Industrial Training':
        return <Badge variant="emerald" size="sm">Industrial Training</Badge>;
      default:
        return <Badge variant="default" size="sm">{type}</Badge>;
    }
  };

  const getMatchBadgeClass = (score: number) => {
    if (score >= 85) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    if (score >= 70) return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
    if (score >= 50) return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  };

  return (
    <Card
      variant="default"
      className="p-5 rounded-2xl border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/80 transition-all flex flex-col justify-between group h-full space-y-4"
    >
      <div className="space-y-3.5">
        {/* Top Meta: Industry & Match Score */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 font-bold text-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate block">
                {collaboration.industryName}
              </span>
              <div className="pt-0.5">
                {getTypeBadge(collaboration.collaborationType)}
              </div>
            </div>
          </div>

          {/* Match Score Badge */}
          <div className="text-right shrink-0">
            <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border ${getMatchBadgeClass(overallMatch)}`}>
              <Sparkles className="w-3 h-3" />
              <span>{overallMatch}% Match</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Deterministic SQ
            </div>
          </div>
        </div>

        {/* Title & Short Description */}
        <div>
          <h3
            onClick={() => onSelect(collaboration, matchResult)}
            className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 cursor-pointer"
          >
            {collaboration.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {collaboration.description}
          </p>
        </div>

        {/* Required Expertise Tags */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Required Competencies
          </span>
          <div className="flex flex-wrap gap-1.5">
            {collaboration.requiredExpertise.slice(0, 4).map((skill) => {
              const isMatched = matchedExpertise.includes(skill);
              return (
                <span
                  key={skill}
                  className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg font-medium border ${
                    isMatched
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {isMatched && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                  {skill}
                </span>
              );
            })}
            {collaboration.requiredExpertise.length > 4 && (
              <span className="text-[10px] text-slate-400 self-center">
                +{collaboration.requiredExpertise.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Key Attributes Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{collaboration.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{collaboration.workMode} • {collaboration.location}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Cap: {collaboration.capacity} seats</span>
          </div>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="text-[11px] text-slate-400">
          Deadline: <strong className="text-slate-600 dark:text-slate-300">{collaboration.applicationDeadline}</strong>
        </div>

        <div className="flex items-center gap-2">
          {isApplied ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {appliedStatus || 'Applied'}
            </span>
          ) : (
            <Button
              variant="primary"
              size="sm"
              rightIcon={ArrowRight}
              onClick={() => onSelect(collaboration, matchResult)}
              className="text-xs"
            >
              View & Apply
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
