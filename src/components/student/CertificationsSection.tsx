import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { STUDENT_CERTIFICATIONS } from '../../data/studentData';
import { Certification } from '../../types/student';
import {
  Award,
  ShieldCheck,
  ExternalLink,
  Calendar,
  Sparkles,
  QrCode,
  FileCheck,
  Download,
  Share2,
  CheckCircle2
} from 'lucide-react';

interface CertificationsSectionProps {
  onViewCertificate?: (cert: Certification) => void;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  onViewCertificate
}) => {
  const certifications = STUDENT_CERTIFICATIONS;

  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'Platinum':
        return 'bg-gradient-to-r from-slate-900 to-indigo-950 text-indigo-300 border-indigo-500/40';
      case 'Gold':
        return 'bg-gradient-to-r from-amber-950/80 to-amber-900 text-amber-200 border-amber-500/40';
      default:
        return 'bg-indigo-950 text-indigo-200 border-indigo-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Award className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Verified Credential Passport
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {certifications.length} Verifiable Industry Credentials & Certifications
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cryptographically signed micro-credentials verified by global engineering partners and accredited universities
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            leftIcon={Download}
            onClick={() => alert('Exporting comprehensive SkillSetu Verified Credential PDF passport...')}
          >
            Export All (PDF)
          </Button>
        </div>
      </div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {certifications.map((cert) => (
          <Card
            key={cert.id}
            variant="default"
            className="p-5 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <img
                  src={cert.issuerLogo}
                  alt={cert.issuer}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                />
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${getBadgeStyle(
                      cert.badgeLevel
                    )}`}
                  >
                    ★ {cert.badgeLevel} Tier
                  </span>
                  {cert.gradeScore && (
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Score: {cert.gradeScore}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {cert.title}
              </h3>

              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Issued by: <strong className="text-slate-800 dark:text-slate-200">{cert.issuer}</strong>
              </div>

              {/* Credential ID and dates */}
              <div className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1 font-mono">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">ID:</span>
                  <span className="font-semibold truncate">{cert.credentialId}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Issued: {cert.issueDate}</span>
                  <span>{cert.expiryDate || 'No Expiry'}</span>
                </div>
              </div>

              {/* Skills Tagged */}
              <div className="space-y-1.5 mb-4">
                <div className="text-[11px] font-semibold text-slate-400">
                  Skills Validated:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero-Knowledge Verified</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                rightIcon={ExternalLink}
                onClick={() => onViewCertificate && onViewCertificate(cert)}
              >
                Inspect Certificate
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
