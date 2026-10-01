import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import {
  Briefcase,
  Kanban,
  LineChart,
  CalendarCheck,
  Bell,
  FileText,
  ArrowRight,
  ShieldCheck,
  Sun,
  Moon,
  LogIn,
  UserPlus,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 selection:bg-indigo-500 selection:text-white transition-colors">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-gray-100 dark:border-gray-900 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
              EasyTrack
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="sm">Go to Dashboard</Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 leading-[1.15]">
            Track every application.{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
              Land your next opportunity.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Stop losing job applications in messy spreadsheets. EasyTrack gives you a visual Kanban board,
            interview timeline, intelligent follow-up reminders, and analytics in one unified platform.
          </p>

          {isAuthenticated ? (
            <div className="flex items-center justify-center pt-4">
              <Link to="/dashboard">
                <Button size="lg" className="shadow-lg shadow-indigo-600/25">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-indigo-600/25 min-w-[160px]">
                  <LogIn className="w-4 h-4 mr-2" />
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[160px]">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Account
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/40 border-y border-gray-100 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
              Everything you need to master your job hunt
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Engineered with production-grade tools so you can focus on acing your technical interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Kanban className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
                Visual Kanban Board
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Drag applications seamlessly across columns: from Wishlist, Applied, Screening, and Interview rounds to Offers.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 flex items-center justify-center text-violet-600 dark:text-violet-400">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
                Multi-Round Interview Timeline
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Log behavioral, system design, and coding rounds with interviewer details, meeting links, and prep notes.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <LineChart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
                Real-Time Analytics
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Understand your response rates, interview conversion, and application cadence with interactive charts.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
                Follow-up Tracking
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Never ghost a recruiter. Group follow-ups into Overdue, Due Today, and Upcoming so you stay top-of-mind.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
                Resume Management
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Attach tailored resumes (PDF, DOCX) directly to applications with abstract storage and Cloudinary support.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
                Enterprise Multi-Tenancy
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                HTTP-only secure cookies, strict authorization per-user, and complete data isolation guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
            How EasyTrack Works
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-14">
            A simple, predictable 4-step workflow from discovery to offer letter.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 relative">
              <div className="text-3xl font-black text-indigo-500/30 mb-2">01</div>
              <h4 className="font-bold text-sm mb-1">Add Application</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Enter company, role, salary range, and job link in seconds.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 relative">
              <div className="text-3xl font-black text-indigo-500/30 mb-2">02</div>
              <h4 className="font-bold text-sm mb-1">Track Progress</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Move cards along your Kanban board as recruiters respond.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 relative">
              <div className="text-3xl font-black text-indigo-500/30 mb-2">03</div>
              <h4 className="font-bold text-sm mb-1">Prepare & Interview</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Schedule rounds, store questions, and review meeting links.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 relative">
              <div className="text-3xl font-black text-indigo-500/30 mb-2">04</div>
              <h4 className="font-bold text-sm mb-1">Land the Offer</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Compare multiple offers and negotiate with clear visibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 bg-indigo-600 dark:bg-indigo-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to organize your career search?
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 max-w-xl mx-auto">
            Join thousands of developers and professionals tracking applications with EasyTrack.
          </p>
          <div className="pt-2">
            <Link to="/register">
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-gray-100 shadow-xl">
                Create Free Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
