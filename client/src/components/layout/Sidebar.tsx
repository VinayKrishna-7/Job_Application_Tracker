import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';
import {
  LayoutDashboard,
  Briefcase,
  Kanban,
  CalendarCheck,
  User,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  onLinkClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, onLinkClick }) => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Applications', path: '/applications', icon: Briefcase },
    { label: 'Kanban Board', path: '/board', icon: Kanban },
    { label: 'Interviews', path: '/interviews', icon: CalendarCheck },
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'flex flex-col justify-between w-64 border-r border-gray-200/80 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 transition-colors',
        className
      )}
    >
      <div className="space-y-6">
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Overview
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onLinkClick}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all',
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-200'
                    )
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3.5 dark:border-indigo-900/40 dark:bg-indigo-950/30">
        <div className="flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
              Pro Tip
            </p>
            <p className="text-[11px] text-indigo-700/80 dark:text-indigo-400 mt-0.5 leading-snug">
              Drag cards across columns in Kanban to instantly update application stages.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
