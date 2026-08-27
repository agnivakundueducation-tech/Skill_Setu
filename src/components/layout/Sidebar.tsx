import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_NAV_ITEMS, ROLES } from '../../data/mockData';
import { DynamicIcon } from '../common/IconRenderer';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
  HelpCircle,
  X
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { currentRole, user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = ROLE_NAV_ITEMS[currentRole] || ROLE_NAV_ITEMS.student;
  const currentRoleInfo = ROLES[currentRole];

  const roleActiveBg: Record<string, string> = {
    student: 'bg-indigo-600 shadow-indigo-600/20 text-white',
    industry: 'bg-emerald-600 shadow-emerald-600/20 text-white',
    academician: 'bg-sky-600 shadow-sky-600/20 text-white',
    institution: 'bg-amber-600 shadow-amber-600/20 text-white'
  };
  const activeClass = roleActiveBg[currentRole] || roleActiveBg.student;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
          <NavLink to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 dark:text-white tracking-tight text-base flex items-center gap-1.5">
                  SkillSetu <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">AI</span>
                </span>
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 truncate">
                  Enterprise Platform
                </span>
              </div>
            )}
          </NavLink>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Current Active Role Indicator (Read-Only Status) */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800/80">
          <div
            className={`w-full flex items-center justify-between p-2.5 rounded-xl border select-none ${
              isCollapsed ? 'justify-center' : ''
            } ${currentRoleInfo.color.light} ${currentRoleInfo.color.border}`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-white/80 dark:bg-slate-900/80 flex items-center justify-center shrink-0 shadow-xs">
                <DynamicIcon name={currentRoleInfo.iconName} className="w-4 h-4 text-current" />
              </div>
              {!isCollapsed && (
                <div className="truncate">
                  <div className="text-xs font-semibold truncate leading-tight">
                    {currentRoleInfo.title}
                  </div>
                  <div className="text-[10px] opacity-75 truncate">
                    {currentRoleInfo.badge}
                  </div>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <span className="text-[10px] uppercase tracking-wider font-semibold opacity-60 px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">
                Active
              </span>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {!isCollapsed && (
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Navigation
            </div>
          )}
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === `/dashboard/${currentRole}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? `${activeClass} font-semibold shadow-xs`
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
              title={isCollapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <DynamicIcon
                    name={item.icon}
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate flex-1">{item.label}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* User & Footer Actions */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
          {!isCollapsed && user.completionRate && (
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
                <span>Profile Readiness</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {user.completionRate}%
                </span>
              </div>
              <ProgressBar
                value={user.completionRate}
                size="sm"
                color="indigo"
                showValue={false}
              />
            </div>
          )}

          {/* User Profile Mini Bar */}
          <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
              />
              {!isCollapsed && (
                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {user.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {user.email}
                  </div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
