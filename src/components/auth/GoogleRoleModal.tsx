import React, { useState } from 'react';
import { UserRole } from '../../types';
import { ROLES } from '../../data/mockData';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { DynamicIcon } from '../common/IconRenderer';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Building } from 'lucide-react';

interface GoogleRoleModalProps {
  isOpen: boolean;
  userName?: string;
  onSelectRole: (role: UserRole, details: { institution: string; department: string }) => Promise<void>;
  isLoading: boolean;
}
export const GoogleRoleModal: React.FC<GoogleRoleModalProps> = ({
  isOpen,
  userName,
  onSelectRole,
  isLoading
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [institution, setInstitution] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const roleKeys: UserRole[] = ['student', 'industry', 'academician', 'institution'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await onSelectRole(selectedRole, {
        institution: institution.trim() || (selectedRole === 'industry' ? 'NovaCore Technologies' : 'Apex University'),
        department: department.trim() || 'Computer Science & AI'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to finalize profile role.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <Card variant="elevated" className="w-full max-w-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        <CardHeader className="text-center pb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-indigo-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Welcome to SkillSetu AI{userName ? `, ${userName.split(' ')[0]}` : ''}
          </CardTitle>
          <CardDescription>
            Complete your profile to continue. Select your ecosystem stakeholder perspective to configure your personalized workspace.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                Choose Your Primary Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {roleKeys.map((key) => {
                  const role = ROLES[key];
                  const isSelected = selectedRole === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedRole(key)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-28 relative ${
                        isSelected
                          ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${role.color.light}`}>
                          <DynamicIcon name={role.iconName} className="w-4 h-4" />
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {role.title.split(' ')[0]}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {role.subtitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {selectedRole === 'industry' ? 'Company / Enterprise' : 'Institution / College'}
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder={selectedRole === 'industry' ? 'e.g., NovaCore Technologies' : 'e.g., Apex University'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Department / Specialization
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g., Computer Science & AI"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Role configuration sets your initial access permissions and Firestore user profile.</span>
            </div>
          </CardContent>

          
          <CardFooter className="pt-2 flex items-center justify-end gap-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              disabled={isLoading}
              rightIcon={isLoading ? undefined : ArrowRight}
              className="w-full sm:w-auto"
            >
              {isLoading ? 'Creating Workspace...' : `Complete Setup & Enter ${ROLES[selectedRole].title}`}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
