import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../data/mockData';
import { ThemeToggle } from '../common/ThemeToggle';
import { RoleBadge } from '../common/RoleBadge';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Menu,
  Search,
  Bell,
  Check,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ExternalLink,
  Layers,
  Sparkles,
  Command
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
  onOpenRoleModal?: () => void;
  onOpenSearchModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  onOpenRoleModal,
  onOpenSearchModal
}) => {
  const { currentRole, user, logout } = useAuth();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'New AI Skill Assessment Ready',
      time: '10m ago',
      unread: true,
      category: 'Intelligence'
    },
    {
      id: 2,
      title: 'NovaCore reviewed your project milestone',
      time: '1h ago',
      unread: true,
      category: 'Industry'
    },
    {
      id: 3,
      title: 'System update v2.4 successfully applied',
      time: '1d ago',
      unread: false,
      category: 'Platform'
    }
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6">
      {/* Left section: Hamburger & Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search trigger */}
        <button
          onClick={onOpenSearchModal}
          className="w-full max-w-md hidden sm:flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all text-sm group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            <span className="text-slate-500 dark:text-slate-400">Search projects, skills, mentors...</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right section: Role badge, notifications, theme toggle, profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Setu Copilot AI Trigger */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-setu-copilot'))}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-50 to-sky-50 dark:from-indigo-950/60 dark:to-sky-950/40 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all text-xs font-semibold shadow-2xs group cursor-pointer"
          title="Open Setu Copilot Assistant (⌘J)"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Setu Copilot</span>
          <span className="text-[10px] px-1 py-0.2 rounded bg-indigo-200/50 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 font-mono hidden md:inline">
            ⌘J
          </span>
        </button>

        {/* Quick Role Switcher Button */}
        <button
          onClick={onOpenRoleModal}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all"
        >
          <RoleBadge role={currentRole} size="sm" />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Switch Role</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">Notifications</span>
                  <Badge variant="primary" size="sm">2 New</Badge>
                </div>
                <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                  Mark all read
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 my-1 max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                      item.unread ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs font-medium text-slate-900 dark:text-slate-100">
                        {item.title}
                      </div>
                      {item.unread && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <button className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  View all system activity
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
          >
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <span className="hidden md:block text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-28 truncate">
              {user.name.split(' ')[0]}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                  {user.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </div>
                <div className="mt-2">
                  <RoleBadge role={currentRole} size="sm" />
                </div>
              </div>

              <div className="py-1 space-y-0.5 text-sm">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/roles');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Layers className="w-4 h-4 text-slate-400" />
                  <span>Switch Role</span>
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate(`/dashboard/${currentRole}/settings`);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Account Settings</span>
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                  <span>Landing Portal</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
