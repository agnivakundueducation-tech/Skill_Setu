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
  onOpenSearchModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
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

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New AI Skill Assessment Ready',
      description: 'Your Python & Data Structures assessment has been calibrated.',
      time: '10m ago',
      unread: true,
      category: 'Intelligence',
      actionTab: 'assessment'
    },
    {
      id: 2,
      title: 'NovaCore reviewed your project milestone',
      description: 'Reviewer gave 95/100 score and added 2 code improvement notes.',
      time: '1h ago',
      unread: true,
      category: 'Industry',
      actionTab: 'opportunities'
    },
    {
      id: 3,
      title: 'System update v2.4 successfully applied',
      description: 'SIH 2026 Engine & Skill DNA v2 algorithm active.',
      time: '1d ago',
      unread: false,
      category: 'Platform'
    }
  ]);
  const [selectedNotifFilter, setSelectedNotifFilter] = useState<'All' | 'Intelligence' | 'Industry' | 'Platform'>('All');

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markOneRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? ({ ...n, unread: false }) : n));
  };

  const filteredNotifs = notifications.filter(
    n => selectedNotifFilter === 'All' || n.category === selectedNotifFilter
  );

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

        {/* Verified Role Status Indicator (Read-Only) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
          <RoleBadge role={currentRole} size="sm" />
          <span className="text-[11px] font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase">
            Workspace
          </span>
        </div>

        {/* Theme Toggle */}
        {/* <ThemeToggle /> */}

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-92 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">Notifications</span>
                  {unreadCount > 0 ? (
                    <Badge variant="primary" size="sm">{unreadCount} New</Badge>
                  ) : (
                    <Badge variant="emerald" size="sm">All Read</Badge>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 px-2 py-2 border-b border-slate-100 dark:border-slate-800/80 overflow-x-auto">
                {(['All', 'Intelligence', 'Industry', 'Platform'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedNotifFilter(cat)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors shrink-0 cursor-pointer ${
                      selectedNotifFilter === cat
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 my-1 max-h-72 overflow-y-auto">
                {filteredNotifs.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    No notifications in this category
                  </div>
                ) : (
                  filteredNotifs.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => markOneRead(item.id)}
                      className={`p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                        item.unread ? 'bg-indigo-50/50 dark:bg-indigo-950/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {item.title}
                        </div>
                        {item.unread && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {item.description}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{item.category}</span>
                        <span>•</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <button
                  onClick={() => setIsNotifOpen(false)}
                  className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                >
                  Close notifications
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
