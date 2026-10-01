import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import {
  Briefcase,
  Sun,
  Moon,
  Plus,
  User,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200/80 bg-white/90 px-4 md:px-6 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/90 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
            EasyTrack
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-4">
        <Button
          size="sm"
          onClick={() => navigate('/applications/new')}
          className="hidden sm:inline-flex shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          New Application
        </Button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle color theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 font-bold text-xs text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200/80 bg-white py-1.5 shadow-xl dark:border-gray-800 dark:bg-gray-900 animate-in fade-in zoom-in-95 duration-100 z-50">
              <div className="px-3.5 py-2 border-b border-gray-100 dark:border-gray-800">
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {user?.name}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/60"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  Your Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/60"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  Settings
                </Link>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
