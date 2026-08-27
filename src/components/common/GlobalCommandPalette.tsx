import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Sparkles,
  Target,
  Briefcase,
  Layers,
  GraduationCap,
  Building2,
  BookOpenCheck,
  Landmark,
  Compass,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Settings,
  X,
  Command,
  CornerDownLeft
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Navigation' | 'Skills' | 'Opportunities' | 'AI Intelligence' | 'Actions';
  icon: React.ComponentType<{ className?: string }>;
  roleRequirement?: 'student' | 'industry' | 'academician' | 'institution';
  action: () => void;
}

interface GlobalCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalCommandPalette: React.FC<GlobalCommandPaletteProps> = ({ isOpen, onClose }) => {
  const { currentRole, isDemo } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const allItems: CommandItem[] = useMemo(() => [
    // Core Role Navigation
    {
      id: 'nav-dashboard',
      title: 'Active Workspace Dashboard',
      subtitle: `Return to your ${currentRole} command center`,
      category: 'Navigation',
      icon: currentRole === 'student' ? GraduationCap : currentRole === 'industry' ? Building2 : currentRole === 'academician' ? BookOpenCheck : Landmark,
      action: () => navigate(`/dashboard/${currentRole}`)
    },
    {
      id: 'ai-copilot',
      title: 'Launch Setu Copilot AI Assistant',
      subtitle: 'Ask AI questions regarding skills, roadmap, industry benchmarks',
      category: 'AI Intelligence',
      icon: Sparkles,
      action: () => {
        window.dispatchEvent(new CustomEvent('open-setu-copilot'));
      }
    },
    // Student Actions
    {
      id: 'student-skill-dna',
      title: 'Skill DNA & Competency Matrix',
      subtitle: 'Analyze multi-dimensional strengths and gap vectors',
      category: 'Skills',
      roleRequirement: 'student',
      icon: Target,
      action: () => navigate('/dashboard/student')
    },
    {
      id: 'student-assessment',
      title: 'Assessment Center (AI Proctored)',
      subtitle: 'Verify skills in Python, DSA, System Design, and Cloud',
      category: 'Actions',
      roleRequirement: 'student',
      icon: Award,
      action: () => navigate('/dashboard/student')
    },
    {
      id: 'student-opps',
      title: 'Internship & Opportunity Marketplace',
      subtitle: 'Explore 48+ verified industry internships and summer tracks',
      category: 'Opportunities',
      roleRequirement: 'student',
      icon: Briefcase,
      action: () => navigate('/dashboard/student')
    },
    // Industry Actions
    {
      id: 'industry-candidates',
      title: 'Talent Discovery & Candidate Match',
      subtitle: 'Search pre-vetted students with Skill DNA compatibility',
      category: 'Actions',
      roleRequirement: 'industry',
      icon: Users,
      action: () => navigate('/dashboard/industry')
    },
    {
      id: 'industry-post',
      title: 'Post New Industry Opportunity',
      subtitle: 'Create micro-internship, mentorship track, or project challenge',
      category: 'Actions',
      roleRequirement: 'industry',
      icon: Briefcase,
      action: () => navigate('/dashboard/industry')
    },
    // Academician Actions
    {
      id: 'academic-students',
      title: 'Student Cohort Skill Intelligence',
      subtitle: 'Identify student skill gaps and monitor intervention outcomes',
      category: 'Skills',
      roleRequirement: 'academician',
      icon: GraduationCap,
      action: () => navigate('/dashboard/academician')
    },
    {
      id: 'academic-collab',
      title: 'Faculty-Industry Collaboration Marketplace',
      subtitle: 'Browse sponsored research, guest lectures, and curriculum co-design',
      category: 'Opportunities',
      roleRequirement: 'academician',
      icon: BookOpenCheck,
      action: () => navigate('/dashboard/academician')
    },
    // Institution Actions
    {
      id: 'inst-overview',
      title: 'Executive Placement Readiness & NAAC Analytics',
      subtitle: 'Monitor departmental employability ratios and curriculum alignment',
      category: 'Navigation',
      roleRequirement: 'institution',
      icon: Landmark,
      action: () => navigate('/dashboard/institution')
    },
    {
      id: 'inst-reports',
      title: 'Institutional Audit & Accreditation Reports',
      subtitle: 'Export NIRF, NBA, and AICTE compliance packets',
      category: 'Actions',
      roleRequirement: 'institution',
      icon: TrendingUp,
      action: () => navigate('/dashboard/institution')
    },
    // Universal Settings
    {
      id: 'settings',
      title: 'Settings & Security Preferences',
      subtitle: 'Manage profile information and connected integrations',
      category: 'Navigation',
      icon: Settings,
      action: () => navigate(`/dashboard/${currentRole}/settings`)
    }
  ], [currentRole, navigate]);

  // Filter items based on query & active role relevance
  const filteredItems = useMemo(() => {
    const roleFiltered = allItems.filter(item => 
      !item.roleRequirement || item.roleRequirement === currentRole
    );

    if (!query.trim()) return roleFiltered;

    const lower = query.toLowerCase();
    return roleFiltered.filter(item =>
      item.title.toLowerCase().includes(lower) ||
      item.subtitle.toLowerCase().includes(lower) ||
      item.category.toLowerCase().includes(lower)
    );
  }, [allItems, currentRole, query]);

  // Key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200/80 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, skill, role, or action..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-1 flex-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs sm:text-sm">
              <Search className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">No matching commands found</p>
              <p className="text-slate-400 text-xs mt-1">Try searching for "Assessment", "Skills", "Internship", or "Copilot"</p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-950 dark:text-indigo-100'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold truncate text-slate-900 dark:text-slate-100">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {item.category}
                    </span>
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono">↵</kbd>
              Select
            </span>
          </div>
          <span className="text-slate-400">SkillSetu Command Intelligence</span>
        </div>
      </div>
    </div>
  );
};
