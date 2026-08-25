import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../data/mockData';
import { UserRole } from '../../types';
import { DynamicIcon } from '../common/IconRenderer';
import { Check, Search, Sparkles, ArrowRight } from 'lucide-react';
import { SetuCopilotWidget } from '../copilot/SetuCopilotWidget';

export const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { currentRole, setRole } = useAuth();
  const navigate = useNavigate();

  const handleSelectRole = (role: UserRole) => {
    setRole(role);
    setIsRoleModalOpen(false);
    navigate(`/dashboard/${role}`);
  };

  const roleList: UserRole[] = ['student', 'industry', 'academician', 'institution'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Navbar
          onToggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)}
          onOpenRoleModal={() => setIsRoleModalOpen(true)}
          onOpenSearchModal={() => setIsSearchModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Role Switcher Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        size="lg"
        title="Switch Workspace Persona"
        description="Select a role to preview its dedicated workspace, specialized toolsets, and analytics."
        footer={
          <Button variant="outline" size="sm" onClick={() => setIsRoleModalOpen(false)}>
            Cancel
          </Button>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
          {roleList.map((roleKey) => {
            const r = ROLES[roleKey];
            const isSelected = currentRole === roleKey;
            return (
              <div
                key={roleKey}
                onClick={() => handleSelectRole(roleKey)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${r.color.light}`}>
                      <DynamicIcon name={r.iconName} className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    {r.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {r.subtitle}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">
                    {r.badge}
                  </span>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                    Select <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>

      {/* Global Search Command Palette Modal */}
      <Modal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        size="lg"
        title="Command & Search"
        description="Quickly navigate across skills, projects, institutions, and cohorts."
      >
        <div className="space-y-4 py-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type to search anything in SkillSetu AI..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
          </div>

          <div className="space-y-2 text-xs">
            <div className="text-slate-400 uppercase font-semibold tracking-wider px-1">
              Quick Shortcuts
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsSearchModalOpen(false);
                  navigate('/roles');
                }}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200">Role Selection</div>
                <div className="text-slate-500">View all 4 enterprise persona hubs</div>
              </button>
              <button
                onClick={() => {
                  setIsSearchModalOpen(false);
                  navigate('/login');
                }}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="font-semibold text-slate-800 dark:text-slate-200">Authentication</div>
                <div className="text-slate-500">Sign-in & SSO credentials</div>
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {/* Global AI Assistant Widget */}
      <SetuCopilotWidget />
    </div>
  );
};
