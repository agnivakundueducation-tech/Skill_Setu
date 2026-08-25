import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { EducationEntry } from '../../../types/student';
import {
  GraduationCap,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  Users,
  CheckCircle2
} from 'lucide-react';

interface EducationSectionProps {
  education: EducationEntry[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  return (
    <div id="education" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Education & Academic Pedigree
        </h3>
        <span className="text-xs font-semibold text-slate-500">
          {education.length} Academic Qualifications
        </span>
      </div>

      <div className="space-y-4">
        {education.map((edu) => (
          <Card
            key={edu.id}
            variant="default"
            className="border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all overflow-hidden"
          >
            <div className="p-6 space-y-5">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                    <img
                      src={edu.logo}
                      alt={edu.institution}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {edu.institution}
                      </h4>
                      {edu.isCurrent && (
                        <Badge variant="primary" size="sm">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {edu.degree} — {edu.fieldOfStudy}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {edu.startDate} – {edu.endDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {edu.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grade Badge */}
                <div className="sm:text-right shrink-0">
                  <div className="inline-block p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Academic Standing
                    </div>
                    <div className="text-sm font-black text-slate-900 dark:text-slate-100">
                      {edu.grade}
                    </div>
                  </div>
                </div>
              </div>

              {/* Honors & Accolades */}
              {edu.honors && edu.honors.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                    <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Academic Honors & Recognitions</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {edu.honors.map((honor, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{honor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Coursework Matrix */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Key Technical Coursework</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {edu.coursework.map((course, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              {/* Activities / Leadership */}
              {edu.activities && edu.activities.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Campus Leadership & Extracurriculars</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
                    {edu.activities.map((act, aIdx) => (
                      <span key={aIdx} className="inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
