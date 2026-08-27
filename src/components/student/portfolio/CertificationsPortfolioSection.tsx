import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Certification } from '../../../types/student';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Calendar,
  Lock,
  Sparkles,
  QrCode
} from 'lucide-react';

interface CertificationsPortfolioSectionProps {
  certifications: Certification[];
  onViewCertificate?: (cert: Certification) => void;
}

export const CertificationsPortfolioSection: React.FC<CertificationsPortfolioSectionProps> = ({
  certifications,
  onViewCertificate
}) => {
  return (
    <div id="certifications" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Industry Certifications & Accreditations
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cryptographically anchored credentials issued by accredited enterprise & cloud institutions
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          {certifications.length} Active Certificates
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certifications.map((cert) => (
          <Card
            key={cert.id}
            variant="default"
            className="border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all p-5 flex flex-col justify-between shadow-xs"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                    <img
                      src={cert.issuerLogo}
                      alt={cert.issuer}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {cert.title}
                    </h4>
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {cert.issuer}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 font-mono">
                      <span>ID: {cert.credentialId}</span>
                    </div>
                  </div>
                </div>

                <Badge
                  variant={cert.badgeLevel === 'Platinum' ? 'primary' : 'secondary'}
                  size="sm"
                  className="font-bold shrink-0"
                >
                  {cert.badgeLevel} Tier
                </Badge>
              </div>

              {/* Grade / Distinction Callout */}
              {cert.gradeScore && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Evaluation Grade:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {cert.gradeScore}
                  </span>
                </div>
              )}

              {/* Certified Skills */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Certified Competencies
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cert.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Blockchain proof banner */}
              {cert.blockchainHash && (
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-900/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800/60 truncate">
                  <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span className="truncate">Hash: {cert.blockchainHash}</span>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Issued {cert.issueDate}
              </span>

              <div className="flex items-center gap-2">
                {onViewCertificate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewCertificate(cert)}
                    className="text-xs"
                  >
                    View Credential
                  </Button>
                )}
                <a
                  href={cert.verificationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <span>Verify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
