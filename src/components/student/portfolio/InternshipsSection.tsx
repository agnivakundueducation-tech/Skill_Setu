import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { InternshipEntry } from '../../../types/student';
import {
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle2,
  Quote,
  ShieldCheck,
  Building2,
  Layers,
  ChevronRight
} from 'lucide-react';

interface InternshipsSectionProps {
  internships: InternshipEntry[];
}

export const InternshipsSection: React.FC<InternshipsSectionProps> = ({
  internships
}) => {
  return (
    <div id="internships" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Industry Internships & Practical Experience
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Supervised engineering roles with measured performance impact and verified mentor appraisals
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          {internships.length} Verified Internships
        </span>
      </div>

      <div className="space-y-4">
        {internships.map((intern) => (
          <Card
            key={intern.id}
            variant="default"
            className="border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all p-6 space-y-5 shadow-xs"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                  <img
                    src={intern.companyLogo}
                    alt={intern.company}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {intern.role}
                    </h4>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                      {intern.workType}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                    {intern.company}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {intern.startDate} – {intern.endDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {intern.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60 self-start sm:self-auto shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{intern.verifiedStatus}</span>
              </div>
            </div>

            {/* Role Overview */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {intern.description}
            </p>

            {/* Key Contributions / Metrics */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Key Deliverables & Engineering Outcomes
              </div>
              <ul className="space-y-1.5">
                {intern.keyContributions.map((contrib, cIdx) => (
                  <li
                    key={cIdx}
                    className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{contrib}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies Used */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-[11px] font-bold text-slate-400 mr-1">Stack:</span>
              {intern.technologies.map((tech, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Mentor Testimonial Quote */}
            {intern.mentorRecommendation && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 relative">
                <Quote className="w-4 h-4 text-indigo-400/60 absolute top-3 right-3" />
                <p className="text-xs italic text-slate-600 dark:text-slate-300 pr-6">
                  {intern.mentorRecommendation}
                </p>
                <div className="text-[11px] font-bold text-slate-900 dark:text-slate-100 mt-2">
                  — {intern.mentorName}, <span className="font-normal text-slate-500">{intern.mentorTitle}</span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
