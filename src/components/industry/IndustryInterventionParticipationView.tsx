import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Calendar,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Award,
  Zap,
  TrendingUp,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Intervention, InterventionEnrollment } from '../../types/intervention';
import { interventionService } from '../../services/interventionService';

interface IndustryInterventionParticipationViewProps {
  industryId?: string;
  industryName?: string;
  isDemo?: boolean;
}

export const IndustryInterventionParticipationView: React.FC<IndustryInterventionParticipationViewProps> = ({
  industryId = 'ind_novacore',
  industryName = 'NovaCore Technologies Inc.',
  isDemo = true
}) => {
  const [assignedInterventions, setAssignedInterventions] = useState<Intervention[]>([]);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [mentorUpdateModal, setMentorUpdateModal] = useState<Intervention | null>(null);
  const [mentorCountInput, setMentorCountInput] = useState<number>(3);
  const [responsibilitiesInput, setResponsibilitiesInput] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, [industryId, isDemo]);

  const loadData = async () => {
    const res = await interventionService.getInterventionsForIndustry(industryId, isDemo);
    if (res.success) {
      setAssignedInterventions(res.data);
    }
  };

  const handleUpdateMentorship = async () => {
    if (!mentorUpdateModal) return;
    setIsLoading(true);

    const res = await interventionService.updateInterventionStatus(
      mentorUpdateModal.interventionId,
      mentorUpdateModal.status,
      {
        assignedMentorsCount: Number(mentorCountInput),
        industryResponsibilities: responsibilitiesInput
      },
      isDemo
    );
    setIsLoading(false);
    setMentorUpdateModal(null);

    if (res.success) {
      setNotification('Industry participation and mentor allocation updated successfully.');
      setTimeout(() => setNotification(null), 4000);
      loadData();
    }
  };

  return (
    <div className="space-y-6" id="industry-intervention-participation">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950/80 to-slate-900 text-white shadow-xl relative overflow-hidden border border-indigo-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                Institutional Interventions & Mentorship Responsibilities
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Assigned Academic Interventions
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Institutional programs where {industryName} has been approved to provide technical mentorship, live capstone reviews, and curriculum co-delivery.
            </p>
          </div>
        </div>

        {notification && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Grid of Assigned Interventions */}
      <div className="space-y-4">
        {assignedInterventions.map((item) => (
          <Card key={item.interventionId} className="p-6 bg-white border border-slate-200 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <Badge variant="indigo" size="sm">{item.interventionType}</Badge>
                  <span className="text-xs font-semibold text-slate-500">
                    Institution: <strong>{item.institutionName}</strong>
                  </span>
                  <Badge variant="neutral" size="sm">{item.status}</Badge>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">{item.description}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => {
                  setMentorUpdateModal(item);
                  setMentorCountInput(item.assignedMentorsCount || 2);
                  setResponsibilitiesInput(item.industryResponsibilities || '');
                }}
              >
                <Users className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                Update Mentors & Commitment
              </Button>
            </div>

            {/* Program Specs Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs mt-3">
              <div>
                <span className="text-slate-500 block mb-0.5">Assigned Mentors:</span>
                <strong className="text-slate-900 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  {item.assignedMentorsCount ? `${item.assignedMentorsCount} Industry Mentors Active` : 'Awaiting confirmation'}
                </strong>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">Enrolled Student Cohort:</span>
                <strong className="text-indigo-600 font-bold">
                  {item.enrolledCount || 0} / {item.capacity} Students Enrolled
                </strong>
              </div>

              <div>
                <span className="text-slate-500 block mb-0.5">Program Timeline:</span>
                <strong className="text-slate-900">{item.startDate} to {item.endDate}</strong>
              </div>
            </div>

            {/* Responsibilities */}
            {item.industryResponsibilities && (
              <div className="mt-3 text-xs text-slate-700 bg-amber-50/50 p-3 rounded-lg border border-amber-200/60 leading-relaxed">
                <strong className="text-amber-900">Agreed Industry Commitment:</strong> {item.industryResponsibilities}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* MODAL: UPDATE MENTORS */}
      {mentorUpdateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6 bg-white shadow-2xl rounded-3xl animate-fadeIn border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Confirm Industry Mentors</h3>
            <p className="text-xs text-slate-500 mb-4">
              Intervention: <strong>{mentorUpdateModal.title}</strong>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Number of Mentors Provided</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={mentorCountInput}
                  onChange={(e) => setMentorCountInput(Number(e.target.value))}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deliverables & Workshop Responsibilities
                </label>
                <textarea
                  rows={3}
                  value={responsibilitiesInput}
                  onChange={(e) => setResponsibilitiesInput(e.target.value)}
                  placeholder="Detail office hours, code reviews, speaker sessions..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <Button variant="ghost" size="sm" onClick={() => setMentorUpdateModal(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={isLoading}
                onClick={handleUpdateMentorship}
              >
                Save Mentor Commitment
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
